
const screen = document.getElementById("screen");
const previous = document.getElementById("previous");
const buttons = document.querySelector(".buttons");

let current = "0";
let firstNumber = null;
let operator = null;
let shouldReset = false;

function updateScreen() {
    screen.value = current;
}

function formatNumber(number) {
    if (!Number.isFinite(number)) {
        return "Error";
    }

    return String(Number(number.toPrecision(12)));
}

function enterNumber(number) {
    if (current === "Error") {
        clearCalculator();
    }

    if (shouldReset) {
        current = number;
        shouldReset = false;
    } else if (current === "0") {
        current = number;
    } else if (current.length < 16) {
        current += number;
    }

    updateScreen();
}

function enterDecimal() {
    if (current === "Error") {
        clearCalculator();
    }

    if (shouldReset) {
        current = "0.";
        shouldReset = false;
    } else if (!current.includes(".")) {
        current += ".";
    }

    updateScreen();
}

function chooseOperator(nextOperator) {
    if (current === "Error") return;

    const inputValue = Number(current);

    if (operator !== null && !shouldReset) {
        calculate();
    }

    firstNumber = Number(current);
    operator = nextOperator;
    shouldReset = true;

    previous.textContent =
        `${current} ${getOperatorSymbol(operator)}`;

    updateScreen();
}

function getOperatorSymbol(op) {
    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[op];
}

function calculate() {
    if (operator === null || firstNumber === null) return;
    if (current === "Error") return;

    const secondNumber = Number(current);
    let result;

    switch (operator) {
        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":
            if (secondNumber === 0) {
                current = "Error";
                firstNumber = null;
                operator = null;
                shouldReset = true;
                previous.textContent = "Cannot divide by zero";
                updateScreen();
                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    previous.textContent =
        `${firstNumber} ${getOperatorSymbol(operator)} ${secondNumber} =`;

    current = formatNumber(result);
    firstNumber = null;
    operator = null;
    shouldReset = true;

    updateScreen();
}

function clearCalculator() {
    current = "0";
    firstNumber = null;
    operator = null;
    shouldReset = false;

    previous.textContent = "";
    updateScreen();
}

function deleteLast() {
    if (current === "Error" || shouldReset) {
        clearCalculator();
        return;
    }

    current = current.length > 1
        ? current.slice(0, -1)
        : "0";

    if (current === "-") {
        current = "0";
    }

    updateScreen();
}

function percentage() {
    if (current === "Error") return;

    current = formatNumber(Number(current) / 100);
    shouldReset = true;
    updateScreen();
}

function changeSign() {
    if (current === "Error") return;

    current = formatNumber(-Number(current));
    updateScreen();
}

buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.number !== undefined) {
        enterNumber(button.dataset.number);
        return;
    }

    if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
        return;
    }

    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;

        case "delete":
            deleteLast();
            break;

        case "decimal":
            enterDecimal();
            break;

        case "percent":
            percentage();
            break;

        case "sign":
            changeSign();
            break;

        case "equals":
            calculate();
            break;
    }
});

// Keyboard support
document.addEventListener("keydown", function (event) {
    const key = event.key;

    if (key >= "0" && key <= "9") {
        enterNumber(key);
    } else if (key === ".") {
        enterDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape") {
        clearCalculator();
    } else if (key === "%") {
        percentage();
    }
});

updateScreen();
