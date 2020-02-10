const loadExchange = () => {

    var request = new XMLHttpRequest()
    request.open('GET', 'https://api.exchangeratesapi.io/latest?symbols=USD,GBP', true)
    request.onload = function() {
      // Begin accessing JSON data here
      var data = JSON.parse(this.response)
      if (request.status >= 200 && request.status < 400) {
          euroToDollar = data.rates.USD
          euroToPound = data.rates.GBP
      }
    }
    request.send()
}

const switchCurrency = symbol => {
    document.getElementById('expensecurrency').innerText=symbol;
    document.getElementById('transfercurrency').innerText=symbol;
}

const exchangeValue = value => {
    const selectedCurrency = document.getElementById('expensecurrency').innerText;
    value = parseFloat(value);

    if (currencySymbol==selectedCurrency) {
        return value;
    } else if (currencySymbol=='£') {
        if (selectedCurrency=='$') {
            value = value / euroToDollar * euroToPound;
        } else if (selectedCurrency=='€') {
            value = value * euroToPound;
        }
    } else if (currencySymbol=='$') {
        if (selectedCurrency=='£') {
            value = value / euroToPound * euroToDollar;
        } else if (selectedCurrency=='€') {
            value = value * euroToDollar;
        }
    } else if (currencySymbol=='€') {
        if (selectedCurrency=='£') {
            value = value / euroToPound;
        } else if (selectedCurrency=='$') {
            value = value / euroToDollar;
        }
    }

    return parseFloat(value).toFixed(2);
}