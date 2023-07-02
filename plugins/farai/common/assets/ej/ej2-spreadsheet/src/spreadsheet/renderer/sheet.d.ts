import { Spreadsheet } from '../base/index';
import { SheetRenderArgs } from '../common/index';
import { IRenderer } from '../common/index';
import { SheetModel } from '../../workbook/index';
/**
 * Sheet module is used to render Sheet
 * @hidden
 */
export declare class SheetRender implements IRenderer {
    private parent;
    private headerPanel;
    private contentPanel;
    private col;
    private rowRenderer;
    private cellRenderer;
    private freezePane;
    colGroupWidth: number;
    constructor(parent?: Spreadsheet);
    private refreshSelectALLContent;
    private updateLeftColGroup;
    private detachColGroup;
    renderPanel(): void;
    private initHeaderPanel;
    createTable(): void;
    private createHeaderTable;
    private updateTable;
    /**
     * It is used to refresh the select all, row header, column header and content of the spreadsheet.
     */
    renderTable(args: SheetRenderArgs): void;
    private triggerCreatedEvent;
    refreshColumnContent(args: SheetRenderArgs): void;
    refreshRowContent(args: SheetRenderArgs): void;
    updateCol(sheet: SheetModel, idx: number, appendTo?: Node): Element;
    updateColContent(args: SheetRenderArgs): void;
    updateRowContent(args: SheetRenderArgs): void;
    private checkRowMerge;
    private refreshPrevMerge;
    private checkColMerge;
    /**
     * Used to toggle row and column headers.
     */
    showHideHeaders(): void;
    private renderHeaders;
    private updateHideHeaders;
    /**
     * Get the select all table element of spreadsheet
     * @return {HTMLElement}
     */
    private getSelectAllContent;
    /**
     * Get the select all table element of spreadsheet
     * @return {Element}
     */
    private getSelectAllTable;
    /**
     * Get the column header element of spreadsheet
     * @return {HTMLTableElement}
     */
    getColHeaderTable(): HTMLTableElement;
    /**
     * Get the row header table element of spreadsheet
     * @return {HTMLTableElement}
     */
    getRowHeaderTable(): HTMLTableElement;
    /**
     * Get the main content table element of spreadsheet
     * @return {Element}
     */
    getContentTable(): HTMLTableElement;
    /**
     * Get the row header div element of spreadsheet
     * @return {Element}
     */
    getRowHeaderPanel(): Element;
    /**
     * Get the column header div element of spreadsheet
     * @return {Element}
     */
    getColHeaderPanel(): Element;
    /**
     * Get the main content div element of spreadsheet
     * @return {Element}
     */
    getContentPanel(): Element;
    private addEventListener;
    private destroy;
    private removeEventListener;
}
