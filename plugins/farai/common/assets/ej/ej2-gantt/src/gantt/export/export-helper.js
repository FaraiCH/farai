import { PdfFontFamily } from '@syncfusion/ej2-pdf-export';
import { PdfStringFormat, PdfPageCountField, PdfPageNumberField } from '@syncfusion/ej2-pdf-export';
import { PdfPageTemplateElement, RectangleF, PdfCompositeField, PointF } from '@syncfusion/ej2-pdf-export';
import { PdfVerticalAlignment, PdfTextAlignment, PdfStandardFont } from '@syncfusion/ej2-pdf-export';
import { PdfFontStyle, PdfColor, PdfPen, PdfSolidBrush } from '@syncfusion/ej2-pdf-export';
import { PdfBorders, PdfPaddings } from './pdf-base/index';
import { isNullOrUndefined, Internationalization, getValue, extend } from '@syncfusion/ej2-base';
import { getForeignData, ValueFormatter } from '@syncfusion/ej2-grids';
import { pixelToPoint, isScheduledTask } from '../base/utils';
/**
 * @hidden
 * `ExportHelper` for `PdfExport` & `ExcelExport`
 */
var ExportHelper = /** @class */ (function () {
    function ExportHelper(parent) {
        this.parent = parent;
    }
    /**
     * @return {void}
     * @private
     */
    ExportHelper.prototype.processGridExport = function (data, gantt, props) {
        this.flatData = data;
        this.gantt = gantt;
        this.exportValueFormatter = new ExportValueFormatter(this.parent.locale);
        this.exportProps = props;
        this.rowIndex = 0;
        this.colIndex = 0;
        this.columns = this.parent.treeGrid.columns;
        this.gantt.treeColumnIndex = this.parent.treeColumnIndex;
        this.gantt.rowHeight = pixelToPoint(this.parent.rowHeight);
        this.gantt.style.cellPadding.left = 0;
        this.gantt.style.cellPadding.right = 0;
        this.ganttStyle = this.gantt.ganttStyle;
        this.gantt.borderColor = this.ganttStyle.chartGridLineColor;
        this.processHeaderContent();
        this.processGanttContent();
        this.processTimeline();
        this.processTaskbar();
        this.processPredecessor();
    };
    ExportHelper.prototype.processHeaderContent = function () {
        var _this = this;
        this.rowIndex++;
        this.row = this.gantt.rows.addRow();
        var index = 0;
        this.columns.forEach(function (column) {
            if (_this.isColumnVisible(column)) {
                _this.processColumnHeader(column, index);
                index++;
            }
        });
    };
    ExportHelper.prototype.processColumnHeader = function (column, index) {
        this.gantt.columns.add(1);
        var pdfColumn = this.gantt.columns.getColumn(index);
        if (this.parent.treeColumnIndex === index) {
            pdfColumn.isTreeColumn = true;
        }
        var width = parseInt(column.width, 10);
        pdfColumn.width = pixelToPoint(width);
        this.totalColumnWidth += pdfColumn.width;
        pdfColumn.headerText = column.headerText;
        pdfColumn.field = column.field;
        var cell = this.row.cells.getCell(index);
        cell.value = column.headerText;
        cell.isHeaderCell = true;
        var treeGridHeaderHeight = this.parent.timelineModule.isSingleTier ? 45 : 60;
        this.row.height = pixelToPoint(treeGridHeaderHeight);
        this.copyStyles(this.ganttStyle.columnHeader, cell, false);
        if (column.headerTextAlign) {
            cell.style.format.alignment = PdfTextAlignment[column.headerTextAlign];
        }
        var args = {
            cell: cell,
            style: cell.style,
            value: cell.value,
            column: column
        };
        if (this.parent.pdfColumnHeaderQueryCellInfo) {
            this.parent.trigger('pdfColumnHeaderQueryCellInfo', args);
        }
        cell.value = args.value;
    };
    ExportHelper.prototype.isColumnVisible = function (column) {
        var visibleColumn = column.visible || this.exportProps.includeHiddenColumn;
        var templateColumn = !isNullOrUndefined(column.template) ? false : true;
        return (visibleColumn && templateColumn);
    };
    ExportHelper.prototype.processGanttContent = function () {
        var _this = this;
        if (this.flatData.length === 0) {
            this.renderEmptyGantt();
        }
        else {
            this.flatData.forEach(function (data) {
                _this.row = _this.gantt.rows.addRow();
                if (data.hasChildRecords) {
                    _this.gantt.rows.getRow(_this.rowIndex).isParentRow = true;
                    _this.processRecordRow(data);
                }
                else {
                    _this.processRecordRow(data);
                }
                _this.rowIndex++;
            });
        }
    };
    /**
     * Method for processing the timeline details
     */
    ExportHelper.prototype.processTimeline = function () {
        var timelineSettings = this.parent.timelineModule;
        this.gantt.chartHeader.topTierHeight = this.gantt.chartHeader.bottomTierHeight
            = (this.parent.timelineModule.isSingleTier ? 45 : 60 / 2);
        this.gantt.chartHeader.topTierCellWidth = timelineSettings.topTierCellWidth;
        this.gantt.chartHeader.bottomTierCellWidth = timelineSettings.bottomTierCellWidth;
        this.gantt.chartHeader.topTier = extend([], [], timelineSettings.topTierCollection, true);
        this.gantt.chartHeader.bottomTier = extend([], [], timelineSettings.bottomTierCollection, true);
        this.gantt.chartHeader.width = timelineSettings.totalTimelineWidth;
        this.gantt.chartHeader.height = this.gantt.rows.getRow(0).height;
        this.gantt.timelineStartDate = new Date(timelineSettings.timelineStartDate.getTime());
    };
    /**
     * Method for create the predecessor collection for rendering
     */
    ExportHelper.prototype.processPredecessor = function () {
        var _this = this;
        if (isNullOrUndefined(this.exportProps.showPredecessorLines) || this.exportProps.showPredecessorLines) {
            this.parent.pdfExportModule.isPdfExport = true;
            this.parent.predecessorModule.createConnectorLinesCollection();
            this.parent.updatedConnectorLineCollection.forEach(function (data) {
                var predecessor = _this.gantt.predecessor.add();
                predecessor.parentLeft = data.parentLeft;
                predecessor.childLeft = data.childLeft;
                predecessor.parentWidth = data.parentWidth;
                predecessor.childWidth = data.childWidth;
                predecessor.parentIndex = data.parentIndex;
                predecessor.childIndex = data.childIndex;
                predecessor.rowHeight = data.rowHeight;
                predecessor.type = data.type;
                predecessor.milestoneParent = data.milestoneParent;
                predecessor.milestoneChild = data.milestoneChild;
                predecessor.lineWidth = _this.parent.connectorLineWidth > 5 ? pixelToPoint(5) : pixelToPoint(_this.parent.connectorLineWidth);
                predecessor.connectorLineColor = _this.ganttStyle.connectorLineColor;
                _this.gantt.predecessorCollection.push(predecessor);
            });
            this.parent.pdfExportModule.isPdfExport = false;
        }
    };
    ExportHelper.prototype.processRecordRow = function (data) {
        var _this = this;
        this.colIndex = 0;
        this.row.level = data.level;
        this.columns.forEach(function (column) {
            if (_this.isColumnVisible(column)) {
                _this.processRecordCell(data, column, _this.row);
                _this.colIndex++;
            }
        });
    };
    ExportHelper.prototype.processRecordCell = function (data, column, row) {
        var cell = row.cells.getCell(this.colIndex);
        var taskFields = this.parent.taskFields;
        var ganttProps = data.ganttProperties;
        if (column.editType === 'datepickeredit' || column.editType === 'datetimepickeredit') {
            cell.value = this.parent.getFormatedDate(data[column.field], this.parent.getDateFormat());
        }
        else if (column.field === taskFields.duration) {
            cell.value = this.parent.getDurationString(ganttProps.duration, ganttProps.durationUnit);
        }
        else if (column.field === taskFields.resourceInfo) {
            cell.value = ganttProps.resourceNames;
        }
        else if (column.field === taskFields.work) {
            cell.value = this.parent.getWorkString(ganttProps.work, ganttProps.workUnit);
        }
        else {
            cell.value = !isNullOrUndefined(data[column.field]) ? data[column.field].toString() : '';
        }
        cell.isHeaderCell = false;
        cell.style.padding = new PdfPaddings();
        this.copyStyles(this.ganttStyle.cell, cell, row.isParentRow);
        if (this.colIndex !== this.parent.treeColumnIndex) {
            cell.style.format.alignment = PdfTextAlignment[column.textAlign];
        }
        else {
            cell.style.format.paragraphIndent = cell.row.level * 10;
        }
        if (this.parent.pdfQueryCellInfo != null) {
            var args = {
                data: data,
                value: cell.value,
                column: column,
                style: cell.style,
                cell: cell
            };
            args.value = this.exportValueFormatter.formatCellValue(args);
            if (this.parent.pdfQueryCellInfo) {
                this.parent.trigger('pdfQueryCellInfo', args);
            }
            cell.value = args.value;
        }
    };
    /**
     * Method for create the taskbar collection for rendering
     */
    ExportHelper.prototype.processTaskbar = function () {
        var _this = this;
        this.flatData.forEach(function (data) {
            var taskbar = _this.gantt.taskbar.add();
            var ganttProp = data.ganttProperties;
            taskbar.left = ganttProp.left;
            taskbar.width = ganttProp.width;
            if (taskbar.left < 0) {
                taskbar.width = taskbar.width + taskbar.left;
                taskbar.left = 0;
            }
            taskbar.progress = ganttProp.progress;
            taskbar.isScheduledTask = isScheduledTask(ganttProp);
            if (isScheduledTask) {
                if (isNullOrUndefined(ganttProp.endDate) && isNullOrUndefined(ganttProp.duration)) {
                    taskbar.unscheduledTaskBy = 'startDate';
                }
                else if (isNullOrUndefined(ganttProp.startDate) && isNullOrUndefined(ganttProp.duration)) {
                    taskbar.unscheduledTaskBy = 'endDate';
                }
                else {
                    taskbar.unscheduledTaskBy = 'duration';
                    taskbar.unscheduleStarteDate = _this.parent.dateValidationModule.getValidStartDate(data.ganttProperties);
                    taskbar.unscheduleEndDate = _this.parent.dateValidationModule.getValidEndDate(data.ganttProperties);
                }
            }
            else {
                taskbar.unscheduleStarteDate = null;
                taskbar.unscheduleEndDate = null;
            }
            taskbar.startDate = ganttProp.startDate;
            taskbar.endDate = ganttProp.endDate;
            taskbar.height = _this.parent.chartRowsModule.taskBarHeight;
            taskbar.isMilestone = ganttProp.isMilestone;
            taskbar.milestoneColor = new PdfColor(_this.ganttStyle.taskbar.milestoneColor);
            taskbar.isParentTask = data.hasChildRecords;
            if (ganttProp.isMilestone) {
                taskbar.height = ganttProp.width;
            }
            if (data[_this.parent.labelSettings.leftLabel]) {
                taskbar.leftTaskLabel.value = data[_this.parent.labelSettings.leftLabel].toString();
            }
            if (data[_this.parent.labelSettings.rightLabel]) {
                taskbar.rightTaskLabel.value = data[_this.parent.labelSettings.rightLabel].toString();
            }
            /* tslint:disable-next-line */
            var reduceLeft = ganttProp.isMilestone ? Math.floor(_this.parent.chartRowsModule.taskBarHeight / 2) + 33 : 33; // 33 indicates default timeline cell width
            taskbar.rightTaskLabel.left = ganttProp.left + ganttProp.width + reduceLeft; // right label left value
            taskbar.fontFamily = _this.ganttStyle.fontFamily;
            taskbar.progressWidth = ganttProp.progressWidth;
            taskbar.labelColor = new PdfColor(_this.ganttStyle.label.fontColor);
            taskbar.progressFontColor = new PdfColor(_this.ganttStyle.taskbar.progressFontColor);
            if (taskbar.isParentTask) {
                taskbar.taskColor = new PdfColor(_this.ganttStyle.taskbar.parentTaskColor);
                taskbar.taskBorderColor = new PdfColor(_this.ganttStyle.taskbar.parentTaskBorderColor);
                taskbar.progressColor = new PdfColor(_this.ganttStyle.taskbar.parentProgressColor);
            }
            else {
                taskbar.taskColor = new PdfColor(_this.ganttStyle.taskbar.taskColor);
                taskbar.taskBorderColor = new PdfColor(_this.ganttStyle.taskbar.taskBorderColor);
                taskbar.progressColor = new PdfColor(_this.ganttStyle.taskbar.progressColor);
            }
            taskbar.gridLineColor = new PdfColor(_this.ganttStyle.chartGridLineColor);
            _this.gantt.taskbarCollection.push(taskbar);
            var taskStyle = {};
            taskStyle.progressFontColor = taskbar.progressFontColor;
            taskStyle.taskColor = taskbar.taskColor;
            taskStyle.taskBorderColor = taskbar.taskBorderColor;
            taskStyle.progressColor = taskbar.progressColor;
            taskStyle.milestoneColor = taskbar.milestoneColor;
            var args = {
                taskbar: taskStyle,
                data: data
            };
            if (_this.parent.pdfQueryTaskbarInfo) {
                _this.parent.trigger('pdfQueryTaskbarInfo', args);
                taskbar.progressFontColor = args.taskbar.progressFontColor;
                taskbar.taskColor = args.taskbar.taskColor;
                taskbar.taskBorderColor = args.taskbar.taskBorderColor;
                taskbar.progressColor = args.taskbar.progressColor;
                taskbar.milestoneColor = args.taskbar.milestoneColor;
            }
        });
    };
    /**
     * set text alignment of each columns in exporting grid
     * @private
     */
    ExportHelper.prototype.getHorizontalAlignment = function (textAlign, format) {
        if (format === undefined) {
            format = new PdfStringFormat();
        }
        switch (textAlign) {
            case 'Right':
                format.alignment = PdfTextAlignment.Right;
                break;
            case 'Center':
                format.alignment = PdfTextAlignment.Center;
                break;
            case 'Justify':
                format.alignment = PdfTextAlignment.Justify;
                break;
            case 'Left':
                format.alignment = PdfTextAlignment.Left;
                break;
        }
        return format;
    };
    /**
     * set vertical alignment of each columns in exporting grid
     * @private
     */
    ExportHelper.prototype.getVerticalAlignment = function (verticalAlign, format, textAlign) {
        if (format === undefined) {
            format = new PdfStringFormat();
            format = this.getHorizontalAlignment(textAlign, format);
        }
        switch (verticalAlign) {
            case 'Bottom':
                format.lineAlignment = PdfVerticalAlignment.Bottom;
                break;
            case 'Middle':
                format.lineAlignment = PdfVerticalAlignment.Middle;
                break;
            case 'Top':
                format.lineAlignment = PdfVerticalAlignment.Top;
                break;
        }
        return format;
    };
    ExportHelper.prototype.getFontFamily = function (fontFamily) {
        switch (fontFamily) {
            case 'TimesRoman':
                return 2;
            case 'Courier':
                return 1;
            case 'Symbol':
                return 3;
            case 'ZapfDingbats':
                return 4;
            default:
                return 0;
        }
    };
    /* tslint:disable-next-line:no-any */
    ExportHelper.prototype.getFont = function (content) {
        if (content.font) {
            return content.font;
        }
        var fontSize = (!isNullOrUndefined(content.style.fontSize)) ? (content.style.fontSize * 0.75) : 9.75;
        var fontFamily = (!isNullOrUndefined(content.style.fontFamily)) ?
            (this.getFontFamily(content.style.fontFamily)) : PdfFontFamily.TimesRoman;
        var fontStyle = PdfFontStyle.Regular;
        if (!isNullOrUndefined(content.style.bold) && content.style.bold) {
            fontStyle |= PdfFontStyle.Bold;
        }
        if (!isNullOrUndefined(content.style.italic) && content.style.italic) {
            fontStyle |= PdfFontStyle.Italic;
        }
        if (!isNullOrUndefined(content.style.underline) && content.style.underline) {
            fontStyle |= PdfFontStyle.Underline;
        }
        if (!isNullOrUndefined(content.style.strikeout) && content.style.strikeout) {
            fontStyle |= PdfFontStyle.Strikeout;
        }
        return new PdfStandardFont(fontFamily, fontSize, fontStyle);
    };
    ExportHelper.prototype.renderEmptyGantt = function () {
        var row = this.gantt.rows.addRow();
        row.cells.getCell(0).isHeaderCell = false;
        row.height = pixelToPoint(this.parent.rowHeight);
        this.copyStyles(this.ganttStyle.columnHeader, row.cells.getCell(0), row.isParentRow);
        var count = this.columns.length;
        this.mergeCells(0, 0, count);
    };
    ExportHelper.prototype.mergeCells = function (rowIndex, colIndex, lastColIndex) {
        this.gantt.rows.getRow(rowIndex).cells.getCell(colIndex).columnSpan = lastColIndex;
    };
    ExportHelper.prototype.copyStyles = function (style, cell, isParentRow) {
        cell.style.fontColor = new PdfColor(style.fontColor);
        cell.style.backgroundColor = new PdfColor(style.backgroundColor);
        cell.style.borderColor = new PdfColor(style.borderColor);
        cell.style.fontSize = style.fontSize;
        cell.style.fontStyle = style.fontStyle;
        /* tslint:disable-next-line */
        cell.style.format = Object.assign(new PdfStringFormat(), style.format);
        cell.style.borders = new PdfBorders();
        cell.style.borders.all = new PdfPen(cell.style.borderColor);
        cell.style.padding = new PdfPaddings();
        var padding = 0;
        if (cell.isHeaderCell) {
            padding = this.parent.timelineModule.isSingleTier ? 45 / 2 : 60 / 2;
        }
        else {
            padding = this.parent.rowHeight / 2;
        }
        cell.style.padding.top = padding - style.fontSize;
        cell.style.padding.bottom = padding - style.fontSize;
        cell.style.padding.left = 10;
        cell.style.padding.right = 10;
    };
    /**
     * @return {void}
     * @private
     */
    ExportHelper.prototype.initializePdf = function (pdfDoc) {
        this.pdfDoc = pdfDoc;
        var widths = [];
        var treeColumnIndex = 0;
        var tWidth = (this.pdfDoc.pageSettings.width - 82);
        if (this.totalColumnWidth > (this.pdfDoc.pageSettings.width - 82)) {
            this.gantt.style.allowHorizontalOverflow = true;
        }
        else if ((tWidth / this.columns.length) < widths[treeColumnIndex]) {
            this.gantt.columns.getColumn(treeColumnIndex).width = widths[treeColumnIndex];
        }
        var section = this.pdfDoc.sections.add();
        if (this.exportProps.enableFooter || isNullOrUndefined(this.exportProps.enableFooter)) {
            //code for draw the footer content            
            var bounds = new RectangleF(0, 0, pdfDoc.pageSettings.width, 35);
            var pen = new PdfPen(this.ganttStyle.chartGridLineColor);
            var footer = new PdfPageTemplateElement(bounds);
            var footerBrush = new PdfSolidBrush(this.ganttStyle.footer.backgroundColor);
            footer.graphics.drawRectangle(pen, footerBrush, 0, 0, pdfDoc.pageSettings.width, 35);
            /* tslint:disable-next-line */
            var font = new PdfStandardFont(this.ganttStyle.fontFamily, this.ganttStyle.footer.fontSize, this.ganttStyle.footer.fontStyle);
            var brush = new PdfSolidBrush(this.ganttStyle.footer.fontColor);
            var pageNumber = new PdfPageNumberField(font);
            var count = new PdfPageCountField(font, brush);
            var compositeField = new PdfCompositeField(font, brush, 'Page {0}', pageNumber, count);
            compositeField.stringFormat = this.ganttStyle.footer.format;
            compositeField.bounds = bounds;
            compositeField.draw(footer.graphics, new PointF(0, 0));
            pdfDoc.template.bottom = footer;
        }
    };
    return ExportHelper;
}());
export { ExportHelper };
/**
 * @hidden
 * `ExportValueFormatter` for `PdfExport` & `ExcelExport`
 */
