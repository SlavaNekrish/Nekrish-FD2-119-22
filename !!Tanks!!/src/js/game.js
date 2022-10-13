"use strict";

// // Организация SPA

//     //render function

    const IMG_URL = 'src/sprites/';

    const setBG = imgName => {
        const body = document.querySelector('body');
        body.style.backgroundImage = `url(${IMG_URL}${imgName})`
    }

    const renderStartScreen = () => {
        setBG('Mult-tank.png');

        return `
        <div class="transf-wrap">
          <div class="start-wrap">
            <h2>!!Tanks 2D!!</h2>
            <input type="button" class="waves-effect waves-light btn-large" value="Старт" onclick="switchToGamePage()">
            <br>
            <input type="button" class="waves-effect waves-light btn-large" value="Настройки" onclick="switchToSettingsPage()">
            <br>
            <input type="button" class="waves-effect waves-light btn-large" value="Выход" onclick="switchToExitPage()">
          </div>
        </div>
      `
    }

    const renderGamePage = () => {
      document.querySelector('body').style.backgroundImage = `none`;
      document.querySelector('body').style.backgroundSize = "none";
      document.querySelector('body').style.backgroundRepeat = "none";
      document.querySelector('body').style.backgroundPosition = "none";

      return `
      <div class="game-zone">
      <div class="panel">
        <div class="info">
          <span class="player-name">Имя игрока: <span class="inner-name">Слава</span></span>
          <span class="points">Очки: <span class="inner-points">0</span></span>
          <span class="Eaglepoints">Орёл: <span class="inner-eaglePoints">10</span></span>
        </div>
     <div class="life">
     </div>
      <div class="eagle"></div> 
    </div>
    
      <div class="game-over">
        <div class="game-over-info"> 
          <span>Game Over</span>
          <a href="#" onclick="game()">Restart Game</a>
        </div>
        <div class="blur"></div>
      </div>
    </div>
    `
  }

    const renderSettingsScreen = () => {
        setBG('settings.png');
        document.querySelector('body').style.minHeight = `90vh`;

        const backgroundGame = ['tileSand1.png', 'tileGrass1.png', 'tileSand2.png'];

        const li = backgroundGame.reduce((acc, imgName, index) => {
            acc +=`<li data-id="${index}" onclick="setBG('${imgName}')">
                    <img src="${IMG_URL}${imgName}" alt="img"/>
                </li>`

            return acc
        }, '');

        return `
        <div class="setting">
        <h3>Настройки</h3>
        <div class="game-setting">
             <label>
                <input type="checkbox" />
                <span>Звук</span>
             </label>
        </div>
        <div class="game-setting">
            <p>Фон</p>
            <ul class="game-backgrounds">
                ${li}
            </ul>
        </div>
        <div class="game-setting">
            <p>Тема</p>
            <label>
                <input name="theme" type="radio" checked />
                <span>Светлая</span>
            </label>
            <label>
                <input name="theme" type="radio" />
                <span>Темная</span>
            </label>
        </div>
        <div class="game-setting">
          <h4>Правила игры:</h4>
          <h5>Управление - стрелками в правой части клавиатуры. Выстрел - пробелом. У танка игрока - 2 жизни.<br> Также проиграть можно, если Орел разрушен танками врага. У Орла - 10 жизней.</h5>
        </div>
        </div>
      `
    }

//     // router
    window.onhashchange = switchToStateFromURLHash;

    

    function switchToStateFromURLHash() {
        const URLHash = window.location.hash || "#start-screen";


        let pageHTML = '';

        switch (URLHash) {
            case '#start-screen':
                pageHTML += renderStartScreen();
                document.getElementById('app').innerHTML = pageHTML;
                break;
            case '#start-page':
                pageHTML += "<h3>Старт</h3>";
                break;
            case '#settings-page':
                pageHTML += renderSettingsScreen();
                document.getElementById('app').innerHTML = pageHTML;
                break;
            case '#game-page':
                pageHTML += renderGamePage();
                document.getElementById('app').innerHTML = pageHTML;
                superWrap();
                break;
            case '#exit-page':
                pageHTML += "<h3>Выход</h3>";
                break;
        }
        
      }
    function switchToState(newState) {
        location.hash = newState.pagename;
    }

    function switchToStartScreePage() {
        switchToState({pagename: 'start-screen'});
    }

    function switchToStartPage() {
        switchToState({pagename: 'start-page'});
    }

    function switchToSettingsPage() {
        switchToState({pagename: 'settings-page'});
    }

    function switchToGamePage() {
        switchToState({pagename: 'game-page'});
    }

    function switchToExitPage() {
        switchToState({pagename: 'exit-page'});
    }

    switchToStateFromURLHash();


