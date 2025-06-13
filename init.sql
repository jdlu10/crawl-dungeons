-- ONLY used for development where Postgres is run in Docker
create role crawl_dungeons with CREATEDB SUPERUSER login password 'crawl_dungeons';