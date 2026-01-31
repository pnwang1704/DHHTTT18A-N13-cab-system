const { z } = require("zod");

const registerSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(6).max(20).optional(),
    password: z.string().min(8).max(128),
    role: z.enum(["USER", "DRIVER", "ADMIN"]).optional(),
  })
  .refine((v) => v.email || v.phone, { message: "email_or_phone_required" });

const loginSchema = z.object({
  identifier: z.string().min(3).max(255),
  password: z.string().min(8).max(128),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(20),
});

const logoutSchema = z.object({
  refreshToken: z.string().min(20),
});

module.exports = { registerSchema, loginSchema, refreshSchema, logoutSchema };
