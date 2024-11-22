CREATE TABLE IF NOT EXISTS games(
    game_id INT PRIMARY KEY,
    date DATE,
    home_team_id INT,
    away_team_id INT,
    official_id INT,

    FOREIGN KEY (home_team_id) REFERENCES teams(team_id),
    FOREIGN KEY (away_team_id) REFERENCES teams(team_id),
    FOREIGN KEY (official_id) REFERENCES officials(official_id)
);

ATTACH DATABASE '/Users/kickm/Downloads/archive/nba.sqlite' AS nba_original;

INSERT INTO games (game_id, date, home_team_id, away_team_id, official_id)
SELECT
    g.game_id,
    g.game_date,
    g.team_id_home,
    g.team_id_away,
    MIN(o.official_id) AS official_id
FROM
    nba_original.game AS g
LEFT JOIN
    nba_original.officials AS o ON g.game_id = o.game_id
GROUP BY
    g.game_id, g.game_date, g.team_id_home, g.team_id_away;
DETACH  DATABASE nba_original;