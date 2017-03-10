Breakout.components = ((graphics)=>{
    'use strict';

    function Paddle(spec) {
        let that = {},
            image = new Image();

        that.width  = spec.width;
        that.height = spec.height;
        that.speed  = spec.speed;

        that.x     = spec.center.x;
        that.y     = spec.center.y;
        that.top   = spec.center.y - that.height / 2;
        that.left  = spec.center.x - that.width / 2;
        that.right = spec.center.x + that.width / 2;

        image.onload = ()=>{
            that.draw = ()=>{
                graphics.context.save();

                graphics.context.translate( that.x,  that.y);
                graphics.context.translate(-that.x, -that.y);

                graphics.context.drawImage(
                    image,
                    that.x - that.width / 2,
                    that.y - that.height / 2,
                    that.width, that.height);

                graphics.context.restore();
            };
        };

        image.src = spec.image;

        that.moveLeft = (elapsedTime)=>{
            that.x = (that.left <= 0) ? (that.width / 2) : (that.x - spec.speed * (elapsedTime / 1000));
            that.left  = that.x - that.width / 2;
            that.right = that.x + that.width / 2;
        };

        that.moveRight = (elapsedTime)=>{
            that.x = (that.right >= graphics.canvas.width) ? (graphics.canvas.width - that.width / 2) : (that.x + spec.speed * (elapsedTime / 1000));
            that.left  = that.x - that.width / 2;
            that.right = that.x + that.width / 2;
        };

        that.draw = ()=>{};

        return that;
    }

    function Ball(spec) {
        let that = {},
            image = new Image();

        that.radius = spec.width / 2;
        that.x  = spec.center.x;
        that.y  = spec.center.y;

        that.dx = spec.speed;
        that.dy = spec.speed;

        image.onload = ()=>{
            that.draw = ()=>{
                graphics.context.save();

                graphics.context.translate(that.x, that.y);
                graphics.context.translate(-that.x, -that.y);

                graphics.context.drawImage(
                        image,
                        that.x - spec.width/2,
                        that.y - spec.height/2,
                        spec.width, spec.height);

                graphics.context.restore();
            };
        };

        image.src = spec.image;

        that.draw = ()=>{};

        return that;
    }

    function Brick(spec) {
        let that = {},
            image = new Image(),
            points = 0,
            brick = './assets/' + spec.color + '_brick.png';

        that.points = spec.points;
        that.x = spec.block.x * spec.width + spec.width / 2;
        that.y = spec.block.y * spec.height + spec.height / 2;

        that.left   = that.x - spec.width / 2;
        that.right  = that.x + spec.width / 2;
        that.top    = (that.y - spec.height / 2) + spec.offset;
        that.bottom = (that.y + spec.height / 2) + spec.offset;

        image.onload = ()=>{
            that.draw = ()=>{
                graphics.context.save();

                graphics.context.drawImage(
                    image,
                    spec.block.x * spec.width,
                    spec.block.y * spec.height + spec.offset,
                    spec.width, spec.height);

                graphics.context.restore();
            };
        };

        image.src = brick;

        points = spec.points;

        that.draw = ()=>{};

        // that.remove = ()=>{
        //     console.log("particles");
        // };

        return that;
    }

    return {
        Paddle,
        Brick,
        Ball
    };
})(Breakout.graphics);