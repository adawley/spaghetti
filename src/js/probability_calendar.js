var tb = require('./toolbox');
var _ = require('lodash');
var mdarr = []; // month-day array
var yarr = {}; // year array
var thisYearsDates = [];
var prevYear = 0,
    indx = 0;
var organizeMonthDay = function(date, open, high, low, close, volume, adj_close) {

        var d = tb.date(date),
            month = d.month,
            day = d.day,
            year = d.year;

        if (year >= 1993 && year <= 2013) {
            mdarr[month] = mdarr[month] || {};
            mdarr[month][day] = mdarr[month][day] || {
                diffs: []
            };

            mdarr[month][day].diffs.push(close - open);
        }
    },
    printMonthDay = function() {
        _.each(mdarr, function(monthData, month) {
            _.each(monthData, function(dayData, day) {

                var maps = _.map(dayData.diffs, function(diff) {
                        if (diff > 0) {
                            return 1;
                        }
                        return 0;
                    }),
                    percentWin = _.sum(maps) / maps.length;

                console.log(_.pad(month, 2), _.pad(day, 2), _.round(percentWin * 100, 2));
            });
        });
        var fd = _(firstDays).map(function(diff) {
            return diff > 0 ? 1 : 0;
        }).sum() / firstDays.length;
        console.log('first day %', fd);
    };
var organizeTradeDay = function(date, open, high, low, close, volume, adj_close) {

        var d = tb.date(date),
            month = d.month,
            day = d.day,
            year = d.year;

        if (year >= 1993 && year <= 2013) {
            indx++;
            if (prevYear != year) {
                indx = 0;
                prevYear = year;
            }
            yarr[indx] = yarr[indx] || [];
            yarr[indx].push((close - open) > 0 ? 1 : 0);
        }
        if(year === 2015){
            thisYearsDates.push(date);
        }
    },
    printTradeDay = function() {
        var vals = _.map(yarr, function(yuh){
            return _.sum(yuh)/yuh.length;
        });

        _.each(thisYearsDates, function(date, dayOfYear){
            console.log(date, _.round(vals[dayOfYear]*100,1) );
        });

    };

tb
    .csv(__dirname + '/../../test_data/dji.csv', tb.arrange.byDate)
    .step(organizeTradeDay)
    .done(printTradeDay);
