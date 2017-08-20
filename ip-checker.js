var rp = require('request-promise');

class IPChecker {
  constructor() {
    this.cache = {}
  }
  
  getInfoFromIp(ip) {
    let cachedResult = this.cache[ip];
    if (cachedResult) {
      console.log('Find ip from cache: ' + ip);
      return Promise.resolve(cachedResult);
    } 
    
    return rp('http://ip-api.com/json/' + ip).then(result => {
      this.cache[ip] = result;
      return result;
    });
  }
  
}

module.export = new IPChecker();