var ExportValueFormatter = /** @class */ (function () {
    function ExportValueFormatter(culture) {
        this.valueFormatter = new ValueFormatter(culture);
        this.internationalization = new Internationalization(culture);
    }
    /* tslint:disable-next-line:no-any */
    ExportValueFormatter.prototype.returnFormattedValue = function (args, customFormat) {
        if (!isNullOrUndefined(args.value) && args.value) {
            return this.valueFormatter.getFormatFunction(customFormat)(args.value);
        }
        else {
            return '';
        }
    };
    /**
     * @private
     */
    /* tslint:disable-next-line:no-any */
    ExportValueFormatter.prototype.formatCellValue = function (args) {
        if (args.isForeignKey) {
            args.value = getValue(args.column.foreignKeyValue, getForeignData(args.column, {}, args.value)[0]);
        }
        if (args.column.type === 'number' && args.column.format !== undefined && args.column.format !== '') {
            return args.value ? this.internationalization.getNumberFormat({ format: args.column.format })(args.value) : '';
        }
        else if (args.column.type === 'boolean') {
            return args.value ? 'true' : 'false';
            /* tslint:disable-next-line:max-line-length */
        }
        else if ((args.column.type === 'date' || args.column.type === 'datetime' || args.column.type === 'time') && args.column.format !== undefined) {
            if (typeof args.value === 'string') {
                args.value = new Date(args.value);
            }
            if (typeof args.column.format === 'string') {
                var format = void 0;
                if (args.column.type === 'date') {
                    format = { type: 'date', skeleton: args.column.format };
                }
                else if (args.column.type === 'time') {
                    format = { type: 'time', skeleton: args.column.format };
                }
                else {
                    format = { type: 'dateTime', skeleton: args.column.format };
                }
                return this.returnFormattedValue(args, format);
            }
            else {
                if (args.column.format instanceof Object && args.column.format.type === undefined) {
                    return (args.value.toString());
                }
                else {
                    /* tslint:disable-next-line:max-line-length */
                    var customFormat = void 0;
                    if (args.column.type === 'date') {
                        /* tslint:disable-next-line:max-line-length */
                        customFormat = { type: args.column.format.type, format: args.column.format.format, skeleton: args.column.format.skeleton };
                    }
                    else if (args.column.type === 'time') {
                        customFormat = { type: 'time', format: args.column.format.format, skeleton: args.column.format.skeleton };
                    }
                    else {
                        customFormat = { type: 'dateTime', format: args.column.format.format, skeleton: args.column.format.skeleton };
                    }
                    return this.returnFormattedValue(args, customFormat);
                }
            }
        }
        else {
            if ((!isNullOrUndefined(args.column.type) && !isNullOrUndefined(args.value)) || !isNullOrUndefined(args.value)) {
                return (args.value).toString();
            }
            else {
                return '';
            }
        }
    };
    return ExportValueFormatter;
}());
export { ExportValueFormatter };
