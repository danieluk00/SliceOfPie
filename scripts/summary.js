const urlParams = new URLSearchParams(window.location.search);
const eventCode = urlParams.get('event');
let user = getCookie(eventCode+'name');

//Load state of play total
const loadStateOfPlay = () => {
    let totalSpent = 0;
    let runningTotal = {};
    db.collection('expenses')
        .where('eventcode','==',eventCode)
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                const changeData = change.doc.data();
                totalSpent += parseInt(changeData.value);
                (runningTotal[changeData.person]) ? runningTotal[changeData.person]+=parseInt(changeData.value) : runningTotal[changeData.person]=parseInt(changeData.value);
        })
        console.log(totalSpent)
        document.getElementById('total').innerText = "Group spend: £" + totalSpent;
        document.getElementById('usertotal').innerText = "You've paid: £" + runningTotal[user];

        const userOwed = runningTotal[user] - (totalSpent / 4);
        if (userOwed>=0) {
            document.getElementById('userowed').innerText = "You're owed: £" + userOwed;
        } else {
            document.getElementById('userowed').innerText = "You owe: £" + -1*userOwed;
        }

    })
}