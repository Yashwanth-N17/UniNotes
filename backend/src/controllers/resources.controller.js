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