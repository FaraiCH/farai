import { EventHandler, Browser, isNullOrUndefined, isBlazor, detach } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import * as classes from '../base/classes';
/**
 * `Resize` module is used to resize the editor
 */
var Resize = /** @class */ (function () {
    function Resize(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    Resize.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initialEnd, this.renderResizable, this);
        this.parent.on(events.destroy, this.destroy, this);
    };
    Resize.prototype.renderResizable = function () {
        this.resizer = this.parent.createElement('div', {
            id: this.parent.getID() + '-resizable', className: 'e-icons'
                + ' ' + classes.CLS_RTE_RES_HANDLE + ' ' + classes.CLS_RTE_RES_EAST
        });
        this.parent.element.classList.add(classes.CLS_RTE_RES_CNT);
        this.parent.element.appendChild(this.resizer);
        this.touchStartEvent = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
        EventHandler.add(this.resizer, 'mousedown', this.resizeStart, this);
        EventHandler.add(this.resizer, this.touchStartEvent, this.resizeStart, this);
    };
    Resize.prototype.resizeStart = function (e) {
        var _this = this;
        if (e.cancelable) {
            e.preventDefault();
        }
        this.wireResizeEvents();
        this.parent.notify(events.resizeInitialized, {});
        var args = isBlazor() ? { requestType: 'editor' } : { event: e, requestType: 'editor' };
        this.parent.trigger(events.resizeStart, args, function (resizeStartArgs) {
            if (resizeStartArgs.cancel) {
                _this.unwireResizeEvents();
            }
        });
    };
    Resize.prototype.performResize = function (e) {
        var _this = this;
        var args = isBlazor() ? { requestType: 'editor' } : { event: e, requestType: 'editor' };
        this.parent.trigger(events.onResize, args, function (resizingArgs) {
            if (resizingArgs.cancel) {
                _this.unwireResizeEvents();
            }
        });
        var boundRect = this.parent.element.getBoundingClientRect();
        if (this.isMouseEvent(e)) {
            this.parent.element.style.height = e.clientY - boundRect.top + 'px';
            this.parent.element.style.width = e.clientX - boundRect.left + 'px';
        }
        else {
            var eventType = Browser.info.name !== 'msie' ? e.touches[0] : e;
            this.parent.element.style.height = eventType.clientY - boundRect.top + 'px';
            this.parent.element.style.width = eventType.clientX - boundRect.left + 'px';
        }
        this.parent.refreshUI();
    };
    Resize.prototype.stopResize = function (e) {
        this.parent.refreshUI();
        this.unwireResizeEvents();
        var args = isBlazor() ? { requestType: 'editor' } : { event: e, requestType: 'editor' };
        this.parent.trigger(events.resizeStop, args);
    };
    Resize.prototype.getEventType = function (e) {
        return (e.indexOf('mouse') > -1) ? 'mouse' : 'touch';
    };
    Resize.prototype.isMouseEvent = function (e) {
        var isMouse = false;
        if (this.getEventType(e.type) === 'mouse' || (!isNullOrUndefined(e.pointerType) &&
            this.getEventType(e.pointerType) === 'mouse')) {
            isMouse = true;
        }
        return isMouse;
    };
    Resize.prototype.wireResizeEvents = function () {
        EventHandler.add(document, 'mousemove', this.performResize, this);
        EventHandler.add(document, 'mouseup', this.stopResize, this);
        this.touchMoveEvent = (Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
        this.touchEndEvent = (Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
        EventHandler.add(document, this.touchMoveEvent, this.performResize, this);
        EventHandler.add(document, this.touchEndEvent, this.stopResize, this);
    };
    Resize.prototype.unwireResizeEvents = function () {
        EventHandler.remove(document, 'mousemove', this.performResize);
        EventHandler.remove(document, 'mouseup', this.stopResize);
        EventHandler.remove(document, this.touchMoveEvent, this.performResize);
        EventHandler.remove(document, this.touchEndEvent, this.stopResize);
    };
    Resize.prototype.destroy = function () {
        this.removeEventListener();
    };
    Resize.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.initialEnd, this.renderResizable);
        this.parent.element.classList.remove(classes.CLS_RTE_RES_CNT);
        EventHandler.remove(this.resizer, 'mousedown', this.resizeStart);
        EventHandler.remove(this.resizer, this.touchStartEvent, this.resizeStart);
        if (this.resizer) {
            detach(this.resizer);
        }
        this.parent.off(events.destroy, this.destroy);
    };
    /**
     * For internal use only - Get the module name.
     */
    Resize.prototype.getModuleName = function () {
        return 'resize';
    };
    return Resize;
}());
export { Resize };
