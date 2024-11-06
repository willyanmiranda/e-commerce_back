const { CustomerOrder } = require('../db/db'); // Certifique-se de que o caminho para os modelos Sequelize está correto.

async function createCustomerOrder(request, response) {
  try {
    const {
      name,
      lastname,
      phone,
      email,
      company,
      adress,
      apartment,
      postalCode,
      status,
      city,
      country,
      orderNotice,
      total,
    } = request.body;

    const corder = await CustomerOrder.create({
      name,
      lastname,
      phone,
      email,
      company,
      adress,
      apartment,
      postalCode,
      status,
      city,
      country,
      orderNotice,
      total,
    });

    return response.status(201).json(corder);
  } catch (error) {
    console.error("Error creating order:", error);
    return response.status(500).json({ error: "Error creating order" });
  }
}

async function updateCustomerOrder(request, response) {
  try {
    const { id } = request.params;
    const {
      name,
      lastname,
      phone,
      email,
      company,
      adress,
      apartment,
      postalCode,
      dateTime,
      status,
      city,
      country,
      orderNotice,
      total,
    } = request.body;

    const existingOrder = await CustomerOrder.findByPk(id);

    if (!existingOrder) {
      return response.status(404).json({ error: "Order not found" });
    }

    const updatedOrder = await existingOrder.update({
      name,
      lastname,
      phone,
      email,
      company,
      adress,
      apartment,
      postalCode,
      dateTime,
      status,
      city,
      country,
      orderNotice,
      total,
    });

    return response.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return response.status(500).json({ error: "Error updating order" });
  }
}

async function deleteCustomerOrder(request, response) {
  try {
    const { id } = request.params;
    const deleted = await CustomerOrder.destroy({
      where: {
        id: id,
      },
    });

    if (deleted) {
      return response.status(204).send();
    } else {
      return response.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error deleting order:", error);
    return response.status(500).json({ error: "Error deleting order" });
  }
}

async function getCustomerOrder(request, response) {
  try {
    const { id } = request.params;
    const order = await CustomerOrder.findByPk(id);

    if (!order) {
      return response.status(404).json({ error: "Order not found" });
    }

    return response.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return response.status(500).json({ error: "Error fetching order" });
  }
}

async function getAllOrders(request, response) {
  try {
    const orders = await CustomerOrder.findAll();
    return response.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return response.status(500).json({ error: "Error fetching orders" });
  }
}

module.exports = {
  createCustomerOrder,
  updateCustomerOrder,
  deleteCustomerOrder,
  getCustomerOrder,
  getAllOrders,
};