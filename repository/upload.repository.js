import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ✅ CREATE Photo
const createPhoto = async (title, description, imageUrl) => {
  return await prisma.photo.create({
    data: {
      title: title,
      description: description,
      imageUrl: imageUrl,
    },
  });
};

// 📜 READ All Photos
const getAllPhotos = async () => {
  return await prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
  });
};

// 🔍 READ Single Photo
const getPhotoById = async (id) => {
  return await prisma.photo.findUnique({
     where: { id } 
    });
};

// ✏️ UPDATE Photo
const updatePhoto = async (id, title, description, imageUrl) => {
  return await prisma.photo.update({
    where: { id },
    data: {
        title: title,
        description: description,
        imageUrl: imageUrl,
    },
  });
};    

// ❌ DELETE Photo
const deletePhoto = async (id) => {
  return await prisma.photo.delete({
    where: { id },
  });
};

export { createPhoto, getAllPhotos, getPhotoById, updatePhoto, deletePhoto };
