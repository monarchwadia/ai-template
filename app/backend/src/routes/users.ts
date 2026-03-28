import { z } from "zod";
import type { ZodTypeProvider } from "../lib/zod-type-provider.js";
import type { FastifyPluginAsync } from "fastify";

const CreateUserBody = z.object({
  name: z.string().min(1),
  email: z.email(),
});

const UserResponse = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

const UserIdParams = z.object({
  id: z.uuid(),
});

const NotFoundResponse = z.object({
  message: z.string(),
});

// In-memory store for demo purposes
const users = new Map<string, { id: string; name: string; email: string }>();

export const usersRoutes: FastifyPluginAsync = (fastify) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.post("/users", {
    schema: {
      body: CreateUserBody,
      response: { 201: UserResponse },
    },
    async handler(req, reply) {
      const { name, email } = req.body;
      const id = crypto.randomUUID();
      const user = { id, name, email };
      users.set(id, user);
      return reply.status(201).send(user);
    },
  });

  app.get("/users/:id", {
    schema: {
      params: UserIdParams,
      response: { 200: UserResponse, 404: NotFoundResponse },
    },
    async handler(req, reply) {
      const user = users.get(req.params.id);
      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }
      return reply.status(200).send(user);
    },
  });

  return Promise.resolve();
};
