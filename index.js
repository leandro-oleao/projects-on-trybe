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

app.get('/talker/search', validateToken, async (req, res) => {
  const { search } = req.query;
  const talkers = await getTalkers();
  const searchTalker = talkers.filter((t) => t.name.includes(search));
  
  if (!search) return res.status(200).json(talkers);
  if (search.length === 0) return res.status(200).json([]);

  res.status(200).json(searchTalker);
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

app.put('/talker/:id',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
  const { name, age, talk } = req.body;
  const { id } = req.params;
  const talker = { name, age, id: Number(id), talk };
  const talkers = await getTalkers();
  const talkerIndex = talkers.findIndex((t) => t.id === Number(id));
  talkers[talkerIndex] = { ...talkers[talkerIndex], name, age, talk };
  await setTalkers(talkers);
  res.status(200).json(talker);
});

app.delete('/talker/:id',
  validateToken,
  async (req, res) => {
  const { id } = req.params;
  let talkers = await getTalkers();
  talkers = talkers.filter((t) => t.id !== Number(id));
  await setTalkers(talkers);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});
