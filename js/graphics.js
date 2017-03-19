Breakout.graphics = (()=>{
    'use strict';

    let canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');

    CanvasRenderingContext2D.prototype.Clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    function Clear() {
        context.Clear();
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

    function DrawTextures(spec) {
        context.save();

        context.translate(spec.center.x, spec.center.y);
        context.rotate(spec.rotation);
        context.translate(-spec.center.x, -spec.center.y);

        context.drawImage(
            spec.image,
            spec.center.x - spec.size/2,
            spec.center.y - spec.size/2,
            spec.size, spec.size);

        context.restore();
    }

    function DrawBricks(bricks) {
        _.each(bricks, (row)=>{
            _.each(row.bricks, (brick)=>{
                if(brick){
                    brick.draw();
                }
            });
        });
    }

    function DrawBalls(balls) {
        _.each(balls, (ball)=>{
            ball.draw();
        });
    }

    function DrawParticles(particles) {
        _.each(particles, (particle)=>{
            particle.draw();
        });
    }

    return {
        canvas,
        context,
        Clear,
        Text,
        DrawTextures,
        DrawBricks,
        DrawBalls,
        DrawParticles
    };
})();