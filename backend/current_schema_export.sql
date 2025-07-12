                                                 List of relations
 Schema |            Name            |   Type   |  Owner   | Persistence | Access method |    Size    | Description 
--------+----------------------------+----------+----------+-------------+---------------+------------+-------------
 public | alembic_version            | table    | postgres | permanent   | heap          | 0 bytes    | 
 public | book_preview_images        | table    | postgres | permanent   | heap          | 16 kB      | 
 public | book_preview_images_id_seq | sequence | postgres | permanent   |               | 8192 bytes | 
 public | book_tags                  | table    | postgres | permanent   | heap          | 8192 bytes | 
 public | books                      | table    | postgres | permanent   | heap          | 16 kB      | 
 public | books_id_seq               | sequence | postgres | permanent   |               | 8192 bytes | 
 public | borrowers                  | table    | postgres | permanent   | heap          | 16 kB      | 
 public | borrowers_id_seq           | sequence | postgres | permanent   |               | 8192 bytes | 
 public | categories                 | table    | postgres | permanent   | heap          | 16 kB      | 
 public | categories_id_seq          | sequence | postgres | permanent   |               | 8192 bytes | 
 public | lending_records            | table    | postgres | permanent   | heap          | 16 kB      | 
 public | lending_records_id_seq     | sequence | postgres | permanent   |               | 8192 bytes | 
 public | tags                       | table    | postgres | permanent   | heap          | 16 kB      | 
 public | tags_id_seq                | sequence | postgres | permanent   |               | 8192 bytes | 
 public | user_favorites             | table    | postgres | permanent   | heap          | 8192 bytes | 
 public | users                      | table    | postgres | permanent   | heap          | 16 kB      | 
 public | users_id_seq               | sequence | postgres | permanent   |               | 8192 bytes | 
(17 rows)

                                                                                                                                                                                                                                                                                                                                                                                                                                  create_statement                                                                                                                                                                                                                                                                                                                                                                                                                                   
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 CREATE TABLE alembic_version (version_num VARCHAR(32) NOT NULL);
 CREATE TABLE book_preview_images (image_path VARCHAR(255) NOT NULL, caption TEXT, id INTEGER NOT NULL DEFAULT nextval('book_preview_images_id_seq'::regclass), book_id INTEGER NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, display_order INTEGER DEFAULT 0);
 CREATE TABLE book_tags (tag_id INTEGER NOT NULL, book_id INTEGER NOT NULL);
 CREATE TABLE books (room VARCHAR(100), author_bn TEXT, page_count INTEGER, column_location VARCHAR(100), total_copies INTEGER DEFAULT 1, publisher_bn TEXT, comments TEXT, available_copies INTEGER DEFAULT 1, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, language VARCHAR(50) DEFAULT 'English'::character varying, publisher VARCHAR(200), rating SMALLINT, description_bn TEXT, title VARCHAR(255) NOT NULL, read_status VARCHAR(50) DEFAULT 'unread'::character varying, location_comment TEXT, category_id INTEGER, id INTEGER NOT NULL DEFAULT nextval('books_id_seq'::regclass), row_location VARCHAR(100), cover_image VARCHAR(255), author VARCHAR(255) NOT NULL, description TEXT, genre VARCHAR(100), title_bn TEXT, shelf VARCHAR(100), publication_year INTEGER, updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, isbn VARCHAR(20));
 CREATE TABLE borrowers (last_name VARCHAR(100) NOT NULL, current_books_count INTEGER DEFAULT 0, id INTEGER NOT NULL DEFAULT nextval('borrowers_id_seq'::regclass), address TEXT, relationship VARCHAR(100), phone VARCHAR(20), email VARCHAR(100), first_name_bn TEXT, comments TEXT, first_name VARCHAR(100) NOT NULL, last_name_bn TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, address_bn TEXT);
 CREATE TABLE categories (id INTEGER NOT NULL DEFAULT nextval('categories_id_seq'::regclass), description TEXT, updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, name VARCHAR(100) NOT NULL, parent_id INTEGER);
 CREATE TABLE lending_records (notes TEXT, id INTEGER NOT NULL DEFAULT nextval('lending_records_id_seq'::regclass), borrower_id INTEGER, status VARCHAR(20) DEFAULT 'borrowed'::character varying, return_date TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, book_id INTEGER, due_date TIMESTAMP WITH TIME ZONE NOT NULL, updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, checkout_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);
 CREATE TABLE tags (id INTEGER NOT NULL DEFAULT nextval('tags_id_seq'::regclass), created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, name_bn TEXT, name VARCHAR(100) NOT NULL);
 CREATE TABLE user_favorites (created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, user_id INTEGER NOT NULL, book_id INTEGER NOT NULL);
 CREATE TABLE users (role VARCHAR(20) NOT NULL DEFAULT 'user'::character varying, updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, id INTEGER NOT NULL DEFAULT nextval('users_id_seq'::regclass), created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, hashed_password VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL, comments TEXT, username VARCHAR(50) NOT NULL);
(10 rows)

     table_name      | column_count 
---------------------+--------------
 alembic_version     |            1
 book_preview_images |            6
 book_tags           |            2
 books               |           28
 borrowers           |           14
 categories          |            6
 lending_records     |           10
 tags                |            4
 user_favorites      |            3
 users               |            8
(10 rows)

     table_name      | status 
---------------------+--------
 alembic_version     | EXISTS
 book_preview_images | EXISTS
 book_tags           | EXISTS
 books               | EXISTS
 borrowers           | EXISTS
 categories          | EXISTS
 lending_records     | EXISTS
 tags                | EXISTS
 user_favorites      | EXISTS
 users               | EXISTS
(10 rows)

