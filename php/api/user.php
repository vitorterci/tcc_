<?php
// php_backend/user.php
require_once '../config.php';
session_start();

header('Content-Type: application/json');

// Verificar se o usuário está logado
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'Sessão expirada. Faça login novamente.']);
    exit;
}

$usuario_id = $_SESSION['usuario_id'];

// Determinar a ação
$acao = $_GET['acao'] ?? '';

switch ($acao) {
    case 'get':
        getUser($conexao, $usuario_id);
        break;
    case 'update':
        updateUser($conexao, $usuario_id);
        break;
    case 'update_password':
        updatePassword($conexao, $usuario_id);
        break;
    case 'update_preferences':
        updatePreferences($conexao, $usuario_id);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Ação inválida']);
        break;
}

function getUser($conexao, $usuario_id) {
    $stmt = $conexao->prepare("
        SELECT 
            id, nome, usuario, email, 
            foto_perfil, data_cadastro, cargo,
            preferencias_animacoes, preferencias_cor
        FROM usuarios 
        WHERE id = ?
    ");
    $stmt->bind_param("i", $usuario_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
        $stmt->close();
        exit;
    }

    $usuario = $result->fetch_assoc();
    
    // Formatar data
    $usuario['data_cadastro'] = date('d/m/Y', strtotime($usuario['data_cadastro']));
    
    // Definir foto padrão se não houver
    if (empty($usuario['foto_perfil'])) {
        $usuario['foto_perfil'] = 'assets/img/default-avatar.png';
    }

    echo json_encode([
        'success' => true,
        'user' => $usuario
    ]);
    $stmt->close();
}

function updateUser($conexao, $usuario_id) {
    $dados = json_decode(file_get_contents('php://input'), true);
    
    if (!$dados) {
        echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
        exit;
    }

    $nome = trim($dados['nome'] ?? '');
    $usuario = trim($dados['usuario'] ?? '');
    $email = trim($dados['email'] ?? '');

    // Validações
    if (empty($nome) || empty($usuario) || empty($email)) {
        echo json_encode(['success' => false, 'message' => 'Todos os campos são obrigatórios']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'E-mail inválido']);
        exit;
    }

    // Verificar se usuário ou email já existe (exceto o próprio)
    $check = $conexao->prepare("SELECT id FROM usuarios WHERE (usuario = ? OR email = ?) AND id != ?");
    $check->bind_param("ssi", $usuario, $email, $usuario_id);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Usuário ou e-mail já cadastrado por outro usuário']);
        $check->close();
        exit;
    }
    $check->close();

    // Atualizar
    $stmt = $conexao->prepare("UPDATE usuarios SET nome = ?, usuario = ?, email = ? WHERE id = ?");
    $stmt->bind_param("sssi", $nome, $usuario, $email, $usuario_id);

    if ($stmt->execute()) {
        // Atualizar sessão com novos dados
        $_SESSION['usuario_nome'] = $nome;
        $_SESSION['usuario_email'] = $email;
        
        echo json_encode([
            'success' => true,
            'message' => 'Dados atualizados com sucesso!',
            'user' => [
                'nome' => $nome,
                'usuario' => $usuario,
                'email' => $email
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao atualizar: ' . $stmt->error]);
    }
    $stmt->close();
}

function updatePassword($conexao, $usuario_id) {
    $dados = json_decode(file_get_contents('php://input'), true);
    
    if (!$dados) {
        echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
        exit;
    }

    $senha_atual = $dados['senha_atual'] ?? '';
    $nova_senha = $dados['nova_senha'] ?? '';
    $confirmar_senha = $dados['confirmar_senha'] ?? '';

    if (empty($senha_atual) || empty($nova_senha) || empty($confirmar_senha)) {
        echo json_encode(['success' => false, 'message' => 'Preencha todos os campos']);
        exit;
    }

    if ($nova_senha !== $confirmar_senha) {
        echo json_encode(['success' => false, 'message' => 'As senhas não coincidem']);
        exit;
    }

    if (strlen($nova_senha) < 6) {
        echo json_encode(['success' => false, 'message' => 'A nova senha deve ter pelo menos 6 caracteres']);
        exit;
    }

    // Buscar senha atual
    $stmt = $conexao->prepare("SELECT senha FROM usuarios WHERE id = ?");
    $stmt->bind_param("i", $usuario_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $usuario = $result->fetch_assoc();
    $stmt->close();

    if (!$usuario || !password_verify($senha_atual, $usuario['senha'])) {
        echo json_encode(['success' => false, 'message' => 'Senha atual incorreta']);
        exit;
    }

    // Atualizar senha
    $nova_senha_hash = password_hash($nova_senha, PASSWORD_DEFAULT);
    $stmt = $conexao->prepare("UPDATE usuarios SET senha = ? WHERE id = ?");
    $stmt->bind_param("si", $nova_senha_hash, $usuario_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Senha alterada com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao alterar senha: ' . $stmt->error]);
    }
    $stmt->close();
}

function updatePreferences($conexao, $usuario_id) {
    $dados = json_decode(file_get_contents('php://input'), true);
    
    if (!$dados) {
        echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
        exit;
    }

    $preferencias_cor = $dados['cor'] ?? '#2e00e6';
    $preferencias_animacoes = isset($dados['animacoes']) ? (int)$dados['animacoes'] : 1;

    $stmt = $conexao->prepare("UPDATE usuarios SET preferencias_cor = ?, preferencias_animacoes = ? WHERE id = ?");
    $stmt->bind_param("sii", $preferencias_cor, $preferencias_animacoes, $usuario_id);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Preferências salvas com sucesso!',
            'preferences' => [
                'cor' => $preferencias_cor,
                'animacoes' => (bool)$preferencias_animacoes
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao salvar preferências: ' . $stmt->error]);
    }
    $stmt->close();
}

$conexao->close();
?>