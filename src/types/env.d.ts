/**
 * Environment variable type definitions
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_APP_URL: string;
      
      // Add your custom environment variables here
      // DATABASE_URL?: string;
      // API_SECRET_KEY?: string;
    }
  }
}

export {};
