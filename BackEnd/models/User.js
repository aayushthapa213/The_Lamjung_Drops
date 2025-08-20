import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: function () {
        return this.role !== "dealer"; // Name is optional for dealers
      },
    },
    lastlogin: {
      type: Date,
      default: Date.now,
    },
    isPending: {
      type: Boolean,
      default: function () {
        return this.role === "dealer"; // Dealers start as pending
      },
    },
    role: {
      type: String,
      enum: ["admin", "dealer", "user"],
      default: "user",
    },
    companyName: {
      type: String,
      required: function () {
        return this.role === "dealer";
      },
    },
    bulkDiscountRate: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);