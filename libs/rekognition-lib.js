import AWS from "aws-sdk";

export function call(action, params) {
  const rekognition = new AWS.Rekognition({region: "eu-west-1"});
  return rekognition[action](params).promise();
}