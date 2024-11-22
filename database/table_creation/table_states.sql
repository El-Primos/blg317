-- STATES TABLE
CREATE TABLE IF NOT EXISTS states (
    state_id INTEGER PRIMARY KEY,
    name  varchar,
    country_id INTEGER,

    FOREIGN KEY (country_id) REFERENCES countries(country_id)
);

INSERT INTO states (state_id, name, country_id)
VALUES
    (1, 'Georgia', 184),
    (2, 'Massachusetts', 184),
    (3, 'Ohio', 184),
    (4, 'Louisiana', 184),
    (5, 'Illinois', 184),
    (6, 'Texas', 184),
    (7, 'Colorado', 184),
    (8, 'California', 184),
    (9, 'Florida', 184),
    (10, 'Wisconsin', 184),
    (11, 'Minnesota', 184),
    (12, 'New York', 184),
    (13, 'Indiana', 184),
    (14, 'Pennsylvania', 184),
    (15, 'Arizona', 184),
    (16, 'Oregon', 184),
    (17, 'Oklahoma', 184),
    (18, 'Ontario', 32),  -- Ontario has a different country_id
    (19, 'Utah', 184),
    (20, 'Tennessee', 184),
    (21, 'District of Columbia', 184),
    (22, 'Michigan', 184),
    (23, 'North Carolina', 184);

SELECT * FROM states limit 5;
