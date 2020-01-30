//Share URL
document.getElementById('copyurl').addEventListener('submit', e => {
    console.log('ab')
    e.preventDefault();

    const el = document.createElement('textarea');
    el.value = document.getElementById('eventcode').innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    document.getElementById('eventcode').classList.add('animated','rubberBand')
    setTimeout(function(){
        document.getElementById('eventcode').classList.remove('animated','rubberBand')
    }, 1000);

  });

const goToSummary = () => {
    if (eventCode) {
        window.location.href = "app.html?event=" + eventCode;
    }
}