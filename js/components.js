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

    function TopBar(spec) {
        let that = {};

        that.score = spec.score;
        that.paddles = spec.paddles;

        that.draw = ()=>{

            graphics.context.save();

            // create topBar background
            graphics.context.fillStyle = spec.fillColor;
            graphics.context.fillRect(0, 0, spec.width, spec.height);

            // paddle section
            let length = 0;
            graphics.context.fillStyle = spec.color;

            for(let i = 1; i < that.paddles + 1; i++) {
                length += (spec.paddleW + (spec.paddleW * i) + (i * 10));
                graphics.context.fillRect(spec.width - (spec.paddleW + (spec.paddleW * i) + (i * 10)), 10, spec.paddleW, spec.paddleH);
            }

            graphics.Text({
                text: 'Paddles: ',
                font: '12px Arial, sans-serif',
                fill: 'rgba(150, 0, 0, 1)',
                stroke: spec.color,
                position: {x: spec.width - 200, y: 5}
            }).draw();

            graphics.context.restore();

            // score section
            graphics.Text({
                text: 'Score: ' + that.score,
                font: '12px Arial, sans-serif',
                fill: 'rgba(150, 0, 0, 1)',
                stroke: spec.color,
                position: {x: 10, y: 5}
            }).draw();
        };

        return that;
    }

    function CountDown(spec) {
        let that = {};

        that.number = spec.number;

        that.draw = ()=>{
            graphics.context.save();


            graphics.context.restore();
        };

        return that;
    }

    return {
        Paddle,
        Brick,
        Ball,
        TopBar,
        CountDown
    };
})(Breakout.graphics);