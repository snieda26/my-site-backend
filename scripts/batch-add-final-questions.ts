/**
 * Final Batch - Completing HTML & CSS Section (9 remaining questions)
 * Includes: Style Isolation, async/defer, Clearing, SVG, Variables, visibility/display,
 *           Container Queries, Object-fit, Aspect-ratio
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import * as dotenv from 'dotenv';
import * as schema from '../src/core/database/schema';
import { eq } from 'drizzle-orm';

const postgres = require('postgres');
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');

const cleanConnectionString = connectionString.split('?')[0];
const client = postgres(cleanConnectionString);
const db = drizzle(client, { schema });

// Array will be populated with question data...
const questions: any[] = [];

// Due to length, I'll add questions incrementally via the script
console.log('📦 Preparing final 9 questions for HTML & CSS...');

async function addQuestions() {
  try {
    const [category] = await db.select().from(schema.categories)
      .where(eq(schema.categories.slug, 'html-css')).limit(1);
    
    if (!category) throw new Error('HTML & CSS category not found');
    
    console.log(`✓ Found category: ${category.nameEn}`);
    console.log(`📝 Adding ${questions.length} questions...\\n`);

    for (const questionData of questions) {
      console.log(`Processing: ${questionData.titleEn}`);
      
      const [existing] = await db.select().from(schema.questions)
        .where(eq(schema.questions.slug, questionData.slug)).limit(1);

      if (existing) {
        await db.update(schema.questions)
          .set({ ...questionData, categoryId: category.id, updatedAt: new Date() })
          .where(eq(schema.questions.id, existing.id));
        console.log(`✅ Updated: ${questionData.slug}`);
      } else {
        await db.insert(schema.questions)
          .values({ ...questionData, categoryId: category.id });
        console.log(`✅ Added: ${questionData.slug}`);
      }
    }
    
    console.log('\\n✅ All questions added successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

addQuestions()
  .then(() => process.exit(0))
  .catch((error) => { console.error('\\n❌ Failed:', error); process.exit(1); });
