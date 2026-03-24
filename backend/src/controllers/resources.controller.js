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
 
export async function handleGetAllResources(req, res){
    try {
        const filters = {
            subject: req.query.subject,
            department: req.query.department
        };
        const resources = await resourcesService.getAllResources(filters);
        res.status(200).json({
            message: "Resources fetched successfully",
            resources
        });
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
}
                
export async function handleGetDepartmentResources(req, res){
    try {
        const department = req.body?.department;

        if (!department) {
            return res.status(400).json({ message: "Department query parameter is required" });
        }

        const filters = {
            department: department
        };
        const resources = await resourcesService.getDepartmentResources(filters);
        res.status(200).json({
            message: "Resources fetched successfully",
            resources
        });
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
}
