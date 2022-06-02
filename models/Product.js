const { boolean } = require("joi");
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name"],
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    price: {
      type: Number,
      require: [true, "Please provide product price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dsbhnrfxj/image/upload/v1653868853/corona-beer_ckuwbx.jpg",
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: ["Soft", "Stout", "Beer"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 20,
    },
    size: {
      type: Array,
      required: [true, "Please select size for purchase"],
      default: ["case"],
    },
    // case: {
    //   type: Boolean,
    //   default: true,
    // },
    // sixPack: {
    //   type: Boolean,
    //   required: true,
    //   default: false,
    // },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

ProductSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
});

module.exports = mongoose.model("Product", ProductSchema);
