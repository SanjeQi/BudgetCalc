//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!---BUDGET CONTROLLER---!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var budgetController = (function () {
  //code
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

    getDOMStrings: function () {
      return DOMStrings;
    },
  };
})();

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!---APP CONTROLLER---!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var appController = (function (BGTCtrl, UICtrl) {
  var addItem, input, setupEventListeners;

  setupEventListeners = function () {
    var DOM;
    DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", addItem);

    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        addItem();
      }
    });
  };

  addItem = function () {
    //1.get the field input data
    input = UICtrl.getInput();
    //2.add item to the budget controller
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
