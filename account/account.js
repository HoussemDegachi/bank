import { accounts } from "../tools.js";

const htmlElems = {
  balance: document.querySelector("#account-balance"),
  transactions: document.querySelector("#transactions-list"),
};
const accountId = new URLSearchParams(window.location.search).get("id");
const account = accounts.find((account) => account.id === +accountId);

// render balance
function renderBalance() {
  htmlElems.balance.innerText = account.balance;
}

// render transactions
function renderTransactions() {
  // clear the transactions container
  const transactions = account.transactions;
  const transactionsContainer = htmlElems.transactions;
  transactionsContainer.innerHTML = "";

  // if there are no transactions add note message
  if (transactions.length === 0) {
    const noteItem = document.createElement("li");
    noteItem.classList.add("transaction");
    const note = document.createElement("p");
    note.classList.add("block--title");
    note.innerText = "You have no transactions";
    noteItem.append(note);
    transactionsContainer.append(noteItem);
  } else {
    // loop into each transaction and add it
    for (const transaction of transactions) {
      const transactionElem = document.createElement("li");
      transactionElem.classList.add("transaction");
      transactionElem.innerHTML = `
      <p class="block--title">${transaction.type}</p>
      <p class="block--description__item">Amount: ${transaction.ammount}$</p>
      ${
        transaction.target
          ? '<p class="block--description__item">Target: ' +
            transaction.target +
            "</p>"
          : ""
      }
      <p class="block--description__item">${transaction.date}</p>
      `;
      transactionsContainer.append(transactionElem);
    }
  }
}
renderBalance();
renderTransactions();

// toggle the visibility of the transactions bar
document.querySelector("#history-btn").addEventListener("click", () => {
  document.querySelector("#transactions").classList.toggle("hide");
});

// deposit money
document.querySelector("#deposit").addEventListener("submit", (event) => {
  event.preventDefault();
  const ammount = +event.target[0].value;
  account.deposit(ammount);
  renderBalance();
  renderTransactions();
});

// withdraw money
document.querySelector("#withdraw").addEventListener("submit", (event) => {
  event.preventDefault();
  const ammount = +event.target[0].value;
  try {
    account.withdraw(ammount);
  } catch (error) {
    displayError(error)
  }
  renderBalance();
  renderTransactions();
});

// transfer money
document.querySelector("#transfer").addEventListener("submit", (event) => {
  event.preventDefault();
  const target = +event.target[0].value;
  const ammount = +event.target[1].value;
  try {
    account.transfer(target, ammount);
  } catch (error) {
    displayError(error)
  }
  renderBalance();
  renderTransactions();
});

// error

// display
function displayError(error) {
  const errorEl = document.createElement("div")
  errorEl.id = "error"
  errorEl.innerHTML = `
  <div id="error--banner"></div>
  <div id="error--content">
      <p id="error--text">${error}</p>
  </div>
  `
  const closeBtn = document.createElement("button")
  closeBtn.id = "error--close"
  closeBtn.innerText = "X"
  closeBtn.addEventListener("click", () => hideError(errorEl))
  errorEl.append(closeBtn)
  document.body.append(errorEl)
  setTimeout(() => hideError(errorEl), 5000)
}

// hide
function hideError(errorElem) {
  errorElem.remove()
}
