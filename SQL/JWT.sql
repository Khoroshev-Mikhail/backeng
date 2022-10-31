SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

CREATE TABLE user_tokens (
    id_user INTEGER REFERENCES users (id),
    token VARCHAR (200),
    refresh_token VARCHAR (200)
);


