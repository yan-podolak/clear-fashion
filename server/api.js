const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./db');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get("/products/:id", (request, response) => {
  db.find({ "_id": (request.params.id) }).then(res=>response.send(res));
});

app.get("/search/:limit?/:brand?/:price?", (request, response) => {
  let limit = request.query.limit;
  let brand = request.query.brand;
  let price = request.query.price;
  console.log(request.query)
  console.log(limit,brand,price)
  if (!limit){limit = 12}else{limit = parseInt(limit)}
  if (!brand){brand = "all"}
  if (!price){price = 100000}else{price = parseInt(price)}
  console.log(limit,brand,price)
  if(brand !=="all"){
    db.findSorted({ "price": {$lt:price}, brand:brand},{"price":1},limit).then(res=>response.send(res));
  }else{
    db.findSorted({ "price": {$lt:price}},{"price":1},limit).then(res=>response.send(res));
  }
  
});

app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);
