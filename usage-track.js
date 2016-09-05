var usagetrack;
(function (global, dom, $) {
   var config = {
         clickDefault: null,
         clickDefaultDom: dom,
         clickDefaultConfig: {
            clickEvent: true
         }
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

   aHandlers['console'] = function(jEl, aData) {
      console.log('Usage Click Event:', aData);
   };

   function onClick(event) {
      var jEl = $(event.target),
        usage,
        usageData = [],
        aParents = jEl.parents().get().reverse();
      aParents.push(jEl.get(0));
      $.each(aParents, function() {
         var jParent = $(this),
            sGroup = jParent.data('usagetrackGroup'),
            parentUsage = jParent.data('usagetrack');
         if (sGroup) {
            if (typeof sGroup != 'string') {
               throw "Usage group must be a string";
            }
            usageData.push(sGroup);
         } else if (parentUsage) {
            if (typeof parentUsage == 'string') {
               usageData.push(parentUsage);
               if (!usage) {
                  usage = $.extend({}, config.clickDefaultConfig);
               }
               usage.clickEvent = config.clickDefaultConfig.clickEvent;
            } else if (typeof parentUsage === 'object') {
               if (!usage) {
                  usage = $.extend({}, config.clickDefaultConfig);
               }
               $.extend(usage, parentUsage);
               if (parentUsage.clickEvent !== false) {
                  usage.clickEvent = config.clickDefaultConfig.clickEvent;
               }
            }
         }
      });
      if (usage && usage.clickEvent) {
         if (config.clickDefault) {
            handle(config.clickDefault, jEl, usageData ? (usage.data ? $.merge(usageData, usage.data) : usageData) : usage.data);
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
