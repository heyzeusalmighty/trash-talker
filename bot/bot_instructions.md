

- make a new Lambda function. you are going to upload the contents of this directory to that lambda

- make a new Rest API using Post.  point it to the Lambda you just created.  make sure proxy integration is turned on.
  - if you don't do the proxy, the API gateway won't send the full request to the function.

TODO:

- upload the wordStats to lambda function automatically.