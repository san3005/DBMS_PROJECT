import Product from '../Models/ProductModel.js'
import User from '../Models/UserModel.js';
import Review from '../Models/ReviewModel.js'


// Controller function to add a review to a product
const addReview = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user._id; // Assuming you have user authentication middleware

    // Check if the user is an admin or seller
    const user = await User.findById(userId); // Assuming you have a User model
    if (user.IsAdmin || user.IsSeller) {
      return res.status(403).json({ error: 'Admins and sellers cannot add reviews' });
    }

    // Check if the user has already reviewed the product
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    // Create a new review
    const newReview = new Review({
      user: userId,
      product: productId,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    // Save the review to the database
    await newReview.save();

    // Update the product's reviews array with the new review's ObjectId
    const product = await Product.findByIdAndUpdate(
      productId,
      { $push: { reviews: newReview._id } },
      { new: true }
    );

    res.status(201).json({ message: 'Review added successfully', review: newReview, updatedProduct: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export {
  addReview,
};
