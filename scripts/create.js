let eventCode = null
let eventName = null;
let person1 = null;
let people = []

const createContainer = document.querySelector('.createcontainer');
const namesContainer = document.querySelector('.namescontainer');
const codeContainer = document.querySelector('.codecontainer');

//Create form
document.getElementById('createform').addEventListener('submit', e => {
    e.preventDefault();
    eventName = document.getElementById('event-name').value;
    people.push(document.getElementById('person1').value);
    createContainer.classList.add('d-none');
    namesContainer.classList.remove('d-none');
    person1 = document.getElementById('person1').value;
})

const generateCode = () => (Math.floor(Math.random() * (9999999 + 1000000))).toString();

//Users can enter names
document.getElementById('namesform').addEventListener('submit', e => {
    e.preventDefault();

    addToPeople(document.getElementById('person2').value);
    addToPeople(document.getElementById('person3').value);
    addToPeople(document.getElementById('person4').value);
    addToPeople(document.getElementById('person5').value);
    addToPeople(document.getElementById('person6').value);

    let currencySymbol = null;
    if (document.getElementById('r1').checked) {
        currencySymbol = '£';
    } else if (document.getElementById('r2').checked) {
        currencySymbol = '$';
    } else {
        currencySymbol = '€';
    }

    const object = {eventName, people, currency: currencySymbol}

    //Generate code and check it hasn't been used before
    let repeatCode = true;
    while (repeatCode == true) {
        repeatCode = false;
        eventCode = generateCode();
        db.collection('events').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                if (doc.id == eventCode) {
                    repeatCode = true;
                }
            })
        })
    }

    //Save host user to cookie
    setCookie(eventCode+'name',person1,365);

    //Save to Firebase
    db.collection("events").doc(eventCode).set(object).then(() => {
        //Show event code
        namesContainer.classList.add('d-none');
        codeContainer.classList.remove('d-none');
        const url = window.location.href.replace("/create.html", "").replace("#", "");
        document.getElementById('eventcode').innerText = url + '?event=' + eventCode;
    })
})

const addToPeople = person => {
    if (person) {

        let i=1;
        while (people.includes(person)) {
            person = person.replace(/[0-9]/g, '');
            person += i;
            i++;
        }

     people.push(person) 
    }
}

document.getElementById('event-name').addEventListener('keyup', e => enableSubmit1());
document.getElementById('person1').addEventListener('keyup', e => enableSubmit1());

const enableSubmit1 = () => {
    if (document.getElementById('event-name').value!="" && document.getElementById('person1').value!="") {
        document.getElementById('createbtn1').disabled = false;
    } else {
        document.getElementById('createbtn1').disabled = true;
    }
}

document.getElementById('person2').addEventListener('keyup', e => {
    if (document.getElementById('person2').value!="") {
        document.getElementById('createbtn2').disabled=false;
        document.getElementById('person3').disabled=false;
    } else {
        document.getElementById('createbtn2').disabled=true;
    }
});

document.getElementById('person3').addEventListener('keyup', e => {
    if (document.getElementById('person3').value!="") {
        document.getElementById('person4').disabled=false;
    }
});

document.getElementById('person4').addEventListener('keyup', e => {
    if (document.getElementById('person4').value!="") {
        document.getElementById('person5').disabled=false;
    }
});

document.getElementById('person5').addEventListener('keyup', e => {
    if (document.getElementById('person5').value!="") {
        document.getElementById('person6').disabled=false;
    }
});