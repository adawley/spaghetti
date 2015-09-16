var tb = require("./toolbox"),
    self = this;

var Side  = tb.constants.Side,
    Month = tb.constants.Month;

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
var symbol = 'dji';
var filepath = [__dirname,'/../../test_data/',symbol,'.csv'].join('');

tb
.csv(filepath, tb.arrange.byDate)
.step(function(date, open, high, low, close, volume, adj_close) {

    var d = new Date(date);

    if(d.getMonth() === Month.OCTOBER && !inPosition){
        trades.push(new Order(symbol, date, Side.BUY, close, 100));
        inPosition = true;

    } else if(d.getMonth() === Month.MAY && inPosition){
        trades.push(new Order(symbol, date, Side.SELL, close, 100));
        inPosition = false;
    }
})
.done(function(){

    trades.forEach(function(trade){
        if(trade.side === Side.BUY){
            positions.push({buyDate: trade.date, entry:trade.price, qty:trade.qty});
        } else if(trade.side === Side.SELL){
            position = positions.pop();
            position.sellDate = trade.date;
            position.exit = trade.price;
            position.pnl = position.exit - position.entry;
            positions.push(position);
        }
    });

    tb.view.table(positions);
});