// ИГРА
function superWrap() {  
// запуск игры
function game () {
  init();
  controllers();
  intervals();
}

// инициализация
const init = () => {

  clearInterval(ints.enemy);
  clearInterval(ints.run);
  clearInterval(ints.bullet);
  clearInterval(ints.generateEnemy);
  clearInterval(ints.enemyBullet);
  clearInterval(ints.checkEnemyBulletForPlayer);
  clearInterval(ints.enemyShots);

  if (player.hp === 0) {
    player.hp = 2;
    points = 0;
    eagle.hp = 10;
    document.querySelector('.inner-eaglePoints').innerText = eagle.hp;
  }

  if (eagle.hp <= 0) {         // рестарт игры после убийства орла
    player.hp = 2;
    points = 0;
    eagle.hp = 10;
    document.querySelector('.inner-eaglePoints').innerText = eagle.hp;

    clearInterval(ints.enemy);
    clearInterval(ints.run);
    clearInterval(ints.bullet);
    clearInterval(ints.generateEnemy);
    clearInterval(ints.enemyBullet);
    clearInterval(ints.checkEnemyBulletForPlayer);
    clearInterval(ints.enemyShots);



    let enemies = document.querySelectorAll('.enemy');

    enemies.forEach((enemy) => { 
      enemy.parentNode.removeChild(enemy);
    });

    let enemyBullets = document.querySelectorAll('.enemy-bullet');

    enemyBullets.forEach((bullet) => {
      bullet.parentNode.removeChild(bullet);
    });

    let bullets = document.querySelectorAll('.bullet');

    bullets.forEach((bullet) => {
        bullet.parentNode.removeChild(bullet);
    });

    player.el.parentNode.removeChild(player.el);

  }

  document.querySelector('.game-over').classList.remove('on');

  player.x = gameZone.getBoundingClientRect().width/2 - player.w;
  player.y = gameZone.getBoundingClientRect().height/2;

  eagle.el = document.querySelector(".eagle");
  eagle.x = gameZone.getBoundingClientRect().width/2 - eagle.w - 15;
  eagle.y = gameZone.getBoundingClientRect().height - eagle.h - 45;
  eagle.el.style.left = eagle.x + "px";
  eagle.el.style.top = eagle.y + "px";

  gameZone.innerHTML += `<div class="player" style="left: ${player.x}px; top: ${player.y}px"></div>`;
  player.el = document.querySelector(".player");

  playGameMusic();

  switch (player.hp) {
    case 2:
     document.querySelector('.life').innerHTML = `<img src="src/sprites/heart-1.png" class="life_image" alt="heart">`
    break;
    case 1:
      document.querySelector('.life').innerHTML = `<img src="src/sprites/heart-2.png" class="life_image" alt="heart">`
    break;
    case 0:
      document.querySelector('.life').innerHTML = `<img src="src/sprites/heart-3.png" class="life_image" alt="heart">`
    break;
  }

}

const gameOver = () => {
  document.querySelector('.game-over').classList.add('on');
  gameMusic.pause();
}

// Restart Game
const next = () => {

  player.hp -= 1;

  clearInterval(ints.enemy);
  clearInterval(ints.run);
  clearInterval(ints.bullet);
  clearInterval(ints.generateEnemy);
  clearInterval(ints.enemyBullet);
  clearInterval(ints.checkEnemyBulletForPlayer);
  clearInterval(ints.enemyShots);



  let enemies = document.querySelectorAll('.enemy');

  enemies.forEach((enemy) => { 
    enemy.parentNode.removeChild(enemy);
  });

  let enemyBullets = document.querySelectorAll('.enemy-bullet');

  enemyBullets.forEach((bullet) => {
      bullet.parentNode.removeChild(bullet);
  });

  let bullets = document.querySelectorAll('.bullet');

  bullets.forEach((bullet) => {
      bullet.parentNode.removeChild(bullet);
  });

  player.el.parentNode.removeChild(player.el);

  if (player.hp === 0) {
    return gameOver()
  }

  game();
}


// плавность движения игрока
const intervals = () => {

  clearInterval(ints.enemy);
  clearInterval(ints.run);
  clearInterval(ints.bullet);
  clearInterval(ints.generateEnemy);
  clearInterval(ints.enemyBullet);
  clearInterval(ints.checkEnemyBulletForPlayer);
  clearInterval(ints.enemyShots);

  ints.run = setInterval(() => {
    if (player.run) {

      switch (player.side) {
        case 1:  //top
          if (player.y > 0) {
            player.y -= player.step;
            player.el.style.top = `${player.y}px`;
          }
        break;
        case 3:  //bottom
          if (player.y < gameZone.getBoundingClientRect().bottom - player.h -11) {
            player.y += player.step;
            player.el.style.top = `${player.y}px`;
          }
        break;
        case 2: //right
          if (player.x < gameZone.getBoundingClientRect().right - player.w - 11) {
            player.x += player.step;
            player.el.style.left = `${player.x}px`;
          }
        break;
        case 4: //left
          if (player.x > 0) {
            player.x -= player.step;
            player.el.style.left = `${player.x}px`;
          }
        break;
      }
    }
  }, fps)
  ints.bullet = setInterval(() => {
    let bullets = document.querySelectorAll('.bullet');
    bullets.forEach((bullet) =>{
      let direction = bullet.getAttribute('direction');

      switch (direction) {
        case 'top': 
            if (bullet.getBoundingClientRect().top < 0) {
              bullet.parentNode.removeChild(bullet);
            } else {
            bullet.style.top = bullet.getBoundingClientRect().top - bulletInit.speed + "px";
            }
        break;
        case 'right': 
            if (bullet.getBoundingClientRect().right > gameZone.getBoundingClientRect().width) {
              bullet.parentNode.removeChild(bullet);
            } else { 
            bullet.style.left = bullet.getBoundingClientRect().left + (bulletInit.speed - 15) + "px";
            }
        break;
        case 'bottom': 
            if (bullet.getBoundingClientRect().bottom > gameZone.getBoundingClientRect().height) {
            bullet.parentNode.removeChild(bullet);
            } else { 
            bullet.style.top = bullet.getBoundingClientRect().top + (bulletInit.speed - 15) + "px";
            }
        break;
        case 'left': 
            if (bullet.getBoundingClientRect().left < 0) {
            bullet.parentNode.removeChild(bullet);
            } else { 
            bullet.style.left = bullet.getBoundingClientRect().left - (bulletInit.speed) + "px";
            }
        break;
      }
    })
  }, fps)
  ints.enemyBullet = setInterval(() => {
    let bullets = document.querySelectorAll('.enemy-bullet');
    bullets.forEach((bullet) => {
        let direction = bullet.getAttribute('direction');

        switch (direction) {
            case 'top':
                if (bullet.getBoundingClientRect().top < 0) {
                    bullet.parentNode.removeChild(bullet);
                } else {
                    bullet.style.top = bullet.getBoundingClientRect().top - enemyBulletInit.speed + 'px';
                }
                break;
            case 'right':
                if (bullet.getBoundingClientRect().right > gameZone.getBoundingClientRect().width) {
                    bullet.parentNode.removeChild(bullet);
                } else {
                    bullet.style.left = bullet.getBoundingClientRect().left + (enemyBulletInit.speed - 15) + 'px';
                }
                break;
            case 'bottom':
                if (bullet.getBoundingClientRect().bottom > gameZone.getBoundingClientRect().height) {
                    bullet.parentNode.removeChild(bullet);
                } else {
                    bullet.style.top = bullet.getBoundingClientRect().top + (bulletInit.speed - 15) + 'px';
                }
                break;
            case 'left':
                if (bullet.getBoundingClientRect().left < 0) {
                    bullet.parentNode.removeChild(bullet);
                } else {
                    bullet.style.left = bullet.getBoundingClientRect().left - (bulletInit.speed) + 'px';
                }
                break;
        }

    })
  }, fps)
  ints.enemy = setInterval(() =>{
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach((enemy) => { 

      const playerPosTop = player.el.getBoundingClientRect().top,
            playerPosRight = player.el.getBoundingClientRect().right,
            playerPosBottom = player.el.getBoundingClientRect().bottom,
            playerPosLeft = player.el.getBoundingClientRect().left,
            enemyPosTop = enemy.getBoundingClientRect().top,
            enemyPosRight = enemy.getBoundingClientRect().right,
            enemyPosBottom = enemy.getBoundingClientRect().bottom,
            enemyPosLeft = enemy.getBoundingClientRect().left;

      
      if (playerPosTop < enemyPosBottom && 
          playerPosBottom > enemyPosTop && 
          playerPosRight > enemyPosLeft && 
          playerPosLeft < enemyPosRight) {
            next();
          }
      
     
      let bullets = document.querySelectorAll('.bullet');
      
      bullets.forEach((bullet) => {

        let direction = bullet.getAttribute('direction');

        if (['top', 'left', 'right'].includes(direction)) {
          if (bullet.getBoundingClientRect().top < enemy.getBoundingClientRect().bottom && 
              bullet.getBoundingClientRect().bottom > enemy.getBoundingClientRect().top  && 
              bullet.getBoundingClientRect().right > enemy.getBoundingClientRect().left  && 
              bullet.getBoundingClientRect().left < enemy.getBoundingClientRect().right) {
              const enemyLeft = enemy.getBoundingClientRect().left;
              const enemyTop = enemy.getBoundingClientRect().top;
              const playerBack = player.el.style.backgroundImage;
              enemy.parentNode.removeChild(enemy);
              bullet.parentNode.removeChild(bullet);
              points += 1;
              document.querySelector('.inner-points').innerText = points;
              // добавление и удаление взрыва
              gameZone.innerHTML += `<div class="ex2" style="left: ${enemyLeft}px; top: ${enemyTop}px"></div>`;
              gameZone.removeChild(document.querySelector(".player"));
              gameZone.innerHTML += `<div class="player" style='left: ${player.x}px; top: ${player.y}px; background-image: ${playerBack}'></div>`;  
              player.el = document.querySelector(".player");
              setTimeout(() => {
                gameZone.removeChild((document.querySelectorAll('.ex2')[0]));
              }, 800);
          }
        } else {
          if (bullet.getBoundingClientRect().bottom > enemy.getBoundingClientRect().top && 
              bullet.getBoundingClientRect().right > enemy.getBoundingClientRect().left  && 
              bullet.getBoundingClientRect().left < enemy.getBoundingClientRect().right) {
              const enemyLeft = enemy.getBoundingClientRect().left;
              const enemyTop = enemy.getBoundingClientRect().top;
              enemy.parentNode.removeChild(enemy);
              bullet.parentNode.removeChild(bullet);
              points += 1;
              document.querySelector('.inner-points').innerText = points;
              // добавление и удаление взрыва
              gameZone.innerHTML += `<div class="ex2" style="left: ${enemyLeft}px; top: ${enemyTop}px"></div>`;
              gameZone.removeChild(document.querySelector(".player"));
              gameZone.innerHTML += `<div class="player" style="left: ${player.x}px; top: ${player.y}px; background-image: url('${player.sprites.bottom}')"></div>`;
              player.el = document.querySelector(".player");
              setTimeout(() => {
                gameZone.removeChild((document.querySelectorAll('.ex2')[0]));
              }, 800);
          }
        }
      });
      
      let direction = enemy.getAttribute('direction');

      switch (direction) {
        case 'right':
            if (enemy.getBoundingClientRect().left <= 0) {
                enemy.parentNode.removeChild(enemy);
            } else {
                enemy.style.left = enemy.getBoundingClientRect().left - 11 + "px";
            }
            break;
        case 'left':
          if (enemy.getBoundingClientRect().right >= gameZone.getBoundingClientRect().width) {
            enemy.parentNode.removeChild(enemy);
          } else {
            enemy.style.left = enemy.getBoundingClientRect().left - 5 + "px";
          }
        break;
        case 'top':
          if (enemy.getBoundingClientRect().top <= 0) {
            enemy.parentNode.removeChild(enemy);
          } else {
            enemy.style.top = enemy.getBoundingClientRect().top - 8 + "px";
          }
        break;
        case 'bottom':
          if (enemy.getBoundingClientRect().bottom >= gameZone.getBoundingClientRect().height) {
            enemy.parentNode.removeChild(enemy);
          } else {
            enemy.style.top = enemy.getBoundingClientRect().top - 2 + "px";
          }
        break;
      }
     
      // if (enemy.getBoundingClientRect().right >= gameZone.getBoundingClientRect().width) {
      //   enemy.parentNode.removeChild(enemy);
      // }
      // else enemy.style.left = enemy.getBoundingClientRect().left - 5 + "px";
    // }
    })
  }, fps)
  ints.generateEnemy = setInterval(() => {

     let direction = randomInteger(1,4);
     
     switch (direction) {
      case 1: //top:
        gameZone.innerHTML += `<div class="enemy" style="transform: rotate(-90deg); top: ${gameZone.getBoundingClientRect().height-player.h}px; left: ${randomInteger(0, gameZone.getBoundingClientRect().width-player.w)}px;" direction="top"></div>`; 
      break;
      case 2: //left
        gameZone.innerHTML += `<div class="enemy" style="transform: rotate(-180deg); top: ${randomInteger(0, gameZone.getBoundingClientRect().height-player.h)}px; left: ${gameZone.getBoundingClientRect().width-player.w}px;" direction="right"></div>`; 
      break;
      case 3: //bottom
        gameZone.innerHTML += `<div class="enemy" style="transform: rotate(90deg); top: 0px; left: ${randomInteger(0, gameZone.getBoundingClientRect().width-player.w)}px;" direction="bottom"></div>`; 
      break;
      case 4: //right
        gameZone.innerHTML += `<div class="enemy" style="top: ${randomInteger(0, gameZone.getBoundingClientRect().height-player.h)}px; left: 0px;" direction="left"></div>`; 
      break;
    }
     
     player.el = document.querySelector(".player"); 
  }, enemyGenerateSpeed); 
  ints.enemyShots = setInterval(() => {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach((enemy) => {

        let direction = enemy.getAttribute('direction');

        switch (direction) {
            case 'right':
                if (
                    player.el.getBoundingClientRect().top > enemy.getBoundingClientRect().top &&
                    player.el.getBoundingClientRect().top < enemy.getBoundingClientRect().bottom &&
                    player.el.getBoundingClientRect().right < enemy.getBoundingClientRect().left
                ) {
                    // alert('в зоне видимости')
                    gameZone.innerHTML += `<div class="enemy-bullet" direction="left" style="left: ${enemy.getBoundingClientRect().left - 33}px; top: ${enemy.getBoundingClientRect().top + 25}px; background-image: url('${enemyBulletInit.sprites.left}'); width: 26px; height: 16px"></div>`;
                    player.el = document.querySelector('.player');
                } if (   // стреляем в орла
                    eagle.x + eagle.w < enemy.getBoundingClientRect().left &&
                    eagle.y - 20 < enemy.getBoundingClientRect().top
                ) {
                    gameZone.innerHTML += `<div class="enemy-bullet" direction="left" style="left: ${enemy.getBoundingClientRect().left - 33}px; top: ${enemy.getBoundingClientRect().top + 25}px; background-image: url('${enemyBulletInit.sprites.left}'); width: 26px; height: 16px"></div>`;
                    player.el = document.querySelector('.player');
                    eagle.el = document.querySelector('.eagle');
                }
                if (enemy.getBoundingClientRect().left <= 0) {
                    enemy.parentNode.removeChild(enemy);
                } else {
                    enemy.style.left = enemy.getBoundingClientRect().left - 11 + 'px';
                }
                break;
            case 'left':
                if (
                    player.el.getBoundingClientRect().top > enemy.getBoundingClientRect().top &&
                    player.el.getBoundingClientRect().top < enemy.getBoundingClientRect().bottom &&
                    player.el.getBoundingClientRect().left > enemy.getBoundingClientRect().right
                ) {
                    gameZone.innerHTML += `<div class="enemy-bullet" direction="right" style="left: ${enemy.getBoundingClientRect().right - 7}px; top: ${enemy.getBoundingClientRect().top + enemy.getBoundingClientRect().height / 2 - 15}px; background-image: url('${enemyBulletInit.sprites.right}'); width: 26px; height: 16px""></div>`;
                    player.el = document.querySelector('.player');
                } 
                  if (   // стреляем в орла
                    eagle.x > enemy.getBoundingClientRect().right && 
                    eagle.y - 20 < enemy.getBoundingClientRect().top
                ) {
                    gameZone.innerHTML += `<div class="enemy-bullet" direction="right" style="left: ${enemy.getBoundingClientRect().right}px; top: ${enemy.getBoundingClientRect().top + enemy.getBoundingClientRect().height / 2 - 10}px; background-image: url('${enemyBulletInit.sprites.right}'); width: 26px; height: 16px""></div>`;
                    player.el = document.querySelector('.player');
                    eagle.el = document.querySelector('.eagle');
                }

                if (enemy.getBoundingClientRect().left >= gameZone.getBoundingClientRect().width) {
                    enemy.parentNode.removeChild(enemy);
                } else {
                    enemy.style.left = enemy.getBoundingClientRect().left - 5 + 'px';
                }
                break;
            case 'top':

                if (
                    player.el.getBoundingClientRect().bottom < enemy.getBoundingClientRect().top &&
                    player.el.getBoundingClientRect().right > enemy.getBoundingClientRect().left &&
                    player.el.getBoundingClientRect().right < enemy.getBoundingClientRect().right
                ) {
                    gameZone.innerHTML += `<div class="enemy-bullet" direction="top" style="left: ${enemy.getBoundingClientRect().left + enemy.getBoundingClientRect().width / 2 - 17}px; top: ${enemy.getBoundingClientRect().top - 35}px; background-image: url('${enemyBulletInit.sprites.top}'"></div>`;
                    player.el = document.querySelector('.player');
                }
                
                if (      // стреляем в орла
                    eagle.y < enemy.getBoundingClientRect().top &&
                    eagle.x + eagle.w > enemy.getBoundingClientRect().left &&
                    eagle.x + eagle.w < enemy.getBoundingClientRect().right
                ) {
                    gameZone.innerHTML += `<div class="enemy-bullet" direction="top" style="left: ${enemy.getBoundingClientRect().left + enemy.getBoundingClientRect().width / 2 - 17}px; top: ${enemy.getBoundingClientRect().top - 35}px; background-image: url('${enemyBulletInit.sprites.top}'"></div>`;
                    player.el = document.querySelector('.player');
                    eagle.el = document.querySelector('.eagle');
                }

                if (enemy.getBoundingClientRect().top <= 0) {
                    enemy.parentNode.removeChild(enemy);
                } else {
                    enemy.style.top = enemy.getBoundingClientRect().top - 8 + 'px';
                }
                break;
            case 'bottom':

                if (
                    player.el.getBoundingClientRect().top > enemy.getBoundingClientRect().bottom &&
                    player.el.getBoundingClientRect().right > enemy.getBoundingClientRect().left &&
                    player.el.getBoundingClientRect().right < enemy.getBoundingClientRect().right
                ) {
                    gameZone.innerHTML += `<div class="enemy-bullet" direction="bottom" style="left: ${enemy.getBoundingClientRect().left + enemy.getBoundingClientRect().width / 2 - 15}px; top: ${enemy.getBoundingClientRect().bottom - 8}px; background-image: url('${enemyBulletInit.sprites.bottom}'"></div>`;
                    player.el = document.querySelector('.player');
                }

                if (      // стреляем в орла
                    eagle.y > enemy.getBoundingClientRect().bottom &&
                    eagle.x + eagle.w > enemy.getBoundingClientRect().left &&
                    eagle.x + eagle.w < enemy.getBoundingClientRect().right
                ) {
                    gameZone.innerHTML += `<div class="enemy-bullet" direction="bottom" style="left: ${enemy.getBoundingClientRect().left + enemy.getBoundingClientRect().width / 2 - 15}px; top: ${enemy.getBoundingClientRect().bottom - 8}px; background-image: url('${enemyBulletInit.sprites.bottom}'"></div>`;
                    player.el = document.querySelector('.player');
                    eagle.el = document.querySelector('.eagle');
                }

                if (enemy.getBoundingClientRect().bottom >= gameZone.getBoundingClientRect().height) {
                    enemy.parentNode.removeChild(enemy);
                } else {
                    enemy.style.top = enemy.getBoundingClientRect().top - 2 + 'px';
                }
                break;
        }

        // if (enemy.getBoundingClientRect().right >= gameZone.getBoundingClientRect().width) {
        //     enemy.parentNode.removeChild(enemy);
        // } else {
        //     enemy.style.left = enemy.getBoundingClientRect().left + 3 + 'px';
        // }

    })
  }, enemyShotsSpeed)
  ints.checkEnemyBulletForPlayer = setInterval(() => {
   let bullets = document.querySelectorAll('.enemy-bullet');
   bullets.forEach((bullet) => {

      let direction = bullet.getAttribute('direction');

      if (['top', 'left', 'right'].includes(direction)) {
          if (
              bullet.getBoundingClientRect().top < player.el.getBoundingClientRect().bottom &&
              bullet.getBoundingClientRect().bottom > player.el.getBoundingClientRect().top &&
              bullet.getBoundingClientRect().right > player.el.getBoundingClientRect().left &&
              bullet.getBoundingClientRect().left < player.el.getBoundingClientRect().right
          ) {
              next();
              bullet.parentNode.removeChild(bullet);
          }

          if (
              bullet.getBoundingClientRect().top < eagle.y + eagle.h + 10 &&
              bullet.getBoundingClientRect().bottom > eagle.y + 10 &&
              bullet.getBoundingClientRect().right > eagle.x &&
              bullet.getBoundingClientRect().left < eagle.x + eagle.w
          ) {
              eagle.hp -= 1;
              document.querySelector('.inner-eaglePoints').innerText = eagle.hp;
              bullet.parentNode.removeChild(bullet);
              if (eagle.hp === 0) {
                gameOver()
              }
          }

      } else {
          if (
              bullet.getBoundingClientRect().bottom > player.el.getBoundingClientRect().top &&
              bullet.getBoundingClientRect().right > player.el.getBoundingClientRect().left &&
              bullet.getBoundingClientRect().left < player.el.getBoundingClientRect().right
          ) {
              next();
              bullet.parentNode.removeChild(bullet);
          }

          if (
            bullet.getBoundingClientRect().bottom > eagle.y &&
            bullet.getBoundingClientRect().right > eagle.x &&
            bullet.getBoundingClientRect().left < eagle.x + eagle.w
          ) {
              eagle.hp -= 1;
              document.querySelector('.inner-eaglePoints').innerText = eagle.hp;
              bullet.parentNode.removeChild(bullet);
              if (eagle.hp === 0) {
                gameOver()
              }
          }
      }
   });
  }, fps)
}

// добавление пули
const addBullet = () => { 
 
  switch (player.side) {
    case 1:
      gameZone.innerHTML += `<div class="bullet" direction="top" style="left: ${player.x + (player.w/2-10)}px; top: ${player.y - player.h/3.16}px; background-image: url('${bulletInit.sprites.top}')"></div>`;
    break;
    case 2:
      gameZone.innerHTML += `<div class="bullet" direction="right" style="left: ${player.x + (player.w-2)}px; top: ${player.y + 30}px; background-image: url('${bulletInit.sprites.right}'); width: 26px; height: 16px"></div>`;
    break;
    case 3:
      gameZone.innerHTML += `<div class="bullet" direction="bottom" style="left: ${player.x + (player.w/2-10)}px; top: ${player.y + player.h}px; background-image: url('${bulletInit.sprites.bottom}')"></div>`;
    break;
    case 4:
      gameZone.innerHTML += `<div class="bullet" direction="left" style="left: ${player.x - (player.w/2-15)}px; top: ${player.y +30}px; background-image: url('${bulletInit.sprites.left}'); width: 26px; height: 16px"></div>`;
    break;

  }

  player.el = document.querySelector(".player");
}
    

// движение игрока
const controllers = () => {
  document.addEventListener('keydown', (e) => {

     switch (e.keyCode) {
        case 38: //top
          player.el.style.backgroundImage = `url(${player.sprites.top})`;
          player.run = true;
          player.side = 1;
        break;
        case 40: //Bottom
          player.el.style.backgroundImage = `url(${player.sprites.bottom})`;
          player.run = true;
          player.side = 3;
        break;
        case 39: //right
          player.el.style.backgroundImage = `url(${player.sprites.right})`;
          player.run = true;
          player.side = 2;
        break;
        case 37:  //left
          player.el.style.backgroundImage = `url(${player.sprites.left})`;
          player.run = true;
          player.side = 4;
        break;
        case 32:  //shot!
          addBullet();
        break;
     }
  })
  document.addEventListener('keyup', (e) => {
      if ([37, 38, 39, 40].includes(e.keyCode)) {
        player.run = false;
      }
    })
  }


// Random integer
function randomInteger(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

// Music

const startMusic = new Audio ("src/audio/startSound.mp3");
startMusic.volume = 0.5;
const playStartMusic = () => {
  startMusic.currentTime = 0;
  startMusic.play();
}

const gameMusic = new Audio ("src/audio/gameSound.mp3");
gameMusic.volume = 0.5;
const playGameMusic = () => {
  gameMusic.currentTime = 0;
  gameMusic.play();
}
// список переменных
let gameZone = document.querySelector(".game-zone"),
points = 0,
fps = 1000/60,
player = {
  sprites: {
    top: 'src/sprites/tank_blue-top.png',
    right: 'src/sprites/tank_blue-right.png',
    bottom: 'src/sprites/tank_blue-bottom.png',
    left: 'src/sprites/tank_blue-left.png',
  },
  el: false,
  x: 500,
  y: 500,
  step: 10,
  run: false,
  side: 1, //1 (top), 2(right), 3(bottom), 4(left)
  w: 82,
  h: 79,
  hp: 2,
},
bulletInit = {          //  Changed! 2nd
  speed: 15,
  sprites: {
    top: 'src/sprites/bulletBlue2_top.png',
    right: 'src/sprites/bulletBlue2_right.png',
    bottom: 'src/sprites/bulletBlue2_bottom.png',
    left: 'src/sprites/bulletBlue2_left.png',
  }
},
enemyBulletInit = {          //  Changed! 5th
  speed: 15,
  sprites: {
    top: 'src/sprites/bulletRed2_top.png',
    right: 'src/sprites/bulletRed2_right.png',
    bottom: 'src/sprites/bulletRed2_bottom.png',
    left: 'src/sprites/bulletRed2_left.png',
  }
},
enemyGenerateSpeed = 1000,
enemyShotsSpeed = 500,
eagle = {                   //  Changed! 
  el: false,
  x: 500,
  y: 500,
  w: 80,
  h: 75,
  hp: 10, 
},
ints = {
  run: false,
  bullet: false,
  enemyBullet: false,
  enemy: false,
  generateEnemy: false,
  enemyShots: false,
  checkEnemyBulletForPlayer: false,
  test: false,
};

  game();
}

