let newId = localStorage.getItem("newId")? +localStorage.getItem("newId"): 0;

export default class Account {
  constructor(inital = 0, id = newId, transactions = []) {
    this.balance = inital;
    this.id = id;
    if (id === newId) {
      newId += 1;
      localStorage.setItem("newId", newId)
    }
    this.transactions = transactions;
  }
  deposit(ammount) {
    this.balance += ammount;
    this.registerTransaction("Depoist", ammount);
  }
  withdraw(ammount) {
    this.decreaseBalance(ammount);
    this.registerTransaction("Withdraw", ammount);
  }
  decreaseBalance(ammount) {
    const balance = this.balance;
    if (balance >= ammount) {
      this.balance -= ammount;
    } else {
      throw "Not enaugh balance";
    }
  }
  transfer(targetId, ammount) {
    // verify tagetIf (not mine and exists)
    if (targetId === this.id) {
        throw "Can't transfer to yourself"
    }
    const targetAccount = accounts.find(account => account.id === targetId)
    
    if (!targetAccount) {
        throw `Account with id ${targetId} doesn't exist`
    }

    // remove ammount from me
    this.decreaseBalance(ammount)

    // add ammount to target
    targetAccount.receiveTransfer(ammount, this.id)    

    // register transaction
    this.registerTransaction("Transfer", ammount, targetId)
}
receiveTransfer(ammount, from) {
    this.balance += ammount
    console.log(from)
    this.registerTransaction("Transfer Receive", ammount, from)
}
  registerTransaction(type, ammount, target = false) {
    const date = this.time();
    const newTransaction = {
      type: type,
      ammount: ammount,
      target: target,
      date: date,
    };
    this.transactions.unshift(newTransaction);
    localStorage.setItem("accounts", JSON.stringify(accounts))
  }
  time() {
    const date = new Date();
    const formatedDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return formatedDate;
  }
}

export const accounts = localStorage.getItem("accounts")
  ? accountify(JSON.parse(localStorage.getItem("accounts")))
  : [];

export function accountify(objectAccounts) {
    const newAccounts = []
    for (let oldAccount of objectAccounts) {
        const newAccount = new Account(oldAccount.balance, oldAccount.id, oldAccount.transactions)
        newAccounts.push(newAccount)
    }
    return newAccounts
}
