# usage-track
Usage track is a small JS library for tracking web usage via markup.

## Basic tracking example

Place your configuration in a data attribute on an element of the page, and mark elements that you want click tracking.

[BasicTrack.html](examples/BasicTrack.html)
```html
<html data-usagetrack-config='{"clickDefault": "ga-event"}'>
...
<button data-usagetrack='{"data": ["Category", "Action", "Label", 1234]}'>Click Me</button>
```

