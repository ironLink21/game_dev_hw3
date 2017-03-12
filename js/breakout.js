Breakout.breakout = ((graphics, input, components)=>{
    'use strict';

    let bricks,
        brokenBricks,
        paddle,
        paddles,
        ball,
        text,
        isActive,
        isStart = false,
        numBricks = 14,
        offset = 50,
        score,
        topBar,
        speed;

    function init(spec) {
        paddles = 3;
        bricks = [];
        isActive = false;
        brokenBricks = 0;
        score = 0;
        speed = 2;

        paddle = components.Paddle({
            image: './assets/blue_brick.png',
            speed: 600,
            center: { x: graphics.canvas.width / 2, y: graphics.canvas.height - 20 },
            width: 300,
            height: 20
        });

        ball = components.Ball({
            speed,
            image: './assets/blue_ball.png',
            direction: 0,
            center:{ x: graphics.canvas.width / 2, y: graphics.canvas.height / 2 },
            width: 20, height: 20
        });

        text = graphics.Text({
            text: '',
            font: '32px Arial, sans-serif',
            fill: 'rgba(150, 0, 0, 1)',
            stroke: 'rgba(255,0,0,1)',
            position: {x: 100,y: 100}
        });

        topBar = components.TopBar({
            width: graphics.canvas.width,
            height: offset / 2,
            fillColor: 'rgba(224, 224, 235, 1)',
            paddleW: 30,
            paddleH: 5,
            score,
            paddles,
            color: '#4169E1',
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
                cols[j] = components.Brick({
                    color,
                    points,
                    offset,
                    block: {x:j, y:i},
                    width: graphics.canvas.width / numBricks,
                    height: 20
                });
            }
            bricks[i] = cols;
        }

        input.showScreen('main-menu');

        spec.keyBoard.registerCommand(KeyEvent.DOM_VK_LEFT, paddle.moveLeft);
        spec.keyBoard.registerCommand(KeyEvent.DOM_VK_RIGHT, paddle.moveRight);

        return {
            bricks,
            paddle,
            ball,
            isActive,
            score,
            topBar
        };
    }

    function handleGameOver() {
        if (paddles <= 0) {
            input.cancelNextRequest = true;
            input.showScreen('main-menu');

        } else {
            paddles--;
            topBar.paddles = paddles;

            ball = components.Ball({
                speed,
                image: './assets/blue_ball.png',
                direction: 0,
                center:{ x: graphics.canvas.width / 2, y: graphics.canvas.height / 2 },
                width: 20, height: 20
            });

            // input.showScreen('game-play');
        }
    }

    function checkCollision() {

        // bounce off left/right
        if(ball.x + ball.dx > graphics.canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
            ball.dx = -ball.dx;
        }

        // bounce off paddle
        if(ball.x > paddle.left && ball.x < paddle.right && ball.y + ball.dy > paddle.top - ball.radius) {
            ball.dy = -ball.dy;
        }

        // bound off top
        if((ball.y + ball.dy - offset / 2) < ball.radius) {
            ball.dy = -ball.dy;

        } else if(ball.y + ball.dy > graphics.canvas.height - ball.radius) {
            // ball hits bottom
            // document.location.reload();
            handleGameOver();
        }

        _.each(bricks, (row)=>{
            _.each(row, (brick)=>{
                if(brick) {
                    let ballX = ball.x - ball.radius;
                    let ballY = ball.y - ball.radius;
                    if(ballX > brick.left && ballX < brick.right &&
                    ballY < brick.bottom && ballY > brick.top) {
                        ball.dy = -ball.dy;
                        brick.remove = true;
                        score += brick.points;
                        brokenBricks += 1;
                        // brick.remove();
                    }
                }
            });
        });

        topBar.score = score;

        handleCollisions();

        ball.x += ball.dx;
        ball.y += ball.dy;
    }

    function handleCollisions() {
        _.each(bricks, (row, y)=>{
            _.each(row, (brick, x)=>{
                if(brick && brick.remove) {
                    delete bricks[y][x];
                }
            });
        });
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
        paddle,
        paddles,
        isStart,
        init,
        startGame,
        persistence,
        handleGameOver,
        addValue,
        removeValue,
        checkCollision
    };

})(Breakout.graphics, Breakout.input, Breakout.components);