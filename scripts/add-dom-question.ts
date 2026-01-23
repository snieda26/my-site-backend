/**
 * Add "What is the DOM?" Question to Database
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import * as dotenv from 'dotenv'
import * as schema from '../src/core/database/schema'
import { eq } from 'drizzle-orm'

const postgres = require('postgres')

dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL not set')
}

const cleanConnectionString = connectionString.split('?')[0]
const client = postgres(cleanConnectionString)
const db = drizzle(client, { schema })

// Clean English content
const englishContent = `**DOM (Document Object Model)** is a programming interface that represents the structure of HTML or XML documents as a tree of objects. The DOM allows JavaScript to interact with web page content, modify its structure, style, and behavior.

---

## Key Features of the DOM

1. **Node Tree:**

The DOM represents a document as a tree of nodes, where each node corresponds to an element, attribute, or text.

2. **Dynamic Updates:**

The DOM allows you to change the content and structure of a document without reloading the page.

3. **Interface for JavaScript:**

Using the DOM API, you can modify page elements, their styles, add or remove elements.

---

## Example of a DOM Tree

HTML:

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>Example</title>
  </head>
  <body>
    <h1>Hello, DOM!</h1>
    <p>This is an example.</p>
  </body>
</html>
\`\`\`

## Working with the DOM

Here's an example of how to use the DOM API to change page content.

HTML:

\`\`\`html
<h1 id="title">Welcome</h1>
<button id="changeText">Change Text</button>
\`\`\`

JavaScript:

\`\`\`javascript
// Get the heading element and button
const title = document.getElementById("title");
const button = document.getElementById("changeText");

// Add click handler
button.addEventListener("click", () => {
  title.textContent = "Text changed!";
});
\`\`\`

## Main DOM Methods

- \`document.getElementById(id)\` — get element by ID.
- \`document.querySelector(selector)\` — get the first element matching the CSS selector.
- \`document.querySelectorAll(selector)\` — get all elements matching the CSS selector.
- \`element.textContent\` — change the text of an element.
- \`element.innerHTML\` — change the HTML content of an element.
- \`element.style\` — change element styles.

> **Tip:** The DOM API is a powerful tool, but for complex tasks, use modern libraries like React to simplify interface work.`

// Ukrainian translation
const ukrainianContent = `**DOM (Document Object Model)** — це програмний інтерфейс, який представляє структуру HTML або XML документів у вигляді дерева об'єктів. DOM дозволяє JavaScript взаємодіяти з вмістом веб-сторінки, змінювати її структуру, стиль та поведінку.

---

## Основні Характеристики DOM

1. **Дерево Вузлів:**

DOM представляє документ як дерево вузлів, де кожен вузол відповідає елементу, атрибуту або тексту.

2. **Динамічні Оновлення:**

DOM дозволяє змінювати вміст та структуру документа без перезавантаження сторінки.

3. **Інтерфейс для JavaScript:**

Використовуючи DOM API, ви можете змінювати елементи сторінки, їх стилі, додавати або видаляти елементи.

---

## Приклад Дерева DOM

HTML:

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>Приклад</title>
  </head>
  <body>
    <h1>Привіт, DOM!</h1>
    <p>Це приклад.</p>
  </body>
</html>
\`\`\`

## Робота з DOM

Ось приклад того, як використовувати DOM API для зміни вмісту сторінки.

HTML:

\`\`\`html
<h1 id="title">Ласкаво просимо</h1>
<button id="changeText">Змінити текст</button>
\`\`\`

JavaScript:

\`\`\`javascript
// Отримуємо елемент заголовка та кнопки
const title = document.getElementById("title");
const button = document.getElementById("changeText");

// Додаємо обробник кліку
button.addEventListener("click", () => {
  title.textContent = "Текст змінено!";
});
\`\`\`

## Основні Методи DOM

- \`document.getElementById(id)\` — отримати елемент за ID.
- \`document.querySelector(selector)\` — отримати перший елемент, що відповідає CSS селектору.
- \`document.querySelectorAll(selector)\` — отримати всі елементи, що відповідають CSS селектору.
- \`element.textContent\` — змінити текст елемента.
- \`element.innerHTML\` — змінити HTML вміст елемента.
- \`element.style\` — змінити стилі елемента.

> **Порада:** DOM API — це потужний інструмент, але для складних завдань використовуйте сучасні бібліотеки, такі як React, щоб спростити роботу з інтерфейсом.`

async function addQuestion() {
  try {
    console.log('🚀 Adding "What is the DOM?" question to database...')
    
    // Find html-css category
    const [category] = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.slug, 'html-css'))
      .limit(1)

    if (!category) {
      throw new Error('HTML & CSS category not found')
    }

    console.log(`✓ Found category: ${category.nameEn}`)

    // Check if question already exists
    const slug = 'what-is-dom'
    const [existing] = await db
      .select()
      .from(schema.questions)
      .where(eq(schema.questions.slug, slug))
      .limit(1)

    if (existing) {
      console.log('⚠️  Question already exists, updating...')
      
      const [updated] = await db
        .update(schema.questions)
        .set({
          titleEn: 'What is the DOM?',
          titleUa: 'Що таке DOM?',
          descriptionEn: 'Learn about the Document Object Model (DOM) and how JavaScript interacts with web pages.',
          descriptionUa: 'Дізнайтесь про Document Object Model (DOM) та як JavaScript взаємодіє з веб-сторінками.',
          contentMarkdownEn: englishContent,
          contentMarkdownUa: ukrainianContent,
          updatedAt: new Date()
        })
        .where(eq(schema.questions.id, existing.id))
        .returning()

      console.log('✅ Question updated successfully!')
      console.log(`   ID: ${updated.id}`)
      console.log(`   Slug: ${updated.slug}`)
      return
    }

    // Insert new question
    const [question] = await db
      .insert(schema.questions)
      .values({
        slug: slug,
        titleEn: 'What is the DOM?',
        titleUa: 'Що таке DOM?',
        descriptionEn: 'Learn about the Document Object Model (DOM) and how JavaScript interacts with web pages.',
        descriptionUa: 'Дізнайтесь про Document Object Model (DOM) та як JavaScript взаємодіє з веб-сторінками.',
        contentMarkdownEn: englishContent,
        contentMarkdownUa: ukrainianContent,
        difficulty: 'EASY',
        order: 2,
        categoryId: category.id,
      })
      .returning()

    console.log('✅ Question added successfully!')
    console.log(`   ID: ${question.id}`)
    console.log(`   Slug: ${question.slug}`)
    console.log(`   Title EN: ${question.titleEn}`)
    console.log(`   Title UA: ${question.titleUa}`)
    console.log(`   Category: ${category.nameEn}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.end()
  }
}

console.log('\n🚀 Adding DOM Question to Database')
console.log('===================================\n')

addQuestion()
  .then(() => {
    console.log('\n✅ Done!\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error)
    process.exit(1)
  })
