//to-do
//game over
//sounds
//add comments to explain code
var bDizzy,bFaint,bJump,bRunning,gDizzy,gFaint,gJump,gRunning;
var player,boy,girl;
var gameState, score = 0, highScore = 0,
gameState = 0,counter = 0,char, flag = 0;
var obstacle, img1,img2,img3,img4,obstaclesGroup;
var ground,invisibleGround, back, backgroundImg;
var sprite;
var windSound, runSound;
var jump;
var gameOver;

//loading all required animations
function preload(){
gDizzy = loadAnimation("gd1.png","gd2.png");
gJump = loadAnimation("gj.png");
gRunning = loadAnimation("gr1.png","gr2.png","gr3.png","gr4.png",);
bDizzy = loadAnimation("bd1.png","bd2.png");
bJump = loadAnimation("bj2.png");
bRunning = loadAnimation("br1.png","br2.png","br3.png","br4.png","br5.png",);
img1 = loadImage("spike A.png");
img2 = loadImage("spike B.png");
img3 = loadImage("spike C.png");
img4 = loadImage("spike D.png");
img5 = loadAnimation("spiky-monster.png","sm2.png");
img6 = loadAnimation("lg1.png","lg2.png");
img7 = loadImage("spikes_1.png");
img8 = loadImage("spikes_2.png");
backgroundImg = loadImage("background.png");
overSound = loadSound("gameover.mp3");
gameOverAn = loadAnimation("gameOver1.png","gameOver2.png","3.png","4.png","4.png","4.png","4.png","4.png","4.png");
}
function setup(){ //creating required sprites
    createCanvas(600,600);
    back = createSprite(600,300,20,20);
    back.addImage(backgroundImg);
    invisibleGround = createSprite(300,555,600,10);
    obstaclesGroup = new Group();
    ground = createSprite(600,550,1200,20);
    ground.shapeColor = "black";
    gameOver = createSprite(300,300,20,20);
    gameOver.addAnimation("over",gameOverAn);
    player = createSprite(100,400,20,20);
    player.scale = 0.3;
    player.addAnimation("gdizzy",gDizzy);
    player.addAnimation("gfainted",gFaint);
    player.addAnimation("gjumping",gJump);
    player.addAnimation("bdizzy",bDizzy);
    player.addAnimation("bfainted",bFaint);
    player.addAnimation("bjumping",bJump);
    player.addAnimation("brunning",bRunning);    
    player.addAnimation("grunning",gRunning);
    boy = createSprite(400,300,20,20);
    boy.addAnimation("running",bRunning);
    boy.scale = 0.5;
    girl = createSprite(200,300,20,20);
    girl.addAnimation("running",gRunning);
    girl.scale = 0.5;
    sprite = createSprite(10,10,10,10);
    sprite.visible = false;
    frameRate(30);
}
function draw(){    
    stroke(10);
    background("cyan");
    player.collide(invisibleGround); 
    invisibleGround.visible = false;
    if(gameState === 0){ //character choosing
     player.visible = false;
     ground.visible = false;
     gameOver.visible = false;
     char = null;
     text("Press 'M' for Maya (in green) and 'B' for Bob (in yellow)!",210,180);
     if(keyDown("M")){
         char = 0;
         gameState = 1;
         player.changeAnimation("grunning",gRunning);
     }else if(keyDown("B")){
         char = 1;       
         gameState = 1;
         player.changeAnimation("brunning",bRunning);
     }
     /* the sprites boy and girl will no longer be required after this stage*/
    if(char !== null){
        girl.destroy();
        boy.destroy();
    }        
    }else
    if(gameState === 1){ // instructions
        background("yellow");
        text("Maya and Bob are two young first years at Hogwarts and have been chased into the forbidden forest by Bloody Baron!",10,80);
        text("Help them escape!",10,100)
        text("1. Press space to avoid the obstacles!",100,120);
        text("2. You have two chances, give your best!",100,140);
        text("Press space to continue.",100,200);
        player.visible = false;
        gameOver.visible = false;
        if(keyDown("space")){
            gameState = 2;
        }
        }else if
        (gameState === 2){ // playing the game
        back.velocityX = -8;
        ground.visible = true;
        gameOver.visible = false;
        if(back.x < 0){
            back.x = 600
        }
        
        if(frameCount % 50 === 0){
            score = score + 1;
        }
        if(sprite.life > 0){
        sprite.life = sprite.life - 5;  }
        player.visible = true;
        player.velocityY = player.velocityY + 2;
        spawn_Obstacles();

        if(keyDown("space") && player.y>470){ 
            player.velocityY = -22;
        }
 
        if( player.y < 480){
            if(char === 0){player.changeAnimation("gjumping",gJump);}else if(char === 1){player.changeAnimation("bjumping",bJump);}
        }
         if (sprite.life <= 0 && player.y >= 480){
            if(char === 0){
                player.changeAnimation("grunning",gRunning);
                }else if(char === 1){
                player.changeAnimation("brunning",bRunning);
                }
        } 
         if(sprite.life > 0 && player.y >= 480){

            if(char === 0){
                player.changeAnimation("gdizzy",gDizzy);}else
                 if(char === 1){
                player.changeAnimation("bdizzy",bDizzy);}
        }
    
        if(player.isTouching(obstaclesGroup)&&counter === 0 ){
            counter = 1;
            obstaclesGroup.destroyEach();
            sprite.life = 70;
         }else if (player.isTouching(obstaclesGroup)&& counter > 0){
            gameState = "END";
            obstaclesGroup.destroyEach();
            overSound.play();
         }
    }else if
        (gameState === "END"){ //game over 
        flag = 1;
        if(score > highScore){
            highScore = score;
        }
        gameOver.visible = true;
        background("black");
        fill("white")
        textSize(10);
        text("Press space to play again.",250,380);
        boy.visible = false;
        girl.visible = false;
        player.visible = false;
        ground.visible = false;
      
   
        if(keyDown("space")){
            back.x = 600;
            gameState = 0;
            createGirlandBoy();
            score = 0;
            counter = 0;
        }
      
    
        }
    if(gameState === 2){ // chosing visibility of background
        back.visible = true;
    }else{
        back.visible = false;
    }
    drawSprites();
    if(gameState === 2){ // writing score
        text("Score: "+score, 550,20);
        if(flag === 1){
            text("High Score:"+highScore, 460, 20);
        }
    }
    if(gameState === "END"){
        text("High Score:"+highScore, 260,240);
    }
    
}

