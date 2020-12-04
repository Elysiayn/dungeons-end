var currentScores = [];




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
    console.log(currentScores)
} 

var compare = function(a,b) {
    var scoreA = parseInt(a.xp);
    var scoreB = parseInt(b.xp);

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