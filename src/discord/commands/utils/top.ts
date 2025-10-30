import { createCommand } from "#base";
import { db } from "#database";
import { icon, res } from "#functions";
import { ApplicationCommandType } from "discord.js";

createCommand({
    name: "top",
    description: "🏆 Veja o top 15 de lunares e sua posição.",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const users = await db.users.find().sort({ lunares: -1 }).limit(15);
        const allUsers = await db.users.find().sort({ lunares: -1 });
        const authorId = interaction.user.id;
        const authorIndex = allUsers.findIndex((u: any) => u.id === authorId);
        const authorData = allUsers[authorIndex];

        let msg = `# ${icon.coin} | Top 15 Lunares\n\n`;
        users.forEach((user: any, i: number) => {
            msg += `**${i + 1}.** <@${user.id}> — \`${user.wallet ?? 0}\` lunares ${icon.coin}\n`;
        });
        msg += `\n`;
        if (authorIndex !== -1) {
            msg += `Sua posição: **${authorIndex + 1}º** — \`${authorData.wallet ?? 0}\` lunares ${icon.coin}`;
        } else {
            msg += `Você não está no ranking.`;
        }

        await interaction.reply(res.primary(msg).with({ flags:[] }));
    }
});
