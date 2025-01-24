import mongoose from 'mongoose';
import casual from 'casual';
import User from './Models/UserModel.js'; 
import Product from './Models/ProductModel.js'; 
import Review from './Models/ReviewModel.js'; 
import Order from './Models/OrderModel.js'; 
import Payment from './Models/PaymentModel.js'; 
import ShippingAddress from './Models/ShippingModel.js'; 
import fs from 'fs';
import { Parser } from 'json2csv';
import crypto from 'crypto';

const url = 'mongodb+srv://SAN3005:SAN3005@cluster0.9coqr.mongodb.net/Project?authSource=admin&replicaSet=atlas-mfdnmj-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
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
const generateProducts = async (sellerUsers, numProducts) => {
    let products = [];

    for (let i = 0; i < numProducts; i++) {
        const sellerIndex = casual.integer(0, sellerUsers.length - 1);
        const sellerUser = sellerUsers[sellerIndex];

        const productData = {
            Name: casual.title,
            Img: casual.url,
            Category: casual.word,
            Description: casual.description,
            Brand: casual.company_name,
            Price: Number(casual.double(0, 1000).toFixed(2)), // Rounded to 2 decimal points
            Size: casual.random_element(['S', 'M', 'L', 'XL']),
            Color: casual.color_name,
            CountInstock: casual.integer(0, 100),
            sellerId: sellerUser._id, // Ensure that sellerId is correctly set
        };

        const product = new Product(productData);

        try {
            await product.save();
            products.push(product);
        } catch (error) {
            console.error('Error saving product:', error);
        }
    }

    return products;
};


const generateReviews = async (products, regularUsers, desiredReviewCount) => {
    let reviews = [];
    let reviewCount = 0;

    // Create a map to track which products each user has reviewed
    const userProductReviews = new Map();

    while (reviewCount < desiredReviewCount) {
        for (const product of products) {
            for (const regularUser of regularUsers) {
                // Generate a unique key for user-product combination
                const key = `${regularUser._id}-${product._id}`;

                // Check if the user has already reviewed this product
                if (!userProductReviews.has(key) && reviewCount < desiredReviewCount) {
                    try {
                        const review = new Review({
                            user: regularUser._id,
                            product: product._id,
                            rating: casual.integer(1, 5),
                            comment: casual.description,
                        });

                        await review.save();

                        // Mark this product as reviewed by the user
                        userProductReviews.set(key, true);

                        // Add the review ID to the product's reviews array
                        product.reviews.push(review._id);
                        await product.save();

                        reviews.push(review);
                        reviewCount++;
                    } catch (error) {
                        // Handle parallel save error gracefully
                        console.error(`Error saving review for product ${product._id} by user ${regularUser._id}: ${error.message}`);
                    }
                }
            }
        }
    }

    return reviews;
};





const generateShippingAddresses = async (num) => {
    let shippingAddresses = [];

    for (let i = 0; i < num; i++) {
        const shippingAddress = new ShippingAddress({
            address: casual.street,
            city: casual.city,
            postalCode: casual.zip(5),
            country: casual.country,
        });

        shippingAddresses.push(shippingAddress.save());
    }

    return Promise.all(shippingAddresses);
};

const generatePayments = async (num, products) => {
    let payments = [];

    for (let i = 0; i < num; i++) {
        // Simulate the total amount calculation for an order
        let totalAmount = 0;
        const numItems = casual.integer(1, 5);
        for (let j = 0; j < numItems; j++) {
            const productIndex = casual.integer(0, products.length - 1);
            const product = products[productIndex];
            const quantity = casual.integer(1, 10);
            totalAmount += product.Price * quantity;
        }

        // Calculate tax and shipping
        const tax = totalAmount * 0.10; // 10% tax
        const shippingPrice = totalAmount * 0.05; // 5% shipping price
        const totalPrice = totalAmount + tax + shippingPrice;

        // Manually generate a future date for ExpirationDate
        const currentDate = new Date();
        const futureYear = currentDate.getFullYear() + 1; // Setting it to one year in the future
        const futureMonth = currentDate.getMonth() + 1; // Current month
        const expirationDate = `${futureMonth < 10 ? '0' : ''}${futureMonth}/${futureYear.toString().slice(2)}`;
        const encryptedCardNumber = encryptCardNumber(casual.card_number());

        const payment = new Payment({
            amount: Number(totalAmount.toFixed(2)),
            paymentMethod: casual.random_element(['Credit', 'Debit']),
            CardNumber: encryptedCardNumber,            CVC: casual.card_cvv,
            ExpirationDate: expirationDate,
            tax: Number(tax.toFixed(2)),
            shippingPrice: Number(shippingPrice.toFixed(2)),
            totalPrice: Number(totalPrice.toFixed(2)),
            status: casual.random_element(['Pending', 'Processed', 'Failed']),
        });

        payments.push(payment.save());
    }

    return Promise.all(payments);
};



