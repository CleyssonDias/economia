import { db } from "#database";
import { icon } from "#functions";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { storeCommad } from "./store.js";

storeCommad.subcommand({
    name: "add",
    description: "⚙ Comando de administração da loja.",
    options: [{
        name: "item",
        description: "⚙ Nome do item.",
        type: ApplicationCommandOptionType.String,
        required: true,
    },{
        name: "valor",
        description: "⚙ Valor do item, Ex: (23.2).",
        type: ApplicationCommandOptionType.String,
        required: true,
    },{
        name: "quantidade",
        description: "⚙ Quantidade do item, Ex: (12).",
        type: ApplicationCommandOptionType.Number,
        required: true,
    },{
        name: "cargo",
        description: "⚙ Cargo do item que irá ganhar ao comprar.",
        type: ApplicationCommandOptionType.Role,
    }],
    async run(interaction) {
        try {
            const item = interaction.options.getString("item");
            const valor: any = interaction.options.getString("valor");
            const quantidade = interaction.options.getNumber("quantidade");
            const cargo = interaction.options.getRole("cargo");

            // Verifica se já existe um item com o mesmo nome
            const exists = await db.store.findOne({ "itens.name": item });
            if (exists) {
                const embed = new EmbedBuilder()
                    .setDescription(`## ${icon.error} O item \`${item}\` já existe na loja. Não é possível adicionar duplicado.`)
                    .setColor(constants.colors.error as `#${string}`)
                    .setFooter({ text: 'AcipBlox - Economia e diversão.', iconURL: interaction.client.user?.displayAvatarURL({ forceStatic: false, size: 1024 }) })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                return;
            }

            if (cargo) {
                await db.store.updateOne({},
                    { $push: { itens: { name: item, price: parseFloat(valor), quantity: Number(quantidade), cargoid: cargo.id } } },
                    { upsert: true }
                );
            } else {
                await db.store.updateOne({},
                    { $push: { itens: { name: item, price: parseFloat(valor), quantity: Number(quantidade) } } },
                    { upsert: true }
                );
            }

            const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setTitle(`${icon.loja} | Loja lunares`)
                .setThumbnail(interaction.user.displayAvatarURL({ forceStatic: false, size: 1024 }))
                .setDescription(`-# O item \`${item}\` foi adicionado com sucesso!`)
                .addFields(
                    { name: `${icon.tag} nome:`, value: `**\`${item}\`**`, inline: true },
                    { name: `${icon.coin} Preço:`, value: `**\`${parseFloat(valor)} lunares\`**`, inline: true },
                    { name: `${icon.mutios} Quantidade:`, value: `**\`${quantidade}\`**`, inline: true },
                ).setColor(constants.colors.primary as `#${string}`)
                .setFooter({ text: 'AcipBlox - Economia e diversão.', iconURL: interaction.client.user?.displayAvatarURL({ forceStatic: false, size: 1024 }) })
                .setTimestamp();
            if (cargo) {
                embed.addFields(
                    { name: `${icon.cargo} Cargo:`, value: `**<@&${cargo.id}>**`, inline: true },
                )
            }
            await interaction.reply({ embeds: [embed] });
        } catch (error: any) {
            const embed = new EmbedBuilder()
                .setDescription(`## ${icon.error} Ocorreu um erro ao adicionar o item: \`${error?.message || error}\``)
                .setColor(constants.colors.error as `#${string}`)
                .setFooter({ text: 'AcipBlox - Economia e diversão.', iconURL: interaction.client.user?.displayAvatarURL({ forceStatic: false, size: 1024 }) })
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
        }
    },
})