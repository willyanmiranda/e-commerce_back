const { Image } = require('../db/db');
const cloudinary = require('cloudinary');

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

async function createImage(request, response) {
  try {
      const { image, productID } = request.body;

      const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "products", 
      });

      const newImage = await Image.create({
          productID,
          image: uploadResponse.secure_url, 
      });

      return response.status(201).json(newImage);
  } catch (error) {
      console.error("Error creating image:", error);
      return response.status(500).json({ error: "Error creating image" });
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
