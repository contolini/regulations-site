define("regs-router",["underscore","backbone","dispatch","queryparams"],function(e,t,n){var r=t.Router.extend({routes:{":section/:version":"backToSection","search/:reg":"backToSearchResults"},backToSection:function(e){n.trigger("regSection:open",e,{id:e},"regSection"),n.trigger("sxs:close")},backToSearchResults:function(e,t){var r={query:t.q,version:t.version};typeof t.page!="undefined"&&(r.page=t.page),n.trigger("search:submitted",r,"searchResults")},start:function(){var e=n.getURLPrefix()||"/";t.history.start({pushState:"pushState"in window.history,silent:!0,root:e})}});typeof window.history=="undefined"&&typeof window.history.pushState=="undefined"&&(r=function(){this.start=function(){},this.navigate=function(){}});var i=new r;return i});