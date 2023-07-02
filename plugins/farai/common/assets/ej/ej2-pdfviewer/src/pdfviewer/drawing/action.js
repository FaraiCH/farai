import { Rect } from '@syncfusion/ej2-drawings';
import { Point, identityMatrix, rotateMatrix } from '@syncfusion/ej2-drawings';
import { Container, transformPointByMatrix } from '@syncfusion/ej2-drawings';
import { isPointOverConnector } from './connector-util';
import { LineTool, NodeDrawingTool } from './tools';
/** @private */
// tslint:disable-next-line
export function findActiveElement(event, pdfBase, pdfViewer, isOverlapped) {
    if (pdfViewer && pdfBase.activeElements.activePageID > -1) {
        var objects = findObjectsUnderMouse(pdfBase, pdfViewer, event);
        var object = findObjectUnderMouse(objects, event, pdfBase, pdfViewer);
        if (isOverlapped) {
            return objects;
        }
        return object;
    }
    return undefined;
}
/** @private */
export function findObjectsUnderMouse(pdfBase, pdfViewer, event) {
    var actualTarget = [];
    var bounds;
    // tslint:disable-next-line
    var pt = pdfBase.currentPosition || { x: event.offsetX, y: event.offsetY };
    pt = { x: pt.x / pdfBase.getZoomFactor(), y: pt.y / pdfBase.getZoomFactor() };
    var pageTable = pdfViewer.getPageTable(pdfBase.activeElements.activePageID);
    var objArray = findObjects(pt, pageTable.objects);
    return objArray;
}
/** @private */
export function findObjectUnderMouse(
// tslint:disable-next-line
objects, event, pdfBase, pdfViewer) {
    var actualTarget = null;
    var touchArg;
    var offsetX;
    var offsetY;
    if (event && event.type && event.type.indexOf('touch') !== -1) {
        touchArg = event;
        if (pdfViewer.annotation) {
            var pageDiv = pdfBase.getElement('_pageDiv_' + pdfViewer.annotation.getEventPageNumber(event));
            if (pageDiv) {
                var pageCurrentRect = pageDiv.getBoundingClientRect();
                offsetX = touchArg.changedTouches[0].clientX - pageCurrentRect.left;
                offsetY = touchArg.changedTouches[0].clientY - pageCurrentRect.top;
            }
        }
    }
    else {
        offsetX = !isNaN(event.offsetX) ? event.offsetX : (event.position ? event.position.x : 0);
        offsetY = !isNaN(event.offsetY) ? event.offsetY : (event.position ? event.position.y : 0);
    }
    var offsetForSelector = 5;
    var boundsDiff = 0;
    for (var i = 0; i < objects.length; i++) {
        // tslint:disable-next-line:max-line-length
        if (!(objects[i].shapeAnnotationType === 'Distance' || objects[i].shapeAnnotationType === 'Line' || objects[i].shapeAnnotationType === 'LineWidthArrowHead' || pdfBase.tool instanceof LineTool)) {
            var bounds = objects[i].wrapper.bounds;
            var rotationValue = 0;
            if (objects[i].shapeAnnotationType === 'Stamp') {
                rotationValue = 25;
            }
            // tslint:disable-next-line:max-line-length
            if ((((bounds.x - offsetForSelector) * pdfBase.getZoomFactor()) < offsetX) && (((bounds.x + bounds.width + offsetForSelector) * pdfBase.getZoomFactor()) > offsetX) &&
                (((bounds.y - offsetForSelector - rotationValue) * pdfBase.getZoomFactor()) < offsetY) && (((bounds.y + bounds.height + offsetForSelector) * pdfBase.getZoomFactor()) > offsetY)) {
                if (pdfBase.tool instanceof NodeDrawingTool) {
                    actualTarget = objects[i];
                }
                else {
                    if (!boundsDiff) {
                        actualTarget = objects[i];
                        // tslint:disable-next-line:max-line-length
                        boundsDiff = (offsetX - ((bounds.x - offsetForSelector) * pdfBase.getZoomFactor())) + (((bounds.x + bounds.width + offsetForSelector) * pdfBase.getZoomFactor()) - offsetX) +
                            (offsetY - ((bounds.y - offsetForSelector - rotationValue) * pdfBase.getZoomFactor())) + (((bounds.y + bounds.height + offsetForSelector) * pdfBase.getZoomFactor()) - offsetY);
                    }
                    else {
                        // tslint:disable-next-line:max-line-length
                        var objectBounds = (offsetX - ((bounds.x - offsetForSelector) * pdfBase.getZoomFactor())) + (((bounds.x + bounds.width + offsetForSelector) * pdfBase.getZoomFactor()) - offsetX) +
                            (offsetY - ((bounds.y - offsetForSelector - rotationValue) * pdfBase.getZoomFactor())) + (((bounds.y + bounds.height + offsetForSelector) * pdfBase.getZoomFactor()) - offsetY);
                        if (boundsDiff > objectBounds) {
                            actualTarget = objects[i];
                            boundsDiff = objectBounds;
                        }
                    }
                }
            }
        }
        else {
            var pt = { x: offsetX / pdfBase.getZoomFactor(), y: offsetY / pdfBase.getZoomFactor() };
            var obj = findElementUnderMouse(objects[i], pt, offsetForSelector);
            var isOver = isPointOverConnector(objects[i], pt);
            if (obj && !isOver) {
                var newpoint = CalculateLeaderPoints(objects[i], obj);
                if (newpoint) {
                    var rect = Rect.toBounds([newpoint, newpoint]);
                    rect.Inflate(10);
                    if (rect.containsPoint(pt)) {
                        isOver = true;
                    }
                }
            }
            if (obj && isOver) {
                actualTarget = objects[i];
            }
        }
    }
    return actualTarget;
}
/** @private */
// tslint:disable-next-line
export function CalculateLeaderPoints(selector, currentobject) {
    var leaderCount = 0;
    var sourcePoint = selector.sourcePoint;
    var targetPoint = selector.targetPoint;
    if (selector.shapeAnnotationType === 'Distance') {
        var segment = currentobject;
        var newPoint1 = void 0;
        var angle = Point.findAngle(selector.sourcePoint, selector.targetPoint);
        if (segment.id.indexOf('leader') > -1) {
            var center = selector.wrapper.children[0].bounds.center;
            if (leaderCount === 0 && segment.id.indexOf('leader1') > -1) {
                newPoint1 = { x: selector.sourcePoint.x, y: selector.sourcePoint.y - selector.leaderHeight };
                center = sourcePoint;
            }
            else {
                newPoint1 = { x: selector.targetPoint.x, y: selector.targetPoint.y - selector.leaderHeight };
                center = targetPoint;
            }
            var matrix = identityMatrix();
            rotateMatrix(matrix, angle, center.x, center.y);
            var rotatedPoint = transformPointByMatrix(matrix, { x: newPoint1.x, y: newPoint1.y });
            return rotatedPoint;
        }
    }
}
/** @private */
export function findElementUnderMouse(obj, position, padding) {
    return findTargetShapeElement(obj.wrapper, position, padding);
}
/** @private */
export function insertObject(obj, key, collection) {
    if (collection.length === 0) {
        collection.push(obj);
    }
    else if (collection.length === 1) {
        // tslint:disable-next-line
        if (collection[0][key] > obj[key]) {
            collection.splice(0, 0, obj);
        }
        else {
            collection.push(obj);
        }
    }
    else if (collection.length > 1) {
        var low = 0;
        var high = collection.length - 1;
        var mid = Math.floor((low + high) / 2);
        while (mid !== low) {
            // tslint:disable-next-line
            if (collection[mid][key] < obj[key]) {
                low = mid;
                mid = Math.floor((low + high) / 2);
                // tslint:disable-next-line
            }
            else if (collection[mid][key] > obj[key]) {
                high = mid;
                mid = Math.floor((low + high) / 2);
            }
        }
        // tslint:disable-next-line
        if (collection[high][key] < obj[key]) {
            collection.push(obj);
            // tslint:disable-next-line
        }
        else if (collection[low][key] > obj[key]) {
            collection.splice(low, 0, obj);
            // tslint:disable-next-line
        }
        else if ((collection[low][key] < obj[key]) && collection[high][key] > obj[key]) {
            collection.splice(high, 0, obj);
        }
    }
}
/** @private */
export function findTargetShapeElement(container, position, padding) {
    if (container && container.children) {
        for (var i = container.children.length - 1; i >= 0; i--) {
            var shapeElement = container.children[i];
            if (shapeElement && shapeElement.bounds.containsPoint(position, 10)) {
                if (shapeElement instanceof Container) {
                    var targetElement = this.findTargetElement(shapeElement, position);
                    if (targetElement) {
                        return targetElement;
                    }
                }
                if (shapeElement.bounds.containsPoint(position, 10)) {
                    return shapeElement;
                }
            }
        }
    }
    if (container && container.bounds.containsPoint(position, padding) && container.style.fill !== 'none') {
        return container;
    }
    return null;
}
/** @private */
export function findObjects(region, objCollection) {
    var objects = [];
    for (var _i = 0, objCollection_1 = objCollection; _i < objCollection_1.length; _i++) {
        var obj = objCollection_1[_i];
        if (findElementUnderMouse(obj, region, 10) ||
            (obj.shapeAnnotationType === 'Stamp' && findElementUnderMouse(obj, region, 40))) {
            insertObject(obj, 'zIndex', objects);
        }
    }
    return objects;
}
/** @private */
export function findActivePage(event, pdfBase) {
    var activePageID = undefined;
    if (event.target && event.target.wrapper) {
        return event.target.pageIndex;
    }
    if (event.target) {
        var elementIdColl = event.target.id.split('_');
        if (elementIdColl.length > 0) {
            // tslint:disable-next-line:radix
            activePageID = parseInt(elementIdColl[elementIdColl.length - 1]);
        }
    }
    return activePageID;
}
/**
 * @hidden
 */
var ActiveElements = /** @class */ (function () {
    function ActiveElements() {
        this.activePage = undefined;
        this.activePageID = undefined;
    }
    Object.defineProperty(ActiveElements.prototype, "activePageID", {
        /** @private */
        get: function () {
            return this.activePage;
        },
        /** @private */
        set: function (offset) {
            this.activePage = offset;
            // tslint:disable-next-line
            if (offset !== this.activePage) { }
        },
        enumerable: true,
        configurable: true
    });
    return ActiveElements;
}());
export { ActiveElements };
