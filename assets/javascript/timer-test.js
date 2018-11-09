// Store reference to database
const database = firebase.database();

let timer = new Timer();
let sharedTimerId;

function createSharedTimer(duration) {
    let endTime = Date.now() + duration;
    let timerShared = database.ref('/game/timers').push({ endTime: endTime });
    let timerId = timerShared.key;
    return timerId;
}

$(document).on('keypress', function(event) {
    if (event.key === 'z') {
        sharedTimerId = createSharedTimer(60000);
        console.log(testTimer);
    } else if (event.key === 'x') {
        database.ref(`/game/timers/${sharedTimerId}`).remove();
    }
});

database.ref('/game/timers/').on('child_added', function(snapshot) {
    let data = snapshot.val();
    timer.endTime = data.endTime;
    timer.start();
    console.log(data);
});