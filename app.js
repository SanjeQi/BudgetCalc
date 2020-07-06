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
  var addItem, input, DOM;
  DOM = UICtrl.getDOMStrings();
  addItem = function () {
    //1.get the field input data
    input = UICtrl.getInput();
    //2.add item to the budget controller
    //3.add item to Ui controller
    //4.calculate budget
    //5.display budget on the UI.
    console.log(input);
  };
  document.querySelector(DOM.inputBtn).addEventListener("click", addItem);

  document.addEventListener("keypress", function (e) {
    if (e.keyCode === 13 || e.which === 13) {
      addItem();
    }
  });
})(budgetController, UIController);
