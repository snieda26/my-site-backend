/**
 * Add Hackfrontend Question to Database
 * Reads parsed markdown and inserts into PostgreSQL via Drizzle
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import * as fs from 'fs'
import * as path from 'path'
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

// Category mapping from hackfrontend slugs to our slugs
const CATEGORY_MAPPING: Record<string, { slug: string, nameEn: string, nameUa: string }> = {
  'html-and-css': { slug: 'html-css', nameEn: 'HTML & CSS', nameUa: 'HTML & CSS' },
  'javascript': { slug: 'javascript', nameEn: 'JavaScript', nameUa: 'JavaScript' },
  'typescript': { slug: 'typescript', nameEn: 'TypeScript', nameUa: 'TypeScript' },
  'react': { slug: 'react', nameEn: 'React', nameUa: 'React' },
  'vue': { slug: 'vue', nameEn: 'Vue', nameUa: 'Vue' },
  'angular': { slug: 'angular', nameEn: 'Angular', nameUa: 'Angular' },
  'redux': { slug: 'redux', nameEn: 'Redux', nameUa: 'Redux' },
  'general-questions': { slug: 'general', nameEn: 'General Questions', nameUa: 'Загальні питання' },
  'architecture': { slug: 'architecture', nameEn: 'Architecture', nameUa: 'Архітектура' },
  'principles': { slug: 'principles', nameEn: 'Principles', nameUa: 'Принципи' },
  'patterns': { slug: 'patterns', nameEn: 'Patterns', nameUa: 'Паттерни' },
}

interface ParsedQuestion {
  title: string
  category: string
  url: string
  date: string
  content: string
}

function parseFrontmatter(fileContent: string): ParsedQuestion {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = fileContent.match(frontmatterRegex)

  if (!match) {
    throw new Error('Frontmatter not found')
  }

  const [, frontmatterStr, rawContent] = match
  const frontmatter: any = {}

  const lines = frontmatterStr.split('\n')
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.substring(0, colonIndex).trim()
    let value: any = line.substring(colonIndex + 1).trim()

    // Remove quotes
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1)
    }

    frontmatter[key] = value
  }

  // Extract content without the title
  const contentLines = rawContent.trim().split('\n')
  // Skip the first line if it's a heading matching the title
  const content = contentLines[0].startsWith('# ') 
    ? contentLines.slice(1).join('\n').trim()
    : rawContent.trim()

  return {
    title: frontmatter.title,
    category: frontmatter.category,
    url: frontmatter.url,
    date: frontmatter.date,
    content: content
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function findOrCreateCategory(categorySlug: string) {
  const categoryConfig = CATEGORY_MAPPING[categorySlug]
  
  if (!categoryConfig) {
    throw new Error(`Unknown category: ${categorySlug}`)
  }

  // Check if category exists
  const [existing] = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.slug, categoryConfig.slug))
    .limit(1)

  if (existing) {
    console.log(`✓ Category exists: ${categoryConfig.nameEn}`)
    return existing
  }

  // Create category
  const [newCategory] = await db
    .insert(schema.categories)
    .values({
      slug: categoryConfig.slug,
      nameEn: categoryConfig.nameEn,
      nameUa: categoryConfig.nameUa,
      order: 0,
    })
    .returning()

  console.log(`✓ Created category: ${categoryConfig.nameEn}`)
  return newCategory
}

async function addQuestion(filePath: string) {
  try {
    console.log(`\n📖 Reading: ${filePath}`)
    
    // Read markdown file
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const parsed = parseFrontmatter(fileContent)

    console.log(`\n📝 Parsed Question:`)
    console.log(`   Title: ${parsed.title}`)
    console.log(`   Category: ${parsed.category}`)
    console.log(`   URL: ${parsed.url}`)

    // Generate slug
    const slug = slugify(parsed.title)
    console.log(`   Slug: ${slug}`)

    // Check if question already exists
    const [existing] = await db
      .select()
      .from(schema.questions)
      .where(eq(schema.questions.slug, slug))
      .limit(1)

    if (existing) {
      console.log(`\n⚠️  Question already exists with slug: ${slug}`)
      console.log(`   Do you want to update it? (not implemented yet)`)
      return
    }

    // Find or create category
    const category = await findOrCreateCategory(parsed.category)

    // Insert question
    // For now, use English content for both EN and UA
    const [question] = await db
      .insert(schema.questions)
      .values({
        slug: slug,
        titleEn: parsed.title,
        titleUa: parsed.title, // TODO: Translate to Ukrainian
        descriptionEn: parsed.title,
        descriptionUa: parsed.title,
        contentMarkdownEn: parsed.content,
        contentMarkdownUa: parsed.content, // TODO: Translate to Ukrainian
        difficulty: 'MIDDLE',
        order: 0,
        categoryId: category.id,
      })
      .returning()

    console.log(`\n✅ Successfully added question!`)
    console.log(`   ID: ${question.id}`)
    console.log(`   Slug: ${question.slug}`)
    console.log(`   Category: ${category.nameEn}`)
    
  } catch (error) {
    console.error(`\n❌ Error:`, error)
    throw error
  } finally {
    await client.end()
  }
}

// Main execution
const args = process.argv.slice(2)
const filePath = args[0] || path.join(__dirname, '../../mine-copy/parsed-posts/difference-between-css-reset-and-normalize.md')

console.log(`\n🚀 Adding Hackfrontend Question to Database`)
console.log(`=====================================`)

addQuestion(filePath)
  .then(() => {
    console.log(`\n✅ Done!\n`)
    process.exit(0)
  })
  .catch((error) => {
    console.error(`\n❌ Failed:`, error)
    process.exit(1)
  })
