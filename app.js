//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!---BUDGET CONTROLLER---!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var budgetController = (function () {
  var Expense = function (id, description, value) {
    (this.id = id), (this.description = description), (this.value = value);
  };

  var Income = function (id, description, value) {
    (this.id = id), (this.description = description), (this.value = value);
  };

  var data = {
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
    addItem: function (type, des, val) {
      var newItem, ID;

      //Create id [1 2 3 4 5] next id = 6
      //          [1 2 4 6 8] next id = 9
      // ID = last ID + 1

      //Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new item based on 'inc' or 'exp'
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      //Push it into my data structure
      data.allItems[type].push(newItem);

      //return the new element
      return newItem;
    },
    testing: function () {
      console.log(data);
    },
  };
})();

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!---UI CONTROLLER---!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var UIController = (function () {
  var DOMStrings;
  DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value,
      };
    },
    getListItems: function (obj, type) {
      var html, newHtml, element;
      // Create HTML strings with placeholder text
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expenseContainer;
        html =
          ' <div class="item clearfix" id="exp-%id%""> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button></div></div> </div>';
      }

      //Replace the placeholder text with actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
      //Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    getDOMStrings: function () {
      return DOMStrings;
    },
  };
})();

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!---APP CONTROLLER---!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var appController = (function (budgetCtrl, UICtrl) {
  var ctrlAddItem, setupEventListeners;

  setupEventListeners = function () {
    var DOM;
    DOM = UICtrl.getDOMStrings();
    //EventListeners
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
  };

  ctrlAddItem = function () {
    var newItem, input;
    //1.get the field input data
    input = UICtrl.getInput();
    //2.add item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    //3.add item to Ui controller
    //4.calculate budget
    //5.display budget on the UI.
  };
  return {
    init: function () {
      console.log(
        "Application has started. Feel free to calculate your monthly budget"
      );
      setupEventListeners();
    },
  };
})(budgetController, UIController);

appController.init();
