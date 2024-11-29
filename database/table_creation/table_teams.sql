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

CREATE TABLE IF NOT EXISTS nba_team_flags (
    team_name VARCHAR(255) NOT NULL,
    abbreviation CHAR(3) NOT NULL,
    logo_url VARCHAR(255) NOT NULL
);

INSERT INTO nba_team_flags (team_name, abbreviation, logo_url) VALUES
('Atlanta Hawks', 'ATL', 'https://loodibee.com/wp-content/uploads/nba-atlanta-hawks-logo.png'),
('Boston Celtics', 'BOS', 'https://loodibee.com/wp-content/uploads/nba-boston-celtics-logo.png'),
('Brooklyn Nets', 'BKN', 'https://loodibee.com/wp-content/uploads/nba-brooklyn-nets-logo.png'),
('Charlotte Hornets', 'CHA', 'https://loodibee.com/wp-content/uploads/nba-charlotte-hornets-logo.png'),
('Chicago Bulls', 'CHI', 'https://loodibee.com/wp-content/uploads/nba-chicago-bulls-logo.png'),
('Cleveland Cavaliers', 'CLE', 'https://loodibee.com/wp-content/uploads/nba-cleveland-cavaliers-logo.png'),
('Dallas Mavericks', 'DAL', 'https://loodibee.com/wp-content/uploads/nba-dallas-mavericks-logo.png'),
('Denver Nuggets', 'DEN', 'https://loodibee.com/wp-content/uploads/nba-denver-nuggets-logo.png'),
('Detroit Pistons', 'DET', 'https://loodibee.com/wp-content/uploads/nba-detroit-pistons-logo.png'),
('Golden State Warriors', 'GSW', 'https://loodibee.com/wp-content/uploads/nba-golden-state-warriors-logo.png'),
('Houston Rockets', 'HOU', 'https://loodibee.com/wp-content/uploads/nba-houston-rockets-logo.png'),
('Indiana Pacers', 'IND', 'https://loodibee.com/wp-content/uploads/nba-indiana-pacers-logo.png'),
('LA Clippers', 'LAC', 'https://loodibee.com/wp-content/uploads/nba-la-clippers-logo.png'),
('Los Angeles Lakers', 'LAL', 'https://loodibee.com/wp-content/uploads/nba-los-angeles-lakers-logo.png'),
('Memphis Grizzlies', 'MEM', 'https://loodibee.com/wp-content/uploads/nba-memphis-grizzlies-logo.png'),
('Miami Heat', 'MIA', 'https://loodibee.com/wp-content/uploads/nba-miami-heat-logo.png'),
('Milwaukee Bucks', 'MIL', 'https://loodibee.com/wp-content/uploads/nba-milwaukee-bucks-logo.png'),
('Minnesota Timberwolves', 'MIN', 'https://loodibee.com/wp-content/uploads/nba-minnesota-timberwolves-logo.png'),
('New Orleans Pelicans', 'NOP', 'https://loodibee.com/wp-content/uploads/nba-new-orleans-pelicans-logo.png'),
('New York Knicks', 'NYK', 'https://loodibee.com/wp-content/uploads/nba-new-york-knicks-logo.png'),
('Oklahoma City Thunder', 'OKC', 'https://loodibee.com/wp-content/uploads/nba-oklahoma-city-thunder-logo.png'),
('Orlando Magic', 'ORL', 'https://loodibee.com/wp-content/uploads/nba-orlando-magic-logo.png'),
('Philadelphia 76ers', 'PHI', 'https://loodibee.com/wp-content/uploads/nba-philadelphia-76ers-logo.png'),
('Phoenix Suns', 'PHX', 'https://loodibee.com/wp-content/uploads/nba-phoenix-suns-logo.png'),
('Portland Trail Blazers', 'POR', 'https://loodibee.com/wp-content/uploads/nba-portland-trail-blazers-logo.png'),
('Sacramento Kings', 'SAC', 'https://loodibee.com/wp-content/uploads/nba-sacramento-kings-logo.png'),
('San Antonio Spurs', 'SAS', 'https://loodibee.com/wp-content/uploads/nba-san-antonio-spurs-logo.png'),
('Toronto Raptors', 'TOR', 'https://loodibee.com/wp-content/uploads/nba-toronto-raptors-logo.png'),
('Utah Jazz', 'UTA', 'https://loodibee.com/wp-content/uploads/nba-utah-jazz-logo.png'),
('Washington Wizards', 'WAS', 'https://loodibee.com/wp-content/uploads/nba-washington-wizards-logo.png');

ALTER TABLE teams ADD COLUMN logo_url TEXT;

UPDATE teams
SET logo_url = (
    SELECT logo_url
    FROM nba_team_flags
    WHERE nba_team_flags.abbreviation = teams.abbreviation
)
WHERE EXISTS (
    SELECT 1
    FROM nba_team_flags
    WHERE nba_team_flags.abbreviation = teams.abbreviation
);

DROP TABLE nba_team_flags;