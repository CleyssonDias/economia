import { createCommand } from "#base";
import { ApplicationCommandType, PermissionFlagsBits } from "discord.js";

export const storeCommad = createCommand({
    name: "store",
    description: "⚙ Comando de administração da loja.",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: [PermissionFlagsBits.Administrator] 
});