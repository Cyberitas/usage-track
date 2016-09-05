var usagetrack;
(function (global, dom, $) {
   var config = {
         clickDefault: null,
         clickDefaultDom: dom
      },
      domConfig,
      aHandlers = {};

   if (!$) {
      throw "JQuery is required for usage-track."
   }

   domConfig = $('[data-usagetrack-config]').data('usagetrackConfig');
   if (typeof domConfig == 'object') {
      config = $.extend(config, domConfig);
   }

   if (config.clickDefaultDom) {
      $(config.clickDefaultDom).click(onClick);
   }
   
   aHandlers['ga-event'] = function(jEl, aData) {
      // TODO ensure oData[3] is an integer
      ga('send', 'event', aData[0], aData[1], aData[2], aData[3]);
   };

   function onClick(event) {
      var jEl = $(event.target),
        usage = jEl.data('usagetrack');
      if (typeof usage == 'object') {
         if (config.clickDefault) {
            handle(config.clickDefault, jEl, usage.data);
         }
      }
   }

   function handle(sHandler, jEl, aData) {
      var fHandler = aHandlers[sHandler];
      if (!fHandler) {
         throw "Cannot find handler ["+sHandler+"]";
      }
      fHandler(jEl, aData);
   }

   usagetrack = function() {
      console.log('called usage track');
   };
}(this, window, $));
