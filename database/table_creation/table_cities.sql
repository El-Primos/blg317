-- CITIES TABLE
CREATE TABLE IF NOT EXISTS cities (
    city_id INTEGER PRIMARY KEY,
    name VARCHAR,
    abbreviation VARCHAR,
    state_id INTEGER,
    coordinate_x DOUBLE PRECISION(10, 4),
    coordinate_y DOUBLE PRECISION(10, 4),

    FOREIGN KEY (state_id) REFERENCES states(state_id)
);

INSERT INTO cities (city_id, name, abbreviation, state_id, coordinate_x, coordinate_y) VALUES
(1, 'Atlanta', 'ATL', 1, 33.7490, -84.3880),               -- Georgia
(2, 'Boston', 'BOS', 2, 42.3601, -71.0589),                -- Massachusetts
(3, 'Cleveland', 'CLE', 3, 41.4995, -81.6954),             -- Ohio
(4, 'New Orleans', 'NO', 4, 29.9511, -90.0715),            -- Louisiana
(5, 'Chicago', 'CHI', 5, 41.8781, -87.6298),               -- Illinois
(6, 'Dallas', 'DAL', 6, 32.7767, -96.7970),                -- Texas
(7, 'Denver', 'DEN', 7, 39.7392, -104.9903),               -- Colorado
(8, 'Golden State', 'GSW', 8, 37.7749, -122.4194),         -- California
(9, 'Houston', 'HOU', 6, 29.7604, -95.3698),               -- Texas
(10, 'Los Angeles', 'LA', 8, 34.0522, -118.2437),          -- California
(11, 'Miami', 'MIA', 9, 25.7617, -80.1918),                -- Florida
(12, 'Milwaukee', 'MIL', 10, 43.0389, -87.9065),           -- Wisconsin
(13, 'Minnesota', 'MIN', 11, 46.7296, -94.6859),           -- Minnesota
(14, 'Brooklyn', 'BKN', 12, 40.6782, -73.9442),            -- New York
(15, 'New York', 'NY', 12, 40.7128, -74.0060),             -- New York
(16, 'Orlando', 'ORL', 9, 28.5383, -81.3792),              -- Florida
(17, 'Indiana', 'IND', 13, 40.2672, -86.1349),             -- Indiana
(18, 'Philadelphia', 'PHI', 14, 39.9526, -75.1652),        -- Pennsylvania
(19, 'Phoenix', 'PHX', 15, 33.4484, -112.0740),            -- Arizona
(20, 'Portland', 'POR', 16, 45.5155, -122.6793),           -- Oregon
(21, 'Sacramento', 'SAC', 8, 38.5816, -121.4944),          -- California
(22, 'San Antonio', 'SA', 6, 29.4241, -98.4936),           -- Texas
(23, 'Oklahoma City', 'OKC', 17, 35.4676, -97.5164),       -- Oklahoma
(24, 'Toronto', 'TOR', 18, 43.6510, -79.3470),             -- Ontario (Canada)
(25, 'Utah', 'UTA', 19, 39.3200, -111.0937),               -- Utah
(26, 'Memphis', 'MEM', 20, 35.1495, -90.0490),             -- Tennessee
(27, 'Washington', 'WAS', 21, 38.9072, -77.0369),          -- District of Columbia
(28, 'Detroit', 'DET', 22, 42.3314, -83.0458),             -- Michigan
(29, 'Charlotte', 'CHA', 23, 35.2271, -80.8431);           -- North Carolina

