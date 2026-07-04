import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  requiresRegister: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;
