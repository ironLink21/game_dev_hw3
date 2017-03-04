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
            game = breakout.init({keyBoard});
        }

        if (game.isActive) {
            // UpdatePosition(gameTime);
            // game.ball.update(breakout);
            breakout.checkCollision();
        } else if (!game.isActive && game.ball.isStart) {
            game.isActive = true;
        }
    }

    function render(elapsedTime) {
        graphics.clear();
        game.paddle.draw();
        game.ball.draw();
        graphics.drawBricks(game.bricks);
    }

    function gameLoop(time) {
        let elapsedTime = time - prevTime;
        prevTime = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render(elapsedTime);

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
        game = breakout.init({keyBoard});
    };

    return {
        run
    };

})(Breakout.breakout, Breakout.graphics, Breakout.input);