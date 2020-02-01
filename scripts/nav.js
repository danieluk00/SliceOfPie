
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
        animateCSS(document.getElementById('addexpense'),'fadeIn');

    } else if (clicked==='historymenu') {
        document.getElementById('history').classList.remove('d-none');
        animateCSS(document.getElementById('history'),'fadeIn');
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
    document.getElementById('transfermoneymain').classList.add('d-none');
    document.getElementById('addexpensemain').classList.add('d-none');
    document.getElementById(elementToShow).classList.remove('d-none');
    animateCSS(document.getElementById('addexpense'),'fadeIn');

    if (elementToShow=='transfermoneymain') {
        document.getElementById('transfer-date').valueAsDate = new Date();
        document.getElementById('transfer-value').value="";
        document.getElementById('dropDownTransferTo').innerText="Select user";
        document.getElementById('submittransfer').disabled = true;
    }
}