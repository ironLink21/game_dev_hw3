Breakout.breakout = ((graphics, input)=>{
    'use strict';

    let bricks,
        paddle,
        paddles,
        ball,
        text,
        scores,
        isActive,
        isStart = false,
        numBricks = 14,
        dx = 2,
        dy = 2;

    function init(spec) {
        paddles = 3;
        bricks = [];
        isActive = false;
        scores = (localStorage.highScores) ? localStorage.highScores : {};

        paddle = graphics.Paddle({
            image: './assets/blue_brick.png',
            moveRate: 300,
            center: {x: graphics.canvas.width / 2, y: graphics.canvas.height - 20},
            width: 300,
            height: 20
        });

        ball = graphics.Ball({
            color: '#4169E1',
            speed: 300,
            direction: 0,
            radius: 10,
            center:{x: graphics.canvas.width / 2, y: graphics.canvas.height / 2},
        });

        text = graphics.Text({
            text: '',
            font: '32px Arial, sans-serif',
            fill: 'rgba(150, 0, 0, 1)',
            stroke: 'rgba(255,0,0,1)',
            position: {x: 100,y: 100}
        });

        for(let i = 0; i < 8; i++) {
            let color,
                points,
                cols = [];

            switch(i) {
                case 0: case 1:
                    color = 'green';
                    points = 5;
                    break;
                case 2: case 3:
                    color = 'blue';
                    points = 3;
                    break;
                case 4: case 5:
                    color = 'orange';
                    points = 2;
                    break;
                case 6: case 7:
                    color = 'yellow';
                    points = 1;
                    break;
                default:
            }

            for(let j = 0; j < numBricks; j++) {
                cols[j] = graphics.Brick({
                    color,
                    points,
                    center: {x:j, y:i},
                    width: graphics.canvas.width / numBricks,
                    height: 20
                });
            }
            bricks[i] = cols;
        }

        input.showScreen('main-menu');

        spec.keyBoard.registerCommand(KeyEvent.DOM_VK_LEFT, paddle.moveLeft);
        spec.keyBoard.registerCommand(KeyEvent.DOM_VK_RIGHT, paddle.moveRight);

        return {bricks, paddle, ball, isActive};
    }

    function handleGameOver() {
        if(paddles <= 0) {
            alert("Game Over");
            input.cancelNextRequest = true;
            input.showScreen('main-menu');
            localStorage.highScores += scores;
        } else {
            paddles--;
        }

        input.showScreen('game-play');
    }

    function handleCollisions() {

    }

    function startGame() {
        ball.isStart = true;
    }


    return {
        paddles,
        scores,
        isStart,
        init,
        startGame,
        handleCollisions,
        handleGameOver
    };

})(Breakout.graphics, Breakout.input);