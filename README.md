# Set up the Bank App
## Step 1: Pull the repo and set environment variables
1. Pull the repo from https://github.com/SoniaSun810/Bank_APP
3. cd run `npm install` to add the neccessary dependencies
```
npm install
```
3. Set up your .env file
```
MYSQL_HOST='127.0.0.1'
MYSQL_USER='root'
MYSQL_PASSWORD='your password'
MYSQL_DATABASE='bank_app'
SECRET_KEY='your secret key'
```

## Step 2: Set up the MySQL database
1. Run MySQL server on your local device
2. Open a terminal (macOS, Linux) or command prompt (Windows) and connect to your MySQL.

```
mysql -u your_username -p
```
3. Replace your_username with your actual MySQL username(`root`). You will be prompted to enter your password.
4. Copy the path of `schema.sql` and replace `your_sql_file.sql` with this path in following command to set up the database.
```
SOURCE your_sql_file.sql;
```
5. Use following command to verify the web_app database is set up successfully. 
```
mysql> SHOW DATABASES;
mysql> USE bank_app;
mysql> SHOW TABLES;
```
## Step 3: Run the Bank App locally
1. use npm command to run the Bank App
```
// run the app in development mode
npm run app_dev
// run the app
npm run app
```
