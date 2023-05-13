import React, { useState, useEffect } from "react";
import Axios from 'axios';
import logo from './logo.png';
import { Navigate, useLocation } from "react-router-dom";

const Dashboard = () => {
    const [username, setUsername] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [authenticated, setAuthenticated] = useState(localStorage.getItem("authenticated"));
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [deposit, setDeposit] = useState(0);
    const [withdrawal, setWithdrawal] = useState(0);
    const [reloadDashboard, setReloadDashboard] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setUsername(location.state.username)
        setAccessToken(location.state.token)

        Axios.post('http://localhost:8080/account/transactions', { 
            "user": location.state.username 
        }, {
            headers: {
                'Authorization': `Basic ${location.state.token}` 
            }
        })
        .then(res => {
            setTransactions(res.data);
        })
        .catch(error => {
            console.error(error);
            setAuthenticated(false);
        });
      }, [reloadDashboard]);

      useEffect(() => {
        Axios.post('http://localhost:8080/account/balance', { 
            "user": location.state.username 
        }, {
            headers: {
                'Authorization': `Basic ${location.state.token}` 
            }
        })
        .then(res => {
            setBalance(res.data.balance);
        })
        .catch(error => {
            console.error(error);
            setAuthenticated(false);
        });
      }, [reloadDashboard]);

    if(!authenticated){
        return <Navigate replace to="/" />;
    } 

    const getCurrentDate = function () {
        let today = new Date();
        return today.toLocaleDateString('en-US');
    }

    const formatDate = (date) => {
        let d = new Date(date);
        return d.toLocaleDateString('en-US');
    }

    const validateInput = (amount) => {
        return /^(?!0\d)\d*(\.\d+)?$/.test(amount) && /^\d+(\.\d{2})?$/.test(amount);
    }

    const handleDepositSubmit = (e) => {
        e.preventDefault();

        if(!validateInput(deposit)){
            alert("Your value " + deposit + " was invalid. Please enter a valid amount to depost.")
            return;
        }

        Axios.post('http://localhost:8080/account/deposit', { 
            "user": location.state.username, 
            "amount": deposit
        }, {
            headers: {
                'Authorization': `Basic ${location.state.token}` 
            }
        })
        .then(res => {
            setReloadDashboard(!reloadDashboard);
            setDeposit(0);
            console.log(res.data);
        })
        .catch(error => {
            if(error.response.status == 400){
                alert(error.response.data.message)
            }
            console.error(error);
        });
    }

    const handleWithdrawalSubmit = (e) => {
        e.preventDefault();

        if(!validateInput(withdrawal)){
            alert("Your value " + withdrawal + " was invalid. Please enter a valid amount to withdraw.")
            return;
        }

        Axios.post('http://localhost:8080/account/withdraw', { 
            "user": location.state.username, 
            "amount": withdrawal
        }, {
            headers: {
                'Authorization': `Basic ${location.state.token}` 
            }
        })
        .then(res => {
            setReloadDashboard(!reloadDashboard);
            setWithdrawal(0);
            console.log(res.data);
        })
        .catch(error => {
            if(error.response.status == 400){
                alert(error.response.data.message + ". Please withdraw less or deposit more money into account first.")
            }
            console.error(error);
        });
    }

    return (
        <div>
            <nav>
                <p className="welcome">Welcome {username}!</p>
                <img src={logo} alt="Logo" className="logo" />
            </nav>
    
            <main className="app">
                {/* <!-- BALANCE --> */}
                <div className="balance">
                <div>
                    <p className="balance__label">Current balance</p>
                    <p className="balance__date">
                    As of <span className="date">{getCurrentDate()}</span>
                    </p>
                </div>
                <p className="balance__value">${balance}</p>
                </div>
        
                {/* <!-- MOVEMENTS --> */}
                <div className="movements">
                {
                    transactions.length > 0 ? transactions.map(transaction => {
                        if(transaction.amount > 0){
                            return (
                                <div key={transaction.id} className="movements__row">
                                    <div className="movements__type movements__type--deposit">Deposit</div>
                                    <div className="movements__date">{formatDate(transaction.created_at)}</div>
                                    <div className="movements__value">${transaction.amount}</div>
                                </div>
                            )
                        } else {
                            return (
                                <div key={transaction.id}  className="movements__row">
                                    <div className="movements__type movements__type--withdrawal">Withdrawal</div>
                                    <div className="movements__date">{formatDate(transaction.created_at)}</div>
                                    <div className="movements__value">${transaction.amount}</div>
                                </div>
                            )
                        }
                    }): <div className="movements__row"><p className="error__message">No recent transactions found</p></div>
                }
                </div>
        
                {/* <!-- OPERATION: DEPOSIT --> */}
                <div className="operation operation--deposit">
                <h2>Deposit Money</h2>
                <form className="form form--deposit" onSubmit={handleDepositSubmit}>
                    <input type="number" className="form__input form__input--amount" value = {deposit} onChange={(e) => setDeposit(e.target.value)}/>
                    <button type="submit" className="form__btn form__btn--deposit">&rarr;</button>
                    <label className="form__label">Amount</label>
                </form>
                </div>

                {/* <!-- OPERATION: WITHDRAW --> */}
                <div className="operation operation--withdraw">
                <h2>Withdraw Money</h2>
                <form className="form form--withdraw" onSubmit={handleWithdrawalSubmit}>
                    <input type="number" className="form__input form__input--amount" value = {withdrawal} onChange={(e) => setWithdrawal(e.target.value)}/>
                    <button className="form__btn form__btn--withdraw">&rarr;</button>
                    <label className="form__label">Amount</label>
                </form>
                </div>
        
            </main>
        </div>
    );
}

export default Dashboard;