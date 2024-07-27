let time = 0; 
const BODY = document.querySelector('body');
const DIV = document.createElement('div');
		DIV.setAttribute('class', 'wrap-game');
		DIV.innerHTML = `<div class="wrap-level-dangerous">
			<div class="wrap-level">
				<label for="easy">Easy</label>
				<input type="radio" name="level" id="easy" value="10" class="level" checked>
			</div>
			<div class="wrap-level">
				<label for="medium">Medium</label>
				<input type="radio" name="level" id="medium" value="15" class="level" >
			</div>
			<div class="wrap-level">
				<label for="hard ">Hard</label>
				<input type="radio" name="level" id="hard" value="25" class="level">
			</div>
			<label class="theme">
			<input type="checkbox" class="change-theme">
			change the theme
			</label>
		</div>
		<div class="wrap-count-bombs">
			<label for="bombs" class="bombs">Bombs</label>
			<input id="bombs" type="number" class="number" min="10" max="99" value="10">
			<h3 class="flags">Flags: <span class="flag">0</span></h3>
			<button class="new-game">New Game</button>
			<h3 class="timer">Time: <span class="time">${time.toString().padStart(3, '0')}</span> s</h3>
		</div>
		`;	

let WIDTH;
let HEIGHT;





const wrapArea = document.createElement('div');
		wrapArea.setAttribute('class', 'wrap-area');

const IMG = `<img src="img/bomb.png" class="img-bomb" alt="bomb">`;
BODY.append(DIV);

const EASY = document.querySelector('#easy');
const MEDIUM = document.querySelector('#medium');
const HARD = document.querySelector('#hard');

DIV.append(wrapArea);

const audioGameOver = new Audio('https://www.fesliyanstudios.com/play-mp3/5637');
const audioWin = new Audio('https://www.fesliyanstudios.com/play-mp3/4236');
let number = document.querySelector('.number');
let flag = document.querySelector('.flag');
const newGame = document.querySelector('.new-game');
const audioAddFlag = new Audio('https://www.fesliyanstudios.com/play-mp3/777');

//смена темы
const changeTheme = document.querySelector('.change-theme');
changeTheme.addEventListener('change', e =>{
	BODY.classList.toggle('dark');
})

// клик правой кнопкой мыши
wrapArea.addEventListener('contextmenu', e =>{
       e.preventDefault(); 
       if(number.value == 0 && !e.target.classList.contains('lock')){
       	e.target.classList.add('');
       } 
       if (!e.target.classList.contains('lock')) {
       		audioAddFlag.play();
          	e.target.classList.add('lock');
        	flag.textContent++;
        	number.value--;

        }else{
        	audioAddFlag.play();
        	e.target.classList.remove('lock');
           	number.value++;
      		flag.textContent--;
        }    
});

startGame();

