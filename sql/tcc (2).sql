-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 22/09/2026 às 13:17
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
-- Banco de dados: `tcc`
--
CREATE DATABASE IF NOT EXISTS `tcc` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `tcc`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `feedback`
--

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `tipo_feedback` enum('sugestao','reclamacao','elogio','duvida') NOT NULL DEFAULT 'sugestao',
  `mensagem` text NOT NULL,
  `avaliacao` int(11) NOT NULL DEFAULT 5,
  `status` enum('pendente','novo','lido','respondido') NOT NULL DEFAULT 'pendente',
  `data_envio` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `generos`
--

DROP TABLE IF EXISTS `generos`;
CREATE TABLE `generos` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `data_cadastro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `generos`
--

INSERT INTO `generos` (`id`, `nome`, `slug`, `data_cadastro`) VALUES
(1, 'Action RPG', 'action-rpg', '2026-09-18 18:23:04'),
(2, 'Action Adventure', 'action-adventure', '2026-09-18 18:23:04'),
(3, 'CRPG', 'crpg', '2026-09-18 18:23:04'),
(4, 'Metroidvania', 'metroidvania', '2026-09-18 18:23:04'),
(5, 'Roguelike', 'roguelike', '2026-09-18 18:23:04'),
(6, 'Platformer', 'platformer', '2026-09-18 18:23:04'),
(7, 'Simulation', 'simulation', '2026-09-18 18:23:04'),
(8, 'Sandbox', 'sandbox', '2026-09-18 18:23:04'),
(9, 'Survival Horror', 'survival-horror', '2026-09-18 18:23:04'),
(10, 'JRPG', 'jrpg', '2026-09-18 18:23:04'),
(11, 'Run and Gun', 'run-and-gun', '2026-09-18 18:23:04'),
(12, 'Co-op Adventure', 'co-op-adventure', '2026-09-18 18:23:04'),
(13, 'Soulslike', 'soulslike', '2026-09-18 18:23:04'),
(14, 'FPS', 'fps', '2026-09-18 18:23:04'),
(15, 'Estratégia', 'estrategia', '2026-09-18 18:23:04');

-- --------------------------------------------------------

--
-- Estrutura para tabela `jogos`
--

DROP TABLE IF EXISTS `jogos`;
CREATE TABLE `jogos` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(150) NOT NULL,
  `slug` varchar(180) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `plataforma` varchar(255) DEFAULT NULL,
  `genero` varchar(255) DEFAULT NULL,
  `ano` int(11) DEFAULT NULL,
  `etaria` varchar(10) DEFAULT NULL,
  `status` enum('ativo','inativo') NOT NULL DEFAULT 'ativo',
  `avaliacao_gamplay` decimal(3,1) NOT NULL DEFAULT 0.0,
  `avaliacao_graficos` decimal(3,1) NOT NULL DEFAULT 0.0,
  `avaliacao_historia` decimal(3,1) NOT NULL DEFAULT 0.0,
  `data_lancamento` date DEFAULT NULL,
  `data_cadastro` datetime NOT NULL DEFAULT current_timestamp(),
  `data_atualizacao` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `jogos`
--

INSERT INTO `jogos` (`id`, `nome`, `slug`, `descricao`, `img`, `categoria`, `plataforma`, `genero`, `ano`, `etaria`, `status`, `avaliacao_gamplay`, `avaliacao_graficos`, `avaliacao_historia`, `data_lancamento`, `data_cadastro`, `data_atualizacao`) VALUES
(1, 'Alan Wake 2', 'alan-wake-2', 'Alan Wake 2 é um survival horror psicológico que acompanha o escritor Alan Wake e a agente do FBI Saga Anderson em uma investigação sobrenatural envolvendo uma série de assassinatos.', 'games/alan-wake-2.webp', '', 'PC', '', 2023, '18', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 15:26:14'),
(2, 'Baldur\'s Gate 3', 'baldurs-gate-3', 'Baldur\'s Gate 3 é um RPG baseado no universo de Dungeons & Dragons. Explore o mundo, tome decisões que alteram a história, forme um grupo de personagens e enfrente inimigos em combates por turnos.', 'games/baldurs-gate-3.webp', NULL, 'PC, PS5, Xbox Series X/S', 'RPG', 2023, '18', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(3, 'Bloodborne', 'bloodborne', 'Bloodborne é um RPG de ação desenvolvido pela FromSoftware. O jogador explora a cidade gótica de Yharnam, enfrenta criaturas sobrenaturais e descobre os mistérios de uma antiga doença.', 'games/bloodborne.webp', NULL, 'PS4', 'Action RPG', 2015, '16', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(4, 'Celeste', 'celeste', 'Celeste é um jogo de plataforma no qual Madeline precisa escalar a Montanha Celeste enquanto enfrenta desafios de precisão e também questões relacionadas à sua própria jornada pessoal.', 'games/celeste.webp', NULL, 'PC, PS4, Xbox One, Nintendo Switch', 'Platformer', 2018, 'Livre', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(5, 'Cuphead', 'cuphead', 'Cuphead é um jogo de ação e plataforma inspirado em animações clássicas. Os jogadores enfrentam uma sequência de batalhas contra chefes utilizando armas, habilidades e movimentos precisos.', 'games/cuphead.webp', NULL, 'PC, PS4, Xbox One, Nintendo Switch', 'Platformer', 2017, 'Livre', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(6, 'Cyberpunk 2077', 'cyberpunk-2077', 'Cyberpunk 2077 é um RPG de ação em mundo aberto ambientado em Night City. O jogador controla V, um mercenário envolvido em conflitos entre corporações, gangues e tecnologias avançadas.', 'games/cyberpunk-2077.webp', NULL, 'PC, PS5, Xbox Series X/S', 'RPG', 2020, '18', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(7, 'Dark Souls III', 'dark-souls-3', 'Dark Souls III é um RPG de ação conhecido por seus combates desafiadores, exploração e ambientação sombria. O jogador atravessa diferentes regiões enfrentando inimigos e chefes poderosos.', 'games/dark-souls-3.webp', NULL, 'PC, PS4, Xbox One', 'Action RPG', 2016, '16', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(8, 'Elden Ring', 'elden-ring', 'Elden Ring é um RPG de ação em mundo aberto criado em colaboração entre a FromSoftware e George R. R. Martin. Explore as Terras Intermédias, enfrente criaturas e descubra diferentes caminhos para avançar na história.', 'games/elden-ring.webp', NULL, 'PC, PS5, PS4, Xbox Series X/S, Xbox One', 'Action RPG', 2022, '16', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(9, 'Final Fantasy XVI', 'final-fantasy-xvi', 'Final Fantasy XVI é um RPG de ação ambientado no mundo de Valisthea. A história acompanha Clive Rosfield em uma jornada marcada por conflitos entre nações e poderosos Dominantes.', 'games/final-fantasy-xvi.webp', NULL, 'PC, PS5', 'Action RPG', 2023, '16', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(10, 'Ghost of Tsushima', 'ghost-of-tsushima', 'Ghost of Tsushima é uma aventura de ação ambientada no Japão feudal. O jogador controla Jin Sakai, um samurai que luta para proteger a ilha de Tsushima durante a invasão mongol.', 'games/ghost-of-tsushima.webp', NULL, 'PC, PS5, PS4', 'Action Adventure', 2020, '16', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(11, 'God of War Ragnarök', 'god-of-war-ragnarok', 'God of War Ragnarök acompanha Kratos e Atreus durante uma jornada pelos Nove Reinos da mitologia nórdica enquanto tentam compreender e enfrentar os acontecimentos que antecedem o Ragnarök.', 'games/god-of-war-ragnarok.webp', NULL, 'PC, PS5, PS4', 'Action Adventure', 2022, '18', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(12, 'Grand Theft Auto V', 'gta-v', 'Grand Theft Auto V é um jogo de ação em mundo aberto ambientado em Los Santos. A campanha acompanha três protagonistas envolvidos em crimes, perseguições e conflitos com diferentes organizações.', 'games/gta-v.webp', NULL, 'PC, PS5, PS4, Xbox Series X/S, Xbox One', 'Action Adventure', 2013, '18', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(13, 'Hades', 'hades', 'Hades é um roguelike de ação no qual Zagreus, filho de Hades, tenta escapar do Submundo. Cada tentativa apresenta novos desafios, habilidades e acontecimentos narrativos.', 'games/hades.webp', NULL, 'PC, PS5, PS4, Xbox Series X/S, Xbox One, Nintendo Switch', 'Action RPG', 2020, '12', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(14, 'Hollow Knight', 'hollow-knight', 'Hollow Knight é um jogo de ação e plataforma ambientado no reino subterrâneo de Hallownest. Explore áreas interligadas, enfrente criaturas e descubra os mistérios do reino.', 'games/hollow-knight.webp', NULL, 'PC, PS4, Xbox One, Nintendo Switch', 'Metroidvania', 2017, '10', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(15, 'Horizon Forbidden West', 'horizon-forbidden-west', 'Horizon Forbidden West acompanha Aloy em uma jornada por uma região pós-apocalíptica dominada por máquinas. Explore diferentes ambientes, enfrente ameaças e investigue uma nova ameaça ao planeta.', 'games/horizon-forbidden-west.webp', NULL, 'PC, PS5, PS4', 'Action RPG', 2022, '14', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(16, 'It Takes Two', 'it-takes-two', 'It Takes Two é uma aventura cooperativa criada especificamente para dois jogadores. Cody e May são transformados em bonecos e precisam trabalhar juntos para superar desafios e reconstruir seu relacionamento.', 'games/it-takes-two.webp', NULL, 'PC, PS5, PS4, Xbox Series X/S, Xbox One, Nintendo Switch', 'Co-op Adventure', 2021, '12', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(17, 'Minecraft', 'minecraft', 'Minecraft é um jogo de construção e sobrevivência baseado em blocos. Explore mundos gerados proceduralmente, colete recursos, construa estruturas e enfrente criaturas.', 'games/minecraft.webp', NULL, 'PC, PS5, PS4, Xbox Series X/S, Xbox One, Nintendo Switch, Mobile', 'Sandbox', 2011, 'Livre', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(18, 'NieR:Automata', 'nier-automata', 'NieR:Automata é um RPG de ação ambientado em um futuro no qual androides lutam contra máquinas. A história apresenta diferentes perspectivas e explora questões relacionadas à existência e à humanidade.', 'games/nier-automata.webp', NULL, 'PC, PS4, Xbox One, Nintendo Switch', 'Action RPG', 2017, '16', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(19, 'Ori and the Will of the Wisps', 'ori-and-the-will-of-the-wisps', 'Ori and the Will of the Wisps é uma aventura de plataforma com exploração e elementos de Metroidvania. Ori precisa descobrir seu destino enquanto explora um mundo repleto de criaturas e perigos.', 'games/ori-and-the-will-of-the-wisps.webp', NULL, 'PC, Xbox Series X/S, Xbox One, Nintendo Switch', 'Metroidvania', 2020, 'Livre', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(20, 'Persona 5 Royal', 'persona-5-royal', 'Persona 5 Royal é um RPG que acompanha estudantes que assumem identidades de Phantom Thieves. Durante o dia, eles vivem a rotina escolar; em outros momentos, exploram mundos sobrenaturais.', 'games/persona-5-royal.webp', NULL, 'PC, PS5, PS4, Xbox Series X/S, Xbox One, Nintendo Switch', 'JRPG', 2019, '16', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(21, 'Red Dead Redemption 2', 'red-dead-redemption-2', 'Red Dead Redemption 2 é uma aventura de ação em mundo aberto ambientada no Velho Oeste. Arthur Morgan e a gangue Van der Linde tentam sobreviver enquanto o mundo ao redor muda rapidamente.', 'games/red-dead-redemption-2.webp', NULL, 'PC, PS4, Xbox One', 'Action Adventure', 2018, '18', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(22, 'Resident Evil 4', 'resident-evil-4-remake', 'Resident Evil 4 é um survival horror de ação que acompanha Leon S. Kennedy em uma missão para resgatar Ashley Graham. O jogo combina exploração, combate e elementos de terror.', 'games/resident-evil-4-remake.webp', NULL, 'PC, PS5, PS4, Xbox Series X/S', 'Survival Horror', 2023, '18', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(23, 'Sekiro: Shadows Die Twice', 'sekiro', 'Sekiro: Shadows Die Twice é um jogo de ação ambientado em uma versão fictícia do Japão do período Sengoku. O jogador controla um shinobi que busca resgatar seu mestre e cumprir sua missão.', 'games/sekiro.webp', NULL, 'PC, PS4, Xbox One', 'Action RPG', 2019, '16', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(24, 'Marvel\'s Spider-Man 2', 'spider-man-2', 'Marvel\'s Spider-Man 2 é uma aventura de ação em mundo aberto na qual Peter Parker e Miles Morales enfrentam novas ameaças enquanto protegem Nova York.', 'games/spider-man-2.webp', NULL, 'PC, PS5', 'Action Adventure', 2023, '14', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(25, 'Stardew Valley', 'stardew-valley', 'Stardew Valley é um jogo de simulação e RPG no qual o jogador assume uma antiga fazenda, cultiva plantações, cria animais, explora cavernas e interage com os moradores da comunidade.', 'games/stardew-valley.webp', NULL, 'PC, PS5, PS4, Xbox Series X/S, Xbox One, Nintendo Switch, Mobile', 'Simulation', 2016, 'Livre', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(26, 'Starfield', 'starfield', 'Starfield é um RPG de ficção científica ambientado em um universo com diversos sistemas estelares. Explore planetas, pilote naves, participe de missões e desenvolva seu personagem.', 'games/starfield.webp', NULL, 'PC, Xbox Series X/S', 'RPG', 2023, '14', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(27, 'Terraria', 'terraria', 'Terraria é um jogo de aventura, exploração, construção e sobrevivência em um mundo bidimensional. Colete recursos, construa estruturas, enfrente inimigos e descubra novos ambientes.', 'games/terraria.webp', NULL, 'PC, PS5, PS4, Xbox Series X/S, Xbox One, Nintendo Switch, Mobile', 'Sandbox', 2011, '10', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(28, 'The Last of Us Part II', 'the-last-of-us-part-ii', 'The Last of Us Part II é uma aventura de ação e sobrevivência ambientada em um mundo pós-apocalíptico. A história acompanha diferentes personagens envolvidos em conflitos e consequências de suas escolhas.', 'games/the-last-of-us-part-ii.webp', NULL, 'PS5, PS4', 'Survival', 2020, '18', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(29, 'The Legend of Zelda: Tears of the Kingdom', 'the-legend-of-zelda-totk', 'The Legend of Zelda: Tears of the Kingdom é uma aventura de ação em mundo aberto. Link explora Hyrule e novas regiões enquanto busca respostas sobre acontecimentos que ameaçam o reino.', 'games/the-legend-of-zelda-totk.webp', NULL, 'Nintendo Switch', 'Action Adventure', 2023, '10', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14'),
(30, 'The Witcher 3: Wild Hunt', 'the-witcher-3', 'The Witcher 3: Wild Hunt é um RPG de ação em mundo aberto. O jogador controla Geralt de Rívia, um caçador de monstros que percorre diferentes regiões em busca de Ciri.', 'games/the-witcher-3.webp', NULL, 'PC, PS5, PS4, Xbox Series X/S, Xbox One, Nintendo Switch', 'RPG', 2015, '18', 'ativo', 0.0, 0.0, 0.0, NULL, '2026-09-21 14:07:14', '2026-09-21 14:07:14');

-- --------------------------------------------------------

--
-- Estrutura para tabela `jogo_genero`
--

DROP TABLE IF EXISTS `jogo_genero`;
CREATE TABLE `jogo_genero` (
  `jogo_id` int(10) UNSIGNED NOT NULL,
  `genero_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `jogo_plataforma`
