const express = require("express");
const router = express.Router();
const items = require('../models/items');
const { ObjectId } = require("mongodb");
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


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

router.post("/addItem", upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const {
      name,
      description,
      specification,
      price,
      type,
      brand,
      model,
      color } = req.body;

    if (
      name &&
      description &&
      specification &&
      price &&
      type &&
      brand &&
      model &&
      color
    ) {
      const result = await items.insertMany({
        name,
        description,
        specification,
        price,
        type,
        brand,
        model,
        color
      });

      const itemId = await result[0]._id.toString();
      await uploadImage(itemId, file);

      res.json({ message: "succesfully saved a item", type: "success" });
    } else {
      res.json({ message: "missing some item data", type: "warning" });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: error, type: "error" });
  }
});

const uploadImage = async (itemId, file) => {
  try {
    const ImageSchema = new mongoose.Schema({
      name: String,
      data: Buffer,
      itemId: String,
    });

    const ImageModel = mongoose.model('Image', ImageSchema);

    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    const data = fs.readFileSync(filePath);

    const image = new ImageModel({
      name: file.originalname,
      data: data,
      itemId: itemId,
    });

    await image.save();
    fs.unlink(file.path, (error) => {
      if (error) {
        console.error('Error deleting file:', error);
      }
    });

  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
}

/*
router.post('/addImage', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    // Define a schema for the image file
    const ImageSchema = new mongoose.Schema({
      name: String,
      data: Buffer,
    });

    const ImageModel = mongoose.model('Image', ImageSchema);

    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    const data = fs.readFileSync(filePath);

    const image = new ImageModel({
      name: file.originalname,
      data: data,
    });

    await image.save();
    fs.unlink(file.path, (error) => {
      if (error) {
        console.error('Error deleting file:', error);
      }
    });
    res.send({ message: 'Image saved successfully', type: "success" });
  } catch (error) {
    res.send({ message: 'Image was not saved', type: "error" });
  } finally {
    mongoose.connection.close();
  }
});
*/


module.exports = router;
