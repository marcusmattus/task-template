const axios = require('axios');

const getJSONFromCID = async (cid, fileName, maxRetries = 3, retryDelay = 3000) => {
  let url = `https://${cid}.ipfs.dweb.link/${fileName}`;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        return response.data;
      } else {
        console.log(`Attempt ${attempt}: Received status ${response.status}`);
      }
    } catch (error) {
      console.log(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`Waiting for ${retryDelay / 1000} seconds before retrying...`);
        await sleep(retryDelay);
      } else {
        return false;
      }
    }
  }
}