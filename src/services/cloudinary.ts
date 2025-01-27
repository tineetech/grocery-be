import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Product Image 
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "product_image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

// Configure User Avatar 
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_avatar",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 400, height: 400, crop: "fill", gravity: "face" },
    ],
  },
});

// Configure multer upload for products
const uploadProduct = multer({
  storage: productStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Configure multer upload for avatars
const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
});

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

export { cloudinary, uploadProduct, uploadAvatar, deleteFromCloudinary };
