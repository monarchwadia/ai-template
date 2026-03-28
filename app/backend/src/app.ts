import Fastify from "fastify";
import { ZodError } from "zod";
import {
  zodValidatorCompiler,
  zodSerializerCompiler,
  type ZodTypeProvider,
} from "./lib/zod-type-provider.js";
import { usersRoutes } from "./routes/users.js";

export function createApp() {
  const app = Fastify({ logger: false })
    .withTypeProvider<ZodTypeProvider>()
    .setValidatorCompiler(zodValidatorCompiler)
    .setSerializerCompiler(zodSerializerCompiler);

  app.setErrorHandler((error, _req, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({ issues: error.issues });
    }
    reply.send(error);
  });

  app.register(usersRoutes);

  return app;
}
