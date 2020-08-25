'use strict';
(function () {
  const ENTER_KEY = 13;
  const DELETE_KEY = 46;
  const KEYBOARD_EQUAL_KEY = 187;

  let calcSigns = [
    'C', '-+', '%', '<-',
    '1', '2', '3', '+',
    '4', '5', '6', '-',
    '7', '8', '9', '*',
    '0', '.', '=', '/'
  ];

  let operationsArray = ['*', '/', '%', '+', '-'];

  let templateButton = document.querySelector('#calc-button').content.querySelector('.calc__item');
  let fragment = document.createDocumentFragment();

  let calcInput = document.querySelector('.calc__input');
  let calcOutput = document.querySelector('.calc__output');
  let calcKeyboard = document.querySelector('.calc__list');

  let checkRemainder = function (numArray) {
    let digit = [];
    let result;
    for (let i = 0; i < numArray.length; i++) {
      let num = numArray[i];
      let dotIndex = num.indexOf('.');
      if (dotIndex === -1) {
        digit.push(0);
      } else {
        let halfString = num.substring(dotIndex + 1, num.length);
        digit.push(Number(halfString.length));
      }
    }
    result = Math.max(...digit);
    return result;
  };

  let summation = function (numArray) {
    let result;
    let outputComputation;
    let digit = checkRemainder(numArray);

    numArray.reduce(function (accumulator, currentValue) {
      result = Number(accumulator) + Number(currentValue);
    });
    switch (true) {
      case digit === 0:
        outputComputation = result;
        break;
      case digit > 0:
        outputComputation = result.toFixed(digit);
        break;
    }
    return outputComputation;
  };

  let subtraction = function (numArray) {
    let result;
    let outputComputation;
    let digit = checkRemainder(numArray);

    numArray.reduce(function (accumulator, currentValue) {
      result = Number(accumulator) - Number(currentValue);
    });

    switch (true) {
      case digit === 0:
        outputComputation = result;
        break;
      case digit > 0:
        outputComputation = result.toFixed(digit);
        break;
    }

    return outputComputation;
  };

  let multiplication = function (numArray) {
    let result;
    let outputComputation;
    let digit = checkRemainder(numArray);

    numArray.reduce(function (accumulator, currentValue) {
      result = Number(accumulator) * Number(currentValue);
    });

    switch (true) {
      case digit === 0:
        outputComputation = result;
        break;
      case digit > 0:
        outputComputation = result.toFixed(digit);
        break;
    }
    return outputComputation;
  };

  let division = function (numArray) {
    let result;
    let outputComputation;
    let digit = checkRemainder(numArray);

    numArray.reduce(function (accumulator, currentValue) {
      if (currentValue === '0') {
        result = 'Деление на 0 невозможно!';
      } else {
        result = Number(accumulator) / Number(currentValue);
      }
    });

    switch (true) {
      case digit === 0:
        outputComputation = result;
        break;
      case digit > 0:
        outputComputation = result.toFixed(digit);
        break;
    }
    return outputComputation;
  };

  let percent = function (numArray) {
    let result;
    let outputComputation;
    let digit = checkRemainder(numArray);

    numArray.reduce(function (accumulator, currentValue) {
      result = Number(accumulator) % Number(currentValue);
    });

    switch (true) {
      case digit === 0:
        outputComputation = result;
        break;
      case digit > 0:
        outputComputation = result.toFixed(digit);
        break;
    }
    return outputComputation;
  };

  let convertStringToNum = function (array) {
    let result;
    let numArray = [];
    for (let i = 0; i < array.length; i++) {
      let arrayElement = array[i];

      switch (true) {
        case arrayElement === '+':
          numArray = array.filter(element => element !== '+');
          result = summation(numArray);
          break;
        case arrayElement === '-':
          numArray = array.filter(element => element !== '-');
          result = subtraction(numArray);
          break;
        case arrayElement === '*':
          numArray = array.filter(element => element !== '*');
          result = multiplication(numArray);
          break;
        case arrayElement === '/':
          numArray = array.filter(element => element !== '/');
          result = division(numArray);
          break;
        case arrayElement === '%':
          numArray = array.filter(element => element !== '%');
          result = percent(numArray);
          break;
      }
    }

    return result;
  };

  let getArrOfIndexOfOperations = function (incomingArray, arrayOfOperators) {
    let arrOfIndex = incomingArray.map(function (item, index) {
      let indexOfElement;
      for (let i = 0; i < arrayOfOperators.length; i++) {
        let operator = arrayOfOperators[i];
        if (operator === item) {
          indexOfElement = index;
        }
      }
      return indexOfElement;
    });
    // убираем пустые элементы и сортируем по возрастанию
    arrOfIndex = arrOfIndex.filter((item) => item).sort((prev, next) => prev - next);

    return arrOfIndex;
  };

  let getNum = function (array) {
    let result;
    let arrOfNumber = [];

    let arrOfIndex = getArrOfIndexOfOperations(array, operationsArray);
    let firstIndexOfNumber = arrOfIndex[0] - 1;
    let lastIndexOfNumber = arrOfIndex[0] + 2; // что бы захватить в slice последний элемент, нужно прибавлять 2, а не 1

    while (array.length !== 1) {
      arrOfNumber = array.slice(firstIndexOfNumber, lastIndexOfNumber);
      result = String(convertStringToNum(arrOfNumber));
      array.splice(firstIndexOfNumber, arrOfNumber.length, result);
      arrOfIndex = getArrOfIndexOfOperations(array, operationsArray);
    }
    calcOutput.value = array;
  };

  let splitString = function (string) {
    let regExp = new RegExp(/([\+\-\*\/\%])|[^\d\.]/);
    let result = string.split(regExp);
    getNum(result);
  };

  let buttonEvent = function (array) {
    for (let i = 0; i < array.length; i++) {
      let arrayElement = array[i];

      arrayElement.addEventListener('click', function () {
        switch (true) {
          case arrayElement.children[0].textContent === 'C':
            calcInput.value = '';
            calcOutput.value = '';
            break;
          case arrayElement.children[0].textContent === '=':
            splitString(calcInput.value);
            break;
          case arrayElement.children[0].textContent === '<-':
            calcInput.value = calcInput.value.substring(1);
            break;
          default:
            calcInput.value += arrayElement.children[0].textContent;
            break;
        }
      });
    }
  };

  let getCalcButtons = function () {
    let buttonList = [];

    for (let i = 0; i < calcSigns.length; i++) {
      let calcButton = templateButton.cloneNode(true);
      fragment.appendChild(calcButton);

      buttonList.push(calcButton);
      buttonList[i].children[0].textContent = calcSigns[i];
    }

    calcKeyboard.appendChild(fragment);

    buttonEvent(buttonList);
  };

  getCalcButtons();

  calcInput.addEventListener('keyup', function () {
    calcInput.value = calcInput.value.replace(/[,]/g, '.');
    calcInput.value = calcInput.value.replace(/[A-Za-zА-Яа-яЁё]/g, '');
  });

  document.addEventListener('keydown', function (event) {
    switch (true) {
      case event.keyCode === ENTER_KEY:
        splitString(calcInput.value);
        break;
      case event.keyCode === KEYBOARD_EQUAL_KEY:
        splitString(calcInput.value);
        calcInput.value = calcInput.value.substring(1);
        break;
      case event.keyCode === DELETE_KEY:
        calcInput.value = '';
        calcOutput.value = '';
        break;
    }
  });
})();
