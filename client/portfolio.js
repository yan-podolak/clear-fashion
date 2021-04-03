// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

brandlist = ["ADRESSE","DedicatedBrand"];
let total_pages = 1;

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentBrandFilter = "";
let reasonableprice = false;
//let recentlyreleased = false;
let currentfilter = "price-asc";

// inititiate selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectBrand = document.querySelector('#brand-select');
const filterprice = document.querySelector('#filter-price');
//const filterreleased = document.querySelector('#filter-released');
const filter = document.querySelector('#sort-select');
//const spanNbNewProducts = document.querySelector('#nbNewProducts');
const spanP50 = document.querySelector('#p50');
const spanP90 = document.querySelector('#p90');
const spanP95 = document.querySelector('#p95');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = (result) => {
  currentProducts = result.body;
  currentPagination = result.currentPagination;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-ten.vercel.app/search?page=${page}&limit=${size}`
    );
    const body = await response.json();

    const response2 = await fetch(
      `https://clear-fashion-ten.vercel.app/search?limit=2000`
    );
    const body2 = await response2.json();
    total_pages = Math.round(body2.length/size);
    currentPagination = {currentPage: page, pageCount: total_pages, pageSize:size, count:body2.length};

    /*
    if (body.success !== true) {
      console.error(body);
      console.log(currentProducts, currentPagination)
      return {currentProducts, currentPagination};
    }*/

    return {body, currentPagination};
  } catch (error) {
    console.error(error);
    return {body, currentPagination};
  }
};


/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');

  if(selectBrand.selectedIndex!=0 && currentBrandFilter!=""){
    products = products.filter(brand => brand.brand==brandlist[selectBrand.selectedIndex-1])
  }

  if(reasonableprice){
    products = products.filter(product => product.price <= 50);
  }
/*
  if(recentlyreleased){
    let today = Date.now();
    products = products.filter(product => (Math.ceil(Math.abs(today - new Date(product.released))/(1000*60*60*24))<=15));
  }*/

  if(currentfilter == "price-asc"){
    products = products.sort(function (product1, product2) {
      return product1.price - product2.price;
    });
  }
  
  if(currentfilter == "price-desc"){
    products = products.sort(function (product1, product2) {
      return product2.price - product1.price;
    });
  }

  if(currentfilter == "date-asc"){
    products = products.sort((a, b) => new Date(b.released) > new Date(a.released) ? 1: -1)
  }

  if(currentfilter == "date-desc"){
    products = products.sort((a, b) => new Date(b.released) < new Date(a.released) ? 1: -1)
  }

  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span class="item">${product.brand}</span>
        <a class="item" href="${product.link}" target="_blank">${product.name}</a>
        <span class="item">${product.price}€</span>
        <span class = "item"><img src='${product.photo}'></span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': total_pages},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = (pagination,products) => {

  spanNbProducts.innerHTML = currentPagination.count;
  /*
  let today = Date.now();
  let newcount = 0;
  products.forEach(product => {
    if(Math.ceil(Math.abs(today - new Date(product.released))/(1000*60*60*24))<=15){
      newcount +=1;
    }
  });
  spanNbNewProducts.innerHTML = newcount;*/

  var l = products.length;
  var p50 = l*0.5;
  p50 = Math.round(p50);
  spanP50.innerHTML = products[p50].price;

  var p90 = l*0.9;
  p90 = Math.round(p90);
  spanP90.innerHTML = products[p90].price;

  var p95 = l*0.95;
  p95 = Math.round(p95);
  spanP95.innerHTML = products[p95].price;
  /*
  var last = new Date('2000-01-01');
  products.forEach(product => {
    if(new Date(product.released) - last > 0){
      last = new Date(product.released);
    }
  });*/
  //spanLastReleasedDate.innerHTML = last.getFullYear()+"-"+last.getMonth()+1+"-"+last.getDate();

};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination,products);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value),selectShow.value)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

selectBrand.addEventListener('change', function() {
  currentBrandFilter = this.value;
  render(currentProducts, currentPagination)
}, false);

filterprice.addEventListener('change', function () {
  reasonableprice = this.checked;
  render(currentProducts, currentPagination)
}, false);
/*
filterreleased.addEventListener('change', function () {
  recentlyreleased = this.checked;
  render(currentProducts, currentPagination)
}, false);*/

filter.addEventListener('change', function () {
  currentfilter = this.value;
  console.log(currentfilter);
  render(currentProducts, currentPagination)
}, false);

const renderBrands = brands => {
  var options = `<option value="Tout">Tout</option>`
  brandlist.forEach(product => {
  options +=`<option value="${product}">${product}</option>`
  })
  selectBrand.innerHTML = options;
  selectBrand.selectedIndex = currentBrandFilter;
};

document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then((p)=>setCurrentProducts(p))
    .then(() => render(currentProducts, currentPagination)).then(renderBrands)
);
