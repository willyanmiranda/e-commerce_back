const { Image } = require('../db/db');
const cloudinary = require('cloudinary');
const DatauriParser = require("datauri/parser");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function getSingleProductImages(request, response) {
  try {
    const { id } = request.params;
    const images = await Image.findAll({
      where: { productID: id },
    });

    if (!images || images.length === 0) {
      return response.status(404).json({ error: "Images not found" });
    }
    return response.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return response.status(500).json({ error: "Error fetching images" });
  }
}

const path = require("path");

const parser = new DatauriParser();

async function createImage(request, response) {
  console.log("File:", request.file);  
  console.log("Body:", request.body); 

  try {
    const { productID } = request.body;
    const file = request.file;

    if (!file) {
      return response.status(400).json({ error: "Arquivo não enviado" });
    }

    const extName = path.extname(file.originalname).toString(); 
    const file64 = parser.format(extName, file.buffer); 

    const uploadResponse = await cloudinary.uploader.upload(file64.content, {
      folder: "products", 
    });

    const newImage = await Image.create({
      productID,
      image: uploadResponse.secure_url,
    });

    return response.status(201).json(newImage);
  } catch (error) {
    console.error("Erro ao criar a imagem:", error);
    return response.status(500).json({ error: "Erro ao criar a imagem" });
  }
}

async function updateImage(request, response) {
  try {
    const { id } = request.params; // ID do produto
    const { productID, image } = request.body;

    const existingImage = await Image.findOne({
      where: { productID: id },
    });

    if (!existingImage) {
      return response.status(404).json({ error: "Image not found for the provided productID" });
    }

    const updatedImage = await existingImage.update({
      productID: productID || existingImage.productID,
      image: image || existingImage.image,
    });

    return response.json(updatedImage);
  } catch (error) {
    console.error("Error updating image:", error);
    return response.status(500).json({ error: "Error updating image" });
  }
}

async function deleteImage(request, response) {
  try {
    const { id } = request.params;
    const result = await Image.destroy({
      where: { productID: id },
    });

    if (result === 0) {
      return response.status(404).json({ error: "No images found to delete" });
    }

    return response.status(204).send();
  } catch (error) {
    console.error("Error deleting image:", error);
    return response.status(500).json({ error: "Error deleting image" });
  }
}

module.exports = {
  getSingleProductImages,
  createImage,
  updateImage,
  deleteImage,
};
