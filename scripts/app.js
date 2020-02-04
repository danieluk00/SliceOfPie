const urlParams = new URLSearchParams(window.location.search);
const eventCode = urlParams.get('event');
let user = null;
let noOfPeople = 0;
let people = [];
let totalSpent = {};
let totalReceived = {};
let totalOwed = {};
let groupTotal = 0;
let eventName = null;
let currencySymbol = '£';
let euroToDollar=1.1;
let euroToPound=0.85;

//Load state of play total
const loadPeople = () => {

    if (eventCode) {
        setCookie('lastevent',eventCode,365)
    }

    //Get people
    people = [];

    db.collection('events').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            if (doc.id == eventCode) {
               people = doc.data().people;
               eventName = doc.data().eventName;
               noOfPeople = people.length;
               currencySymbol = doc.data().currency;
               updateCurrency();
            }
        })

        if (eventName == null) {
            showError("We can't find that event");
        }

        document.getElementById('stateofplayuserselect').innerHTML = "";
        document.getElementById('paiduserselect').innerHTML = "";
        document.getElementById('transferfrom').innerHTML = "";
        document.getElementById('transferto').innerHTML = "";

        totalSpent = {}
        totalReceived = {}
        people.forEach(person => {
            totalSpent[person] = 0;
            totalReceived[person] = 0;
            totalOwed[person] = 0;
            document.getElementById('stateofplayuserselect').innerHTML += `<a class="dropdown-item" href="#" onclick="switchUser('${person}')">${person}</a>`
            document.getElementById('paiduserselect').innerHTML += `<a class="dropdown-item" href="#" onclick="switchUser('${person}')">${person}</a>`
            document.getElementById('transferfrom').innerHTML += `<a class="dropdown-item" href="#" onclick="switchUser('${person}'); newTransferInput()">${person}</a>`
            document.getElementById('transferto').innerHTML += `<a class="dropdown-item" href="#" onclick="switchUserTo('${person}'); newTransferInput()">${person}</a>`
        })

        loadExpenses();
    })
}

const loadExpenses = () => {
    groupTotal = 0;

    db.collection('expenses')
    .where('eventcode','==',eventCode)
    .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            const changeData = change.doc.data();

            //Group total
            if (changeData.type==='expense') {
                groupTotal += parseFloat(changeData.value);
            }

            //Total received
            changeData.splitbetween.forEach(person => {
                totalReceived[person] += (parseFloat(changeData.value / changeData.splitbetween.length));
            })

            //Total paid
            totalSpent[changeData.paidby] += parseFloat(changeData.value);

        })
        people.forEach(person => totalOwed[person] += totalReceived[person] - totalSpent[person]);
        getPerson();
        showStateOfPlay();
    })
}

const showStateOfPlay = () => {
    document.getElementById('summarytitle').innerText = eventName;
    document.getElementById('total').innerText = currencySymbol + formatNumber(totalReceived[user]);
    document.getElementById('usertotal').innerText = currencySymbol + formatNumber(totalSpent[user]);
    document.getElementById('grouptotal').innerText = currencySymbol + formatNumber(groupTotal);

    if (totalOwed[user]<1 && totalOwed[user]>-1) {
        document.getElementById('userowedcopy').innerText = "You owe:";
        document.getElementById('userowed').innerText = currencySymbol + "0"
        document.getElementById('userowedcopy').classList.remove('green');
        document.getElementById('userowed').classList.remove('green');
        document.getElementById('userowedcopy').classList.remove('red');
        document.getElementById('userowed').classList.remove('red');
    } else if (totalOwed[user]>=0) {
        document.getElementById('userowedcopy').innerText = "You owe:";
        document.getElementById('userowed').innerText = currencySymbol + formatNumber(totalOwed[user]);
        document.getElementById('userowedcopy').classList.add('red');
        document.getElementById('userowed').classList.add('red');
        document.getElementById('userowedcopy').classList.remove('green');
        document.getElementById('userowed').classList.remove('green');
    } else {
        document.getElementById('userowedcopy').innerText = "You are owed:";
        document.getElementById('userowed').innerText = currencySymbol + formatNumber(-1 * totalOwed[user]);
        document.getElementById('userowedcopy').classList.add('green');
        document.getElementById('userowed').classList.add('green');
        document.getElementById('userowedcopy').classList.remove('red');
        document.getElementById('userowed').classList.remove('red');
    }

    isNaN(groupTotal) ? document.querySelector('.statediv0').classList.add('d-none') : document.querySelector('.statediv0').classList.remove('d-none');
    isNaN(totalReceived[user]) ? document.querySelector('.statediv1').classList.add('d-none') : document.querySelector('.statediv1').classList.remove('d-none');
    isNaN(totalSpent[user]) ? document.querySelector('.statediv2').classList.add('d-none') : document.querySelector('.statediv2').classList.remove('d-none');
    isNaN(totalOwed[user]) ? document.querySelector('.statediv3').classList.add('d-none') : document.querySelector('.statediv3').classList.remove('d-none');

    animateCSS(document.querySelector('.statediv0'),'rubberBand');
    animateCSS(document.querySelector('.statediv1'),'rubberBand');
    animateCSS(document.querySelector('.statediv2'),'rubberBand');
    animateCSS(document.querySelector('.statediv3'),'rubberBand');
}

