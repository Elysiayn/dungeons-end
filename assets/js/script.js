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

var beginAdventure = function(event) {
    console.log("Hooray!");
};

document.getElementById("start-button").addEventListener("click", beginAdventure);

var monsterRandomizer = function (playerLevel) {
    fetch(
        "https://www.dnd5eapi.co/api/monsters?challenge_rating=" + playerLevel
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
            var cleanUrl = data.name.split(" ").join("-")
            console.log(data.name);
            gameState.enemy.name = data.name;

            monsterImageAPI(cleanUrl);

            console.log(data.hit_points);
            gameState.enemy.hp = data.hit_points;

            console.log(data.armor_class);
            gameState.enemy.armor = data.armor_class;

            console.log(data.xp);
            gameState.enemy.xp = data.xp;
            
            
            if (data.actions[0].name=== "Multiattack") {
            console.log(data.actions[0].name);
            console.log(data.actions[0].options.from[0]);
            var count = 1;
            for( i= 0; i < data.actions[0].options.from[0].length; i++ ){
                
                damageDiceRoll(data.actions[count].damage[0].damage_dice);
                count ++;
            }
                
            }
            else{    /*console.log(data.actions[0].damage[0].damage_dice);
            console.log(data.actions[0].attack_bonus);*/
            damageDiceRoll(data.actions[0].damage[0].damage_dice);
            }
        })
    }
    )
}

// I think we may need to wrap the hitDiceRoll and damageDiceRoll in a while loop to continue these functions until the monster dies. However, doing so may prevent the other list of options. So, we will actually want to have that be in the while loop, then just call on these functions conditionally. 

// What're the 3-4 options that a user can choose from, and are those options available with each round or is it per battle?

var hitDiceRoll = function() {
    min = Math.ceil(1);
    max = Math.floor(20);
    var toHit = Math.floor(Math.random() * (max - min + 1) + min);

    if (toHit < 6) {
        alert("You've failed to roll high enough!")
    } else if (toHit >= 6) {
        alert("You've rolled high enough to attack!")
        // damageDiceRoll();
    }

    // if (toHit + str + profBonus > monsterArmor) {
    //     damageDiceRoll();
    // } else {
        
    // }

    return toHit;    
}
console.log("Look at me!", hitDiceRoll());

var damageDiceRoll = function(damageDice) {

    var damageInfo = damageDice.split(/[d,+]/);
    var damageMultiplier = parseInt(damageInfo[0]);
    var damageValue = parseInt(damageInfo[1]);
    if(parseInt(damageInfo[2])){
    var damageBonus = parseInt(damageInfo[2]);
    } else {
        var damageBonus = 0;
    }

    console.log(damageInfo);
    console.log(damageValue);
    console.log(damageMultiplier);
    console.log(damageBonus); 

    var damageDealt = ((damageMultiplier * (Math.ceil(Math.random()*damageValue))) + damageBonus)

    console.log(damageDealt);

}

var monsterImageAPI = function(monsterName) {
    fetch("https://api.open5e.com/monsters/" + monsterName.toLowerCase())
    .then(function(response) {
        response.json().then(function(data) {
            console.log(data);
            // console.log(data.results[1].img_main);
        })
    })
};



monsterRandomizer(gameState.user.level);
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {});
  });

// Health Portion Modal //
  $(document).ready(function(){
    $('#healthportions').modal();
  });
          

