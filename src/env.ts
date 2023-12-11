// Uses zod to validate environment variables are in the correct format
// CLIENT_ID="YOUR_CLIENT_ID"
// CLIENT_SECRET="YOUR_CLIENT_SECRET"
// TOKEN="YOUR_BOT_TOKEN"

import { z } from 'zod';
import { Result, Err, Ok } from 'ts-results';
import dotenv from "dotenv";

dotenv.config();

export const envSchema = z.object({
  CLIENT_ID: z.string(),
  CLIENT_SECRET: z.string(),
  TOKEN: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const env: Result<Env, string> = (() => {
    const parsedEnv = envSchema.safeParse(process.env);
    if (!parsedEnv.success) return Err(parsedEnv.error.toString());

    // Make sure the environment variables have been set
    const envData = parsedEnv.data;
    if (envData.CLIENT_ID === "YOUR_CLIENT_ID" || envData.CLIENT_ID === "") {
        return Err("You need to set your CLIENT_ID in your .env file");
    }

    if (envData.CLIENT_SECRET === "YOUR_CLIENT_SECRET" || envData.CLIENT_SECRET === "") {
        return Err("You need to set your CLIENT_SECRET in your .env file");
    }

    if (envData.TOKEN === "YOUR_BOT_TOKEN" || envData.TOKEN === "") {
        return Err("You need to set your TOKEN in your .env file");
    }

    return Ok(envData);
})();