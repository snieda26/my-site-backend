/**
 * Script to add short answers to ALL questions
 * Usage: npx tsx scripts/add-all-short-answers.ts
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

console.log(`📡 Connecting to database...`)

const client = postgres(connectionString)
const db = drizzle(client, { schema })

const shortAnswers: Record<string, { en: string; ua: string }> = {
  // ==================== TYPESCRIPT ====================
  'what-is-typescript-for-pros-cons': {
    en: `**TypeScript** is a superset of JavaScript with static typing.

**Pros:** error detection during development, improved autocomplete, refactoring, code documentation through types, scalability.

**Cons:** additional complexity, compilation time, learning curve, need to type third-party libraries.

TypeScript compiles to regular JavaScript and can be used anywhere JS works.`,
    ua: `**TypeScript** — це надбудова над JavaScript зі статичною типізацією.

**Переваги:** виявлення помилок під час розробки, покращене автодоповнення та рефакторинг, документування коду через типи, масштабованість.

**Недоліки:** додаткова складність, час компіляції, крива навчання, потреба типізувати сторонні бібліотеки.

TypeScript компілюється у звичайний JavaScript.`,
  },
  'type-vs-interface-typescript': {
    en: `Both \`type\` and \`interface\` define object shapes in TypeScript.

**Interfaces:** support declaration merging, better for OOP patterns and extending.

**Types:** more flexible — support unions (\`|}\`), intersections (\`&\`), mapped types, can alias primitives.

Use \`interface\` for public API contracts; use \`type\` for complex compositions and unions.`,
    ua: `Як \`type\`, так і \`interface\` визначають структури обʼєктів у TypeScript.

**Інтерфейси:** підтримують злиття декларацій, краще для ООП-патернів та розширення.

**Типи:** гнучкіші — підтримують union (\`|\`), intersection (\`&\`), mapped types, можуть створювати псевдоніми примітивів.

Використовуйте \`interface\` для публічних API; \`type\` — для складних композицій.`,
  },
  'differences-between-any-and-unknown-in-typescript': {
    en: `Both \`any\` and \`unknown\` accept any value, but \`unknown\` is **type-safe**.

- \`any\` — disables type checking completely
- \`unknown\` — requires type narrowing before use (via \`typeof\`, \`instanceof\`, type guards)

\`\`\`typescript
const x: unknown = getData();
if (typeof x === 'string') x.toUpperCase(); // OK
\`\`\`

Use \`unknown\` for external data; avoid \`any\`.`,
    ua: `Обидва \`any\` та \`unknown\` приймають будь-яке значення, але \`unknown\` є **типобезпечним**.

- \`any\` — повністю вимикає перевірку типів
- \`unknown\` — вимагає звуження типу перед використанням (\`typeof\`, \`instanceof\`, type guards)

\`\`\`typescript
const x: unknown = getData();
if (typeof x === 'string') x.toUpperCase(); // OK
\`\`\`

Використовуйте \`unknown\` для зовнішніх даних; уникайте \`any\`.`,
  },
  'what-are-generics-typescript': {
    en: `**Generics** allow creating reusable components that work with different types while maintaining type safety.

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
identity<string>('hello'); // T = string
\`\`\`

Common use cases: generic functions, classes, interfaces, and utility types like \`Array<T>\`, \`Promise<T>\`.`,
    ua: `**Дженерики** дозволяють створювати компоненти, що працюють з різними типами, зберігаючи типобезпеку.

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
identity<string>('hello'); // T = string
\`\`\`

Типові випадки: generic-функції, класи, інтерфейси та утилітарні типи як \`Array<T>\`, \`Promise<T>\`.`,
  },
  'what-are-decorators-in-typescript': {
    en: `**Decorators** are special declarations that modify classes, methods, properties, or parameters at design time using \`@expression\` syntax.

\`\`\`typescript
@Component({ selector: 'app-root' })
class AppComponent {}
\`\`\`

Commonly used in Angular and NestJS. Enable with \`experimentalDecorators: true\` in tsconfig.json.`,
    ua: `**Декоратори** — це спеціальні оголошення, що модифікують класи, методи, властивості або параметри через синтаксис \`@expression\`.

\`\`\`typescript
@Component({ selector: 'app-root' })
class AppComponent {}
\`\`\`

Часто використовуються в Angular та NestJS. Увімкніть \`experimentalDecorators: true\` в tsconfig.json.`,
  },
  'union-types-typescript': {
    en: `**Union types** allow a value to be one of several types using the \`|\` operator.

\`\`\`typescript
type Status = 'loading' | 'success' | 'error';
function process(input: string | number) {}
\`\`\`

TypeScript narrows the type through control flow. Use type guards (\`typeof\`, \`instanceof\`, \`in\`) to safely work with union members.`,
    ua: `**Union-типи** дозволяють значенню бути одним із кількох типів через оператор \`|\`.

\`\`\`typescript
type Status = 'loading' | 'success' | 'error';
function process(input: string | number) {}
\`\`\`

TypeScript звужує тип через аналіз потоку. Використовуйте type guards (\`typeof\`, \`instanceof\`, \`in\`) для роботи з членами union.`,
  },
  'conditional-types-in-typescript': {
    en: `**Conditional types** select a type based on a condition: \`T extends U ? X : Y\`

\`\`\`typescript
type IsString<T> = T extends string ? true : false;
type A = IsString<'hello'>; // true
\`\`\`

Built-in conditional types: \`Exclude\`, \`Extract\`, \`NonNullable\`, \`ReturnType\`, \`Parameters\`.`,
    ua: `**Умовні типи** обирають тип на основі умови: \`T extends U ? X : Y\`

\`\`\`typescript
type IsString<T> = T extends string ? true : false;
type A = IsString<'hello'>; // true
\`\`\`

Вбудовані умовні типи: \`Exclude\`, \`Extract\`, \`NonNullable\`, \`ReturnType\`, \`Parameters\`.`,
  },
  'discriminated-unions-in-typescript': {
    en: `**Discriminated unions** are union types where each member has a common property (discriminant) with a literal type.

\`\`\`typescript
type Result = 
  | { status: 'success'; data: string }
  | { status: 'error'; error: Error };

function handle(r: Result) {
  if (r.status === 'success') r.data; // narrowed!
}
\`\`\``,
    ua: `**Дискриміновані union** — це union-типи, де кожен член має спільну властивість (дискримінант) з літеральним типом.

\`\`\`typescript
type Result = 
  | { status: 'success'; data: string }
  | { status: 'error'; error: Error };

function handle(r: Result) {
  if (r.status === 'success') r.data; // звужено!
}
\`\`\``,
  },
  'utility-type-awaited-in-typescript': {
    en: `\`Awaited<T>\` recursively unwraps Promise types to get the resolved value type.

\`\`\`typescript
type A = Awaited<Promise<string>>; // string
type B = Awaited<Promise<Promise<number>>>; // number
\`\`\`

Useful for typing async function returns and \`Promise.all\` results.`,
    ua: `\`Awaited<T>\` рекурсивно розгортає типи Promise, щоб отримати тип значення.

\`\`\`typescript
type A = Awaited<Promise<string>>; // string
type B = Awaited<Promise<Promise<number>>>; // number
\`\`\`

Корисний для типізації повернень async-функцій та результатів \`Promise.all\`.`,
  },
  'any-vs-unknown-typescript': {
    en: `- \`any\` — disables all type checking, you can do anything
- \`unknown\` — type-safe counterpart, must check type before using

\`\`\`typescript
let a: any = 5; a.foo(); // OK (but runtime error!)
let u: unknown = 5; u.foo(); // Error: must narrow first
\`\`\`

Prefer \`unknown\` when type is truly unknown; use \`any\` only as last resort.`,
    ua: `- \`any\` — вимикає перевірку типів, можна робити що завгодно
- \`unknown\` — типобезпечна альтернатива, потрібно перевірити тип

\`\`\`typescript
let a: any = 5; a.foo(); // OK (але помилка в runtime!)
let u: unknown = 5; u.foo(); // Error: спочатку звузьте тип
\`\`\`

Надавайте перевагу \`unknown\`; використовуйте \`any\` лише як крайній засіб.`,
  },
  'type-guard-typescript': {
    en: `**Type Guards** are expressions that narrow types at runtime.

\`\`\`typescript
function isString(x: unknown): x is string {
  return typeof x === 'string';
}

if (isString(value)) {
  value.toUpperCase(); // TypeScript knows it's string
}
\`\`\`

Built-in guards: \`typeof\`, \`instanceof\`, \`in\` operator.`,
    ua: `**Type Guards** — це вирази, що звужують типи під час виконання.

\`\`\`typescript
function isString(x: unknown): x is string {
  return typeof x === 'string';
}

if (isString(value)) {
  value.toUpperCase(); // TypeScript знає, що це string
}
\`\`\`

Вбудовані guards: \`typeof\`, \`instanceof\`, оператор \`in\`.`,
  },
  'what-is-an-enum-in-typescript': {
    en: `**Enum** is a way to define a set of named constants.

\`\`\`typescript
enum Status { Pending, Active, Done }
const s: Status = Status.Active; // 1

enum Direction { Up = 'UP', Down = 'DOWN' }
\`\`\`

Numeric enums auto-increment; string enums require explicit values. Consider \`const\` objects as alternative.`,
    ua: `**Enum** — це спосіб визначити набір іменованих констант.

\`\`\`typescript
enum Status { Pending, Active, Done }
const s: Status = Status.Active; // 1

enum Direction { Up = 'UP', Down = 'DOWN' }
\`\`\`

Числові enum авто-інкрементуються; строкові вимагають явних значень. Розгляньте \`const\` обʼєкти як альтернативу.`,
  },
  'utility-type-exclude-in-typescript': {
    en: `\`Exclude<T, U>\` removes types from \`T\` that are assignable to \`U\`.

\`\`\`typescript
type T = 'a' | 'b' | 'c';
type Result = Exclude<T, 'a'>; // 'b' | 'c'

type NoNull = Exclude<string | null | undefined, null | undefined>; // string
\`\`\``,
    ua: `\`Exclude<T, U>\` видаляє з \`T\` типи, що присвоюються до \`U\`.

\`\`\`typescript
type T = 'a' | 'b' | 'c';
type Result = Exclude<T, 'a'>; // 'b' | 'c'

type NoNull = Exclude<string | null | undefined, null | undefined>; // string
\`\`\``,
  },
  'never-type-typescript': {
    en: `\`never\` represents values that never occur — functions that never return or impossible types.

\`\`\`typescript
function fail(msg: string): never {
  throw new Error(msg);
}

type Empty = string & number; // never
\`\`\`

Used in exhaustiveness checking for discriminated unions.`,
    ua: `\`never\` представляє значення, що ніколи не виникають — функції, що не повертаються, або неможливі типи.

\`\`\`typescript
function fail(msg: string): never {
  throw new Error(msg);
}

type Empty = string & number; // never
\`\`\`

Використовується для exhaustiveness checking у discriminated unions.`,
  },
  'infer-keyword-typescript': {
    en: `\`infer\` keyword extracts types within conditional types.

\`\`\`typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Fn = () => string;
type Result = ReturnType<Fn>; // string
\`\`\`

\`infer R\` captures the return type and makes it available as \`R\`.`,
    ua: `Ключове слово \`infer\` витягує типи в умовних типах.

\`\`\`typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Fn = () => string;
type Result = ReturnType<Fn>; // string
\`\`\`

\`infer R\` захоплює тип повернення і робить його доступним як \`R\`.`,
  },
  'utility-type-extract-in-typescript': {
    en: `\`Extract<T, U>\` keeps only types from \`T\` that are assignable to \`U\`.

\`\`\`typescript
type T = 'a' | 'b' | 'c';
type Result = Extract<T, 'a' | 'b'>; // 'a' | 'b'

type OnlyFunctions = Extract<string | (() => void), Function>; // () => void
\`\`\`

Opposite of \`Exclude\`.`,
    ua: `\`Extract<T, U>\` залишає лише типи з \`T\`, що присвоюються до \`U\`.

\`\`\`typescript
type T = 'a' | 'b' | 'c';
type Result = Extract<T, 'a' | 'b'>; // 'a' | 'b'

type OnlyFunctions = Extract<string | (() => void), Function>; // () => void
\`\`\`

Протилежність \`Exclude\`.`,
  },
  'function-overloads-in-typescript': {
    en: `**Function overloads** allow defining multiple function signatures for different parameter types.

\`\`\`typescript
function parse(input: string): object;
function parse(input: object): string;
function parse(input: string | object) {
  return typeof input === 'string' ? JSON.parse(input) : JSON.stringify(input);
}
\`\`\``,
    ua: `**Перевантаження функцій** дозволяють визначати кілька сигнатур для різних типів параметрів.

\`\`\`typescript
function parse(input: string): object;
function parse(input: object): string;
function parse(input: string | object) {
  return typeof input === 'string' ? JSON.parse(input) : JSON.stringify(input);
}
\`\`\``,
  },
  'keyof-typeof-typescript': {
    en: `- \`keyof T\` — gets union of all keys of type T
- \`typeof obj\` — gets the type of a value

\`\`\`typescript
const config = { api: '/api', timeout: 5000 };
type Config = typeof config; // { api: string; timeout: number }
type Keys = keyof Config; // 'api' | 'timeout'
\`\`\``,
    ua: `- \`keyof T\` — отримує union всіх ключів типу T
- \`typeof obj\` — отримує тип значення

\`\`\`typescript
const config = { api: '/api', timeout: 5000 };
type Config = typeof config; // { api: string; timeout: number }
type Keys = keyof Config; // 'api' | 'timeout'
\`\`\``,
  },
  'record-utility-type-typescript': {
    en: `\`Record<K, V>\` creates an object type with keys of type \`K\` and values of type \`V\`.

\`\`\`typescript
type PageInfo = Record<'home' | 'about', { title: string }>;
// { home: { title: string }; about: { title: string } }

const cache: Record<string, User> = {};
\`\`\``,
    ua: `\`Record<K, V>\` створює обʼєктний тип з ключами типу \`K\` та значеннями типу \`V\`.

\`\`\`typescript
type PageInfo = Record<'home' | 'about', { title: string }>;
// { home: { title: string }; about: { title: string } }

const cache: Record<string, User> = {};
\`\`\``,
  },
  'what-is-generic-in-typescript': {
    en: `**Generics** provide type parameters that make code reusable across different types.

\`\`\`typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
first<number>([1, 2, 3]); // number
first(['a', 'b']); // string (inferred)
\`\`\``,
    ua: `**Дженерики** надають параметри типів, що роблять код багаторазовим для різних типів.

\`\`\`typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
first<number>([1, 2, 3]); // number
first(['a', 'b']); // string (виведено)
\`\`\``,
  },
  'what-does-implements-do-in-typescript': {
    en: `\`implements\` ensures a class satisfies an interface contract.

\`\`\`typescript
interface Printable {
  print(): void;
}

class Document implements Printable {
  print() { console.log('Printing...'); }
}
\`\`\`

The class must implement all interface members. Unlike \`extends\`, it doesn't inherit implementation.`,
    ua: `\`implements\` гарантує, що клас відповідає контракту інтерфейсу.

\`\`\`typescript
interface Printable {
  print(): void;
}

class Document implements Printable {
  print() { console.log('Printing...'); }
}
\`\`\`

Клас повинен реалізувати всі члени інтерфейсу. На відміну від \`extends\`, не успадковує реалізацію.`,
  },
  'infer-keyword-in-typescript-infer-typescript': {
    en: `\`infer\` declares a type variable within a conditional type to capture a type.

\`\`\`typescript
type UnwrapArray<T> = T extends (infer U)[] ? U : T;
type A = UnwrapArray<string[]>; // string
type B = UnwrapArray<number>; // number
\`\`\``,
    ua: `\`infer\` оголошує змінну типу в умовному типі для захоплення типу.

\`\`\`typescript
type UnwrapArray<T> = T extends (infer U)[] ? U : T;
type A = UnwrapArray<string[]>; // string
type B = UnwrapArray<number>; // number
\`\`\``,
  },
  'how-keyof-and-typeof-work-in-typescript': {
    en: `**keyof** extracts keys as a union type; **typeof** gets the type of a runtime value.

\`\`\`typescript
const user = { name: 'John', age: 30 };
type UserType = typeof user; // { name: string; age: number }
type UserKeys = keyof typeof user; // 'name' | 'age'
\`\`\``,
    ua: `**keyof** витягує ключі як union-тип; **typeof** отримує тип значення під час виконання.

\`\`\`typescript
const user = { name: 'John', age: 30 };
type UserType = typeof user; // { name: string; age: number }
type UserKeys = keyof typeof user; // 'name' | 'age'
\`\`\``,
  },
  'what-are-mapped-types-in-typescript': {
    en: `**Mapped types** transform properties of an existing type.

\`\`\`typescript
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Optional<T> = { [K in keyof T]?: T[K] };

type User = { name: string; age: number };
type ReadonlyUser = Readonly<User>;
\`\`\``,
    ua: `**Mapped types** трансформують властивості існуючого типу.

\`\`\`typescript
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Optional<T> = { [K in keyof T]?: T[K] };

type User = { name: string; age: number };
type ReadonlyUser = Readonly<User>;
\`\`\``,
  },
  'never-type-in-typescript': {
    en: `\`never\` is the bottom type — no value can be assigned to it.

**Use cases:**
- Functions that never return (throw or infinite loop)
- Exhaustiveness checking in switch statements
- Impossible intersections (\`string & number\`)

\`\`\`typescript
function assertNever(x: never): never {
  throw new Error('Unexpected: ' + x);
}
\`\`\``,
    ua: `\`never\` — це "нижній" тип, жодне значення не може бути присвоєне.

**Випадки використання:**
- Функції, що ніколи не повертаються (throw або нескінченний цикл)
- Exhaustiveness checking у switch
- Неможливі перетини (\`string & number\`)

\`\`\`typescript
function assertNever(x: never): never {
  throw new Error('Unexpected: ' + x);
}
\`\`\``,
  },
  'utility-type-parameters-in-typescript': {
    en: `\`Parameters<T>\` extracts parameter types of a function as a tuple.

\`\`\`typescript
function greet(name: string, age: number) {}
type P = Parameters<typeof greet>; // [string, number]

type First = P[0]; // string
\`\`\``,
    ua: `\`Parameters<T>\` витягує типи параметрів функції як кортеж.

\`\`\`typescript
function greet(name: string, age: number) {}
type P = Parameters<typeof greet>; // [string, number]

type First = P[0]; // string
\`\`\``,
  },
  'utility-type-partial-in-typescript': {
    en: `\`Partial<T>\` makes all properties of T optional.

\`\`\`typescript
interface User { name: string; age: number; }
type PartialUser = Partial<User>;
// { name?: string; age?: number; }

function update(user: User, changes: Partial<User>) {}
\`\`\``,
    ua: `\`Partial<T>\` робить усі властивості T необовʼязковими.

\`\`\`typescript
interface User { name: string; age: number; }
type PartialUser = Partial<User>;
// { name?: string; age?: number; }

function update(user: User, changes: Partial<User>) {}
\`\`\``,
  },
  'utility-type-pick-in-typescript': {
    en: `\`Pick<T, K>\` creates a type with only the specified keys from T.

\`\`\`typescript
interface User { id: number; name: string; email: string; }
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }
\`\`\``,
    ua: `\`Pick<T, K>\` створює тип лише з вказаними ключами з T.

\`\`\`typescript
interface User { id: number; name: string; email: string; }
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }
\`\`\``,
  },
  'utility-type-readonly-in-typescript': {
    en: `\`Readonly<T>\` makes all properties of T readonly.

\`\`\`typescript
interface Config { api: string; timeout: number; }
const config: Readonly<Config> = { api: '/api', timeout: 5000 };
config.api = '/v2'; // Error: Cannot assign to 'api'
\`\`\``,
    ua: `\`Readonly<T>\` робить усі властивості T доступними лише для читання.

\`\`\`typescript
interface Config { api: string; timeout: number; }
const config: Readonly<Config> = { api: '/api', timeout: 5000 };
config.api = '/v2'; // Error: Cannot assign to 'api'
\`\`\``,
  },
  'utility-type-record-in-typescript': {
    en: `\`Record<K, V>\` constructs an object type with keys K and values V.

\`\`\`typescript
type Roles = 'admin' | 'user' | 'guest';
type Permissions = Record<Roles, string[]>;
// { admin: string[]; user: string[]; guest: string[]; }
\`\`\``,
    ua: `\`Record<K, V>\` створює обʼєктний тип з ключами K та значеннями V.

\`\`\`typescript
type Roles = 'admin' | 'user' | 'guest';
type Permissions = Record<Roles, string[]>;
// { admin: string[]; user: string[]; guest: string[]; }
\`\`\``,
  },
  'utility-type-required-in-typescript': {
    en: `\`Required<T>\` makes all properties of T required (removes optional \`?\`).

\`\`\`typescript
interface Props { name?: string; age?: number; }
type RequiredProps = Required<Props>;
// { name: string; age: number; }
\`\`\`

Opposite of \`Partial<T>\`.`,
    ua: `\`Required<T>\` робить усі властивості T обовʼязковими (видаляє \`?\`).

\`\`\`typescript
interface Props { name?: string; age?: number; }
type RequiredProps = Required<Props>;
// { name: string; age: number; }
\`\`\`

Протилежність \`Partial<T>\`.`,
  },
  'utility-type-returntype-in-typescript': {
    en: `\`ReturnType<T>\` extracts the return type of a function type.

\`\`\`typescript
function getUser() { return { name: 'John', age: 30 }; }
type User = ReturnType<typeof getUser>;
// { name: string; age: number; }
\`\`\``,
    ua: `\`ReturnType<T>\` витягує тип повернення функції.

\`\`\`typescript
function getUser() { return { name: 'John', age: 30 }; }
type User = ReturnType<typeof getUser>;
// { name: string; age: number; }
\`\`\``,
  },
  'type-assertions-in-typescript': {
    en: `**Type assertions** tell TypeScript to treat a value as a specific type.

\`\`\`typescript
const input = document.getElementById('input') as HTMLInputElement;
input.value = 'Hello';

// Alternative syntax
const input2 = <HTMLInputElement>document.getElementById('input');
\`\`\`

Use when you know more than TypeScript about the type.`,
    ua: `**Твердження типів** вказують TypeScript трактувати значення як конкретний тип.

\`\`\`typescript
const input = document.getElementById('input') as HTMLInputElement;
input.value = 'Hello';

// Альтернативний синтаксис
const input2 = <HTMLInputElement>document.getElementById('input');
\`\`\`

Використовуйте, коли ви знаєте більше про тип, ніж TypeScript.`,
  },
  'what-is-typeguard-in-typescript': {
    en: `**Type Guard** is a runtime check that narrows the type in its scope.

\`\`\`typescript
function isError(x: unknown): x is Error {
  return x instanceof Error;
}

if (isError(result)) {
  console.log(result.message); // TypeScript knows it's Error
}
\`\`\``,
    ua: `**Type Guard** — це перевірка під час виконання, що звужує тип у своїй області.

\`\`\`typescript
function isError(x: unknown): x is Error {
  return x instanceof Error;
}

if (isError(result)) {
  console.log(result.message); // TypeScript знає, що це Error
}
\`\`\``,
  },
  'type-narrowing-in-typescript': {
    en: `**Type narrowing** is the process of refining types to more specific ones through control flow analysis.

\`\`\`typescript
function process(value: string | number) {
  if (typeof value === 'string') {
    value.toUpperCase(); // narrowed to string
  } else {
    value.toFixed(2); // narrowed to number
  }
}
\`\`\``,
    ua: `**Звуження типів** — це процес уточнення типів до більш конкретних через аналіз потоку.

\`\`\`typescript
function process(value: string | number) {
  if (typeof value === 'string') {
    value.toUpperCase(); // звужено до string
  } else {
    value.toFixed(2); // звужено до number
  }
}
\`\`\``,
  },
  'differences-between-type-and-interface-in-typescript': {
    en: `**interface:**
- Declaration merging
- \`extends\` for inheritance
- Better for objects and classes

**type:**
- Unions and intersections
- Cannot be re-opened
- Can alias primitives

\`\`\`typescript
interface User { name: string; }
interface User { age: number; } // Merged!

type ID = string | number; // Only type can do this
\`\`\``,
    ua: `**interface:**
- Злиття декларацій
- \`extends\` для наслідування
- Краще для обʼєктів і класів

**type:**
- Union та intersection
- Не можна повторно відкрити
- Може створювати псевдоніми примітивів

\`\`\`typescript
interface User { name: string; }
interface User { age: number; } // Злито!

type ID = string | number; // Лише type може це
\`\`\``,
  },
  'why-typescript-is-needed-pros-and-cons': {
    en: `**Why TypeScript:**
- Catch errors at compile time
- Better IDE support (autocomplete, refactoring)
- Self-documenting code
- Easier maintenance of large codebases

**Cons:** Learning curve, compilation step, extra configuration.

TypeScript compiles to JavaScript and works everywhere JS does.`,
    ua: `**Навіщо TypeScript:**
- Виявлення помилок під час компіляції
- Краща підтримка IDE (автодоповнення, рефакторинг)
- Самодокументований код
- Легше підтримувати великі кодові бази

**Мінуси:** Крива навчання, крок компіляції, додаткова конфігурація.

TypeScript компілюється в JavaScript і працює скрізь, де працює JS.`,
  },
  'what-is-union-in-typescript': {
    en: `**Union** allows a variable to hold values of multiple types using \`|\`.

\`\`\`typescript
type Result = string | number | null;
type Status = 'pending' | 'fulfilled' | 'rejected';

function format(value: string | number): string {
  return String(value);
}
\`\`\``,
    ua: `**Union** дозволяє змінній мати значення кількох типів через \`|\`.

\`\`\`typescript
type Result = string | number | null;
type Status = 'pending' | 'fulfilled' | 'rejected';

function format(value: string | number): string {
  return String(value);
}
\`\`\``,
  },
};

async function updateShortAnswers() {
  console.log('🚀 Starting to update short answers...\n')
  
  let updated = 0, notFound = 0
  
  for (const [slug, answers] of Object.entries(shortAnswers)) {
    try {
      const [question] = await db
        .select({ id: schema.questions.id })
        .from(schema.questions)
        .where(eq(schema.questions.slug, slug))
        .limit(1)
      
      if (!question) {
        console.log(`❌ Not found: ${slug}`)
        notFound++
        continue
      }
      
      await db
        .update(schema.questions)
        .set({ shortAnswerEn: answers.en, shortAnswerUa: answers.ua, updatedAt: new Date() })
        .where(eq(schema.questions.id, question.id))
      
      console.log(`✅ Updated: ${slug}`)
      updated++
    } catch (error) {
      console.error(`❌ Error: ${slug}`, error)
    }
  }
  
  console.log(`\n✅ Updated: ${updated} | ❌ Not found: ${notFound}`)
  await client.end()
  process.exit(0)
}

updateShortAnswers().catch(console.error)
