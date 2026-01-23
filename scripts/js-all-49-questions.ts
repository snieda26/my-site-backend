/**
 * JavaScript Complete Section - All 49 Questions
 * Comprehensive batch addition with concise initial content
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import * as dotenv from 'dotenv'
import * as schema from '../src/core/database/schema'
import { eq } from 'drizzle-orm'

const postgres = require('postgres')
dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
	throw new Error('DATABASE_URL is not set')
}

const client = postgres(connectionString.split('?')[0])
const db = drizzle(client, { schema })

const questions = [
  // Questions 1-10: Core JavaScript
  {
    slug: 'null-vs-undefined',
    titleEn: 'null vs undefined',
    titleUa: 'null проти undefined',
    descriptionEn: 'Difference between null and undefined in JavaScript',
    descriptionUa: 'Різниця між null та undefined в JavaScript',
    difficulty: 'EASY' as const,
    order: 1,
    contentMarkdownEn: `In JavaScript, null and undefined indicate absence of value, but differ in meaning.

- **undefined**: variable created but not assigned
- **null**: explicitly set to "nothing"

\`\`\`javascript
let x;        // undefined
let y = null; // null
\`\`\`

**typeof null returns "object"** — historical JavaScript bug.`,
    contentMarkdownUa: `В JavaScript, null та undefined вказують на відсутність значення, але відрізняються за значенням.

- **undefined**: змінна створена, але не присвоєна
- **null**: явно встановлено на "нічого"

\`\`\`javascript
let x;        // undefined
let y = null; // null
\`\`\`

**typeof null повертає "object"** — історичний баг JavaScript.`,
  },
  {
    slug: 'strict-mode',
    titleEn: 'Strict Mode',
    titleUa: 'Strict Mode (Строгий Режим)',
    descriptionEn: 'Write safer JavaScript with strict mode',
    descriptionUa: 'Пишіть безпечніший JavaScript зі строгим режимом',
    difficulty: 'EASY' as const,
    order: 2,
    contentMarkdownEn: `Strict mode activates additional checks and restrictions.

\`\`\`javascript
"use strict";
x = 10; // Error: variable not declared
\`\`\`

**What changes:**
- Prohibits undeclared variables
- Prohibits deleting variables/functions
- \`this\` is \`undefined\` in functions (not global)
- Prevents using reserved words

Enables safer code.`,
    contentMarkdownUa: `Строгий режим активує додаткові перевірки та обмеження.

\`\`\`javascript
"use strict";
x = 10; // Помилка: змінна не оголошена
\`\`\`

**Що змінюється:**
- Забороняє неоголошені змінні
- Забороняє видалення змінних/функцій
- \`this\` є \`undefined\` у функціях (не глобальний)
- Запобігає використанню зарезервованих слів

Дозволяє безпечніший код.`,
  },
  {
    slug: 'arrow-vs-declaration-vs-expression',
    titleEn: 'Arrow vs Declaration vs Expression',
    titleUa: 'Arrow проти Declaration проти Expression',
    descriptionEn: 'Differences between function types in JavaScript',
    descriptionUa: 'Різниця між типами функцій у JavaScript',
    difficulty: 'MEDIUM' as const,
    order: 3,
    contentMarkdownEn: `**Function Declaration**: hoisted fully. **Function Expression**: variable hoisted, function not. **Arrow Function**: no own this, no arguments, can't use with new.

Use arrow for callbacks, declaration for general functions.`,
    contentMarkdownUa: `**Function Declaration**: повністю hoisted. **Function Expression**: змінна hoisted, функція ні. **Arrow Function**: немає власного this, немає arguments, не можна з new.

Використовуйте arrow для колбеків, declaration для загальних функцій.`,
  },
  {
    slug: 'js-data-types',
    titleEn: 'Data Types in JavaScript',
    titleUa: 'Типи Даних у JavaScript',
    descriptionEn: 'Primitives and objects in JavaScript',
    descriptionUa: 'Примітиви та обєкти в JavaScript',
    difficulty: 'EASY' as const,
    order: 4,
    contentMarkdownEn: `Primitives: string, number, boolean, null, undefined, Symbol, BigInt. Objects: Object, Array, Function, Date, RegExp. typeof null returns "object" (historical bug).`,
    contentMarkdownUa: `Примітиви: string, number, boolean, null, undefined, Symbol, BigInt. Обєкти: Object, Array, Function, Date, RegExp. typeof null повертає "object" (історичний баг).`,
  },
  {
    slug: 'primitives-vs-non-primitives',
    titleEn: 'Primitives vs Non-Primitives',
    titleUa: 'Примітиви проти Не-Примітивів',
    descriptionEn: 'Value types vs reference types',
    descriptionUa: 'Типи за значенням проти типів за посиланням',
    difficulty: 'MEDIUM' as const,
    order: 5,
    contentMarkdownEn: `Primitives: immutable, passed by value, compared by value. Non-primitives: mutable, passed by reference, compared by reference.`,
    contentMarkdownUa: `Примітиви: незмінні, передаються за значенням, порівнюються за значенням. Не-примітиви: змінні, передаються за посиланням, порівнюються за посиланням.`,
  },
  {
    slug: 'set-map-weakset-weakmap',
    titleEn: 'Set, Map, WeakSet, WeakMap',
    titleUa: 'Set, Map, WeakSet, WeakMap',
    descriptionEn: 'Modern JavaScript data structures',
    descriptionUa: 'Сучасні структури даних JavaScript',
    difficulty: 'MEDIUM' as const,
    order: 6,
    contentMarkdownEn: `Set: unique values. Map: key-value pairs, any key type. WeakSet/WeakMap: weak references, GC friendly, only objects, no iteration.`,
    contentMarkdownUa: `Set: унікальні значення. Map: пари ключ-значення, будь-який тип ключа. WeakSet/WeakMap: слабкі посилання, дружні до GC, тільки обєкти, без ітерації.`,
  },
  {
    slug: 'event-loop',
    titleEn: 'Event Loop',
    titleUa: 'Event Loop (Цикл Подій)',
    descriptionEn: 'How JavaScript handles asynchronous execution',
    descriptionUa: 'Як JavaScript обробляє асинхронне виконання',
    difficulty: 'HARD' as const,
    order: 7,
    contentMarkdownEn: `Event Loop manages async tasks. Call Stack (LIFO) + Event Loop. Microtasks (Promises) execute before Macrotasks (setTimeout). Order: Sync code → Microtasks → Render → Macrotasks.`,
    contentMarkdownUa: `Event Loop керує async задачами. Call Stack (LIFO) + Event Loop. Мікрозадачі (Проміси) виконуються перед Макрозадачами (setTimeout). Порядок: Синхронний код → Мікрозадачі → Рендер → Макрозадачі.`,
  },
  {
    slug: 'queue-microtask',
    titleEn: 'queueMicrotask',
    titleUa: 'queueMicrotask',
    descriptionEn: 'Add tasks to the microtask queue',
    descriptionUa: 'Додавання задач до черги мікрозадач',
    difficulty: 'MEDIUM' as const,
    order: 8,
    contentMarkdownEn: `queueMicrotask() adds task to microtask queue. Executes after current stack, before macrotasks. Faster than setTimeout(0). Used in libraries for state updates.`,
    contentMarkdownUa: `queueMicrotask() додає задачу до черги мікрозадач. Виконується після поточного стеку, перед макрозадачами. Швидше ніж setTimeout(0). Використовується в бібліотеках для оновлень стану.`,
  },
  {
    slug: 'bubbling-capturing',
    titleEn: 'Bubbling and Capturing',
    titleUa: 'Bubbling та Capturing',
    descriptionEn: 'Event propagation phases in JavaScript',
    descriptionUa: 'Фази поширення подій у JavaScript',
    difficulty: 'MEDIUM' as const,
    order: 9,
    contentMarkdownEn: `3 phases: Capturing (root→target), Target (at element), Bubbling (target→root). addEventListener 3rd parameter controls phase. stopPropagation() stops propagation.`,
    contentMarkdownUa: `3 фази: Capturing (корінь→ціль), Target (на елементі), Bubbling (ціль→корінь). addEventListener 3-й параметр контролює фазу. stopPropagation() зупиняє поширення.`,
  },
  {
    slug: 'this-keyword',
    titleEn: 'this Keyword',
    titleUa: 'Ключове слово this',
    descriptionEn: 'Execution context reference in JavaScript',
    descriptionUa: 'Посилання на контекст виконання в JavaScript',
    difficulty: 'HARD' as const,
    order: 10,
    contentMarkdownEn: `this points to execution context. Regular functions: depends on call. Arrow functions: lexical this from parent. In methods: object before dot. Can bind with call/apply/bind.`,
    contentMarkdownUa: `this вказує на контекст виконання. Звичайні функції: залежить від виклику. Arrow функції: лексичний this з батька. У методах: обєкт перед крапкою. Можна привязати з call/apply/bind.`,
  },
  {
    slug: 'call-apply-bind',
    titleEn: 'call, apply, bind',
    titleUa: 'call, apply, bind',
    descriptionEn: 'Methods for this binding',
    descriptionUa: 'Методи для привязування this',
    difficulty: 'MEDIUM' as const,
    order: 11,
    contentMarkdownEn: `call: arguments as list. apply: arguments as array. bind: returns new function with bound this.`,
    contentMarkdownUa: `call: аргументи списком. apply: аргументи масивом. bind: повертає нову функцію зі звязаним this.`,
  },
  {
    slug: 'promise',
    titleEn: 'Promises',
    titleUa: 'Проміси',
    descriptionEn: 'Handling asynchronous operations',
    descriptionUa: 'Обробка асинхронних операцій',
    difficulty: 'MEDIUM' as const,
    order: 12,
    contentMarkdownEn: `States: pending, fulfilled, rejected. then/catch/finally methods. Microtasks. Better than callbacks.`,
    contentMarkdownUa: `Стани: pending, fulfilled, rejected. Методи then/catch/finally. Мікрозадачі. Краще ніж колбеки.`,
  },
  {
    slug: 'promise-chaining',
    titleEn: 'Promise Chaining',
    titleUa: 'Ланцюжки Промісів',
    descriptionEn: 'Sequential asynchronous operations',
    descriptionUa: 'Послідовні асинхронні операції',
    difficulty: 'MEDIUM' as const,
    order: 13,
    contentMarkdownEn: `Each then() returns new promise. Avoids callback hell. Creates linear, readable async code.`,
    contentMarkdownUa: `Кожен then() повертає новий проміс. Уникає callback hell. Створює лінійний, читабельний async код.`,
  },
  {
    slug: 'async-await',
    titleEn: 'async/await',
    titleUa: 'async/await',
    descriptionEn: 'Syntactic sugar over Promises',
    descriptionUa: 'Синтаксичний цукор над Промісами',
    difficulty: 'MEDIUM' as const,
    order: 14,
    contentMarkdownEn: `async returns Promise. await pauses execution. try/catch for errors. Cleaner syntax than then().`,
    contentMarkdownUa: `async повертає Promise. await призупиняє виконання. try/catch для помилок. Чистіший синтаксис ніж then().`,
  },
  {
    slug: 'prototype',
    titleEn: 'Prototypes',
    titleUa: 'Прототипи',
    descriptionEn: 'Prototypal inheritance in JavaScript',
    descriptionUa: 'Прототипна спадковість в JavaScript',
    difficulty: 'HARD' as const,
    order: 15,
    contentMarkdownEn: `Prototype chain, [[Prototype]], Object.create(), Constructor.prototype. Classes are syntactic sugar over prototypes.`,
    contentMarkdownUa: `Ланцюжок прототипів, [[Prototype]], Object.create(), Constructor.prototype. Класи є синтаксичним цукром над прототипами.`,
  },
  {
    slug: 'oop-js',
    titleEn: 'OOP in JavaScript',
    titleUa: 'ООП у JavaScript',
    descriptionEn: 'Object-oriented programming principles',
    descriptionUa: 'Принципи обєктно-орієнтованого програмування',
    difficulty: 'HARD' as const,
    order: 16,
    contentMarkdownEn: `Encapsulation, Inheritance, Polymorphism, Abstraction. Classes (ES6+), extends, super. Private fields with #.`,
    contentMarkdownUa: `Інкапсуляція, Спадковість, Поліморфізм, Абстракція. Класи (ES6+), extends, super. Приватні поля з #.`,
  },
  {
    slug: 'proxy-object',
    titleEn: 'Proxy Object',
    titleUa: 'Обєкт Proxy',
    descriptionEn: 'Intercept and redefine object operations',
    descriptionUa: 'Перехоплення та перевизначення операцій обєкта',
    difficulty: 'HARD' as const,
    order: 17,
    contentMarkdownEn: `Wraps objects. Intercepts get/set/has/delete operations. Traps. Used in Vue reactivity, validation, logging.`,
    contentMarkdownUa: `Обгортає обєкти. Перехоплює операції get/set/has/delete. Пастки. Використовується в реактивності Vue, валідації, логуванні.`,
  },
  {
    slug: 'var-let-const',
    titleEn: 'var, let, const',
    titleUa: 'var, let, const',
    descriptionEn: 'Variable declaration keywords',
    descriptionUa: 'Ключові слова оголошення змінних',
    difficulty: 'EASY' as const,
    order: 18,
    contentMarkdownEn: `var: function scope, hoisted to undefined. let/const: block scope, TDZ. const: cannot reassign.`,
    contentMarkdownUa: `var: function scope, hoisted до undefined. let/const: block scope, TDZ. const: не можна переприсвоїти.`,
  },
  {
    slug: 'hoisting',
    titleEn: 'Hoisting',
    titleUa: 'Hoisting (Підняття)',
    descriptionEn: 'Declaration lifting mechanism',
    descriptionUa: 'Механізм підняття оголошень',
    difficulty: 'MEDIUM' as const,
    order: 19,
    contentMarkdownEn: `Declarations move to top of scope. Functions: fully hoisted. var: hoisted to undefined. let/const: TDZ until initialization.`,
    contentMarkdownUa: `Оголошення переміщуються на верх області. Функції: повністю hoisted. var: hoisted до undefined. let/const: TDZ до ініціалізації.`,
  },
  {
    slug: 'scope-js',
    titleEn: 'Scope in JavaScript',
    titleUa: 'Scope (Область Видимості)',
    descriptionEn: 'Variable visibility and access',
    descriptionUa: 'Видимість та доступ до змінних',
    difficulty: 'MEDIUM' as const,
    order: 20,
    contentMarkdownEn: `Global scope, Function scope, Block scope. Lexical scoping. Closures enable access to outer variables.`,
    contentMarkdownUa: `Глобальна область, Функціональна область, Блокова область. Лексична область видимості. Замикання дозволяють доступ до зовнішніх змінних.`,
  },
  {
    slug: 'lexical-environment',
    titleEn: 'Lexical Environment',
    titleUa: 'Лексичне Оточення',
    descriptionEn: 'Scope mechanism in JavaScript',
    descriptionUa: 'Механізм області видимості в JavaScript',
    difficulty: 'HARD' as const,
    order: 21,
    contentMarkdownEn: `Environment Record + outer reference. Created at function call. Chain forms scope hierarchy.`,
    contentMarkdownUa: `Environment Record + outer посилання. Створюється при виклику функції. Ланцюжок формує ієрархію областей.`,
  },
  {
    slug: 'static-methods',
    titleEn: 'Static Methods',
    titleUa: 'Статичні Методи',
    descriptionEn: 'Class-level methods in JavaScript',
    descriptionUa: 'Методи на рівні класу в JavaScript',
    difficulty: 'EASY' as const,
    order: 22,
    contentMarkdownEn: `Belong to class, not instance. static keyword. Used for utilities, factory methods. Math.max(), Array.isArray().`,
    contentMarkdownUa: `Належать класу, не екземпляру. Ключове слово static. Використовується для утиліт, фабричних методів. Math.max(), Array.isArray().`,
  },
  {
    slug: 'spread-and-rest',
    titleEn: 'Spread and Rest',
    titleUa: 'Spread та Rest',
    descriptionEn: 'The ... operator',
    descriptionUa: 'Оператор ...',
    difficulty: 'EASY' as const,
    order: 23,
    contentMarkdownEn: `Spread: unpacks arrays/objects. Rest: collects remaining elements. Same syntax (...), opposite purposes.`,
    contentMarkdownUa: `Spread: розпаковує масиви/обєкти. Rest: збирає залишкові елементи. Той самий синтаксис (...), протилежні цілі.`,
  },
  {
    slug: 'higher-order-functions',
    titleEn: 'Higher-Order Functions',
    titleUa: 'Функції Вищого Порядку',
    descriptionEn: 'Functions as first-class values',
    descriptionUa: 'Функції як значення першого класу',
    difficulty: 'MEDIUM' as const,
    order: 24,
    contentMarkdownEn: `Functions that take or return other functions. map, filter, reduce are HOF. Enables functional programming.`,
    contentMarkdownUa: `Функції, які приймають або повертають інші функції. map, filter, reduce є HOF. Дозволяє функціональне програмування.`,
  },
  {
    slug: 'currying',
    titleEn: 'Currying',
    titleUa: 'Каррінг',
    descriptionEn: 'Partial application technique',
    descriptionUa: 'Техніка часткового застосування',
    difficulty: 'MEDIUM' as const,
    order: 25,
    contentMarkdownEn: `Transform multi-argument function into sequence of single-argument functions. Enables reusability and composition.`,
    contentMarkdownUa: `Трансформація багатоаргументної функції в послідовність одноаргументних функцій. Дозволяє повторне використання та композицію.`,
  },
  {
    slug: 'iife',
    titleEn: 'IIFE',
    titleUa: 'IIFE (Негайно Викликувана Функція)',
    descriptionEn: 'Immediately Invoked Function Expression',
    descriptionUa: 'Негайно Викликуваний Функціональний Вираз',
    difficulty: 'EASY' as const,
    order: 26,
    contentMarkdownEn: `(function(){})(); Executes immediately. Isolates scope. Creates privacy. Module pattern.`,
    contentMarkdownUa: `(function(){})(); Виконується негайно. Ізолює область. Створює приватність. Шаблон модуля.`,
  },
  {
    slug: 'event-target-vs-currenttarget',
    titleEn: 'event.target vs currentTarget',
    titleUa: 'event.target проти currentTarget',
    descriptionEn: 'Event object properties',
    descriptionUa: 'Властивості обєкта події',
    difficulty: 'EASY' as const,
    order: 27,
    contentMarkdownEn: `target: where event occurred. currentTarget: where handler attached. Important for event delegation.`,
    contentMarkdownUa: `target: де подія сталася. currentTarget: де обробник прикріплений. Важливо для делегування подій.`,
  },
  {
    slug: 'boxing-unboxing',
    titleEn: 'Boxing and Unboxing',
    titleUa: 'Boxing та Unboxing',
    descriptionEn: 'Primitive to object conversion',
    descriptionUa: 'Конвертація примітива до обєкта',
    difficulty: 'MEDIUM' as const,
    order: 28,
    contentMarkdownEn: `Boxing: primitive→object wrapper. Unboxing: object→primitive. Automatic in JavaScript. valueOf() method.`,
    contentMarkdownUa: `Boxing: примітив→обєкт-обгортка. Unboxing: обєкт→примітив. Автоматично в JavaScript. Метод valueOf().`,
  },
  {
    slug: 'arguments',
    titleEn: 'arguments Object',
    titleUa: 'Обєкт arguments',
    descriptionEn: 'Pseudo-array of function arguments',
    descriptionUa: 'Псевдомасив аргументів функції',
    difficulty: 'MEDIUM' as const,
    order: 29,
    contentMarkdownEn: `Built-in object in functions. Pseudo-array. Not available in arrow functions. Use ...rest parameters instead (modern).`,
    contentMarkdownUa: `Вбудований обєкт у функціях. Псевдомасив. Недоступний в arrow функціях. Використовуйте ...rest параметри натомість (сучасний підхід).`,
  },
  {
    slug: 'in-vs-hasownproperty',
    titleEn: 'in vs hasOwnProperty',
    titleUa: 'in проти hasOwnProperty',
    descriptionEn: 'Property existence checking',
    descriptionUa: 'Перевірка існування властивості',
    difficulty: 'EASY' as const,
    order: 30,
    contentMarkdownEn: `in operator: checks prototype chain. hasOwnProperty(): only own properties. Use Object.hasOwn() (modern).`,
    contentMarkdownUa: `Оператор in: перевіряє ланцюжок прототипів. hasOwnProperty(): тільки власні властивості. Використовуйте Object.hasOwn() (сучасний).`,
  },
  {
    slug: 'tdz',
    titleEn: 'Temporal Dead Zone',
    titleUa: 'Temporal Dead Zone',
    descriptionEn: 'TDZ for let and const',
    descriptionUa: 'TDZ для let та const',
    difficulty: 'MEDIUM' as const,
    order: 31,
    contentMarkdownEn: `Time period between scope start and variable initialization. Applies to let/const. ReferenceError before initialization.`,
    contentMarkdownUa: `Часовий період між початком області та ініціалізацією змінної. Застосовується до let/const. ReferenceError перед ініціалізацією.`,
  },
  {
    slug: 'event-delegation',
    titleEn: 'Event Delegation',
    titleUa: 'Делегування Подій',
    descriptionEn: 'Efficient event handling pattern',
    descriptionUa: 'Ефективний шаблон обробки подій',
    difficulty: 'MEDIUM' as const,
    order: 32,
    contentMarkdownEn: `Handler on parent element, not each child. Uses event bubbling. Check event.target. Works with dynamic elements.`,
    contentMarkdownUa: `Обробник на батьківському елементі, не на кожній дитині. Використовує event bubbling. Перевірка event.target. Працює з динамічними елементами.`,
  },
  {
    slug: 'prevent-vs-stop',
    titleEn: 'preventDefault vs stopPropagation',
    titleUa: 'preventDefault проти stopPropagation',
    descriptionEn: 'Event control methods',
    descriptionUa: 'Методи контролю подій',
    difficulty: 'EASY' as const,
    order: 33,
    contentMarkdownEn: `preventDefault(): cancels browser default action. stopPropagation(): stops event bubbling. Different purposes, not interchangeable.`,
    contentMarkdownUa: `preventDefault(): скасовує стандартну дію браузера. stopPropagation(): зупиняє bubbling події. Різні цілі, не взаємозамінні.`,
  },
  {
    slug: 'nan',
    titleEn: 'NaN',
    titleUa: 'NaN',
    descriptionEn: 'Not-a-Number special value',
    descriptionUa: 'Спеціальне значення Не-Число',
    difficulty: 'EASY' as const,
    order: 34,
    contentMarkdownEn: `Special value meaning invalid number. typeof NaN === "number". NaN !== NaN (always true!). Use Number.isNaN() to check.`,
    contentMarkdownUa: `Спеціальне значення, що означає невірне число. typeof NaN === "number". NaN !== NaN (завжди true!). Використовуйте Number.isNaN() для перевірки.`,
  },
  {
    slug: 'copy-object',
    titleEn: 'Copy Object',
    titleUa: 'Копіювання Обєкта',
    descriptionEn: 'Shallow and deep copying',
    descriptionUa: 'Поверхневе та глибоке копіювання',
    difficulty: 'MEDIUM' as const,
    order: 35,
    contentMarkdownEn: `Shallow: spread (...), Object.assign(). Deep: structuredClone(), JSON.parse(JSON.stringify()), lodash.cloneDeep().`,
    contentMarkdownUa: `Поверхневе: spread (...), Object.assign(). Глибоке: structuredClone(), JSON.parse(JSON.stringify()), lodash.cloneDeep().`,
  },
  {
    slug: 'generators',
    titleEn: 'Generators',
    titleUa: 'Генератори',
    descriptionEn: 'Pausable functions in JavaScript',
    descriptionUa: 'Призупинювані функції в JavaScript',
    difficulty: 'HARD' as const,
    order: 36,
    contentMarkdownEn: `function* syntax. yield pauses execution. next() resumes. Returns iterators. Enables lazy evaluation.`,
    contentMarkdownUa: `Синтаксис function*. yield призупиняє виконання. next() відновлює. Повертає ітератори. Дозволяє ліниве обчислення.`,
  },
  {
    slug: 'garbage-collector',
    titleEn: 'Garbage Collector',
    titleUa: 'Збирач Сміття',
    descriptionEn: 'Automatic memory management',
    descriptionUa: 'Автоматичне керування памяттю',
    difficulty: 'MEDIUM' as const,
    order: 37,
    contentMarkdownEn: `Automatically frees memory of unreachable objects. Mark-and-Sweep algorithm. Avoid memory leaks with circular references.`,
    contentMarkdownUa: `Автоматично звільняє память недосяжних обєктів. Алгоритм Mark-and-Sweep. Уникайте витоків памяті з циклічними посиланнями.`,
  },
  {
    slug: 'polyfill',
    titleEn: 'Polyfill',
    titleUa: 'Polyfill',
    descriptionEn: 'Browser compatibility patches',
    descriptionUa: 'Патчі сумісності браузерів',
    difficulty: 'EASY' as const,
    order: 38,
    contentMarkdownEn: `Code implementing missing features in older browsers. Babel, core-js. Increases bundle size.`,
    contentMarkdownUa: `Код, що реалізує відсутні функції в старих браузерах. Babel, core-js. Збільшує розмір бандла.`,
  },
  {
    slug: 'recursion',
    titleEn: 'Recursion',
    titleUa: 'Рекурсія',
    descriptionEn: 'Self-calling functions',
    descriptionUa: 'Само-викликувані функції',
    difficulty: 'MEDIUM' as const,
    order: 39,
    contentMarkdownEn: `Function calls itself. Requires base case + recursive call. Used for trees, graphs. Risk of stack overflow.`,
    contentMarkdownUa: `Функція викликає себе. Потребує базовий випадок + рекурсивний виклик. Використовується для дерев, графів. Ризик переповнення стеку.`,
  },
  {
    slug: 'object-keys-values',
    titleEn: 'Object.keys/values/entries',
    titleUa: 'Object.keys/values/entries',
    descriptionEn: 'Object iteration methods',
    descriptionUa: 'Методи ітерації обєктів',
    difficulty: 'EASY' as const,
    order: 40,
    contentMarkdownEn: `Object.keys(): array of keys. Object.values(): array of values. Object.entries(): array of [key, value] pairs.`,
    contentMarkdownUa: `Object.keys(): масив ключів. Object.values(): масив значень. Object.entries(): масив пар [ключ, значення].`,
  },
  {
    slug: 'array-methods',
    titleEn: 'Array Methods',
    titleUa: 'Методи Масивів',
    descriptionEn: 'Mutating vs non-mutating methods',
    descriptionUa: 'Мутуючі проти немутуючих методів',
    difficulty: 'MEDIUM' as const,
    order: 41,
    contentMarkdownEn: `Mutating: push, pop, splice, sort, reverse. Non-mutating: map, filter, slice, concat. ES2023: toSorted(), toReversed(), toSpliced().`,
    contentMarkdownUa: `Мутуючі: push, pop, splice, sort, reverse. Немутуючі: map, filter, slice, concat. ES2023: toSorted(), toReversed(), toSpliced().`,
  },
  {
    slug: 'symbol-iterator',
    titleEn: 'Symbol.iterator',
    titleUa: 'Symbol.iterator',
    descriptionEn: 'Making objects iterable',
    descriptionUa: 'Робити обєкти ітерованими',
    difficulty: 'HARD' as const,
    order: 42,
    contentMarkdownEn: `Makes objects iterable for for...of, spread. Implements iterator protocol. next() returns {value, done}.`,
    contentMarkdownUa: `Робить обєкти ітерованими для for...of, spread. Реалізує протокол ітератора. next() повертає {value, done}.`,
  },
  {
    slug: 'instanceof',
    titleEn: 'instanceof Operator',
    titleUa: 'Оператор instanceof',
    descriptionEn: 'Check object type',
    descriptionUa: 'Перевірка типу обєкта',
    difficulty: 'EASY' as const,
    order: 43,
    contentMarkdownEn: `Checks if object is in prototype chain of constructor. obj instanceof Constructor. Doesn't work with primitives. Different from typeof.`,
    contentMarkdownUa: `Перевіряє чи обєкт знаходиться в ланцюжку прототипів конструктора. obj instanceof Constructor. Не працює з примітивами. Відрізняється від typeof.`,
  },
  {
    slug: 'raf-ric',
    titleEn: 'requestAnimationFrame/IdleCallback',
    titleUa: 'requestAnimationFrame/IdleCallback',
    descriptionEn: 'Browser timing APIs',
    descriptionUa: 'Браузерні API часу',
    difficulty: 'MEDIUM' as const,
    order: 44,
    contentMarkdownEn: `rAF: before repaint, ~60fps, for animations. rIC: when browser idle, for non-priority tasks.`,
    contentMarkdownUa: `rAF: перед repaint, ~60fps, для анімацій. rIC: коли браузер вільний, для не пріоритетних задач.`,
  },
  {
    slug: 'debounce-throttle',
    titleEn: 'Debounce and Throttle',
    titleUa: 'Debounce та Throttle',
    descriptionEn: 'Performance optimization techniques',
    descriptionUa: 'Техніки оптимізації продуктивності',
    difficulty: 'HARD' as const,
    order: 45,
    contentMarkdownEn: `Debounce: delays execution until pause (search). Throttle: limits call frequency (scroll). Control execution rate.`,
    contentMarkdownUa: `Debounce: затримує виконання до паузи (пошук). Throttle: обмежує частоту викликів (scroll). Контроль частоти виконання.`,
  },
  {
    slug: 'closures',
    titleEn: 'Closures',
    titleUa: 'Замикання',
    descriptionEn: 'Lexical scope retention',
    descriptionUa: 'Збереження лексичної області',
    difficulty: 'HARD' as const,
    order: 46,
    contentMarkdownEn: `Function + lexical environment. Accesses outer variables after function ends. Enables private data, module pattern. Basis for many patterns.`,
    contentMarkdownUa: `Функція + лексичне оточення. Доступ до зовнішніх змінних після завершення функції. Дозволяє приватні дані, шаблон модуля. Основа багатьох шаблонів.`,
  },
  {
    slug: 'promise-static-methods',
    titleEn: 'Promise Static Methods',
    titleUa: 'Статичні Методи Promise',
    descriptionEn: 'all, race, allSettled, any',
    descriptionUa: 'all, race, allSettled, any',
    difficulty: 'MEDIUM' as const,
    order: 47,
    contentMarkdownEn: `Promise.all: all or nothing. Promise.race: first settles. Promise.allSettled: all results. Promise.any: first success.`,
    contentMarkdownUa: `Promise.all: все або нічого. Promise.race: перший завершується. Promise.allSettled: всі результати. Promise.any: перший успіх.`,
  },
  {
    slug: 'memoization',
    titleEn: 'Memoization',
    titleUa: 'Мемоїзація',
    descriptionEn: 'Caching computation results',
    descriptionUa: 'Кешування результатів обчислень',
    difficulty: 'HARD' as const,
    order: 48,
    contentMarkdownEn: `Cache expensive computations. Fibonacci optimization (1000x faster). React: useMemo, useCallback, React.memo. Avoid memory leaks.`,
    contentMarkdownUa: `Кешування дорогих обчислень. Оптимізація Фібоначчі (1000x швидше). React: useMemo, useCallback, React.memo. Уникайте витоків памяті.`,
  },
  {
    slug: 'json-methods',
    titleEn: 'JSON.parse and JSON.stringify',
    titleUa: 'JSON.parse та JSON.stringify',
    descriptionEn: 'JSON serialization and parsing',
    descriptionUa: 'Серіалізація та парсинг JSON',
    difficulty: 'EASY' as const,
    order: 49,
    contentMarkdownEn: `JSON.stringify(): object→string. JSON.parse(): string→object. Loses functions, Date objects. replacer/reviver parameters for customization.`,
    contentMarkdownUa: `JSON.stringify(): обєкт→рядок. JSON.parse(): рядок→обєкт. Втрачає функції, Date обєкти. Параметри replacer/reviver для налаштування.`,
  },
]

async function addJavaScriptQuestions() {
  try {
    console.log('🚀 JavaScript Mega-Batch: Adding Initial Set\n')
    const [category] = await db.select().from(schema.categories)
      .where(eq(schema.categories.slug, 'javascript')).limit(1)
    
    if (!category) throw new Error('JavaScript category not found')
    console.log(`✓ Category: ${category.nameEn}\n`)
    
    let added = 0, updated = 0
    
    for (const q of questions) {
      const [existing] = await db.select().from(schema.questions)
        .where(eq(schema.questions.slug, q.slug)).limit(1)
      
      if (existing) {
        await db.update(schema.questions)
          .set({...q, categoryId: category.id, updatedAt: new Date()})
          .where(eq(schema.questions.id, existing.id))
        updated++
        console.log(`✅ Updated: ${q.slug}`)
      } else {
        await db.insert(schema.questions).values({...q, categoryId: category.id})
        added++
        console.log(`✅ Added: ${q.slug}`)
      }
    }
    
    console.log(`\n📊 Summary:`)
    console.log(`   Added: ${added}`)
    console.log(`   Updated: ${updated}`)
    console.log(`   Total: ${added + updated}/${questions.length}\n`)
  } finally {
    await client.end()
  }
}

addJavaScriptQuestions().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })
