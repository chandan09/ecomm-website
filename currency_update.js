const fs = require('fs');

let code = fs.readFileSync('app.js', 'utf8');
code = code.replace(/\$\$\{/g, '₹${');
code = code.replace(/'\$0\.00'/g, "'₹0.00'");
fs.writeFileSync('app.js', code);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/\$0\.00/g, '₹0.00');
html = html.replace(/app\.js\?v=\d+/g, `app.js?v=${Date.now()}`);
fs.writeFileSync('index.html', html);

console.log('Successfully updated currencies!');
