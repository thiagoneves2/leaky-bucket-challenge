export const PORT = Number(process.env.PORT ?? 3000);
export const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';

// In production restrict the origin (ex.: https://your-app.com)
export const CORS_ORIGIN = process.env.CORS_ORIGIN ?? '*';
