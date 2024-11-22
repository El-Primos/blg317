SELECT
    g.game_id,
    g.date,
    g.home_team_id,
    t1.name AS home_team_name,
    gs.home_team_score AS home_team_score,
    g.away_team_id,
    t2.name AS away_team_name,
    gs.away_team_score AS away_team_score,
    o.first_name || ' ' || o.last_name AS official_name
FROM games g
LEFT JOIN teams t1 ON g.home_team_id = t1.team_id
LEFT JOIN teams t2 ON g.away_team_id = t2.team_id
LEFT JOIN officials o ON g.official_id = o.official_id
LEFT JOIN game_stats gs ON g.game_id = gs.game_id
ORDER BY g.date DESC
LIMIT 5;
