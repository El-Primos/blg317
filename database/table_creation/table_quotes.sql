PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS quotes (
    quote_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER,
    quote TEXT,
    FOREIGN KEY (player_id) REFERENCES players(player_id)
        ON DELETE CASCADE
);

INSERT INTO quotes (player_id, quote)
VALUES (2738, "I like stick deodorant. I'm not a huge fan of spritz."),
       (2738, "As long as I keep working hard, the sky will be the limit."),
       (202711, "Time flies. Especially when you have a great time, when you''re winning and the team is playing great."),
       (203999, "My teams in Serbia always had really good point guards. But I have always loved to dribble the ball. Even when I was outside, just walking by myself, I would always love to dribble and imagine my defender there in front of me - what I would try to do."),
       (2, "Unlike last year, we’re not just happy to be here in the Finals.");