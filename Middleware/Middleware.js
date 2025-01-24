import jwt from "jsonwebtoken";
import User from "../Models/UserModel.js";

const protectede = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const dec = jwt.verify(token, process.env.JWT_TOKEN);
      req.user = await User.findById(dec.id).select("-Password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized" });
    }
  } else {
    res.status(401).json({ message: "No token found" });
  }
};
    const checkrole = (requiredRole) => {
        return (req, res, next) => {
          if (req.user) {
            if (requiredRole === "admin" && req.user.IsAdmin) {
              // If the required role is admin and the user is an admin, allow access
              next();
            } else if (requiredRole === "seller" && req.user.IsSeller) {
              // If the required role is seller and the user is a seller, allow access
              next();
            } else {
              res.status(403).json({ message: "Access denied" });
            }
          } else {
            res.status(401).json({ message: "Not authorized" });
          }
        };
      };
      // const userCanWriteReview = async (req, res, next) => {
      //   try {
      //     const userId = req.user._id;
      //     const productId = req.params.productId;
      
      //     // Check if the user has already written a review for this product
      //     const existingReview = await Review.findOne({ user: userId, product: productId });
      
      //     if (existingReview) {
      //       return res.status(400).json({ message: 'You have already written a review for this product' });
      //     }
      
      //     next(); // Move to the next middleware if the user can write a review
      //   } catch (error) {
      //     res.status(500).json({ message: error.message });
      //   }
      // };
      


export { protectede,checkrole };
