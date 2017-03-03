Breakout.breakout = ((graphics, input)=>{
    'use strict';

    let bricks,
        paddle,
        paddles,
        ball,
        text,
        isActive,
        isStart = false,
        numBricks = 14;

    function init(spec) {
        paddles = 3;
        bricks = [];
        isActive = false;

        paddle = graphics.Paddle({
            image: './assets/blue_brick.png',
            moveRate: 300,
            center: {x: graphics.canvas.width / 2, y: graphics.canvas.height - 20},
            width: 300,
            height: 20
        });

        ball = graphics.Ball({
            image: './assets/blue_ball.png',
            speed: 300,
            direction: 0,
            radius: 10,
            center:{x: graphics.canvas.width / 2, y: graphics.canvas.height / 2},
            width: 20, height: 20
        });

        text = graphics.Text({
            text: '',
            font: '32px Arial, sans-serif',
            fill: 'rgba(150, 0, 0, 1)',
            stroke: 'rgba(255,0,0,1)',
            position: {x: 100,y: 100}
        });

        for (let i = 0; i < 8; i++) {
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

            for (let j = 0; j < numBricks; j++) {
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
        if (paddles <= 0) {
            alert("Game Over");
            input.cancelNextRequest = true;
            input.showScreen('main-menu');

        } else {
            paddles--;
        }

        input.showScreen('game-play');
    }

    function handleCollisions() {

    }

    let persistence = (()=>{
        let highScores = {},
            previousScores = localStorage.getItem('Breakout.highScores');

        if (previousScores !== null) {
            highScores = JSON.parse(previousScores);
        }

        function add(key, value) {
            highScores[key] = value;
            localStorage['Breakout.highScores'] = JSON.stringify(highScores);
        }

        function remove(key) {
            delete highScores[key];
            localStorage['Breakout.highScores'] = JSON.stringify(highScores);
        }

        function report(htmlNode) {
            htmlNode.innerHTML = '';
            let color = 1;
            _.each(highScores, (score, key)=>{
                color = (color === 1) ? 0 : 1;
                htmlNode.innerHTML += ('<span class="color' + color + '"><div>' + key + '</div><div>' + score + '</div></span>');
            });
            htmlNode.scrollTop = htmlNode.scrollHeight;
        }

        return {
            add,
            remove,
            report
        };
    })();

    function startGame() {
        ball.isStart = true;
    }

    function addValue() {
        persistence.add('1'/*document.getElementById('id-key').value*/, '1234'/*document.getElementById('id-value').value*/);

        // persistence.report();
    }

    function removeValue() {
        persistence.remove('1'/*document.getElementById('id-key').value*/);
        // persistence.report();
    }

    return {
        paddles,
        isStart,
        init,
        startGame,
        persistence,
        handleCollisions,
        handleGameOver,
        addValue,
        removeValue
    };

})(Breakout.graphics, Breakout.input);