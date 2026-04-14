const fs = require('fs');

const data = fs.readFileSync('products_template.csv', 'utf8');

// The CSV is quite custom with multiple rows acting as specification values.
// We will manually extract products since there are only 6.
let products = [];
let currentProduct = null;
let currentSpec = [];

const lines = data.split(/\r?\n/);

let inQuotes = false;
let currentField = '';
let fields = [];
let rows = [];

// Simple CSV parser
for (let i = 0; i < data.length; i++) {
  let char = data[i];
  if (char === '"') {
    inQuotes = !inQuotes;
  } else if (char === ',' && !inQuotes) {
    fields.push(currentField);
    currentField = '';
  } else if ((char === '\n' || char === '\r') && !inQuotes) {
    if (char === '\r' && data[i + 1] === '\n') {
      i++;
    }
    fields.push(currentField);
    rows.push(fields);
    fields = [];
    currentField = '';
  } else {
    currentField += char;
  }
}
if (currentField.length > 0 || fields.length > 0) {
    fields.push(currentField);
    rows.push(fields);
}

// Remove header
rows.shift();

for (let row of rows) {
    if (!row || row.length < 2) continue;
    
    // Check if it's a new product or a spec line
    // If the first col has an ID, it's a new product
    let id = row[0].trim();
    if (id !== '') {
        // Save previous product
        if (currentProduct) {
            currentProduct.specification = currentSpec.join('\n');
            products.push(currentProduct);
        }
        
        currentProduct = {
            id: parseInt(id),
            name: row[1],
            price: parseFloat(row[2]),
            category: row[3],
            subCategory: row[4],
            image: row[5] ? row[5].replace(/C:\\Users\\cksin\\website-img\\/g, 'assets/images/').replace(/\\/g, '/') : '',
            images: [
                row[5] ? row[5].replace(/C:\\Users\\cksin\\website-img\\/g, 'assets/images/').replace(/\\/g, '/') : null,
                row[6] ? row[6].replace(/C:\\Users\\cksin\\website-img\\/g, 'assets/images/').replace(/\\/g, '/') : null,
                row[7] ? row[7].replace(/C:\\Users\\cksin\\website-img\\/g, 'assets/images/').replace(/\\/g, '/') : null
            ].filter(img => img), // remove nulls or empty
            description: row[8] ? row[8].trim() : '',
            quantity: parseInt(row[9] || 10),
            keyFeatures: row[10] ? row[10].trim() : '',
            rating: 4.8,
            isNew: true
        };
        currentSpec = [];
    } else {
        // This is a spec line
        // Finding where the spec text is
        // Based on the format, it's in columns 11 and 12 usually
        let attr = row[11] || '';
        let detail = row[12] || '';
        if (attr && attr !== 'Attribute' && detail && detail !== 'Detail') {
            currentSpec.push(`${attr} ${detail}`);
        } else if (attr && detail) {
            // maybe it's just plain text
        }
    }
}

if (currentProduct) {
    currentProduct.specification = currentSpec.join('\n');
    products.push(currentProduct);
}

const jsCode = `const products = ${JSON.stringify(products, null, 2)};\n\nexport default products;`;
fs.writeFileSync('data.js', jsCode);
console.log('Successfully written data.js');
