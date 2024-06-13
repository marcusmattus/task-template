require('dotenv').config();
const { namespaceWrapper } = require('../_koiiNode/koiiNode');
//const { Web3Storage, File } = require('web3.storage');
// const storageClient = new Web3Storage({
//   token: process.env.SECRET_WEB3_STORAGE_KEY,
// });
const nodeEthAddress = process.env.RECIPIENT_ADDRESS;
const {makeFileFromObjectWithName, storeFiles} = require("../helpers");
class Submission {
  /**
   * Executes your task, optionally storing the result.
   *
   * @param {number} round - The current round number
   * @returns {void}
   */
  async task(round) {
    try {
      const value = 'Hello, World!';
      // Create a submission object with the value and nodeEthAddress
      const submission = {
        value,
        nodeEthAddress,
      };
  
      // Convert the submission object into a Blob for structured data
      const blob = new Blob([JSON.stringify(submission)], {
        type: 'application/json',
      });
  
      // Create a File containing the Blob with a specified filename
      // const files = [new File([blob], 'submission.json')];
      const files = [makeFileFromObjectWithName({blob: 'submission.json' })]
      // Upload to IPFS
      //const cid = await storageClient.put(files);
      const cid = storeFiles(files)
      console.log('stored files with cid:', cid);
  
      // Check if the CID was obtained
      if (cid) {
        // Store the CID under the 'value' key using namespaceWrapper
        await namespaceWrapper.storeSet('value', cid);
      }
  
      return cid;
    } catch (err) {
      console.log('ERROR IN EXECUTING TASK', err);
      return 'ERROR IN EXECUTING TASK' + err;
    }
  }
    
  /**
   * Submits a task for a given round
   *
   * @param {number} round - The current round number
   * @returns {Promise<any>} The submission value that you will use in audit. Ex. cid of the IPFS file
   */
  async submitTask(round) {
    console.log('SUBMIT TASK CALLED ROUND NUMBER', round);
    try {
      console.log('SUBMIT TASK SLOT',await namespaceWrapper.getSlot());
      const submission = await this.fetchSubmission(round);
      console.log('SUBMISSION', submission);
      await namespaceWrapper.checkSubmissionAndUpdateRound(
        submission,
        round,
      );
      console.log('SUBMISSION CHECKED AND ROUND UPDATED');
      return submission;
    } catch (error) {
      console.log('ERROR IN SUBMISSION', error);
    }
  }
  /**
   * Fetches the submission value 
   *
   * @param {number} round - The current round number
   * @returns {Promise<string>} The submission value that you will use in audit. It can be the real value, cid, etc. 
   *                            
   */
  async fetchSubmission(round) {
    console.log('FETCH SUBMISSION');
    // Fetch the value from NeDB
    const value = await namespaceWrapper.storeGet('value'); // retrieves the value
    // Return cid/value, etc.
    return value;
  }
}
const submission = new Submission();
module.exports = { submission };