const formatNumber = number => Number.isInteger(parseFloat(number)) ? number : parseFloat(number).toFixed(2);

//Add an expense
document.getElementById('addexpenseform').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('expense-title').value;
    const value = removeSymbols(document.getElementById('expense-value').value);
    const date = document.getElementById('expense-date').value;
    console.log(value)
    const timestamp = Date.now();

    let splitters = []
    if (document.getElementById('r1').checked) {
        splitters = people
    } else {
        people.forEach(person => {
            if (document.getElementById(person+'-checkbox').checked) {
                splitters.push(person);
            }
        })
    }
    if (splitters.length==0) {
        splitters.push(user)
    }

    const exchangedValue = exchangeValue(value);
    const originalValue = document.getElementById('transfercurrency').innerText+value; 
    
    const object = {title,value: exchangedValue, eventcode: eventCode, paidby: user, splitbetween: splitters, date, type: 'expense', updated: timestamp, originalvalue: originalValue};
    db.collection("expenses").add(object).then((expenseSubmitted(title + ' added')))
})

//Transfer money
document.getElementById('transferform').addEventListener('submit', e => {
    e.preventDefault();
    const value = removeSymbols(document.getElementById('transfer-value').value);
    const date = document.getElementById('transfer-date').value;
    const paidto = document.getElementById('dropDownTransferTo').innerText;
    const title = `${user} paid ${paidto}`;
   
    const exchangedValue = exchangeValue(value);
    document.getElementById('transfercurrency').innerText+value;
    const originalValue = document.getElementById('transfercurrency').innerText+value; 
    const timestamp = Date.now();
    
    const object = {title,value: exchangedValue, eventcode: eventCode, paidby: user, splitbetween: [paidto], date, type: 'transfer', updated: timestamp, originalvalue: originalValue};
    db.collection("expenses").add(object).then((expenseSubmitted(title)))
})


const expenseSubmitted = title => {
    document.getElementById('addexpensemain').classList.add('d-none');
    document.getElementById('transfermoneymain').classList.add('d-none');
    document.getElementById('addcomplete').classList.remove('d-none');
    document.getElementById('addcompletetext').innerText = title;
    animateCSS(document.getElementById('addcompletetext'),'flip')
    animateCSS(document.getElementById('banking'),'flip')
}

document.getElementById('expense-title').addEventListener('keyup', e => newExpenseInput())
document.getElementById('expense-value').addEventListener('keyup', e => newExpenseInput())

const newExpenseInput = () => {
    if (document.getElementById('expense-title').value !="" && document.getElementById('expense-value').value!="" && isNumber(document.getElementById('expense-value').value) && document.getElementById('dropDownPaid').innerText!='Select user') {
        document.getElementById('submitexpense').disabled = false;
    } else {
        document.getElementById('submitexpense').disabled = true;
    }

    let splitters = []
    if (document.getElementById('r1').checked) {
        splitters = people
    } else {
        people.forEach(person => {
            if (document.getElementById(person+'-checkbox').checked) {
                splitters.push(person);
            }
        })
    }
    if (splitters.length==0) {
        document.getElementById('submitexpense').disabled = true;
    }
}

document.getElementById('transfer-value').addEventListener('keyup', e => newTransferInput())
document.getElementById('transferfrom').addEventListener('onclick', e => newTransferInput())
document.getElementById('transferto').addEventListener('onclick', e => newTransferInput())

const newTransferInput = () => {
    if (document.getElementById('transfer-value').value!="" && isNumber(document.getElementById('transfer-value').value) && document.getElementById('dropDownTransferFrom').innerText!='Select user' && document.getElementById('dropDownTransferTo').innerText!='Select user' && document.getElementById('dropDownTransferFrom').innerText!=document.getElementById('dropDownTransferTo').innerText) {
        document.getElementById('submittransfer').disabled = false;
    } else {
        document.getElementById('submittransfer').disabled = true;
    }
}

