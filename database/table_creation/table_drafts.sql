ALTER TABLE drafts
    RENAME TO drafts_v1;

CREATE TABLE IF NOT EXISTS drafts (
    draft_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    team_id INTEGER,
    season INTEGER,
    overall_pick INTEGER,
    position VARCHAR,

    FOREIGN KEY(player_id) REFERENCES players(player_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY(team_id) REFERENCES teams(team_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

INSERT INTO drafts
SELECT
    draft_id,
    player_id,
    team_id,
    season,
    overall_pick,
    position
FROM
    drafts_v1;

DROP TABLE drafts_v1;
