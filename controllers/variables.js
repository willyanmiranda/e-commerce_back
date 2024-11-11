// productVariationController.js
const { ProductVariation, Product, Color, Size } = require('../db/db'); // importando os modelos

// Função para obter as variações de um produto pelo id
const getProductVariationsByProductId = async (req, res) => {
  try {
    const productId = req.params.productId; // Recupera o id do produto a partir dos parâmetros da requisição
    
    // Busca as variações do produto com o id informado, incluindo as informações de cor e tamanho
    const productVariations = await ProductVariation.findAll({
      where: {
        productId: productId, // Filtra pelo id do produto
      },
      include: [
        {
          model: Color, // Inclui os dados de cor
          attributes: ['colorName'], // Retorna apenas o nome da cor
        },
        {
          model: Size, // Inclui os dados de tamanho
          attributes: ['sizeName'], // Retorna apenas o nome do tamanho
        },
      ],
    });

    // Se não encontrar nenhuma variação, retorna erro
    if (productVariations.length === 0) {
      return res.status(404).json({ message: 'No variations found for this product.' });
    }

    // Retorna as variações com as cores e tamanhos
    return res.status(200).json({ productVariations });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProductVariationsByProductId };