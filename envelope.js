const fs = require('fs');

const getProcessedEnvelopes = () => {
    const data = fs.readFileSync('./done.txt', 'utf-8')
    return data.split(",").map(d => d.trim())
}

const getProcessedEnvelopesByDir = () => {
    const data = fs.readdirSync(process.env.DOWNLOAD_DIR)
    return data.map(d => d.split(".")[1])
}

const envelopeProcessManager = {
    processedEnvelops: getProcessedEnvelopesByDir(),
    isEnevelopeProcessed: (envelopeId) => envelopeProcessManager.processedEnvelops.includes(envelopeId),
    addEnvelope: (envelopeId) => {
        envelopeProcessManager.processedEnvelops.push(envelopeId);
    }
}

const getEnvelopes = () => {
    const docs = fs.readFileSync(process.env.ENVELOPE_FILE, 'utf-8')
    const data = JSON.parse(docs);

    return data.envelopes;
}

module.exports = { envelopeProcessManager, getEnvelopes }