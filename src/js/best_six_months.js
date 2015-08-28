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

var Side  = {
    BUY:'b',
    SELL:'s'
};

var Order = function(symbol, date, side, price, qty){
    this.symbol = symbol;
    this.side = side;
    this.price = price;
    this.qyt = qty;
    this.date = date;
    var mStatus = 'filled';

    this.updateStatus = function(status){
        mStatus = status;
    };
};

var trades = [];
var positions = [];
var inPosition = false;

tb
.csv(__dirname + '/../../test_data/dji.csv', realize)
.step(function(date, open, high, low, close, volume, adj_close) {
    var d = new Date(date);
    if(d.getMonth() === 9 && inPosition === false){
        trades.push(new Order('dji', date, Side.BUY, close, 100));
        inPosition = true;
    } else if(d.getMonth() == 4 && inPosition === true){
        trades.push(new Order('dji', date, Side.SELL, close, 100));
        inPosition = false;
    }
})
.done(function(){

    trades.forEach(function(trade){
        if(trade.side === Side.BUY){
            positions.push({entry:trade.price, qty:trade.qty});
        } else if(trade.side === Side.SELL){
            position = positions.pop();
            position.exit = trade.price;
            position.pnl = position.exit - position.entry;
            positions.push(position);
        }
    });

    tb.view.table(positions);
});
