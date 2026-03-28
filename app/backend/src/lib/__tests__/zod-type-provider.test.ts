import { describe, it, expect, beforeEach } from "vitest";
import { z } from "zod";
import { createApp } from "../../app.js";
import {
  zodValidatorCompiler,
  zodSerializerCompiler,
} from "../zod-type-provider.js";

// ── Unit: Fastify compiler contracts ─────────────────────────────────────────

const schema = z.object({
  name: z.string(),
  age: z.number().int().positive(),
});

describe("zodValidatorCompiler", () => {
  const validate = zodValidatorCompiler({
    schema,
    method: "GET",
    url: "/",
  });

  it("returns { value } on valid input (Fastify contract)", () => {
    const result = validate({ name: "Alice", age: 30 });
    expect(result).toEqual({ value: { name: "Alice", age: 30 } });
  });

  it("strips unknown fields", () => {
    const result = validate({ name: "Alice", age: 30, extra: "ignored" });
    expect(result).toEqual({ value: { name: "Alice", age: 30 } });
  });

  it("returns { error } on invalid input (Fastify contract)", () => {
    const result = validate({ name: "Alice", age: -1 });
    expect(result).toHaveProperty("error");
    expect(result).not.toHaveProperty("value");
  });

  it("returns { error } when field is missing", () => {
    const result = validate({ name: "Alice" });
    expect(result).toHaveProperty("error");
  });

  it("returns { error } on wrong type", () => {
    const result = validate({ name: 123, age: 30 });
    expect(result).toHaveProperty("error");
  });
});

describe("zodSerializerCompiler", () => {
  const serialize = zodSerializerCompiler({
    schema,
    method: "GET",
    url: "/",
    httpStatus: "200",
  });

  it("returns a JSON string on valid data", () => {
    const result = serialize({ name: "Alice", age: 30 });
    expect(typeof result).toBe("string");
    expect(JSON.parse(result)).toEqual({ name: "Alice", age: 30 });
  });

  it("strips extra fields from response", () => {
    const result = serialize({ name: "Alice", age: 30, secret: "hidden" });
    expect(JSON.parse(result)).toEqual({ name: "Alice", age: 30 });
  });

  it("throws on invalid output data", () => {
    expect(() => serialize({ name: "Alice", age: -1 })).toThrow();
  });
});

// ── Integration: users routes via Fastify inject ──────────────────────────────

describe("POST /users", () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
  });

  it("creates a user and returns 201", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/users",
      payload: { name: "Alice", email: "alice@example.com" },
    });

    expect(res.statusCode).toBe(201);
    const body = res.json<{ id: string; name: string; email: string }>();
    expect(body).toMatchObject({ name: "Alice", email: "alice@example.com" });
    expect(typeof body.id).toBe("string");
  });

  it("returns 400 when name is empty", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/users",
      payload: { name: "", email: "alice@example.com" },
    });
    expect(res.statusCode).toBe(400);
  });

  it("returns 400 when email is invalid", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/users",
      payload: { name: "Alice", email: "not-an-email" },
    });
    expect(res.statusCode).toBe(400);
  });

  it("returns 400 when body is missing fields", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/users",
      payload: { name: "Alice" },
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("GET /users/:id", () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
  });

  it("returns 200 with user when found", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/users",
      payload: { name: "Bob", email: "bob@example.com" },
    });
    const { id } = created.json<{ id: string }>();

    const res = await app.inject({ method: "GET", url: `/users/${id}` });
    expect(res.statusCode).toBe(200);
    expect(
      res.json<{ id: string; name: string; email: string }>(),
    ).toMatchObject({
      id,
      name: "Bob",
      email: "bob@example.com",
    });
  });

  it("returns 404 when user does not exist", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/users/00000000-0000-0000-0000-000000000000",
    });
    expect(res.statusCode).toBe(404);
  });

  it("returns 400 when id is not a valid UUID", async () => {
    const res = await app.inject({ method: "GET", url: "/users/not-a-uuid" });
    expect(res.statusCode).toBe(400);
  });
});
