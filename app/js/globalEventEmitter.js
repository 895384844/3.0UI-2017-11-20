/**
 * EventEmitter when loaded through RequireJS does not make itself available
 * as a global variable so we have to do it ourselves.
 */
define(['eventEmitter'], function(eventEmitter){
    window.EventEmitter = eventEmitter;
});