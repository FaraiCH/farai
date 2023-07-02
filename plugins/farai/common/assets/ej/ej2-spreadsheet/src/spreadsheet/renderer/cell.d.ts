import { Spreadsheet } from '../base/index';
import { ICellRenderer, CellRenderArgs } from '../common/index';
/**
 * CellRenderer class which responsible for building cell content.
 * @hidden
 */
export declare class CellRenderer implements ICellRenderer {
    private parent;
    private element;
    private th;
    private tableRow;
    private borderTd;
    constructor(parent?: Spreadsheet);
    renderColHeader(index: number): Element;
    renderRowHeader(index: number): Element;
    render(args: CellRenderArgs): Element;
    private update;
    private checkMerged;
    private processTemplates;
    private compileCellTemplate;
    private updateRowHeight;
    private getRowHeightOnInit;
    private removeStyle;
    /** @hidden */
    refreshRange(range: number[]): void;
    refresh(rowIdx: number, colIdx: number, lastCell?: boolean, element?: Element): void;
    private updateView;
}
