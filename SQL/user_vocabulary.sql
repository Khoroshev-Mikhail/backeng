-- \i /Users/tatanaarhipova/MikeIT/backeng/SQL/user_vocabulary.sql

SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

CREATE TABLE user_vocabulary (
    id_user INTEGER REFERENCES users (id),
    spelling INTEGER[] DEFAULT array[]::INTEGER[],
    auding INTEGER[] DEFAULT array[]::INTEGER[],
    english INTEGER[] DEFAULT array[]::INTEGER[],
    russian INTEGER[] DEFAULT array[]::INTEGER[]
);

INSERT INTO "user_vocabulary" ("id_user", "spelling", "auding", "english", "russian") 
VALUES (1, ARRAY[1,2,3], ARRAY[10,11,12], ARRAY[19,20,21], ARRAY[28,29,30]);

