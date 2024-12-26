ATTACH DATABASE '/Users/aliemre2023/Downloads/archive (8)/nba.sqlite' AS nba_original;

CREATE TABLE IF NOT EXISTS players (
    player_id INTEGER PRIMARY KEY,
    first_name VARCHAR NOT NULL CHECK (length(trim(first_name)) > 0), -- Ensure first_name is not empty or only spaces
    last_name VARCHAR NOT NULL CHECK (length(trim(last_name)) > 0), -- Ensure last_name is not empty or only spaces
    height TEXT CHECK (CAST(REPLACE(height, '"', '') AS DECIMAL) > 0), -- Ensure height is a positive value
    weight TEXT CHECK (CAST(REPLACE(weight, ' lbs.', '') AS DECIMAL) > 0), -- Ensure weight is a positive value
    birth_date TIMESTAMP CHECK (birth_date > '1900-01-01'), -- Ensure birth_date is after 1900-01-01
    college VARCHAR, 
    country_id INTEGER,
    png_name TEXT NOT NULL DEFAULT '', -- Ensure png_name is not NULL

    FOREIGN KEY (country_id) REFERENCES countries(country_id) ON DELETE SET NULL
);

INSERT INTO players (player_id, first_name, last_name, height, weight, birth_date, college, country_id)
SELECT
    person_id,
    first_name,
    last_name,
    height,
    weight,
    birthdate,
    school,
    CASE country
        WHEN 'USA' THEN 184
        WHEN 'Lithuania' THEN 100
        WHEN 'Romania' THEN 141
        WHEN 'Congo' THEN 39
        WHEN 'Jamaica' THEN 83
        WHEN 'Serbia' THEN 152
        WHEN 'Croatia' THEN 42
        WHEN 'Italy' THEN 82
        WHEN 'United Kingdom' THEN 183
        WHEN 'Ukraine' THEN 181
        WHEN 'Canada' THEN 32
        WHEN 'Greece' THEN 66
        WHEN 'Estonia' THEN 55
        WHEN 'Australia' THEN 9
        WHEN 'US Virgin Islands' THEN 196
        WHEN 'Slovenia' THEN 157
        WHEN 'Nigeria' THEN 127
        WHEN 'Germany' THEN 64
        WHEN 'Turkey' THEN 177
        WHEN 'Dominican Republic' THEN 49
        WHEN 'Georgia' THEN 63
        WHEN 'Bosnia and Herzegovina' THEN 22
        WHEN 'Russia' THEN 142
        WHEN 'Argentina' THEN 7
        WHEN 'Belize' THEN 18
        WHEN 'France' THEN 60
        WHEN 'Senegal' THEN 151
        WHEN 'Mali' THEN 106
        WHEN 'Finland' THEN 59
        WHEN 'Puerto Rico' THEN 195
        WHEN 'Spain' THEN 162
        WHEN 'Haiti' THEN 72
        WHEN 'Venezuela' THEN 189
        WHEN 'Puerto RicoChina' THEN 36
        WHEN 'Czech Republic' THEN 45
        WHEN 'Scotland' THEN 194
        WHEN 'Poland' THEN 138
        WHEN 'Ireland' THEN 80
        WHEN 'Montenegro' THEN 116
        WHEN 'Brazil' THEN 24
        WHEN 'Latvia' THEN 94
        WHEN 'South Korea' THEN 90
        WHEN 'Belgium' THEN 17
        WHEN 'Norway' THEN 129
        WHEN 'South Sudan' THEN 161
        WHEN 'Uruguay' THEN 185
        WHEN 'Switzerland' THEN 167
        WHEN 'Tanzania' THEN 171
        WHEN 'Israel' THEN 81
        WHEN 'Sweden' THEN 166
        WHEN 'Bahamas' THEN 12
        WHEN 'DRC' THEN 40
        WHEN 'Mexico' THEN 111
        WHEN 'New Zealand' THEN 124
        WHEN 'Antigua and Barbuda' THEN 6
        WHEN 'Cabo Verde' THEN 29
        WHEN 'Tunisia' THEN 176
        WHEN 'Austria' THEN 10
        WHEN 'Cameroon' THEN 31
        WHEN 'Ghana' THEN 65
        WHEN 'Angola' THEN 5
        WHEN 'Japan' THEN 84
        WHEN 'Trinidad and Tobago' THEN 175
        WHEN 'Guinea' THEN 69
        WHEN 'Sudan' THEN 65
        WHEN 'Portugal' THEN 164
        WHEN 'Gabon' THEN 61
        WHEN 'Colombia' THEN 37
        WHEN 'Denmark' THEN 46
        ELSE NULL
    END AS country_id
FROM nba_original.common_player_info;

DETACH DATABASE nba_original;

ATTACH DATABASE '/Users/aliemre2023/Desktop/archive_players/players.sqlite' AS player_images;

ALTER TABLE players
    ADD COLUMN png_name TEXT NOT NULL DEFAULT ''; -- Ensure png_name is added to the table

UPDATE players
SET png_name = (
    SELECT images.playerid || '.png'
    FROM player_images.players AS images
    WHERE images.fname = players.first_name
      AND images.lname = players.last_name
)
WHERE EXISTS (
    SELECT 1
    FROM player_images.players AS images
    WHERE images.fname = players.first_name
      AND images.lname = players.last_name
);

DETACH DATABASE player_images;

SELECT * FROM players LIMIT 5;
