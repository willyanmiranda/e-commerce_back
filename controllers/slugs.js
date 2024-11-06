const { Product, Category } = require("../db/db"); // Assumindo que Product e Category são modelos Sequelize

async function getProductBySlug(request, response) {
    const { slug } = request.params;

    try {
        const product = await Product.findOne({
            where: { slug: slug },
            include: [
                {
                    model: Category,
                    as: "Category"
                }
            ]
        });

        if (!product) {
            return response.status(404).json({ error: "Product not found" });
        }

        return response.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product by slug:", error);
        return response.status(500).json({ error: "Error fetching product by slug" });
    }
}

module.exports = { getProductBySlug };
