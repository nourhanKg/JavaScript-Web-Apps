"use strict";

//Data
const account1 = {
    owner: "Nourhan AboElenen",
    actions: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,
    actionsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-07-26T17:01:17.194Z',
        '2021-08-14T23:36:17.929Z',
        '2021-08-15T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};
const account2 = {
    owner: "Alaa Mohsen",
    actions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
    actionsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2021-06-25T18:49:59.371Z',
        '2021-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
}
const account3 = {
    owner: "Ayman Ahmed Zaki",
    actions: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
    actionsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2021-06-25T18:49:59.371Z',
        '2021-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'ar-EG',
};  
const account4 = {
    owner: "Sarah Smith",
    actions: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
    actionsDates: [
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2021-06-25T18:49:59.371Z',
        '2021-07-26T12:01:20.894Z',
    ],
    currency: 'EUR',
    locale: 'en-GB',
};

const accounts = [account1, account2, account3, account4];

//elements

const userAccount = document.querySelector(".user-login");
const userPIN = document.querySelector(".PIN-login");
const loginBtn = document.querySelector(".input-btn");

const greeting = document.querySelector(".head");
const appContent = document.querySelector(".app");

const transferBtn = document.querySelector(".transfer-btn")
const laonBtn = document.querySelector(".loan-btn");
const closeBtn = document.querySelector(".close-btn");
const sortBtn = document.querySelector(".sort-btn");

const currentBalance = document.querySelector(".value");
const transfereeAcc = document.querySelector(".transfereeAcc")
const transferValue = document.querySelector(".transferedAmount")
const depositValue = document.querySelector(".loanedAmount");

const actionsDiv = document.querySelector(".actions");

const confirmUser = document.querySelector(".user-close");
const confirmPIN = document.querySelector(".PIN-close");

const inValue = document.querySelector(".in-value");
const outValue = document.querySelector(".out-value");
const interestValue = document.querySelector(".interest-value");

const currentDate = document.querySelector(".myDate");
const now = new Date();
const countdown = document.querySelector(".logout-timer");


//functions

//(1)-creating usernames
function creatingUsers(accs) {
    accs.forEach(acc => {
        acc.username = acc.owner.split(" ").map(name => {
            return name.substring(0, 1).toLowerCase();
        }).join("");
    });
}
creatingUsers(accounts);

//fake login
// const currentAccount = account1;
// displayActions(currentAccount);
// appContent.style.opacity = "1"

//(2)-implementing Login
let currentAccount, timer;
function loginUser(e) {
    e.preventDefault(); //prevent form from submitting
    const username = userAccount.value;
    const PIN = Number(userPIN.value);
    
    //finding account
    currentAccount = accounts
    .find(acc => acc.username === username && acc.pin === PIN);
    console.log(currentAccount, username, PIN);

    if(currentAccount) {
        //adding all previous actions
        displayActions(currentAccount);
        
        greeting.innerHTML = `Welcome back, ${currentAccount.owner.slice(0, currentAccount.owner.indexOf(" "))}!`
        //adding current date
        const options = {
            hour: "numeric",
            minute: "numeric",
            day: "numeric",//"2-digit"
            month: "numeric",//"short"
            year: "numeric",
            //weekday: "narrow",
        }
        currentDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
        //locale "en-US"/"ar-EG"
        // const = local = navigator.language; to get from browser
        userAccount.value = userPIN.value = "";
        userPIN.blur(); //remove focus
        //start logout timer
        if(timer) clearInterval(timer);
        timer = logoutAfterTimer();
    }
    else {
        appContent.innerHTML = "";
        const errorMessage = `
        <div class="error"><i class="far fa-times-circle"></i> Please make sure that the User and PIN are correct!</div>
        `
        appContent.insertAdjacentHTML("afterbegin", errorMessage);
    }
    appContent.classList.add("apper");
}


//(3)-adding all previous actions;

function displayActions(account, sort = false) {
    let actions = sort ? account.actions.slice().sort((a, b) => a >= b ? -1 : 1).reverse() : account.actions; 
    //delete old data
    actionsDiv.innerHTML = "";
    //adding new data
    actions.forEach(function(element, index){
        const type = element < 0 ? "withdrawl" : "deposit";
        const actionDate = new Date(account.actionsDates[index]);
        const daysPassed = calcDaysPassed(actionDate, now);
        let date;
        if(daysPassed === 0)
            date = "Today";
        else if(daysPassed === 1)
            date = "Yesterday";
        else if (daysPassed <= 3)
            date = `${daysPassed} days ago`
        else {
            date = new Intl.DateTimeFormat(account.locale).format(actionDate);
        }
        const formatedCurr = formatCurr(element, account.currency, account.locale);
        const newData = `
        <div class="row">
            <p class="action-label ${type}">${index + 1} ${type}</p>
            <p class="action-date">${date}</p>
            <div class="amount">${formatedCurr}</div>
        </div>
        `;
    actionsDiv.insertAdjacentHTML("afterbegin", newData);
    });

    //updating balance
    updatingBalance(account);

    //maximum deposit value & maximum withdrawl value
    const maxDeposit = actions
        .reduce((acc, action) => acc > action ? acc : action, actions[0]);

    const maxWithdrawl = Math.abs(actions
        .reduce((acc, action) => acc < action ? acc : action, 0));
    console.log(maxDeposit, maxWithdrawl);
}

//(3)-Updating Balance
function updatingBalance(account) {
    const actions = account.actions;
    currentBalance.innerHTML = "0000€";
    account.balance = actions
        .reduce((acc, action) => acc + action, 0);
    currentBalance.textContent = formatCurr(account.balance, account.currency, account.locale);

    //updating summary
    const depositsTotal = actions
        .filter(action => action > 0)
        .reduce((acc, action) => acc + action, 0);
    inValue.textContent = formatCurr(depositsTotal, account.currency, account.locale);

    const withdrawlsTotal= Math.abs(actions
        .filter(action => action < 0)
        .reduce((acc, action) => acc + action, 0));
    outValue.textContent = formatCurr(withdrawlsTotal, account.currency, account.locale);

    //interest is paid for DEPOSIT only and is paid for 1 EUR or larger
    const interestTotal = actions
        .filter(action => action > 0)
        .map(deposit => deposit * account.interestRate / 100)
        .filter(interest => interest >= 1)
        .reduce((acc, interest) => acc + interest, 0);
    interestValue.textContent = formatCurr(interestTotal, account.currency, account.locale);
}
//(4)-tranfer money 
function transferMoney(e) {
    e.preventDefault();
    //finding transfree account
    const toAccount = accounts.find(acc => acc.username === transfereeAcc.value);
    const transferedAmount = Number(transferValue.value);
    if(toAccount && toAccount !== currentAccount) {
        if(transferedAmount < 0 || transferedAmount > currentAccount.balance) {
            alert("Please enter a valid credit value");
        }
        else {
            //transfering money
            currentAccount.actions.push(transferedAmount * -1);
            currentAccount.actionsDates.push(new Date().toISOString());
            toAccount.actions.push(transferedAmount);
            toAccount.actionsDates.push(new Date().toISOString());
            displayActions(currentAccount);

            transfereeAcc.value = transferValue.value = ""; 
            //Reset timer
            clearInterval(timer);
            timer = logoutAfterTimer();
        }
    }
    else {
        alert("Unvalid Account Name");
    }
}

//(5)-deposit money 
//bank only loans if you have at least one deposit == 10% loan value
function depositMoney(e) {
    e.preventDefault();
    const depositedAmount = Math.floor(depositValue.value);
            
    //adding money with a 5s delay for approval
    if(depositedAmount > 0) {
        if(currentAccount.actions.some(action => action > 0 && action >= depositedAmount * .1)) {
            const delayDeposit = setTimeout(() =>
            {
                currentAccount.actions.push(depositedAmount);
                currentAccount.actionsDates.push(new Date().toISOString());
                displayActions(currentAccount);
                //Reset timer
                clearInterval(timer);
                timer = logoutAfterTimer();
            }, 3000);
            depositValue.value = "";
        }
        else {
            alert("Your balance isn't enough");
        }
    }
    else {
        alert("Enter a valid credit value");
    }
}

//(6)-delete account
function deleteAccount(e) {
    e.preventDefault();
    const deletedAcc = confirmUser.value;
    const deletePIN = Number(confirmPIN.value);

    if(deletedAcc === currentAccount.username && deletePIN === currentAccount.pin) {
        //adding money
        const index = accounts.findIndex(account => account.username === deletedAcc);
        accounts.splice(index, 1);

        //log out 
        appContent.classList.toggle("apper");

        confirmUser.value = confirmPIN.value = "";
    }
    else {
        alert("Please enter the correct User and PIN");
    }
}

//(7)-sorting actions
let sort = true;
function sortActions(e) {
    e.preventDefault();
    displayActions(currentAccount, sort);
    sort = !sort;
}

//(8)=calc passed days
function calcDaysPassed(day1, day2) {
    return Math.round(Math.abs(day1 - day2) / (1000 * 60 * 60 * 24));
}
//(9) formating currency
function formatCurr(value, currency, locale) {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(value);
}
//(10) loging out after timer
function logoutAfterTimer() {
    //Start timer
    let interval = 5 * 60;
    //to avoid 1s delay
    const tick = function() {
        let mins = Math.trunc(interval / 60);
        let secs = interval % 60;
        countdown.textContent = `${mins}:${secs}`;
        //loging out
        if(interval === 0) {
            clearInterval(timer);
            appContent.classList.remove("apper");
            greeting.textContent = "Login to get started!"
        }
        interval--;
    }
    //Display timer
    tick()
    const timer = setInterval(tick, 1000);
    return timer;
}
//Events
loginBtn.addEventListener("click", function(e) {
    loginUser(e);
});

transferBtn.addEventListener("click", function(e) {
    transferMoney(e);
});

laonBtn.addEventListener("click", function(e) {
    depositMoney(e);
});

closeBtn.addEventListener("click", function(e) {
    deleteAccount(e);
});
sortBtn.addEventListener("click", function(e) {
    sortActions(e);
});
//total balance in bank
const totalBankBalance = accounts
    .map(acc => acc.actions)
    .flat()
    .reduce((acc, action) => acc + action, 0);
console.log(totalBankBalance);
//we can combine map & flat with one method called flatMap() with only 1 level