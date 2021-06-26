'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
//? LECTURES
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
let currentAccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  const currentUser = inputLoginUsername.value;
  currentAccount = accounts.find(user => user.userName === currentUser);

  if (currentAccount?.pin === parseInt(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner}`;
    updateUI(currentAccount);
    document.querySelector('.app').style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  } else {
    document.querySelector('.app').style.opacity = 0;
    labelWelcome.textContent = `Invalid username or password`;
  }
});

const calculateBalance = account => {
  account.balance = account.movements.reduce((acc, cur) => acc + cur);
  labelBalance.textContent = `€ ${account.balance}`;
};

const transactionMovment = (movemnt, sort = false) => {
  containerMovements.innerHTML = '';
  const movs = sort ? movemnt.slice().sort((a, b) => a - b) : movemnt;
  movs.forEach((transaction, i) => {
    const type = transaction > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${transaction}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcdisplaySummery = ({ movements, interestRate }) => {
  const incomingAmount = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const outgoingAmount = movements
    .filter(mov => mov <= 0)
    .reduce((acc, mov) => acc + mov, 0);

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * interestRate) / 100)
    .reduce((acc, deposit) => acc + deposit, 0);
  labelSumIn.textContent = `${incomingAmount}€`;
  labelSumOut.textContent = `${Math.abs(outgoingAmount)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

const genearateUserName = accs => {
  accs.forEach(
    account =>
      (account.userName = account.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
};

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const transferTo = inputTransferTo.value;
  const transferAmount = parseInt(inputTransferAmount.value);
  const recieverAcc = accounts.find(user => user.userName === transferTo);

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    transferAmount > 0 &&
    recieverAcc?.userName !== currentAccount.userName &&
    transferAmount <= currentAccount?.balance
  ) {
    recieverAcc.movements.push(transferAmount);
    currentAccount.movements.push(-transferAmount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (loanAmount > 0) {
    const loanStatus = currentAccount.movements.some(
      deposit => deposit >= loanAmount * 0.1
    );
    if (loanStatus) {
      currentAccount.movements.push(loanAmount);
      updateUI(currentAccount);
    }
  }

  inputLoanAmount.value = '';
});

let sorted = false;
btnSort.addEventListener('click', e => {
  // currentAccount.movements.sort((a, b) => a - b);
  e.preventDefault();
  transactionMovment(currentAccount.movements, !sorted);
  sorted = !sorted;
});

btnClose.addEventListener('click', e => {
  e.preventDefault();
  const username = inputCloseUsername.value;
  const pin = parseInt(inputClosePin.value);
  inputCloseUsername.value = inputClosePin.value = '';
  if (currentAccount.userName === username && pin === currentAccount.pin) {
    const index = accounts.findIndex(userD => userD.userName);
    console.log(index);
    accounts.splice(index, 1);
    console.log('accoutn deleted');
    labelWelcome.textContent = '';
    document.querySelector('.app').style.opacity = 0;
  }
});
const updateUI = acc => {
  transactionMovment(acc.movements);
  calculateBalance(acc);
  calcdisplaySummery(acc);
};

genearateUserName(accounts);

console.log(accounts);
/////////////////////////////////////////////////
