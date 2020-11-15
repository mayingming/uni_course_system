const AWS = require("aws-sdk");
const async = require("async");
const { dbconfig } = require("./dataconfig");
var fs = require("fs");
var parse = require("csv-parse");
function importdata(filename, tablename) {
  rs = fs.createReadStream(filename);
  AWS.config.update(dbconfig);
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  parser = parse(
    {
      columns: true,
      delimiter: ",",
    },
    function (err, data) {
      var split_arrays = [],
        size = 25;
      while (data.length > 0) {
        split_arrays.push(data.splice(0, size));
      }
      data_imported = false;
      chunk_no = 1;
      async.each(
        split_arrays,
        function (item_data, callback) {
          const params = {
            RequestItems: {},
          };
          params.RequestItems[tablename] = [];
          item_data.forEach((item) => {
            for (key of Object.keys(item)) {
              // An AttributeValue may not contain an empty string
              if (item[key] === "") delete item[key];
              item[key] = item[key].trim();
            }

            params.RequestItems[tablename].push({
              PutRequest: {
                Item: {
                  ...item,
                },
              },
            });
          });
          dynamoDb.batchWrite(params, function (err, res, cap) {
            console.log("done going next");
            if (err == null) {
              console.log("Success chunk #" + chunk_no);
              data_imported = true;
            } else {
              console.log(err);
              console.log("Fail chunk #" + chunk_no);
              data_imported = false;
            }
            chunk_no++;
            callback();
          });
        },
        function () {
          // run after loops
          console.log("all data imported....");
        }
      );
    }
  );
  rs.pipe(parser);
}

module.exports = importdata;
