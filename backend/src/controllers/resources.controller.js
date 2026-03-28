import * as resourcesService from "../services/resources.service.js";

export async function handleUploadResource(req, res){
    try{
        const resource = await resourcesService.uploadResource(req.body,req.file, req);
        res.status(201).json({
            message: "Resource uploaded successfully",
            resource
        });
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
}

export async function handleGetUserResources(req, res){
    try {
        const resources = await resourcesService.getUserResources(req);
        res.status(200).json({
            message: "Resources fetched successfully",
            resources
        });
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
}
 
export async function handleGetResources(req, res) {
  try {
    const { department, semester, type, subject } = req.query;

    const filters = {
      department,
      semester,
      type,
      subject,
    };

    const resources = await resourcesService.getResources(filters);

    return res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });

  } catch (error) {
    console.error("Error in handleGetResources:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resources",
    });
  }
}
                

