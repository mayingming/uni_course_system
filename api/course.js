"use strict";

const AWS = require("aws-sdk");
// AWS.config.setPromisesDependency(require("bluebird"));
// const dynamoDb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: "localhost",
  endpoint: "http://localhost:8000",
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const courseCode = requestBody.courseCode;
  const courseName = requestBody.courseName;
  const major = requestBody.major;

  if (
    typeof courseCode !== "string" ||
    typeof courseName !== "string" ||
    typeof major !== "string"
  ) {
    console.error("Validation Failed");
    callback(new Error("Couldn't create course because of validation errors."));
    return;
  }

  const courseInfo = {
    courseCode,
    courseName,
    major,
  };

  const params = {
    TableName: process.env.COURSE_TABLE,
    Item: courseInfo,
  };

  console.log("Adding a new item...");
  dynamoDb.put(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to add item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: "Unable to submit course",
        }),
      });
    } else {
      console.log("Added item");
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: "Sucessfully submitted course",
        }),
      });
    }
  });
};

module.exports.list = (event, context, callback) => {
  var params = {
    TableName: process.env.COURSE_TABLE,
    ProjectionExpression: "courseCode, courseName, major",
  };
  console.log("Scanning Course table.");
  dynamoDb.scan(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to Scan items. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: "Unable to scan courses",
        }),
      });
    } else {
      console.log("Scanned items");
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          courses: data.Items,
        }),
      });
    }
  });
};

module.exports.getByCourseCode = (event, context, callback) => {
  const params = {
    TableName: process.env.COURSE_TABLE,
    Key: {
      courseCode: event.pathParameters.courseCode,
    },
  };
  dynamoDb
    .get(params)
    .promise()
    .then((result) => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
      callback(null, response);
    })
    .catch((error) => {
      console.error(error);
      callback(new Error("Couldn't fetch course."));
      return;
    });
};

module.exports.deleteByCourseCode = (event, context, callback) => {
  const params = {
    TableName: process.env.COURSE_TABLE,
    Key: {
      courseCode: event.pathParameters.courseCode,
    },
  };
  dynamoDb.delete(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to delete item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: "Unable to delete course",
        }),
      });
    } else {
      console.log("Deleted item");
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: "Sucessfully deleted course",
        }),
      });
    }
  });
};

module.exports.getByMajor = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const params = {
    TableName: process.env.COURSE_TABLE,
    IndexName: "MajorIndex",
    KeyConditionExpression: "major = :major",
    ExpressionAttributeValues: {
      ":major": requestBody.major,
    },
    ProjectionExpression: "courseCode, courseName, major",
    ScanIndexForward: false,
  };
  dynamoDb
    .query(params)
    .promise()
    .then((data) => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({ courses: data.Items }),
      };
      callback(null, response);
    })
    .catch((error) => {
      console.error(error);
      callback(new Error("Couldn't fetch course."));
      return;
    });
};

module.exports.getByName = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const params = {
    TableName: process.env.COURSE_TABLE,
    IndexName: "CourseNameIndex",
    KeyConditionExpression: "courseName = :name",
    ExpressionAttributeValues: {
      ":name": requestBody.courseName,
    },
    ProjectionExpression: "courseCode, courseName, major",
    ScanIndexForward: false,
  };
  dynamoDb
    .query(params)
    .promise()
    .then((data) => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({ courses: data.Items }),
      };
      callback(null, response);
    })
    .catch((error) => {
      console.error(error);
      callback(new Error("Couldn't fetch course."));
      return;
    });
};
