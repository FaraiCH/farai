import { Maps } from '../../index';
/**
 * This module enables the print functionality in maps.
 * @hidden
 */
export declare class Print {
    private control;
    private printWindow;
    /**
     * Constructor for Maps
     * @param control
     */
    constructor(control: Maps);
    /**
     * To print the Maps
     * @param elements
     * @private
     */
    print(elements?: string[] | string | Element): void;
    /**
     * To get the html string of the Maps
     * @param elements
     * @private
     */
    private getHTMLContent;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the print.
     * @return {void}
     * @private
     */
    destroy(maps: Maps): void;
}
