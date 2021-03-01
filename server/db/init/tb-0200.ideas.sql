BEGIN TRANSACTION;
SET search_path TO main;

-- Ideas --
CREATE SEQUENCE main.ideas_idea_id_seq;

DROP TABLE IF EXISTS main.ideas;
CREATE TABLE main.ideas (
    idea_id INT8 DEFAULT nextval('main.users_user_id_seq'::regclass) NOT NULL,
    user_id INT8 NOT NULL,
    name TEXT NOT NULL,
    "text" TEXT NOT NULL,
    creation_datetime TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp NOT NULL,
    CONSTRAINT ideas_idea_id_pkey PRIMARY KEY (idea_id),
    CONSTRAINT ideas_user_id_fkey FOREIGN KEY (user_id) REFERENCES main.users(user_id)
);

COMMENT ON TABLE main.ideas IS 'Ideas table';
COMMENT ON COLUMN main.ideas.idea_id IS 'Idea id';
COMMENT ON COLUMN main.ideas.user_id IS 'Idea user id foreign key';
COMMENT ON COLUMN main.ideas.name IS 'Idea name';
COMMENT ON COLUMN main.ideas.text IS 'Idea text';
COMMENT ON COLUMN main.ideas.creation_datetime IS 'Idea creation datetime';

-- Users-Ideas Likes --
CREATE TABLE main.users_ideas_likes (
    user_id INT8 NOT NULL,
    idea_id INT8 NOT NULL,
    creation_datetime TIMESTAMP WITH TIME ZONE,
    CONSTRAINT users_likes_user_id FOREIGN KEY (user_id) REFERENCES main.users(user_id),
    CONSTRAINT users_likes_idea_id FOREIGN KEY (idea_id) REFERENCES main.ideas(idea_id)
);

COMMENT ON TABLE main.users_ideas_likes IS 'Users-ideas likes binding table';
COMMENT ON COLUMN main.users_ideas_likes.user_id IS 'User id foreign key';
COMMENT ON COLUMN main.users_ideas_likes.idea_id IS 'Idea id foreign key';
COMMENT ON COLUMN main.users_ideas_likes.creation_datetime IS 'Creation timestamp';

COMMIT;
