<?php
// php_backend/register.php
require_once 'config.php';

$dados = json_decode(file_get_contents('php://input'), true);

if (!$dados) {
    echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
    exit;
}

$nome = trim($dados['nome'] ?? '');
$usuario = trim($dados['usuario'] ?? '');
$email = trim($dados['email'] ?? '');
$senha = $dados['senha'] ?? '';

// Validações
if (empty($nome) || empty($usuario) || empty($email) || empty($senha)) {
    echo json_encode(['success' => false, 'message' => 'Todos os campos são obrigatórios']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'E-mail inválido']);
    exit;
}

if (strlen($senha) < 6) {
    echo json_encode(['success' => false, 'message' => 'A senha deve ter pelo menos 6 caracteres']);
    exit;
}

// Verificar se usuário ou email já existe
$check = $conexao->prepare("SELECT id FROM usuarios WHERE usuario = ? OR email = ?");
$check->bind_param("ss", $usuario, $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Usuário ou e-mail já cadastrado']);
    $check->close();
    exit;
}
$check->close();

// Hash da senha
$senha_hash = password_hash($senha, PASSWORD_DEFAULT);

// Inserir novo usuário
$stmt = $conexao->prepare("INSERT INTO usuarios (nome, usuario, email, senha) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $nome, $usuario, $email, $senha_hash);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Cadastro realizado com sucesso!',
        'user' => [
            'id' => $conexao->insert_id,
            'nome' => $nome,
            'usuario' => $usuario,
            'email' => $email
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar: ' . $stmt->error]);
}

$stmt->close();
$conexao->close();
?>