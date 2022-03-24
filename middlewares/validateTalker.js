// VALIDAÇÃO DO TOKEN 

function validateToken(req, res, next) {
  const tokenValidation = req.headers.authorization;

  if (!tokenValidation) return res.status(401).json({ message: 'Token não encontrado' });

  if (tokenValidation.length !== 16) return res.status(401).json({ message: 'Token inválido' });

  next();
}

// VALIDAÇÃO DO CAMPO NAME

function validateName(req, res, next) {
  const { name } = req.body;

  if (!name || name === '') { 
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }

  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
}

// VALIDAÇÃO DO CAMPO AGE

function validateAge(req, res, next) {
  const { age } = req.body;

  if (!age || age === '') {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }

  if (age <= 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }

  next();
}

//  VALIDAÇÃO DO CAMPO TALK

function validateWatchedAt(req, res, next) {
  const { talk } = req.body;
    // Validação de data através de regex : https://www.the-art-of-web.com/javascript/validate-date/
    const validDataFormat = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

    if (!validDataFormat.test(talk.watchedAt)) {
      return res.status(400)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
    }

    next();
}

function validateRate(req, res, next) {
  const { talk } = req.body;

  if (talk.rate < 1 || talk.rate > 5) {
    return res.status(400)
      .json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  next();
}

function validateTalk(req, res, next) {
  const { talk } = req.body;

  if (!talk || talk.watchedAt === undefined || talk.rate === undefined) {
    return res.status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
  }
  
  next();
}

module.exports = { 
  validateToken, 
  validateName, 
  validateAge, 
  validateTalk, 
  validateWatchedAt, 
  validateRate };