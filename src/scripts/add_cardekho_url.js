const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'data', 'cars.json');
const raw = fs.readFileSync(file, 'utf8');
const data = JSON.parse(raw);
const slug = (value) =>
  String(value)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
let changed = false;
for (const item of data) {
  const url = `https://www.cardekho.com/${slug(item.brand)}/${slug(item.model)}`;
  if (item.cardekhoUrl !== url) {
    item.cardekhoUrl = url;
    changed = true;
  }
}
if (changed) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('Updated cardekhoUrl for', data.length, 'cars');
} else {
  console.log('No changes needed.');
}
