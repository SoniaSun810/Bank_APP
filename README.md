# Set up the Bank App
## Step 1: Pull the repo and set environment variables
1. Pull the repo from https://github.com/SoniaSun810/Bank_APP
2. `cd frontend && npm install` to add the neccessary dependencies for the frontend
3. Open a new terminal tab and `cd backend && npm install` to add the neccessary dependencies for the backend
4. In the `backend` directory create a `.env` file and include the following (your password refers to your MYSQL server password):
```
MYSQL_HOST='127.0.0.1'
MYSQL_USER='root'
MYSQL_PASSWORD='your password'
MYSQL_DATABASE='bank_app'
SECRET_KEY='123456'
```

## Step 2: Set up the MySQL database
1. Run MySQL server on your local device
2. Open a terminal (macOS, Linux) or command prompt (Windows) and connect to your MySQL.

```
mysql -u your_username -p
```
3. Replace your_username with your actual MySQL username(`root`). You will be prompted to enter your password.
4. Copy the path of `backend/schema.sql` and replace `your_sql_file.sql` with this path in following command to set up the database.
```
SOURCE your_sql_file.sql;
```
5. Use following command to verify the `bank_app` database is set up successfully. 
```
mysql> SHOW DATABASES;
mysql> USE bank_app;
mysql> SHOW TABLES;
```
## Step 3: Run the Bank App locally
1. The frontend needs to run separately from the backend so in the `backend` directory run `npm run dev` to start the server
2. In the `frontend` directory run `npm start`
