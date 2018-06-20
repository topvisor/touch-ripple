# touch-ripple

Material Design Ripple effect with jQuery. It uses only the touch events. [Watch demos!](https://htmlpreview.github.io/?https://github.com/topvisor/touch-ripple/blob/master/demo.html)

# Usage

```javascript
// init
$('body').ripple({
	selector: '.touch-ripple',
	excludeSelector: '.no-touch-ripple'
});

// destroy
$('body').ripple('destroy');
```