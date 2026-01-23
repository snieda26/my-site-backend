/**
 * Translate CSS Reset Question to Ukrainian
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

const ukrainianContent = `Починаючи верстку з нуля, важливо забезпечити **кроссбраузерну поведінку елементів**. Різні браузери відображають заголовки, списки, поля форм тощо по-різному. Щоб привести все до єдиного вигляду, використовуються стилі **Reset** або **Normalize**.

---

## Що таке CSS Reset?

**Reset CSS** — це підхід, де **всі стандартні стилі скидаються до нуля**.

\`\`\`css
/* Приклад CSS Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
\`\`\`

### Основна мета:
- Усунути всі відмінності між браузерами
- Повне обнулення відступів, рамок, шрифтів та інших властивостей

### Недоліки:
- Видаляються навіть корисні стилі браузера (наприклад, стилі заголовків, маркери списків)
- Потребує більше налаштувань після

## Що таке Normalize.css?

**Normalize.css** — це бібліотека, яка не скидає стилі, а робить їх однаковими у всіх браузерах, зберігаючи корисні значення за замовчуванням.

\`\`\`javascript
import "normalize.css";
\`\`\`

### Особливості:
- Зберігає корисні стилі за замовчуванням
- Виправляє браузерні неузгодженості
- Покращує використовуваність елементів
- Добре документована та підтримується

## Що вибрати?

**Normalize.css** — якщо хочете зберегти базові стилі.  
**Reset CSS** — якщо потрібен повний контроль і готові переозначити все.`

async function updateQuestion() {
  try {
    console.log('🔄 Updating CSS Reset question with Ukrainian translation...')
    
    // Find the question
    const [question] = await db
      .select()
      .from(schema.questions)
      .where(eq(schema.questions.slug, 'difference-between-css-reset-and-normalize'))
      .limit(1)

    if (!question) {
      console.error('❌ Question not found')
      return
    }

    console.log(`✓ Found question: ${question.titleEn}`)

    // Update with Ukrainian content
    const [updated] = await db
      .update(schema.questions)
      .set({
        titleUa: 'Різниця між CSS Reset та Normalize',
        descriptionUa: 'Різниця між CSS Reset та Normalize',
        contentMarkdownUa: ukrainianContent,
        updatedAt: new Date()
      })
      .where(eq(schema.questions.id, question.id))
      .returning()

    console.log('✅ Successfully updated question with Ukrainian translation!')
    console.log(`   ID: ${updated.id}`)
    console.log(`   Slug: ${updated.slug}`)
    console.log(`   Title EN: ${updated.titleEn}`)
    console.log(`   Title UA: ${updated.titleUa}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.end()
  }
}

console.log('\n🚀 Translating CSS Reset Question')
console.log('===================================\n')

updateQuestion()
  .then(() => {
    console.log('\n✅ Done!\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error)
    process.exit(1)
  })
