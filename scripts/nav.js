
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
        document.getElementById('expense-date').valueAsDate = new Date();
        document.getElementById('expense-title').focus();
        animateCSS(document.getElementById('addexpense'),'fadeIn');

    } else if (clicked==='historymenu') {
        document.getElementById('history').classList.remove('d-none');
        animateCSS(document.getElementById('history'),'fadeIn');
        showHistory();
    }
}