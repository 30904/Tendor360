/**
 * Generates standard PWA PNG icons from the brand SVG (devDependency: sharp).
 */
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const svgPath = join(root, 'src', 'assets', 'tender360-brand-mark.svg')
const publicDir = join(root, 'public')
mkdirSync(publicDir, { recursive: true })

const svg = readFileSync(svgPath)

await sharp(svg).resize(192, 192).png().toFile(join(publicDir, 'pwa-192.png'))
await sharp(svg).resize(512, 512).png().toFile(join(publicDir, 'pwa-512.png'))
console.log('PWA icons written to public/pwa-192.png, public/pwa-512.png')
