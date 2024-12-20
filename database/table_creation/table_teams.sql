ALTER TABLE teams
    RENAME TO teams_v1;

CREATE TABLE IF NOT EXISTS teams (
    team_id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    nickname VARCHAR NOT NULL,
    abbreviation VARCHAR NOT NULL,
    year_founded INTEGER,
    city_id INTEGER,
    arena_id INTEGER,
    owner VARCHAR,
    general_manager VARCHAR,
    headcoach VARCHAR,
    facebook VARCHAR,
    instagram VARCHAR,
    twitter VARCHAR,
    logo_url VARCHAR,

    FOREIGN KEY(city_id) REFERENCES cities(city_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    FOREIGN KEY(arena_id) REFERENCES arenas(arena_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

INSERT INTO teams
SELECT
    team_id,
    name,
    nickname,
    abbreviation,
    year_founded,
    city_id,
    arena_id,
    owner,
    general_manager,
    headcoach,
    facebook,
    instagram,
    twitter,
    logo_url
FROM
    teams_v1;

DROP TABLE teams_v1
