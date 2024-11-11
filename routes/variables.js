const express = require("express");

const router = express.Router();

const { getProductVariationsByProductId } = require("../controllers/variables");

router.route("/:productId").get(getProductVariationsByProductId);

module.exports = router;