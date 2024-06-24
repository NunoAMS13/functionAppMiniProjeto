module.exports = async function (context, myTimer) {
    const { CosmosClient } = require("@azure/cosmos");
    const nodemailer = require("nodemailer");

    const connectionString = "https://miniprojeto2324.documents.azure.com:443/";
    const key = "qdE7xj1KI1eN3rp60eKelTu9ghdv5HRH2WRi0Nla9powRJbz4BgL2Os8EmW4ucwQuoKCmxVMAm6TACDbWWCyVQ==";
    const databaseId = "MiniProjeto";
    const containerId = "Receitas";

    const email = "miniprojcn@gmail.com";
    const password = "hncd eusl ushr erae";
    const emailTo = "silva.nuno@ipcbcampus.pt";

    const client = new CosmosClient({ endpoint: connectionString, key });
    const database = client.database(databaseId);
    const container = database.container(containerId);
    console.log('a funcionar');

    // Obter receitas da Cosmos DB
    const { resources: receitas } = await container.items.readAll().fetchAll();

    if (receitas.length > 0) {
        // Selecionar uma receita aleatória
        const receita = receitas[Math.floor(Math.random() * receitas.length)];

        // Configurar o transportador de e-mail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: password
            }
        });

        // Configurar o e-mail
        const mailOptions = {
            from: email,
            to: emailTo,
            subject: `Receita do Dia: ${receita.nome}`,
            html: `
                <h1>${receita.nome}</h1>
                <p>${receita.descricao}</p>
                <img src="${receita.imagem}" alt="${receita.nome}">
                <h3>Ingredientes:</h3>
                <ul>
                    ${receita.ingredientes.map(ing => `<li>${ing.nome}: ${ing.quantidade}</li>`).join('')}
                </ul>
                <h3>Preparação:</h3>
                <ol>
                    ${receita.preparacao.map(step => `<li>${step}</li>`).join('')}
                </ol>
            `
        };

        // Enviar o e-mail
        await transporter.sendMail(mailOptions);
        context.log('E-mail enviado com sucesso.');
    } else {
        context.log('Nenhuma receita encontrada.');
    }
};
