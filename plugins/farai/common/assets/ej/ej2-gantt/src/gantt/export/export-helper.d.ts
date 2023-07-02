import { PdfDocument } from '@syncfusion/ej2-pdf-export';
import { PdfGantt } from './pdf-gantt';
import { IGanttData, PdfExportProperties } from './../base/interface';
import { Gantt } from './../base/gantt';
/**
 * @hidden
 * `ExportHelper` for `PdfExport` & `ExcelExport`
 */
export declare class ExportHelper {
    private parent;
    private flatData;
    private exportProps;
    private gantt;
    private rowIndex;
    private colIndex;
    private row;
    private columns;
    private ganttStyle;
    private pdfDoc;
    private exportValueFormatter;
    private totalColumnWidth;
    constructor(parent: Gantt);
    /**
     * @return {void}
     * @private
     */
    processGridExport(data: IGanttData[], gantt: PdfGantt, props: PdfExportProperties): void;
    private processHeaderContent;
    private processColumnHeader;
    private isColumnVisible;
    private processGanttContent;
    /**
     * Method for processing the timeline details
     */
    private processTimeline;
    /**
     * Method for create the predecessor collection for rendering
     */
    private processPredecessor;
    private processRecordRow;
    private processRecordCell;
    /**
     * Method for create the taskbar collection for rendering
     */
    private processTaskbar;
    /**
     * set text alignment of each columns in exporting grid
     * @private
     */
    private getHorizontalAlignment;
    /**
     * set vertical alignment of each columns in exporting grid
     * @private
     */
    private getVerticalAlignment;
    private getFontFamily;
    private getFont;
    private renderEmptyGantt;
    private mergeCells;
    private copyStyles;
    /**
     * @return {void}
     * @private
     */
    initializePdf(pdfDoc: PdfDocument): void;
}
/**
 * @hidden
 * `ExportValueFormatter` for `PdfExport` & `ExcelExport`
 */
export declare class ExportValueFormatter {
    private internationalization;
    private valueFormatter;
    constructor(culture: string);
    private returnFormattedValue;
    /**
     * @private
     */
    formatCellValue(args: any): string;
}
