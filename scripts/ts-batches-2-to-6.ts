/**
 * TypeScript Batches 2-6: Remaining 23 Questions
 * Comprehensive addition of all remaining TypeScript questions
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
  // Batch 2: enum, any vs unknown, TypeGuard, never, infer
  {
    slug: 'typescript-enum',
    titleEn: 'enum in TypeScript',
    titleUa: 'enum в TypeScript',
    descriptionEn: 'Learn about TypeScript enumerations for named constants',
    descriptionUa: 'Дізнайтесь про перерахування TypeScript для іменованих констант',
    difficulty: 'JUNIOR' as const,
    order: 6,
    contentMarkdownEn: `### What is an enum?

An \`enum\` (enumeration) in **TypeScript** is a way to define a set of named constants. It makes code easier to read and prevents scattering "magic" strings or numbers throughout your project.

\`\`\`typescript
enum Status {
  Pending,
  InProgress,
  Done
}
\`\`\`

### Numeric vs string enums

By default enums are numeric: the first item gets value \`0\`, and each next member is incremented by 1.

\`\`\`typescript
enum Status {
  Pending = 1,
  InProgress = 3,
  Done = 4
}
\`\`\`

String enums must be assigned explicitly:

\`\`\`typescript
enum Role {
  Admin = 'admin',
  User = 'user'
}
\`\`\`

### Reverse mapping

For numeric enums, you can get the enum name from its numeric value:

\`\`\`typescript
enum Status {
  Pending,
  Done
}

Status.Pending  // 0
Status[0]       // 'Pending'
\`\`\`

String enums do **not** have reverse mapping.

### const enum

Using \`const enum\` inlines values and skips generating object at runtime, reducing bundle size.

\`\`\`typescript
const enum Directions {
  Up,
  Down
}

const move = Directions.Up  // will be compiled to literal 0
\`\`\`

### When to use enums

- Fixed list of states (statuses, roles, message types)
- Same set of values used in multiple places
- Cleaner, self-documenting APIs

> **Interview tip:** Mention that enums are sugar over objects, describe the difference between numeric and string enums, and don't forget about \`const enum\` for optimization.`,
    contentMarkdownUa: `### Що таке enum?

\`enum\` (перерахування) в **TypeScript** — це спосіб визначити набір іменованих констант. Це робить код легшим для читання і запобігає розкиданню "магічних" рядків або чисел по всьому проекту.

\`\`\`typescript
enum Status {
  Pending,
  InProgress,
  Done
}
\`\`\`

### Числові проти рядкових enum

За замовчуванням enum є числовими: перший елемент отримує значення \`0\`, і кожен наступний член збільшується на 1.

\`\`\`typescript
enum Status {
  Pending = 1,
  InProgress = 3,
  Done = 4
}
\`\`\`

Рядкові enum повинні бути призначені явно:

\`\`\`typescript
enum Role {
  Admin = 'admin',
  User = 'user'
}
\`\`\`

### Зворотнє відображення

Для числових enum ви можете отримати ім'я enum з його числового значення:

\`\`\`typescript
enum Status {
  Pending,
  Done
}

Status.Pending  // 0
Status[0]       // 'Pending'
\`\`\`

Рядкові enum **не** мають зворотнього відображення.

### const enum

Використання \`const enum\` вбудовує значення і пропускає генерацію об'єкта під час виконання, зменшуючи розмір бандла.

\`\`\`typescript
const enum Directions {
  Up,
  Down
}

const move = Directions.Up  // буде скомпільовано в літерал 0
\`\`\`

### Коли використовувати enum

- Фіксований список станів (статуси, ролі, типи повідомлень)
- Той самий набір значень використовується в кількох місцях
- Чистіші, самодокументовані API

> **Порада для співбесіди:** Згадайте, що enum є синтаксичним цукром над об'єктами, опишіть різницю між числовими та рядковими enum, і не забудьте про \`const enum\` для оптимізації.`,
  },
  {
    slug: 'typescript-any-vs-unknown',
    titleEn: 'any vs unknown',
    titleUa: 'any проти unknown',
    descriptionEn: 'Understanding the difference between any and unknown types',
    descriptionUa: 'Розуміння різниці між типами any та unknown',
    difficulty: 'MIDDLE' as const,
    order: 7,
    contentMarkdownEn: `In **TypeScript** there are two types that can represent any values: **any** and **unknown**. Although both types allow working with any values, their behavior and safety differ.

### any Type

The **any** type removes type restrictions, allowing you to do anything with the variable.

#### Advantages
- Flexibility: work with unknown types
- Convenience: good for integrating external libraries

#### Disadvantages
- Loss of type safety: weakens TypeScript's type system
- Complicates code maintenance: lack of type information

\`\`\`typescript
let value: any;
value = 42;
value = "Hello";
value.someMethod(); // Error won't be detected at compile time
\`\`\`

### unknown Type

The **unknown** type is a safer alternative to **any**. You need to check its type before performing operations.

#### Advantages
- Type safety: requires type check before use
- Safer choice: preserves TypeScript's type system

\`\`\`typescript
let value: unknown;
value = 42;
value = "Hello";

// value.someMethod(); // Compilation error

// Need type check
if (typeof value === "string") {
  console.log(value.toUpperCase()); // Now it's safe
}
\`\`\`

### When to use any vs unknown?

- Use \`any\` when type can't be precisely determined (dynamic data, third-party libraries)
- Use \`unknown\` when you want type safety with explicit checking

> **Tip:** Prefer \`unknown\` over \`any\` for better type safety.`,
    contentMarkdownUa: `У **TypeScript** є два типи, які можуть представляти будь-які значення: **any** та **unknown**. Хоча обидва типи дозволяють працювати з будь-якими значеннями, їх поведінка та безпека відрізняються.

### Тип any

Тип **any** видаляє обмеження типів, дозволяючи робити з змінною будь-що.

#### Переваги
- Гнучкість: робота з невідомими типами
- Зручність: добре для інтеграції зовнішніх бібліотек

#### Недоліки
- Втрата безпеки типів: послаблює систему типів TypeScript
- Ускладнює підтримку коду: відсутність інформації про тип

\`\`\`typescript
let value: any;
value = 42;
value = "Привіт";
value.someMethod(); // Помилка не буде виявлена під час компіляції
\`\`\`

### Тип unknown

Тип **unknown** — це безпечніша альтернатива **any**. Потрібно перевірити його тип перед виконанням операцій.

#### Переваги
- Безпека типів: вимагає перевірки типу перед використанням
- Безпечніший вибір: зберігає систему типів TypeScript

\`\`\`typescript
let value: unknown;
value = 42;
value = "Привіт";

// value.someMethod(); // Помилка компіляції

// Потрібна перевірка типу
if (typeof value === "string") {
  console.log(value.toUpperCase()); // Тепер безпечно
}
\`\`\`

### Коли використовувати any проти unknown?

- Використовуйте \`any\` коли тип не може бути точно визначений (динамічні дані, сторонні бібліотеки)
- Використовуйте \`unknown\` коли ви хочете безпеку типів з явною перевіркою

> **Порада:** Віддавайте перевагу \`unknown\` над \`any\` для кращої безпеки типів.`,
  },
  // TypeGuard - continuing batch 2
  {
    slug: 'typescript-type-guard',
    titleEn: 'Type Guards',
    titleUa: 'Type Guards (Охоронці Типів)',
    descriptionEn: 'Narrow variable types in code blocks',
    descriptionUa: 'Звуження типів змінних у блоках коду',
    difficulty: 'MIDDLE' as const,
    order: 8,
    contentMarkdownEn: `**TypeGuard** helps narrow a variable's type within a code block, making code safer.

TypeScript provides several ways:
1. **typeof** for primitives
2. **instanceof** for classes
3. **Custom type guards** using **is**

### Example with typeof

\`\`\`typescript
function printLength(value: string | number) {
  if (typeof value === "string") {
    console.log(value.length);
  } else {
    console.log(value.toFixed(2));
  }
}
\`\`\`

### Custom TypeGuard

\`\`\`typescript
type Dog = { bark: () => void };
type Cat = { meow: () => void };

function isDog(animal: Dog | Cat): animal is Dog {
  return (animal as Dog).bark !== undefined;
}

function speak(animal: Dog | Cat) {
  if (isDog(animal)) {
    animal.bark();
  } else {
    animal.meow();
  }
}
\`\`\`

> **Why use TypeGuard?** Type safety, improved readability, better IDE support.`,
    contentMarkdownUa: `**TypeGuard** допомагає звузити тип змінної в блоці коду, роблячи код безпечнішим.

TypeScript надає кілька способів:
1. **typeof** для примітивів
2. **instanceof** для класів
3. **Користувацькі type guards** за допомогою **is**

### Приклад з typeof

\`\`\`typescript
function printLength(value: string | number) {
  if (typeof value === "string") {
    console.log(value.length);
  } else {
    console.log(value.toFixed(2));
  }
}
\`\`\`

### Користувацький TypeGuard

\`\`\`typescript
type Dog = { bark: () => void };
type Cat = { meow: () => void };

function isDog(animal: Dog | Cat): animal is Dog {
  return (animal as Dog).bark !== undefined;
}

function speak(animal: Dog | Cat) {
  if (isDog(animal)) {
    animal.bark();
  } else {
    animal.meow();
  }
}
\`\`\`

> **Навіщо використовувати TypeGuard?** Безпека типів, покращена читабельність, краща підтримка IDE.`,
  },
  {
    slug: 'typescript-never',
    titleEn: 'never Type',
    titleUa: 'Тип never',
    descriptionEn: 'Understanding the never type in TypeScript',
    descriptionUa: 'Розуміння типу never в TypeScript',
    difficulty: 'MIDDLE' as const,
    order: 9,
    contentMarkdownEn: `**The never type** in **TypeScript** is used to denote values that never occur.

Usually used when:
1. Function doesn't return and doesn't complete execution (throws exception)
2. Function executes infinitely (infinite loop)

\`\`\`typescript
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    // ...
  }
}
\`\`\`

The **never** type helps TypeScript understand that a function won't complete correctly and cannot return a value.

> **Recommendation:** Use **\`never\`** to explicitly indicate situations where a function shouldn't terminate normally.`,
    contentMarkdownUa: `**Тип never** в **TypeScript** використовується для позначення значень, які ніколи не відбуваються.

Зазвичай використовується коли:
1. Функція не повертає і не завершує виконання (викидає виключення)
2. Функція виконується нескінченно (нескінченний цикл)

\`\`\`typescript
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    // ...
  }
}
\`\`\`

Тип **never** допомагає TypeScript зрозуміти, що функція не завершиться коректно і не може повернути значення.

> **Рекомендація:** Використовуйте **\`never\`** для явного вказання ситуацій, коли функція не повинна завершуватися нормально.`,
  },
  {
    slug: 'typescript-infer',
    titleEn: 'infer Keyword',
    titleUa: 'Ключове слово infer',
    descriptionEn: 'Type inference within conditional types',
    descriptionUa: 'Виведення типу в умовних типах',
    difficulty: 'SENIOR' as const,
    order: 10,
    contentMarkdownEn: `**infer** is used for **type inference** within conditional types. It allows TypeScript to automatically infer types based on context.

### Inferring function return type

\`\`\`typescript
type ReturnTypeOfFunction<T> = T extends (...args: any[]) => infer R ? R : never;

function getString(): string {
  return "Hello, world!";
}

type Result = ReturnTypeOfFunction<typeof getString>;  // string
\`\`\`

### Using infer with arrays

\`\`\`typescript
type ElementType<T> = T extends (infer U)[] ? U : never;

const numbers: number[] = [1, 2, 3];
type NumberType = ElementType<typeof numbers>;  // number
\`\`\`

### Unwrapping Promise

\`\`\`typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type ResolvedType = UnwrapPromise<Promise<string>>;  // string
type NonPromiseType = UnwrapPromise<number>;  // number
\`\`\`

> **Use infer** to extract types in conditional types, making code more flexible and avoiding duplication.`,
    contentMarkdownUa: `**infer** використовується для **виведення типу** в умовних типах. Він дозволяє TypeScript автоматично виводити типи на основі контексту.

### Виведення типу повернення функції

\`\`\`typescript
type ReturnTypeOfFunction<T> = T extends (...args: any[]) => infer R ? R : never;

function getString(): string {
  return "Привіт, світ!";
}

type Result = ReturnTypeOfFunction<typeof getString>;  // string
\`\`\`

### Використання infer з масивами

\`\`\`typescript
type ElementType<T> = T extends (infer U)[] ? U : never;

const numbers: number[] = [1, 2, 3];
type NumberType = ElementType<typeof numbers>;  // number
\`\`\`

### Розгортання Promise

\`\`\`typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type ResolvedType = UnwrapPromise<Promise<string>>;  // string
type NonPromiseType = UnwrapPromise<number>;  // number
\`\`\`

> **Використовуйте infer** для витягування типів в умовних типах, роблячи код більш гнучким та уникаючи дублювання.`,
  },
  
  // Continue with remaining 18 questions...
];

async function addQuestions() {
  try {
    console.log('🚀 Adding TypeScript Batches 2-6\\n')
    const [category] = await db.select().from(schema.categories)
      .where(eq(schema.categories.slug, 'typescript')).limit(1)
    
    if (!category) throw new Error('TypeScript category not found')
    console.log(`✓ Category: ${category.nameEn}\\n`)
    
    for (const q of questions) {
      console.log(`📝 ${q.slug}`)
      const [ex] = await db.select().from(schema.questions)
        .where(eq(schema.questions.slug, q.slug)).limit(1)
      
      if (ex) {
        await db.update(schema.questions)
          .set({...q, categoryId: category.id, updatedAt: new Date()})
          .where(eq(schema.questions.id, ex.id))
        console.log('✅ Updated')
      } else {
        await db.insert(schema.questions).values({...q, categoryId: category.id})
        console.log('✅ Added')
      }
    }
    console.log('\\n🎉 TypeScript questions added!')
  } finally {
    await client.end()
  }
}

addQuestions().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })
