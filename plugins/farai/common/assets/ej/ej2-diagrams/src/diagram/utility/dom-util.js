import { Rect } from '../primitives/rect';
import { Size } from '../primitives/size';
import { processPathData, splitArrayCollection, transformPath } from './path-util';
import { whiteSpaceToString, wordBreakToString, textAlignToString, bBoxText, cloneObject } from './base-util';
import { identityMatrix, transformPointByMatrix, rotateMatrix } from '../primitives/matrix';
import { compile, createElement, Browser, isBlazor } from '@syncfusion/ej2-base';
import { Node } from '../objects/node';
import { getElement, cloneBlazorObject } from './diagram-util';
import { templateCompiler } from '../utility/base-util';
/**
 * Defines the functionalities that need to access DOM
 */
/** @private */
export function removeElementsByClass(className, id) {
    var elements;
    if (id) {
        elements = document.getElementById(id).getElementsByClassName(className);
    }
    else {
        elements = document.getElementsByClassName(className);
    }
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}
/** @private */
export function findSegmentPoints(element) {
    var pts = [];
    var sample;
    var sampleLength;
    var measureWindowElement = 'measureElement';
    window[measureWindowElement].style.visibility = 'visible';
    var svg = window[measureWindowElement].children[2];
    var pathNode = getChildNode(svg)[0];
    pathNode.setAttributeNS(null, 'd', element.data);
    var pathBounds = element.absoluteBounds; // || pathNode.getBBox();
    var pathData = updatePath(element, pathBounds, element);
    pathNode.setAttributeNS(null, 'd', pathData);
    var pathLength = pathNode.getTotalLength();
    for (sampleLength = 0; sampleLength <= pathLength; sampleLength += 10) {
        sample = pathNode.getPointAtLength(sampleLength);
        pts.push({ x: sample.x, y: sample.y });
    }
    window[measureWindowElement].style.visibility = 'hidden';
    return pts;
}
export function getChildNode(node) {
    var child;
    var collection = [];
    if (Browser.info.name === 'msie' || Browser.info.name === 'edge') {
        for (var i = 0; i < node.childNodes.length; i++) {
            child = node.childNodes[i];
            if (child.nodeType === 1) {
                collection.push(child);
            }
        }
    }
    else {
        collection = node.children;
    }
    return collection;
}
export function translatePoints(element, points) {
    var translatedPts = [];
    for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
        var point = points_1[_i];
        var pt1 = {
            x: element.offsetX - element.actualSize.width * element.pivot.x + point.x,
            y: element.offsetY - element.actualSize.height * element.pivot.y + point.y
        };
        var matrix = void 0;
        var angle = element.rotateAngle + element.parentTransform;
        if (angle) {
            matrix = identityMatrix();
            rotateMatrix(matrix, angle, element.offsetX, element.offsetY);
        }
        if (matrix) {
            pt1 = transformPointByMatrix(matrix, pt1);
        }
        translatedPts.push(pt1);
    }
    return translatedPts;
}
/** @private */
export function measurePath(data) {
    if (data) {
        var measureWindowElement = 'measureElement';
        window[measureWindowElement].style.visibility = 'visible';
        var svg = window[measureWindowElement].children[2];
        var element = getChildNode(svg)[0];
        element.setAttribute('d', data);
        var bounds = element.getBBox();
        var svgBounds = new Rect(bounds.x, bounds.y, bounds.width, bounds.height);
        window[measureWindowElement].style.visibility = 'hidden';
        return svgBounds;
    }
    return new Rect(0, 0, 0, 0);
}
function getTextOptions(element, maxWidth) {
    var options = {
        fill: element.style.fill, stroke: element.style.strokeColor, angle: element.rotateAngle + element.parentTransform,
        pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: element.style.strokeWidth,
        dashArray: element.style.strokeDashArray, opacity: element.style.opacity, shadow: element.shadow,
        gradient: element.style.gradient, visible: element.visible, id: element.id, description: element.description,
        width: maxWidth || element.actualSize.width, height: element.actualSize.height,
        x: element.offsetX - element.actualSize.width * element.pivot.x + 0.5,
        y: element.offsetY - element.actualSize.height * element.pivot.y + 0.5
    };
    options.fontSize = element.style.fontSize;
    options.fontFamily = element.style.fontFamily;
    options.textOverflow = element.style.textOverflow;
    options.textDecoration = element.style.textDecoration;
    options.doWrap = element.doWrap;
    options.whiteSpace = whiteSpaceToString(element.style.whiteSpace, element.style.textWrapping);
    options.content = element.content;
    options.textWrapping = element.style.textWrapping;
    options.breakWord = wordBreakToString(element.style.textWrapping);
    options.textAlign = textAlignToString(element.style.textAlign);
    options.color = element.style.color;
    options.italic = element.style.italic;
    options.bold = element.style.bold;
    options.dashArray = '';
    options.strokeWidth = 0;
    options.fill = '';
    return options;
}
function wrapSvgText(text, textValue, laneWidth) {
    var childNodes = [];
    var k = 0;
    var txtValue;
    var bounds1;
    var content = textValue || text.content;
    if (text.whiteSpace !== 'nowrap' && text.whiteSpace !== 'pre') {
        if (text.breakWord === 'breakall') {
            txtValue = '';
            txtValue += content[0];
            for (k = 0; k < content.length; k++) {
                bounds1 = bBoxText(txtValue, text);
                if (bounds1 >= text.width && txtValue.length > 0) {
                    childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: bounds1 };
                    txtValue = '';
                }
                else {
                    txtValue = txtValue + (content[k + 1] || '');
                    if (txtValue.indexOf('\n') > -1) {
                        childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: bBoxText(txtValue, text) };
                        txtValue = '';
                    }
                    var width = bBoxText(txtValue, text);
                    if (Math.ceil(width) + 2 >= text.width && txtValue.length > 0) {
                        childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                        txtValue = '';
                    }
                    if (k === content.length - 1 && txtValue.length > 0) {
                        childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                        txtValue = '';
                    }
                }
            }
        }
        else {
            childNodes = wordWrapping(text, textValue, laneWidth);
        }
    }
    else {
        childNodes[childNodes.length] = { text: content, x: 0, dy: 0, width: bBoxText(content, text) };
    }
    return childNodes;
}
function wordWrapping(text, textValue, laneWidth) {
    var childNodes = [];
    var txtValue = '';
    var j = 0;
    var i = 0;
    var wrap = text.whiteSpace !== 'nowrap' ? true : false;
    var content = textValue || text.content;
    var eachLine = content.split('\n');
    var txt;
    var words;
    var newText;
    var existingWidth;
    var existingText;
    for (j = 0; j < eachLine.length; j++) {
        txt = '';
        words = text.textWrapping !== 'NoWrap' ? eachLine[j].split(' ') : (text.textWrapping === 'NoWrap') ? [eachLine[j]] : eachLine;
        for (i = 0; i < words.length; i++) {
            txtValue += (((i !== 0 || words.length === 1) && wrap && txtValue.length > 0) ? ' ' : '') + words[i];
            newText = txtValue + ' ' + (words[i + 1] || '');
            var width = bBoxText(newText, text);
            if (Math.floor(width) > (laneWidth || text.width) - 2 && txtValue.length > 0) {
                childNodes[childNodes.length] = {
                    text: txtValue, x: 0, dy: 0,
                    width: newText === txtValue ? width : (txtValue === existingText) ? existingWidth : bBoxText(txtValue, text)
                };
                txtValue = '';
            }
            else {
                if (i === words.length - 1) {
                    childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                    txtValue = '';
                }
            }
            existingText = newText;
            existingWidth = width;
        }
    }
    return childNodes;
}
function wrapSvgTextAlign(text, childNodes) {
    var wrapBounds = { x: 0, width: 0 };
    var k = 0;
    var txtWidth;
    var width;
    for (k = 0; k < childNodes.length; k++) {
        txtWidth = childNodes[k].width;
        width = txtWidth;
        if (text.textAlign === 'left') {
            txtWidth = 0;
        }
        else if (text.textAlign === 'center') {
            if (txtWidth > text.width && (text.textOverflow === 'Ellipsis' || text.textOverflow === 'Clip')) {
                txtWidth = 0;
            }
            else {
                txtWidth = -txtWidth / 2;
            }
        }
        else if (text.textAlign === 'right') {
            txtWidth = -txtWidth;
        }
        else {
            txtWidth = childNodes.length > 1 ? 0 : -txtWidth / 2;
        }
        childNodes[k].dy = text.fontSize * 1.2;
        childNodes[k].x = txtWidth;
        if (!wrapBounds) {
            wrapBounds = {
                x: txtWidth,
                width: width
            };
        }
        else {
            wrapBounds.x = Math.min(wrapBounds.x, txtWidth);
            wrapBounds.width = Math.max(wrapBounds.width, width);
        }
    }
    return wrapBounds;
}
export function measureHtmlText(style, content, width, height, maxWidth) {
    var bounds = new Size();
    var text = createHtmlElement('span', { 'style': 'display:inline-block; line-height: normal' });
    if (style.bold) {
        text.style.fontWeight = 'bold';
    }
    if (style.italic) {
        text.style.fontStyle = 'italic';
    }
    if (width !== undefined) {
        text.style.width = width.toString() + 'px';
    }
    if (height !== undefined) {
        text.style.height = height.toString() + 'px';
    }
    if (maxWidth !== undefined) {
        text.style.maxWidth = maxWidth.toString() + 'px';
    }
    text.style.fontFamily = style.fontFamily;
    text.style.fontSize = style.fontSize + 'px';
    text.style.color = style.color;
    text.textContent = content;
    text.style.whiteSpace = whiteSpaceToString(style.whiteSpace, style.textWrapping);
    if (maxWidth !== undefined) {
        text.style.wordBreak = 'break-word';
    }
    else {
        text.style.wordBreak = wordBreakToString(style.textWrapping);
    }
    document.body.appendChild(text);
    bounds.width = text.offsetWidth;
    bounds.height = text.offsetHeight;
    document.body.removeChild(text);
    return bounds;
}
/** @private */
export function measureText(text, style, content, maxWidth, textValue) {
    var bounds = new Size(0, 0);
    var childNodes;
    var wrapBounds;
    var options = getTextOptions(text, maxWidth);
    text.childNodes = childNodes = wrapSvgText(options, textValue, text.isLaneOrientation ? maxWidth : undefined);
    text.wrapBounds = wrapBounds = wrapSvgTextAlign(options, childNodes);
    bounds.width = wrapBounds.width;
    if (text.wrapBounds.width >= maxWidth && options.textOverflow !== 'Wrap') {
        bounds.width = maxWidth;
    }
    bounds.height = childNodes.length * text.style.fontSize * 1.2;
    return bounds;
}
/** @private */
export function measureImage(source, contentSize, id, callback) {
    var measureWindowElement = 'measureElement';
    window[measureWindowElement].style.visibility = 'visible';
    var imageElement = window[measureWindowElement].children[1];
    imageElement.setAttribute('src', source);
    var bounds = imageElement.getBoundingClientRect();
    var width = bounds.width;
    var height = bounds.height;
    contentSize = new Size(width, height);
    window[measureWindowElement].style.visibility = 'hidden';
    var element = document.createElement('img');
    element.setAttribute('src', source);
    setAttributeHtml(element, { id: id + 'sf-imageNode', style: 'display: none;' });
    document.body.appendChild(element);
    // tslint:disable-next-line:no-any
    element.onload = function (event) {
        var loadedImage = event.currentTarget;
        if (callback) {
            callback(id, { width: loadedImage.width, height: loadedImage.height });
        }
    };
    return contentSize;
}
/** @private */
export function measureNativeContent(nativeContent) {
    var measureWindowElement = 'measureElement';
    window[measureWindowElement].style.visibility = 'visible';
    var nativeSVG = window[measureWindowElement].children[2];
    nativeSVG.appendChild(nativeContent);
    var bounds = nativeContent.getBoundingClientRect();
    var svgBounds = nativeSVG.getBoundingClientRect();
    var rect = bounds;
    rect.x = bounds.left - svgBounds.left;
    rect.y = bounds.top - svgBounds.top;
    nativeSVG.removeChild(nativeContent);
    window[measureWindowElement].style.visibility = 'hidden';
    return rect;
}
/**
 * @private
 */
