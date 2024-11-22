# Variables
NEXT_DIR=React
FLASK_DIR=src/backend

# Commands
.PHONY: next flask start_all stop_all

# Run Next.js
next:
	cd $(NEXT_DIR) && npm run dev

# Run Flask API
flask:
	cd $(FLASK_DIR) && python app.py

# Start both (parallel)
startall:
	$(MAKE) next & $(MAKE) flask

# Stop both
stopall:
	pkill -f "npm run dev" || true
	pkill -f "flask run" || true

# Help message
help:
	@echo "Available targets:"
	@echo "  next       - Run the Next.js development server."
	@echo "  flask      - Run the Flask API."
	@echo "  start_all  - Run both servers in parallel."
	@echo "  stop_all   - Stop both servers."
