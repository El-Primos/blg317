ATTACH DATABASE 'C:\Users\umut\Desktop\nba.sqlite' AS nba_original;

CREATE TABLE IF NOT EXISTS game_stats (
    game_id INTEGER,
    season INTEGER,
    home_team_score INTEGER,
    away_team_score INTEGER,
    home_qtr1_points INTEGER,
    home_qtr2_points INTEGER,
    home_qtr3_points INTEGER,
    home_qtr4_points INTEGER,
    away_qtr1_points INTEGER,
    away_qtr2_points INTEGER,
    away_qtr3_points INTEGER,
    away_qtr4_points INTEGER,
    home_rebounds INTEGER,
    home_blocks INTEGER,
    home_steals INTEGER,
    away_rebounds INTEGER,
    away_blocks INTEGER,
    away_steals INTEGER,

    FOREIGN KEY (game_id) REFERENCES games (game_id)
);

INSERT INTO game_stats (game_id, season, home_team_score, away_team_score, home_qtr1_points, home_qtr2_points,
                        home_qtr3_points, home_qtr4_points, away_qtr1_points, away_qtr2_points, away_qtr3_points,
                        away_qtr4_points, home_rebounds, home_blocks, home_steals, away_rebounds, away_blocks,
                        away_steals)
SELECT 
    g.game_id,
    sum.season,
    scores.pts_home,
    scores.pts_away,
    scores.pts_qtr1_home,
    scores.pts_qtr2_home,
    scores.pts_qtr3_home,
    scores.pts_qtr4_home,
    scores.pts_qtr1_away,
    scores.pts_qtr2_away,
    scores.pts_qtr3_away,
    scores.pts_qtr4_away,
    game.reb_home,
    game.blk_home,
    game.stl_home,
    game.reb_away,
    game.blk_away,
    game.stl_away

FROM
    nba_original.game_summary sum
JOIN
    nba_original.game game ON sum.game_id = game.game_id
JOIN
    nba_original.line_score scores on game.game_id = scores.game_id
JOIN
    games g ON scores.game_id = g.game_id;

DETACH DATABASE nba_original;

