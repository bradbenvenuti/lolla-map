/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        localStorage: '../bower_components/backbone.localStorage/backbone.localStorage',
        mustache: '../bower_components/mustache/mustache',
        text: '../bower_components/requirejs-text/text'
    }
});

require([
    'backbone',
    'views/application-view',
    'collections/application-collection'
], function (Backbone, AppView, AppCollection) {
    Backbone.history.start();

    var view = new AppView({
        collection: new AppCollection()
    });

    $('body').html(view.render().$el);
});
