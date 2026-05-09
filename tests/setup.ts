// Test-time env. lib/env.ts validates these at module load and throws otherwise.
process.env.MONGODB_URI = 'mongodb://test-user:test-pass@localhost:27017';
process.env.MONGODB_DB_NAME = 'resume-forge-test';
process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
process.env.AUTH_SECRET = 'test-secret-must-be-at-least-32-characters-long-xx';
