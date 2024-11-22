ATTACH DATABASE '/Users/aliemre2023/Downloads/archive (8)/nba.sqlite' AS nba_original;
CREATE TABLE IF NOT EXISTS teams (
    team_id INTEGER PRIMARY KEY,
    abbreviation VARCHAR NOT NULL,
    nickname VARCHAR NOT NULL,
    year_founded TIMESTAMP,
    city_id INTEGER,
    arena_id INTEGER,
    owner TEXT,
    general_manager TEXT,
    headcoach TEXT,
    dleague_affiliation TEXT,
    facebook TEXT,
    instagram TEXT,
    twitter TEXT,

    FOREIGN KEY (city_id) REFERENCES cities(city_id),
    FOREIGN KEY (arena_id) REFERENCES arenas(arena_id)
);

INSERT INTO teams(team_id, abbreviation, nickname, year_founded, owner, general_manager, headcoach, dleague_affiliation, facebook, instagram, twitter, city_id, arena_id)
SELECT
    team_id,
    abbreviation,
    nickname,
    yearfounded,
    owner,
    generalmanager,
    headcoach,
    dleagueaffiliation,
    facebook,
    instagram,
    twitter,
    (SELECT city_id FROM cities WHERE name = t.city) AS city_id,
    (SELECT arena_id FROM arenas WHERE name = t.arena) AS arena_id

FROM
    nba_original.team_details t;

ALTER TABLE teams
    ADD name TEXT NOT NULL DEFAULT '';

UPDATE teams
    SET name = (
        SELECT t.full_name
        FROM nba_original.team t
        WHERE t.abbreviation = teams.abbreviation
    )
    WHERE abbreviation IN (
        SELECT t.abbreviation
        FROM nba_original.team t
    );

DETACH DATABASE nba_original;