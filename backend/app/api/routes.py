from flask import Blueprint, request, jsonify
from app.utils.data_fetch import get_countries, get_numberOfPlayersInCountry, get_numberOfTeamsInCountry, get_last5Games

api_bp = Blueprint("api", __name__)

# API endpoint for countries
@api_bp.route('/countries', methods=['GET'])
def countries_api():
    query = request.args.get("name")
    page = int(request.args.get("page", 1))

    countries, total_pages = get_countries(query, page)

    return jsonify({
        'countries': [{'country_id': country[0], 'name': country[1], 'flag_link': country[2]} for country in countries],
        'page': page,
        'total_pages': total_pages
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

@api_bp.route('/last5Games', methods=['GET'])
def last5Games_api():
    table = get_last5Games()

    return jsonify({
        'last5Games': [{'game_id': row[0], 
                        'date': row[1], 
                        'home_team_id': row[2], 
                        'home_team_name': row[3], 
                        'home_team_score': row[4], 
                        "away_team_id": row[5], 
                        "away_team_name": row[6],
                        "away_team_score": row[7],
                        "official_name": row[8]} for row in table],
    })

if __name__ == '__main__':
    app.run(debug=True)
