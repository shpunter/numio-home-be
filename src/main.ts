import { Hono } from "jsr:@hono/hono";
import { cors } from "jsr:@hono/hono/cors";
import { data } from "./data.ts";

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

app.get("/api/benchmark/:type/:size/:base/:repeat", (c) => {
  const { base, size, type, repeat } = c.req.param();

  if (!data?.[type]?.[size].result?.[base]?.[repeat]) {
    return c.json({ msg: "No such data" }, 400);
  }

  const { result, value } = data[type][size];

  return c.json({
    value,
    result: result[base][repeat],
  });
});

Deno.serve({ port: 8000 }, app.fetch);
