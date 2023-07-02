import { Maps } from '../../index';
import { ExportType } from '../utils/enum';
/**
 * This module enables the export to Image functionality in Maps control.
 * @hidden
 */
export declare class ImageExport {
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
    export(type: ExportType, fileName: string, allowDownload?: boolean): Promise<string>;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the ImageExport.
     * @return {void}
     * @private
     */
    destroy(maps: Maps): void;
}
