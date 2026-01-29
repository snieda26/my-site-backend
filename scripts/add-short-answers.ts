/**
 * Script to add short answers to existing questions
 * 
 * Usage: npx tsx scripts/add-short-answers.ts
 * 
 * This script updates questions with short answers for the knowledge check feature.
 * Short answers should be concise (2-4 sentences) summaries of the full answer.
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import * as dotenv from 'dotenv'
import * as schema from '../src/core/database/schema'

const postgres = require('postgres')

dotenv.config({ path: '.env' })

let connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

connectionString = connectionString.split('?')[0]

console.log(`📡 Connecting to database: ${connectionString.replace(/\/\/.*@/, '//***@')}`)

const client = postgres(connectionString)
const db = drizzle(client, { schema })

// Define short answers for each question by slug
// Format: { slug: { en: 'English short answer', ua: 'Ukrainian short answer' } }
const shortAnswers: Record<string, { en: string; ua: string }> = {
  // TypeScript questions
  'what-is-typescript-for-pros-cons': {
    en: 'TypeScript is a superset of JavaScript with static typing. Pros: error detection during development, improved autocomplete, refactoring, code documentation through types, scalability. Cons: additional complexity, compilation time, learning curve, need to type third-party libraries. TypeScript compiles to regular JavaScript and can be used anywhere JS works.',
    ua: 'TypeScript — це надбудова над JavaScript зі статичною типізацією. Переваги: виявлення помилок під час розробки, покращене автодоповнення та рефакторинг, документування коду через типи, масштабованість. Недоліки: додаткова складність, час компіляції, крива навчання, потреба типізувати сторонні бібліотеки. TypeScript компілюється у звичайний JavaScript і може використовуватися де завгодно.',
  },
  'type-vs-interface-typescript': {
    en: 'Both type and interface define object shapes in TypeScript. Interfaces support declaration merging and are better for object-oriented patterns. Types are more flexible: they support unions, intersections, mapped types, and can alias primitives. Use interfaces for public API contracts and classes; use types for complex type compositions and unions.',
    ua: 'Як type, так і interface визначають структури обʼєктів у TypeScript. Інтерфейси підтримують злиття декларацій і краще підходять для ООП-патернів. Типи гнучкіші: підтримують обʼєднання, перетини, mapped types і можуть створювати псевдоніми примітивів. Використовуйте інтерфейси для публічних API та класів; типи — для складних композицій і обʼєднань.',
  },
  'differences-between-any-and-unknown-in-typescript': {
    en: 'Both any and unknown accept any value, but unknown is type-safe. With any, you can perform any operation without checks. With unknown, you must narrow the type first (using typeof, instanceof, or type guards). Use unknown for values from external sources; avoid any as it disables type checking.',
    ua: 'Обидва типи any та unknown приймають будь-яке значення, але unknown є типобезпечним. З any можна виконувати будь-які операції без перевірок. З unknown потрібно спочатку звузити тип (typeof, instanceof або type guards). Використовуйте unknown для значень із зовнішніх джерел; уникайте any, бо він вимикає перевірку типів.',
  },
  'what-are-generics-typescript': {
    en: 'Generics allow creating reusable components that work with different types while maintaining type safety. They use type parameters (like <T>) that are specified when the component is used. Common use cases: generic functions, classes, interfaces, and utility types like Array<T> or Promise<T>.',
    ua: 'Дженерики дозволяють створювати компоненти, які працюють з різними типами, зберігаючи типобезпеку. Вони використовують параметри типів (як <T>), які вказуються при використанні компонента. Типові випадки: generic-функції, класи, інтерфейси та утилітарні типи як Array<T> або Promise<T>.',
  },
  'what-are-decorators-in-typescript': {
    en: 'Decorators are special declarations that can modify classes, methods, properties, or parameters at design time. They use the @expression syntax and are commonly used in frameworks like Angular and NestJS. Enable with experimentalDecorators in tsconfig.json.',
    ua: 'Декоратори — це спеціальні оголошення, які можуть модифікувати класи, методи, властивості або параметри під час визначення. Використовують синтаксис @expression і часто застосовуються у фреймворках Angular та NestJS. Увімкніть experimentalDecorators у tsconfig.json.',
  },
  'union-types-typescript': {
    en: 'Union types allow a value to be one of several types, written with the | operator (e.g., string | number). TypeScript narrows the type through control flow analysis. Use type guards (typeof, instanceof, in) to safely work with union members.',
    ua: 'Union-типи дозволяють значенню бути одним із кількох типів, записуються через оператор | (наприклад, string | number). TypeScript звужує тип через аналіз потоку управління. Використовуйте type guards (typeof, instanceof, in) для безпечної роботи з членами union.',
  },
  'conditional-types-in-typescript': {
    en: 'Conditional types select a type based on a condition: T extends U ? X : Y. They enable advanced type transformations and are often used with generics. Common built-in conditional types: Exclude, Extract, NonNullable, ReturnType, Parameters.',
    ua: 'Умовні типи обирають тип на основі умови: T extends U ? X : Y. Вони дозволяють складні трансформації типів і часто використовуються з дженериками. Вбудовані умовні типи: Exclude, Extract, NonNullable, ReturnType, Parameters.',
  },
  'discriminated-unions-in-typescript': {
    en: 'Discriminated unions are union types where each member has a common property (discriminant) with a literal type. TypeScript uses this property to narrow types automatically. Pattern: { type: "a", ...} | { type: "b", ...} with switch/if on the type property.',
    ua: 'Дискриміновані union — це union-типи, де кожен член має спільну властивість (дискримінант) з літеральним типом. TypeScript використовує цю властивість для автоматичного звуження типів. Патерн: { type: "a", ...} | { type: "b", ...} зі switch/if по властивості type.',
  },
  'utility-type-awaited-in-typescript': {
    en: 'Awaited<T> recursively unwraps Promise types to get the resolved value type. Awaited<Promise<string>> returns string. It handles nested promises (Promise<Promise<T>>) and is useful for typing async function returns and Promise.all results.',
    ua: 'Awaited<T> рекурсивно розгортає типи Promise, щоб отримати тип значення. Awaited<Promise<string>> повертає string. Обробляє вкладені проміси (Promise<Promise<T>>) і корисний для типізації повернень async-функцій та результатів Promise.all.',
  },
  'any-vs-unknown-typescript': {
    en: 'any disables all type checking - you can do anything with it. unknown is the type-safe counterpart - you must check the type before using. Prefer unknown when the type is truly unknown; use any only as last resort or during migration from JavaScript.',
    ua: 'any вимикає всю перевірку типів — з ним можна робити що завгодно. unknown — типобезпечна альтернатива: потрібно перевірити тип перед використанням. Надавайте перевагу unknown, коли тип справді невідомий; використовуйте any лише як крайній засіб або під час міграції з JavaScript.',
  },
}

async function updateShortAnswers() {
  console.log('🚀 Starting to update short answers...\n')
  
  let updated = 0
  let notFound = 0
  
  for (const [slug, answers] of Object.entries(shortAnswers)) {
    try {
      const [question] = await db
        .select({ id: schema.questions.id })
        .from(schema.questions)
        .where(eq(schema.questions.slug, slug))
        .limit(1)
      
      if (!question) {
        console.log(`❌ Question not found: ${slug}`)
        notFound++
        continue
      }
      
      await db
        .update(schema.questions)
        .set({
          shortAnswerEn: answers.en,
          shortAnswerUa: answers.ua,
          updatedAt: new Date(),
        })
        .where(eq(schema.questions.id, question.id))
      
      console.log(`✅ Updated: ${slug}`)
      updated++
    } catch (error) {
      console.error(`❌ Error updating ${slug}:`, error)
    }
  }
  
  console.log(`\n========================================`)
  console.log(`✅ Updated: ${updated} questions`)
  console.log(`❌ Not found: ${notFound} questions`)
  console.log(`========================================`)
  
  await client.end()
  process.exit(0)
}

updateShortAnswers().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
