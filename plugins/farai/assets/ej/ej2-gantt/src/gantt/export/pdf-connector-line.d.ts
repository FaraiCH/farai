import { PdfColor } from '@syncfusion/ej2-pdf-export';
import { IGanttStyle } from './../base/interface';
import { Gantt } from './../base/gantt';
import { PdfGantt } from './pdf-gantt';
/**
 * @hidden
 */
export declare class PdfGanttPredecessor {
    parentLeft?: number;
    childLeft?: number;
    parentWidth?: number;
    childWidth?: number;
    parentIndex?: number;
    childIndex?: number;
    rowHeight?: number;
    type?: string;
    milestoneParent?: boolean;
    milestoneChild?: boolean;
    lineWidth?: number;
    connectorLineColor?: PdfColor;
    pdfGantt?: PdfGantt;
    parent?: Gantt;
    ganttStyle: IGanttStyle;
    /**
     * @hidden
     */
    add(): PdfGanttPredecessor;
    constructor(parent?: Gantt, pdfGantt?: PdfGantt);
    /**
     * Calculate the predecesor line point and draw the predecessor
     * @return {void}
     * @private
     */
    drawPredecessor(pdfGantt: PdfGantt): void;
    /**
     * @private
     * Method to draw the predecessor lines with calculated connector points
     */
    private connectLines;
    /**
     * @private
     * Method to check the predecessor line  occurs within the page
     */
    private contains;
    /**
     * @private
     * Find the PDF page index of given point
     */
    private findPageIndex;
    /**
     * @private
     * Draw predecessor line
     */
    private drawLine;
    /**
     * @private
     * Draw predecessor arrow
     */
    private drawArrow;
}
