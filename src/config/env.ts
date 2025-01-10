import { config } from 'dotenv';
import path from 'node:path';
import { z } from 'zod';

const envPath = path.join(__dirname, '../', '../', '.env');
console.log('[ENV_PATH] ', envPath);

const env = config({
  path: envPath,
});

const configValidator = z.object({
  PORT: z.string(),
  DATABASE_URL: z.string(),
});

const parsedConfig = configValidator.safeParse(env.parsed);

if (!parsedConfig.success) {
  console.log(parsedConfig.error);
  process.exit(1);
}

const dataConfig = parsedConfig.data;

export const port = Number(dataConfig.PORT);
export const databaseUrl = dataConfig.DATABASE_URL;
