# Northcoders News API

Link to the hosted version - https://benggs-nc-news.onrender.com/api/

Summary: This is a backend of a reddit style news site, allowing users to write articles, comment and vote on other articles and vote on other comments as well. The user is also able to filter and sort articles with pagination enabled. The project uses a postgres database using an express.js server and currently has 13 endpoints, which are described at - https://benggs-nc-news.onrender.com/api/ 

Minimum requirements:

node version: v20.8.1
postgreSQL version: v15

Instructions to configure the process environments:

1. ensure the package 'dotenv' is installed.
2. create two .env files one called - .env.development and one called - .env.test
3. Within the development file write the line - PGDATABASE=nc_news
4. Within the test file write the line - PGDATABASE=nc_news_test
You should now have access to the relevant databases!

Instructions to run the project:

1. clone the project - 'git clone https://github.com/beng355826/NorthCoders-News-API.git'
2. run 'npm install' to install developer and production dependencies. 
3. Ensure PostgreSQL is downloaded and running on your machine.
4. Run 'npm run setup-dbs' - this will create a local database
5. Run 'npm run seed' - this will seed the newly created database with development data.
6. The project should now be successfully installed and configured! Run 'npm run test app.test.js' to test the endpoints. Have fun!








