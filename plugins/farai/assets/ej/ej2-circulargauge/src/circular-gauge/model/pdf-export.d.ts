import { CircularGauge } from '../../index';
import { ExportType } from '../utils/enum';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
/**
 * Represent the Pdf export for gauge
 * @hidden
 */
export declare class PdfExport {
    private control;
    /**
     * Constructor for gauge
     * @param control
     */
    constructor(control: CircularGauge);
    /**
     * To export the file as image/svg format
     * @param type
     * @param fileName
     * @param orientation
     * @param allowDownload
     * @private
     */
    export(type: ExportType, fileName: string, orientation?: PdfPageOrientation, allowDownload?: boolean): Promise<string>;
    protected getModuleName(): string;
    /**
     * To destroy the PdfExport.
     * @return {void}
     * @private
     */
    destroy(gauge: CircularGauge): void;
}
