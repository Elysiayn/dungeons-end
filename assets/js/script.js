var inputEl = document.getElementById("player-name");
// var buttonEl = document.getElementById("start-button");

var beginAdventure = function(event) {
    console.log("Hooray!");
};

document.getElementById("start-button").addEventListener("click", beginAdventure);

var monsterRandomizer = function () {
    fetch(
        "https://www.dnd5eapi.co/api/monsters?challenge_rating=1,2,3,4,5"
    )
    .then(function(response){
    response.json().then(function(data){

    var randomMonster = data.results[Math.floor(Math.random() * data.results.length)]
    
        monsterSummoner(randomMonster.index);

    })
})
}


var monsterSummoner = function (monster) {
    
    fetch(
        "https://www.dnd5eapi.co/api/monsters/" + monster 
    )
    .then(function(response){
        response.json().then(function(data) {
            console.log(data.name);
            console.log(data.hit_points);
            console.log(data.armor_class);
            console.log(data.xp);
            console.log(data.actions[0].name);
            console.log(data.actions[0].damage[0].damage_dice);
            console.log(data.actions[0].attack_bonus);
            damageDiceRoll(data.actions[0].damage[0].damage_dice);

        })
    }
    )
}


var damageDiceRoll = function(damageDice) {

    var damageInfo = damageDice.split(/[d,+]/);
    var damageMultiplier = parseInt(damageInfo[0]);
    var damageValue = parseInt(damageInfo[1]);
    var damageBonus = parseInt(damageInfo[2]);


    console.log(damageInfo);
    console.log(damageValue);
    console.log(damageMultiplier);
    console.log(damageBonus);

    var damageDealt = (damageMultiplier * (Math.ceil(Math.random()*damageValue)) + damageBonus)

    console.log(damageDealt);

}


monsterRandomizer();
