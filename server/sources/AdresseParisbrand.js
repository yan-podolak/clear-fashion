const axios = require('axios');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product_list.grid.row .product-container')
    .map((i, element) => {
      const name = $(element)
        .find('.product-name-container.versionmob')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.prixright')
          .text()
      );
      const brand = $(element)
        .find('.manuleft')
        .text()
        .replace(/\s/g,'');
      let _id  = uuidv4();
      const link = $(element)
      .find('.product_img_link')
      .attr('href')
      const photo = $(element)
      .find('.replace-2x.img-responsive.lazy.img_0.img_1e')
      .attr('data-original')
      return {_id,name, price, brand,link,photo};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};
