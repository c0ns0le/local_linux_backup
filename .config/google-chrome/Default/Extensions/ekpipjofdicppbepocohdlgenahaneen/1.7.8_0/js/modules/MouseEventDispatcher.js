!function(){function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){return e(b[g][1][a]||a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}return a}()({1:[function(a,b,c){!function(){"use strict";function a(){throw"MouseEventDispatcher cannot be instantiated."}a.eventTypes=["mouseclick","dblclick","mousedown","mouseenter","mouseleave","mousemove","mouseout","mouseover","mouseup"],a.dispatch=function(a,b,c){"string"==typeof a&&(a=document.querySelector(a)),"mouseclick"===b&&(b="click"),c=c||{};var d=document.createEvent("MouseEvents");d.initMouseEvent(b,c.canBubble||!0,c.cancelable||!0,c.view||window,c.detail||1,c.screenX||0,c.screenY||0,c.clientX||0,c.clientY||0,c.ctrlKey||!1,c.altKey||!1,c.shiftKey||!1,c.metaKey||!1,c.button||0,c.relatedTarget||null),a.dispatchEvent(d)},a.eachTypes=function(a){for(var b=0;b<this.eventTypes.length;b++)a(this.eventTypes[b])},a.eachTypes(function(b){a[b]=function(c,d){a.dispatch(c,b,d)}}),b.exports=a}()},{}]},{},[1]);