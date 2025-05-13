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

const kv = await Deno.openKv(
  "https://api.deno.com/databases/c9a7a255-e05e-423d-b6f6-b7c2c8a9d4ef/connect",
);

app.get("/api/benchmark/:type/:size/:base/:repeat", async (c) => {
  const { base, size, type, repeat } = c.req.param();
  const keys = ["benchmark", "time", "iter", "minmax", "p75", "p99", "p995"];
  const numio = [];
  const bignumber = [];

  for await (const key of keys) {
    numio.push((await kv.get([type, size, base, repeat, "numio", key])).value);
  }

  for await (const key of keys) {
    bignumber.push((await kv.get([type, size, base, repeat, "bignumber", key])).value);
  }

  return c.json({
    result: [numio, bignumber],
  });
});

Deno.serve({ port: 8000 }, app.fetch);
