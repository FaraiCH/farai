var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { WTableFormat, WRowFormat, WCellFormat } from '../format/index';
import { WParagraphFormat, WCharacterFormat, WBorder, WBorders } from '../format/index';
import { isNullOrUndefined, createElement } from '@syncfusion/ej2-base';
import { Dictionary } from '../../base/dictionary';
// tslint:disable-next-line:max-line-length
import { HelperMethods } from '../editor/editor-helper';
import { WebLayoutViewer } from './viewer';
import { Revision } from '../track-changes/track-changes';
/**
 * @private
 */
var Rect = /** @class */ (function () {
    function Rect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Object.defineProperty(Rect.prototype, "right", {
        /**
         * @private
         */
        get: function () {
            return this.x + this.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "bottom", {
        /**
         * @private
         */
        get: function () {
            return this.y + this.height;
        },
        enumerable: true,
        configurable: true
    });
    return Rect;
}());
export { Rect };
/**
 * @private
 */
var Padding = /** @class */ (function () {
    function Padding(right, left, top, bottom) {
        this.right = 10;
        this.left = 10;
        this.top = 10;
        this.bottom = 10;
        this.right = right;
        this.left = left;
        this.top = top;
        this.bottom = bottom;
    }
    return Padding;
}());
export { Padding };
/**
 * @private
 */
var Margin = /** @class */ (function () {
    function Margin(leftMargin, topMargin, rightMargin, bottomMargin) {
        this.left = leftMargin;
        this.top = topMargin;
        this.right = rightMargin;
        this.bottom = bottomMargin;
    }
    /**
     * @private
     */
    Margin.prototype.clone = function () {
        return new Margin(this.left, this.top, this.right, this.bottom);
    };
    /**
     * @private
     */
    Margin.prototype.destroy = function () {
        this.left = undefined;
        this.right = undefined;
        this.top = undefined;
        this.bottom = undefined;
    };
    return Margin;
}());
export { Margin };
/**
 * @private
 */
var Widget = /** @class */ (function () {
    function Widget() {
        /**
         * @private
         */
        this.childWidgets = [];
        /**
         * @private
         */
        this.x = 0;
        /**
         * @private
         */
        this.y = 0;
        /**
         * @private
         */
        this.width = 0;
        /**
         * @private
         */
        this.height = 0;
        /**
         * @private
         */
        this.index = 0;
    }
    Object.defineProperty(Widget.prototype, "indexInOwner", {
        /**
         * @private
         */
        get: function () {
            if (this instanceof BodyWidget && this.page) {
                return this.page.bodyWidgets.indexOf(this);
            }
            else if (this.containerWidget && this.containerWidget.childWidgets) {
                return this.containerWidget.childWidgets.indexOf(this);
            }
            else if (this instanceof FootNoteWidget) {
                return 0;
            }
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "firstChild", {
        /**
         * @private
         */
        get: function () {
            return this.childWidgets.length > 0 ? this.childWidgets[0] : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "lastChild", {
        /**
         * @private
         */
        get: function () {
            if (this.childWidgets) {
                return this.childWidgets.length > 0 ?
                    this.childWidgets[this.childWidgets.length - 1] : undefined;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "previousWidget", {
        /**
         * @private
         */
        get: function () {
            var widget = this;
            var index = this.indexInOwner;
            if (widget instanceof BodyWidget) {
                widget = index > 0 ? widget.page.bodyWidgets[index - 1] : undefined;
            }
            else {
                widget = index > 0 ? widget.containerWidget.childWidgets[index - 1] : undefined;
            }
            return widget;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "nextWidget", {
        /**
         * @private
         */
        get: function () {
            var widget = this;
            var index = this.indexInOwner;
            if (index === -1) {
                return undefined;
            }
            if (widget instanceof BodyWidget) {
                widget = index < widget.page.bodyWidgets.length - 1 ?
                    widget.page.bodyWidgets[index + 1] : undefined;
            }
            else {
                widget = index < widget.containerWidget.childWidgets.length - 1 ?
                    widget.containerWidget.childWidgets[index + 1] : undefined;
            }
            return widget;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "previousRenderedWidget", {
        /**
         * @private
         */
        get: function () {
            var widget = this;
            var index = this.indexInOwner;
            if (index < 0) {
                return undefined;
            }
            if (widget instanceof BodyWidget) {
                if (index > 0) {
                    widget = widget.page.bodyWidgets[index - 1];
                }
                else {
                    var page = widget.page.previousPage;
                    widget = page && page.bodyWidgets.length > 0 ? page.bodyWidgets[page.bodyWidgets.length - 1] : undefined;
                }
            }
            else if (widget instanceof FootNoteWidget) {
                var page = widget.page;
                while (page.previousPage) {
                    page = page.previousPage;
                    widget = page.footnoteWidget;
                    if (!isNullOrUndefined(widget)) {
                        break;
                    }
                }
            }
            else {
                if (index > 0) {
                    widget = widget.containerWidget.childWidgets[index - 1];
                }
                else {
                    var previousContainer = undefined;
                    if (widget.containerWidget instanceof TableCellWidget) {
                        previousContainer = widget.containerWidget.getPreviousSplitWidget();
                    }
                    else if (!(widget.containerWidget instanceof TableRowWidget
                        || widget.containerWidget instanceof HeaderFooterWidget)) {
                        // Since cells are lay outed left to right, we should not navigate to previous row.
                        previousContainer = widget.containerWidget.previousRenderedWidget;
                    }
                    while (previousContainer && previousContainer.childWidgets.length === 0) {
                        previousContainer = previousContainer.previousRenderedWidget;
                        if (isNullOrUndefined(previousContainer)) {
                            break;
                        }
                    }
                    widget = previousContainer && previousContainer.constructor === widget.containerWidget.constructor ?
                        previousContainer.lastChild : undefined;
                }
            }
            return widget;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "nextRenderedWidget", {
        /**
         * @private
         */
        get: function () {
            var widget = this;
            var index = this.indexInOwner;
            if (index < 0) {
                return undefined;
            }
            if (widget instanceof BodyWidget) {
                if (index < widget.page.bodyWidgets.length - 1) {
                    widget = widget.page.bodyWidgets[index + 1];
                }
                else if (widget.page.allowNextPageRendering) {
                    var page = widget.page.nextPage;
                    widget = page && page.bodyWidgets.length > 0 ? page.bodyWidgets[0] : undefined;
                }
                else {
                    widget = undefined;
                }
            }
            else if (widget instanceof FootNoteWidget) {
                var page = widget.page;
                while (page.allowNextPageRendering && page.nextPage) {
                    page = page.nextPage;
                    widget = page.footnoteWidget;
                    if (!isNullOrUndefined(widget)) {
                        break;
                    }
                }
            }
            else {
                if (index < widget.containerWidget.childWidgets.length - 1) {
                    widget = widget.containerWidget.childWidgets[index + 1];
                }
                else {
                    var nextContainer = undefined;
                    if (widget.containerWidget instanceof TableCellWidget) {
                        nextContainer = widget.containerWidget.getNextSplitWidget();
                    }
                    else if (!(widget.containerWidget instanceof TableRowWidget
                        || widget.containerWidget instanceof HeaderFooterWidget
                        || widget.containerWidget instanceof FootNoteWidget)) {
                        // Since cells are lay outed left to right, we should not navigate to next row.
                        nextContainer = widget.containerWidget.nextRenderedWidget;
                    }
                    while (nextContainer && nextContainer.childWidgets.length === 0 && !(nextContainer instanceof TableCellWidget)) {
                        nextContainer = nextContainer.nextRenderedWidget;
                        if (isNullOrUndefined(nextContainer)) {
                            break;
                        }
                    }
                    widget = nextContainer && nextContainer.constructor === widget.containerWidget.constructor ?
                        nextContainer.firstChild : undefined;
                }
            }
            return widget;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "previousSplitWidget", {
        /**
         * @private
         */
        get: function () {
            var widget = this;
            if (widget instanceof TableCellWidget) {
                return widget.getPreviousSplitWidget();
            }
            else {
                var previous = widget.previousRenderedWidget;
                if (widget instanceof BodyWidget && previous instanceof BodyWidget && widget.equals(previous)) {
                    return previous;
                }
                else if (previous instanceof BlockWidget && widget.index === previous.index && widget.equals(previous)) {
                    return previous;
                }
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "nextSplitWidget", {
        /**
         * @private
         */
        get: function () {
            var widget = this;
            if (widget instanceof TableCellWidget) {
                return widget.getNextSplitWidget();
            }
            else {
                var next = widget.nextRenderedWidget;
                if (widget instanceof BodyWidget && next instanceof BodyWidget && widget.equals(next)) {
                    return next;
                }
                else if (next instanceof BlockWidget && widget.index === next.index && widget.equals(next)) {
                    return next;
                }
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    Widget.prototype.getPreviousSplitWidgets = function () {
        var widgets = [];
        var widget = this.previousSplitWidget;
        while (widget) {
            widgets.unshift(widget);
            widget = widget.previousSplitWidget;
        }
        return widgets;
    };
    /**
     * @private
     */
    Widget.prototype.getSplitWidgets = function () {
        var widgets = this.getPreviousSplitWidgets();
        var widget = this;
        while (widget) {
            widgets.push(widget);
            widget = widget.nextSplitWidget;
        }
        return widgets;
    };
    /**
     * @private
     */
    Widget.prototype.combineWidget = function (viewer) {
        var root = this;
        var widgets = this.getSplitWidgets();
        if (widgets.length > 1) {
            root = widgets.shift();
            while (widgets.length > 0) {
                var splitWidget = widgets.shift();
                root.combine(splitWidget, viewer);
            }
        }
        if (root instanceof TableWidget) {
            root.combineRows(viewer);
        }
        return root;
    };
    Widget.prototype.combine = function (widget, viewer) {
        if (widget.childWidgets.length > 0) {
            var lastChild = this.lastChild;
            if (lastChild instanceof TableWidget) {
                lastChild.combineWidget(viewer);
            }
            else {
                var firstChild = widget.firstChild;
                if (!(widget instanceof TableWidget) && lastChild instanceof Widget && firstChild instanceof Widget &&
                    lastChild.index === firstChild.index) {
                    lastChild.combine(widget.childWidgets.shift(), viewer);
                }
            }
            this.addWidgets(widget.childWidgets);
            widget.childWidgets = [];
        }
        widget.destroyInternal(viewer);
    };
    /**
     * @private
     */
    Widget.prototype.addWidgets = function (childWidgets) {
        while (childWidgets.length > 0) {
            var widget = childWidgets.shift();
            if (widget instanceof LineWidget && this instanceof ParagraphWidget) {
                widget.paragraph = this;
                this.height += widget.height;
            }
            else if (widget instanceof Widget) {
                var lastChild = this.lastChild;
                widget.containerWidget = this;
                widget.y = lastChild instanceof Widget ? lastChild.y + lastChild.height : this.y;
                this.height += widget.height;
            }
            this.childWidgets.push(widget);
        }
    };
    /**
     * @private
     */
    Widget.prototype.removeChild = function (index) {
        if (index > -1 && index < this.childWidgets.length) {
            this.childWidgets.splice(index, 1);
        }
    };
    /**
     * @private
     */
    Widget.prototype.destroy = function () {
        if (this.childWidgets) {
            while (this.childWidgets.length > 0) {
                var child = this.childWidgets.pop();
                if (child instanceof LineWidget || child instanceof Widget) {
                    child.destroy();
                }
            }
        }
        this.childWidgets = undefined;
        if (this.containerWidget) {
            this.containerWidget.removeChild(this.indexInOwner);
        }
        this.containerWidget = undefined;
        // if (this.margin) {
        //     this.margin.destroy();
        // }
        this.margin = undefined;
        this.x = undefined;
        this.y = undefined;
        this.width = undefined;
        this.height = undefined;
        this.index = undefined;
    };
    return Widget;
}());
export { Widget };
/**
 * @private
 */
var BlockContainer = /** @class */ (function (_super) {
    __extends(BlockContainer, _super);
    function BlockContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * @private
         */
        _this.floatingElements = [];
        /**
         * @private
         */
        _this.sectionFormatIn = undefined;
        return _this;
    }
    Object.defineProperty(BlockContainer.prototype, "sectionFormat", {
        /**
         * @private
         */
        get: function () {
            var container = this;
            if (container instanceof BodyWidget) {
                return container.sectionFormatIn;
            }
            else if (container.page) {
                return container.page.bodyWidgets[0].sectionFormat;
            }
            return undefined;
        },
        /**
         * @private
         */
        set: function (value) {
            if (this instanceof BodyWidget) {
                this.sectionFormatIn = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockContainer.prototype, "sectionIndex", {
        /**
         * @private
         */
        get: function () {
            var container = this;
            var index = 0;
            if (container instanceof BodyWidget) {
                index = container.index;
            }
            else if (container.page) {
                index = container.page.bodyWidgets[0].index;
            }
            return index;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    BlockContainer.prototype.getHierarchicalIndex = function (hierarchicalIndex) {
        var documentHelper = undefined;
        var node = this;
        if (node instanceof BodyWidget) {
            hierarchicalIndex = node.index + ';' + hierarchicalIndex;
        }
        else if (node instanceof FootNoteWidget) {
            if (node.footNoteType === 'Footnote') {
                hierarchicalIndex = 'FN' + ';' + hierarchicalIndex;
            }
            else {
                hierarchicalIndex = 'EN' + ';' + hierarchicalIndex;
            }
        }
        else {
            if (node.headerFooterType.indexOf('Header') !== -1) {
                hierarchicalIndex = 'H' + ';' + hierarchicalIndex;
            }
            else {
                hierarchicalIndex = 'F' + ';' + hierarchicalIndex;
            }
        }
        if (!isNullOrUndefined(node.page)) {
            documentHelper = this.page.documentHelper;
            var pageIndex = documentHelper.pages.indexOf(this.page);
            return pageIndex + ';' + hierarchicalIndex;
        }
        return hierarchicalIndex;
    };
    return BlockContainer;
}(Widget));
export { BlockContainer };
/**
 * @private
 */
var BodyWidget = /** @class */ (function (_super) {
    __extends(BodyWidget, _super);
    /**
     * Initialize the constructor of BodyWidget
     */
    function BodyWidget() {
        return _super.call(this) || this;
    }
    /**
     * @private
     */
    BodyWidget.prototype.equals = function (widget) {
        return widget instanceof BodyWidget && widget.sectionFormat === this.sectionFormat;
    };
    /**
     * @private
     */
    BodyWidget.prototype.getHierarchicalIndex = function (hierarchicalIndex) {
        var documentHelper = undefined;
        var node = this;
        hierarchicalIndex = node.index + ';' + hierarchicalIndex;
        if (!isNullOrUndefined(node.page)) {
            documentHelper = this.page.documentHelper;
            var pageIndex = documentHelper.pages.indexOf(this.page);
            return pageIndex + ';' + hierarchicalIndex;
        }
        return hierarchicalIndex;
    };
    /**
     * @private
     */
    BodyWidget.prototype.getTableCellWidget = function (touchPoint) {
        for (var i = 0; i < this.childWidgets.length; i++) {
            if (this.childWidgets[i].y <= touchPoint.y
                && (this.childWidgets[i].y + this.childWidgets[i].height) >= touchPoint.y) {
                return this.childWidgets[i].getTableCellWidget(touchPoint);
            }
        }
        var tableCellWidget = undefined;
        if (this.childWidgets.length > 0) {
            if (this.childWidgets[0].y <= touchPoint.y) {
                tableCellWidget = this.childWidgets[this.childWidgets.length - 1].getTableCellWidget(touchPoint);
            }
            else {
                tableCellWidget = this.childWidgets[0].getTableCellWidget(touchPoint);
            }
        }
        return tableCellWidget;
    };
    /**
     * @private
     */
    BodyWidget.prototype.destroyInternal = function (viewer) {
        var height = this.height;
        if (!isNullOrUndefined(this.childWidgets)) {
            for (var n = 0; n < this.childWidgets.length; n++) {
                var chilgWidget = this.childWidgets[n];
                if (chilgWidget instanceof ParagraphWidget) {
                    chilgWidget.destroyInternal(viewer);
                }
                else {
                    chilgWidget.destroyInternal(viewer);
                }
                if (isNullOrUndefined(this.childWidgets)) {
                    break;
                }
                n--;
            }
            this.childWidgets = undefined;
        }
        // if (this instanceof HeaderFooterWidget && ((this as HeaderFooterWidget).currentNode ))) {
        //     if (((this as HeaderFooterWidget).currentNode as WHeaderFooter).layoutedWidgets )) {
        //         let index: number = ((this as HeaderFooterWidget).currentNode as WHeaderFooter).layoutedWidgets.indexOf(this);
        //         ((this as HeaderFooterWidget).currentNode as WHeaderFooter).layoutedWidgets.splice(index, 1);
        //     }
        //     this.currentNode = undefined;
        /* tslint:disable: one-line */
        if (!isNullOrUndefined(this.page)) {
            var index = this.indexInOwner;
            if (this.indexInOwner > -1) {
                this.page.bodyWidgets.splice(index, 1);
                if (this.page.bodyWidgets.length === 0) {
                    this.page.destroy();
                    // }
                }
                else if ((this instanceof HeaderFooterWidget)
                    && this.page.headerWidget === this) {
                    this.page.headerWidget = undefined;
                }
                else if ((this instanceof HeaderFooterWidget)
                    && this.page.footerWidget === this) {
                    this.page.footerWidget = undefined;
                }
                this.page = undefined;
            }
        }
        this.destroy();
    };
    /**
     * @private
     */
    BodyWidget.prototype.destroy = function () {
        // if (this.sectionFormat) {
        //     this.sectionFormat.destroy();
        // }
        this.sectionFormat = undefined;
        this.page = undefined;
        _super.prototype.destroy.call(this);
    };
    return BodyWidget;
}(BlockContainer));
export { BodyWidget };
/**
 * @private
 */
var HeaderFooterWidget = /** @class */ (function (_super) {
    __extends(HeaderFooterWidget, _super);
    function HeaderFooterWidget(type) {
        var _this = _super.call(this) || this;
        /**
         * @private
         */
        _this.isEmpty = false;
        _this.headerFooterType = type;
        return _this;
    }
    /**
     * @private
     */
    HeaderFooterWidget.prototype.getTableCellWidget = function (point) {
        return undefined;
    };
    /**
     * @private
     */
    HeaderFooterWidget.prototype.equals = function (widget) {
        // Todo: Need to work
        return widget instanceof HeaderFooterWidget
            && widget.containerWidget === this.containerWidget;
    };
    /**
     * @private
     */
    HeaderFooterWidget.prototype.clone = function () {
        var headerFooter = new HeaderFooterWidget(this.headerFooterType);
        for (var i = 0; i < this.childWidgets.length; i++) {
            var block = this.childWidgets[i].clone();
            headerFooter.childWidgets.push(block);
            block.index = i;
            block.containerWidget = headerFooter;
        }
        headerFooter.isEmpty = this.isEmpty;
        headerFooter.x = this.x;
        headerFooter.y = this.y;
        headerFooter.height = 0;
        headerFooter.width = 0;
        return headerFooter;
    };
    /**
     * @private
     */
    HeaderFooterWidget.prototype.destroyInternal = function (viewer) {
        this.page = undefined;
        _super.prototype.destroy.call(this);
    };
    return HeaderFooterWidget;
}(BlockContainer));
export { HeaderFooterWidget };
/**
 * @private
 */
var BlockWidget = /** @class */ (function (_super) {
    __extends(BlockWidget, _super);
    function BlockWidget() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * @private
         */
        _this.locked = false;
        /**
         * @private
         */
        _this.lockedBy = '';
        _this.footNoteReference = undefined;
        return _this;
    }
    Object.defineProperty(BlockWidget.prototype, "bodyWidget", {
        /**
         * @private
         */
        get: function () {
            var widget = this;
            while (widget.containerWidget) {
                if (widget.containerWidget instanceof TextFrame) {
                    var paragraph = widget.containerWidget.containerShape.line.paragraph;
                    if (paragraph) {
                        return paragraph.bodyWidget;
                    }
                }
                else if (widget.containerWidget instanceof BlockContainer) {
                    return widget.containerWidget;
                }
                widget = widget.containerWidget;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockWidget.prototype, "leftIndent", {
        /**
         * @private
         */
        get: function () {
            var blockAdv = this;
            if (blockAdv instanceof ParagraphWidget && blockAdv.paragraphFormat instanceof WParagraphFormat) {
                return blockAdv.paragraphFormat.leftIndent;
            }
            else if (blockAdv instanceof TableWidget && blockAdv.tableFormat instanceof WTableFormat) {
                return blockAdv.tableFormat.leftIndent;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockWidget.prototype, "rightIndent", {
        /**
         * @private
         */
        get: function () {
            var blockAdv = this;
            if (blockAdv instanceof ParagraphWidget && blockAdv.paragraphFormat instanceof WParagraphFormat) {
                return blockAdv.paragraphFormat.rightIndent;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockWidget.prototype, "isInsideTable", {
        /**
         * @private
         */
        get: function () {
            return this.containerWidget instanceof TableCellWidget;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockWidget.prototype, "isInHeaderFooter", {
        /**
         * @private
         */
        get: function () {
            return this.bodyWidget instanceof HeaderFooterWidget;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlockWidget.prototype, "associatedCell", {
        /**
         * @private
         */
        get: function () {
            if (this.containerWidget instanceof TableCellWidget) {
                return this.containerWidget;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Check whether the paragraph contains only page break.
     * @private
     */
    BlockWidget.prototype.isPageBreak = function () {
        var isPageBreak = false;
        if (this instanceof ParagraphWidget) {
            var paragraph = this;
            if (paragraph != null && paragraph.childWidgets.length === 1 &&
                paragraph.firstChild.children.length === 1) {
                var pageBreak = paragraph.firstChild.children[0];
                isPageBreak = pageBreak.isPageBreak;
            }
        }
        return isPageBreak;
    };
    /**
     * @private
     */
    BlockWidget.prototype.getHierarchicalIndex = function (hierarchicalIndex) {
        var node = this;
        hierarchicalIndex = node.containerWidget.childWidgets.indexOf(node) + ';' + hierarchicalIndex;
        if (!isNullOrUndefined(node.containerWidget)) {
            if (node.containerWidget instanceof TextFrame) {
                return node.containerWidget.getHierarchicalIndex(hierarchicalIndex);
            }
            else if (node.containerWidget instanceof BlockWidget) {
                return node.containerWidget.getHierarchicalIndex(hierarchicalIndex);
            }
            else if (node.containerWidget instanceof BlockContainer) {
                hierarchicalIndex = node.containerWidget.getHierarchicalIndex(hierarchicalIndex);
            }
        }
        return hierarchicalIndex;
    };
    /**
     * @private
     */
    BlockWidget.prototype.getIndex = function () {
        if (this instanceof ParagraphWidget || this instanceof TableWidget) {
            return this.containerWidget.childWidgets.indexOf(this);
        }
        else if (this instanceof TableRowWidget) {
            return this.ownerTable.childWidgets.indexOf(this);
        }
        else if (this instanceof TableCellWidget) {
            return this.ownerRow.childWidgets.indexOf(this);
        }
        return 0;
    };
    /**
     * @private
     */
    BlockWidget.prototype.getContainerWidth = function () {
        if (this.isInsideTable) {
            return this.associatedCell.getCellWidth();
        }
        if (this.containerWidget instanceof TextFrame) {
            var shape = this.containerWidget.containerShape;
            return HelperMethods.convertPixelToPoint(shape.width) - HelperMethods.convertPixelToPoint(shape.textFrame.marginLeft)
                - HelperMethods.convertPixelToPoint(shape.textFrame.marginRight);
        }
        else {
            var bodyWidget = this.bodyWidget;
            var sectionFormat = bodyWidget.sectionFormat;
            return sectionFormat.pageWidth - (sectionFormat.leftMargin + sectionFormat.rightMargin);
        }
    };
    Object.defineProperty(BlockWidget.prototype, "bidi", {
        /**
         * @private
         */
        get: function () {
            if (this instanceof ParagraphWidget && this.paragraphFormat instanceof WParagraphFormat) {
                return this.paragraphFormat.bidi;
            }
            if (this instanceof TableWidget && this.tableFormat instanceof WTableFormat) {
                return this.tableFormat.bidi;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return BlockWidget;
}(Widget));
export { BlockWidget };
/**
 * @private
 */
var FootNoteWidget = /** @class */ (function (_super) {
    __extends(FootNoteWidget, _super);
    function FootNoteWidget() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FootNoteWidget.prototype.getMinimumAndMaximumWordWidth = function (minimumWordWidth, maximumWordWidth) {
        throw new Error('Method not implemented.');
    };
    /**
     * @private
     */
    FootNoteWidget.prototype.getTableCellWidget = function (point) {
        return undefined;
    };
    /**
     * @private
     */
    FootNoteWidget.prototype.equals = function (widget) {
        // Todo: Need to work
        return widget instanceof FootNoteWidget
            && widget.containerWidget === this.containerWidget;
    };
    /**
     * @private
     */
    FootNoteWidget.prototype.clone = function () {
        var footNote = new FootNoteWidget();
        for (var i = 0; i < this.childWidgets.length; i++) {
            var block = this.childWidgets[i].clone();
            footNote.childWidgets.push(block);
            block.index = i;
            block.containerWidget = footNote;
        }
        footNote.block = this.block;
        return footNote;
    };
    /**
     * @private
     */
    FootNoteWidget.prototype.destroyInternal = function (viewer) {
        this.block = undefined;
        _super.prototype.destroy.call(this);
    };
    return FootNoteWidget;
}(BlockContainer));
export { FootNoteWidget };
/**
 * @private
 */
var ParagraphWidget = /** @class */ (function (_super) {
    __extends(ParagraphWidget, _super);
    /**
     * Initialize the constructor of ParagraphWidget
     */
    function ParagraphWidget() {
        var _this = _super.call(this) || this;
        /**
         * @private
         */
        _this.isChangeDetected = false;
        /**
         * @private
         */
        _this.floatingElements = [];
        _this.paragraphFormat = new WParagraphFormat(_this);
        _this.characterFormat = new WCharacterFormat(_this);
        return _this;
    }
    Object.defineProperty(ParagraphWidget.prototype, "isEndsWithPageBreak", {
        /**
         * @private
         */
        get: function () {
            if (this.childWidgets.length > 0) {
                return this.lastChild.isEndsWithPageBreak;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ParagraphWidget.prototype.equals = function (widget) {
        return widget instanceof ParagraphWidget && widget.paragraphFormat === this.paragraphFormat;
    };
    /**
     * @private
     */
    ParagraphWidget.prototype.isEmpty = function () {
        if (isNullOrUndefined(this.childWidgets) || this.childWidgets.length === 0) {
            return true;
        }
        for (var j = 0; j < this.childWidgets.length; j++) {
            var inlineElement = this.childWidgets[j];
            for (var i = 0; i < inlineElement.children.length; i++) {
                var inline = inlineElement.children[i];
                if (inline.length === 0) {
                    continue;
                }
                if (inline instanceof TextElementBox || inline instanceof ImageElementBox || inline instanceof BookmarkElementBox
                    || inline instanceof EditRangeEndElementBox || inline instanceof EditRangeStartElementBox
                    || inline instanceof ChartElementBox || inline instanceof ShapeElementBox
                    || inline instanceof ContentControl
                    || (inline instanceof FieldElementBox && HelperMethods.isLinkedFieldCharacter(inline))) {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * @private
     */
    ParagraphWidget.prototype.getInline = function (offset, indexInInline) {
        var inline = undefined;
        var count = 0;
        var isStarted = false;
        var splittedWidget = this.getSplitWidgets();
        for (var k = 0; k < splittedWidget.length; k++) {
            var widget = splittedWidget[k];
            for (var j = 0; j < widget.childWidgets.length; j++) {
                var line = widget.childWidgets[j];
                for (var i = 0; i < line.children.length; i++) {
                    inline = line.children[i];
                    if (inline instanceof ListTextElementBox) {
                        continue;
                    }
                    if (!isStarted && (inline instanceof TextElementBox || inline instanceof ImageElementBox
                        || inline instanceof ShapeElementBox
                        || inline instanceof BookmarkElementBox || inline instanceof FieldElementBox
                        && HelperMethods.isLinkedFieldCharacter(inline))
                        || inline instanceof ChartElementBox) {
                        isStarted = true;
                    }
                    if (isStarted && offset <= count + inline.length) {
                        indexInInline = (offset - count);
                        return { 'element': inline, 'index': indexInInline };
                    }
                    count += inline.length;
                }
            }
        }
        if (offset > count) {
            indexInInline = isNullOrUndefined(inline) ? offset : inline.length;
        }
        return { 'element': inline, 'index': indexInInline };
    };
    /**
     * @private
     */
    ParagraphWidget.prototype.getLength = function () {
        var length = 0;
        for (var j = 0; j < this.childWidgets.length; j++) {
            var line = this.childWidgets[j];
            for (var i = 0; i < line.children.length; i++) {
                var element = line.children[i];
                if (element instanceof ListTextElementBox) {
                    continue;
                }
                length += element.length;
            }
        }
        return length;
    };
    /**
     * @private
     */
    ParagraphWidget.prototype.getTableCellWidget = function (point) {
        return undefined;
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    ParagraphWidget.prototype.getMinimumAndMaximumWordWidth = function (minimumWordWidth, maximumWordWidth) {
        minimumWordWidth = HelperMethods.convertPointToPixel(minimumWordWidth);
        maximumWordWidth = HelperMethods.convertPointToPixel(maximumWordWidth);
        if (this.childWidgets.length > 0) {
            var element = this.childWidgets[0].children[0];
            var text = '';
            var elements = new Dictionary();
            var imageWidths = [];
            // tslint:disable-next-line:no-constant-condition
            do {
                if (element instanceof TextElementBox && element.text !== '') {
                    elements.add(element, text.length);
                    text += (element.text);
                }
                else if (element instanceof FieldElementBox && element.fieldType === 0) {
                    var fieldBegin = element;
                    // tslint:disable-next-line:max-line-length
                    if (!isNullOrUndefined(fieldBegin.fieldEnd)) {
                        element = isNullOrUndefined(fieldBegin.fieldSeparator) ? fieldBegin.fieldEnd : fieldBegin.fieldSeparator;
                    }
                }
                else if (element instanceof ImageElementBox) {
                    imageWidths.push(element.width);
                }
                if (isNullOrUndefined(element) || isNullOrUndefined(element.nextNode)) {
                    break;
                }
                element = element.nextNode;
            } while (true);
            var pattern = new RegExp('\\b\\w+\\b', 'g');
            var matches = [];
            var matchInfo = void 0;
            //tslint:disable no-conditional-assignment
            while (!isNullOrUndefined(matchInfo = pattern.exec(text))) {
                matches.push(matchInfo);
            }
            for (var i = 0; i < matches.length; i++) {
                var match = matches[i];
                var width = 0;
                text = '';
                var matchedValue = '';
                var wordStartIndex = 0;
                var wordEndIndex = match.index;
                var index = match.index;
                for (var j = 0; j < elements.keys.length; j++) {
                    var span = elements.keys[j];
                    var startIndex = elements.get(span);
                    var spanLength = span.length;
                    if (index <= startIndex + spanLength) {
                        wordStartIndex = index - startIndex;
                        if (match.index + match[0].length <= startIndex + spanLength) {
                            wordEndIndex = (match.index + match[0].length) - (startIndex + wordStartIndex);
                        }
                        else {
                            wordEndIndex = spanLength - wordStartIndex;
                            index += wordEndIndex;
                        }
                        text = span.text.substring(wordStartIndex, wordStartIndex + wordEndIndex);
                        matchedValue = matchedValue + text;
                    }
                    if (text !== '') {
                        width += this.bodyWidget.page.documentHelper.textHelper.getWidth(text, span.characterFormat);
                    }
                    if (matchedValue === match[0]) {
                        break;
                    }
                }
                if (width !== 0) {
                    if (minimumWordWidth === 0 || width > minimumWordWidth) {
                        minimumWordWidth = width;
                    }
                }
            }
            // Check the image widths present in the paragraph. Consider the maximum image width as minimum word width.
            var imageWidth = 0;
            if (imageWidths.length > 0) {
                imageWidth = Math.max.apply(null, imageWidths);
            }
            if (minimumWordWidth === 0 || imageWidth > minimumWordWidth) {
                minimumWordWidth = imageWidth;
            }
            var maximum = this.measureParagraph();
            if (maximumWordWidth === 0 || maximum > maximumWordWidth) {
                maximumWordWidth = maximum;
            }
        }
        return {
            'maximumWordWidth': HelperMethods.convertPixelToPoint(maximumWordWidth),
            'minimumWordWidth': HelperMethods.convertPixelToPoint(minimumWordWidth)
        };
    };
    ParagraphWidget.prototype.measureParagraph = function () {
        var width = 0;
        var element = this.childWidgets[0].children[0];
        // tslint:disable-next-line:no-constant-condition
        do {
            if (element instanceof TextElementBox && element.text !== '') {
                width += this.bodyWidget.page.documentHelper.textHelper.getWidth(element.text, element.characterFormat);
            }
            else if (element instanceof FieldElementBox && element.fieldType === 0) {
                var fieldBegin = element;
                if (fieldBegin.fieldEnd != null) {
                    element = isNullOrUndefined(fieldBegin.fieldSeparator) ? fieldBegin.fieldEnd : fieldBegin.fieldSeparator;
                }
            }
            else if (element instanceof ImageElementBox) {
                width += element.width;
            }
            if (isNullOrUndefined(element) || isNullOrUndefined(element.nextNode)) {
                break;
            }
            element = element.nextNode;
        } while (true);
        // Considered the left and right indent.
        if (this.leftIndent > 0) {
            width += this.leftIndent;
        }
        if (this.rightIndent > 0) {
            width += this.rightIndent;
        }
        return width;
    };
    /**
     * @private
     */
    ParagraphWidget.prototype.clone = function () {
        var paragraph = new ParagraphWidget();
        paragraph.paragraphFormat.copyFormat(this.paragraphFormat);
        paragraph.characterFormat.copyFormat(this.characterFormat);
        for (var i = 0; i < this.childWidgets.length; i++) {
            var line = this.childWidgets[i];
            var cloneLine = line.clone();
            paragraph.childWidgets.push(cloneLine);
            cloneLine.paragraph = paragraph;
        }
        paragraph.x = this.x;
        paragraph.y = this.y;
        paragraph.height = this.height;
        paragraph.width = this.width;
        if (this.contentControlProperties) {
            paragraph.contentControlProperties = this.contentControlProperties;
        }
        return paragraph;
    };
    /**
     * @private
     */
    ParagraphWidget.prototype.destroyInternal = function (viewer) {
        var height = this.height;
        if (!isNullOrUndefined(this.childWidgets)) {
            for (var i = 0; i < this.childWidgets.length; i++) {
                var widget = this.childWidgets[i];
                widget.destroy();
                if (this.childWidgets.length === 1 && isNullOrUndefined(this.childWidgets[0].children)) {
                    this.childWidgets = undefined;
                }
                if (isNullOrUndefined(this.childWidgets)) {
                    break;
                }
                i--;
            }
            this.childWidgets = undefined;
        }
        if (!isNullOrUndefined(this.containerWidget) && !isNullOrUndefined(this.containerWidget.childWidgets)
            && this.containerWidget.childWidgets.indexOf(this) !== -1) {
            this.containerWidget.childWidgets.splice(this.containerWidget.childWidgets.indexOf(this), 1);
            this.containerWidget.height -= height;
            // if ((isNullOrUndefined(this.containerWidget.childWidgets) || this.containerWidget.childWidgets.length === 0)
            //     && this.containerWidget instanceof BodyWidget) {
            //     // (this.containerWidget as BodyWidget).destroyInternal(viewer);
            // }
            this.containerWidget = undefined;
        }
        this.destroy();
    };
    /**
     * @private
     */
    ParagraphWidget.prototype.destroy = function () {
        // if (this.paragraphFormat) {
        //     this.paragraphFormat.destroy();
        // }
        this.paragraphFormat = undefined;
        // if (this.characterFormat) {
        //     this.characterFormat.destroy();
        // }
        this.characterFormat = undefined;
        _super.prototype.destroy.call(this);
    };
    return ParagraphWidget;
}(BlockWidget));
export { ParagraphWidget };
/**
 * @private
 */
var TableWidget = /** @class */ (function (_super) {
    __extends(TableWidget, _super);
    function TableWidget() {
        var _this = _super.call(this) || this;
        _this.flags = 0;
        /**
         * @private
         */
        _this.leftMargin = 0;
        /**
         * @private
         */
        _this.topMargin = 0;
        /**
         * @private
         */
        _this.rightMargin = 0;
        /**
         * @private
         */
        _this.bottomMargin = 0;
        /**
         * @private
         */
        _this.isDefaultFormatUpdated = false;
        _this.margin = new Margin(_this.leftMargin, _this.topMargin, _this.rightMargin, _this.bottomMargin);
        _this.leftBorderWidth = 0;
        _this.rightBorderWidth = 0;
        _this.topBorderWidth = 0;
        _this.bottomBorderWidth = 0;
        _this.tableFormat = new WTableFormat(_this);
        _this.tableHolder = new WTableHolder();
        _this.spannedRowCollection = new Dictionary();
        return _this;
    }
    Object.defineProperty(TableWidget.prototype, "isGridUpdated", {
        /**
         * @private
         */
        get: function () {
            return ((this.flags & 0x4) >> 2) !== 0;
        },
        /**
         * @private
         */
        set: function (value) {
            this.flags = ((this.flags & 0xFB) | ((value ? 1 : 0) << 2));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableWidget.prototype, "continueHeader", {
        /**
         * @private
         */
        get: function () {
            return ((this.flags & 0x2) >> 1) !== 0;
        },
        /**
         * @private
         */
        set: function (value) {
            this.flags = ((this.flags & 0xFD) | ((value ? 1 : 0) << 1));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableWidget.prototype, "header", {
        /**
         * @private
         */
        get: function () {
            return (this.flags & 0x1) !== 0;
        },
        /**
         * @private
         */
        set: function (value) {
            this.flags = ((this.flags & 0xFE) | (value ? 1 : 0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableWidget.prototype, "isBidiTable", {
        get: function () {
            return ((this.flags & 0x10) >> 4) !== 0;
        },
        set: function (value) {
            this.flags = ((this.flags & 0xEF) | ((value ? 1 : 0) << 4));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    TableWidget.prototype.equals = function (widget) {
        return widget instanceof TableWidget && widget.tableFormat === this.tableFormat;
    };
    /**
     * @private
     */
    TableWidget.prototype.combineRows = function (viewer) {
        for (var i = 0; i < this.childWidgets.length; i++) {
            var row = this.childWidgets[i];
            if (row.childWidgets.length === 0) {
                row.destroy();
                i--;
            }
            else {
                row.combineCells(viewer);
            }
        }
    };
    /**
     * @private
     */
    TableWidget.prototype.contains = function (tableCell) {
        if (this.equals(tableCell.ownerTable)) {
            return true;
        }
        while (tableCell.ownerTable.isInsideTable) {
            if (this.equals(tableCell.ownerTable)) {
                return true;
            }
            tableCell = tableCell.ownerTable.associatedCell;
        }
        return this.equals(tableCell.ownerTable);
    };
    /**
     * @private
     */
    TableWidget.prototype.getOwnerWidth = function (isBasedOnViewer) {
        var width = this.getContainerWidth();
        // Left and right indents should be neglected.
        width = width - this.leftIndent - this.rightIndent;
        return width >= 0 ? width : 0;
    };
    /**
     * @private
     */
    TableWidget.prototype.getTableWidth = function () {
        var width = 0;
        for (var i = 0; i < this.childWidgets.length; i++) {
            var rowWidth = 0;
            var row = this.childWidgets[i];
            for (var j = 0; j < row.childWidgets.length; j++) {
                rowWidth += row.childWidgets[j].cellFormat.cellWidth;
            }
            if (width < rowWidth) {
                width = rowWidth;
            }
        }
        return width;
    };
    /**
     * @private
     */
    TableWidget.prototype.getTableClientWidth = function (clientWidth) {
        var tableWidth = clientWidth;
        if (this.tableFormat.preferredWidthType === 'Point'
            && this.tableFormat.preferredWidth > 0) {
            tableWidth = this.tableFormat.preferredWidth;
        }
        else {
            if (this.tableFormat.preferredWidthType === 'Percent'
                && this.tableFormat.preferredWidth > 0) {
                tableWidth = tableWidth * this.tableFormat.preferredWidth / 100;
            }
        }
        return tableWidth;
    };
    /**
     * @private
     */
    TableWidget.prototype.getCellWidth = function (preferredWidth, preferredWidthType, containerWidth, cell) {
        var cellWidth = preferredWidth;
        if (preferredWidthType === 'Percent') {
            cellWidth = (preferredWidth * containerWidth) / 100;
        }
        else if (preferredWidthType === 'Point') {
            cellWidth = preferredWidth;
        }
        // For grid before and grid after with auto width, no need to calculate minimum preferred width.
        else if (!isNullOrUndefined(cell)) {
            cellWidth = cell.getMinimumPreferredWidth();
        }
        return cellWidth;
    };
    /**
     * @private
     */
    TableWidget.prototype.fitCellsToClientArea = function (clientWidth) {
        var tableWidth = this.getTableWidth();
        var factor = clientWidth / tableWidth;
        for (var i = 0; i < this.childWidgets.length; i++) {
            var row = this.childWidgets[i];
            row.rowFormat.gridAfterWidth *= factor;
            row.rowFormat.gridBeforeWidth *= factor;
            for (var j = 0; j < row.childWidgets.length; j++) {
                row.childWidgets[j].cellFormat.cellWidth *= factor;
                row.childWidgets[j].cellFormat.preferredWidth *= factor;
            }
        }
    };
    /**
     * @private
     */
    TableWidget.prototype.getTableCellWidget = function (point) {
        var tableCellWidget = undefined;
        for (var i = 0; i < this.childWidgets.length; i++) {
            if (this.childWidgets[i].y <= point.y
                && (this.childWidgets[i].y + this.childWidgets[i].height) >= point.y) {
                tableCellWidget = this.childWidgets[i].getTableCellWidget(point);
                break;
            }
        }
        return tableCellWidget;
    };
    /**
     * @private
     */
    //tslint:disable: max-func-body-length
    TableWidget.prototype.calculateGrid = function () {
        var tempGrid = [];
        var spannedCells = [];
        var containerWidth = this.getOwnerWidth(true);
        var tableWidth = this.getTableClientWidth(containerWidth);
        this.tableCellInfo = new Dictionary();
        for (var i = 0; i < this.childWidgets.length; i++) {
            var row = this.childWidgets[i];
            var rowCellInfo = new Dictionary();
            var rowFormat = row.rowFormat;
            var cellWidth = 0;
            var columnSpan = row.rowFormat.gridBefore;
            var currOffset = 0;
            if (tempGrid.indexOf(currOffset) < 0) {
                tempGrid.push(currOffset);
            }
            //Converts the row grid before width from point to twips point by 15 factor.
            cellWidth = this.getCellWidth(rowFormat.gridBeforeWidth, rowFormat.gridBeforeWidthType, tableWidth, null);
            currOffset += cellWidth;
            var startOffset = parseFloat(currOffset.toFixed(2));
            if (tempGrid.indexOf(startOffset) < 0) {
                tempGrid.push(startOffset);
            }
            for (var j = 0; j < row.childWidgets.length; j++) {
                var cell = row.childWidgets[j];
                for (var k = 0; k < spannedCells.length; k++) {
                    if (spannedCells[k].columnIndex < columnSpan) {
                        continue;
                    }
                    var rowSpan = spannedCells[k].cellFormat.rowSpan;
                    var removeSpannedCell = true;
                    if (spannedCells[k].columnIndex > columnSpan) {
                        {
                            removeSpannedCell = false;
                            // If the cell is the last cell in the row and the row has grid after value..
                            if (j === row.childWidgets.length - 1 && row.rowFormat.gridAfter > 0) {
                                // tslint:disable-next-line:max-line-length
                                cellWidth = this.getCellWidth(spannedCells[k].cellFormat.preferredWidth, spannedCells[k].cellFormat.preferredWidthType, tableWidth, null);
                                currOffset += cellWidth;
                            }
                        }
                    }
                    else {
                        // If the table gird alone calculted then column index of the rowspanned cell will be directly taken. 
                        // If the gird calculation is done from the UI level opearations such as resizing then table holder 
                        // will have the columns at that time we can get the column index from the table holder.
                        //Converts the cell width from point to twips point by 15 factor.
                        // tslint:disable-next-line:max-line-length
                        cellWidth = this.getCellWidth(spannedCells[k].cellFormat.preferredWidth, spannedCells[k].cellFormat.preferredWidthType, tableWidth, null);
                        currOffset += cellWidth;
                        columnSpan = spannedCells[k].columnIndex + spannedCells[k].cellFormat.columnSpan;
                    }
                    if (!removeSpannedCell && j === row.childWidgets.length - 1) {
                        removeSpannedCell = true;
                    }
                    if (removeSpannedCell && i - spannedCells[k].ownerRow.rowIndex === rowSpan - 1) {
                        spannedCells.splice(k, 1);
                        k--;
                    }
                }
                // At the start of each row, we will process the row spanned cells to get the start column index.
                // To calculate grid properly, we need the items in the spanned cells collection in the order of their column index
                if (cell.cellFormat.rowSpan > 1) {
                    if (spannedCells.length === 0 || spannedCells[spannedCells.length - 1].columnIndex <= columnSpan) {
                        spannedCells.push(cell);
                    }
                    else {
                        for (var m = spannedCells.length; m > 0; m--) {
                            if (spannedCells[m - 1].columnIndex > columnSpan) {
                                spannedCells.splice(m - 1, 0, cell);
                            }
                        }
                    }
                }
                // Add start offset of each cell based on its index
                if (!rowCellInfo.containsKey(cell.cellIndex)) {
                    rowCellInfo.add(cell.cellIndex, parseFloat((currOffset - startOffset).toFixed(2)));
                }
                columnSpan += cell.cellFormat.columnSpan;
                //Converts the cell width from pixel to twips point by 15 factor.
                cellWidth = this.getCellWidth(cell.cellFormat.preferredWidth, cell.cellFormat.preferredWidthType, tableWidth, null);
                currOffset += cellWidth;
                var offset = parseFloat(currOffset.toFixed(2));
                if (tempGrid.indexOf(offset) < 0) {
                    tempGrid.push(offset);
                }
                if (j === row.childWidgets.length - 1 && rowFormat.gridAfter > 0) {
                    cellWidth = this.getCellWidth(rowFormat.gridAfterWidth, 'Point', tableWidth, null);
                    currOffset += cellWidth;
                    if (tempGrid.indexOf(parseFloat(currOffset.toFixed(2))) < 0) {
                        tempGrid.push(parseFloat(currOffset.toFixed(2)));
                    }
                    columnSpan += rowFormat.gridAfter;
                }
                // Add rowindex and its cells info for each row
                if (!this.tableCellInfo.containsKey(row.rowIndex)) {
                    this.tableCellInfo.add(row.rowIndex, rowCellInfo);
                }
            }
        }
        tempGrid.sort(function (a, b) { return a - b; });
        if (this.tableHolder.columns.length > 0 && tempGrid.length - 1 !== this.tableHolder.columns.length) {
            this.updateColumnSpans(tempGrid, tableWidth);
        }
        this.tableCellInfo.clear();
        this.tableCellInfo = undefined;
    };
    TableWidget.prototype.updateColumnSpans = function (tempGrid, containerWidth) {
        for (var i = 0; i < this.childWidgets.length; i++) {
            var row = this.childWidgets[i];
            if (row.rowFormat.gridBeforeWidth >= 0) {
                row.rowFormat.gridBefore = row.getGridCount(tempGrid, undefined, -1, containerWidth);
            }
            for (var j = 0; j < row.childWidgets.length; j++) {
                var cell = row.childWidgets[j];
                var columnSpan = row.getGridCount(tempGrid, cell, cell.getIndex(), containerWidth);
                if (columnSpan > 0 && cell.cellFormat.columnSpan !== columnSpan) {
                    cell.cellFormat.columnSpan = columnSpan;
                }
            }
            if (row.rowFormat.gridAfterWidth >= 0) {
                row.rowFormat.gridAfter = row.getGridCount(tempGrid, undefined, row.childWidgets.length, containerWidth);
            }
        }
    };
    /**
     * @private
     */
    TableWidget.prototype.getMinimumAndMaximumWordWidth = function (minimumWordWidth, maximumWordWidth) {
        this.checkTableColumns();
        var tableWidth = this.tableHolder.getTotalWidth(0);
        if (tableWidth > minimumWordWidth) {
            minimumWordWidth = tableWidth;
        }
        if (tableWidth > maximumWordWidth) {
            maximumWordWidth = tableWidth;
        }
        return { 'minimumWordWidth': minimumWordWidth, 'maximumWordWidth': maximumWordWidth };
    };
    /**
     * @private
     */
    TableWidget.prototype.checkTableColumns = function () {
        if (this.isGridUpdated) {
            return;
        }
        var isAutoFit = this.isAutoFit();
        if (isAutoFit || this.tableHolder.columns.length === 0) {
            this.buildTableColumns();
        }
        this.isGridUpdated = true;
    };
    /**
     * @private
     */
    TableWidget.prototype.isAutoFit = function () {
        var bodyWidget = this.bodyWidget;
        if (!isNullOrUndefined(bodyWidget) && !isNullOrUndefined(bodyWidget.page)) {
            return bodyWidget.page.documentHelper.layout.getParentTable(this).tableFormat.allowAutoFit;
        }
        return false;
    };
    /**
     * @private
     */
    TableWidget.prototype.buildTableColumns = function () {
        if (this.isGridUpdated) {
            return;
        }
        // Clear existing columns in order to start creating columns freshly.
        this.tableHolder.resetColumns();
        var containerWidth = 0;
        var tableWidth = 0;
        var rowSpannedCells = [];
        var isAutoWidth = this.tableFormat.preferredWidthType === 'Auto';
        var isAutoFit = this.tableFormat.allowAutoFit;
        // For continuous layout, window width should be considered. 
        // If preferred width exceeds this limit, it can take upto maximum of 2112 pixels (1584 points will be assigned by Microsoft Word).
        //tslint:disable-next-line:max-line-length
        if (((!isNullOrUndefined(this.bodyWidget.page)) && this.bodyWidget.page.viewer instanceof WebLayoutViewer && isAutoFit && !this.isInsideTable && !(this.containerWidget instanceof TextFrame))) {
            containerWidth = HelperMethods.convertPixelToPoint(this.bodyWidget.page.viewer.clientArea.width - this.bodyWidget.page.viewer.padding.right * 3);
        }
        else {
            containerWidth = this.getOwnerWidth(true);
        }
        var isZeroWidth = (isAutoWidth && this.tableFormat.preferredWidth === 0 && !isAutoFit);
        tableWidth = this.getTableClientWidth(containerWidth);
        if (isZeroWidth && !this.isDefaultFormatUpdated) {
            this.splitWidthToTableCells(tableWidth, isZeroWidth);
        }
        for (var i = 0; i < this.childWidgets.length; i++) {
            var row = this.childWidgets[i];
            var rowFormat = row.rowFormat;
            var columnSpan = 0;
            var cellWidth = 0;
            var sizeInfo = new ColumnSizeInfo();
            var offset = 0;
            // tslint:disable-next-line:max-line-length
            if (rowFormat.gridBefore > 0 && (row.rowFormat.beforeWidth !== 0 || row.rowFormat.gridBeforeWidth !== 0) && ((this.bodyWidget.page.documentHelper.alignTablesRowByRow) ? row.ownerTable.tableFormat.tableAlignment === 'Left' : true)) {
                cellWidth = this.getCellWidth(rowFormat.gridBeforeWidth, row.rowFormat.gridAfterWidthType, tableWidth, null);
                sizeInfo.minimumWidth = cellWidth;
                this.tableHolder.addColumns(columnSpan, columnSpan = rowFormat.gridBefore, cellWidth, sizeInfo, offset = cellWidth);
            }
            for (var j = 0; j < row.childWidgets.length; j++) {
                var cell = row.childWidgets[j];
                if (rowSpannedCells.length === 0) {
                    cell.columnIndex = columnSpan;
                }
                for (var k = 0; k < rowSpannedCells.length; k++) {
                    var rowSpannedCell = rowSpannedCells[k];
                    if (rowSpannedCell.columnIndex < columnSpan) {
                        cell.columnIndex = columnSpan;
                        continue;
                    }
                    var rowSpan = 1;
                    var removeSpannedCell = true;
                    rowSpan = rowSpannedCell.cellFormat.rowSpan;
                    if (rowSpannedCell.columnIndex > columnSpan) {
                        cell.columnIndex = columnSpan;
                        removeSpannedCell = false;
                    }
                    else {
                        // tslint:disable-next-line:max-line-length
                        sizeInfo = rowSpannedCell.getCellSizeInfo(isAutoFit);
                        cellWidth = this.getCellWidth(rowSpannedCell.cellFormat.preferredWidth, rowSpannedCell.cellFormat.preferredWidthType, tableWidth, rowSpannedCell);
                        // If the table gird alone calculated then column index of the rowspanned cell will be directly taken. 
                        // tslint:disable-next-line:max-line-length
                        // If the gird calculation is done from the UI level operations such as resizing then table holder will have the columns at that time we can get the column index from the table holder.
                        // tslint:disable-next-line:max-line-length
                        if (this.tableHolder.columns.length > 0) {
                            this.tableHolder.addColumns(columnSpan, columnSpan = this.tableHolder.columns.indexOf(rowSpannedCell.ownerColumn) + rowSpannedCell.cellFormat.columnSpan, cellWidth, sizeInfo, offset += cellWidth);
                            cell.columnIndex = columnSpan;
                        }
                        else {
                            // tslint:disable-next-line:max-line-length
                            this.tableHolder.addColumns(columnSpan, columnSpan = rowSpannedCell.columnIndex + rowSpannedCell.cellFormat.columnSpan, cellWidth, sizeInfo, offset += cellWidth);
                            cell.columnIndex = columnSpan;
                        }
                    }
                    if (!removeSpannedCell && j === row.childWidgets.length - 1) {
                        removeSpannedCell = true;
                    }
                    if (removeSpannedCell && i - rowSpannedCell.ownerRow.rowIndex === rowSpan - 1) {
                        rowSpannedCells.splice(k, 1);
                        k--;
                    }
                }
                // At the start of each row, we will process the row spanned cells to get the start column index.
                // To calculate grid properly, we need the items in the spanned cells collection in the order of their column index
                if (cell.cellFormat.rowSpan > 1) {
                    if (rowSpannedCells.length === 0 || rowSpannedCells[rowSpannedCells.length - 1].columnIndex <= columnSpan) {
                        rowSpannedCells.push(cell);
                    }
                    else {
                        var insertIndex = 0;
                        for (var m = rowSpannedCells.length; m > 0; m--) {
                            if (rowSpannedCells[m - 1].columnIndex > columnSpan) {
                                insertIndex = m - 1;
                            }
                        }
                        rowSpannedCells.splice(insertIndex, 0, cell);
                    }
                }
                sizeInfo = cell.getCellSizeInfo(isAutoFit);
                cellWidth = this.getCellWidth(cell.cellFormat.preferredWidth, cell.cellFormat.preferredWidthType, tableWidth, cell);
                this.tableHolder.addColumns(columnSpan, columnSpan += cell.cellFormat.columnSpan, cellWidth, sizeInfo, offset += cellWidth);
                if (j === row.childWidgets.length - 1 && rowFormat.gridAfterWidth > 0) {
                    cellWidth = this.getCellWidth(rowFormat.gridAfterWidth, 'Point', tableWidth, null);
                    this.tableHolder.addColumns(columnSpan, columnSpan += rowFormat.gridAfter, cellWidth, sizeInfo, offset += cellWidth);
                }
            }
        }
        if (isZeroWidth && !this.isDefaultFormatUpdated) {
            this.isDefaultFormatUpdated = true;
        }
        this.tableHolder.validateColumnWidths();
        if (isAutoFit) {
            // Fits the column width automatically based on contents.
            this.tableHolder.autoFitColumn(containerWidth, tableWidth, isAutoWidth, this.isInsideTable);
        }
        else {
            // Fits the column width based on preferred width. i.e. Fixed layout.
            this.tableHolder.fitColumns(containerWidth, tableWidth, isAutoWidth, this.leftIndent + this.rightIndent);
        }
        //Sets the width to cells
        this.setWidthToCells(tableWidth, isAutoWidth);
    };
    /**
     * @private
     */
    TableWidget.prototype.setWidthToCells = function (tableWidth, isAutoWidth) {
        for (var i = 0; i < this.childWidgets.length; i++) {
            var rw = this.childWidgets[i];
            var rowFormat = rw.rowFormat;
            if (rowFormat.gridBefore > 0) {
                rowFormat.beforeWidth = this.tableHolder.getCellWidth(0, rowFormat.gridBefore, tableWidth);
            }
            for (var j = 0; j < rw.childWidgets.length; j++) {
                var cell = rw.childWidgets[j];
                // tslint:disable-next-line:max-line-length
                cell.cellFormat.cellWidth = this.tableHolder.getCellWidth(cell.columnIndex, cell.cellFormat.columnSpan, tableWidth);
                //By default, if cell preferred widthType is auto , width set based on table width and type is changed to 'Point'
            }
            if (rowFormat.gridAfter > 0) {
                rowFormat.afterWidth = this.tableHolder.getCellWidth(0, rowFormat.gridAfter, tableWidth);
            }
        }
    };
    /**
     * @private
     */
    TableWidget.prototype.updateProperties = function (updateAllowAutoFit, currentSelectedTable, autoFitBehavior) {
        if (updateAllowAutoFit) {
            this.tableFormat.allowAutoFit = autoFitBehavior !== 'FixedColumnWidth';
        }
        if (this !== currentSelectedTable) {
            currentSelectedTable.updateProperties(false, currentSelectedTable, autoFitBehavior);
            return;
        }
        if (autoFitBehavior === 'FixedColumnWidth') {
            // Clear the table widths and set the preferred width for cells.
            this.tableFormat.preferredWidth = 0;
            this.tableFormat.preferredWidthType = 'Auto';
            for (var i = 0; i < this.childWidgets.length; i++) {
                var rowWidget = this.childWidgets[i];
                for (var j = 0; j < rowWidget.childWidgets.length; j++) {
                    var cellWidget = rowWidget.childWidgets[j];
                    cellWidget.cellFormat.preferredWidthType = 'Point';
                    cellWidget.cellFormat.preferredWidth = cellWidget.cellFormat.cellWidth;
                }
            }
        }
        else if (autoFitBehavior === 'FitToWindow') {
            // Set the preferred width for table and cells in percentage.
            var tableWidth = this.tableHolder.getTotalWidth(0);
            this.tableFormat.leftIndent = 0;
            this.tableFormat.preferredWidth = 100;
            this.tableFormat.preferredWidthType = 'Percent';
            for (var i = 0; i < this.childWidgets.length; i++) {
                var row = this.childWidgets[i];
                for (var z = 0; z < row.childWidgets.length; z++) {
                    var cell = row.childWidgets[z];
                    if (cell.cellFormat.preferredWidthType !== 'Percent') {
                        cell.cellFormat.preferredWidthType = 'Percent';
                        cell.cellFormat.preferredWidth = (cell.cellFormat.cellWidth / tableWidth) * 100;
                    }
                }
            }
        }
        else {
            // Clear the preferred width for table and cells.
            this.tableFormat.preferredWidth = 0;
            this.tableFormat.preferredWidthType = 'Auto';
            for (var i = 0; i < this.childWidgets.length; i++) {
                var row = this.childWidgets[i];
                row.rowFormat.beforeWidth = 0;
                row.rowFormat.gridBefore = 0;
                row.rowFormat.gridBeforeWidth = 0;
                row.rowFormat.gridBeforeWidthType = 'Auto';
                row.rowFormat.afterWidth = 0;
                row.rowFormat.gridAfter = 0;
                row.rowFormat.gridAfterWidth = 0;
                row.rowFormat.gridAfterWidthType = 'Auto';
                for (var j = 0; j < row.childWidgets.length; j++) {
                    var cell = row.childWidgets[j];
                    cell.cellFormat.preferredWidth = 0;
                    cell.cellFormat.preferredWidthType = 'Auto';
                }
            }
        }
    };
    /**
     * @private
     */
    TableWidget.prototype.getMaxRowWidth = function (clientWidth) {
        var width = 0;
        for (var i = 0; i < this.childWidgets.length; i++) {
            var row = this.childWidgets[i];
            var rowWidth = 0;
            for (var j = 0; j < row.childWidgets.length; j++) {
                var cell = row.childWidgets[j];
                rowWidth += this.getCellWidth(cell.cellFormat.preferredWidth, cell.cellFormat.preferredWidthType, clientWidth, cell);
            }
            if (width < rowWidth) {
                width = rowWidth;
            }
        }
        return width;
    };
    /**
     * @private
     */
    TableWidget.prototype.updateWidth = function (dragValue) {
        var totalPreferredWidth = this.tableHolder.getTotalWidth(0);
        var ownerWidth = this.getOwnerWidth(true);
        var containerWidth = this.getTableClientWidth(ownerWidth);
        if (containerWidth <= totalPreferredWidth) {
            if (this.tableFormat.preferredWidthType === 'Auto') {
                this.tableFormat.preferredWidthType = 'Point';
            }
        }
        if (this.tableFormat.preferredWidthType !== 'Auto') {
            if (this.tableFormat.preferredWidthType === 'Point') {
                this.tableFormat.preferredWidth = this.getMaxRowWidth(containerWidth);
            }
            else { //ToDo:Need to analyze more the Percentage calculation for table width.
                var value = (totalPreferredWidth / ownerWidth) * 100;
                this.tableFormat.preferredWidth = value;
            }
        }
    };
    /**
     * @private
     */
    TableWidget.prototype.convertPointToPercent = function (tablePreferredWidth, ownerWidth) {
        var value = 0;
        value = (tablePreferredWidth / ownerWidth) * 100;
        value = Math.round(value);
        return value < 100 ? value : 100; // The value should be lesser than or equal to 100%;
    };
    TableWidget.prototype.updateChildWidgetLeft = function (left) {
        for (var i = 0; i < this.childWidgets.length; i++) {
            var rowWidget = this.childWidgets[i];
            rowWidget.x = left;
            rowWidget.updateChildWidgetLeft(left);
        }
    };
    /**
     * Shift the widgets for right to left aligned table.
     * @private
     */
    TableWidget.prototype.shiftWidgetsForRtlTable = function (clientArea, tableWidget) {
        var clientAreaX = tableWidget.x;
        var clientAreaRight = clientArea.right;
        var cellSpace = 0;
        if (tableWidget.tableFormat && tableWidget.tableFormat.cellSpacing > 0) {
            cellSpace = tableWidget.tableFormat.cellSpacing;
        }
        for (var i = 0; i < tableWidget.childWidgets.length; i++) {
            var rowWidget = tableWidget.childWidgets[i];
            var rowX = rowWidget.x;
            var left = clientAreaRight - (rowX - clientAreaX);
            for (var j = 0; j < rowWidget.childWidgets.length; j++) {
                var cellWidget = rowWidget.childWidgets[j];
                left = left -
                    (cellWidget.width + cellWidget.margin.left + cellWidget.margin.right - cellWidget.rightBorderWidth + cellSpace);
                cellWidget.updateWidgetLeft(left + cellWidget.margin.left);
            }
        }
    };
    /**
     * @private
     */
    TableWidget.prototype.clone = function () {
        var table = new TableWidget();
        table.tableHolder = this.tableHolder.clone();
        table.tableFormat.copyFormat(this.tableFormat);
        for (var i = 0; i < this.childWidgets.length; i++) {
            var row = this.childWidgets[i].clone();
            table.childWidgets.push(row);
            row.containerWidget = table;
            row.index = i;
        }
        table.x = this.x;
        table.y = this.y;
        table.height = this.height;
        table.width = this.width;
        table.containerWidget = this.containerWidget;
        if (this.contentControlProperties) {
            table.contentControlProperties = this.contentControlProperties;
        }
        return table;
    };
    /**
     * @private
     */
    TableWidget.getTableOf = function (node) {
        if (node instanceof WBorders) {
            var row = TableRowWidget.getRowOf(node);
            if (!isNullOrUndefined(row)) {
                return row.ownerTable;
            }
            else if (node.ownerBase instanceof WTableFormat && node.ownerBase.ownerBase instanceof TableWidget) {
                return node.ownerBase.ownerBase;
            }
            else {
                return undefined;
            }
        }
        return undefined;
    };
    /**
     * @private
     */
    TableWidget.prototype.fitChildToClientArea = function () {
        var clientWidth = this.getContainerWidth();
        if (Math.round(clientWidth) < Math.round(this.getTableWidth())) {
            this.fitCellsToClientArea(clientWidth);
        }
        for (var i = 0; i < this.childWidgets.length; i++) {
            var row = this.childWidgets[i];
            for (var j = 0; j < row.childWidgets.length; j++) {
                var cell = row.childWidgets[j];
                for (var k = 0; k < cell.childWidgets.length; k++) {
                    if (cell.childWidgets[k] instanceof TableWidget) {
                        cell.childWidgets[k].fitChildToClientArea();
                    }
                }
            }
        }
    };
    /**
     * @private
     */
    TableWidget.prototype.getColumnCellsForSelection = function (startCell, endCell) {
        var cells = [];
        var start = startCell.columnIndex;
        var end = endCell.columnIndex + endCell.cellFormat.columnSpan;
        for (var i = 0; i < this.childWidgets.length; i++) {
            var row = this.childWidgets[i];
            for (var j = 0; j < row.childWidgets.length; j++) {
                var cell = row.childWidgets[j];
                var columnIndex = cell.columnIndex;
                var columnSpan = cell.cellFormat.columnSpan;
                if ((columnIndex + columnSpan > start && columnIndex + columnSpan < end) || (columnIndex > start && columnIndex < end)) {
                    if (cells.indexOf(cell) < 0) {
                        cells.push(cell);
                    }
                }
                else if ((columnIndex > start && columnIndex < end && columnIndex + columnSpan < end)
                    || (columnIndex < start && columnIndex + columnSpan > end)) {
                    if (cells.indexOf(cell) < 0) {
                        cells.push(cell);
                    }
                }
                else if (columnIndex === start || columnIndex + columnSpan === end) {
                    if (cells.indexOf(cell) < 0) {
                        cells.push(cell);
                    }
                }
            }
        }
        return cells;
    };
    /**
     * Splits width equally for all the cells.
     * @param tableClientWidth
     * @private
     */
    TableWidget.prototype.splitWidthToTableCells = function (tableClientWidth, isZeroWidth) {
        for (var row = 0; row < this.childWidgets.length; row++) {
            this.childWidgets[row].splitWidthToRowCells(tableClientWidth, isZeroWidth);
        }
    };
    /**
     * @private
     */
    TableWidget.prototype.insertTableRowsInternal = function (tableRows, startIndex) {
        for (var i = tableRows.length - 1; i >= 0; i--) {
            var row = tableRows.splice(i, 1)[0];
            row.containerWidget = this;
            this.childWidgets.splice(startIndex, 0, row);
        }
        this.updateRowIndex(startIndex);
        this.isGridUpdated = false;
        this.buildTableColumns();
        this.isGridUpdated = true;
    };
    /**
     * @private
     */
    TableWidget.prototype.updateRowIndex = function (startIndex) {
        for (var i = startIndex; i < this.childWidgets.length; i++) {
            var row = this.childWidgets[i];
            row.index = i;
            for (var j = 0; j < row.childWidgets.length; j++) {
                row.childWidgets[j].index = j;
                row.childWidgets[j].rowIndex = row.rowIndex;
            }
            startIndex++;
        }
    };
    /**
     * @private
     */
    TableWidget.prototype.getCellStartOffset = function (cell) {
        var offset = 0;
        if (cell && this.tableCellInfo) {
            if (this.tableCellInfo.containsKey(cell.ownerRow.rowIndex)) {
                var rowCellInfo = this.tableCellInfo.get(cell.ownerRow.rowIndex);
                if (rowCellInfo.containsKey(cell.cellIndex)) {
                    offset = rowCellInfo.get(cell.cellIndex);
                }
            }
        }
        return offset;
    };
    /**
     * @private
     */
    TableWidget.prototype.destroyInternal = function (viewer) {
        var height = this.height;
        if (!isNullOrUndefined(this.childWidgets)) {
            for (var j = 0; j < this.childWidgets.length; j++) {
                var widget = undefined;
                var childWidget = this.childWidgets[j];
                widget = childWidget;
                if (!isNullOrUndefined(widget)) {
                    widget.destroyInternal(viewer);
                }
                if (isNullOrUndefined(this.childWidgets)) {
                    break;
                }
                j--;
            }
            this.childWidgets = undefined;
        }
        if (!isNullOrUndefined(this.containerWidget)) {
            if (!isNullOrUndefined(this.containerWidget.childWidgets)) {
                if (this.containerWidget.childWidgets.indexOf(this) !== -1) {
                    this.containerWidget.childWidgets.splice(this.containerWidget.childWidgets.indexOf(this), 1);
                }
                this.containerWidget.height -= height;
                // if ((isNullOrUndefined(this.containerWidget.childWidgets) || this.containerWidget.childWidgets.length === 0)
                //     && this.containerWidget instanceof BodyWidget) {
                //     // (this.containerWidget as BodyWidget).destroyInternal(viewer);
                // }
            }
            this.containerWidget = undefined;
        }
        this.destroy();
    };
    /**
     * @private
     */
    TableWidget.prototype.destroy = function () {
        // if (this.tableFormat) {
        //     this.tableFormat.destroy();
        // }
        this.tableFormat = undefined;
        if (this.spannedRowCollection) {
            this.spannedRowCollection.destroy();
        }
        this.spannedRowCollection = undefined;
        // if (this.tableHolder) {
        //     this.tableHolder.destroy();
        // }
        this.tableHolder = undefined;
        this.flags = undefined;
        this.leftMargin = undefined;
        this.topMargin = undefined;
        this.rightMargin = undefined;
        this.bottomMargin = undefined;
        this.headerHeight = undefined;
        this.description = undefined;
        this.title = undefined;
        this.isDefaultFormatUpdated = undefined;
        _super.prototype.destroy.call(this);
    };
    return TableWidget;
}(BlockWidget));
export { TableWidget };
/**
 * @private
 */
var TableRowWidget = /** @class */ (function (_super) {
    __extends(TableRowWidget, _super);
    function TableRowWidget() {
        var _this = _super.call(this) || this;
        _this.topBorderWidth = 0;
        _this.bottomBorderWidth = 0;
        _this.rowFormat = new WRowFormat(_this);
        return _this;
    }
    Object.defineProperty(TableRowWidget.prototype, "rowIndex", {
        /**
         * @private
         */
        get: function () {
            if (this.containerWidget) {
                return this.containerWidget.childWidgets.indexOf(this);
            }
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableRowWidget.prototype, "ownerTable", {
        /**
         * @private
         */
        get: function () {
            if (this.containerWidget instanceof TableWidget) {
                return this.containerWidget;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableRowWidget.prototype, "nextRow", {
        /**
         * @private
         */
        get: function () {
            var index = this.indexInOwner;
            if (index > -1 && index < this.ownerTable.childWidgets.length - 1) {
                return this.ownerTable.childWidgets[index + 1];
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    TableRowWidget.prototype.equals = function (widget) {
        return widget instanceof TableRowWidget && widget.rowFormat === this.rowFormat;
    };
    /**
     * @private
     */
    TableRowWidget.prototype.combineCells = function (viewer) {
        for (var i = 0; i < this.childWidgets.length; i++) {
            var cell = this.childWidgets[i];
            cell.combineWidget(viewer);
            if (cell.cellFormat.rowSpan === 1) {
                var cellHeight = cell.height + cell.margin.top + cell.margin.bottom;
                if ((this.height - this.ownerTable.tableFormat.cellSpacing) < cell.height) {
                    this.height = this.ownerTable.tableFormat.cellSpacing + cell.height;
                }
            }
        }
    };
    /**
     * @private
     */
    TableRowWidget.getRowOf = function (node) {
        if (node instanceof WBorders) {
            var cell = TableCellWidget.getCellOf(node);
            if (!isNullOrUndefined(cell)) {
                return cell.ownerRow;
            }
            else if (node.ownerBase instanceof WRowFormat && node.ownerBase.ownerBase instanceof TableRowWidget) {
                return node.ownerBase.ownerBase;
            }
            else {
                return undefined;
            }
        }
        return undefined;
    };
    /**
     * @private
     */
    TableRowWidget.prototype.getCell = function (rowIndex, cellIndex) {
        for (var i = 0; i < this.childWidgets.length; i++) {
            var cell = this.childWidgets[i];
            if (cell.rowIndex === rowIndex && cell.index === cellIndex) {
                return cell;
            }
        }
        return undefined;
    };
    /**
     * @private
     */
    TableRowWidget.prototype.splitWidthToRowCells = function (tableClientWidth, isZeroWidth) {
        var cells = this.childWidgets;
        var cellWidth = tableClientWidth / cells.length;
        for (var cell = 0; cell < cells.length; cell++) {
            if (isZeroWidth && cells[cell].cellFormat.preferredWidth === 0) {
                cells[cell].cellFormat.preferredWidth = cellWidth;
                this.ownerTable.isDefaultFormatUpdated = false;
            }
            else if (isZeroWidth) {
                this.ownerTable.isDefaultFormatUpdated = true;
                break;
            }
            else {
                cells[cell].cellFormat.preferredWidth = cellWidth;
            }
        }
    };
    /**
     * @private
     */
    TableRowWidget.prototype.getGridCount = function (tableGrid, cell, index, containerWidth) {
        var prevOffset = 0;
        var width = 0;
        var ownerTable = this.ownerTable;
        var rowFormat = this.rowFormat;
        if (index === -1) {
            width = ownerTable.getCellWidth(rowFormat.gridBeforeWidth, rowFormat.gridBeforeWidthType, containerWidth, null);
        }
        else {
            prevOffset += ownerTable.getCellWidth(rowFormat.gridBeforeWidth, rowFormat.gridBeforeWidthType, containerWidth, null);
            if (index >= 0) {
                prevOffset += ownerTable.getCellStartOffset(cell);
            }
            if (index < this.childWidgets.length) {
                width = ownerTable.getCellWidth(cell.cellFormat.preferredWidth, cell.cellFormat.preferredWidthType, containerWidth, null);
            }
            else {
                width = ownerTable.getCellWidth(rowFormat.gridAfterWidth, rowFormat.gridAfterWidthType, containerWidth, null);
            }
        }
        var gridStartIndex = this.getOffsetIndex(tableGrid, prevOffset);
        var gridEndIndex = this.getOffsetIndex(tableGrid, prevOffset + width);
        return gridEndIndex - gridStartIndex;
    };
    TableRowWidget.prototype.getOffsetIndex = function (tableGrid, offset) {
        offset = parseFloat(offset.toFixed(2));
        var index = 0;
        if (tableGrid.indexOf(offset) >= 0) {
            index = tableGrid.indexOf(offset);
        }
        else {
            for (var i = 0; i < tableGrid.length; i++) {
                if (tableGrid[i] > offset) {
                    return i;
                }
            }
            index = tableGrid.length - 1;
        }
        return index;
    };
    TableRowWidget.prototype.getCellOffset = function (index, containerWidth) {
        var prevOffset = 0;
        var ownerTable = this.ownerTable;
        for (var i = 0; i < this.childWidgets.length; i++) {
            var cellFormat = this.childWidgets[i].cellFormat;
            if (i === index) {
                break;
            }
            prevOffset += ownerTable.getCellWidth(cellFormat.preferredWidth, cellFormat.preferredWidthType, containerWidth, null);
        }
        return prevOffset;
    };
    /**
     * @private
     */
    TableRowWidget.prototype.updateRowBySpannedCells = function () {
        var rowSpannedCells = this.getPreviousRowSpannedCells();
        var currentRowIndex = this.rowIndex;
        for (var i = 0; i < rowSpannedCells.length; i++) {
            var spannedCell = rowSpannedCells[i];
            var rowSpanEnd = spannedCell.ownerRow.rowIndex + spannedCell.cellFormat.rowSpan - 1;
            // If current row is row span end or includes spanned cells. then, decrease the rowspan
            if (rowSpanEnd >= currentRowIndex) {
                spannedCell.cellFormat.rowSpan -= 1;
            }
        }
    };
    /**
     * @private
     */
    TableRowWidget.prototype.getPreviousRowSpannedCells = function (include) {
        var rowSpannedCells = [];
        var row = include ? this : this.previousWidget;
        while (!isNullOrUndefined(row)) {
            for (var i = 0; i < row.childWidgets.length; i++) {
                var cell = row.childWidgets[i];
                if (cell.cellFormat.rowSpan > 1) {
                    rowSpannedCells.splice(0, 0, cell);
                }
            }
            row = row.previousWidget;
        }
        return rowSpannedCells;
    };
    /**
     * @private
     */
    TableRowWidget.prototype.getTableCellWidget = function (point) {
        for (var i = 0; i < this.childWidgets.length; i++) {
            var x = Math.round(this.childWidgets[i].x);
            if (x - this.childWidgets[i].margin.left - 1 <= point.x
                && (x + this.childWidgets[i].width) >= point.x) {
                return this.childWidgets[i];
            }
            else if (i === this.childWidgets.length - 1
                && (this.childWidgets[i].x + this.childWidgets[i].width) + 1 <= point.x) {
                return this.childWidgets[i];
            }
        }
        var cellWidget = undefined;
        if (this.childWidgets.length > 0) {
            if (this.childWidgets[0].x <= point.x) {
                cellWidget = this.childWidgets[this.childWidgets.length - 1].getTableCellWidget(point);
            }
            else {
                cellWidget = this.childWidgets[0].getTableCellWidget(point);
            }
        }
        return cellWidget;
    };
    /**
     * @private
     */
    TableRowWidget.prototype.getMinimumAndMaximumWordWidth = function (minimumWordWidth, maximumWordWidth) {
        return { 'minimumWordWidth': minimumWordWidth, 'maximumWordWidth': maximumWordWidth };
    };
    /**
     * @private
     */
    TableRowWidget.prototype.destroyInternal = function (viewer) {
        var height = this.height;
        if (!isNullOrUndefined(this.childWidgets)) {
            for (var i = 0; i < this.childWidgets.length; i++) {
                var widget = this.childWidgets[i];
                widget.destroyInternal(viewer);
                if (isNullOrUndefined(this.childWidgets)) {
                    break;
                }
                i--;
            }
            this.childWidgets = undefined;
        }
        if (!isNullOrUndefined(this.containerWidget)) {
            if (!isNullOrUndefined(this.containerWidget.childWidgets)) {
                this.containerWidget.childWidgets.splice(this.containerWidget.childWidgets.indexOf(this), 1);
                if ((isNullOrUndefined(this.containerWidget.childWidgets) || this.containerWidget.childWidgets.length === 0)
                    && this.containerWidget instanceof TableWidget) {
                    this.containerWidget.destroyInternal(viewer);
                }
                else if (this.containerWidget.containerWidget instanceof BodyWidget) {
                    this.containerWidget.containerWidget.height -= height;
                }
                this.containerWidget.height -= height;
            }
        }
        this.destroy();
    };
    /**
     * @private
     */
    TableRowWidget.prototype.clone = function () {
        var row = new TableRowWidget();
        row.rowFormat.copyFormat(this.rowFormat);
        row.topBorderWidth = this.topBorderWidth;
        row.bottomBorderWidth = this.bottomBorderWidth;
        for (var i = 0; i < this.childWidgets.length; i++) {
            var cell = this.childWidgets[i].clone();
            row.childWidgets.push(cell);
            cell.containerWidget = row;
            cell.index = i;
            cell.rowIndex = this.rowIndex;
        }
        row.x = this.x;
        row.y = this.y;
        row.height = this.height;
        row.width = this.width;
        if (this.contentControlProperties) {
            row.contentControlProperties = this.contentControlProperties;
        }
        return row;
    };
    /**
     * Updates the child widgets left.
     * @param left
     * @private
     */
    TableRowWidget.prototype.updateChildWidgetLeft = function (left) {
        // TODO: Cell spacing calculation.
        var spacing = 0;
        if (this.ownerTable.tableFormat.cellSpacing > 0) {
            spacing = this.ownerTable.tableFormat.cellSpacing;
        }
        for (var i = 0; i < this.childWidgets.length; i++) {
            var cellWidget = this.childWidgets[i];
            left += spacing + cellWidget.margin.left;
            cellWidget.x = left;
            cellWidget.updateChildWidgetLeft(cellWidget.x);
            left += cellWidget.width + cellWidget.margin.right;
        }
    };
    /**
     * Shift the widgets for RTL table.
     * @param clientArea
     * @param tableWidget
     * @param rowWidget
     * @private
     */
    TableRowWidget.prototype.shiftWidgetForRtlTable = function (clientArea, tableWidget, rowWidget) {
        var clientAreaX = tableWidget.x;
        var cellSpace = 0;
        var tableWidth = 0;
        if (tableWidget.tableFormat != null && tableWidget.tableFormat.cellSpacing > 0) {
            cellSpace = tableWidget.tableFormat.cellSpacing;
        }
        tableWidth = HelperMethods.convertPointToPixel(tableWidget.getTableWidth());
        var rowX = rowWidget.x;
        var clientAreaRight = clientAreaX + tableWidth;
        var left = clientAreaRight - (rowX - clientAreaX);
        for (var j = 0; j < rowWidget.childWidgets.length; j++) {
            var cellWidget = rowWidget.childWidgets[j];
            left = left - (cellWidget.width + cellWidget.margin.left + cellWidget.margin.right - cellWidget.rightBorderWidth + cellSpace);
            cellWidget.updateWidgetLeft(left + cellWidget.margin.left);
        }
    };
    /**
     * @private
     */
    TableRowWidget.prototype.destroy = function () {
        // if (this.rowFormat) {
        //     this.rowFormat.destroy();
        // }
        this.rowFormat = undefined;
        this.rowFormat = undefined;
        this.topBorderWidth = undefined;
        this.bottomBorderWidth = undefined;
        _super.prototype.destroy.call(this);
    };
    return TableRowWidget;
}(BlockWidget));
export { TableRowWidget };
/**
 * @private
 */
var TableCellWidget = /** @class */ (function (_super) {
    __extends(TableCellWidget, _super);
    function TableCellWidget() {
        var _this = _super.call(this) || this;
        /**
         * @private
         */
        _this.rowIndex = -1;
        _this.sizeInfoInternal = new ColumnSizeInfo();
        /**
         * @private
         */
        _this.updatedTopBorders = [];
        _this.margin = new Margin(_this.leftMargin, _this.topMargin, _this.rightMargin, _this.bottomMargin);
        _this.leftBorderWidth = 0;
        _this.rightBorderWidth = 0;
        _this.cellFormat = new WCellFormat(_this);
        return _this;
    }
    Object.defineProperty(TableCellWidget.prototype, "ownerColumn", {
        /**
         * @private
         */
        get: function () {
            return this.ownerTable.tableHolder.columns[this.columnIndex];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableCellWidget.prototype, "leftMargin", {
        /**
         * @private
         */
        get: function () {
            if (this.cellFormat && this.cellFormat.containsMargins()) {
                return this.cellFormat.leftMargin;
            }
            else if (!isNullOrUndefined(this.ownerRow) && this.ownerRow.rowFormat.hasValue('leftMargin')) {
                return this.ownerRow.rowFormat.leftMargin;
            }
            else if (!isNullOrUndefined(this.ownerTable) && !isNullOrUndefined(this.ownerTable.tableFormat)) {
                return this.ownerTable.tableFormat.leftMargin;
            }
            else {
                return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableCellWidget.prototype, "topMargin", {
        /**
         * @private
         */
        get: function () {
            if (this.cellFormat && this.cellFormat.containsMargins()) {
                return this.cellFormat.topMargin;
            }
            else if (!isNullOrUndefined(this.ownerRow) && this.ownerRow.rowFormat.hasValue('topMargin')) {
                return this.ownerRow.rowFormat.topMargin;
            }
            else if (!isNullOrUndefined(this.ownerTable) && !isNullOrUndefined(this.ownerTable.tableFormat)) {
                return this.ownerTable.tableFormat.topMargin;
            }
            else {
                return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableCellWidget.prototype, "rightMargin", {
        /**
         * @private
         */
        get: function () {
            if (this.cellFormat && this.cellFormat.containsMargins()) {
                return this.cellFormat.rightMargin;
            }
            else if (!isNullOrUndefined(this.ownerRow) && this.ownerRow.rowFormat.hasValue('rightMargin')) {
                return this.ownerRow.rowFormat.rightMargin;
            }
            else if (!isNullOrUndefined(this.ownerTable) && !isNullOrUndefined(this.ownerTable.tableFormat)) {
                return this.ownerTable.tableFormat.rightMargin;
            }
            else {
                return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableCellWidget.prototype, "bottomMargin", {
        /**
         * @private
         */
        get: function () {
            if (this.cellFormat && this.cellFormat.containsMargins()) {
                return this.cellFormat.bottomMargin;
            }
            else if (!isNullOrUndefined(this.ownerRow) && this.ownerRow.rowFormat.hasValue('bottomMargin')) {
                return this.ownerRow.rowFormat.bottomMargin;
            }
            else if (!isNullOrUndefined(this.ownerTable) && !isNullOrUndefined(this.ownerTable.tableFormat)) {
                return this.ownerTable.tableFormat.bottomMargin;
            }
            else {
                return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableCellWidget.prototype, "cellIndex", {
        /**
         * @private
         */
        get: function () {
            if (this.ownerRow) {
                return this.ownerRow.childWidgets.indexOf(this);
            }
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableCellWidget.prototype, "ownerTable", {
        /**
         * @private
         */
        get: function () {
            if (this.containerWidget instanceof TableRowWidget) {
                return this.containerWidget.ownerTable;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableCellWidget.prototype, "ownerRow", {
        /**
         * @private
         */
        get: function () {
            return this.containerWidget;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TableCellWidget.prototype, "sizeInfo", {
        /**
         * @private
         */
        get: function () {
            return this.sizeInfoInternal;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    TableCellWidget.prototype.equals = function (widget) {
        return widget instanceof TableCellWidget && widget.cellFormat === this.cellFormat;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getContainerTable = function () {
        var table = this.ownerTable;
        while (table instanceof TableWidget && table.associatedCell instanceof TableCellWidget) {
            table = table.associatedCell.getContainerTable();
        }
        return table;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getPreviousSplitWidget = function () {
        if (this.containerWidget instanceof TableRowWidget) {
            var row = this.containerWidget;
            do {
                row = row.previousRenderedWidget;
                if (isNullOrUndefined(row) || row.index < this.rowIndex) {
                    break;
                }
                var previousCell = row.getCell(this.rowIndex, this.index);
                if (previousCell && this.equals(previousCell)) {
                    return previousCell;
                }
            } while (row);
        }
        return undefined;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getNextSplitWidget = function () {
        var rowSpan = this.cellFormat.rowSpan;
        if (this.containerWidget instanceof TableRowWidget) {
            var row = this.containerWidget;
            do {
                row = row.nextRenderedWidget;
                if (isNullOrUndefined(row) || row.index > this.rowIndex + rowSpan) {
                    break;
                }
                var nextCell = row.getCell(this.rowIndex, this.index);
                if (nextCell && this.equals(nextCell)) {
                    return nextCell;
                }
            } while (row);
        }
        return undefined;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getTableCellWidget = function (point) {
        for (var i = 0; i < this.childWidgets.length; i++) {
            if (this.childWidgets[i].y <= point.y
                && (this.childWidgets[i].y + this.childWidgets[i].height) >= point.y) {
                return this.childWidgets[i].getTableCellWidget(point);
            }
        }
        var tableCellWidget = undefined;
        if (this.childWidgets.length > 0) {
            if (this.childWidgets[0].y <= point.y) {
                tableCellWidget = this.childWidgets[this.childWidgets.length - 1].getTableCellWidget(point);
            }
            else {
                tableCellWidget = this.childWidgets[0].getTableCellWidget(point);
            }
        }
        return tableCellWidget;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.updateWidth = function (preferredWidth) {
        if (this.cellFormat.preferredWidthType === 'Point') {
            this.cellFormat.preferredWidth = preferredWidth;
        }
        else if (this.cellFormat.preferredWidthType === 'Percent') {
            this.cellFormat.preferredWidth = this.convertPointToPercent(preferredWidth);
        }
        this.cellFormat.cellWidth = preferredWidth;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getCellWidth = function () {
        var ownerTable = this.ownerTable;
        var containerWidth = ownerTable ? ownerTable.getTableClientWidth(ownerTable.getOwnerWidth(true)) : 0;
        var cellWidth = containerWidth;
        var leftMargin = !isNullOrUndefined(this.leftMargin) ? this.leftMargin : 0;
        var rightMargin = !isNullOrUndefined(this.rightMargin) ? this.rightMargin : 0;
        if (ownerTable && ownerTable.tableFormat.preferredWidthType === 'Auto' && ownerTable.tableFormat.allowAutoFit) {
            if (this.cellFormat.preferredWidth === 0) {
                cellWidth = containerWidth;
            }
            else {
                // If cell has prefferd width, we need to consider prefferd width.
                cellWidth = this.cellFormat.preferredWidth;
            }
        }
        else if (this.cellFormat.preferredWidthType === 'Percent') {
            cellWidth = (this.cellFormat.preferredWidth * containerWidth) / 100 - leftMargin - rightMargin;
        }
        else if (this.cellFormat.preferredWidthType === 'Point') {
            cellWidth = this.cellFormat.preferredWidth - leftMargin - rightMargin;
        }
        // For grid before and grid after with auto width, no need to calculate minimum preferred width.
        return cellWidth;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.convertPointToPercent = function (cellPreferredWidth) {
        var value = 0;
        var clientWidth = this.ownerTable.getOwnerWidth(true);
        var tableWidth = this.ownerTable.getTableClientWidth(clientWidth);
        value = (cellPreferredWidth / tableWidth) * 100;
        value = Math.round(value);
        return value < 100 ? value : 100; // The value should be lesser than or equal to 100%;
    };
    /**
     * @private
     */
    TableCellWidget.getCellLeftBorder = function (tableCell) {
        var leftBorder = undefined;
        var cellBorder = tableCell.cellFormat.borders;
        var rowBorders = !isNullOrUndefined(tableCell.ownerRow) ? tableCell.ownerRow.rowFormat.borders : undefined;
        var tableBorders = !isNullOrUndefined(tableCell.ownerTable) ? tableCell.ownerTable.tableFormat.borders : undefined;
        if (!isNullOrUndefined(cellBorder.left)) {
            leftBorder = cellBorder.left;
        }
        if (isNullOrUndefined(leftBorder)) {
            leftBorder = tableCell.getLeftBorderToRenderByHierarchy(leftBorder, rowBorders, tableBorders);
        }
        if (tableCell.ownerTable.tableFormat.cellSpacing > 0) {
            leftBorder = tableCell.getLeftBorderToRenderByHierarchy(leftBorder, rowBorders, tableBorders);
        }
        else {
            var prevCell = undefined;
            if (!isNullOrUndefined(tableCell.previousWidget)) {
                // if the border is shared then choose the border based on Conflict Resolution algorithm.
                prevCell = tableCell.previousWidget;
            }
            else if ((tableCell.cellFormat.columnSpan > 1 || tableCell.columnIndex > 1) && tableCell.ownerRow.rowIndex > 0) {
                var previousRow = tableCell.ownerRow.previousWidget;
                while (!isNullOrUndefined(previousRow) && previousRow.childWidgets.length > 0) {
                    for (var i = 0; i < previousRow.childWidgets.length; i++) {
                        var prevRowCell = previousRow.childWidgets[i];
                        if (prevRowCell.columnIndex + prevRowCell.cellFormat.columnSpan === tableCell.columnIndex) {
                            prevCell = previousRow.childWidgets[i];
                            break;
                        }
                    }
                    if (!isNullOrUndefined(prevCell)) {
                        break;
                    }
                    previousRow = previousRow.previousWidget;
                }
            }
            leftBorder = tableCell.getPreviousCellLeftBorder(leftBorder, prevCell);
        }
        if (isNullOrUndefined(leftBorder)) {
            leftBorder = new WBorder(tableCell.cellFormat.borders);
        }
        return leftBorder;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getLeftBorderWidth = function () {
        var borderWidth = 0;
        // Added null condition check for asynchronous loading.
        if (this.cellFormat !== null && this.cellFormat.borders !== null) {
            // update the margins values respect to layouting of borders.
            // For normal table cells only left border is rendered. for last cell left and right border is rendered.
            // this border widths are not included in margins.
            borderWidth = TableCellWidget.getCellLeftBorder(this).getLineWidth();
            // tslint:disable-next-line:max-line-length
            // need to render rightBorder specifically for all the cells when the cellSpacing is greater than zero or for last cell of each row.
        }
        return borderWidth;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getRightBorderWidth = function () {
        var borderWidth = 0;
        var ownerTable = this.ownerTable;
        //Added null condition check for asynchronous loading.
        if (this.cellFormat !== null && this.cellFormat.borders !== null) {
            borderWidth = TableCellWidget.getCellRightBorder(this).getLineWidth();
        }
        return borderWidth;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getCellSpacing = function () {
        var actualCellSpacing = this.ownerTable && this.ownerTable.tableFormat ? this.ownerTable.tableFormat.cellSpacing : 0;
        var cellSpacingToLayout = actualCellSpacing;
        // Considers the left, right margins and border widths(only available for Layouted table) for Minimum width.
        if (this.ownerRow.childWidgets.length === 1) {
            cellSpacingToLayout = actualCellSpacing * 2;
        }
        else if (this.cellIndex === 0 || this.cellIndex === this.ownerRow.childWidgets.length - 1) {
            cellSpacingToLayout = actualCellSpacing + (actualCellSpacing / 2);
        }
        else {
            cellSpacingToLayout = actualCellSpacing;
        }
        return cellSpacingToLayout;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getCellSizeInfo = function (isAutoFit) {
        var contentChanged = false;
        // Gets the minimum preferred width for the table cell.
        if (!this.sizeInfo.hasMinimumWidth) {
            this.sizeInfo.minimumWidth = this.getMinimumPreferredWidth();
        }
        // Gets the minimum and maximum word widths.
        if (isAutoFit) {
            if (!this.sizeInfo.hasMinimumWordWidth || contentChanged) {
                var size = this.getMinimumAndMaximumWordWidth(0, 0);
                this.sizeInfo.minimumWordWidth = size.minimumWordWidth + this.sizeInfo.minimumWidth;
                this.sizeInfo.maximumWordWidth = size.maximumWordWidth + this.sizeInfo.minimumWidth;
                // if minimum and maximum width values are equal, set value as zero.
                // later, preferred width value is considered for all width values.
                // if (this.sizeInfo.minimumWidth === this.sizeInfo.minimumWordWidth
                //     && this.sizeInfo.minimumWordWidth === this.sizeInfo.maximumWordWidth) {
                //     this.sizeInfo.minimumWordWidth = 0;
                //     this.sizeInfo.maximumWordWidth = 0;
                //     this.sizeInfo.minimumWidth = 0;
                // }
            }
        }
        var sizeInfo = new ColumnSizeInfo();
        sizeInfo.minimumWidth = this.sizeInfo.minimumWidth;
        sizeInfo.minimumWordWidth = this.sizeInfo.minimumWordWidth;
        sizeInfo.maximumWordWidth = this.sizeInfo.maximumWordWidth;
        return sizeInfo;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getMinimumPreferredWidth = function () {
        var defaultWidth = 0;
        if (this.cellFormat.preferredWidth > 0) {
            return this.cellFormat.preferredWidth;
            //if table has preferred width value and cell preferred width is auto, considered cell width.
        }
        else if (this.cellFormat.preferredWidth === 0 && this.cellFormat.preferredWidthType === 'Auto'
            && this.cellFormat.cellWidth !== 0) {
            return this.cellFormat.cellWidth;
        }
        defaultWidth = this.leftMargin + this.rightMargin + this.getLeftBorderWidth() + this.getRightBorderWidth() + this.getCellSpacing();
        return defaultWidth;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getPreviousCellLeftBorder = function (leftBorder, previousCell) {
        // tslint:disable-next-line:max-line-length
        if ((isNullOrUndefined(previousCell) || (!isNullOrUndefined(leftBorder) && (leftBorder.lineStyle === 'None' && !leftBorder.hasNoneStyle)))) {
            if (!isNullOrUndefined(leftBorder) && !(leftBorder.ownerBase.ownerBase instanceof WTableFormat)) {
                // tslint:disable-next-line:max-line-length
                leftBorder = this.getLeftBorderToRenderByHierarchy(leftBorder, TableRowWidget.getRowOf(leftBorder.ownerBase).rowFormat.borders, TableWidget.getTableOf(leftBorder.ownerBase).tableFormat.borders);
            }
        }
        if (isNullOrUndefined(previousCell)) {
            return leftBorder;
        }
        else {
            var prevCellRightBorder = undefined;
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(previousCell.cellFormat.borders) && !isNullOrUndefined(previousCell.cellFormat.borders.right) && previousCell.cellFormat.borders.right.lineStyle !== 'None') {
                prevCellRightBorder = previousCell.cellFormat.borders.right;
            }
            if (!isNullOrUndefined(prevCellRightBorder) && prevCellRightBorder.lineStyle !== 'None') {
                return this.getBorderBasedOnPriority(prevCellRightBorder, leftBorder);
            }
            else if (!isNullOrUndefined(leftBorder) && !(leftBorder.ownerBase.ownerBase instanceof WTableFormat)) {
                // tslint:disable-next-line:max-line-length
                return this.getLeftBorderToRenderByHierarchy(leftBorder, TableRowWidget.getRowOf(leftBorder.ownerBase).rowFormat.borders, TableWidget.getTableOf(leftBorder.ownerBase).tableFormat.borders);
            }
        }
        return leftBorder;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getBorderBasedOnPriority = function (border, adjacentBorder) {
        // If the cell and its adjacent cell defined different borders then based on this algorithm the border choose to render.
        // Reference link :https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.wordprocessing.tablecellborders.aspx
        if (isNullOrUndefined(border)) {
            return adjacentBorder;
        }
        else if (isNullOrUndefined(adjacentBorder)) {
            return border;
        }
        var borderWeight = border.getBorderWeight();
        var adjacentBorderWeight = adjacentBorder.getBorderWeight();
        //the border with higher wight  shall be displayed.
        if (borderWeight === adjacentBorderWeight) {
            //if the border is equal weight the based on the priority the border will be choosen to render.
            var borderPriority = border.getPrecedence();
            var adjacentBorderPriority = adjacentBorder.getPrecedence();
            if (borderPriority === adjacentBorderPriority) {
                //The color with the smaller brightness value shall be displayed.
                var borderColInRGB = this.convertHexToRGB(border.color);
                var R1 = borderColInRGB.r;
                var G1 = borderColInRGB.g;
                var B1 = borderColInRGB.b;
                var adjacentBorderColInRGB = this.convertHexToRGB(adjacentBorder.color);
                var R2 = adjacentBorderColInRGB.r;
                var G2 = adjacentBorderColInRGB.g;
                var B2 = adjacentBorderColInRGB.b;
                var borderBrightness = (R1 + B1 + (2 * G1));
                var adjacentBorderBrightness = (R2 + B2 + (2 * G2));
                if (borderBrightness === adjacentBorderBrightness) {
                    borderBrightness = (B1 + (2 * G1));
                    adjacentBorderBrightness = (B2 + (2 * G2));
                    if (borderBrightness === adjacentBorderBrightness) {
                        if (G1 === G2) {
                            return border;
                        }
                        else if (G1 > G2) {
                            return adjacentBorder;
                        }
                        else {
                            return border;
                        }
                    }
                    else if (borderBrightness > adjacentBorderBrightness) {
                        return adjacentBorder;
                    }
                    else {
                        return border;
                    }
                }
                else if (borderBrightness > adjacentBorderBrightness) {
                    return adjacentBorder;
                }
                else {
                    return border;
                }
            }
            else if (borderPriority > adjacentBorderPriority) {
                return border;
            }
            else {
                return adjacentBorder;
            }
        }
        else if (borderWeight > adjacentBorderWeight) {
            return border;
        }
        else {
            return adjacentBorder;
        }
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getLeftBorderToRenderByHierarchy = function (leftBorder, rowBorders, tableBorders) {
        if (!isNullOrUndefined(leftBorder) && (leftBorder.lineStyle !== 'None' || (leftBorder.hasNoneStyle &&
            //If border defined with default values then border drawn based on hierarchy. 
            !(leftBorder.lineStyle === 'None' && leftBorder.lineWidth === 0 && leftBorder.color === '#000000')))) {
            return leftBorder;
            // tslint:disable-next-line:max-line-length
        }
        else if (!isNullOrUndefined(leftBorder) && (leftBorder.ownerBase instanceof WBorders) && TableCellWidget.getCellOf(leftBorder.ownerBase).columnIndex === 0) {
            if (!isNullOrUndefined(tableBorders) && !isNullOrUndefined(tableBorders.left)) {
                leftBorder = tableBorders.left;
            }
            return leftBorder;
        }
        else if (!isNullOrUndefined(rowBorders)
            && !isNullOrUndefined(rowBorders.vertical) && rowBorders.vertical.lineStyle !== 'None') {
            return leftBorder = rowBorders.vertical;
        }
        else if (!isNullOrUndefined(tableBorders)
            && !isNullOrUndefined(tableBorders.vertical) && tableBorders.vertical.lineStyle !== 'None') {
            return leftBorder = tableBorders.vertical;
        }
        else {
            return leftBorder;
        }
    };
    /**
     * @private
     */
    TableCellWidget.getCellRightBorder = function (tableCell) {
        var rightBorder = undefined;
        var cellBorder = tableCell.cellFormat.borders;
        var rowBorders = !isNullOrUndefined(tableCell.ownerRow) ? tableCell.ownerRow.rowFormat.borders : undefined;
        var tableBorders = !isNullOrUndefined(tableCell.ownerTable) ? tableCell.ownerTable.tableFormat.borders : undefined;
        if (!isNullOrUndefined(cellBorder.right)) {
            rightBorder = cellBorder.right;
        }
        if (isNullOrUndefined(rightBorder)) {
            rightBorder = tableCell.getRightBorderToRenderByHierarchy(rightBorder, rowBorders, tableBorders);
        }
        if (tableCell.ownerTable.tableFormat.cellSpacing > 0) {
            rightBorder = tableCell.getRightBorderToRenderByHierarchy(rightBorder, rowBorders, tableBorders);
        }
        else {
            var nextCell = undefined;
            if (!isNullOrUndefined(tableCell.nextWidget)) {
                nextCell = tableCell.nextWidget;
            }
            // if the border is shared then choose the border based on Conflict Resolution algorithm.
            rightBorder = tableCell.getAdjacentCellRightBorder(rightBorder, nextCell);
        }
        if (isNullOrUndefined(rightBorder)) {
            rightBorder = new WBorder(tableCell.cellFormat.borders);
        }
        return rightBorder;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getAdjacentCellRightBorder = function (rightBorder, nextCell) {
        // tslint:disable-next-line:max-line-length
        if (isNullOrUndefined(nextCell) || (!isNullOrUndefined(rightBorder) && (rightBorder.lineStyle === 'None' && !rightBorder.hasNoneStyle))) {
            if (!isNullOrUndefined(rightBorder) && !(rightBorder.ownerBase.ownerBase instanceof WTableFormat)) {
                // tslint:disable-next-line:max-line-length
                rightBorder = this.getRightBorderToRenderByHierarchy(rightBorder, TableRowWidget.getRowOf(rightBorder.ownerBase).rowFormat.borders, TableWidget.getTableOf(rightBorder.ownerBase).tableFormat.borders);
            }
        }
        if (isNullOrUndefined(nextCell)) {
            return rightBorder;
        }
        else {
            var nextCellLeftBorder = undefined;
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(nextCell.cellFormat.borders) && !isNullOrUndefined(nextCell.cellFormat.borders.left) && nextCell.cellFormat.borders.left.lineStyle !== 'None') {
                nextCellLeftBorder = nextCell.cellFormat.borders.left;
            }
            if (!isNullOrUndefined(nextCellLeftBorder) && nextCellLeftBorder.lineStyle !== 'None') {
                return this.getBorderBasedOnPriority(rightBorder, nextCellLeftBorder);
            }
            else if (!isNullOrUndefined(rightBorder) && !(rightBorder.ownerBase.ownerBase instanceof WTableFormat)) {
                // tslint:disable-next-line:max-line-length
                return this.getRightBorderToRenderByHierarchy(rightBorder, TableRowWidget.getRowOf(rightBorder.ownerBase).rowFormat.borders, TableWidget.getTableOf(rightBorder.ownerBase).tableFormat.borders);
            }
        }
        return rightBorder;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getRightBorderToRenderByHierarchy = function (rightBorder, rowBorders, tableBorders) {
        if (!isNullOrUndefined(rightBorder) && (rightBorder.lineStyle !== 'None' || (rightBorder.hasNoneStyle &&
            //If border defined with default values then border drawn based on hierarchy. 
            !(rightBorder.lineStyle === 'None' && rightBorder.lineWidth === 0 && rightBorder.color === '#000000')))) {
            return rightBorder;
            // tslint:disable-next-line:max-line-length
        }
        else if (!isNullOrUndefined(rightBorder) && (rightBorder.ownerBase instanceof WBorders) && TableCellWidget.getCellOf(rightBorder.ownerBase).columnIndex === TableCellWidget.getCellOf(rightBorder.ownerBase).ownerRow.childWidgets.length - 1) {
            if (!isNullOrUndefined(tableBorders) && !isNullOrUndefined(tableBorders.right)) {
                rightBorder = tableBorders.right;
            }
            return rightBorder;
        }
        else if (!isNullOrUndefined(rowBorders)
            && !isNullOrUndefined(rowBorders.vertical) && rowBorders.vertical.lineStyle !== 'None') {
            return rightBorder = rowBorders.vertical;
        }
        else if (!isNullOrUndefined(tableBorders)
            && !isNullOrUndefined(tableBorders.vertical) && tableBorders.vertical.lineStyle !== 'None') {
            return rightBorder = tableBorders.vertical;
        }
        else {
            return rightBorder;
        }
    };
    /**
     * @private
     */
    TableCellWidget.getCellTopBorder = function (tableCell) {
        var topBorder = undefined;
        var cellBorder = tableCell.cellFormat.borders;
        var rowBorders = !isNullOrUndefined(tableCell.ownerRow) ? tableCell.ownerRow.rowFormat.borders : undefined;
        var tableBorders = !isNullOrUndefined(tableCell.ownerTable) ? tableCell.ownerTable.tableFormat.borders : undefined;
        if (!isNullOrUndefined(cellBorder.top)) {
            topBorder = cellBorder.top;
        }
        if (isNullOrUndefined(topBorder)) {
            topBorder = tableCell.getTopBorderToRenderByHierarchy(topBorder, rowBorders, tableBorders);
        }
        if (tableCell.ownerTable.tableFormat.cellSpacing > 0) {
            topBorder = tableCell.getTopBorderToRenderByHierarchy(topBorder, rowBorders, tableBorders);
        }
        else {
            var prevTopCell = undefined;
            //ToDo: Need to analyze more to get the previous cell.
            var prevRow = tableCell.ownerRow.previousWidget;
            while (!isNullOrUndefined(prevRow) && prevRow.childWidgets.length > 0) {
                for (var i = 0; i < prevRow.childWidgets.length; i++) {
                    var prevRowCell = prevRow.childWidgets[i];
                    if (prevRowCell.columnIndex + prevRowCell.cellFormat.columnSpan - 1 >= tableCell.columnIndex) {
                        prevTopCell = prevRow.childWidgets[i];
                        break;
                    }
                }
                if (!isNullOrUndefined(prevTopCell)) {
                    break;
                }
                prevRow = prevRow.previousWidget;
                //If all the previous rows checked and the previous top cell is null
                // then TableCell previus row matched column index cell is taken for border calculation.
                if (isNullOrUndefined(prevRow) && isNullOrUndefined(prevTopCell)) {
                    prevRow = tableCell.ownerRow.previousWidget;
                    if (tableCell.columnIndex < prevRow.childWidgets.length) {
                        for (var i = 0; i < prevRow.childWidgets.length; i++) {
                            var prevRowCell = prevRow.childWidgets[i];
                            if (prevRowCell.columnIndex === tableCell.columnIndex) {
                                prevTopCell = prevRow.childWidgets[i];
                                break;
                            }
                        }
                        //If table cell Column index is greater than previous row cells count then last cell is taken as previous top cell.
                    }
                    else {
                        // tslint:disable-next-line:max-line-length
                        prevTopCell = tableCell.ownerRow.previousWidget.childWidgets[tableCell.ownerRow.previousWidget.childWidgets.length - 1];
                    }
                }
            }
            //If the border is shared then choose the border based on Conflict Resolution algorithm.
            topBorder = tableCell.getPreviousCellTopBorder(topBorder, prevTopCell);
        }
        if (isNullOrUndefined(topBorder)) {
            topBorder = new WBorder(tableCell.cellFormat.borders);
        }
        return topBorder;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getPreviousCellTopBorder = function (topBorder, previousTopCell) {
        // tslint:disable-next-line:max-line-length
        if (isNullOrUndefined(previousTopCell) || (!isNullOrUndefined(topBorder) && (topBorder.lineStyle === 'None' && !topBorder.hasNoneStyle))) {
            if (!isNullOrUndefined(topBorder) && !(topBorder.ownerBase.ownerBase instanceof WTableFormat)) {
                // tslint:disable-next-line:max-line-length
                topBorder = this.getTopBorderToRenderByHierarchy(topBorder, TableRowWidget.getRowOf(topBorder.ownerBase).rowFormat.borders, TableWidget.getTableOf(topBorder.ownerBase).tableFormat.borders);
            }
        }
        if (isNullOrUndefined(previousTopCell)) {
            return topBorder;
        }
        else {
            var prevTopCellBottomBorder = undefined;
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(previousTopCell.cellFormat.borders) && !isNullOrUndefined(previousTopCell.cellFormat.borders.bottom) && previousTopCell.cellFormat.borders.bottom.lineStyle !== 'None') {
                prevTopCellBottomBorder = previousTopCell.cellFormat.borders.bottom;
            }
            if (!isNullOrUndefined(prevTopCellBottomBorder) && prevTopCellBottomBorder.lineStyle !== 'None') {
                return this.getBorderBasedOnPriority(topBorder, prevTopCellBottomBorder);
            }
            else if (!isNullOrUndefined(topBorder) && !(topBorder.ownerBase.ownerBase instanceof WTableFormat)) {
                // tslint:disable-next-line:max-line-length
                return this.getTopBorderToRenderByHierarchy(topBorder, TableRowWidget.getRowOf(topBorder.ownerBase).rowFormat.borders, TableWidget.getTableOf(topBorder.ownerBase).tableFormat.borders);
            }
        }
        return topBorder;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getTopBorderToRenderByHierarchy = function (topBorder, rowBorders, tableBorders) {
        if (!isNullOrUndefined(topBorder) && (topBorder.lineStyle !== 'None' || (topBorder.hasNoneStyle &&
            //If border defined with default values then border drawn based on hierarchy. 
            !(topBorder.lineStyle === 'None' && topBorder.lineWidth === 0 && topBorder.color === '#000000')))) {
            return topBorder;
            // tslint:disable-next-line:max-line-length
        }
        else if (!isNullOrUndefined(topBorder) && (topBorder.ownerBase instanceof WBorders) && TableCellWidget.getCellOf(topBorder.ownerBase).ownerRow.rowIndex === 0) {
            if (!isNullOrUndefined(tableBorders) && !isNullOrUndefined(tableBorders.top)) {
                topBorder = tableBorders.top;
            }
            return topBorder;
        }
        else if (!isNullOrUndefined(rowBorders)
            && !isNullOrUndefined(rowBorders.horizontal) && rowBorders.horizontal.lineStyle !== 'None') {
            return topBorder = rowBorders.horizontal;
        }
        else if (!isNullOrUndefined(tableBorders)
            && !isNullOrUndefined(tableBorders.horizontal) && tableBorders.horizontal.lineStyle !== 'None') {
            return topBorder = tableBorders.horizontal;
        }
        else {
            return topBorder;
        }
    };
    /**
     * @private
     */
    TableCellWidget.getCellBottomBorder = function (tableCell) {
        var bottomBorder = undefined;
        var cellBorder = tableCell.cellFormat.borders;
        var rowBorders = !isNullOrUndefined(tableCell.ownerRow) ? tableCell.ownerRow.rowFormat.borders : undefined;
        var tableBorders = !isNullOrUndefined(tableCell.ownerTable) ? tableCell.ownerTable.tableFormat.borders : undefined;
        if (!isNullOrUndefined(cellBorder.bottom)) {
            bottomBorder = cellBorder.bottom;
        }
        if (isNullOrUndefined(bottomBorder)) {
            // tslint:disable-next-line:max-line-length
            bottomBorder = tableCell.getBottomBorderToRenderByHierarchy(bottomBorder, rowBorders, tableBorders); // select the left border based on heirarchy.
        }
        if (tableCell.ownerTable.tableFormat.cellSpacing > 0) {
            bottomBorder = tableCell.getBottomBorderToRenderByHierarchy(bottomBorder, rowBorders, tableBorders);
        }
        else {
            var nextBottomCell = undefined;
            var nextRow = tableCell.ownerRow.nextWidget;
            if (!isNullOrUndefined(nextRow) && tableCell.columnIndex < nextRow.childWidgets.length) {
                nextBottomCell = nextRow.childWidgets[tableCell.columnIndex];
            }
            //If the border is shared then choose the border based on Conflict Resolution algorithm.
            bottomBorder = tableCell.getAdjacentCellBottomBorder(bottomBorder, nextBottomCell);
        }
        if (isNullOrUndefined(bottomBorder)) {
            bottomBorder = new WBorder(tableCell.cellFormat.borders);
        }
        return bottomBorder;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getAdjacentCellBottomBorder = function (bottomBorder, nextBottomCell) {
        // tslint:disable-next-line:max-line-length
        if (isNullOrUndefined(nextBottomCell) || (!isNullOrUndefined(bottomBorder) && (bottomBorder.lineStyle === 'None' && !bottomBorder.hasNoneStyle))) {
            if (!isNullOrUndefined(bottomBorder) && !(bottomBorder.ownerBase.ownerBase instanceof WTableFormat)) {
                // tslint:disable-next-line:max-line-length
                bottomBorder = this.getBottomBorderToRenderByHierarchy(bottomBorder, TableRowWidget.getRowOf(bottomBorder.ownerBase).rowFormat.borders, TableWidget.getTableOf(bottomBorder.ownerBase).tableFormat.borders);
            }
        }
        if (isNullOrUndefined(nextBottomCell)) {
            return bottomBorder;
        }
        else {
            var prevBottomCellTopBorder = undefined;
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(nextBottomCell.cellFormat.borders) && !isNullOrUndefined(nextBottomCell.cellFormat.borders.top) && nextBottomCell.cellFormat.borders.top.lineStyle !== 'None') {
                prevBottomCellTopBorder = nextBottomCell.cellFormat.borders.top;
            }
            if (!isNullOrUndefined(prevBottomCellTopBorder) && prevBottomCellTopBorder.lineStyle !== 'None') {
                return this.getBorderBasedOnPriority(bottomBorder, prevBottomCellTopBorder);
            }
            else if (!isNullOrUndefined(bottomBorder) && !(bottomBorder.ownerBase.ownerBase instanceof WTableFormat)) {
                // tslint:disable-next-line:max-line-length
                return this.getBottomBorderToRenderByHierarchy(bottomBorder, TableRowWidget.getRowOf(bottomBorder.ownerBase).rowFormat.borders, TableWidget.getTableOf(bottomBorder.ownerBase).tableFormat.borders);
            }
        }
        return bottomBorder;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getBottomBorderToRenderByHierarchy = function (bottomBorder, rowBorders, tableBorders) {
        if (!isNullOrUndefined(bottomBorder) && (bottomBorder.lineStyle !== 'None' || (bottomBorder.hasNoneStyle &&
            //If border defined with default values then border drawn based on hierarchy. 
            !(bottomBorder.lineStyle === 'None' && bottomBorder.lineWidth === 0 && bottomBorder.color === '#000000')))) {
            return bottomBorder;
            // tslint:disable-next-line:max-line-length
        }
        else if (!isNullOrUndefined(bottomBorder) && (bottomBorder.ownerBase instanceof WBorders) && TableCellWidget.getCellOf(bottomBorder.ownerBase).ownerRow.rowIndex + TableCellWidget.getCellOf(bottomBorder.ownerBase).cellFormat.rowSpan === TableCellWidget.getCellOf(bottomBorder.ownerBase).ownerTable.childWidgets.length) {
            if (!isNullOrUndefined(tableBorders) && !isNullOrUndefined(tableBorders.bottom)) {
                bottomBorder = tableBorders.bottom;
            }
            return bottomBorder;
        }
        else if (!isNullOrUndefined(rowBorders)
            && !isNullOrUndefined(rowBorders.horizontal) && rowBorders.horizontal.lineStyle !== 'None') {
            return bottomBorder = rowBorders.horizontal;
        }
        else if (!isNullOrUndefined(tableBorders)
            && !isNullOrUndefined(tableBorders.horizontal) && tableBorders.horizontal.lineStyle !== 'None') {
            return bottomBorder = tableBorders.horizontal;
        }
        else {
            return bottomBorder;
        }
    };
    TableCellWidget.prototype.convertHexToRGB = function (colorCode) {
        if (colorCode) {
            colorCode = colorCode.replace(/[^0-9A-â€Œâ€‹F]/gi, ''); // To remove # from color code string.
            var colCodeNo = parseInt(colorCode, 16);
            var r = (colCodeNo >> 16) & 255;
            var g = (colCodeNo >> 8) & 255;
            var b = colCodeNo & 255;
            return { 'r': r, 'g': g, 'b': b };
        }
        return undefined;
    };
    /**
     * @private
     */
    TableCellWidget.getCellOf = function (node) {
        if (node instanceof WBorders) {
            if (node.ownerBase instanceof WCellFormat && node.ownerBase.ownerBase instanceof TableCellWidget) {
                return node.ownerBase.ownerBase;
            }
            else {
                return undefined;
            }
        }
        return undefined;
    };
    /**
     * Updates the Widget left.
     * @private
     */
    TableCellWidget.prototype.updateWidgetLeft = function (x) {
        this.x = x;
        this.updateChildWidgetLeft(x);
    };
    /**
     * @private
     */
    TableCellWidget.prototype.updateChildWidgetLeft = function (left) {
        for (var i = 0; i < this.childWidgets.length; i++) {
            this.childWidgets[i].x = left;
            if (this.childWidgets[i] instanceof TableWidget) {
                var tableWidget = this.childWidgets[i];
                tableWidget.updateChildWidgetLeft(left);
                if (tableWidget.isBidiTable) {
                    var clientArea = new Rect(tableWidget.x, tableWidget.y, tableWidget.width, tableWidget.height);
                    tableWidget.shiftWidgetsForRtlTable(clientArea, tableWidget);
                }
            }
        }
    };
    /**
     * @private
     */
    TableCellWidget.prototype.getMinimumAndMaximumWordWidth = function (minimumWordWidth, maximumWordWidth) {
        for (var i = 0; i < this.childWidgets.length; i++) {
            var block = this.childWidgets[i];
            var widthInfo = block.getMinimumAndMaximumWordWidth(minimumWordWidth, maximumWordWidth);
            minimumWordWidth = widthInfo.minimumWordWidth;
            maximumWordWidth = widthInfo.maximumWordWidth;
        }
        return { 'minimumWordWidth': minimumWordWidth, 'maximumWordWidth': maximumWordWidth };
    };
    /**
     * @private
     */
    TableCellWidget.prototype.destroyInternal = function (viewer) {
        // let viewer: LayoutViewer = undefined;
        // let page: Page = this.getPage();
        // if (!isNullOrUndefined(page ))
        //     viewer = page.viewer;
        if (!isNullOrUndefined(this.childWidgets)) {
            for (var i = 0; i < this.childWidgets.length; i++) {
                var widget = this.childWidgets[i];
                if (widget instanceof ParagraphWidget) {
                    widget.destroyInternal(viewer);
                }
                else {
                    widget.destroyInternal(viewer);
                }
                i--;
            }
            this.childWidgets = undefined;
        }
        this.destroy();
    };
    /**
     * @private
     */
    TableCellWidget.prototype.clone = function () {
        var cell = new TableCellWidget();
        cell.cellFormat.copyFormat(this.cellFormat);
        for (var i = 0; i < this.childWidgets.length; i++) {
            var block = this.childWidgets[i].clone();
            cell.childWidgets.push(block);
            block.containerWidget = cell;
            block.index = i;
        }
        cell.leftBorderWidth = this.leftBorderWidth;
        cell.rightBorderWidth = this.rightBorderWidth;
        if (this.margin) {
            cell.margin = this.margin.clone();
        }
        cell.columnIndex = this.columnIndex;
        cell.x = this.x;
        cell.y = this.y;
        cell.height = this.height;
        cell.width = this.width;
        if (this.contentControlProperties) {
            cell.contentControlProperties = this.contentControlProperties;
        }
        return cell;
    };
    /**
     * @private
     */
    TableCellWidget.prototype.destroy = function () {
        // if (this.cellFormat) {
        //     this.cellFormat.destroy();
        // }
        this.cellFormat = undefined;
        this.rowIndex = undefined;
        this.columnIndex = undefined;
        _super.prototype.destroy.call(this);
    };
    return TableCellWidget;
}(BlockWidget));
export { TableCellWidget };
/**
 * @private
 */
var LineWidget = /** @class */ (function () {
    /**
     * Initialize the constructor of LineWidget
     */
    function LineWidget(paragraphWidget) {
        /**
         * @private
         */
        this.children = [];
        /**
         * @private
         */
        this.x = 0;
        /**
         * @private
         */
        this.y = 0;
        /**
         * @private
         */
        this.width = 0;
        /**
         * @private
         */
        this.height = 0;
        this.paragraph = paragraphWidget;
    }
    Object.defineProperty(LineWidget.prototype, "indexInOwner", {
        /**
         * @private
         */
        get: function () {
            if (this.paragraph && this.paragraph.childWidgets) {
                return this.paragraph.childWidgets.indexOf(this);
            }
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineWidget.prototype, "nextLine", {
        /**
         * @private
         */
        get: function () {
            var paragraph = this.paragraph;
            var lineIndex = this.indexInOwner;
            if (lineIndex <= paragraph.childWidgets.length - 2) {
                return paragraph.childWidgets[lineIndex + 1];
            }
            else if (paragraph.nextSplitWidget) {
                var line = paragraph.nextSplitWidget.firstChild;
                if (line instanceof LineWidget && line.paragraph.equals(this.paragraph)) {
                    return line;
                }
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineWidget.prototype, "previousLine", {
        /**
         * @private
         */
        get: function () {
            var paragraph = this.paragraph;
            var lineIndex = this.indexInOwner;
            var splitParagraph = paragraph.previousSplitWidget;
            if (lineIndex > 0) {
                return paragraph.childWidgets[lineIndex - 1];
            }
            else if (splitParagraph instanceof ParagraphWidget) {
                var line = splitParagraph.lastChild;
                if (line instanceof LineWidget && line.paragraph.equals(this.paragraph)) {
                    return line;
                }
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineWidget.prototype, "isEndsWithPageBreak", {
        /**
         * @private
         */
        get: function () {
            if (this.children.length > 0) {
                var lastElement = this.children[this.children.length - 1];
                if (lastElement instanceof TextElementBox) {
                    return lastElement.isPageBreak;
                }
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    LineWidget.prototype.isFirstLine = function () {
        var index = this.indexInOwner;
        // tslint:disable-next-line:max-line-length
        if (index > -1 && (this.paragraph.previousSplitWidget === undefined || (this.paragraph.previousSplitWidget instanceof ParagraphWidget && this.paragraph.previousSplitWidget.isEndsWithPageBreak))) {
            return index === 0;
        }
        return false;
    };
    /**
     * @private
     */
    LineWidget.prototype.isLastLine = function () {
        var index = this.indexInOwner;
        if (index > -1 && this.paragraph.nextSplitWidget === undefined) {
            return index === this.paragraph.childWidgets.length - 1;
        }
        return false;
    };
    /**
     * @private
     */
    LineWidget.prototype.getOffset = function (inline, index) {
        if (isNullOrUndefined(inline)) {
            return index;
        }
        var textIndex = index;
        var line = inline.line;
        var lineIndex = inline.line.paragraph.childWidgets.indexOf(inline.line);
        var bidi = line.paragraph.bidi;
        var isContainsRtl = this.paragraph.bodyWidget.page.documentHelper.layout.isContainsRtl(this);
        if (!bidi && !isContainsRtl) {
            for (var i = 0; i < line.children.length; i++) {
                var inlineElement = line.children[i];
                if (inline === inlineElement) {
                    break;
                }
                if (inlineElement instanceof ListTextElementBox) {
                    continue;
                }
                textIndex += inlineElement.length;
            }
        }
        else if (bidi) {
            var elementInfo = this.getInlineForOffset(textIndex, true, inline);
            textIndex = elementInfo.index;
        }
        else {
            var elementInfo = this.getInlineForRtlLine(textIndex, true, inline);
            textIndex = elementInfo.index;
        }
        return textIndex;
    };
    /**
     * @private
     */
    LineWidget.prototype.getEndOffset = function () {
        var startOffset = 0;
        var count = 0;
        // let line: LineWidget = this.line as LineWidget;
        // let lineIndex: number = thtis.line.paragraph.childWidgets.indexOf(inline.line);
        var bidi = this.paragraph.bidi || this.paragraph.bodyWidget.page.documentHelper.layout.isContainsRtl(this);
        if (!bidi) {
            for (var i = 0; i < this.children.length; i++) {
                var inlineElement = this.children[i];
                if (inlineElement.length === 0) {
                    continue;
                }
                if (inlineElement instanceof ListTextElementBox) {
                    continue;
                }
                if (inlineElement instanceof TextElementBox || inlineElement instanceof EditRangeStartElementBox
                    || inlineElement instanceof ImageElementBox || inlineElement instanceof EditRangeEndElementBox
                    || inlineElement instanceof BookmarkElementBox || inlineElement instanceof ContentControl
                    || (inlineElement instanceof FieldElementBox
                        && HelperMethods.isLinkedFieldCharacter(inlineElement))) {
                    startOffset = count + inlineElement.length;
                }
                count += inlineElement.length;
            }
        }
        else {
            var elementInfo = this.getInlineForOffset(startOffset, false, this.children[0], true);
            startOffset = elementInfo.index;
        }
        return startOffset;
    };
    /**
     * @private
     * @param offset
     * @param isOffset
     * @param inline
     * @param isEndOffset
     */
    // tslint:disable-next-line:max-line-length
    LineWidget.prototype.getInlineForOffset = function (offset, isOffset, inline, isEndOffset, isPrevOffset, isNxtOffset) {
        var startElement = this.children[this.children.length - 1];
        var endElement;
        var element = startElement;
        var documentHelper = this.paragraph.bodyWidget.page.documentHelper;
        var textHelper = documentHelper.textHelper;
        var isApplied = false;
        var count = 0;
        var lineLength = documentHelper.selection.getLineLength(this);
        var validOffset = 0;
        while (element) {
            if (!endElement && !(element instanceof TabElementBox && element.text === '\t') &&
                (element instanceof TextElementBox && !textHelper.isRTLText(element.text)
                    // tslint:disable-next-line:max-line-length
                    && !((textHelper.containsSpecialCharAlone(element.text) || /^[0-9]+$/.test(element.text)) && element.characterFormat.bidi)
                    || !(element instanceof TextElementBox))) {
                while (element.previousElement && (element.previousElement instanceof TextElementBox
                    // tslint:disable-next-line:max-line-length
                    && !textHelper.isRTLText(element.previousElement.text) && !((textHelper.containsSpecialCharAlone(element.previousElement.text)
                    || /^[0-9]+$/.test(element.previousElement.text)) && element.previousElement.characterFormat.bidi)
                    || element.previousElement instanceof FieldElementBox
                    || element.previousElement instanceof BookmarkElementBox
                        && !isNullOrUndefined(element.previousElement.previousElement) &&
                        !(element.previousElement.previousElement instanceof BookmarkElementBox)
                    || element.previousElement instanceof BookmarkElementBox
                        && element.previousElement.previousElement instanceof BookmarkElementBox
                        && !isNullOrUndefined(element.previousElement.previousElement.previousElement)
                    || element instanceof BookmarkElementBox && element.previousElement instanceof BookmarkElementBox
                        && !isNullOrUndefined(element.previousElement.previousElement)
                    || element.previousElement instanceof ListTextElementBox
                    || element.previousElement instanceof EditRangeEndElementBox
                    || element.previousElement instanceof EditRangeStartElementBox
                    || element.previousElement instanceof ImageElementBox)) {
                    isApplied = true;
                    element = element.previousElement;
                    continue;
                }
                if (element.previousElement && (isApplied
                    || (element.previousElement instanceof TextElementBox && (textHelper.isRTLText(element.previousElement.text) ||
                        // tslint:disable-next-line:max-line-length
                        ((textHelper.containsSpecialCharAlone(element.previousElement.text) || /^[0-9]+$/.test(element.previousElement.text)) && element.previousElement.characterFormat.bidi))))) {
                    endElement = element.previousElement;
                }
                else if (!element.previousElement) {
                    if (element instanceof ListTextElementBox) {
                        break;
                    }
                    endElement = element;
                }
                if (element instanceof ListTextElementBox && endElement) {
                    element = endElement;
                    endElement = undefined;
                }
            }
            if (isOffset && !isNullOrUndefined(inline)) {
                if (inline === element) {
                    return { 'element': element, 'index': offset };
                }
                offset += element.length;
            }
            else if (isEndOffset) {
                offset += element.length;
                if (offset === lineLength) {
                    return { 'element': element, 'index': offset };
                }
                else if (offset > lineLength) {
                    return { 'element': element, 'index': lineLength };
                }
            }
            else if (isNxtOffset) {
                if (offset < count + element.length) {
                    if (element instanceof TextElementBox || element instanceof ImageElementBox
                        || (element instanceof FieldElementBox && HelperMethods.isLinkedFieldCharacter(element))) {
                        return { 'element': element, 'index': (offset > count ? offset : count) + 1 };
                    }
                }
                count += element.length;
            }
            else {
                if (offset <= count + element.length) {
                    return {
                        'element': element, 'index': isPrevOffset ? (offset - 1 === count ? validOffset : offset - 1) : offset - count
                    };
                }
                if (isPrevOffset && (element instanceof TextElementBox || element instanceof ImageElementBox
                    || (element instanceof FieldElementBox && HelperMethods.isLinkedFieldCharacter(element)))) {
                    validOffset = count + element.length;
                }
                count += element.length;
            }
            if (element.previousElement && (element instanceof TextElementBox && (textHelper.isRTLText(element.text) ||
                ((textHelper.containsSpecialCharAlone(element.text) || /^[0-9]+$/.test(element.text)) && element.characterFormat.bidi)) ||
                (element instanceof TabElementBox && element.text === '\t' || (element instanceof BookmarkElementBox
                    && (element instanceof BookmarkElementBox && element.previousElement instanceof BookmarkElementBox
                        && !element.previousElement.previousElement
                        || element.bookmarkType === 1 && !element.previousElement))))) {
                if ((offset === count + 1 || offset > count + 1) && count === lineLength && !element.previousElement) {
                    break;
                }
                element = element.previousElement;
            }
            else {
                if (endElement && (!element.nextElement || element === startElement || element.nextElement instanceof TextElementBox
                    && (textHelper.isRTLText(element.nextElement.text) ||
                        // tslint:disable-next-line:max-line-length
                        ((textHelper.containsSpecialCharAlone(element.nextElement.text) || /^[0-9]+$/.test(element.nextElement.text)) && element.nextElement.characterFormat.bidi))
                    || element.nextElement instanceof ListTextElementBox)) {
                    if (offset === count + 1 && count === lineLength) {
                        break;
                    }
                    element = endElement;
                    endElement = undefined;
                    isApplied = false;
                }
                else {
                    if ((endElement === element || offset === count + 1) && !element.previousElement && count === lineLength) {
                        break;
                    }
                    element = element.nextElement;
                }
            }
        }
        if (isNxtOffset) {
            return { 'element': element, 'index': offset };
        }
        else if (isPrevOffset) {
            return { 'element': element, 'index': -1 };
        }
        else {
            return { 'element': element, 'index': isEndOffset ? offset : 0 };
        }
    };
    LineWidget.prototype.getInlineForRtlLine = function (offset, isOffset, inline) {
        var startElement = this.children[0];
        var endElement;
        var element = startElement;
        var documentHelper = this.paragraph.bodyWidget.page.documentHelper;
        var textHelper = documentHelper.textHelper;
        var isUpdated = false;
        var count = 0;
        var lineLength = documentHelper.selection.getLineLength(this);
        var validOffset = 0;
        var lastRtlIndex = -1;
        var indexInInline = -1;
        var isStarted = false;
        while (element) {
            if (element instanceof ListTextElementBox) {
                element = element.nextElement;
                continue;
            }
            if (!isStarted && (element instanceof TextElementBox || element instanceof ImageElementBox
                || element instanceof BookmarkElementBox || element instanceof EditRangeEndElementBox
                || element instanceof EditRangeStartElementBox
                || element instanceof FieldElementBox
                    && HelperMethods.isLinkedFieldCharacter(element))) {
                isStarted = true;
            }
            if (!endElement) {
                while (element && element instanceof TextElementBox && (textHelper.isRTLText(element.text) ||
                    textHelper.containsSpecialCharAlone(element.text))) {
                    if (!endElement) {
                        endElement = element;
                    }
                    lastRtlIndex = this.children.indexOf(element);
                    element = element.nextElement;
                    isUpdated = true;
                }
            }
            if (lastRtlIndex !== -1 && isUpdated) {
                element = this.children[lastRtlIndex];
            }
            if (isOffset && !isNullOrUndefined(inline)) {
                if (inline === element) {
                    return { 'element': element, 'index': offset };
                }
                offset += element.length;
            }
            else {
                if (isStarted && offset <= count + element.length) {
                    indexInInline = (offset - count);
                    return { 'element': element, 'index': indexInInline };
                }
                count += element.length;
            }
            if (endElement === element) {
                endElement = undefined;
                if (lastRtlIndex !== -1) {
                    element = this.children[lastRtlIndex];
                }
                lastRtlIndex = -1;
            }
            if (endElement && element.previousElement) {
                element = element.previousElement;
            }
            else if (element.nextElement) {
                element = element.nextElement;
            }
            else {
                if (offset > count) {
                    indexInInline = isNullOrUndefined(element) ? offset : element.length;
                }
                return { 'element': element, 'index': indexInInline };
            }
            isUpdated = false;
        }
        return { 'element': element, 'index': indexInInline };
    };
    /**
     * @private
     */
    LineWidget.prototype.getInline = function (offset, indexInInline, bidi, isInsert) {
        bidi = isNullOrUndefined(bidi) ? this.paragraph.bidi : bidi;
        var inlineElement = undefined;
        var count = 0;
        var isStarted = false;
        if (this.children.length === 0) {
            if (this.previousLine) {
                var elementBox = this.previousLine.children[this.previousLine.children.length - 1];
                if (elementBox instanceof TextElementBox && elementBox.text === '\v') {
                    inlineElement = this.previousLine.children[this.previousLine.children.length - 1];
                    indexInInline = 1;
                    return { 'element': inlineElement, 'index': indexInInline };
                }
            }
        }
        var isContainsRtl = this.paragraph.bodyWidget.page.documentHelper.layout.isContainsRtl(this);
        if (!bidi && !isContainsRtl) {
            for (var i = 0; i < this.children.length; i++) {
                inlineElement = this.children[i];
                if (inlineElement instanceof ListTextElementBox) {
                    continue;
                }
                if (!isStarted && (inlineElement instanceof TextElementBox || inlineElement instanceof ImageElementBox
                    || inlineElement instanceof ShapeElementBox || inlineElement instanceof ContentControl
                    || inlineElement instanceof BookmarkElementBox || inlineElement instanceof EditRangeEndElementBox
                    || inlineElement instanceof EditRangeStartElementBox || inlineElement instanceof CommentCharacterElementBox
                    || inlineElement instanceof FieldElementBox
                        && HelperMethods.isLinkedFieldCharacter(inlineElement))) {
                    isStarted = true;
                }
                if (isStarted && offset <= count + inlineElement.length) {
                    //if (inlineElement instanceof BookmarkElementBox) {
                    //    offset += inlineElement.length;
                    //    count += inlineElement.length;
                    //    continue;
                    //}
                    // tslint:disable-next-line:max-line-length
                    if (inlineElement instanceof TextElementBox && (inlineElement.text === ' ' && inlineElement.revisions.length === 0 && isInsert)) {
                        var currentElement = this.getNextTextElement(this, i + 1);
                        inlineElement = !isNullOrUndefined(currentElement) ? currentElement : inlineElement;
                        indexInInline = isNullOrUndefined(currentElement) ? (offset - count) : 0;
                        return { 'element': inlineElement, 'index': indexInInline };
                    }
                    else if (offset === inlineElement.length && this.children[i + 1] instanceof FootnoteElementBox) {
                        return { 'element': this.children[i + 1], 'index': indexInInline };
                    }
                    else {
                        indexInInline = (offset - count);
                    }
                    return { 'element': inlineElement, 'index': indexInInline };
                }
                count += inlineElement.length;
            }
            if (offset > count) {
                indexInInline = isNullOrUndefined(inlineElement) ? offset : inlineElement.length;
            }
        }
        else if (bidi) {
            var elementInfo = this.getInlineForOffset(offset);
            inlineElement = elementInfo.element;
            indexInInline = elementInfo.index;
        }
        else {
            var elementInfo = this.getInlineForRtlLine(offset);
            inlineElement = elementInfo.element;
            indexInInline = elementInfo.index;
        }
        return { 'element': inlineElement, 'index': indexInInline };
    };
    /**
     * Method to retrieve next element
     * @param line
     * @param index
     */
    LineWidget.prototype.getNextTextElement = function (line, index) {
        if (index < line.children.length - 1 && line.children[index]) {
            return line.children[index];
        }
        return null;
    };
    /**
     * @private
     */
    LineWidget.prototype.getHierarchicalIndex = function (hierarchicalIndex) {
        var node = this;
        hierarchicalIndex = node.paragraph.childWidgets.indexOf(node) + ';' + hierarchicalIndex;
        if (node.paragraph instanceof BlockWidget) {
            return node.paragraph.getHierarchicalIndex(hierarchicalIndex);
        }
        return hierarchicalIndex;
    };
    /**
     * @private
     */
    LineWidget.prototype.clone = function () {
        var line = new LineWidget(undefined);
        for (var j = 0; j < this.children.length; j++) {
            var element = this.children[j];
            var clone = element.clone();
            line.children.push(clone);
            clone.line = line;
        }
        line.width = this.width;
        line.height = this.height;
        return line;
    };
    /**
     * @private
     */
    LineWidget.prototype.destroy = function () {
        if (!isNullOrUndefined(this.children)) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].destroy();
            }
            this.children = [];
        }
        this.children = undefined;
        if (this.paragraph) {
            this.paragraph.removeChild(this.indexInOwner);
        }
        this.paragraph = undefined;
        this.x = undefined;
        this.y = undefined;
        this.width = undefined;
        this.height = undefined;
    };
    return LineWidget;
}());
export { LineWidget };
/**
 * @private
 */
var ElementBox = /** @class */ (function () {
    /**
     * Initialize the constructor of ElementBox
     */
    function ElementBox() {
        /**
         * @private
         */
        this.x = 0;
        /**
         * @private
         */
        this.y = 0;
        /**
         * @private
         */
        this.width = 0;
        /**
         * @private
         */
        this.height = 0;
        /**
         * @private
         */
        this.margin = new Margin(0, 0, 0, 0);
        /**
         * @private
         */
        this.characterFormat = undefined;
        /**
         * @private
         */
        this.isRightToLeft = false;
        /**
         * @private
         */
        this.canTrigger = false;
        /**
         * @private
         */
        this.ischangeDetected = false;
        /**
         * @private
         */
        this.isVisible = false;
        /**
         * @private
         */
        this.isSpellChecked = false;
        /**
         * @private
         */
        this.revisions = [];
        /**
         * @private
         */
        this.canTrack = false;
        /**
         * @private
         */
        this.removedIds = [];
        /**
         * @private
         */
        this.isMarkedForRevision = false;
        this.characterFormat = new WCharacterFormat(this);
        this.margin = new Margin(0, 0, 0, 0);
    }
    Object.defineProperty(ElementBox.prototype, "isPageBreak", {
        /**
         * @private
         */
        get: function () {
            if (this instanceof TextElementBox) {
                return this.text === '\f';
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementBox.prototype, "isValidNodeForTracking", {
        /**
         * @private
         * Method to indicate whether current element is trackable.
         */
        get: function () {
            // tslint:disable-next-line:max-line-length
            if (this instanceof BookmarkElementBox || this instanceof CommentCharacterElementBox || this instanceof EditRangeStartElementBox || this instanceof EditRangeEndElementBox || this instanceof ContentControl) {
                return false;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ElementBox.prototype.linkFieldCharacter = function (documentHelper) {
        if (!(this instanceof FieldElementBox)) {
            return;
        }
        if (this.fieldType === 0) {
            var fieldBegin = this;
            if (isNullOrUndefined(fieldBegin.fieldEnd)) {
                this.linkFieldTraversingForward(this.line, fieldBegin, fieldBegin);
                if (documentHelper.fields.indexOf(fieldBegin) === -1) {
                    documentHelper.fields.push(fieldBegin);
                }
                if (!isNullOrUndefined(fieldBegin.formFieldData) &&
                    documentHelper.formFields.indexOf(fieldBegin) === -1) {
                    documentHelper.formFields.push(fieldBegin);
                }
            }
        }
        else if (this.fieldType === 2) {
            var fieldSeparator = this;
            //Links the field begin for the current separator.
            if (isNullOrUndefined(fieldSeparator.fieldBegin)) {
                this.linkFieldTraversingBackwardSeparator(this.line, fieldSeparator, fieldSeparator);
            }
            if (!isNullOrUndefined(fieldSeparator.fieldBegin)) {
                fieldSeparator.fieldBegin.fieldSeparator = fieldSeparator;
                //Links to field end traversing from field separator.
                var isFieldEnd = this.linkFieldTraversingForward(this.line, fieldSeparator.fieldBegin, fieldSeparator);
                if (isNullOrUndefined(fieldSeparator.fieldEnd) && isFieldEnd) {
                    fieldSeparator.fieldEnd = fieldSeparator.fieldBegin.fieldEnd;
                }
                if (fieldSeparator.fieldEnd) {
                    fieldSeparator.fieldEnd.fieldSeparator = fieldSeparator;
                }
            }
        }
        else {
            var fieldEnd = this;
            //Links the field begin and separator for the current end.
            if (isNullOrUndefined(fieldEnd.fieldBegin)) {
                this.linkFieldTraversingBackward(this.line, fieldEnd, fieldEnd);
            }
        }
    };
    /**
     * @private
     */
    ElementBox.prototype.linkFieldTraversingBackward = function (line, fieldEnd, previousNode) {
        var k = line.children.length - 1;
        if (line.children.indexOf(previousNode) > -1) {
            k = line.children.indexOf(previousNode) - 1;
        }
        for (var j = k; j >= 0; j--) {
            var childNode = line.children[j];
            if (childNode instanceof FieldElementBox) {
                if (childNode.fieldType === 0) {
                    if (isNullOrUndefined(childNode.fieldEnd)) {
                        fieldEnd.fieldBegin = childNode;
                        if (isNullOrUndefined(childNode.fieldEnd)) {
                            childNode.fieldEnd = fieldEnd;
                        }
                        if (fieldEnd.fieldSeparator && isNullOrUndefined(fieldEnd.fieldSeparator.fieldBegin)) {
                            fieldEnd.fieldSeparator.fieldBegin = childNode;
                            if (isNullOrUndefined(childNode.fieldSeparator)) {
                                childNode.fieldSeparator = fieldEnd.fieldSeparator;
                            }
                        }
                    }
                    return !isNullOrUndefined(fieldEnd.fieldBegin);
                }
                else if (childNode.fieldType === 2 && isNullOrUndefined(childNode.fieldEnd)) {
                    fieldEnd.fieldSeparator = childNode;
                    childNode.fieldEnd = fieldEnd;
                    if (!isNullOrUndefined(childNode.fieldBegin)) {
                        fieldEnd.fieldBegin = childNode.fieldBegin;
                    }
                }
            }
        }
        if (line.previousLine) {
            this.linkFieldTraversingBackward(line.previousLine, fieldEnd, this);
        }
        else if (line.paragraph.previousRenderedWidget instanceof ParagraphWidget
            && line.paragraph.previousRenderedWidget.childWidgets.length > 0) {
            var prevParagraph = line.paragraph.previousRenderedWidget;
            // tslint:disable-next-line:max-line-length
            this.linkFieldTraversingBackward(prevParagraph.childWidgets[prevParagraph.childWidgets.length - 1], fieldEnd, this);
        }
        return true;
    };
    /**
     * @private
     */
    ElementBox.prototype.linkFieldTraversingForward = function (line, fieldBegin, previousNode) {
        var i = 0;
        if (line.children.indexOf(previousNode) > -1) {
            i = line.children.indexOf(previousNode) + 1;
        }
        for (var j = i; j < line.children.length; j++) {
            var node = line.children[j];
            if (node instanceof FieldElementBox) {
                if (node.fieldType === 1) {
                    if (isNullOrUndefined(node.fieldBegin)) {
                        fieldBegin.fieldEnd = node;
                    }
                    if (fieldBegin.fieldEnd && isNullOrUndefined(fieldBegin.fieldEnd.fieldBegin)) {
                        fieldBegin.fieldEnd.fieldBegin = fieldBegin;
                    }
                    return true;
                }
                else if (isNullOrUndefined(fieldBegin.fieldSeparator)) {
                    if (node.fieldType === 2 && isNullOrUndefined(node.fieldBegin)) {
                        fieldBegin.fieldSeparator = node;
                        if (fieldBegin.fieldSeparator && isNullOrUndefined(fieldBegin.fieldSeparator.fieldBegin)) {
                            fieldBegin.fieldSeparator.fieldBegin = fieldBegin;
                        }
                        if (!isNullOrUndefined(node.fieldEnd)) {
                            fieldBegin.fieldEnd = node.fieldEnd;
                            fieldBegin.fieldSeparator.fieldEnd = fieldBegin.fieldEnd;
                            return true;
                        }
                    }
                    else {
                        return false;
                    }
                }
            }
        }
        if (line.nextLine) {
            this.linkFieldTraversingForward(line.nextLine, fieldBegin, this);
        }
        else if (line.paragraph.nextRenderedWidget instanceof ParagraphWidget
            && line.paragraph.nextRenderedWidget.childWidgets.length > 0) {
            this.linkFieldTraversingForward(line.paragraph.nextRenderedWidget.childWidgets[0], fieldBegin, this);
        }
        return true;
    };
    /**
     * @private
     */
    ElementBox.prototype.linkFieldTraversingBackwardSeparator = function (line, fieldSeparator, previousNode) {
        var index = line.children.length - 1;
        if (line.children.indexOf(previousNode) > -1) {
            index = line.children.indexOf(previousNode) - 1;
        }
        for (var i = index; i >= 0; i--) {
            var childElement = line.children[i];
            if (childElement instanceof FieldElementBox) {
                if (childElement instanceof FieldElementBox && childElement.fieldType === 0) {
                    if (isNullOrUndefined(childElement.fieldSeparator)) {
                        fieldSeparator.fieldBegin = childElement;
                    }
                    return !isNullOrUndefined(fieldSeparator.fieldBegin);
                }
            }
        }
        if (line.previousLine) {
            this.linkFieldTraversingBackwardSeparator(line.previousLine, fieldSeparator, this);
        }
        else if (line.paragraph.previousRenderedWidget instanceof ParagraphWidget
            && line.paragraph.previousRenderedWidget.childWidgets.length > 0) {
            // tslint:disable-next-line:max-line-length
            line = line.paragraph.previousRenderedWidget.childWidgets[line.paragraph.previousRenderedWidget.childWidgets.length - 1];
            this.linkFieldTraversingBackwardSeparator(line, fieldSeparator, this);
        }
        else {
            return true;
        }
        return true;
    };
    Object.defineProperty(ElementBox.prototype, "length", {
        /**
         * @private
         */
        get: function () {
            return this.getLength();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementBox.prototype, "indexInOwner", {
        /**
         * @private
         */
        get: function () {
            return this.line instanceof LineWidget && this.line.children ? this.line.children.indexOf(this) : -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementBox.prototype, "previousElement", {
        /**
         * @private
         */
        get: function () {
            var index = this.indexInOwner;
            if (index > 0 && index < this.line.children.length) {
                return this.line.children[index - 1];
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementBox.prototype, "nextElement", {
        /**
         * @private
         */
        get: function () {
            var index = this.indexInOwner;
            if (index > -1 && index < this.line.children.length - 1) {
                return this.line.children[index + 1];
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementBox.prototype, "nextNode", {
        /**
         * @private
         */
        get: function () {
            var index = this.line.children.indexOf(this);
            var lineIndex = this.line.paragraph.childWidgets.indexOf(this.line);
            if (index < this.line.children.length - 1) {
                return this.line.children[index + 1];
            }
            else if (lineIndex < this.line.paragraph.childWidgets.length - 1) {
                return this.line.paragraph.childWidgets[lineIndex + 1].children[0];
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementBox.prototype, "nextValidNodeForTracking", {
        /**
         * @private
         */
        get: function () {
            var elementBox = this;
            //tslint:disable-next-line:max-line-length
            while (!isNullOrUndefined(elementBox) && (elementBox instanceof BookmarkElementBox || elementBox instanceof CommentCharacterElementBox || elementBox instanceof EditRangeStartElementBox || elementBox instanceof EditRangeEndElementBox || elementBox instanceof ContentControl)) {
                elementBox = elementBox.nextNode;
            }
            return elementBox;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementBox.prototype, "previousValidNodeForTracking", {
        /**
         * @private
         */
        get: function () {
            var elementBox = this;
            //tslint:disable-next-line:max-line-length
            while (!isNullOrUndefined(elementBox) && (elementBox instanceof BookmarkElementBox || elementBox instanceof CommentCharacterElementBox || elementBox instanceof EditRangeStartElementBox || elementBox instanceof EditRangeEndElementBox || elementBox instanceof ContentControl)) {
                elementBox = elementBox.previousNode;
            }
            return elementBox;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementBox.prototype, "previousNode", {
        /**
         * @private
         */
        get: function () {
            var index = this.line.children.indexOf(this);
            var lineIndex = this.line.paragraph.childWidgets.indexOf(this.line);
            if (index > 0) {
                return this.line.children[index - 1];
            }
            else if (lineIndex > 0) {
                var lineWidget = this.line.paragraph.childWidgets[lineIndex - 1];
                return lineWidget.children[lineWidget.children.length - 1];
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementBox.prototype, "paragraph", {
        /**
         * @private
         */
        get: function () {
            if (this.line) {
                return this.line.paragraph;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ElementBox.prototype.destroy = function () {
        if (!isNullOrUndefined(this.line) && this.line.children && this.line.children.indexOf(this) > -1) {
            var index = this.line.children.indexOf(this);
            this.line.children.splice(index, 1);
        }
        this.line = undefined;
        if (this.characterFormat) {
            this.characterFormat.destroy();
        }
        this.characterFormat = undefined;
        if (this.margin) {
            this.margin.destroy();
        }
        this.margin = undefined;
        this.x = undefined;
        this.y = undefined;
        this.width = undefined;
        this.height = undefined;
    };
    /**
     * @private
     */
    ElementBox.objectCharacter = String.fromCharCode(65532);
    return ElementBox;
}());
export { ElementBox };
/**
 * @private
 */
var FieldElementBox = /** @class */ (function (_super) {
    __extends(FieldElementBox, _super);
    function FieldElementBox(type) {
        var _this = _super.call(this) || this;
        /**
         * @private
         */
        _this.fieldType = 0;
        /**
         * @private
         */
        _this.fieldCodeType = '';
        /**
         * @private
         */
        _this.hasFieldEnd = false;
        _this.fieldBeginInternal = undefined;
        _this.fieldSeparatorInternal = undefined;
        _this.fieldEndInternal = undefined;
        _this.fieldType = type;
        return _this;
    }
    Object.defineProperty(FieldElementBox.prototype, "fieldBegin", {
        get: function () {
            return this.fieldBeginInternal;
        },
        set: function (field) {
            this.fieldBeginInternal = field;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldElementBox.prototype, "fieldSeparator", {
        get: function () {
            return this.fieldSeparatorInternal;
        },
        set: function (field) {
            this.fieldSeparatorInternal = field;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldElementBox.prototype, "fieldEnd", {
        get: function () {
            return this.fieldEndInternal;
        },
        set: function (field) {
            this.fieldEndInternal = field;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldElementBox.prototype, "resultText", {
        /**
         * @private
         */
        get: function () {
            if (!isNullOrUndefined(this.formFieldData) && this.fieldType === 0 &&
                !isNullOrUndefined(this.fieldSeparator) && !isNullOrUndefined(this.fieldEnd)) {
                var textElement = this.fieldSeparator.nextElement;
                var text = '';
                do {
                    if (textElement instanceof TextElementBox) {
                        text += textElement.text;
                    }
                    textElement = textElement.nextNode;
                    if (textElement === this.fieldEnd) {
                        break;
                    }
                } while (textElement);
                return text;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    FieldElementBox.prototype.getLength = function () {
        return 1;
    };
    /**
     * @private
     */
    FieldElementBox.prototype.clone = function () {
        var field = new FieldElementBox(this.fieldType);
        if (this.fieldType === 0 && !isNullOrUndefined(this.formFieldData)) {
            field.formFieldData = this.formFieldData.clone();
        }
        field.characterFormat.copyFormat(this.characterFormat);
        if (this.margin) {
            field.margin = this.margin.clone();
        }
        field.width = this.width;
        field.height = this.height;
        if (this.revisions.length > 0) {
            field.removedIds = Revision.cloneRevisions(this.revisions);
        }
        else {
            field.removedIds = this.removedIds.slice();
        }
        field.fieldCodeType = this.fieldCodeType;
        return field;
    };
    /**
     * @private
     */
    FieldElementBox.prototype.destroy = function () {
        this.fieldType = undefined;
        this.hasFieldEnd = undefined;
        this.fieldBeginInternal = undefined;
        this.fieldEndInternal = undefined;
        this.fieldSeparatorInternal = undefined;
        _super.prototype.destroy.call(this);
    };
    return FieldElementBox;
}(ElementBox));
export { FieldElementBox };
/**
 * @private
 */
var FormField = /** @class */ (function () {
    function FormField() {
        /*
         * @private
         */
        this.name = '';
        /**
         * @private
         */
        this.enabled = true;
        /**
         * @private
         */
        this.helpText = '';
        /**
         * @private
         */
        this.statusText = '';
    }
    return FormField;
}());
export { FormField };
/**
 * @private
 */
var TextFormField = /** @class */ (function (_super) {
    __extends(TextFormField, _super);
    function TextFormField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * @private
         */
        _this.type = 'Text';
        /**
         * @private
         */
        _this.maxLength = 0;
        /**
         * @private
         */
        _this.defaultValue = '';
        /**
         * @private
         */
        _this.format = '';
        return _this;
    }
    /**
     * @private
     */
    TextFormField.prototype.clone = function () {
        var textForm = new TextFormField();
        textForm.type = this.type;
        textForm.name = this.name;
        textForm.enabled = this.enabled;
        textForm.helpText = this.helpText;
        textForm.statusText = this.statusText;
        textForm.maxLength = this.maxLength;
        textForm.defaultValue = this.defaultValue;
        textForm.format = this.format;
        return textForm;
    };
    /**
     * @private
     */
    TextFormField.prototype.getFormFieldInfo = function () {
        var textFormField = {
            defaultValue: this.defaultValue,
            enabled: this.enabled,
            format: this.format,
            helpText: this.helpText,
            maxLength: this.maxLength,
            type: this.type
        };
        return textFormField;
    };
    /**
     * @private
     */
    TextFormField.prototype.copyFieldInfo = function (info) {
        if (!isNullOrUndefined(info.defaultValue)) {
            this.defaultValue = info.defaultValue;
        }
        if (!isNullOrUndefined(info.enabled)) {
            this.enabled = info.enabled;
        }
        if (!isNullOrUndefined(info.format)) {
            this.format = info.format;
        }
        if (!isNullOrUndefined(info.helpText)) {
            this.helpText = info.helpText;
        }
        if (!isNullOrUndefined(info.maxLength)) {
            this.maxLength = info.maxLength;
        }
        if (!isNullOrUndefined(info.type)) {
            this.type = info.type;
        }
    };
    return TextFormField;
}(FormField));
export { TextFormField };
/**
 * @private
 */
var CheckBoxFormField = /** @class */ (function (_super) {
    __extends(CheckBoxFormField, _super);
    function CheckBoxFormField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * @private
         */
        _this.sizeType = 'Auto';
        /**
         * @private
         */
        _this.size = 11;
        /**
         * @private
         */
        _this.defaultValue = false;
        /**
         * @private
         */
        _this.checked = false;
        return _this;
    }
    /**
     * @private
     */
    CheckBoxFormField.prototype.clone = function () {
        var checkBoxForm = new CheckBoxFormField();
        checkBoxForm.name = this.name;
        checkBoxForm.enabled = this.enabled;
        checkBoxForm.helpText = this.helpText;
        checkBoxForm.statusText = this.statusText;
        checkBoxForm.sizeType = this.sizeType;
        checkBoxForm.size = this.size;
        checkBoxForm.defaultValue = this.defaultValue;
        checkBoxForm.checked = this.checked;
        return checkBoxForm;
    };
    /**
     * @private
     */
    CheckBoxFormField.prototype.getFormFieldInfo = function () {
        var checkBoxFormField = {
            defaultValue: this.defaultValue,
            enabled: this.enabled,
            helpText: this.helpText,
            size: this.size,
            sizeType: this.sizeType
        };
        return checkBoxFormField;
    };
    /**
     * @private
     */
    CheckBoxFormField.prototype.copyFieldInfo = function (info) {
        if (!isNullOrUndefined(info.defaultValue)) {
            this.defaultValue = info.defaultValue;
            this.checked = info.defaultValue;
        }
        if (!isNullOrUndefined(info.enabled)) {
            this.enabled = info.enabled;
        }
        if (!isNullOrUndefined(info.size)) {
            this.size = info.size;
        }
        if (!isNullOrUndefined(info.helpText)) {
            this.helpText = info.helpText;
        }
        if (!isNullOrUndefined(info.sizeType)) {
            this.sizeType = info.sizeType;
        }
    };
    return CheckBoxFormField;
}(FormField));
export { CheckBoxFormField };
/**
 * @private
 */
var DropDownFormField = /** @class */ (function (_super) {
    __extends(DropDownFormField, _super);
    function DropDownFormField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * @private
         */
        _this.dropdownItems = [];
        /**
         * @private
         */
        _this.selectedIndex = 0;
        return _this;
    }
    /**
     * @private
     */
    DropDownFormField.prototype.clone = function () {
        var dropDown = new DropDownFormField();
        dropDown.name = this.name;
        dropDown.enabled = this.enabled;
        dropDown.helpText = this.helpText;
        dropDown.statusText = this.statusText;
        dropDown.dropdownItems = this.dropdownItems.slice();
        dropDown.selectedIndex = this.selectedIndex;
        return dropDown;
    };
    /**
     * @private
     */
    DropDownFormField.prototype.getFormFieldInfo = function () {
        var dropDownFormField = {
            dropdownItems: this.dropdownItems.slice(),
            enabled: this.enabled,
            helpText: this.helpText
        };
        return dropDownFormField;
    };
    /**
     * @private
     */
    DropDownFormField.prototype.copyFieldInfo = function (info) {
        if (!isNullOrUndefined(info.dropdownItems)) {
            this.dropdownItems = info.dropdownItems;
        }
        if (!isNullOrUndefined(info.enabled)) {
            this.enabled = info.enabled;
        }
        if (!isNullOrUndefined(info.helpText)) {
            this.helpText = info.helpText;
        }
    };
    return DropDownFormField;
}(FormField));
export { DropDownFormField };
/**
 * @private
 */
var TextElementBox = /** @class */ (function (_super) {
    __extends(TextElementBox, _super);
    function TextElementBox() {
        var _this = _super.call(this) || this;
        /**
         * @private
         */
        _this.baselineOffset = 0;
        /**
         * @private
         */
        _this.text = '';
        /**
         * @private
         */
        _this.trimEndWidth = 0;
        /**
         * @private
         */
        _this.ignoreOnceItems = [];
        /**
         * @private
         */
        _this.istextCombined = false;
        _this.errorCollection = [];
        return _this;
    }
    /**
     * @private
     */
    TextElementBox.prototype.getLength = function () {
        return this.text ? this.text.length : 0;
    };
    /**
     * @private
     */
    TextElementBox.prototype.clone = function () {
        var span = new TextElementBox();
        span.characterFormat.copyFormat(this.characterFormat);
        span.text = this.text;
        if (this.margin) {
            span.margin = this.margin.clone();
        }
        span.baselineOffset = this.baselineOffset;
        if (this.revisions.length > 0) {
            span.removedIds = Revision.cloneRevisions(this.revisions);
        }
        else {
            span.removedIds = this.removedIds.slice();
        }
        span.width = this.width;
        span.height = this.height;
        if (this.contentControlProperties) {
            span.contentControlProperties = this.contentControlProperties;
        }
        return span;
    };
    /**
     * @private
     */
    TextElementBox.prototype.destroy = function () {
        this.text = undefined;
        _super.prototype.destroy.call(this);
    };
    return TextElementBox;
}(ElementBox));
export { TextElementBox };
/**
 * @private
 */
var Footnote = /** @class */ (function () {
    function Footnote() {
        this.separator = [];
        this.continuationNotice = [];
        this.continuationSeparator = [];
    }
    /**
     * @private
     */
    Footnote.prototype.clear = function () {
        this.separator = [];
        this.continuationSeparator = [];
        this.continuationNotice = [];
    };
    Footnote.prototype.destroy = function () {
        this.separator = [];
        this.continuationSeparator = [];
        this.continuationNotice = [];
    };
    return Footnote;
}());
export { Footnote };
/**
 * @private
 */
var FootnoteElementBox = /** @class */ (function (_super) {
    __extends(FootnoteElementBox, _super);
    function FootnoteElementBox() {
        var _this = _super.call(this) || this;
        _this.isLayout = false;
        _this.blocks = [];
        return _this;
    }
    FootnoteElementBox.prototype.clone = function () {
        var span = new FootnoteElementBox();
        span.text = this.text;
        span.characterFormat.copyFormat(this.characterFormat);
        span.height = this.height;
        span.footnoteType = this.footnoteType;
        span.width = this.width;
        span.symbolCode = this.symbolCode;
        span.blocks = this.blocks;
        if (this.margin) {
            span.margin = this.margin.clone();
        }
        return span;
    };
    FootnoteElementBox.prototype.getLength = function () {
        return 1;
    };
    FootnoteElementBox.prototype.destroy = function () {
        this.symbolCode = '';
        this.symbolFontName = '';
        this.customMarker = '';
    };
    return FootnoteElementBox;
}(TextElementBox));
export { FootnoteElementBox };
/**
 * @private
 */
var ErrorTextElementBox = /** @class */ (function (_super) {
    __extends(ErrorTextElementBox, _super);
    function ErrorTextElementBox() {
        var _this = _super.call(this) || this;
        _this.startIn = undefined;
        _this.endIn = undefined;
        return _this;
    }
    Object.defineProperty(ErrorTextElementBox.prototype, "start", {
        get: function () {
            return this.startIn;
        },
        set: function (value) {
            this.startIn = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorTextElementBox.prototype, "end", {
        get: function () {
            return this.endIn;
        },
        set: function (value) {
            this.endIn = value;
        },
        enumerable: true,
        configurable: true
    });
    ErrorTextElementBox.prototype.destroy = function () {
        this.start = undefined;
        this.end = undefined;
    };
    return ErrorTextElementBox;
}(TextElementBox));
export { ErrorTextElementBox };
/**
 * @private
 */
var FieldTextElementBox = /** @class */ (function (_super) {
    __extends(FieldTextElementBox, _super);
    function FieldTextElementBox() {
        var _this = _super.call(this) || this;
        _this.fieldText = '';
        return _this;
    }
    Object.defineProperty(FieldTextElementBox.prototype, "text", {
        get: function () {
            return this.fieldText;
        },
        set: function (value) {
            this.fieldText = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    FieldTextElementBox.prototype.clone = function () {
        var span = new FieldTextElementBox();
        span.characterFormat.copyFormat(this.characterFormat);
        span.fieldBegin = this.fieldBegin;
        span.text = this.text;
        if (this.margin) {
            span.margin = this.margin.clone();
        }
        if (this.revisions.length > 0) {
            span.removedIds = Revision.cloneRevisions(this.revisions);
        }
        else {
            span.removedIds = this.removedIds.slice();
        }
        span.width = this.width;
        span.height = this.height;
        return span;
    };
    return FieldTextElementBox;
}(TextElementBox));
export { FieldTextElementBox };
/**
 * @private
 */
var TabElementBox = /** @class */ (function (_super) {
    __extends(TabElementBox, _super);
    function TabElementBox() {
        var _this = _super.call(this) || this;
        /**
         * @private
         */
        _this.tabText = '';
        /**
         * @private
         */
        _this.tabLeader = 'None';
        return _this;
    }
    /**
     * @private
     */
    TabElementBox.prototype.destroy = function () {
        this.tabText = undefined;
        this.tabLeader = undefined;
    };
    /**
     * @private
     */
    TabElementBox.prototype.clone = function () {
        var span = new TabElementBox();
        span.characterFormat.copyFormat(this.characterFormat);
        span.tabText = this.tabText;
        span.tabLeader = this.tabLeader;
        span.text = this.text;
        if (this.margin) {
            span.margin = this.margin.clone();
        }
        span.width = this.width;
        span.height = this.height;
        if (this.revisions.length > 0) {
            span.removedIds = Revision.cloneRevisions(this.revisions);
        }
        else {
            span.removedIds = this.removedIds.slice();
        }
        return span;
    };
    return TabElementBox;
}(TextElementBox));
export { TabElementBox };
/**
 * @private
 */
var BookmarkElementBox = /** @class */ (function (_super) {
    __extends(BookmarkElementBox, _super);
    function BookmarkElementBox(type) {
        var _this = _super.call(this) || this;
        _this.bookmarkTypeIn = 0;
        _this.refereneceIn = undefined;
        _this.nameIn = '';
        _this.bookmarkTypeIn = type;
        return _this;
    }
    Object.defineProperty(BookmarkElementBox.prototype, "bookmarkType", {
        /**
         * @private
         */
        get: function () {
            return this.bookmarkTypeIn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BookmarkElementBox.prototype, "name", {
        /**
         * @private
         */
        get: function () {
            return this.nameIn;
        },
        /**
         * @private
         */
        set: function (name) {
            this.nameIn = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BookmarkElementBox.prototype, "reference", {
        /**
         * @private
         */
        get: function () {
            return this.refereneceIn;
        },
        /**
         * @private
         */
        set: function (reference) {
            this.refereneceIn = reference;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    BookmarkElementBox.prototype.getLength = function () {
        return 1;
    };
    /**
     * @private
     */
    BookmarkElementBox.prototype.destroy = function () {
        this.name = undefined;
        this.reference = undefined;
        this.bookmarkTypeIn = undefined;
    };
    /**
     * Clones the bookmark element box.
     * @param element - book mark element
     */
    /**
     * @private
     */
    BookmarkElementBox.prototype.clone = function () {
        var span = new BookmarkElementBox(this.bookmarkType);
        span.name = this.name;
        span.reference = this.reference;
        if (this.margin) {
            span.margin = this.margin.clone();
        }
        span.width = this.width;
        span.height = this.height;
        if (this.contentControlProperties) {
            span.contentControlProperties = this.contentControlProperties;
        }
        return span;
    };
    return BookmarkElementBox;
}(ElementBox));
export { BookmarkElementBox };
/**
 * @private
 */
var ContentControl = /** @class */ (function (_super) {
    __extends(ContentControl, _super);
    function ContentControl(widgetType) {
        var _this = _super.call(this) || this;
        _this.contentControlWidgetType = widgetType;
        _this.contentControlProperties = new ContentControlProperties(widgetType);
        return _this;
    }
    /**
     * @private
     */
    ContentControl.prototype.getLength = function () {
        return 1;
    };
    /**
     * @private
     */
    ContentControl.prototype.clone = function () {
        var span = new ContentControl(this.contentControlWidgetType);
        span.characterFormat.copyFormat(this.characterFormat);
        span.contentControlProperties = this.contentControlProperties;
        span.contentControlWidgetType = this.contentControlWidgetType;
        if (this.margin) {
            span.margin = this.margin.clone();
        }
        if (this.revisions.length > 0) {
            span.removedIds = Revision.cloneRevisions(this.revisions);
        }
        else {
            span.removedIds = this.removedIds.slice();
        }
        span.type = this.type;
        span.width = this.width;
        span.height = this.height;
        span.reference = this.reference;
        return span;
    };
    /**
     * @private
     */
    ContentControl.prototype.destroy = function () {
        this.contentControlProperties = undefined;
        this.contentControlWidgetType = undefined;
        _super.prototype.destroy.call(this);
    };
    return ContentControl;
}(ElementBox));
export { ContentControl };
/**
 * @private
 */
/**
 * @private
 */
var ContentControlProperties = /** @class */ (function () {
    function ContentControlProperties(widgetType) {
        /**
         * @private
         */
        this.contentControlListItems = [];
        this.contentControlWidgetType = widgetType;
        this.characterFormat = new WCharacterFormat();
    }
    /**
     * @private
     */
    ContentControlProperties.prototype.destroy = function () {
        this.lockContentControl = undefined;
        this.lockContents = undefined;
        this.tag = undefined;
        this.color = undefined;
        this.title = undefined;
        this.appearance = undefined;
        this.type = undefined;
        this.hasPlaceHolderText = undefined;
        this.multiline = undefined;
        this.isTemporary = undefined;
        this.isChecked = undefined;
        this.dateCalendarType = undefined;
        this.dateStorageFormat = undefined;
        this.dateDisplayLocale = undefined;
        this.dateDisplayFormat = undefined;
    };
    /**
     * @private
     */
    ContentControlProperties.prototype.clone = function () {
        var span = new ContentControlProperties(this.contentControlWidgetType);
        span.lockContentControl = this.lockContentControl;
        span.lockContents = this.lockContents;
        span.tag = this.tag;
        span.color = this.color;
        span.title = this.title;
        span.appearance = this.appearance;
        span.type = this.type;
        span.hasPlaceHolderText = this.hasPlaceHolderText;
        span.multiline = this.multiline;
        span.isTemporary = this.isTemporary;
        span.isChecked = this.isChecked;
        span.dateCalendarType = this.dateCalendarType;
        span.dateStorageFormat = this.dateStorageFormat;
        span.dateDisplayLocale = this.dateDisplayLocale;
        span.dateDisplayFormat = this.dateDisplayFormat;
        if (this.contentControlListItems.length > 0) {
            for (var i = 0; i < this.contentControlListItems.length; i++) {
                span.contentControlListItems.push(this.contentControlListItems[i].clone());
            }
        }
        if (this.checkedState) {
            span.checkedState = this.checkedState.clone();
        }
        if (this.uncheckedState) {
            span.uncheckedState = this.uncheckedState.clone();
        }
        if (this.xmlMapping) {
            span.xmlMapping = this.xmlMapping.clone();
        }
        return span;
    };
    return ContentControlProperties;
}());
export { ContentControlProperties };
/**
 * @private
 */
var ContentControlListItems = /** @class */ (function () {
    function ContentControlListItems() {
    }
    /**
     * @private
     */
    ContentControlListItems.prototype.destroy = function () {
        this.displayText = undefined;
        this.value = undefined;
    };
    /**
     * @private
     */
    ContentControlListItems.prototype.clone = function () {
        var span = new ContentControlListItems();
        span.displayText = this.displayText;
        span.value = this.value;
        return span;
    };
    return ContentControlListItems;
}());
export { ContentControlListItems };
/**
 * @private
 */
var CheckBoxState = /** @class */ (function () {
    function CheckBoxState() {
    }
    /**
     * @private
     */
    CheckBoxState.prototype.destroy = function () {
        this.font = undefined;
        this.value = undefined;
    };
    /**
     * @private
     */
    CheckBoxState.prototype.clone = function () {
        var span = new CheckBoxState();
        span.font = this.font;
        span.value = this.value;
        return span;
    };
    return CheckBoxState;
}());
export { CheckBoxState };
/**
 * @private
 */
var XmlMapping = /** @class */ (function () {
    function XmlMapping() {
    }
    /**
     * @private
     */
    XmlMapping.prototype.destroy = function () {
        this.isMapped = undefined;
        this.isWordMl = undefined;
        this.prefixMapping = undefined;
        this.xPath = undefined;
        this.storeItemId = undefined;
        this.customXmlPart = undefined;
    };
    /**
     * @private
     */
    XmlMapping.prototype.clone = function () {
        var span = new XmlMapping();
        span.isMapped = this.isMapped;
        span.isWordMl = this.isWordMl;
        span.prefixMapping = this.prefixMapping;
        span.xPath = this.xPath;
        span.storeItemId = this.storeItemId;
        if (this.customXmlPart) {
            span.customXmlPart = this.customXmlPart.clone();
        }
        return span;
    };
    return XmlMapping;
}());
export { XmlMapping };
/**
 * @private
 */
var CustomXmlPart = /** @class */ (function () {
    function CustomXmlPart() {
    }
    /**
     * @private
     */
    CustomXmlPart.prototype.destroy = function () {
        this.id = undefined;
        this.xml = undefined;
    };
    /**
     * @private
     */
    CustomXmlPart.prototype.clone = function () {
        var span = new CustomXmlPart();
        span.id = this.id;
        span.xml = this.xml;
        return span;
    };
    return CustomXmlPart;
}());
export { CustomXmlPart };
/**
 * @private
 */
var ShapeCommon = /** @class */ (function (_super) {
    __extends(ShapeCommon, _super);
    function ShapeCommon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * @private
         */
        _this.name = '';
        /**
         * @private
         */
        _this.alternativeText = '';
        /**
         * @private
         */
        _this.title = '';
        return _this;
    }
    /**
     *
     * @private
     */
    ShapeCommon.prototype.getLength = function () {
        return 1;
    };
    /**
     * @private
     */
    ShapeCommon.prototype.clone = function () {
        var shape = new ShapeElementBox();
        return shape;
    };
    return ShapeCommon;
}(ElementBox));
export { ShapeCommon };
/**
 * @private
 */
var ShapeBase = /** @class */ (function (_super) {
    __extends(ShapeBase, _super);
    function ShapeBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ShapeBase;
}(ShapeCommon));
export { ShapeBase };
/**
 * @private
 */
var ShapeElementBox = /** @class */ (function (_super) {
    __extends(ShapeElementBox, _super);
    function ShapeElementBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @private
     */
    ShapeElementBox.prototype.clone = function () {
        var shape = new ShapeElementBox();
        shape.characterFormat.copyFormat(this.characterFormat);
        shape.x = this.x;
        shape.y = this.y;
        shape.width = this.width;
        shape.height = this.height;
        shape.shapeId = this.shapeId;
        shape.name = this.name;
        shape.alternativeText = this.alternativeText;
        shape.title = this.title;
        shape.widthScale = this.widthScale;
        shape.heightScale = this.heightScale;
        shape.visible = this.visible;
        shape.verticalPosition = this.verticalPosition;
        shape.verticalAlignment = this.verticalAlignment;
        shape.verticalOrigin = this.verticalOrigin;
        shape.horizontalPosition = this.horizontalPosition;
        shape.horizontalAlignment = this.horizontalAlignment;
        shape.horizontalOrigin = this.horizontalOrigin;
        shape.zOrderPosition = this.zOrderPosition;
        shape.allowOverlap = this.allowOverlap;
        shape.layoutInCell = this.layoutInCell;
        shape.lockAnchor = this.lockAnchor;
        shape.autoShapeType = this.autoShapeType;
        if (this.lineFormat) {
            shape.lineFormat = this.lineFormat.clone();
        }
        if (this.fillFormat) {
            shape.fillFormat = this.fillFormat.clone();
        }
        if (this.textFrame) {
            shape.textFrame = this.textFrame.clone();
            shape.textFrame.containerShape = shape;
        }
        if (this.margin) {
            shape.margin = this.margin.clone();
        }
        return shape;
    };
    return ShapeElementBox;
}(ShapeBase));
export { ShapeElementBox };
/**
 * @private
 */
var TextFrame = /** @class */ (function (_super) {
    __extends(TextFrame, _super);
    function TextFrame() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextFrame.prototype.equals = function () {
        return false;
    };
    TextFrame.prototype.destroyInternal = function () {
        //return;
    };
    TextFrame.prototype.getHierarchicalIndex = function (index) {
        var line = this.containerShape.line;
        var offset = line.getOffset(this.containerShape, 0).toString();
        return line.getHierarchicalIndex(offset);
    };
    TextFrame.prototype.getTableCellWidget = function () {
        return undefined;
    };
    /**
     * @private
     */
    TextFrame.prototype.clone = function () {
        var textFrame = new TextFrame();
        textFrame.textVerticalAlignment = this.textVerticalAlignment;
        textFrame.marginBottom = this.marginBottom;
        textFrame.marginLeft = this.marginLeft;
        textFrame.marginRight = this.marginRight;
        textFrame.marginTop = this.marginTop;
        for (var i = 0; i < this.childWidgets.length; i++) {
            var block = this.childWidgets[i].clone();
            textFrame.childWidgets.push(block);
            block.index = i;
            block.containerWidget = textFrame;
        }
        return textFrame;
    };
    return TextFrame;
}(Widget));
export { TextFrame };
/**
 * @private
 */
var LineFormat = /** @class */ (function () {
    function LineFormat() {
    }
    /**
     * @private
     */
    LineFormat.prototype.clone = function () {
        var lineFormat = new LineFormat();
        lineFormat.lineFormatType = this.lineFormatType;
        lineFormat.color = this.color;
        lineFormat.weight = this.weight;
        lineFormat.dashStyle = this.dashStyle;
        return lineFormat;
    };
    return LineFormat;
}());
export { LineFormat };
/**
 * @private
 */
var FillFormat = /** @class */ (function () {
    function FillFormat() {
    }
    /**
     * @private
     */
    FillFormat.prototype.clone = function () {
        var fillFormat = new FillFormat();
        fillFormat.color = this.color;
        fillFormat.fill = this.fill;
        return fillFormat;
    };
    return FillFormat;
}());
export { FillFormat };
/**
 * @private
 */
var ImageElementBox = /** @class */ (function (_super) {
    __extends(ImageElementBox, _super);
    function ImageElementBox(isInlineImage) {
        var _this = _super.call(this) || this;
        _this.imageStr = '';
        _this.imgElement = undefined;
        _this.isInlineImageIn = true;
        /**
         * @private
         */
        _this.isCrop = false;
        /**
         * @private
         */
        _this.isMetaFile = false;
        _this.isInlineImageIn = isInlineImage;
        return _this;
    }
    Object.defineProperty(ImageElementBox.prototype, "isInlineImage", {
        /**
         * @private
         */
        get: function () {
            return this.isInlineImageIn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageElementBox.prototype, "element", {
        /**
         * @private
         */
        get: function () {
            if (isNullOrUndefined(this.imgElement)) {
                this.imgElement = document.createElement('img');
            }
            return this.imgElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageElementBox.prototype, "length", {
        /**
         * @private
         */
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageElementBox.prototype, "imageString", {
        /**
         * @private
         */
        get: function () {
            return this.imageStr;
        },
        /**
         * @private
         */
        set: function (value) {
            this.imageStr = value;
            if (!isNullOrUndefined(value)) {
                this.element.src = this.imageStr;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ImageElementBox.prototype.getLength = function () {
        return 1;
    };
    /**
     * @private
     */
    ImageElementBox.prototype.clone = function () {
        var image = new ImageElementBox(this.isInlineImage);
        image.characterFormat.copyFormat(this.characterFormat);
        image.imageString = this.imageString;
        image.isMetaFile = this.isMetaFile;
        image.width = this.width;
        image.height = this.height;
        if (this.isCrop) {
            image.verticalPosition = this.top;
            image.horizontalPosition = this.left;
            image.bottom = this.bottom;
            image.right = this.right;
            image.isCrop = this.isCrop;
            image.heightScale = this.heightScale;
            image.widthScale = this.widthScale;
        }
        if (this.margin) {
            image.margin = this.margin.clone();
        }
        if (this.revisions.length > 0) {
            image.removedIds = Revision.cloneRevisions(this.revisions);
        }
        else {
            image.removedIds = this.removedIds.slice();
        }
        return image;
    };
    /**
     * @private
     */
    ImageElementBox.prototype.destroy = function () {
        this.imgElement = undefined;
        this.imageString = undefined;
        this.isInlineImageIn = undefined;
        _super.prototype.destroy.call(this);
    };
    return ImageElementBox;
}(ShapeBase));
export { ImageElementBox };
/**
 * @private
 */
var ListTextElementBox = /** @class */ (function (_super) {
    __extends(ListTextElementBox, _super);
    function ListTextElementBox(listLevel, isListFollowCharacter) {
        var _this = _super.call(this) || this;
        /**
         * @private
         */
        _this.baselineOffset = 0;
        /**
         * @private
         */
        _this.trimEndWidth = 0;
        /**
         * @private
         */
        _this.isFollowCharacter = false;
        _this.listLevel = listLevel;
        _this.isFollowCharacter = isListFollowCharacter;
        return _this;
    }
    /**
     * @private
     */
    ListTextElementBox.prototype.getLength = function () {
        return this.text ? this.text.length : 0;
    };
    /**
     * @private
     */
    ListTextElementBox.prototype.clone = function () {
        var list = new ListTextElementBox(this.listLevel, this.isFollowCharacter);
        list.text = this.text;
        list.baselineOffset = this.baselineOffset;
        if (this.margin) {
            list.margin = this.margin.clone();
        }
        list.width = this.width;
        list.height = this.height;
        return list;
    };
    /**
     * @private
     */
    ListTextElementBox.prototype.destroy = function () {
        this.text = undefined;
        _super.prototype.destroy.call(this);
    };
    return ListTextElementBox;
}(ElementBox));
export { ListTextElementBox };
/**
 * @private
 */
var EditRangeEndElementBox = /** @class */ (function (_super) {
    __extends(EditRangeEndElementBox, _super);
    function EditRangeEndElementBox() {
        var _this = _super.call(this) || this;
        /**
         * @private
         */
        _this.editRangeStart = undefined;
        _this.editRangeId = -1;
        return _this;
    }
    /**
     * @private
     */
    EditRangeEndElementBox.prototype.getLength = function () {
        return 1;
    };
    /**
     * @private
     */
    EditRangeEndElementBox.prototype.destroy = function () {
        this.editRangeStart = undefined;
    };
    /**
     * @private
     */
    EditRangeEndElementBox.prototype.clone = function () {
        var end = new EditRangeEndElementBox();
        end.editRangeStart = this.editRangeStart;
        end.editRangeId = this.editRangeId;
        return end;
    };
    return EditRangeEndElementBox;
}(ElementBox));
export { EditRangeEndElementBox };
/**
 * @private
 */
var EditRangeStartElementBox = /** @class */ (function (_super) {
    __extends(EditRangeStartElementBox, _super);
    function EditRangeStartElementBox() {
        var _this = _super.call(this) || this;
        /**
         * @private
         */
        _this.columnFirst = -1;
        /**
         * @private
         */
        _this.columnLast = -1;
        /**
         * @private
         */
        _this.user = '';
        /**
         * @private
         */
        _this.group = '';
        _this.editRangeId = -1;
        return _this;
    }
    /**
     * @private
     */
    EditRangeStartElementBox.prototype.getLength = function () {
        return 1;
    };
    /**
     * @private
     */
    EditRangeStartElementBox.prototype.renderLockMark = function (currentUser, locale) {
        if (isNullOrUndefined(this.editRangeMark)) {
            var user = currentUser === this.user ? 'you' : this.user;
            this.editRangeMark = document.createElement('div');
            this.editRangeMark.style.display = 'none';
            this.editRangeMark.classList.add('e-de-lock-mark');
            var span = document.createElement('span');
            span.className = 'e-icons e-de-ctnr-lock';
            this.editRangeMark.appendChild(span);
            this.editRangeMark.title = locale.getConstant('This region is locked by') + ' ' + user;
        }
        if (this.line && isNullOrUndefined(this.editRangeMark.parentElement)) {
            var documentHelper = this.line.paragraph.bodyWidget.page.documentHelper;
            documentHelper.pageContainer.appendChild(this.editRangeMark);
        }
    };
    /**
     * @private
     */
    EditRangeStartElementBox.prototype.removeEditRangeMark = function () {
        if (this.editRangeMark) {
            this.editRangeMark.parentElement.removeChild(this.editRangeMark);
            this.editRangeMark = undefined;
        }
    };
    /**
     * @private
     */
    EditRangeStartElementBox.prototype.destroy = function () {
        this.user = undefined;
        this.columnFirst = undefined;
        this.columnLast = undefined;
    };
    /**
     * @private
     */
    EditRangeStartElementBox.prototype.clone = function () {
        var start = new EditRangeStartElementBox();
        start.columnFirst = this.columnFirst;
        start.columnLast = this.columnLast;
        start.user = this.user;
        start.group = this.group;
        start.editRangeEnd = this.editRangeEnd;
        start.editRangeId = this.editRangeId;
        return start;
    };
    return EditRangeStartElementBox;
}(ElementBox));
export { EditRangeStartElementBox };
/**
 * @private
 */
var ChartElementBox = /** @class */ (function (_super) {
    __extends(ChartElementBox, _super);
    /**
     * @private
     */
    function ChartElementBox() {
        var _this = _super.call(this) || this;
        /**
         * @private
         */
        _this.chartTitle = '';
        /**
         * @private
         */
        _this.chartType = '';
        /**
         * @private
         */
        _this.chartElement = undefined;
        /**
         * @private
         */
        _this.chartCategory = [];
        /**
         * @private
         */
        _this.chartSeries = [];
        _this.chartArea = new ChartArea();
        _this.chartPlotArea = new ChartArea();
        _this.chartTitleArea = new ChartTitleArea();
        _this.chartLegend = new ChartLegend();
        _this.chartPrimaryCategoryAxis = new ChartCategoryAxis();
        _this.chartPrimaryValueAxis = new ChartCategoryAxis();
        _this.chartDataTable = new ChartDataTable();
        return _this;
    }
    /**
     * @private
     */
    ChartElementBox.prototype.getLength = function () {
        return 1;
    };
    Object.defineProperty(ChartElementBox.prototype, "title", {
        /**
         * @private
         */
        get: function () {
            return this.chartTitle;
        },
        /**
         * @private
         */
        set: function (value) {
            this.chartTitle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartElementBox.prototype, "type", {
        /**
         * @private
         */
        get: function () {
            return this.chartType;
        },
        /**
         * @private
         */
        set: function (value) {
            this.chartType = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartElementBox.prototype, "chartGapWidth", {
        /**
         * @private
         */
        get: function () {
            return this.gapWidth;
        },
        /**
         * @private
         */
        set: function (value) {
            this.gapWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartElementBox.prototype, "chartOverlap", {
        /**
         * @private
         */
        get: function () {
            return this.overlap;
        },
        /**
         * @private
         */
        set: function (value) {
            this.overlap = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartElementBox.prototype, "targetElement", {
        /**
         * @private
         */
        get: function () {
            if (isNullOrUndefined(this.div)) {
                this.div = createElement('div');
            }
            return this.div;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartElementBox.prototype, "officeChart", {
        /**
         * @private
         */
        get: function () {
            return this.officeChartInternal;
        },
        /**
         * @private
         */
        set: function (value) {
            if (value) {
                this.officeChartInternal = value;
                this.officeChartInternal.chart.loaded = this.onChartLoaded.bind(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    ChartElementBox.prototype.onChartLoaded = function () {
        var _this = this;
        this.officeChart.convertChartToImage(this.officeChart.chart, this.width, this.height).then(function (dataURL) {
            _this.imageString = dataURL;
        });
    };
    /**
     * @private
     */
    ChartElementBox.prototype.clone = function () {
        var chart = new ChartElementBox();
        chart.chartTitle = this.chartTitle;
        chart.chartType = this.chartType;
        chart.height = this.height;
        chart.width = this.width;
        chart.gapWidth = this.gapWidth;
        chart.overlap = this.overlap;
        for (var i = 0; i < this.chartCategory.length; i++) {
            var chartCategory = this.chartCategory[i].clone();
            chart.chartCategory.push(chartCategory);
        }
        for (var i = 0; i < this.chartSeries.length; i++) {
            var series = this.chartSeries[i].clone();
            chart.chartSeries.push(series);
        }
        chart.chartArea = this.chartArea.clone();
        chart.chartPlotArea = this.chartPlotArea.clone();
        chart.chartLegend = this.chartLegend.clone();
        chart.chartTitleArea = this.chartTitleArea.clone();
        chart.chartPrimaryCategoryAxis = this.chartPrimaryCategoryAxis.clone();
        chart.chartPrimaryValueAxis = this.chartPrimaryValueAxis.clone();
        chart.chartDataTable = this.chartDataTable.clone();
        return chart;
    };
    /**
     * @private
     */
    ChartElementBox.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        if (this.officeChartInternal) {
            this.officeChartInternal.chart.loaded = undefined;
            this.officeChartInternal.destroy();
            this.officeChartInternal = undefined;
        }
        if (this.div) {
            this.div = undefined;
        }
        this.chartTitle = undefined;
        this.chartType = undefined;
        this.chartArea = undefined;
        this.chartPlotArea = undefined;
        this.chartCategory = [];
        this.chartSeries = [];
        this.chartTitleArea = undefined;
        this.chartLegend = undefined;
        this.chartPrimaryCategoryAxis = undefined;
        this.chartPrimaryValueAxis = undefined;
        this.chartDataTable = undefined;
        this.chartElement = undefined;
    };
    return ChartElementBox;
}(ImageElementBox));
export { ChartElementBox };
/**
 * @private
 */
var ChartArea = /** @class */ (function () {
    function ChartArea() {
    }
    Object.defineProperty(ChartArea.prototype, "chartForeColor", {
        /**
         * @private
         */
        get: function () {
            return this.foreColor;
        },
        /**
         * @private
         */
        set: function (value) {
            this.foreColor = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ChartArea.prototype.clone = function () {
        var chart = new ChartArea();
        chart.foreColor = this.foreColor;
        return chart;
    };
    /**
     * @private
     */
    ChartArea.prototype.destroy = function () {
        this.foreColor = undefined;
    };
    return ChartArea;
}());
export { ChartArea };
/**
 * @private
 */
var ChartCategory = /** @class */ (function () {
    function ChartCategory() {
        /**
         * @private
         */
        this.categoryXName = '';
        /**
         * @private
         */
        this.chartData = [];
    }
    Object.defineProperty(ChartCategory.prototype, "xName", {
        /**
         * @private
         */
        get: function () {
            return this.categoryXName;
        },
        /**
         * @private
         */
        set: function (value) {
            this.categoryXName = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ChartCategory.prototype.clone = function () {
        var chart = new ChartCategory();
        chart.categoryXName = this.categoryXName;
        for (var i = 0; i < this.chartData.length; i++) {
            var chartData = this.chartData[i].clone();
            chart.chartData.push(chartData);
        }
        return chart;
    };
    /**
     * @private
     */
    ChartCategory.prototype.destroy = function () {
        this.categoryXName = undefined;
        this.chartData = [];
    };
    return ChartCategory;
}());
export { ChartCategory };
/**
 * @private
 */
var ChartData = /** @class */ (function () {
    function ChartData() {
    }
    Object.defineProperty(ChartData.prototype, "yAxisValue", {
        /**
         * @private
         */
        get: function () {
            return this.yValue;
        },
        /**
         * @private
         */
        set: function (value) {
            this.yValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartData.prototype, "xAxisValue", {
        /**
         * @private
         */
        get: function () {
            return this.xValue;
        },
        /**
         * @private
         */
        set: function (value) {
            this.xValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartData.prototype, "bubbleSize", {
        /**
         * @private
         */
        get: function () {
            return this.size;
        },
        /**
         * @private
         */
        set: function (value) {
            this.size = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ChartData.prototype.clone = function () {
        var chart = new ChartData();
        chart.yValue = this.yValue;
        chart.xValue = this.xValue;
        chart.size = this.size;
        return chart;
    };
    /**
     * @private
     */
    ChartData.prototype.destroy = function () {
        this.xValue = undefined;
        this.yValue = undefined;
        this.size = undefined;
    };
    return ChartData;
}());
export { ChartData };
/**
 * @private
 */
var ChartLegend = /** @class */ (function () {
    /**
     * @private
     */
    function ChartLegend() {
        this.chartTitleArea = new ChartTitleArea();
    }
    Object.defineProperty(ChartLegend.prototype, "chartLegendPostion", {
        /**
         * @private
         */
        get: function () {
            return this.legendPostion;
        },
        /**
         * @private
         */
        set: function (value) {
            this.legendPostion = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ChartLegend.prototype.clone = function () {
        var chart = new ChartLegend();
        chart.legendPostion = this.legendPostion;
        chart.chartTitleArea = this.chartTitleArea.clone();
        return chart;
    };
    /**
     * @private
     */
    ChartLegend.prototype.destroy = function () {
        this.legendPostion = undefined;
        this.chartTitleArea = undefined;
    };
    return ChartLegend;
}());
export { ChartLegend };
/**
 * @private
 */
var ChartSeries = /** @class */ (function () {
    function ChartSeries() {
        /**
         * @private
         */
        this.chartDataFormat = [];
        /**
         * @private
         */
        this.trendLines = [];
        this.errorBar = new ChartErrorBar();
        this.dataLabels = new ChartDataLabels();
        this.seriesFormat = new ChartSeriesFormat();
    }
    Object.defineProperty(ChartSeries.prototype, "seriesName", {
        /**
         * @private
         */
        get: function () {
            return this.name;
        },
        /**
         * @private
         */
        set: function (value) {
            this.name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartSeries.prototype, "firstSliceAngle", {
        /**
         * @private
         */
        get: function () {
            return this.sliceAngle;
        },
        /**
         * @private
         */
        set: function (value) {
            this.sliceAngle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartSeries.prototype, "doughnutHoleSize", {
        /**
         * @private
         */
        get: function () {
            return this.holeSize;
        },
        /**
         * @private
         */
        set: function (value) {
            this.holeSize = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ChartSeries.prototype.clone = function () {
        var chart = new ChartSeries();
        chart.name = this.name;
        chart.sliceAngle = this.sliceAngle;
        chart.holeSize = this.holeSize;
        chart.errorBar = this.errorBar.clone();
        chart.dataLabels = this.dataLabels.clone();
        chart.seriesFormat = this.seriesFormat.clone();
        for (var i = 0; i < this.chartDataFormat.length; i++) {
            var format = (this.chartDataFormat[i].clone());
            chart.chartDataFormat.push(format);
        }
        for (var i = 0; i < this.trendLines.length; i++) {
            var trendLine = (this.trendLines[i].clone());
            chart.trendLines.push(trendLine);
        }
        return chart;
    };
    /**
     * @private
     */
    ChartSeries.prototype.destroy = function () {
        this.name = undefined;
        this.errorBar = undefined;
        this.trendLines = undefined;
        this.chartDataFormat = [];
    };
    return ChartSeries;
}());
export { ChartSeries };
/**
 * @private
 */
var ChartErrorBar = /** @class */ (function () {
    function ChartErrorBar() {
    }
    Object.defineProperty(ChartErrorBar.prototype, "errorType", {
        /**
         * @private
         */
        get: function () {
            return this.type;
        },
        /**
         * @private
         */
        set: function (value) {
            this.type = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartErrorBar.prototype, "errorDirection", {
        /**
         * @private
         */
        get: function () {
            return this.direction;
        },
        /**
         * @private
         */
        set: function (value) {
            this.direction = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartErrorBar.prototype, "errorEndStyle", {
        /**
         * @private
         */
        get: function () {
            return this.endStyle;
        },
        /**
         * @private
         */
        set: function (value) {
            this.endStyle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartErrorBar.prototype, "numberValue", {
        get: function () {
            return this.errorValue;
        },
        /**
         * @private
         */
        set: function (value) {
            this.errorValue = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ChartErrorBar.prototype.clone = function () {
        var chart = new ChartErrorBar();
        chart.type = this.type;
        chart.errorDirection = this.errorDirection;
        chart.endStyle = this.endStyle;
        chart.errorValue = this.errorValue;
        return chart;
    };
    /**
     * @private
     */
    ChartErrorBar.prototype.destroy = function () {
        this.type = undefined;
        this.errorDirection = undefined;
        this.endStyle = undefined;
    };
    return ChartErrorBar;
}());
export { ChartErrorBar };
/**
 * @private
 */
var ChartSeriesFormat = /** @class */ (function () {
    function ChartSeriesFormat() {
    }
    Object.defineProperty(ChartSeriesFormat.prototype, "markerStyle", {
        /**
         * @private
         */
        get: function () {
            return this.style;
        },
        /**
         * @private
         */
        set: function (value) {
            this.style = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartSeriesFormat.prototype, "markerColor", {
        /**
         * @private
         */
        get: function () {
            return this.color;
        },
        /**
         * @private
         */
        set: function (value) {
            this.color = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartSeriesFormat.prototype, "numberValue", {
        /**
         * @private
         */
        get: function () {
            return this.size;
        },
        /**
         * @private
         */
        set: function (value) {
            this.size = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ChartSeriesFormat.prototype.clone = function () {
        var chart = new ChartSeriesFormat();
        chart.style = this.style;
        chart.color = this.color;
        chart.size = this.size;
        return chart;
    };
    /**
     * @private
     */
    ChartSeriesFormat.prototype.destroy = function () {
        this.style = undefined;
        this.color = undefined;
        this.size = undefined;
    };
    return ChartSeriesFormat;
}());
export { ChartSeriesFormat };
/**
 * @private
 */
var ChartDataLabels = /** @class */ (function () {
    function ChartDataLabels() {
    }
    Object.defineProperty(ChartDataLabels.prototype, "labelPosition", {
        /**
         * @private
         */
        get: function () {
            return this.position;
        },
        /**
         * @private
         */
        set: function (value) {
            this.position = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDataLabels.prototype, "fontName", {
        /**
         * @private
         */
        get: function () {
            return this.name;
        },
        /**
         * @private
         */
        set: function (value) {
            this.name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDataLabels.prototype, "fontColor", {
        /**
         * @private
         */
        get: function () {
            return this.color;
        },
        /**
         * @private
         */
        set: function (value) {
            this.color = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDataLabels.prototype, "fontSize", {
        /**
         * @private
         */
        get: function () {
            return this.size;
        },
        /**
         * @private
         */
        set: function (value) {
            this.size = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDataLabels.prototype, "isLegendKey", {
        /**
         * @private
         */
        get: function () {
            return this.isLegend;
        },
        /**
         * @private
         */
        set: function (value) {
            this.isLegend = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDataLabels.prototype, "isBubbleSize", {
        /**
         * @private
         */
        get: function () {
            return this.isBubble;
        },
        /**
         * @private
         */
        set: function (value) {
            this.isBubble = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDataLabels.prototype, "isCategoryName", {
        /**
         * @private
         */
        get: function () {
            return this.isCategory;
        },
        /**
         * @private
         */
        set: function (value) {
            this.isCategory = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDataLabels.prototype, "isSeriesName", {
        /**
         * @private
         */
        get: function () {
            return this.isSeries;
        },
        /**
         * @private
         */
        set: function (value) {
            this.isSeries = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDataLabels.prototype, "isValue", {
        /**
         * @private
         */
        get: function () {
            return this.isValueEnabled;
        },
        /**
         * @private
         */
        set: function (value) {
            this.isValueEnabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDataLabels.prototype, "isPercentage", {
        /**
         * @private
         */
        get: function () {
            return this.isPercentageEnabled;
        },
        /**
         * @private
         */
        set: function (value) {
            this.isPercentageEnabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDataLabels.prototype, "isLeaderLines", {
        /**
         * @private
         */
        get: function () {
            return this.showLeaderLines;
        },
        /**
         * @private
         */
        set: function (value) {
            this.showLeaderLines = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ChartDataLabels.prototype.clone = function () {
        var chart = new ChartDataLabels();
        chart.position = this.position;
        chart.name = this.name;
        chart.color = this.color;
        chart.size = this.size;
        chart.isBubble = this.isBubble;
        chart.isLegend = this.isLegend;
        chart.isCategory = this.isCategory;
        chart.isSeries = this.isSeries;
        chart.isValueEnabled = this.isValueEnabled;
        chart.isPercentageEnabled = this.isPercentageEnabled;
        chart.showLeaderLines = this.showLeaderLines;
        return chart;
    };
    /**
     * @private
     */
    ChartDataLabels.prototype.destroy = function () {
        this.position = undefined;
    };
    return ChartDataLabels;
}());
export { ChartDataLabels };
/**
 * @private
 */
var ChartTrendLines = /** @class */ (function () {
    function ChartTrendLines() {
    }
    Object.defineProperty(ChartTrendLines.prototype, "trendLineType", {
        /**
         * @private
         */
        get: function () {
            return this.type;
        },
        /**
         * @private
         */
        set: function (value) {
            this.type = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartTrendLines.prototype, "trendLineName", {
        /**
         * @private
         */
        get: function () {
            return this.name;
        },
        /**
         * @private
         */
        set: function (value) {
            this.name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartTrendLines.prototype, "interceptValue", {
        /**
         * @private
         */
        get: function () {
            return this.intercept;
        },
        /**
         * @private
         */
        set: function (value) {
            this.intercept = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartTrendLines.prototype, "forwardValue", {
        /**
         * @private
         */
        get: function () {
            return this.forward;
        },
        /**
         * @private
         */
        set: function (value) {
            this.forward = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartTrendLines.prototype, "backwardValue", {
        /**
         * @private
         */
        get: function () {
            return this.backward;
        },
        /**
         * @private
         */
        set: function (value) {
            this.backward = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartTrendLines.prototype, "isDisplayRSquared", {
        /**
         * @private
         */
        get: function () {
            return this.displayRSquared;
        },
        /**
         * @private
         */
        set: function (value) {
            this.displayRSquared = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartTrendLines.prototype, "isDisplayEquation", {
        /**
         * @private
         */
        get: function () {
            return this.displayEquation;
        },
        /**
         * @private
         */
        set: function (value) {
            this.displayEquation = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ChartTrendLines.prototype.clone = function () {
        var chart = new ChartTrendLines();
        chart.type = this.type;
        chart.name = this.name;
        chart.forward = this.forward;
        chart.backward = this.backward;
        chart.intercept = this.intercept;
        chart.displayEquation = this.displayEquation;
        chart.displayRSquared = this.displayRSquared;
        return chart;
    };
    /**
     * @private
     */
    ChartTrendLines.prototype.destroy = function () {
        this.type = undefined;
        this.name = undefined;
        this.forward = undefined;
        this.backward = undefined;
    };
    return ChartTrendLines;
}());
export { ChartTrendLines };
/**
 * @private
 */
var ChartTitleArea = /** @class */ (function () {
    /**
     * @private
     */
    function ChartTitleArea() {
        this.dataFormat = new ChartDataFormat();
        this.layout = new ChartLayout();
    }
    Object.defineProperty(ChartTitleArea.prototype, "chartfontName", {
        /**
         * @private
         */
        get: function () {
            return this.fontName;
        },
        /**
         * @private
         */
        set: function (value) {
            this.fontName = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartTitleArea.prototype, "chartFontSize", {
        /**
         * @private
         */
        get: function () {
            return this.fontSize;
        },
        /**
         * @private
         */
        set: function (value) {
            this.fontSize = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ChartTitleArea.prototype.clone = function () {
        var chart = new ChartTitleArea();
        chart.fontName = this.fontName;
        chart.fontSize = this.fontSize;
        chart.dataFormat = this.dataFormat.clone();
        chart.layout = this.layout.clone();
        return chart;
    };
    /**
     * @private
     */
    ChartTitleArea.prototype.destroy = function () {
        this.fontName = undefined;
        this.fontSize = undefined;
        this.dataFormat = undefined;
        this.layout = undefined;
    };
    return ChartTitleArea;
}());
export { ChartTitleArea };
/**
 * @private
 */
var ChartDataFormat = /** @class */ (function () {
    /**
     * @private
     */
    function ChartDataFormat() {
        this.fill = new ChartFill();
        this.line = new ChartFill();
    }
    /**
     * @private
     */
    ChartDataFormat.prototype.clone = function () {
        var chart = new ChartDataFormat();
        chart.fill = this.fill.clone();
        chart.line = this.line.clone();
        return chart;
    };
    /**
     * @private
     */
    ChartDataFormat.prototype.destroy = function () {
        this.fill = undefined;
        this.line = undefined;
    };
    return ChartDataFormat;
}());
export { ChartDataFormat };
/**
 * @private
 */
var ChartFill = /** @class */ (function () {
    function ChartFill() {
    }
    Object.defineProperty(ChartFill.prototype, "color", {
        /**
         * @private
         */
        get: function () {
            return this.fillColor;
        },
        /**
         * @private
         */
        set: function (value) {
            this.fillColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartFill.prototype, "rgb", {
        /**
         * @private
         */
        get: function () {
            return this.fillRGB;
        },
        /**
         * @private
         */
        set: function (value) {
            this.fillRGB = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ChartFill.prototype.clone = function () {
        var chart = new ChartFill();
        chart.fillColor = this.fillColor;
        chart.fillRGB = this.fillRGB;
        return chart;
    };
    /**
     * @private
     */
    ChartFill.prototype.destroy = function () {
        this.fillColor = undefined;
        this.fillRGB = undefined;
    };
    return ChartFill;
}());
export { ChartFill };
/**
 * @private
 */
var ChartLayout = /** @class */ (function () {
    function ChartLayout() {
    }
    Object.defineProperty(ChartLayout.prototype, "chartLayoutLeft", {
        /**
         * @private
         */
        get: function () {
            return this.layoutX;
        },
        /**
         * @private
         */
        set: function (value) {
            this.layoutX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartLayout.prototype, "chartLayoutTop", {
        /**
         * @private
         */
        get: function () {
            return this.layoutY;
        },
        /**
         * @private
         */
        set: function (value) {
            this.layoutY = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ChartLayout.prototype.clone = function () {
        var chart = new ChartLayout();
        chart.layoutX = this.layoutX;
        chart.layoutY = this.layoutY;
        return chart;
    };
    /**
     * @private
     */
    ChartLayout.prototype.destroy = function () {
        this.layoutX = undefined;
        this.layoutY = undefined;
    };
    return ChartLayout;
}());
export { ChartLayout };
/**
 * @private
 */
var ChartCategoryAxis = /** @class */ (function () {
    function ChartCategoryAxis() {
        this.chartTitleArea = new ChartTitleArea();
    }
    Object.defineProperty(ChartCategoryAxis.prototype, "majorTick", {
        /**
         * @private
         */
        get: function () {
            return this.majorTickMark;
        },
        /**
         * @private
         */
        set: function (value) {
            this.majorTickMark = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartCategoryAxis.prototype, "minorTick", {
        /**
         * @private
         */
        get: function () {
            return this.minorTickMark;
        },
        /**
         * @private
         */
        set: function (value) {
            this.minorTickMark = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartCategoryAxis.prototype, "tickPosition", {
        /**
         * @private
         */
        get: function () {
            return this.tickLabelPostion;
        },
        /**
         * @private
         */
        set: function (value) {
            this.tickLabelPostion = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartCategoryAxis.prototype, "minorGridLines", {
        /**
         * @private
         */
        get: function () {
            return this.hasMinorGridLines;
        },
        /**
         * @private
         */
        set: function (value) {
            this.hasMinorGridLines = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartCategoryAxis.prototype, "majorGridLines", {
        /**
         * @private
         */
        get: function () {
            return this.hasMajorGridLines;
        },
        /**
         * @private
         */
        set: function (value) {
            this.hasMajorGridLines = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartCategoryAxis.prototype, "interval", {
        /**
         * @private
         */
        get: function () {
            return this.majorUnit;
        },
        /**
         * @private
         */
        set: function (value) {
            this.majorUnit = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartCategoryAxis.prototype, "max", {
        /**
         * @private
         */
        get: function () {
            return this.maximumValue;
        },
        /**
         * @private
         */
        set: function (value) {
            this.maximumValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartCategoryAxis.prototype, "min", {
        /**
         * @private
         */
        get: function () {
            return this.minimumValue;
        },
        /**
         * @private
         */
        set: function (value) {
            this.minimumValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartCategoryAxis.prototype, "categoryAxisTitle", {
        /**
         * @private
         */
        get: function () {
            return this.title;
        },
        /**
         * @private
         */
        set: function (value) {
            this.title = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartCategoryAxis.prototype, "categoryAxisType", {
        /**
         * @private
         */
        get: function () {
            return this.categoryType;
        },
        /**
         * @private
         */
        set: function (value) {
            this.categoryType = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartCategoryAxis.prototype, "categoryNumberFormat", {
        /**
         * @private
         */
        get: function () {
            return this.numberFormat;
        },
        /**
         * @private
         */
        set: function (value) {
            this.numberFormat = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartCategoryAxis.prototype, "axisFontSize", {
        /**
         * @private
         */
        get: function () {
            return this.fontSize;
        },
        /**
         * @private
         */
        set: function (value) {
            this.fontSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartCategoryAxis.prototype, "axisFontName", {
        /**
         * @private
         */
        get: function () {
            return this.fontName;
        },
        /**
         * @private
         */
        set: function (value) {
            this.fontName = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ChartCategoryAxis.prototype.clone = function () {
        var chart = new ChartCategoryAxis();
        chart.title = this.title;
        chart.categoryType = this.categoryType;
        chart.numberFormat = this.numberFormat;
        chart.fontSize = this.fontSize;
        chart.fontName = this.fontName;
        chart.hasMajorGridLines = this.hasMajorGridLines;
        chart.hasMinorGridLines = this.hasMinorGridLines;
        chart.minimumValue = this.minimumValue;
        chart.maximumValue = this.maximumValue;
        chart.majorUnit = this.majorUnit;
        chart.majorTickMark = this.majorTickMark;
        chart.minorTickMark = this.minorTickMark;
        chart.tickLabelPostion = this.tickLabelPostion;
        chart.chartTitleArea = this.chartTitleArea.clone();
        return chart;
    };
    /**
     * @private
     */
    ChartCategoryAxis.prototype.destroy = function () {
        this.title = undefined;
        this.categoryType = undefined;
        this.numberFormat = undefined;
        this.chartTitleArea = undefined;
        this.minimumValue = undefined;
        this.maximumValue = undefined;
        this.fontSize = undefined;
        this.fontName = undefined;
        this.majorUnit = undefined;
        this.majorTickMark = undefined;
        this.minorTickMark = undefined;
        this.tickLabelPostion = undefined;
    };
    return ChartCategoryAxis;
}());
export { ChartCategoryAxis };
/**
 * @private
 */
var ChartDataTable = /** @class */ (function () {
    function ChartDataTable() {
    }
    Object.defineProperty(ChartDataTable.prototype, "showSeriesKeys", {
        /**
         * @private
         */
        get: function () {
            return this.isSeriesKeys;
        },
        /**
         * @private
         */
        set: function (value) {
            this.isSeriesKeys = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDataTable.prototype, "hasHorzBorder", {
        /**
         * @private
         */
        get: function () {
            return this.isHorzBorder;
        },
        /**
         * @private
         */
        set: function (value) {
            this.isHorzBorder = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDataTable.prototype, "hasVertBorder", {
        /**
         * @private
         */
        get: function () {
            return this.isVertBorder;
        },
        /**
         * @private
         */
        set: function (value) {
            this.isVertBorder = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDataTable.prototype, "hasBorders", {
        /**
         * @private
         */
        get: function () {
            return this.isBorders;
        },
        /**
         * @private
         */
        set: function (value) {
            this.isBorders = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ChartDataTable.prototype.clone = function () {
        var chart = new ChartDataTable();
        chart.isSeriesKeys = this.isSeriesKeys;
        chart.isHorzBorder = this.isHorzBorder;
        chart.isVertBorder = this.isVertBorder;
        chart.isBorders = this.isBorders;
        return chart;
    };
    /**
     * @private
     */
    ChartDataTable.prototype.destroy = function () {
        this.isSeriesKeys = undefined;
        this.isHorzBorder = undefined;
        this.isVertBorder = undefined;
        this.isBorders = undefined;
    };
    return ChartDataTable;
}());
export { ChartDataTable };
/**
 * @private
 */
var CommentCharacterElementBox = /** @class */ (function (_super) {
    __extends(CommentCharacterElementBox, _super);
    function CommentCharacterElementBox(type) {
        var _this = _super.call(this) || this;
        _this.commentType = 0;
        _this.commentId = '';
        _this.commentType = type;
        return _this;
    }
    Object.defineProperty(CommentCharacterElementBox.prototype, "comment", {
        get: function () {
            return this.commentInternal;
        },
        set: function (value) {
            this.commentInternal = value;
        },
        enumerable: true,
        configurable: true
    });
    CommentCharacterElementBox.prototype.getLength = function () {
        return 1;
    };
    CommentCharacterElementBox.prototype.clone = function () {
        var comment = new CommentCharacterElementBox(this.commentType);
        comment.commentId = this.commentId;
        comment.commentType = this.commentType;
        return comment;
    };
    CommentCharacterElementBox.prototype.renderCommentMark = function () {
        if (this.commentType === 0 && isNullOrUndefined(this.commentMark)) {
            this.commentMark = document.createElement('div');
            this.commentMark.style.display = 'none';
            this.commentMark.classList.add('e-de-cmt-mark');
            var span = document.createElement('span');
            span.classList.add('e-icons');
            span.classList.add('e-de-cmt-mark-icon');
            this.commentMark.appendChild(span);
        }
        if (this.line && isNullOrUndefined(this.commentMark.parentElement)) {
            var documentHelper = this.line.paragraph.bodyWidget.page.documentHelper;
            documentHelper.pageContainer.appendChild(this.commentMark);
            this.commentMark.addEventListener('click', this.selectComment.bind(this));
        }
    };
    CommentCharacterElementBox.prototype.selectComment = function () {
        var documentHelper = this.line.paragraph.bodyWidget.page.documentHelper;
        if (documentHelper.owner) {
            if (!documentHelper.owner.commentReviewPane.commentPane.isEditMode) {
                documentHelper.selectComment(this.comment);
            }
            else {
                documentHelper.owner.showComments = true;
            }
        }
    };
    CommentCharacterElementBox.prototype.removeCommentMark = function () {
        if (this.commentMark && this.commentMark.parentElement) {
            this.commentMark.removeEventListener('click', this.selectComment.bind(this));
            this.commentMark.parentElement.removeChild(this.commentMark);
        }
    };
    CommentCharacterElementBox.prototype.destroy = function () {
        if (this.commentMark) {
            this.removeCommentMark();
        }
    };
    return CommentCharacterElementBox;
}(ElementBox));
export { CommentCharacterElementBox };
/**
 * @private
 */
var CommentElementBox = /** @class */ (function (_super) {
    __extends(CommentElementBox, _super);
    function CommentElementBox(date) {
        var _this = _super.call(this, 0) || this;
        _this.authorIn = '';
        _this.initialIn = '';
        _this.done = false;
        _this.textIn = '';
        _this.isReply = false;
        _this.ownerComment = undefined;
        _this.createdDate = date;
        _this.replyComments = [];
        return _this;
    }
    Object.defineProperty(CommentElementBox.prototype, "commentStart", {
        get: function () {
            return this.commentStartIn;
        },
        set: function (value) {
            this.commentStartIn = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommentElementBox.prototype, "commentEnd", {
        get: function () {
            return this.commentEndIn;
        },
        set: function (value) {
            this.commentEndIn = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommentElementBox.prototype, "author", {
        get: function () {
            return this.authorIn;
        },
        set: function (value) {
            this.authorIn = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommentElementBox.prototype, "initial", {
        get: function () {
            return this.initialIn;
        },
        set: function (value) {
            this.initialIn = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommentElementBox.prototype, "isResolved", {
        get: function () {
            return this.done;
        },
        set: function (value) {
            this.done = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommentElementBox.prototype, "date", {
        get: function () {
            return this.createdDate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommentElementBox.prototype, "text", {
        get: function () {
            return this.textIn;
        },
        set: function (value) {
            this.textIn = value;
        },
        enumerable: true,
        configurable: true
    });
    CommentElementBox.prototype.getLength = function () {
        return 1;
    };
    CommentElementBox.prototype.clone = function () {
        var comment = new CommentElementBox(this.date);
        comment.author = this.author;
        comment.initial = this.initial;
        comment.commentId = this.commentId;
        comment.replyComments = this.replyComments;
        comment.isResolved = this.isResolved;
        comment.text = this.text;
        return comment;
    };
    CommentElementBox.prototype.destroy = function () {
        this.ownerComment = undefined;
    };
    return CommentElementBox;
}(CommentCharacterElementBox));
export { CommentElementBox };
/**
 * @private
 */
var Page = /** @class */ (function () {
    /**
     * Initialize the constructor of Page
     */
    function Page(documentHelper) {
        /**
         * Specifies the Bonding Rectangle
         * @private
         */
        this.boundingRectangle = new Rect(96, 96, 816, 1056);
        /**
         * @private
         */
        this.repeatHeaderRowTableWidget = false;
        /**
         * Specifies the bodyWidgets
         * @default []
         * @private
         */
        this.bodyWidgets = [];
        /**
         * @private
         */
        this.headerWidget = undefined;
        /**
         * @private
         */
        this.footerWidget = undefined;
        /**
         * @private
         */
        this.footnoteWidget = undefined;
        /**
         * @private
         */
        this.endnoteWidget = undefined;
        /**
         * @private
         */
        this.currentPageNum = 0;
        /**
         *
         */
        this.allowNextPageRendering = true;
        this.documentHelper = documentHelper;
        // let text: string = 'DocumentEditor';
    }
    Object.defineProperty(Page.prototype, "index", {
        /**
         * @private
         */
        get: function () {
            if (this.documentHelper) {
                return this.documentHelper.pages.indexOf(this);
            }
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, "previousPage", {
        /**
         * @private
         */
        get: function () {
            var index = this.index;
            if (index > 0) {
                return this.documentHelper.pages[index - 1];
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, "nextPage", {
        /**
         * @private
         */
        get: function () {
            var index = this.index;
            if (index < this.documentHelper.pages.length - 1) {
                return this.documentHelper.pages[index + 1];
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, "sectionIndex", {
        /**
         * @private
         */
        get: function () {
            if (this.bodyWidgets.length > 0) {
                return this.bodyWidgets[0].index;
            }
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, "viewer", {
        get: function () {
            return this.documentHelper.owner.viewer;
        },
        enumerable: true,
        configurable: true
    });
    Page.prototype.destroy = function () {
        if (this.headerWidget) {
            if (this.viewer && this.documentHelper.owner.editor) {
                this.documentHelper.owner.editor.removeFieldInWidget(this.headerWidget);
            }
            this.headerWidget.destroy();
        }
        this.headerWidget = undefined;
        if (this.footerWidget) {
            if (this.viewer && this.documentHelper.owner.editor) {
                this.documentHelper.owner.editor.removeFieldInWidget(this.footerWidget);
            }
            this.footerWidget.destroy();
        }
        this.footerWidget = undefined;
        this.bodyWidgets = [];
        this.bodyWidgets = undefined;
        if (!isNullOrUndefined(this.documentHelper)) {
            if (!isNullOrUndefined(this.documentHelper.pages)) {
                this.documentHelper.removePage(this);
            }
        }
        this.documentHelper = undefined;
    };
    return Page;
}());
export { Page };
/**
 * @private
 */
var WTableHolder = /** @class */ (function () {
    function WTableHolder() {
        this.tableColumns = [];
        /**
         * @private
         */
        this.tableWidth = 0;
    }
    Object.defineProperty(WTableHolder.prototype, "columns", {
        get: function () {
            return this.tableColumns;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    WTableHolder.prototype.resetColumns = function () {
        for (var i = 0; i < this.tableColumns.length; i++) {
            this.tableColumns[i].destroy();
        }
        this.tableColumns = [];
    };
    /**
     * @private
     */
    WTableHolder.prototype.getPreviousSpannedCellWidth = function (previousColumnIndex, curColumnIndex) {
        var width = 0;
        for (var i = previousColumnIndex; i < curColumnIndex; i++) {
            width += this.tableColumns[i].preferredWidth;
        }
        return width;
    };
    /**
     * @private
     */
    WTableHolder.prototype.addColumns = function (currentColumnIndex, columnSpan, width, sizeInfo, offset) {
        for (var i = this.columns.length; i < columnSpan; i++) {
            this.columns.push(new WColumn());
        }
        var availableWidth = 0;
        for (var j = currentColumnIndex; j < columnSpan; j++) {
            availableWidth += this.columns[j].preferredWidth;
        }
        // If width to add is greater than preferred width, then preferred width will be increased.
        // In case of Grid span > 1, only last grid column width will be updated.
        var gridSpan = columnSpan - currentColumnIndex;
        if (!(gridSpan > 1) && availableWidth < width) {
            this.columns[columnSpan - 1].preferredWidth += (width - availableWidth);
        }
        if (sizeInfo.minimumWordWidth > this.columns[columnSpan - 1].minimumWordWidth) {
            this.columns[columnSpan - 1].minimumWordWidth = sizeInfo.minimumWordWidth;
        }
        if (sizeInfo.maximumWordWidth > this.columns[columnSpan - 1].maximumWordWidth) {
            this.columns[columnSpan - 1].maximumWordWidth = sizeInfo.maximumWordWidth;
        }
        if (sizeInfo.minimumWidth > this.columns[columnSpan - 1].minimumWidth) {
            this.columns[columnSpan - 1].minimumWidth = sizeInfo.minimumWidth;
        }
        if (offset > this.columns[columnSpan - 1].endOffset) {
            this.columns[columnSpan - 1].endOffset = offset;
        }
    };
    /**
     * @private
     */
    WTableHolder.prototype.getTotalWidth = function (type) {
        var width = 0;
        for (var i = 0; i < this.columns.length; i++) {
            var column = this.columns[i];
            width += type === 0 ? column.preferredWidth :
                type === 1 ? column.minimumWordWidth :
                    type === 2 ? column.maximumWordWidth : column.minimumWidth;
        }
        return width;
    };
    /**
     * @private
     */
    WTableHolder.prototype.isFitColumns = function (containerWidth, preferredTableWidth, isAutoWidth) {
        // Gets total preferred width.
        var totalColumnWidth = this.getTotalWidth(0);
        // If auto table width, based on total column widths, minimum value will be updated.
        if (isAutoWidth) {
            this.tableWidth = preferredTableWidth > totalColumnWidth ? totalColumnWidth : preferredTableWidth;
        }
        else {
            this.tableWidth = preferredTableWidth;
        }
        // If total columns width doesn't match table width, then all grid column widths will be updated by even factor.
        // If totalColumnWidth < TableWidth, all grid columns are enlarged. Otherwise shrinked.
        if (totalColumnWidth !== this.tableWidth) {
            var factor = this.tableWidth / totalColumnWidth;
            factor = isNaN(factor) || factor === Infinity ? 1 : factor;
            for (var i = 0; i < this.columns.length; i++) {
                var column = this.columns[i];
                //column.PreferredWidth = factor * column.PreferredWidth;
                if (factor * column.preferredWidth < column.minWidth) {
                    return false;
                }
            }
            return true;
        }
        else {
            return true;
        }
    };
    /**
     * @private
     */
    WTableHolder.prototype.autoFitColumn = function (containerWidth, preferredTableWidth, isAuto, isNestedTable) {
        // Cell's preferred width should be considered until the table width fits to the container width.
        var maxTotal = 0;
        var minTotal = 0;
        // For preferred width set as 0 pixels (not auto), then minimum word width only need to be considered.
        // But currently there is no way to find any one of cell in particular column has 0 px preferred width set.
        // If all columns are set as 0 pixels, then this will work.
        var remainingWidthTotal = 0;
        for (var i = 0; i < this.columns.length; i++) {
            var column = this.columns[i];
            // If preferred width of column is less than column minimum width and also column is empty, considered column preferred width
            if (column.minimumWordWidth === 0 && column.maximumWordWidth === 0 && column.minWidth === 0) {
                column.minimumWordWidth = column.preferredWidth;
                column.maximumWordWidth = column.preferredWidth;
                column.minWidth = column.preferredWidth;
            }
            maxTotal += column.preferredWidth > column.maximumWordWidth ? column.preferredWidth : column.maximumWordWidth;
            minTotal += column.preferredWidth > column.minimumWordWidth ? column.preferredWidth : column.minimumWordWidth;
            // tslint:disable-next-line:max-line-length
            var preferred = column.preferredWidth === 0 ? column.minimumWordWidth : column.preferredWidth > column.minimumWordWidth ? column.preferredWidth : column.minimumWordWidth;
            var difference = column.maximumWordWidth - preferred;
            remainingWidthTotal += difference > 0 ? difference : 0;
        }
        // Try to fit maximum word width to match preferredTableWidth.
        if (maxTotal <= preferredTableWidth) {
            for (var i = 0; i < this.columns.length; i++) {
                var column = this.columns[i];
                if (column.preferredWidth < column.maximumWordWidth) {
                    if (isNestedTable) {
                        column.preferredWidth = column.minimumWidth + column.minimumWordWidth;
                    }
                    else {
                        column.preferredWidth = column.maximumWordWidth;
                    }
                }
            }
            // If the width is defined for table(cells undefined) then fit the columns to preferred table width using FitColumns.
            if (!isAuto) {
                this.fitColumns(containerWidth, preferredTableWidth, isAuto);
            }
        }
        else {
            // If the table preferred table width is set, then check its greater than total minimum word width. 
            // tslint:disable-next-line:max-line-length
            // If yes then set table preferred table width as container width. Else, check whether the total minimum word width is less than container width.
            // If yes, then set total minimum word width as container width. Else, set the container width to container width.
            if (!isAuto) {
                //let totalMinimumWordWidth: number = this.getTotalWidth(1);
                //if (preferredTableWidth > totalMinimumWordWidth && totalMinimumWordWidth < containerWidth) {
                this.fitColumns(containerWidth, preferredTableWidth, isAuto);
                return;
                //}
                // tslint:disable-next-line:max-line-length
                //containerWidth = preferredTableWidth < totalMinimumWordWidth ? totalMinimumWordWidth < containerWidth ? totalMinimumWordWidth : containerWidth : preferredTableWidth;
            }
            // Try to fit minimum word width to match preferredTableWidth or containerWidth.
            if (minTotal <= preferredTableWidth || minTotal <= containerWidth) {
                var availableWidth = containerWidth > preferredTableWidth ? containerWidth : preferredTableWidth;
                availableWidth = availableWidth - minTotal;
                for (var i = 0; i < this.columns.length; i++) {
                    var column = this.columns[i];
                    if (column.preferredWidth === 0) {
                        column.preferredWidth = column.minimumWordWidth;
                    }
                    else {
                        if (column.preferredWidth < column.minimumWordWidth) {
                            column.preferredWidth = column.minimumWordWidth;
                        }
                        if (!isNestedTable) {
                            var difference = column.maximumWordWidth - column.preferredWidth;
                            difference = difference > 0 ? difference : 0;
                            var factor = availableWidth * (difference / remainingWidthTotal);
                            column.preferredWidth += isNaN(factor) ? 0 : factor;
                        }
                    }
                }
            }
            else {
                // Try to fit minimum width for each column and allot remaining space to columns based on their minimum word width.
                var totalMinimumWordWidth = this.getTotalWidth(1);
                var totalMinWidth = this.getTotalWidth(3);
                var totalPreferredWidth = this.getTotalWidth(0);
                if (totalMinWidth > 2112) {
                    var cellWidth = 2112 / this.columns.length;
                    for (var i = 0; i < this.columns.length; i++) {
                        this.columns[i].preferredWidth = cellWidth;
                    }
                }
                else {
                    var availableWidth = 0;
                    if (totalMinWidth < containerWidth) {
                        availableWidth = containerWidth - totalMinWidth;
                        for (var i = 0; i < this.columns.length; i++) {
                            var column = this.columns[i];
                            // The factor depends of current column's minimum word width and total minimum word width.
                            var factor = availableWidth * column.minimumWordWidth / totalMinimumWordWidth;
                            factor = isNaN(factor) ? 0 : factor;
                            if (column.preferredWidth <= column.minimumWidth) {
                                continue;
                            }
                            column.preferredWidth = column.minimumWidth + factor;
                        }
                        // table width exceeds container width
                    }
                    else if (totalPreferredWidth > containerWidth) {
                        var factor = containerWidth / totalPreferredWidth;
                        for (var i = 0; i < this.columns.length; i++) {
                            var column = this.columns[i];
                            column.preferredWidth = column.preferredWidth * factor;
                        }
                    }
                }
            }
        }
        this.tableWidth = this.getTotalWidth(0);
    };
    /**
     * @private
     */
    WTableHolder.prototype.fitColumns = function (containerWidth, preferredTableWidth, isAutoWidth, indent) {
        if (isNullOrUndefined(indent)) {
            indent = 0;
        }
        // Gets total preferred width.
        var totalColumnWidth = this.getTotalWidth(0);
        // Neglected left indent value, because in preferred table width left indent value is neglected
        if (isAutoWidth) {
            totalColumnWidth -= indent;
        }
        // If auto table width, based on total column widths, minimum value will be updated.
        if (isAutoWidth) {
            this.tableWidth = preferredTableWidth > totalColumnWidth ? totalColumnWidth : preferredTableWidth;
        }
        else {
            this.tableWidth = preferredTableWidth;
        }
        // If total columns width doesn't match table width, then all grid column widths will be updated by even factor.
        // If totalColumnWidth < TableWidth, all grid columns are enlarged. Otherwise shrinked.
        if (totalColumnWidth !== this.tableWidth) {
            var factor = this.tableWidth / totalColumnWidth;
            factor = isNaN(factor) || factor === Infinity ? 1 : factor;
            for (var i = 0; i < this.columns.length; i++) {
                var column = this.columns[i];
                column.preferredWidth = factor * column.preferredWidth;
            }
        }
    };
    /**
     * @private
     */
    WTableHolder.prototype.getCellWidth = function (columnIndex, columnSpan, preferredTableWidth) {
        var width = 0;
        for (var i = 0; i < columnSpan; i++) {
            width += this.tableColumns[i + columnIndex].preferredWidth;
        }
        return width;
    };
    /**
     * @private
     */
    WTableHolder.prototype.validateColumnWidths = function () {
        for (var i = 0; i < this.columns.length; i++) {
            if (i === 0) {
                if (this.columns[i].preferredWidth !== this.columns[i].endOffset) {
                    this.columns[i].preferredWidth = this.columns[i].endOffset;
                }
            }
            else {
                // If Previous column offset + current column preferred width is less than current column offset, 
                // Then current column preferred width is set to current column offset - previous column offset.
                if (this.columns[i - 1].endOffset + this.columns[i].preferredWidth < this.columns[i].endOffset) {
                    this.columns[i].preferredWidth = this.columns[i].endOffset - this.columns[i - 1].endOffset;
                }
            }
        }
    };
    /**
     * @private
     */
    WTableHolder.prototype.clone = function () {
        var tableHolder = new WTableHolder();
        tableHolder.tableWidth = this.tableWidth;
        for (var i = 0; i < this.columns.length; i++) {
            tableHolder.columns.push(this.columns[i].clone());
        }
        return tableHolder;
    };
    /**
     * @private
     */
    WTableHolder.prototype.destroy = function () {
        if (!isNullOrUndefined(this.tableColumns)) {
            for (var i = 0; i < this.tableColumns.length; i++) {
                var column = this.tableColumns[i];
                column.destroy();
            }
        }
        this.tableColumns = [];
        this.tableColumns = undefined;
        this.tableWidth = undefined;
    };
    return WTableHolder;
}());
export { WTableHolder };
/**
 * @private
 */
var WColumn = /** @class */ (function () {
    function WColumn() {
        /**
         * @private
         */
        this.preferredWidth = 0;
        /**
         * @private
         */
        this.minWidth = 0;
        /**
         * @private
         */
        this.maxWidth = 0;
        /**
         * @private
         */
        this.endOffset = 0;
        /**
         * @private
         */
        this.minimumWordWidth = 0;
        /**
         * @private
         */
        this.maximumWordWidth = 0;
        /**
         * @private
         */
        this.minimumWidth = 0;
    }
    /**
     * @private
     */
    WColumn.prototype.clone = function () {
        var column = new WColumn();
        column.preferredWidth = this.preferredWidth;
        column.minWidth = this.minWidth;
        column.maxWidth = this.maxWidth;
        return column;
    };
    /**
     * @private
     */
    WColumn.prototype.destroy = function () {
        this.preferredWidth = undefined;
        this.minWidth = undefined;
        this.maxWidth = undefined;
    };
    return WColumn;
}());
export { WColumn };
/**
 * @private
 */
var ColumnSizeInfo = /** @class */ (function () {
    function ColumnSizeInfo() {
        /**
         * @private
         */
        this.minimumWordWidth = 0;
        /**
         * @private
         */
        this.maximumWordWidth = 0;
        /**
         * @private
         */
        this.minimumWidth = 0;
        /**
         * @private
         */
        this.hasMinimumWidth = false;
        /**
         * @private
         */
        this.hasMinimumWordWidth = false;
        /**
         * @private
         */
        this.hasMaximumWordWidth = false;
    }
    return ColumnSizeInfo;
}());
export { ColumnSizeInfo };
