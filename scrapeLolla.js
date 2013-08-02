//Scrape Lolla Lineup

var date = 4;
var year = 2013;
var month = 7;
var show = function (artist, stage, times, startTimes, endTimes) {
    this.artist = artist;
    this.stage = stage;
    this.startHour = function () { 
        var temp = parseInt(startTimes[0].trim(), 10);
        if (temp < 11) {
            temp = temp + 12;
        }
        return temp;
    }();
    this.startMin = parseInt(startTimes[1].trim(), 10);
    this.endHour = function () { 
        var temp = parseInt(endTimes[0].trim(), 10);
        if (temp < 11) {
            temp = temp + 12;
        }
        return temp;
    }();
    this.endMin = parseInt(endTimes[1].trim(), 10);
    this.minutesStart = (this.startHour * 60) + this.startMin;
    this.minutesEnd = (this.endHour * 60) + this.endMin;
    this.totalMinutes = this.minutesEnd - this.minutesStart;
    this.month = month;
    this.date = date;
    this.year = year;
    this.fullDate = year + '-' + (month + 1) + '-' + date;
};

var objects = [];
$('.ds-stage').each( function (i) {

    $(this).find('.ds-event-container').each( function(e) {
        var artist = $(this).find('a').text().trim();
        var stage = i;
        var times = $(this).find('.ds-time-range').text().split('-');
        var startTimes = times[0].split(':');
        var endTimes = times[1].split(':');
        var newShow = new show(artist, stage, times, startTimes, endTimes);
        objects.push(newShow);
    });
     
});
console.log(JSON.stringify(objects));

