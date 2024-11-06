const { Product, Category, CustomerOrderProduct } = require("../db/db"); // Assumindo que os modelos estão definidos em models

async function getAllProducts(request, response) {
  const mode = request.query.mode || "";

  if (mode === "admin") {
    try {
      const adminProducts = await Product.findAll();
      return response.json(adminProducts);
    } catch (error) {
      return response.status(500).json({ error: "Error fetching products" });
    }
  }

  try {
    const page = Number(request.query.page) || 1;
    const sortBy = request.query.sort || "defaultSort";
    const filters = parseFilters(request.query);
    const sortObj = getSortObject(sortBy);
    const whereClause = buildWhereClause(filters);

    const products = await Product.findAll({
      offset: (page - 1) * 10,
      limit: 12,
      include: [{
        model: Category,
        attributes: ["name"]
      }],
      where: whereClause,
      order: [sortObj],
    });

    return response.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return response.status(500).json({ error: "Error fetching products" });
  }
}

// Função para interpretar e criar o objeto de filtros
function parseFilters(query) {
  const filters = {};
  const filterKeys = ["price", "rating", "category", "inStock", "outOfStock"];
  
  filterKeys.forEach((key) => {
    const filterValue = query[`filters[${key}]`];
    if (filterValue) {
      filters[key] = filterValue.includes("$")
        ? extractOperatorAndValue(filterValue)
        : filterValue;
    }
  });

  return filters;
}

// Função auxiliar para extrair operador e valor do filtro
function extractOperatorAndValue(value) {
  const operatorMatch = value.match(/\$(\w+)/);
  const operator = operatorMatch ? sequelizeOp(operatorMatch[1]) : null;
  const filterValue = parseFloat(value.split("=").pop());
  return { operator, value: filterValue };
}

// Função para construir a cláusula WHERE com base nos filtros
function buildWhereClause(filters) {
  const whereClause = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (typeof value === "object") {
      const { operator, value: filterValue } = value;
      whereClause[key] = { [operator]: filterValue };
    } else {
      whereClause[key] = value;
    }
  });

  return whereClause;
}

// Função para definir o objeto de ordenação com base no parâmetro sortBy
function getSortObject(sortBy) {
  const sortOptions = {
    defaultSort: [],
    titleAsc: ["title", "ASC"],
    titleDesc: ["title", "DESC"],
    lowPrice: ["price", "ASC"],
    highPrice: ["price", "DESC"],
  };

  return sortOptions[sortBy] || [];
}

// Função auxiliar para mapear operadores para Sequelize
function sequelizeOp(operator) {
  const opMap = {
    gte: Sequelize.Op.gte,
    lte: Sequelize.Op.lte,
    gt: Sequelize.Op.gt,
    lt: Sequelize.Op.lt,
    eq: Sequelize.Op.eq,
  };

  return opMap[operator] || Sequelize.Op.eq;
}


async function getAllProductsOld(request, response) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
    response.status(200).json(products);
  } catch (error) {
    console.log(error);
  }
}

async function createProduct(request, response) {
  try {
    const {
      slug,
      title,
      mainImage,
      price,
      description,
      manufacturer,
      categoryId,
      inStock,
    } = request.body;
    const product = await prisma.product.create({
      data: {
        slug,
        title,
        mainImage,
        price,
        rating: 5,
        description,
        manufacturer,
        categoryId,
        inStock,
      },
    });
    return response.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error); // Dodajemo log za proveru
    return response.status(500).json({ error: "Error creating product" });
  }
}

// Method for updating existing product
async function updateProduct(request, response) {
  try {
    const { id } = request.params; // Getting a slug from params
    const {
      slug,
      title,
      mainImage,
      price,
      rating,
      description,
      manufacturer,
      categoryId,
      inStock,
    } = request.body;
    // Finding a product by slug
    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!existingProduct) {
      return response.status(404).json({ error: "Product not found" });
    }

    // Updating found product
    const updatedProduct = await prisma.product.update({
      where: {
        id, // Using id of the found product
      },
      data: {
        title: title,
        mainImage: mainImage,
        slug: slug,
        price: price,
        rating: rating,
        description: description,
        manufacturer: manufacturer,
        categoryId: categoryId,
        inStock: inStock,
      },
    });

    return response.status(200).json(updatedProduct);
  } catch (error) {
    return response.status(500).json({ error: "Error updating product" });
  }
}

