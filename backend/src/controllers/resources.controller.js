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
    const { department, semester, type, subject, search } = req.query;

    const filters = {
      department,
      semester,
      type,
      subject,
      search,
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

export async function handleGetResourceById(req, res) {
  try {
    const { id } = req.params;
    const resource = await resourcesService.getResourceById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: resource,
    });

  } catch (error) {
    console.error("Error in handleGetResourceById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resource",
    });
  }
}

export async function handleDeleteResource(req, res){
  try{
    const { id } = req.params;
    const resource = await resourcesService.deleteResource(id, req);
    res.status(200).json({
      message: "Resource deleted successfully",
      resource
    });
  }
  catch(error){
    res.status(400).json({ message: error.message });
  }
}

export async function handleDownloadResource(req, res){
  try{
    const { id } = req.params;
    const resource = await resourcesService.downloadResource(id, req);
    res.status(200).json({
      message: "Resource downloaded successfully",
      resource
    });
  }
  catch(error){
    res.status(400).json({ message: error.message });
  }
}