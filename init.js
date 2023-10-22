require('dotenv').config();
const getBrowser = require('./browser');
const { envelopeProcessManager, getEnvelopes } = require("./envelope");


class QueueManager {
    constructor () {
        this.envelopes = getEnvelopes()
        this.pointer = 0
    }

    init = () => {
        for(let i = 0; i < 5; i++) {
            this.enqueue();
        }
    }

    enqueue = () => {
        const date = this.envelopes[this.pointer]?.completedDateTime.substring(0, 10) || 'empty';
        let name = this.envelopes[this.pointer]?.recipients.signers[0].name || 'NA';
        const envelopeId = this.envelopes[this.pointer]?.envelopeId || "0";
        name = name.replace(/[^a-zA-Z ]/g, "")
        name = name.replace(" ", "-");

        this.pointer = ++this.pointer;
        downloadDoc(envelopeId, date, name);
    }

    dequeue = (envelopeId) => {
        this.enqueue()
        if(envelopeId) envelopeProcessManager.addEnvelope(envelopeId);
    }
}

const queueManager = new QueueManager();

const loadDocusign = async () => {
  await getBrowser();
  const page = await browser.newPage();
  try {
    // await page.goto('https://www.docusign.com', { waitUntil: 'load' });
    // const [button] = await page.$x("//a[contains(., 'Log In')]");
    // if (button) {
    //     await button.click();
    // }
    // await page.waitForSelector('[data-qa="username"]', { visible: true, timeout: 60000 })
    // await page.type('[data-qa="username"]', process.env.EMAIL);
    // page.click('[data-qa="submit-username"]')
    // await page.waitForSelector('[data-qa="password"]', { visible: true, timeout: 60000 })
    // await page.type('[data-qa="password"]', process.env.EMAIL);
    // page.click('[data-qa="submit-password"]');

    await page.goto('https://apps.docusign.com/send/documents?label=completed', { waitUntil: 'load' })
  } finally {
    
  }
}

const downloadDocs = async () => {
  await getBrowser();
  const page = await browser.newPage();
  await page.goto('https://apps.docusign.com/send/documents?label=completed', { waitUntil: 'load' })
  await delay(5000);
  
  queueManager.init();
}

const downloadDoc = async (envelopeId, date, name) => {
  if(envelopeProcessManager.isEnevelopeProcessed(envelopeId)) {
    queueManager.dequeue();
    return;
  }

  const page = await browser.newPage();
  const client = await page.target().createCDPSession()
  const fileName = `${date}_${name}.${envelopeId}.zip`
  intercept(client, fileName, page, envelopeId)

  try {
    await client.send('Page.navigate', {
      url: getDownloadUrl(envelopeId),
    })

  } catch(err) {
    console.log(err)
  } 
}

const intercept = async (client, fileName, page, envelopeId) => {
  try {
    await client.send('Fetch.enable', { patterns: [{ requestStage: "Response" }] });

    client.on('Fetch.requestPaused', async (event) => {
      const requestId = event.requestId;
      let headers = event.responseHeaders;

      headers = headers.filter(v => v.name != "content-disposition");
      headers = [...headers, { name: "content-disposition", value: `file; filename="${fileName}"; filename*=UTF-8''${fileName}` }]

      const newResponse = await client.send("Fetch.getResponseBody", { requestId });

      await client.send('Fetch.fulfillRequest', {
          requestId,
          responseCode: 200,
          responseHeaders: headers,
          body: newResponse.body
      });
      await page.close();
      queueManager.dequeue(envelopeId);
    })
  } catch(err) {
    console.log(err)
  } 
}

const getDownloadUrl = (id) => `https://apps.docusign.com/api/send/api/accounts/${process.env.ACCOUNT_ID}/envelopes/${id}/documents/archive?escape_non_ascii_filenames=true&language=en&include=document%2Csummary%2Cvoice_print`

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

 downloadDocs();