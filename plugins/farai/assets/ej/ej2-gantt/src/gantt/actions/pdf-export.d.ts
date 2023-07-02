import { PdfExportProperties } from './../base/interface';
import { Gantt } from '../base/gantt';
import { PdfGantt } from '../export/pdf-gantt';
/**
 *
 * @hidden
 */
export declare class PdfExport {
    private parent;
    private helper;
    private pdfDocument;
    gantt: PdfGantt;
    isPdfExport: boolean;
    /**
     * @hidden
     */
    constructor(parent?: Gantt);
    /**
     *
     */
    private getModuleName;
    /**
     * To destroy Pdf export module.
     * @private
     */
    destroy(): void;
    private initGantt;
    /**
     *
     */
    export(pdfExportProperties?: PdfExportProperties, isMultipleExport?: boolean, pdfDoc?: Object): Promise<Object>;
    private exportWithData;
    private processExport;
    private processSectionExportProperties;
    private getPageSize;
}
