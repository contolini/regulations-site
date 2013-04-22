require(["jquery", "underscore", "backbone", "regs-data", "sample-json", "definition-view"], function($, _, Backbone, RegsData, JSONObj, DefinitionView) {

window.RegsViews = {
  openDefinitions: {}
}; 

  $(document).ready(function() {
    // template stub
    var template = function(b, p) {
      $('#' + p).append(b);
    };

    if (typeof JSONObj !== 'undefined') {
      // test data
      RegsData.parse(JSONObj); 

      /* 
       * EVENT BINDINGS 
       */

      // click term link, open definition
      $('.definition').on('click', function(e) {
        e.preventDefault();
        var defId = $(this).attr('data-definition');

        if (!RegsViews.openDefinitions[defId]) {
          RegsViews.openDefinitions[defId] = new DefinitionView({
            termId: defId,
            termLink: e.target
          });
        }
        else {
          RegsViews.openDefinitions[defId].remove();
          delete(RegsViews.openDefinitions[defId]);
        }

      });

      // test "V" links
      $('.expand').on('click', function(e) {
        e.preventDefault();
        var pid = $(this).parent().attr('id'),
            body = RegsData.retrieve(pid); 
        template(body, pid);

        $(this).remove();
      });
    }
  });
});
