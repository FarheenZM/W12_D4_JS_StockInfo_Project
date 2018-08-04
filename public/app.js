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
  // const divContainer = document.getElementById('container');
  // container.innerHTML = "";
  const divHeader = document.getElementById('header');

  let select = document.getElementById('select-id');

  var stock_names = Object.keys(stocks);
  for (index in stock_names) {
    let option = document.createElement('option');

    option.innerText = stocks[stock_names[index]]["quote"]["symbol"] + " : " +
    stocks[stock_names[index]]["quote"]["companyName"];

    option.value = stock_names[index];
    select.appendChild(option);
  };

  divHeader.appendChild(select);
  // divContainer.appendChild(divHeader);
};



const renderStock = function (stocks) {

  const selected = document.querySelector('select');

  selected.addEventListener('change', function(event) {

    let stock = stocks[this.value];
    stockDetails(stock);
    displayLineChart(stock);
    displayCandlestickChart(stock);
    newsDetails(stock);
    keyStats(stock);
  });

};


const stockDetails = function(stock){
  // const container = document.getElementById('container');

  const divInfoLeft = document.getElementById('info-left');
  divInfoLeft.innerHTML = "";

  const p1 = document.createElement('p');
  p1.innerText = stock["quote"]["companyName"] + "( " + stock["quote"]["symbol"] + " : " + stock["quote"]["primaryExchange"] + " )";

  const p2 = document.createElement('p');
  p2.innerText = stock["quote"]["latestSource"] + " : " + stock["quote"]["latestTime"];

  const p3 = document.createElement('p');
  p3.innerText = stock["quote"]["latestPrice"] + " " + stock["quote"]["change"] + " " + " (" + stock["quote"]["changePercent"] + ")";

  divInfoLeft.appendChild(p1);
  divInfoLeft.appendChild(p2);
  divInfoLeft.appendChild(p3);


  const divInfoRight = document.getElementById('info-right');
  divInfoRight.innerHTML = "";

  const logo = document.createElement('img');
  logo.src = stock["logo"]["url"];

  const p4 = document.createElement('p');
  p4.innerText = "Sector : " + stock["quote"]["sector"];

  const p5 = document.createElement('p');
  p5.innerText = "Volume : " + stock["quote"]["latestVolume"];

  divInfoRight.appendChild(logo);
  divInfoRight.appendChild(p4);
  divInfoRight.appendChild(p5);

  // container.appendChild(divInfoLeft);
  // container.appendChild(divInfoRight);
};

const displayLineChart = function(data){
  google.charts.setOnLoadCallback(function(){
    const graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'X');
    graphData.addColumn('number', 'Y');

    console.log(data["chart"]);

    for(var index in data["chart"]){

      graphData.addRow([data["chart"][index]["label"], data["chart"][index]["close"]]);

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
      // width: 900,
      // height: 500
    };

    const chart = new google.charts.Line(document.getElementById('linechart'));

    chart.draw(graphData, google.charts.Line.convertOptions(options));
  });
};



const displayCandlestickChart = function(data){
  google.charts.setOnLoadCallback(function(){
    var dataArray = [];

    for(var index in data["chart"]){
      var entry = [data["chart"][index]["label"], data["chart"][index]["low"], data["chart"][index]["open"], data["chart"][index]["close"], data["chart"][index]["high"]];
      dataArray.push(entry);
    };

    var chartData = google.visualization.arrayToDataTable(dataArray, true);

    var options = {
      legend:'none',
      series:{
        0: {color: 'grey'}
      },
      candlestick: {
         fallingColor: { stroke: 'black', strokeWidth: 0, fill: 'red' },
         risingColor: { stroke: 'black', strokeWidth: 0, fill: 'green' }
       }
    };

    var chart = new google.visualization.CandlestickChart(document.getElementById('candlestickChart'));

    chart.draw(chartData, options);
  });
};



const keyStats = function(stock){
  // const container = document.getElementById('container');
  const div = document.getElementById('statsHead');
  div.innerHTML = "";
  const statsHeading = document.createElement('h1');
  statsHeading.innerText = "KEY STATS";
  div.appendChild(statsHeading);

  const divStats = document.getElementById('stats');

  const div1 = document.getElementById('item1');
  div1.innerText = "Open " + stock["quote"]["open"];

  const div2 = document.getElementById('item2');
  div2.innerText = "High " + stock["quote"]["high"];

  const div3 = document.getElementById('item3');
  div3.innerText = "Low " + stock["quote"]["low"];

  const div4 = document.getElementById('item4');
  div4.innerText = "previousClose " + stock["quote"]["previousClose"];

  const div5 = document.getElementById('item5');
  div5.innerText = "marketCap " + stock["quote"]["marketCap"];

  const div6 = document.getElementById('item6');
  div6.innerText = "peRatio " + stock["quote"]["peRatio"];

  const div7 = document.getElementById('item7');
  div7.innerText = "week52High " + stock["quote"]["week52High"];

  const div8 = document.getElementById('item8');
  div8.innerText = "week52Low " + stock["quote"]["week52Low"];

  const div9 = document.getElementById('item9');
  div9.innerText = "ytdChange " + stock["quote"]["ytdChange"];

  divStats.appendChild(div1);
  divStats.appendChild(div2);
  divStats.appendChild(div3);
  divStats.appendChild(div4);
  divStats.appendChild(div5);
  divStats.appendChild(div6);
  divStats.appendChild(div7);
  divStats.appendChild(div8);
  divStats.appendChild(div9);
  // container.appendChild(divStats);
};



const newsDetails = function(stock){
  // const container = document.getElementById('container');

  const divNews = document.getElementById('news');
  divNews.innerHTML = "";

  const newsHeading = document.createElement('h1');
  newsHeading.innerText = "LATEST NEWS";

  divNews.appendChild(newsHeading);

  for(var index in stock["news"]){
    const newsLink = document.createElement('a');
    newsLink.href = stock["news"][index]["url"];
    newsLink.innerText = stock["news"][index]["headline"] + " - " + stock["news"][index]["source"] + "\n \n";
    divNews.appendChild(newsLink);
  }

  // container.appendChild(divNews);

};


const app = function(){

  const url = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=aapl,amzn,baba,bac,bp,bt,c,dis,ea,ebay,f,fb,fit,intc,jblu,jcp,jpm,ko,ms,msft,nflx,nok,pg,t,trip,tsla,uaa,v,vod,wdc&types=quote,news,chart,logo&range=1m&last=5';
  makeRequest(url, requestComplete);

  google.charts.load('current', {'packages':['line']});
  google.charts.load('current', {'packages':['corechart']});

};


window.addEventListener('load', app);
