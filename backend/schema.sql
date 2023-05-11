DROP DATABASE IF EXISTS bank_app;
CREATE DATABASE bank_app;
USE bank_app;

CREATE TABLE accounts (
    account_id integer PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(127) NOT NULL UNIQUE,
    password VARCHAR(127) NOT NULL,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
    id integer PRIMARY KEY AUTO_INCREMENT,
    -- description VARCHAR(255) NOT NULL,
    account_id integer NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

