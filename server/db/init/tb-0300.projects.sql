BEGIN TRANSACTION;
SET search_path TO main;

CREATE TYPE main.project_user_role AS ENUM ('admin', 'party');

-- projects --
CREATE TABLE main.projects (
    project_id BIGSERIAL NOT NUll,
    name TEXT NOT NULL,
    uid TEXT NOT NULL,
    user_id INT4 NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    creation_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT projects_project_id_pkey PRIMARY KEY (project_id),
    CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES main.users(user_id),
    CONSTRAINT projects_uid_ukey UNIQUE (uid)
);

COMMENT ON TABLE main.projects IS 'Projects table';
COMMENT ON COLUMN main.projects.name IS 'Project name';
COMMENT ON COLUMN main.projects.uid IS 'Project uid';
COMMENT ON COLUMN main.projects.user_id IS 'Project creator user id foreign key';
COMMENT ON COLUMN main.projects.image IS 'Project image';
COMMENT ON COLUMN main.projects.description IS 'Project description';
COMMENT ON COLUMN main.projects.creation_datetime IS 'Project creation timestamp';

-- projects_users_roles --
-- CREATE TABLE main.projects_users_roles (
--     project_user_role_id SMALLSERIAL NOT NULL,
--     name TEXT NOT NULL,
--     CONSTRAINT projects_users_roles_project_user_role_id_pkey PRIMARY KEY (project_user_role_id),
--     CONSTRAINT projects_users_roles_name_ukey UNIQUE (name)
-- );
--
-- COMMENT ON TABLE main.projects_users_roles IS 'Projects users roles table';
-- COMMENT ON COLUMN main.projects_users_roles.project_user_role_id IS 'Project user role id';
-- COMMENT ON COLUMN main.projects_users_roles.name IS 'Project user role name';

-- projects_users --
CREATE TABLE main.projects_users (
    project_id INT8 NOT NULL,
    user_id INT8 NOT NULL,
    role main.project_user_role NOT NULL DEFAULT 'party'::main.project_user_role,
    creation_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT projects_users_project_id_fkey FOREIGN KEY (project_id) REFERENCES main.projects(project_id),
    CONSTRAINT projects_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES main.users(user_id),
    CONSTRAINT projects_users_project_id_user_id_ukey UNIQUE (project_id, user_id)
);

COMMENT ON TABLE main.projects_users IS 'Projects users table';
COMMENT ON COLUMN main.projects_users.project_id IS 'Project user project id foreign key';
COMMENT ON COLUMN main.projects_users.user_id IS 'Project user role foreign key';
COMMENT ON COLUMN main.projects_users.role IS 'Project user role id foreign key';
COMMENT ON COLUMN main.projects_users.creation_datetime IS 'Project user creation timestamp';

-- projects_likes --
CREATE TABLE main.projects_likes (
    project_id INT8 NOT NULL,
    user_id INT8 NOT NULL,
    creation_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT projects_likes_project_id_fkey FOREIGN KEY (project_id) REFERENCES main.projects(project_id),
    CONSTRAINT projects_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES main.users(user_id),
    CONSTRAINT projects_likes_project_id_user_id_ukey UNIQUE (project_id, user_id)
);

COMMENT ON TABLE main.projects_likes IS 'Projects likes table';
COMMENT ON COLUMN main.projects_likes.project_id IS 'Projects likes project id foreign key';
COMMENT ON COLUMN main.projects_likes.user_id IS 'Projects likes user id foreign key';
COMMENT ON COLUMN main.projects_likes.creation_datetime IS 'Project like creation timestamp';

COMMIT;
