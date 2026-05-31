const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'data', 'cars.json');
const raw = fs.readFileSync(file, 'utf8');
const data = JSON.parse(raw);
let changed = false;
for (const item of data) {
  if (!item.coverImage) {
    item.coverImage = `/images/cars/${item.id}.jpg`;
    changed = true;
  }
}
if (changed) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('Updated cars.json with coverImage fields.');
} else {
  console.log('No changes needed.');
}
