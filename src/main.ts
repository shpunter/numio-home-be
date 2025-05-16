import { Hono } from "jsr:@hono/hono";
import { cors } from "jsr:@hono/hono/cors";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
    credentials: true,
  }),
);

const kv = await Deno.openKv();

app.get("/api/benchmark/:type/:size/:base/:repeat", async (c) => {
  const { base, size, type, repeat } = c.req.param();

  const numio = await Array.fromAsync(
    kv.list({ prefix: [type, size, base, repeat, "numio"] }),
  );
  
  const bignumber = await Array.fromAsync(
    kv.list({ prefix: [type, size, base, repeat, "bignumber"] }),
  );

  return c.json({
    result: [
      numio.map(({ value }) => value),
      bignumber.map(({ value }) => value),
    ],
  });
});

Deno.serve({ port: 8000 }, app.fetch);
