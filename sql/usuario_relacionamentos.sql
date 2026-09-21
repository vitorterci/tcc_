USE tcc;

CREATE TABLE IF NOT EXISTS usuario_jogos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    jogo_id INT UNSIGNED NOT NULL,
    status ENUM('possuo','jogando','zerado','abandonado') DEFAULT 'possuo',
    data_adicionado DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_usuario_jogo (usuario_id, jogo_id),

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (jogo_id) REFERENCES jogos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS usuario_lista (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    jogo_id INT UNSIGNED NOT NULL,

    notificar_promocao TINYINT(1) DEFAULT 1,
    notificar_preco TINYINT(1) DEFAULT 1,
    preco_alvo DECIMAL(10,2) DEFAULT NULL,
    desconto_minimo DECIMAL(5,2) DEFAULT NULL,

    data_adicionado DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_usuario_lista (usuario_id, jogo_id),

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (jogo_id) REFERENCES jogos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS usuario_preferencias (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,

    desconto_minimo DECIMAL(5,2) DEFAULT 0,
    preco_maximo DECIMAL(10,2) DEFAULT NULL,

    notificar_promocoes TINYINT(1) DEFAULT 1,
    notificar_queda_preco TINYINT(1) DEFAULT 1,

    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_usuario_preferencias (usuario_id),

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

ALTER TABLE usuario_preferencias
    ADD COLUMN IF NOT EXISTS plataformas_interesse TEXT NULL,
    ADD COLUMN IF NOT EXISTS generos_interesse TEXT NULL,
    ADD COLUMN IF NOT EXISTS lojas_interesse TEXT NULL;
