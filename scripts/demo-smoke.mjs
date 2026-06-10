import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd || root,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, ...options.env }
    })

    let output = ''
    child.stdout.on('data', (chunk) => {
      output += chunk.toString()
    })
    child.stderr.on('data', (chunk) => {
      output += chunk.toString()
    })
    child.on('close', (code) => {
      if (code === 0) resolve(output)
      else reject(new Error(output || `${command} ${args.join(' ')} failed with code ${code}`))
    })
  })
}

async function main() {
  const checks = []
  const warnings = []

  await run('node', ['-e', "require('./backend/src/loaders/schedulers'); require('./backend/src/routes/intelligencePlatform'); console.log('modules ok')"], {
    cwd: root
  })
  checks.push('Backend intelligence modules load')

  await run('npm', ['run', 'build'], { cwd: path.join(root, 'frontend') })
  checks.push('Frontend production build')

  try {
    const seedOutput = await run('npm', ['run', 'seed:intelligence-demo'], {
      cwd: path.join(root, 'backend')
    })
    if (!/Intelligence demo seeded|Intelligence demo seed complete/i.test(seedOutput)) {
      warnings.push('Intelligence demo seed completed without expected success message')
    } else {
      checks.push('Intelligence demo seed')
    }
  } catch (error) {
    warnings.push(`Intelligence demo seed skipped: ${error.message.split('\n')[0]}`)
  }

  console.log('Demo smoke checks passed:')
  checks.forEach((check) => console.log(`- ${check}`))
  if (warnings.length) {
    console.log('Warnings:')
    warnings.forEach((warning) => console.log(`- ${warning}`))
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
