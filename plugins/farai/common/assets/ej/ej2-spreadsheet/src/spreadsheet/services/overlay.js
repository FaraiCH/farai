import { getCellPosition, refreshImgCellObj, refreshChartCellObj } from '../common/index';
import { getRangeIndexes, refreshChartSize, focusChartBorder } from '../../workbook/index';
import { EventHandler, removeClass, closest } from '@syncfusion/ej2-base';
/**
 * Specifes to create or modify overlay.
 * @hidden
 */
var Overlay = /** @class */ (function () {
    /**
     * Constructor for initializing Overlay service.
     */
    function Overlay(parent) {
        this.minHeight = '300px';
        this.minWidth = '400px';
        this.isOverlayClicked = false;
        this.isResizerClicked = false;
        this.currentWidth = 400;
        this.currenHeight = 300;
        this.parent = parent;
    }
    /**
     * To insert a shape.
     * @hidden
     */
    Overlay.prototype.insertOverlayElement = function (id, range, sheetIndex) {
        var div = this.parent.createElement('div', {
            id: id,
            attrs: { 'class': 'e-ss-overlay' },
            styles: 'width: ' + this.minWidth + ';  height: ' + this.minHeight
        });
        var indexes = getRangeIndexes(range);
        var sheet = this.parent.sheets[sheetIndex];
        var pos = getCellPosition(sheet, indexes);
        div.style.top = pos.top + 'px';
        div.style.left = pos.left + 'px';
        this.parent.getMainContent().appendChild(div);
        this.renderResizeHandles(div);
        this.addEventListener(div);
        this.originalWidth = parseFloat(getComputedStyle(div, null).getPropertyValue('width').replace('px', ''));
        this.originalHeight = parseFloat(getComputedStyle(div, null).getPropertyValue('height').replace('px', ''));
        return div;
    };
    Overlay.prototype.addEventListener = function (div) {
        var overlayElem = div;
        EventHandler.add(overlayElem, 'mousedown', this.overlayClickHandler, this);
        EventHandler.add(overlayElem, 'mousemove', this.overlayMouseMoveHandler, this);
        EventHandler.add(this.parent.getMainContent(), 'mousemove', this.overlayMouseMoveHandler, this);
        EventHandler.add(document, 'mouseup', this.overlayMouseUpHandler, this);
    };
    Overlay.prototype.overlayMouseMoveHandler = function (e) {
        var target = e.target;
        var overlayElem = document.getElementsByClassName('e-ss-overlay-active')[0];
        if (this.isOverlayClicked && this.isResizerClicked) {
            switch (this.resizer) {
                case 'e-ss-overlay-t':
                    var height1 = Math.max(this.originalMouseY - e.clientY + this.originalHeight, 20);
                    var top_1 = e.clientY - (this.originalMouseY - this.originalResizeTop);
                    if (height1 > 180 && top_1 > -1) {
                        overlayElem.style.height = height1 + 'px';
                        overlayElem.style.top = top_1 + 'px';
                        this.resizedReorderTop = e.clientX; // resized divTop
                        this.currenHeight = height1;
                        this.parent.notify(refreshChartSize, {
                            height: overlayElem.style.height, width: overlayElem.style.width, overlayEle: overlayElem
                        });
                    }
                    break;
                case 'e-ss-overlay-r':
                    var width1 = this.originalWidth + (e.pageX - this.originalMouseX);
                    if (width1 > 180) {
                        overlayElem.style.width = width1 + 'px';
                        this.currentWidth = width1;
                        this.parent.notify(refreshChartSize, {
                            height: overlayElem.style.height, width: overlayElem.style.width, overlayEle: overlayElem
                        });
                    }
                    break;
                case 'e-ss-overlay-b':
                    var height2 = this.originalHeight + (e.pageY - this.originalMouseY);
                    if (height2 > 180) {
                        overlayElem.style.height = height2 + 'px';
                        this.currenHeight = height2;
                        this.parent.notify(refreshChartSize, {
                            height: overlayElem.style.height, width: overlayElem.style.width, overlayEle: overlayElem
                        });
                    }
                    break;
                case 'e-ss-overlay-l':
                    var width2 = Math.max(this.originalMouseX - e.clientX + this.originalWidth, 20);
                    var left = e.clientX - (this.originalMouseX - this.originalResizeLeft);
                    if (width2 > 180 && left > -1) {
                        overlayElem.style.width = width2 + 'px';
                        overlayElem.style.left = left + 'px';
                        this.resizedReorderLeft = left; //resized divLeft
                        this.currentWidth = width2;
                        this.parent.notify(refreshChartSize, {
                            height: overlayElem.style.height, width: overlayElem.style.width, overlayEle: overlayElem
                        });
                    }
                    break;
            }
        }
        else if (this.isOverlayClicked) {
            var posX = e.clientX;
            var posY = e.clientY;
            var aX = posX - this.diffX;
            var aY = posY - this.diffY;
            if (aX > -1) {
                overlayElem.style.left = aX + 'px';
            }
            if (aY > -1) {
                overlayElem.style.top = aY + 'px';
            }
            this.resizedReorderLeft = aX; //resized divLeft
            this.resizedReorderTop = aY; // resized divTop
        }
    };
    Overlay.prototype.overlayMouseUpHandler = function (e) {
        if (this.parent.getActiveSheet().isProtected) {
            return;
        }
        this.isOverlayClicked = false;
        this.isResizerClicked = false;
        var elem = e.target;
        if (!elem.classList.contains('e-ss-overlay')) {
            elem = closest(e.target, '.e-datavisualization-chart') ?
                closest(e.target, '.e-datavisualization-chart') : elem;
        }
        var eventArgs = {
            prevTop: this.originalReorderTop, prevLeft: this.originalReorderLeft,
            currentTop: this.resizedReorderTop ? this.resizedReorderTop : this.originalReorderTop, currentLeft: this.resizedReorderLeft ?
                this.resizedReorderLeft : this.originalReorderLeft, id: elem.id, currentHeight: this.currenHeight,
            currentWidth: this.currentWidth, requestType: 'imageRefresh',
            prevHeight: this.originalHeight, prevWidth: this.originalWidth
        };
        if (elem.id.indexOf('overlay') > 0 || elem.classList.contains('e-ss-resizer')) {
            if (this.originalReorderTop !== this.resizedReorderTop || this.originalReorderLeft !== this.resizedReorderLeft) {
                eventArgs.id = elem.id;
                if (elem.classList.contains('e-datavisualization-chart')) {
                    eventArgs.requestType = 'chartRefresh';
                    this.parent.notify(refreshChartCellObj, eventArgs);
                }
                this.parent.notify(refreshImgCellObj, eventArgs);
                this.resizedReorderTop = this.originalReorderTop;
                this.resizedReorderLeft = this.originalReorderLeft;
            }
            else if (this.currenHeight !== this.originalHeight || this.originalWidth !== this.currentWidth) {
                eventArgs.id = elem.id.indexOf('overlay') > 0 ? elem.id : elem.parentElement.id;
                if (elem.classList.contains('e-datavisualization-chart')) {
                    eventArgs.requestType = 'chartRefresh';
                    this.parent.notify(refreshChartCellObj, eventArgs);
                }
                this.parent.notify(refreshImgCellObj, eventArgs);
                this.originalHeight = this.currenHeight;
                this.originalWidth = this.currentWidth;
            }
        }
    };
    Overlay.prototype.overlayClickHandler = function (e) {
        if (this.parent.getActiveSheet().isProtected) {
            return;
        }
        this.isOverlayClicked = true;
        var target = e.target;
        var overlayElem = e.target;
        if (!target.classList.contains('e-ss-overlay')) {
            overlayElem = closest(e.target, '.e-datavisualization-chart') ?
                closest(e.target, '.e-datavisualization-chart') : target.parentElement;
        }
        this.originalReorderLeft = parseInt(overlayElem.style.left, 10); //divLeft
        this.originalReorderTop = parseInt(overlayElem.style.top, 10); // divTop
        this.resizedReorderLeft = parseInt(overlayElem.style.left, 10); //resized divLeft
        this.resizedReorderTop = parseInt(overlayElem.style.top, 10); // resized divTop
        this.originalResizeTop = this.originalReorderTop;
        this.originalResizeLeft = this.originalReorderLeft;
        this.originalMouseX = e.clientX; // posX
        this.originalMouseY = e.clientY; // posY
        this.diffX = this.originalMouseX - this.originalReorderLeft;
        this.diffY = this.originalMouseY - this.originalReorderTop;
        var actOverlayElem = document.getElementsByClassName('e-ss-overlay-active')[0];
        if (actOverlayElem) {
            removeClass([actOverlayElem], 'e-ss-overlay-active');
        }
        document.getElementById(overlayElem.id).classList.add('e-ss-overlay-active');
        if (target.classList.contains('e-ss-resizer')) {
            this.resizer = target.classList[0];
            this.originalWidth = parseFloat(getComputedStyle(overlayElem, null).getPropertyValue('width').replace('px', ''));
            this.originalHeight = parseFloat(getComputedStyle(overlayElem, null).getPropertyValue('height').replace('px', ''));
            this.isResizerClicked = true;
        }
        if (overlayElem.classList.contains('e-datavisualization-chart')) {
            this.parent.notify(focusChartBorder, { id: overlayElem.id });
        }
    };
    Overlay.prototype.renderResizeHandles = function (div) {
        var handles = ['e-ss-overlay-t', 'e-ss-overlay-r', 'e-ss-overlay-b', 'e-ss-overlay-l'];
        var i = 0;
        var handleElem;
        var overlay = div;
        while (handles.length > i) {
            handleElem = this.parent.createElement('div', {
                attrs: { 'class': handles[i] + ' ' + 'e-ss-resizer' },
                styles: 'width: 8px; height: 8px; border-radius: 4px;'
            });
            overlay.appendChild(handleElem);
            i++;
        }
    };
    Overlay.prototype.removeEventListener = function () {
        var overlayElem = document.getElementById(this.parent.element.id + '_overlay');
        EventHandler.remove(overlayElem, 'mousedown', this.overlayClickHandler);
        EventHandler.remove(overlayElem, 'mousemove', this.overlayMouseMoveHandler);
        EventHandler.remove(this.parent.getMainContent(), 'mousemove', this.overlayMouseMoveHandler);
        EventHandler.remove(document, 'mouseup', this.overlayMouseUpHandler);
    };
    /**
     * To clear private variables.
     */
    Overlay.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    return Overlay;
}());
export { Overlay };
