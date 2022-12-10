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
    birth DATE DEFAULT NULL,
    token VARCHAR(255) DEFAULT NULL,
    refresh_token VARCHAR(255) DEFAULT NULL
);

INSERT INTO "users" 
("user_login", "user_password", "user_name", "email") VALUES 
('mike', 'Araara14', 'Mikhail', '79836993884@ya.ru');
