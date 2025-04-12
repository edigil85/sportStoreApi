// src/middleware/security.ts
import helmet from 'helmet';
import { Express } from 'express';

export const setupSecurity = (app: Express) => {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false, //config crooss-origin-embedder-policy
    })
  );
};
