Breakout.screens['high-scores'] = ((input)=>{
    'use strict';

    function run() {
        // console.log('high-scores');
        // I know this is empty, there isn't anything to do.
        let highScoreSection = document.getElementById("high-score-section");
        input.persistence.report(highScoreSection);
    }

    return {
        run
    };
})(Breakout.input);