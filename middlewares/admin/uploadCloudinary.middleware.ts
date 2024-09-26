import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
// End cloudinary

// Define the Cloudinary upload result type
interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

let streamUpload = (buffer: any): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (result) {
          resolve(result as CloudinaryUploadResult);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadToCloudinary = async (buffer: any): Promise<string> => {
  const result = await streamUpload(buffer);
  return result.url;
};

// Upload function
export const uploadSinger = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if file exists and contains buffer
    if (req.file && req.file.buffer) {
      const result = await uploadToCloudinary(req.file.buffer);
      req.body[req.file.fieldname] = result;
    } else {
      throw new Error("File is missing or invalid");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error uploading file", error });
  }

  next();
};

export const uploadFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Kiểm tra req.files là một đối tượng chứa các tệp
  if (req.files && typeof req.files === 'object' && !Array.isArray(req.files)) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // Ép kiểu rõ ràng

    for (const key in files) {
      req.body[key] = [];

      const array = files[key];
      for (const item of array) {
        try {
          const result = await uploadToCloudinary(item.buffer);
          req.body[key].push(result);
        } catch (error) {
          console.log(error);
        }
      }
    }
  } else {
    return res.status(400).json({ message: "No files found for upload" });
  }

  next();
};
