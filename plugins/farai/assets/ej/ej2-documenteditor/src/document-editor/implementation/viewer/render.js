import { isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { Rect, ImageElementBox, ParagraphWidget, TextElementBox, ListTextElementBox, TableRowWidget, TableWidget, TableCellWidget, FieldElementBox, TabElementBox, BlockWidget, CommentCharacterElementBox, ShapeElementBox, EditRangeStartElementBox } from './page';
import { Layout } from './layout';
import { PageLayoutViewer, WebLayoutViewer } from './viewer';
// tslint:disable-next-line:max-line-length
import { HelperMethods, Point } from '../editor/editor-helper';
/**
 * @private
 */
var Renderer = /** @class */ (function () {
    function Renderer(documentHelper) {
        this.isPrinting = false;
        this.pageLeft = 0;
        this.pageTop = 0;
        this.pageIndex = -1;
        this.isFieldCode = false;
        this.leftPosition = 0;
        this.topPosition = 0;
        this.height = 0;
        this.documentHelper = documentHelper;
    }
    Object.defineProperty(Renderer.prototype, "pageCanvas", {
        /**
         * Gets page canvas.
         * @private
         */
        get: function () {
            if (this.isPrinting) {
                if (isNullOrUndefined(this.pageCanvasIn)) {
                    this.pageCanvasIn = document.createElement('canvas');
                    this.pageCanvasIn.getContext('2d').save();
                }
                return this.pageCanvasIn;
            }
            return isNullOrUndefined(this.viewer) ? undefined : this.documentHelper.containerCanvas;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "spellChecker", {
        /**
         * Gets the spell checker
         * @private
         */
        get: function () {
            return this.documentHelper.owner.spellChecker;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "selectionCanvas", {
        /**
         * Gets selection canvas.
         */
        get: function () {
            return isNullOrUndefined(this.viewer) ? undefined : this.documentHelper.selectionCanvas;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "pageContext", {
        /**
         * Gets page context.
         */
        get: function () {
            return this.pageCanvas.getContext('2d');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "selectionContext", {
        /**
         * Gets selection context.
         */
        get: function () {
            return this.selectionCanvas.getContext('2d');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderer.prototype, "viewer", {
        get: function () {
            return this.documentHelper.owner.viewer;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Renders widgets.
     * @param {Page} page
     * @param {number} left
     * @param {number} top
     * @param {number} width
     * @param {number} height
     * @private
     */
    Renderer.prototype.renderWidgets = function (page, left, top, width, height) {
        if (isNullOrUndefined(this.pageCanvas) || isNullOrUndefined(page)) {
            return;
        }
        this.pageContext.fillStyle = HelperMethods.getColor(this.documentHelper.backgroundColor);
        this.pageContext.beginPath();
        if (this.viewer instanceof WebLayoutViewer) {
            height = height > this.documentHelper.visibleBounds.height ? height : this.documentHelper.visibleBounds.height;
            var marginTop = top;
            if (page.index === 0) {
                marginTop = top - this.viewer.padding.top;
            }
            // tslint:disable-next-line:max-line-length
            this.pageContext.fillRect(left - this.viewer.padding.left, marginTop, width + this.viewer.padding.left, height + this.viewer.padding.top);
        }
        else {
            this.pageContext.fillRect(left, top, width, height);
        }
        this.pageContext.closePath();
        if (this.viewer instanceof PageLayoutViewer) {
            this.pageContext.strokeStyle = this.documentHelper.owner.pageOutline;
            this.pageContext.strokeRect(left, top, width, height);
        }
        this.pageLeft = left;
        this.pageTop = top;
        this.pageIndex = page.index;
        if (this.isPrinting) {
            this.setPageSize(page);
        }
        else {
            this.pageContext.beginPath();
            this.pageContext.save();
            this.pageContext.rect(left, top, width, height);
            this.pageContext.clip();
        }
        this.height = height;
        if (page.headerWidget) {
            this.renderHFWidgets(page, page.headerWidget, width, true);
        }
        if (page.footerWidget) {
            this.renderHFWidgets(page, page.footerWidget, width, false);
        }
        for (var i = 0; i < page.bodyWidgets.length; i++) {
            this.render(page, page.bodyWidgets[i]);
            if (page.footnoteWidget) {
                this.renderfootNoteWidget(page, page.footnoteWidget);
            }
        }
        if (page.endnoteWidget) {
            this.renderfootNoteWidget(page, page.endnoteWidget);
        }
        if (this.documentHelper.owner.enableHeaderAndFooter && !this.isPrinting) {
            this.renderHeaderSeparator(page, this.pageLeft, this.pageTop, page.headerWidget);
        }
        this.pageLeft = 0;
        this.pageTop = 0;
        this.pageContext.restore();
    };
    /**
     * Sets page size.
     * @param {Page} page
     */
    Renderer.prototype.setPageSize = function (page) {
        this.pageContext.clearRect(0, 0, this.pageCanvas.width, this.pageCanvas.height);
        this.selectionContext.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
        this.pageContext.restore();
        this.selectionContext.restore();
        var width = page.boundingRectangle.width;
        var height = page.boundingRectangle.height;
        var dpr = Math.max(1, window.devicePixelRatio || 1);
        if (this.pageCanvas.width !== width * dpr || this.pageCanvas.height !== height * dpr) {
            this.pageCanvas.height = height * dpr;
            this.pageCanvas.width = width * dpr;
            this.pageCanvas.style.height = height + 'px';
            this.pageCanvas.style.width = width + 'px';
            this.pageContext.globalAlpha = 1;
            this.pageContext.scale(dpr, dpr);
        }
    };
    /**
     * Renders header footer widget.
     * @param {Page} page
     * @param {HeaderFooterWidget} headFootWidget
     */
    Renderer.prototype.renderHFWidgets = function (page, widget, width, isHeader) {
        if (!this.isPrinting) {
            this.pageContext.globalAlpha = this.documentHelper.owner.enableHeaderAndFooter ? 1 : 0.65;
        }
        var cliped = false;
        var height = 0;
        var pageHt = 0;
        var headerFooterHeight = page.boundingRectangle.height / 100 * 40;
        if (isHeader) {
            var topMargin = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.topMargin);
            var widgetHeight = Math.max((widget.y + widget.height), topMargin);
            if (widgetHeight > headerFooterHeight) {
                cliped = true;
                this.pageContext.beginPath();
                this.pageContext.save();
                this.pageContext.rect(this.pageLeft, this.pageTop, width, this.getScaledValue(headerFooterHeight));
                this.pageContext.clip();
            }
        }
        else {
            var footerDistance = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.footerDistance);
            // tslint:disable-next-line:max-line-length
            var footerHeight = page.boundingRectangle.height -
                Math.max(page.footerWidget.height + footerDistance, HelperMethods.convertPointToPixel(page.footerWidget.sectionFormat.bottomMargin));
            height = Math.max(page.boundingRectangle.height - headerFooterHeight, footerHeight);
            pageHt = page.boundingRectangle.height - footerDistance;
        }
        for (var i = 0; i < widget.childWidgets.length; i++) {
            var block = widget.childWidgets[i];
            if (!isHeader) {
                height += block.height;
            }
            if (isHeader || !isHeader && this.getScaledValue(height) <= this.getScaledValue(pageHt)) {
                this.renderWidget(page, block);
            }
        }
        this.renderFloatingItems(page, widget.floatingElements);
        if (cliped) {
            this.pageContext.restore();
        }
        if (!this.isPrinting) {
            this.pageContext.globalAlpha = this.documentHelper.owner.enableHeaderAndFooter ? 0.65 : 1;
        }
    };
    Renderer.prototype.renderHeaderSeparator = function (page, left, top, widget) {
        //Header Widget
        var topMargin = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.topMargin);
        var y = this.getScaledValue(Math.max((widget.y + widget.height), topMargin));
        var pageWidth = this.getScaledValue(page.boundingRectangle.width);
        var ctx = this.pageContext;
        ctx.save();
        ctx.globalAlpha = 0.65;
        var headerFooterHeight = (this.getScaledValue(page.boundingRectangle.height) / 100) * 40;
        //Maximum header height limit       
        y = Math.min(y, headerFooterHeight);
        //Dash line Separator
        this.renderDashLine(ctx, left, top + y, pageWidth, '#000000', false);
        var type = this.getHeaderFooterType(page, true);
        ctx.font = '9pt Arial';
        var width = ctx.measureText(type).width;
        this.renderHeaderFooterMark(ctx, left + 5, top + y, width + 10, 20);
        this.renderHeaderFooterMarkText(ctx, type, left + 10, y + top + 15);
        if (page.footerWidget) {
            //Footer Widget
            var footerDistance = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.footerDistance);
            // tslint:disable-next-line:max-line-length
            var footerHeight = this.getScaledValue(page.boundingRectangle.height) -
                this.getScaledValue(Math.max(page.footerWidget.height + footerDistance, HelperMethods.convertPointToPixel(page.footerWidget.sectionFormat.bottomMargin)));
            //Maximum footer height limit     
            footerHeight = Math.max((this.getScaledValue(page.boundingRectangle.height) - headerFooterHeight), footerHeight);
            this.renderDashLine(ctx, left, top + footerHeight, pageWidth, '#000000', false);
            type = this.getHeaderFooterType(page, false);
            width = ctx.measureText(type).width;
            this.renderHeaderFooterMark(ctx, left + 5, top + footerHeight - 20, width + 10, 20);
            this.renderHeaderFooterMarkText(ctx, type, left + 10, top + footerHeight - 5);
            ctx.restore();
        }
    };
    Renderer.prototype.getHeaderFooterType = function (page, isHeader) {
        var type;
        type = isHeader ? 'Header' : 'Footer';
        if (page.bodyWidgets[0].sectionFormat.differentFirstPage &&
            (isNullOrUndefined(page.previousPage) || page.sectionIndex !== page.previousPage.sectionIndex)) {
            type = isHeader ? 'First Page Header' : 'First Page Footer';
        }
        else if (page.bodyWidgets[0].sectionFormat.differentOddAndEvenPages) {
            if ((this.documentHelper.pages.indexOf(page) + 1) % 2 === 0) {
                type = isHeader ? 'Even Page Header' : 'Even Page Footer';
            }
            else {
                type = isHeader ? 'Odd Page Header' : 'Odd Page Footer';
            }
        }
        return type;
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    Renderer.prototype.renderDashLine = function (ctx, x, y, width, fillStyle, isSmallDash) {
        ctx.beginPath();
        ctx.strokeStyle = fillStyle;
        ctx.lineWidth = 1;
        if (isSmallDash) {
            ctx.setLineDash([3, 2]);
        }
        else {
            ctx.setLineDash([6, 4]);
        }
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.closePath();
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    Renderer.prototype.renderSolidLine = function (ctx, x, y, width, fillStyle) {
        ctx.beginPath();
        ctx.strokeStyle = fillStyle;
        ctx.lineWidth = 0.5;
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.stroke();
        ctx.closePath();
    };
    Renderer.prototype.renderHeaderFooterMark = function (ctx, x, y, w, h) {
        ctx.beginPath();
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(x, y, w, h);
        ctx.closePath();
    };
    Renderer.prototype.renderHeaderFooterMarkText = function (ctx, content, x, y) {
        ctx.beginPath();
        ctx.fillStyle = '#000000';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(content, x, y);
        ctx.closePath();
    };
    /**
     * Renders body widget.
     * @param {Page} page
     * @param {BodyWidget} bodyWidget
     */
    Renderer.prototype.render = function (page, bodyWidget) {
        for (var i = 0; i < bodyWidget.childWidgets.length; i++) {
            var widget = bodyWidget.childWidgets[i];
            if (i === 0 && bodyWidget.childWidgets[0] instanceof TableWidget &&
                (bodyWidget.childWidgets[0].childWidgets[0].rowFormat.isHeader ||
                    page.repeatHeaderRowTableWidget)) {
                // tslint:disable-next-line:max-line-length
                this.renderHeader(page, widget, this.documentHelper.layout.getHeader(bodyWidget.childWidgets[0]));
            }
            this.renderWidget(page, widget);
        }
        this.renderFloatingItems(page, page.bodyWidgets[0].floatingElements);
    };
    Renderer.prototype.renderFloatingItems = function (page, floatingElements) {
        if (!isNullOrUndefined(floatingElements) && floatingElements.length > 0) {
            /* tslint:disable */
            floatingElements.sort(function (a, b) { return a.zOrderPosition - b.zOrderPosition; });
            for (var i = 0; i < floatingElements.length; i++) {
                var shape = floatingElements[i];
                var blocks = shape.textFrame.childWidgets;
                var shapeLeft = this.getScaledValue(shape.x, 1);
                var shapeTop = this.getScaledValue(shape.y, 2);
                this.pageContext.beginPath();
                if (shape.fillFormat && shape.fillFormat.fill) {
                    this.pageContext.fillStyle = shape.fillFormat.color;
                    this.pageContext.fillRect(shapeLeft, shapeTop, this.getScaledValue(shape.width), this.getScaledValue(shape.height));
                }
                if (shape.lineFormat.lineFormatType !== 'None') {
                    this.pageContext.strokeStyle = shape.lineFormat.color;
                    this.pageContext.strokeRect(shapeLeft, shapeTop, this.getScaledValue(shape.width), this.getScaledValue(shape.height));
                }
                this.pageContext.closePath();
                for (var i_1 = 0; i_1 < blocks.length; i_1++) {
                    this.renderWidget(page, blocks[i_1]);
                }
            }
        }
    };
    /**
     * Renders block widget.
     * @param {Page} page
     * @param {Widget} widget
     */
    Renderer.prototype.renderWidget = function (page, widget) {
        if (this.documentHelper.owner.enableLockAndEdit) {
            this.renderLockRegionBorder(page, widget);
        }
        if (widget instanceof ParagraphWidget) {
            this.renderParagraphWidget(page, widget);
        }
        else {
            this.renderTableWidget(page, widget);
        }
    };
    Renderer.prototype.renderLockRegionBorder = function (page, widget) {
        if (!widget.isInsideTable && widget instanceof BlockWidget && widget.locked) {
            var settinsModel = this.documentHelper.owner.documentEditorSettings.collaborativeEditingSettings;
            var sectionFormat = page.bodyWidgets[0].sectionFormat;
            var leftPosition = HelperMethods.convertPointToPixel(sectionFormat.leftMargin) - 5;
            var pageWidth = sectionFormat.pageWidth - sectionFormat.leftMargin - sectionFormat.rightMargin;
            pageWidth = HelperMethods.convertPointToPixel(pageWidth) + 10;
            if (this.viewer instanceof WebLayoutViewer) {
                // tslint:disable-next-line:max-line-length
                leftPosition = widget.x - 5;
                pageWidth = (this.documentHelper.visibleBounds.width - (this.viewer.padding.right * 5)) / this.documentHelper.zoomFactor;
            }
            var previousWidget = widget.previousRenderedWidget;
            var nextWidget = widget.nextRenderedWidget;
            // tslint:disable-next-line:max-line-length
            var color = widget.lockedBy === this.documentHelper.owner.currentUser ? settinsModel.editableRegionColor : settinsModel.lockedRegionColor;
            var topPosition = widget.y;
            var height = widget.y + widget.height;
            //Left border
            this.renderSingleBorder(color, leftPosition, topPosition, leftPosition, height, 1);
            //Top border
            if (isNullOrUndefined(previousWidget) || !previousWidget.locked || widget.lockedBy !== previousWidget.lockedBy) {
                this.renderSingleBorder(color, leftPosition, topPosition, leftPosition + pageWidth, topPosition, 1);
            }
            //Right border
            this.renderSingleBorder(color, leftPosition + pageWidth, topPosition, leftPosition + pageWidth, height, 1);
            if (isNullOrUndefined(nextWidget) || !nextWidget.locked || widget.lockedBy !== nextWidget.lockedBy) {
                // Bottom border
                this.renderSingleBorder(color, leftPosition, height, leftPosition + pageWidth, height, 1);
            }
        }
    };
    /**
     * Renders header.
     * @param {Page} page
     * @param {TableWidget} widget
     * @param {WRow} header
     * @private
     */
    Renderer.prototype.renderHeader = function (page, widget, header) {
        if (isNullOrUndefined(header)) {
            return;
        }
        //Updated client area for current page
        page.viewer.updateClientArea(page.bodyWidgets[0].sectionFormat, page);
        var top = page.viewer.clientArea.y;
        var parentTable = header.ownerTable.getSplitWidgets()[0];
        for (var i = 0; i <= header.rowIndex; i++) {
            if (parentTable.childWidgets.length === 0) {
                return;
            }
            var row = parentTable.childWidgets[i];
            var headerWidget = row.clone();
            headerWidget.containerWidget = row.containerWidget;
            // tslint:disable-next-line:max-line-length
            page.viewer.updateClientAreaLocation(headerWidget, new Rect(page.viewer.clientArea.x, top, headerWidget.width, headerWidget.height));
            page.documentHelper.layout.updateChildLocationForRow(top, headerWidget);
            var cell = undefined;
            //Renders table cell outline rectangle - Border and background color.
            for (var j = 0; j < headerWidget.childWidgets.length; j++) {
                cell = headerWidget.childWidgets[j];
                this.renderTableCellWidget(page, cell);
            }
            top += headerWidget.height;
        }
        if (widget.y !== top) {
            //this.Location.Y = top;
            page.documentHelper.layout.updateChildLocationForTable(top, widget);
        }
    };
    /**
     * Renders paragraph widget.
     * @param {Page} page
     * @param {ParagraphWidget} paraWidget
     */
    Renderer.prototype.renderParagraphWidget = function (page, paraWidget) {
        var top = paraWidget.y;
        var left = paraWidget.x;
        for (var i = 0; i < paraWidget.childWidgets.length; i++) {
            var widget = paraWidget.childWidgets[i];
            this.renderLine(widget, page, left, top);
            top += widget.height;
        }
    };
    /**
    * Renders paragraph widget.
    * @param {Page} page
    * @param {FootNoteWidget} paraWidget
    */
    Renderer.prototype.renderfootNoteWidget = function (page, paraWidget) {
        for (var i = 0; i < paraWidget.childWidgets.length; i++) {
            var widget = paraWidget.childWidgets[i];
            if (i === 0) {
                var ctx = this.pageContext;
                // tslint:disable-next-line:max-line-length
                this.renderSolidLine(ctx, this.getScaledValue(widget.x, 1), this.getScaledValue(widget.y + widget.height / 2, 2), 300, '#000000');
                continue;
            }
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(widget.footNoteReference) && widget.childWidgets[0].children[0] instanceof TextElementBox) {
                // tslint:disable-next-line:max-line-length
                if (i < 2 || (i > 1 && widget.footNoteReference !== paraWidget.childWidgets[i - 1].footNoteReference)) {
                    // tslint:disable-next-line:max-line-length
                    widget.childWidgets[0].children[0].text = widget.childWidgets[0].children[0].text.replace(widget.childWidgets[0].children[0].text, widget.footNoteReference.text);
                }
            }
            this.renderWidget(page, widget);
        }
    };
    /**
     * Renders table widget.
     * @param {Page} page
     * @param {TableWidget} tableWidget
     */
    Renderer.prototype.renderTableWidget = function (page, tableWidget) {
        if (this.isFieldCode) {
            return;
        }
        for (var i = 0; i < tableWidget.childWidgets.length; i++) {
            var widget = tableWidget.childWidgets[i];
            this.renderTableRowWidget(page, widget);
            if (tableWidget.tableFormat.cellSpacing > 0) {
                this.renderTableOutline(tableWidget);
            }
        }
    };
    /**
     * Renders table row widget.
     * @param {Page} page
     * @param {Widget} rowWidget
     */
    Renderer.prototype.renderTableRowWidget = function (page, rowWidget) {
        for (var i = 0; i < rowWidget.childWidgets.length; i++) {
            var widget = rowWidget.childWidgets[i];
            this.renderTableCellWidget(page, widget);
        }
    };
    /**
     * Renders table cell widget.
     * @param {Page} page
     * @param {TableCellWidget} cellWidget
     */
    Renderer.prototype.renderTableCellWidget = function (page, cellWidget) {
        if (!this.isPrinting) {
            if (this.getScaledValue(cellWidget.y, 2) + cellWidget.height * this.documentHelper.zoomFactor < 0 ||
                this.getScaledValue(cellWidget.y, 2) > this.documentHelper.visibleBounds.height) {
                return;
            }
        }
        var widgetHeight = 0;
        if (!this.isPrinting && page.documentHelper.owner.selection && page.documentHelper.owner.selection.selectedWidgets.length > 0) {
            page.documentHelper.owner.selection.addSelectionHighlightTable(this.selectionContext, cellWidget);
        }
        this.renderTableCellOutline(page.documentHelper, cellWidget);
        for (var i = 0; i < cellWidget.childWidgets.length; i++) {
            var widget = cellWidget.childWidgets[i];
            // MS word render the content in right margin also.
            // So, we need to add right margin value while cliping the content
            var width = (cellWidget.width + cellWidget.margin.left + cellWidget.margin.right) - cellWidget.leftBorderWidth;
            if (!this.isPrinting) {
                // tslint:disable-next-line:max-line-length
                this.clipRect(cellWidget.x - cellWidget.margin.left, cellWidget.y, this.getScaledValue(width), this.getScaledValue(this.height));
            }
            this.renderWidget(page, widget);
            this.pageContext.restore();
        }
    };
    /**
     * Renders line widget.
     * @param {LineWidget} lineWidget
     * @param {Page} page
     * @param {number} left
     * @param {number} top
     */
    Renderer.prototype.renderLine = function (lineWidget, page, left, top) {
        // tslint:disable-next-line:max-line-length
        if (!this.isPrinting && page.documentHelper.owner.selection && !this.documentHelper.isScrollToSpellCheck && page.documentHelper.owner.selection.selectedWidgets.length > 0) {
            page.documentHelper.owner.selection.addSelectionHighlight(this.selectionContext, lineWidget, top);
        }
        var paraFormat = lineWidget.paragraph.paragraphFormat;
        if (lineWidget.isFirstLine() && !paraFormat.bidi) {
            left += HelperMethods.convertPointToPixel(paraFormat.firstLineIndent);
        }
        if (this.documentHelper && this.documentHelper.selection && !isNullOrUndefined(this.documentHelper.selection.formFieldHighlighters)
            && this.documentHelper.selection.formFieldHighlighters.containsKey(lineWidget)) {
            if (this.documentHelper.owner.documentEditorSettings
                && this.documentHelper.owner.documentEditorSettings.formFieldSettings.applyShading) {
                var widgetInfo = page.documentHelper.selection.formFieldHighlighters.get(lineWidget);
                for (var i = 0; i < widgetInfo.length; i++) {
                    this.pageContext.fillStyle = this.documentHelper.owner.documentEditorSettings.formFieldSettings.shadingColor;
                    var height = lineWidget.height;
                    var isLastLine = lineWidget.isLastLine();
                    if (isLastLine) {
                        // tslint:disable-next-line:max-line-length
                        height = height - HelperMethods.convertPointToPixel(this.documentHelper.layout.getAfterSpacing(lineWidget.paragraph));
                    }
                    // tslint:disable-next-line:max-line-length
                    this.pageContext.fillRect(this.getScaledValue(widgetInfo[i].left, 1), this.getScaledValue(top, 2), this.getScaledValue(widgetInfo[i].width), this.getScaledValue(height));
                }
            }
        }
        if (this.documentHelper.owner.searchModule) {
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(page.documentHelper.owner.searchModule.searchHighlighters) && page.documentHelper.owner.searchModule.searchHighlighters.containsKey(lineWidget)) {
                var widgetInfo = page.documentHelper.owner.searchModule.searchHighlighters.get(lineWidget);
                for (var i = 0; i < widgetInfo.length; i++) {
                    this.pageContext.fillStyle = this.viewer.owner.documentEditorSettings.searchHighlightColor;
                    // tslint:disable-next-line:max-line-length
                    this.pageContext.fillRect(this.getScaledValue(widgetInfo[i].left, 1), this.getScaledValue(top, 2), this.getScaledValue(widgetInfo[i].width), this.getScaledValue(lineWidget.height));
                }
            }
        }
        // EditRegion highlight 
        if (page.documentHelper.selection && !isNullOrUndefined(page.documentHelper.selection.editRegionHighlighters)
            && page.documentHelper.selection.editRegionHighlighters.containsKey(lineWidget)) {
            var widgetInfo = page.documentHelper.selection.editRegionHighlighters.get(lineWidget);
            for (var i = 0; i < widgetInfo.length; i++) {
                this.pageContext.fillStyle = widgetInfo[i].color !== '' ? widgetInfo[i].color : '#add8e6';
                // tslint:disable-next-line:max-line-length
                this.pageContext.fillRect(this.getScaledValue(widgetInfo[i].left, 1), this.getScaledValue(top, 2), this.getScaledValue(widgetInfo[i].width), this.getScaledValue(lineWidget.height));
            }
        }
        var isCommentMark = false;
        for (var i = 0; i < lineWidget.children.length; i++) {
            var elementBox = lineWidget.children[i];
            if (elementBox instanceof ShapeElementBox) {
                continue;
            }
            if (elementBox instanceof CommentCharacterElementBox || elementBox instanceof EditRangeStartElementBox) {
                var pageGap = 0;
                if (this.viewer instanceof PageLayoutViewer) {
                    pageGap = this.viewer.pageGap;
                }
                var style = 'display:block;position:absolute;';
                var topPosition = this.getScaledValue((top - 10) + (page.boundingRectangle.y -
                    (pageGap * (page.index + 1)))) + (pageGap * (page.index + 1)) + 'px;';
                if (elementBox instanceof EditRangeStartElementBox) {
                    if (this.documentHelper.owner.enableLockAndEdit) {
                        var l10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
                        l10n.setLocale(this.documentHelper.owner.locale);
                        elementBox.renderLockMark(this.documentHelper.owner.currentUser, l10n);
                        // tslint:disable-next-line:max-line-length
                        var settings = this.documentHelper.owner.documentEditorSettings.collaborativeEditingSettings;
                        var color = elementBox.user === this.documentHelper.owner.currentUser ? settings.editableRegionColor : settings.lockedRegionColor;
                        style += "color:" + color + ";";
                        var leftMargin = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.leftMargin);
                        var leftPosition = page.boundingRectangle.x + this.getScaledValue(leftMargin - 20) + 'px;';
                        if (this.viewer instanceof WebLayoutViewer) {
                            leftPosition = lineWidget.paragraph.x - 5 + 'px;';
                        }
                        style = style + 'left:' + leftPosition + 'top:' + topPosition;
                        elementBox.editRangeMark.setAttribute('style', style);
                    }
                    else {
                        if (elementBox.editRangeMark) {
                            elementBox.editRangeMark.setAttribute('style', 'display:none');
                        }
                    }
                }
                else if (elementBox instanceof CommentCharacterElementBox &&
                    elementBox.commentType === 0 && this.documentHelper.owner.selectionModule) {
                    if (this.documentHelper.owner.enableComment && !isCommentMark) {
                        isCommentMark = true;
                        elementBox.renderCommentMark();
                        var rightMargin = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.rightMargin);
                        var pageWidth = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.pageWidth);
                        // tslint:disable-next-line:max-line-length
                        var leftPosition = page.boundingRectangle.x + this.getScaledValue((pageWidth - rightMargin) + (rightMargin / 4)) + 'px;';
                        if (this.viewer instanceof WebLayoutViewer) {
                            // tslint:disable-next-line:max-line-length
                            leftPosition = (page.boundingRectangle.width - (this.viewer.padding.right * 2) - (this.viewer.padding.left * 2)) + 'px;';
                        }
                        style = style + 'left:' + leftPosition + 'top:' + topPosition;
                        elementBox.commentMark.setAttribute('style', style);
                    }
                    else {
                        if (elementBox.commentMark) {
                            elementBox.commentMark.setAttribute('style', 'display:none');
                        }
                    }
                }
            }
            if (elementBox instanceof FieldElementBox || this.isFieldCode ||
                (elementBox.width === 0 && elementBox.height === 0)) {
                if (this.isFieldCode) {
                    elementBox.width = 0;
                }
                left += elementBox.width + elementBox.margin.left;
                this.toSkipFieldCode(elementBox);
                continue;
            }
            var underlineY = this.getUnderlineYPosition(lineWidget);
            if (!this.isPrinting) {
                if (this.getScaledValue(top + elementBox.margin.top, 2) + elementBox.height * this.documentHelper.zoomFactor < 0 ||
                    this.getScaledValue(top + elementBox.margin.top, 2) > this.documentHelper.visibleBounds.height) {
                    left += elementBox.width + elementBox.margin.left;
                    if (elementBox instanceof TextElementBox) {
                        elementBox.canTrigger = true;
                        elementBox.isVisible = false;
                        if (!elementBox.isSpellChecked || elementBox.line.paragraph.isChangeDetected) {
                            elementBox.ischangeDetected = true;
                        }
                    }
                    continue;
                }
            }
            if (elementBox instanceof ListTextElementBox) {
                this.renderListTextElementBox(elementBox, left, top, underlineY);
            }
            else if (elementBox instanceof ImageElementBox) {
                this.renderImageElementBox(elementBox, left, top, underlineY);
            }
            else {
                elementBox.isVisible = true;
                this.renderTextElementBox(elementBox, left, top, underlineY);
            }
            left += elementBox.width + elementBox.margin.left;
        }
    };
    Renderer.prototype.toSkipFieldCode = function (element) {
        if (element instanceof FieldElementBox) {
            if (element.fieldType === 0) {
                if ((!isNullOrUndefined(element.fieldEnd) || element.hasFieldEnd)) {
                    this.isFieldCode = true;
                }
            }
            else if (element.fieldType === 2 || element.fieldType === 1) {
                this.isFieldCode = false;
            }
        }
    };
    /**
     * Gets underline y position.
     * @param {LineWidget} lineWidget
     * @private
     */
    Renderer.prototype.getUnderlineYPosition = function (lineWidget) {
        var height = 0;
        var lineHeight = 0;
        for (var i = 0; i < lineWidget.children.length; i++) {
            if (lineWidget.children[i] instanceof FieldElementBox ||
                (lineWidget.children[i].width === 0 && lineWidget.children[i].height === 0)) {
                continue;
            }
            if (height < lineWidget.children[i].height + lineWidget.children[i].margin.top) {
                height = lineWidget.children[i].margin.top + lineWidget.children[i].height;
                lineHeight = (lineWidget.children[i] instanceof ImageElementBox) ? 0.9 : lineWidget.children[i].height / 20;
            }
        }
        return height - 2 * lineHeight;
    };
    /**
     * Renders list element box
     * @param {ListTextElementBox} elementBox
     * @param {number} left
     * @param {number} top
     * @param {number} underlineY
     */
    Renderer.prototype.renderListTextElementBox = function (elementBox, left, top, underlineY) {
        var topMargin = elementBox.margin.top;
        var leftMargin = elementBox.margin.left;
        var format = elementBox.listLevel.characterFormat;
        var breakCharacterFormat = elementBox.line.paragraph.characterFormat;
        var color = format.fontColor === 'empty' ? breakCharacterFormat.fontColor : format.fontColor;
        this.pageContext.textBaseline = 'alphabetic';
        var bold = '';
        var italic = '';
        var fontFamily = format.hasValue('fontFamily') ? format.fontFamily : breakCharacterFormat.fontFamily;
        if (this.documentHelper.isIosDevice && (elementBox.text === '\u25CF' || elementBox.text === '\u25CB')) {
            fontFamily = '';
        }
        var fontSize = format.fontSize === 11 ? breakCharacterFormat.fontSize : format.fontSize;
        // tslint:disable-next-line:max-line-length
        var baselineAlignment = format.baselineAlignment === 'Normal' ? breakCharacterFormat.baselineAlignment : format.baselineAlignment;
        bold = format.hasValue('bold') ? format.bold ? 'bold' : '' : breakCharacterFormat.bold ? 'bold' : '';
        italic = format.hasValue('italic') ? format.italic ? 'italic' : '' : breakCharacterFormat.italic ? 'italic' : '';
        fontSize = fontSize === 0 ? 0.5 : fontSize / (baselineAlignment === 'Normal' ? 1 : 1.5);
        fontSize = this.isPrinting ? fontSize : fontSize * this.documentHelper.zoomFactor;
        var strikethrough = format.strikethrough === 'None' ? breakCharacterFormat.strikethrough : format.strikethrough;
        var highlightColor = format.highlightColor === 'NoColor' ? breakCharacterFormat.highlightColor :
            format.highlightColor;
        if (highlightColor !== 'NoColor') {
            if (highlightColor.substring(0, 1) !== '#') {
                this.pageContext.fillStyle = HelperMethods.getHighlightColorCode(highlightColor);
            }
            else {
                this.pageContext.fillStyle = HelperMethods.getColor(highlightColor);
            }
            // tslint:disable-next-line:max-line-length
            this.pageContext.fillRect(this.getScaledValue(left + leftMargin, 1), this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width), this.getScaledValue(elementBox.height));
        }
        this.pageContext.font = bold + ' ' + italic + ' ' + fontSize + 'pt' + ' ' + fontFamily;
        if (baselineAlignment === 'Subscript') {
            topMargin += elementBox.height - elementBox.height / 1.5;
        }
        var baselineOffset = elementBox.baselineOffset;
        topMargin = (format.baselineAlignment === 'Normal') ? topMargin + baselineOffset : (topMargin + (baselineOffset / 1.5));
        var text = elementBox.text;
        var followCharacter = text === '\t' || text === ' ';
        if (!followCharacter && (format.bidi || elementBox.line.paragraph.paragraphFormat.bidi)) {
            var index = text.indexOf('.');
            text = text.substr(index) + text.substring(0, index);
        }
        if (color === "empty") {
            var bgColor = this.documentHelper.backgroundColor;
            this.pageContext.fillStyle = this.getDefaultFontColor(bgColor);
        }
        else {
            this.pageContext.fillStyle = HelperMethods.getColor(color);
        }
        // tslint:disable-next-line:max-line-length
        this.pageContext.fillText(text, this.getScaledValue(left + leftMargin, 1), this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width));
        if (format.underline !== 'None' && !isNullOrUndefined(format.underline)) {
            this.renderUnderline(elementBox, left, top, underlineY, color, format.underline, baselineAlignment);
        }
        if (strikethrough !== 'None') {
            this.renderStrikeThrough(elementBox, left, top, format.strikethrough, color, baselineAlignment);
        }
    };
    Renderer.prototype.getDefaultFontColor = function (backColor) {
        if (HelperMethods.isVeryDark(backColor)) {
            return "#FFFFFF";
        }
        else {
            return "#000000";
        }
    };
    /**
     * Renders text element box.
     * @param {TextElementBox} elementBox
     * @param {number} left
     * @param {number} top
     * @param {number} underlineY
     */
    // tslint:disable-next-line:max-line-length
    Renderer.prototype.renderTextElementBox = function (elementBox, left, top, underlineY) {
        var isHeightType = false;
        var containerWidget = elementBox.line.paragraph.containerWidget;
        if (containerWidget instanceof TableCellWidget) {
            isHeightType = (containerWidget.ownerRow.rowFormat.heightType === 'Exactly');
        }
        var topMargin = elementBox.margin.top;
        var leftMargin = elementBox.margin.left;
        if (isHeightType) {
            // tslint:disable-next-line:max-line-length
            this.clipRect(containerWidget.x, containerWidget.y, this.getScaledValue(containerWidget.width), this.getScaledValue(containerWidget.height));
        }
        var format = elementBox.characterFormat;
        if (format.highlightColor !== 'NoColor') {
            if (format.highlightColor.substring(0, 1) !== '#') {
                this.pageContext.fillStyle = HelperMethods.getHighlightColorCode(format.highlightColor);
            }
            else {
                this.pageContext.fillStyle = HelperMethods.getColor(format.highlightColor);
            }
            // tslint:disable-next-line:max-line-length
            this.pageContext.fillRect(this.getScaledValue(left + leftMargin, 1), this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width), this.getScaledValue(elementBox.height));
        }
        var revisionInfo = this.checkRevisionType(elementBox);
        // tslint:disable-next-line:max-line-length
        var color = revisionInfo.length > 0 ? this.getRevisionColor(revisionInfo) : format.fontColor;
        this.pageContext.textBaseline = 'alphabetic';
        var bold = '';
        var italic = '';
        var fontSize = 11;
        bold = format.bold ? 'bold' : '';
        italic = format.italic ? 'italic' : '';
        fontSize = format.fontSize === 0 ? 0.5 : format.fontSize / (format.baselineAlignment === 'Normal' ? 1 : 1.5);
        fontSize = this.isPrinting ? fontSize : fontSize * this.documentHelper.zoomFactor;
        this.pageContext.font = bold + ' ' + italic + ' ' + fontSize + 'pt' + ' ' + format.fontFamily;
        if (format.baselineAlignment === 'Subscript') {
            topMargin += elementBox.height - elementBox.height / 1.5;
        }
        var baselineOffset = elementBox.baselineOffset;
        topMargin = (format.baselineAlignment === 'Normal') ? topMargin + baselineOffset : (topMargin + (baselineOffset / 1.5));
        if (color === "empty") {
            var bgColor = this.documentHelper.backgroundColor;
            this.pageContext.fillStyle = this.getDefaultFontColor(bgColor);
        }
        else {
            this.pageContext.fillStyle = HelperMethods.getColor(color);
        }
        var scaledWidth = this.getScaledValue(elementBox.width);
        var text = elementBox.text;
        if (elementBox instanceof TabElementBox) {
            var tabElement = elementBox;
            if (tabElement.tabText === '' && !isNullOrUndefined(tabElement.tabLeader) && tabElement.tabLeader !== 'None') {
                text = this.getTabLeader(elementBox);
                tabElement.tabText = text;
            }
            else if (tabElement.tabText !== '') {
                text = tabElement.tabText;
            }
        }
        var isRTL = format.bidi || this.documentHelper.textHelper.isRTLText(elementBox.text);
        text = this.documentHelper.textHelper.setText(text, isRTL, format.bdo, true);
        if (format.allCaps) {
            text = text.toUpperCase();
        }
        // tslint:disable-next-line:max-line-length
        this.pageContext.fillText(text, this.getScaledValue(left + leftMargin, 1), this.getScaledValue(top + topMargin, 2), scaledWidth);
        // tslint:disable-next-line:max-line-length
        if ((this.documentHelper.owner.isSpellCheck && !this.spellChecker.removeUnderline) && (this.documentHelper.triggerSpellCheck || elementBox.canTrigger) && elementBox.text !== ' ' && !this.documentHelper.isScrollHandler && (isNullOrUndefined(elementBox.previousNode) || !(elementBox.previousNode instanceof FieldElementBox))) {
            elementBox.canTrigger = true;
            this.leftPosition = this.pageLeft;
            this.topPosition = this.pageTop;
            var errorDetails = this.spellChecker.checktextElementHasErrors(elementBox.text, elementBox, left);
            if (errorDetails.errorFound) {
                color = '#FF0000';
                for (var i = 0; i < errorDetails.elements.length; i++) {
                    var currentElement = errorDetails.elements[i];
                    // tslint:disable-next-line:max-line-length
                    if (elementBox.ignoreOnceItems.indexOf(this.spellChecker.manageSpecialCharacters(currentElement.text, undefined, true)) === -1) {
                        // tslint:disable-next-line:max-line-length
                        var backgroundColor = (containerWidget instanceof TableCellWidget) ? containerWidget.cellFormat.shading.backgroundColor : this.documentHelper.backgroundColor;
                        // tslint:disable-next-line:max-line-length
                        this.renderWavyline(currentElement, (isNullOrUndefined(currentElement.start)) ? left : currentElement.start.location.x, (isNullOrUndefined(currentElement.start)) ? top : currentElement.start.location.y - elementBox.margin.top, underlineY, color, 'Single', format.baselineAlignment, backgroundColor);
                    }
                }
            }
            else if (elementBox.ischangeDetected || this.documentHelper.triggerElementsOnLoading) {
                elementBox.ischangeDetected = false;
                this.handleChangeDetectedElements(elementBox, underlineY, left, top, format.baselineAlignment);
            }
        }
        var currentInfo = this.getRevisionType(revisionInfo, true);
        // tslint:disable-next-line:max-line-length
        if (format.underline !== 'None' && !isNullOrUndefined(format.underline) || (!isNullOrUndefined(currentInfo) && (currentInfo.type === 'Insertion' || currentInfo.type === 'MoveTo'))) {
            // tslint:disable-next-line:max-line-length
            this.renderUnderline(elementBox, left, top, underlineY, color, format.underline, format.baselineAlignment, currentInfo);
        }
        currentInfo = this.getRevisionType(revisionInfo, false);
        // tslint:disable-next-line:max-line-length
        if (format.strikethrough !== 'None' && !isNullOrUndefined(format.strikethrough) || (!isNullOrUndefined(currentInfo) && (currentInfo.type === 'Deletion' || currentInfo.type === 'MoveFrom'))) {
            // tslint:disable-next-line:max-line-length
            this.renderStrikeThrough(elementBox, left, top, format.strikethrough, color, format.baselineAlignment, currentInfo);
        }
        if (isHeightType) {
            this.pageContext.restore();
        }
    };
    /**
     * Method to handle spell check for modified or newly added elements
     * @param {TextElementBox} elementBox
     * @param {number} underlineY
     * @param {number} left
     * @param {number} top
     * @param {number} baselineAlignment
     */
    // tslint:disable-next-line:max-line-length
    Renderer.prototype.handleChangeDetectedElements = function (elementBox, underlineY, left, top, baselineAlignment) {
        var _this = this;
        var checkText = elementBox.text.trim();
        var beforeIndex = this.pageIndex;
        if (elementBox.text === '\v') {
            return;
        }
        if (!this.spellChecker.checkElementCanBeCombined(elementBox, underlineY, beforeIndex, true)) {
            /* tslint:disable:no-any */
            var splittedText = checkText.split(/[\s]+/);
            var markindex = elementBox.line.getOffset(elementBox, 0);
            var spaceValue = 1;
            if (splittedText.length > 1) {
                for (var i = 0; i < splittedText.length; i++) {
                    var currentText = splittedText[i];
                    var retrievedText = this.spellChecker.manageSpecialCharacters(currentText, undefined, true);
                    // tslint:disable-next-line:max-line-length
                    if (this.spellChecker.ignoreAllItems.indexOf(retrievedText) === -1 && elementBox.ignoreOnceItems.indexOf(retrievedText) === -1) {
                        this.handleUnorderdElements(retrievedText, elementBox, underlineY, i, markindex, i === splittedText.length - 1, beforeIndex);
                        markindex += currentText.length + spaceValue;
                    }
                }
            }
            else {
                var retrievedText = this.spellChecker.manageSpecialCharacters(checkText, undefined, true);
                if (checkText.length > 0) {
                    // tslint:disable-next-line:max-line-length
                    if (this.spellChecker.ignoreAllItems.indexOf(retrievedText) === -1 && elementBox.ignoreOnceItems.indexOf(retrievedText) === -1) {
                        var indexInLine_1 = elementBox.indexInOwner;
                        var indexinParagraph_1 = elementBox.line.paragraph.indexInOwner;
                        var spellInfo = this.spellChecker.checkSpellingInPageInfo(retrievedText);
                        if (spellInfo.isElementPresent && this.spellChecker.enableOptimizedSpellCheck) {
                            var jsonObject = JSON.parse('{\"HasSpellingError\":' + spellInfo.hasSpellError + '}');
                            // tslint:disable-next-line:max-line-length
                            this.spellChecker.handleWordByWordSpellCheck(jsonObject, elementBox, left, top, underlineY, baselineAlignment, true);
                        }
                        else {
                            /* tslint:disable:no-any */
                            // tslint:disable-next-line:max-line-length
                            this.spellChecker.CallSpellChecker(this.spellChecker.languageID, checkText, true, this.spellChecker.allowSpellCheckAndSuggestion).then(function (data) {
                                /* tslint:disable:no-any */
                                var jsonObject = JSON.parse(data);
                                // tslint:disable-next-line:max-line-length
                                var canUpdate = (beforeIndex === _this.pageIndex || elementBox.isVisible) && (indexInLine_1 === elementBox.indexInOwner) && (indexinParagraph_1 === elementBox.line.paragraph.indexInOwner);
                                // tslint:disable-next-line:max-line-length
                                _this.spellChecker.handleWordByWordSpellCheck(jsonObject, elementBox, left, top, underlineY, baselineAlignment, canUpdate);
                            });
                        }
                    }
                }
            }
        }
    };
    /**
     * Method to handle spell check combine and splitted text elements
     * @param {string} currentText
     * @param {TextElementBox} elementBox
     * @param {number} underlineY
     * @param {number} iteration
     * @private
     */
    // tslint:disable-next-line:max-line-length
    Renderer.prototype.handleUnorderdElements = function (currentText, elementBox, underlineY, iteration, markindex, isLastItem, beforeIndex) {
        var _this = this;
        var indexInLine = elementBox.indexInOwner;
        var indexinParagraph = elementBox.line.paragraph.indexInOwner;
        if (currentText.length > 0) {
            var spellInfo = this.spellChecker.checkSpellingInPageInfo(currentText);
            if (spellInfo.isElementPresent && this.spellChecker.enableOptimizedSpellCheck) {
                var jsonObject = JSON.parse('{\"HasSpellingError\":' + spellInfo.hasSpellError + '}');
                // tslint:disable-next-line:max-line-length
                this.spellChecker.handleSplitWordSpellCheck(jsonObject, currentText, elementBox, true, underlineY, iteration, markindex, isLastItem);
            }
            else {
                /* tslint:disable:no-any */
                // tslint:disable-next-line:max-line-length
                this.spellChecker.CallSpellChecker(this.spellChecker.languageID, currentText, true, this.spellChecker.allowSpellCheckAndSuggestion).then(function (data) {
                    /* tslint:disable:no-any */
                    var jsonObject = JSON.parse(data);
                    // tslint:disable-next-line:max-line-length
                    var canUpdate = (elementBox.isVisible) && (indexInLine === elementBox.indexInOwner) && (indexinParagraph === elementBox.line.paragraph.indexInOwner);
                    // tslint:disable-next-line:max-line-length
                    _this.spellChecker.handleSplitWordSpellCheck(jsonObject, currentText, elementBox, canUpdate, underlineY, iteration, markindex, isLastItem);
                });
            }
        }
    };
    /**
     * Render Wavy Line
     * @param {ElementBox} elementBox
     * @param {number} left
     * @param {number} top
     * @param {number} underlineY
     * @param {string} color
     * @param {Underline} underline
     * @param {BaselineAlignment} baselineAlignment
     * @private
     */
    // tslint:disable-next-line:max-line-length
    Renderer.prototype.renderWavyline = function (elementBox, left, top, underlineY, color, underline, baselineAlignment, backgroundColor) {
        if (elementBox.text.length > 1) {
            var renderedHeight = elementBox.height / (baselineAlignment === 'Normal' ? 1 : 1.5);
            var topMargin = elementBox.margin.top;
            var underlineHeight = renderedHeight / 20;
            var frequencyRange = 0.5;
            var amplitudeRange = 1.0;
            var stepToCover = .7;
            var y = 0;
            if (baselineAlignment === 'Subscript' || elementBox instanceof ListTextElementBox) {
                y = (renderedHeight - 2 * underlineHeight) + top;
                topMargin += elementBox.height - renderedHeight;
                y += topMargin > 0 ? topMargin : 0;
            }
            else {
                y = underlineY + top;
            }
            // tslint:disable-next-line:max-line-length
            var specialCharacter = this.spellChecker.getSpecialCharactersInfo(elementBox.text, elementBox.characterFormat);
            // tslint:disable-next-line:max-line-length
            var whiteSpaceData = this.spellChecker.getWhiteSpaceCharacterInfo(elementBox.text, elementBox.characterFormat);
            // tslint:disable-next-line:max-line-length
            var x = left + specialCharacter.beginningWidth + ((whiteSpaceData.isBeginning) ? whiteSpaceData.width : 0) + elementBox.margin.left;
            var x1 = x * this.documentHelper.zoomFactor + this.leftPosition;
            var y1 = y * this.documentHelper.zoomFactor + this.topPosition;
            // tslint:disable-next-line:max-line-length
            var x2 = x1 + this.getScaledValue(elementBox.width - (specialCharacter.beginningWidth + specialCharacter.endWidth) - whiteSpaceData.width);
            var startingPoint = new Point(x1, y1);
            var endingPoint = new Point(x2, y1);
            // tslint:disable-next-line:max-line-length
            this.drawWavy(startingPoint, endingPoint, (x2 - x1) * frequencyRange, amplitudeRange, stepToCover, color, elementBox.height, backgroundColor);
        }
    };
    /**
     * Draw wavy line
     * @param {Point} from
     * @param {Point} to
     * @param {Number} frequency
     * @param {Number} amplitude
     * @param {Number} step
     * @param {string} color
     * @param {Number} negative
     * @private
     */
    // tslint:disable-next-line:max-line-length
    Renderer.prototype.drawWavy = function (from, to, frequency, amplitude, step, color, height, backColor, negative) {
        this.pageContext.save();
        this.pageContext.fillStyle = (!isNullOrUndefined(backColor) ? backColor : this.documentHelper.backgroundColor);
        this.pageContext.fillRect(from.x, from.y - amplitude, (to.x - from.x), amplitude * 3);
        this.pageContext.restore();
        this.pageContext.lineWidth = 1;
        this.pageContext.lineCap = 'round';
        this.pageContext.strokeStyle = color;
        this.pageContext.beginPath();
        //this.pageContext.save();
        var cx = 0;
        var cy = 0;
        var fx = from.x;
        var fy = from.y;
        var tx = to.x;
        var ty = to.y;
        var i = 0;
        var waveOffsetLength = 0;
        var ang = Math.atan2(ty - fy, tx - fx);
        var distance = Math.sqrt((fx - tx) * (fx - tx) + (fy - ty) * (fy - ty));
        var a = amplitude * 1;
        var f = Math.PI * frequency;
        for (i; i <= distance; i += step) {
            waveOffsetLength = Math.sin((i / distance) * f) * a;
            cx = from.x + Math.cos(ang) * i + Math.cos(ang - Math.PI / 2) * waveOffsetLength;
            cy = from.y + Math.sin(ang) * i + Math.sin(ang - Math.PI / 2) * waveOffsetLength;
            i > 0 ? this.pageContext.lineTo(cx, cy) : this.pageContext.moveTo(cx, cy);
        }
        this.pageContext.stroke();
        this.pageContext.restore();
    };
    /**
     * Returns tab leader
     */
    Renderer.prototype.getTabLeader = function (elementBox) {
        var textWidth = 0;
        var tabString = this.getTabLeaderString(elementBox.tabLeader);
        var tabText = tabString;
        textWidth = this.documentHelper.textHelper.getWidth(tabText, elementBox.characterFormat);
        var count = Math.floor(elementBox.width / textWidth);
        for (var i = 0; i <= count; i++) {
            tabText += tabString;
        }
        return tabText.slice(0, -1);
    };
    /**
     * Returns tab leader string.
     */
    Renderer.prototype.getTabLeaderString = function (tabLeader) {
        var tabString = '';
        switch (tabLeader) {
            case 'Dot':
                tabString = '.';
                break;
            case 'Hyphen':
                tabString = '-';
                break;
            case 'Underscore':
                tabString = '_';
                break;
        }
        return tabString;
    };
    /**
     * Clips the rectangle with specified position.
     * @param {number} xPos
     * @param {number} yPos
     * @param {number} width
     * @param {number} height
     */
    Renderer.prototype.clipRect = function (xPos, yPos, width, height) {
        this.pageContext.beginPath();
        this.pageContext.save();
        this.pageContext.rect(this.getScaledValue(xPos, 1), this.getScaledValue(yPos, 2), width, height);
        this.pageContext.clip();
    };
    /**
     * Renders underline.
     * @param {ElementBox} elementBox
     * @param {number} left
     * @param {number} top
     * @param {number} underlineY
     * @param {string} color
     * @param {Underline} underline
     * @param {BaselineAlignment} baselineAlignment
     */
    // tslint:disable-next-line:max-line-length
    Renderer.prototype.renderUnderline = function (elementBox, left, top, underlineY, color, underline, baselineAlignment, revisionInfo) {
        var renderedHeight = elementBox.height / (baselineAlignment === 'Normal' ? 1 : 1.5);
        var topMargin = elementBox.margin.top;
        var underlineHeight = renderedHeight / 20;
        var y = 0;
        var lineHeight = renderedHeight / 20;
        if (baselineAlignment === 'Subscript' || elementBox instanceof ListTextElementBox) {
            y = (renderedHeight - 2 * underlineHeight) + top;
            topMargin += elementBox.height - renderedHeight;
            y += topMargin > 0 ? topMargin : 0;
        }
        else {
            y = underlineY + top;
        }
        var lineCount = 0;
        if (!isNullOrUndefined(revisionInfo)) {
            underline = (revisionInfo.type === 'MoveTo') ? 'Double' : 'Single';
        }
        if (underline === 'Double') {
            y -= lineHeight;
        }
        if (elementBox instanceof ImageElementBox) {
            underlineHeight = 0.9;
        }
        while (lineCount < (underline === 'Double' ? 2 : 1)) {
            lineCount++;
            // tslint:disable-next-line:max-line-length
            this.pageContext.fillRect(this.getScaledValue(left + elementBox.margin.left, 1), this.getScaledValue(y, 2), this.getScaledValue(elementBox.width), this.getScaledValue(underlineHeight));
            y += 2 * lineHeight;
        }
    };
    /**
     * Renders strike through.
     * @param {ElementBox} elementBox
     * @param {number} left
     * @param {number} top
     * @param {Strikethrough} strikethrough
     * @param {string} color
     * @param {BaselineAlignment} baselineAlignment
     */
    // tslint:disable-next-line:max-line-length
    Renderer.prototype.renderStrikeThrough = function (elementBox, left, top, strikethrough, color, baselineAlignment, revisionInfo) {
        var renderedHeight = elementBox.height / (baselineAlignment === 'Normal' ? 1 : 1.5);
        var topMargin = elementBox.margin.top;
        if (baselineAlignment === 'Subscript') {
            topMargin += elementBox.height - renderedHeight;
        }
        top += topMargin > 0 ? topMargin : 0;
        var lineHeight = renderedHeight / 20;
        var y = (renderedHeight / 2) + (0.5 * lineHeight);
        var lineCount = 0;
        if (!isNullOrUndefined(revisionInfo)) {
            strikethrough = (revisionInfo.type === 'Deletion') ? 'SingleStrike' : 'DoubleStrike';
        }
        if (elementBox instanceof ImageElementBox) {
            lineHeight = 0.9;
        }
        if (strikethrough === 'DoubleStrike') {
            y -= lineHeight;
        }
        while (lineCount < (strikethrough === 'DoubleStrike' ? 2 : 1)) {
            lineCount++;
            // tslint:disable-next-line:max-line-length
            this.pageContext.fillRect(this.getScaledValue(left + elementBox.margin.left, 1), this.getScaledValue(y + top, 2), this.getScaledValue(elementBox.width), this.getScaledValue(lineHeight));
            y += 2 * lineHeight;
        }
    };
    /**
     * Renders image element box.
     * @param {ImageElementBox} elementBox
     * @param {number} left
     * @param {number} top
     * @param {number} underlineY
     */
    // tslint:disable-next-line:max-line-length
    Renderer.prototype.renderImageElementBox = function (elementBox, left, top, underlineY) {
        var topMargin = elementBox.margin.top;
        var leftMargin = elementBox.margin.left;
        var revisionInfo = this.checkRevisionType(elementBox);
        var color = revisionInfo.length > 0 ? this.getRevisionColor(revisionInfo) : 'black';
        this.pageContext.textBaseline = 'top';
        var widgetWidth = 0;
        var isClipped = false;
        var containerWid = elementBox.line.paragraph.containerWidget;
        var isHeightType = false;
        if (containerWid instanceof TableCellWidget) {
            isHeightType = (containerWid.ownerRow.rowFormat.heightType === 'Exactly');
        }
        if (topMargin < 0 || elementBox.line.paragraph.width < elementBox.width) {
            // if (containerWid instanceof BodyWidget) {
            //     widgetWidth = containerWid.width + containerWid.x;
            // } else 
            if (containerWid instanceof TableCellWidget) {
                var leftIndent = 0;
                if (containerWid.childWidgets[0] instanceof ParagraphWidget) {
                    var paraAdv = containerWid.childWidgets[0];
                    leftIndent = paraAdv.paragraphFormat.leftIndent;
                }
                widgetWidth = containerWid.width + containerWid.margin.left - containerWid.leftBorderWidth - leftIndent;
                isClipped = true;
                // tslint:disable-next-line:max-line-length
                this.clipRect(left + leftMargin, top + topMargin, this.getScaledValue(widgetWidth), this.getScaledValue(containerWid.height));
            }
        }
        else if (isHeightType) {
            var width = containerWid.width + containerWid.margin.left - containerWid.leftBorderWidth;
            // tslint:disable-next-line:max-line-length
            this.clipRect(containerWid.x, containerWid.y, this.getScaledValue(width), this.getScaledValue(containerWid.height));
        }
        if (elementBox.isMetaFile) {
            /* tslint:disable:no-empty */
        }
        else {
            try {
                if (!elementBox.isCrop) {
                    // tslint:disable-next-line:max-line-length
                    this.pageContext.drawImage(elementBox.element, this.getScaledValue(left + leftMargin, 1), this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width), this.getScaledValue(elementBox.height));
                }
                else {
                    // tslint:disable-next-line:max-line-length
                    this.pageContext.drawImage(elementBox.element, this.getScaledValue(elementBox.x), this.getScaledValue(elementBox.y), elementBox.cropWidth, elementBox.cropHeight, this.getScaledValue(left + leftMargin, 1), this.getScaledValue(top + topMargin, 2), elementBox.width, elementBox.height);
                }
            }
            catch (e) {
                // tslint:disable-next-line:max-line-length
                elementBox.imageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAgVBMVEX///8AAADgAADY2Njl5eVcXFxjY2NZWVl/f3+wsLCmpqb4+PiioqKpqam7u7vV1dX2uLj2wsLhFRXzpKT3vb30sbHhCwv74+P40dH+9vbkIyO2trbBwcHLy8tsbGycnJz529v4zMzrbGzlLS3qZmblNzfrdXXoRkbvi4vvgYHlHh7CZsBOAAADpUlEQVR4nO3da1faQBSF4ekAUQlUEFs14AXxVv7/D6yaQiZx5mSEYXF2ut+PNKzyyK5diYDmR9czx34AB49C/CjE759w3jvvWr15Tdgz3atXE54f++EcIArxoxA/CvGjED8K8aMQPwrxoxA/CvGLEeZ9jPJdhfk4GyCUjb3ECGE/Q6m/q3DwfudjP0ERZYN9hKdn2hvd3+0jHJz5/kBVuTk96bbQUEjhYR9ckiikUH8UUqg/CinUH4UU6o9CCvVHIYX6o5BC/VFIof4opFB/FFKoPwop1B+FFOqPQgrjyxfjVC38Lxk9tnAxGqZqdKtSOE4GHA5/fuNJpDCtcNHbv4VqYYqPLjgfUViPQgrjozA2CptRSGF8/59w+Wrt+rr1btNna1cPzg0wwuXavncxabnX7PfHYYXzlYARvlobQZyUR9mXm+1NMEK7SSLONgcVV9vb8IQXv4J3KSeKKlxXxNCzONkeYp8AV3p9UT1+P3FWHVAsq5thhGZSEb1DrSZq7dS5HUdoLiuBZ6jORG3tCwAkNJfCUJ2Jrqe1P0ESCkMNTdSACYNDDU7UoAkDQw1P1MAJvUMVJmrwhJ6hShM1gMIvQxUnahCFjaHKEzWQQneoxR95ogZTWBuqPFEDKnSHKk/UoArdoYoTNbDC5lBDEzW4QjMpYiZqgIXG/S76JhwHK5zVVipcnkIVuv/RW/HyFKhwYhuFr6NiCmdNoDBUSGFjovJQEYXuRN9ahwoorJ8uSZenPsMTNk+X2q6jwgm/ntHL11HhhL4zenmoYEL/Gb04VCxh6KKTNFQoYfiikzBUJKF00Sk8VCChfF00OFQcYdt10dBQYYRT5xn0n9G7Q0X8GfCzNNEyZ6iPgD/HlydaVg11DfhajJaJlm2HugIUrlomWrYZKuJKHz6vHhbSM/hROdRnxNe1meuXYvW0DB6+aflYrB7dlzDiCM3N1dVN6GDhMCDhjlHYjEIK46MwNgqbUUhhfJ/vA07wO8N1vw94ONo/3e/lTpVOYfc/UyG//ZmqW52fi/FuTNW3/lZ+eguF+qOQQv1RSKH+KKRQfxRSqD8KKdQfhRTqj0IK9UchhfqjkEL9UUih/iikUH8UUqg/CmXh6Hsv3jlK+wnvD/vgkrSHMMuyu1P9ZdmuwnycDQYn+svG3n9KEUKT9zHyf6+IEWJHIX4U4kchfhTiRyF+FOJHIX4U4kchfnVhijeZa6sunCf4ZdPamteEHY5C/CjEr/vCv0ec0g+AtS1QAAAAAElFTkSuQmCC';
                // tslint:disable-next-line:max-line-length
                this.pageContext.drawImage(elementBox.element, this.getScaledValue(left + leftMargin, 1), this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width), this.getScaledValue(elementBox.height));
            }
        }
        this.pageContext.fillStyle = HelperMethods.getColor(color);
        var currentRevision = this.getRevisionType(revisionInfo, false);
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(currentRevision) && (currentRevision.type === 'Deletion' || currentRevision.type === 'MoveFrom')) {
            // tslint:disable-next-line:max-line-length
            this.renderStrikeThrough(elementBox, left, top, 'SingleStrike', color, 'Normal', currentRevision);
        }
        currentRevision = this.getRevisionType(revisionInfo, true);
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(currentRevision) && (currentRevision.type === 'Insertion' || currentRevision.type === 'MoveTo')) {
            var y = this.getUnderlineYPosition(elementBox.line);
            this.renderUnderline(elementBox, left, top, y, color, 'Single', 'Normal');
        }
        if (isClipped) {
            this.pageContext.restore();
        }
    };
    /**
     * Renders table outline.
     * @param {TableWidget} tableWidget
     */
    Renderer.prototype.renderTableOutline = function (tableWidget) {
        var layout = new Layout(this.documentHelper);
        var table = tableWidget;
        tableWidget.width = this.documentHelper.layout.getTableWidth(table);
        var border = !table.isBidiTable ? layout.getTableLeftBorder(table.tableFormat.borders)
            : layout.getTableRightBorder(table.tableFormat.borders);
        var lineWidth = 0;
        //ToDo: Need to draw the borders based on the line style.
        // if (!isNullOrUndefined(border )) {
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
        // tslint:disable-next-line:max-line-length
        this.renderSingleBorder(border.color, tableWidget.x - tableWidget.margin.left - lineWidth / 2, tableWidget.y, tableWidget.x - tableWidget.margin.left - lineWidth / 2, tableWidget.y + tableWidget.height, lineWidth);
        // }
        border = layout.getTableTopBorder(table.tableFormat.borders);
        lineWidth = 0;
        // if (!isNullOrUndefined(border )) {
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
        // tslint:disable-next-line:max-line-length
        this.renderSingleBorder(border.color, tableWidget.x - tableWidget.margin.left - lineWidth, tableWidget.y - lineWidth / 2, tableWidget.x + tableWidget.width + lineWidth + tableWidget.margin.right, tableWidget.y - lineWidth / 2, lineWidth);
        // }
        border = !table.isBidiTable ? layout.getTableRightBorder(table.tableFormat.borders)
            : layout.getTableLeftBorder(table.tableFormat.borders);
        lineWidth = 0;
        // if (!isNullOrUndefined(border )) {
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
        // tslint:disable-next-line:max-line-length
        this.renderSingleBorder(border.color, tableWidget.x + tableWidget.width + tableWidget.margin.right + lineWidth / 2, tableWidget.y, tableWidget.x + tableWidget.width + tableWidget.margin.right + lineWidth / 2, tableWidget.y + tableWidget.height, lineWidth);
        // }
        border = layout.getTableBottomBorder(table.tableFormat.borders);
        lineWidth = 0;
        // if (!isNullOrUndefined(border )) {
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
        // tslint:disable-next-line:max-line-length
        this.renderSingleBorder(border.color, tableWidget.x - tableWidget.margin.left - lineWidth, tableWidget.y + tableWidget.height - lineWidth / 2, tableWidget.x + tableWidget.width + lineWidth + tableWidget.margin.right, tableWidget.y + tableWidget.height - lineWidth / 2, lineWidth);
        // }
    };
    /**
     * Renders table cell outline.
     * @param {LayoutViewer} viewer
     * @param {TableCellWidget} cellWidget
     */
    // tslint:disable: max-func-body-length
    Renderer.prototype.renderTableCellOutline = function (documentHelper, cellWidget) {
        var layout = documentHelper.layout;
        var borders = undefined;
        var tableCell = cellWidget;
        var cellTopMargin = 0;
        var cellBottomMargin = 0;
        var cellLeftMargin = 0;
        var cellRightMargin = 0;
        var height = 0;
        var isBidiTable = cellWidget.ownerTable.isBidiTable;
        borders = tableCell.cellFormat.borders;
        if (cellWidget.containerWidget instanceof TableRowWidget) {
            cellBottomMargin = cellWidget.margin.bottom - cellWidget.containerWidget.bottomBorderWidth;
            cellTopMargin = cellWidget.margin.top - cellWidget.containerWidget.topBorderWidth;
        }
        cellLeftMargin = cellWidget.margin.left - cellWidget.leftBorderWidth;
        cellRightMargin = cellWidget.margin.right - cellWidget.rightBorderWidth;
        if (!isNullOrUndefined(tableCell.ownerRow) && tableCell.ownerRow.rowFormat.heightType === 'Exactly') {
            height = HelperMethods.convertPointToPixel(tableCell.ownerRow.rowFormat.height) + cellTopMargin + cellBottomMargin;
        }
        else {
            if (!isNullOrUndefined(tableCell.ownerRow) && [tableCell.ownerRow].length <= 1) {
                // tslint:disable-next-line:max-line-length
                height = Math.max(HelperMethods.convertPointToPixel(tableCell.ownerRow.rowFormat.height), cellWidget.height) + cellTopMargin + cellBottomMargin;
            }
            else {
                height = cellWidget.height + cellTopMargin + cellBottomMargin;
            }
        }
        var border = !isBidiTable ? TableCellWidget.getCellLeftBorder(tableCell) : TableCellWidget.getCellRightBorder(tableCell);
        var lineWidth = 0;
        // if (!isNullOrUndefined(border )) {
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth()); //Renders the cell left border.
        this.renderCellBackground(height, cellWidget, cellLeftMargin, lineWidth);
        var leftBorderWidth = lineWidth;
        // tslint:disable-next-line:max-line-length
        this.renderSingleBorder(border.color, cellWidget.x - cellLeftMargin - lineWidth, cellWidget.y - cellTopMargin, cellWidget.x - cellLeftMargin - lineWidth, cellWidget.y + cellWidget.height + cellBottomMargin, lineWidth);
        // }
        if (tableCell.updatedTopBorders && tableCell.updatedTopBorders.length > 1) {
            var cellX = cellWidget.x - cellWidget.margin.left - leftBorderWidth / 2;
            var cellY = cellWidget.y - cellWidget.margin.top + lineWidth / 2;
            for (var a = 0; a < tableCell.updatedTopBorders.length; a++) {
                var borderInfo = tableCell.updatedTopBorders[a];
                border = borderInfo.border;
                if (!isNullOrUndefined(border)) {
                    lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
                    this.renderSingleBorder(border.color, cellX, cellY, cellX + borderInfo.width, cellY, lineWidth);
                    cellX = cellX + borderInfo.width;
                }
            }
        }
        else {
            border = TableCellWidget.getCellTopBorder(tableCell);
            // if (!isNullOrUndefined(border )) { //Renders the cell top border.        
            lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
            // tslint:disable-next-line:max-line-length
            this.renderSingleBorder(border.color, cellWidget.x - cellWidget.margin.left - leftBorderWidth / 2, cellWidget.y - cellWidget.margin.top + lineWidth / 2, cellWidget.x + cellWidget.width + cellWidget.margin.right, cellWidget.y - cellWidget.margin.top + lineWidth / 2, lineWidth);
            // }
        }
        var isLastCell = false;
        if (!isBidiTable) {
            isLastCell = tableCell.cellIndex === tableCell.ownerRow.childWidgets.length - 1;
        }
        else {
            isLastCell = tableCell.cellIndex === 0;
        }
        if (tableCell.ownerTable.tableFormat.cellSpacing > 0 || isLastCell) {
            border = isBidiTable ? TableCellWidget.getCellLeftBorder(tableCell) : TableCellWidget.getCellRightBorder(tableCell);
            // if (!isNullOrUndefined(border )) { //Renders the cell right border.           
            lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
            // tslint:disable-next-line:max-line-length
            this.renderSingleBorder(border.color, cellWidget.x + cellWidget.width + cellWidget.margin.right - lineWidth / 2, cellWidget.y - cellTopMargin, cellWidget.x + cellWidget.width + cellWidget.margin.right - lineWidth / 2, cellWidget.y + cellWidget.height + cellBottomMargin, lineWidth);
            // }
        }
        var nextRow = tableCell.ownerRow.nextWidget;
        //Specifies the next row is within the current table widget.
        //True means current row is not rendered at page end; Otherwise False.
        var nextRowIsInCurrentTableWidget = false;
        var previousCellIndex = undefined;
        if (!isNullOrUndefined(nextRow)) {
            if (nextRow.lastChild) {
                var lastCellWidget = nextRow.lastChild;
                previousCellIndex = lastCellWidget.columnIndex + lastCellWidget.cellFormat.columnSpan;
            }
            var nextRowWidget = undefined;
            // if (viewer.renderedElements.containsKey(nextRow) && viewer.renderedElements.get(nextRow).length > 0) {
            nextRowWidget = nextRow;
            // }
            if (nextRowWidget instanceof TableRowWidget) {
                // tslint:disable-next-line:max-line-length
                if (cellWidget.containerWidget instanceof TableRowWidget && cellWidget.containerWidget.containerWidget instanceof TableWidget) {
                    nextRowIsInCurrentTableWidget = cellWidget.containerWidget.containerWidget.childWidgets.indexOf(nextRowWidget) !== -1;
                }
            }
        }
        if (tableCell.ownerTable.tableFormat.cellSpacing > 0 || tableCell.ownerRow.rowIndex === tableCell.ownerTable.childWidgets.length - 1
            || (tableCell.cellFormat.rowSpan > 1
                && tableCell.ownerRow.rowIndex + tableCell.cellFormat.rowSpan >= tableCell.ownerTable.childWidgets.length) ||
            !nextRowIsInCurrentTableWidget || previousCellIndex && nextRow.childWidgets.length < tableCell.ownerRow.childWidgets.length
            && previousCellIndex < tableCell.columnIndex + tableCell.cellFormat.columnSpan) {
            // tslint:disable-next-line:max-line-length
            border = (tableCell.cellFormat.rowSpan > 1 && tableCell.ownerRow.rowIndex + tableCell.cellFormat.rowSpan === tableCell.ownerTable.childWidgets.length) ?
                //true part for vertically merged cells specifically.
                // tslint:disable-next-line:max-line-length
                tableCell.getBorderBasedOnPriority(tableCell.getBorderBasedOnPriority(tableCell.cellFormat.borders.bottom, tableCell.ownerRow.rowFormat.borders.bottom), tableCell.ownerTable.tableFormat.borders.bottom)
                //false part for remaining cases that has been handled inside method. 
                : TableCellWidget.getCellBottomBorder(tableCell);
            // if (!isNullOrUndefined(border )) {
            //Renders the cell bottom border.
            lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
            // tslint:disable-next-line:max-line-length
            this.renderSingleBorder(border.color, cellWidget.x - cellWidget.margin.left - leftBorderWidth / 2, cellWidget.y + cellWidget.height + cellBottomMargin + lineWidth / 2, cellWidget.x + cellWidget.width + cellWidget.margin.right, cellWidget.y + cellWidget.height + cellBottomMargin + lineWidth / 2, lineWidth);
            // }
        }
        border = layout.getCellDiagonalUpBorder(tableCell);
        // if (!isNullOrUndefined(border )) {
        //Renders the cell diagonal up border.
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
        if (lineWidth > 0) {
            // tslint:disable-next-line:max-line-length
            this.renderSingleBorder(border.color, cellWidget.x - cellLeftMargin, cellWidget.y + cellWidget.height + cellBottomMargin, cellWidget.x + cellWidget.width + cellRightMargin, cellWidget.y - cellTopMargin, lineWidth);
            // }
        }
        border = layout.getCellDiagonalDownBorder(tableCell);
        // if (!isNullOrUndefined(border )) {
        //Renders the cell diagonal down border.
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
        if (lineWidth > 0) {
            // tslint:disable-next-line:max-line-length
            this.renderSingleBorder(border.color, cellWidget.x - cellLeftMargin, cellWidget.y - cellTopMargin, cellWidget.x + cellWidget.width + cellRightMargin, cellWidget.y + cellWidget.height + cellBottomMargin, lineWidth);
        }
        // }
    };
    /**
     * Renders cell background.
     * @param {number} height
     * @param {TableCellWidget} cellWidget
     */
    Renderer.prototype.renderCellBackground = function (height, cellWidget, leftMargin, lineWidth) {
        var cellFormat = cellWidget.cellFormat;
        var bgColor = cellFormat.shading.backgroundColor === '#ffffff' ?
            cellWidget.ownerTable.tableFormat.shading.backgroundColor : cellFormat.shading.backgroundColor;
        var left = cellWidget.x - leftMargin - lineWidth;
        var topMargin = cellWidget.topMargin ? HelperMethods.convertPointToPixel(cellWidget.topMargin) : 0;
        var top = cellWidget.y - topMargin;
        var width = cellWidget.width + leftMargin + cellWidget.margin.right - lineWidth;
        if (cellWidget.ownerRow.rowFormat.revisions.length > 0) {
            var revision = cellWidget.ownerRow.rowFormat.revisions[cellWidget.ownerRow.rowFormat.revisions.length - 1];
            bgColor = (revision.revisionType === 'Insertion') ? '#e1f2fa' : '#fce6f4';
        }
        this.pageContext.beginPath();
        if (bgColor !== 'empty') {
            this.pageContext.fillStyle = HelperMethods.getColor(bgColor);
            // tslint:disable-next-line:max-line-length
            this.pageContext.fillRect(this.getScaledValue(left, 1), this.getScaledValue(top, 2), this.getScaledValue(width), this.getScaledValue(height));
            this.pageContext.closePath();
        }
        //Render foreground color
        if (cellFormat.shading.hasValue('foregroundColor') && cellFormat.shading.textureStyle !== 'TextureNone') {
            this.pageContext.beginPath();
            if (cellFormat.shading.foregroundColor !== 'empty') {
                this.pageContext.fillStyle = HelperMethods.getColor(cellFormat.shading.foregroundColor);
                // tslint:disable-next-line:max-line-length
                this.pageContext.fillRect(this.getScaledValue(left, 1), this.getScaledValue(top, 2), this.getScaledValue(width), this.getScaledValue(height));
                this.pageContext.closePath();
            }
        }
    };
    /**
     * Renders single border.
     * @param {WBorder} border
     * @param {number} startX
     * @param {number} startY
     * @param {number} endX
     * @param {number} endY
     * @param {number} lineWidth
     */
    // tslint:disable-next-line:max-line-length
    Renderer.prototype.renderSingleBorder = function (color, startX, startY, endX, endY, lineWidth) {
        this.pageContext.beginPath();
        this.pageContext.moveTo(this.getScaledValue(startX, 1), this.getScaledValue(startY, 2));
        this.pageContext.lineTo(this.getScaledValue(endX, 1), this.getScaledValue(endY, 2));
        this.pageContext.lineWidth = this.getScaledValue(lineWidth);
        // set line color
        this.pageContext.strokeStyle = HelperMethods.getColor(color);
        if (lineWidth > 0) {
            this.pageContext.stroke();
        }
        this.pageContext.closePath();
    };
    /**
     * Gets scaled value.
     * @param {number} value
     * @param {number} type
     * @private
     */
    Renderer.prototype.getScaledValue = function (value, type) {
        if (this.isPrinting) {
            return value;
        }
        if (isNullOrUndefined(type)) {
            type = 0;
        }
        var x = value * this.documentHelper.zoomFactor;
        return x + (type === 1 ? this.pageLeft : (type === 2 ? this.pageTop : 0));
    };
    Renderer.prototype.checkRevisionType = function (elementBox) {
        var revisions = [];
        var count = elementBox.revisions.length;
        for (var i = 0; i < count; i++) {
            var currentRevision = elementBox.revisions[i];
            var color = this.documentHelper.authors.get(currentRevision.author);
            revisions.push({ 'type': currentRevision.revisionType, 'color': color });
        }
        return revisions;
    };
    Renderer.prototype.getRevisionColor = function (revisionInfo) {
        if (revisionInfo.length === 1) {
            return revisionInfo[0].color;
        }
        for (var i = 0; i < revisionInfo.length; i++) {
            if (revisionInfo[i].type === 'Deletion' || revisionInfo[i].type === 'MoveFrom') {
                return revisionInfo[i].color;
            }
        }
        return undefined;
    };
    Renderer.prototype.getRevisionType = function (revisionInfo, checkInsert) {
        if (revisionInfo.length === 0) {
            return undefined;
        }
        for (var i = 0; i < revisionInfo.length; i++) {
            var type = undefined;
            if (checkInsert && (revisionInfo[i].type === 'Insertion' || revisionInfo[i].type === 'MoveTo')) {
                type = revisionInfo[i];
                this.pageContext.fillStyle = HelperMethods.getColor(type.color);
                revisionInfo.splice(i, 1);
                return type;
            }
            if (!checkInsert && (revisionInfo[i].type === 'Deletion' || revisionInfo[i].type === 'MoveFrom')) {
                type = revisionInfo[i];
                this.pageContext.fillStyle = HelperMethods.getColor(type.color);
                revisionInfo.splice(i, 1);
                return type;
            }
        }
        return undefined;
    };
    /**
     * Destroys the internal objects which is maintained.
     */
    Renderer.prototype.destroy = function () {
        this.documentHelper = undefined;
        if (!isNullOrUndefined(this.pageCanvasIn)) {
            this.pageCanvasIn.innerHTML = '';
        }
        this.pageCanvasIn = undefined;
    };
    return Renderer;
}());
export { Renderer };
