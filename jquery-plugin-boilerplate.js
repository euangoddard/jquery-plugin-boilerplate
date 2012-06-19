(function ($) {
    'use strict';
    
    $.register = function (name, default_settings, definition) {
        if (name in $.fn) {
            $.error('There is already a plugin called "' + name + '".');
        }
        
        // When the definition is a function, make this into the "init" key in 
        // the prototype
        if ($.isFunction(definition)) {
            definition = {init: definition};
        }

        var Plugin = function (element, options) {
            // Store the a reference to the plugin on the element and vice-versa
            var existing_plugin_data = element.data('plugins') || {};
            existing_plugin_data[name] = this;
            element.data('plugins', existing_plugin_data);
            
            // Start up the plugin
            this.options = options;
            this.element = element;
            this.init.apply(this);
        };
        Plugin.prototype = $.extend({plugin_name: name}, definition);
        
        $.fn[name] = function (method) {
            var extra_arguments = Array.prototype.slice.call(arguments, 1);
            
            // Instantiate of the plugin
            if (typeof method === 'object' || ! method) {
                var options = $.extend({}, default_settings, method);
                
                return this.each(function () {
                    new Plugin($(this), options);
                });
            // Try to call the named method (if it exists)
            } else if (!(method in Plugin.prototype)) {
                $.error('Method ' +  method + ' does not exist on jQuery.' + name);
            } else {
                return this.each(function () {
                    var element = $(this);
                    var existing_plugin_data = element.data('plugins') || {};
                    
                    if (!(name in existing_plugin_data)) {
                        $.error('You must initiate the jQuery.' + name + ' before calling its methods');
                    }
                    
                    var plugin = existing_plugin_data[name];
                    plugin[method].apply(plugin, extra_arguments);
                });
            }
        };
    };
})(jQuery);
