import { config } from 'dotenv';

config();

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
export const NOTION_API_KEY = process.env.NOTION_API_KEY || '';
export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '';
export const OTEL_EXPORTER = process.env.OTEL_EXPORTER || 'stdout';
