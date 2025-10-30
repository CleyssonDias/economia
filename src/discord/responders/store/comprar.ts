import { createResponder, ResponderType } from "#base";
import { db } from "#database";
import { env } from "#env";
import { icon, res } from "#functions";

createResponder({
    customId: "comprar/:prodid",
    types: [ResponderType.Button], cache: "cached",
    async run(interaction, {prodid}) {
        const loja = await db.store.find();
        const produto = loja[0].itens.find((item: any) => item.id === prodid);
        if(!produto){
            interaction.reply({ content: `**${icon.errado} | Produto não encontrado na loja.**`, ephemeral: true });
            return;
        }

        const user = await db.users.get(interaction.user);
        if(user.wallet < produto.price){
            interaction.reply({ content: `**${icon.errado} | Você não tem lunares suficientes para comprar este item.**`, ephemeral: true });
            return;
        }
        if(produto.quantity <= 0){
            interaction.reply({ content: `**${icon.errado} | Este item está esgotado.**`, ephemeral: true });
            return;
        }
        await db.users.updateOne({ id: interaction.user.id }, {
            $inc: {
                wallet: -produto.price,
            },
        });
        // Atualiza a quantidade do produto sem depender do schema
        const lojaAtual = await db.store.find();
        const idx = lojaAtual[0].itens.findIndex((item: any) => item.id === prodid);
        if (idx !== -1) {
            const update: any = {};
            update[`itens.${idx}.quantity`] = -1;
            await db.store.updateOne({}, { $inc: update });
        }
        
        if ( produto.cargoid ) {
            const guild = interaction.client.guilds.cache.get( env.GUILD_ID as string );
            const member = guild?.members.cache.get( interaction.user.id );
            if ( member ) {
                member.roles.add( produto.cargoid );
            }
        } else {
           const canal = await interaction.guild.channels.create({
                name: `📦-pedido-${interaction.user.username}`,
                type: 0, 
                parent: constants.categorias.compras,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: ["ViewChannel", "SendMessages"], 
                    },
                ],
            });
            await canal.send(res.primary(
                `# ${icon.mutios} | Pedido lunares`,
                `### ${icon.produto} Usuário **${interaction.user}** comprou o item **\`${produto.name}\`** por **\`${produto.price}\`** lunares.`,
                `-# Aguarde que em breve um membro da equipe irá atendê-lo.`
            ));

            await interaction.reply({ content: `**${icon.certo} | Você comprou o item **\`${produto.name}\`** por **\`${produto.price}\`** lunares com sucesso!**\n-# Receba seu pedido em: <#${canal.id}>`, ephemeral: true });
            return;
        }

        interaction.reply({ content: `**${icon.certo} | Você comprou o item **\`${produto.name}\`** por **\`${produto.price}\`** lunares com sucesso!**`, ephemeral: true });

    },
});