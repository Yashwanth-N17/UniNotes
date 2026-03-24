import { prisma } from "../config/db.js";
import { v2 as cloudinary } from "cloudinary";
import "../config/cloudinary.js";

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

export async function getAllResources(filters = {}) {
  try {

    const whereClause = {};

    if (filters.subject) {
      whereClause.subject = { equals: filters.subject, mode: "insensitive" };
    }


    if (filters.department) {
      whereClause.department = {
        equals: filters.department,
        mode: "insensitive",
      };
    }

    if (filters.semester) {
      whereClause.semester = parseInt(filters.semester);
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
    console.log("Error in getAllResources Service", error);
    throw error;
  }
}

export async function getDepartmentResources(filters = {}) {
  try {
    const whereClause = {};

    if (filters.department) {
      whereClause.department = {
        equals: filters.department,
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
    console.log("Error in getDepartmentResources Service", error);
    throw error;
  }
}
