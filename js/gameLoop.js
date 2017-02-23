Breakout.gameLoop = ((breakout, graphics, input)=>{
    'use strict';

    let prevTime = performance.now();
    let keyBoard = input.Keyboard(),
        game = breakout.init();


    function processInput(elapsedTime) {
        keyBoard.update(elapsedTime);
    }

    function update(elapsedTime) {
        if(game === undefined){
            game = breakout.init();
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

        requestAnimationFrame(gameLoop);
    }

    keyBoard.registerCommand(KeyEvent.DOM_VK_A, game.paddle.moveLeft);
    keyBoard.registerCommand(KeyEvent.DOM_VK_D, game.paddle.moveRight);

    requestAnimationFrame(gameLoop);

})(Breakout.breakout, Breakout.graphics, Breakout.input);