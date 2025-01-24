
# E-COMMERCE USING NOSQL DATABASE(MONGODB)
We have developed the backend of E-commerce using MongoDB,Node.js and Express.js as a part of the coursework for the subject Database Management Systems.To make it user-centric we have made it secure and user friendly.We have included the hashing ,encrypting sensitive information and authentication for security and integrity.Along with the  security we have included features like invoice generation and e-mail notification to inform the users upon successful checkout.



### Prerequisites:

Before running the project, ensure the following prerequisites are met:

- **Node.js and npm**:
  - Install Node.js and npm from the [Node.js website](https://nodejs.org/).
  - The installation can be verified by running `node -v` and `npm -v` in the terminal or command prompt.

- **Postman**:
  - Install Postman from the [Postman website](https://www.postman.com/) for API testing.

- **Development Environment**:
  - Make sure that development environment supports JavaScript ES6 features and async/await syntax.

- **Project Dependencies**:
  - Run `npm install` in the project directory to install all dependencies which are listed in the `package.json`.
---
### How to Execute:

Follow the below steps to execute the project and generate data:

- **Navigate to Project Folder**:
  - Open a terminal or command prompt.
  - Navigate to the root directory of the project using the `cd` command.

- **Generating Fake Data for Other Models**:
  - To generate random data for models like products, reviews, shipping addresses, payments, etc., run `node FakeData.js` in the terminal.
  - Ensure that any existing connections to the database are closed before running this script. You can do this by pressing `Ctrl + C` in the terminal where your main application is running.
  - Once `FakeData.js` is executed, it will generate the data and store it in your MongoDB database.
  - Alongside storing in database, the script will also create respective CSV files for each model in the `CsvData` folder. These CSV files contain the generated data in a structured format.
  - After the data generation is complete and the data is stored in both the database and CSV files, you can terminate the `FakeData.js` script by pressing `Ctrl + C` in the terminal.

- **Start the Project**:
  - Execute the project by running `npm run start` in the terminal.
  - This command starts the server.


![Executing the Project](https://content.pstmn.io/a0681f5a-c69e-4a63-b013-d2e64303a9bf/U2NyZWVuc2hvdCAyMDIzLTEyLTEwIGF0IDUuMTAuMjHigK9QTS5wbmc=)
- **User Generation Prompt**:
  - After running the project, you will be prompted to enter the number of users to generate.
  - Enter a positive integer and press Enter to specify the number of users.

- **Automatic User Generation**:
  - The script will automatically generate the specified number of users with randomly generated details, including names, emails, and strong passwords.

- **Storing Users in Database**:
  - Generated users will be saved in the connected MongoDB database with hashed passwords for security.

- **CSV File Creation**:
  - In addition to database storage, a CSV file named `users.csv` will be created in the `CsvData` folder.
  - This file contains all user information, including unhashed passwords.

- **CSV File Content**:
  - The `users.csv` file includes columns for user names, emails, unhashed passwords, and roles (admin, seller).

### Postman for API Testing:
- In order to test the API endpoints of the project using postman,Open the postman application.

- Navigate to the Import button in the upper left corner of the Postman interface.

- We have two way to import the Postman collection in two ways:

- Drag and Drop: Open the folder where your project is located and find the PostmanCollection folder. Drag and drop the collection file(s) directly into the Postman window.
- Select Folder: In Postman, after clicking Import, choose Folder from the options, then Upload Folder. Navigate to the Project PostmanCollection folder and select it and then make sure all the 3 collections are checked.
- Click on import.
- After importing, the collections will appear in the left sidebar of Postman, under the Collections tab.
You can now click on any request in the collection to load it, and then send the request to test the various endpoints of your API.

---



### How to Use JWT Bearer Token:
1. Obtain the admin JWT token (typically provided upon admin login or authentication).
2. Enter the appropriate HTTP method and the endpoint URL.
3. In the request headers section, set the key to `Authorization`.
4. Set the prefix as `Bearer` , for the admin token.
5. Send the request to interact with the endpoint.
    

This setup ensures that only authorized users with admin privileges can access these endpoints, maintaining security and proper access control in your application.

It should look like this:
![JWT Bearer Token in Authorization Header](https://content.pstmn.io/3cf66096-a9b6-4a76-9536-ca126d156e7c/U2NyZWVuc2hvdCAyMDIzLTEyLTEwIGF0IDEuMDUuMzPigK9QTS5wbmc= )


When using PUT or POST requests to send data to your server via Postman, you need to specify the data in the request body.

---
### Admin Endpoints:

Admin token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NzRkMmQ4NTAwODUyYWM0N2U5ZDg0MyIsImlhdCI6MTcwMjIzMzc4MywiZXhwIjoxNzA0ODI1NzgzfQ.iSTCS9YWB7T-feS4ZEDugO-O11bUapnEijw3vzC2wvU`


For example, to log in as an admin, you would:

#### 1\. POST `/loginuser`

- **Description**: Authenticates user .
- **Usage**:
    - Method: Post
    - Endpoint: `http://localhost:8001/users/loginuser`
    - Enter the endpoint URL for logging in.
    - Go to the "Body" tab below the URL bar.
    - Select "raw" and then choose "JSON" from the dropdown menu.
    - Enter the user data in JSON format. For example:

``` json
{
    "Email":"orzotilo@sejagod.hm",
    "Password":"hWWluQv7R7l&"
}

 ```

- Click "Send" to make the POST request
    

#### 2\. GET `/allusers`

- **Description**: Retrieves a list of all users registered in the system.
- **Authorization**: Requires admin privileges.
- **Usage**:
    - Method: GET
    - Endpoint: `http://localhost:8001/users/allusers`
   -  Headers: Authorization: Bearer user_token(Replace admin_token with the any of the above admin tokens or the token generated after login)
#### 3\. DELETE `/delete/:id`

- **Description**: Deletes a user from the system based on the provided user ID.
- **Authorization**: Requires admin privileges.
- **Usage**:
    - Method: DELETE
    - Endpoint: `ttp://localhost:8001/users/delete/:id` (Replace `:id` with the user's ID)
 -  Headers: Authorization: Bearer user_token(Replace admin_token with the any of the above admin tokens or the token generated after login)
#### 4\. GET `/singleuser/:id`

- **Description**: Retrieves detailed information about a single user by user ID.
- **Authorization**: Requires admin privileges.
- **Usage**:
    - Method: GET
    - Endpoint: `http://localhost:8001/users/singleuser/:id` (Replace `:id` with the user's ID)
 -  Headers: Authorization: Bearer user_token(Replace admin_token with the any of the above admin tokens or the token generated after login)
#### 5\. PUT `/updateuser/:id`

- **Description**: Updates the details of a user identified by user ID.
- **Authorization**: Requires admin privileges.
- **Usage**:
    - Method: PUT
    - Endpoint: `http://localhost:8001/users/updateuser/:id` (Replace `:id` with the user's ID)
 -  Headers: Authorization: Bearer user_token(Replace admin_token with the any of the above admin tokens or the token generated after login)    - Go to the "Body" tab below the URL bar.
    - Select "raw" and then choose "JSON" from the dropdown menu.

``` json
  {  "Name":"updated name"}

 ```

- Click "Send" to make the PUT request
    

#### 6\. GET `/totalorders`

- **Description**: Fetches the total number of orders placed in the system.
- **Authorization**: Requires admin privileges.
- **Usage**:
    - Method: GET
    - Endpoint: `http://localhost:8001/orders/totalorders`
 -  Headers: Authorization: Bearer user_token(Replace admin_token with the any of the above admin tokens or the token generated after login)
#### 7\. DELETE `/delete/:id`

- **Description**: Deletes an order based on the provided order ID.
- **Authorization**: Requires admin privileges.
- **Usage**:
    - Method: DELETE
    - Endpoint: `http://localhost:8001/orders/delete/:id` (Replace `:id` with the order's ID)
 -  Headers: Authorization: Bearer user_token(Replace admin_token with the any of the above admin tokens or the token generated after login)
#### 8\. PUT `/delivered/:id`

- **Description**: Updates an order's status to 'delivered' based on the order ID.
- **Authorization**: Requires admin privileges.
- **Usage**:
    - Method: PUT
    - Endpoint: `http://localhost:8001/orders/delivered/:id` (Replace `:id` with the order's ID)
 -  Headers: Authorization: Bearer user_token(Replace admin_token with the any of the above admin tokens or the token generated after login)
#### 9\. GET `/:id`

- **Description**: Retrieves detailed information about a single order by order ID.
- **Authorization**: Requires admin privileges.
- **Usage**:
    - Method: GET
    - Endpoint: `http://localhost:8001/orders/:id` (Replace `:id` with the order's ID)
 -  Headers: Authorization: Bearer user_token(Replace admin_token with the any of the above admin tokens or the token generated after login)
 ---
   ### Seller Endpoints
Seller token- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NzRkMmQ4NTAwODUyYWM0N2U5ZDg0NiIsImlhdCI6MTcwMjM2NzAyMiwiZXhwIjoxNzExMDA3MDIyfQ.8l-ekwjzD7_QoZslI6X6T8BWwILRqBkKuUC67Dsu25U`



#### 1\. POST `/create`

- **Description**: Allows a seller to create a new product.
- **Authorization**: Requires seller authentication.
- **Usage**:
    - Method: POST
    - Endpoint: \``http://localhost:8001/products/create`\`
    - Headers: Authorization: Bearer user_token(Replace seller_token with the any of the above user tokens or the token generated after login)

``` json
{
  "Name": "UltraHD 8K Television",
  "Img": "http://example.com/images/ultrahd-4k-tv.jpg",
  "Category": "Electronics",
  "Description": "A 65-inch UltraHD 4K television with HDR support and smart features.",
  "Brand": "Techie",
  "Price": 1499.99,
  "Size": "65 inches",
  "Color": "Black",
  "CountInstock": 25
}

 ```

#### 2\. GET `/allseller`

- **Description**: Retrieves all products published by the authenticated seller.
- **Authorization**: Requires seller authentication.
- **Usage**:
    - Method: GET
    - Endpoint: `http://localhost:8001/products/allseller`
    - Headers: Authorization: Bearer user_token(Replace seller_token with the any of the above user tokens or the token generated after login)

#### 3\. GET `/sellerpublished/:id`

- **Description**: Fetches details of a single published product by its ID, accessible only to the seller who published it.
- **Authorization**: Requires seller authentication.
- **Usage**:
    - Method: GET
    - Endpoint: `http://localhost:8001/products/sellerpublished/:id` (Replace `:id` with the product's ID)
    - Headers: Authorization: Bearer user_token(Replace seller_token with the any of the above user tokens or the token generated after login)

#### 4\. DELETE `/delete/:id`

- **Description**: Allows a seller to delete one of their published products using the product's ID.
- **Authorization**: Requires seller authentication.
- **Usage**:
    - Method: DELETE
    - Endpoint: `http://localhost:8001/products/delete/:id` (Replace `:id` with the product's ID)
    - Headers: Authorization: Bearer user_token(Replace seller_token with the any of the above user tokens or the token generated after login)

#### 5.PUT `/update/:id`

- **Description**: Allows a seller to update details of an existing product identified by the product's ID.
- **Authorization**: Requires seller authentication.
- **Usage**:
    - Method: PUT
    - Endpoint: /update/:id (Replace :id with the product's ID you want to update)
    - Headers: Authorization: Bearer
    - Body: JSON data containing the updated product details as displayed below

``` json
 {
        "Name": "UltraHD 8K qhd+ tv",
        "Brand": "Techie",
        "Price": 3499.99,
        "CountInstock": 15
    }

 ```
---
### User Endpoints
 Few User tokens-

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NzYxNjczNDIwOGU4YzIyMTM1YjQyZiIsImlhdCI6MTcwMjIzNzgxMiwiZXhwIjoxNzA0ODI5ODEyfQ.rCMmSKBXD0U5EMXxbDyIYfExt7HhcIp_wLwpZ7aOnRA`

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NzYxODZlNDIwOGU4YzIyMTM1YjQ0NiIsImlhdCI6MTcwMjIzODMxOSwiZXhwIjoxNzA0ODMwMzE5fQ.8JQ3styCHPKfM0OAlzDeIcKtDjcLeUBhmPP1GYnvpc4`

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NzRkMmRhNTAwODUyYWM0N2U5ZDg0ZiIsImlhdCI6MTcwMjIzODQ4MSwiZXhwIjoxNzA0ODMwNDgxfQ.OtWzT7W96mwZo_IVHlOG9p80PML3z3z_8XePygZR3iQ`




#### 1\. GET `/`

- **Description**: Fetches a list of all products.
- **Authorization**: No authentication required.
- **Usage**:
    - Method: GET
    - Endpoint: `http://localhost:8001/products/`

#### 2\. GET `/:id`

- **Description**: Retrieves detailed information about a single product by product ID.
- **Authorization**: No authentication required.
- **Usage**:
    - Method: GET
    - Endpoint: `http://localhost:8001/products/:id` (Replace `:id` with the product's ID)

#### 3\. POST `/:productId/reviews`

- **Description**: Adds a review for a specific product.
- **Authorization**: Requires user authentication.
- **Usage**:
    - Method: POST
    - Endpoint: `http://localhost:8001/products/:ProductId/reviews` (Replace `:productId` with the product's ID)
    - Headers: Authorization: Bearer user_token(Replace user_token with the any of the above user tokens or the token generated after registration or login)
    - Body: JSON data containing review details as below

``` json
{
    "rating":5,
    "comment":"good product"
}

 ```

#### 4\. POST `/loginuser`

- **Description**: Authenticates a user and provides a JWT token for subsequent requests.
- **Authorization**: No authentication required for login itself.
- **Usage**:
    - Method: POST
    - Endpoint: `http://localhost:8001/users/loginuser`
    - Body: JSON data with user credentials as displayed below

``` json
{
    "Email": "atozas@ugucef.gh",
    "Password": "SXWWf#HSq1TM"
}

 ```

#### 5\. GET `/userprofile`

- **Description**: Retrieves the profile information of the authenticated user.
- **Authorization**: Requires user authentication.
- **Usage**:
    - Method: GET
    - Endpoint: `http://localhost:8001/users/userprofile`
    - Headers: Authorization: Bearer user_token(Replace user_token with the any of the above user tokens or the token generated after registration or login)

#### 6\. POST `/`

- **Description**: Creates a new order.
- **Authorization**: Requires user authentication.
- **Usage**:
    - Method: POST
    - Endpoint: `http://localhost:8001/orders/`
    - Headers: Authorization: Bearer user_token(Replace user_token with the any of the above user tokens or the token generated after registration or login)
    - Body: JSON data containing order details

``` json
{
    "orderedList": [
        {
            "product": "6574d65821f714fa3fe75d7c",
            "qty": 2
        },
        {
            "product": "6574d65821f714fa3fe75d7e",
            "qty": 10
        }
    ],
    "shippingAddress": {
        "address": "123 Main St",
        "city": "Exampleville",
        "postalCode": "12345",
        "country": "United States"
    },
    "payment": {
        "amount": 2000,
        "paymentMethod": "Credit",
        "status": "Processed",
        "CardNumber": 1234567890876543,
        "CVC": "1786",
        "ExpirationDate": "08/28"
    }
}

 ```

#### 7\. GET `/myorders`

- **Description**: Retrieves a list of orders placed by the authenticated user.
- **Authorization**: Requires user authentication.
- **Usage**:
    - Method: GET
    - Endpoint: `http://localhost:8001/orders/myorders`
    - Headers: Authorization: Bearer user_token(Replace user_token with the any of the above user tokens or the token generated after registration or login)

#### 8\. POST `/Registration`

- **Description**: Registers a new user.
- **Authorization**: No authentication required for registration.
- **Usage**:
    - Method: POST
    - Endpoint: `http://localhost:8001/users/registration`
    - Body: JSON data with user registration details

``` json
{
    "Name":"Sample User3",
    "Email":"temp@gmail.com",
    "Password":"1234@Password"
}

 ```
---
### NOTE: 
If you are getting "Not Authorized "error it is because of the expired jwt token.Inorder to avoid this please login by providing the credentials (E-mail and Password) which are provided in the users.csv and copy the token  .You can refer to the ## How to use JWT Bearer Token for detailed information on how to use the jwt token 
