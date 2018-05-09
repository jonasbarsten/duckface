'use strict';

var rp = require('request-promise');
import * as s3 from "./s3-lib";

export async function call(key) {

	const image = await s3.call('getObject', {Bucket: 'duckface', Key: key});
	const imageEncoded = image.Body.toString('base64');

	const options = {
		method: 'POST',
		uri: `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
		headers: {
			'Content-Type': 'application/json'
		},
		body: {
			"requests": [{
				"image": {
					"content": imageEncoded
				},
				"features": [
					{
						"type": "TEXT_DETECTION"
					},
					{
				  	"type": "CROP_HINTS"
					}
				]
			}]
		},
		json: true
	};

	const ocr = await rp(options);

	return ocr;
};