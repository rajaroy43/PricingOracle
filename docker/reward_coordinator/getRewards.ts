import http from "http"

//questionGroupId, questionId, wisdomNodeAddess, answerSet, answerValue, stakeAmount, wisdomNodeReputation
const preparePayloadRow = (groupId: string, questionId: string, answer: any) => {

}

const preparePayload = (groupData: any) => {
  return {

  }
}

const getRewards = (groupData: any) => {
  const msg = preparePayload(groupData)
  const postData = JSON.stringify({
    msg
  });

  const options = {
    hostname: process.env.REWARD_CALCULATOR_URI,
    port: process.env.REWARD_CALCULATOR_PORT,
    method: "POST",
    data: postData,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });
  
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  
  // Write data to request body
  req.write(postData);
  req.end();
}

export default getRewards