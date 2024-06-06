// Componentes

const btnNums = [...document.querySelectorAll('.btn-num')],
btnOps = [...document.querySelectorAll('.btn-op')],
allBtns = [...btnNums, ...btnOps, ...document.querySelectorAll('.btn-esp')],
btnBasicOps = [
    document.querySelector('#op-add'),
    document.querySelector('#op-sub'),
    document.querySelector('#op-tim'),
    document.querySelector('#op-div'),
    document.querySelector('#op-pow'),
    document.querySelector('#op-rad'),
    document.querySelector('#op-fat'),
],
commaFloat = document.querySelector('#op-float'),
openPar = document.querySelector('#open-par'),
closePar = document.querySelector('#close-par'),
toggleSignal = document.querySelector('#toggle-signal'),
btnClr = document.querySelector('#clear-each'),
btnClrAll = document.querySelector('#clear-all'),
btnOnOff = document.querySelector('#onoff'),
res = document.querySelector('#equals'),
display = document.querySelector('#calc-show');

// Variáveis de controle

let displayValue, 
nextNumber, 
lastNumber;

let hasSignal, 
isResult, 
hasComma,
canClosed = true;

hasSignal = isResult = hasComma = false;
displayValue = nextNumber = lastNumber = '';
let isOpened = [];

// Funcionalidades

window.onload = () => {
    display.textContent = '';
    nextNumber = '0';
    allBtns.map((el) => {
        el.disabled = true;
        el.style.cursor = 'default';
    })
}

btnOnOff.addEventListener('click', () => {
    btnOnOff.classList.toggle('btn-on');
    btnOnOff.classList.toggle('btn-off');

    if (!btnOnOff.classList.contains('btn-off')) {
        btnOnOff.textContent = 'OFF';
        displayValue = '';
        display.textContent = '0';
        allBtns.map((el) => {
            el.disabled = false;
            el.style.cursor = 'pointer';
        })
    } else {
        btnOnOff.textContent = 'ON';
        display.textContent = '';
        allBtns.map((el) => {
            el.disabled = true;
            el.style.cursor = 'default';
        })
    }

    hasSignal = hasComma = isResult = false;
    nextNumber = '';
    isOpened = [];
})

allBtns.map((el) => {
    el.addEventListener('click', () => {
        if (displayValue.endsWith('zero.') && (el.classList.contains('btn-num') || el.id == 'clear-char' || el.id == 'clear-all')) {
            displayValue = '';
            btnOps.map((el) => {
                el.disabled = false;
                el.style.cursor = 'pointer';
            })
            res.disabled = false;
            res.style.cursor = 'pointer';
        }
    })
})

btnNums.map((el) => {
    el.addEventListener('click', () => {
        if (displayValue.endsWith('zero.') || isResult) {
            displayValue = '';
            display.textContent = el.textContent;
            nextNumber = el.textContent;
            hasComma = false;
            btnOps.map((el) => {
                el.disabled = false;
                el.style.cursor = 'pointer';
            })
            res.disabled = false;
            res.style.cursor = 'pointer';
        }
        
        if (displayValue.length == 0 && el.textContent == '0') {
            displayValue = '';
            display.textContent = '0';
            nextNumber = '';
            hasSignal = false;
            isResult = false;
        } else {
            displayValue = !hasSignal && displayValue[displayValue.length - 1] == ')' ? displayValue + `*${el.textContent}` : displayValue + el.textContent;
            display.textContent = displayValue;
            hasSignal = false;
            isResult = false;
            nextNumber += el.textContent;
        }
        canClosed = true;
    })
})

btnBasicOps.map((el) => {
    el.addEventListener('click', () => {
        if (!hasSignal) {
            if (displayValue == '' || displayValue[displayValue.length - 1] == '(') {
                if (el.id == 'op-tim') {
                    displayValue += '0*';
                    hasSignal = true;
                } 
                else if (el.id == 'op-pow') {
                    displayValue += '0**';
                    hasSignal = true;
                } 
                else if (el.id == 'op-rad') displayValue += '0**(1/2)';
                else if (el.id == 'op-fat') {
                    displayValue = 1;
                    hasSignal = false;
                }
                else {
                    displayValue += `0${el.textContent}`;
                    hasSignal = true;
                } 
            } else {
                if (el.id == 'op-tim') {
                    displayValue += '*';
                    hasSignal = true;
                } 
                else if (el.id == 'op-pow') {
                    displayValue += '**'
                    hasSignal = true;
                } 
                else if (el.id == 'op-rad') displayValue += '**(1/2)';
                else if (el.id == 'op-fat') {
                    if (nextNumber == '0') displayValue = displayValue.substring(0, displayValue.length - 1) + '1';
                    else {
                        for (let i = nextNumber - 1; i > 1; i--) displayValue += `*${i}`;
                    }
                }
                else {
                    displayValue += el.textContent;  
                    hasSignal = true;
                } 
            }
        }

        isResult = hasComma = false;
        lastNumber = nextNumber;
        nextNumber = '';
        canClosed = false;
        display.textContent = displayValue;
    })
})

commaFloat.addEventListener('click', () => {
    if (!hasComma && displayValue.length == 0 || isResult || displayValue[displayValue.length - 1] == '(') {
        nextNumber = '';
        nextNumber = '0.';
        displayValue += '0.';
        display.textContent = displayValue;
        hasSignal = true;
    } else if (!hasComma && nextNumber.length > 0) {
        displayValue += '.';
        nextNumber += '.';
        display.textContent = displayValue;
        hasSignal = true;
    }
    hasComma = true;
    isResult = false;
})

