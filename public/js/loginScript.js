'use strict';

// Elements
const labelWelcome = document.querySelector('.welcome');

const btnLogin = document.querySelector('.login__btn');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPassword = document.querySelector('.login__input--password');

let currentUserName;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  $.ajax({
    url : 'http://localhost:8080/account/login',
    type : 'POST',
    data : {
      "username": inputLoginUsername.value,
      "password": inputLoginPassword.value
    },
    success : function(data){
      console.log("Successfully logged in." + data.username);
    },
    dataType: "json"
  }).done((data) => { window.location.href = "/home"; });
});

