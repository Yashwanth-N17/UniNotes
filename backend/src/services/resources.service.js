import { prisma } from "../config/db.js";
import { v2 as cloudinary } from "cloudinary";
import "../config/cloudinary.js";
import axios from "axios";

export async function uploadResource(data, file, req) {
  try {
    const { title, subject, resourceType, description, department, semester } = data;

    if (!title || !subject || !resourceType || !description || !department || !semester) {
      throw new Error("All fields except file are required");
    }

    if (!file) {
      throw new Error("File is required or unsupported file type!");
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "resources",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(file.buffer);
    });

    const resource = await prisma.resources.create({
      data: {
        title: title.trim(),
        subject: subject.trim(),
        resourceType: resourceType.trim(),
        description: description.trim(),
        fileLink: uploadResult.secure_url,
        userId: req.user.id,
        department: department.trim(),
        semester: parseInt(semester, 10),
        fileSize: uploadResult.bytes || 0,
        pageCount: uploadResult.pages || null,
      },
    });
    return resource;
  } catch (error) {
    console.log("Error in upload Resources Service", error);
    throw error;
  }
}

export async function getUserResources(req) {
  try {
    const resources = await prisma.resources.findMany({
      where: {
        userId: req.user.id,
      },
    });
    return resources;
  } catch (error) {
    console.log("Error in getUserResources Service", error);
    throw error;
  }
}

export async function getResources(filters = {}) {
  try {
    const whereClause = {};

    if (filters.subject) {
      whereClause.subject = {
        equals: filters.subject,
        mode: "insensitive",
      };
    }

    if (filters.search) {
      whereClause.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { subject: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.department && filters.department !== "all") {
      whereClause.department = {
        equals: filters.department,
        mode: "insensitive",
      };
    }

    if (filters.semester && filters.semester !== "all") {
      whereClause.semester = parseInt(filters.semester);
    }

    if (filters.type && filters.type !== "all") {
      whereClause.resourceType = {
        equals: filters.type,
        mode: "insensitive",
      };
    }

    const resources = await prisma.resources.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            fullname: true,
            university: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return resources;

  } catch (error) {
    console.log("Error in getResources Service", error);
    throw error;
  }
}

export async function getResourceById(id) {
  try {
    if (!id || id === 'undefined') return null;
    
    const resource = await prisma.resources.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            fullname: true,
            university: true,
            email: true,
          },
        },
      },
    });

    return resource;
  } catch (error) {
    console.log("Error in getResourceById Service", error);
    throw error;
  }
}

export async function deleteResource(id, req){
  try{
    if(!id){
      throw new Error("Resource ID is required");
    }
    const resource = await prisma.resources.findUnique({
      where: { id },
    });
    if(!resource){
      throw new Error("Resource not found");
    }
    if(resource.userId !== req.user.id){
      throw new Error("You are not authorized to delete this resource");
    }
    await prisma.resources.delete({
      where: { id },
    });
    return resource;
  }
  catch(error){
    console.log("Error in deleteResource Service", error);
    throw error;
  }
}

export async function downloadResource(id, req){
  try{
    if(!id){
      throw new Error("Resource ID is required");
    }

    const resource = await prisma.resources.findUnique({
      where: { id },
    });
    if(!resource){
      throw new Error("Resource not found");
    }

    const userId = req.user.id;
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLog = await prisma.downloadLog.findFirst({
      where: {
        userId,
        resourceId: id,
        createdAt: { gte: since },
      },
    });

    const isFirstDownload = !recentLog;

    if (isFirstDownload) {
      await prisma.resources.update({
        where: { id },
        data: { downloads: { increment: 1 } },
      });
    }

    await prisma.downloadLog.create({
      data: {
        userId,
        resourceId: id,
        ip:        req.ip || null,
        userAgent: req.headers["user-agent"] || null,
      },
    });

    const fileUrl = resource.fileLink;
    let downloadUrl = fileUrl;

    if (fileUrl.includes("cloudinary.com")) {
      try {
        const urlParts = fileUrl.split("/");
        const uploadIndex = urlParts.indexOf("upload");
        const privateIndex = urlParts.indexOf("private");
        const authenticatedIndex = urlParts.indexOf("authenticated");
        const typeIndex = uploadIndex !== -1 ? uploadIndex : (privateIndex !== -1 ? privateIndex : authenticatedIndex);
        
        const resourceType = urlParts[typeIndex - 1] || "image";
        const afterType = urlParts.slice(typeIndex + 1).join("/"); 
        const withoutVersion = afterType.replace(/^v\d+\//, "");   
        const extension = withoutVersion.split(".").pop();   
        const publicId = withoutVersion.replace(new RegExp(`\\.${extension}$`), ""); 

        const resourceInfo = await cloudinary.api.resource(publicId, {
          resource_type: resourceType,
        });
        downloadUrl = cloudinary.utils.private_download_url(resourceInfo.public_id, resourceInfo.format || "pdf", {
          resource_type: resourceInfo.resource_type,
          type: resourceInfo.type,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          attachment: true,
        });

        console.log("Generated Secure Download Link via API:", downloadUrl);
      } catch (err) {
        console.error("Cloudinary Security Layer Error:", err.message);
      }
    }

    const axiosResponse = await axios.get(downloadUrl, {
      responseType: "stream",
      maxRedirects: 10,
    });

    const respContentType = axiosResponse.headers["content-type"] || "";
    if (respContentType.includes("text/html") || respContentType.includes("application/json")) {
       console.error("Cloudinary returned an error page/JSON instead of a file:", respContentType);
       throw new Error("Storage server returned an error instead of the file. Please check permissions.");
    }

    const urlPath     = new URL(fileUrl).pathname;
    const rawFilename = urlPath.split("/").pop() || `resource-${id}.pdf`;
    const ext         = rawFilename.includes(".") ? rawFilename.split(".").pop() : "pdf";
    const safeTitle   = resource.title.replace(/[^a-zA-Z0-9_\-. ]/g, "_").trim();
    const filename    = `${safeTitle}.${ext}`;

    const contentType   = axiosResponse.headers["content-type"]   || "application/octet-stream";
    const contentLength = axiosResponse.headers["content-length"] || null;

    return { stream: axiosResponse.data, filename, contentType, contentLength, isFirstDownload };
  }
  catch(error){
    console.error("Download Error Details (Service):", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
}