import Account, { accounts } from "./tools.js";

// remove account
function removeAccount(accountId) {
  const accountIndex = accounts.findIndex(account => account.id === accountId)
  accounts.splice(accountIndex, 1)
  document.querySelector(`#account-${accountId}`).remove();
  localStorage.setItem("accounts", JSON.stringify(accounts));
}

// render account in screen
function renderAccount(account) {
  const id = account.id;
  const accountHtml = document.createElement("li");
  accountHtml.classList = "account";
  accountHtml.id = `account-${id}`;
  accountHtml.innerHTML = `<h2 class="block--title">Account</h2>
    <div class="block--description">
        <p class="block--description__item">ID: ${id}</p>
        <p class="block--description__item">balance: ${account.balance}$</p>
    </div>
  <a href="account/account.html?id=${id}" class="account--open account--btn">Open</a>`;
  const removeBtn = document.createElement("button");
  removeBtn.innerText = "Remove";
  removeBtn.classList.add("account--remove", "account--btn");
  removeBtn.addEventListener("click", () => removeAccount(id));
  accountHtml.append(removeBtn);
  document.querySelector("#accounts").append(accountHtml);
}

// create new account
document.querySelector("#create-account").addEventListener("click", () => {
  const account = new Account();
  accounts.push(account);
  localStorage.setItem("accounts", JSON.stringify(accounts));
  renderAccount(account);
  account.id;
});

// render exisiting accounts when pages loads
function renderExistingAccounts() {
  for (const account of accounts) {
    renderAccount(account);
  }
}
renderExistingAccounts();