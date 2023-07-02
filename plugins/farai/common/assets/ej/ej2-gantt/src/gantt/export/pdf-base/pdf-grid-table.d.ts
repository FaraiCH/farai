import { PdfGanttCellStyle } from './../../base/interface';
import { PdfTreeGrid } from '../pdf-treegrid';
import { RectangleF } from '@syncfusion/ej2-pdf-export';
import { PdfGraphics } from '@syncfusion/ej2-pdf-export';
import { PdfStringFormat, PdfStringLayoutResult } from '@syncfusion/ej2-pdf-export';
/**
 *
 */
export declare class PdfTreeGridCell {
    /**
     * Gets or sets the parent `row`.
     * @private
     */
    row: PdfTreeGridRow;
    /**
     * Gets or sets the cell `style`.
     * @private
     */
    style: PdfGanttCellStyle;
    private cellWidth;
    private cellHeight;
    /**
     * Gets or sets a value that indicates the total number of rows that cell `spans` within a PdfGrid.
     * @private
     */
    rowSpan: number;
    /**
     * Gets or sets a value that indicates the total number of columns that cell `spans` within a PdfGrid.
     * @private
     */
    columnSpan: number;
    value: Object;
    /** @private */
    remainingString: string;
    /** @private */
    finishedDrawingCell: boolean;
    /** @private */
    isCellMergeContinue: boolean;
    /** @private */
    isRowMergeContinue: boolean;
    /** @private */
    isCellMergeStart: boolean;
    /** @private */
    isRowMergeStart: boolean;
    /** @private */
    isHeaderCell: boolean;
    constructor(row?: PdfTreeGridRow);
    /**
     * Gets the `height` of the PdfTreeGrid cell.[Read-Only].
     * @private
     */
    height: number;
    /**
     * Gets the `width` of the PdfTreeGrid cell.[Read-Only].
     * @private
     */
    width: number;
    private measureWidth;
    /**
     * @private
     */
    measureHeight(): number;
    private calculateWidth;
    /**
     * `Draws` the specified graphics.
     * @private
     */
    draw(graphics: PdfGraphics, bounds: RectangleF, cancelSubsequentSpans: boolean, leftAdjustment: number): PdfStringLayoutResult;
    /**
     * Draw the `cell background`.
     * @private
     */
    drawCellBackground(graphics: PdfGraphics, bounds: RectangleF): void;
    /**
     * `Adjusts the text layout area`.
     * @private
     */
    private adjustContentLayoutArea;
    /**
     * @private
     */
    private drawCellBorder;
}
/**
 * `PdfTreeGridCellCollection` class provides access to an ordered,
 * strongly typed collection of 'PdfTreeGridCell' objects.
 * @private
 */
export declare class PdfTreeGridCellCollection {
    /**
     * @private
     */
    private treegridRow;
    /**
     * @private
     */
    private cells;
    /**
     * Initializes a new instance of the `PdfGridCellCollection` class with the row.
     * @private
     */
    constructor(row: PdfTreeGridRow);
    /**
     * Gets the current `cell`.
     * @private
     */
    getCell(index: number): PdfTreeGridCell;
    /**
     * Gets the cells `count`.[Read-Only].
     * @private
     */
    readonly count: number;
    /**
     * `Adds` this instance.
     * @private
     */
    add(cell?: PdfTreeGridCell): PdfTreeGridCell | void;
    /**
     * Returns the `index of` a particular cell in the collection.
     * @private
     */
    indexOf(cell: PdfTreeGridCell): number;
}
/**
 *
 */
export declare class PdfTreeGridRow {
    private treegridCells;
    private pdfTreeGrid;
    private treegridRowOverflowIndex;
    private treegridRowBreakHeight;
    private rowHeight;
    private rowWidth;
    private _isParentRow;
    private intendLevel;
    /**
     * The `Maximum span` of the row.
     * @public
     */
    maximumRowSpan: number;
    constructor(treegrid: PdfTreeGrid);
    readonly cells: PdfTreeGridCellCollection;
    isParentRow: boolean;
    treegrid: PdfTreeGrid;
    /**
     * `Height` of the row yet to be drawn after split.
     * @private
     */
    rowBreakHeight: number;
    /**
     * `over flow index` of the row.
     * @private
     */
    rowOverflowIndex: number;
    level: number;
    /**
     * Gets or sets the `height` of the row.
     * @private
     */
    height: number;
    /**
     * Gets or sets the `width` of the row.
     * @private
     */
    readonly width: number;
    readonly rowIndex: number;
    private measureWidth;
    private measureHeight;
}
/**
 * `PdfTreeGridRowCollection` class provides access to an ordered, strongly typed collection of 'PdfTreeGridRow' objects.
 * @private
 */
