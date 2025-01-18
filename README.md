# Barber App

# This was a school project, in which we had to make a full stack web app. I chose to create a barber app.

## Requirements

Make sure you have the following installed:

- [NodeJS](https://nodejs.org)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

## Front-end

### Setup

Navigate to the front-end:

    cd frontend (or ../frontend if you are in backend)

Install the necessary dependencies:

    npm install

Create a `.env` file with the API URL that will be used by Vite with the following content:

    VITE_API_URL="http://localhost:9000/api"

### Starting

#### Development

Make sure the `.env` file is present.  
Start the front-end with:

    npm run dev

The front-end will run on port 5173 by default.

#### Production

Make sure the `.env` file is present.  
Build the app with the `npm run build` command.  
Serve the generated `dist` folder with a static service like Apache or Nginx.

### Testing

Run the following command to execute the tests. Make sure both the front-end and back-end are running when you execute the tests.

    npm run test

You can also run the tests in the Cypress GUI, which can be opened with:

    npm run cypress

## Back-end

### Setup

Navigate to the back-end:

    cd backend (or ../backend if you are in frontend)

Install the necessary dependencies:

    npm install

Create a `.env` file with the following content:

    NODE_ENV=development
    DATABASE_URL=mysql://<USERNAME>:<PASSWORD>@localhost:3306/<DATABASE_NAME>
    AUTH_JWT_SECRET=<YOUR-JWT-SECRET>

Run the following command to initialize and seed the database. Make sure this database does not already exist:

    npm run initdb

### Starting

#### Development

Make sure the `.env` file is present.  
Start the back-end with:

    npm run dev

The back-end will run on port 9000 by default.

#### Production

Make sure the `.env` file is present.  
Build the app with the `npm run build` command.  
Start the back-end with:

    npm start

The back-end will run on port 9000 by default.

### Testing

Create a `.env.test` file with the following content:

    NODE_ENV=testing
    DATABASE_URL=mysql://<USERNAME>:<PASSWORD>@localhost:3306/<TEST_DATABASE_NAME>

Run the following command to initialize the test database. Make sure this database does not already exist:

    npm run inittestdb

Run the following command to execute the tests:

    npm run test
