import express from 'express';
import bcrypt from 'bcrypt';
import { getAccounts, getAccount, createAccount, getTransactions, createTransaction, updateBalance } from './database.js';
// import { verifyToken } from './middleware.js';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';
dotenv.config();


const app = express();
const __dirname = process.cwd();
const SECRET_KEY = process.env.SECRET_KEY;

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

// gets all the accounts
app.get('/accounts', async (req, res) => {
    const accounts = await getAccounts();
    if (accounts == null) {
        res.status(404).json({ message: 'No accounts found' });
    }
    res.status(200).json(accounts);
});

//endpoint 1 - Register
//creates an account using a username and hashed password
app.post('/account', async (req, res) => {
    // validate username
    const user = await getAccount(req.body.username);
    if(user != null){
        return res.status(400).json({ message: 'Username already exists' });
    }

    //validate password
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            username: req.body.username,
            password: hashedPassword
        }

        const newUser = await createAccount(user.username, user.password)
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// endpoint 2 - Login
// gets account using the username and verifies that the user exists and the password matches
// responds with a JWT token
app.post('/account/login', async (req, res) => {
    // validate username and password
    const { username, password } = req.body;
  
    const user = await getAccount(req.body.username);

    if(user == null){
        res.status(401).json({ message: 'Invalid username or password' });
    }
    
    try {
        if(await bcrypt.compare(req.body.password, user.password)){
            const payload = { username };
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
            // console.log(token);
            res.status(200).json({ message : 'Login successful', access_token: token, expires_in: 3600, username: username });
            res.status(200).json({ access_token: token, expires_in: 3600 });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
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

// endpoint 4 - Deposit Money
// Deposites money into the account
app.post('/account/deposit', verifyToken, async(req, res) => {

    // Your protected route logic here
    const username = req.body.user;
    const amount = Number(req.body.amount);
    const account = await getAccount(username);
    if (account == null) res.status(400).json({ message: 'Account does not exist' });
    console.log(account);
    const account_id = account.account_id;
    const newBalance = account.balance + amount;
    
    // update balance for user
    updateBalance(username, newBalance);

    // create deposit transaction
    createTransaction(account_id, amount);
    res.status(201).json({ message: 'Deposit successful' });
});

// endpoint 5 - Withdraw Money
// Withdraws money from the account
app.post('/account/withdraw', verifyToken, async(req, res) => {
    // validate amount
    const username = req.body.user;
    const amount = Number(req.body.amount);
    const account = await getAccount(username);
    if (account == null) res.status(400).json({ message: 'Account does not exist' });
    console.log(account);
    const account_id = account.account_id;
    const newBalance = account.balance - amount;

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

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: err.message });
})

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});