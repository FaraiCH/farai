import { TreeMap } from '../../index';
import { ExportType } from '../utils/enum';
/**
 * ImageExport module handles the export to image functionality for treemap.
 * @hidden
 */
export declare class ImageExport {
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
    export(type: ExportType, fileName: string, allowDownload?: boolean): Promise<string>;
    protected getModuleName(): string;
    /**
     * To destroy the ImageExport.
     * @return {void}
     * @private
     */
    destroy(treemap: TreeMap): void;
}
