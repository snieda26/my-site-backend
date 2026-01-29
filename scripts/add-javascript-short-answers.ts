/**
 * JavaScript short answers
 * Usage: npx tsx scripts/add-javascript-short-answers.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import * as dotenv from 'dotenv'
import * as schema from '../src/core/database/schema'

const postgres = require('postgres')
dotenv.config({ path: '.env' })

let connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is not set')
connectionString = connectionString.split('?')[0]

const client = postgres(connectionString)
const db = drizzle(client, { schema })

const shortAnswers: Record<string, { en: string; ua: string }> = {
  'what-is-arguments-pseudo-array-in-javascript': {
    en: `\`arguments\` is an array-like object available in regular functions containing all passed arguments.

\`\`\`javascript
function sum() {
  return Array.from(arguments).reduce((a, b) => a + b, 0);
}
sum(1, 2, 3); // 6
\`\`\`

**Note:** Arrow functions don't have \`arguments\`. Use rest parameters (\`...args\`) instead.`,
    ua: `\`arguments\` — це псевдомасив у звичайних функціях, що містить усі передані аргументи.

\`\`\`javascript
function sum() {
  return Array.from(arguments).reduce((a, b) => a + b, 0);
}
sum(1, 2, 3); // 6
\`\`\`

**Примітка:** Стрілкові функції не мають \`arguments\`. Використовуйте rest-параметри (\`...args\`).`,
  },
  'mutating-and-non-mutating-array-methods-in-javascript': {
    en: `**Mutating methods** change the original array:
\`push\`, \`pop\`, \`shift\`, \`unshift\`, \`splice\`, \`sort\`, \`reverse\`, \`fill\`

**Non-mutating methods** return a new array:
\`map\`, \`filter\`, \`slice\`, \`concat\`, \`flat\`, \`flatMap\`, \`toSorted\`, \`toReversed\`

\`\`\`javascript
const arr = [3, 1, 2];
arr.sort(); // mutates arr
[...arr].sort(); // safe copy
\`\`\``,
    ua: `**Мутуючі методи** змінюють оригінальний масив:
\`push\`, \`pop\`, \`shift\`, \`unshift\`, \`splice\`, \`sort\`, \`reverse\`, \`fill\`

**Немутуючі методи** повертають новий масив:
\`map\`, \`filter\`, \`slice\`, \`concat\`, \`flat\`, \`flatMap\`, \`toSorted\`, \`toReversed\`

\`\`\`javascript
const arr = [3, 1, 2];
arr.sort(); // мутує arr
[...arr].sort(); // безпечна копія
\`\`\``,
  },
  'what-is-asyncawait-in-javascript': {
    en: `\`async/await\` is syntax for working with Promises more readably.

\`\`\`javascript
async function fetchUser(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Failed:', error);
  }
}
\`\`\`

\`async\` functions always return a Promise. \`await\` pauses execution until Promise resolves.`,
    ua: `\`async/await\` — це синтаксис для зручнішої роботи з Promise.

\`\`\`javascript
async function fetchUser(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Failed:', error);
  }
}
\`\`\`

\`async\` функції завжди повертають Promise. \`await\` призупиняє виконання до вирішення Promise.`,
  },
  'boxing-and-unboxing-in-javascript': {
    en: `**Boxing** — automatic wrapping of primitives in object wrappers to access methods.

\`\`\`javascript
'hello'.toUpperCase(); // 'hello' is boxed to String object
(42).toFixed(2); // 42 is boxed to Number object
\`\`\`

**Unboxing** — converting wrapper objects back to primitives via \`valueOf()\` or type coercion.`,
    ua: `**Boxing** — автоматичне загортання примітивів в обʼєкти-обгортки для доступу до методів.

\`\`\`javascript
'hello'.toUpperCase(); // 'hello' загортається в String
(42).toFixed(2); // 42 загортається в Number
\`\`\`

**Unboxing** — перетворення обʼєктів-обгорток назад у примітиви через \`valueOf()\` або приведення типів.`,
  },
  'event-propagation-in-javascript-and-its-phases': {
    en: `Event propagation has **3 phases**:

1. **Capturing** — event travels from window down to target
2. **Target** — event reaches the target element
3. **Bubbling** — event bubbles up from target to window

\`\`\`javascript
element.addEventListener('click', handler, true); // capturing
element.addEventListener('click', handler); // bubbling (default)
\`\`\``,
    ua: `Поширення подій має **3 фази**:

1. **Захоплення (Capturing)** — подія йде від window до цілі
2. **Ціль (Target)** — подія досягає цільового елемента
3. **Спливання (Bubbling)** — подія піднімається від цілі до window

\`\`\`javascript
element.addEventListener('click', handler, true); // capturing
element.addEventListener('click', handler); // bubbling (за замовч.)
\`\`\``,
  },
  'call-apply-and-bind-methods-in-javascript': {
    en: `Methods to set \`this\` context:

- **call(thisArg, arg1, arg2)** — calls function immediately with arguments
- **apply(thisArg, [args])** — same but arguments as array
- **bind(thisArg)** — returns new function with bound \`this\`

\`\`\`javascript
func.call(obj, 1, 2);
func.apply(obj, [1, 2]);
const bound = func.bind(obj);
\`\`\``,
    ua: `Методи для встановлення контексту \`this\`:

- **call(thisArg, arg1, arg2)** — викликає функцію з аргументами
- **apply(thisArg, [args])** — те саме, але аргументи масивом
- **bind(thisArg)** — повертає нову функцію з привʼязаним \`this\`

\`\`\`javascript
func.call(obj, 1, 2);
func.apply(obj, [1, 2]);
const bound = func.bind(obj);
\`\`\``,
  },
  'closures-in-javascript-javascript': {
    en: `**Closure** is a function that remembers its lexical scope even when executed outside of it.

\`\`\`javascript
function createCounter() {
  let count = 0;
  return () => ++count;
}
const counter = createCounter();
counter(); // 1
counter(); // 2
\`\`\`

The inner function "closes over" the \`count\` variable.`,
    ua: `**Замикання** — це функція, що памʼятає своє лексичне оточення навіть при виконанні поза ним.

\`\`\`javascript
function createCounter() {
  let count = 0;
  return () => ++count;
}
const counter = createCounter();
counter(); // 1
counter(); // 2
\`\`\`

Внутрішня функція "замикає" змінну \`count\`.`,
  },
  'how-to-copy-an-object-in-javascript': {
    en: `**Shallow copy:**
\`\`\`javascript
const copy1 = { ...original };
const copy2 = Object.assign({}, original);
\`\`\`

**Deep copy:**
\`\`\`javascript
const deep = structuredClone(original);
const deep2 = JSON.parse(JSON.stringify(original)); // loses functions
\`\`\`

Shallow copies share nested object references; deep copies are fully independent.`,
    ua: `**Поверхнева копія:**
\`\`\`javascript
const copy1 = { ...original };
const copy2 = Object.assign({}, original);
\`\`\`

**Глибока копія:**
\`\`\`javascript
const deep = structuredClone(original);
const deep2 = JSON.parse(JSON.stringify(original)); // втрачає функції
\`\`\`

Поверхневі копії мають спільні посилання на вкладені обʼєкти; глибокі — повністю незалежні.`,
  },
  'what-is-currying-in-javascript': {
    en: `**Currying** transforms a function with multiple arguments into a sequence of functions each taking one argument.

\`\`\`javascript
const add = a => b => c => a + b + c;
add(1)(2)(3); // 6

// Practical use
const multiply = a => b => a * b;
const double = multiply(2);
double(5); // 10
\`\`\``,
    ua: `**Каррінг** перетворює функцію з кількома аргументами на послідовність функцій, кожна з яких приймає один аргумент.

\`\`\`javascript
const add = a => b => c => a + b + c;
add(1)(2)(3); // 6

// Практичне використання
const multiply = a => b => a * b;
const double = multiply(2);
double(5); // 10
\`\`\``,
  },
  'debounce-and-throttle-in-javascript': {
    en: `**Debounce** — delays execution until after a pause in calls (e.g., search input)

**Throttle** — limits execution to once per time interval (e.g., scroll handler)

\`\`\`javascript
// Debounce: executes 300ms after last call
const debounced = debounce(search, 300);

// Throttle: executes max once per 100ms
const throttled = throttle(onScroll, 100);
\`\`\``,
    ua: `**Debounce** — затримує виконання до паузи у викликах (напр., пошуковий input)

**Throttle** — обмежує виконання до одного разу за інтервал (напр., обробник скролу)

\`\`\`javascript
// Debounce: виконується через 300мс після останнього виклику
const debounced = debounce(search, 300);

// Throttle: виконується макс. раз на 100мс
const throttled = throttle(onScroll, 100);
\`\`\``,
  },
  'differences-between-arrow-function-function-declaration-and-function-expression': {
    en: `**Function Declaration** — hoisted, has own \`this\`
\`\`\`javascript
function greet() {}
\`\`\`

**Function Expression** — not hoisted, has own \`this\`
\`\`\`javascript
const greet = function() {};
\`\`\`

**Arrow Function** — not hoisted, inherits \`this\`, no \`arguments\`
\`\`\`javascript
const greet = () => {};
\`\`\``,
    ua: `**Function Declaration** — підіймається, має власний \`this\`
\`\`\`javascript
function greet() {}
\`\`\`

**Function Expression** — не підіймається, має власний \`this\`
\`\`\`javascript
const greet = function() {};
\`\`\`

**Arrow Function** — не підіймається, успадковує \`this\`, без \`arguments\`
\`\`\`javascript
const greet = () => {};
\`\`\``,
  },
  'difference-between-in-operator-and-hasownproperty-method-in-javascript': {
    en: `- \`in\` — checks if property exists in object **or its prototype chain**
- \`hasOwnProperty()\` — checks only the object's **own** properties

\`\`\`javascript
const obj = { a: 1 };
'a' in obj; // true
'toString' in obj; // true (inherited)
obj.hasOwnProperty('toString'); // false
\`\`\``,
    ua: `- \`in\` — перевіряє властивість в обʼєкті **або його ланцюгу прототипів**
- \`hasOwnProperty()\` — перевіряє лише **власні** властивості обʼєкта

\`\`\`javascript
const obj = { a: 1 };
'a' in obj; // true
'toString' in obj; // true (успадковано)
obj.hasOwnProperty('toString'); // false
\`\`\``,
  },
  'difference-between-null-and-undefined': {
    en: `- \`undefined\` — variable declared but not assigned, or missing property
- \`null\` — intentional absence of value, explicitly assigned

\`\`\`javascript
let x; // undefined
const obj = {};
obj.foo; // undefined
const user = null; // intentionally empty
typeof null; // 'object' (historical bug)
\`\`\``,
    ua: `- \`undefined\` — змінна оголошена, але не присвоєна, або відсутня властивість
- \`null\` — навмисна відсутність значення, явно присвоєно

\`\`\`javascript
let x; // undefined
const obj = {};
obj.foo; // undefined
const user = null; // навмисно порожньо
typeof null; // 'object' (історичний баг)
\`\`\``,
  },
  'difference-between-eventpreventdefault-and-eventstoppropagation': {
    en: `- \`preventDefault()\` — stops the default browser action (e.g., form submit, link navigation)
- \`stopPropagation()\` — stops event from bubbling to parent elements

\`\`\`javascript
form.onsubmit = (e) => {
  e.preventDefault(); // don't submit form
};

button.onclick = (e) => {
  e.stopPropagation(); // don't trigger parent handlers
};
\`\`\``,
    ua: `- \`preventDefault()\` — зупиняє дію браузера за замовчуванням (submit форми, перехід посиланням)
- \`stopPropagation()\` — зупиняє спливання події до батьківських елементів

\`\`\`javascript
form.onsubmit = (e) => {
  e.preventDefault(); // не відправляти форму
};

button.onclick = (e) => {
  e.stopPropagation(); // не викликати обробники батьків
};
\`\`\``,
  },
  'difference-between-primitives-and-non-primitives-in-javascript': {
    en: `**Primitives:** \`string\`, \`number\`, \`boolean\`, \`null\`, \`undefined\`, \`symbol\`, \`bigint\`
- Immutable, stored by value, compared by value

**Non-primitives (Objects):** \`object\`, \`array\`, \`function\`
- Mutable, stored by reference, compared by reference

\`\`\`javascript
let a = 'hi'; let b = 'hi'; a === b; // true
let x = {}; let y = {}; x === y; // false
\`\`\``,
    ua: `**Примітиви:** \`string\`, \`number\`, \`boolean\`, \`null\`, \`undefined\`, \`symbol\`, \`bigint\`
- Незмінні, зберігаються за значенням, порівнюються за значенням

**Непримітиви (Обʼєкти):** \`object\`, \`array\`, \`function\`
- Змінні, зберігаються за посиланням, порівнюються за посиланням

\`\`\`javascript
let a = 'hi'; let b = 'hi'; a === b; // true
let x = {}; let y = {}; x === y; // false
\`\`\``,
  },
  'difference-between-eventtarget-and-eventcurrenttarget-in-javascript': {
    en: `- \`event.target\` — the element that **triggered** the event (clicked element)
- \`event.currentTarget\` — the element that **has the handler** attached

\`\`\`javascript
// <div onclick="handler(event)"><button>Click</button></div>
// When clicking button:
// e.target = button
// e.currentTarget = div
\`\`\``,
    ua: `- \`event.target\` — елемент, що **викликав** подію (клікнутий елемент)
- \`event.currentTarget\` — елемент, до якого **прикріплений обробник**

\`\`\`javascript
// <div onclick="handler(event)"><button>Click</button></div>
// При кліку на button:
// e.target = button
// e.currentTarget = div
\`\`\``,
  },
  'differences-between-var-let-and-const': {
    en: `| | \`var\` | \`let\` | \`const\` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisting | Yes (undefined) | TDZ | TDZ |
| Reassign | ✅ | ✅ | ❌ |
| Redeclare | ✅ | ❌ | ❌ |

Use \`const\` by default, \`let\` when reassignment needed, avoid \`var\`.`,
    ua: `| | \`var\` | \`let\` | \`const\` |
|---|---|---|---|
| Область | Функція | Блок | Блок |
| Підняття | Так (undefined) | TDZ | TDZ |
| Перепр. | ✅ | ✅ | ❌ |
| Переогол. | ✅ | ❌ | ❌ |

Використовуйте \`const\` за замовч., \`let\` коли потрібне перепризначення, уникайте \`var\`.`,
  },
  'event-delegation': {
    en: `**Event delegation** — attaching a single event handler to a parent element to handle events from its children.

\`\`\`javascript
document.querySelector('ul').addEventListener('click', (e) => {
  if (e.target.matches('li')) {
    console.log('Clicked:', e.target.textContent);
  }
});
\`\`\`

**Benefits:** Less memory, works with dynamic elements, cleaner code.`,
    ua: `**Делегування подій** — прикріплення одного обробника до батьківського елемента для обробки подій від дочірніх.

\`\`\`javascript
document.querySelector('ul').addEventListener('click', (e) => {
  if (e.target.matches('li')) {
    console.log('Clicked:', e.target.textContent);
  }
});
\`\`\`

**Переваги:** Менше памʼяті, працює з динамічними елементами, чистіший код.`,
  },
  'event-loop-deep-dive-microtasks-vs-macrotasks-for-interviews': {
    en: `**Event Loop** processes tasks in order:
1. Execute synchronous code
2. Execute all **microtasks** (Promise callbacks, queueMicrotask)
3. Execute one **macrotask** (setTimeout, setInterval, I/O)
4. Repeat

\`\`\`javascript
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// Output: 1, 4, 3, 2
\`\`\``,
    ua: `**Event Loop** обробляє задачі в порядку:
1. Виконати синхронний код
2. Виконати всі **мікрозадачі** (колбеки Promise, queueMicrotask)
3. Виконати одну **макрозадачу** (setTimeout, setInterval, I/O)
4. Повторити

\`\`\`javascript
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// Вивід: 1, 4, 3, 2
\`\`\``,
  },
  'what-is-garbage-collector-in-javascript': {
    en: `**Garbage Collector** automatically frees memory occupied by objects no longer reachable from the root.

Main algorithm: **Mark-and-Sweep**
1. Mark all reachable objects starting from roots (global, call stack)
2. Sweep (delete) unmarked objects

**Avoid memory leaks:** Remove event listeners, clear timers, avoid circular references.`,
    ua: `**Garbage Collector** автоматично звільняє памʼять від обʼєктів, недосяжних з кореня.

Основний алгоритм: **Mark-and-Sweep**
1. Позначити всі досяжні обʼєкти починаючи з коренів (global, call stack)
2. Очистити (видалити) непозначені обʼєкти

**Уникайте витоків памʼяті:** Видаляйте слухачів подій, очищайте таймери, уникайте циклічних посилань.`,
  },
  'what-are-generators-in-javascript': {
    en: `**Generators** are functions that can pause and resume execution using \`yield\`.

\`\`\`javascript
function* counter() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = counter();
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
\`\`\`

Useful for: lazy iteration, async flows, infinite sequences.`,
    ua: `**Генератори** — це функції, що можуть призупинятися і відновлюватися через \`yield\`.

\`\`\`javascript
function* counter() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = counter();
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
\`\`\`

Корисні для: ледачої ітерації, async-потоків, нескінченних послідовностей.`,
  },
  'what-are-higher-order-functions-in-javascript-hof': {
    en: `**Higher-Order Function** either takes a function as argument or returns a function.

\`\`\`javascript
// Takes function as argument
[1, 2, 3].map(x => x * 2);

// Returns a function
const multiply = (a) => (b) => a * b;
const double = multiply(2);
\`\`\`

Examples: \`map\`, \`filter\`, \`reduce\`, \`forEach\`, \`sort\`.`,
    ua: `**Функція вищого порядку** приймає функцію як аргумент або повертає функцію.

\`\`\`javascript
// Приймає функцію як аргумент
[1, 2, 3].map(x => x * 2);

// Повертає функцію
const multiply = (a) => (b) => a * b;
const double = multiply(2);
\`\`\`

Приклади: \`map\`, \`filter\`, \`reduce\`, \`forEach\`, \`sort\`.`,
  },
  'how-to-add-a-task-to-microtask-queue-with-queuemicrotask': {
    en: `\`queueMicrotask()\` adds a callback to the microtask queue, executing after current task but before macrotasks.

\`\`\`javascript
console.log('1');
queueMicrotask(() => console.log('2'));
console.log('3');
// Output: 1, 3, 2
\`\`\`

Similar to \`Promise.resolve().then()\` but more explicit for scheduling microtasks.`,
    ua: `\`queueMicrotask()\` додає колбек до черги мікрозадач, виконуючи після поточної задачі, але перед макрозадачами.

\`\`\`javascript
console.log('1');
queueMicrotask(() => console.log('2'));
console.log('3');
// Вивід: 1, 3, 2
\`\`\`

Схоже на \`Promise.resolve().then()\`, але явніше для планування мікрозадач.`,
  },
  'what-is-iife-immediately-invoked-function-expression-in-javascript': {
    en: `**IIFE** — a function that executes immediately after definition.

\`\`\`javascript
(function() {
  const private = 'hidden';
  console.log('Executed!');
})();

// Arrow function IIFE
(() => {
  console.log('Also works!');
})();
\`\`\`

Used for: creating private scope, avoiding global pollution, module pattern.`,
    ua: `**IIFE** — функція, що виконується одразу після оголошення.

\`\`\`javascript
(function() {
  const private = 'hidden';
  console.log('Executed!');
})();

// IIFE зі стрілковою функцією
(() => {
  console.log('Also works!');
})();
\`\`\`

Використовується для: приватної області, уникнення забруднення global, модульного патерну.`,
  },
  'why-instanceof-operator-is-needed-in-javascript': {
    en: `\`instanceof\` checks if an object is an instance of a constructor (in its prototype chain).

\`\`\`javascript
class Animal {}
class Dog extends Animal {}

const dog = new Dog();
dog instanceof Dog; // true
dog instanceof Animal; // true
dog instanceof Object; // true
[] instanceof Array; // true
\`\`\``,
    ua: `\`instanceof\` перевіряє, чи обʼєкт є екземпляром конструктора (в ланцюгу прототипів).

\`\`\`javascript
class Animal {}
class Dog extends Animal {}

const dog = new Dog();
dog instanceof Dog; // true
dog instanceof Animal; // true
dog instanceof Object; // true
[] instanceof Array; // true
\`\`\``,
  },
  'jsonparse-and-jsonstringify-in-javascript': {
    en: `- \`JSON.stringify(obj)\` — converts object to JSON string
- \`JSON.parse(str)\` — parses JSON string to object

\`\`\`javascript
const obj = { name: 'John', age: 30 };
const json = JSON.stringify(obj); // '{"name":"John","age":30}'
const parsed = JSON.parse(json); // { name: 'John', age: 30 }
\`\`\`

**Note:** Functions, \`undefined\`, and \`Symbol\` are ignored/converted to \`null\`.`,
    ua: `- \`JSON.stringify(obj)\` — конвертує обʼєкт у JSON-рядок
- \`JSON.parse(str)\` — парсить JSON-рядок в обʼєкт

\`\`\`javascript
const obj = { name: 'John', age: 30 };
const json = JSON.stringify(obj); // '{"name":"John","age":30}'
const parsed = JSON.parse(json); // { name: 'John', age: 30 }
\`\`\`

**Примітка:** Функції, \`undefined\` та \`Symbol\` ігноруються/конвертуються в \`null\`.`,
  },
  'how-to-get-all-keys-and-values-of-object-in-javascript': {
    en: `\`\`\`javascript
const obj = { a: 1, b: 2 };

Object.keys(obj); // ['a', 'b']
Object.values(obj); // [1, 2]
Object.entries(obj); // [['a', 1], ['b', 2]]

// Iteration
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}
\`\`\``,
    ua: `\`\`\`javascript
const obj = { a: 1, b: 2 };

Object.keys(obj); // ['a', 'b']
Object.values(obj); // [1, 2]
Object.entries(obj); // [['a', 1], ['b', 2]]

// Ітерація
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}
\`\`\``,
  },
  'lexical-environment-in-javascript': {
    en: `**Lexical Environment** is a structure that holds variable bindings for a specific scope, created at function definition time.

It consists of:
- **Environment Record** — stores variables and functions
- **Outer Reference** — link to parent lexical environment

This is how closures work — inner functions remember their lexical environment.`,
    ua: `**Лексичне оточення** — структура, що зберігає привʼязки змінних для певної області, створюється при визначенні функції.

Складається з:
- **Environment Record** — зберігає змінні та функції
- **Outer Reference** — посилання на батьківське лексичне оточення

Так працюють замикання — внутрішні функції памʼятають своє лексичне оточення.`,
  },
  'memoization-in-javascript': {
    en: `**Memoization** caches function results based on arguments to avoid recalculation.

\`\`\`javascript
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
\`\`\`

Useful for expensive computations like recursive functions.`,
    ua: `**Мемоізація** кешує результати функції на основі аргументів для уникнення повторних обчислень.

\`\`\`javascript
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
\`\`\`

Корисно для дорогих обчислень, як рекурсивні функції.`,
  },
  'what-is-nan-in-javascript': {
    en: `\`NaN\` (Not-a-Number) represents an invalid number result.

\`\`\`javascript
parseInt('hello'); // NaN
0 / 0; // NaN
Math.sqrt(-1); // NaN

NaN === NaN; // false (!)
Number.isNaN(NaN); // true (use this to check)
\`\`\`

**Type:** \`typeof NaN === 'number'\` — it's technically a number type.`,
    ua: `\`NaN\` (Not-a-Number) представляє недійсний числовий результат.

\`\`\`javascript
parseInt('hello'); // NaN
0 / 0; // NaN
Math.sqrt(-1); // NaN

NaN === NaN; // false (!)
Number.isNaN(NaN); // true (використовуйте для перевірки)
\`\`\`

**Тип:** \`typeof NaN === 'number'\` — технічно це числовий тип.`,
  },
  'what-is-proxy-object-in-javascript': {
    en: `**Proxy** wraps an object to intercept and customize operations.

\`\`\`javascript
const user = { name: 'John' };
const proxy = new Proxy(user, {
  get(target, prop) {
    console.log(\`Getting \${prop}\`);
    return target[prop];
  },
  set(target, prop, value) {
    console.log(\`Setting \${prop} = \${value}\`);
    target[prop] = value;
    return true;
  }
});
\`\`\`

Use cases: validation, logging, reactive systems (Vue 3).`,
    ua: `**Proxy** огортає обʼєкт для перехоплення та налаштування операцій.

\`\`\`javascript
const user = { name: 'John' };
const proxy = new Proxy(user, {
  get(target, prop) {
    console.log(\`Getting \${prop}\`);
    return target[prop];
  },
  set(target, prop, value) {
    console.log(\`Setting \${prop} = \${value}\`);
    target[prop] = value;
    return true;
  }
});
\`\`\`

Випадки: валідація, логування, реактивні системи (Vue 3).`,
  },
  'oop-in-javascript-object-oriented-programming': {
    en: `JavaScript supports OOP through **classes** and **prototypes**.

\`\`\`javascript
class Animal {
  constructor(name) { this.name = name; }
  speak() { console.log(\`\${this.name} speaks\`); }
}

class Dog extends Animal {
  speak() { console.log(\`\${this.name} barks\`); }
}
\`\`\`

**Key concepts:** Encapsulation, Inheritance, Polymorphism, Abstraction.`,
    ua: `JavaScript підтримує ООП через **класи** та **прототипи**.

\`\`\`javascript
class Animal {
  constructor(name) { this.name = name; }
  speak() { console.log(\`\${this.name} speaks\`); }
}

class Dog extends Animal {
  speak() { console.log(\`\${this.name} barks\`); }
}
\`\`\`

**Ключові концепції:** Інкапсуляція, Наслідування, Поліморфізм, Абстракція.`,
  },
  'what-is-a-polyfill': {
    en: `**Polyfill** is code that implements a feature on browsers that don't support it natively.

\`\`\`javascript
// Polyfill for Array.prototype.includes
if (!Array.prototype.includes) {
  Array.prototype.includes = function(item) {
    return this.indexOf(item) !== -1;
  };
}
\`\`\`

Common polyfills: \`Promise\`, \`fetch\`, \`Object.assign\`. Libraries: core-js, polyfill.io.`,
    ua: `**Поліфіл** — це код, що реалізує функцію в браузерах, які не підтримують її нативно.

\`\`\`javascript
// Поліфіл для Array.prototype.includes
if (!Array.prototype.includes) {
  Array.prototype.includes = function(item) {
    return this.indexOf(item) !== -1;
  };
}
\`\`\`

Поширені поліфіли: \`Promise\`, \`fetch\`, \`Object.assign\`. Бібліотеки: core-js, polyfill.io.`,
  },
  'what-is-promise-chaining-in-javascript': {
    en: `**Promise chaining** — connecting multiple async operations sequentially using \`.then()\`.

\`\`\`javascript
fetch('/api/user')
  .then(res => res.json())
  .then(user => fetch(\`/api/posts/\${user.id}\`))
  .then(res => res.json())
  .then(posts => console.log(posts))
  .catch(err => console.error(err));
\`\`\`

Each \`.then()\` returns a new Promise, enabling chaining.`,
    ua: `**Ланцюжок Promise** — зʼєднання кількох async-операцій послідовно через \`.then()\`.

\`\`\`javascript
fetch('/api/user')
  .then(res => res.json())
  .then(user => fetch(\`/api/posts/\${user.id}\`))
  .then(res => res.json())
  .then(posts => console.log(posts))
  .catch(err => console.error(err));
\`\`\`

Кожен \`.then()\` повертає новий Promise, дозволяючи ланцюжок.`,
  },
  'promiseall-promiserace-promiseallsettled-promiseany': {
    en: `- **Promise.all** — resolves when ALL resolve, rejects on first rejection
- **Promise.race** — resolves/rejects with first settled promise
- **Promise.allSettled** — waits for ALL to settle (never rejects)
- **Promise.any** — resolves with first fulfilled, rejects if all reject

\`\`\`javascript
await Promise.all([p1, p2, p3]); // all or nothing
await Promise.race([p1, p2]); // first wins
\`\`\``,
    ua: `- **Promise.all** — виконується коли ВСІ виконані, відхиляється при першому відхиленні
- **Promise.race** — виконується/відхиляється з першим завершеним
- **Promise.allSettled** — чекає завершення ВСІХ (ніколи не відхиляється)
- **Promise.any** — виконується з першим успішним, відхиляється якщо всі відхилені

\`\`\`javascript
await Promise.all([p1, p2, p3]); // все або нічого
await Promise.race([p1, p2]); // перший виграє
\`\`\``,
  },
  'promises-in-javascript-and-promise-methods-javascript': {
    en: `**Promise** represents eventual completion/failure of an async operation.

\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Done!'), 1000);
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('Cleanup'));
\`\`\`

States: **pending** → **fulfilled** or **rejected**.`,
    ua: `**Promise** представляє можливе завершення/невдачу async-операції.

\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Done!'), 1000);
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('Cleanup'));
\`\`\`

Стани: **pending** → **fulfilled** або **rejected**.`,
  },
  'prototypes-and-prototypal-inheritance-in-javascript': {
    en: `Every object has a hidden \`[[Prototype]]\` link to another object, forming a **prototype chain**.

\`\`\`javascript
const animal = { eat() { console.log('eating'); } };
const dog = Object.create(animal);
dog.bark = () => console.log('woof');

dog.eat(); // inherited from animal
dog.bark(); // own method
\`\`\`

When accessing a property, JS looks up the chain until found or reaches \`null\`.`,
    ua: `Кожен обʼєкт має приховане посилання \`[[Prototype]]\` на інший обʼєкт, формуючи **ланцюг прототипів**.

\`\`\`javascript
const animal = { eat() { console.log('eating'); } };
const dog = Object.create(animal);
dog.bark = () => console.log('woof');

dog.eat(); // успадковано від animal
dog.bark(); // власний метод
\`\`\`

При доступі до властивості JS шукає вгору по ланцюгу до знаходження або досягнення \`null\`.`,
  },
  'hoisting-in-javascript': {
    en: `**Hoisting** moves declarations to the top of their scope during compilation.

\`\`\`javascript
console.log(x); // undefined (var is hoisted)
var x = 5;

console.log(y); // ReferenceError (TDZ)
let y = 5;

greet(); // works! (function declarations are hoisted)
function greet() { console.log('Hi'); }
\`\`\``,
    ua: `**Підняття (Hoisting)** переміщує оголошення на початок області під час компіляції.

\`\`\`javascript
console.log(x); // undefined (var підіймається)
var x = 5;

console.log(y); // ReferenceError (TDZ)
let y = 5;

greet(); // працює! (function declarations підіймаються)
function greet() { console.log('Hi'); }
\`\`\``,
  },
  'what-is-recursion': {
    en: `**Recursion** — a function that calls itself until reaching a base case.

\`\`\`javascript
function factorial(n) {
  if (n <= 1) return 1; // base case
  return n * factorial(n - 1); // recursive call
}

factorial(5); // 120 (5 * 4 * 3 * 2 * 1)
\`\`\`

**Warning:** Must have a base case to avoid infinite recursion and stack overflow.`,
    ua: `**Рекурсія** — функція, що викликає саму себе до досягнення базового випадку.

\`\`\`javascript
function factorial(n) {
  if (n <= 1) return 1; // базовий випадок
  return n * factorial(n - 1); // рекурсивний виклик
}

factorial(5); // 120 (5 * 4 * 3 * 2 * 1)
\`\`\`

**Увага:** Має бути базовий випадок для уникнення нескінченної рекурсії та переповнення стеку.`,
  },
  'requestanimationframe-and-requestidlecallback-in-javascript': {
    en: `- **requestAnimationFrame** — runs before next repaint (~60fps), ideal for animations
- **requestIdleCallback** — runs when browser is idle, for non-urgent work

\`\`\`javascript
function animate() {
  element.style.left = x++ + 'px';
  requestAnimationFrame(animate);
}

requestIdleCallback(() => {
  // analytics, prefetching
});
\`\`\``,
    ua: `- **requestAnimationFrame** — виконується перед наступною перемальовкою (~60fps), ідеально для анімацій
- **requestIdleCallback** — виконується коли браузер вільний, для нетермінової роботи

\`\`\`javascript
function animate() {
  element.style.left = x++ + 'px';
  requestAnimationFrame(animate);
}

requestIdleCallback(() => {
  // аналітика, prefetching
});
\`\`\``,
  },
  'scope-in-javascript-types-and-working-principles': {
    en: `**Scope** determines variable accessibility.

- **Global scope** — accessible everywhere
- **Function scope** — \`var\` is function-scoped
- **Block scope** — \`let\`/\`const\` are block-scoped (\`{}\`)

\`\`\`javascript
if (true) {
  var x = 1; // function scope
  let y = 2; // block scope
}
console.log(x); // 1
console.log(y); // ReferenceError
\`\`\``,
    ua: `**Область видимості** визначає доступність змінних.

- **Глобальна** — доступна всюди
- **Функціональна** — \`var\` має функціональну область
- **Блочна** — \`let\`/\`const\` мають блочну область (\`{}\`)

\`\`\`javascript
if (true) {
  var x = 1; // функціональна область
  let y = 2; // блочна область
}
console.log(x); // 1
console.log(y); // ReferenceError
\`\`\``,
  },
  'set-map-weakset-and-weakmap-in-javascript': {
    en: `- **Set** — collection of unique values
- **Map** — key-value pairs (any key type)
- **WeakSet/WeakMap** — only object keys, allow garbage collection

\`\`\`javascript
const set = new Set([1, 2, 2, 3]); // {1, 2, 3}
const map = new Map([['a', 1], ['b', 2]]);
map.get('a'); // 1
\`\`\``,
    ua: `- **Set** — колекція унікальних значень
- **Map** — пари ключ-значення (будь-який тип ключа)
- **WeakSet/WeakMap** — лише обʼєктні ключі, дозволяють збір сміття

\`\`\`javascript
const set = new Set([1, 2, 2, 3]); // {1, 2, 3}
const map = new Map([['a', 1], ['b', 2]]);
map.get('a'); // 1
\`\`\``,
  },
  'spread-and-rest-operators-in-javascript-differences-and-examples': {
    en: `**Spread (\`...\`)** — expands iterable into individual elements
\`\`\`javascript
const arr = [...[1, 2], 3]; // [1, 2, 3]
const obj = { ...{ a: 1 }, b: 2 }; // { a: 1, b: 2 }
\`\`\`

**Rest (\`...\`)** — collects remaining elements into array
\`\`\`javascript
function sum(...nums) { return nums.reduce((a, b) => a + b); }
const [first, ...rest] = [1, 2, 3]; // first=1, rest=[2,3]
\`\`\``,
    ua: `**Spread (\`...\`)** — розгортає ітерабельне в окремі елементи
\`\`\`javascript
const arr = [...[1, 2], 3]; // [1, 2, 3]
const obj = { ...{ a: 1 }, b: 2 }; // { a: 1, b: 2 }
\`\`\`

**Rest (\`...\`)** — збирає решту елементів у масив
\`\`\`javascript
function sum(...nums) { return nums.reduce((a, b) => a + b); }
const [first, ...rest] = [1, 2, 3]; // first=1, rest=[2,3]
\`\`\``,
  },
  'static-methods-in-javascript': {
    en: `**Static methods** belong to the class itself, not instances.

\`\`\`javascript
class MathUtils {
  static PI = 3.14159;
  static square(x) { return x * x; }
}

MathUtils.square(4); // 16
MathUtils.PI; // 3.14159
// instance.square() — error!
\`\`\`

Use for: utility functions, factory methods, constants.`,
    ua: `**Статичні методи** належать самому класу, а не екземплярам.

\`\`\`javascript
class MathUtils {
  static PI = 3.14159;
  static square(x) { return x * x; }
}

MathUtils.square(4); // 16
MathUtils.PI; // 3.14159
// instance.square() — помилка!
\`\`\`

Використовуйте для: утилітарних функцій, фабричних методів, констант.`,
  },
  'strict-mode-in-javascript': {
    en: `\`'use strict'\` enables stricter parsing and error handling.

**Changes:**
- No implicit globals
- \`this\` is \`undefined\` in functions (not \`window\`)
- No duplicate parameters
- No \`with\` statement

\`\`\`javascript
'use strict';
x = 5; // ReferenceError (no implicit global)
\`\`\``,
    ua: `\`'use strict'\` вмикає суворіший парсинг та обробку помилок.

**Зміни:**
- Немає неявних глобальних змінних
- \`this\` є \`undefined\` у функціях (не \`window\`)
- Заборонені дубльовані параметри
- Заборонений \`with\`

\`\`\`javascript
'use strict';
x = 5; // ReferenceError (немає неявного global)
\`\`\``,
  },
  'what-is-symboliterator-and-why-is-it-needed': {
    en: `\`Symbol.iterator\` makes objects iterable with \`for...of\` loops.

\`\`\`javascript
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let current = this.from;
    return {
      next: () => current <= this.to
        ? { value: current++, done: false }
        : { done: true }
    };
  }
};

for (const n of range) console.log(n); // 1, 2, 3
\`\`\``,
    ua: `\`Symbol.iterator\` робить обʼєкти ітерабельними для \`for...of\`.

\`\`\`javascript
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let current = this.from;
    return {
      next: () => current <= this.to
        ? { value: current++, done: false }
        : { done: true }
    };
  }
};

for (const n of range) console.log(n); // 1, 2, 3
\`\`\``,
  },
  'what-is-temporal-dead-zone-tdz-in-javascript': {
    en: `**TDZ** — the time between entering scope and variable initialization where \`let\`/\`const\` cannot be accessed.

\`\`\`javascript
console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 5;

// TDZ exists from block start until declaration
{
  // TDZ starts
  console.log(y); // Error
  let y = 10; // TDZ ends
}
\`\`\``,
    ua: `**TDZ** — час між входом в область і ініціалізацією змінної, коли \`let\`/\`const\` недоступні.

\`\`\`javascript
console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 5;

// TDZ існує від початку блоку до оголошення
{
  // TDZ починається
  console.log(y); // Error
  let y = 10; // TDZ закінчується
}
\`\`\``,
  },
  'the-this-keyword-in-javascript': {
    en: `\`this\` refers to the execution context:

- **Global:** \`window\` (browser) or \`globalThis\`
- **Object method:** the object
- **Function:** \`undefined\` (strict) or \`window\`
- **Arrow function:** lexically inherited \`this\`
- **Event handler:** the element
- **call/apply/bind:** explicitly set

\`\`\`javascript
const obj = { fn() { return this; } };
obj.fn(); // obj
\`\`\``,
    ua: `\`this\` посилається на контекст виконання:

- **Глобально:** \`window\` (браузер) або \`globalThis\`
- **Метод обʼєкта:** обʼєкт
- **Функція:** \`undefined\` (strict) або \`window\`
- **Стрілкова функція:** лексично успадкований \`this\`
- **Обробник подій:** елемент
- **call/apply/bind:** явно встановлений

\`\`\`javascript
const obj = { fn() { return this; } };
obj.fn(); // obj
\`\`\``,
  },
  'data-types-in-javascript': {
    en: `**Primitives (7):**
\`string\`, \`number\`, \`boolean\`, \`null\`, \`undefined\`, \`symbol\`, \`bigint\`

**Non-primitive (1):**
\`object\` (includes arrays, functions, dates, etc.)

\`\`\`javascript
typeof 'hello'; // 'string'
typeof 42; // 'number'
typeof null; // 'object' (bug)
typeof []; // 'object'
\`\`\``,
    ua: `**Примітиви (7):**
\`string\`, \`number\`, \`boolean\`, \`null\`, \`undefined\`, \`symbol\`, \`bigint\`

**Непримітив (1):**
\`object\` (включає масиви, функції, дати тощо)

\`\`\`javascript
typeof 'hello'; // 'string'
typeof 42; // 'number'
typeof null; // 'object' (баг)
typeof []; // 'object'
\`\`\``,
  },
};

async function updateShortAnswers() {
  console.log('🚀 Updating JavaScript short answers...\n')
  let updated = 0, notFound = 0
  
  for (const [slug, answers] of Object.entries(shortAnswers)) {
    try {
      const [question] = await db.select({ id: schema.questions.id }).from(schema.questions).where(eq(schema.questions.slug, slug)).limit(1)
      if (!question) { console.log(`❌ Not found: ${slug}`); notFound++; continue }
      await db.update(schema.questions).set({ shortAnswerEn: answers.en, shortAnswerUa: answers.ua, updatedAt: new Date() }).where(eq(schema.questions.id, question.id))
      console.log(`✅ ${slug}`)
      updated++
    } catch (error) { console.error(`❌ Error: ${slug}`, error) }
  }
  
  console.log(`\n✅ Updated: ${updated} | ❌ Not found: ${notFound}`)
  await client.end()
  process.exit(0)
}

updateShortAnswers().catch(console.error)