const isNumber = text => !isNaN(removeSymbols(text));

const removeSymbols = text => {
    if (text) {
        return text.replace('£','').replace('$','').replace('€','');
    }
}

//Show history
const showHistory = () => {
    let lastDateShown = null;
    let count = 0;
    const expenseList = document.getElementById('expense-list');

        expenseList.innerHTML = `<ul>`

        db.collection('expenses')
        .where('eventcode','==',eventCode)
        .orderBy("date", "desc").orderBy("updated", "desc")
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type=="added") {
                    if (lastDateShown==null || change.doc.data().date!=lastDateShown) {
                        lastDateShown = change.doc.data().date;
                        const displayDate = formatDate(lastDateShown);
                        expenseList.innerHTML += `<p class="listdate">${displayDate}</p>`
                    }
                    let usedBy = 'For everyone';
                    if (change.doc.data().splitbetween.length == 1) {
                        usedBy = 'For ' + change.doc.data().splitbetween[0]
                    } else if (change.doc.data().splitbetween.length == 0) {
                        usedBy = 'For no-one' 
                    } else if (change.doc.data().splitbetween.length != people.length) {
                        usedBy = 'For ';
                        change.doc.data().splitbetween.forEach(person => {
                            usedBy += person + ", "
                        })
                        usedBy = usedBy.substring(0,usedBy.length-2);
                    }
                    let line2copy="";
                    if (removeSymbols(change.doc.data().originalvalue)!=change.doc.data().value && change.doc.data().originalvalue!=null) {
                        line2copy += `Converted from ${change.doc.data().originalvalue}.`
                    }
                    if (change.doc.data().type=='expense') {
                        if (line2copy!='') {
                            line2copy+=' ';
                        }
                        line2copy += `Paid by ${change.doc.data().paidby}. ${usedBy}.`
                    }
                    count++;
                    expenseList.innerHTML += `<li class="list-group-item list-expense-item" id="expense${count}">
                                                <div class="justify-content-between align-items-center d-flex">
                                                    <span class="flex-fill font-weight-light">${change.doc.data().title} - ${currencySymbol}${formatNumber(change.doc.data().value)}</span>
                                                    <i class="far fa-trash-alt delete" title="Delete" onclick="deleteExpense('${change.doc.id}','${change.doc.data().title}','${count}')"></i>
                                                </div>
                                                <div class="list-subtext">${line2copy}<div>
                                            </li>`
                }
        })
        expenseList.innerHTML += `<ul>`

        if (expenseList.innerHTML.includes('li')) {
            document.getElementById('noexpenses').classList.add('d-none');
        } else {
            document.getElementById('noexpenses').classList.remove('d-none');
        }
        animateCSS(expenseList,'fadeIn');
    })
}

/* <i class="fas fa-info-circle info" onclick="showInfo('${change.doc.data().title}','${change.doc.data().paidby}','${usedBy}','${change.doc.data().date}','${change.doc.data().value}')"</i> */

//Delete expense
const deleteExpense = (id, title, count) => {
    if (window.confirm("Are you sure you want to delete the expense '"+title+"'?")) {
        deleteDoc('expenses',id);
        document.getElementById('expense'+count).classList.add('strikeout')
        document.getElementById('expense'+count).querySelector('.delete').classList.add('d-none');
        animateCSS(document.getElementById('expense'+count),'rubberBand');
    }
}

const deleteDoc = (collectionName, id) => db.collection(collectionName).doc(id).delete()

//Choose whether to split between everyone or specific people
const splitBeweenSwitch = () => {
    if (document.getElementById('r1').checked === true) {
        document.getElementById('people').classList.add('d-none');
    } else {
        document.getElementById('people').classList.remove('d-none');
        document.getElementById('people').innerHTML = '';
        animateCSS(document.getElementById('people'),'fadeIn');
        people.forEach(person => {
            document.getElementById('people').innerHTML += `<input class="people-checkbox" type="checkbox" name="${person}" id="${person}-checkbox" value=${person} onchange="newExpenseInput()" checked> ${person}`;
        })
    } 
}

