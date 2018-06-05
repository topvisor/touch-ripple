/**
 * Material Design Ripple effect with jQuery and CSS. It uses only the touch events.
 *
 * @link https://github.com/topvisor/touch-ripple
 * @author Anton Solovyov <decaseal@gmail.com>
 * @license MIT
 * @version 0.1
 */
(function($){
	/**
	 * @typedef {Object} TouchRippleParams
	 *
	 * @param {string} [method='init']
	 * @param {TouchRippleParams} [params]
	 * @returns {jQuery.fn.init}
	 */
	$.fn.ripple = function(method, params){
		if (typeof method !== 'string' || typeof Ripple[method] !== 'function') {
			params = method;
			method = 'init';
		}

		return Ripple[method](this, params);
	};

	/**
	 * @param {jQuery.fn.init} $el
	 * @param {TouchRippleConfig} config
	 * @constructor
	 */
	function Ripple($el, config){
		this.$el = $el;
		this.config(config);
		this.attachEvents();
	}

	Ripple.availableConfigKeys = ['opacity', 'background', 'selector', 'excludeSelector', 'rippleOnClass', 'rippleCircleClass', 'opacityDataName',
		'backgroundDataName', 'expanseDelay', 'expanseDuration', 'expanseEasing', 'fadeDuration', 'fadeEasing'];

	/**
	 *
	 * @param {jQuery.fn.init} $el
	 * @param {TouchRippleConfig} config
	 * @returns {jQuery.fn.init}
	 */
	Ripple.init = function($el, config){
		var ripple = $el.data('touch-ripple');

		if (ripple) ripple.config(config);
		else $el.data('touch-ripple', new Ripple($el, config));

		return $el;
	};

	/**
	 *
	 * @param {jQuery.fn.init} $el
	 * @returns {jQuery.fn.init}
	 */
	Ripple.destroy = function($el){
		var ripple = $el.data('touch-ripple');

		if (ripple) {
			ripple.detachEvents();
			$el.removeData('touch-ripple');
		}

		return $el;
	};

	/**
	 * @type {jQuery.fn.init}
	 */
	Ripple.prototype.$el = undefined;

	/**
	 * @typedef {Touch} RippleTouch
	 * @property {boolean} rippleAnimationStarted
	 * @property {boolean} rippleAnimationEnded
	 *
	 * @type {RippleTouch[]} - RippleTouch by Touch identifiers
	 */
	Ripple.prototype.touches = {};

	Ripple.prototype.opacity = 0.4;
	Ripple.prototype.background = 'currentColor';
	Ripple.prototype.selector = '.ripple';
	Ripple.prototype.excludeSelector = '.no-ripple';
	Ripple.prototype.rippleOnClass = 'ripple-on';
	Ripple.prototype.rippleCircleClass = 'ripple-circle';
	Ripple.prototype.opacityDataName = 'ripple-opacity';
	Ripple.prototype.backgroundDataName = 'ripple-background';
	Ripple.prototype.expanseDelayDataName = 'ripple-expanse-delay';
	Ripple.prototype.expanseDelay = 0;
	Ripple.prototype.expanseDuration = 175;
	Ripple.prototype.expanseEasing = 'linear';
	Ripple.prototype.fadeDuration = 175;
	Ripple.prototype.fadeEasing = 'linear';

	/**
	 * @typedef {TouchRippleParams} TouchRippleConfig
	 * @property {number} opacity
	 * @property {string} background
	 * @property {string} selector
	 * @property {string} excludeSelector
	 * @property {string} rippleOnClass
	 * @property {string} rippleCircleClass
	 * @property {string} opacityDataName
	 * @property {string} backgroundDataName
	 * @property {string} expanseDelayDataName
	 * @property {number} expanseDelay
	 * @property {number} expanseDuration
	 * @property {string} expanseEasing
	 * @property {number} fadeDuration
	 * @property {string} fadeEasing
	 *
	 * @param {TouchRippleConfig} config
	 * @returns {Ripple}
	 */
	Ripple.prototype.config = function(config){
		if(config){
			for (var i = 0; i < Ripple.availableConfigKeys.length; i++) {
				var key = Ripple.availableConfigKeys[i];
				if (config[key] !== undefined) {
					this[key] = config[key];
				}
			}
		}

		return this;
	};

	/**
	 * @returns {Ripple}
	 */
	Ripple.prototype.attachEvents = function(){
		this.$el.on('touchstart.touchRipple', null, this, function(e){
			e.data.startTouch(e);
		});

		this.$el.on('touchmove.touchRipple touchend.touchRipple', null, this, function(e){
			e.data.endTouch(e);
		});

		return this;
	};

	/**
	 * @returns {Ripple}
	 */
	Ripple.prototype.detachEvents = function(){
		this.$el.off('.touchRipple');

		return this;
	};

	/**
	 * @param {TouchEvent} e
	 */
	Ripple.prototype.startTouch = function(e){
		for(var i = 0; i < e.changedTouches.length; i++) {
			var touch = e.changedTouches[i];
			var $target = $(touch.target);

			if (
				!$target.is(this.selector) ||
				$target.is(this.excludeSelector) ||
				this.touches[touch.identifier] !== undefined
			) return;

			this.touches[touch.identifier] = touch;

			var delay = $target.data(this.expanseDelayDataName);
			if(delay === undefined) delay = this.expanseDelay;
			setTimeout(function () {
				if (this.touches[touch.identifier]) this.startAnimation(touch);
			}.bind(this), delay);
		}
	};

	/**
	 * @param {TouchEvent} e
	 */
	Ripple.prototype.endTouch = function(e){
		for(var i = 0; i < e.changedTouches.length; i++) {
			var touch = this.touches[e.changedTouches[i].identifier];
			if (!touch) return;
			delete this.touches[touch.identifier];

			if (!touch.rippleAnimationStarted && e.type === 'touchend') this.startAnimation(touch);
			else this.endAnimation(touch);
		}
	};

	/**
	 * @param {RippleTouch} touch
	 * @return {Ripple}
	 */
	Ripple.prototype.startAnimation = function(touch){
		touch.rippleAnimationStarted = true;

		var $target = $(touch.target);

		$target
			.addClass(this.rippleOnClass)
			.css('overflow', 'hidden')
			.children('.'+this.rippleCircleClass)
			.stop()
			.remove();

		if ($target.css('position') === 'static') {
			$target.css('position', 'relative');
		}

		var offset = $target.offset();
		var height = $target.outerHeight();
		var width = $target.outerWidth();
		var touchPosition = {
			left: touch.pageX - offset.left,
			top: touch.pageY - offset.top
		};
		var diameter = Math.sqrt(
			Math.pow(height + 2*(Math.abs(height/2 - touchPosition.top)), 2) +
			Math.pow(width + 2*(Math.abs(width/2 - touchPosition.left)), 2)
		);

		var $rippleCircle = $('<div>')
			.addClass(this.rippleCircleClass)
			.css({
				opacity: $target.data(this.opacityDataName) || this.opacity,
				background: $target.data(this.backgroundDataName) || this.background,
				left: touchPosition.left,
				top: touchPosition.top,
				borderRadius: '100%',
				position: 'absolute'
			})
			.appendTo($target);

		$rippleCircle.animate(
			{to: diameter},
			{
				duration: this.expanseDuration,
				easing: this.expanseEasing,
				step: function(now){
					$rippleCircle.css({
						width: now,
						height: now,
						left: touchPosition.left - now/2,
						top: touchPosition.top - now/2
					});
				},
				complete: function(){
					touch.rippleAnimationEnded = true;
					this.endAnimation(touch);
				}.bind(this)
			}
		);

		return this;
	};

	/**
	 * @param {RippleTouch} touch
	 * @return {Ripple}
	 */
	Ripple.prototype.endAnimation = function(touch){
		if(this.touches[touch.identifier]) return;
		if(!touch.rippleAnimationEnded) return;

		var $target = $(touch.target);
		var $rippleCircle = $target.children('.'+this.rippleCircleClass);

		$rippleCircle.animate(
			{opacity: 0},
			{
				duration: this.fadeDuration,
				easing: this.fadeEasing,
				complete: function(){
					$rippleCircle.remove();
					$target.removeClass(this.rippleOnClass);
				}.bind(this)
			}
		);
	};
})(jQuery);