Breakout.graphics = ((breakout)=>{
    'use strict';

    let canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');

    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    function clear() {
        context.clear();
    }

    function Paddle(spec) {
        let that = {},
            ready = false,
            image = new Image();

        image.onload = ()=>{
            ready = true;
        };

        image.src = spec.image;

        that.update = ()=>{
            //update
        };

        that.moveLeft = (elapsedTime)=>{
            spec.center.x -= spec.moveRate * (elapsedTime / 1000);
        };

        that.moveRight = (elapsedTime)=>{
            spec.center.x += spec.moveRate * (elapsedTime / 1000);
        };

        that.draw = ()=>{
            if(ready) {
                context.save();

                context.translate(spec.center.x, spec.center.y);
                context.translate(-spec.center.x, -spec.center.y);

                context.drawImage(
                    image,
                    spec.center.x - spec.width/2,
                    spec.center.y - spec.height/2,
                    spec.width, spec.height);

                context.restore();
            }
        };

        return that;
    }

    function updateBallPosition(spec) {

    }

    function Ball(spec) {
        let that = {},
            center = spec.center,
            radius = spec.radius,
            color = spec.color;

        that.update = ()=>{
            if (center.y + dy < center.radius) {
                // hit the top
                dy = -dy;
            } else if (center.y + dy > breakout.paddle.y) {
                // hit the bottom
                if (center.x > breakout.paddle.x && center.x < breakout.paddle.x + breakout.paddle.width) {
                    // within the paddles range
                    dy = -dy;
                }
            }

            if (center.y > canvas.height) {
                breakout.handleGameOver();
            }

            if (center.x + dx < center.radius || center.x + dx > canvas.width - radius) {
                // hit the left or right wall
                dx = -dx;
            }

            breakout.handleCollisions();

            center.x += dx;
            center.y += dy;
        };

        that.moveLeft = (elapsedTime)=>{
            center.x -= spec.speed * (elapsedTime / 1000);
        };

        that.moveRight = (elapsedTime)=>{
            center.x += spec.speed * (elapsedTime / 1000);
        };

        that.moveUp = (elapsedTime)=>{
            center.y -= spec.speed * (elapsedTime / 1000);
        };

        that.moveDown = (elapsedTime)=>{
            center.y += spec.speed * (elapsedTime / 1000);
        };

        that.draw = ()=>{
            context.save();

            context.translate(center.x, center.y);
            context.translate(-center.x, -center.y);

            context.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
            context.fillStyle = color;
            context.fill();

            context.restore();
        };

        return that;
    }

    function measureText(spec) {
        context.save();

        context.font = spec.font;
        context.fillStyle = spec.fill;
        context.strokeStyle = spec.stroke;

        let width = context.measureText(spec.text).width;
        let height = context.measureText('m').width;

        context.restore();

        return {width, height};
    }

    function Text(spec) {
        let that = {};

        that.textSize = measureText(spec);

        that.update = ()=>{

        };

        that.draw = ()=>{
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;
            context.textBaseline = 'top';

            context.fillText(spec.text, spec.position.x, spec.position.y);
            context.strokeText(spec.text, spec.position.x, spec.position.y);

            context.restore();
        };

        return that;
    }

    function drawBricks(bricks) {
        _.each(bricks, (row)=>{
            _.each(row, (brick)=>{
                brick.draw();
            });
        });
    }

    function Brick(spec) {
        let that = {},
            ready = false,
            image = new Image(),
            points = 0,
            brick = './assets/' + spec.color + '_brick.png';

        image.onload = ()=>{
            ready = true;
        };

        image.src = brick;

        points = spec.points;

        that.draw = ()=>{
            if(ready) {
                context.save();

                context.drawImage(
                    image,
                    spec.center.x*spec.width,
                    spec.center.y*spec.height + 50,
                    spec.width, spec.height);

                context.restore();
            }
        };

        return that;
    }

    return {
        canvas,
        clear,
        Paddle,
        drawBricks,
        Brick,
        updateBallPosition,
        Ball,
        Text
    };
})(Breakout.breakout);