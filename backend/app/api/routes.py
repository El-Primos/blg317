from flask import Blueprint, request, jsonify
from app.utils.data_fetch import *
from app.utils.credential_utils import check_credentials, get_token, hash_password

api_bp = Blueprint("api", __name__)

# API endpoint for countries
@api_bp.route('/countries', methods=['GET'])
def countries_api():
    query = request.args.get("name")
    page = int(request.args.get("page", 1))

    countries, total_countries = get_countries(query, page)

    return jsonify({
        'countries': [{'country_id': country[0], 'name': country[1], 'flag_link': country[2]} for country in countries],
        'page': page,
        'total_countries': total_countries
    })

@api_bp.route('/teams', methods=['GET'])
def teams_api():
    query = request.args.get("nickname") # !! search column 
    page = int(request.args.get("page", 1))

    teams, total_teams = get_teams(query, page)

    return jsonify({
        'teams': [
            {'team_id': team[0], 'abbreviation': team[1], 'nickname': team[2], 'logo_url': team[3]} 
            for team in teams
        ],
        'page': page,
        'total_teams': total_teams
    })

@api_bp.route('/players', methods=['GET'])
def players_api():
    query = request.args.get("name")  # !! Search across first_name and last_name
    page = int(request.args.get("page", 1))

    players, total_players = get_players(query, page)

    return jsonify({
        'players': [
            {
                'player_id': player[0],
                'first_name': player[1],
                'last_name': player[2],
                'height': player[3],
                'weight': player[4],
                'birth_date': player[5],
                'college': player[6],
                'country_id': player[7],
                'png_name' : player[8],
            }
            for player in players
        ],
        'page': page,
        'total_players': total_players
    })

@api_bp.route('/games', methods=['GET'])
def games_api():
    # Retrieve query parameters
    team_id = request.args.get("team_id", type=int)
    start_date = request.args.get("start_date")  # Format: YYYY-MM-DD
    end_date = request.args.get("end_date")  # Format: YYYY-MM-DD
    official_name = request.args.get("official_name")  # Search across official names
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("limit", 10))  # Default to 10 items per page

    # Fetch games and total count using the backend function
    games, total_games = get_games(
        team_id=team_id,
        start_date=start_date,
        end_date=end_date,
        official_name=official_name,
        page=page,
        per_page=per_page
    )

    # Return JSON response
    return jsonify({
        'games': [
            {
                'game_id': game[0],
                'date': game[1],
                'home_team_id': game[2],
                'home_team_name': game[3],
                'home_team_score': game[4],
                'away_team_id': game[5],
                'away_team_name': game[6],
                'away_team_score': game[7],
                'official_name': game[8]
            }
            for game in games
        ],
        'page': page,
        'per_page': per_page,
        'total_games': total_games
    })

@api_bp.route('/players/<int:player_id>', methods=["GET"])
def playerInfo_api(player_id):
    player_infos = get_playerInfo(player_id)
    return jsonify({
        'name': player_infos[0] + " " + player_infos[1],
        'height': player_infos[2],
        'weight': player_infos[3],
        'birthDate': player_infos[4],
        'college': player_infos[5],
        'country': player_infos[6],
        'country_flag': player_infos[7],
        'player_img': player_infos[8],
        'active_team_id': player_infos[9],
        'active_team_name': player_infos[10],
        'active_team_logo': player_infos[11],
        'drafted_team_id': player_infos[12],
        'drafted_team_name': player_infos[13],
        'drafted_team_logo': player_infos[14],
        'active_player': player_infos[15],
        'position': player_infos[16],
        'start_year': player_infos[17],
        'end_year': player_infos[18],
        'jersey_number': player_infos[19],
        'draft_year': player_infos[20],
        'overall_pick': player_infos[21],
        'country_id': player_infos[22],
        'team_id': player_infos[23]
    })

@api_bp.route('/games/<int:game_id>', methods=["GET"])
def gameInfo_api(game_id):
    game_infos = get_gameInfo(game_id)
    return jsonify({
        'game_id': game_infos[0],
        'date': game_infos[1],
        'home_team_id': game_infos[2],
        'home_team_name': game_infos[3],
        'away_team_id': game_infos[4],
        'away_team_name': game_infos[5],
        'official_name': game_infos[6],
        'season': game_infos[7],
        'home_team_score': game_infos[8],
        'away_team_score': game_infos[9],
        'home_qtr1_points': game_infos[10],
        'home_qtr2_points': game_infos[11],
        'home_qtr3_points': game_infos[12],
        'home_qtr4_points': game_infos[13],
        'away_qtr1_points': game_infos[14],
        'away_qtr2_points': game_infos[15],
        'away_qtr3_points': game_infos[16],
        'away_qtr4_points': game_infos[17],
        'home_rebounds': game_infos[18],
        'home_blocks': game_infos[19],
        'home_steals': game_infos[20],
        'away_rebounds': game_infos[21],
        'away_blocks': game_infos[22],
        'away_steals': game_infos[23],
        'home_team_logo': game_infos[24],
        'away_team_logo': game_infos[25]     
    })



