import { createCommand } from "#base";
import { icon } from "#functions";
import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

createCommand({
    name: "pix",
    description: "💸 Transfira lunares para outro usuário.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuario",
            description: "💸 Usuário para receber lunares.",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "quantidade",
            description: "💸 Quantidade de lunares para transferir.",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: "descricao",
            description: "💸 Descrição da transferência.",
            type: ApplicationCommandOptionType.String,
        },
    ],
    async run(interaction) {
        const user = interaction.options.getUser("usuario");
        const amount = interaction.options.getNumber("quantidade");
        const description = interaction.options.getString("descricao");
        if (!user || !amount) return 

        const embed = new EmbedBuilder()
            .setDescription(`# ${icon.pix} | Sistema PIX!`)
            .addFields(
                { name: `${icon.mutios} Usuário a receber:`, value: `<@${user.id}>`, inline: true },
                { name: `${icon.coin} Quantidade:`, value: `\`${amount}\` lunares`, inline: true },
                { name: `${icon.produto} Descrição:`, value: `\`${description ? description : "Sem descrição"}\``, inline: true }
            )
            .setColor(constants.colors.primary as `#${string}`)
            .setFooter({ text: 'AcipBlox - Economia e diversão.', iconURL: interaction.client.user?.displayAvatarURL({ forceStatic: false, size: 1024 }) })
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL({ forceStatic: false, size: 1024 }))

        const buttonRealizar = new ButtonBuilder({
            emoji: icon.certo
        })
            .setCustomId(`pix/${interaction.user.id}/${user.id}/${amount}/${description}`)
            .setLabel('Realizar Transferência')
            .setStyle(ButtonStyle.Success)

        const buttonCancelar = new ButtonBuilder({
            emoji: icon.errado
        })
            .setCustomId(`pix/cancelar/${interaction.user.id}/${user.id}/${amount}/${description}`)
            .setLabel('Cancelar Transferência')
            .setStyle(ButtonStyle.Danger)
            

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonRealizar, buttonCancelar);
        await interaction.reply({ embeds: [embed], components: [row] });
    }
});
