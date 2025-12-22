let expression = '';
let isDegree = true;

const exprEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const angleBtn = document.getElementById('angleBtn');

/* ---------------- HELPERS ---------------- */

const operators = ['+', '-', '*', '/', '^'];

function isOperator(ch) {
  return operators.includes(ch);
}

function update() {
  exprEl.textContent = expression;
}

/* ---------------- INPUT HANDLING ---------------- */

function add(value) {
  const last = expression.at(-1);

  // dot rule
  if (value === '.' && /\.\d*$/.test(expression)) return;

  // operator normalization
  if (isOperator(value)) {
    // unary minus
    if (value === '-' && (!expression || last === '(')) {
      expression += value;
      update();
      return;
    }

    // replace stacked operators
    if (isOperator(last)) {
      expression = expression.slice(0, -1) + value;
      update();
      return;
    }
  }

  expression += value;
  update();
}

function clearAll() {
  expression = '';
  update();
  resultEl.textContent = '0';
}

/* ---------------- BUTTON EVENTS ---------------- */

document.querySelectorAll('[data-num]').forEach(b =>
  b.onclick = () => add(b.dataset.num)
);

document.querySelectorAll('[data-op]').forEach(b =>
  b.onclick = () => add(b.dataset.op)
);

document.querySelectorAll('[data-fn]').forEach(b =>
  b.onclick = () => add(b.dataset.fn + '(')
);

document.getElementById('equals').onclick = calculate;
document.getElementById('clearBtn').onclick = clearAll;

angleBtn.onclick = () => {
  isDegree = !isDegree;
  angleBtn.textContent = isDegree ? 'DEG' : 'RAD';
};

/* ---------------- KEYBOARD ---------------- */

document.addEventListener('keydown', e => {
  const k = e.key;

  if (/[0-9]/.test(k)) add(k);
  else if (operators.includes(k) || ['(', ')', '.'].includes(k)) add(k);
  else if (k === 'Enter' || k === '=') {
    e.preventDefault();
    calculate();
  }
  else if (k === 'Backspace') {
    expression = expression.slice(0, -1);
    update();
  }
  else if (k === 'Escape') clearAll();
  else if (k === 's') add('sin(');
  else if (k === 'c') add('cos(');
  else if (k === 't') add('tan(');
  else if (k === 'l') add('log(');
  else if (k === 'n') add('ln(');
});

/* ---------------- TOKENIZER ---------------- */

function tokenize(str) {
  const tokens = [];
  let i = 0;

  while (i < str.length) {
    const ch = str[i];

    if (/\s/.test(ch)) { i++; continue; }

    if (/\d|\./.test(ch)) {
      let n = '';
      while (/\d|\./.test(str[i])) n += str[i++];
      tokens.push({ type: 'num', value: +n });
      continue;
    }

    if (/[a-z]/i.test(ch)) {
      let fn = '';
      while (/[a-z]/i.test(str[i])) fn += str[i++];
      tokens.push({ type: 'fn', value: fn });
      continue;
    }

    if ('+-*/^()'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }

    throw Error('Invalid input');
  }
  return tokens;
}

/* ---------------- PARSER ---------------- */

const prec = { '+':1,'-':1,'*':2,'/':2,'^':3 };

function toRPN(tokens) {
  const out = [];
  const stack = [];

  for (const t of tokens) {
    if (t.type === 'num') out.push(t);
    else if (t.type === 'fn') stack.push(t);
    else if (t.value === '(') stack.push(t);
    else if (t.value === ')') {
      while (stack.at(-1)?.value !== '(') out.push(stack.pop());
      stack.pop();
      if (stack.at(-1)?.type === 'fn') out.push(stack.pop());
    } else {
      while (stack.length && prec[stack.at(-1).value] >= prec[t.value])
        out.push(stack.pop());
      stack.push(t);
    }
  }
  return out.concat(stack.reverse());
}

/* ---------------- EVALUATOR ---------------- */

function evaluate(rpn) {
  const s = [];

  for (const t of rpn) {
    if (t.type === 'num') s.push(t.value);
    else if (t.type === 'fn') {
      let x = s.pop();
      if (isDegree) x *= Math.PI / 180;
      if (t.value === 'sin') s.push(Math.sin(x));
      if (t.value === 'cos') s.push(Math.cos(x));
      if (t.value === 'tan') s.push(Math.tan(x));
      if (t.value === 'log') s.push(Math.log10(x));
      if (t.value === 'ln') s.push(Math.log(x));
    } else {
      const b = s.pop();
      const a = s.pop();
      if (t.value === '+') s.push(a + b);
      if (t.value === '-') s.push(a - b);
      if (t.value === '*') s.push(a * b);
      if (t.value === '/') {
        if (b === 0) throw Error();
        s.push(a / b);
      }
      if (t.value === '^') s.push(a ** b);
    }
  }
  return s[0];
}

/* ---------------- CALCULATE ---------------- */

function calculate() {
  try {
    const tokens = tokenize(expression);
    const rpn = toRPN(tokens);
    const result = evaluate(rpn);
    if (!isFinite(result)) throw Error();
    resultEl.textContent = +result.toFixed(10);
  } catch {
    resultEl.textContent = 'Error';
  }
}
