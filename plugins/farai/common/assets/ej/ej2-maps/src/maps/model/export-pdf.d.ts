import { Maps } from '../../index';
import { ExportType } from '../utils/enum';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
/**
 * This module enables the export to PDF functionality in Maps control.
 * @hidden
 */
export declare class PdfExport {
    private control;
    /**
     * Constructor for Maps
     * @param control
     */
    constructor(control: Maps);
    /**
     * To export the file as image/svg format
     * @param type
     * @param fileName
     * @private
     */
    export(type: ExportType, fileName: string, allowDownload?: boolean, orientation?: PdfPageOrientation): Promise<string>;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the PdfExports.
     * @return {void}
     * @private
     */
    destroy(maps: Maps): void;
}
