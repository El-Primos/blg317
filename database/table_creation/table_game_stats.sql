ALTER TABLE game_stats
    RENAME TO game_stats_v1;

CREATE TABLE IF NOT EXISTS game_stats (
    game_id INTEGER NOT NULL,
    season INTEGER,
    home_team_score INTEGER,
    away_team_score INTEGER,
    home_qtr1_points INTEGER,
    home_qtr2_points INTEGER,
    home_qtr3_points INTEGER,
    home_qtr4_points INTEGER,
    away_qtr1_points INTEGER,
    away_qtr2_points INTEGER,
    away_qtr3_points INTEGER,
    away_qtr4_points INTEGER,
    home_rebounds INTEGER,
    home_blocks INTEGER,
    home_steals INTEGER,
    away_rebounds INTEGER,
    away_blocks INTEGER,
    away_steals INTEGER,

    FOREIGN KEY(game_id) REFERENCES games(game_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

INSERT INTO game_stats
SELECT
    game_id,
    season,
    home_team_score,
    away_team_score,
    home_qtr1_points,
    home_qtr2_points,
    home_qtr3_points,
    home_qtr4_points,
    away_qtr1_points,
    away_qtr2_points,
    away_qtr3_points,
    away_qtr4_points,
    home_rebounds,
    home_blocks,
    home_steals,
    away_rebounds,
    away_blocks,
    away_steals
FROM
    game_stats_v1;

DROP TABLE game_stats_v1;
