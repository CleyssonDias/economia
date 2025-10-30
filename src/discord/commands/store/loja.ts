import { createCommand } from "#base";
import { db } from "#database";
import { icon, res } from "#functions";
import { createSection } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle } from "discord.js";

createCommand({
    name: "loja",
    description: "💜 Loja de lunares",
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        const loja = await db.store.find();
        var buttons = [
           {
            nome:"**Página anterior:**",
            button: new ButtonBuilder({
                customId: `loja/prev`,
                emoji: icon.prev,
                style: ButtonStyle.Secondary,
                disabled:true
            })
           },
            {
            nome:"**Próxima Página:**",
            button: new ButtonBuilder({
                customId: `loja/next/1`,
                emoji: icon.next,
                style: ButtonStyle.Secondary,
                disabled:true
            })
           }
        ]
        if(loja[0].itens.length > 5){
            buttons = [
          {
            nome:"**Página anterior:**",
            button: new ButtonBuilder({
                customId: `loja/prev`,
                emoji: icon.prev,
                style: ButtonStyle.Secondary,
                disabled:true
            })
           },
            {
            nome:"**Próxima Página:**",
            button: new ButtonBuilder({
                customId: `loja/next/1`,
                emoji: icon.next,
                style: ButtonStyle.Secondary
            })
           }]
        }

        var cont = 0;

        interaction.reply(res.primary(
           `# ${icon.loja} | Loja de Lunares`,
            "-# Aqui estão os itens disponíveis na loja:",
            ...loja[0].itens.map((item: any) => {
                if(cont >= 5) return;
                 cont++
                return createSection(
                    `### ${icon.produto} Nome: ${item.name}\n${icon.coin} Valor: **\`${item.price} Lunares\`**\n-# ${icon.mutios} Quantidade: **\`${item.quantity}\`**\n-# ${icon.cargo} Cargo: **${item.cargoid ? `<@&${item.cargoid}>` : 'Nenhum'}**`,
                    new ButtonBuilder({
                        customId: `comprar/${item.id}`,
                        label: `Comprar ${item.name}`, 
                        style: ButtonStyle.Secondary,
                        emoji: icon.carrinho,
                    })
                )
               
            }),
            ...buttons.map((b) => {return createSection(
                    `${b.nome}`,b.button
                )}),
            "-# Loja de Lunares - Acipblox!",
        ));
    }
});