var currentScores = [];

var scoreBoardEl = document.querySelector(".score")

var loadHighScores = function () {

    var storedScores = (localStorage.getItem("scores"))

    if (!storedScores){
        currentScores = [];
        return false;
    }
    
    storedScores = JSON.parse(storedScores);
    //console.log(storedScores);

    storedScores.sort(compare);

    for (var i = 0; i < storedScores.length; i++) {
        createHighScores(storedScores[i]);
    }
    showHallOfFame(currentScores);
} 

// this will be the function to push the scores onto the page
var showHallOfFame = function (currentScores) {
    for (var i = 0; i< currentScores.length; i++) {
        var rankEl = document.createElement("p");
        rankEl.textContent = currentScores[i].name + " " + currentScores[i].score;
        scoreBoardEl.appendChild(rankEl);
    }
} 

// compares items in the storedScores array and arranges them by high score
var compare = function(a,b) {
    var scoreA = parseInt(a.score);
    var scoreB = parseInt(b.score);

    return scoreB - scoreA;
}

var createHighScores = function(playerRanks) {

    currentScores.push(playerRanks);

    saveHighScores();
} 

var saveHighScores = function () {
    localStorage.setItem("scores", JSON.stringify(currentScores));
}

loadHighScores();



$(document).ready(function() {
    $('.sidenav').sidenav() 
});