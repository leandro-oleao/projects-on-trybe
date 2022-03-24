const fs = require('fs').promises;

function getTalkers() {
 return fs.readFile('./talker.json', 'utf8')
  .then((content) => JSON.parse(content));
}

function setTalkers(newTalkers) {
  return fs.writeFile('./talker.json', JSON.stringify(newTalkers));
}

module.exports = { getTalkers, setTalkers };