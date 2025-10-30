import { db } from "#database";
import { icon } from "#functions";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { storeCommad } from "./store.js";

storeCommad.subcommand({
    name: "remove",
    description: "🗑️ Remover item da loja.",
    options: [{
        name: "item",
        description: "🗑️ Nome do item a remover.",
        type: ApplicationCommandOptionType.String,
        required: true,
    }],
    async run(interaction) {
        try {
            const item = interaction.options.getString("item");
            const result = await db.store.updateOne({}, { $pull: { itens: { name: item } } });
            if (!result.modifiedCount) {
                const embed = new EmbedBuilder()
                    .setDescription(`## ${icon.error} O item \`${item}\` não foi encontrado na loja.`)
                    .setColor(constants.colors.error as `#${string}`)
                    .setFooter({ text: 'AcipBlox - Economia e diversão.', iconURL: interaction.client.user?.displayAvatarURL({ forceStatic: false, size: 1024 }) })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                return;
            }
            const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setTitle(`${icon.loja} | Loja lunares`)
                .setDescription(`-# O item \`${item}\` foi removido com sucesso!`)
                .setColor(constants.colors.primary as `#${string}`)
                .setFooter({ text: 'AcipBlox - Economia e diversão.', iconURL: interaction.client.user?.displayAvatarURL({ forceStatic: false, size: 1024 }) })
                .setTimestamp()
                .setThumbnail(interaction.user.displayAvatarURL({ forceStatic: false, size: 1024 }));
            await interaction.reply({ embeds: [embed] });
        } catch (error: any) {
            const embed = new EmbedBuilder()
                .setDescription(`## ${icon.error} Ocorreu um erro ao remover o item: \`${error?.message || error}\``)
                .setColor(constants.colors.error as `#${string}`)
                .setFooter({ text: 'AcipBlox - Economia e diversão.', iconURL: interaction.client.user?.displayAvatarURL({ forceStatic: false, size: 1024 }) })
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
        }
    },
});