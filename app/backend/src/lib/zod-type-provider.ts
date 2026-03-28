import type { FastifyTypeProvider } from "fastify";
import type {
  FastifySchemaCompiler,
  FastifySerializerCompiler,
} from "fastify/types/schema";
import { ZodError, type ZodType, type infer as ZodInfer } from "zod";

// ── Type provider ─────────────────────────────────────────────────────────────

export interface ZodTypeProvider extends FastifyTypeProvider {
  validator: this["schema"] extends ZodType
    ? ZodInfer<this["schema"]>
    : unknown;
  serializer: this["schema"] extends ZodType
    ? ZodInfer<this["schema"]>
    : unknown;
}

// ── Validator compiler (runs on incoming requests) ────────────────────────────

export const zodValidatorCompiler: FastifySchemaCompiler<ZodType> =
  ({ schema }) =>
  (data) => {
    const result = schema.safeParse(data);
    if (result.success) {
      return { value: result.data };
    }
    return { error: result.error };
  };

// ── Serializer compiler (runs on outgoing responses) ─────────────────────────

export const zodSerializerCompiler: FastifySerializerCompiler<ZodType> =
  ({ schema }) =>
  (data) =>
    JSON.stringify(schema.parse(data));

// ── Re-export for use in error handlers ──────────────────────────────────────

export { ZodError };
