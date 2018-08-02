const makeRequest = function(url, callback){

  const request = new XMLHttpRequest();
  request.open("GET", url);
  request.addEventListener('load', callback);
  request.send();
};


const requestComplete = function(){

  const jsonString = this.responseText;
  const stocks = JSON.parse(jsonString);

  console.log(stocks);
  console.log(Object.keys(stocks));
  var stock_names = Object.keys(stocks); //returns an array of keys for the hash object passed as argument
  for (index in stock_names) {
    console.log(stock_names[index]);
    console.log(stocks[stock_names[index]]);
    console.log(stocks[stock_names[index]]["quote"]);
    console.log(stocks[stock_names[index]]["quote"]["companyName"]);
    console.log(stocks[stock_names[index]]["news"][0]["source"]);
  }

  // console.log(stocks);
  // console.log(stocks["AAPL"]);
  // console.log(stocks["AAPL"]["quote"]);
  // console.log(stocks["AAPL"]["quote"]["symbol"] + " : " +
  //   stocks["AAPL"]["quote"]["companyName"]);
  //
  // console.log(stocks);
  // console.log(stocks["AAPL"]);
  // console.log(stocks["AAPL"]["news"]);
  // console.log(stocks["AAPL"]["news"][0]);
  // console.log(stocks["AAPL"]["news"][0]["source"]);
  //
  populateList(stocks);
  renderStock(stocks);
};



const populateList = function(stocks){
  let select = document.getElementById('select-id');

  var stock_names = Object.keys(stocks);
  for (index in stock_names) {
    let option = document.createElement('option');

    option.innerText = stocks[stock_names[index]]["quote"]["symbol"] + " : " +
    stocks[stock_names[index]]["quote"]["companyName"];

    option.value = stock_names[index];
    select.appendChild(option);
  };
};



const renderStock = function (stocks) {

  const selected = document.querySelector('select');

  selected.addEventListener('change', function(event) {

    let stock = stocks[this.value];

    console.log(stock);

    stockDetails(stock);
  });

}

const stockDetails = function(stock){
  const div = document.getElementById('div-id');

  const p = document.createElement('p');
  p.innerText = "Primary Exchange : " + stock["quote"]["primaryExchange"];

  div.appendChild(p);
}



const app = function(){

  const url = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=aapl,msft&types=quote,news,chart&range=1m&last=5';
  makeRequest(url, requestComplete);
};


window.addEventListener('load', app);
