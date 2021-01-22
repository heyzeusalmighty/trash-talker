
# getting running

- Install libraries: `npm install`
- Make yourself a database: `cp db/message.sample.db db/message.db`
- set up your `.env` file too.  You need the following entries:
    ```
    SLACK_TOKEN='xo***********************'
    SIGNING_SECRET='1k2jlkjdofijlkwnlfi'
    AWS_ID='xxxxxxx'
    AWS_SECRET='yyyyyyy'
    BUCKET_NAME='bucket/for/data'
    DATABASE_BACKUP='bucket/for/backup'
    FEATS_CHANNEL_ID='IOUIUJM<JL'
    PGUSER=dbuser \
    PGHOST=database.server.com \
    PGPASSWORD=secretpassword \
    PGDATABASE=mydb \
    PGPORT=3211 \
    ```