const express = require("express");
const router = express.Router();
const items = require('../models/items');
const user = require('../models/user');
const images = require('../models/images');
const { ObjectId } = require("mongodb");
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.get("/getItems", async (req, res) => {
  try {
    const result = await items.find({});
    res.json({ data: result, type: "got items" });
  } catch (error) {
    res.json({ message: "items not found", type: "warning" });
  }
});

router.get("/getItem", async (req, res) => {
  try {
    const { id } = req.query;
    const item = await items.findOne({ _id: new ObjectId(id) });
    res.send({ data: item });
  } catch (error) {
    res.json({ message: 'item not found', type: "warning" });
  }
});

router.get("/getImages", async (req, res) => {
  try {
    const result = await images.find({});
    console.log('result', result)

    if (result) {
      const imageData = result.map((image) => image.data);
      res.send(imageData);
      res.send({ result });
    } else {
      res.status(404).json({ message: "Images not found", type: "warning" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", type: "error" });
  }
});

router.get("/getImage", async (req, res) => {
  try {
    const { id } = req.query;
    const result = await images.findOne({ itemId: id });

    if (result) {
      res.setHeader('Content-Type', 'image/jpeg');
      res.send(result.data);
    } else {
      res.status(404).json({ message: "Image not found", type: "warning" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", type: "error" });
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
      const result = await items.inser({
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

router.post("/saveToCart", async (req, res) => {
  try {
    const { itemId } = req.query;
    const { userId } = req.body;

    const result = await user.findOne({ _id: userId }, { cartItems: true, _id: false });
    const { cartItems } = result;
    let itemFound = false;

    if (cartItems) {
      cartItems.forEach(el => {
        if (el.toString() === itemId) {
          itemFound = true;
          return;
        }
      });
    }

    if (itemFound) {
      await user.findByIdAndUpdate({ _id: userId }, { $pull: { cartItems: itemId } });
      res.json({ message: "Item deleted", type: "success" });

    } else {
      const resultSaved = await user.findByIdAndUpdate({ _id: userId }, { $push: { cartItems: itemId } });
      if (resultSaved) {
        res.json({ message: "Item saved", type: "success" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Item was not saved", type: "error" });
  }
});

router.post("/saveToWhishList", async (req, res) => {
  try {
    const { itemId } = req.query;
    const { userId } = req.body;

    const result = await user.findOne({ _id: userId }, { wishListItems: true, _id: false });
    const { wishListItems } = result;
    let itemFound = false;

    if (wishListItems) {
      wishListItems.forEach(el => {
        if (el.toString() === itemId) {
          itemFound = true;
          return;
        }
      });
    }

    if (itemFound) {
      await user.findByIdAndUpdate({ _id: userId }, { $pull: { wishListItems: itemId } });
      res.json({ message: "Item deleted", type: "success" });

    } else {
      const resultSaved = await user.findByIdAndUpdate({ _id: userId }, { $push: { wishListItems: itemId } });
      if (resultSaved) {
        res.json({ message: "Item saved", type: "success" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Item was not saved", type: "error" });
  }
});

router.get("/getUserCartItems", async (req, res) => {
  try {
    const { userId } = req.query;
    const result = await user.findOne({ _id: userId });
    if (result) {
      res.json({ message: "Items found", type: "success", items: result.cartItems });

    }
  } catch (error) {
    res.status(500).json({ message: "Item was not saved", type: "error" });
  }
});

router.get("/getUserWishListItems", async (req, res) => {
  try {
    const { userId } = req.query;
    const result = await user.findOne({ _id: userId });
    if (result) {
      res.json({ message: "Whish list items found", type: "success", items: result.wishListItems });

    }
  } catch (error) {
    res.status(500).json({ message: "Whish list items was not saved", type: "error" });
  }
});


module.exports = router;
