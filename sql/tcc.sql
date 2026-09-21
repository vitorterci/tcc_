-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 14/09/2026 às 20:22
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
-- Estrutura para tabela `descontos`
--

DROP TABLE IF EXISTS `descontos`;
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
(1, 1, 50.00, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 1, '2026-08-27 11:01:38'),
(2, 2, 50.00, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 1, '2026-08-27 11:01:38'),
(3, 3, 20.00, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 1, '2026-08-27 11:01:38'),
(4, 4, 30.00, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 1, '2026-08-27 11:01:38'),
(5, 5, 35.00, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 1, '2026-08-27 11:01:38'),
(6, 6, 40.00, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 1, '2026-08-27 11:01:38'),
(7, 7, 20.00, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 1, '2026-08-27 11:01:38'),
(8, 8, 50.00, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 1, '2026-08-27 11:01:38');

-- --------------------------------------------------------

--
-- Estrutura para tabela `epicfake_jogos`
--

DROP TABLE IF EXISTS `epicfake_jogos`;
CREATE TABLE `epicfake_jogos` (
  `id` int(11) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `nome` varchar(180) NOT NULL,
  `descricao` text NOT NULL,
  `plataforma` varchar(100) NOT NULL,
  `genero` varchar(100) NOT NULL,
  `avaliacao` decimal(3,1) NOT NULL DEFAULT 0.0,
  `preco_original` decimal(10,2) NOT NULL DEFAULT 0.00,
  `preco_atual` decimal(10,2) NOT NULL DEFAULT 0.00,
  `desconto` int(11) NOT NULL DEFAULT 0,
  `imagem` varchar(255) NOT NULL,
  `categoria` varchar(30) NOT NULL DEFAULT 'popular',
  `gratuito` tinyint(1) NOT NULL DEFAULT 0,
  `lancamento` tinyint(1) NOT NULL DEFAULT 0,
  `popularidade` int(11) NOT NULL DEFAULT 0,
  `desenvolvedora` varchar(180) NOT NULL,
  `tamanho` varchar(30) NOT NULL,
  `classificacao` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `epicfake_jogos`
--

INSERT INTO `epicfake_jogos` (`id`, `slug`, `nome`, `descricao`, `plataforma`, `genero`, `avaliacao`, `preco_original`, `preco_atual`, `desconto`, `imagem`, `categoria`, `gratuito`, `lancamento`, `popularidade`, `desenvolvedora`, `tamanho`, `classificacao`) VALUES
(1, 'cyberpunk-2077', 'Cyberpunk 2077', 'Um RPG de ação em mundo aberto ambientado em Night City, uma megalópole obcecada por poder, glamour e modificações corporais.', 'PC', 'RPG / Ação', 4.7, 199.90, 89.90, 55, 'epicfake/assets/img/cyberpunk-2077.svg', 'promocao', 0, 0, 100, 'CD PROJEKT RED', '70 GB', '18 anos'),
(2, 'red-dead-redemption-2', 'Red Dead Redemption 2', 'Acompanhe Arthur Morgan e a gangue Van der Linde em uma jornada épica pelo coração da América no fim da era dos fora da lei.', 'PC', 'Ação / Aventura', 4.9, 249.90, 139.90, 44, 'epicfake/assets/img/red-dead-redemption-2.svg', 'promocao', 0, 0, 99, 'Rockstar Games', '150 GB', '18 anos'),
(3, 'hogwarts-legacy', 'Hogwarts Legacy', 'Explore o mundo bruxo do século XIX, descubra uma habilidade ancestral e escreva sua própria história em Hogwarts.', 'PC', 'RPG / Aventura', 4.6, 249.90, 99.90, 60, 'epicfake/assets/img/hogwarts-legacy.svg', 'promocao', 0, 0, 96, 'Avalanche Software', '85 GB', '12 anos'),
(4, 'forza-horizon-5', 'Forza Horizon 5', 'Dirija pelas paisagens vibrantes do México em uma celebração automotiva repleta de liberdade, velocidade e descobertas.', 'PC / Xbox', 'Corrida', 4.8, 249.90, 124.90, 50, 'epicfake/assets/img/forza-horizon-5.svg', 'promocao', 0, 0, 95, 'Playground Games', '110 GB', 'L'),
(5, 'elden-ring', 'Elden Ring', 'Atravesse as Terras Intermédias em uma fantasia sombria criada em colaboração por Hidetaka Miyazaki e George R. R. Martin.', 'PC', 'RPG / Soulslike', 4.9, 229.90, 159.90, 30, 'epicfake/assets/img/elden-ring.svg', 'popular', 0, 0, 98, 'FromSoftware', '60 GB', '16 anos'),
(6, 'baldurs-gate-3', 'Baldur\'s Gate 3', 'Reúna seu grupo e retorne aos Reinos Esquecidos em uma aventura de RPG de nova geração, com escolhas que moldam tudo.', 'PC / Mac', 'RPG / Estratégia', 4.9, 199.90, 129.90, 35, 'epicfake/assets/img/baldurs-gate-3.svg', 'popular', 0, 0, 97, 'Larian Studios', '150 GB', '16 anos'),
(7, 'the-witcher-3', 'The Witcher 3: Wild Hunt', 'Torne-se Geralt de Rívia, um caçador de monstros profissional em busca de uma criança da profecia.', 'PC', 'RPG / Aventura', 4.8, 119.90, 39.90, 67, 'epicfake/assets/img/the-witcher-3.svg', 'promocao', 0, 0, 94, 'CD PROJEKT RED', '50 GB', '18 anos'),
(8, 'minecraft', 'Minecraft', 'Crie, explore e sobreviva em um universo de blocos onde sua imaginação é a única fronteira.', 'PC / Console', 'Sandbox / Sobrevivência', 4.8, 129.90, 99.90, 23, 'epicfake/assets/img/minecraft.svg', 'popular', 0, 0, 93, 'Mojang Studios', '4 GB', 'L'),
(9, 'gta-v', 'Grand Theft Auto V', 'Viva uma história de crime e ambição em Los Santos, com campanha cinematográfica e mundo online em constante evolução.', 'PC', 'Ação / Mundo Aberto', 4.7, 149.90, 74.90, 50, 'epicfake/assets/img/gta-v.svg', 'promocao', 0, 0, 92, 'Rockstar Games', '110 GB', '18 anos'),
(10, 'resident-evil-4', 'Resident Evil 4', 'Uma releitura moderna do clássico de terror e sobrevivência que redefiniu o gênero com ação intensa e suspense.', 'PC', 'Terror / Ação', 4.8, 199.90, 119.90, 40, 'epicfake/assets/img/resident-evil-4.svg', 'promocao', 0, 0, 91, 'Capcom', '67 GB', '18 anos'),
(11, 'assassins-creed-mirage', 'Assassin\'s Creed Mirage', 'Viva a transformação de Basim, um ladrão de rua que se torna um Mestre Assassino na Bagdá do século IX.', 'PC', 'Ação / Furtividade', 4.4, 199.90, 89.90, 55, 'epicfake/assets/img/assassins-creed-mirage.svg', 'promocao', 0, 0, 86, 'Ubisoft Bordeaux', '40 GB', '16 anos'),
(12, 'starfield', 'Starfield', 'Crie seu personagem e explore a galáxia em uma nova geração de RPG espacial dos criadores de Skyrim.', 'PC / Xbox', 'RPG / Ficção científica', 4.2, 299.90, 179.90, 40, 'epicfake/assets/img/starfield.svg', 'lancamento', 0, 1, 88, 'Bethesda Game Studios', '125 GB', '16 anos'),
(13, 'helldivers-2', 'Helldivers 2', 'A união faz a força em um tiro em terceira pessoa cooperativo, caótico e repleto de batalhas pela liberdade.', 'PC / PS5', 'Ação / Cooperativo', 4.7, 199.90, 149.90, 25, 'epicfake/assets/img/helldivers-2.svg', 'lancamento', 0, 1, 89, 'Arrowhead Game Studios', '100 GB', '16 anos'),
(14, 'hades', 'Hades', 'Desafie o deus dos mortos em uma fuga do submundo que mistura ação veloz, narrativa dinâmica e mitologia grega.', 'PC / Switch', 'Ação / Roguelike', 4.9, 99.90, 49.90, 50, 'epicfake/assets/img/hades.svg', 'promocao', 0, 0, 90, 'Supergiant Games', '15 GB', '12 anos'),
(15, 'dead-by-daylight', 'Dead by Daylight', 'Um terror multiplayer assimétrico em que um assassino enfrenta quatro sobreviventes em uma luta pela vida.', 'PC / Console', 'Terror / Multiplayer', 4.5, 79.90, 31.90, 60, 'epicfake/assets/img/dead-by-daylight.svg', 'promocao', 0, 0, 85, 'Behaviour Interactive', '50 GB', '18 anos'),
(16, 'rocket-league', 'Rocket League', 'Futebol com carros movidos a foguete, partidas rápidas e habilidade para jogadores de todos os níveis.', 'PC / Console', 'Esporte / Multiplayer', 4.6, 0.00, 0.00, 0, 'epicfake/assets/img/rocket-league.svg', 'gratuito', 1, 0, 87, 'Psyonix', '25 GB', 'L'),
(17, 'fortnite', 'Fortnite', 'Construa, lute e crie em um universo social que reúne battle royale, experiências e eventos ao vivo.', 'PC / Console / Mobile', 'Ação / Battle Royale', 4.4, 0.00, 0.00, 0, 'epicfake/assets/img/fortnite.svg', 'gratuito', 1, 0, 100, 'EpicFake Studios', '45 GB', '12 anos'),
(18, 'fall-guys', 'Fall Guys', 'Supere pistas absurdas e concorrentes coloridos em uma gincana multiplayer cheia de quedas e risadas.', 'PC / Console', 'Party / Multiplayer', 4.3, 0.00, 0.00, 0, 'epicfake/assets/img/fall-guys.svg', 'gratuito', 1, 0, 82, 'Mediatonic', '2 GB', 'L'),
(19, 'warframe', 'Warframe', 'Desperte como um guerreiro Tenno e domine armaduras biomecânicas em combates cooperativos de ficção científica.', 'PC / Console', 'Ação / RPG', 4.5, 0.00, 0.00, 0, 'epicfake/assets/img/warframe.svg', 'gratuito', 1, 0, 79, 'Digital Extremes', '50 GB', '16 anos'),
(20, 'destiny-2', 'Destiny 2', 'Defenda a última cidade segura da humanidade e descubra novos poderes em um universo de ação compartilhado.', 'PC / Console', 'FPS / MMO', 4.3, 0.00, 0.00, 0, 'epicfake/assets/img/destiny-2.svg', 'gratuito', 1, 0, 84, 'Bungie', '105 GB', '14 anos'),
(21, 'dragon-age-the-veilguard', 'Dragon Age: The Veilguard', 'Monte sua equipe de heróis e enfrente uma ameaça ancestral em uma nova aventura de fantasia narrativa.', 'PC / Console', 'RPG / Aventura', 4.5, 299.90, 209.90, 30, 'epicfake/assets/img/dragon-age-the-veilguard.svg', 'lancamento', 0, 1, 80, 'BioWare', '100 GB', '16 anos'),
(22, 'black-myth-wukong', 'Black Myth: Wukong', 'Encare criaturas lendárias e desvende a verdade por trás de uma lenda chinesa em um RPG de ação cinematográfico.', 'PC / PS5', 'RPG / Ação', 4.6, 249.90, 189.90, 24, 'epicfake/assets/img/black-myth-wukong.svg', 'lancamento', 0, 1, 91, 'Game Science', '130 GB', '16 anos'),
(23, 'palworld', 'Palworld', 'Colecione criaturas misteriosas, construa sua base e sobreviva em um mundo aberto repleto de possibilidades.', 'PC / Xbox', 'Sobrevivência / Aventura', 4.3, 99.90, 69.90, 30, 'epicfake/assets/img/palworld.svg', 'popular', 0, 0, 83, 'Pocketpair', '40 GB', '12 anos'),
(24, 'stardew-valley', 'Stardew Valley', 'Transforme um terreno abandonado em um lar, cultive relações e descubra os segredos de um vale acolhedor.', 'PC / Console / Mobile', 'Simulação / RPG', 4.9, 39.90, 24.90, 38, 'epicfake/assets/img/stardew-valley.svg', 'popular', 0, 0, 88, 'ConcernedApe', '1 GB', 'L'),
(25, 'it-takes-two', 'It Takes Two', 'Uma aventura cooperativa criada exclusivamente para dois, com desafios que transformam a relação entre Cody e May.', 'PC / Console', 'Aventura / Cooperativo', 4.8, 149.90, 59.90, 60, 'epicfake/assets/img/it-takes-two.svg', 'promocao', 0, 0, 89, 'Hazelight Studios', '50 GB', '12 anos'),
(26, 'doom-eternal', 'DOOM Eternal', 'Torne-se o Slayer e abra caminho por hordas demoníacas em uma campanha frenética e brutal.', 'PC', 'FPS / Ação', 4.8, 149.90, 44.90, 70, 'epicfake/assets/img/doom-eternal.svg', 'promocao', 0, 0, 86, 'id Software', '80 GB', '18 anos'),
(27, 'civilization-vi', 'Sid Meier’s Civilization VI', 'Construa um império capaz de resistir ao teste do tempo em um clássico de estratégia por turnos.', 'PC / Mac', 'Estratégia / Simulação', 4.5, 129.90, 19.90, 85, 'epicfake/assets/img/civilization-vi.svg', 'promocao', 0, 0, 78, 'Firaxis Games', '12 GB', 'L'),
(28, 'among-us', 'Among Us', 'Trabalhe em equipe, mas fique atento: entre os tripulantes há impostores decididos a sabotar a missão.', 'PC / Mobile', 'Party / Dedução', 4.4, 19.90, 9.90, 50, 'epicfake/assets/img/among-us.svg', 'promocao', 0, 0, 76, 'Innersloth', '1 GB', 'L'),
(29, 'control', 'Control', 'Domine poderes sobrenaturais e enfrente uma ameaça inexplicável dentro da enigmática Agência Federal de Controle.', 'PC', 'Ação / Ficção científica', 4.5, 149.90, 34.90, 77, 'epicfake/assets/img/control.svg', 'promocao', 0, 0, 81, 'Remedy Entertainment', '42 GB', '16 anos'),
(30, 'alan-wake-2', 'Alan Wake 2', 'Dois protagonistas enfrentam uma história de terror psicológico que atravessa a fronteira entre ficção e realidade.', 'PC / PS5 / Xbox', 'Terror / Aventura', 4.7, 249.90, 169.90, 32, 'epicfake/assets/img/alan-wake-2.svg', 'lancamento', 0, 1, 87, 'Remedy Entertainment', '90 GB', '16 anos');

-- --------------------------------------------------------

--
-- Estrutura para tabela `feedback`
--

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `tipo_feedback` enum('sugestao','reclamacao','elogio','duvida') NOT NULL DEFAULT 'sugestao',
  `mensagem` text NOT NULL,
  `avaliacao` int(11) NOT NULL DEFAULT 5,
  `status` enum('pendente','lido','respondido') NOT NULL DEFAULT 'pendente',
  `data_cadastro` datetime NOT NULL DEFAULT current_timestamp(),
  `data_atualizacao` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `feedback`
--

INSERT INTO `feedback` (`id`, `nome`, `email`, `tipo_feedback`, `mensagem`, `avaliacao`, `status`, `data_cadastro`, `data_atualizacao`) VALUES
(1, 'teste', 'teste@gmail.com', 'sugestao', 'teste', 4, 'pendente', '2026-09-11 09:13:50', '2026-09-11 09:13:50');

-- --------------------------------------------------------

--
-- Estrutura para tabela `jogos`
--

DROP TABLE IF EXISTS `jogos`;
CREATE TABLE `jogos` (
  `id` int(10) UNSIGNED NOT NULL,
  `slug` varchar(150) NOT NULL,
  `nome` varchar(180) NOT NULL,
  `descricao` text NOT NULL,
  `img` varchar(500) DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `plataforma` varchar(100) DEFAULT NULL,
  `genero` varchar(100) DEFAULT NULL,
  `etaria` varchar(30) DEFAULT NULL,
  `ano` int(4) DEFAULT NULL,
  `status` enum('ativo','inativo') NOT NULL DEFAULT 'ativo',
  `avaliacao_gamplay` decimal(3,1) NOT NULL DEFAULT 0.0,
  `avaliacao_graficos` decimal(3,1) NOT NULL DEFAULT 0.0,
  `avaliacao_historia` decimal(3,1) NOT NULL DEFAULT 0.0,
  `desconto` decimal(5,2) NOT NULL DEFAULT 0.00,
  `data_lancamento` date DEFAULT NULL,
  `data_cadastro` datetime NOT NULL DEFAULT current_timestamp(),
  `data_atualizacao` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `jogos`
--

INSERT INTO `jogos` (`id`, `slug`, `nome`, `descricao`, `img`, `categoria`, `plataforma`, `genero`, `etaria`, `ano`, `status`, `avaliacao_gamplay`, `avaliacao_graficos`, `avaliacao_historia`, `desconto`, `data_lancamento`, `data_cadastro`, `data_atualizacao`) VALUES
(1, 'elden-ring', 'Elden Ring', 'RPG de ação em mundo aberto criado pela FromSoftware em parceria com George R. R. Martin. Explore as Terras Intermédias, enfrente chefes colossais e torne-se o Lorde Prístino.', 'games/elden-ring.webp', 'AAA', 'PC, PS5, Xbox Series', 'Action RPG', '16+', 2022, 'ativo', 9.8, 9.5, 9.0, 30.00, '2022-02-25', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(2, 'god-of-war-ragnarok', 'God of War Ragnarök', 'Kratos e Atreus enfrentam o Ragnarök enquanto viajam pelos Nove Reinos em uma jornada épica de mitologia nórdica.', 'games/god-of-war-ragnarok.webp', 'AAA', 'PS5, PS4', 'Action Adventure', '18+', 2022, 'ativo', 9.7, 9.6, 9.5, 20.00, '2022-11-09', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(3, 'the-legend-of-zelda-totk', 'The Legend of Zelda: Tears of the Kingdom', 'Sequência de Breath of the Wild que expande Hyrule com céus flutuantes e cavernas, trazendo novas mecânicas de construção e fusão.', 'games/the-legend-of-zelda-totk.webp', 'AAA', 'Nintendo Switch', 'Action Adventure', '12+', 2023, 'ativo', 9.8, 9.4, 9.3, 10.00, '2023-05-12', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(4, 'baldurs-gate-3', 'Baldur\'s Gate 3', 'RPG tático baseado em Dungeons & Dragons com narrativa ramificada, coop e enorme liberdade de escolhas.', 'games/baldurs-gate-3.webp', 'AAA', 'PC, PS5, Xbox Series', 'CRPG', '18+', 2023, 'ativo', 9.9, 9.4, 9.8, 15.00, '2023-08-03', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(5, 'cyberpunk-2077', 'Cyberpunk 2077', 'RPG de mundo aberto em Night City, com foco em narrativa cyberpunk, upgrades e combate frenético.', 'games/cyberpunk-2077.webp', 'AAA', 'PC, PS5, Xbox Series', 'Action RPG', '18+', 2020, 'ativo', 9.0, 9.3, 9.2, 50.00, '2020-12-10', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(6, 'red-dead-redemption-2', 'Red Dead Redemption 2', 'Épico faroeste da Rockstar sobre Arthur Morgan e a gangue Van der Linde no crepúsculo do Velho Oeste.', 'games/red-dead-redemption-2.webp', 'AAA', 'PC, PS4, Xbox One', 'Action Adventure', '18+', 2018, 'ativo', 9.9, 9.9, 9.8, 40.00, '2018-10-26', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(7, 'the-witcher-3', 'The Witcher 3: Wild Hunt', 'Geralt de Rívia caça monstros e busca Ciri em um vasto mundo aberto de fantasia sombria.', 'games/the-witcher-3.webp', 'AAA', 'PC, PS5, Xbox Series', 'Action RPG', '18+', 2015, 'ativo', 9.7, 9.4, 9.9, 60.00, '2015-05-19', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(8, 'hollow-knight', 'Hollow Knight', 'Metroidvania desafiador ambientado no reino subterrâneo de Hallownest, com arte desenhada à mão.', 'games/hollow-knight.webp', 'Indie', 'PC, Switch, PS4, Xbox One', 'Metroidvania', '10+', 2017, 'ativo', 9.5, 9.2, 9.0, 50.00, '2017-02-24', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(9, 'hades', 'Hades', 'Roguelike da Supergiant que mistura ação frenética com narrativa mitológica grega e progressão persistente.', 'games/hades.webp', 'Indie', 'PC, Switch, PS4, Xbox One', 'Roguelike', '14+', 2020, 'ativo', 9.6, 9.3, 9.4, 40.00, '2020-09-17', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(10, 'celeste', 'Celeste', 'Plataforma de precisão sobre Madeline escalando a Montanha Celeste e enfrentando seus demônios internos.', 'games/celeste.webp', 'Indie', 'PC, Switch, PS4, Xbox One', 'Platformer', '10+', 2018, 'ativo', 9.5, 8.9, 9.5, 60.00, '2018-01-25', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(11, 'stardew-valley', 'Stardew Valley', 'Simulador de fazenda relaxante com relacionamentos, mineração, pesca e construção de comunidade.', 'games/stardew-valley.webp', 'Indie', 'PC, Switch, PS4, Xbox One, Mobile', 'Simulation', 'Livre', 2016, 'ativo', 9.6, 8.7, 9.2, 30.00, '2016-02-26', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(12, 'terraria', 'Terraria', 'Sandbox 2D de exploração, construção e combate com centenas de itens e chefes.', 'games/terraria.webp', 'Indie', 'PC, Switch, PS4, Xbox One, Mobile', 'Sandbox', '10+', 2011, 'ativo', 9.4, 8.5, 8.0, 50.00, '2011-05-16', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(13, 'minecraft', 'Minecraft', 'Sandbox de blocos com sobrevivência, criatividade e multiplayer global, um dos jogos mais vendidos da história.', 'games/minecraft.webp', 'AAA', 'PC, Switch, PS, Xbox, Mobile', 'Sandbox', 'Livre', 2011, 'ativo', 9.7, 8.8, 7.5, 0.00, '2011-11-18', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(14, 'gta-v', 'Grand Theft Auto V', 'Ação em mundo aberto em Los Santos com três protagonistas e o lucrativo GTA Online.', 'games/gta-v.webp', 'AAA', 'PC, PS5, Xbox Series', 'Action Adventure', '18+', 2013, 'ativo', 9.5, 9.2, 9.0, 50.00, '2013-09-17', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(15, 'the-last-of-us-part-ii', 'The Last of Us Part II', 'Drama pós-apocalíptico intenso que acompanha Ellie em uma jornada de vingança e sobrevivência.', 'games/the-last-of-us-part-ii.webp', 'AAA', 'PS5, PS4', 'Action Adventure', '18+', 2020, 'ativo', 9.4, 9.8, 9.3, 30.00, '2020-06-19', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(16, 'ghost-of-tsushima', 'Ghost of Tsushima', 'Samurai Jin Sakai defende Tsushima da invasão mongol em um mundo aberto estonteante.', 'games/ghost-of-tsushima.webp', 'AAA', 'PS5, PS4', 'Action Adventure', '18+', 2020, 'ativo', 9.5, 9.6, 9.0, 35.00, '2020-07-17', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(17, 'horizon-forbidden-west', 'Horizon Forbidden West', 'Aloy explora o oeste proibido dos EUA enfrentando máquinas colossais em um dos jogos mais bonitos do PS5.', 'games/horizon-forbidden-west.webp', 'AAA', 'PS5, PS4', 'Action RPG', '14+', 2022, 'ativo', 9.3, 9.7, 8.8, 40.00, '2022-02-18', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(18, 'spider-man-2', 'Marvel\'s Spider-Man 2', 'Peter Parker e Miles Morales enfrentam Venom e Kraven em Nova York expandida.', 'games/spider-man-2.webp', 'AAA', 'PS5', 'Action Adventure', '14+', 2023, 'ativo', 9.4, 9.6, 9.0, 25.00, '2023-10-20', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(19, 'resident-evil-4-remake', 'Resident Evil 4 Remake', 'Remake do clássico survival horror com Leon S. Kennedy resgatando a filha do presidente na Espanha rural.', 'games/resident-evil-4-remake.webp', 'AAA', 'PC, PS5, Xbox Series', 'Survival Horror', '18+', 2023, 'ativo', 9.6, 9.5, 9.2, 30.00, '2023-03-24', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(20, 'alan-wake-2', 'Alan Wake 2', 'Thriller psicológico da Remedy que alterna entre Alan Wake e Saga Anderson em investigação sobrenatural.', 'games/alan-wake-2.webp', 'AAA', 'PC, PS5, Xbox Series', 'Survival Horror', '18+', 2023, 'ativo', 9.4, 9.7, 9.5, 20.00, '2023-10-27', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(21, 'starfield', 'Starfield', 'RPG espacial da Bethesda com mais de mil planetas exploráveis e foco em exploração e construção de naves.', 'games/starfield.webp', 'AAA', 'PC, Xbox Series', 'Action RPG', '16+', 2023, 'ativo', 8.5, 8.8, 8.2, 40.00, '2023-09-06', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(22, 'final-fantasy-xvi', 'Final Fantasy XVI', 'Ação RPG épico com Clive Rosfield em Valisthea, cheio de summons e combate cinematográfico.', 'games/final-fantasy-xvi.webp', 'AAA', 'PS5, PC', 'Action RPG', '16+', 2023, 'ativo', 9.2, 9.5, 9.3, 25.00, '2023-06-22', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(23, 'persona-5-royal', 'Persona 5 Royal', 'JRPG estiloso sobre Phantom Thieves que roubam corações na Tóquio moderna.', 'games/persona-5-royal.webp', 'AAA', 'PC, PS5, Xbox Series, Switch', 'JRPG', '16+', 2020, 'ativo', 9.7, 9.0, 9.8, 50.00, '2020-03-31', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(24, 'nier-automata', 'NieR: Automata', 'Ação RPG filosófico com androides 2B e 9S em uma guerra entre máquinas e humanos.', 'games/nier-automata.webp', 'AAA', 'PC, PS4, Xbox One, Switch', 'Action RPG', '16+', 2017, 'ativo', 9.4, 8.9, 9.8, 60.00, '2017-03-17', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(25, 'dark-souls-3', 'Dark Souls III', 'Conclusão da trilogia Souls com combate desafiador e level design interconectado.', 'games/dark-souls-3.webp', 'AAA', 'PC, PS4, Xbox One', 'Action RPG', '16+', 2016, 'ativo', 9.5, 9.0, 8.8, 50.00, '2016-04-12', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(26, 'sekiro', 'Sekiro: Shadows Die Twice', 'Ação de samurai da FromSoftware com combate baseado em postura e ambientação no Japão Sengoku.', 'games/sekiro.webp', 'AAA', 'PC, PS4, Xbox One', 'Action Adventure', '16+', 2019, 'ativo', 9.6, 9.2, 9.0, 50.00, '2019-03-22', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(27, 'bloodborne', 'Bloodborne', 'Exclusivo PlayStation com estética gótica-lovecraftiana e combate agressivo em Yharnam.', '', 'AAA', 'PS4', 'Action RPG', '16+', 2015, 'ativo', 9.7, 9.3, 9.2, 40.00, '2015-03-24', '2026-09-11 12:44:38', '2026-09-11 12:50:55'),
(28, 'cuphead', 'Cuphead', 'Run and gun com estética de desenho animado dos anos 1930 e dificuldade brutal.', 'games/cuphead.webp', 'Indie', 'PC, Switch, PS4, Xbox One', 'Run and Gun', '10+', 2017, 'ativo', 9.3, 9.5, 8.0, 40.00, '2017-09-29', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(29, 'ori-and-the-will-of-the-wisps', 'Ori and the Will of the Wisps', 'Metroidvania emocionante com arte deslumbrante e trilha orquestrada premiada.', 'games/ori-and-the-will-of-the-wisps.webp', 'Indie', 'PC, Switch, Xbox One', 'Metroidvania', 'Livre', 2020, 'ativo', 9.5, 9.8, 9.3, 45.00, '2020-03-11', '2026-09-11 12:44:38', '2026-09-11 12:44:38'),
(30, 'it-takes-two', 'It Takes Two', 'Aventura cooperativa obrigatória sobre um casal que precisa se reconectar como bonecos.', 'games/it-takes-two.webp', 'AAA', 'PC, PS5, PS4, Xbox Series, Xbox One', 'Co-op Adventure', '12+', 2021, 'ativo', 9.7, 9.5, 9.4, 50.00, '2021-03-26', '2026-09-11 12:44:38', '2026-09-11 12:44:38');

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
  `moeda` char(3) NOT NULL DEFAULT 'BRL',
  `url` varchar(500) DEFAULT NULL,
  `disponibilidade` enum('disponivel','indisponivel','pre_venda') NOT NULL DEFAULT 'disponivel',
  `desconto` decimal(5,2) NOT NULL DEFAULT 0.00,
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
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `role` enum('usuario','admin') NOT NULL DEFAULT 'usuario',
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `preferencias_cor` varchar(50) DEFAULT NULL,
  `preferencias_animacoes` tinyint(1) NOT NULL DEFAULT 0,
  `data_cadastro` datetime NOT NULL DEFAULT current_timestamp(),
  `data_atualizacao` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `usuario`, `email`, `senha`, `role`, `ativo`, `foto_perfil`, `preferencias_cor`, `preferencias_animacoes`, `data_cadastro`, `data_atualizacao`) VALUES
(1, 'Administrador', 'admin', 'admin@gmail.com', '$2y$10$pRq15bNiml.xawPVnKKUe.upeWpLsVmttEtccqb2UyqGUWj6EZ63u', 'admin', 1, 'assets/uploads/perfil/usuario_1_741b21ea845ba8b3db9b43a9.png', NULL, 0, '2026-09-14 08:01:59', '2026-09-14 14:21:43'),
(4, 'usuario', 'user', 'user@gmail.com', '$2y$10$mgMEdXFAYjNfcoxNvUnJS.T8LNvL1QjepZqS/QOAgKo1ZrBeqRq0O', 'usuario', 1, 'assets/uploads/perfil/usuario_4_d13a3f19091ac7adff840edc.png', NULL, 0, '2026-09-14 14:43:06', '2026-09-14 14:44:59');

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
(2, 1, 23, 'possuo', '2026-09-14 10:39:52', '2026-09-14 10:39:52'),
(3, 1, 29, 'possuo', '2026-09-14 11:14:55', '2026-09-14 11:14:55'),
(5, 4, 24, 'possuo', '2026-09-14 14:43:47', '2026-09-14 14:43:47'),
(6, 4, 23, 'possuo', '2026-09-14 14:43:55', '2026-09-14 14:43:55'),
(7, 4, 20, 'jogando', '2026-09-14 14:44:04', '2026-09-14 14:47:13');

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
(2, 1, 24, 0, 0, NULL, NULL, '2026-09-14 10:38:05', '2026-09-14 10:38:05'),
(3, 4, 22, 0, 0, NULL, NULL, '2026-09-14 14:43:35', '2026-09-14 14:43:35'),
(4, 4, 24, 0, 0, NULL, NULL, '2026-09-14 14:43:46', '2026-09-14 14:43:46'),
(5, 4, 23, 0, 0, NULL, NULL, '2026-09-14 14:43:55', '2026-09-14 14:43:55');

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
  `data_atualizacao` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `plataformas_interesse` text DEFAULT NULL,
  `generos_interesse` text DEFAULT NULL,
  `lojas_interesse` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `usuario_preferencias`
--

INSERT INTO `usuario_preferencias` (`id`, `usuario_id`, `desconto_minimo`, `preco_maximo`, `notificar_promocoes`, `notificar_queda_preco`, `data_atualizacao`, `plataformas_interesse`, `generos_interesse`, `lojas_interesse`) VALUES
(1, 1, 70.00, 100.00, 1, 1, '2026-09-14 11:49:08', '[\"Xbox One\"]', '[\"RPG\",\"Aventura\",\"Estratégia\"]', '[\"SteamFake\",\"EpicFake\",\"GOGFake\"]');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_feedback_status` (`status`),
  ADD KEY `idx_feedback_tipo` (`tipo_feedback`),
  ADD KEY `idx_feedback_data` (`data_cadastro`);

--
-- Índices de tabela `jogos`
--
ALTER TABLE `jogos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_jogos_slug` (`slug`),
  ADD KEY `idx_jogos_nome` (`nome`),
  ADD KEY `idx_jogos_categoria` (`categoria`),
  ADD KEY `idx_jogos_genero` (`genero`),
  ADD KEY `idx_jogos_plataforma` (`plataforma`),
  ADD KEY `idx_jogos_status` (`status`),
  ADD KEY `idx_jogos_atualizacao` (`data_atualizacao`);

--
-- Índices de tabela `precos`
--
ALTER TABLE `precos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_precos_jogo` (`jogo_id`),
  ADD KEY `idx_precos_loja` (`loja`),
  ADD KEY `idx_precos_plataforma` (`plataforma`),
  ADD KEY `idx_precos_preco` (`preco`),
  ADD KEY `idx_precos_disponibilidade` (`disponibilidade`),
  ADD KEY `idx_precos_atualizacao` (`data_atualizacao`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_usuarios_usuario` (`usuario`),
  ADD UNIQUE KEY `uq_usuarios_email` (`email`),
  ADD KEY `idx_usuarios_role` (`role`),
  ADD KEY `idx_usuarios_ativo` (`ativo`);

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `jogos`
--
ALTER TABLE `jogos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT de tabela `precos`
--
ALTER TABLE `precos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `usuario_jogos`
--
ALTER TABLE `usuario_jogos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `usuario_lista`
--
ALTER TABLE `usuario_lista`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `usuario_preferencias`
--
ALTER TABLE `usuario_preferencias`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `precos`
--
ALTER TABLE `precos`
  ADD CONSTRAINT `fk_precos_jogo` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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