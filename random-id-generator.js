const data = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
const idLength = 20;

function getRandomElement(input) {
  let randomIndex = Math.floor((Math.random() * input.length));
  return input[randomIndex];
}

function getRandomId() {
  let id = '';
  for(var i = 0; i < idLength; i++) {
    id += getRandomElement(data);
  }
  
  return id;
}

module.exports = {
  getRandomId
};