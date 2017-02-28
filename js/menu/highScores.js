Breakout.screens['high-scores'] = ((breakout)=>{
    'use strict';

    function run() {
        // console.log('high-scores');
        // I know this is empty, there isn't anything to do.
        let highScoreSection = document.getElementById("high-score-section");

        let color = 1;
        _.each(Breakout.scores, (score)=>{
            color = (color === 1) ? 0 : 1;
            highScoreSection += '<span class="color' + color + '">' + score.score + '</span>';
        });
    }

    return {
        run
    };
})(Breakout.breakout);