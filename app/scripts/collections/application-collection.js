/*global define*/

define([
    'underscore',
    'backbone',
    'models/application-model'
], function (_, Backbone, ApplicationModel) {
    'use strict';

    var ApplicationCollection = Backbone.Collection.extend({
        url: 'data/shows.json',
        model: ApplicationModel
    });

    return ApplicationCollection;
});