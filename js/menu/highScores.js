Breakout.screens['high-scores'] = ((breakout)=>{
    'use strict';

    function run() {
        // console.log('high-scores');
        // I know this is empty, there isn't anything to do.
        let highScoreSection = document.getElementById("high-score-section");
        breakout.persistence.report(highScoreSection);
    }

    return {
        run
    };
})(Breakout.breakout);