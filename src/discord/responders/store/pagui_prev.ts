import { createResponder, ResponderType } from "#base";
import { db } from "#database";
import { icon, res } from "#functions";
import { createSection } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle } from "discord.js";

createResponder({
    customId: "loja/prev/:number",
    types: [ResponderType.Button], cache: "cached",
    async run(interaction, params) {
        const loja = await db.store.find();
        const itens = loja[0]?.itens || [];
        const itensPorPagina = 5;
        const paginaAtual = Number(params.number) || 0;
        const totalPaginas = Math.ceil(itens.length / itensPorPagina);

        // Garante que a página está dentro dos limites
        const pagina = Math.max(0, Math.min(paginaAtual, totalPaginas - 1));
        const inicio = pagina * itensPorPagina;
        const fim = inicio + itensPorPagina;
        const itensPagina = itens.slice(inicio, fim);

        // Botões de navegação
        const navButtons = [
            new ButtonBuilder({
                customId: `loja/next/${pagina + 1}`,
                style: ButtonStyle.Secondary,
                emoji: icon.next,
                disabled: pagina >= totalPaginas - 1
            }),
            new ButtonBuilder({
                customId: `loja/prev/${pagina - 1}`,
                emoji: icon.prev,
                style: ButtonStyle.Secondary,
                disabled: pagina === 0
            })
        ];

        await interaction.update(res.primary(
            `# ${icon.loja} | Loja de Lunares\n## ${icon.page} Página ${pagina + 1} de ${totalPaginas}`,
            ...itensPagina.map((item) => createSection(
                `### ${icon.produto} Nome: ${item.name}\n${icon.coin} Valor: **\`${item.price} Lunares\`**\n-# ${icon.mutios} Quantidade: **\`${item.quantity}\`**\n-# ${icon.cargo} Cargo: **${item.cargoid ? `<@&${item.cargoid}>` : 'Nenhum'}**`,
                new ButtonBuilder({
                    customId: `comprar/${item.id}`,
                    label: `Comprar ${item.name}`,
                    style: ButtonStyle.Secondary,
                    emoji: icon.carrinho,
                })
            )),
            createSection("**Página anterior:**", navButtons[1]),
            createSection("**Próxima página:**", navButtons[0]),
            "-# Loja de Lunares - Acipblox!"
        ));
    },
});
