# Product Inventory Management API
This project is a NestJS-based product inventory management API that provides functionalities to manage products, including adding, updating, deleting products, as well as event logging and pagination.

## Table of Contents
Project Setup
Database Configuration
API Endpoints
Product Routes
Event Log Routes
Testing the API
Event Logging
Pagination
Handling Database Errors
Project Setup
Prerequisites
Node.js (v16 or higher)
npm or yarn
PostgreSQL (or any supported SQL database)
Installation
Clone the repository:

Copy code
```bash
git clone https://github.com/your-username/inventory-management-api.git
cd inventory-management-api
```

## Install the dependencies:

```bach
npm install
# or using yarn
yarn install
```
Set up the .env file: Create a .env file in the root directory and provide the required environment variables for the database connection.

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=product_db
```

Run database migrations (if applicable):


```bash
npm run migration:run
```

## Start the application:

```bash
npm run start:dev
``` 

The API will now be running at http://localhost:3000.


```python
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Product, EventLog],
  synchronize: true, // For dev only; use migrations for production
});
```

Ensure that your PostgreSQL instance is running, and the credentials match the ones in your .env file.

# API Endpoints

## Product Routes

Method	Endpoint	Description
```bash
GET	/product	Fetch all products
GET	/product?limit=value&offset=value	fetch paginated products
GET	/product/:id	Fetch a specific product by ID
GET /product/category?name=value fetch products by category name
GET /product/quantity?qty=value&check=value fetch filter products
POST	/product	Add a new product
PUT	/product/:id	Update a product by ID
DELETE	/product/:id	Delete a product by ID
```

## Event Log Routes
Method	Endpoint	Description
```bash
GET	/event-log	Fetch all event logs
GET	/event-log/:id	Fetch event-logs for a particular product
``` 

## Testing the API
You can test the API using tools like Postman or curl. Below are some example requests:

## Add a Product

```bash
POST /products
Content-Type: application/json

{
  "name": "Product A",
  "quantity": 10,
  "category": "CategoryA"
}
```

Update a Product

```bash
PUT /products/:id
Content-Type: application/json

{
  "name": "Updated Product",
  "quantity": 15,
  "category": "CategoryB"
}
```

Delete a Product

```bash
DELETE /products/:id
```

Get Paginated Products

```bash
GET /products?offset=1&limit=10
```

Get products by Category

```bash
GET /products/category?name=CategoryB
```

## Event Logging
The system tracks events whenever a product is:

```bash
Added
Updated
Deleted
```

These logs are stored in the EventLog table along with a timestamp. You can access these logs using the /event-logo endpoint.

## Pagination
The /products endpoint supports pagination using the limit and offset query parameters:

limit: The maximum number of products to return.
offset: The number of products to skip before starting to return results.
Example:

```bash
GET /products?limit=10&offset=0
```

## Handling Database Errors
The application handles database errors, such as:

## Duplicate product names
Violating database constraints (e.g., quantity >= 0)
Errors are handled in the handleDbErrors method within the service layer. Custom error messages are returned based on the error code, ensuring user-friendly responses.

## License
This project is licensed under the MIT License.