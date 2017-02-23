Breakout.graphics = (()=>{
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
            if (ready) {
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

    function Ball(spec) {
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

        that.moveUp = (elapsedTime)=>{
            spec.center.y -= spec.moveRate * (elapsedTime / 1000);
        };

        that.moveDown = (elapsedTime)=>{
            spec.center.y += spec.moveRate * (elapsedTime / 1000);
        };

        that.draw = ()=>{
            if (ready) {
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
            brick = './assets/' + spec.color + '_brick.png';

        image.onload = ()=>{
            ready = true;
        };

        image.src = brick;

        that.draw = ()=>{
            if (ready) {
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
        Ball
    };
})();