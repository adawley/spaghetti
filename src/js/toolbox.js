var fs = require('fs'),
    csv = require('csv'),
    _ = require('lodash');

module.exports = {};

module.exports.csv = function(filename, fn) {

    var _data,
        steps = [];

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
    };

    this.step = function(fn) {
        steps.push(fn);
    };

    return this;
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
