// Create reference to Firebase DB
const database = firebase.database();

let playerId;
let playerIndex = 0;
let playerRankings = [];

$(document).on('keypress', function(event) {
    if (event.key === "z") {
        playerId = database.ref().push({
            playerIndex: playerIndex,
            points: Math.floor(Math.random() * 20)
        });
        playerIndex++;
    } else if (event.key === "x") {
        database.ref(playerId).set({
            points: Math.floor(Math.random() * 20)
        });
    } else if (event.key === "y") {
        for (let player in playerRankings) {
            console.log("Player ID:", playerRankings[player].playerIndex, "Points:", playerRankings[player].points);
        }        
    }
});

database.ref().orderByChild('points').on('value', function(snapshot) {
    console.log(snapshot.val());
    let playerArrayAscending = [];

    snapshot.forEach(function(data) {
        console.log(data.val());
        playerArrayAscending.push(data.val());
    });

    let playerArrayDescending = playerArrayAscending.reverse();
    playerRankings = playerArrayDescending; 
});