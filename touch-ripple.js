/**
 * Material Design Ripple effect with jQuery and CSS. It uses only the touch events.
 *
 * @link https://github.com/topvisor/touch-ripple
 * @author Anton Solovyov <decaseal@gmail.com>
 * @license MIT
 * @version 0.1
 * @external jQuery
 */
(function($){
	/**
	 *
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
	 *
	 * @param $el
	 * @param config
	 * @constructor
	 */
	function Ripple($el, config){

	}

	/**
	 *
	 * @typedef {TouchRippleParams} TouchRippleConfig
	 *
	 * @type {TouchRippleConfig}
	 * @private
	 */
	Ripple.__defaultConfig = {

	};

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
			ripple.destroy();
			$el.removeData('touch-ripple');
		}

		return $el;
	};

	/**
	 *
	 * @param config
	 */
	Ripple.prototype.config = function(config){

	};

	/**
	 *
	 */
	Ripple.prototype.destroy = function(){

	};
})(jQuery);