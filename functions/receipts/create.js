import uuid from "uuid";
import * as dynamoDbLib from "../../libs/dynamodb-lib";
import * as vision from "../../libs/vision-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context, callback) {

  const data = JSON.parse(event.body);

  let params = {
    TableName: "duckface-receipts",
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      receiptId: uuid.v1(),
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  try {

    const imgKey = `private/${event.requestContext.identity.cognitoIdentityId}/${data.attachment}`

    const res = await vision.call(imgKey);

    params.Item.OCR = res;

    await dynamoDbLib.call("put", params);

    callback(null, success(params.Item));

  } catch (e) {
    callback(null, failure({ status: false }));
  }
};