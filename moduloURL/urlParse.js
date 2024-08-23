const url = require('url');
const address = 'https://example.com:9000/search?query=HelloWorld&page=1&page_limit=10';
const parsed = url.parse(address, true);

console.log("URL parseada: ", parsed)