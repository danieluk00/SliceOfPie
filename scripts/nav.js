
//Menu clicked
const clickMenu = clicked => {
    //Make menu items inactive
    document.getElementById('statemenu').classList.remove('active');
    document.getElementById('addmenu').classList.remove('active');
    document.getElementById('historymenu').classList.remove('active');
    //Set active menu item
    document.getElementById(clicked).classList.add('active');
    //Make on page elements hidden
    document.getElementById('stateofplay').classList.add('d-none');
    document.getElementById('addexpense').classList.add('d-none');
    document.getElementById('history').classList.add('d-none');

    loadAd();

    //Show clicked on page element
    if (clicked==='statemenu') {
        document.getElementById('stateofplay').classList.remove('d-none');
        animateCSS(document.getElementById('stateofplay'),'fadeIn');
        backToSummary();

    } else if (clicked==='addmenu') {
        document.getElementById('addexpense').classList.remove('d-none');
        document.getElementById('addexpensemain').classList.remove('d-none');
        document.getElementById('addcomplete').classList.add('d-none');
        document.getElementById('transfermoneymain').classList.add('d-none');
        document.getElementById('expense-date').valueAsDate = new Date();
        document.getElementById('expense-title').focus();
        document.getElementById('expense-title').value="";
        document.getElementById('expense-value').value="";
        document.getElementById('r1').checked = true;
        document.getElementById('submittransfer').disabled = true;
        document.getElementById('people').classList.add('d-none');
        document.getElementById('transfercurrency').innerText = currencySymbol;
        document.getElementById('expensecurrency').innerText = currencySymbol;
        animateCSS(document.getElementById('addexpense'),'fadeIn');

    } else if (clicked==='historymenu') {
        document.getElementById('history').classList.remove('d-none');
        animateCSS(document.getElementById('history'),'fadeIn');
        animateCSS(document.getElementById('barchart'), 'fadeIn');
        showHistory();
    }
}

const settings = () => {
    if (eventCode) {
        const url = window.location.href.replace("/app.html", "").replace("#", "");
        document.getElementById('eventcode').innerText = url;
        document.getElementById('overlay').classList.remove('d-none');
        document.getElementById('overlaytitle').innerText = eventName;
    }
}

const closeOverlay = () => document.getElementById('overlay').classList.add('d-none');
const closeInfoOverlay = () => document.getElementById('infooverlay').classList.add('d-none');
const closeErrorOverlay = () => document.getElementById('erroroverlay').classList.add('d-none');

const showError = error => {
    document.getElementById('erroroverlay').classList.remove('d-none');
    document.getElementById('errortext').innerText = error;
}

const navigateAddExpense = elementToShow => {
    loadAd();

    document.getElementById('transfermoneymain').classList.add('d-none');
    document.getElementById('addexpensemain').classList.add('d-none');
    document.getElementById(elementToShow).classList.remove('d-none');
    animateCSS(document.getElementById('addexpense'),'fadeIn');

    if (elementToShow=='transfermoneymain') {
        document.getElementById('transfer-date').valueAsDate = new Date();
        document.getElementById('transfer-value').value="";
        document.getElementById('dropDownTransferTo').innerText="Recipient";
        document.getElementById('submittransfer').disabled = true;
    }
}

const loadAd = () => {
    const adNumber = getRandomInt(1,8);
    const adDiv = document.querySelector('.ad');

    if (adNumber==1) {
        adDiv.innerHTML = `<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=2&p=42&l=ur1&category=gift_certificates&banner=0WRPA8EXP4PMWMQK5VG2&f=ifr&linkID=5493a8f3d73f23cb4b935c506250fd69&t=danieluk00-21&tracking_id=danieluk00-21" width="234" height="60" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0"></iframe>`
    } else if (adNumber==2) {
        adDiv.innerHTML = `<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=2&p=42&l=ur1&category=fresh&banner=1RWWXBFHQ6ASNPYQ6DG2&f=ifr&linkID=68a8671bbd392640143ec2469c9ee7fc&t=danieluk00-21&tracking_id=danieluk00-21" width="234" height="60" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0"></iframe>`
    } else if (adNumber==3) {
        adDiv.innerHTML = `<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=2&p=42&l=ez&f=ifr&linkID=3b45126dbb360c8d566897627594f695&t=danieluk00-21&tracking_id=danieluk00-21" width="234" height="60" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0"></iframe>`
    } else if (adNumber==4) {
        adDiv.innerHTML = `<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=2&p=288&l=ur1&category=piv&banner=14ZQRPDZB4WWG3CQ3782&f=ifr&linkID=7baec759245a2fae16ee5713f39cca89&t=danieluk00-21&tracking_id=danieluk00-21" width="320" height="50" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0"></iframe>`
    } else if (adNumber==5) {
        adDiv.innerHTML = `<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=2&p=42&l=ur1&category=amazon_student&banner=0J4KQS4Z1HXSVRFFT382&f=ifr&linkID=9a44b092727de9d0411a6d551841cf79&t=danieluk00-21&tracking_id=danieluk00-21" width="234" height="60" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0"></iframe>`
    } else if (adNumber==6) {
        adDiv.innerHTML = `<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=2&p=288&l=ur1&category=audible&banner=0X48M2QCH8NRZBVFW4G2&f=ifr&linkID=0011494ad012b0e8b006e2d1001e8cdf&t=danieluk00-21&tracking_id=danieluk00-21" width="320" height="50" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0"></iframe>`
    } else if (adNumber==7) {
        adDiv.innerHTML = `<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=2&p=42&l=ur1&category=wedding_registry&banner=10D3YP8P7NXHEJGMZ7R2&f=ifr&linkID=426cfa1969a5bf37f49670993b2e1173&t=danieluk00-21&tracking_id=danieluk00-21" width="234" height="60" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0"></iframe>`
    } else if (adNumber==8) {
        adDiv.innerHTML = `<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=2&p=42&l=ur1&category=kindle_unlimited&banner=0B0Q1HMPRKFTDDERDS02&f=ifr&linkID=eb63932100cd4e20c9233488bc647c18&t=danieluk00-21&tracking_id=danieluk00-21" width="234" height="60" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0"></iframe>`
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}