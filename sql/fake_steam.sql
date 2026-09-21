-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 28/08/2026 às 14:30
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `fake_steam`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `descontos`
--

CREATE TABLE `descontos` (
  `id` int(10) UNSIGNED NOT NULL,
  `preco_id` int(10) UNSIGNED NOT NULL,
  `percentual` decimal(5,2) NOT NULL DEFAULT 0.00,
  `inicio` datetime DEFAULT NULL,
  `fim` datetime DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `data_atualizacao` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `descontos`
--

INSERT INTO `descontos` (`id`, `preco_id`, `percentual`, `inicio`, `fim`, `ativo`, `data_atualizacao`) VALUES
(1, 1, 50.00, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 1, '2026-08-27 10:20:54'),
(2, 2, 50.00, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 1, '2026-08-27 10:20:54'),
(3, 3, 10.00, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 1, '2026-08-27 10:20:54'),
(4, 4, 30.00, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 1, '2026-08-27 10:20:54'),
(5, 5, 30.00, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 1, '2026-08-27 10:20:54'),
(6, 6, 40.00, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 1, '2026-08-27 10:20:54'),
(7, 7, 20.00, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 1, '2026-08-27 10:20:54'),
(8, 8, 50.00, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 1, '2026-08-27 10:20:54');

-- --------------------------------------------------------

--
-- Estrutura para tabela `jogos`
--

CREATE TABLE `jogos` (
  `id` int(10) UNSIGNED NOT NULL,
  `slug` varchar(150) NOT NULL,
  `nome` varchar(180) NOT NULL,
  `descricao` text NOT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `genero` varchar(100) NOT NULL,
  `avaliacao` decimal(3,1) NOT NULL DEFAULT 0.0,
  `categoria` enum('popular','promocao','lancamento','gratuito') NOT NULL DEFAULT 'popular',
  `gratuito` tinyint(1) NOT NULL DEFAULT 0,
  `disponivel` tinyint(1) NOT NULL DEFAULT 1,
  `desenvolvedora` varchar(180) DEFAULT NULL,
  `tamanho` varchar(30) DEFAULT NULL,
  `classificacao` varchar(30) DEFAULT NULL,
  `data_atualizacao` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `jogos`
--

INSERT INTO `jogos` (`id`, `slug`, `nome`, `descricao`, `imagem`, `genero`, `avaliacao`, `categoria`, `gratuito`, `disponivel`, `desenvolvedora`, `tamanho`, `classificacao`, `data_atualizacao`) VALUES
(1, 'cyberpunk-2077', 'Cyberpunk 2077', 'RPG de ação em mundo aberto ambientado em Night City.', 'GameSeach/assets/img/cyberpunk-2077.svg', 'RPG / Ação', 9.1, 'popular', 0, 1, 'CD Projekt Red', '70 GB', '18', '2026-08-27 11:19:12'),
(2, 'the-witcher-3', 'The Witcher 3: Wild Hunt', 'Uma aventura épica de fantasia em um mundo aberto repleto de escolhas.', 'steamfake/assets/img/the-witcher-3.svg', 'RPG / Fantasia', 9.5, 'popular', 0, 1, 'CD Projekt Red', '50 GB', '16', '2026-08-27 10:20:54'),
(3, 'baldurs-gate-3', 'Baldur\'s Gate 3', 'RPG narrativo baseado em Dungeons & Dragons com liberdade de decisões.', 'steamfake/assets/img/baldurs-gate-3.svg', 'RPG', 9.7, 'popular', 0, 1, 'Larian Studios', '150 GB', '16', '2026-08-27 10:20:54'),
(4, 'elden-ring', 'Elden Ring', 'Uma jornada de fantasia sombria em um vasto mundo aberto.', 'steamfake/assets/img/elden-ring.svg', 'RPG / Ação', 9.4, 'popular', 0, 1, 'FromSoftware', '60 GB', '16', '2026-08-27 10:20:54'),
(5, 'hogwarts-legacy', 'Hogwarts Legacy', 'Explore Hogwarts e descubra sua própria história no mundo bruxo.', 'steamfake/assets/img/hogwarts-legacy.svg', 'Ação / Aventura', 8.8, 'lancamento', 0, 1, 'Avalanche Software', '85 GB', '12', '2026-08-27 10:20:54'),
(6, 'resident-evil-4', 'Resident Evil 4', 'Remake de uma missão de resgate em uma vila tomada pelo terror.', 'steamfake/assets/img/resident-evil-4.svg', 'Terror / Ação', 9.0, 'promocao', 0, 1, 'Capcom', '67 GB', '18', '2026-08-27 10:20:54'),
(7, 'stardew-valley', 'Stardew Valley', 'Construa uma nova vida em uma fazenda cercada por uma comunidade acolhedora.', 'steamfake/assets/img/stardew-valley.svg', 'Simulação / RPG', 9.2, 'popular', 0, 1, 'ConcernedApe', '1 GB', 'L', '2026-08-27 10:20:54'),
(8, 'among-us', 'Among Us', 'Descubra o impostor em partidas cooperativas de investigação e estratégia.', 'steamfake/assets/img/among-us.svg', 'Ação / Social', 8.1, 'popular', 0, 1, 'Innersloth', '250 MB', 'L', '2026-08-27 10:20:54');

-- --------------------------------------------------------

--
-- Estrutura para tabela `jogo_plataformas`
--

CREATE TABLE `jogo_plataformas` (
  `jogo_id` int(10) UNSIGNED NOT NULL,
  `plataforma_id` smallint(5) UNSIGNED NOT NULL,
  `disponivel` tinyint(1) NOT NULL DEFAULT 1,
  `data_atualizacao` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `jogo_plataformas`
--

INSERT INTO `jogo_plataformas` (`jogo_id`, `plataforma_id`, `disponivel`, `data_atualizacao`) VALUES
(1, 1, 1, '2026-08-27 10:20:54'),
(1, 4, 1, '2026-08-27 10:20:54'),
(2, 1, 1, '2026-08-27 10:20:54'),
(2, 4, 1, '2026-08-27 10:20:54'),
(3, 1, 1, '2026-08-27 10:20:54'),
(3, 4, 1, '2026-08-27 10:20:54'),
(4, 1, 1, '2026-08-27 10:20:54'),
(4, 4, 1, '2026-08-27 10:20:54'),
(5, 1, 1, '2026-08-27 10:20:54'),
(5, 4, 1, '2026-08-27 10:20:54'),
(6, 1, 1, '2026-08-27 10:20:54'),
(6, 4, 1, '2026-08-27 10:20:54'),
(7, 1, 1, '2026-08-27 10:20:54'),
(8, 1, 1, '2026-08-27 10:20:54');

-- --------------------------------------------------------

--
-- Estrutura para tabela `links_jogos`
--

CREATE TABLE `links_jogos` (
  `id` int(10) UNSIGNED NOT NULL,
  `jogo_id` int(10) UNSIGNED NOT NULL,
  `plataforma_id` smallint(5) UNSIGNED DEFAULT NULL,
  `url` varchar(500) NOT NULL,
  `tipo` enum('produto','oferta','suporte') NOT NULL DEFAULT 'produto',
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `data_atualizacao` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `links_jogos`
--

INSERT INTO `links_jogos` (`id`, `jogo_id`, `plataforma_id`, `url`, `tipo`, `ativo`, `data_atualizacao`) VALUES
(1, 1, 1, 'simulados/epicfake/jogo.php?slug=cyberpunk-2077', 'produto', 1, '2026-08-27 10:20:54'),
(2, 2, 1, 'simulados/epicfake/jogo.php?slug=the-witcher-3', 'produto', 1, '2026-08-27 10:20:54'),
(3, 3, 1, 'simulados/epicfake/jogo.php?slug=baldurs-gate-3', 'produto', 1, '2026-08-27 10:20:54'),
(4, 4, 1, 'simulados/epicfake/jogo.php?slug=elden-ring', 'produto', 1, '2026-08-27 10:20:54'),
(5, 5, 1, 'simulados/epicfake/jogo.php?slug=hogwarts-legacy', 'produto', 1, '2026-08-27 10:20:54'),
(6, 6, 1, 'simulados/epicfake/jogo.php?slug=resident-evil-4', 'produto', 1, '2026-08-27 10:20:54'),
(7, 7, 1, 'simulados/epicfake/jogo.php?slug=stardew-valley', 'produto', 1, '2026-08-27 10:20:54'),
(8, 8, 1, 'simulados/epicfake/jogo.php?slug=among-us', 'produto', 1, '2026-08-27 10:20:54');

-- --------------------------------------------------------

--
-- Estrutura para tabela `plataformas`
--

CREATE TABLE `plataformas` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `nome` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `plataformas`
--

INSERT INTO `plataformas` (`id`, `nome`) VALUES
(3, 'Linux'),
(2, 'Mac'),
(1, 'PC'),
(5, 'PlayStation 5'),
(4, 'Steam Deck'),
(6, 'Xbox Series X|S');

-- --------------------------------------------------------

--
-- Estrutura para tabela `precos`
--

CREATE TABLE `precos` (
  `id` int(10) UNSIGNED NOT NULL,
  `jogo_id` int(10) UNSIGNED NOT NULL,
  `plataforma_id` smallint(5) UNSIGNED NOT NULL,
  `preco_original` decimal(10,2) NOT NULL DEFAULT 0.00,
  `preco_atual` decimal(10,2) NOT NULL DEFAULT 0.00,
  `moeda` char(3) NOT NULL DEFAULT 'BRL',
  `disponibilidade` enum('disponivel','indisponivel','pre_venda') NOT NULL DEFAULT 'disponivel',
  `data_atualizacao` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `precos`
--

INSERT INTO `precos` (`id`, `jogo_id`, `plataforma_id`, `preco_original`, `preco_atual`, `moeda`, `disponibilidade`, `data_atualizacao`) VALUES
(1, 1, 1, 199.90, 99.95, 'BRL', 'disponivel', '2026-08-27 10:20:54'),
(2, 2, 1, 149.90, 74.95, 'BRL', 'disponivel', '2026-08-27 10:20:54'),
(3, 3, 1, 249.90, 224.91, 'BRL', 'disponivel', '2026-08-27 10:20:54'),
(4, 4, 1, 229.90, 160.93, 'BRL', 'disponivel', '2026-08-27 10:20:54'),
(5, 5, 1, 249.90, 174.93, 'BRL', 'disponivel', '2026-08-27 10:20:54'),
(6, 6, 1, 199.90, 119.94, 'BRL', 'disponivel', '2026-08-27 10:20:54'),
(7, 7, 1, 24.90, 19.92, 'BRL', 'disponivel', '2026-08-27 10:20:54'),
(8, 8, 1, 19.90, 9.95, 'BRL', 'disponivel', '2026-08-27 10:20:54');

-- --------------------------------------------------------

--
-- Estrutura para tabela `steamfake_jogos`
--

CREATE TABLE `steamfake_jogos` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(150) NOT NULL,
  `slug` varchar(160) NOT NULL,
  `descricao` text NOT NULL,
  `imagem` varchar(255) NOT NULL,
  `plataforma` varchar(60) NOT NULL DEFAULT 'PC',
  `genero` varchar(100) NOT NULL,
  `avaliacao` decimal(2,1) NOT NULL DEFAULT 0.0,
  `preco_original` decimal(10,2) NOT NULL,
  `preco_atual` decimal(10,2) NOT NULL,
  `desconto` decimal(5,2) NOT NULL DEFAULT 0.00,
  `promocao_status` varchar(80) NOT NULL DEFAULT 'Preço regular',
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `steamfake_jogos`
--

INSERT INTO `steamfake_jogos` (`id`, `nome`, `slug`, `descricao`, `imagem`, `plataforma`, `genero`, `avaliacao`, `preco_original`, `preco_atual`, `desconto`, `promocao_status`, `criado_em`, `atualizado_em`) VALUES
(1, 'Cyberpunk 2077', 'cyberpunk-2077', 'RPG de ação em mundo aberto ambientado em Night City.', 'assets/img/capa-padrao.svg', 'PC', 'RPG / Ação', 4.7, 199.90, 99.95, 50.00, 'Oferta por tempo limitado', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(2, 'Red Dead Redemption 2', 'red-dead-redemption-2', 'Uma jornada épica pelo Velho Oeste americano.', 'assets/img/capa-padrao.svg', 'PC', 'Ação / Aventura', 4.9, 249.90, 124.95, 50.00, 'Oferta por tempo limitado', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(3, 'Hogwarts Legacy', 'hogwarts-legacy', 'Explore Hogwarts no século XIX e aprenda feitiços.', 'assets/img/capa-padrao.svg', 'PC', 'RPG / Aventura', 4.6, 249.90, 124.95, 50.00, 'Oferta por tempo limitado', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(4, 'Forza Horizon 5', 'forza-horizon-5', 'Corridas pelas paisagens vibrantes do México.', 'assets/img/capa-padrao.svg', 'PC', 'Corrida', 4.8, 249.90, 149.94, 40.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(5, 'Elden Ring', 'elden-ring', 'Fantasia sombria com exploração livre e combates intensos.', 'assets/img/capa-padrao.svg', 'PC', 'RPG / Soulslike', 4.9, 229.90, 160.93, 30.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(6, 'Baldur’s Gate 3', 'baldurs-gate-3', 'RPG baseado em escolhas, dados e consequências.', 'assets/img/capa-padrao.svg', 'PC', 'RPG / Estratégia', 4.9, 199.90, 139.93, 30.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(7, 'Minecraft', 'minecraft', 'Construa, explore e sobreviva em um universo de blocos.', 'assets/img/capa-padrao.svg', 'PC', 'Sandbox / Aventura', 4.8, 119.90, 119.90, 0.00, 'Preço regular', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(8, 'The Witcher 3: Wild Hunt', 'the-witcher-3-wild-hunt', 'Geralt de Rívia rastreia monstros em um continente em guerra.', 'assets/img/capa-padrao.svg', 'PC', 'RPG / Ação', 4.9, 149.90, 44.97, 70.00, 'Oferta relâmpago', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(9, 'Grand Theft Auto V', 'grand-theft-auto-v', 'Três criminosos se unem em golpes na cidade de Los Santos.', 'assets/img/capa-padrao.svg', 'PC', 'Ação / Mundo aberto', 4.7, 99.90, 24.97, 75.00, 'Oferta relâmpago', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(10, 'Hades', 'hades', 'Desafie o deus dos mortos em uma fuga pelo submundo.', 'assets/img/capa-padrao.svg', 'PC', 'Roguelike / Ação', 4.9, 89.90, 44.95, 50.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(11, 'Hollow Knight', 'hollow-knight', 'Desbrave um reino subterrâneo repleto de segredos.', 'assets/img/capa-padrao.svg', 'PC', 'Metroidvania', 4.8, 57.90, 28.95, 50.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(12, 'Dead Cells', 'dead-cells', 'Roguelite de ação com combate veloz e exploração ramificada.', 'assets/img/capa-padrao.svg', 'PC', 'Roguelite / Ação', 4.7, 59.90, 35.94, 40.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(13, 'Stardew Valley', 'stardew-valley', 'Cultive sua fazenda, faça amizades e descubra o vale.', 'assets/img/capa-padrao.svg', 'PC', 'Simulação / RPG', 4.9, 39.90, 19.95, 50.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(14, 'Resident Evil 4', 'resident-evil-4', 'Leon enfrenta uma missão de resgate em uma vila isolada.', 'assets/img/capa-padrao.svg', 'PC', 'Terror / Ação', 4.8, 249.90, 174.93, 30.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(15, 'Street Fighter 6', 'street-fighter-6', 'A nova geração dos jogos de luta.', 'assets/img/capa-padrao.svg', 'PC', 'Luta', 4.6, 249.90, 174.93, 30.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(16, 'Bioshock Infinite', 'bioshock-infinite', 'Uma aventura de ficção científica na cidade aérea de Columbia.', 'assets/img/capa-padrao.svg', 'PC', 'FPS / Narrativa', 4.6, 79.90, 15.98, 80.00, 'Oferta relâmpago', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(17, 'Portal 2', 'portal-2', 'Resolva quebra-cabeças com portais e muita ironia.', 'assets/img/capa-padrao.svg', 'PC', 'Puzzle / Cooperação', 4.9, 36.90, 7.38, 80.00, 'Oferta relâmpago', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(18, 'The Sims 4', 'the-sims-4', 'Crie personagens, construa casas e conte novas histórias.', 'assets/img/capa-padrao.svg', 'PC', 'Simulação', 4.3, 99.90, 49.95, 50.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(19, 'Terraria', 'terraria', 'Cave, lute, explore e construa em um mundo 2D.', 'assets/img/capa-padrao.svg', 'PC', 'Sandbox / Aventura', 4.8, 39.90, 19.95, 50.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(20, 'Sekiro: Shadows Die Twice', 'sekiro-shadows-die-twice', 'Domine a espada de um shinobi no Japão Sengoku.', 'assets/img/capa-padrao.svg', 'PC', 'Ação / Soulslike', 4.8, 229.90, 160.93, 30.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(21, 'Death Stranding', 'death-stranding', 'Reconecte uma América fragmentada.', 'assets/img/capa-padrao.svg', 'PC', 'Ação / Aventura', 4.4, 199.90, 69.96, 65.00, 'Oferta relâmpago', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(22, 'No Man’s Sky', 'no-mans-sky', 'Explore um universo praticamente infinito.', 'assets/img/capa-padrao.svg', 'PC', 'Exploração / Sobrevivência', 4.5, 199.90, 99.95, 50.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(23, 'Sea of Thieves', 'sea-of-thieves', 'Aventuras piratas em alto-mar com sua tripulação.', 'assets/img/capa-padrao.svg', 'PC', 'Ação / Multiplayer', 4.4, 149.90, 74.95, 50.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(24, 'Cuphead', 'cuphead', 'Chefes desafiadores em animação clássica.', 'assets/img/capa-padrao.svg', 'PC', 'Ação / Plataforma', 4.7, 79.90, 39.95, 50.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(25, 'Celeste', 'celeste', 'Ajude Madeline a escalar uma montanha.', 'assets/img/capa-padrao.svg', 'PC', 'Plataforma / Narrativa', 4.9, 59.90, 29.95, 50.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(26, 'Control', 'control', 'Habilidades sobrenaturais em uma agência secreta.', 'assets/img/capa-padrao.svg', 'PC', 'Ação / Ficção científica', 4.5, 149.90, 44.97, 70.00, 'Oferta relâmpago', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(27, 'Doom Eternal', 'doom-eternal', 'Destrua hordas demoníacas em combate explosivo.', 'assets/img/capa-padrao.svg', 'PC', 'FPS / Ação', 4.8, 199.90, 99.95, 50.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(28, 'Final Fantasy VII Remake', 'final-fantasy-vii-remake', 'A releitura visualmente impressionante de Midgar.', 'assets/img/capa-padrao.svg', 'PC', 'RPG / Ação', 4.6, 349.90, 244.93, 30.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(29, 'Batalha Estelar: Origens', 'batalha-estelar-origens', 'Comande uma frota rebelde em uma campanha tática.', 'assets/img/capa-padrao.svg', 'PC', 'Estratégia / Sci-Fi', 4.2, 79.90, 39.95, 50.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(30, 'Neon Drift Racing', 'neon-drift-racing', 'Corridas arcade em pistas futuristas.', 'assets/img/capa-padrao.svg', 'PC', 'Corrida / Arcade', 4.1, 69.90, 34.95, 50.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38'),
(31, 'Alan Wake 2', 'alan-wake-2', 'Dois protagonistas enfrentam uma história de terror psicológico que atravessa a fronteira entre ficção e realidade.', 'assets/img/capa-padrao.svg', 'PC', 'Terror / Aventura', 4.7, 249.90, 174.93, 30.00, 'Oferta ativa', '2026-08-27 14:14:38', '2026-08-27 14:14:38');

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vw_catalogo`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vw_catalogo` (
`id` int(10) unsigned
,`slug` varchar(150)
,`nome` varchar(180)
,`descricao` text
,`imagem` varchar(255)
,`genero` varchar(100)
,`avaliacao` decimal(3,1)
,`plataforma` varchar(80)
,`preco_original` decimal(10,2)
,`preco_atual` decimal(10,2)
,`desconto` decimal(5,2)
,`disponibilidade` enum('disponivel','indisponivel','pre_venda')
,`disponivel` tinyint(1)
,`url` varchar(500)
,`data_atualizacao` datetime
);

-- --------------------------------------------------------

--
-- Estrutura para view `vw_catalogo`
--
DROP TABLE IF EXISTS `vw_catalogo`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_catalogo`  AS SELECT `j`.`id` AS `id`, `j`.`slug` AS `slug`, `j`.`nome` AS `nome`, `j`.`descricao` AS `descricao`, `j`.`imagem` AS `imagem`, `j`.`genero` AS `genero`, `j`.`avaliacao` AS `avaliacao`, `p`.`nome` AS `plataforma`, `pr`.`preco_original` AS `preco_original`, `pr`.`preco_atual` AS `preco_atual`, coalesce(`d`.`percentual`,0) AS `desconto`, `pr`.`disponibilidade` AS `disponibilidade`, `j`.`disponivel` AS `disponivel`, `l`.`url` AS `url`, `j`.`data_atualizacao` AS `data_atualizacao` FROM ((((`jogos` `j` join `precos` `pr` on(`pr`.`jogo_id` = `j`.`id`)) join `plataformas` `p` on(`p`.`id` = `pr`.`plataforma_id`)) left join `descontos` `d` on(`d`.`preco_id` = `pr`.`id`)) left join `links_jogos` `l` on(`l`.`jogo_id` = `j`.`id` and `l`.`plataforma_id` = `pr`.`plataforma_id` and `l`.`tipo` = 'produto' and `l`.`ativo` = 1)) ;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `descontos`
--
ALTER TABLE `descontos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_descontos_preco` (`preco_id`),
  ADD KEY `idx_descontos_ativo` (`ativo`),
  ADD KEY `idx_descontos_percentual` (`percentual`),
  ADD KEY `idx_descontos_periodo` (`inicio`,`fim`);

--
-- Índices de tabela `jogos`
--
ALTER TABLE `jogos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_jogos_slug` (`slug`),
  ADD KEY `idx_jogos_nome` (`nome`),
  ADD KEY `idx_jogos_genero` (`genero`),
  ADD KEY `idx_jogos_disponivel` (`disponivel`),
  ADD KEY `idx_jogos_atualizacao` (`data_atualizacao`);

--
-- Índices de tabela `jogo_plataformas`
--
ALTER TABLE `jogo_plataformas`
  ADD PRIMARY KEY (`jogo_id`,`plataforma_id`),
  ADD KEY `idx_jp_plataforma` (`plataforma_id`),
  ADD KEY `idx_jp_disponivel` (`disponivel`);

--
-- Índices de tabela `links_jogos`
--
ALTER TABLE `links_jogos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_links_url` (`url`),
  ADD KEY `idx_links_jogo` (`jogo_id`),
  ADD KEY `idx_links_plataforma` (`plataforma_id`),
  ADD KEY `idx_links_ativo` (`ativo`);

--
-- Índices de tabela `plataformas`
--
ALTER TABLE `plataformas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_plataformas_nome` (`nome`);

--
-- Índices de tabela `precos`
--
ALTER TABLE `precos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_precos_jogo_plataforma` (`jogo_id`,`plataforma_id`),
  ADD KEY `idx_precos_jogo` (`jogo_id`),
  ADD KEY `idx_precos_plataforma` (`plataforma_id`),
  ADD KEY `idx_precos_atual` (`preco_atual`),
  ADD KEY `idx_precos_disponibilidade` (`disponibilidade`),
  ADD KEY `idx_precos_atualizacao` (`data_atualizacao`);

--
-- Índices de tabela `steamfake_jogos`
--
ALTER TABLE `steamfake_jogos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_steamfake_slug` (`slug`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `descontos`
--
ALTER TABLE `descontos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `jogos`
--
ALTER TABLE `jogos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `links_jogos`
--
ALTER TABLE `links_jogos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `plataformas`
--
ALTER TABLE `plataformas`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `precos`
--
ALTER TABLE `precos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `steamfake_jogos`
--
ALTER TABLE `steamfake_jogos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `descontos`
--
ALTER TABLE `descontos`
  ADD CONSTRAINT `fk_descontos_preco` FOREIGN KEY (`preco_id`) REFERENCES `precos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `jogo_plataformas`
--
ALTER TABLE `jogo_plataformas`
  ADD CONSTRAINT `fk_jp_jogo` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_jp_plataforma` FOREIGN KEY (`plataforma_id`) REFERENCES `plataformas` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `links_jogos`
--
ALTER TABLE `links_jogos`
  ADD CONSTRAINT `fk_links_jogo` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_links_plataforma` FOREIGN KEY (`plataforma_id`) REFERENCES `plataformas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `precos`
--
ALTER TABLE `precos`
  ADD CONSTRAINT `fk_precos_jogo` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_precos_plataforma` FOREIGN KEY (`plataforma_id`) REFERENCES `plataformas` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


-- Integração padronizada GameSearch: 30 jogos ativos do banco principal tcc.
USE fake_steam;
DROP TABLE IF EXISTS `steamfake_ofertas`;
CREATE TABLE `steamfake_ofertas` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `jogo_id` int UNSIGNED NOT NULL,
  `slug` varchar(150) NOT NULL,
  `plataforma` varchar(60) NOT NULL DEFAULT 'PC',
  `preco_original` decimal(10,2) NOT NULL,
  `preco_atual` decimal(10,2) NOT NULL,
  `desconto` decimal(5,2) NOT NULL DEFAULT 0.00,
  `url` varchar(500) NOT NULL,
  `loja` varchar(40) NOT NULL DEFAULT 'SteamFake',
  `data_atualizacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_steamfake_oferta_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `steamfake_ofertas`
  (`jogo_id`, `slug`, `plataforma`, `preco_original`, `preco_atual`, `desconto`, `url`, `loja`)
SELECT
  `j`.`id`, `j`.`slug`, 'PC',
  ROUND(49.90 + MOD(`j`.`id` * 37, 251), 2),
  ROUND((49.90 + MOD(`j`.`id` * 37, 251)) * (CASE WHEN MOD(`j`.`id`, 4) = 0 THEN 0.70 WHEN MOD(`j`.`id`, 4) = 1 THEN 0.85 ELSE 1.00 END), 2),
  ROUND(((49.90 + MOD(`j`.`id` * 37, 251)) - ROUND((49.90 + MOD(`j`.`id` * 37, 251)) * (CASE WHEN MOD(`j`.`id`, 4) = 0 THEN 0.70 WHEN MOD(`j`.`id`, 4) = 1 THEN 0.85 ELSE 1.00 END), 2)) / (49.90 + MOD(`j`.`id` * 37, 251)) * 100, 2),
  CONCAT('simulados/epicfake/jogo.php?slug=', `j`.`slug`), 'SteamFake'
FROM `tcc`.`jogos` AS `j`
WHERE `j`.`status` = 'ativo'
ORDER BY `j`.`id`
LIMIT 30;
COMMIT;
