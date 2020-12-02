var gameState = {
    user: {
        name: "",
        hp: 50, // determined by player selected
        ap: 0, // determined by roll 
        armor: 8, // determined by player selected
        xp: 0,
        level: 1,
        attack: "2d6+5"
    },
    enemy: {
        name: "",
        hp: 0,
        ap: 0,
        armor: 0,
        xp: 0,
        challenge_rating: 0,
        attacks: []
    },

}

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
            //console.log(data.name);
            gameState.enemy.name = data.name;

            monsterImageAPI(cleanUrl);

            //console.log(data.hit_points);
            gameState.enemy.hp = data.hit_points;

            //console.log(data.armor_class);
            gameState.enemy.armor = data.armor_class;

            //console.log(data.xp);
            gameState.enemy.xp = data.xp;
            
            /*if (data.actions[0].name === "Multiattack") {
                console.log(data.actions[0].name);
                console.log(data.actions[0].options.from[0]);
                var count = 1;
                for( i= 0; i < data.actions[0].options.from[0].length; i++ ){
                    
                    damageDiceRoll(data.actions[count].damage[0].damage_dice);
                    count ++;
                }
                    
                }
                else{   
                damageDiceRoll(data.actions[0].damage[0].damage_dice);
                }*/
            

            if (data.actions[0].name === "Multiattack") {
            console.log(data.actions[0].name);
            /*console.log(data.actions[0].options.from[0]);*/

            var attackInfo = {};

            attackInfo.name = data.actions[0].name;
            attackInfo.damageDice = 0;
            gameState.enemy.attacks.push(attackInfo); 
            
            //debugger;

            var count = 1;
            for( i= 0; i < data.actions[0].options.from[0].length; i++ ){
                
                var attackInfo = {};

                attackInfo.name = data.actions[count].name;  
                attackInfo.damageDice = data.actions[count].damage[0].damage_dice;
                attackInfo.hitBonus = data.actions[count].attack_bonus;

                gameState.enemy.attacks.push(attackInfo);
                count ++;
            }
                
            } else{
                
                // var needed on all parts to keep the function from overwriting other array elements
                var attackInfo = {};

                attackInfo.name = data.actions[0].name;
                attackInfo.damageDice = data.actions[0].damage[0].damage_dice;
                attackInfo.hitBonus = data.actions[0].attack_bonus;

                gameState.enemy.attacks.push(attackInfo);
                
            }
           // console.log(gameState.enemy.attacks)
        })
    }
    )
}


// I think we may need to wrap the hitDiceRoll and damageDiceRoll in a while loop to continue these functions until the monster dies. However, doing so may prevent the other list of options. So, we will actually want to have that be in the while loop, then just call on these functions conditionally. 

// What're the 3-4 options that a user can choose from, and are those options available with each round or is it per battle?

var damageDiceRoll = function(damageDice) {

    var damageInfo = damageDice.split(/[d,+]/);
    var damageMultiplier = parseInt(damageInfo[0]);
    var damageValue = parseInt(damageInfo[1]);
    if(parseInt(damageInfo[2])){
    var damageBonus = parseInt(damageInfo[2]);
    } else {
        var damageBonus = 0;
    }

    /*console.log(damageInfo);
    console.log(damageValue);
    console.log(damageMultiplier);
    console.log(damageBonus);*/

    var damageDealt = ((damageMultiplier * (Math.ceil(Math.random()*damageValue))) + damageBonus)

    console.log(damageDealt);

}


var hitDiceRoll = function() {
    min = Math.ceil(1);
    max = Math.floor(20);
    var toHit = Math.floor(Math.random() * (max - min + 1) + min);
    

    if (toHit < 6) {
        console.log("You've failed to strike the " + gameState.enemy.name);
    } else if (toHit >= 6) {
        console.log("You've dealt the " + gameState.enemy.name + " a mighty blow!")
        damageDiceRoll(gameState.user.attack);
    }

    // if (toHit + str + profBonus > monsterArmor) {
    //     damageDiceRoll();
    // } else {
        
    // }
    monsterAttack();
    return toHit;    
}

//console.log("Look at me!", hitDiceRoll());


var playerDodge = function (event) {
    console.log("You took the dodge action");
    gameState.user.armor = gameState.user.armor + 5;
    //console.log(gameState.user.armor);

    monsterAttack();
    
    gameState.user.armor = gameState.user.armor -5;
    //console.log(gameState.user.armor);
}

var playerRun = function (event) {
    console.log("You ran away");
    //monsterAttack();
}

var monsterImageAPI = function(monsterName) {
    fetch("https://api.open5e.com/monsters/" + monsterName.toLowerCase())
    .then(function(response) {
        response.json().then(function(data) {
            //console.log(data);
            // console.log(data.results[1].img_main);
        })
    })
};

var monsterAttack = function () {
    min = Math.ceil(1);
    max = Math.floor(20);
    var monsterStrike = Math.floor(Math.random() * (max - min + 1) + min);
    
     console.log(gameState.enemy.attacks[0].name);
    if (monsterStrike < gameState.user.armor) {
        console.log(gameState.enemy.name + " failed to strike you!")
    } else if (monsterStrike >= gameState.user.armor) {
        if (gameState.enemy.attacks[0].name === "Multiattack"){
            //debugger;
            console.log(gameState.enemy.name + " hits you!")
            var count = 1;
            if (gameState.enemy.attacks.length < 3 ) {
                console.log(gameState.enemy.attacks[count].damageDice)
                damageDiceRoll(gameState.enemy.attacks[count].damageDice);
                damageDiceRoll(gameState.enemy.attacks[count].damageDice);
            } else {
            for ( i = 0; i < gameState.enemy.attacks.length; i++) {

                damageDiceRoll(gameState.enemy.attack[count].damageDice);
                count ++;
            }}}
         else {
            console.log(gameState.enemy.name + " hits you!")
            damageDiceRoll(gameState.enemy.attacks[0].damageDice);
        }
    }
}  

monsterRandomizer(gameState.user.level);
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {});
  });

// Health Portion Modal //
 /*  $(document).ready(function(){
    $('#healthportions').modal();
  }); */ 

 document.getElementById("attack-button").addEventListener("click", hitDiceRoll);
 document.getElementById("dodge-button").addEventListener("click", playerDodge);
 document.getElementById("run-button").addEventListener("click", playerRun);
 

