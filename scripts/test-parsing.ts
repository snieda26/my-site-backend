/**
 * Test Parsing Script
 * Tests the markdown parsing logic on sample files
 */

import * as fs from 'fs'
import * as path from 'path'

const MARKDOWN_PATH = '/Users/petro/Desktop/rkdwns'

function extractTitle(content: string): string {
	const lines = content.split('\n')
	
	let startIndex = 0
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes('[Sign in to mark as read]') || lines[i].includes('# What is') || lines[i].includes('# How') || lines[i].includes('# Difference')) {
			startIndex = i
			break
		}
	}
	
	for (let i = startIndex; i < lines.length; i++) {
		const line = lines[i].trim()
		if (line.startsWith('# ') && !line.includes('Hack Frontend') && !line.includes('Frontend Interview Question')) {
			return line.replace(/^#\s+/, '').trim()
		}
	}
	
	const firstH1 = lines.find(l => l.trim().startsWith('# '))
	if (firstH1) {
		return firstH1.replace(/^#\s+/, '').replace(/\s*\|\s*.*$/, '').trim()
	}
	
	return 'Untitled'
}

function extractMainContent(rawContent: string): string {
	const lines = rawContent.split('\n')
	
	let startIndex = 0
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim()
		if (line.includes('[Sign in to mark as read]')) {
			startIndex = i + 1
			break
		}
		if (i > 200 && line.startsWith('# ') && !line.includes('Hack Frontend')) {
			startIndex = i
			break
		}
	}
	
	let endIndex = lines.length
	for (let i = startIndex; i < lines.length; i++) {
		const line = lines[i].trim()
		if (line.startsWith('[Back]') || line.includes('### Content') || line.includes('Back to Top')) {
			endIndex = i
			break
		}
	}
	
	let content = lines.slice(startIndex, endIndex).join('\n')
	
	content = content.replace(/https?:\/\/(www\.)?hackfrontend\.com/g, 'http://localhost:3001')
	content = content.replace(/\[Back\]\([^)]+\)/g, '')
	content = content.replace(/\[Forward\]\([^)]+\)/g, '')
	content = content.replace(/\[🎉[^\]]+\]\([^)]+\)/g, '')
	content = content.replace(/\n{3,}/g, '\n\n').trim()
	
	return content
}

// Test with sample files
const testFiles = [
	'2026-01-23-hackfrontend-com-nan.md',
	'2026-01-23-hackfrontend-com-polyfill.md',
	'2026-01-23-hackfrontend-com-currying.md'
]

console.log('🧪 Testing markdown parsing...\n')

for (const filename of testFiles) {
	const filepath = path.join(MARKDOWN_PATH, filename)
	
	if (!fs.existsSync(filepath)) {
		console.log(`⚠️  File not found: ${filename}`)
		continue
	}
	
	const rawContent = fs.readFileSync(filepath, 'utf-8')
	const title = extractTitle(rawContent)
	const content = extractMainContent(rawContent)
	
	console.log('─────────────────────────────────────────')
	console.log(`📄 File: ${filename}`)
	console.log(`📝 Title: ${title}`)
	console.log(`📊 Content length: ${content.length} chars`)
	console.log(`🔍 Content preview (first 300 chars):`)
	console.log(content.substring(0, 300))
	console.log()
}

console.log('─────────────────────────────────────────')
console.log('✅ Test complete!')