export function measureNativeSvg(nativeContent) {
    var measureWindowElement = 'measureElement';
    window[measureWindowElement].style.visibility = 'visible';
    var nativeSVG = window[measureWindowElement].children[2];
    nativeSVG.appendChild(nativeContent);
    var svgBounds = nativeSVG.getBoundingClientRect();
    nativeSVG.removeChild(nativeContent);
    window[measureWindowElement].style.visibility = 'hidden';
    return svgBounds;
}
/** @private */
export function updatePath(element, bounds, child, options) {
    var initX = 0;
    var initY = 0;
    var scaleX = 0;
    var scaleY = 0;
    var isScale = false;
    var bBox;
    var isInit;
    var isResizing = true;
    var newPathString = '';
    var arrayCollection = [];
    bBox = bounds;
    if (initX !== bBox.x || initY !== bBox.y) {
        scaleX = initX - Number(bBox.x);
        scaleY = initY - Number(bBox.y);
    }
    if (element.actualSize.width !== bBox.width || element.actualSize.height !== bBox.height || options) {
        scaleX = (options && options.width || element.actualSize.width) / Number(bBox.width ? bBox.width : 1);
        scaleY = (options && options.height || element.actualSize.height) / Number(bBox.height ? bBox.height : 1);
        isScale = true;
    }
    arrayCollection = processPathData(element.data);
    arrayCollection = splitArrayCollection(arrayCollection);
    newPathString = transformPath(arrayCollection, scaleX, scaleY, isScale, bBox.x, bBox.y, initX, initY);
    isScale = false;
    return newPathString;
}
/** @private */
export function getDiagramLayerSvg(diagramId) {
    var diagramLayerSvg;
    var diagramElement = getDiagramElement(diagramId);
    var elementcoll;
    elementcoll = diagramElement.getElementsByClassName('e-diagram-layer');
    diagramLayerSvg = elementcoll[0];
    return diagramLayerSvg;
}
/** @private */
export function getDiagramElement(elementId, contentId) {
    var diagramElement;
    var element;
    if (contentId) {
        element = document.getElementById(contentId);
    }
    if (Browser.info.name === 'msie' || Browser.info.name === 'edge') {
        diagramElement = (element) ? element.querySelector('#' + elementId) : document.getElementById(elementId);
    }
    else {
        diagramElement = (element) ? element.querySelector('#' + CSS.escape(elementId)) : document.getElementById(elementId);
    }
    return diagramElement;
}
/** @private */
export function getDomIndex(viewId, elementId, layer) {
    var index = undefined;
    var parentElement;
    var postId = '';
    if (layer === 'native') {
        parentElement = getNativeLayer(viewId);
        postId = '_content_groupElement';
    }
    else if (layer === 'html') {
        parentElement = getHTMLLayer(viewId).childNodes[0];
        postId = '_html_element';
    }
    else {
        parentElement = getDiagramLayer(viewId);
        postId = '_groupElement';
    }
    var childElement;
    for (var i = 0; parentElement.childNodes && i < parentElement.childNodes.length; i++) {
        childElement = parentElement.childNodes[i];
        if (childElement && childElement.id === elementId + postId) {
            index = i;
            break;
        }
    }
    return index;
}
/**
 * @private
 */
