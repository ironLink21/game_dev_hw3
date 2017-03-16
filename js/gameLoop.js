Breakout.screens['game-play'] = ((breakout, graphics, input)=>{
    'use strict';

    let prevTime = performance.now();
    let keyBoard = input.Keyboard();
    var game;

    function processInput(elapsedTime) {
        keyBoard.update(elapsedTime);
    }

    function update(elapsedTime) {
        if (game === undefined){
            game = breakout.init({keyBoard, paddles: 3, score: 0, ballSpeed: 2, brokenBricks: 0});
        }

        if (game.isActive) {
            let isRestart = breakout.checkCollision(elapsedTime);

            if(isRestart) {
                let output = breakout.handleGameOver();

                if(output.paddles === 0) {
                    input.showScreen('main-menu');

                } else {
                    game = breakout.init({keyBoard, isRestart, paddles: output.paddles, score: output.score, ballSpeed: output.speed, brokenBricks: output.brokenBricks , bricks: output.bricks, ball: output.ball});
                    input.showScreen('game-play');
                }
            }

            breakout.checkBrokenBricks();

        } else if (!game.isActive && game.ball.isStart) {
            let output = breakout.countdown(elapsedTime);
            game.countDown = output.countDown;
            game.isActive = output.isActive;
        }

        if(!game.isActive) {
            game.ball.x = game.paddle.x;
        }
    }

    function render() {
        graphics.clear();
        game.topBar.draw();
        game.paddle.draw();
        game.ball.draw();
        graphics.drawBricks(game.bricks);

        if(game.countDown) {
            game.countDown.draw();
        }
    }

    function gameLoop(time) {
        let elapsedTime = time - prevTime;
        prevTime = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        if (!input.cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function run() {
        // Start the animation loop
        input.cancelNextRequest = false;
        breakout.startGame();
        requestAnimationFrame(gameLoop);
    }

    window.onload = ()=>{
        game = breakout.init({keyBoard, paddles: 3, score: 0, ballSpeed: 2, brokenBricks: 0});
    };

    return {
        run
    };

})(Breakout.breakout, Breakout.graphics, Breakout.input);