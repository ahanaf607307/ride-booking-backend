import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinaryUpload";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      const original = file.originalname;

      // 1 Extract extension
      const ext = original.split(".").pop()?.toLowerCase() || "png";

      // 2 Remove extension part
      const base = original.substring(0, original.lastIndexOf(".")) || original;

      // 3 Clean base name
      const cleanedBase = base
        .toLowerCase()
        .replace(/\s+/g, "-") // spaces -> dashes
        .replace(/[^-a-z0-9]/g, "") // remove invalid chars
        .replace(/-+/g, "-") // compress --- to -
        .replace(/^-|-$/g, ""); // trim - at start/end

      // 4️⃣ Generate unique filename
      const uniqueFileName = `${Math.random()
        .toString(36)
        .substring(2)}-${Date.now()}-${cleanedBase}.${ext}`;

      return uniqueFileName;
    },
  },
});

export const multerUpload = multer({ storage });
