# Set up the Bank App
## Step 1: Pull the repo 
## Step 2: Set up the MySQL database
1. Run MySQL server on your local device
2. Open a terminal (macOS, Linux) or command prompt (Windows) and connect to your MySQL.

```
mysql -u your_username -p
```
3. Replace your_username with your actual MySQL username(`root`). You will be prompted to enter your password.
4. Copy the path of `backend/schema.sql` and replace `your_sql_file.sql` in following command to set up the database.
```
SOURCE your_sql_file.sql;
```
5. Use following command to verify the web_app database is set up successfully. 
```
mysql> SHOW DATABASES;
mysql> USE bank_app;
mysql> SHOW TABLES;
```
