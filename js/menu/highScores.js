Breakout.screens['high-scores'] = ((breakout, persistence)=>{
    'use strict';

    function run() {
        // console.log('high-scores');
        // I know this is empty, there isn't anything to do.
        let highScoreSection = document.getElementById("high-score-section");
        persistence.report(highScoreSection);
    }

    return {
        run
    };
})(Breakout.breakout, Breakout.persistence);