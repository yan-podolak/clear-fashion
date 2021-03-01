/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');   //'https://www.dedicatedbrand.com/en/men/news' -> 'https://www.dedicatedbrand.com/en/loadfilter' all products in here
const mudjeansbrand = require('./sources/MudJeansbrand');     //'https://mudjeans.eu/collections/men'
const adresseparisbrand = require('./sources/AdresseParisbrand');   //'https://adresse.paris/630-toute-la-collection' --> une page avec tous les produits
const fs = require('fs');
const allproducts = [];

async function sandbox (eshop,file) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await file.scrape(eshop);

    //console.log(products);
    products.forEach(product => {
      allproducts.push(product)
    });
    
    console.log('done');
    allproducts.forEach(element => {
      console.log(element)
    });

    let data = JSON.stringify(allproducts);
    fs.writeFileSync('products.json', data);
    //process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

//const [,, eshop] = process.argv;
let eshop = 'https://adresse.paris/630-toute-la-collection';
sandbox(eshop,adresseparisbrand);
eshop = 'https://www.dedicatedbrand.com/en/men/news';
sandbox(eshop,dedicatedbrand);
