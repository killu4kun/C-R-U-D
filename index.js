const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { getTalker, setTalker } = require('./fs-json');
const { isValidPassword, isValidEmail } = require('./middlewares/validations');
const {
  validateToken,
  isValidName,
  isValidAge,
  isValidTalk,
  isValidRateAndWatchedAt,
} = require('./middlewares/userValidations');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const showTalker = await getTalker();
  res.status(200).json(showTalker);
});

app.get('/talker/:id', async (req, res) => {
  const showTalker = await getTalker();

  const findTalker = showTalker.find(({ id }) => id === req.params.id);

  if (!findTalker) {
 return res
      .status(404)
      .json({ message: 'Pessoa palestrante não encontrada' }); 
}

  return res.status(202).json(findTalker);
});

app.post('/login', isValidEmail, isValidPassword, async (req, res) =>
  res.status(200).json({ token: '7mqaVRXJSp886CGr' }));

app.post(
  '/talker',
  validateToken,
  isValidName,
  isValidAge,
  isValidTalk,
  isValidRateAndWatchedAt,
  async (req, res) => {
    const content = JSON.parse(await fs.readfile('./talker.json', 'utf-8'));
    const { name, age, talk } = req.body;
    const lastId = content[content.length - 1].id;

    content.push({ id: lastId + 1, name, age, talk });
    const newTalker = await content[content.length - 1];
    setTalker(newTalker);
    // const getTalkers = JSON.stringify(content);
    // fs.writeFile('./talker.json', getTalkers);

    return res.status(201).json(newTalker);
  },
);
app.listen(PORT, () => {
  console.log('Online');
});
