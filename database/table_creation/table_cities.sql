PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS cities (
    city_id INTEGER PRIMARY KEY AUTOINCREMENT ,
    name VARCHAR NOT NULL,
    abbreviation VARCHAR NOT NULL,
    state_id INTEGER,
    coordinate_x DOUBLE PRECISION(10, 4),
    coordinate_y DOUBLE PRECISION(10, 4),

    FOREIGN KEY (state_id) REFERENCES states(state_id)
        ON DELETE CASCADE
);

INSERT INTO cities (name, abbreviation, state_id, coordinate_x, coordinate_y) VALUES
('Atlanta', 'ATL', 1, 33.7490, -84.3880),               -- Georgia
( 'Boston', 'BOS', 2, 42.3601, -71.0589),                -- Massachusetts
('Cleveland', 'CLE', 3, 41.4995, -81.6954),             -- Ohio
('New Orleans', 'NO', 4, 29.9511, -90.0715),            -- Louisiana
('Chicago', 'CHI', 5, 41.8781, -87.6298),               -- Illinois
('Dallas', 'DAL', 6, 32.7767, -96.7970),                -- Texas
('Denver', 'DEN', 7, 39.7392, -104.9903),               -- Colorado
('Golden State', 'GSW', 8, 37.7749, -122.4194),         -- California
('Houston', 'HOU', 6, 29.7604, -95.3698),               -- Texas
('Los Angeles', 'LA', 8, 34.0522, -118.2437),          -- California
('Miami', 'MIA', 9, 25.7617, -80.1918),                -- Florida
('Milwaukee', 'MIL', 10, 43.0389, -87.9065),           -- Wisconsin
('Minnesota', 'MIN', 11, 46.7296, -94.6859),           -- Minnesota
('Brooklyn', 'BKN', 12, 40.6782, -73.9442),            -- New York
('New York', 'NY', 12, 40.7128, -74.0060),             -- New York
('Orlando', 'ORL', 9, 28.5383, -81.3792),              -- Florida
('Indiana', 'IND', 13, 40.2672, -86.1349),             -- Indiana
('Philadelphia', 'PHI', 14, 39.9526, -75.1652),        -- Pennsylvania
('Phoenix', 'PHX', 15, 33.4484, -112.0740),            -- Arizona
('Portland', 'POR', 16, 45.5155, -122.6793),           -- Oregon
('Sacramento', 'SAC', 8, 38.5816, -121.4944),          -- California
('San Antonio', 'SA', 6, 29.4241, -98.4936),           -- Texas
('Oklahoma City', 'OKC', 17, 35.4676, -97.5164),       -- Oklahoma
('Toronto', 'TOR', 18, 43.6510, -79.3470),             -- Ontario (Canada)
('Utah', 'UTA', 19, 39.3200, -111.0937),               -- Utah
('Memphis', 'MEM', 20, 35.1495, -90.0490),             -- Tennessee
('Washington', 'WAS', 21, 38.9072, -77.0369),          -- District of Columbia
('Detroit', 'DET', 22, 42.3314, -83.0458),             -- Michigan
('Charlotte', 'CHA', 23, 35.2271, -80.8431);           -- North Carolina
