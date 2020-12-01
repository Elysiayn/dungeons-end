// Modal Activation Trigger
$(document).ready(function(){
    $('.modal').modal();
});
// Modal End

var inputEl = document.getElementById("player-name");

var gameState = {
    user: {
        name: "",
        hp: 50, // determined by player selected
        ap: 0, // determined by roll 
        armor: 0, // determined by player selected
        xp: 0,
        level: 1
    },
    enemy: {
        name: "",
        hp: 0,
        ap: 0,
        armor: 0,
        xp: 0,
        challenge_rating: 0
    },

}

// var beginAdventure = function(event) {
//     window.location.href = "./encounter.html"
// };

// document.getElementById("start-button").addEventListener("click", beginAdventure);







          

