
# Database Configuration

Here I am providing the schema for all the tables. In total there are 6 tables (my user account name is called `jobs`):


1. PG schema for public.jobs table
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

2. PG schema for auth.users table
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

3. PG schema for auth.user_roles table
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

4. PG schema for auth.roles tables
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

5. PG schema for auth.role_permissions table
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