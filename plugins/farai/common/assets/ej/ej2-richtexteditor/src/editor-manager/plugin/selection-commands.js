/**
 * `Selection` module is used to handle RTE Selections.
 */
import { NodeSelection } from './../../selection/index';
import { NodeCutter } from './nodecutter';
import { InsertMethods } from './insert-methods';
import { IsFormatted } from './isformatted';
import { isIDevice, setEditFrameFocus } from '../../common/util';
import { isNullOrUndefined as isNOU, Browser, closest, detach } from '@syncfusion/ej2-base';
var SelectionCommands = /** @class */ (function () {
    function SelectionCommands() {
    }
    /**
     * applyFormat method
     * @hidden
     * @deprecated
     */
    SelectionCommands.applyFormat = function (docElement, format, endNode, value, selector) {
        var validFormats = ['bold', 'italic', 'underline', 'strikethrough', 'superscript',
            'subscript', 'uppercase', 'lowercase', 'fontcolor', 'fontname', 'fontsize', 'backgroundcolor'];
        if (validFormats.indexOf(format) > -1) {
            if (format === 'backgroundcolor' && value === '') {
                value = 'transparent';
            }
            var domSelection = new NodeSelection();
            var nodeCutter = new NodeCutter();
            var isFormatted = new IsFormatted();
            var range = domSelection.getRange(docElement);
            var save = domSelection.save(range, docElement);
            var nodes = range.collapsed ? domSelection.getSelectionNodeCollection(range) :
                domSelection.getSelectionNodeCollectionBr(range);
            var isCollapsed = false;
            var isFormat = false;
            var isCursor = false;
            var isFontStyle = (['fontcolor', 'fontname', 'fontsize', 'backgroundcolor'].indexOf(format) > -1);
            if (range.collapsed) {
                if (nodes.length > 0) {
                    isCollapsed = true;
                    range = nodeCutter.GetCursorRange(docElement, range, nodes[0]);
                }
                else if (range.startContainer.nodeName.toLowerCase() !== 'td') {
                    var cursorNode = this.insertCursorNode(docElement, domSelection, range, isFormatted, nodeCutter, format, value, endNode);
                    domSelection.endContainer = domSelection.startContainer = domSelection.getNodeArray(cursorNode, true);
                    domSelection.endOffset = domSelection.startOffset = 1;
                }
            }
            isCursor = range.collapsed;
            var isSubSup = false;
            for (var index = 0; index < nodes.length; index++) {
                var formatNode = isFormatted.getFormattedNode(nodes[index], format, endNode);
                if (formatNode === null) {
                    if (format === 'subscript') {
                        formatNode = isFormatted.getFormattedNode(nodes[index], 'superscript', endNode);
                        isSubSup = formatNode === null ? false : true;
                    }
                    else if (format === 'superscript') {
                        formatNode = isFormatted.getFormattedNode(nodes[index], 'subscript', endNode);
                        isSubSup = formatNode === null ? false : true;
                    }
                }
                if (index === 0 && formatNode === null) {
                    isFormat = true;
                }
                if (formatNode !== null && (!isFormat || isFontStyle)) {
                    nodes[index] = this.removeFormat(nodes, index, formatNode, isCursor, isFormat, isFontStyle, range, nodeCutter, format, value, domSelection);
                }
                else {
                    nodes[index] = this.insertFormat(docElement, nodes, index, formatNode, isCursor, isFormat, isFontStyle, range, nodeCutter, format, value);
                }
                domSelection = this.applySelection(nodes, domSelection, nodeCutter, index, isCollapsed);
            }
            if (isIDevice()) {
                setEditFrameFocus(endNode, selector);
            }
            save.restore();
            if (isSubSup) {
                this.applyFormat(docElement, format, endNode);
            }
        }
    };
    SelectionCommands.insertCursorNode = function (docElement, domSelection, range, isFormatted, nodeCutter, format, value, endNode) {
        var cursorNodes = domSelection.getNodeCollection(range);
        var cursorFormat = (cursorNodes.length > 0) ? isFormatted.getFormattedNode(cursorNodes[0], format, endNode) : null;
        var cursorNode = null;
        if (cursorFormat) {
            cursorNode = cursorNodes[0];
            InsertMethods.unwrap(cursorFormat);
        }
        else {
            cursorNode = this.getInsertNode(docElement, range, format, value).firstChild;
        }
        return cursorNode;
    };
    SelectionCommands.removeFormat = function (nodes, index, formatNode, isCursor, isFormat, isFontStyle, range, nodeCutter, format, value, domSelection) {
        var splitNode = null;
        if (!(range.startContainer === range.endContainer && range.startOffset === 0
            && range.endOffset === range.startContainer.length)) {
            var nodeIndex = [];
            var cloneNode = nodes[index];
            do {
                nodeIndex.push(domSelection.getIndex(cloneNode));
                cloneNode = cloneNode.parentNode;
            } while (cloneNode && (cloneNode !== formatNode));
            if (nodes[index].nodeName !== 'BR') {
                cloneNode = splitNode = (isCursor && (formatNode.textContent.length - 1) === range.startOffset) ?
                    nodeCutter.SplitNode(range, formatNode, true)
                    : nodeCutter.GetSpliceNode(range, formatNode);
            }
            if (!isCursor) {
                while (cloneNode && cloneNode.childNodes.length > 0 && ((nodeIndex.length - 1) >= 0)
                    && (cloneNode.childNodes.length > nodeIndex[nodeIndex.length - 1])) {
                    cloneNode = cloneNode.childNodes[nodeIndex[nodeIndex.length - 1]];
                    nodeIndex.pop();
                }
                if (nodes[index].nodeName !== 'BR') {
                    if (cloneNode.nodeType === 3 && !(isCursor && cloneNode.nodeValue === '')) {
                        nodes[index] = cloneNode;
                    }
                    else {
                        var divNode = document.createElement('div');
                        divNode.innerHTML = '&#8203;';
                        if (cloneNode.nodeType !== 3) {
                            cloneNode.insertBefore(divNode.firstChild, cloneNode.firstChild);
                            nodes[index] = cloneNode.firstChild;
                        }
                        else {
                            cloneNode.parentNode.insertBefore(divNode.firstChild, cloneNode);
                            nodes[index] = cloneNode.previousSibling;
                            cloneNode.parentNode.removeChild(cloneNode);
                        }
                    }
                }
            }
            else {
                var lastNode = splitNode;
                for (; lastNode.firstChild !== null && lastNode.firstChild.nodeType !== 3; null) {
                    lastNode = lastNode.firstChild;
                }
                lastNode.innerHTML = '&#8203;';
                nodes[index] = lastNode.firstChild;
            }
        }
        var fontStyle;
        if (format === 'backgroundcolor') {
            fontStyle = formatNode.style.fontSize;
        }
        var bgStyle;
        if (format === 'fontsize') {
            var bg = closest(nodes[index].parentElement, 'span[style*=' + 'background-color' + ']');
            if (!isNOU(bg)) {
                bgStyle = bg.style.backgroundColor;
            }
        }
        var formatNodeStyles = formatNode.getAttribute('style');
        var formatNodeTagName = formatNode.tagName;
        var child = InsertMethods.unwrap(formatNode);
        if (child.length > 0 && isFontStyle) {
            for (var num = 0; num < child.length; num++) {
                child[num] = InsertMethods.Wrap(child[num], this.GetFormatNode(format, value, formatNodeTagName, formatNodeStyles));
            }
            var currentNodeElem = nodes[index].parentElement;
            if (!isNOU(fontStyle) && fontStyle !== '') {
                currentNodeElem.style.fontSize = fontStyle;
            }
            if (!isNOU(bgStyle) && bgStyle !== '') {
                currentNodeElem.style.backgroundColor = bgStyle;
            }
            if ((format === 'backgroundcolor' && !isNOU(fontStyle) && fontStyle !== '') &&
                currentNodeElem.parentElement.innerHTML === currentNodeElem.outerHTML) {
                var curParentElem = currentNodeElem.parentElement;
                curParentElem.parentElement.insertBefore(currentNodeElem, curParentElem);
                detach(curParentElem);
            }
            if (format === 'fontsize') {
                var liElement = nodes[index].parentElement;
                var parentElement = nodes[index].parentElement;
                while (!isNOU(parentElement) && parentElement.tagName.toLowerCase() !== 'li') {
                    parentElement = parentElement.parentElement;
                    liElement = parentElement;
                }
                if (!isNOU(liElement) && liElement.tagName.toLowerCase() === 'li' &&
                    liElement.textContent.trim() === nodes[index].textContent.trim()) {
                    liElement.style.fontSize = value;
                }
            }
        }
        return nodes[index];
    };
    SelectionCommands.insertFormat = function (docElement, nodes, index, formatNode, isCursor, isFormat, isFontStyle, range, nodeCutter, format, value) {
        if (!isCursor) {
            if ((formatNode === null && isFormat) || isFontStyle) {
                if (nodes[index].nodeName !== 'BR') {
                    nodes[index] = nodeCutter.GetSpliceNode(range, nodes[index]);
                    nodes[index].textContent = nodeCutter.TrimLineBreak(nodes[index].textContent);
                }
                if (format === 'uppercase' || format === 'lowercase') {
                    nodes[index].textContent = (format === 'uppercase') ? nodes[index].textContent.toLocaleUpperCase()
                        : nodes[index].textContent.toLocaleLowerCase();
                }
                else if (!(isFontStyle === true && value === '')) {
                    var element = this.GetFormatNode(format, value);
                    if (format === 'fontsize') {
                        var liElement = nodes[index].parentElement;
                        var parentElement = nodes[index].parentElement;
                        while (!isNOU(parentElement) && parentElement.tagName.toLowerCase() !== 'li') {
                            parentElement = parentElement.parentElement;
                            liElement = parentElement;
                        }
                        if (!isNOU(liElement) && liElement.tagName.toLowerCase() === 'li' &&
                            liElement.textContent.trim() === nodes[index].textContent.trim()) {
                            liElement.style.fontSize = value;
                        }
                        nodes[index] = this.applyStyles(nodes, index, element);
                        var bg = closest(nodes[index].parentElement, 'span[style*=' + 'background-color' + ']');
                        if (!isNOU(bg)) {
                            nodes[index].parentElement.style.backgroundColor = bg.style.backgroundColor;
                        }
                    }
                    else {
                        nodes[index] = this.applyStyles(nodes, index, element);
                    }
                }
            }
            else {
                nodes[index] = nodeCutter.GetSpliceNode(range, nodes[index]);
            }
        }
        else {
            if (format !== 'uppercase' && format !== 'lowercase') {
                var element = this.getInsertNode(docElement, range, format, value);
                nodes[index] = element.firstChild;
                nodeCutter.position = 1;
            }
            else {
                nodeCutter.position = range.startOffset;
            }
        }
        return nodes[index];
    };
    SelectionCommands.applyStyles = function (nodes, index, element) {
        nodes[index] = (index === (nodes.length - 1)) || nodes[index].nodeName === 'BR' ?
            InsertMethods.Wrap(nodes[index], element)
            : InsertMethods.WrapBefore(nodes[index], element, true);
        nodes[index] = this.getChildNode(nodes[index], element);
        return nodes[index];
    };
    SelectionCommands.getInsertNode = function (docElement, range, format, value) {
        var element = this.GetFormatNode(format, value);
        element.innerHTML = '&#8203;';
        if (Browser.isIE) {
            var frag = docElement.createDocumentFragment();
            frag.appendChild(element);
            range.insertNode(frag);
        }
        else {
            range.insertNode(element);
        }
        return element;
    };
    SelectionCommands.getChildNode = function (node, element) {
        if (node === undefined || node === null) {
            element.innerHTML = '&#8203;';
            node = element.firstChild;
        }
        return node;
    };
    SelectionCommands.applySelection = function (nodes, domSelection, nodeCutter, index, isCollapsed) {
        if (nodes.length === 1 && !isCollapsed) {
            domSelection.startContainer = domSelection.getNodeArray(nodes[index], true);
            domSelection.endContainer = domSelection.startContainer;
            domSelection.startOffset = 0;
            domSelection.endOffset = nodes[index].textContent.length;
        }
        else if (nodes.length === 1 && isCollapsed) {
            domSelection.startContainer = domSelection.getNodeArray(nodes[index], true);
            domSelection.endContainer = domSelection.startContainer;
            domSelection.startOffset = nodeCutter.position;
            domSelection.endOffset = nodeCutter.position;
        }
        else if (index === 0) {
            domSelection.startContainer = domSelection.getNodeArray(nodes[index], true);
            domSelection.startOffset = 0;
        }
        else if (index === nodes.length - 1) {
            domSelection.endContainer = domSelection.getNodeArray(nodes[index], false);
            domSelection.endOffset = nodes[index].textContent.length;
        }
        return domSelection;
    };
    SelectionCommands.GetFormatNode = function (format, value, tagName, styles) {
        var node;
        switch (format) {
            case 'bold':
                return document.createElement('strong');
            case 'italic':
                return document.createElement('em');
            case 'underline':
                node = document.createElement('span');
                this.updateStyles(node, tagName, styles);
                node.style.textDecoration = 'underline';
                return node;
            case 'strikethrough':
                node = document.createElement('span');
                this.updateStyles(node, tagName, styles);
                node.style.textDecoration = 'line-through';
                return node;
            case 'superscript':
                return document.createElement('sup');
            case 'subscript':
                return document.createElement('sub');
            case 'fontcolor':
                node = document.createElement('span');
                this.updateStyles(node, tagName, styles);
                node.style.color = value;
                node.style.textDecoration = 'inherit';
                return node;
            case 'fontname':
                node = document.createElement('span');
                this.updateStyles(node, tagName, styles);
                node.style.fontFamily = value;
                return node;
            case 'fontsize':
                node = document.createElement('span');
                this.updateStyles(node, tagName, styles);
                node.style.fontSize = value;
                return node;
            default:
                node = document.createElement('span');
                this.updateStyles(node, tagName, styles);
                node.style.backgroundColor = value;
                return node;
        }
    };
    SelectionCommands.updateStyles = function (ele, tag, styles) {
        if (styles !== null && tag === 'SPAN') {
            ele.setAttribute('style', styles);
        }
    };
    return SelectionCommands;
}());
export { SelectionCommands };
