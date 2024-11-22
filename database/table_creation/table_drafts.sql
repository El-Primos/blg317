ATTACH DATABASE 'C:\Users\umut\Desktop\nba.sqlite' AS nba_original;

CREATE TABLE IF NOT EXISTS drafts (
    draft_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER,
    team_id INTEGER,
    season INTEGER,
    overall_pick INTEGER,
    position VARCHAR,

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

INSERT INTO drafts (player_id, team_id, season, overall_pick, position)
SELECT
    dcs.player_id,
    dh.team_id,
    dh.season,
    dh.overall_pick,
    dcs.position

FROM
    nba_original.draft_history dh
JOIN
    nba_original.draft_combine_stats dcs ON dh.person_id = dcs.player_id
JOIN
    players p ON dcs.player_id = p.player_id
JOIN
    teams t ON dh.team_id = t.team_id;

DETACH DATABASE nba_original;