require('dotenv').config();
const Envelopes = require("./models/envelopes");
const Signers = require("./models/signers");
const sequelize = require("./db");
const { getEnvelopes } = require("./envelope");

(async () => {
    await sequelize.sync();
    const envs = getEnvelopes();

    for(let i = 0; i < envs.length;i++) {
        const envelopeId = envs[i].envelopeId;
        const name = envs[i].emailSubject;
        const sender = envs[i].sender.email;
        const createdDate = envs[i].createdDateTime;
        const lastModifiedDateTime = envs[i].lastModifiedDateTime;
        const completedDateTime = envs[i].completedDateTime;
        const statusChangedDateTime = envs[i].statusChangedDateTime;

        const eSigners = envs[i].recipients.signers;

        await Envelopes.create({
            envelopeId,
            name,
            sender,
            createdDate,
            lastModifiedDateTime,
            completedDateTime,
            statusChangedDateTime
        });

        for(let j = 0; j < eSigners.length;j++) {
            const signerName = eSigners[j].name;
            const signerEmail = eSigners[j].email;
            const roleName = eSigners[j].roleName;
            const deliveryMethod = eSigners[j].deliveryMethod;
            const signedDateTime = eSigners[j].signedDateTime;
            const deliveredDateTime = eSigners[j].deliveredDateTime;

            await Signers.create({
                envelopeId,
                signerName,
                signerEmail,
                roleName,
                deliveryMethod,
                signedDateTime,
                deliveredDateTime
            })
        }
    }
})();