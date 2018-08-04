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
    stockDetails(stock);
    displayLineChart(stock);
    displayCandlestickChart(stock);
  });

};


const stockDetails = function(stock){
  const div = document.getElementById('div-id');
  div.innerHTML = "";

  const p1 = document.createElement('p');
  p1.innerText = "Primary Exchange : " + stock["quote"]["primaryExchange"];

  const p2 = document.createElement('p');
  p2.innerText = "Sector : " + stock["quote"]["sector"];

  const p3 = document.createElement('p');
  p3.innerText = "Latest Price : " + stock["quote"]["latestPrice"];

  const p4 = document.createElement('p');
  p4.innerText = "Market Capital : " + stock["quote"]["marketCap"];

  const p5 = document.createElement('p');
  p5.innerText = stock["news"][0]["datetime"] + "\n" +
  stock["news"][0]["headline"] + " - " + stock["news"][0]["source"];

  const newsLink = document.createElement('a');
  newsLink.href = stock["news"][0]["url"];
  newsLink.innerText = stock["news"][0]["url"] + "\n";

  const image = document.createElement('img');
  image.src = stock["logo"]["url"];

  div.appendChild(p1);
  div.appendChild(p2);
  div.appendChild(p3);
  div.appendChild(p4);
  div.appendChild(p5);
  div.appendChild(newsLink);
  div.appendChild(image);
};



const displayLineChart = function(data){
  google.charts.setOnLoadCallback(function(){
    const graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'X');
    graphData.addColumn('number', 'Price');

    console.log(data["chart"]);

    for(var index in data["chart"]){

      graphData.addRow([data["chart"][index]["date"], data["chart"][index]["close"]]);

    }

    const options = {
      chart: {
        title: 'Pulse Chart',
        subtitle: 'for 1 month'
      },
      hAxis: {
       title: 'Date'
     },
     vAxis: {
       title: 'Price'
     },
     // series: {
     //     1: {curveType: 'function'}
     //   },
      width: 900,
      height: 500
    };

    const chart = new google.charts.Line(document.getElementById('linechart'));

    chart.draw(graphData, google.charts.Line.convertOptions(options));
  });
};



const displayCandlestickChart = function(data){
  google.charts.setOnLoadCallback(function(){
    var dataArray = [];

    for(var index in data["chart"]){
      var entry = [data["chart"][index]["date"], data["chart"][index]["low"], data["chart"][index]["open"], data["chart"][index]["close"], data["chart"][index]["high"]];
      dataArray.push(entry);
    };

    var chartData = google.visualization.arrayToDataTable(dataArray, true);

    var options = {
      legend:'none',
      series:{
        0: {color: 'grey'}
      },
      candlestick: {
         fallingColor: { stroke: 'black', strokeWidth: 0, fill: 'red' }, // red
         risingColor: { stroke: 'black', strokeWidth: 0, fill: '#0f9d58' }   // green
       }
    };

    var chart = new google.visualization.CandlestickChart(document.getElementById('candlestickChart'));

    chart.draw(chartData, options);
  });
};



const app = function(){

  const url = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=aapl,amzn,baba,bac,bp,bt,c,dis,ea,ebay,f,fb,fit,intc,jblu,jcp,jpm,ko,ms,msft,nflx,nok,pg,t,trip,tsla,uaa,v,vod,wdc&types=quote,news,chart,logo&range=1m&last=5';
  makeRequest(url, requestComplete);

  google.charts.load('current', {'packages':['line']});
  google.charts.load('current', {'packages':['corechart']});

};


window.addEventListener('load', app);
