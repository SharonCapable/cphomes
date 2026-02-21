import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL || "postgresql://postgres:w7HjaHXMQGEgrDzx@db.ykyhuhyrenisaglzboqa.supabase.co:5432/postgres",
  },
});
