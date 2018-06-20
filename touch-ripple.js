/**
 * Material Design Ripple effect with jQuery and CSS. It uses only the touch events.
 *
 * @link https://github.com/topvisor/touch-ripple
 * @author Anton Solovyov <decaseal@gmail.com>
 * @license MIT
 * @version 0.3
 */
(function($){
	/**
	 * @typedef {Object} TouchRippleParams
	 *
	 * @param {string} [method='init']
	 * @param {TouchRippleParams} [params]
	 * @returns {jQuery.fn.init}
	 */
	$.fn.touchRipple = function(method, params){
		if (typeof method !== 'string' || typeof TouchRipple[method] !== 'function') {
			params = method;
			method = 'init';
		}

		return TouchRipple[method](this, params);
	};

	/**
	 * @param {jQuery.fn.init} $el
	 * @param {TouchRippleConfig} config
	 * @constructor
	 */
	function TouchRipple($el, config){
		this.$el = $el;
		this.config(config);
		this.attachEvents();
	}

	TouchRipple.availableConfigKeys = ['selector', 'exclude'];

	/**
	 *
	 * @param {jQuery.fn.init} $el
	 * @param {TouchRippleConfig} [config]
	 * @returns {jQuery.fn.init}
	 */
	TouchRipple.init = function($el, config){
		var ripple = $el.data('touch-ripple');

		if (ripple) ripple.config(config);
		else $el.data('touch-ripple', new TouchRipple($el, config));

		return $el;
	};

	/**
	 *
	 * @param {jQuery.fn.init} $el
	 * @returns {jQuery.fn.init}
	 */
	TouchRipple.destroy = function($el){
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
	TouchRipple.prototype.$el = undefined;

	/**
	 * @typedef {Touch} RippleTouch
	 * @property {jQuery.fn.init} $currentTarget
	 * @property {boolean} [ended]
	 * @property {boolean} [expandAnimation]
	 *
	 * @type {RippleTouch[]} - RippleTouch by Touch identifiers
	 */
	TouchRipple.prototype.touches = {};

	TouchRipple.prototype.selector = '.touch-ripple';
	TouchRipple.prototype.exclude = '.no-touch-ripple';

	/**
	 * @typedef {TouchRippleParams} TouchRippleConfig
	 * @property {string} [selector]
	 * @property {number} [delay]
	 *
	 * @param {TouchRippleConfig} config
	 * @returns {TouchRipple}
	 */
	TouchRipple.prototype.config = function(config){
		if(config){
			for (var i = 0; i < TouchRipple.availableConfigKeys.length; i++) {
				var key = TouchRipple.availableConfigKeys[i];
				if (config[key] !== undefined) {
					this[key] = config[key];
				}
			}
		}

		return this;
	};

	/**
	 * @returns {TouchRipple}
	 */
	TouchRipple.prototype.attachEvents = function(){
		var $window = $(window);

		$window.on('touchstart.touchRipple', null, this, function(e){
			setTimeout(function(){
				e.data.startTouch(e);
			});
		});

		$window.on('touchmove.touchRipple touchend.touchRipple', null, this, function(e){
			setTimeout(function(){
				e.data.endTouch(e);
			});
		});

		this.$el.on(
			'transitionend.touchRipple webkitTransitionEnd.touchRipple oTransitionEnd.touchRipple otransitionend.touchRipple',
			'.touch-ripple-circle',
			this,
			function(e){
				e.data.endCircleTransition(e);
			}
		);

		return this;
	};

	/**
	 * @returns {TouchRipple}
	 */
	TouchRipple.prototype.detachEvents = function(){
		this.$el.off('.touchRipple');

		return this;
	};

	/**
	 * @param {jQuery.fn.init} $target
	 * @return {jQuery.fn.init|undefined}
	 */
	TouchRipple.prototype.getCurrentTarget = function($target){
		if ($target.length === 0 || $target.closest(this.$el).length === 0 || $target.is(this.exclude)) return;
		if ($target.is(this.selector)) return $target;
		else return this.getCurrentTarget($target.closest(this.selector));
	};

	/**
	 * @param {TouchEvent} e
	 */
	TouchRipple.prototype.startTouch = function(e){
		for (var i = 0; i < e.changedTouches.length; i++) {
			var touch = e.changedTouches[i];
			if (this.touches[touch.identifier]) return;

			var $currentTarget = this.getCurrentTarget($(touch.target));
			var rippleTouch = {$currentTarget: $currentTarget};
			for (var key in touch) rippleTouch[key] = touch[key];

			this.touches[touch.identifier] = rippleTouch;

			if ($currentTarget) {
				this.expandAnimation(rippleTouch);
			}
		}
	};

	/**
	 * @param {TouchEvent} e
	 */
	TouchRipple.prototype.endTouch = function(e){
		for (var i = 0; i < e.changedTouches.length; i++) {
			var touch = this.touches[e.changedTouches[i].identifier];
			if (!touch) return;

			touch.ended = true;
			delete this.touches[touch.identifier];

			if (touch.$currentTarget) {
				if (e.type === 'touchend' && touch.expandAnimation === undefined) this.expandAnimation(touch);
				else if (touch.expandAnimation === false) this.fadeAnimation(touch);
				else if (touch.expandAnimation === undefined) touch.$currentTarget.children('.touch-ripple-circle-wrapper').remove();
			}
		}
	};

	TouchRipple.prototype.endCircleTransition = function(e){
		var $circle = $(e.currentTarget);
		var touch = $circle.data('touch');

		if (e.originalEvent.propertyName === 'opacity') {
			$circle.parent('.touch-ripple-circle-wrapper').remove();
		} else if (e.originalEvent.propertyName === 'top') {
			touch.expandAnimation = false;
			if (touch.ended) this.fadeAnimation(touch);
		}
	};

	/**
	 * @param {RippleTouch} touch
	 * @return {TouchRipple}
	 */
	TouchRipple.prototype.expandAnimation = function(touch){
		var $wrapper = touch.$currentTarget.children('.touch-ripple-circle-wrapper');

		if (!$wrapper.length) {
			$wrapper = $('<div>')
				.addClass('touch-ripple-circle-wrapper')
				.appendTo(touch.$currentTarget);
		}

		var offset = $wrapper.offset();
		var touchPosition = {
			left: touch.pageX - offset.left,
			top: touch.pageY - offset.top
		};

		var $circle = $('<div>')
			.addClass('touch-ripple-circle')
			.css(touchPosition)
			.data('touch', touch);

		$wrapper
			.empty()
			.append($circle);

		var height = $wrapper.outerHeight();
		var width = $wrapper.outerWidth();
		var diameter = Math.sqrt(
			Math.pow(height + 2*(Math.abs(height/2 - touchPosition.top)), 2) +
			Math.pow(width + 2*(Math.abs(width/2 - touchPosition.left)), 2)
		);

		$circle.css({
			width: diameter,
			height: diameter,
			left: touchPosition.left - diameter/2,
			top: touchPosition.top - diameter/2,
		});

		var delay = $circle.css('transition-delay') ||
			$circle.css('-webkit-transition-delay') ||
			$circle.css('-moz-transition-delay') ||
			$circle.css('-o-transition-delay') ||
			'0ms';

		if(delay.slice(-2) === 'ms') delay = parseFloat(delay);
		else if(delay.slice(-1) === 's') delay = parseFloat(delay)*1000;

		setTimeout(function(){
			touch.expandAnimation = true;
		}, delay);

		return this;
	};

	/**
	 * @param {RippleTouch} touch
	 * @return {TouchRipple}
	 */
	TouchRipple.prototype.fadeAnimation = function(touch){
		touch.$currentTarget
			.find('.touch-ripple-circle')
			.css('opacity', 0);

		return this;
	};
})(jQuery);