CREATE TABLE users (
  id serial PRIMARY KEY,
  balance INT NOT NULL
);

CREATE TABLE transactions (
  id serial PRIMARY KEY,
  "type" VARCHAR(64) NOT NULL,
  user_id int REFERENCES users(id) not NULL,
  target_user_id int REFERENCES users(id),
  amount int NOT NULL,
  time_transaction TIMESTAMP DEFAULT(now())
)