import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config()

export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise();


const rows = await pool.query(`
    SELECT *
    FROM accounts
`);
console.log(rows);

// get all accounts
export async function getAccounts() {
    const [rows] = await pool.query("SELECT * FROM accounts");
    return rows;
}

/* BAD CODE
query: SELECT * FROM accounts WHERE username = 'admin' OR 1=1; -- ' AND password = 'password'

*/

// get a user by the username
export async function getAccount(username) {
    // do input checking for username

    const [rows] = await pool.query(`
        SELECT *
        FROM accounts
        WHERE username = ?
    `, [username]);

    return rows[0];
}

// add account
export async function createAccount(username, password) {
    // validate input and hash password

    await pool.query(`
        INSERT INTO accounts (username, password)
        VALUES (?, ?);
    `, [username, password]);

    return getAccount(username);
}

// create transaction
export async function createTransaction(accountId, amount) {
    // validate input
    await pool.query(`
        INSERT INTO transactions (account_id, amount)
        VALUES (?, ?);
    `, [accountId, amount]);
}

// get transactions of one account
export async function getTransactions(account_id) {
    // validate input

    const [rows] = await pool.query(`
        SELECT *
        FROM transactions
        WHERE account_id = ?
    `, [account_id]);

    return rows;
}

export async function updateBalance(username, amount){
    const [rows] = await pool.query(`
        UPDATE accounts
        SET balance = ? 
        WHERE username = ?;
    `, [amount, username]);
}