import Order from '../Models/OrderModel.js';
import ShippingAddress from '../Models/ShippingModel.js';
import Product from '../Models/ProductModel.js';
import User from '../Models/UserModel.js';
import Payment from '../Models/PaymentModel.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import crypto from 'crypto';





const encryptionKey = "ThisIs16BytesKey"
const iv ="RandomIV12345678"

// Function to encrypt a credit card number
// Function to encrypt a credit card number
function encryptCardNumber(cardNumber) {
  const cipher = crypto.createCipheriv("aes-128-cbc", Buffer.from(encryptionKey), Buffer.from(iv));
  let encrypted = cipher.update(cardNumber, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

// Function to decrypt an encrypted credit card number
function decryptCardNumber(encryptedCardNumber) {
  const decipher = crypto.createDecipheriv("aes-128-cbc", Buffer.from(encryptionKey), Buffer.from(iv));
  let decrypted = decipher.update(encryptedCardNumber, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
const createOrder = async (req, res) => {
  function isValidCardNumber(cardNumber) {
    // Regular expression for a 16-digit card number (adjust as needed)
    const cardNumberRegex = /^\d{16}$/;
    return cardNumberRegex.test(cardNumber);
  }
  try {
    const {
      orderedList,
      shippingAddress,
      payment,
      tax,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderedList || orderedList.length === 0) {
      return res.status(400).json({ message: "No items ordered" });
    }

    // Check if the user is an admin or seller
    if (req.user.IsAdmin || req.user.IsSeller) {
      return res.status(403).json({ message: "Admins and sellers cannot place orders" });
    }

    const taxPercentage = 0.10; // 10% tax
    const shippingPercentage = 0.05; // 5% shipping price
// Calculate the amount for each item based on Price from Product * Quantity
let totalAmount = 0;

if (orderedList && orderedList.length > 0) {
  await Promise.all(orderedList.map(async (item) => {
    // Assuming each item in orderedList has "product" and "qty" properties
    const productId = item.product;
    const itemQuantity = item.qty || 0;
        const productData = await Product.findById(productId);
totalAmount=totalAmount+itemQuantity*productData.Price;

}))}


    const calculatedTax =totalAmount * taxPercentage;
    const calculatedShippingPrice = totalAmount * shippingPercentage;
    const calculatedTotalPrice = totalAmount + calculatedTax + calculatedShippingPrice;
    console.log("total price",calculatedTotalPrice)
    // Create a new payment entry
    const newPayment = new Payment({
      amount: totalAmount,
      paymentMethod: payment.paymentMethod,
      tax: calculatedTax.toFixed(2),
      shippingPrice: calculatedShippingPrice.toFixed(2),
      totalPrice: calculatedTotalPrice.toFixed(2),
      status: payment.status,
    });
    
    if (
      payment.paymentMethod &&
      (payment.paymentMethod.toUpperCase() === "CREDIT" ||
        payment.paymentMethod.toUpperCase() === "DEBIT")
    ) {
      // Check if card details are provided
    
      if (!isValidCardNumber(payment.CardNumber) || !payment.CVC || !payment.ExpirationDate) {
        return res.status(400).json({ message: "Invalid card details" });
      }
      // Add the card details to the newPayment object
   const st=(payment.CardNumber).toString()
const encryptedCardNumber=(encryptCardNumber(st));
      newPayment.CardNumber = encryptedCardNumber;
      newPayment.CVC = payment.CVC;
      newPayment.ExpirationDate = payment.ExpirationDate;      newPayment.CVC = payment.CVC;
      newPayment.ExpirationDate = payment.ExpirationDate;}
   
    
 
    

    // Save the payment to the database
    const savedPayment = await newPayment.save();

    const newShippingAddress = new ShippingAddress({
      country: shippingAddress.country,
      postalCode: shippingAddress.postalCode,
      city: shippingAddress.city,
      address: shippingAddress.address,
    });

    // Save the shipping address to the database
    const savedShippingAddress = await newShippingAddress.save();

    // Initialize an array to collect error messages
    const errorMessages = [];

    // Create the order items
    const orderItems = await Promise.all(orderedList.map(async (item) => {
      const productData = await Product.findById(item.product);

      if (!productData) {
        errorMessages.push("Product not found");
        return null; // Skip this item and continue with the next one
      }

      if (productData.CountInstock < item.qty) {
        errorMessages.push("Insufficient quantity in stock");
        return null; // Skip this item and continue with the next one
      }

      // Subtract qty ordered from CountInstock and update the product data
      productData.CountInstock -= item.qty;
      await productData.save();

      // Create the order item
      return {
        Name: productData.Name,
        Img: productData.Img,
        qty: item.qty,
        Price: productData.Price,
        product: productData._id,
      };
    }));

    // Check if any errors occurred during order item creation
    if (errorMessages.length > 0) {
      return res.status(400).json({ errors: errorMessages });
    }

    // Create the order with references to the shipping address, payment, and user
    const newOrder = new Order({
      orderedList: orderItems,
      user: req.user._id,
      tax,
      shippingPrice,
      totalPrice,
      payment: savedPayment._id,
      shippingAddress: savedShippingAddress._id,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();
    if (payment.status === "Processed") 
    {
  
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // Generate and save the PDF invoice
    const invoiceFilename = `invoice_${savedOrder._id}.pdf`;
    const invoicePath = path.join(__dirname, '..', 'invoices', invoiceFilename);

   // Create a PDF document with custom font settings
const pdfDoc = new PDFDocument({
  size: 'letter', // Page size (you can change this as needed)
  margins: { top: 50, bottom: 50, left: 50, right: 50 }, // Margins
  bufferPages: true, // Buffer pages for efficient PDF generation
  font: 'Helvetica-Bold', // Font family and style
});

// Pipe the PDF document to a writable stream
pdfDoc.pipe(fs.createWriteStream(invoicePath));

// Add order details to the PDF
pdfDoc.fontSize(14); // Font size for titles
pdfDoc.font('Helvetica-Bold'); // Bold font for titles

// Title
pdfDoc.text('Invoice', { align: 'center' });

// Section headers
pdfDoc.fontSize(12); // Font size for section headers
pdfDoc.font('Helvetica-Bold'); // Bold font for section headers

pdfDoc.text('Order Details');
pdfDoc.moveDown(); // Move down to separate sections

// Order details
pdfDoc.font('Helvetica'); // Regular font for order details

pdfDoc.text(`Order ID: ${savedOrder._id}`);
pdfDoc.text(`Order Date: ${savedOrder.createdAt}`);
pdfDoc.text(`Name: ${req.user.Name}`);
pdfDoc.text(`Shipping Address: ${savedShippingAddress.address}`);
pdfDoc.text(`Payment Method: ${payment.paymentMethod}`);
pdfDoc.text('Ordered Items:', { underline: true });

// Loop through the ordered items and add them to the PDF
pdfDoc.moveDown();
savedOrder.orderedList.forEach((item, index) => {
  pdfDoc.text(`${index + 1}. ${item.Name}`);
  pdfDoc.text(`   Quantity: ${item.qty}`);
  pdfDoc.text(`   Price: $${item.Price.toFixed(2)}`);
  pdfDoc.moveDown();
});


// Check if tax is defined and numeric
if (typeof calculatedTax === 'number' && !isNaN(calculatedTax)) {
  pdfDoc.text(`Tax: $${calculatedTax.toFixed(2)}`);
}

// Check if shippingPrice is defined and numeric
if (typeof calculatedShippingPrice === 'number' && !isNaN(calculatedShippingPrice)) {
  pdfDoc.text(`Shipping Price: $${calculatedShippingPrice.toFixed(2)}`);
}

// Check if totalPrice is defined and numeric
if (typeof calculatedTotalPrice === 'number' && !isNaN(calculatedTotalPrice)) {
  pdfDoc.text(`Total Price: $${calculatedTotalPrice.toFixed(2)}`);
}


// Add the copyright notice at the calculated position
const copyrightX = 50;
const copyrightY = pdfDoc.page.height - 50;

// Add the copyright notice at the bottom-center of the page
pdfDoc.fontSize(10)
  .fillColor('#888')
  .text('© 2023 DBMS Course Project By Santosh, Sai Suraj, Hemanth Sai.', {
    align: 'center',
    width: pdfDoc.page.width - 2 * copyrightX,
    lineGap: 35, // Adjust the line gap as needed for spacing
    height: 3*pdfDoc.page.height - copyrightY,
  });
// End the PDF document
pdfDoc.end();

const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail'
  auth: {
    user: '178r1a0579@cmrec.ac.in', // Your email address
    pass: 'rnrp hjdb xbvn mper'  },
});

const mailOptions = {
  from: '178r10579@cmrec.ac.in', // Sender's email address
  to: req.user.Email, // Recipient's email address (user who placed the order)
  // to:req.user.Email,
  subject: 'Invoice for your order', // Email subject
  text: 
  
  `Hello ${req.user.Name},
Thank you for your order.
  Please find attached the invoice for your order.`, // Email body
  attachments: [
    {
      filename: invoiceFilename, // Name of the attached file
      path: invoicePath, // Path to the PDF invoice file
    },
  ],
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

 } // Return the saved order as a response
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const singleorder = async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log(orderId);

    // Retrieve the order by ID
    const order = await Order.findById(orderId)
    .populate({
      path: 'payment',
      select: '-CVC', // Exclude the "CVC" field
    })      .populate({
        path: 'shippingAddress',
        model: 'ShippingAddress', // Name of the ShippingAddress model
      });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const payment = await Payment.findById(order.payment);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Decrypt the card number
    const decryptedCardNumber = decryptCardNumber(payment.CardNumber)

    // Convert the decrypted card number to a string
    const cardNumberString = decryptedCardNumber.toString();
    console.log(cardNumberString);    // Mask all but the last 4 digits
    const maskedCardNumber = '**** **** **** ' + cardNumberString.slice(-4);

    // Replace the card number in the payment object with the masked version
    order.payment.CardNumber = maskedCardNumber;
    
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const myorders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('payment', 'Payment')
      .populate('shippingAddress', 'ShippingAddress');

    // Check if the orders array is empty
    if (orders.length === 0) {
      // Respond with a message indicating no orders were found
      res.json({ message: "No orders" });
    } else {
      // Respond with the list of orders
      res.json(orders);
    }
  } catch (error) {
    console.log(error.message); // Corrected case for 'console'
    res.status(500).json("hello");
  }
};


const totalorders = async (req, res) => {
  try {
    if (!req.user.IsAdmin ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find({})
      .populate('user', 'Name')
      // .populate('shippingaddress')
      .populate('payment','-CardNumber');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteOrder = async (req, res) => {
  try {
    if (!req.user.IsAdmin && !req.user.IsSeller) {
      return res.status(403).json({ message: "Access denied" });
    }

    const order = await Order.findByIdAndDelete(req.params.id);
    if (order) {
      // Also delete the associated payment
      await Payment.deleteOne({ order: order._id });
      res.json("Order deleted");
    } else {
      res.status(404).json("Order not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deliveredorder = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (!req.user.IsAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Find the order by ID
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order is already delivered
    if (order.isDelivered) {
      return res.status(400).json({ message: "Order has already been delivered" });
    }

    // Retrieve payment details using the payment ID from the order
    if (order.payment) {
      const payment = await Payment.findById(order.payment);
      if (!payment) {
        return res.status(404).json({ message: "Payment details not found" });
      }

      // Check the payment status
      if (payment.status === 'Failed' || payment.status === 'Pending') {
        return res.status(400).json({ message: "Cannot mark as delivered because payment status is not processed" });
      }
    } else {
      return res.status(400).json({ message: "Order does not have payment details" });
    }

    // Mark as delivered and save
    order.isDelivered = true;
    order.deliveredDate = new Date();
    const updatedOrder = await order.save();
    
    // Return the updated order
    res.json("Customer Order is Delivered ");
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};




export { createOrder,singleorder,myorders,totalorders,deliveredorder,deleteOrder};
