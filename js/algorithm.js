/**
 * algorithm.js
 * Algoritmos matemáticos avançados para a Calculadora Científica Pro
 */

class AlgorithmEngine {
  constructor() {
    this.operators = {
      '+': { precedence: 1, associativity: 'left', arity: 2 },
      '-': { precedence: 1, associativity: 'left', arity: 2 },
      '*': { precedence: 2, associativity: 'left', arity: 2 },
      '/': { precedence: 2, associativity: 'left', arity: 2 },
      '%': { precedence: 2, associativity: 'left', arity: 2 },
      '^': { precedence: 3, associativity: 'right', arity: 2 },
    };
    this.functions = new Set([
      'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
      'log', 'ln', 'log2', 'sqrt', 'cbrt', 'abs', 'exp', 'fact'
    ]);
    this.constants = { 'pi': Math.PI, 'e': Math.E };
  }

  /**
   * Algoritmo Shunting Yard de Dijkstra
   * Converte expressão infixa para notação polonesa reversa (RPN)
   * e depois avalia com segurança (sem usar eval)
   */
  shuntingYard(expression) {
    const tokens = this.tokenize(expression);
    const output = [];
    const stack = [];

    for (const token of tokens) {
      if (this.isNumber(token)) {
        output.push(parseFloat(token));
      } else if (this.functions.has(token)) {
        stack.push(token);
      } else if (token === ',') {
        while (stack.length && stack[stack.length - 1] !== '(') {
          output.push(stack.pop());
        }
      } else if (this.operators[token]) {
        while (stack.length) {
          const top = stack[stack.length - 1];
          if (!this.operators[top]) break;
          const o1 = this.operators[token];
          const o2 = this.operators[top];
          if (
            (o1.associativity === 'left' && o1.precedence <= o2.precedence) ||
            (o1.associativity === 'right' && o1.precedence < o2.precedence)
          ) {
            output.push(stack.pop());
          } else {
            break;
          }
        }
        stack.push(token);
      } else if (token === '(') {
        stack.push(token);
      } else if (token === ')') {
        while (stack.length && stack[stack.length - 1] !== '(') {
          output.push(stack.pop());
        }
        stack.pop(); // remove '('
        if (stack.length && this.functions.has(stack[stack.length - 1])) {
          output.push(stack.pop());
        }
      } else if (this.constants[token] !== undefined) {
        output.push(this.constants[token]);
      }
    }

    while (stack.length) {
      const op = stack.pop();
      if (op === '(' || op === ')') throw new Error('Expressão inválida');
      output.push(op);
    }

    return this.evaluateRPN(output);
  }

  tokenize(expr) {
    const tokens = [];
    let i = 0;
    expr = expr.toLowerCase().replace(/\s+/g, '');

    while (i < expr.length) {
      const ch = expr[i];

      if (/[0-9.]/.test(ch)) {
        let num = '';
        while (i < expr.length && /[0-9.]/.test(expr[i])) {
          num += expr[i];
          i++;
        }
        tokens.push(num);
        continue;
      }

      if (/[a-z]/.test(ch)) {
        let word = '';
        while (i < expr.length && /[a-z]/.test(expr[i])) {
          word += expr[i];
          i++;
        }
        tokens.push(word);
        continue;
      }

      if (ch === '-' && (i === 0 || expr[i - 1] === '(' || this.operators[expr[i - 1]])) {
        // unary minus
        let num = '-';
        i++;
        while (i < expr.length && /[0-9.]/.test(expr[i])) {
          num += expr[i];
          i++;
        }
        tokens.push(num);
        continue;
      }

      tokens.push(ch);
      i++;
    }

    return tokens;
  }

  isNumber(token) {
    return !isNaN(parseFloat(token)) && isFinite(token);
  }

  evaluateRPN(rpn) {
    const stack = [];

    for (const token of rpn) {
      if (typeof token === 'number') {
        stack.push(token);
      } else if (this.operators[token]) {
        const b = stack.pop();
        const a = stack.pop();
        if (a === undefined || b === undefined) throw new Error('Operadores insuficientes');
        stack.push(this.applyOperator(token, a, b));
      } else if (this.functions.has(token)) {
        const a = stack.pop();
        if (a === undefined) throw new Error('Argumento insuficiente');
        stack.push(this.applyFunction(token, a));
      }
    }

    if (stack.length !== 1) throw new Error('Expressão inválida');
    return stack[0];
  }

  applyOperator(op, a, b) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/':
        if (b === 0) throw new Error('Divisão por zero');
        return a / b;
      case '%': return a % b;
      case '^': return Math.pow(a, b);
      default: throw new Error('Operador desconhecido: ' + op);
    }
  }

  applyFunction(fn, x) {
    const angle = CalculatorState.isDegree ? (x * Math.PI / 180) : x;
    switch (fn) {
      case 'sin': return Math.sin(angle);
      case 'cos': return Math.cos(angle);
      case 'tan': return Math.tan(angle);
      case 'asin':
        const asinRes = Math.asin(x);
        return CalculatorState.isDegree ? (asinRes * 180 / Math.PI) : asinRes;
      case 'acos':
        const acosRes = Math.acos(x);
        return CalculatorState.isDegree ? (acosRes * 180 / Math.PI) : acosRes;
      case 'atan':
        const atanRes = Math.atan(x);
        return CalculatorState.isDegree ? (atanRes * 180 / Math.PI) : atanRes;
      case 'log': return Math.log10(x);
      case 'ln': return Math.log(x);
      case 'log2': return Math.log2(x);
      case 'sqrt': return Math.sqrt(x);
      case 'cbrt': return Math.cbrt(x);
      case 'abs': return Math.abs(x);
      case 'exp': return Math.exp(x);
      case 'fact': return this.factorial(Math.floor(x));
      default: throw new Error('Função desconhecida: ' + fn);
    }
  }

  // ---- Algoritmos adicionais ----

  factorial(n) {
    if (n < 0) throw new Error('Fatorial de número negativo');
    if (n > 170) throw new Error('Número muito grande');
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }

  fibonacci(n) {
    if (n < 0) throw new Error('n deve ser >= 0');
    if (n > 100) throw new Error('Limite máximo: 100');
    if (n === 0) return [0];
    if (n === 1) return [0, 1];
    const seq = [0, 1];
    for (let i = 2; i <= n; i++) {
      seq.push(seq[i - 1] + seq[i - 2]);
    }
    return seq;
  }

  baseConversion(value, fromBase, toBase) {
    const decimal = parseInt(String(value), fromBase);
    if (isNaN(decimal)) throw new Error('Valor inválido para a base de origem');
    if (toBase === 10) return String(decimal);
    return decimal.toString(toBase).toUpperCase();
  }

  solveQuadratic(a, b, c) {
    if (a === 0) throw new Error('a não pode ser zero');
    const delta = b * b - 4 * a * c;
    if (delta < 0) {
      const real = -b / (2 * a);
      const imag = Math.sqrt(-delta) / (2 * a);
      return {
        type: 'complex',
        x1: `${real.toFixed(4)} + ${imag.toFixed(4)}i`,
        x2: `${real.toFixed(4)} - ${imag.toFixed(4)}i`,
        delta
      };
    }
    const x1 = (-b + Math.sqrt(delta)) / (2 * a);
    const x2 = (-b - Math.sqrt(delta)) / (2 * a);
    return { type: 'real', x1, x2, delta };
  }

  isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  }

  gcd(a, b) {
    a = Math.abs(Math.floor(a));
    b = Math.abs(Math.floor(b));
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / this.gcd(a, b);
  }
}

const algoEngine = new AlgorithmEngine();
