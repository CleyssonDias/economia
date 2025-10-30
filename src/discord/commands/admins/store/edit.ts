import { db } from "#database";
import { icon } from "#functions";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { storeCommad } from "./store.js";

storeCommad.subcommand({
    name: "edit",
    description: "✏️ Editar item da loja.",
    options: [{
        name: "item",
        description: "✏️ Nome do item a editar.",
        type: ApplicationCommandOptionType.String,
        required: true,
    },{
        name: "valor",
        description: "✏️ Novo valor do item.",
        type: ApplicationCommandOptionType.String,
    },{
        name: "quantidade",
        description: "✏️ Nova quantidade do item.",
        type: ApplicationCommandOptionType.Number,
    },{
        name: "cargo",
        description: "✏️ Novo cargo do item.",
        type: ApplicationCommandOptionType.Role,
    }],
    async run(interaction) {
        try {
            const item = interaction.options.getString("item");
            const valor = interaction.options.getString("valor");
            const quantidade = interaction.options.getNumber("quantidade");
            const cargo = interaction.options.getRole("cargo");
            // Busca o documento e o índice do item
            const doc = await db.store.findOne({ "itens.name": item });
            if (!doc) {
                const embed = new EmbedBuilder()
                    .setDescription(`## ${icon.error} O item \`${item}\` não foi encontrado na loja.`)
                    .setColor(constants.colors.error as `#${string}`)
                    .setFooter({ text: 'AcipBlox - Economia e diversão.', iconURL: interaction.client.user?.displayAvatarURL({ forceStatic: false, size: 1024 }) })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                return;
            }
            const idx = doc.itens.findIndex((i: any) => i.name === item);
            if (idx === -1) {
                const embed = new EmbedBuilder()
                    .setDescription(`## ${icon.error} O item \`${item}\` não foi encontrado na loja.`)
                    .setColor(constants.colors.error as `#${string}`)
                    .setFooter({ text: 'AcipBlox - Economia e diversão.', iconURL: interaction.client.user?.displayAvatarURL({ forceStatic: false, size: 1024 }) })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                return;
            }
            const update: any = {};
            if (valor !== null) update[`itens.${idx}.price`] = parseFloat(valor);
            if (quantidade !== null) update[`itens.${idx}.quantity`] = quantidade;
            if (cargo !== null) {
                update[`itens.${idx}.cargoid`] = cargo.id;
            } else if (interaction.options.getRole("cargo") === null) {
                update[`itens.${idx}.cargoid`] = undefined;
            }
            await db.store.updateOne({ _id: doc._id }, { $set: update });

            // Busca o item atualizado
            const updatedDoc = await db.store.findOne({ _id: doc._id });
            const updatedItem: any = updatedDoc?.itens[idx];

            const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setTitle(`${icon.loja} | Loja lunares`)
                .setDescription(`-# O item \`${item}\` foi editado com sucesso!`)
                .setColor(constants.colors.primary as `#${string}`)
                .setFooter({ text: 'AcipBlox - Economia e diversão.', iconURL: interaction.client.user?.displayAvatarURL({ forceStatic: false, size: 1024 }) })
                .setTimestamp()
                .setThumbnail(interaction.user.displayAvatarURL({ forceStatic: false, size: 1024 }));

            // Adiciona campos ao embed
            embed.addFields(
                { name: `${icon.tag} Nome:`, value: `**\`${updatedItem?.name || item}\`**`, inline: true },
                { name: `${icon.coin} Preço:`, value: `**\`${updatedItem?.price !== undefined ? updatedItem.price : "-"} lunares\`**`, inline: true },
                { name: `${icon.mutios} Quantidade:`, value: `**\`${updatedItem?.quantity !== undefined ? updatedItem.quantity : "-"}\`**`, inline: true }
            );
            if (updatedItem?.cargoid) {
                embed.addFields({ name: `${icon.cargo} Cargo:`, value: `**<@&${updatedItem.cargoid}>**`, inline: true });
            } else {
                embed.addFields({ name: `${icon.cargo} Cargo:`, value: `Nenhum`, inline: true });
            }
            await interaction.reply({ embeds: [embed] });
        } catch (error: any) {
            const embed = new EmbedBuilder()
                .setDescription(`## ${icon.error} Ocorreu um erro ao editar o item: \`${error?.message || error}\``)
                .setColor(constants.colors.error as `#${string}`)
                .setFooter({ text: 'AcipBlox - Economia e diversão.', iconURL: interaction.client.user?.displayAvatarURL({ forceStatic: false, size: 1024 }) })
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
        }
    },
});