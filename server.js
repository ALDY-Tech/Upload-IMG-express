import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware JSON
app.use(express.json());
app.use(cors());

// Serve static files dari folder uploads
app.use("/uploads", express.static("uploads"));

// Pastikan folder uploads ada
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Konfigurasi multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ CREATE Photo
app.post("/photos", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    const photo = await prisma.photo.create({
      data: { title, description, imageUrl },
    });

    res.json(photo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload photo" });
  }
});

// 📜 READ All Photos
app.get("/photos", async (req, res) => {
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(photos);
});

// 🔍 READ Single Photo
app.get("/photos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const photo = await prisma.photo.findUnique({ where: { id } });
  if (!photo) return res.status(404).json({ error: "Photo not found" });
  res.json(photo);
});

// ✏️ UPDATE Photo
app.put("/photos/:id", upload.single("image"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description } = req.body;

    const existing = await prisma.photo.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Photo not found" });

    let imageUrl = existing.imageUrl;
    if (req.file) {
      // Hapus gambar lama
      fs.unlinkSync(`.${existing.imageUrl}`);
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await prisma.photo.update({
      where: { id },
      data: { title, description, imageUrl },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update photo" });
  }
});

// ❌ DELETE Photo
app.delete("/photos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) return res.status(404).json({ error: "Photo not found" });

    // Hapus file dari server
    fs.unlinkSync(`.${photo.imageUrl}`);

    await prisma.photo.delete({ where: { id } });
    res.json({ message: "Photo deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete photo" });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
