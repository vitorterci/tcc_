-- Normalização relacional dos filtros do catálogo Game Search.
-- Executar no banco tcc após o schema principal. A migração é idempotente.

USE `tcc`;

CREATE TABLE IF NOT EXISTS `plataformas` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_plataformas_nome` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `generos` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_generos_nome` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `jogo_plataforma` (
  `jogo_id` int(10) UNSIGNED NOT NULL,
  `plataforma_id` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`jogo_id`, `plataforma_id`),
  KEY `idx_jogo_plataforma_plataforma` (`plataforma_id`),
  CONSTRAINT `fk_jogo_plataforma_jogo` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_jogo_plataforma_plataforma` FOREIGN KEY (`plataforma_id`) REFERENCES `plataformas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `jogo_genero` (
  `jogo_id` int(10) UNSIGNED NOT NULL,
  `genero_id` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`jogo_id`, `genero_id`),
  KEY `idx_jogo_genero_genero` (`genero_id`),
  CONSTRAINT `fk_jogo_genero_jogo` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_jogo_genero_genero` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Os números 1..10 cobrem todos os valores atualmente separados por vírgula.
INSERT IGNORE INTO `plataformas` (`nome`)
SELECT DISTINCT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(j.`plataforma`, ',', n.n), ',', -1))
FROM `jogos` j
JOIN (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) n
  ON n.n <= 1 + LENGTH(j.`plataforma`) - LENGTH(REPLACE(j.`plataforma`, ',', ''))
WHERE j.`plataforma` IS NOT NULL AND TRIM(j.`plataforma`) <> '';

INSERT IGNORE INTO `generos` (`nome`)
SELECT DISTINCT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(j.`genero`, ',', n.n), ',', -1))
FROM `jogos` j
JOIN (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) n
  ON n.n <= 1 + LENGTH(j.`genero`) - LENGTH(REPLACE(j.`genero`, ',', ''))
WHERE j.`genero` IS NOT NULL AND TRIM(j.`genero`) <> '';

INSERT IGNORE INTO `jogo_plataforma` (`jogo_id`, `plataforma_id`)
SELECT j.`id`, p.`id`
FROM `jogos` j
JOIN (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) n
  ON n.n <= 1 + LENGTH(j.`plataforma`) - LENGTH(REPLACE(j.`plataforma`, ',', ''))
JOIN `plataformas` p ON p.`nome` = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(j.`plataforma`, ',', n.n), ',', -1));

INSERT IGNORE INTO `jogo_genero` (`jogo_id`, `genero_id`)
SELECT j.`id`, g.`id`
FROM `jogos` j
JOIN (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) n
  ON n.n <= 1 + LENGTH(j.`genero`) - LENGTH(REPLACE(j.`genero`, ',', ''))
JOIN `generos` g ON g.`nome` = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(j.`genero`, ',', n.n), ',', -1));
