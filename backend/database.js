import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config()

export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true, // Enables multiple statements at once
}).promise();


const rows = await pool.query(`
    SELECT *
    FROM accounts
`);
// console.log(rows);

// get all accounts
export async function getAccounts() {
    try {
        const [rows] = await pool.query("SELECT * FROM accounts");
        return rows;
    }
    catch (error) {
        console.error(`Error occurred while fetching accounts: ${error.message}`);
        throw error; // rethrow the error to handle it in the calling function or middleware
    }
}

// get a user by the username
export async function getAccount(username) {
    try {
        const query = `SELECT * FROM accounts WHERE username = '${username}'`;
        const [rows] = await pool.query(query);
        return rows[0];
    } catch (error) {
        console.error(`Error occurred while fetching account: ${error.message}`);
        throw error; // rethrow the error to handle it in the calling function or middleware
    }
  }
  

// get a user by the username
// export async function getAccount(username) {
//     // do input checking for username

//     const [rows] = await pool.query(`
//         SELECT *
//         FROM accounts
//         WHERE username = ?
//     `, [username]);

//     return rows[0];
// }

// add account
export async function createAccount(username, password, balance=0) {
    try {
        const [rows] = await pool.query(`
            INSERT INTO accounts (username, password, balance)
            VALUES (?, ?, ?);
        `, [username, password, balance]);
        return rows[0];
    }
    catch (error) {
        console.error(`Error occurred while creating account: ${error.message}`);
        throw error; // rethrow the error to handle it in the calling function or middleware
    }
}

// create transaction
export async function createTransaction(accountId, amount) {
    try {
        const [rows] = await pool.query(`
            INSERT INTO transactions (account_id, amount)
            VALUES (?, ?);
        `, [accountId, amount]);
        return rows[0];
    }
    catch (error) {
        console.error(`Error occurred while creating transaction: ${error.message}`);
        throw error; // rethrow the error to handle it in the calling function or middleware
    }
}

// get transactions of one account
export async function getTransactions(account_id) {
    try {
        const [rows] = await pool.query(`
            SELECT *
            FROM transactions
            WHERE account_id = ?
        `, [account_id]);
        return rows;
    } catch (error) {
        console.error(`Error occurred while fetching transactions: ${error.message}`);
        throw error; // rethrow the error to handle it in the calling function or middleware
    }
}

// update balance
export async function updateBalance(username, amount){
    try {
        const [rows] = await pool.query(`
            UPDATE accounts
            SET balance = ? 
            WHERE username = ?;
        `, [amount, username]);
        return rows[0];
    } catch (error) {
        console.error(`Error occurred while updating balance: ${error.message}`);
        throw error; // rethrow the error to handle it in the calling function or middleware
    }
}

// delete account
export async function deleteAccount(username) {
    try {
        // DELETE FROM transactions WHERE account_id = (SELECT account_id FROM accounts WHERE username = 'soniasun');

        await pool.query(`
            DELETE FROM transactions
            WHERE account_id = (
                SELECT id
                FROM accounts
                WHERE username = ?;
                `, [username]);

        const [rows] = await pool.query(`
            DELETE FROM accounts
            WHERE username = ?;
        `, [username]);
        return rows[0];
    }
    catch (error) {
        console.error(`Error occurred while deleting account: ${error.message}`);
        throw error; // rethrow the error to handle it in the calling function or middleware
    }
}

