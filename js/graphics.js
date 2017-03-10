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

    function drawBricks(bricks) {
        _.each(bricks, (row)=>{
            _.each(row, (brick)=>{
                if(brick){
                    brick.draw();
                }
            });
        });
    }

    return {
        canvas,
        context,
        clear,
        drawBricks,
        Text
    };
})();