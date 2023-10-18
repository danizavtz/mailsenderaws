const router = require('express').Router();
const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })

router.get('/', (req, res) => {
    req.servermsg = { msg: "server up and running" };
    res.status(200).json(req.servermsg);
});

router.post('/', (req, res) => {
    var params = {
        Destination: { /* obrigatório */
          ToAddresses: [
            'daniellucena@yahoo.com.br',
            /* ou adicione mais destinatários */
          ]
        },
        Message: { /* obrigatório */
          Body: { /* este é o corpo da mensagem que aparecerá no e-mail */
            Text: {
             Charset: "UTF-8",
             Data: `Mensagem de: ${req.body.email}, \n ${req.body.message}`
            }
           },
           Subject: {
            Charset: 'UTF-8',
            Data: req.body.title
           }
          },
        Source: 'contato@danizavtz.com.br',
        ReplyToAddresses: [
           'daniellucena@yahoo.com.br'
        ],
      };
    sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
    sendPromise.then(
          function (data) {
              res.status(200).json({ msg: data.MessageId })
          }).catch(
          function(err) {
              console.log(err); //esta linha não é necessária, é utilizada apenas para debug
              res.status(500).json({ errors: ['Houve um erro durante o envio'] })
    });
})

module.exports = router;