function spawn_Obstacles(){ 
    obstacle = createSprite(620,500,20,20);
    obstacle.collide(invisibleGround);
    obstacle.depth = player.depth;
if (frameCount % 100 === 0){
    obstacle.visible = true;
    obstacle.velocityX = back.velocityX;
    obstacle.scale = 0.3;
    var num = Math.round(random(1,8));
    switch (num){
        case 1: 
            obstacle.addImage(img1);
        break;

        case 2:
            obstacle.addImage(img2);
        break;

        case 3:
            obstacle.addImage(img3);
        break;

        case 4:
            obstacle.addImage(img4);
        break;

        case 5:
            obstacle.addAnimation("monster",img5);
            obstacle.scale = 0.17;
            obstacle.velocityX = -10;
        break;

        case 6:
            obstacle.addAnimation("grumpy",img6);
            obstacle.scale = .5;
            obstacle.velocityX = -10;
        break;

        case 7:
            obstacle.addImage(img7);
            obstacle.scale = 0.2;
        break;

        case 8:
            obstacle.addImage(img8);
            obstacle.scale = 0.2;
        break;

        default:
        break;

        }
    if(obstacle.x<0){
        obstacle.destroy();
    }
    obstaclesGroup.add(obstacle);
    }else if(frameCount % 100 !== 0){
        obstacle.visible = false;
    }
}
function createGirlandBoy(){
    boy = createSprite(400,300,20,20);
    boy.addAnimation("running",bRunning);
    boy.scale = 0.5;
    girl = createSprite(200,300,20,20);
    girl.addAnimation("running",gRunning);
    girl.scale = 0.5;
}
