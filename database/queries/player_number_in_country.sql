WITH playerWithCountry AS (
        SELECT co.country_id, co.name, p.player_id
        FROM players p, countries co
        WHERE p.country_id = co.country_id
    )
SELECT c.country_id, c.name AS country_name,
    COALESCE(COUNT(p.player_id), 0) AS player_count -- coalesce : null -> 0
FROM countries c
LEFT JOIN playerWithCountry p ON c.country_id = p.country_id
GROUP BY c.name, c.country_id;