//Calculate how to settle up
const settleup = () => {
    loadAd();

    document.getElementById('summarydiv').classList.add('d-none');
    document.getElementById('howtosettle').classList.remove('d-none');

    let somethingOwed = true; 
    let count = 0;
    let tempOwed = {};
    let transferArray = [];

    //Copy the total owed array
    people.forEach(person => tempOwed[person] = totalOwed[person]); 

    const settleDiv = document.querySelector('.settlediv');
    settleDiv.innerHTML= '<ul>';

    //Loop until there is nothing more owed
    while (somethingOwed==true && count<25) {
        count++;

        //Order the array from most owed to most owing
        let orderedList = Object.keys(tempOwed);
        somethingOwed = false; 
        orderedList.sort(function(a, b) {
            if (tempOwed[b] != tempOwed[a]) {
                somethingOwed = true;
            }
            return tempOwed[b] - tempOwed[a]
        });

        let transfer = 0;
        if (tempOwed[orderedList[0]] > -1*tempOwed[orderedList[orderedList.length-1]]) {
            transfer = tempOwed[orderedList[orderedList.length-1]]*-1;
        } else {
            transfer = tempOwed[orderedList[0]];
        }

        if (transfer>=1) {
            tempOwed[orderedList[0]] -= transfer;
            tempOwed[orderedList[orderedList.length-1]] += transfer;
            const str = orderedList[0] + ' pays ' + orderedList[orderedList.length-1] + ' ' + currencySymbol + formatNumber(transfer);
            settleDiv.innerHTML += `<li class="list-group-item pay-item d-flex justify-content-between align-items-center" id='transfer${count}'>
            <span class="flex-fill font-weight-light">${str}</span>
            <i class="fas fa-check" title="Mark as settled" onclick="transferMoney('${orderedList[0]}','${orderedList[orderedList.length-1]}','${transfer}','${count}')"></i>
            </li>`
        }
    }
    settleDiv.innerHTML+= '<ul>';

    animateCSS(settleDiv,'flipInX');
    if (settleDiv.innerHTML == '<ul></ul><ul></ul>') {
        document.getElementById('settletitle').innerText = "Nothing to settle!"
    } else {
        document.getElementById('settletitle').innerText = "How to settle"; 
        settleDiv.innerHTML += `<p>Click a tick to mark the debt as settled</p>`
    } 
    
}

const transferMoney = (from, to, value,count) => {
    const title = from + ' paid ' + to;
    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const dateStr = yyyy + '-' + mm + '-' + dd;
    const timestamp = Date.now();

    const object = {title ,value, eventcode: eventCode, paidby: from, splitbetween: [to], date: dateStr, type: 'transfer', updated: timestamp};
    db.collection("expenses").add(object).then(
        document.getElementById('transfer'+count).classList.add('strikeout'),
        animateCSS(document.getElementById('transfer'+count),'rubberBand'),
        document.getElementById('transfer'+count).querySelector('i').classList.add('d-none')
    )
}

const backToSummary = () => {
    loadAd();
    document.getElementById('summarydiv').classList.remove('d-none');
    document.getElementById('howtosettle').classList.add('d-none');
    loadPeople();
}

const switchUser = person => {
    setCookie(eventCode+'name',person,365);
    document.getElementById('dropDownSummary').innerText=person;
    document.getElementById('dropDownPaid').innerText=person;
    document.getElementById('dropDownTransferFrom').innerText=person;
    user = person;
    newExpenseInput();
    showStateOfPlay();
}

const switchUserTo = person => document.getElementById('dropDownTransferTo').innerText=person;

const getPerson = () => {
    if (checkCookie(eventCode+'name')) {
        const person = getCookie(eventCode+'name');
        switchUser(person);
    }
}

function animateCSS(element, animationName, hide, callback) {
    element.classList.add('animated', animationName);

    if (hide=='show' && element.classList.contains('d-none')) {
        element.classList.remove('d-none');
    }

    function handleAnimationEnd() {
        element.classList.remove('animated', animationName)
        element.removeEventListener('animationend', handleAnimationEnd)

        hide=='hide' ? element.classList.add('d-none') : "";

        if (typeof callback === 'function') callback()
    }

    element.addEventListener('animationend', handleAnimationEnd)
}

const updateCurrency = () => {
    // document.getElementById('valueinlabel').innerText = 'Value in ' + currencySymbol
    // document.getElementById('transfervalueinlabel').innerText = 'Value in ' + currencySymbol
    //document.getElementById('expense-value').placeholder = currencySymbol
    //document.getElementById('transfer-value').placeholder = currencySymbol
};

const showInfo = (title, paidBy, usedBy, date, value) => {
    console.log('ba')

    document.getElementById('infooverlay').classList.remove('d-none');
    document.getElementById('infotitle').innerText = title;
    document.getElementById('infodate').innerText = formatDate(date);
    document.getElementById('infovalue').innerText = currencySymbol + value;
    document.getElementById('infopaidby').innerText = 'Paid by '+ paidBy + '. ' + usedBy;
}

const formatDate = date => new Date(date).toLocaleDateString("en-GB", { weekday: 'short', day: 'numeric', month: 'short' });