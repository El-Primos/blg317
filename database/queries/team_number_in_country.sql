WITH teamsWithCountry AS (
    SELECT t.team_id,
           co.country_id,
           ci.city_id,
           st.state_id,
           co.name AS country_name
    FROM teams t, cities ci, states st, countries co
    WHERE t.city_id = ci.city_id AND
          ci.state_id = st.state_id AND
          st.country_id = co.country_id
)
SELECT c.country_id, c.name AS country_name,
       COALESCE(COUNT(t.team_id), 0) AS team_count -- coalesce : null -> 0
FROM countries c
LEFT JOIN teamsWithCountry t ON c.country_id = t.country_id
GROUP BY c.name, c.country_id;