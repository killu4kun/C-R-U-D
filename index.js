const express = require('express');
const bodyParser = require('body-parser');
const {getTalker, setTalker} = require('./fs-json');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req,res) => {
  const showTalker = await getTalker();
  res.status(200).json(showTalker);
})

app.listen(PORT, () => {
  console.log('Online');
});
