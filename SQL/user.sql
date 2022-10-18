SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_login VARCHAR(25), /*Добавить уникальность*/
    user_password VARCHAR(25),
    user_name VARCHAR(25),
    email VARCHAR(100) DEFAULT NULL, /*Добавить уникальность*/
    birth DATE DEFAULT NULL
);

INSERT INTO "users" 
("user_login", "user_password", "user_name", "email") VALUES 
('mike', 'Araara14', 'Mikhail', '79836993884@ya.ru');

CREATE TABLE user_vocabulary (
    id_user INTEGER REFERENCES users (id),
    spelling INTEGER[],
    auding INTEGER[],
    english INTEGER[],
    russian INTEGER[]
);

INSERT INTO "user_vocabulary" ("id_user", "spelling", "auding", "english", "russian") 
VALUES (1, ARRAY[1,2,3], ARRAY[10,11,12], ARRAY[19,20,21], ARRAY[28,29,30]);

