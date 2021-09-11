import http from "http"

const getReward = (groupData: string) => {
  const postData = JSON.stringify({
    'msg': groupData
  });

  const options = {
    hostname: process.env.REWARD_CALCULATOR_URI,
    port: process.env.REWARD_CALCULATOR_PORT,
    method: "POST",
    data: groupData,
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

export default getReward