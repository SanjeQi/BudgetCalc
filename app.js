// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!---BUDGET CONTROLLER---!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const budgetController = (function () {
  const Expense = function (id, description, value) {
    (this.id = id), (this.description = description), (this.value = value);
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
  };
  return {
    getInput() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value,
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
          '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMStrings.expensesContainer;
        html =
          ' <div class="item clearfix" id="expense-%id%""> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button></div></div> </div>';
      }
      // Replace placeholders with data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Select the element and insert the new element next to it
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
  };
})();

//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!---APP CONTROLLER---!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const appController = (function (budgetCtrl, UICtrl) {
  const ctrlAddItem = function () {
    // 1.get the field input data
    const input = UICtrl.getInput();
    // 2.add item to the budget controller
    const newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    // 3.add item to Ui controller
    UICtrl.addListItem(newItem, input.type);
    // 4.Clear field
    UICtrl.clearFields();
    // 5.calculate budget
    // 6.display budget on the UI.
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
  };

  return {
    init() {
      console.log('Application has started. Feel free to calculate your monthly budget');
      setupEventListeners();
    },
  };
})(budgetController, UIController);

appController.init();
