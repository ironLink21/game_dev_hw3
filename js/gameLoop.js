Breakout.screens['game-play'] = ((breakout, graphics, input)=>{
    'use strict';

    let prevTime = performance.now();
    let keyBoard = input.Keyboard();
    var game,
        isPaused = false;

    function processInput(elapsedTime) {
        keyBoard.update(elapsedTime);
    }

    function update(elapsedTime) {
        if (game === undefined){
            game = breakout.Create({keyBoard, paddles: 3, score: 0, ballSpeed: 200, brokenBricks: 0});
        }

        if (game.isActive) {
            game.CheckCollision(elapsedTime);

            if(game.isRestart) {
                let output = game.HandleGameOver();

                if(output.paddles === 0) {
                    document.getElementById('name-section').style.display = 'block';
                    document.getElementById('background-shield').style.display = 'block';

                } else {
                    game = breakout.Create({keyBoard, isRestart: true, paddles: output.paddles, score: output.score, ballSpeed: output.speed, brokenBricks: output.brokenBricks , bricks: output.bricks, balls: output.balls});
                    input.ShowScreen('game-play');
                }
            }

            _.each(game.particles, (particle)=>{
                particle.obj.update(elapsedTime);
                particle.obj.create();
            });

            game.checkParticles(elapsedTime);

            _.each(game.balls, (ball)=>{
                ball.update(elapsedTime);
            });
            game.CheckBrokenBricks(elapsedTime);
            game.CheckPoints();

        } else if (!game.isActive && game.balls[0].isStart) {
            let output = game.Countdown(elapsedTime);
            game.countDown = output.countDown;
            game.isActive = output.isActive;
        }

        if(!game.isActive) {
            game.balls[0].x = game.paddle.x;
        }
    }

    function render() {
        graphics.Clear();
        game.topBar.draw();
        game.paddle.draw();
        graphics.DrawBalls(game.balls);
        graphics.DrawBricks(game.bricks);
        graphics.DrawParticles(game.particles);

        if(game.countDown) {
            game.countDown.draw();
        }
    }

    function gameLoop(time) {
        let elapsedTime = time - prevTime;
        prevTime = time;

        if(!game.isPaused) {
            processInput(elapsedTime);
            update(elapsedTime);
            render();
        }

        if (!input.cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function run() {
        // Start the animation loop
        input.cancelNextRequest = false;
        game.StartGame();
        requestAnimationFrame(gameLoop);
    }

    function saveScore() {
        game.addValue();
    }

    window.onload = ()=>{
        game = breakout.Create({keyBoard, paddles: 3, score: 0, ballSpeed: 200, brokenBricks: 0});
        document.getElementById('name-section').style.display = 'none';
        document.getElementById('paused-section').style.display = 'none';
        document.getElementById('background-shield').style.display = 'none';
    };

    return {
        isPaused,
        run,
        saveScore
    };

})(Breakout.breakout, Breakout.graphics, Breakout.input);