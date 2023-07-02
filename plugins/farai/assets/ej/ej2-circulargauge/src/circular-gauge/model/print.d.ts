import { CircularGauge } from '../../index';
/**
 * Represent the print for gauge
 * @hidden
 */
export declare class Print {
    private control;
    private printWindow;
    /**
     * Constructor for gauge
     * @param control
     */
    constructor(control: CircularGauge);
    /**
     * To print the gauge
     * @param elements
     * @private
     */
    print(elements?: string[] | string | Element): void;
    /**
     * To get the html string of the gauge
     * @param elements
     * @private
     */
    getHTMLContent(elements?: string[] | string | Element): Element;
    protected getModuleName(): string;
    /**
     * To destroy the Print.
     * @return {void}
     * @private
     */
    destroy(gauge: CircularGauge): void;
}
