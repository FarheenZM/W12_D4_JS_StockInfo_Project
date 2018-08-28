const makeRequest = function(url, callback){

  const request = new XMLHttpRequest();
  request.open("GET", url);
  request.addEventListener('load', callback);
  request.send();
};


const requestComplete = function(){

  const jsonString = this.responseText;
  const stocks = JSON.parse(jsonString);

  // console.log(stocks);
  // console.log(Object.keys(stocks));
  // var stock_names = Object.keys(stocks); //returns an array of keys for the hash object passed as argument
  // for (index in stock_names) {
  //   console.log(stock_names[index]);
  //   console.log(stocks[stock_names[index]]);
  //   console.log(stocks[stock_names[index]]["quote"]);
  //   console.log(stocks[stock_names[index]]["quote"]["companyName"]);
  //   console.log(stocks[stock_names[index]]["news"][0]["source"]);
  // }

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
  const divHomeHead = document.getElementById('divHomeHead');
  divHomeHead.innerText = "Top Stocks Live Price";

  const divHome = document.getElementById('divHome');
  var stock_names = Object.keys(stocks); //returns an array of keys for the hash object passed as argument
  for (index in stock_names) {
    const pHome = document.createElement('p')
    pHome.innerText = stock_names[index] + " : $" + stocks[stock_names[index]]["quote"]["latestPrice"];

    if(stocks[stock_names[index]]["quote"]["change"] < 0){
      pHome.style.color = "red";
    }else{
      pHome.style.color = "limegreen";
    }
    divHome.appendChild(pHome);
  }

  populateList(stocks);
  renderStock(stocks);

};


const populateList = function(stocks){

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

    // Remove div elements that we want only on Home
    // Go to parent of div & find div as a child and remove it
    const divHome = document.getElementById('divHome');
    divHome.parentNode.removeChild(divHome);

    const divHomeHead = document.getElementById('divHomeHead');
    divHomeHead.parentNode.removeChild(divHomeHead);

  });

};


const stockDetails = function(stock){

  const divInfoLeft = document.getElementById('info-left');
  divInfoLeft.innerHTML = "";

  const p1 = document.createElement('h2');
  p1.innerText = stock["quote"]["companyName"] + " ( " + stock["quote"]["symbol"] + " : " + stock["quote"]["primaryExchange"] + " )";

  const p2 = document.createElement('p');
  p2.innerText = stock["quote"]["latestSource"] + " : " + stock["quote"]["latestTime"];

  const p3 = document.createElement('h3');
  p3.innerText = "$" + stock["quote"]["latestPrice"];

  const p4 = document.createElement('h3');
  p4.innerText = stock["quote"]["change"] + " " + " (" + (stock["quote"]["changePercent"]*100) + "%)";
  if(stock["quote"]["change"] < 0){
    p4.style.color = "red";
  }else{
    p4.style.color = "limegreen";
  }

  divInfoLeft.appendChild(p1);
  divInfoLeft.appendChild(p2);
  divInfoLeft.appendChild(p3);
  divInfoLeft.appendChild(p4);


  const divInfoRight = document.getElementById('info-right');
  divInfoRight.innerHTML = "";

  const logo = document.createElement('img');
  logo.src = stock["logo"]["url"];

  const p5 = document.createElement('h3');
  p5.innerText = "Sector : " + stock["quote"]["sector"];

  const p6 = document.createElement('h3');
  p6.innerText = "Volume : " + stock["quote"]["latestVolume"];

  divInfoRight.appendChild(logo);
  divInfoRight.appendChild(p5);
  divInfoRight.appendChild(p6);
};

const displayLineChart = function(data){
  google.charts.setOnLoadCallback(function(){
    const graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'X');
    graphData.addColumn('number', 'Price');

    console.log(data["chart"]);

    for(var index in data["chart"]){

      graphData.addRow([data["chart"][index]["label"], data["chart"][index]["close"]]);

    }

    const options = {
      chart: {
        title: 'Stock Price',
        subtitle: 'for 1 month'
      },
      hAxis: {
        title: 'Date'
      },
      vAxis: {
        title: 'Price'
      },
      legend: {
        position: 'none' //to remove the color key for chart (legend)
      }
      // series: {
      //     1: {curveType: 'function'}
      //   }
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
      // chart: {
      //   title: 'Stock Price'
      //   // subtitle: 'for 1 month'
      // },
      hAxis: {
        title: 'Date'
      },
      vAxis: {
        title: 'Price'
      },
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

  const div = document.getElementById('statsHead');
  div.innerHTML = "";
  const statsHeading = document.createElement('h3');
  statsHeading.innerText = "KEY STATS";
  div.appendChild(statsHeading);

  const divStats = document.getElementById('stats');

  const div1 = document.getElementById('item1');
  div1.innerText = "Open : " + stock["quote"]["open"];

  const div2 = document.getElementById('item2');
  div2.innerText = "Previous Close : " + stock["quote"]["previousClose"];

  const div3 = document.getElementById('item3');
  div3.innerText = "52Week High : " + stock["quote"]["week52High"];

  const div4 = document.getElementById('item4');
  div4.innerText = "High : " + stock["quote"]["high"];

  const div5 = document.getElementById('item5');
  div5.innerText = "Market Cap : " + stock["quote"]["marketCap"];

  const div6 = document.getElementById('item6');
  div6.innerText = "52Week Low : " + stock["quote"]["week52Low"];

  const div7 = document.getElementById('item7');
  div7.innerText = "Low : " + stock["quote"]["low"];

  const div8 = document.getElementById('item8');
  div8.innerText = "P/E Ratio : " + stock["quote"]["peRatio"];

  const div9 = document.getElementById('item9');
  div9.innerText = "YTD Change : " + (stock["quote"]["ytdChange"]*100) + "%";

  divStats.appendChild(div1);
  divStats.appendChild(div2);
  divStats.appendChild(div3);
  divStats.appendChild(div4);
  divStats.appendChild(div5);
  divStats.appendChild(div6);
  divStats.appendChild(div7);
  divStats.appendChild(div8);
  divStats.appendChild(div9);
};



const newsDetails = function(stock){

  const divNews = document.getElementById('news');
  divNews.innerHTML = "";

  const newsHeading = document.createElement('h3');
  newsHeading.innerText = "LATEST NEWS";

  divNews.appendChild(newsHeading);

  for(var index in stock["news"]){
    const newsLink = document.createElement('a');
    newsLink.href = stock["news"][index]["url"];
    newsLink.innerText = stock["news"][index]["headline"] + " - " + stock["news"][index]["source"] + "\n\n";
    divNews.appendChild(newsLink);
  };

};


const app = function(){

  const url = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=aapl,amzn,axp,ba,baba,'+
  'bac,bp,bt,c,dis,ea,ebay,f,fb,fdx,fit,intc,jblu,jcp,jpm,ko,ma,ms,msft,nflx,nke,nok,pg,t,trip,tsla,'+
  'uaa,v,vod,wdc,wmt&types=quote,news,chart,logo&range=1m&last=5';
  makeRequest(url, requestComplete);

  google.charts.load('current', {'packages':['line']});
  google.charts.load('current', {'packages':['corechart']});

};


window.addEventListener('load', app);