@api_bp.route('/numberOfTeams', methods=['GET'])
def numberOfTeams_api():
    table = get_numberOfTeamsInCountry()

    return jsonify({
        'numberOfTeams': [{'country_id': row[0], 'country_name': row[1], 'team_count': row[2]} for row in table],
    })

@api_bp.route('/numberOfPlayers', methods=['GET'])
def numberOfPlayers_api():
    table = get_numberOfPlayersInCountry()

    return jsonify({
        'numberOfPlayers': [{'country_id': row[0], 'country_name': row[1], 'player_count': row[2]} for row in table],
    })


@api_bp.route('/getLastGames', methods=['GET'])
def getLastGames_api():
    # Get the limit parameter from the query string, default to 5
    limit = request.args.get('limit', default=5, type=int)
    games = getLastGames(limit)
        # Format games into a list of dictionaries for JSON response
    formatted_games = [
        {
            "game_id": game[0],
            "date": game[1],
            "home_team_id": game[2],
            "home_team_name": game[3],
            "home_team_score": game[4],
            "away_team_id": game[5],
            "away_team_name": game[6],
            "away_team_score": game[7],
            "official_name": game[8]
        }
        for game in games
    ]

    return jsonify(formatted_games)

@api_bp.route('/country/<int:country_id>/players', methods=['POST'])
def countryPlayers_api(country_id):
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))

    query = request.get_json();
    query['country_id'] = {
        "operator": "and",
        "constraints": [
            {"value": f"{country_id}", "mode": "="}
        ]
    }

    table, total_countryPlayers = get_countryPlayers(query, page, limit)

    return jsonify({
        'counrtyPlayers': [{'player_id': row[0], 'first_name': row[1], 'last_name': row[2], 'height': row[3], 'weight': row[4], 'birth_date': row[5], 'college': row[6]} for row in table],
        'page': page,
        'totalCountryPlayers': total_countryPlayers
    })

@api_bp.route('/country/<int:country_id>/teams', methods=['POST'])
def countryTeams_api(country_id):
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))

    query = request.args.to_dict(flat=False)
    query.pop("page")
    query.pop("limit")

    query = request.get_json();
    query['country_id'] = {
        "operator": "and",
        "constraints": [
            {"value": f"{country_id}", "mode": "="}
        ]
    }

    table, total_countryTeams = get_countryTeams(query, page, limit)

    return jsonify({
        'counrtyTeams': [{'team_id': row[0], 'name': row[1], 'owner': row[2], 'general_manager': row[3], 'headcoach': row[4], 'city_name': row[5], 'arena_name': row[6], 'year_founded': row[7]} for row in table],
        'page': page,
        'totalCountryTeams': total_countryTeams
    })

@api_bp.route('/teams/<int:teamid>', methods = ['GET'])
def teamInfo_api(teamid):
    teamInfo = get_teamInfo(teamid)
    roster = get_activeRoster(teamid)
    last5Games = getLastGames(5, teamid)
    return jsonify({
        'teamInfo' : [{'teamName' : teamInfo[1], 'abbreviation' : teamInfo[2] , 'foundedYear' : teamInfo[4], 'owner' : teamInfo[5], 'generalMan' : teamInfo[6], 'headCoach' : teamInfo[7], 'dTeam' : teamInfo[8], 'facebook' : teamInfo[9], 'instagram' : teamInfo[10], 'twitter' : teamInfo[11], 'logo' : teamInfo[12], 'city' : teamInfo[13], 'state' : teamInfo[17], 'arenaName' : teamInfo[18], 'arenaCapacity' : teamInfo[19]}],
        'activeRoster' : [{'jerseyNumber' : row[9], 'firstName' : row[2], 'lastName' : row[3], 'position' : row[10], 'height' : row[4], 'playerID' : row[1]} for row in roster],
        'last5Games' : [{'date' : game[1], 'home_team_name' : game[3], 'home_team_score' : game[4], 'away_team_name' : game[6], 'away_team_score' : game[7], 'official_name' : game[8], 'game_id' : game[0]} for game in last5Games]
    })

@api_bp.route('/signup', methods=['POST'])
def admin_signup():
    try:
        data = request.get_json()
        print("DATA: ", data)
        if not data or 'username' not in data or 'password' not in data or 'mail' not in data:
            return jsonify({"error": "Missing username or password"}), 400

        username = data.get('username')
        mail = data.get('mail')
        password = data.get('password')

        password_hash = hash_password(password)

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO admins (username, mail, password_hash, creation_date)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        """, (username, mail, password_hash))

        conn.commit()
        conn.close()

        return jsonify({'message': 'User registered successfully'}), 200

    except sqlite3.IntegrityError as e:
        conn.close()
        return jsonify({'error': 'User already exists or invalid data provided', 'details': str(e)}), 400

    except Exception as e:
        conn.close()
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

@api_bp.route('/login', methods = ['POST'])
def admin_login():
    data = request.get_json()

    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Missing username or password"}), 400

    username = data['username']
    password = data['password']

    if (check_credentials(username, password)):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        UPDATE admins 
        SET last_login = CURRENT_TIMESTAMP
        WHERE username = ?
    """, (username,))
    
        conn.commit()
        conn.close()

        token = get_token(username)
        return jsonify({'message': 'Login successful', 'token': token}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

if __name__ == '__main__':
    app.run(debug=True)
