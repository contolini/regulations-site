define('definition-view', ['jquery', 'underscore', 'backbone', 'sidebar-module-view', 'reg-model', 'regs-helpers', './regs-router', 'main-events', 'sidebar-events', 'ga-events'], function($, _, Backbone, SidebarModuleView, RegModel, Helpers, Router, MainEvents, SidebarEvents, GAEvents) {
    'use strict';

    // **Constructor**
    // this.options:
    // 
    // * **id** string, dash-delimited id of definition paragraph
    // * **$anchor** jQobj, the reg-view link that opened the def
    //
    // this.options turns into this.model
    var DefinitionView = SidebarModuleView.extend({
        el: '#definition',

        events: {
            'click .close-button': 'close'
        },

        initialize: function() {
            this.externalEvents = SidebarEvents;

            if (typeof this.options.id !== 'undefined') {
                this.id = this.options.id;
            }

            // insert the spinner header to be replaced
            // by the full def once it loads
            this.renderHeader();

            // if pushState is supported, attach the
            // appropriate event handlers
            if (Router.hasPushState) {
                this.events['click .continue-link.interp'] = 'openInterpretation';
                this.events['click .continue-link'] = 'openFullDefinition';
                this.delegateEvents(this.events);
            }
        },

        // temporary header w/spinner while definition is loading
        renderHeader: function() {
            this.$el.html('<div class="sidebar-header group spinner"><h4>Defined Term</h4></div>');
        },

        render: function(html) {
            this.$el.html(html);
        },

        close: function(e) {
            e.preventDefault();
            // return focus to the definition link once the definition is removed
            $('.definition.active').focus();

            MainEvents.trigger('definition:close');
            GAEvents.trigger('definition:close', {
                type: 'definition',
                by: 'header close button'
            });
            this.remove();
        },

        openFullDefinition: function(e) {
            e.preventDefault();
            var id = this.id || $(e.target).data('linked-section'),
                parentId = Helpers.findBaseSection(id);

            MainEvents.trigger('section:open', parentId, {
                scrollToId: id
            }, 'reg-section'); 

            GAEvents.trigger('definition:followCitation', {
                id: id,
                type: 'definition'
            });
        },

        openInterpretation: function(e) {
            e.preventDefault();
            var $e = $(e.target),
                id = $e.data('linked-section'),
                pid = $e.data('linked-subsection');

            MainEvents.trigger('section:open', id, {
                scrollToId: pid
            });

            GAEvents.trigger('definition:followCitation', {
                id: id,
                type: 'definition'
            });
        },

        remove: function() {
            this.stopListening();
            this.$el.html('');
            
            return this;
        }
    });

    return DefinitionView;
});