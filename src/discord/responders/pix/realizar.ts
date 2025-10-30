import { createResponder, ResponderType } from "#base";
import { db } from "#database";
import { icon } from "#functions";
import { EmbedBuilder } from "discord.js";

createResponder({
    customId: "pix/:useridr/:userid/:amount/:description",
    types: [ResponderType.Button], cache: "cached",
    async run(interaction, params) {
        if (interaction.user.id !== params.useridr) {
            interaction.reply({ content: `**${icon.errado} | Apenas o usuário que iniciou a transferência pode confirmá-la.**`, ephemeral: true });
            return;
        }

        const user = await db.users.get(interaction.user);
        if (user.wallet < Number(params.amount)) {
            interaction.reply({ content: `**${icon.errado} | Você não tem lunares suficientes para realizar essa transferência.**`, ephemeral: true });
            return;
        }

        await db.users.updateOne({ id: interaction.user.id }, {
            $inc: {
                wallet: -Number(params.amount),
            },
        });
        await db.users.updateOne({ id: params.userid }, {
            $inc: {
                wallet: Number(params.amount),
            },
        });

        const emd = new EmbedBuilder()
            .setDescription(`# ${icon.pix} | Transferência Realizada!`)
            .addFields(
                { name: `${icon.mutios} Usuário Remetente`, value: `<@${params.useridr}>`, inline: true },
                { name: `${icon.mutios} Usuário Destinatário`, value: `<@${params.userid}>`, inline: true },
                { name: `${icon.coin} Valor`, value: `\`${params.amount}\` lunares`, inline: true },
                { name: `${icon.produto} Descrição`, value: `\`${params.description}\`` || "\`Sem descrição\`", inline: true },
            )
            .setColor(constants.colors.primary as `#${string}`)
            .setFooter({ text: 'AcipBlox - Economia e diversão.', iconURL: interaction.client.user?.displayAvatarURL({ forceStatic: false, size: 1024 }) })
            .setTimestamp();

        interaction.message.edit({ embeds: [emd], content:`${icon.certo} | Transferência de \`${params.amount}\` lunares para <@${params.userid}> realizada com sucesso!`, components: [] });
    },
});