--

DROP TABLE IF EXISTS `jogo_plataforma`;
CREATE TABLE `jogo_plataforma` (
  `jogo_id` int(10) UNSIGNED NOT NULL,
  `plataforma_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `plataformas`
--

DROP TABLE IF EXISTS `plataformas`;
CREATE TABLE `plataformas` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `data_cadastro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `plataformas`
--

INSERT INTO `plataformas` (`id`, `nome`, `slug`, `data_cadastro`) VALUES
(1, 'PC', 'pc', '2026-09-18 18:23:04'),
(2, 'PS5', 'ps5', '2026-09-18 18:23:04'),
(3, 'PS4', 'ps4', '2026-09-18 18:23:04'),
(4, 'Xbox Series', 'xbox-series', '2026-09-18 18:23:04'),
(5, 'Xbox One', 'xbox-one', '2026-09-18 18:23:04'),
(6, 'Nintendo Switch', 'nintendo-switch', '2026-09-18 18:23:04'),
(7, 'Mobile', 'mobile', '2026-09-18 18:23:04');

-- --------------------------------------------------------

--
-- Estrutura para tabela `precos`
--

DROP TABLE IF EXISTS `precos`;
CREATE TABLE `precos` (
  `id` int(10) UNSIGNED NOT NULL,
  `jogo_id` int(10) UNSIGNED NOT NULL,
  `loja` varchar(100) NOT NULL,
  `plataforma` varchar(100) DEFAULT NULL,
  `preco` decimal(10,2) NOT NULL DEFAULT 0.00,
  `preco_antigo` decimal(10,2) DEFAULT NULL,
  `desconto` decimal(5,2) NOT NULL DEFAULT 0.00,
  `desconto_percentual` decimal(5,2) NOT NULL DEFAULT 0.00,
  `moeda` char(3) NOT NULL DEFAULT 'BRL',
  `disponibilidade` enum('disponivel','indisponivel') NOT NULL DEFAULT 'disponivel',
  `url` varchar(255) DEFAULT NULL,
  `url_oferta` varchar(500) DEFAULT NULL,
  `disponivel` tinyint(1) NOT NULL DEFAULT 1,
  `data_atualizacao` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(100) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `role` enum('usuario','admin') NOT NULL DEFAULT 'usuario',
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `preferencias_cor` varchar(20) DEFAULT NULL,
  `preferencias_animacoes` tinyint(1) NOT NULL DEFAULT 0,
  `data_cadastro` datetime NOT NULL DEFAULT current_timestamp(),
  `data_atualizacao` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `usuario`, `email`, `senha`, `role`, `ativo`, `foto_perfil`, `preferencias_cor`, `preferencias_animacoes`, `data_cadastro`, `data_atualizacao`) VALUES
(1, '1', '1', '123@gmail.com', '$2y$10$Zbji9u8VFowXIm3aVA0SgOo6NtqIZeL/ZqbPW7FEyu9Vjw9W6n9IK', 'admin', 1, 'assets/uploads/perfil/usuario_1_1db960969bab959c38dad325.png', NULL, 0, '2026-09-18 16:13:20', '2026-09-21 15:13:12');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario_jogos`
--

DROP TABLE IF EXISTS `usuario_jogos`;
CREATE TABLE `usuario_jogos` (
  `id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `jogo_id` int(10) UNSIGNED NOT NULL,
  `status` enum('possuo','jogando','zerado','abandonado') DEFAULT 'possuo',
  `data_adicionado` datetime DEFAULT current_timestamp(),
  `data_atualizacao` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `usuario_jogos`
--

INSERT INTO `usuario_jogos` (`id`, `usuario_id`, `jogo_id`, `status`, `data_adicionado`, `data_atualizacao`) VALUES
(1, 1, 30, 'possuo', '2026-09-21 12:21:23', '2026-09-21 12:21:23');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario_lista`
--

DROP TABLE IF EXISTS `usuario_lista`;
CREATE TABLE `usuario_lista` (
  `id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `jogo_id` int(10) UNSIGNED NOT NULL,
  `notificar_promocao` tinyint(1) DEFAULT 1,
  `notificar_preco` tinyint(1) DEFAULT 1,
  `preco_alvo` decimal(10,2) DEFAULT NULL,
  `desconto_minimo` decimal(5,2) DEFAULT NULL,
  `data_adicionado` datetime DEFAULT current_timestamp(),
  `data_atualizacao` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `usuario_lista`
--

INSERT INTO `usuario_lista` (`id`, `usuario_id`, `jogo_id`, `notificar_promocao`, `notificar_preco`, `preco_alvo`, `desconto_minimo`, `data_adicionado`, `data_atualizacao`) VALUES
(1, 1, 30, 0, 0, NULL, NULL, '2026-09-21 12:21:22', '2026-09-21 12:21:22');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario_preferencias`
--

DROP TABLE IF EXISTS `usuario_preferencias`;
CREATE TABLE `usuario_preferencias` (
  `id` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `desconto_minimo` decimal(5,2) DEFAULT 0.00,
  `preco_maximo` decimal(10,2) DEFAULT NULL,
  `notificar_promocoes` tinyint(1) DEFAULT 1,
  `notificar_queda_preco` tinyint(1) DEFAULT 1,
  `plataformas_interesse` text DEFAULT NULL,
  `generos_interesse` text DEFAULT NULL,
  `lojas_interesse` text DEFAULT NULL,
  `data_atualizacao` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `idx_feedback_status` (`status`);

--
-- Índices de tabela `generos`
--
ALTER TABLE `generos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_generos_slug` (`slug`);

--
-- Índices de tabela `jogos`
--
ALTER TABLE `jogos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_slug` (`slug`),
  ADD KEY `idx_jogos_status` (`status`);

--
-- Índices de tabela `jogo_genero`
--
ALTER TABLE `jogo_genero`
  ADD PRIMARY KEY (`jogo_id`,`genero_id`),
  ADD KEY `idx_jg_genero` (`genero_id`);

--
-- Índices de tabela `jogo_plataforma`
--
ALTER TABLE `jogo_plataforma`
  ADD PRIMARY KEY (`jogo_id`,`plataforma_id`),
  ADD KEY `idx_jp_plataforma` (`plataforma_id`);

--
-- Índices de tabela `plataformas`
--
ALTER TABLE `plataformas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_plataformas_slug` (`slug`);

--
-- Índices de tabela `precos`
--
ALTER TABLE `precos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_precos_jogo` (`jogo_id`),
  ADD KEY `idx_precos_disponibilidade` (`disponibilidade`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_usuario` (`usuario`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- Índices de tabela `usuario_jogos`
--
ALTER TABLE `usuario_jogos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_usuario_jogo` (`usuario_id`,`jogo_id`),
  ADD KEY `jogo_id` (`jogo_id`);

--
-- Índices de tabela `usuario_lista`
--
ALTER TABLE `usuario_lista`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_usuario_lista` (`usuario_id`,`jogo_id`),
  ADD KEY `jogo_id` (`jogo_id`);

--
-- Índices de tabela `usuario_preferencias`
--
ALTER TABLE `usuario_preferencias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_usuario_preferencias` (`usuario_id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `generos`
--
ALTER TABLE `generos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de tabela `jogos`
--
ALTER TABLE `jogos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de tabela `plataformas`
--
ALTER TABLE `plataformas`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `precos`
--
ALTER TABLE `precos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `usuario_jogos`
--
ALTER TABLE `usuario_jogos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `usuario_lista`
--
ALTER TABLE `usuario_lista`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `usuario_preferencias`
--
ALTER TABLE `usuario_preferencias`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Restrições para tabelas `jogo_genero`
--
ALTER TABLE `jogo_genero`
  ADD CONSTRAINT `fk_jg_genero` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_jg_jogo` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `jogo_plataforma`
--
ALTER TABLE `jogo_plataforma`
  ADD CONSTRAINT `fk_jp_jogo` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_jp_plataforma` FOREIGN KEY (`plataforma_id`) REFERENCES `plataformas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `precos`
--
ALTER TABLE `precos`
  ADD CONSTRAINT `precos_ibfk_1` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `usuario_jogos`
--
ALTER TABLE `usuario_jogos`
  ADD CONSTRAINT `usuario_jogos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuario_jogos_ibfk_2` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `usuario_lista`
--
ALTER TABLE `usuario_lista`
  ADD CONSTRAINT `usuario_lista_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuario_lista_ibfk_2` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `usuario_preferencias`
--
ALTER TABLE `usuario_preferencias`
  ADD CONSTRAINT `usuario_preferencias_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
