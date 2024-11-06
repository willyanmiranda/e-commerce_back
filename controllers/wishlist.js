const { Wishlist, Product } = require("../db/db"); // Assumindo que Wishlist e Product são os modelos Sequelize

async function getAllWishlist(request, response) {
    try {
        const wishlist = await Wishlist.findAll({
            include: [
                {
                    model: Product, // Inclui detalhes do produto
                },
            ],
        });
        return response.json(wishlist);
    } catch (error) {
        return response.status(500).json({ error: "Error fetching wishlist" });
    }
}

async function getAllWishlistByUserId(request, response) {
    const { userId } = request.params;
    try {
        const wishlist = await Wishlist.findAll({
            where: {
                userId: userId,
            },
            include: [
                {
                    model: Product, // Inclui detalhes do produto
                },
            ],
        });
        return response.json(wishlist);
    } catch (error) {
        return response.status(500).json({ error: "Error fetching wishlist" });
    }
}

async function createWishItem(request, response) {
    try {
        const { userId, productId } = request.body;
        const wishItem = await Wishlist.create({
            userId,
            productId,
        });
        return response.status(201).json(wishItem);
    } catch (error) {
        console.error("Error creating wish item:", error);
        return response.status(500).json({ error: "Error creating wish item" });
    }
}

async function deleteWishItem(request, response) {
    try {
        const { userId, productId } = request.params;
        await Wishlist.destroy({
            where: {
                userId: userId,
                productId: productId,
            },
        });
        return response.status(204).send();
    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: "Error deleting wish item" });
    }
}

async function getSingleProductFromWishlist(request, response) {
    try {
        const { userId, productId } = request.params;
        const wishItem = await Wishlist.findAll({
            where: {
                userId: userId,
                productId: productId,
            },
        });
        return response.status(200).json(wishItem);
    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: "Error getting wish item" });
    }
}

async function deleteAllWishItemByUserId(request, response) {
    try {
        const { userId } = request.params;
        await Wishlist.destroy({
            where: {
                userId: userId,
            },
        });
        return response.status(204).send();
    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: "Error deleting wish items" });
    }
}

module.exports = {
    getAllWishlistByUserId,
    getAllWishlist,
    createWishItem,
    deleteWishItem,
    getSingleProductFromWishlist,
    deleteAllWishItemByUserId,
};