// Method for deleting a product
async function deleteProduct(request, response) {
  try {
    const { id } = request.params;

        // Check for related records in wishlist table
        const relatedOrderProductItems = await prisma.customer_order_product.findMany({
          where: {
            productId: id,
          },
        });
        if(relatedOrderProductItems.length > 0){
          return response.status(400).json({ error: 'Cannot delete product because of foreign key constraint. ' });
        }

    await prisma.product.delete({
      where: {
        id,
      },
    });
    return response.status(204).send();
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Error deleting product" });
  }
}

async function searchProducts(request, response) {
  try {
    const { query } = request.query;
    if (!query) {
      return response
        .status(400)
        .json({ error: "Query parameter is required" });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            description: {
              contains: query,
            },
          },
        ],
      },
    });

    return response.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    return response.status(500).json({ error: "Error searching products" });
  }
}

async function getProductById(request, response) {
  const { id } = request.params;
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
    include: {
      category: true,
    },
  });
  if (!product) {
    return response.status(404).json({ error: "Product not found" });
  }
  return response.status(200).json(product);
}

async function getAllProductsOld(request, response) {
  try {
    const products = await Product.findAll({
      include: {
        model: Category,
        attributes: ["name"],
      },
    });
    response.status(200).json(products);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Error fetching products" });
  }
}

async function createProduct(request, response) {
  try {
    const {
      slug,
      title,
      mainImage,
      price,
      description,
      manufacturer,
      categoryId,
      inStock,
    } = request.body;

    const product = await Product.create({
      slug,
      title,
      mainImage,
      price,
      rating: 5, // Valor fixo, como no código original
      description,
      manufacturer,
      categoryId,
      inStock,
    });

    response.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    response.status(500).json({ error: "Error creating product" });
  }
}

async function updateProduct(request, response) {
  try {
    const { id } = request.params;
    const {
      slug,
      title,
      mainImage,
      price,
      rating,
      description,
      manufacturer,
      categoryId,
      inStock,
    } = request.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return response.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = await product.update({
      slug,
      title,
      mainImage,
      price,
      rating,
      description,
      manufacturer,
      categoryId,
      inStock,
    });

    response.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    response.status(500).json({ error: "Error updating product" });
  }
}

async function deleteProduct(request, response) {
  try {
    const { id } = request.params;

    const relatedOrderProductItems = await CustomerOrderProduct.findAll({
      where: { productId: id },
    });

    if (relatedOrderProductItems.length > 0) {
      return response
        .status(400)
        .json({ error: "Cannot delete product due to foreign key constraint." });
    }

    await Product.destroy({ where: { id } });
    response.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    response.status(500).json({ error: "Error deleting product" });
  }
}

async function searchProducts(request, response) {
  try {
    const { query } = request.query;

    if (!query) {
      return response
        .status(400)
        .json({ error: "Query parameter is required" });
    }

    const products = await Product.findAll({
      where: {
        [Sequelize.Op.or]: [
          { title: { [Sequelize.Op.like]: `%${query}%` } },
          { description: { [Sequelize.Op.like]: `%${query}%` } },
        ],
      },
    });

    response.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    response.status(500).json({ error: "Error searching products" });
  }
}

async function getProductById(request, response) {
  try {
    const { id } = request.params;
    const product = await Product.findByPk(id, {
      include: {
        model: Category,
      },
    });

    if (!product) {
      return response.status(404).json({ error: "Product not found" });
    }

    response.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    response.status(500).json({ error: "Error fetching product" });
  }
}

module.exports = {
  getAllProducts,
  getAllProductsOld,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductById,
};
