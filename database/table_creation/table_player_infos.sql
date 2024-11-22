ATTACH DATABASE '/Users/aliemre2023/Downloads/archive (8)/nba.sqlite' AS nba_original;

CREATE TABLE IF NOT EXISTS player_infos (
    --stat_id INTEGER PRIMARY KEY,
    player_id INTEGER,
    team_id INTEGER,
    is_active INTEGER,
    position INTEGER,
    from_year INTEGER,
    to_year INTEGER,
    jersey INTEGER,
    season_exp INTEGER,

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

INSERT INTO player_infos (player_id, team_id, is_active, position, from_year, to_year, jersey, season_exp)
SELECT
    cpi.person_id,
    cpi.team_id,
    p.is_active,
    cpi.position,
    cpi.from_year,
    cpi.to_year,
    cpi.jersey,
    cpi.season_exp
FROM
    nba_original.common_player_info cpi
JOIN
    nba_original.player p
ON
    cpi.person_id = p.id;

DETACH DATABASE nba_original;