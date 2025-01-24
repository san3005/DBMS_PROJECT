import Product from '../Models/ProductModel.js';
import Review from '../Models/ReviewModel.js';
import User from '../Models/UserModel.js';

const getProducts = async (req, res) => {
  try {
    let query;
    let words = req.query.words
      ? {
          Name: {
            $regex: req.query.words,
            $options: 'i',
          },
        }
      : {};
    const reqQuery = { ...req.query, ...words };
    const removeFields = ['sort'];
    removeFields.forEach((val) => delete reqQuery[val]);
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
    query = Product.find(JSON.parse(queryStr))
      .populate({
        path: 'reviews',
        model: 'Review',
        select: 'user comment rating',
        populate: {
          path: 'user',
          model: 'User',
          select: 'Name',
        },
      })
      .populate('sellerId', 'Name');

    const data = await query;

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};





// }
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews', 'user rating comment') // Populate the reviews associated with the product
      .exec();

    if (product) {
      res.json(product);
    } else {
      res.status(404).json("Product not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ message: 'Rating and comment are required' });
  }

  const userId = req.user._id;
  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const productId = req.params.productId;
  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user is an admin or seller
    if (req.user.isAdmin || (req.user.isSeller && product.sellerId.equals(userId))) {
      return res.status(403).json({ message: 'Admins and sellers cannot review products' });
    }

    const review = new Review({ user: userId, product: productId, rating, comment });
    await review.save();

    product.reviews.push(review._id);
    await product.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const sellerproducts = async (req, res) => {
  try {
    // Assuming the seller's user ID is stored in req.user._id after authentication
    const sellerId = req.user._id;

    // Find products where sellerId matches the authenticated seller's ID
    const products = await Product.find({ sellerId: sellerId });

    // If products are found, send them in the response
    if (products.length > 0) {
      res.json(products);
    } else {
      // If no products are found, send a message indicating this
      res.status(404).json({ message: "No products found for this seller." });
    }
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error("Error in sellerPublishedProducts:", error);
    res.status(500).json({ message: "Error retrieving products" });
  }
};

const updatedproduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if the user making the request is the seller who created the product
      if (product.sellerId.equals(req.user._id)) {
        product.Name = req.body.Name || product.Name;
        product.Img = req.body.Img || product.Img;
        product.Category = req.body.Category || product.Category;
        product.Description = req.body.Description || product.Description;
        product.Brand = req.body.Brand || product.Brand;
        product.Price = req.body.Price || product.Price;
        product.inventory = req.body.inventory || product.inventory;
        product.discount = req.body.discount || product.discount;
        product.CountInstock = req.body.CountInstock || product.CountInstock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
      } else {
        res.status(403).json({ message: 'Access denied: You are not the seller of this product' });
      }
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const sellerSinglePublishedProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const sellerId = req.user._id;

    const product = await Product.findOne({ _id: productId, sellerId });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found or you are not the seller of this product' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const deleteproduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if the user making the request is the seller who created the product
      if (product.sellerId.equals(req.user._id)) {
        await Product.deleteOne({ _id: req.params.id }); // Delete the product
        res.json({ message: 'Product deleted' });
      } else {
        res.status(403).json({ message: 'Access denied: You are not the seller of this product' });
      }
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const createproduct = async (req, res) => {
  try {
    const {
      Name,
      Img,
      Category,
      Description,
      Brand,
      Price,
      inventory,
      discount,
      CountInstock,
    } = req.body;

    const newProduct = new Product({
      Name,
      Img,
      Category,
      Description,
      Brand,
      Price,
      inventory,
      discount,
      CountInstock,
      sellerId: req.user._id, // Assuming the seller ID is taken from the authenticated user
    });

    const createdProduct = await newProduct.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatetheproduct=async(req,res)=>{
 const {Name,Price,Description,Img,Brand,Category,CountInStock}=req.body;
 const product=await Product.findById(req.params.id);
 if(product){
   product.Name=Name;
   product.Category=Category;
   product.Price=Price;
   product.Description=Description;
   product.Img=Img;
   product.Brand=Brand;
   product.CountInStock=CountInStock;

  const updateproduct=await product.save()
  res.status(200).json(updateproduct)
 
 }
 else{
res.status(404).json("product not found");
throw new Error("Product now found")
 }
 }

 
export{sellerproducts,addProductReview,getProducts,getProduct,updatedproduct,sellerSinglePublishedProduct,updatetheproduct,deleteproduct,createproduct}