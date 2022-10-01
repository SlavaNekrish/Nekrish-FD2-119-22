// запуск игры
const game = () => {

  init();
  controllers();
  intervals();
}

// инициализация
const init = () => {
  gameZone.innerHTML += `<div class="player" style="left: ${player.x}px; top: ${player.y}px"></div>`;
  player.el = document.querySelector(".player");
}

// плавность движения игрока
const intervals = () => {
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
  ints.enemy = setInterval(() =>{
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach((enemy) => { 
     
      let bullets = document.querySelectorAll('.bullet');
      
      bullets.forEach((bullet) => {

        let direction = bullet.getAttribute('direction');

        if (['top', 'left', 'right'].includes(direction)) {
          if (bullet.getBoundingClientRect().top < enemy.getBoundingClientRect().bottom && 
          bullet.getBoundingClientRect().bottom > enemy.getBoundingClientRect().top  && 
          bullet.getBoundingClientRect().right > enemy.getBoundingClientRect().left  && 
          bullet.getBoundingClientRect().left < enemy.getBoundingClientRect().right) {
            enemy.parentNode.removeChild(enemy);
            bullet.parentNode.removeChild(bullet);
            points += 1;
            document.querySelector('.inner-points').innerText = points;
          }
        } else {
          if (bullet.getBoundingClientRect().bottom > enemy.getBoundingClientRect().top && 
          bullet.getBoundingClientRect().right > enemy.getBoundingClientRect().left  && 
          bullet.getBoundingClientRect().left < enemy.getBoundingClientRect().right) {
            enemy.parentNode.removeChild(enemy);
            bullet.parentNode.removeChild(bullet);
            points += 1;
            document.querySelector('.inner-points').innerText = points;
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
  }, 3000)
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
  h: 79
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
ints = {
  run: false,
  bullet: false,
  enemy: false,
  generateEnemy: false,
};




game();
