# touch-ripple

Material Design Ripple effect with jQuery and CSS. It uses only the touch events. [Show me the demos!](https://topvisor.com/)

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
	expanseDelay: 150,
	expanseDuration: 175,
	expanseEasing: 'linear',
	fadeDuration: 175,
	fadeEasing: 'linear'
});

// destroy
$('body').ripple('destroy');
```