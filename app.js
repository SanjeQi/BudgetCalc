// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!---BUDGET CONTROLLER---!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const budgetController = (function () {
  const Expense = function (id, description, value) {
    (this.id = id), (this.description = description), (this.value = value), (this.percentage = -1);
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = ' --- ';
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  const Income = function (id, description, value) {
    (this.id = id), (this.description = description), (this.value = value);
  };

  const data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  const calaculateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  return {
    addItem(type, des, val) {
      let newItem;
      let ID;

      // Create id [1 2 3 4 5] next id = 6
      //          [1 2 4 6 8] next id = 9
      // ID = last ID + 1

      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'exp'
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      // Push it into my data structure
      data.allItems[type].push(newItem);

      // return the new element
      return newItem;
    },
    deleteItem(type, id) {
      const ids = data.allItems[type].map(function (current) {
        return current.id;
      });
      const index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculateBudget() {
      // Calculate total inc and total exp
      calaculateTotal('inc');
      calaculateTotal('exp');
      // Calculate budget: total inc  minus total exp

      data.budget = data.totals.inc - data.totals.exp;
      // Calulate percentage that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    calculatePercentages() {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages() {
      const allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },
    getBudget() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },
    testing() {
      console.log(data);
    },
  };
})();

//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!---UI CONTROLLER---!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const UIController = (function () {
  const DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dataLabel: '.budget__title--month',
  };

  const nodeListForEach = function (list, callback) {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  const formatNumber = function (num, type) {
    // + or - before the formatNumber
    // 2 decimal points
    // coma separating the thousands
    // 2310.4567 -> + 2,310.46
    // 2000 -> + 2,000.00
    num = Math.abs(num);
    num = num.toFixed(2);
    const numSplit = num.split('.');
    let int = numSplit[0];

    if (int.length > 3) {
      int = `${int.substr(0, int.length - 3)},${int.substr(int.length - 3, 3)}`; // 2310 -> 2,310
    }
    const dec = numSplit[1];

    return `${type === 'exp' ? '-' : '+'} ${int}.${dec}`;
  };

  return {
    getInput() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
      };
    },
    getDOMStrings() {
      return DOMStrings;
    },
    addListItem(obj, type) {
      // Add html string with placeholders
      let html;
      let newHtml;
      let element;

      if (type === 'inc') {
        element = DOMStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMStrings.expensesContainer;
        html =
          ' <div class="item clearfix" id="exp-%id%""> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button></div></div> </div>';
      }
      // Replace placeholders with data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // Select the element and insert the new element next to it
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    deleteListItem(selectorID) {
      const el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },
    clearFields() {
      const fields = document.querySelectorAll(
        `${DOMStrings.inputDescription}, ${DOMStrings.inputValue}`
      );
      const fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (cur) {
        cur.value = '';
      });
      fieldsArr[0].focus();
    },
    displayBudget(obj) {
      /** Budget
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
       */
      let type;
      obj.budget > 0 ? (type = 'inc') : (type = 'exp');
      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent = `${obj.percentage}%`;
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = ` ---- `;
      }

      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);

      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        'inc'
      );
      document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(
        obj.totalExp,
        'exp'
      );
    },
    displayPercentages(percentages) {
      const fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = `${percentages[index]}%`;
        } else {
          current.textContent = ` ---- `;
        }
      });
    },
    displayMonth() {
      const months = [
        'Jan',
        'Feb',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      document.querySelector(DOMStrings.dataLabel).textContent = `${months[month]} ${year}`;
    },
    changedType() {
      const fields = document.querySelectorAll(
        `${DOMStrings.inputType},
        ${DOMStrings.inputDescription},
        ${DOMStrings.inputType}`
      );
      nodeListForEach(fields, function (cur) {
        cur.classList.toggle('red-focus');
      });
      document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
    },
  };
})();

//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!---APP CONTROLLER---!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const appController = (function (budgetCtrl, UICtrl) {
  const updateBudget = function () {
    // 1.calculate budget
    budgetCtrl.calculateBudget();
    // 2.return the budget
    const budget = budgetCtrl.getBudget();
    // 3.display budget on the UI.
    UICtrl.displayBudget(budget);
  };

  const updatePercentages = function () {
    // 1.Calculate te percentages
    budgetCtrl.calculatePercentages();
    // 2. Read procentages from the budget controller.
    const percentages = budgetCtrl.getPercentages();
    // 3. Update the UI the new percentages
    UICtrl.displayPercentages(percentages);
  };

  const ctrlAddItem = function () {
    // 1.get the field input data
    const input = UICtrl.getInput();
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2.add item to the budget controller
      const newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3.add item to Ui controller
      UICtrl.addListItem(newItem, input.type);
      // 4.Clear field
      UICtrl.clearFields();
      // 5.Calculate and Update budget
      updateBudget();
      // 6. Calculate and update percentages
      updatePercentages();
    }
  };

  const ctrlDeleteItem = function (event) {
    const itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; // inc-1 or exp-2

    if (itemID) {
      const splitID = itemID.split('-');
      const type = splitID[0]; // inc or exp
      const ID = parseInt(splitID[1]); // 0 , 1, 2..
      // 1. Delete the item from the data sctructure
      budgetCtrl.deleteItem(type, ID);
      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);
      // 3. Re-calculate budget and update budget
      updateBudget();
      // 4. Calculate and update percentages
      updatePercentages();
    }
  };

  const setupEventListeners = function () {
    const DOM = UICtrl.getDOMStrings();
    // EventListeners
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  };

  return {
    init() {
      console.log('Application has started. Feel free to calculate your monthly budget');
      setupEventListeners();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      UICtrl.displayMonth();
    },
  };
})(budgetController, UIController);

appController.init();
