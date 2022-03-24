const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const crypto = require('crypto');
const { validateEmail, validatePassword } = require('./middlewares/validateLogin');
const {
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate } = require('./middlewares/validateTalker');

const token = crypto.randomBytes(8).toString('hex');

const { getTalkers, setTalkers } = require('./talkerManager');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const talkers = await getTalkers();
  res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await getTalkers();
  const talker = talkers.find((t) => t.id === parseInt(id, 0));

  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return res.status(200).json(talker);
});

app.post('/login', validateEmail, validatePassword, (_req, res) => {
  res.status(200).json({ token });
});

app.post(
  '/talker',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
    const { name, age, talk } = req.body;
    const talkers = await getTalkers();
    const newTalker = {
      id: talkers.length + 1,
      name,
      age,
      talk,
    };

    talkers.push(newTalker);
    await setTalkers(talkers);
    res.status(201).json(newTalker);
  },
);

app.listen(PORT, () => {
  console.log('Online');
});
