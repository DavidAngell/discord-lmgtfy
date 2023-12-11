// Uses zod to validate environment variables are in the correct format
// CLIENT_ID="YOUR_CLIENT_ID"
// TOKEN="YOUR_BOT_TOKEN"

import { z } from 'zod';
import dotenv from "dotenv";

dotenv.config();

export const envSchema = z.object({
  CLIENT_ID: z.string(),
  TOKEN: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = (() => {
    const parsedEnv = envSchema.safeParse(process.env);
    if (!parsedEnv.success) {
        throw new Error(parsedEnv.error.message);
    }

    // Make sure the environment variables have been set
    const envData = parsedEnv.data;
    if (envData.CLIENT_ID === "YOUR_CLIENT_ID" || envData.CLIENT_ID === "") {
        throw new Error("You need to set your CLIENT_ID in your .env file");
    }

    if (envData.TOKEN === "YOUR_BOT_TOKEN" || envData.TOKEN === "") {
        throw new Error("You need to set your TOKEN in your .env file");
    }

    return envData;
})();