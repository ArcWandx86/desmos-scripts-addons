// ==UserScript==
// @name     	DesmosColorRightClick
// @namespace	slidav.Desmos
// @version  	1.0.6
// @author		SlimRunner (David Flores)
// @description	Overrides context menu for color bubble
// @grant    	none
// @match			https://*.desmos.com/calculator*
// @downloadURL	https://github.com/SlimRunner/desmos-scripts-addons/raw/master/right-click-patch/dcg-rmb-color.user.js
// @updateURL	https://github.com/SlimRunner/desmos-scripts-addons/raw/master/right-click-patch/dcg-rmb-color.user.js
// ==/UserScript==

/*jshint esversion: 6 */

(function() {
	'use strict';
	
	var Desmos;
	var tm_win;
	var tm_doc;
	
	function initListeners () {
		let showContextMenu = true;
		
		tm_doc.addEventListener("contextmenu", (e) => {
			if (!showContextMenu) {
				showContextMenu = true;
				e.preventDefault();
			}
		});
		
		tm_win.addEventListener('mousedown', (e) => {
			if (
				e.button === 2 &&
				typeof e.target.classList === 'object' &&
				typeof e.target.className === 'string' &&
				(e.target.classList.contains('dcg-layered-icon') ||
				e.target.classList.contains('dcg-circular-icon'))
			) {
				const ICON_DICTIONARY = `boxplot cross distribution dotplot-cross dotplot-default dotplot-open histogram lines-solid move move-horizontal move-vertical open parametric-dashed parametric-dotted parametric-filled parametric-solid point points polygon-dashed polygon-dotted polygon-filled polygon-solid shaded-inequality-dash`;
				
				// isolate icon name using regex
				let targetName = e.target.className.match(/(?<=dcg-icon-)[a-z\-]+/im);
				
				if (
					ICON_DICTIONARY.search(targetName) !== -1
				) {
					// when the bubble is visible
					showContextMenu = false;
					Desmos.$(e.target.parentElement.parentElement).trigger('dcg-longhold');
					
				} else if (
					e.target.className.search('dcg-do-not-blur') !== -1 &&
					e.target.className.search('dcg-hidden') !== -1 &&
					e.target.parentElement.parentElement.parentElement.parentElement.className.search('dcg-expressionfolder') === -1
				) {
					// when the bubble is hidden
					showContextMenu = false;
					Desmos.$(e.target.parentElement).trigger('dcg-longhold');
					
				}
				
			}
		});
	}
	
	(function loadCheck () {
		
		if (typeof loadCheck.attempts === 'undefined') {
			loadCheck.attempts = 0;
		} else {
			loadCheck.attempts++;
		}
		
		if (
			typeof window.wrappedJSObject.Calc === 'undefined' ||
			typeof window.wrappedJSObject.Desmos === 'undefined'
		) {
			
			if (loadCheck.attempts < 10) {
				window.setTimeout(loadCheck, 1000);
			} else {
				console.log("Abort: The script couldn't load properly :/");
			}
			
		} else {
			Desmos = window.wrappedJSObject.Desmos;
			tm_win = window.wrappedJSObject;
			tm_doc = window.wrappedJSObject.document;
			initListeners();
			console.log('Right click override for color loaded properly');
		}
	}());
	
}());
