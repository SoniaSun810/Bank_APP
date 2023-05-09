$(document).ready(() => {
    const labelWelcome = document.querySelector('.welcome');
    const labelDate = document.querySelector('.date');
    const labelBalance = document.querySelector('.balance__value');

    const containerApp = document.querySelector('.app');
    const containerMovements = document.querySelector('.movements');

    const btnDeposit = document.querySelector('.form__btn--deposit');
    const btnWithdraw = document.querySelector('.form__btn--withdraw');


    const displayMovements = function () {
        containerMovements.innerHTML = '';
        
        // const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
        
        // movs.forEach(function (mov, i) {
        //   const type = mov > 0 ? 'deposit' : 'withdrawal';
        
        //   const html = `
        //     <div class="movements__row">
        //       <div class="movements__type movements__type--${type}">${
        //     i + 1
        //   } ${type}</div>
        //       <div class="movements__value">${mov}€</div>
        //     </div>
        //   `;
        
        //   containerMovements.insertAdjacentHTML('afterbegin', html);
        // });
    };
    
    const calcDisplayBalance = function () {
        // acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
        const amount = 1000;
        labelBalance.textContent = `$${amount}`;
    };

    const getCurrentDate = function () {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        return today;
    }
    
    const updateUI = function () {
        username = "Sonia";
        labelWelcome.textContent = `Welcome ${username}`

        let date = getCurrentDate();
        labelDate.textContent = date;

        // Display movements
        displayMovements();
        
        // Display balance
        calcDisplayBalance();
    };

    updateUI();
});