import { env } from "#env";
import chalk from "chalk";
import mongoose, { InferSchemaType, model } from "mongoose";
import { storeSchema } from "./schemas/store.js";
import { userSchema } from "./schemas/users.js";

try {
   console.log(chalk.blue("Connecting to MongoDB..."));
   await mongoose.connect(env.MONGO_URI, { 
      dbName: env.DATABASE_NAME || "database" 
   });
   console.log(chalk.green("MongoDB connected"));
} catch(err){
   console.error(err);
   process.exit(1);
}

export const db = {
   users: model("user", userSchema, "users"),
   store: model("store", storeSchema, "stores")
};

export type UserSchema = InferSchemaType<typeof userSchema>;
export type StoreSchema = InferSchemaType<typeof storeSchema>;