const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const talkersFromFile = require('./gettalker');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const talkers = await talkersFromFile.getTalkers();
  res.status(200).json(talkers);
});

app.listen(PORT, () => {
  console.log('Online');
});
