import { CircularGauge } from '../../index';
import { ExportType } from '../utils/enum';
/**
 * Represent the Image Export for gauge
 * @hidden
 */
export declare class ImageExport {
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
     * @param allowDownload
     * @private
     */
    export(type: ExportType, fileName: string, allowDownload?: boolean): Promise<string>;
    protected getModuleName(): string;
    /**
     * To destroy the ImageExport.
     * @return {void}
     * @private
     */
    destroy(gauge: CircularGauge): void;
}
