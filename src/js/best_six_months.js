var tb = require("./toolbox"),
    self = this;

var realize = function(err, data) {

    // remove header row, if there is one
    if (data[0][0] === "Date") {
        data.shift();
    }

    // make sure the dates go from oldest to newest
    var date1 = new Date(data[0][0]),
        date2 = new Date(data[1][0]);

    if (date1 > date2) {
        data.reverse();
    }

};

tb.csv(__dirname + '/dji.csv', realize)
.step(function(date, open, high, low, close, volume, adj_close) {
    // console.log(date);
});

function wrapper(){
    // bind(this, tb.ema);
    var ema = new tb.ema();//.onIntervalClose();

    ema.prototype.onIntervalClose();

}

wrapper();
