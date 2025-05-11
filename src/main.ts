import { Hono } from "jsr:@hono/hono";

const app = new Hono();

app.get("/api/hey", (c) => c.text("Hello Deno!"));

Deno.serve({ port: 8000 }, app.fetch);
