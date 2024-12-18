from .db_utils import get_db_connection
import sqlite3

def add_team(data):
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = f"INSERT INTO teams {generate_insert_query(data)}"
    cursor.execute(sql_query)
    conn.commit()
    conn.close()

def update_team(team_id, data):
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = f"UPDATE teams SET {generate_updae_query(data)} WHERE team_id = {team_id}"
    cursor.execute(sql_query)
    conn.commit()
    conn.close()

def delete_team(team_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = f"DELETE FROM teams WHERE team_id = {team_id}"
    cursor.execute(sql_query)
    conn.commit()
    conn.close()


def generate_insert_query(data):
    keys = ', '.join(data.keys())
    values = ', '.join(f"'{v}'" if isinstance(v, str) else str(v) for v in data.values())

    return f"({keys}) VALUES ({values})"

def generate_updae_query(data):
    return ', '.join(f"{k} = '{v}'" if isinstance(v, str) else f"{k} = {v}" for k, v in data.items())
