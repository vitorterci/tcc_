<?php
// php_backend/login.php (atualizado)
require_once 'config.php';

$dados = json_decode(file_get_contents('php://input'), true);

if (!$dados) {
    echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
    exit;
}

$email = $dados['email'] ?? '';
$senha = $dados['senha'] ?? '';

if (empty($email) || empty($senha)) {
    echo json_encode(['success' => false, 'message' => 'Preencha todos os campos']);
    exit;
}

// Buscar usuário pelo email ou usuário
$stmt = $conexao->prepare("SELECT id, nome, usuario, email, senha, foto_perfil, data_cadastro, cargo, preferencias_cor, preferencias_animacoes FROM usuarios WHERE email = ? OR usuario = ?");
$stmt->bind_param("ss", $email, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Usuário ou senha incorretos']);
    $stmt->close();
    exit;
}

$usuario = $result->fetch_assoc();

// Verificar senha
if (!password_verify($senha, $usuario['senha'])) {
    echo json_encode(['success' => false, 'message' => 'Usuário ou senha incorretos']);
    $stmt->close();
    exit;
}

// Login bem-sucedido: manter a sessão por 30 dias para que o usuário
// continue autenticado ao reabrir o projeto.
$duracaoSessao = 60 * 60 * 24 * 30;
ini_set('session.gc_maxlifetime', (string)$duracaoSessao);
session_set_cookie_params([
    'lifetime' => $duracaoSessao,
    'path' => '/',
    'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();
$_SESSION['usuario_id'] = $usuario['id'];
$_SESSION['usuario_nome'] = $usuario['nome'];
$_SESSION['usuario_email'] = $usuario['email'];

// Remover senha antes de enviar
unset($usuario['senha']);

// Processar JSON
// Preferências já são colunas separadas
$usuario['preferencias'] = [
    'cor' => $usuario['preferencias_cor'] ?? '#2e00e6',
    'animacoes' => (bool)($usuario['preferencias_animacoes'] ?? true)
];


echo json_encode([
    'success' => true,
    'message' => 'Login realizado com sucesso!',
    'user' => $usuario
]);

$stmt->close();
$conexao->close();
?>