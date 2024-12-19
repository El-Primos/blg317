PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS states (
    state_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name  varchar NOT NULL,
    country_id INTEGER,

    FOREIGN KEY (country_id) REFERENCES countries(country_id)
        ON DELETE CASCADE
);

INSERT INTO states (name, country_id)
VALUES
    ('Georgia', 184),
    ('Massachusetts', 184),
    ('Ohio', 184),
    ('Louisiana', 184),
    ('Illinois', 184),
    ('Texas', 184),
    ('Colorado', 184),
    ('California', 184),
    ('Florida', 184),
    ('Wisconsin', 184),
    ('Minnesota', 184),
    ('New York', 184),
    ('Indiana', 184),
    ('Pennsylvania', 184),
    ('Arizona', 184),
    ('Oregon', 184),
    ('Oklahoma', 184),
    ('Ontario', 32),  -- Ontario has a different country_id
    ('Utah', 184),
    ('Tennessee', 184),
    ('District of Columbia', 184),
    ('Michigan', 184),
    ('North Carolina', 184);