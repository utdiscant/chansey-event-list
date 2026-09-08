const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const page = fs.readFileSync('app/page.tsx', 'utf8');
const publicCode = page.slice(page.indexOf('function compareCards('), page.indexOf('function headingFor('));
const context = {};
vm.createContext(context);
vm.runInContext(ts.transpile(publicCode), context);
const make = (id, low, high) => ({id, n:id, year:2000, set_name:'Set', number:String(id), language:'English', price_estimate:low === undefined ? undefined : {low_dkk:low, high_dkk:high}});
const cards = [make(1, null, null), make(2, 40, 60), make(3, 0, 10), make(4), make(5, 10, 30)];
for (const [sort, expected] of [['price-asc',[3,5,2,1,4]], ['price-desc',[2,5,3,1,4]]]) {
  assert.deepEqual(cards.slice().sort((a,b)=>context.compareCards(a,b,sort)).map(c=>c.id), expected);
}
const privatePage=fs.readFileSync('../chansey-ledger/scripts/template.html','utf8');
vm.runInContext(privatePage.slice(privatePage.indexOf('function compareFairPrice('),privatePage.indexOf('function rowHTML(')),context);
const privateCards=cards.map(c=>({...c,priceEstimate:c.price_estimate}));
for(const [descending,expected] of [[false,[3,5,2,1,4]],[true,[2,5,3,1,4]]]) {
  assert.deepEqual(privateCards.slice().sort((a,b)=>context.compareFairPrice(a,b,descending)).map(c=>c.id),expected);
}
assert.equal(context.priceMidpoint({low_dkk:0,high_dkk:0}),0);
assert.equal(context.priceMidpoint({low_dkk:1,high_dkk:null}),null);
console.log('Both tracker comparators passed: midpoint order, both directions, zero, missing and null prices.');
