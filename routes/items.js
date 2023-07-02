const express = require("express");
const router = express.Router();
const items = require('../models/items');
const { ObjectId } = require("mongodb");

router.get("/getItems", async (req, res) => {
  try {
    const result = await items.find({});
    res.json({ data: result, type: "success" });
    //res.json({ message: "succesfully saved a item", type: "success" });
  } catch (error) {
    res.json({ message: "---------------", type: "warning" });
  }
});

router.get("/getItem", async (req, res) => {
  try {
    const { id } = req.query;
    const item = await items.findOne({ _id: new ObjectId(id) });
    res.send({ data: item, type: "success" });
  } catch (error) {
    res.json({ message: 'item not found', type: "warning" });
  }
});

router.post("/addItem", async (req, res) => {
  try {
    const {
      // selectedFile,
      name,
      description,
      specification,
      price,
      type,
      brand,
      model,
      color } = req.body;

    // console.log('********', name,
    //   description,
    //   specification,
    //   price,
    //   type,
    //   brand,
    //   model,
    //   color);

    if (
      name &&
      description &&
      specification &&
      price &&
      type &&
      brand &&
      model &&
      color) {
      await items.insertMany({
        // 'selectedFile',
        name,
        description,
        specification,
        price,
        type,
        brand,
        model,
        color

      });
      res.json({ message: "succesfully saved a item", type: "success" });
    } else {
      res.json({ message: "missing some item data", type: "warning" });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: error, type: "error" });
  }
});

module.exports = router;
