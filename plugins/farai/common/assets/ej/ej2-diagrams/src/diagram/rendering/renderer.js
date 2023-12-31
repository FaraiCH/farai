import { PathElement } from '../core/elements/path-element';
import { ImageElement } from '../core/elements/image-element';
import { TextElement } from '../core/elements/text-element';
import { Container } from '../core/containers/container';
import { rotateMatrix, identityMatrix, transformPointByMatrix } from '../primitives/matrix';
import { Size } from '../primitives/size';
import { wordBreakToString, whiteSpaceToString, textAlignToString } from '../utility/base-util';
import { getUserHandlePosition, canShowCorner, getInterval, getSpaceValue } from '../utility/diagram-util';
import { getDiagramElement, getAdornerLayer, getGridLayer, getHTMLLayer, updatePath } from '../utility/dom-util';
import { measurePath, getBackgroundLayerSvg, getBackgroundImageLayer, setAttributeSvg } from '../utility/dom-util';
import { SnapConstraints, RendererAction } from '../enum/enum';
import { ThumbsConstraints, SelectorConstraints, ElementAction } from '../enum/enum';
import { SvgRenderer } from './svg-renderer';
import { CanvasRenderer } from './canvas-renderer';
import { processPathData, splitArrayCollection, transformPath } from '../utility/path-util';
import { isDiagramChild } from '../utility/diagram-util';
import { DiagramNativeElement } from '../core/elements/native-element';
import { DiagramHtmlElement } from '../core/elements/html-element';
import { Point } from '../primitives/point';
import { canDrawThumbs, avoidDrawSelector } from '../utility/constraints-util';
/**
 * Renderer module is used to render basic diagram elements
 */
