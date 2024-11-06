const { Category } = require("../db/db"); // Certifique-se de que o caminho esteja correto para o arquivo onde os modelos Sequelize foram definidos.

async function createCategory(request, response) {
  try {
    const { name } = request.body;
    const category = await Category.create({
      name,
    });
    return response.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return response.status(500).json({ error: "Error creating category" });
  }
}

async function updateCategory(request, response) {
  try {
    const { id } = request.params;
    const { name } = request.body;

    const existingCategory = await Category.findByPk(id);

    if (!existingCategory) {
      return response.status(404).json({ error: "Category not found" });
    }

    const updatedCategory = await existingCategory.update({ name });

    return response.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return response.status(500).json({ error: "Error updating category" });
  }
}

async function deleteCategory(request, response) {
  try {
    const { id } = request.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return response.status(404).json({ error: "Category not found" });
    }

    await category.destroy();
    return response.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    return response.status(500).json({ error: "Error deleting category" });
  }
}

async function getCategory(request, response) {
  try {
    const { id } = request.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return response.status(404).json({ error: "Category not found" });
    }

    return response.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return response.status(500).json({ error: "Error fetching category" });
  }
}

async function getAllCategories(request, response) {
  try {
    const categories = await Category.findAll();
    return response.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return response.status(500).json({ error: "Error fetching categories" });
  }
}

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
};
