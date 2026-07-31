/**
 * ui.js
 * Interface, tema, histórico e integração com algoritmos
 */

function renderHistory() {
  const list = document.getElementById('historyList');
  if (CalculatorState.history.length === 0) {
    list.innerHTML = '<div class="text-muted small text-center py-3">Nenhum cálculo ainda</div>';
    return;
  }
  list.innerHTML = CalculatorState.history.map((h, idx) => `
    <div class="history-item" onclick="loadHistory(${idx})">
      <span class="history-expr">${escapeHtml(h.expr)}</span>
      <span class="history-res">${h.result}</span>
    </div>
  `).join('');
}

function loadHistory(index) {
  const item = CalculatorState.history[index];
  if (!item) return;
  CalculatorState.inputValue = item.expr;
  CalculatorState.equalPressed = false;
  calculator.updateDisplay();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Tema Dark/Light
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const icon = toggle.querySelector('i');

  // Verifica preferência salva
  const saved = localStorage.getItem('calc-theme');
  if (saved) {
    html.setAttribute('data-bs-theme', saved);
    updateIcon(saved);
  }

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-bs-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-bs-theme', next);
    localStorage.setItem('calc-theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }
}

// Painel de Algoritmos
function initAlgoPanel() {
  const select = document.getElementById('algoSelect');
  select.addEventListener('change', () => {
    document.querySelectorAll('.algo-section').forEach(el => el.classList.add('d-none'));
    const val = select.value;
    if (val) {
      const section = document.querySelector(`.algo-section[data-algo="${val}"]`);
      if (section) section.classList.remove('d-none');
    }
  });

  // Botões de ação dos algoritmos
  document.querySelectorAll('[data-action]').forEach(btn => {
    const action = btn.dataset.action;
    if (action.startsWith('run')) {
      btn.addEventListener('click', () => runAlgorithm(action));
    }
  });
}

function runAlgorithm(action) {
  try {
    switch (action) {
      case 'runShunting': {
        const expr = CalculatorState.inputValue;
        if (!expr) { showAlgoResult('fibResult', 'Digite uma expressão primeiro'); return; }
        const res = algoEngine.shuntingYard(expr);
        calculator.historyText.textContent = expr + ' =';
        CalculatorState.inputValue = String(calculator.formatResult(res));
        CalculatorState.equalPressed = true;
        calculator.updateDisplay();
        calculator.addToHistory(expr, calculator.formatResult(res));
        showAlgoResult('fibResult', `Resultado: ${calculator.formatResult(res)}`);
        break;
      }
      case 'runFibonacci': {
        const n = parseInt(document.getElementById('fibInput').value);
        const seq = algoEngine.fibonacci(n);
        showAlgoResult('fibResult', `F(${n}) = ${seq[seq.length - 1]}<br><small class="text-secondary">[${seq.join(', ')}]</small>`);
        break;
      }
      case 'runFactorial': {
        const n = parseInt(document.getElementById('factInput').value);
        const res = algoEngine.factorial(n);
        showAlgoResult('factResult', `${n}! = ${res.toLocaleString('pt-BR')}`);
        break;
      }
      case 'runBaseConv': {
        const val = document.getElementById('baseInput').value.trim();
        const from = parseInt(document.getElementById('baseFrom').value);
        const to = parseInt(document.getElementById('baseTo').value);
        const res = algoEngine.baseConversion(val, from, to);
        showAlgoResult('baseResult', `${val}<sub>${from}</sub> = ${res}<sub>${to}</sub>`);
        break;
      }
      case 'runQuadratic': {
        const a = parseFloat(document.getElementById('quadA').value);
        const b = parseFloat(document.getElementById('quadB').value);
        const c = parseFloat(document.getElementById('quadC').value);
        const res = algoEngine.solveQuadratic(a, b, c);
        if (res.type === 'complex') {
          showAlgoResult('quadResult', `Δ = ${res.delta.toFixed(4)}<br>x₁ = ${res.x1}<br>x₂ = ${res.x2}`);
        } else {
          showAlgoResult('quadResult', `Δ = ${res.delta.toFixed(4)}<br>x₁ = ${res.x1.toFixed(6)}<br>x₂ = ${res.x2.toFixed(6)}`);
        }
        break;
      }
      case 'runPrime': {
        const n = parseInt(document.getElementById('primeInput').value);
        const isPrime = algoEngine.isPrime(n);
        showAlgoResult('primeResult', isPrime
          ? `<span class="text-success"><i class="fa-solid fa-check-circle"></i> ${n} é primo</span>`
          : `<span class="text-danger"><i class="fa-solid fa-xmark-circle"></i> ${n} não é primo</span>`
        );
        break;
      }
      case 'runGcd': {
        const a = parseInt(document.getElementById('gcdA').value);
        const b = parseInt(document.getElementById('gcdB').value);
        const g = algoEngine.gcd(a, b);
        const l = algoEngine.lcm(a, b);
        showAlgoResult('gcdResult', `MDC(${a}, ${b}) = ${g}<br>MMC(${a}, ${b}) = ${l}`);
        break;
      }
    }
  } catch (e) {
    const activeResult = document.querySelector('.algo-section:not(.d-none) .algo-result');
    if (activeResult) activeResult.innerHTML = `<span class="text-danger">Erro: ${e.message}</span>`;
    else calculator.showError();
  }
}

function showAlgoResult(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}
