# data_fetch.py
import os
from .db_utils import get_db_connection
import sqlite3

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
    total_pages = (total_count + per_page - 1) // per_page

    conn.close()
    return countries, total_pages

def get_numberOfTeamsInCountry():
    team_number_in_country = fetch_from_sql_file("team_number_in_country.sql")
    return team_number_in_country

def get_numberOfPlayersInCountry():
    player_number_in_country = fetch_from_sql_file("player_number_in_country.sql")
    return player_number_in_country

def get_last5Games():
    last_5_games = fetch_from_sql_file("last_5_games.sql")
    return last_5_games