function startGame(WIDTH = 10,HEIGHT = 10,CELLS_COUNT = WIDTH * HEIGHT, COUNT_BOMBS = Math.floor(CELLS_COUNT * 0.1)) {
			wrapArea.innerHTML = `<button class="cell"></button>`.repeat(CELLS_COUNT);
	const CELL_H = document.querySelector('.cell');
	const cells = [...wrapArea.children];
	let bombs = [...Array(CELLS_COUNT).keys()]
					.sort(() => Math.random() - 0.5)
					.slice(0,COUNT_BOMBS);
	
	wrapArea.addEventListener('click', e => {
		showTime(false);
		if(e.target.className != 'cell') return;
		const i = cells.indexOf(e.target);
		const column = i % WIDTH;
		const row = Math.floor(i / WIDTH);
		open(row , column);
	})	

	

	let closedCount = CELLS_COUNT;
	function getCount(r,c){
		let count = 0;
		for (let i = -1; i <= 1; i++) {
			for(let j = -1; j <= 1; j++){
				if(isBomb(r + j, c + i)) count++;
			}
		}
		return count;
	}

	
	function numColor(n,cell){
		switch(n) {
			case 1:
				cell.style.color = "blue";
				break;
			case 2:
				cell.style.color = "green";
				break;
			case 3:
				cell.style.color = "red";
				break;
			case 4:
				cell.style.color = "#00008b";
				break;
			case 5:
				cell.style.color = "#964b00";
				break;
			case 6:
				cell.style.color = "#30d5c8";
				break;
			case 7:
				cell.style.color = "#000";
				break;
			case 8:
				cell.style.color = "#fff";
				break;
		}
	}

	function open(r,c){
		if(!isValid(r,c)) return;
		const i = r * WIDTH + c;
		const cell = cells[i];
		numColor(getCount(r,c),cell);
		cell.innerHTML = isBomb(r,c) ? IMG : getCount(r,c) === 0 ? ' ' : getCount(r,c);
		if(cell.disabled === true) return;
		cell.disabled = true;
		if (cell.hasAttribute('disabled')) {
			cell.style.background = "gray";
		}
		openNCells(r,c);
		closedCount--;
		if (isBomb(r,c)) {
			audioGameOver.play();
			alert('GAME OVER');
			setTimeout(() => location.reload(),600);
		}else if(closedCount <= COUNT_BOMBS){
			audioWin.play();
			alert('You won!');
			setTimeout(() => location.reload(),1500);
		}
	}

	function openNCells(r,c){
		let count = getCount(r,c);
		if(count === 0){
			for (let i = -1; i <= 1; i++) {
				for(let j = -1; j <= 1; j++){
					open(r + j, c + i);
				}
			}
		} 
	}

	

	function isBomb(r,c){
		if(!isValid(r,c)) return false;
		const i = r * WIDTH + c;
		return bombs.includes(i);
	}	

	function isValid(r,c){
		return r >= 0
			 && r < HEIGHT 
			 && c >= 0
			 && c < WIDTH;
	}


	

	EASY.addEventListener('click', e => {
		startGame();
		wrapArea.style.gridTemplateColumns = "repeat(10, 60px)";
		wrapArea.style.gridTemplateRows = "repeat(10, 60px)"; 
		number.value = 10;
		flag.textContent = 0;
		timer.textContent = 0;
		clearTimeout(showTime);
	});

	MEDIUM.addEventListener('click', e => {
		startGame(15,15);
		wrapArea.style.gridTemplateColumns = "repeat(15, 40px)";
		wrapArea.style.gridTemplateRows = "repeat(15, 40px)"; 
		number.value = 22;
		flag.textContent = 0;
		timer.textContent = 0;
		clearTimeout(showTime);
	});

	HARD.addEventListener('click', e => {
		startGame(25,25);
		wrapArea.style.gridTemplateColumns = "repeat(25, 40px)";
		wrapArea.style.gridTemplateRows = "repeat(25, 40px)"; 
		number.value = 62;
		flag.textContent = 0;
		timer.textContent = 0;
		clearTimeout(showTime);
	});

	number.addEventListener('change', e =>{
			startGame(WIDTH,HEIGHT,WIDTH * HEIGHT,number.value);
	})

	let timer = document.querySelector('.time');
	function showTime(finish){
	  if (!finish) {
	    time++;
	    timer.textContent = time.toString().padStart(3, '0');
	    setTimeout(showTime, 1000);
	  }else if(finish){
	    clearTimeout(showTime);
	  }
	}

	

	newGame.addEventListener('click', e =>{
		wrapArea.style.gridTemplateColumns = "repeat(10, 60px)";
		wrapArea.style.gridTemplateRows = "repeat(10, 60px)";
		EASY.checked = true;
		number.value = 10;
		location.reload();
	});

	if(number.value < 10) number.value = 10;
	if(number.value > 99) number.value = 99;

	const audio = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
	const buttons = document.querySelectorAll(".wrap-area");


	buttons.forEach(button => {
	  button.addEventListener("click", () => {
	  		audio.play();
	  });
	});
     

   
}
