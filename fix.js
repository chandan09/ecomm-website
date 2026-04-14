const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');
code = code.replaceAll('AURA', 'La Benediction');
code = code.replaceAll('aurafashion.dummy', 'labenediction.dummy');
code = code.replaceAll('premium aura.', 'premium feel.');
code = code.replaceAll('A A C H H O', 'L B');
fs.writeFileSync('app.js', code);
