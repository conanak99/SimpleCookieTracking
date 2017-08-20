var rp = require('request-promise');

class IPChecker {
  constructor() {
    this.cache = {};
  }
  
  getInfoFromIp(ip) {
    let cachedResult = this.cache[ip];
    if (cachedResult) {
      console.log('Find ip from cache: ' + ip);
      return Promise.resolve(cachedResult);
    } 
    
    return rp({ uri: 'http://ip-api.com/json/' + ip, json: true }).then(result => {
      console.log('Find ip from api: ' + ip);
      this.cache[ip] = result;
      return result;
    });
  }
  
}

module.exports = new IPChecker();