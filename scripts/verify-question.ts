/**
 * Verify Question in Database
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

async function verifyQuestion() {
  try {
    const slug = 'difference-between-css-reset-and-normalize'
    
    console.log(`\n🔍 Looking for question: ${slug}\n`)
    
    const [question] = await db
      .select()
      .from(schema.questions)
      .leftJoin(schema.categories, eq(schema.questions.categoryId, schema.categories.id))
      .where(eq(schema.questions.slug, slug))
      .limit(1)

    if (!question) {
      console.log('❌ Question not found')
      return
    }

    console.log('✅ Question found!')
    console.log('=================')
    console.log(`ID: ${question.questions.id}`)
    console.log(`Slug: ${question.questions.slug}`)
    console.log(`Title (EN): ${question.questions.titleEn}`)
    console.log(`Title (UA): ${question.questions.titleUa}`)
    console.log(`Difficulty: ${question.questions.difficulty}`)
    console.log(`Category: ${question.categories?.nameEn}`)
    console.log(`Content length: ${question.questions.contentMarkdownEn.length} characters`)
    console.log(`\nFirst 200 characters of content:`)
    console.log(question.questions.contentMarkdownEn.substring(0, 200))
    console.log('...\n')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

verifyQuestion()
