import { TreeMap } from '../../index';
import { ExportType } from '../utils/enum';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
/**
 * PdfExport module handles the export to pdf functionality for treemap.
 * @hidden
 */
export declare class PdfExport {
    private control;
    /**
     * Constructor for Maps
     * @param control
     */
    constructor(control: TreeMap);
    /**
     * This method is used to perform the export functionality for the rendered treemap.
     * @param type
     * @param fileName
     * @private
     */
    export(type: ExportType, fileName: string, orientation?: PdfPageOrientation, allowDownload?: boolean): Promise<string>;
    protected getModuleName(): string;
    /**
     * To destroy the ImageExport.
     * @return {void}
     * @private
     */
    destroy(treemap: TreeMap): void;
}
