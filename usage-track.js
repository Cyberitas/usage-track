/**
 * @license usage-track 0.0.4 Copyright Cyberitas Technologies LLC
 * Released under MIT license
 * 
 * Documentation and usage https://github.com/Cyberitas/usage-track
 */

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
   
   /**
    * Takes a given element, creates a list of all parents including itself in the DOM, 
    * then looks for the usagetrack or usagetrack-group data parameters and merges them
    */
   function onClick(event) {
      // TODO fix the way this inherits data from parents, integrate with filters and handlers, extract DOM traversal
      var jEl = $(event.target),
        usage = $.extend({}, config.clickDefaultConfig),
        aParents = jEl.parents().get().reverse();

      usage['__combinedData'] = [];
      
      aParents.push(jEl.get(0));

      $.each(aParents, function() {
         var jParent = $(this),
            sGroup = jParent.data('usagetrackGroup'),
            sClick = jParent.data('usagetrackClick'),
            parentUsage = jParent.data('usagetrack');

         if (sGroup) {
            if (typeof sGroup != 'string') {
               throw "Usage group must be a string";
            }
            usage['__combinedData'].push(sGroup);
         } else if (sClick) {
            if (typeof sClick != 'string') {
               throw "Usage click must be a string";
            }
            usage['__combinedData'].push(sClick);
            usage.clickEvent = config.clickDefaultConfig.clickEvent;
            if (usage.clickEvent) {
               if (config.clickDefault) {
                  handle(config.clickDefault, jEl, usage['__combinedData']);
               }
            }
         } else if (parentUsage) {
            if (typeof parentUsage != 'object') {
               throw "Usage must be a json object";
            }
            $.extend(usage, parentUsage);
            if (parentUsage.clickEvent !== false) {
               usage.clickEvent = config.clickDefaultConfig.clickEvent;
            }
            if (parentUsage.data) {
               usage['__combinedData'] = $.merge([], parentUsage.data);
            } else if (parentUsage.dataAppend) {
               usage['__combinedData'] = $.merge(usage['__combinedData'], parentUsage.dataAppend);
            }
            if (usage.clickEvent) {
               if (config.clickDefault) {
                  handle(config.clickDefault, jEl, usage['__combinedData']);
               }
            }
         }
      });
   }

   function handle(sHandler, jEl, aData) {
      var fHandler = aHandlers[sHandler];
      if (!fHandler) {
         throw "Cannot find handler ["+sHandler+"]";
      }
      fHandler(jEl, aData);
   }

   usagetrack = {};
   usagetrack.addHandler = function(sName, fCallback) {
      // TODO Write this
   };
   usagetrack.addFilter = function(sType, fCallback) {
      // TODO Write this
   };
   usagetrack.track = function(sHandler, oConfig) {
      // TODO Write this
   };
}(this, window, $));
