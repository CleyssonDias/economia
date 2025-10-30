import { Schema } from "mongoose";

const itemSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        cargoid: { type: String, required: false },
    }
)


export const storeSchema = new Schema(
    {
        itens: [itemSchema]
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