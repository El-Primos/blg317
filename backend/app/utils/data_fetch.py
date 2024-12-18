# data_fetch.py
import os
from .db_utils import get_db_connection
import sqlite3
import random

# Function to load and execute a query from a specified SQL file
def fetch_from_sql_file(filename):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Construct the full file path and load the SQL query from the file
    sql_file_path = os.path.join('../database/queries', filename)
    with open(sql_file_path, 'r') as file:
        query = file.read()
    
    # Execute the query and fetch results
    cursor.execute(query)
    results = cursor.fetchall()
    conn.close()
    
    return results

def get_countries(query=None, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    if query:
        sql_query = "SELECT country_id, name, flag_link FROM countries WHERE name LIKE ? LIMIT ? OFFSET ?"
        params = (f"{query}%", per_page, (page - 1) * per_page)
    else:
        sql_query = "SELECT country_id, name, flag_link FROM countries LIMIT ? OFFSET ?"
        params = (per_page, (page - 1) * per_page)

    cursor.execute(sql_query, params)
    countries = cursor.fetchall()

    if query:
        count_query = "SELECT COUNT(*) FROM countries WHERE name LIKE ?"
        cursor.execute(count_query, (f"{query}%",))
    else:
        count_query = "SELECT COUNT(*) FROM countries"
        cursor.execute(count_query)

    total_count = cursor.fetchone()[0]

    conn.close()
    return countries, total_count

def get_teams(query=None, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    if query:
        sql_query = """
            SELECT team_id, abbreviation, nickname, logo_url
            FROM teams
            WHERE nickname LIKE ?
            LIMIT ? OFFSET ?
        """
        params = (f"{query}%", per_page, (page - 1) * per_page)
    else:
        sql_query = """
            SELECT team_id, abbreviation, nickname, logo_url
            FROM teams
            LIMIT ? OFFSET ?
        """
        params = (per_page, (page - 1) * per_page)

    cursor.execute(sql_query, params)
    teams = cursor.fetchall()

    if query:
        count_query = "SELECT COUNT(*) FROM teams WHERE nickname LIKE ?"
        cursor.execute(count_query, (f"{query}%",))
    else:
        count_query = "SELECT COUNT(*) FROM teams"
        cursor.execute(count_query)

    total_count = cursor.fetchone()[0]

    conn.close()
    return teams, total_count

def get_players(query=None, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    if query:
        sql_query = """
            SELECT player_id, first_name, last_name, height, weight, birth_date, college, country_id, png_name
            FROM players
            WHERE first_name LIKE ? OR last_name LIKE ?
            ORDER BY png_name DESC
            LIMIT ? OFFSET ?
        """
        params = (f"{query}%", f"{query}%", per_page, (page - 1) * per_page)
    else:
        sql_query = """
            SELECT player_id, first_name, last_name, height, weight, birth_date, college, country_id, png_name
            FROM players
            ORDER BY png_name DESC
            LIMIT ? OFFSET ?
        """
        params = (per_page, (page - 1) * per_page)

    cursor.execute(sql_query, params)
    players = cursor.fetchall()

    if query:
        count_query = "SELECT COUNT(*) FROM players WHERE first_name LIKE ? OR last_name LIKE ?"
        cursor.execute(count_query, (f"{query}%", f"{query}%"))
    else:
        count_query = "SELECT COUNT(*) FROM players"
        cursor.execute(count_query)

    total_count = cursor.fetchone()[0]

    conn.close()
    return players, total_count

def get_games(team_nickname=None, start_date=None, end_date=None, official_name=None, page=1, per_page=10):
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = """
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
        WHERE 1 = 1
    """

    # Add filters dynamically based on provided parameters
    params = []

    # Filter by team nickname
    if team_nickname:
        sql_query += " AND (t1.nickname = ? OR t2.nickname = ?)"
        params.extend([team_nickname, team_nickname])

    # Filter by start date
    if start_date:
        sql_query += " AND g.date >= ?"
        params.append(start_date)

    # Filter by end date
    if end_date:
        sql_query += " AND g.date <= ?"
        params.append(end_date)

    # Filter by official name
    if official_name:
        sql_query += " AND (o.first_name || ' ' || o.last_name) LIKE ?"
        params.append(f"%{official_name}%")

    # Add pagination
    sql_query += """
        ORDER BY g.date DESC
        LIMIT ? OFFSET ?
    """
    params.extend([per_page, (page - 1) * per_page])

    # Execute the query
    cursor.execute(sql_query, params)
    games = cursor.fetchall()

    # Count total games for the filters
    count_query = """
        SELECT COUNT(*)
        FROM games g
        LEFT JOIN teams t1 ON g.home_team_id = t1.team_id
        LEFT JOIN teams t2 ON g.away_team_id = t2.team_id
        LEFT JOIN officials o ON g.official_id = o.official_id
        WHERE 1 = 1
    """
    count_params = []

    # Count filter by team nickname
    if team_nickname:
        count_query += " AND (t1.nickname = ? OR t2.nickname = ?)"
        count_params.extend([team_nickname, team_nickname])

    # Count filter by start date
    if start_date:
        count_query += " AND g.date >= ?"
        count_params.append(start_date)

    # Count filter by end date
    if end_date:
        count_query += " AND g.date <= ?"
        count_params.append(end_date)

    # Count filter by official name
    if official_name:
        count_query += " AND (o.first_name || ' ' || o.last_name) LIKE ?"
        count_params.append(f"%{official_name}%")

    cursor.execute(count_query, count_params)
    total_count = cursor.fetchone()[0]

    conn.close()
    return games, total_count


def get_playerInfo(playerid):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
    SELECT
        COALESCE(p.first_name, 'Unknown') AS first_name,
        COALESCE(p.last_name, 'Unknown') AS last_name,
        COALESCE(p.height, 'Unknown') AS height,
        COALESCE(p.weight, 'Unknown') AS weight,
        COALESCE(p.birth_date, 'Unknown') AS birth_date,
        COALESCE(p.college, 'Unknown') AS college,
        COALESCE(c.name, 'Unknown') AS country_name,
        COALESCE(c.flag_link, 'Unknown') AS country_flag,
        COALESCE(p.png_name, 'Unknown') AS player_img,
        COALESCE(active_team.team_id, 'Unknown') AS active_team_id,
        COALESCE(active_team.name, 'Unknown') AS active_team_name,
        COALESCE(active_team.logo_url, 'Unknown') AS active_team_logo,
        COALESCE(drafted_team.team_id, 'Unknown') AS drafted_team_id,
        COALESCE(drafted_team.name, 'Unknown') AS drafted_team_name,
        COALESCE(drafted_team.logo_url, 'Unknown') AS drafted_team_logo,
        COALESCE(pi.is_active, 'Unknown') AS active_player,
        COALESCE(pi.position, 'Unknown') AS position,
        COALESCE(pi.from_year, 'Unknown') AS start_year,
        COALESCE(pi.to_year, 'Unknown') AS end_year,
        COALESCE(pi.jersey, 'Unknown') AS jersey_number,
        COALESCE(d.season, 'Unknown') AS draft_year,
        COALESCE(d.overall_pick, 'Unknown') AS overall_pick,
        COALESCE(p.country_id, 'Unknown') AS country_id,
        COALESCE(pi.team_id, 'Unknown') AS team_id
    FROM players p
    LEFT JOIN player_infos pi ON p.player_id = pi.player_id
    LEFT JOIN drafts d ON p.player_id = d.player_id
    LEFT JOIN teams active_team ON pi.team_id = active_team.team_id AND pi.is_active = 1
    LEFT JOIN teams drafted_team ON d.team_id = drafted_team.team_id
    LEFT JOIN countries c ON p.country_id = c.country_id
    WHERE p.player_id = ?;
    """
    cursor.execute(query, (playerid,))
    playerinfos = cursor.fetchone()
    conn.close()
    return playerinfos

def get_gameInfo(gameid):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
    SELECT
        COALESCE(g.game_id, 'Unknown') AS game_id,
        COALESCE(g.date, 'Unknown') AS date,
        COALESCE(g.home_team_id, 'Unknown') AS home_team_id,
        COALESCE(t1.name, 'Unknown') AS home_team_name,
        COALESCE(g.away_team_id, 'Unknown') AS away_team_id,
        COALESCE(t2.name, 'Unknown') AS away_team_name,
        COALESCE(o.first_name || ' ' || o.last_name, 'Unknown') AS official_name,
        COALESCE(gs.season, 'Unknown') AS season,
        COALESCE(gs.home_team_score, 'Unknown') AS home_team_score,
        COALESCE(gs.away_team_score, 'Unknown') AS away_team_score,
        COALESCE(gs.home_qtr1_points, 'Unknown') AS home_qtr1_points,
        COALESCE(gs.home_qtr2_points, 'Unknown') AS home_qtr2_points,
        COALESCE(gs.home_qtr3_points, 'Unknown') AS home_qtr3_points,
        COALESCE(gs.home_qtr4_points, 'Unknown') AS home_qtr4_points,
        COALESCE(gs.away_qtr1_points, 'Unknown') AS away_qtr1_points,
        COALESCE(gs.away_qtr2_points, 'Unknown') AS away_qtr2_points,
        COALESCE(gs.away_qtr3_points, 'Unknown') AS away_qtr3_points,
        COALESCE(gs.away_qtr4_points, 'Unknown') AS away_qtr4_points,
        COALESCE(gs.home_rebounds, 'Unknown') AS home_rebounds,
        COALESCE(gs.home_blocks, 'Unknown') AS home_blocks,
        COALESCE(gs.home_steals, 'Unknown') AS home_steals,
        COALESCE(gs.away_rebounds, 'Unknown') AS away_rebounds,
        COALESCE(gs.away_blocks, 'Unknown') AS away_blocks,
        COALESCE(gs.away_steals, 'Unknown') AS away_steals,
        COALESCE(t1.logo_url, 'Unknown') AS home_team_logo,
        COALESCE(t2.logo_url, 'Unknown') AS away_team_logo

    FROM games g
    LEFT JOIN game_stats gs ON g.game_id = gs.game_id
    LEFT JOIN teams t1 ON g.home_team_id = t1.team_id
    LEFT JOIN teams t2 ON g.away_team_id = t2.team_id
    LEFT JOIN officials o ON g.official_id = o.official_id
    WHERE g.game_id = ?;
    """
    cursor.execute(query, (gameid,))
    gameinfos = cursor.fetchone()
    conn.close()
    return gameinfos

def get_numberOfTeamsInCountry():
    team_number_in_country = fetch_from_sql_file("team_number_in_country.sql")
    return team_number_in_country

def get_numberOfPlayersInCountry():
    player_number_in_country = fetch_from_sql_file("player_number_in_country.sql")
    return player_number_in_country

def getLastGames(limit=5, team_id = None):
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = """
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
    """
    if team_id:
        sql_query += """
            WHERE t1.team_id = ? OR t2.team_id = ?
        """
        params = (team_id, team_id, limit)
    else:
        params = (limit,)
    sql_query += """
        ORDER BY g.date DESC
        LIMIT ?
    """
    cursor.execute(sql_query, params)
    games = cursor.fetchall()

    conn.close()
    return games
  
def get_countryPlayers(query, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = f"""
        SELECT p.player_id, p.first_name, p.last_name, p.height, p.weight, p.birth_date, p.college 
        FROM players p
        NATURAL JOIN countries c
        {query_to_sql(query)}
        LIMIT ? OFFSET ?
    """
    params = (per_page, (page - 1) * per_page)

    cursor.execute(sql_query, params)
    country_players = cursor.fetchall()

    sql_query = f"""
        SELECT COUNT(*)
        FROM players p
        NATURAL JOIN countries c
        {query_to_sql(query)}
    """

    cursor.execute(sql_query)
    total_count = cursor.fetchone()[0]

    return country_players, total_count

def get_countryTeams(query, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    if 'name' in query:
        query['t.name'] = query.pop('name')

    sql_query = f"""
        SELECT t.team_id, t.name, t.owner, t.general_manager, t.headcoach, c.name as city_name, a.name as arena_name, t.year_founded
        FROM teams t
        JOIN arenas a ON t.arena_id = a.arena_id
        JOIN cities c ON t.city_id = c.city_id
        JOIN states s ON c.state_id = s.state_id
        JOIN countries cout ON s.country_id = cout.country_id
        {query_to_sql(query)}
        LIMIT ? OFFSET ?
    """
    params = (per_page, (page - 1) * per_page)

    cursor.execute(sql_query, params)
    country_teams = cursor.fetchall()

    if 'city_name' in query:
        query['c.name'] = query.pop('city_name')

    if 'arena_name' in query:
        query['a.name'] = query.pop('arena_name')

    sql_query = f"""
        SELECT COUNT(*)
        FROM teams t
        JOIN arenas a ON t.arena_id = a.arena_id
        JOIN cities c ON t.city_id = c.city_id
        JOIN states s ON c.state_id = s.state_id
        JOIN countries cout ON s.country_id = cout.country_id
        {query_to_sql(query)}
    """

    cursor.execute(sql_query)
    total_count = cursor.fetchone()[0]

    return country_teams, total_count

def get_activeRoster(teamid):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
    SELECT 
        t.name AS team_name,
        p.player_id,
        p.first_name,
        p.last_name,
        p.height,
        p.weight,
        p.birth_date,
        p.college,
        p.png_name,
        pi.jersey,
        pi.position,
        pi.from_year,
        pi.to_year,
        pi.season_exp
    FROM 
        player_infos pi
    JOIN 
        players p ON pi.player_id = p.player_id
    JOIN 
        teams t ON pi.team_id = t.team_id
    WHERE 
        pi.is_active = 1
        AND pi.team_id = ?
    """
    cursor.execute(query, (teamid,))
    roster = cursor.fetchall()
    conn.close()
    return roster

def get_teamInfo(teamid):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
    SELECT 
        t.team_id,
        t.name AS team_name,
        t.abbreviation,
        t.nickname,
        t.year_founded,
        t.owner,
        t.general_manager,
        t.headcoach,
        t.dleague_affiliation,
        t.facebook,
        t.instagram,
        t.twitter,
        t.logo_url,
        c.name AS city_name,
        c.abbreviation AS city_abbreviation,
        c.coordinate_x,
        c.coordinate_y,
        s.name AS state_name,
        a.name AS arena_name,
        a.capacity AS arena_capacity
    FROM 
        teams t
    LEFT JOIN 
        cities c ON t.city_id = c.city_id
    LEFT JOIN 
        states s ON c.state_id = s.state_id
    LEFT JOIN 
        arenas a ON t.arena_id = a.arena_id
    WHERE 
        t.team_id = ?
    """
    cursor.execute(query, (teamid,))
    team_info = cursor.fetchone()
    conn.close()
    return team_info

def get_admin(username): 
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    SELECT 
       username, password_hash
    FROM 
        admins
    WHERE 
        username = ?
    """

    cursor.execute(query, (username,))
    admin_info = cursor.fetchone()

    conn.close()
    return admin_info

def get_adminTeams(query, page=1, per_page=24):
    conn = get_db_connection()
    cursor = conn.cursor()

    if 'name' in query:
        query['t.name'] = query.pop('name')

    if 'abbreviation' in query:
        query['t.abbreviation'] = query.pop('abbreviation')

    sql_query = f"""
        SELECT t.team_id, t.name, t.nickname, t.abbreviation, t.owner, t.general_manager, t.headcoach, c.name as city_name, c.city_id, a.name as arena_name, a.arena_id, t.year_founded, t.facebook, t.instagram, t.twitter, t.logo_url
        FROM teams t
        JOIN arenas a ON t.arena_id = a.arena_id
        JOIN cities c ON t.city_id = c.city_id
        JOIN states s ON c.state_id = s.state_id
        JOIN countries cout ON s.country_id = cout.country_id
        {query_to_sql(query)}
        LIMIT ? OFFSET ?
    """
    params = (per_page, (page - 1) * per_page)

    cursor.execute(sql_query, params)
    country_teams = cursor.fetchall()

    if 'city_name' in query:
        query['c.name'] = query.pop('city_name')

    if 'arena_name' in query:
        query['a.name'] = query.pop('arena_name')

    sql_query = f"""
        SELECT COUNT(*)
        FROM teams t
        JOIN arenas a ON t.arena_id = a.arena_id
        JOIN cities c ON t.city_id = c.city_id
        JOIN states s ON c.state_id = s.state_id
        JOIN countries cout ON s.country_id = cout.country_id
        {query_to_sql(query)}
    """

    cursor.execute(sql_query)
    total_count = cursor.fetchone()[0]

    return country_teams, total_count


def query_to_sql(query):
    sql = "WHERE "
    conditions = []

    for key, value in query.items():
        if isinstance(value, dict) and "constraints" in value:
            operator = value.get("operator", "and").upper()
            constraint_conditions = []

            for constraint in value["constraints"]:
                filterValue = constraint.get("value")
                constraint_operator = constraint.get("operator")
                if filterValue is not None and constraint_operator is not None:
                    constraint_conditions.append(f"{key} {constraint_operator} {filterValue}")
                    
            if constraint_conditions:
                conditions.append(f" ({f' {operator} '.join(constraint_conditions)}) ")

    if conditions:
        sql += " AND ".join(conditions)
    else:
        sql = sql.rstrip("WHERE ")

    return sql

def get_random_quote():
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    SELECT q.*,
        p.first_name || " " || p.last_name AS player_name,
        p.png_name AS png_name
    FROM quotes q
    LEFT JOIN players p ON p.player_id = q.player_id
    ORDER BY RANDOM() LIMIT 1;
    """

    cursor.execute(query)
    quote_info = cursor.fetchone()
    conn.close()
    return quote_info
