<?php
/**
 * Script de Diagnóstico de Conexão e Estrutura
 * Acesse http://localhost/tcc_/php/diagnostico.php no seu navegador
 */

require_once 'config.php';

echo "<h1>Relatório de Diagnóstico do Sistema</h1>";

// 1. Verificar Conexão
if ($conexao->connect_error) {
    echo "<p style='color:red;'>❌ <b>Erro de Conexão:</b> " . $conexao->connect_error . "</p>";
    echo "<p>Verifique se o MySQL está rodando e se os dados em <b>php/config.php</b> estão corretos.</p>";
    exit;
} else {
    echo "<p style='color:green;'>✅ <b>Conexão com o Banco de Dados:</b> OK!</p>";
}

// 2. Verificar Tabelas
$tabelas_necessarias = ['usuarios', 'jogos'];
$tabelas_existentes = [];

$result = $conexao->query("SHOW TABLES");
while ($row = $result->fetch_array()) {
    $tabelas_existentes[] = $row[0];
}

foreach ($tabelas_necessarias as $tab) {
    if (in_array($tab, $tabelas_existentes)) {
        echo "<p style='color:green;'>✅ <b>Tabela '$tab':</b> Encontrada!</p>";
        
        // Verificar colunas da tabela usuarios
        if ($tab == 'usuarios') {
            echo "<ul>";
            $colunas = $conexao->query("DESCRIBE usuarios");
            $cols = [];
            while($c = $colunas->fetch_assoc()) { $cols[] = $c['Field']; }
            
            $colunas_criticas = ['id', 'email', 'senha', 'usuario'];
            foreach($colunas_criticas as $cc) {
                if (in_array($cc, $cols)) {
                    echo "<li>Coluna <b>$cc</b>: OK</li>";
                } else {
                    echo "<li style='color:red;'>❌ Coluna <b>$cc</b> NÃO encontrada!</li>";
                }
            }
            
            // Verificação de inconsistência de nomes
            if (in_array('foto_perfil', $cols)) {
                echo "<li>Coluna de foto: <b>foto_perfil</b> (Correto para a API)</li>";
            } elseif (in_array('foto', $cols)) {
                echo "<li style='color:orange;'>⚠️ Coluna de foto: <b>foto</b> (Alguns scripts podem precisar de ajuste para 'foto_perfil')</li>";
            }
            echo "</ul>";
        }
    } else {
        echo "<p style='color:red;'>❌ <b>Tabela '$tab':</b> NÃO ENCONTRADA!</p>";
    }
}

echo "<h3>Configurações Atuais (php/config.php):</h3>";
echo "<ul>
    <li>Host: $dbHost</li>
    <li>Usuário: $dbUsername</li>
    <li>Banco: $dbName</li>
</ul>";

echo "<hr><p>Remova este arquivo após concluir os testes por segurança.</p>";
?>
