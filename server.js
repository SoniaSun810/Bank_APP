import express from 'express';
import bcrypt from 'bcrypt';
import path from 'path';
import { getAccounts, getAccount, createAccount } from './database.js';

const app = express();
const __dirname = process.cwd();

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

app.use(express.json());

app.get('/', (req, res) => {
    res.render('pages/index');
});

// gets all the accounts
app.get('/accounts', async (req, res) => {
    const accounts = await getAccounts();
    res.send(accounts);
});

// creates an account using a username and hashed password
app.post('/account', async (req, res) => {
    // validate username and password

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            username: req.body.username,
            password: hashedPassword
        }

        const newUser = await createAccount(user.username, user.password)

        res.status(201).send(newUser);
    } catch (error) {
        res.status(500).send();
    }
});

// gets account using the username and verifies that the user exists and the password matches
app.post('/account/login', async (req, res) => {
    // validate username and password

    const user = await getAccount(req.body.username);

    if(user == null){
        return res.status(400).send("User does not exist");
    }

    try {
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send("Success");
            res.render("pages/home"); // redirect to homepage
        } else {
            res.send("Not Allowed")
        }
    } catch (error) {
        res.status(500).send();
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});