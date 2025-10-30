import { createEvent } from "#base";
import { db } from "#database";
import { icon, sleep } from "#functions";
import { EmbedBuilder } from "discord.js";

createEvent({
    name: "MovChat",
    event: "messageCreate",
    async run(msg) {
        if (msg.author.bot) return;
        const user = await db.users.get(msg.author);
        if (user.mov?.chat?.messages === undefined) return;

        if (user.mov?.chat?.messages >= 4800 ) {
            await db.users.updateOne(
                { id: msg.author.id },
                { $inc: { "wallet": 1 } }
            );

            await db.users.updateOne(
                { id: msg.author.id },
                { $set: { "mov.chat.messages": 0 } }
            );

            const emd = new EmbedBuilder()
                .setTitle(`${icon.chat} | Mov. Chat`)
                .setDescription(`Parabéns **${msg.author.username}**, você recebeu **\`+1\` lunares ${icon.coin}** por suas atividades em chats!\n **Continue assim!** ${icon.coracao}`)
                .setColor(constants.colors.primary as `#${string}`)
                .setTimestamp()
                .setThumbnail(msg.author.displayAvatarURL({ forceStatic: false, size: 1024 }))
                .setFooter({ text: "AcipBlox - Economia e diversão.", iconURL: msg.client.user.displayAvatarURL({ forceStatic: false, size: 1024 }) });
            const send = await msg.channel.send({ content: `**Parabéns ${msg.author}!**`, embeds: [emd] });
            await sleep(10000)
            await send.delete();
        }

        await db.users.updateOne(
            { id: msg.author.id },
            { $inc: { "mov.chat.messages": 1 } }
        );
        
    }
});