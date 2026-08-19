<?php
/**
 * API para CRUD e Detalhes Dinâmicos de Jogos
 * Projeto: TCC (Game Search)
 * Linguagem: Português do Brasil (PT-BR)
 */

require_once '../config.php';

header('Content-Type: application/json');

$acao = $_GET['acao'] ?? '';

switch ($acao) {
    case 'listar':
        listarJogos($conexao);
        break;
    case 'buscar':
        buscarJogo($conexao);
        break;
    case 'cadastrar':
        cadastrarJogo($conexao);
        break;
    case 'atualizar':
        atualizarJogo($conexao);
        break;
    case 'excluir':
        excluirJogo($conexao);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Ação inválida solicitada']);
        break;
}

/**
 * Lista todos os jogos cadastrados no banco de dados
 */
function listarJogos($conexao) {
    $sql = "SELECT 
                id, slug, nome, descricao, preco, img, 
                categoria, plataforma, genero, etaria,
                ano, status, 
                avaliacao_gameplay, avaliacao_graficos, avaliacao_historia,
                desconto, data_lancamento, data_cadastro
            FROM jogos 
            ORDER BY id DESC";
    
    $result = $conexao->query($sql);
    $jogos = [];
    
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $row['preco'] = floatval($row['preco']);
            $row['etaria'] = normalizarEtaria($row['etaria'] ?? null);
            $row['desconto'] = floatval($row['desconto'] ?? 0);
            $row['avaliacao_gameplay'] = floatval($row['avaliacao_gameplay'] ?? 0);
            $row['avaliacao_graficos'] = floatval($row['avaliacao_graficos'] ?? 0);
            $row['avaliacao_historia'] = floatval($row['avaliacao_historia'] ?? 0);
            $jogos[] = $row;
        }
    }
    
    echo json_encode(['success' => true, 'jogos' => $jogos]);
}

/**
 * Busca um jogo específico pelo ID ou Slug
 */
function buscarJogo($conexao) {
    $id = intval($_GET['id'] ?? 0);
    $slug = trim($_GET['slug'] ?? '');
    
    if ($id <= 0 && empty($slug)) {
        echo json_encode(['success' => false, 'message' => 'Parâmetro de identificação (ID ou Slug) inválido ou ausente']);
        return;
    }
    
    if ($id > 0) {
        $sql = "SELECT id, slug, nome, descricao, preco, img, categoria, plataforma, genero, etaria, ano, status, avaliacao_gameplay, avaliacao_graficos, avaliacao_historia, desconto, data_lancamento, data_cadastro FROM jogos WHERE id = ?";
        $stmt = $conexao->prepare($sql);
        $stmt->bind_param("i", $id);
    } else {
        $sql = "SELECT id, slug, nome, descricao, preco, img, categoria, plataforma, genero, etaria, ano, status, avaliacao_gameplay, avaliacao_graficos, avaliacao_historia, desconto, data_lancamento, data_cadastro FROM jogos WHERE slug = ?";
        $stmt = $conexao->prepare($sql);
        $stmt->bind_param("s", $slug);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Jogo não encontrado na base de dados']);
        $stmt->close();
        return;
    }
    
    $jogo = $result->fetch_assoc();
    $jogo['preco'] = floatval($jogo['preco']);
    $jogo['etaria'] = normalizarEtaria($jogo['etaria'] ?? null);
    $jogo['desconto'] = floatval($jogo['desconto'] ?? 0);
    $jogo['avaliacao_gameplay'] = floatval($jogo['avaliacao_gameplay'] ?? 0);
    $jogo['avaliacao_graficos'] = floatval($jogo['avaliacao_graficos'] ?? 0);
    $jogo['avaliacao_historia'] = floatval($jogo['avaliacao_historia'] ?? 0);
    
    echo json_encode(['success' => true, 'jogo' => $jogo]);
    $stmt->close();
}

/**
 * Cadastra um novo jogo
 */
function cadastrarJogo($conexao) {
    $dados = json_decode(file_get_contents('php://input'), true);
    
    if (!$dados) {
        echo json_encode(['success' => false, 'message' => 'Dados JSON inválidos']);
        return;
    }
    
    if (empty($dados['nome']) || empty($dados['descricao'])) {
        echo json_encode(['success' => false, 'message' => 'Nome e descrição são obrigatórios']);
        return;
    }
    
    $slug = !empty($dados['slug']) ? $dados['slug'] : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $dados['nome'])));
    $etaria = normalizarEtaria($dados['etaria'] ?? null);

    $sql = "INSERT INTO jogos (
                slug, nome, descricao, preco, img,
                categoria, plataforma, genero, etaria,
                ano, status, 
                avaliacao_gameplay, avaliacao_graficos, avaliacao_historia,
                desconto, data_lancamento
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param(
        "sssdsssssisdddds",
        $slug,
        $dados['nome'],
        $dados['descricao'],
        $dados['preco'],
        $dados['img'],
        $dados['categoria'],
        $dados['plataforma'],
        $dados['genero'],
        $etaria,
        $dados['ano'],
        $dados['status'],
        $dados['avaliacao_gameplay'],
        $dados['avaliacao_graficos'],
        $dados['avaliacao_historia'],
        $dados['desconto'],
        $dados['data_lancamento']
    );
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Jogo cadastrado com sucesso!',
            'id' => $conexao->insert_id
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar jogo: ' . $stmt->error]);
    }
    $stmt->close();
}

/**
 * Atualiza um jogo existente
 */
function atualizarJogo($conexao) {
    $dados = json_decode(file_get_contents('php://input'), true);
    
    if (!$dados || empty($dados['id'])) {
        echo json_encode(['success' => false, 'message' => 'ID do jogo não fornecido para atualização']);
        return;
    }
    
    $id = intval($dados['id']);
    $etaria = normalizarEtaria($dados['etaria'] ?? null);

    $sql = "UPDATE jogos SET
                nome = ?,
                descricao = ?,
                preco = ?,
                img = ?,
                categoria = ?,
                plataforma = ?,
                genero = ?,
                etaria = ?,
                ano = ?,
                status = ?,
                avaliacao_gameplay = ?,
                avaliacao_graficos = ?,
                avaliacao_historia = ?,
                desconto = ?,
                data_lancamento = ?,
                data_atualizacao = CURRENT_TIMESTAMP
            WHERE id = ?";
    
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param(
        "ssdssssssdddddsi",
        $dados['nome'],
        $dados['descricao'],
        $dados['preco'],
        $dados['img'],
        $dados['categoria'],
        $dados['plataforma'],
        $dados['genero'],
        $etaria,
        $dados['ano'],
        $dados['status'],
        $dados['avaliacao_gameplay'],
        $dados['avaliacao_graficos'],
        $dados['avaliacao_historia'],
        $dados['desconto'],
        $dados['data_lancamento'],
        $id
    );
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Jogo atualizado com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao atualizar jogo: ' . $stmt->error]);
    }
    $stmt->close();
}

/**
 * Exclui um jogo pelo ID
 */
function excluirJogo($conexao) {
    $id = intval($_GET['id'] ?? 0);
    
    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'ID inválido para exclusão']);
        return;
    }
    
    $sql = "DELETE FROM jogos WHERE id = ?";
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Jogo excluído com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao excluir jogo: ' . $stmt->error]);
    }
    $stmt->close();
}

$conexao->close();
?>
