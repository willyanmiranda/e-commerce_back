require('dotenv').config()
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql', 
  logging: false, 
  pool: {
    max: 5,      
    min: 0,       
    acquire: 30000, 
    idle: 10000,  
  },
});
sequelize.authenticate()
  .then(() => {
    console.log('Conectado ao banco de dados via Sequelize.');
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
});

sequelize.sync({ force: false })
  .then(() => {
    console.log('Tabelas sincronizadas com sucesso!');
  })
  .catch(err => {
    console.error('Erro ao sincronizar tabelas:', err);
});

// Modelo Product
const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
  },
  title: DataTypes.STRING,
  mainImage: DataTypes.STRING,
  price: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  description: DataTypes.STRING,
  manufacturer: DataTypes.STRING,
  inStock: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  categoryId: DataTypes.UUID,
});

// Modelo Image
const Image = sequelize.define("Image", {
  imageID: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  productID: DataTypes.UUID,
  image: DataTypes.STRING,
});

// Modelo User
const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: DataTypes.STRING,
  role: {
    type: DataTypes.STRING,
    defaultValue: "user",
  },
});

// Modelo Customer_order
const CustomerOrder = sequelize.define("Customer_order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  lastname: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  company: DataTypes.STRING,
  adress: DataTypes.STRING,
  apartment: DataTypes.STRING,
  postalCode: DataTypes.STRING,
  dateTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: DataTypes.STRING,
  city: DataTypes.STRING,
  country: DataTypes.STRING,
  orderNotice: DataTypes.STRING,
  total: DataTypes.INTEGER,
});

// Modelo customer_order_product
const CustomerOrderProduct = sequelize.define("customer_order_product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  customerOrderId: DataTypes.UUID,
  productId: DataTypes.UUID,
  quantity: DataTypes.INTEGER,
});

// Modelo Category
const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
});

// Modelo Wishlist
const Wishlist = sequelize.define("Wishlist", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  productId: DataTypes.UUID,
  userId: DataTypes.UUID,
});

const Option = sequelize.define("Option", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  optionName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

const OptionValue = sequelize.define("OptionValue", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  optionId: {
    type: DataTypes.UUID,
    references: {
      model: Option,
      key: "id",
    },
  },
  valueName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const ProductOption = sequelize.define("ProductOption", {
  productId: {
    type: DataTypes.UUID,
    references: {
      model: Product,
      key: "id",
    },
  },
  optionId: {
    type: DataTypes.UUID,
    references: {
      model: Option,
      key: "id",
    },
  },
});

const ProductVariant = sequelize.define("ProductVariant", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.UUID,
    references: {
      model: Product,
      key: "id",
    },
  },
  skuId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  price: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

const VariantValue = sequelize.define("VariantValue", {
  variantId: {
    type: DataTypes.UUID,
    references: {
      model: ProductVariant,
      key: "id",
    },
  },
  optionValueId: {
    type: DataTypes.UUID,
    references: {
      model: OptionValue,
      key: "id",
    },
  },
});

Option.hasMany(OptionValue, { foreignKey: "optionId", onDelete: "CASCADE" });
OptionValue.belongsTo(Option, { foreignKey: "optionId" });

Product.hasMany(ProductOption, { foreignKey: "productId", onDelete: "CASCADE" });
ProductOption.belongsTo(Product, { foreignKey: "productId" });
Option.hasMany(ProductOption, { foreignKey: "optionId", onDelete: "CASCADE" });
ProductOption.belongsTo(Option, { foreignKey: "optionId" });

Product.hasMany(ProductVariant, { foreignKey: "productId", onDelete: "CASCADE" });
ProductVariant.belongsTo(Product, { foreignKey: "productId" });

ProductVariant.hasMany(VariantValue, { foreignKey: "variantId", onDelete: "CASCADE" });
VariantValue.belongsTo(ProductVariant, { foreignKey: "variantId" });
OptionValue.hasMany(VariantValue, { foreignKey: "optionValueId", onDelete: "CASCADE" });
VariantValue.belongsTo(OptionValue, { foreignKey: "optionValueId" });

Product.belongsTo(Category, { foreignKey: "categoryId", onDelete: "CASCADE" });
Category.hasMany(Product, { foreignKey: "categoryId" });

Product.hasMany(CustomerOrderProduct, { foreignKey: "productId" });
CustomerOrderProduct.belongsTo(Product, { foreignKey: "productId" });

CustomerOrder.hasMany(CustomerOrderProduct, { foreignKey: "customerOrderId" });
CustomerOrderProduct.belongsTo(CustomerOrder, { foreignKey: "customerOrderId" });

User.hasMany(Wishlist, { foreignKey: "userId" });
Wishlist.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(Wishlist, { foreignKey: "productId" });
Wishlist.belongsTo(Product, { foreignKey: "productId" });

module.exports = {
  sequelize,
  Product,
  Image,
  User,
  CustomerOrder,
  CustomerOrderProduct,
  Category,
  Wishlist,
  Option,
  OptionValue,
  ProductOption,
  ProductVariant,
  VariantValue,
};