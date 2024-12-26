ATTACH DATABASE '/Users/aliemre2023/Downloads/archive (8)/nba.sqlite' AS nba_original;

CREATE TABLE IF NOT EXISTS arenas (
    arena_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR CHECK(TRIM(name) != '' AND LENGTH(name) <= 100), -- Ensures name is non-empty and up to 100 characters.
    capacity INTEGER CHECK(capacity > 0) -- Ensures capacity is positive.
);

INSERT INTO arenas (name, capacity)
SELECT DISTINCT
    arena,
    arenacapacity
FROM nba_original.team_details
WHERE arena IS NOT NULL;

DETACH DATABASE nba_original;
