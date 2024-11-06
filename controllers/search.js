const { Product } = require("../db/db"); // Assumindo que o modelo Product está definido em models
const { Op } = require("sequelize");

async function searchProducts(request, response) {
    try {
        const { query } = request.query;

        if (!query) {
            return response.status(400).json({ error: "Query parameter is required" });
        }

        const products = await Product.findAll({
            where: {
                [Op.or]: [
                    {
                        title: {
                            [Op.like]: `%${query}%` // Utiliza LIKE com % para buscar substrings
                        }
                    },
                    {
                        description: {
                            [Op.like]: `%${query}%`
                        }
                    }
                ]
            }
        });

        return response.json(products);
    } catch (error) {
        console.error("Error searching products:", error);
        return response.status(500).json({ error: "Error searching products" });
    }
}

module.exports = { searchProducts };