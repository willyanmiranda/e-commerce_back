const { 
  ProductVariant, 
  VariantValue, 
  Option, 
  OptionValue, 
  Product 
} = require('../db/db'); // Importando os modelos atualizados

// Função para obter as variações de um produto pelo ID
const getProductVariantsByProductId = async (req, res) => {
  try {
    const productId = req.params.productId; // Recupera o ID do produto a partir dos parâmetros da requisição

    // Busca as variações do produto com os valores associados
    const productVariants = await ProductVariant.findAll({
      where: {
        productId: productId, // Filtra pelo ID do produto
      },
      include: [
        {
          model: VariantValue, // Inclui os valores da variação
          include: [
            {
              model: OptionValue, // Inclui os valores das opções
              attributes: ['valueName'], // Retorna apenas o nome do valor
              include: [
                {
                  model: Option, // Inclui os nomes das opções (e.g., "Cor", "Tamanho")
                  attributes: ['optionName'], // Retorna apenas o nome da opção
                },
              ],
            },
          ],
        },
      ],
    });

    // Verifica se foram encontradas variações
    if (productVariants.length === 0) {
      return res.status(404).json({ message: 'No variants found for this product.' });
    }

    // Formata a resposta para tornar os dados mais legíveis
    const formattedVariants = productVariants.map((variant) => ({
      id: variant.id,
      skuId: variant.skuId,
      price: variant.price,
      stock: variant.stock,
      options: variant.VariantValues.map((vv) => ({
        option: vv.OptionValue.Option.optionName,
        value: vv.OptionValue.valueName,
      })),
    }));

    // Retorna as variações formatadas
    return res.status(200).json({ productVariants: formattedVariants });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProductVariantsByProductId };