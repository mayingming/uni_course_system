const dbconfig = {
  region: "localhost",
  endpoint: "http://localhost:8000",
};

var courseParams = {
  TableName: "course",
  KeySchema: [
    {
      AttributeName: "courseCode",
      KeyType: "HASH",
    },
  ],
  AttributeDefinitions: [
    { AttributeName: "courseCode", AttributeType: "S" },
    { AttributeName: "courseName", AttributeType: "S" },
    { AttributeName: "major", AttributeType: "S" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
  GlobalSecondaryIndexes: [
    {
      IndexName: "MajorIndex",
      KeySchema: [
        {
          AttributeName: "major",
          KeyType: "HASH",
        },
      ],
      Projection: {
        ProjectionType: "ALL",
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
      },
    },
    {
      IndexName: "CourseNameIndex",
      KeySchema: [
        {
          AttributeName: "courseName",
          KeyType: "HASH",
        },
      ],
      Projection: {
        ProjectionType: "ALL",
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
      },
    },
  ],
};

module.exports = { dbconfig, courseParams };
