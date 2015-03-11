angular.module('Audio5', []).service('AudioService', function() {
    "use strict";

    var params = {
        swf_path: '../../swf/audio5js.swf',
        throw_errors: true,
        format_time: true
    };

    var audio5js = [];

    return {
        new: function() {
            audio5js[audio5js.length] = new Audio5js(params);
            return audio5js[audio5js.length - 1];
        }
    };
});