# touch-ripple

Material Design Ripple effect with jQuery. It uses only the touch events. [Watch demos!](https://htmlpreview.github.io/?https://github.com/topvisor/touch-ripple/blob/master/demo.html)

# Usage

```javascript
// init
$('body').ripple({
	opacity: 0.4,
	background: 'currentColor',
	selector: '.ripple',
	excludeSelector: '.no-ripple',
	rippleOnClass: 'ripple-on',
	rippleCircleClass: 'ripple-circle',
	opacityDataName: 'ripple-opacity',
	backgroundDataName: 'ripple-background',
	expanseDelayDataName: 'ripple-expanse-delay',
	expanseDelay: 0,
	expanseDuration: 175,
	expanseEasing: 'linear',
	fadeDuration: 175,
	fadeEasing: 'linear'
});

// destroy
$('body').ripple('destroy');
```

You can use the data attribute to modify the ripple parameters of dom element
```html
<div class="ripple" data-ripple-opacity="0.2" data-ripple-background="#000" data-ripple-expanse-delay="150"></div> 
```
