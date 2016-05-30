CREATE DATABASE IF NOT EXISTS wizard;

USE wizard;

CREATE TABLE player (
	plr_playerId int NOT NULL AUTO_INCREMENT,
	plr_name varchar(128) NOT NULL,
	PRIMARY KEY (plr_playerId)
);

CREATE TABLE game (
	gme_gameId int NOT NULL,
	gme_date date NOT NULL,
	gme_time time NOT NULL,
	gme_player1 int,
	gme_player2 int,
	gme_player3 int,
	gme_player4 int,
	gme_player5 int,
	gme_player6 int,
	PRIMARY KEY (gme_gameId),
	FOREIGN KEY (gme_player1) REFERENCES player (plr_playerId),
	FOREIGN KEY (gme_player2) REFERENCES player (plr_playerId),
	FOREIGN KEY (gme_player3) REFERENCES player (plr_playerId),
	FOREIGN KEY (gme_player4) REFERENCES player (plr_playerId),
	FOREIGN KEY (gme_player5) REFERENCES player (plr_playerId),
	FOREIGN KEY (gme_player6) REFERENCES player (plr_playerId)
);

CREATE TABLE prediction (
	pre_predictionId int NOT NULL,
	pre_predictionNumber int NOT NULL,
	PRIMARY KEY (pre_predictionId)
);

CREATE TABLE trick (
	trk_trickId int NOT NULL,
	trk_trickNumber int NOT NULL,
	PRIMARY KEY (trk_trickId)
);

CREATE TABLE Round (
	rnd_roundId int NOT NULL,
	rnd_predictionPlayer1 int NOT NULL,
	rnd_predictionPlayer2 int NOT NULL,
	rnd_predictionPlayer3 int NOT NULL,
	rnd_predictionPlayer4 int NOT NULL,
	rnd_predictionPlayer5 int NOT NULL,
	rnd_predictionPlayer6 int NOT NULL,
	rnd_trickPlayer1 int NOT NULL,
	rnd_trickPlayer2 int NOT NULL,
	rnd_trickPlayer3 int NOT NULL,
	rnd_trickPlayer4 int NOT NULL,
	rnd_trickPlayer5 int NOT NULL,
	rnd_trickPlayer6 int NOT NULL,
	PRIMARY KEY (rnd_RoundId),
	FOREIGN KEY (rnd_predictionPlayer1) REFERENCES prediction (pre_predictionId),
	FOREIGN KEY (rnd_predictionPlayer2) REFERENCES prediction (pre_predictionId),
	FOREIGN KEY (rnd_predictionPlayer3) REFERENCES prediction (pre_predictionId),
	FOREIGN KEY (rnd_predictionPlayer4) REFERENCES prediction (pre_predictionId),
	FOREIGN KEY (rnd_predictionPlayer5) REFERENCES prediction (pre_predictionId),
	FOREIGN KEY (rnd_predictionPlayer6) REFERENCES prediction (pre_predictionId),
	FOREIGN KEY (rnd_trickPlayer1) REFERENCES trick (trk_trickId),
	FOREIGN KEY (rnd_trickPlayer2) REFERENCES trick (trk_trickId),
	FOREIGN KEY (rnd_trickPlayer3) REFERENCES trick (trk_trickId),
	FOREIGN KEY (rnd_trickPlayer4) REFERENCES trick (trk_trickId),
	FOREIGN KEY (rnd_trickPlayer5) REFERENCES trick (trk_trickId),
	FOREIGN KEY (rnd_trickPlayer6) REFERENCES trick (trk_trickId)
);