export function getAdornerLayerSvg(diagramId) {
    var adornerLayerSvg = null;
    var diagramElement = getDiagramElement(diagramId);
    var elementcoll;
    elementcoll = diagramElement.getElementsByClassName('e-adorner-layer');
    adornerLayerSvg = elementcoll[0];
    return adornerLayerSvg;
}
/** @private */
export function getSelectorElement(diagramId) {
    var adornerLayer = null;
    var adornerSvg = getAdornerLayerSvg(diagramId);
    adornerLayer = adornerSvg.getElementById(diagramId + '_SelectorElement');
    return adornerLayer;
}
/**
 * @private
 */
export function getAdornerLayer(diagramId) {
    var adornerLayer = null;
    var diagramAdornerSvg = getAdornerLayerSvg(diagramId);
    adornerLayer = diagramAdornerSvg.getElementById(diagramId + '_diagramAdorner');
    return adornerLayer;
}
/**
 * @private
 */
export function getUserHandleLayer(diagramId) {
    var adornerLayer = null;
    var diagramUserHandleLayer = getDiagramElement(diagramId);
    var elementcoll;
    elementcoll = diagramUserHandleLayer.getElementsByClassName('e-userHandle-layer');
    adornerLayer = elementcoll[0];
    return adornerLayer;
}
/** @private */
export function getDiagramLayer(diagramId) {
    var diagramLayer;
    var diagramLayerSvg = getDiagramLayerSvg(diagramId);
    diagramLayer = diagramLayerSvg.getElementById(diagramId + '_diagramLayer');
    return diagramLayer;
}
/** @private */
export function getPortLayerSvg(diagramId) {
    var adornerLayerSvg = null;
    var diagramElement = getDiagramElement(diagramId);
    var elementcoll;
    elementcoll = diagramElement.getElementsByClassName('e-ports-expand-layer');
    adornerLayerSvg = elementcoll[0];
    return adornerLayerSvg;
}
/** @private */
export function getNativeLayerSvg(diagramId) {
    var nativeLayerSvg;
    var diagramElement = getDiagramElement(diagramId);
    var elementcoll;
    elementcoll = diagramElement.getElementsByClassName('e-native-layer');
    nativeLayerSvg = elementcoll[0];
    return nativeLayerSvg;
}
/** @private */
export function getGridLayerSvg(diagramId) {
    var gridLayerSvg = null;
    var diagramElement = getDiagramElement(diagramId);
    var elementcoll;
    elementcoll = diagramElement.getElementsByClassName('e-grid-layer');
    gridLayerSvg = elementcoll[0];
    return gridLayerSvg;
}
/** @private */
export function getBackgroundLayerSvg(diagramId) {
    var gridLayerSvg = null;
    var diagramElement = getDiagramElement(diagramId);
    var elementcoll = diagramElement.getElementsByClassName('e-background-layer');
    return elementcoll[0].parentNode;
}
/** @private */
export function getBackgroundImageLayer(diagramId) {
    var imageLayer = null;
    var diagramElement = getDiagramElement(diagramId);
    var elementcoll;
    elementcoll = diagramElement.getElementsByClassName('e-background-image-layer');
    imageLayer = elementcoll[0];
    return imageLayer;
}
/** @private */
export function getBackgroundLayer(diagramId) {
    var imageLayer = null;
    var diagramElement = getDiagramElement(diagramId);
    var elementcoll;
    elementcoll = diagramElement.getElementsByClassName('e-background-layer');
    imageLayer = elementcoll[0];
    return imageLayer;
}
/** @private */
export function getGridLayer(diagramId) {
    var domTable = 'domTable';
    var expandCollapse = null;
    if (!window[domTable][diagramId + '_gridline']) {
        var diagramGridSvg = getGridLayerSvg(diagramId);
        expandCollapse = diagramGridSvg.getElementById(diagramId + '_gridline');
        window[domTable][diagramId + '_gridline'] = expandCollapse;
    }
    else {
        expandCollapse = window[domTable][diagramId + '_gridline'];
    }
    return expandCollapse;
}
// /** @private */
// export function getExpandCollapseLayer(diagramId: string): SVGElement {
//     let expandCollapse: SVGElement = null;
//     let diagramPortSvg: SVGSVGElement = getPortLayerSvg(diagramId);
//     expandCollapse = diagramPortSvg.getElementById(diagramId + '_diagramExpander') as SVGElement;
//     return expandCollapse;
// }
// /** @private */
// export function getPortsLayer(diagramId: string): SVGElement {
//     let expandCollapse: SVGElement = null;
//     let diagramPortSvg: SVGSVGElement = getPortLayerSvg(diagramId);
//     expandCollapse = diagramPortSvg.getElementById(diagramId + '_diagramPorts') as SVGElement;
//     return expandCollapse;
// }
/** @private */
export function getNativeLayer(diagramId) {
    var nativeLayer = null;
    var nativeLayerSvg = getNativeLayerSvg(diagramId);
    nativeLayer = nativeLayerSvg.getElementById(diagramId + '_nativeLayer');
    return nativeLayer;
}
/** @private */
export function getHTMLLayer(diagramId) {
    var htmlLayer = null;
    var domTable = 'domTable';
    if (!window[domTable][diagramId + 'html_layer']) {
        var element = getDiagramElement(diagramId);
        var elementcoll = void 0;
        elementcoll = element.getElementsByClassName('e-html-layer');
        htmlLayer = elementcoll[0];
        window[domTable][diagramId + 'html_layer'] = htmlLayer;
    }
    else {
        htmlLayer = window[domTable][diagramId + 'html_layer'];
    }
    return htmlLayer;
}
/** @private */
export function createHtmlElement(elementType, attribute) {
    var element = createElement(elementType);
    setAttributeHtml(element, attribute);
    return element;
}
/** @private */
export function createSvgElement(elementType, attribute) {
    var element = document.createElementNS('http://www.w3.org/2000/svg', elementType);
    setAttributeSvg(element, attribute);
    return element;
}
/** @hidden */
export function parentsUntil(elem, selector, isID) {
    var parent = elem;
    while (parent) {
        if (isID ? parent.id === selector : hasClass(parent, selector)) {
            break;
        }
        parent = parent.parentNode;
    }
    return parent;
}
export function hasClass(element, className) {
    var eClassName = (typeof element.className === 'object') ? element.className.animVal : element.className;
    return ((' ' + eClassName + ' ').indexOf(' ' + className + ' ') > -1) ? true : false;
}
/** @hidden */
export function getScrollerWidth() {
    var outer = createHtmlElement('div', { 'style': 'visibility:hidden; width: 100px' });
    document.body.appendChild(outer);
    var widthNoScroll = outer.getBoundingClientRect().width;
    // force scrollbars
    outer.style.overflow = 'scroll';
    // add innerdiv
    var inner = createHtmlElement('div', { 'style': 'width:100%' });
    outer.appendChild(inner);
    var widthWithScroll = inner.getBoundingClientRect().width;
    // remove divs
    outer.parentNode.removeChild(outer);
    return widthNoScroll - widthWithScroll;
}
/**
 * Handles the touch pointer.
 * @return {boolean}
 * @private
 */
