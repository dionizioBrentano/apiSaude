// api/src/controllers/OrganizacaoController.js
const db = require('../models');
const Organizacao = db.Organizacao;
const Membro = db.Membro; // Para associar o criador como membro da nova organização

class OrganizacaoController {
    /**
     * @route POST /api/v1/organizacoes
     * @description Cria uma nova organização ou subgrupo.
     * @access Private (Requer token de autenticação)
     */
    static async criarOrganizacao(req, res, next) {
        console.log('[OrganizacaoController.criarOrganizacao] Iniciando criação de organização/subgrupo.');
        const { nome, tipo, organizacaoPaiId } = req.body;
        const criadorId = req.user.id; // ID do usuário que está fazendo a requisição (do token)

        try {
            if (!nome || !tipo) {
                return res.status(400).json({ message: 'Nome e tipo da organização são obrigatórios.' });
            }
            
            // Opcional: Verificar se organizacaoPaiId existe e se o criador tem permissão para criar nela
            if (organizacaoPaiId) {
                const orgPai = await Organizacao.findByPk(organizacaoPaiId);
                if (!orgPai) {
                    console.warn(`[OrganizacaoController.criarOrganizacao] Organização pai ID: ${organizacaoPaiId} não encontrada.`);
                    return res.status(404).json({ message: 'Organização pai não encontrada.' });
                }
                // TODO: Adicionar verificação de permissão: o criadorId deve ser líder na organizacaoPaiId
            }

            console.log(`[OrganizacaoController.criarOrganizacao] Criando organização: ${nome}, Tipo: ${tipo}, Pai: ${organizacaoPaiId || 'Nenhum'}, Criador: ${criadorId}`);
            const novaOrganizacao = await Organizacao.create({
                nome,
                tipo,
                organizacaoPaiId: organizacaoPaiId || null, // Se não for fornecido, será um grupo raiz (ou subgrupo direto do usuário)
                criadorId: criadorId // Associando o criador à organização
            });

            // Adicionar o criador como membro da nova organização/subgrupo
            console.log(`[OrganizacaoController.criarOrganizacao] Adicionando criador (${criadorId}) como membro da nova organização (${novaOrganizacao.id})...`);
            await Membro.create({
                organizacaoId: novaOrganizacao.id,
                pessoaId: criadorId,
                funcao: 'LIDER' // O criador é sempre líder do que ele cria
            });

            console.log(`[OrganizacaoController.criarOrganizacao] Organização ${novaOrganizacao.id} criada com sucesso.`);
            res.status(201).json({ 
                message: 'Organização criada com sucesso!', 
                organizacao: novaOrganizacao 
            });

        } catch (error) {
            console.error('[OrganizacaoController.criarOrganizacao] Erro ao criar organização:', error);
            next(error); // Encaminha o erro para o middleware de tratamento de erros global
        }
    }
}

module.exports = OrganizacaoController;