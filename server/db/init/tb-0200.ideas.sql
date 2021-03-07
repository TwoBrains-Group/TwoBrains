BEGIN TRANSACTION;
SET search_path TO main;

-- ideas --
DROP TABLE IF EXISTS main.ideas;
CREATE TABLE main.ideas (
    idea_id BIGSERIAL NOT NULL,
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

-- ideas_likes --
CREATE TABLE main.ideas_likes (
    user_id INT8 NOT NULL,
    idea_id INT8 NOT NULL,
    creation_datetime TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp NOT NULL,
    CONSTRAINT users_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES main.users(user_id),
    CONSTRAINT users_likes_idea_id_fkey FOREIGN KEY (idea_id) REFERENCES main.ideas(idea_id)
);

COMMENT ON TABLE main.ideas_likes IS 'Ideas-likes binding table';
COMMENT ON COLUMN main.ideas_likes.user_id IS 'User id foreign key';
COMMENT ON COLUMN main.ideas_likes.idea_id IS 'Idea id foreign key';
COMMENT ON COLUMN main.ideas_likes.creation_datetime IS 'Creation timestamp';

-- ideas_comments --
CREATE TABLE main.ideas_comments (
    idea_comment_id BIGSERIAL NOT NULL,
    idea_id INT8 NOT NULL,
    user_id INT8 NOT NULL,
    text TEXT NOT NULL,
    reply_to INT8 DEFAULT NULL,
    creation_datetime TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp NOT NULL,
    CONSTRAINT ideas_comments_idea_comment_id_pkey PRIMARY KEY (idea_comment_id),
    CONSTRAINT ideas_comments_idea_id_fkey FOREIGN KEY (idea_id) REFERENCES main.ideas(idea_id),
    CONSTRAINT ideas_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES main.users(user_id),
    CONSTRAINT ideas_comments_reply_to_fkey FOREIGN KEY (idea_comment_id) REFERENCES main.ideas_comments(idea_comment_id)
);

COMMENT ON TABLE main.ideas_comments IS 'Ideas-comments table';
COMMENT ON COLUMN main.ideas_comments.idea_id IS 'Idea comment idea_id foreign key';
COMMENT ON COLUMN main.ideas_comments.user_id IS 'Idea comment user_id foreign key';
COMMENT ON COLUMN main.ideas_comments.text IS 'Idea comment text';
COMMENT ON COLUMN main.ideas_comments.reply_to IS 'Idea comment reply comment id foreign key';
COMMENT ON COLUMN main.ideas_comments.creation_datetime IS 'Idea comment creation timestamp';

-- ideas_comments_likes --
CREATE TABLE main.ideas_comments_likes (
    idea_comment_id INT8 NOT NULL,
    user_id INT8 NOT NULL,
    creation_datetime TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp NOT NULL,
    CONSTRAINT ideas_comments_likes_idea_comment_id_fkey FOREIGN KEY (idea_comment_id) REFERENCES main.ideas_comments(idea_comment_id),
    CONSTRAINT ideas_comments_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES main.users(user_id)
);

COMMENT ON TABLE main.ideas_comments_likes IS 'Ideas-comments-likes binding table';
COMMENT ON COLUMN main.ideas_comments_likes.idea_comment_id IS 'Idea comment like id foreign key';
COMMENT ON COLUMN main.ideas_comments_likes.user_id IS 'User id foreign key';
COMMENT ON COLUMN main.ideas_comments_likes.creation_datetime IS 'Creation timestamp';


COMMIT;