/** @private */
var DiagramRenderer = /** @class */ (function () {
    function DiagramRenderer(name, svgRender, isSvgMode) {
        /**   @private  */
        this.renderer = null;
        /** @private */
        this.isSvgMode = true;
        this.transform = { x: 0, y: 0 };
        this.diagramId = name;
        this.element = getDiagramElement(this.diagramId);
        this.svgRenderer = svgRender;
        this.isSvgMode = isSvgMode;
        this.renderer = isSvgMode ? new SvgRenderer() : new CanvasRenderer();
    }
    /**   @private  */
    DiagramRenderer.prototype.setCursor = function (canvas, cursor) {
        canvas.style.cursor = cursor;
    };
    /** @private */
    DiagramRenderer.prototype.setLayers = function () {
        this.iconSvgLayer = this.element.getElementsByClassName('e-ports-expand-layer')[0];
        this.adornerSvgLayer = this.element.getElementsByClassName('e-adorner-layer')[0];
        this.nativeSvgLayer = this.element.getElementsByClassName('e-native-layer')[0];
        this.diagramSvgLayer = this.element.getElementsByClassName('e-diagram-layer')[0];
    };
    DiagramRenderer.prototype.getAdornerLayer = function () {
        var adornerLayer = getAdornerLayer(this.diagramId);
        return adornerLayer;
    };
    DiagramRenderer.prototype.getParentSvg = function (element, targetElement, canvas) {
        if (this.diagramId && element && element.id) {
            if (element.id.split('_icon_content').length > 1 || element.id.split('_nodeport').length > 1 ||
                (element.elementActions & ElementAction.ElementIsPort)) {
                return this.iconSvgLayer;
            }
            if (targetElement && targetElement === 'selector') {
                return this.adornerSvgLayer;
            }
            else if (element instanceof DiagramNativeElement) {
                return this.nativeSvgLayer;
            }
            else {
                return this.diagramSvgLayer;
            }
        }
        return canvas;
    };
    DiagramRenderer.prototype.getParentElement = function (element, defaultParent, svgElement, indexValue) {
        var layerGElement = defaultParent;
        if (svgElement && this.diagramId && element && element.id) {
            if (element.id.split('_icon_content').length > 1) {
                layerGElement = svgElement.getElementById(this.diagramId + '_diagramExpander');
                defaultParent = null;
            }
            else if (element.id.split('_nodeport').length > 1) {
                layerGElement = svgElement.getElementById(this.diagramId + '_diagramPorts');
            }
            else if (element instanceof DiagramNativeElement) {
                layerGElement = svgElement.getElementById(this.diagramId + '_nativeLayer');
                defaultParent = null;
            }
            else if (element.elementActions & ElementAction.ElementIsPort) {
                layerGElement = svgElement.getElementById(this.diagramId + '_diagramPorts');
                defaultParent = null;
            }
            else {
                layerGElement = svgElement.getElementById(this.diagramId + '_diagramLayer');
            }
            var groupElement = this.getGroupElement(element, defaultParent || layerGElement, indexValue);
            layerGElement = groupElement.g;
            if (groupElement.svg) {
                svgElement = groupElement.svg;
            }
        }
        return { g: layerGElement, svg: svgElement };
    };
    DiagramRenderer.prototype.getGroupElement = function (element, canvas, indexValue) {
        var gElement;
        var parentSvg = this.getParentSvg(element);
        var svgElement;
        if (canvas && parentSvg) {
            if (parentSvg) {
                gElement = parentSvg.getElementById(element.id + '_groupElement');
                if (!gElement && parentSvg !== this.nativeSvgLayer) { //code added
                    var nativeSvg = this.nativeSvgLayer;
                    gElement = nativeSvg.getElementById(element.id + '_groupElement');
                    svgElement = nativeSvg;
                }
            }
            if (!gElement) {
                gElement = this.svgRenderer.createGElement('g', { id: element.id + '_groupElement' });
                if (indexValue !== undefined && canvas.childNodes.length > indexValue) {
                    canvas.insertBefore(gElement, canvas.childNodes[indexValue]);
                }
                else {
                    canvas.appendChild(gElement);
                }
            }
        }
        return { g: gElement, svg: svgElement };
    };
    /**   @private  */
    DiagramRenderer.prototype.renderElement = function (element, canvas, htmlLayer, transform, parentSvg, createParent, fromPalette, indexValue, isPreviewNode) {
        var isElement = true;
        if (element instanceof Container) {
            isElement = false;
            this.renderContainer(element, canvas, htmlLayer, transform, parentSvg, createParent, fromPalette, indexValue, isPreviewNode);
        }
        else if (element instanceof ImageElement) {
            this.renderImageElement(element, canvas, transform, parentSvg, fromPalette);
        }
        else if (element instanceof PathElement) {
            this.renderPathElement(element, canvas, transform, parentSvg, fromPalette, isPreviewNode);
        }
        else if (element instanceof TextElement) {
            this.renderTextElement(element, canvas, transform, parentSvg, fromPalette);
        }
        else if (element instanceof DiagramNativeElement) {
            this.renderNativeElement(element, canvas, transform, parentSvg, fromPalette);
        }
        else if (element instanceof DiagramHtmlElement) {
            this.renderHTMLElement(element, canvas, htmlLayer, transform, parentSvg, fromPalette, indexValue);
        }
        else {
            this.renderRect(element, canvas, transform, parentSvg, isPreviewNode);
        }
    };
    /**   @private  */
    DiagramRenderer.prototype.drawSelectionRectangle = function (x, y, w, h, canvas, t) {
        x = (x + t.tx) * t.scale;
        y = (y + t.ty) * t.scale;
        var options = {
            width: w * t.scale, height: h * t.scale,
            x: x + 0.5, y: y + 0.5, fill: 'transparent', stroke: 'gray', angle: 0,
            pivotX: 0.5, pivotY: 0.5, strokeWidth: 1,
            dashArray: '6 3', opacity: 1,
            visible: true, id: canvas.id + '_selected_region'
        };
        var adornerLayer = this.getAdornerLayer();
        this.svgRenderer.updateSelectionRegion(adornerLayer, options);
    };
    /**
     * @private
     */
    DiagramRenderer.prototype.renderHighlighter = function (element, canvas, transform) {
        var width = element.actualSize.width || 2;
        var height = element.actualSize.height || 2;
        var x = element.offsetX - width * element.pivot.x;
        var y = element.offsetY - height * element.pivot.y;
        x = (x + transform.tx) * transform.scale;
        y = (y + transform.ty) * transform.scale;
        var options = {
            width: width * transform.scale, height: height * transform.scale,
            x: x, y: y, fill: 'transparent', stroke: '#8CC63F', angle: element.rotateAngle,
            pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: 4,
            dashArray: '', opacity: 1, cornerRadius: 0,
            visible: true, id: canvas.id + '_highlighter', class: 'e-diagram-highlighter'
        };
        this.svgRenderer.drawRectangle(canvas, options, this.diagramId, undefined, undefined, canvas);
    };
    /**
     * @private
     */
    DiagramRenderer.prototype.renderStackHighlighter = function (element, canvas, transform, isVertical, position, isUml, isSwimlane) {
        var width = element.actualSize.width || 2;
        var x = element.offsetX - width * element.pivot.x;
        var height = element.actualSize.height || 2;
        var y = element.offsetY - height * element.pivot.y;
        x = (x + transform.tx) * transform.scale;
        var data;
        var bounds = element.bounds;
        var newPathString = '';
        y = (y + transform.ty) * transform.scale;
        if (!isVertical) {
            var d = height * transform.scale;
            data = 'M 10 -10 L 0 0 Z M -10 -10 L 0 0 Z M 0 0 L 0 ' + (d) + ' Z M 0  ' + (d) +
                ' L -10  ' + (d + 10) + ' Z L 10  ' + (d + 10) + ' Z';
            if (position.x >= element.offsetX) {
                x += width;
            }
        }
        else {
            if (isUml) {
                var d = width * transform.scale;
                data = 'M 0 0 L ' + (d + 2) + ' 0 Z';
                var scaleX = -bounds.x;
                var scaleY = -bounds.y;
                var arrayCollection = [];
                scaleX = element.actualSize.width / Number(bounds.width ? bounds.width : 1) * transform.scale;
                scaleY = element.actualSize.height / Number(bounds.height ? bounds.height : 1) * transform.scale;
                var umlData = 'M7,4 L8,4 8,7 11,7 11,8 8,8 8,11 7,11 7,8 4,8 4,7 7,7 z M7.5,0.99999994' +
                    'C3.9160004,1 1,3.9160004 0.99999994,7.5 1,11.084 3.9160004,14 7.5,14 11.084,14 14,11.084 14,7.5 14,' +
                    '3.9160004 11.084,1 7.5,0.99999994 z M7.5,0 C11.636002,0 15,3.3639984 15,7.5 15,11.636002 11.636002,15 7.5,' +
                    '15 3.3640003,15 0,11.636002 0,7.5 0,3.3639984 3.3640003,0 7.5,0 z';
                arrayCollection = processPathData(umlData);
                arrayCollection = splitArrayCollection(arrayCollection);
                newPathString = transformPath(arrayCollection, scaleX + d + 2, scaleY - 8, false, bounds.x, bounds.y, 0, 0);
                if (position.y >= element.offsetY) {
                    y += height;
                }
            }
            else {
                if (isSwimlane) {
                    if (position.y >= element.offsetY) {
                        y += height;
                    }
                }
                var d = width * transform.scale;
                data = 'M -10 -10 L 0 0 Z M -10 10 L 0 0 Z M 0 0 L ' + (d) + ' 0 Z M ' + (d) + ' 0 L ' +
                    (d + 10) + ' 10 Z L ' + (d + 10) + ' -10 Z';
            }
        }
        var options = {
            data: data + newPathString,
            width: width * transform.scale, height: height * transform.scale,
            x: x, y: y, fill: 'transparent', stroke: '#8CC63F', angle: element.rotateAngle,
            pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: 1,
            dashArray: '', opacity: 1,
            visible: true, id: canvas.id + '_stack_highlighter', class: 'e-diagram-highlighter',
        };
        this.svgRenderer.drawPath(canvas, options, this.diagramId);
    };
    /**   @private  */
    DiagramRenderer.prototype.drawLine = function (canvas, options) {
        this.svgRenderer.drawLine(canvas, options);
    };
    /**   @private  */
    DiagramRenderer.prototype.drawPath = function (canvas, options) {
        this.svgRenderer.drawPath(canvas, options, this.diagramId);
    };
    /**   @private  */
    DiagramRenderer.prototype.renderResizeHandle = function (element, canvas, constraints, currentZoom, selectorConstraints, transform, canMask, enableNode, nodeConstraints, isSwimlane) {
        var left = element.offsetX - element.actualSize.width * element.pivot.x;
        var top = element.offsetY - element.actualSize.height * element.pivot.y;
        var height = element.actualSize.height;
        var width = element.actualSize.width;
        if (!isSwimlane &&
            (constraints & ThumbsConstraints.Rotate && canDrawThumbs(this.rendererActions) && (!avoidDrawSelector(this.rendererActions)))) {
            this.renderPivotLine(element, canvas, transform, selectorConstraints, canMask);
            this.renderRotateThumb(element, canvas, transform, selectorConstraints, canMask);
        }
        this.renderBorder(element, canvas, transform, enableNode, nodeConstraints, isSwimlane);
        var nodeWidth = element.actualSize.width * currentZoom;
        var nodeHeight = element.actualSize.height * currentZoom;
        if (!nodeConstraints && canDrawThumbs(this.rendererActions) && (!avoidDrawSelector(this.rendererActions))) {
            if (nodeWidth >= 40 && nodeHeight >= 40) {
                //Hide corners when the size is less than 40
                if (selectorConstraints & SelectorConstraints.ResizeNorthWest) {
                    this.renderCircularHandle('resizeNorthWest', element, left, top, canvas, canShowCorner(selectorConstraints, 'ResizeNorthWest'), constraints & ThumbsConstraints.ResizeNorthWest, transform, undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on top left side direction' }, undefined, 'e-diagram-resize-handle e-northwest');
                }
                if (selectorConstraints & SelectorConstraints.ResizeNorthEast) {
                    this.renderCircularHandle('resizeNorthEast', element, left + width, top, canvas, canShowCorner(selectorConstraints, 'ResizeNorthEast'), constraints & ThumbsConstraints.ResizeNorthEast, transform, undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on top right side direction' }, undefined, 'e-diagram-resize-handle e-northeast');
                }
                if (selectorConstraints & SelectorConstraints.ResizeSouthWest) {
                    this.renderCircularHandle('resizeSouthWest', element, left, top + height, canvas, canShowCorner(selectorConstraints, 'ResizeSouthWest'), constraints & ThumbsConstraints.ResizeSouthWest, transform, undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on bottom left side direction' }, undefined, 'e-diagram-resize-handle e-southwest');
                }
                if (selectorConstraints & SelectorConstraints.ResizeSouthEast) {
                    this.renderCircularHandle('resizeSouthEast', element, left + width, top + height, canvas, canShowCorner(selectorConstraints, 'ResizeSouthEast'), constraints & ThumbsConstraints.ResizeSouthEast, transform, undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on bottom right side direction' }, undefined, 'e-diagram-resize-handle e-southeast');
                }
            }
            if (selectorConstraints & SelectorConstraints.ResizeNorth) {
                this.renderCircularHandle('resizeNorth', element, left + width / 2, top, canvas, canShowCorner(selectorConstraints, 'ResizeNorth'), constraints & ThumbsConstraints.ResizeNorth, transform, undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on top side direction' }, undefined, 'e-diagram-resize-handle e-north');
            }
            if (selectorConstraints & SelectorConstraints.ResizeSouth) {
                this.renderCircularHandle('resizeSouth', element, left + width / 2, top + height, canvas, canShowCorner(selectorConstraints, 'ResizeSouth'), constraints & ThumbsConstraints.ResizeSouth, transform, undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on bottom side direction' }, undefined, 'e-diagram-resize-handle e-south');
            }
            if (selectorConstraints & SelectorConstraints.ResizeWest) {
                this.renderCircularHandle('resizeWest', element, left, top + height / 2, canvas, canShowCorner(selectorConstraints, 'ResizeWest'), constraints & ThumbsConstraints.ResizeWest, transform, undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on left side direction' }, undefined, 'e-diagram-resize-handle e-west');
            }
            if (selectorConstraints & SelectorConstraints.ResizeEast) {
                this.renderCircularHandle('resizeEast', element, left + width, top + height / 2, canvas, canShowCorner(selectorConstraints, 'ResizeEast'), constraints & ThumbsConstraints.ResizeEast, transform, undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on right side direction' }, undefined, 'e-diagram-resize-handle e-east');
            }
        }
    };
    /**   @private  */
    DiagramRenderer.prototype.renderEndPointHandle = function (selector, canvas, constraints, selectorConstraints, transform, connectedSource, connectedTarget, isSegmentEditing) {
        var sourcePoint = selector.sourcePoint;
        var targetPoint = selector.targetPoint;
        var wrapper = selector.wrapper;
        var i;
        var segment;
        this.renderCircularHandle('connectorSourceThumb', wrapper, sourcePoint.x, sourcePoint.y, canvas, canShowCorner(selectorConstraints, 'ConnectorSourceThumb'), constraints & ThumbsConstraints.ConnectorSource, transform, connectedSource, undefined, { 'aria-label': 'Thumb to move the source point of the connector' }, undefined, 'e-diagram-endpoint-handle e-targetend');
        this.renderCircularHandle('connectorTargetThumb', wrapper, targetPoint.x, targetPoint.y, canvas, canShowCorner(selectorConstraints, 'ConnectorTargetThumb'), constraints & ThumbsConstraints.ConnectorTarget, transform, connectedTarget, undefined, { 'aria-label': 'Thumb to move the target point of the connector' }, undefined, 'e-diagram-endpoint-handle e-targetend');
        if (isSegmentEditing) {
            if ((selector.type === 'Straight' || selector.type === 'Bezier') && selector.segments.length > 0) {
                for (i = 0; i < selector.segments.length - 1; i++) {
                    segment = selector.segments[i];
                    this.renderCircularHandle(('segementThumb_' + (i + 1)), wrapper, segment.point.x, segment.point.y, canvas, true, constraints & ThumbsConstraints.ConnectorSource, transform, connectedSource, null, null, i);
                }
            }
            else {
                for (i = 0; i < selector.segments.length; i++) {
                    var seg = selector.segments[i];
                    this.renderOrthogonalThumbs('orthoThumb_' + (i + 1), wrapper, seg, canvas, canShowCorner(selectorConstraints, 'ConnectorSourceThumb'), transform);
                }
            }
        }
        if (selector.type === 'Bezier') {
            for (i = 0; i < selector.segments.length; i++) {
                var segment_1 = selector.segments[i];
                var bezierPoint = !Point.isEmptyPoint(segment_1.point1) ? segment_1.point1
                    : segment_1.bezierPoint1;
                this.renderCircularHandle('bezierPoint_' + (i + 1) + '_1', wrapper, bezierPoint.x, bezierPoint.y, canvas, canShowCorner(selectorConstraints, 'ConnectorSourceThumb'), constraints & ThumbsConstraints.ConnectorSource, transform, undefined, undefined, { 'aria-label': 'Thumb to move the source point of the connector' }, undefined, 'e-diagram-bezier-handle e-source');
                if (canShowCorner(selectorConstraints, 'ConnectorSourceThumb')) {
                    this.renderBezierLine('bezierLine_' + (i + 1) + '_1', wrapper, canvas, segment_1.points[0], !Point.isEmptyPoint(segment_1.point1) ? segment_1.point1 : segment_1.bezierPoint1, transform);
                }
                bezierPoint = !Point.isEmptyPoint(segment_1.point2) ? segment_1.point2 : segment_1.bezierPoint2;
                this.renderCircularHandle('bezierPoint_' + (i + 1) + '_2', wrapper, bezierPoint.x, bezierPoint.y, canvas, canShowCorner(selectorConstraints, 'ConnectorTargetThumb'), constraints & ThumbsConstraints.ConnectorTarget, transform, undefined, undefined, { 'aria-label': 'Thumb to move the target point of the connector' }, undefined, 'e-diagram-bezier-handle e-target');
                if (canShowCorner(selectorConstraints, 'ConnectorTargetThumb')) {
                    this.renderBezierLine('bezierLine_' + (i + 1) + '_2', wrapper, canvas, segment_1.points[1], !Point.isEmptyPoint(segment_1.point2) ? segment_1.point2 : segment_1.bezierPoint2, transform);
                }
            }
        }
    };
    /**   @private  */
    DiagramRenderer.prototype.renderOrthogonalThumbs = function (id, selector, segment, canvas, visibility, t) {
        var orientation;
        var visible;
        var length;
        var j = 0;
        for (j = 0; j < segment.points.length - 1; j++) {
            length = Point.distancePoints(segment.points[j], segment.points[j + 1]);
            orientation = (segment.points[j].y.toFixed(2) === segment.points[j + 1].y.toFixed(2)) ? 'horizontal' : 'vertical';
            visible = (length >= 50 && segment.allowDrag) ? true : false;
            this.renderOrthogonalThumb((id + '_' + (j + 1)), selector, (((segment.points[j].x + segment.points[j + 1].x) / 2)), (((segment.points[j].y + segment.points[j + 1].y) / 2)), canvas, visible, orientation, t);
        }
    };
    /**   @private  */
    DiagramRenderer.prototype.renderOrthogonalThumb = function (id, selector, x, y, canvas, visible, orientation, t) {
        var path;
        var h;
        var v;
        if (orientation === 'horizontal') {
            path = 'M0,7 L15,0 L30,7 L15,14 z';
            h = -15;
            v = -7;
        }
        else {
            path = 'M7,0 L0,15 L7,30 L14,15 z';
            h = -7;
            v = -15;
        }
        var options = {
            x: ((x + t.tx) * t.scale) + h, y: ((y + t.ty) * t.scale) + v, angle: 0,
            fill: '#e2e2e2', stroke: 'black', strokeWidth: 1, dashArray: '', data: path,
            width: 20, height: 20, pivotX: 0, pivotY: 0, opacity: 1, visible: visible, id: id
        };
        this.svgRenderer.drawPath(canvas, options, this.diagramId);
    };
    /**   @private  */
    DiagramRenderer.prototype.renderPivotLine = function (element, canvas, transform, selectorConstraints, canMask) {
        var wrapper = element;
        var dashArray = '2,3';
        var visible = (selectorConstraints & SelectorConstraints.Rotate) ? true : false;
        if (canMask) {
            visible = false;
        }
        var options = this.getBaseAttributes(wrapper, transform);
        options.fill = 'None';
        options.stroke = 'black';
        options.strokeWidth = 1;
        options.dashArray = dashArray;
        options.visible = visible;
        var scale = transform.scale;
        options.x *= scale;
        options.y *= scale;
        options.width *= scale;
        options.height *= scale;
        options.id = 'pivotLine';
        options.class = 'e-diagram-pivot-line';
        var startPoint = { x: wrapper.actualSize.width * wrapper.pivot.x * scale, y: -20 };
        var endPoint = { x: wrapper.actualSize.width * wrapper.pivot.x * scale, y: 0 };
        options.startPoint = startPoint;
        options.endPoint = endPoint;
        this.svgRenderer.drawLine(canvas, options);
    };
    /**   @private  */
    DiagramRenderer.prototype.renderBezierLine = function (id, wrapper, canvas, start, end, transform) {
        var dashArray = '3,3';
        var options = this.getBaseAttributes(wrapper, transform);
        options.id = id;
        options.stroke = 'black';
        options.strokeWidth = 1;
        options.dashArray = dashArray;
        options.fill = 'None';
        options.class = 'e-diagram-bezier-line';
        options.x = 0;
        options.y = 0;
        var scale = transform.scale;
        var x1 = (start.x + transform.tx) * scale;
        var y1 = (start.y + transform.ty) * scale;
        var x2 = (end.x + transform.tx) * scale;
        var y2 = (end.y + transform.ty) * scale;
        var startPoint = { x: x1, y: y1 };
        var endPoint = { x: x2, y: y2 };
        options.startPoint = startPoint;
        options.endPoint = endPoint;
        this.svgRenderer.drawLine(canvas, options);
    };
    /**   @private  */
    DiagramRenderer.prototype.renderCircularHandle = function (id, selector, cx, cy, canvas, visible, enableSelector, t, connected, canMask, ariaLabel, count, className) {
        var wrapper = selector;
        var radius = 7;
        var newPoint = { x: cx, y: cy };
        if (wrapper.rotateAngle !== 0 || wrapper.parentTransform !== 0) {
            var matrix = identityMatrix();
            rotateMatrix(matrix, wrapper.rotateAngle + wrapper.parentTransform, wrapper.offsetX, wrapper.offsetY);
            newPoint = transformPointByMatrix(matrix, newPoint);
        }
        var options = this.getBaseAttributes(wrapper);
        options.stroke = 'black';
        options.strokeWidth = 1;
        if (count !== undefined) {
            radius = 5;
            options.id = 'segmentEnd_' + count;
            options.fill = '#e2e2e2';
        }
        else {
            radius = 7;
            options.fill = connected ? '#8CC63F' : 'white';
        }
        options.centerX = (newPoint.x + t.tx) * t.scale;
        options.centerY = (newPoint.y + t.ty) * t.scale;
        options.radius = radius;
        options.angle = 0;
        options.id = id;
        options.visible = visible;
        options.class = className;
        if (connected) {
            options.class += ' e-connected';
        }
        if (canMask) {
            options.visible = false;
        }
        this.svgRenderer.drawCircle(canvas, options, enableSelector, ariaLabel);
    };
    /**   @private  */
    DiagramRenderer.prototype.renderBorder = function (selector, canvas, transform, enableNode, isBorderTickness, isSwimlane) {
        var wrapper = selector;
        var options = this.getBaseAttributes(wrapper, transform);
        options.x *= transform.scale;
        options.y *= transform.scale;
        options.width *= transform.scale;
        options.height *= transform.scale;
        options.fill = 'transparent';
        options.stroke = '#097F7F';
        options.strokeWidth = 1.2;
        options.gradient = null;
        options.dashArray = '6,3';
        options.class = 'e-diagram-border';
        if (isSwimlane) {
            options.class += ' e-diagram-lane';
        }
        options.id = 'borderRect';
        options.id = (this.rendererActions & RendererAction.DrawSelectorBorder) ? 'borderRect_symbol' : 'borderRect';
        if (!enableNode) {
            options.class += ' e-disabled';
        }
        if (isBorderTickness) {
            options.class += ' e-thick-border';
        }
        options.cornerRadius = 0;
        var parentSvg = this.getParentSvg(selector, 'selector');
        this.svgRenderer.drawRectangle(canvas, options, this.diagramId, undefined, true, parentSvg);
    };
    /**   @private  */
    DiagramRenderer.prototype.renderUserHandler = function (selectorItem, canvas, transform, diagramUserHandlelayer) {
        var wrapper = selectorItem.wrapper;
        var canDraw;
        for (var _i = 0, _a = selectorItem.userHandles; _i < _a.length; _i++) {
            var obj = _a[_i];
            canDraw = true;
            if ((obj.disableConnectors && selectorItem.connectors.length > 0) ||
                (obj.disableNodes && selectorItem.nodes.length > 0)) {
                canDraw = false;
            }
            var div = document.getElementById(obj.name + '_template_hiddenUserHandle');
            if (div) {
                obj.template = (div.childNodes[0]).cloneNode(true);
            }
            var newPoint = void 0;
            newPoint = getUserHandlePosition(selectorItem, obj, transform);
            newPoint.x = (newPoint.x + transform.tx) * transform.scale;
            newPoint.y = (newPoint.y + transform.ty) * transform.scale;
            if (obj.visible) {
                obj.visible = (selectorItem.constraints & SelectorConstraints.UserHandle) ? true : false;
            }
            if (canDraw) {
                if (obj.pathData) {
                    var data = obj.pathData ? obj.pathData : obj.content;
                    var option = this.getBaseAttributes(wrapper);
                    option.id = obj.name + '_userhandle';
                    option.fill = obj.backgroundColor;
                    option.stroke = obj.borderColor;
                    option.strokeWidth = obj.borderWidth;
                    option.centerX = newPoint.x;
                    option.centerY = newPoint.y;
                    option.radius = obj.size * 0.5;
                    option.class = 'e-diagram-userhandle-circle';
                    option.angle = 0;
                    option.visible = obj.visible;
                    option.opacity = 1;
                    this.svgRenderer.drawCircle(canvas, option, 1, { 'aria-label': obj.name + 'user handle' });
                    var pathPading = 5;
                    var arrayCollection = [];
                    arrayCollection = processPathData(data);
                    arrayCollection = splitArrayCollection(arrayCollection);
                    var pathSize = measurePath(data);
                    //requiredSize/contentSize
                    var scaleX = (obj.size - 0.45 * obj.size) / pathSize.width;
                    var scaleY = (obj.size - 0.45 * obj.size) / pathSize.height;
                    var newData = transformPath(arrayCollection, scaleX, scaleY, true, pathSize.x, pathSize.y, 0, 0);
                    pathSize = measurePath(newData);
                    var options = {
                        x: newPoint.x - pathSize.width / 2,
                        y: newPoint.y - pathSize.height / 2, angle: 0, id: '',
                        class: 'e-diagram-userhandle-path', fill: obj.pathColor,
                        stroke: obj.backgroundColor, strokeWidth: 0.5, dashArray: '', data: newData,
                        width: obj.size - pathPading, height: obj.size - pathPading, pivotX: 0, pivotY: 0, opacity: 1, visible: obj.visible
                    };
                    this.svgRenderer.drawPath(canvas, options, this.diagramId, undefined, undefined, { 'aria-label': obj.name + 'user handle' });
                }
                else if (obj.content) {
                    var handleContent = void 0;
                    handleContent = new DiagramNativeElement(obj.name, this.diagramId);
                    handleContent.content = obj.content;
                    handleContent.offsetX = newPoint.x;
                    handleContent.offsetY = newPoint.y;
                    handleContent.id = obj.name + '_shape';
                    handleContent.horizontalAlignment = 'Center';
                    handleContent.verticalAlignment = 'Center';
                    handleContent.visible = obj.visible;
                    handleContent.setOffsetWithRespectToBounds(newPoint.x, newPoint.y, 'Fraction');
                    handleContent.relativeMode = 'Object';
                    handleContent.description = obj.name || 'User handle';
                    handleContent.measure(new Size(obj.size, obj.size));
                    handleContent.arrange(handleContent.desiredSize);
                    this.svgRenderer.drawNativeContent(handleContent, canvas, obj.size, obj.size, this.adornerSvgLayer);
                }
                else if (obj.source) {
                    var element = new ImageElement();
                    var options = this.getBaseAttributes(element, transform);
                    options.width = obj.size;
                    options.height = obj.size;
                    options.x = newPoint.x - (obj.size / 2);
                    options.y = newPoint.y - (obj.size / 2);
                    options.sourceWidth = obj.size;
                    options.sourceHeight = obj.size;
                    options.alignment = element.imageAlign;
                    options.source = obj.source;
                    options.scale = element.imageScale;
                    options.visible = obj.visible;
                    options.description = obj.name || 'User handle';
                    options.id = obj.name + '_';
                    this.renderer.drawImage(canvas, options, this.adornerSvgLayer, false);
                }
                else {
                    var templateContent = void 0;
                    templateContent = new DiagramHtmlElement(obj.name, this.diagramId);
                    templateContent.offsetX = newPoint.x;
                    templateContent.offsetY = newPoint.y;
                    templateContent.id = obj.name + '_shape';
                    templateContent.visible = obj.visible;
                    templateContent.relativeMode = 'Object';
                    templateContent.template = obj.template;
                    templateContent.measure(new Size(obj.size, obj.size));
                    templateContent.arrange(templateContent.desiredSize);
                    this.svgRenderer.drawHTMLContent(templateContent, diagramUserHandlelayer, undefined, true, undefined);
                }
            }
        }
    };
    /**   @private  */
    DiagramRenderer.prototype.renderRotateThumb = function (wrapper, canvas, transform, selectorConstraints, canMask) {
        var element = new PathElement();
        var newPoint;
        var size = new Size();
        size.width = 18;
        size.height = 16;
        var top = wrapper.offsetY - wrapper.actualSize.height * wrapper.pivot.y;
        var left = wrapper.offsetX - wrapper.actualSize.width * wrapper.pivot.x;
        var visible = (selectorConstraints & SelectorConstraints.Rotate) ? true : false;
        if (canMask) {
            visible = false;
        }
        var data = 'M 16.856144362449648 10.238890446662904 L 18.000144362449646 3.437890446662903' +
            'L 15.811144362449646 4.254890446662903 C 14.837144362449646 2.5608904466629028 13.329144362449647 ' +
            ' 1.2598904466629026 11.485144362449645 0.5588904466629026 C 9.375144362449646 - 0.24510955333709716 7.071144362449646 ' +
            ' - 0.18010955333709716 5.010144362449646 0.7438904466629028 C 2.942144362449646 1.6678904466629028 1.365144362449646' +
            ' 3.341890446662903 0.558144362449646 5.452890446662903 C - 0.244855637550354 7.567890446662903 - 0.17985563755035394' +
            ' 9.866890446662904 0.7431443624496461 11.930890446662904 C 1.6681443624496461 13.994890446662904 3.343144362449646' +
            ' 15.575890446662903 5.457144362449647 16.380890446662903 C 6.426144362449647 16.7518904466629 7.450144362449647' +
            ' 16.9348904466629 8.470144362449647 16.9348904466629 C 9.815144362449647 16.9348904466629 11.155144362449647 ' +
            '16.6178904466629 12.367144362449647 15.986890446662901 L 11.351144362449647 14.024890446662901 C 9.767144362449647' +
            ' 14.8468904466629 7.906144362449647 14.953890446662902 6.237144362449647 14.3178904466629 C 4.677144362449647' +
            ' 13.7218904466629 3.444144362449647 12.5558904466629 2.758144362449647 11.028890446662901 C 2.078144362449646 ' +
            '9.501890446662903 2.031144362449646 7.802890446662903 2.622144362449646 6.243890446662903 C 3.216144362449646' +
            ' 4.6798904466629025 4.387144362449646 3.442890446662903 5.914144362449646 2.760890446662903 C 7.437144362449646 ' +
            '2.078890446662903 9.137144362449646 2.0298904466629026 10.700144362449645 2.6258904466629027 C 11.946144362449646 ' +
            '3.100890446662903 12.971144362449646 3.9538904466629026 13.686144362449646 5.049890446662903 L 11.540144362449645 ' +
            '5.850890446662903 L 16.856144362449648 10.238890446662904 Z';
        var pivotX = left + wrapper.pivot.x * wrapper.actualSize.width;
        var pivotY = top;
        pivotX = (pivotX + transform.tx) * transform.scale;
        pivotY = (pivotY + transform.ty) * transform.scale;
        newPoint = { x: pivotX - size.width * 0.5, y: pivotY - 30 - size.height * 0.5 };
        if (wrapper.rotateAngle !== 0 || wrapper.parentTransform !== 0) {
            var matrix = identityMatrix();
            rotateMatrix(matrix, wrapper.rotateAngle + wrapper.parentTransform, (transform.tx + wrapper.offsetX) * transform.scale, (transform.ty + wrapper.offsetY) * transform.scale);
            newPoint = transformPointByMatrix(matrix, newPoint);
        }
        var options = {
            x: newPoint.x,
            y: newPoint.y,
            angle: wrapper.rotateAngle + wrapper.parentTransform,
            fill: '#231f20', stroke: 'black', strokeWidth: 0.5, dashArray: '', data: data,
            width: 20, height: 20, pivotX: 0, pivotY: 0, opacity: 1, visible: visible, id: wrapper.id, class: 'e-diagram-rotate-handle'
        };
        options.id = 'rotateThumb';
        this.svgRenderer.drawPath(canvas, options, this.diagramId, true, undefined, { 'aria-label': 'Thumb to rotate the selected object' });
    };
    /**   @private  */
    DiagramRenderer.prototype.renderPathElement = function (element, canvas, transform, parentSvg, fromPalette, isPreviewNode) {
        var options = this.getBaseAttributes(element, transform, isPreviewNode);
        options.data = element.absolutePath;
        options.data = element.absolutePath;
        var ariaLabel = element.description ? element.description : element.id;
        if (!this.isSvgMode) {
            options.x = element.flipOffset.x ? element.flipOffset.x : options.x;
            options.y = element.flipOffset.y ? element.flipOffset.y : options.y;
        }
        if (element.isExport) {
            var pathBounds = element.absoluteBounds;
            options.data = updatePath(element, pathBounds, undefined, options);
        }
        this.renderer.drawPath(canvas, options, this.diagramId, undefined, parentSvg, ariaLabel);
    };
    /**   @private  */
    DiagramRenderer.prototype.renderSvgGridlines = function (snapSettings, gridSvg, t, rulerSettings, hRuler, vRuler) {
        var pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.setAttribute('id', this.diagramId + '_grid_pattern_defn');
        if (snapSettings.constraints & SnapConstraints.ShowHorizontalLines ||
            snapSettings.constraints & SnapConstraints.ShowVerticalLines) {
            pattern.setAttribute('id', this.diagramId + '_pattern');
        }
        var hWidth = 0;
        var hHeight = 0;
        var hSegmentwidth = 0;
        var vSegmentwidth = 0;
        var scale = 1;
        var isRulerGrid = false;
        var isLine = snapSettings.gridType === 'Lines';
        var verticalLineIntervals = isLine ?
            snapSettings.verticalGridlines.lineIntervals : snapSettings.verticalGridlines.dotIntervals;
        var horizontalLineIntervals = isLine ?
            snapSettings.horizontalGridlines.lineIntervals : snapSettings.horizontalGridlines.dotIntervals;
        if (rulerSettings.showRulers && rulerSettings.dynamicGrid && hRuler && vRuler) {
            hSegmentwidth = vRuler.updateSegmentWidth(t.scale);
            vSegmentwidth = hRuler.updateSegmentWidth(t.scale);
            snapSettings.horizontalGridlines.scaledIntervals = [hSegmentwidth / hRuler.interval];
            snapSettings.verticalGridlines.scaledIntervals = [vSegmentwidth / vRuler.interval];
            isRulerGrid = true;
        }
        else {
            for (var i = 0; i < verticalLineIntervals.length; i = i + 1) {
                hWidth += verticalLineIntervals[i];
            }
            for (var i = 0; i < horizontalLineIntervals.length; i = i + 1) {
                hHeight += horizontalLineIntervals[i];
            }
            scale = this.scaleSnapInterval(snapSettings, t.scale);
        }
        hWidth = isRulerGrid ? vSegmentwidth : hWidth * scale;
        hHeight = isRulerGrid ? hSegmentwidth : hHeight * scale;
        var attr = {
            id: this.diagramId + '_pattern', x: 0, y: 0, width: hWidth,
            height: hHeight, patternUnits: 'userSpaceOnUse'
        };
        setAttributeSvg(pattern, attr);
        this.horizontalSvgGridlines(pattern, hWidth, hHeight, scale, snapSettings, rulerSettings, vRuler, isRulerGrid, isLine, horizontalLineIntervals);
        this.verticalSvgGridlines(pattern, hWidth, hHeight, scale, snapSettings, rulerSettings, hRuler, isRulerGrid, isLine, verticalLineIntervals);
        defs.appendChild(pattern);
        gridSvg.appendChild(defs);
    };
    DiagramRenderer.prototype.horizontalSvgGridlines = function (pattern, hWidth, hHeight, scale, snapSettings, rulerSettings, vRuler, isRulerGrid, isLine, intervals) {
        var space = 0;
        var dashArray = [];
        var hLine;
        if (snapSettings.constraints & SnapConstraints.ShowHorizontalLines) {
            if (snapSettings.horizontalGridlines.lineDashArray) {
                dashArray = this.renderer.parseDashArray(snapSettings.horizontalGridlines.lineDashArray);
            }
            if (rulerSettings.showRulers && rulerSettings.dynamicGrid && vRuler) {
                intervals = this.updateLineIntervals(intervals, rulerSettings, vRuler, hHeight, isLine);
            }
            intervals = getInterval(intervals, isLine);
            for (var i = 0; i < intervals.length; i = i + 2) {
                space = getSpaceValue(intervals, isLine, i, space);
                var spaceY = 0;
                hLine = document.createElementNS('http://www.w3.org/2000/svg', isLine ? 'path' : 'circle');
                var d = isLine ? space + intervals[i] / 2 : space;
                d = isRulerGrid ? d : d * scale;
                var attr = void 0;
                if (isLine) {
                    attr = {
                        'stroke-width': intervals[i], 'stroke': snapSettings.horizontalGridlines.lineColor,
                        'd': 'M0,' + (d) + ' L' + hWidth + ',' + (d) + ' Z',
                        'dashArray': dashArray.toString(),
                        'class': intervals[i] === 1.25 ? 'e-diagram-thick-grid' : 'e-diagram-thin-grid'
                    };
                    setAttributeSvg(hLine, attr);
                    pattern.appendChild(hLine);
                    space += intervals[i + 1] + intervals[i];
                }
                else {
                    this.renderDotGrid(i, pattern, snapSettings, spaceY, d, scale, true);
                    space += intervals[i];
                }
            }
        }
    };
    DiagramRenderer.prototype.renderDotGrid = function (i, pattern, snapSettings, spacey, d, scale, isHorizontal) {
        var intervals = !isHorizontal ?
            snapSettings.horizontalGridlines.dotIntervals : snapSettings.verticalGridlines.dotIntervals;
        intervals = getInterval(intervals, false);
        var r;
        var hLine;
        var doubleRadius;
        var dy;
        var attr;
        for (var j = 1; j < intervals.length; j = j + 2) {
            r = j === intervals.length - 1 ? intervals[0] : intervals[j - 1];
            hLine = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dy = spacey;
            dy = dy * scale;
            attr = {
                'cx': isHorizontal ? dy : d, 'cy': isHorizontal ? d : dy, 'fill': snapSettings.horizontalGridlines.lineColor, 'r': r
            };
            setAttributeSvg(hLine, attr);
            pattern.appendChild(hLine);
            spacey += intervals[j] + intervals[j - 1];
        }
    };
    DiagramRenderer.prototype.verticalSvgGridlines = function (pattern, hWidth, hHeight, scale, snapSettings, rulerSettings, hRuler, isRulerGrid, isLine, intervals) {
        var space = 0;
        var dashArray = [];
        var vLine;
        if (snapSettings.constraints & SnapConstraints.ShowVerticalLines) {
            if (snapSettings.verticalGridlines.lineDashArray) {
                dashArray = this.renderer.parseDashArray(snapSettings.verticalGridlines.lineDashArray);
            }
            if (rulerSettings.showRulers && rulerSettings.dynamicGrid && hRuler) {
                intervals = this.updateLineIntervals(intervals, rulerSettings, hRuler, hWidth, isLine);
            }
            var spaceY = 0;
            intervals = getInterval(intervals, isLine);
            for (var i = 0; i < intervals.length; i = i + 2) {
                space = getSpaceValue(intervals, isLine, i, space);
                vLine = document.createElementNS('http://www.w3.org/2000/svg', isLine ? 'path' : 'circle');
                var d = isLine ? space + intervals[i] / 2 : space;
                d = isRulerGrid ? d : d * scale;
                var attr = void 0;
                if (isLine) {
                    attr = {
                        'stroke-width': intervals[i], 'stroke': snapSettings.verticalGridlines.lineColor,
                        'd': 'M' + (d) + ',0 L' + (d) + ',' + hHeight + ' Z',
                        'dashArray': dashArray.toString(),
                        'class': intervals[i] === 1.25 ? 'e-diagram-thick-grid' : 'e-diagram-thin-grid'
                    };
                    setAttributeSvg(vLine, attr);
                    pattern.appendChild(vLine);
                    space += intervals[i + 1] + intervals[i];
                }
                else {
                    this.renderDotGrid(i, pattern, snapSettings, spaceY, d, scale, false);
                    space += intervals[i];
                }
            }
        }
    };
    /**   @private  */
    DiagramRenderer.prototype.updateGrid = function (snapSettings, svgGrid, transform, rulerSettings, hRuler, vRuler) {
        var grid = svgGrid.getElementById(this.diagramId + '_grid_rect');
        var i;
        var isRulerGrid = false;
        if (grid) {
            var pattern = svgGrid.getElementById(this.diagramId + '_pattern');
            if (pattern) {
                pattern.parentNode.removeChild(pattern);
            }
            var hSegmentwidth = 0;
            var vSegmentwidth = 0;
            var scale = 1;
            var isLine = snapSettings.gridType === 'Lines';
            var verticalLineIntervals = isLine ?
                snapSettings.verticalGridlines.lineIntervals : snapSettings.verticalGridlines.dotIntervals;
            var horizontalLineIntervals = isLine ?
                snapSettings.horizontalGridlines.lineIntervals : snapSettings.horizontalGridlines.dotIntervals;
            if (rulerSettings.showRulers && rulerSettings.dynamicGrid && vRuler && hRuler) {
                hSegmentwidth = vRuler.updateSegmentWidth(transform.scale);
                vSegmentwidth = hRuler.updateSegmentWidth(transform.scale);
                isRulerGrid = true;
                snapSettings.horizontalGridlines.scaledIntervals = [hSegmentwidth / hRuler.interval];
                snapSettings.verticalGridlines.scaledIntervals = [vSegmentwidth / vRuler.interval];
            }
            else {
                scale = this.scaleSnapInterval(snapSettings, transform.scale);
            }
            var height = 0;
            for (var j = 0; j < horizontalLineIntervals.length; j = j + 1) {
                height += horizontalLineIntervals[j];
            }
            var width = 0;
            for (var j = 0; j < verticalLineIntervals.length; j = j + 1) {
                width += verticalLineIntervals[j];
            }
            var attr = {
                x: -transform.tx * transform.scale,
                y: -transform.ty * transform.scale
            };
            setAttributeSvg(grid, attr);
            width = isRulerGrid ? vSegmentwidth : width * scale;
            height = isRulerGrid ? hSegmentwidth : height * scale;
            attr = {
                id: this.diagramId + '_pattern', x: 0, y: 0, width: width,
                height: height, patternUnits: 'userSpaceOnUse'
            };
            pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
            setAttributeSvg(pattern, attr);
            this.horizontalSvgGridlines(pattern, width, height, scale, snapSettings, rulerSettings, vRuler, isRulerGrid, isLine, horizontalLineIntervals);
            this.verticalSvgGridlines(pattern, width, height, scale, snapSettings, rulerSettings, hRuler, isRulerGrid, isLine, verticalLineIntervals);
            var defs = svgGrid.getElementById(this.diagramId + '_grid_pattern_defn');
            if (defs) {
                defs.appendChild(pattern);
            }
        }
    };
    DiagramRenderer.prototype.updateLineIntervals = function (intervals, rulerSettings, ruler, segmentWidth, isLine) {
        var newInterval = [];
        var tickInterval = segmentWidth / ruler.interval;
        var interval = isLine ? ruler.interval : ruler.interval + 1;
        for (var i = 0; i < interval * 2; i++) {
            if (i % 2 === 0) {
                newInterval[i] = isLine ? ((i === 0) ? 1.25 : 0.25) : 0;
            }
            else {
                newInterval[i] = isLine ? (tickInterval - newInterval[i - 1]) : tickInterval;
            }
        }
        return newInterval;
    };
    DiagramRenderer.prototype.scaleSnapInterval = function (snapSettings, scale) {
        if (scale >= 2) {
            while (scale >= 2) {
                scale /= 2;
            }
        }
        else if (scale <= 0.5) {
            while (scale <= 0.5) {
                scale *= 2;
            }
        }
        var i;
        snapSettings.horizontalGridlines.scaledIntervals = snapSettings.horizontalGridlines.snapIntervals;
        snapSettings.verticalGridlines.scaledIntervals = snapSettings.verticalGridlines.snapIntervals;
        if (scale !== 1) {
            var gridlines = snapSettings.horizontalGridlines;
            gridlines.scaledIntervals = [];
            for (i = 0; i < gridlines.snapIntervals.length; i++) {
                gridlines.scaledIntervals[i] = gridlines.snapIntervals[i] * scale;
            }
            gridlines = snapSettings.verticalGridlines;
            gridlines.scaledIntervals = [];
            for (i = 0; i < gridlines.snapIntervals.length; i++) {
                gridlines.scaledIntervals[i] = gridlines.snapIntervals[i] * scale;
            }
        }
        return scale;
    };
    /**   @private  */
    DiagramRenderer.prototype.renderTextElement = function (element, canvas, transform, parentSvg, fromPalette) {
        var options = this.getBaseAttributes(element, transform);
        options.cornerRadius = 0;
        options.whiteSpace = whiteSpaceToString(element.style.whiteSpace, element.style.textWrapping);
        options.content = element.content;
        options.breakWord = wordBreakToString(element.style.textWrapping);
        options.textAlign = textAlignToString(element.style.textAlign);
        options.color = element.style.color;
        options.italic = element.style.italic;
        options.bold = element.style.bold;
        options.fontSize = element.style.fontSize;
        options.fontFamily = element.style.fontFamily;
        options.textOverflow = element.style.textOverflow;
        options.textWrapping = element.style.textWrapping;
        options.textDecoration = element.style.textDecoration;
        options.doWrap = element.doWrap;
        options.wrapBounds = element.wrapBounds;
        options.childNodes = element.childNodes;
        options.isHorizontalLane = element.isLaneOrientation;
        if (element.isLaneOrientation) {
            options.parentOffsetX = this.groupElement.offsetX;
            options.parentOffsetY = this.groupElement.offsetY;
            options.parentWidth = this.groupElement.actualSize.width;
            options.parentHeight = this.groupElement.actualSize.height;
        }
        options.dashArray = '';
        options.strokeWidth = 0;
        options.fill = element.style.fill;
        var ariaLabel = element.description ? element.description : element.content ? element.content : element.id;
        if ((element.style.textWrapping === 'Wrap' || element.style.textWrapping === 'WrapWithOverflow') &&
            this.groupElement && options.height > this.groupElement.actualSize.height &&
            (element.style.textOverflow === 'Clip' || element.style.textOverflow === 'Ellipsis')) {
            options.y = options.y + (options.height - this.groupElement.actualSize.height) / 2;
        }
        this.renderer.drawRectangle(canvas, options, this.diagramId, undefined, undefined, parentSvg);
        this.renderer.drawText(canvas, options, parentSvg, ariaLabel, this.diagramId, (element.isExport && Math.min(element.exportScaleValue.x || element.exportScaleValue.y)), this.groupElement);
        if (this.isSvgMode) {
            element.doWrap = false;
        }
    };
    DiagramRenderer.prototype.renderNativeElement = function (element, canvas, transform, parentSvg, fromPalette) {
        var templateWidth;
        var templateHeight;
        var nativeSvg = this.getParentSvg(element, undefined, canvas) || parentSvg;
        var nativeLayer = this.getParentElement(element, canvas, nativeSvg).g || canvas;
        var options = this.getBaseAttributes(element, transform);
        options.fill = 'transparent';
        options.cornerRadius = element.cornerRadius;
        options.stroke = 'transparent';
        this.renderer.drawRectangle(canvas, options, this.diagramId, undefined, undefined, parentSvg);
        switch (element.scale) {
            case 'None':
                templateWidth = element.contentSize.width;
                templateHeight = element.contentSize.height;
                break;
            case 'Stretch':
                templateWidth = element.actualSize.width;
                templateHeight = element.actualSize.height;
                break;
            case 'Meet':
                if (element.actualSize.width <= element.actualSize.height) {
                    templateWidth = templateHeight = element.actualSize.width;
                }
                else {
                    templateWidth = templateHeight = element.actualSize.height;
                }
                break;
            case 'Slice':
                if (element.actualSize.width >= element.actualSize.height) {
                    templateWidth = templateHeight = element.actualSize.width;
                }
                else {
                    templateWidth = templateHeight = element.actualSize.height;
                }
                break;
        }
        if (this.svgRenderer) {
            this.svgRenderer.drawNativeContent(element, nativeLayer, templateHeight, templateWidth, nativeSvg);
        }
    };
    DiagramRenderer.prototype.renderHTMLElement = function (element, canvas, htmlLayer, transform, parentSvg, fromPalette, indexValue) {
        var options = this.getBaseAttributes(element, transform);
        options.fill = 'transparent';
        options.cornerRadius = element.cornerRadius;
        options.stroke = 'transparent';
        this.renderer.drawRectangle(canvas, options, this.diagramId, undefined, undefined, parentSvg);
        if (this.svgRenderer) {
            this.svgRenderer.drawHTMLContent(element, htmlLayer.children[0], transform, isDiagramChild(htmlLayer), indexValue);
        }
    };
    /**   @private  */
    DiagramRenderer.prototype.renderImageElement = function (element, canvas, transform, parentSvg, fromPalette) {
        var options = this.getBaseAttributes(element, transform);
        options.cornerRadius = 0;
        this.renderer.drawRectangle(canvas, options, this.diagramId, undefined, undefined, parentSvg);
        // let sx: number; let sy: number;
        var imageWidth;
        var imageHeight;
        var sourceWidth;
        var sourceHeight;
        if (element.stretch === 'Stretch') {
            imageWidth = element.actualSize.width;
            imageHeight = element.actualSize.height;
        }
        else {
            var contentWidth = element.contentSize.width;
            var contentHeight = element.contentSize.height;
            var widthRatio = options.width / contentWidth;
            var heightRatio = options.height / contentHeight;
            var ratio = void 0;
            switch (element.stretch) {
                case 'Meet':
                    ratio = Math.min(widthRatio, heightRatio);
                    imageWidth = contentWidth * ratio;
                    imageHeight = contentHeight * ratio;
                    options.x += Math.abs(options.width - imageWidth) / 2;
                    options.y += Math.abs(options.height - imageHeight) / 2;
                    break;
                case 'Slice':
                    widthRatio = options.width / contentWidth;
                    heightRatio = options.height / contentHeight;
                    ratio = Math.max(widthRatio, heightRatio);
                    imageWidth = contentWidth * ratio;
                    imageHeight = contentHeight * ratio;
                    sourceWidth = options.width / imageWidth * contentWidth;
                    sourceHeight = options.height / imageHeight * contentHeight;
                    break;
                case 'None':
                    imageWidth = contentWidth;
                    imageHeight = contentHeight;
                    break;
            }
        }
        options.width = imageWidth;
        options.height = imageHeight;
        //Commented for code coverage
        //(options as ImageAttributes).sourceX = sx;
        //(options as ImageAttributes).sourceY = sy;
        options.sourceWidth = sourceWidth;
        options.sourceHeight = sourceHeight;
        options.source = element.source;
        options.alignment = element.imageAlign;
        options.scale = element.imageScale;
        options.description = element.description ? element.description : element.id;
        this.renderer.drawImage(canvas, options, parentSvg, fromPalette);
    };
    /**   @private  */
    DiagramRenderer.prototype.renderContainer = function (group, canvas, htmlLayer, transform, parentSvg, createParent, fromPalette, indexValue, isPreviewNode) {
        var svgParent = { svg: parentSvg, g: canvas };
        if (this.diagramId) {
            parentSvg = this.getParentSvg(group) || parentSvg;
            if (this.isSvgMode) {
                var groupElement = void 0;
                groupElement = this.getParentElement(group, canvas, parentSvg, indexValue).g || canvas;
                parentSvg = this.getParentSvg(this.hasNativeParent(group.children)) || parentSvg;
                var svgNativeParent = this.getParentElement(this.hasNativeParent(group.children), groupElement, parentSvg, indexValue);
                svgParent.svg = svgNativeParent.svg || parentSvg;
                svgParent.g = svgNativeParent.g || groupElement;
                if (createParent) {
                    if (parentSvg) {
                        if (!parentSvg.getElementById(svgParent.g.id)) {
                            canvas.appendChild(svgParent.g);
                        }
                    }
                    canvas = svgParent.g;
                }
                else {
                    canvas = svgParent.g;
                }
            }
        }
        this.renderRect(group, canvas, transform, parentSvg);
        this.groupElement = group;
        if (group.hasChildren()) {
            var parentG = void 0;
            var svgParent_1;
            var flip = void 0;
            for (var _i = 0, _a = group.children; _i < _a.length; _i++) {
                var child = _a[_i];
                parentSvg = this.getParentSvg(this.hasNativeParent(group.children) || child) || parentSvg;
                if (this.isSvgMode) {
                    svgParent_1 = this.getParentElement(this.hasNativeParent(group.children) || child, canvas, parentSvg);
                    parentG = svgParent_1.g || canvas;
                    if (svgParent_1.svg) {
                        parentSvg = svgParent_1.svg;
                    }
                }
                if (!this.isSvgMode) {
                    child.flip = group.flip;
                }
                this.renderElement(child, parentG || canvas, htmlLayer, transform, parentSvg, true, fromPalette, indexValue, isPreviewNode);
                if (child instanceof TextElement && parentG && !(group.elementActions & ElementAction.ElementIsGroup)) {
                    flip = (child.flip && child.flip !== 'None') ? child.flip : group.flip;
                    this.renderFlipElement(child, parentG, flip);
                }
                if ((child.elementActions & ElementAction.ElementIsPort) && parentG) {
                    flip = (child.flip && child.flip !== 'None') ? child.flip : group.flip;
                    this.renderFlipElement(group, parentG, flip);
                }
                if (!(child instanceof TextElement) && group.flip !== 'None' &&
                    (group.elementActions & ElementAction.ElementIsGroup)) {
                    this.renderFlipElement(child, parentG || canvas, group.flip);
                }
            }
            if (!(group.elementActions & ElementAction.ElementIsGroup)) {
                this.renderFlipElement(group, canvas, group.flip);
            }
        }
    };
    DiagramRenderer.prototype.renderFlipElement = function (element, canvas, flip) {
        var attr = {};
        var scaleX = 1;
        var scaleY = 1;
        var posX = 0;
        var posY = 0;
        var offsetX = 0;
        var offsetY = 0;
        if (flip !== 'None') {
            if (flip === 'Horizontal' || flip === 'Both') {
                posX = element.bounds.center.x;
                offsetX = -element.bounds.center.x;
                scaleX = -1;
            }
            if (flip === 'Vertical' || flip === 'Both') {
                posY = element.bounds.center.y;
                offsetY = -element.bounds.center.y;
                scaleY = -1;
            }
            attr = {
                'transform': 'translate(' + posX + ',' + posY + ') scale(' + scaleX + ','
                    + scaleY + ') translate(' + offsetX + ',' + offsetY + ')'
            };
        }
        else {
            attr = {
                'transform': 'translate(' + 0 + ',' + 0 + ')'
            };
        }
        if (attr) {
            if (element && element.children &&
                element.children.length && (element.children[0] instanceof DiagramHtmlElement)) {
                var id = canvas.id.split('_preview');
                var layer = document.getElementById(id[0] + '_html_div') ||
                    (getHTMLLayer(this.diagramId).children[0]);
                canvas = layer.querySelector(('#' + element.id + '_content_html_element'));
                if (canvas) {
                    canvas.style.transform =
                        'scale(' + scaleX + ',' + scaleY + ')' + 'rotate(' + (element.rotateAngle + element.parentTransform) + 'deg)';
                }
            }
            else {
                setAttributeSvg(canvas, attr);
            }
        }
    };
    /**   @private  */
    DiagramRenderer.prototype.hasNativeParent = function (children, count) {
        if (children && children.length > 0 && (count || 0 < 3)) {
            var child = children[0];
            if (child instanceof DiagramNativeElement) {
                return child;
            }
            else if (child.children && child.children.length) {
                this.hasNativeParent(child.children, count++ || 0);
            }
        }
        return undefined;
    };
    /**   @private  */
    DiagramRenderer.prototype.renderRect = function (element, canvas, transform, parentSvg, isPreviewNode) {
        var options = this.getBaseAttributes(element, transform, isPreviewNode);
        options.cornerRadius = element.cornerRadius || 0;
        var ariaLabel = element.description ? element.description : element.id;
        this.renderer.drawRectangle(canvas, options, this.diagramId, undefined, undefined, parentSvg, ariaLabel);
    };
    /**   @private  */
    DiagramRenderer.prototype.drawRect = function (canvas, options) {
        options.cornerRadius = 0;
        this.svgRenderer.drawRectangle(canvas, options, this.diagramId);
    };
    /**   @private  */
    DiagramRenderer.prototype.getBaseAttributes = function (element, transform, isPreviewNode) {
        var options = {
            width: element.actualSize.width, height: element.actualSize.height,
            x: element.offsetX - element.actualSize.width * element.pivot.x + 0.5,
            y: element.offsetY - element.actualSize.height * element.pivot.y + 0.5,
            fill: element.style.fill, stroke: element.style.strokeColor, angle: element.rotateAngle + element.parentTransform,
            pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: element.style.strokeWidth,
            dashArray: element.style.strokeDashArray || '', opacity: element.style.opacity, shadow: element.shadow,
            gradient: element.style.gradient, visible: element.visible, id: element.id, description: element.description,
            canApplyStyle: element.canApplyStyle
        };
        if (isPreviewNode) {
            options.x = options.x - .5;
            options.y = options.y - .5;
        }
        if (element.isExport) {
            options.width *= element.exportScaleValue.x;
            options.height *= element.exportScaleValue.y;
            options.x *= element.exportScaleValue.x;
            options.y *= element.exportScaleValue.y;
            options.strokeWidth *= element.exportScaleValue.x;
        }
        if (element.flip) {
            options.flip = element.flip;
        }
        if (transform) {
            options.x += transform.tx;
            options.y += transform.ty;
        }
        return options;
    };
    /**   @private  */
    DiagramRenderer.renderSvgBackGroundImage = function (background, diagramElement, x, y, width, height) {
        if (background.source) {
            var backgroundLayer = getBackgroundLayerSvg(diagramElement.id);
            var target = backgroundLayer.getElementById(diagramElement.id + '_image');
            if (!target) {
                var bgimageLayer = getBackgroundImageLayer(diagramElement.id);
                target = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                target.setAttribute('id', diagramElement.id + '_image');
                bgimageLayer.appendChild(target);
            }
            var imageObj = new Image();
            imageObj.src = background.source;
            target.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', imageObj.src.toString());
            var scale = background.scale !== 'None' ? background.scale : '';
            var imgAlign = background.align;
            var aspectRatio = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1);
            if (scale) {
                aspectRatio += ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            }
            var attr = {
                'id': diagramElement.id + '_image', 'x': x, 'y': y,
                'width': width, 'height': height,
                'preserveAspectRatio': aspectRatio
            };
            setAttributeSvg(target, attr);
        }
    };
    /**   @private  */
    DiagramRenderer.prototype.transformLayers = function (transform, svgMode) {
        var tx = transform.tx * transform.scale;
        var ty = transform.ty * transform.scale;
        var domTable = 'domTable';
        if (tx !== this.transform.x || ty !== this.transform.y || (tx === 0 || ty === 0)) {
            //diagram layer
            if (svgMode) {
                if (!window[domTable][this.diagramId + '_diagramLayer']) {
                    window[domTable][this.diagramId + '_diagramLayer'] =
                        this.diagramSvgLayer.getElementById(this.diagramId + '_diagramLayer');
                }
                var diagramLayer = window[domTable][this.diagramId + '_diagramLayer'];
                diagramLayer.setAttribute('transform', 'translate('
                    + (transform.tx * transform.scale) + ',' + (transform.ty * transform.scale) + '),scale('
                    + transform.scale + ')');
            }
            //background
            //gridline
            var gridLayer = getGridLayer(this.diagramId);
            gridLayer.setAttribute('transform', 'translate(' + (transform.tx * transform.scale) + ','
                + (transform.ty * transform.scale) + ')');
            //portslayer    
            if (!window[domTable][this.diagramId + '_diagramPorts']) {
                window[domTable][this.diagramId + '_diagramPorts'] = this.iconSvgLayer.getElementById(this.diagramId + '_diagramPorts');
            }
            var portsLayer = window[domTable][this.diagramId + '_diagramPorts'];
            portsLayer.setAttribute('transform', 'translate('
                + (transform.tx * transform.scale) + ',' + (transform.ty * transform.scale) + '),scale('
                + transform.scale + ')');
            //expandlayer
            if (!window[domTable][this.diagramId + '_diagramExpander']) {
                window[domTable][this.diagramId + '_diagramExpander'] =
                    this.iconSvgLayer.getElementById(this.diagramId + '_diagramExpander');
            }
            var expandLayer = window[domTable][this.diagramId + '_diagramExpander'];
            expandLayer.setAttribute('transform', 'translate('
                + (transform.tx * transform.scale) + ',' + (transform.ty * transform.scale) + '),scale('
                + transform.scale + ')');
            //nativelayer
            if (!window[domTable][this.diagramId + '_nativeLayer']) {
                window[domTable][this.diagramId + '_nativeLayer'] = this.nativeSvgLayer.getElementById(this.diagramId + '_nativeLayer');
            }
            var nativeLayer = window[domTable][this.diagramId + '_nativeLayer'];
            nativeLayer.setAttribute('transform', 'translate('
                + (transform.tx * transform.scale) + ',' + (transform.ty * transform.scale) + '),scale('
                + transform.scale + ')');
            //htmlLayer
            var htmlLayer = getHTMLLayer(this.diagramId).children[0];
            htmlLayer.style.transform = 'translate('
                + (transform.tx * transform.scale) + 'px,' + (transform.ty * transform.scale) + 'px)scale('
                + transform.scale + ')';
            this.transform = { x: transform.tx * transform.scale, y: transform.ty * transform.scale };
            return true;
        }
        return false;
    };
    /** @private */
    DiagramRenderer.prototype.updateNode = function (element, diagramElementsLayer, htmlLayer, transform, insertIndex) {
        this.renderElement(element, diagramElementsLayer, htmlLayer, transform, this.getParentSvg(element), undefined, undefined, insertIndex);
    };
    return DiagramRenderer;
}());
export { DiagramRenderer };
