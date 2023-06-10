import express from 'express';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';

import { getAccounts, getAccount, createAccount, getTransactions, createTransaction, updateBalance, deleteAccount } from './database.js';
// import { verifyToken } from './middleware.js';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cors from 'cors';

dotenv.config();


const app = express();
const SECRET_KEY = process.env.SECRET_KEY;

app.use(express.json());
app.use(cors());

// Create a rate limiter with a maximum of 3 requests per 1 minutes
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 3,
  message: "Too many requests from this IP, please try again later."
});

// gets all the accounts
app.get('/accounts', async (req, res) => {
    const accounts = await getAccounts();
    if (accounts == null) {
        res.status(404).json({ message: 'No accounts found' });
    }
    res.status(200).json(accounts);
});

//endpoint 1 - Register - Fixed code
//creates an account using a username and hashed password
app.post('/account', async (req, res) => {
    // validate username and password format
    const username = req.body.username;
    const password = req.body.password;

    const validFormat = /^[_\-.0-9a-z]{1,127}$/;

    if (!validFormat.test(username) || !validFormat.test(password)) {
        return res.status(400).json({ message: 'Invalid format for username or password' });
    }

    const validNumberFormat = /^(0|[1-9][0-9]*)(\.[0-9]{1,2})?$/;
    const numberInput = req.body.balance;

    // Check if input balance is valid
    if (!validNumberFormat.test(numberInput)) {
        return res.status(400).json({ message: 'Invalid number format' });
    }

    // validate username is unique
    const user = await getAccount(username);
    if(user != null){
        return res.status(400).json({ message: 'Username already exists' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const balance = numberInput;

        await createAccount(username, hashedPassword, balance);
        // send back the token
        const payload = { username };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '5min' });

        res.status(200).json({ message : 'Register successful', access_token: token, expires_in: 300 });
       
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


//endpoint 1 - Register - vulnerable code 
//creates an account using a username and hashed password
// app.post('/account', async (req, res) => {
//     // validate username
//     const user = await getAccount(req.body.username);
//     if(user != null){
//         return res.status(400).json({ message: 'Username already exists' });
//     }

//     try {
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);
//         const username = req.body.username;
//         const password = hashedPassword;
//         const balance = req.body.balance;

//         const newUser = await createAccount(username, password, balance);
//         // send back the token
//         const payload = { username };
//         const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

//         res.status(200).json({ message : 'Register successful', access_token: token, expires_in: 3600 });
       
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


// endpoint 2 - Login - Fixed code
// gets account using the username and verifies that the user exists and the password matches
// responds with a JWT token
app.post('/account/login', apiLimiter, async (req, res) => {
    // validate username and password
    const username = req.body.username;
  
    const user = await getAccount(req.body.username);

    if(user == null){
        // res.status(401).json({ message: 'Account does not exist for user: ' + username }); 
        res.status(401).json({ message: 'Invalid password or username' });
       }
    
    try {
        if(await bcrypt.compare(req.body.password, user.password)){
            const payload = { username };
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '5min' });
           res.status(200).json({ message : 'Login successful', access_token: token, expires_in: 300 });
            // res.status(200).json({ message : 'Login successful', access_token: token, expires_in: 3600 });
            // redirect to homepage
        } else {
            // res.status(401).json({ message: 'Invalid password for user: ' + username });
            res.status(401).json({ message: 'Invalid password or username' });
        }
    } catch (error) {
        res.status(500).send();
    }
});

// helper function to verify the token
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
  
    if (authHeader) {
      const token = authHeader.split(' ')[1];
  
      jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json({ message: 'Authorization header is missing' });
    }
  }

// endpoint 3 - Query Balance
// query balance
app.post('/account/balance', verifyToken, async(req, res) => {
    // Your protected route logic here
    const username = req.body.user;
    const account = await getAccount(username);
    if (account == null) res.status(400).json({ message: 'Account does not exist' });
    console.log(account);
    const currBalance = account.balance;
    res.status(201).json({message: `Your balance is ${currBalance}`, balance: currBalance})
});

// endpoint 4 - Deposit Money - Fixed code
// Deposites money into the account
app.post('/account/deposit', verifyToken, async(req, res) => {

    const validNumberFormat = /^(0|[1-9][0-9]*)(\.[0-9]{1,2})?$/;
    const numberInput = req.body.amount;

    // Check if input is valid
    if (!validNumberFormat.test(numberInput)) {
        return res.status(400).json({ message: 'Invalid number format' });
    }

    const username = req.body.user;
    const amount = Number(numberInput);
    const account = await getAccount(username);
    if (account == null) res.status(400).json({ message: 'Account does not exist' });
   
    const account_id = account.account_id;
    // balance is decimal(10, 2)
    const oldBalance = Number(account.balance);
    const newBalance = oldBalance + amount;
    
    // update balance for user
    updateBalance(username, newBalance);

    // create deposit transaction
    createTransaction(account_id, amount);
    res.status(201).json({ message: 'Deposit successful' });
});

// endpoint 5 - Withdraw Money - Fixed code
// Withdraws money from the account
app.post('/account/withdraw', verifyToken, async(req, res) => {
    // validate amount
    const validNumberFormat = /^(0|[1-9][0-9]*)(\.[0-9]{1,2})?$/;
    const numberInput = req.body.amount;

    // Check if input is valid
    if (!validNumberFormat.test(numberInput)) {
        return res.status(400).json({ message: 'Invalid number format' });
    }

    const username = req.body.user;
    const amount = Number(numberInput);
    const account = await getAccount(username);
    if (account == null) res.status(400).json({ message: 'Account does not exist' });
    
    const account_id = account.account_id;
    const oldBalance = Number(account.balance);
    const newBalance = oldBalance - amount;

    if (newBalance < 0) {
        res.status(400).json({ message: 'Insufficient funds' });
    } else {
        // update balance for user
        updateBalance(username, newBalance);

        // create withdraw transaction
        createTransaction(account_id, -amount);
        res.status(201).json({ message: 'Withdraw successful' });
    }
});

// endpoint 6 
// get 5 transactions of one account
app.post('/account/transactions', verifyToken, async(req, res) => {
    const username = req.body.user;
    const account = await getAccount(username);
    if (account == null) res.status(400).json({ message: 'Account does not exist' });
    const account_id = account.account_id;
    const transactions = await getTransactions(account_id);
    if (transactions == null) res.status(400).json({ message: 'No available transaction' });
    res.status(200).json(transactions);
});

// endpoint 7
// logout
app.post('/account/logout', verifyToken, async(req, res) => {
    const username = req.body.user;
    const account = await getAccount(username);
    if (account == null) res.status(400).json({ message: 'Account does not exist' });
    res.status(200).json({ message: 'Logout successful' });
});


// endpoint 8
// delete account
app.delete('/account/delete', verifyToken, async(req, res) => {
    const username = req.body.user;
    const account = await getAccount(username);
    if (account == null) res.status(400).json({ message: 'Account does not exist' });
    deleteAccount(username);
    res.status(200).json({ message: 'Account deleted' });
});


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: err.message });
})

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});