openPar.addEventListener('click', () => {
    if (displayValue != '' && !hasSignal && displayValue[displayValue.length - 1] != '(') {
        displayValue += '*(';
        display.textContent = displayValue;
        isResult = false;
        canClosed = false;
        lastNumber = nextNumber;
        nextNumber = '';
    } else {
        displayValue += openPar.textContent;
        display.textContent = displayValue;
        canClosed = false;
        lastNumber = nextNumber;
        nextNumber = '';
    }
    isOpened.push('(');
    hasSignal = false;
})

closePar.addEventListener('click', () => {
    if (isOpened.length > 0 && canClosed) {
        displayValue += closePar.textContent;
        display.textContent = displayValue;
        isOpened.pop();
    }
})

toggleSignal.addEventListener('click', () => {
    if (displayValue[displayValue.length - nextNumber.length - 1] == '+') {
        displayValue = displayValue.substring(0, displayValue.length - nextNumber.length - 1) + '-' + displayValue.substring(displayValue.length - nextNumber.length);
        display.textContent = displayValue;
    } else if (displayValue[displayValue.length - nextNumber.length - 1] == '-') {
        displayValue = displayValue.substring(0, displayValue.length - nextNumber.length - 1) + '+' + displayValue.substring(displayValue.length - nextNumber.length);
        display.textContent = displayValue;
    } else if (displayValue[displayValue.length - nextNumber.length - 1] == '*' || displayValue[displayValue.length - nextNumber.length - 1] == '/') {
        displayValue = nextNumber != '' ? displayValue.substring(0, displayValue.length - nextNumber.length) + `(-${nextNumber})` : displayValue.substring(0, displayValue.length - nextNumber.length) + `(-${lastNumber})`;
        display.textContent = displayValue;
    } else if (displayValue == nextNumber) {
        displayValue = `-${displayValue}`; 
        display.textContent = displayValue;
    }
})

btnClr.addEventListener('click', () => {
    if (displayValue.length == 2 && displayValue[0] == '-' || displayValue[0] == '+') {
        displayValue = '';
        display.textContent = '0';
    } else if (displayValue.length == 2 && displayValue[0] == '0') {
        displayValue = '';
        display.textContent = '0';
        hasSignal = false;
    } else if (displayValue.length > 0 && (displayValue.endsWith('+') || displayValue.endsWith('-') || displayValue.endsWith('/') || displayValue.endsWith('*') || displayValue.endsWith('**'))) {
        hasSignal = false;
    } else if (displayValue.endsWith('Infinity')) {
        displayValue = '';
    } else if (displayValue[displayValue.length - 2] == '.' || displayValue[displayValue.length - 2] == '+' || displayValue[displayValue.length - 2] == '-' || displayValue[displayValue.length - 2] == '*' || displayValue[displayValue.length - 2] == '/') {
        hasSignal = true;
    } else if (displayValue[displayValue.length - 1] == '.') {
        hasComma = false;
    } else if (displayValue[displayValue.length - 1] == ')') {
        isOpened.push('(');
    } else if (displayValue[displayValue.length - 1] == '(') {
        isOpened.pop();
    }

    if (displayValue.endsWith('**')) {
        displayValue = displayValue.slice(0, -2);
        nextNumber = nextNumber.slice(0, -2);
        if (displayValue == '0') displayValue = '';
    } else if (displayValue.endsWith('**(1/2)')) {
        displayValue = displayValue.slice(0, -7);
        nextNumber = nextNumber.slice(0, -7);
        if (displayValue == '0') displayValue = '';
    } else {
        displayValue = displayValue.slice(0, -1);
        nextNumber = nextNumber.slice(0, -1);
    }
        
    display.textContent = displayValue;

    if (displayValue == '') {
        display.textContent = '0';
        isResult = false;
    }
})

btnClrAll.addEventListener('click', () => {
    displayValue = '';
    display.textContent = '0';
    hasSignal = hasComma = false;
    nextNumber = '';
    lastNumber = '';
    isOpened = [];
})

res.addEventListener('click', () => {
    if (isOpened.length > 0) {
        if (!canClosed) {
            for (let i = 0; i < isOpened.length; i++) {
                if (i == 0) {
                    if (lastNumber != '') {
                        console.log(lastNumber);
                        displayValue += `${lastNumber})`;
                    } 
                    else {
                        console.log(nextNumber);
                        displayValue += `${nextNumber})`;
                    } 
                } else {
                    displayValue += ')';
                }
            }
        } else {
            for (let i = 0; i < isOpened.length; i++) displayValue += ')';
        }
        display.textContent = displayValue;
        isOpened = [];
    }

    displayValue = String(eval(displayValue));

    if (parseInt(nextNumber) != nextNumber) {
        hasComma = true;
    } else {
        hasComma = false;
    }

    if (displayValue.endsWith('Infinity') || displayValue == 'NaN') {
        if (displayValue.indexOf('/0') != -1) displayValue = 'Não é possível dividir por zero.';
        btnOps.map((el) => {
            el.disabled = true;
            el.style.cursor = 'default';
        })
        res.disabled = true;
        res.style.cursor = 'default';
    } else {
        nextNumber = displayValue;
    }

    if (displayValue == '0') {
        displayValue = '';
        display.textContent = '0';
    } else display.textContent = displayValue;

    isResult = true;
    isOpened = [];
})