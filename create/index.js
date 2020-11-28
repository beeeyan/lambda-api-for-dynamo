const AWS = require(`aws-sdk`);
const dynamo = new AWS.DynamoDB();
const dynamoclient = new AWS.DynamoDB.DocumentClient();

function sequence(sequenceName, callback) {
  const params = {
    TableName: 'sequence',
    Key: { name: { S: sequenceName } },
    AttributeUpdates: {
      num: {
        Action: 'ADD',
        Value: { N: "1" }
      }
    },
    ReturnValues: 'UPDATED_NEW'
  };

  dynamo.updateItem(params, function (err, data) {
    let id
    if (err) {
      console.log(err); // an error occurred
    } else {
      id = data.Attributes.num.N;
    }
    callback(id);
  });
}

exports.handler = (event, context, callback) => {

  sequence("questionnaire", function(id){
    event.id = parseInt(id);
    const params = {
      TableName: 'questionnaire',
      Item: event
    };
    dynamoclient.put(params, function (err, data) {
      const response = {
        statusCode: 200,
        body: JSON.stringify(event)
      }
      callback(null, response)
    });
  });
}