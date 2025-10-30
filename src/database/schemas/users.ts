import { Schema } from "mongoose";
import { t } from "../utils.js";

export const userSchema = new Schema(
    {
        id: t.string,
        wallet: { type: Number, default: 0 },
        mov: {
            chat: {
                messages: { type: Number, default: 0 },
            }
        }
    },
    {
        statics: {
            async get(member: { id: string }) {
                const query = { id: member.id };
                return await this.findOne(query) ?? this.create(query);
            }
        }
    },
);