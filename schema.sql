DROP DATABASE IF EXISTS bank_app;
CREATE DATABASE bank_app;
USE bank_app;

CREATE TABLE accounts (
    id integer PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(127) NOT NULL,
    password VARCHAR(127) NOT NULL,
    balance integer DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);