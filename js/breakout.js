Breakout.breakout = ((screens, graphics, input, components)=>{
    'use strict';

    let NUMBRICKS = 14,
        OFFSET = 50;

// ******** storage section
    let persistence = (()=>{
        let highScores = {},
            previousScores = localStorage.getItem('Breakout.highScores');

        if (previousScores !== null) {
            highScores = JSON.parse(previousScores);
        }

        function add(name, score) {
            highScores[name] = score;
            localStorage['Breakout.highScores'] = JSON.stringify(highScores);
        }

        function remove(key) {
            delete highScores[key];
            localStorage['Breakout.highScores'] = JSON.stringify(highScores);
        }

        function report(htmlNode) {
            htmlNode.innerHTML = '';
            let highScoresTable = '',
                line = 1,
                rank = 0;

            highScoresTable =  '<table align="center" border="2" cellpadding="5" width="500">' +                                '<thead style="background-color: #FFF">' +
                                    '<th>Rank</th>'+
                                    '<th>Name</th>'+
                                    '<th>Score</th>'+
                                  '</thead>'+
                                  '<tbody>';

            var highScoresObj = _.map(highScores, (score, name)=>{
                return {name, score};
            });

            let sortedHighScores = _.sortBy(highScoresObj, 'score').reverse();

            _.each(sortedHighScores, (obj)=>{
                line = (line === 1) ? 0 : 1;
                let color = (line === 1) ? "#808080" : "#4169E1";
                ++rank;

                highScoresTable += '<tr align="center" style="background-color: ' + color + '">' +
                                     '<td>' + rank + '</td>' +
                                     '<td>' + obj.name + '</td>' +
                                     '<td>' + obj.score + '</td>' +
                                   '</tr>';
            });

            highScoresTable +=    '</tbody>' +
                                '</table>';

            htmlNode.innerHTML = highScoresTable;
        }

        return {
            add,
            remove,
            report
        };
    })();
// ******** storage section -- end

// ******** game state functions
    function Create(spec) {
        let that = {},
            isRestart = false,
            isShrinkPaddle = false,
            count = 4,
            didSetSpeed = 0,
            countDownText = '',
            countDownElapsed = 0,
            particleElapsed = 0;

        that.isActive = false;
        that.isPaused = false;
        that.bricks = [];
        that.balls = [];
        that.particles = [];

        that.score = spec.score;
        that.speed = spec.ballSpeed;
        that.paddles = spec.paddles;
        that.brokenBricks = spec.brokenBricks;

        if(spec.isRestart) {
            isRestart = spec.isRestart;
        }

        that.paddle = components.Paddle({
            image: './assets/blue_brick.png',
            speed: 600,
            center: { x: graphics.canvas.width / 2, y: graphics.canvas.height - 20},
            width: 300,
            height: 20
        });

        if(!isRestart){
            let ball = components.Ball({
                speed: that.speed,
                image: './assets/blue_ball.png',
                direction: 0,
                center:{ x: that.paddle.x, y: graphics.canvas.height - 40},
                width: 20, height: 20
            });
            that.balls.push(ball);

        } else {
            that.balls = spec.balls;
            that.balls[0].resetCenter({ x: that.paddle.x, y: graphics.canvas.height - 40});
        }

        that.topBar = components.TopBar({
            width: graphics.canvas.width,
            height: OFFSET / 2,
            fillColor: 'rgba(224, 224, 235, 1)',
            paddleW: 30,
            paddleH: 5,
            score: that.score,
            paddles: that.paddles,
            color: '#4169E1',
        });

        if(!isRestart) {
            for (let i = 0; i < 8; i++) {
                let color,
                    points,
                    cols = {isGiven: false, bricks:[]};

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

                for (let j = 0; j < NUMBRICKS; j++) {
                    cols.bricks[j] = components.Brick({
                        color,
                        points,
                        OFFSET,
                        block: {x:j, y:i},
                        width: graphics.canvas.width / NUMBRICKS,
                        height: 20
                    });
                }
                that.bricks[i] = cols;
            }
        } else {
            that.bricks = spec.bricks;
        }

        that.StartGame = ()=>{
            that.isPaused = false;
            that.balls[0].isStart = true;
        };

        function pauseGame() {
            that.isPaused = true;
            document.getElementById('paused-section').style.display = 'block';
            document.getElementById('background-shield').style.display = 'block';
        }

        that.HandleGameOver = ()=>{
            if (that.paddles === 0) {
                input.cancelNextRequest = true;

            } else {
                that.paddles--;
                input.cancelNextRequest = true;
            }

            return {
                score: that.score,
                speed: that.speed,
                paddles: that.paddles,
                bricks: that.bricks,
                balls: that.balls
            };
        };

        that.Countdown = (elapsedTime)=>{
            let countDown = null;

            countDownElapsed += elapsedTime;

            if(countDownElapsed >= 1000 && !that.isActive) {
                countDownElapsed = 0;
                count--;
                countDownText = (count !== 0) ? count : 'GO!';
            }

            countDown = graphics.Text({
                text: countDownText,
                font: '64px Arial, sans-serif',
                fill: 'rgba(150, 0, 0, 1)',
                stroke: 'rgba(255,0,0,1)',
                position: {x: graphics.canvas.width / 2, y: graphics.canvas.height / 2}
            });

            if(count < 0) {
                count = 3;
                countDownText = '';
                countDownElapsed = 0;
                that.isActive = true;
                countDown = null;
            }

            return {
                countDown,
                isActive: that.isActive
            };
        };

        function handleCollisions() {
            _.each(that.bricks, (row, y)=>{
                _.each(row.bricks, (brick, x)=>{
                    if(brick && brick.remove) {
                        let particlesFire = ParticleSystem({
                            image : './assets/fire.png',
                            center: {x: brick.x, y: brick.y + 50},
                            speed: {mean: 15, stdev: 7},
                            lifetime: {mean: 2, stdev: 1}
                        }, graphics);

                        that.particles.push({time: 2, obj:particlesFire});

                        that.bricks[y].bricks.splice(x,1);
                    }
                });
            });

            _.each(that.bricks, (row, i)=>{
                if(!row.isGiven && row.bricks.length === 0) {
                    row.isGiven = true;
                    that.score += 25;
                }

                if(!isShrinkPaddle && i === 0 && row.bricks.length === NUMBRICKS - 1) {
                    isShrinkPaddle = true;
                    that.paddle.width = that.paddle.width / 2;
                }
            });
        }

        function updateSpeed(spec) {
            if(didSetSpeed !== spec.num) {
                didSetSpeed = spec.num;

                _.each(that.balls, (ball)=>{
                    ball.updateSpeed(spec.speed);
                });
            }
        }
// ******** game state functions -- end

// ******** check functions
        that.checkParticles = (elapsedTime)=>{
            particleElapsed += elapsedTime;

            if(particleElapsed >= 500) {
                particleElapsed = 0;

                _.each(that.particles, (particle, i)=>{
                    if(particle) {
                        if(particle.time <= 0) {
                            that.particles.splice(i,1);
                        } else {
                            particle.time -= 1;
                        }
                    }
                });
            }
        };

        that.CheckBrokenBricks = (elapsedTime)=>{
            switch(that.brokenBricks) {
                case 4:
                    updateSpeed({elapsedTime, num: 4, speed: 230});
                    break;
                case 12:
                    updateSpeed({elapsedTime, num: 12, speed: 240});
                    break;
                case 36:
                    updateSpeed({elapsedTime, num: 36, speed: 250});
                    break;
                case 62:
                    updateSpeed({elapsedTime, num: 62, speed: 300});
                    break;
                default:
            }
        };

        that.CheckPoints = ()=>{
            switch(that.score) {
                case 100:
                    // updateSpeed({num: 100, speed: 1});
                    break;
                default:
            }
        };

        that.CheckCollision = ()=>{
            let paddle = that.paddle;

            _.each(that.balls, (ball)=>{
                // bounce off left/right
                if(ball.x > graphics.canvas.width - ball.radius || ball.x < ball.radius) {
                    ball.dx = -ball.dx;
                }

                // paddle collision
                if(ball.y > paddle.top - ball.radius) {

                    // left
                    if(ball.x > paddle.left && ball.x < paddle.x - paddle.centerSection) {
                        ball.dy = -ball.dy;
                        // ball.dx = -(ball.x - paddle.x) / (paddle.width / 2);
                    }

                    // center
                    if(ball.x > paddle.x - paddle.centerSection && ball.x < paddle.x + paddle.centerSection) {
                        ball.dy = -ball.dy;
                    }

                    // right
                    if(ball.x > paddle.x + paddle.centerSection && ball.x < paddle.right) {
                        ball.dy = -ball.dy;
                        // ball.dx = -(ball.x - paddle.x) / (paddle.width / 2);
                    }
                }

                // bound off top
                if((ball.y - OFFSET / 2) < ball.radius) {
                    ball.dy = -ball.dy;

                } else if(ball.y > graphics.canvas.height - ball.radius) {
                    // ball hits bottom
                    isRestart = true;
                    input.cancelNextRequest = true;
                }

                _.each(that.bricks, (row)=>{
                    _.each(row.bricks, (brick)=>{
                        if(brick) {
                            let ballX = ball.x - ball.radius;
                            let ballY = ball.y - ball.radius;
                            if(ballX > brick.left && ballX < brick.right &&
                            ballY < brick.bottom && ballY > brick.top) {
                                ball.dy = -ball.dy;
                                brick.remove = true;
                                that.score += brick.points;
                                that.brokenBricks += 1;
                            }
                        }
                    });
                });

                that.topBar.score = that.score;

                handleCollisions();
            });

            return isRestart;
        };
// ******** check functions -- end

// ******** storage functions
        that.addValue = ()=>{
            let name = document.getElementById('name-field').value;
            persistence.add(name, that.score);
        };

        that.removeValue = (name)=>{
            persistence.remove(name);
        };
// ******** storage functions -- end

        spec.keyBoard.registerCommand(KeyEvent.DOM_VK_LEFT, that.paddle.moveLeft);
        spec.keyBoard.registerCommand(KeyEvent.DOM_VK_RIGHT, that.paddle.moveRight);
        spec.keyBoard.registerCommand(KeyEvent.DOM_VK_ESCAPE, pauseGame);

        input.ShowScreen('main-menu');

        return that;
    }

    return {
        persistence,
        Create
    };

})(Breakout.screens, Breakout.graphics, Breakout.input, Breakout.components);