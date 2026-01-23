/**
 * TypeScript Batch 1: Intro, Decorators, type vs interface, Generics, Union
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
  {
    slug: 'typescript-pros-cons',
    titleEn: 'TypeScript Pros and Cons',
    titleUa: 'TypeScript Переваги та Недоліки',
    descriptionEn: 'Why TypeScript is needed, its advantages and disadvantages',
    descriptionUa: 'Навіщо потрібен TypeScript, його переваги та недоліки',
    difficulty: 'EASY' as const,
    order: 1,
    contentMarkdownEn: `### What is TypeScript?

**TypeScript** is a strictly typed language based on JS. It compiles to regular **JavaScript**, which allows using it in any modern browsers, as well as on the server using **Node.js**.

### Why TypeScript?

1. **Static typing**: TypeScript adds data typing, which helps identify errors in code in advance
2. **Support for modern JavaScript standards**: Supports all ECMAScript innovations
3. **Development tools**: Rich IDE support with autocomplete, hints and code navigation
4. **Support for OOP**: Supports object-oriented programming with classes and interfaces

### TypeScript Pros

1. **Better code quality**: Static typing helps avoid many errors at compile time
2. **OOP and interfaces support**: Easier to work on large and complex projects
3. **Autocomplete and refactoring**: IDEs provide improved autocomplete and refactoring
4. **JavaScript compatibility**: Any JavaScript code can be easily converted to TypeScript
5. **Code clarity and maintainability**: Types make code more readable and self-documenting
6. **Large community and support**: Many popular libraries have official TypeScript types

### TypeScript Cons

1. **Additional complexity**: Requires learning typing and compilation features
2. **More setup time**: Requires compiler and configuration file setup
3. **Additional compilation**: Needs to be compiled to JavaScript, adding a development step
4. **Not always necessary for small projects**: May be excessive for small work volumes

### When to use TypeScript?

- **Large projects**: Ideal for large applications where maintainability and security are important
- **Team work**: Helps improve communication through explicit data types
- **Migrating from JavaScript**: Can significantly improve code quality

> **Recommendation:** If you're working on a large project or want to improve code quality, TypeScript is an excellent choice. If the project is small and you need to start development quickly, JavaScript may be more suitable.`,
    contentMarkdownUa: `### Що Таке TypeScript?

**TypeScript** — це строго типізована мова на основі JS. Вона компілюється в звичайний **JavaScript**, що дозволяє використовувати її в будь-яких сучасних браузерах, а також на сервері за допомогою **Node.js**.

### Навіщо TypeScript?

1. **Статична типізація**: TypeScript додає типізацію даних, що допомагає виявляти помилки в коді заздалегідь
2. **Підтримка сучасних стандартів JavaScript**: Підтримує всі інновації ECMAScript
3. **Інструменти розробки**: Багата підтримка IDE з автодоповненням, підказками та навігацією по коду
4. **Підтримка ООП**: Підтримує об'єктно-орієнтоване програмування з класами та інтерфейсами

### Переваги TypeScript

1. **Краща якість коду**: Статична типізація допомагає уникнути багатьох помилок під час компіляції
2. **Підтримка ООП та інтерфейсів**: Легше працювати над великими та складними проектами
3. **Автодоповнення та рефакторинг**: IDE надають покращене автодоповнення та рефакторинг
4. **Сумісність з JavaScript**: Будь-який JavaScript код може бути легко конвертований у TypeScript
5. **Чіткість та підтримка коду**: Типи роблять код більш читабельним та самодокументованим
6. **Велика спільнота та підтримка**: Багато популярних бібліотек мають офіційні типи TypeScript

### Недоліки TypeScript

1. **Додаткова складність**: Потребує вивчення типізації та функцій компіляції
2. **Більше часу налаштування**: Потребує налаштування компілятора та файлу конфігурації
3. **Додаткова компіляція**: Потрібно компілювати в JavaScript, додаючи крок розробки
4. **Не завжди необхідний для малих проектів**: Може бути надлишковим для невеликих обсягів роботи

### Коли Використовувати TypeScript?

- **Великі проекти**: Ідеально для великих застосунків, де важлива підтримуваність та безпека
- **Командна робота**: Допомагає покращити комунікацію через явні типи даних
- **Міграція з JavaScript**: Може значно покращити якість коду

> **Рекомендація:** Якщо ви працюєте над великим проектом або хочете покращити якість коду, TypeScript - відмінний вибір. Якщо проект невеликий і потрібно швидко почати розробку, JavaScript може бути більш підходящим.`,
  },
  {
    slug: 'typescript-decorators',
    titleEn: 'Decorators in TypeScript',
    titleUa: 'Декоратори в TypeScript',
    descriptionEn: 'Learn about TypeScript decorators for adding behavior to classes',
    descriptionUa: 'Дізнайтесь про декоратори TypeScript для додавання поведінки до класів',
    difficulty: 'HARD' as const,
    order: 2,
    contentMarkdownEn: `**Decorators** are **special functions** that can be applied to **classes**, **methods**, **properties** or **parameters** to **add or modify behavior** at runtime or compile time.

To work with decorators you need to enable flags:

\`\`\`json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
\`\`\`

## Where can decorators be used?

- Classes
- Methods
- Properties
- Parameters
- Accessors (get/set)

## Example: Class decorator

\`\`\`typescript
function Logger(constructor: Function) {
  console.log(\`Class created: \${constructor.name}\`);
}

@Logger
class User {
  constructor(public name: string) {}
}
\`\`\`

The \`Logger\` decorator will be called when defining the \`User\` class.

## Example: Method decorator

\`\`\`typescript
function LogMethod(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    console.log(\`Method \${propertyKey} called\`, args);
    return original.apply(this, args);
  };
}

class MathService {
  @LogMethod
  sum(a: number, b: number) {
    return a + b;
  }
}
\`\`\`

## Example: Property decorator

\`\`\`typescript
function Readonly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false,
  });
}

class Config {
  @Readonly
  version = "1.0";
}
\`\`\`

> Decorators are widely used in frameworks like Angular and NestJS.`,
    contentMarkdownUa: `**Декоратори** — це **спеціальні функції**, які можуть бути застосовані до **класів**, **методів**, **властивостей** або **параметрів** для **додавання або зміни поведінки** під час виконання або компіляції.

Для роботи з декораторами потрібно увімкнути прапорці:

\`\`\`json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
\`\`\`

## Де можна використовувати декоратори?

- Класи
- Методи
- Властивості
- Параметри
- Аксесори (get/set)

## Приклад: Декоратор класу

\`\`\`typescript
function Logger(constructor: Function) {
  console.log(\`Клас створено: \${constructor.name}\`);
}

@Logger
class User {
  constructor(public name: string) {}
}
\`\`\`

Декоратор \`Logger\` буде викликаний при визначенні класу \`User\`.

## Приклад: Декоратор методу

\`\`\`typescript
function LogMethod(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    console.log(\`Метод \${propertyKey} викликано\`, args);
    return original.apply(this, args);
  };
}

class MathService {
  @LogMethod
  sum(a: number, b: number) {
    return a + b;
  }
}
\`\`\`

## Приклад: Декоратор властивості

\`\`\`typescript
function Readonly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false,
  });
}

class Config {
  @Readonly
  version = "1.0";
}
\`\`\`

> Декоратори широко використовуються у фреймворках як Angular та NestJS.`,
  },
  {
    slug: 'type-vs-interface',
    titleEn: 'type vs interface',
    titleUa: 'type проти interface',
    descriptionEn: 'Key differences between type and interface in TypeScript',
    descriptionUa: 'Ключові різниці між type та interface в TypeScript',
    difficulty: 'MEDIUM' as const,
    order: 3,
    contentMarkdownEn: `In **TypeScript** there are two ways to describe types: **type** and **interface**.

### Interface

- Used to describe the structure of objects and classes
- Can extend other interfaces using \`extends\`
- Supports declaration merging

\`\`\`typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  position: string;
}

const employee: Employee = {
  name: "John",
  age: 30,
  position: "Developer"
};
\`\`\`

### Type

- More universal, can describe objects, primitives, unions, intersections
- Uses \`&\` for intersection instead of \`extends\`

\`\`\`typescript
type Person = {
  name: string;
  age: number;
};

type Employee = Person & {
  position: string;
};

const employee: Employee = {
  name: "John",
  age: 30,
  position: "Developer"
};
\`\`\`

### When to use interface or type?

- \`interface\` should be used when working with objects, especially if you need to extend or implement in classes
- \`type\` should be used for universal types such as unions, intersections, tuples and primitives

> **Tip:** For object shapes, prefer \`interface\`. For complex type operations, use \`type\`.`,
    contentMarkdownUa: `У **TypeScript** є два способи описати типи: **type** та **interface**.

### Interface

- Використовується для опису структури об'єктів та класів
- Може розширювати інші інтерфейси за допомогою \`extends\`
- Підтримує злиття декларацій

\`\`\`typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  position: string;
}

const employee: Employee = {
  name: "Іван",
  age: 30,
  position: "Розробник"
};
\`\`\`

### Type

- Більш універсальний, може описувати об'єкти, примітиви, об'єднання, перетини
- Використовує \`&\` для перетину замість \`extends\`

\`\`\`typescript
type Person = {
  name: string;
  age: number;
};

type Employee = Person & {
  position: string;
};

const employee: Employee = {
  name: "Іван",
  age: 30,
  position: "Розробник"
};
\`\`\`

### Коли використовувати interface або type?

- \`interface\` слід використовувати при роботі з об'єктами, особливо якщо потрібно розширювати або реалізовувати в класах
- \`type\` слід використовувати для універсальних типів, таких як об'єднання, перетини, кортежі та примітиви

> **Порада:** Для форм об'єктів віддавайте перевагу \`interface\`. Для складних операцій з типами використовуйте \`type\`.`,
  },
  {
    slug: 'typescript-generics',
    titleEn: 'Generics in TypeScript',
    titleUa: 'Generics в TypeScript',
    descriptionEn: 'Create universal components with type safety using Generics',
    descriptionUa: 'Створюйте універсальні компоненти з безпекою типів за допомогою Generics',
    difficulty: 'MEDIUM' as const,
    order: 4,
    contentMarkdownEn: `**Generic** in **TypeScript** is the ability to create **universal components** and **functions** that can work with any data types while maintaining **type safety**.

### Why Generics?

1. **Flexibility**: Create universal functions and classes for various data types
2. **Code reuse**: Write code once, use for different types
3. **Type safety**: Type checking at compile time

### Generics in functions

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("Hello");
let output2 = identity<number>(100);
\`\`\`

### Generics with arrays

\`\`\`typescript
function logArray<T>(arr: T[]): void {
  arr.forEach(item => console.log(item));
}

logArray([1, 2, 3]);  // number[]
logArray(["a", "b", "c"]);  // string[]
\`\`\`

### Generics in interfaces

\`\`\`typescript
interface Box<T> {
  value: T;
}

let box1: Box<string> = { value: "Hello" };
let box2: Box<number> = { value: 100 };
\`\`\`

### Generic constraints

\`\`\`typescript
function logLength<T extends { length: number }>(arg: T): void {
  console.log(arg.length);
}

logLength("Hello");  // 5
logLength([1, 2, 3]);  // 3
\`\`\`

> **Tip:** Generics are essential for creating reusable, type-safe code in TypeScript.`,
    contentMarkdownUa: `**Generic** в **TypeScript** — це можливість створювати **універсальні компоненти** та **функції**, які можуть працювати з будь-якими типами даних, зберігаючи **безпеку типів**.

### Навіщо Generics?

1. **Гнучкість**: Створюйте універсальні функції та класи для різних типів даних
2. **Повторне використання коду**: Напишіть код один раз, використовуйте для різних типів
3. **Безпека типів**: Перевірка типів під час компіляції

### Generics у функціях

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("Привіт");
let output2 = identity<number>(100);
\`\`\`

### Generics з масивами

\`\`\`typescript
function logArray<T>(arr: T[]): void {
  arr.forEach(item => console.log(item));
}

logArray([1, 2, 3]);  // number[]
logArray(["а", "б", "в"]);  // string[]
\`\`\`

### Generics в інтерфейсах

\`\`\`typescript
interface Box<T> {
  value: T;
}

let box1: Box<string> = { value: "Привіт" };
let box2: Box<number> = { value: 100 };
\`\`\`

### Обмеження Generic

\`\`\`typescript
function logLength<T extends { length: number }>(arg: T): void {
  console.log(arg.length);
}

logLength("Привіт");  // 6
logLength([1, 2, 3]);  // 3
\`\`\`

> **Порада:** Generics є основою для створення багаторазового, типобезпечного коду в TypeScript.`,
  },
  {
    slug: 'typescript-union',
    titleEn: 'Union Types',
    titleUa: 'Union Типи',
    descriptionEn: 'Learn about Union types for flexible typing',
    descriptionUa: 'Дізнайтесь про Union типи для гнучкої типізації',
    difficulty: 'EASY' as const,
    order: 5,
    contentMarkdownEn: `**Union** in **TypeScript** allows creating types that can be one of several types. This means a variable or function parameter can have multiple possible data types.

### Union Syntax

Union types are created using the **\`|\`** (or) operator.

\`\`\`typescript
let value: string | number;

value = "Hello";  // Valid
value = 42;       // Valid
value = true;     // Error, type is neither string nor number
\`\`\`

### Working with Union Types

\`\`\`typescript
function printId(id: number | string) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}

printId(101);     // "101.00"
printId("abc");   // "ABC"
\`\`\`

### Union with Literal Types

\`\`\`typescript
type Status = "pending" | "approved" | "rejected";

function setStatus(status: Status) {
  console.log(\`Status: \${status}\`);
}

setStatus("approved");  // OK
// setStatus("invalid");  // Error
\`\`\`

> **Recommendation:** Use **Union** types to create flexible and safe data types when a variable or function can work with multiple types.`,
    contentMarkdownUa: `**Union** в **TypeScript** дозволяє створювати типи, які можуть бути одним з кількох типів. Це означає, що змінна або параметр функції може мати кілька можливих типів даних.

### Синтаксис Union

Union типи створюються за допомогою оператора **\`|\`** (або).

\`\`\`typescript
let value: string | number;

value = "Привіт";  // Вірно
value = 42;        // Вірно
value = true;      // Помилка, тип не є ні string, ні number
\`\`\`

### Робота з Union Типами

\`\`\`typescript
function printId(id: number | string) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}

printId(101);      // "101.00"
printId("абв");    // "АБВ"
\`\`\`

### Union з Літеральними Типами

\`\`\`typescript
type Status = "pending" | "approved" | "rejected";

function setStatus(status: Status) {
  console.log(\`Статус: \${status}\`);
}

setStatus("approved");   // OK
// setStatus("invalid");  // Помилка
\`\`\`

> **Рекомендація:** Використовуйте **Union** типи для створення гнучких та безпечних типів даних, коли змінна або функція можуть працювати з кількома типами.`,
  },
];

async function addQuestions() {
  try {
    console.log('🚀 TypeScript Batch 1: Basics\n')
    const [category] = await db.select().from(schema.categories)
      .where(eq(schema.categories.slug, 'typescript')).limit(1)
    
    if (!category) throw new Error('TypeScript category not found')
    console.log(`✓ Found category: ${category.nameEn}\n`)
    
    for (const q of questions) {
      console.log(`📝 Processing: ${q.titleEn}`)
      const [existing] = await db.select().from(schema.questions)
        .where(eq(schema.questions.slug, q.slug)).limit(1)
      
      if (existing) {
        await db.update(schema.questions)
          .set({...q, categoryId: category.id, updatedAt: new Date()})
          .where(eq(schema.questions.id, existing.id))
        console.log(`✅ Updated\n`)
      } else {
        await db.insert(schema.questions).values({...q, categoryId: category.id})
        console.log(`✅ Added\n`)
      }
    }
    console.log('🎉 TypeScript Batch 1 Complete! (5/28)\n')
  } finally {
    await client.end()
  }
}

addQuestions().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })
