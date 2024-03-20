CREATE TABLE app_user
(
    id        SERIAL PRIMARY KEY,
    email     VARCHAR(255) UNIQUE NOT NULL,
    password  VARCHAR(255)        NOT NULL,
    full_name VARCHAR(255) UNIQUE NOT NULL,
    role      SMALLINT            NOT NULL
);

CREATE TABLE quiz
(
    id             SERIAL PRIMARY KEY,
    name           varchar(255),
    level_question smallint,
    level_answer   smallint,
    level_deepest  smallint,
    data           json NOT NULL,
    level          json NOT NULL,
    json_data      json NOT NULL,
    user_id        integer references app_user ON DELETE CASCADE
);
