Breakout.breakout = ((graphics)=>{
    'use strict';

    let bricks,
        paddle,
        paddles,
        numBricks = 14,
        ball;

    function init() {
        paddles = 3;
        bricks = [];

        paddle = graphics.Paddle({
            image: './assets/blue_brick.png',
            moveRate: 300,
            center: {x: graphics.canvas.width / 2, y: graphics.canvas.height - 20},
            width: 300,
            height: 20
        });

        ball = graphics.Ball({
            image: './assets/blue_ball.png',
            moveRate: 300,
            center:{x: graphics.canvas.width / 2, y: graphics.canvas.height / 2},
            width: 20,
            height: 20
        });

        for(let i = 0; i < 8; i++) {
            let color;
            let cols = [];

            switch(i) {
                case 0: case 1:
                    color = 'green';
                    break;
                case 2: case 3:
                    color = 'blue';
                    break;
                case 4: case 5:
                    color = 'orange';
                    break;
                case 6: case 7:
                    color = 'yellow';
                    break;
                default:
            }

            for(let j = 0; j < numBricks; j++) {
                cols[j] = graphics.Brick({
                    color,
                    center: {x:j, y:i},
                    width: graphics.canvas.width / numBricks,
                    height: 20
                });
            }
            bricks[i] = cols;
        }

        return {bricks, paddle, ball};
    }

    function update(specs) {

    }



    return {
        paddles,
        init,
        update
    };

})(Breakout.graphics);