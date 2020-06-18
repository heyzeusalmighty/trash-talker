
# getting running

- Install libraries: `npm install`
- Make yourself a database: `cp db/message.sample.db db/message/db`
- set up your `.env` file too.  You need the following entries:
    ```
    SLACK_TOKEN='xo***********************'
    AWS_ID='xxxxxxx'
    AWS_SECRET='yyyyyyy'
    BUCKET_NAME='bucket/for/data'
    ```