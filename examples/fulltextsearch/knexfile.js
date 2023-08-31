import pgClient from 'knex/lib/dialects/postgres/index.js'
import { readFileSync } from 'fs'

const env = {
  read: (envVar) => {
    let result
    if (import.meta.env) {
      result = import.meta.env[envVar]
    }
    if (!result && process && process.env[envVar]) {
      result = process.env[envVar]
    } else if (!result && process && process.env[envVar + '_FILE']) {
      result = process.env[envVar + '_FILE']
    }
    if (result && result.startsWith('/run/secrets')) {
      try {
        result = readFileSync(result, 'utf-8')
      } catch (e) {
      }
    }
    
    return result
  }
}
const config = {
  client: pgClient,
  useNullAsDefault: true,
  // connection: env.read('DATABASE_URL') || env.read('VITE_DATABASE_URL')
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'mypassword',
    database: 'fulltextsearch'
  },
  migrations: {
    directory: './lib/migrations',
    loadExtensions: ['.mjs']
  },
  seeds: {
    directory: './lib/seeds'
  }
}

export default config