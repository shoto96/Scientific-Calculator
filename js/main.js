/**
 * main.js
 * Inicialização e event listeners
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAlgoPanel();

  // Botões numéricos e operadores
  document.querySelectorAll('.btn-calc[data-value]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.value;
      calculator.append(val);
    });
  });

  // Ações especiais
  document.querySelectorAll('.btn-calc[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      switch (action) {
        case 'clear': calculator.clear(); break;
        case 'erase': calculator.erase(); break;
        case 'equal': calculator.calculate(); break;
        case 'percent': calculator.percent(); break;
        case 'negate': calculator.negate(); break;
        case 'toggleAngle': calculator.toggleAngleMode(); break;
        case 'memStore': calculator.memoryStore(); break;
        case 'memRecall': calculator.memoryRecall(); break;
        case 'pi': calculator.applySci('pi'); break;
        case 'e': calculator.applySci('e'); break;
        case 'square': calculator.applySci('square'); break;
        case 'pow': calculator.applySci('pow'); break;
        case 'sqrt': calculator.applySci('sqrt'); break;
        case 'cbrt': calculator.applySci('cbrt'); break;
        case 'sin': calculator.applySci('sin'); break;
        case 'cos': calculator.applySci('cos'); break;
        case 'tan': calculator.applySci('tan'); break;
        case 'asin': calculator.applySci('asin'); break;
        case 'acos': calculator.applySci('acos'); break;
        case 'atan': calculator.applySci('atan'); break;
        case 'log': calculator.applySci('log'); break;
        case 'ln': calculator.applySci('ln'); break;
        case 'log2': calculator.applySci('log2'); break;
        case 'exp': calculator.applySci('exp'); break;
        case 'fact': calculator.applySci('fact'); break;
        case 'abs': calculator.applySci('abs'); break;
        case 'inv': calculator.applySci('inv'); break;
      }
    });
  });

  // Limpar histórico
  document.querySelector('[data-action="clearHistory"]')?.addEventListener('click', () => {
    calculator.clearHistory();
  });

  // Teclado físico
  document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (/[0-9.]/.test(key)) {
      calculator.append(key);
    } else if (['+', '-', '*', '/', '%', '(', ')', '^'].includes(key)) {
      calculator.append(key);
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      calculator.calculate();
    } else if (key === 'Backspace') {
      calculator.erase();
    } else if (key === 'Escape') {
      calculator.clear();
    }
  });

  // Animação de entrada
  document.querySelector('.calculator-card').style.opacity = '0';
  document.querySelector('.calculator-card').style.transform = 'translateY(20px)';
  setTimeout(() => {
    const card = document.querySelector('.calculator-card');
    card.style.transition = 'all 0.5s ease';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, 50);
});
