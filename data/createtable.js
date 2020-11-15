const AWS = require("aws-sdk");
const { dbconfig, courseParams } = require("./dataconfig");

function createdb() {
  AWS.config.update(dbconfig);
  const dynamodb = new AWS.DynamoDB();

  dynamodb.createTable(courseParams, function (err, data) {
    if (err) console.error(err);
    // an error occurred
    else console.log("table created"); // successful response
  });
}

module.exports = createdb;
