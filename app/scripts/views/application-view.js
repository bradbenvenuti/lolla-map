/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'mustache',
    'text!templates/application.html',
    'localStorage'
], function ($, _, Backbone, mustache, template, BackboneLocalStorage) {
    'use strict';
    
    var ApplicationView = Backbone.View.extend({

        initialize: function() {
            var self = this;

            this.collection.fetch().done(function() {
                self.collection.localStorage = new BackboneLocalStorage('LocalStorageShows');
                self.render();
                self.runLoop();
            });

            this.collection.on('change', function(){
                self.render();
            });
        },
        render: function () {
            var self = this;
            var currentCount = this.getActiveShowCount();
            this.$el.html(mustache.to_html(template, self.serialize()));
            console.log(self.serialize());
            return this;
        },
        runLoop: function() {
            var self = this;
            self.checkCurrentTimes();
            setInterval(function () {
                self.checkCurrentTimes();
            }, 1000 * 30);
        },
        serialize: function() {
            var stages = [];
            for (var i = 0; i <= 7; i++) {
                stages[i] = _.filter(this.collection.models, function(model){
                    return model.attributes.stage === i;
                });
            }
            var currentShows = this.getActiveShowCount();
            return {
                stage0 : stages[0].reverse(),
                stage1 : stages[1].reverse(),
                stage2 : stages[2].reverse(),
                stage3 : stages[3].reverse(),
                stage4 : stages[4].reverse(),
                stage5 : stages[5].reverse(),
                stage6 : stages[6].reverse(),
                stage7 : stages[7].reverse(),
                currentShows : currentShows
            };
        },
        checkCurrentTimes: function() {
            var self = this;
            var now = new Date();
            var min = now.getMinutes();
            var hour = now.getHours();
            var currMinutes = min + (hour * 60);
            console.log(hour);

            var nowFullDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

            _.each(self.collection.models, function(model){
                model.set({'passed': false});
                model.set({'current': false});
                if ( model.attributes.fullDate === nowFullDate ){
                    if ( currMinutes >= model.attributes.minutesStart ){
                        if ( currMinutes < model.attributes.minutesEnd ){
                            
                            var minLeft =  model.attributes.minutesEnd - currMinutes,
                            percentage = 100 - ((minLeft / model.attributes.totalMinutes) * 100);

                            model.set({'current': true});
                            model.set({'minLeft': minLeft });
                            model.set({'percentage': percentage});
                            model.set({'progressColor': percentage > 50 ? 'bad' : 'good' });
                            model.set({});
                            model.save();
                        }
                        else {
                            model.set({'passed': true});
                        }
                    }
                } else {
                    model.set({'passed': true});
                }
            });
        },
        getActiveShowCount: function () {
            var currentShows = _.filter(this.collection.models, function (model) {
                return model.attributes.current;
            });

            return currentShows.length;
        }
    });

    return ApplicationView;
});

    