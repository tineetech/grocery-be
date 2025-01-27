import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "path";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Local storage for temporary file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Configure multer upload for products
const uploadProduct = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".webp"
    ) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

// Configure multer upload for avatars
const uploadAvatar = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".webp"
    ) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

// Upload to Cloudinary function
const uploadToCloudinary = async (
  filePath: string,
  folder: string,
  transformation?: any
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      transformation: transformation || [
        { width: 1000, height: 1000, crop: "limit" },
      ],
    });
    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

// Helper function to delete image from cloudinary
const deleteFromCloudinary = async (url: string, folder: string) => {
  try {
    const publicId = url.split("/").slice(-1)[0].split(".")[0];
    await cloudinary.uploader.destroy(`${folder}/${publicId}`);
    return true;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return false;
  }
};

export {
  cloudinary,
  uploadProduct,
  uploadAvatar,
  uploadToCloudinary,
  deleteFromCloudinary,
};
