const express = require("express");

const router = express.Router();

const { getProductVariantsByProductId } = require("../controllers/variables");

router.route("/:productId").get(getProductVariantsByProductId);

module.exports = router;