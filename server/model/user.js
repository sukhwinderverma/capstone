import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ['jobSeeker', 'employer'],
      required: true,
    },
    blocked: {
      type: Boolean,
      default: false, // Default value is false, meaning the user is not blocked initially
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare the given password with the stored hashed password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to toggle the blocked status of the user
userSchema.methods.toggleBlock = async function () {
  this.blocked = !this.blocked;
  await this.save();
};

export const User = mongoose.model("User", userSchema);
