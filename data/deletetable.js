var AWS = require("aws-sdk");
const { dbconfig } = require("./dataconfig");

function deletetable(tablename) {
  AWS.config.update(dbconfig);
  var dynamodb = new AWS.DynamoDB();
  var params = {
    TableName: tablename,
  };

  dynamodb.deleteTable(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to delete table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log(
        "Deleted table. Table description JSON:",
        JSON.stringify(data, null, 2)
      );
    }
  });
}

module.exports = deletetable;
