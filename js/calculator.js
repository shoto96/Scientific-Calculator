/**
 * calculator.js
 * Lógica principal da calculadora científica
 */

const CalculatorState = {
  inputValue: '',
  equalPressed: false,
  isDegree: false,
  memory: 0,
  history: [],
  maxHistory: 20
};

class Calculator {
  constructor() {
    this.input = document.getElementById('input');
    this.historyText = document.getElementById('historyText');
  }

  append(value) {
    if (CalculatorState.equalPressed) {
      CalculatorState.inputValue = '';
      CalculatorState.equalPressed = false;
    }
    CalculatorState.inputValue += value;
    this.updateDisplay();
  }

  clear() {
    CalculatorState.inputValue = '';
    CalculatorState.equalPressed = false;
    this.historyText.textContent = '';
    this.updateDisplay();
  }

  erase() {
    CalculatorState.inputValue = CalculatorState.inputValue.slice(0, -1);
    this.updateDisplay();
  }

  negate() {
    if (!CalculatorState.inputValue) return;
    // tenta negar o último número
    const match = CalculatorState.inputValue.match(/(.*?)((?:-?\d+\.?\d*)|(?:-?\.\d+))$/);
    if (match) {
      const num = parseFloat(match[2]);
      const negated = -num;
      CalculatorState.inputValue = match[1] + (negated < 0 ? '' : '+') + negated;
      this.updateDisplay();
    }
  }

  percent() {
    try {
      const val = algoEngine.shuntingYard(CalculatorState.inputValue);
      CalculatorState.inputValue = String(val / 100);
      this.updateDisplay();
    } catch (e) {
      this.showError();
    }
  }

  calculate() {
    if (!CalculatorState.inputValue) return;
    const expr = CalculatorState.inputValue;
    try {
      const result = algoEngine.shuntingYard(expr);
      const formatted = this.formatResult(result);
      this.historyText.textContent = expr + ' =';
      CalculatorState.inputValue = String(formatted);
      CalculatorState.equalPressed = true;
      this.addToHistory(expr, formatted);
      this.updateDisplay();
    } catch (e) {
      this.showError();
    }
  }

  formatResult(value) {
    if (!isFinite(value)) return 'Error';
    if (Number.isInteger(value)) return value;
    const fixed = value.toFixed(8);
    return parseFloat(fixed); // remove zeros à direita
  }

  showError() {
    CalculatorState.inputValue = 'Error';
    CalculatorState.equalPressed = true;
    this.updateDisplay();
    setTimeout(() => {
      CalculatorState.inputValue = '';
      this.updateDisplay();
    }, 1200);
  }

  updateDisplay() {
    this.input.value = CalculatorState.inputValue;
  }

  // Funções científicas
  applySci(func) {
    if (func === 'pi') {
      if (CalculatorState.equalPressed) CalculatorState.inputValue = '';
      CalculatorState.inputValue += 'pi';
      CalculatorState.equalPressed = false;
      this.updateDisplay();
      return;
    }
    if (func === 'e') {
      if (CalculatorState.equalPressed) CalculatorState.inputValue = '';
      CalculatorState.inputValue += 'e';
      CalculatorState.equalPressed = false;
      this.updateDisplay();
      return;
    }
    if (func === 'square') {
      this.wrapInput('(', ')^2');
      return;
    }
    if (func === 'pow') {
      CalculatorState.inputValue += '^';
      CalculatorState.equalPressed = false;
      this.updateDisplay();
      return;
    }
    if (func === 'negate') {
      this.negate();
      return;
    }
    this.wrapInput(func + '(', ')');
  }

  wrapInput(before, after) {
    const current = CalculatorState.inputValue;
    if (CalculatorState.equalPressed) {
      CalculatorState.inputValue = before + current + after;
      CalculatorState.equalPressed = false;
    } else {
      CalculatorState.inputValue += before + after;
    }
    this.updateDisplay();
  }

  // Memória
  memoryStore() {
    try {
      const val = algoEngine.shuntingYard(CalculatorState.inputValue || '0');
      CalculatorState.memory = val;
      this.showToast('Memória armazenada: ' + this.formatResult(val));
    } catch (e) {
      this.showToast('Erro ao armazenar memória');
    }
  }

  memoryRecall() {
    if (CalculatorState.equalPressed) {
      CalculatorState.inputValue = '';
      CalculatorState.equalPressed = false;
    }
    CalculatorState.inputValue += String(CalculatorState.memory);
    this.updateDisplay();
  }

  showToast(msg) {
    // Simples toast visual
    const toast = document.createElement('div');
    toast.className = 'position-fixed top-0 start-50 translate-middle-x mt-3 alert alert-dark px-3 py-2';
    toast.style.zIndex = 9999;
    toast.style.fontSize = '0.85rem';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  // Histórico
  addToHistory(expr, result) {
    CalculatorState.history.unshift({ expr, result, time: new Date() });
    if (CalculatorState.history.length > CalculatorState.maxHistory) {
      CalculatorState.history.pop();
    }
    renderHistory();
  }

  clearHistory() {
    CalculatorState.history = [];
    renderHistory();
  }

  toggleAngleMode() {
    CalculatorState.isDegree = !CalculatorState.isDegree;
    const badge = document.getElementById('angleMode');
    const btn = document.getElementById('btnToggleAngle');
    if (CalculatorState.isDegree) {
      badge.textContent = 'DEG';
      btn.textContent = 'RAD';
    } else {
      badge.textContent = 'RAD';
      btn.textContent = 'DEG';
    }
  }
}

const calculator = new Calculator();
