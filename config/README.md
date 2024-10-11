# Database Configuration

Here I am providing the schema for all the tables. In total there are 6 tables (my user account name is called `jobs`). 

`postgre.sql` contains the sql commands to create the following tables and insert basic entries into so tables like `auth.roles` and `auth.permissions`.

1. PG schema for `public.jobs` table. `public.jobs` is the table storing information about job advertisements.
```
                                           Table "public.jobs"
     Column      |            Type             | Collation | Nullable |             Default              
-----------------+-----------------------------+-----------+----------+----------------------------------
 id              | integer                     |           | not null | nextval('jobs_id_seq'::regclass)
 job_title       | character varying(255)      |           | not null | 
 job_description | text                        |           | not null | 
 company_name    | character varying(255)      |           | not null | 
 date_posted     | date                        |           | not null | CURRENT_DATE
 original_link   | character varying(255)      |           | not null | 
 location        | character varying(255)      |           | not null | 
 created_at      | timestamp without time zone |           | not null | CURRENT_TIMESTAMP
 updated_at      | timestamp without time zone |           | not null | CURRENT_TIMESTAMP
Indexes:
    "jobs_pkey" PRIMARY KEY, btree (id)
    "unique_job" UNIQUE CONSTRAINT, btree (job_title, job_description, company_name, original_link, location)
```

The remaining tables are under the 'auth' schema.

2. PG schema for auth.users table. `auth.users` is the table for user account details.
```
jobs=> \d auth.users
                                             Table "auth.users"
    Column     |            Type             | Collation | Nullable |                Default                 
---------------+-----------------------------+-----------+----------+----------------------------------------
 id            | integer                     |           | not null | nextval('auth.users_id_seq'::regclass)
 username      | character varying(50)       |           | not null | 
 email         | character varying(100)      |           | not null | 
 password_hash | character varying(255)      |           | not null | 
 created_at    | timestamp without time zone |           | not null | CURRENT_TIMESTAMP
 updated_at    | timestamp without time zone |           | not null | CURRENT_TIMESTAMP
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_email_key" UNIQUE CONSTRAINT, btree (email)
Referenced by:
    TABLE "auth.user_roles" CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id)

```

3. PG schema for `auth.user_roles` table. `auth.user_roles` maps a user's id to their role id, which is an integer encoding one of `admin`, `moderator` or `user`. An entry in this table is created alongside `auth.users` when a new user registers. 
```
              Table "auth.user_roles"
 Column  |  Type   | Collation | Nullable | Default 
---------+---------+-----------+----------+---------
 user_id | integer |           | not null | 
 role_id | integer |           | not null | 
Indexes:
    "user_roles_pkey" PRIMARY KEY, btree (user_id, role_id)
Foreign-key constraints:
    "user_roles_role_id_fkey" FOREIGN KEY (role_id) REFERENCES auth.roles(id)
    "user_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id)
```

4. PG schema for `auth.roles` table. `auth.roles` maps the `role_id` integer to the role, which is one of `admin`, `moderator` or `user`.
```
jobs=> \d auth.roles
                                         Table "auth.roles"
   Column    |         Type          | Collation | Nullable |                Default                 
-------------+-----------------------+-----------+----------+----------------------------------------
 id          | integer               |           | not null | nextval('auth.roles_id_seq'::regclass)
 name        | character varying(50) |           | not null | 
 description | text                  |           |          | 
Indexes:
    "roles_pkey" PRIMARY KEY, btree (id)
    "roles_name_key" UNIQUE CONSTRAINT, btree (name)
Referenced by:
    TABLE "auth.role_permissions" CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY (role_id) REFERENCES auth.roles(id)
    TABLE "auth.user_roles" CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY (role_id) REFERENCES auth.roles(id)
```

5. PG schema for `auth.role_permissions` table. `auth.role_permissions` maps each `role_id` to the `permission_id` which indicates what actions the user is permitted to perform.
```
jobs=> \d auth.role_permissions
              Table "auth.role_permissions"
    Column     |  Type   | Collation | Nullable | Default 
---------------+---------+-----------+----------+---------
 role_id       | integer |           | not null | 
 permission_id | integer |           | not null | 
Indexes:
    "role_permissions_pkey" PRIMARY KEY, btree (role_id, permission_id)
Foreign-key constraints:
    "role_permissions_permission_id_fkey" FOREIGN KEY (permission_id) REFERENCES auth.permissions(id)
    "role_permissions_role_id_fkey" FOREIGN KEY (role_id) REFERENCES auth.roles(id)
```

6. PG schema for `auth.permissions`. It describes the type of actions that can be performed on the database.
```
                                         Table "auth.permissions"
   Column    |         Type          | Collation | Nullable |                   Default                    
-------------+-----------------------+-----------+----------+----------------------------------------------
 id          | integer               |           | not null | nextval('auth.permissions_id_seq'::regclass)
 name        | character varying(50) |           | not null | 
 description | text                  |           |          | 
Indexes:
    "permissions_pkey" PRIMARY KEY, btree (id)
    "permissions_name_key" UNIQUE CONSTRAINT, btree (name)
Referenced by:
    TABLE "auth.role_permissions" CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY (permission_id) REFERENCES auth.permissions(id)
```