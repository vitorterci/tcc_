<?php
// php_backend/session.php
// Gerencia a sessão do usuário e fornece dados centralizados

session_start();

function getUsuarioLogado() {
    if (!isset($_SESSION['usuario_id'])) {
        return null;
    }
    
    require_once 'config.php';
    
    $id = $_SESSION['usuario_id'];
    $stmt = $conexao->prepare("SELECT id, nome, usuario, email, foto_perfil, data_cadastro, cargo, preferencias_cor, preferencias_animacoes FROM usuarios WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        return null;
    }
    
    $usuario = $result->fetch_assoc();
    
    // Processar campos JSON
    // Preferências já são colunas separadas agora
    
    
    return $usuario;
}

function isLogado() {
    return isset($_SESSION['usuario_id']);
}

function getUsuarioId() {
    return $_SESSION['usuario_id'] ?? null;
}

function getUsuarioNome() {
    return $_SESSION['usuario_nome'] ?? null;
}
?>