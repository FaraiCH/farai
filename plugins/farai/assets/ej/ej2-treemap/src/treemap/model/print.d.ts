import { TreeMap } from '../../index';
/**
 * Print module handles the print functionality for treemap.
 * @hidden
 */
export declare class Print {
    private control;
    private printWindow;
    /**
     * Constructor for Maps
     * @param control
     */
    constructor(control: TreeMap);
    /**
     * This method is used to perform the print functionality in treemap.
     * @param elements
     * @private
     */
    print(elements?: string[] | string | Element): void;
    /**
     * To get the html string of the Maps
     * @param elements
     * @private
     */
    getHTMLContent(elements?: string[] | string | Element): Element;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the legend.
     * @return {void}
     * @private
     */
    destroy(treemap: TreeMap): void;
}