export function addTouchPointer(touchList, e, touches) {
    touchList = [];
    for (var i = 0, length_1 = touches.length; i < length_1; i++) {
        touchList.push({ pageX: touches[i].clientX, pageY: touches[i].clientY, pointerId: null });
    }
    return touchList;
}
/**
 * removes the element from dom
 * @param {string} elementId
 */
export function removeElement(elementId, contentId) {
    var div = getDiagramElement(elementId, contentId);
    if (div) {
        div.parentNode.removeChild(div);
    }
}
export function getContent(element, isHtml, nodeObject) {
    var div;
    if (isHtml) {
        var attr = { 'style': 'height: 100%; width: 100%' };
        div = createHtmlElement('div', attr);
    }
    else {
        div = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    }
    var node = getElement(element);
    var content = '';
    var sentNode = {};
    var isSvg = false;
    var propertyName;
    if (node instanceof Node) {
        sentNode = node;
        if (node.shape.type === 'Native') {
            isSvg = true;
            var svgContent = void 0;
            var div_1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            document.body.appendChild(div_1);
            /* tslint:disable */
            div_1.innerHTML = (node.shape.content);
            /* tslint:disable */
            svgContent = (div_1.getElementsByTagName('svg').length > 0)
                ? div_1.getElementsByTagName('svg')[0].outerHTML : div_1.getElementsByTagName('g')[0].outerHTML;
            /* tslint:disable */
            node.shape.content = svgContent;
            /* tslint:disable */
            element.content = svgContent;
            div_1.parentElement.removeChild(div_1);
        }
        var blazor = 'Blazor';
        if (isBlazor()) {
            content = 'diagramsf_node_template';
            sentNode = cloneBlazorObject(node);
        }
        propertyName = "nodeTemplate";
    }
    else {
        sentNode = node;
        //new
        if (isBlazor()) {
            sentNode = cloneBlazorObject(node);
            content = 'diagramsf_annotation_template';
        }
        propertyName = "annotationTemplate";
    }
    var item;
    var diagramElement = document.getElementById(element.diagramId);
    var instance = 'ej2_instances';
    var diagram = diagramElement[instance][0];
    if (typeof element.content === 'string' && (!element.isTemplate || isBlazor())) {
        var template = document.getElementById(element.content);
        if (template) {
            div.appendChild(template);
        }
        else {
            var compiledString = void 0;
            compiledString = compile(element.content);
            for (var _i = 0, _a = compiledString(sentNode, diagram, propertyName, content); _i < _a.length; _i++) {
                item = _a[_i];
                div.appendChild(item);
            }
            //new
            // for (item of compiledString(sentNode, null, null, content, undefined, undefined, isSvg)) {
            //     div.appendChild(item);
            // }
        }
    }
    else if (element.isTemplate) {
        var compiledString = void 0;
        compiledString = element.getNodeTemplate()(cloneObject(nodeObject), diagram, propertyName + "_" + ((propertyName === "nodeTemplate") ? nodeObject.id : element.nodeId + nodeObject.id), undefined, undefined, false);
        for (var i = 0; i < compiledString.length; i++) {
            div.appendChild(compiledString[i]);
        }
    }
    else {
        div.appendChild(element.content);
    }
    return element.isTemplate ?
        div : (isHtml ? div.cloneNode(true) : div.cloneNode(true));
}
/** @private */
export function setAttributeSvg(svg, attributes) {
    var keys = Object.keys(attributes);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] !== 'style') {
            svg.setAttribute(keys[i], attributes[keys[i]]);
        }
        else {
            applyStyleAgainstCsp(svg, attributes[keys[i]]);
        }
    }
}
/** @private */
export function applyStyleAgainstCsp(svg, attributes) {
    var keys = attributes.split(';');
    for (var i = 0; i < keys.length; i++) {
        var attribute = keys[i].split(':');
        if (attribute.length === 2) {
            svg.style[attribute[0].trim()] = attribute[1].trim();
        }
    }
}
/** @private */
export function setAttributeHtml(element, attributes) {
    var keys = Object.keys(attributes);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] !== 'style') {
            element.setAttribute(keys[i], attributes[keys[i]]);
        }
        else {
            applyStyleAgainstCsp(element, attributes[keys[i]]);
        }
    }
}
/** @private */
export function createMeasureElements() {
    var measureWindowElement = 'measureElement';
    if (!window[measureWindowElement]) {
        var divElement = createHtmlElement('div', {
            id: 'measureElement',
            style: 'visibility:hidden ; height: 0px ; width: 0px; overflow: hidden;'
        });
        var text = createHtmlElement('span', { 'style': 'display:inline-block ; line-height: normal' });
        divElement.appendChild(text);
        var imageElement = void 0;
        imageElement = createHtmlElement('img', {});
        divElement.appendChild(imageElement);
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        divElement.appendChild(svg);
        var element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svg.appendChild(element);
        var data = document.createTextNode('');
        var tSpan = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tSpan.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
        svg.appendChild(tSpan);
        window[measureWindowElement] = divElement;
        window[measureWindowElement].usageCount = 1;
        document.body.appendChild(divElement);
        var measureElementCount = 'measureElementCount';
        if (!window[measureElementCount]) {
            window[measureElementCount] = 1;
        }
        else {
            window[measureElementCount]++;
        }
    }
    else {
        window[measureWindowElement].usageCount += 1;
    }
}
/** @private */
export function setChildPosition(temp, childNodes, i, options) {
    if (childNodes.length > 1 && temp.x === 0 &&
        (options.textOverflow === 'Clip' || options.textOverflow === 'Ellipsis') &&
        (options.textWrapping === 'Wrap' || options.textWrapping === 'WrapWithOverflow')) {
        temp.x = childNodes[i - 1] ? childNodes[i - 1].x : -(temp.width / 2);
        return temp.x;
    }
    return temp.x;
}
/** @private */
export function getTemplateContent(annotationcontent, annotation, annotationTemplate) {
    if (annotationTemplate && !annotation.template) {
        annotationcontent.isTemplate = true;
        annotationcontent.template = annotationcontent.content = getContent(annotationcontent, true, annotation);
    }
    else {
        annotationcontent.content = annotation.template;
    }
    return annotationcontent;
}
/** @private */
export function createUserHandleTemplates(userHandleTemplate, template, selectedItems, diagramID) {
    var userHandleFn;
    var handle;
    var compiledString;
    var i;
    var div;
    var diagramElement = document.getElementById(diagramID);
    var instance = 'ej2_instances';
    var diagram = diagramElement[instance][0];
    if (userHandleTemplate && template) {
        userHandleFn = templateCompiler(userHandleTemplate);
        for (var _i = 0, _a = selectedItems.userHandles; _i < _a.length; _i++) {
            handle = _a[_i];
            if (userHandleFn) {
                compiledString = userHandleFn(cloneObject(handle), diagram, 'userHandleTemplate' + '_' + handle.name, undefined, undefined, false);
                for (i = 0; i < compiledString.length; i++) {
                    var attr = {
                        'style': 'height: 100%; width: 100%; pointer-events: all',
                        'id': handle.name + '_template_hiddenUserHandle'
                    };
                    div = createHtmlElement('div', attr);
                    div.appendChild(compiledString[i]);
                }
                template[0].appendChild(div);
            }
        }
    }
    else if (isBlazor()) {
        var content = 'diagramsf_userHandle_template';
        var a = void 0;
        for (var _b = 0, _c = selectedItems.userHandles; _b < _c.length; _b++) {
            handle = _c[_b];
            if (!handle.pathData && !handle.content && !handle.source) {
                compiledString = compile(handle.content);
                for (i = 0, a = compiledString(cloneBlazorObject(handle), diagram, 'userHandleTemplate', content); i < a.length; i++) {
                    var attr = {
                        'style': 'height: 100%; width: 100%; pointer-events: all',
                        'id': handle.name + '_template_hiddenUserHandle'
                    };
                    div = createHtmlElement('div', attr);
                    div.appendChild(a[i]);
                }
                template[0].appendChild(div);
            }
        }
    }
}
