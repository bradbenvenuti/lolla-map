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

            return {
                stage0 : stages[0].reverse(),
                stage1 : stages[1].reverse(),
                stage2 : stages[2].reverse(),
                stage3 : stages[3].reverse(),
                stage4 : stages[4].reverse(),
                stage5 : stages[5].reverse(),
                stage6 : stages[6].reverse(),
                stage7 : stages[7].reverse()
            };
        },
        checkCurrentTimes: function() {
            var self = this;
            var now = new Date();

            now.setHours(16);
            var min = now.getMinutes();
            var hour = now.getHours();
            var currMinutes = min + hour * 60;

            _.each(self.collection.models, function(model){
                var modelMinutesStart = (model.attributes.startHour * 60) + model.attributes.startMin;
                var modelMinutesEnd = (model.attributes.endHour * 60) + model.attributes.endMin;
                model.set({'current': false});
                if (model.attributes.fullDate === '2013-8-2'){
                    if ( currMinutes >= modelMinutesStart ){
                        if ( currMinutes <= modelMinutesEnd){

                            var minLeft =  modelMinutesEnd - currMinutes,
                            totalMinutes = modelMinutesEnd - modelMinutesStart,
                            percentage = 100 - ((minLeft / totalMinutes) * 100);

                            model.set({'current': true});
                            model.set({'minLeft': modelMinutesEnd - currMinutes });
                            model.set({'percentage': percentage});
                            model.set({'progressColor': percentage > 50 ? 'bad' : 'good' });
                            model.set({});
                            model.save();
                        }
                        else {
                            model.set({'passed': true});
                        }
                    }
                }
            });
        }
    });

    return ApplicationView;
});

    