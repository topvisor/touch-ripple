# touch-ripple

Material Design Ripple effect with jQuery. It uses only the touch events. [Watch demos!](https://htmlpreview.github.io/?https://github.com/topvisor/touch-ripple/blob/master/demo.html)

# Usage

### JS
```javascript
// init
$('body').ripple({
	selector: '.touch-ripple',
	excludeSelector: '.no-touch-ripple'
});

// destroy
$('body').ripple('destroy');
```

### HTML
```html
<div class="touch-ripple">Touch me!</div>
<div class="touch-ripple" data-touch-ripple-delay="1000">Delay 1000ms</div>
```