import { IsFormatted } from './isformatted';
import * as CONSTANT from './../base/constant';
import { NodeSelection } from './../../selection/index';
/**
 * Update Toolbar Status
 * @hidden
 * @deprecated
 */
export var statusCollection = {
    bold: false,
    italic: false,
    subscript: false,
    superscript: false,
    strikethrough: false,
    orderedlist: false,
    unorderedlist: false,
    underline: false,
    alignments: null,
    backgroundcolor: null,
    fontcolor: null,
    fontname: null,
    fontsize: null,
    formats: null,
    createlink: false,
    insertcode: false
};
var ToolbarStatus = /** @class */ (function () {
    function ToolbarStatus() {
    }
    /**
     * get method
     * @hidden
     * @deprecated
     */
    ToolbarStatus.get = function (docElement, targetNode, formatNode, fontSize, fontName, documentNode) {
        var formatCollection = JSON.parse(JSON.stringify(statusCollection));
        var nodeCollection = JSON.parse(JSON.stringify(statusCollection));
        var nodeSelection = new NodeSelection();
        var nodes = documentNode ? [documentNode] : nodeSelection.getNodeCollection(nodeSelection.getRange(docElement));
        var nodesLength = nodes.length;
        for (var index = 0; index < nodes.length; index++) {
            if ((nodes[index].nodeName !== 'BR' && nodes[index].nodeType !== 3) ||
                (nodesLength > 1 && nodes[index].nodeType === 3 && nodes[index].textContent.trim() === '')) {
                nodes.splice(index, 1);
                index--;
            }
        }
        for (var index = 0; index < nodes.length; index++) {
            formatCollection = this.getFormatParent(docElement, formatCollection, nodes[index], targetNode, formatNode, fontSize, fontName);
            if ((index === 0 && formatCollection.bold) || !formatCollection.bold) {
                nodeCollection.bold = formatCollection.bold;
            }
            if ((index === 0 && formatCollection.insertcode) || !formatCollection.insertcode) {
                nodeCollection.insertcode = formatCollection.insertcode;
            }
            if ((index === 0 && formatCollection.italic) || !formatCollection.italic) {
                nodeCollection.italic = formatCollection.italic;
            }
            if ((index === 0 && formatCollection.underline) || !formatCollection.underline) {
                nodeCollection.underline = formatCollection.underline;
            }
            if ((index === 0 && formatCollection.strikethrough) || !formatCollection.strikethrough) {
                nodeCollection.strikethrough = formatCollection.strikethrough;
            }
            if ((index === 0 && formatCollection.superscript) || !formatCollection.superscript) {
                nodeCollection.superscript = formatCollection.superscript;
            }
            if ((index === 0 && formatCollection.subscript) || !formatCollection.subscript) {
                nodeCollection.subscript = formatCollection.subscript;
            }
            if ((index === 0 && formatCollection.fontcolor) || !formatCollection.fontcolor) {
                nodeCollection.fontcolor = formatCollection.fontcolor;
            }
            if ((index === 0 && formatCollection.fontname) || !formatCollection.fontname) {
                nodeCollection.fontname = formatCollection.fontname;
            }
            if ((index === 0 && formatCollection.fontsize) || !formatCollection.fontsize) {
                nodeCollection.fontsize = formatCollection.fontsize;
            }
            if ((index === 0 && formatCollection.backgroundcolor) || !formatCollection.backgroundcolor) {
                nodeCollection.backgroundcolor = formatCollection.backgroundcolor;
            }
            if ((index === 0 && formatCollection.orderedlist) || !formatCollection.orderedlist) {
                nodeCollection.orderedlist = formatCollection.orderedlist;
            }
            if ((index === 0 && formatCollection.unorderedlist) || !formatCollection.unorderedlist) {
                nodeCollection.unorderedlist = formatCollection.unorderedlist;
            }
            if ((index === 0 && formatCollection.alignments) || !formatCollection.alignments) {
                nodeCollection.alignments = formatCollection.alignments;
            }
            if ((index === 0 && formatCollection.formats) || !formatCollection.formats) {
                nodeCollection.formats = formatCollection.formats;
            }
            if ((index === 0 && formatCollection.createlink) || !formatCollection.createlink) {
                nodeCollection.createlink = formatCollection.createlink;
            }
            formatCollection = JSON.parse(JSON.stringify(statusCollection));
        }
        return nodeCollection;
    };
    ToolbarStatus.getFormatParent = function (docElement, formatCollection, node, targetNode, formatNode, fontSize, fontName) {
        if (targetNode.contains(node) ||
            (node.nodeType === 3 && targetNode.nodeType !== 3 && targetNode.contains(node.parentNode))) {
            do {
                formatCollection = this.isFormattedNode(docElement, formatCollection, node, formatNode, fontSize, fontName);
                node = node.parentNode;
            } while (node && (node !== targetNode));
        }
        return formatCollection;
    };
    ToolbarStatus.isFormattedNode = function (docElement, formatCollection, node, formatNode, fontSize, fontName) {
        if (!formatCollection.bold) {
            formatCollection.bold = IsFormatted.isBold(node);
        }
        if (!formatCollection.italic) {
            formatCollection.italic = IsFormatted.isItalic(node);
        }
        if (!formatCollection.underline) {
            formatCollection.underline = IsFormatted.isUnderline(node);
        }
        if (!formatCollection.strikethrough) {
            formatCollection.strikethrough = IsFormatted.isStrikethrough(node);
        }
        if (!formatCollection.superscript) {
            formatCollection.superscript = IsFormatted.isSuperscript(node);
        }
        if (!formatCollection.subscript) {
            formatCollection.subscript = IsFormatted.isSubscript(node);
        }
        if (!formatCollection.fontcolor) {
            formatCollection.fontcolor = this.isFontColor(docElement, node);
        }
        if (!formatCollection.fontname) {
            formatCollection.fontname = this.isFontName(docElement, node, fontName);
        }
        if (!formatCollection.fontsize) {
            formatCollection.fontsize = this.isFontSize(node, fontSize);
        }
        if (!formatCollection.backgroundcolor) {
            formatCollection.backgroundcolor = this.isBackgroundColor(node);
        }
        if (!formatCollection.orderedlist) {
            formatCollection.orderedlist = this.isOrderedList(node);
        }
        if (!formatCollection.unorderedlist) {
            formatCollection.unorderedlist = this.isUnorderedList(node);
        }
        if (!formatCollection.alignments) {
            formatCollection.alignments = this.isAlignment(node);
        }
        if (!formatCollection.formats) {
            formatCollection.formats = this.isFormats(node, formatNode);
            if (formatCollection.formats === 'pre') {
                formatCollection.insertcode = true;
            }
        }
        if (!formatCollection.createlink) {
            formatCollection.createlink = this.isLink(node);
        }
        return formatCollection;
    };
    ToolbarStatus.isFontColor = function (docElement, node) {
        var color = node.style && node.style.color;
        if ((color === null || color === undefined || color === '') && node.nodeType !== 3) {
            color = this.getComputedStyle(docElement, node, 'color');
        }
        if (color !== null && color !== '' && color !== undefined) {
            return color;
        }
        else {
            return null;
        }
    };
    ToolbarStatus.isLink = function (node) {
        if (node.nodeName.toLocaleLowerCase() === 'a') {
            return true;
        }
        else {
            return false;
        }
    };
    ToolbarStatus.isBackgroundColor = function (node) {
        var backColor = node.style && node.style.backgroundColor;
        if (backColor !== null && backColor !== '' && backColor !== undefined) {
            return backColor;
        }
        else {
            return null;
        }
    };
    ToolbarStatus.isFontSize = function (node, fontSize) {
        var size = node.style && node.style.fontSize;
        if ((size !== null && size !== '' && size !== undefined)
            && (fontSize === null || fontSize === undefined || (fontSize.indexOf(size) > -1))) {
            return size;
        }
        else {
            return null;
        }
    };
    ToolbarStatus.isFontName = function (docElement, node, fontName) {
        var name = node.style && node.style.fontFamily;
        if ((name === null || name === undefined || name === '') && node.nodeType !== 3) {
            name = this.getComputedStyle(docElement, node, 'font-family');
        }
        var index = null;
        if ((name !== null && name !== '' && name !== undefined)
            && (fontName === null || fontName === undefined || (fontName.filter(function (value, pos) {
                var pattern = new RegExp(name, 'i');
                if ((value.replace(/"/g, '').replace(/ /g, '') === name.replace(/"/g, '').replace(/ /g, '')) ||
                    (value.search(pattern) > -1)) {
                    index = pos;
                }
            }) && (index !== null)))) {
            return (index !== null) ? fontName[index] : name.replace(/"/g, '');
        }
        else {
            return null;
        }
    };
    ToolbarStatus.isOrderedList = function (node) {
        if (node.nodeName.toLocaleLowerCase() === 'ol') {
            return true;
        }
        else {
            return false;
        }
    };
    ToolbarStatus.isUnorderedList = function (node) {
        if (node.nodeName.toLocaleLowerCase() === 'ul') {
            return true;
        }
        else {
            return false;
        }
    };
    ToolbarStatus.isAlignment = function (node) {
        var align = node.style && node.style.textAlign;
        if (align === 'left') {
            return 'justifyleft';
        }
        else if (align === 'center') {
            return 'justifycenter';
        }
        else if (align === 'right') {
            return 'justifyright';
        }
        else if (align === 'justify') {
            return 'justifyfull';
        }
        else {
            return null;
        }
    };
    ToolbarStatus.isFormats = function (node, formatNode) {
        if (((formatNode === undefined || formatNode === null)
            && CONSTANT.BLOCK_TAGS.indexOf(node.nodeName.toLocaleLowerCase()) > -1)
            || (formatNode !== null && formatNode !== undefined
                && formatNode.indexOf(node.nodeName.toLocaleLowerCase()) > -1)) {
            return node.nodeName.toLocaleLowerCase();
        }
        else {
            return null;
        }
    };
    ToolbarStatus.getComputedStyle = function (docElement, node, prop) {
        return docElement.defaultView.getComputedStyle(node, null).getPropertyValue(prop);
    };
    return ToolbarStatus;
}());
export { ToolbarStatus };
