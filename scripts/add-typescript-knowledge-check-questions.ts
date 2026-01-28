/**
 * TypeScript Knowledge Check Questions
 * Short, concise answers for knowledge check feature
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import * as dotenv from 'dotenv'
import { eq } from 'drizzle-orm'
import { categories, questions } from '../src/core/database/schema/questions.schema'

const postgres = require('postgres')
dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
	throw new Error('DATABASE_URL is not set')
}

const client = postgres(connectionString.split('?')[0])
const db = drizzle(client)

const knowledgeCheckQuestions = [
  {
    slug: 'what-is-typescript-for-pros-cons',
    titleEn: 'What is TypeScript for, its pros and cons?',
    titleUa: 'Для чого потрібен TypeScript, його переваги та недоліки?',
    descriptionEn: 'TypeScript benefits and drawbacks',
    descriptionUa: 'Переваги та недоліки TypeScript',
    difficulty: 'JUNIOR' as const,
    order: 1,
    contentMarkdownEn: `**TypeScript** is a superset of JavaScript with static typing.

**Pros:**
- Error detection during development
- Improved autocomplete and refactoring
- Code documentation through types
- Scalability for large projects

**Cons:**
- Additional complexity
- Compilation time
- Learning curve
- Need to type third-party libraries

TypeScript compiles to regular JavaScript and can be used anywhere JS works.

**Read more:** [TypeScript Pros and Cons](/en/interview-questions/typescript-pros-cons)`,
    contentMarkdownUa: `**TypeScript** — це надбудова над JavaScript зі статичною типізацією.

**Переваги:**
- Виявлення помилок під час розробки
- Покращене автодоповнення та рефакторинг
- Документування коду через типи
- Масштабованість для великих проектів

**Недоліки:**
- Додаткова складність
- Час компіляції
- Крива навчання
- Потреба типізувати сторонні бібліотеки

TypeScript компілюється в звичайний JavaScript і може використовуватись всюди, де працює JS.

**Докладніше:** [TypeScript Переваги та Недоліки](/ua/interview-questions/typescript-pros-cons)`,
  },
  {
    slug: 'type-vs-interface-typescript',
    titleEn: 'What are the differences between type and interface in TypeScript?',
    titleUa: 'Які відмінності між type та interface в TypeScript?',
    descriptionEn: 'Key differences between type and interface',
    descriptionUa: 'Ключові відмінності між type та interface',
    difficulty: 'MIDDLE' as const,
    order: 2,
    contentMarkdownEn: `**Interface:**
- Used primarily for object shapes
- Can be extended with \`extends\`
- Supports declaration merging
- Better for OOP and classes

**Type:**
- More versatile (unions, intersections, primitives, tuples)
- Uses \`&\` for intersection
- Cannot be reopened to add properties
- Better for complex type operations

\`\`\`typescript
interface User {
  name: string;
}
interface User {
  age: number;  // Declaration merging ✓
}

type Status = 'active' | 'inactive';  // Union types ✓
\`\`\`

**Tip:** Use \`interface\` for objects, \`type\` for everything else.

**Read more:** [type vs interface](/en/interview-questions/type-vs-interface)`,
    contentMarkdownUa: `**Interface:**
- Використовується переважно для форм об'єктів
- Можна розширювати за допомогою \`extends\`
- Підтримує злиття декларацій
- Краще для ООП та класів

**Type:**
- Більш універсальний (об'єднання, перетини, примітиви, кортежі)
- Використовує \`&\` для перетину
- Не можна повторно відкрити для додавання властивостей
- Краще для складних операцій з типами

\`\`\`typescript
interface User {
  name: string;
}
interface User {
  age: number;  // Злиття декларацій ✓
}

type Status = 'active' | 'inactive';  // Union типи ✓
\`\`\`

**Порада:** Використовуйте \`interface\` для об'єктів, \`type\` для всього іншого.

**Докладніше:** [type проти interface](/ua/interview-questions/type-vs-interface)`,
  },
  {
    slug: 'what-are-generics-typescript',
    titleEn: 'What are Generics in TypeScript?',
    titleUa: 'Що таке Generics в TypeScript?',
    descriptionEn: 'Reusable type-safe components with Generics',
    descriptionUa: 'Багаторазові типобезпечні компоненти з Generics',
    difficulty: 'MIDDLE' as const,
    order: 3,
    contentMarkdownEn: `**Generics** allow creating reusable components that work with any type while maintaining type safety.

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

identity<string>("hello");  // string
identity<number>(42);       // number
\`\`\`

**Use cases:**
- Universal functions and classes
- Collections and data structures
- API responses with different data types

\`\`\`typescript
interface Response<T> {
  data: T;
  status: number;
}

const userResponse: Response<User> = {
  data: { id: 1, name: "John" },
  status: 200
};
\`\`\`

**Read more:** [Generics in TypeScript](/en/interview-questions/typescript-generics)`,
    contentMarkdownUa: `**Generics** дозволяють створювати багаторазові компоненти, які працюють з будь-яким типом, зберігаючи безпеку типів.

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

identity<string>("привіт");  // string
identity<number>(42);        // number
\`\`\`

**Випадки використання:**
- Універсальні функції та класи
- Колекції та структури даних
- API відповіді з різними типами даних

\`\`\`typescript
interface Response<T> {
  data: T;
  status: number;
}

const userResponse: Response<User> = {
  data: { id: 1, name: "Іван" },
  status: 200
};
\`\`\`

**Докладніше:** [Generics в TypeScript](/ua/interview-questions/typescript-generics)`,
  },
  {
    slug: 'union-types-typescript',
    titleEn: 'What are Union Types in TypeScript?',
    titleUa: 'Що таке Union Types в TypeScript?',
    descriptionEn: 'Multiple possible types with Union',
    descriptionUa: 'Кілька можливих типів з Union',
    difficulty: 'JUNIOR' as const,
    order: 4,
    contentMarkdownEn: `**Union Types** allow a value to be one of several types using the \`|\` operator.

\`\`\`typescript
let value: string | number;

value = "hello";  // ✓
value = 42;       // ✓
value = true;     // ✗ Error
\`\`\`

**Literal Union Types:**

\`\`\`typescript
type Status = "pending" | "approved" | "rejected";

function setStatus(status: Status) {
  // Only these 3 values allowed
}
\`\`\`

**Type narrowing:**

\`\`\`typescript
function print(id: number | string) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}
\`\`\`

**Read more:** [Union Types](/en/interview-questions/typescript-union)`,
    contentMarkdownUa: `**Union Types** дозволяють значенню бути одним з кількох типів за допомогою оператора \`|\`.

\`\`\`typescript
let value: string | number;

value = "привіт";  // ✓
value = 42;        // ✓
value = true;      // ✗ Помилка
\`\`\`

**Літеральні Union Types:**

\`\`\`typescript
type Status = "pending" | "approved" | "rejected";

function setStatus(status: Status) {
  // Дозволені тільки ці 3 значення
}
\`\`\`

**Звуження типів:**

\`\`\`typescript
function print(id: number | string) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}
\`\`\`

**Докладніше:** [Union Типи](/ua/interview-questions/typescript-union)`,
  },
  {
    slug: 'any-vs-unknown-typescript',
    titleEn: 'What are the differences between any and unknown in TypeScript?',
    titleUa: 'Які відмінності між any та unknown в TypeScript?',
    descriptionEn: 'Type safety with any vs unknown',
    descriptionUa: 'Безпека типів з any проти unknown',
    difficulty: 'MIDDLE' as const,
    order: 5,
    contentMarkdownEn: `**any** disables type checking - anything is allowed (unsafe).

**unknown** is type-safe - must check type before use.

\`\`\`typescript
let anyValue: any;
anyValue.foo();  // No error, but may crash ✗

let unknownValue: unknown;
unknownValue.foo();  // Error: must check type first ✓

if (typeof unknownValue === "string") {
  unknownValue.toUpperCase();  // OK ✓
}
\`\`\`

**When to use:**
- **any:** Legacy code, quick prototypes (avoid if possible)
- **unknown:** External data, API responses, user input

**Tip:** Prefer \`unknown\` over \`any\` for type safety.

**Read more:** [any vs unknown](/en/interview-questions/any-vs-unknown)`,
    contentMarkdownUa: `**any** вимикає перевірку типів - дозволено все (небезпечно).

**unknown** є типобезпечним - потрібно перевірити тип перед використанням.

\`\`\`typescript
let anyValue: any;
anyValue.foo();  // Без помилки, але може crashнути ✗

let unknownValue: unknown;
unknownValue.foo();  // Помилка: спочатку перевірте тип ✓

if (typeof unknownValue === "string") {
  unknownValue.toUpperCase();  // OK ✓
}
\`\`\`

**Коли використовувати:**
- **any:** Легасі код, швидкі прототипи (уникайте якщо можливо)
- **unknown:** Зовнішні дані, API відповіді, введення користувача

**Порада:** Віддавайте перевагу \`unknown\` перед \`any\` для безпеки типів.

**Докладніше:** [any проти unknown](/ua/interview-questions/any-vs-unknown)`,
  },
  {
    slug: 'type-guard-typescript',
    titleEn: 'What is Type Guard in TypeScript?',
    titleUa: 'Що таке Type Guard в TypeScript?',
    descriptionEn: 'Runtime type checking with Type Guards',
    descriptionUa: 'Перевірка типів під час виконання з Type Guards',
    difficulty: 'MIDDLE' as const,
    order: 6,
    contentMarkdownEn: `**Type Guard** is a technique to narrow down types within conditional blocks.

**typeof guard:**

\`\`\`typescript
function print(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase();  // string methods ✓
  }
  return value.toFixed(2);  // number methods ✓
}
\`\`\`

**instanceof guard:**

\`\`\`typescript
if (error instanceof Error) {
  console.log(error.message);
}
\`\`\`

**Custom type guard:**

\`\`\`typescript
interface Cat { meow: () => void; }
interface Dog { bark: () => void; }

function isCat(pet: Cat | Dog): pet is Cat {
  return (pet as Cat).meow !== undefined;
}
\`\`\`

**Read more:** [Type Guards](/en/interview-questions/type-guards)`,
    contentMarkdownUa: `**Type Guard** — це техніка звуження типів в умовних блоках.

**typeof guard:**

\`\`\`typescript
function print(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase();  // методи string ✓
  }
  return value.toFixed(2);  // методи number ✓
}
\`\`\`

**instanceof guard:**

\`\`\`typescript
if (error instanceof Error) {
  console.log(error.message);
}
\`\`\`

**Власний type guard:**

\`\`\`typescript
interface Cat { meow: () => void; }
interface Dog { bark: () => void; }

function isCat(pet: Cat | Dog): pet is Cat {
  return (pet as Cat).meow !== undefined;
}
\`\`\`

**Докладніше:** [Type Guards](/ua/interview-questions/type-guards)`,
  },
  {
    slug: 'never-type-typescript',
    titleEn: 'What is the never type in TypeScript?',
    titleUa: 'Що таке тип never в TypeScript?',
    descriptionEn: 'The never type for impossible values',
    descriptionUa: 'Тип never для неможливих значень',
    difficulty: 'MIDDLE' as const,
    order: 7,
    contentMarkdownEn: `**never** represents values that never occur.

**Use cases:**

**1. Functions that never return:**

\`\`\`typescript
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
\`\`\`

**2. Exhaustive type checking:**

\`\`\`typescript
type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "square": return shape.side ** 2;
    default:
      const _exhaustive: never = shape;  // Compile error if new shape added
      return _exhaustive;
  }
}
\`\`\`

**never vs void:**
- \`void\`: function returns but no value
- \`never\`: function never returns`,
    contentMarkdownUa: `**never** представляє значення, які ніколи не виникають.

**Випадки використання:**

**1. Функції, які ніколи не повертаються:**

\`\`\`typescript
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
\`\`\`

**2. Вичерпна перевірка типів:**

\`\`\`typescript
type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "square": return shape.side ** 2;
    default:
      const _exhaustive: never = shape;  // Помилка компіляції якщо додано нову фігуру
      return _exhaustive;
  }
}
\`\`\`

**never проти void:**
- \`void\`: функція повертається але без значення
- \`never\`: функція ніколи не повертається`,
  },
  {
    slug: 'infer-keyword-typescript',
    titleEn: 'What is the infer keyword in TypeScript?',
    titleUa: 'Що таке ключове слово infer в TypeScript?',
    descriptionEn: 'Type inference with infer keyword',
    descriptionUa: 'Виведення типів з ключовим словом infer',
    difficulty: 'SENIOR' as const,
    order: 8,
    contentMarkdownEn: `**infer** extracts types within conditional type expressions.

**Extract return type:**

\`\`\`typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { name: "John", age: 30 };
}

type User = ReturnType<typeof getUser>;  // { name: string; age: number }
\`\`\`

**Extract array element type:**

\`\`\`typescript
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>;  // string
type Num = Flatten<number>;    // number
\`\`\`

**Extract Promise value:**

\`\`\`typescript
type Unpromise<T> = T extends Promise<infer U> ? U : T;

type Data = Unpromise<Promise<string>>;  // string
\`\`\`

**Read more:** [Advanced Types](/en/interview-questions/advanced-types)`,
    contentMarkdownUa: `**infer** витягує типи всередині умовних типових виразів.

**Витягнути тип повернення:**

\`\`\`typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { name: "Іван", age: 30 };
}

type User = ReturnType<typeof getUser>;  // { name: string; age: number }
\`\`\`

**Витягнути тип елемента масиву:**

\`\`\`typescript
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>;  // string
type Num = Flatten<number>;    // number
\`\`\`

**Витягнути значення Promise:**

\`\`\`typescript
type Unpromise<T> = T extends Promise<infer U> ? U : T;

type Data = Unpromise<Promise<string>>;  // string
\`\`\`

**Докладніше:** [Розширені Типи](/ua/interview-questions/advanced-types)`,
  },
  {
    slug: 'keyof-typeof-typescript',
    titleEn: 'How do keyof and typeof work in TypeScript?',
    titleUa: 'Як працюють keyof та typeof в TypeScript?',
    descriptionEn: 'Type operators keyof and typeof',
    descriptionUa: 'Оператори типів keyof та typeof',
    difficulty: 'MIDDLE' as const,
    order: 9,
    contentMarkdownEn: `**keyof** gets all keys of a type as a union.

**typeof** gets the type of a value.

\`\`\`typescript
interface User {
  name: string;
  age: number;
  email: string;
}

type UserKeys = keyof User;  // "name" | "age" | "email"

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { name: "John", age: 30, email: "john@example.com" };
const name = getProperty(user, "name");  // string
\`\`\`

**typeof with values:**

\`\`\`typescript
const config = {
  api: "https://api.com",
  timeout: 3000
};

type Config = typeof config;  // { api: string; timeout: number }
\`\`\`

**Combined usage:**

\`\`\`typescript
type ConfigKeys = keyof typeof config;  // "api" | "timeout"
\`\`\``,
    contentMarkdownUa: `**keyof** отримує всі ключі типу як об'єднання.

**typeof** отримує тип значення.

\`\`\`typescript
interface User {
  name: string;
  age: number;
  email: string;
}

type UserKeys = keyof User;  // "name" | "age" | "email"

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { name: "Іван", age: 30, email: "ivan@example.com" };
const name = getProperty(user, "name");  // string
\`\`\`

**typeof зі значеннями:**

\`\`\`typescript
const config = {
  api: "https://api.com",
  timeout: 3000
};

type Config = typeof config;  // { api: string; timeout: number }
\`\`\`

**Комбіноване використання:**

\`\`\`typescript
type ConfigKeys = keyof typeof config;  // "api" | "timeout"
\`\`\``,
  },
  {
    slug: 'record-utility-type-typescript',
    titleEn: 'What is the Record Utility Type in TypeScript?',
    titleUa: 'Що таке Utility Type Record в TypeScript?',
    descriptionEn: 'Object type mapping with Record',
    descriptionUa: 'Мапування типів об\'єктів з Record',
    difficulty: 'MIDDLE' as const,
    order: 10,
    contentMarkdownEn: `**Record<Keys, Type>** creates an object type with specific keys and value type.

**Basic usage:**

\`\`\`typescript
type Role = "admin" | "user" | "guest";

const permissions: Record<Role, string[]> = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"]
};
\`\`\`

**vs Index Signature:**

\`\`\`typescript
// Index signature - any string key
type Dict = { [key: string]: number };

// Record - specific keys only
type Scores = Record<"math" | "physics" | "chemistry", number>;

const scores: Scores = {
  math: 95,
  physics: 88,
  chemistry: 92
};
\`\`\`

**Dynamic object creation:**

\`\`\`typescript
function arrayToRecord<T extends string>(arr: T[]): Record<T, boolean> {
  return arr.reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<T, boolean>);
}
\`\`\``,
    contentMarkdownUa: `**Record<Keys, Type>** створює тип об'єкта з конкретними ключами та типом значення.

**Базове використання:**

\`\`\`typescript
type Role = "admin" | "user" | "guest";

const permissions: Record<Role, string[]> = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"]
};
\`\`\`

**проти Index Signature:**

\`\`\`typescript
// Index signature - будь-який строковий ключ
type Dict = { [key: string]: number };

// Record - тільки конкретні ключі
type Scores = Record<"math" | "physics" | "chemistry", number>;

const scores: Scores = {
  math: 95,
  physics: 88,
  chemistry: 92
};
\`\`\`

**Динамічне створення об'єктів:**

\`\`\`typescript
function arrayToRecord<T extends string>(arr: T[]): Record<T, boolean> {
  return arr.reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<T, boolean>);
}
\`\`\``,
  },
];

async function addQuestions() {
  try {
    console.log('🚀 Adding TypeScript Knowledge Check Questions\n')
    
    const [category] = await db.select().from(categories)
      .where(eq(categories.slug, 'typescript')).limit(1)
    
    if (!category) {
      console.error('❌ TypeScript category not found. Please run seed first.')
      return
    }
    
    console.log(`✓ Found category: ${category.nameEn}\n`)
    
    let added = 0
    let updated = 0
    
    for (const q of knowledgeCheckQuestions) {
      console.log(`📝 Processing: ${q.titleEn}`)
      
      const [existing] = await db.select().from(questions)
        .where(eq(questions.slug, q.slug)).limit(1)
      
      if (existing) {
        await db.update(questions)
          .set({
            ...q,
            categoryId: category.id,
            updatedAt: new Date()
          })
          .where(eq(questions.id, existing.id))
        console.log(`  ✅ Updated\n`)
        updated++
      } else {
        await db.insert(questions).values({
          ...q,
          categoryId: category.id
        })
        console.log(`  ✅ Added\n`)
        added++
      }
    }
    
    console.log(`🎉 Complete! Added ${added}, Updated ${updated} questions\n`)
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.end()
  }
}

addQuestions()
  .then(() => {
    console.log('✅ Script finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
