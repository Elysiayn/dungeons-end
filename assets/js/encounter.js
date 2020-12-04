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

var damageDealt = 0;

var min = Math.ceil(1);
var max = Math.floor(20);
var monsterHit = Math.floor(Math.random() * (max - min + 1) + min);


//this function pulls a random monster based on the player's current level
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


// this takes the monster from the monsterRandomizer function and gets the stats for it from the api

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
            
            if (data.index === "duergar") {
                console.log("duergar ran away")
                monsterRandomizer(gameState.user.level);
            }

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
            //console.log(data.actions[0].name);
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

// this calcualtes the damage done by the user and the monster when they land an attack

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

    damageDealt = ((damageMultiplier * (Math.ceil(Math.random()*damageValue))) + damageBonus)

    console.log(damageDealt);

}


// this determines if the user hits the monster and represent the fight button

var hitDiceRoll = function() {
    
    var toHit = Math.floor(Math.random() * (max - min + 1) + min);
    

    if (toHit < 6) {
        console.log("You've failed to strike the " + gameState.enemy.name);
    } else if (toHit >= 6) {
        console.log("You've dealt the " + gameState.enemy.name + " a mighty blow!")
        damageDiceRoll(gameState.user.attack);
        
        gameState.enemy.hp = gameState.enemy.hp - damageDealt;
        console.log("enemy health " + gameState.enemy.hp)
    }

    // if (toHit + str + profBonus > monsterArmor) {
    //     damageDiceRoll();
    // } else {
        
    // }

    
    endGame();
    // if statement is here to check if the monster is alive and before it attacks 
    if (gameState.enemy.hp > 0) {
    monsterAttack();
    }
    return toHit;    
}

//console.log("Look at me!", hitDiceRoll());


// this allows the player to take a dodge action and temperarily increase their armor to hopefully avoid a strike from the monster

var playerDodge = function (event) {
    console.log("You took the dodge action");
    gameState.user.armor = gameState.user.armor + 5;
    //console.log(gameState.user.armor);

    monsterAttack();
    
    gameState.user.armor = gameState.user.armor -5;
    //console.log(gameState.user.armor);

    
}

//this will allow the player to run away

var playerRun = function (event) {
    console.log("You ran away");
    //monsterAttack();
}

// this will grab an image of the monster

var monsterImageAPI = function(monsterName) {
    fetch("https://api.open5e.com/monsters/" + monsterName.toLowerCase())
    .then(function(response) {
        response.json().then(function(data) {
            //console.log(data);
            // console.log(data.results[1].img_main);
        })
    })
};


// this rolls to see if the monter hits the user 

var monsterStrike =  function() { 
    
    monsterHit = Math.floor(Math.random() * (max - min + 1) + min);
    //console.log(monsterHit)

}

// this is the function to determine if the monster hit and if so what to do about it

var monsterAttack = function () {
    
         console.log(gameState.enemy.attacks[0].name);
     
        //checks if the monster has the mulitattack feature

        if (gameState.enemy.attacks[0].name === "Multiattack"){
           // debugger;
           // var count = 1;
           
            
            // this will run if the monster has a multiattack feature but only one basic attack. Allowing it to strike twice. the monsterstike function being inside the for loop forces it to have to check to see if it hits with each attack
            if (gameState.enemy.attacks.length < 3 ) {
                for(i=0; i < gameState.enemy.attacks.length; i++ ) {                
                    monsterStrike();
                    if (monsterHit < gameState.user.armor) {
                        console.log(gameState.enemy.name + " failed to strike you!")
                    } else if (monsterHit>= gameState.user.armor){
                        console.log(gameState.enemy.name + " hits you with " + gameState.enemy.attacks[1].name + "!")
                        damageDiceRoll(gameState.enemy.attacks[1].damageDice);
                        gameState.user.hp = gameState.user.hp - damageDealt;
                        console.log("user health " + gameState.user.hp)
                        endGame();
                    }
                }
            } else {
                // this will run through all other monster attacks if they have multiattack and more then one base ability
            for ( i = 1; i < gameState.enemy.attacks.length; i++) {
                monsterStrike();
                if (monsterHit< gameState.user.armor) {
                    console.log(gameState.enemy.name + " failed to strike you!")
                } else if (monsterHit >= gameState.user.armor) {
                    console.log(gameState.enemy.name + " hits you with " + gameState.enemy.attacks[i].name + "!")
                    damageDiceRoll(gameState.enemy.attacks[i].damageDice);
                    gameState.user.hp = gameState.user.hp - damageDealt;
                    console.log("user health " + gameState.user.hp)
                    endGame();
                }
                
            }}}
         else {
             // this will run if the monster does not have multiattack, it will use its first ability
            monsterStrike();
            if (monsterHit < gameState.user.armor) {
                console.log(gameState.enemy.name + " failed to strike you!")
            } else if (monsterHit >= gameState.user.armor){
                console.log(gameState.enemy.name + " hits you with " + gameState.enemy.attacks[0].name + "!")
                damageDiceRoll(gameState.enemy.attacks[0].damageDice);
                gameState.user.hp = gameState.user.hp - damageDealt;
                console.log("user health " + gameState.user.hp)
                endGame();
            }
        }
    
}  

monsterRandomizer(gameState.user.level);
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {});
  });

// Health Portion Modal //
$(document).ready(function(){
    $('.modal').modal();
  })
  


  // function used to check if the user or enemies' heatlh falls below zero
var endGame = function() {

    if (gameState.enemy.hp <= 0) {
        console.log("The monster has been slain");
        gameState.user.xp = gameState.user.xp + gameState.enemy.xp;
        console.log (gameState.user.xp);
        monsterRandomizer(gameState.user.level);
        
    } else if(gameState.user.hp <= 0) {
        console.log("You have perished");
        //store xp/score and character name in local store send user to highscore screen
        window.location.href = "./highscore.html"
    } 


}


 document.getElementById("attack-button").addEventListener("click", hitDiceRoll);
 document.getElementById("dodge-button").addEventListener("click", playerDodge);
 document.getElementById("run-button").addEventListener("click", playerRun);
 

