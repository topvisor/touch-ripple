# touch-ripple

Material Design Ripple effect with jQuery and CSS. It uses only the touch events. [Watch demos!](https://topvisor.com/)

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

You can use the data attribute to modify the ripple parameters of dom element
```html
<div class="ripple" data-ripple-opacity="0.2" data-ripple-background="#000"></div> 
```