import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Pool } from 'pg';

import * as env from '../config/env';

async function applyMigrations() {
  console.log(env.databaseUrl);
  const pg = new Pool({ connectionString: env.databaseUrl });

  console.log('[MIGRATIONS] START');

  const migrationsDir = path.join(__dirname, 'migrations');
  const migrationFiles = ['setupDatabase.sql'];

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const sql = readFileSync(filePath, 'utf8');
    console.log('[MIGRATIONS]', file);
    await pg.query(sql);
  }

  console.log('[MIGRATIONS] SUCCESS');
  return;
}

applyMigrations().catch((err) => {
  console.error(err);
});
