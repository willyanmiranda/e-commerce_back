const { User } = require("../db/db"); // Assumindo que User é o modelo Sequelize
const bcrypt = require("bcryptjs");

async function getAllUsers(request, response) {
    try {
        const users = await User.findAll();
        return response.json(users);
    } catch (error) {
        return response.status(500).json({ error: "Error fetching users" });
    }
}

async function createUser(request, response) {
    try {
        const { email, password, role } = request.body;
        const hashedPassword = await bcrypt.hash(password, 5);

        const user = await User.create({
            email,
            password: hashedPassword,
            role,
        });
        return response.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        return response.status(500).json({ error: "Error creating user" });
    }
}

async function updateUser(request, response) {
    try {
        const { id } = request.params;
        const { email, password, role } = request.body;
        const hashedPassword = await bcrypt.hash(password, 5);

        const existingUser = await User.findByPk(id);

        if (!existingUser) {
            return response.status(404).json({ error: "User not found" });
        }

        const updatedUser = await existingUser.update({
            email,
            password: hashedPassword,
            role,
        });

        return response.status(200).json(updatedUser);
    } catch (error) {
        return response.status(500).json({ error: "Error updating user" });
    }
}

async function deleteUser(request, response) {
    try {
        const { id } = request.params;
        const deletedCount = await User.destroy({
            where: { id },
        });

        if (deletedCount === 0) {
            return response.status(404).json({ error: "User not found" });
        }

        return response.status(204).send();
    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: "Error deleting user" });
    }
}

async function getUser(request, response) {
    const { id } = request.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }
        return response.status(200).json(user);
    } catch (error) {
        return response.status(500).json({ error: "Error fetching user" });
    }
}

async function getUserByEmail(request, response) {
    const { email } = request.params;
    try {
        const user = await User.findOne({
            where: { email },
        });
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }
        return response.status(200).json(user);
    } catch (error) {
        return response.status(500).json({ error: "Error fetching user by email" });
    }
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUser,
    getAllUsers,
    getUserByEmail,
};