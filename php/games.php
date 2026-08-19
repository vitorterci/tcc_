<?php
// php_backend/games.php
require_once 'config.php';

header('Content-Type: application/json');

// Buscar todos os campos da tabela jogos
$sql = "SELECT 
            id, nome, descricao, preco, img, 
            categoria, plataforma, genero, etaria, 
            ano, status, 
            avaliacao_gameplay, avaliacao_graficos, avaliacao_historia,
            desconto, data_lancamento, data_cadastro, data_atualizacao
        FROM jogos 
        ORDER BY id DESC";

$result = $conexao->query($sql);

$jogos = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Converter e padronizar os valores usados pelos cards.
        $row['preco'] = floatval($row['preco']);
        $row['etaria'] = normalizarEtaria($row['etaria'] ?? null);
        $row['desconto'] = floatval($row['desconto'] ?? 0);
        $row['avaliacao_gameplay'] = floatval($row['avaliacao_gameplay'] ?? 0);
        $row['avaliacao_graficos'] = floatval($row['avaliacao_graficos'] ?? 0);
        $row['avaliacao_historia'] = floatval($row['avaliacao_historia'] ?? 0);
        $jogos[] = $row;
    }
}

echo json_encode($jogos);
$conexao->close();
?>