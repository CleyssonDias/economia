import { createCommand } from "#base";
import { db } from "#database";
import { icon } from "#functions";
import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

createCommand({
    name: "movchat",
    description: "💜 Comando para ver as sua movimentações de chat.",
    type: ApplicationCommandType.ChatInput,
     options: [
        {
            name: 'user',
            description: 'Ver estatísticas de outro usuário (opcional)',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
    async run(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getUser('user') ?? interaction.user;

        const messageCount = (await db.users.get(target)).mov?.chat?.messages ?? 0;
        const coins = (await db.users.get(target)).wallet ?? 0;

        const maxMessages = 4800;
        const percent = Math.min(100, Math.floor((messageCount / maxMessages) * 100));
        const blocksFilled = Math.round((percent / 100) * 10);
        const progressBar = `${'▰'.repeat(blocksFilled)}${'▱'.repeat(10 - blocksFilled)}  ${percent}%`;

        const embed = new EmbedBuilder()
            .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL() })
            .setTitle(`${icon.chat} | Mov. Chat`)
            .setThumbnail(target.displayAvatarURL({ forceStatic: false, size: 1024 }))
            .setDescription(target.id === interaction.user.id ? `-# ${icon.estatisticas} Aqui está a quantidade de mensagens que você enviou:` : `${icon.estatisticas} Mensagens de **${target.tag}**:`)
            .addFields(
                { name: `${icon.outrochat} Mensagens enviadas:`, value: `**\`${messageCount.toLocaleString()}\`**`, inline: true },
                { name: `${icon.tempo} Progresso:`, value: `**\`${progressBar}\`**`, inline: true },
                { name: `${icon.coin} Lunares:`, value: `**\`${coins}\`**`, inline: true },
            )
            .setColor(constants.colors.primary as `#${string}`)
            .setFooter({ text: 'AcipBlox - Economia e diversão.', iconURL: interaction.client.user?.displayAvatarURL({ forceStatic: false, size: 1024 }) })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
});