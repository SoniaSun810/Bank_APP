import mysql from 'mysql2';

import * as dotenv from 'dotenv';
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

// get all accounts
export async function getAccounts() {
    const [rows] = await pool.query("SELECT * FROM accounts");
    return rows;
}

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