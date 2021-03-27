/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');   //'https://www.dedicatedbrand.com/en/men/news' -> 'https://www.dedicatedbrand.com/en/loadfilter' all products in here
const mudjeansbrand = require('./sources/MudJeansbrand');     //'https://mudjeans.eu/collections/men'
const adresseparisbrand = require('./sources/AdresseParisbrand');   //'https://adresse.paris/630-toute-la-collection' --> une page avec tous les produits
const fs = require('fs');
const allproducts = [];


const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://yanpodo:yanpodo@cluster0.v6l1t.mongodb.net?retryWrites=true&writeConcern=majority';
const MONGODB_DB_NAME = 'clearfashion';





async function sandbox (eshop,file) {
  try {

    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true,useUnifiedTopology: true  });
    const db =  client.db(MONGODB_DB_NAME)

    for(let i=0;i<eshop.length;i++){
      console.log(`🕵️‍♀️  browsing ${eshop[i]} source`);

      const products = await file[i].scrape(eshop[i]);

      //console.log(products);
      products.forEach(product => {
        allproducts.push(product)
      });
    }

    const collection = db.collection('products');
    const result = collection.insertMany(allproducts);
  
    //console.log(result);

    let data = JSON.stringify(allproducts);
    fs.writeFileSync('products.json', data);
    //process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

//const [,, eshop] = process.argv;
let eshop = ['https://adresse.paris/630-toute-la-collection','https://www.dedicatedbrand.com/en/men/news']
let names = [adresseparisbrand,dedicatedbrand]
sandbox(eshop,names);