const generateOrders = async (regularUsers, products, shippingAddresses, payments, numOrders) => {
    let orders = [];

    // Shuffle the array of payments to randomize the assignment to orders
    const shuffledPayments = payments.sort(() => 0.5 - Math.random());

    // Shuffle the array of shippingAddresses to randomize the assignment to orders
    const shuffledShippingAddresses = shippingAddresses.sort(() => 0.5 - Math.random());

    // Ensure there are enough payments and shipping addresses for the number of orders
    if (numOrders > shuffledPayments.length || numOrders > shuffledShippingAddresses.length) {
        throw new Error('Not enough payments or shipping addresses for the number of orders.');
    }

    for (let i = 0; i < numOrders; i++) {
        const userIndex = casual.integer(0, regularUsers.length - 1);
        const regularUser = regularUsers[userIndex];

        const orderedList = [];
        const numItems = casual.integer(1, 5);
        for (let j = 0; j < numItems; j++) {
            const productIndex = casual.integer(0, products.length - 1);
            const product = products[productIndex];
            orderedList.push({
                Name: product.Name,
                Img: product.Img,
                qty: casual.integer(1, 10),
                Price: product.Price,
                product: product._id,
            });
        }

        // Pop a shipping address from the shuffled array
        const shippingAddress = shuffledShippingAddresses.pop();

        // Pop a payment from the shuffled array
        const payment = shuffledPayments.pop();

        const isDelivered = payment.status === 'Processed' ? casual.boolean : false;

        const order = new Order({
            user: regularUser._id,
            orderedList: orderedList,
            payment: payment._id, // Assign the unique payment ID to the order
            shippingAddress: shippingAddress._id,
            isDelivered: isDelivered,
            deliveredDate: isDelivered ? new Date(casual.date('YYYY-MM-DD')) : null,
        });

        orders.push(order.save());
    }

    return Promise.all(orders);
};


const saveToCsv = async (data, filename) => {
    const parser = new Parser();
    const csv = parser.parse(data);
    await fs.promises.writeFile(filename, csv);
};

(async () => {
    try {
        const sellerUsers = await User.find({ IsSeller: true });
        const regularUsers = await User.find({ IsAdmin: false, IsSeller: false });

        const products = await generateProducts(sellerUsers,100);
        const reviews = await generateReviews(products, regularUsers,100);
        const shippingAddresses = await generateShippingAddresses(100);
        const payments = await generatePayments(100, products);
        const orders = await generateOrders(regularUsers, products, shippingAddresses, payments,100);

        // Export to CSV
      // Update the file paths with the "CsvData" folder
await saveToCsv(await Promise.all(products.map(p => p.toObject())), './CsvData/products.csv');
await saveToCsv(await Promise.all(reviews.map(r => r.toObject())), './CsvData/reviews.csv');
await saveToCsv(await Promise.all(shippingAddresses.map(s => s.toObject())), './CsvData/shippingAddresses.csv');
await saveToCsv(await Promise.all(payments.map(p => p.toObject())), './CsvData/payments.csv');
await saveToCsv(await Promise.all(orders.map(o => o.toObject())), './CsvData/orders.csv');


        console.log("Data seeding completed and saved to CSV files.");
    } catch (error) {
        console.error("Error during data seeding:", error);
    } finally {
        mongoose.connection.close();
    }
})();
    
