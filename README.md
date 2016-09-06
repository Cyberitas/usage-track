# usage-track
Usage track is a small JS library for tracking web usage via markup.

## Dependencies and installation

Requires jQuery to be loaded before usage-track, usage-track can be included in the head or anywhere in the body or dynamically with something like RequireJS.

### Basic tracking example

Place your configuration in a data attribute on an element of the page, and mark elements that you want click tracking.

[BasicTrack.html](examples/BasicTrack.html)
```html
<html data-usagetrack-config='{"clickDefault": "ga-event"}'>
...
<button data-usagetrack='{"data": ["Category", "Action", "Label", 1234]}'>Click Me</button>
```

## Nested tracking example

[NestedExample.html](examples/NestedExample.html)

A usage-track markup tracker (data-usagetrack) will inherit configurations of it's parents.

```html
<footer style="background:#999;" data-usagetrack='{"data": ["Footer", "Links"], "clickEvent": false}'>
   <a href="#" data-usagetrack='{"dataAppend": ["Link Clicked"]}'>Link</a>
</footer>
```

Additionally a short-hand is available to do this same thing:

```html
<footer style="background:#999;" data-usagetrack-group='Footer'>
   <nav data-usagetrack-group='Links'>
      <a href="#" data-usagetrack-click='Link Clicked'>Link</a>
   </nav>
</footer>
```

## Handlers

There are a few built in trackers:

| Handler Name | Description |
| --- | --- |
| console | Uses console logging to display the associated data with the event |
| ga-event | Uses universal Google Analytics event tracker (requires analytics.js to be loaded |

New trackers can be added:

```js
function handlerCallbackFunction(jqueryElement, config, data) {
   console.log('Event tracked: ', config, data);
}

usagetrack.addHandler('my-handler', handlerCallbackFunction);

usagetrack.track('my-handler', {data: ['Test Event'], myUniqueId: 12345});
```

## Filters

In addition to handlers, usage can be tracked via filters:

```js
function getDomain(url) {
   return url.replace('http://','').replace('https://','').split('/')[0];
}

usagetrack.addFilter('click', function(jQueryElement) {
   var anchor = jQueryElement.closest('a');
   if (anchor && getDomain(anchor.attr('href')) !== document.location.host) {
      usagetrack.track('ga-event', {data: ['Offsite Link', anchor.attr('href'));
   }
});
```

```js
usagetrack.addFilter('click', function(jqueryElement, config, data) {
   if (data && data[0] === 'My Form') {
      usagetrack.track('ga-event', {data: ['Form', 'Interaction Detected']});
   }
});
```

