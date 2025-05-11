import { Hono } from "jsr:@hono/hono";
import { cors } from "jsr:@hono/hono/cors";

const app = new Hono();

app.use('/api/*', cors())
app.use(
  '/api/*',
  cors({
    origin: '*',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
)

app.get("/api/hey", (c) => c.text("Hello Deno!"));

Deno.serve({ port: 8000 }, app.fetch);
