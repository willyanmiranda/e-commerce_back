const { CustomerOrderProduct, Product, CustomerOrder } = require('../db/db'); // Certifique-se de que o caminho para os modelos Sequelize está correto.

async function createOrderProduct(request, response) {
  try {
    const { customerOrderId, productId, quantity } = request.body;
    const orderProduct = await CustomerOrderProduct.create({
      customerOrderId,
      productId,
      quantity
    });
    return response.status(201).json(orderProduct);
  } catch (error) {
    console.error("Error creating product order:", error);
    return response.status(500).json({ error: "Error creating product order" });
  }
}

async function updateProductOrder(request, response) {
  try {
    const { id } = request.params;
    const { customerOrderId, productId, quantity } = request.body;

    const existingOrder = await CustomerOrderProduct.findByPk(id);

    if (!existingOrder) {
      return response.status(404).json({ error: "Order not found" });
    }

    const updatedOrder = await existingOrder.update({
      customerOrderId,
      productId,
      quantity
    });

    return response.json(updatedOrder);
  } catch (error) {
    console.error("Error updating product order:", error);
    return response.status(500).json({ error: "Error updating product order" });
  }
}

async function deleteProductOrder(request, response) {
  try {
    const { id } = request.params;
    await CustomerOrderProduct.destroy({
      where: {
        customerOrderId: id
      }
    });
    return response.status(204).send();
  } catch (error) {
    return response.status(500).json({ error: "Error deleting product orders" });
  }
}

async function getProductOrder(request, response) {
  try {
    const { id } = request.params;
    const order = await CustomerOrderProduct.findAll({
      where: {
        customerOrderId: id
      },
      include: {
        model: Product,
        as: 'product'
      }
    });
    
    if (!order.length) {
      return response.status(404).json({ error: "Order not found" });
    }
    return response.status(200).json(order);
  } catch (error) {
    console.error("Error fetching product order:", error);
    return response.status(500).json({ error: "Error fetching product order" });
  }
}

async function getAllProductOrders(request, response) {
  try {
    const productOrders = await CustomerOrderProduct.findAll({
      include: [
        {
          model: CustomerOrder,
          as: 'customerOrder',
          attributes: [
            'id', 'name', 'lastname', 'phone', 'email', 'company', 
            'adress', 'apartment', 'postalCode', 'dateTime', 'status', 'total'
          ]
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'title', 'mainImage', 'price', 'slug']
        }
      ]
    });

    const ordersMap = new Map();

    for (const order of productOrders) {
      const { customerOrder, product, quantity } = order;

      if (ordersMap.has(customerOrder.id)) {
        ordersMap.get(customerOrder.id).products.push({ ...product.toJSON(), quantity });
      } else {
        ordersMap.set(customerOrder.id, {
          customerOrderId: customerOrder.id,
          customerOrder: customerOrder.toJSON(),
          products: [{ ...product.toJSON(), quantity }]
        });
      }
    }

    const groupedOrders = Array.from(ordersMap.values());

    return response.json(groupedOrders);
  } catch (error) {
    console.error("Error fetching all product orders:", error);
    return response.status(500).json({ error: "Error fetching all product orders" });
  }
}

module.exports = {
  createOrderProduct,
  updateProductOrder,
  deleteProductOrder,
  getProductOrder,
  getAllProductOrders
};