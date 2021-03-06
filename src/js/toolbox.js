var fs = require('fs'),
    csv = require('csv'),
    _ = require('lodash');

module.exports = {};

module.exports.arrange = {
    byDate: function(err, data){
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
    }
};

module.exports.constants = {
    Month: {
        JANUARY:0,
        FEBRUARY:1,
        MARCH:2,
        APRIL:3,
        MAY:4,
        JUNE:5,
        JULY:6,
        AUGUST:7,
        SEPTEMBER:8,
        OCTOBER:9,
        NOVEMBER:10,
        DECEMBER:11
    },
    Side: {
        BUY:'b',
        SELL:'s'
    }
};

module.exports.csv = function(filename, fn) {

    var _data,
        steps = [],
        doneFn = function(){};

    switch (typeof fn) {

        case "function": // read
            process.nextTick(function() {
                dataRead(fn);
            });

            break;

        case "object": // write
            if (fn instanceof Array) {
                console.error("implement csv save");
            }
            break;

        case "undefined": // defer
            process.nextTick(function() {
                dataRead();
            });
            break;
    }

    var dataRead = function(fn) {
        fn = fn || function() {};

        var parser = csv.parse({
            delimiter: ','
        }, function(err, data) {
            fn(err, data);
            _data = data;

            process.nextTick(dataDone);
        });

        fs.createReadStream(filename).pipe(parser);
    };

    var dataDone = function() {
        steps.forEach(function(fn) {
            _data.forEach(function(row) {
                fn.apply(null, row);
            });
        });

        doneFn();
    };

    this.step = function(fn) {
        steps.push(fn);

        return this;
    };

    this.done = function(fn){
        doneFn = fn;
    };

    return this;
};

module.exports.date = function(dateStr){
    var d = new Date(dateStr);
    this.month = d.getUTCMonth();
    this.day = d.getUTCDate();
    this.year = d.getFullYear();

    return this;
};

module.exports.view = {
    table: function(arr){
        console.log(Object.keys(arr[0]));
        arr.forEach(function(row){
            console.log(_.values(row));
        });

    }
};

// Source: https://github.com/Cloud9Trader/TechnicalIndicators/blob/master/ema.src.js
module.exports.ema = function() {
    var exponent,
        EMA;

    function getRunUpCount(periods) {
        return periods * 2;
    }

    function getBufferSize(periods) {
        return periods;
    }

    function validate(periods) {
        if (typeof periods !== "number") {
            error("EMA periods must be a number");
        }
        if (periods % 1 !== 0) {
            error("EMA periods must be an integer");
        }
        if (periods > 200) {
            error("EMA maximum periods is 200");
        }
        if (periods <= 0) {
            error("EMA periods must be greater than 0");
        }
    }

    function onStart(periods) {
        exponent = 2 / (periods + 1);
    }

    function onIntervalClose(periods) {

        if (EMA === undefined) {
            EMA = Math.average(prices(periods));
        } else {
            EMA = ((CLOSE - EMA) * exponent) + EMA;
        }
        return EMA;
    }
};