export declare class PdfTreeGridRowCollection {
    /**
     * @private
     */
    private treegrid;
    /**
     * The row collection of the `treegrid`.
     * @private
     */
    private rows;
    /**
     * Initializes a new instance of the `PdfTreeGridRowCollection` class with the parent grid.
     * @private
     */
    constructor(treegrid: PdfTreeGrid);
    /**
     * Gets the number of header in the `PdfTreeGrid`.[Read-Only].
     * @private
     */
    readonly count: number;
    /**
     * Return the row collection of the `treegrid`.
     * @private
     */
    readonly rowCollection: PdfTreeGridRow[];
    addRow(): PdfTreeGridRow;
    addRow(row: PdfTreeGridRow): void;
    /**
     * Return the row by index.
     * @private
     */
    getRow(index: number): PdfTreeGridRow;
}
/**
 * `PdfTreeGridHeaderCollection` class provides customization of the settings for the header.
 * @private
 */
export declare class PdfTreeGridHeaderCollection {
    /**
     * The `treegrid`.
     * @private
     */
    private treegrid;
    /**
     * The array to store the `rows` of the grid header.
     * @private
     */
    private rows;
    /**
     * Initializes a new instance of the `PdfTreeGridHeaderCollection` class with the parent grid.
     * @private
     */
    constructor(treegrid: PdfTreeGrid);
    /**
     * Gets a 'PdfTreeGridRow' object that represents the `header` row in a 'PdfGridHeaderCollection' control.[Read-Only].
     * @private
     */
    getHeader(index: number): PdfTreeGridRow;
    /**
     * Gets the `number of header` in the 'PdfGrid'.[Read-Only]
     * @private
     */
    readonly count: number;
    /**
     * `Adds` the specified row.
     * @private
     */
    add(row: PdfTreeGridRow): void;
    indexOf(row: PdfTreeGridRow): number;
}
export declare class PdfTreeGridColumn {
    private treegrid;
    private columnWidth;
    private stringFormat;
    private treeColumnIndex;
    private _headerText;
    private _field;
    constructor(treegrid: PdfTreeGrid);
    headerText: string;
    field: string;
    width: number;
    isTreeColumn: boolean;
    /**
     * Gets or sets the information about the text `formatting`.
     * @private
     */
    format: PdfStringFormat;
}
/**
 * `PdfTreeGridColumnCollection` class provides access to an ordered,
 * strongly typed collection of 'PdfTreeGridColumn' objects.
 * @private
 */
export declare class PdfTreeGridColumnCollection {
    /**
     * @private
     */
    private treegrid;
    /**
     * @private
     */
    private internalColumns;
    /**
     * @private
     */
    columnWidth: number;
    /**
     * Initializes a new instance of the `PdfTreeGridColumnCollection` class with the parent grid.
     * @private
     */
    constructor(treegrid: PdfTreeGrid);
    /**
     * `Add` a new column to the 'PdfGrid'.
     * @private
     */
    add(count: number): void;
    /**
     * Gets the `number of columns` in the 'PdfGrid'.[Read-Only].
     * @private
     */
    readonly count: number;
    /**
     * Gets the `widths`.
     * @private
     */
    readonly width: number;
    /**
     * Gets the `array of PdfGridColumn`.[Read-Only]
     * @private
     */
    readonly columns: PdfTreeGridColumn[];
    /**
     * Gets the `PdfTreeGridColumn` from the specified index.[Read-Only]
     * @private
     */
    getColumn(index: number): PdfTreeGridColumn;
    /**
     * `Calculates the column widths`.
     * @private
     */
    measureColumnsWidth(): number;
    /**
     * Gets the `widths of the columns`.
     * @private
     */
    getDefaultWidths(totalWidth: number): number[];
}
