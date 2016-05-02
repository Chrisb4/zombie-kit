var mongoose = require("mongoose");

var cartItemSchema = {
 userId: Number,
 title: String,
 ASIN: String,
 price: String,
 image: String
};

var CartItem = mongoose.model("CartItem", cartItemSchema);

module.exports = CartItem
