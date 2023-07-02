import { Spreadsheet } from '../base/index';
/**
 * Represents selection support for Spreadsheet.
 */
export declare class Selection {
    private parent;
    private startCell;
    private isRowSelected;
    private isColSelected;
    private scrollInterval;
    private touchEvt;
    private mouseMoveEvt;
    private uniqueOBracket;
    private uniqueCBracket;
    private uniqueCSeparator;
    private uniqueCOperator;
    private uniquePOperator;
    private uniqueSOperator;
    private uniqueMOperator;
    private uniqueDOperator;
    private uniqueModOperator;
    private uniqueConcateOperator;
    private uniqueEqualOperator;
    private uniqueExpOperator;
    private uniqueGTOperator;
    private uniqueLTOperator;
    private invalidOperators;
    private formulaRange;
    private tableRangesFormula;
    private dStartCell;
    private dEndCell;
    /**
     * Constructor for the Spreadsheet selection module.
     * @private
     */
    constructor(parent: Spreadsheet);
    private addEventListener;
    private removeEventListener;
    private rowHeightChanged;
    private colWidthChanged;
    private selectRange;
    private init;
    private createSelectionElement;
    private mouseDownHandler;
    private mouseMoveHandler;
    private mouseUpHandler;
    private isSelected;
    private virtualContentLoadedHandler;
    private clearInterval;
    private getScrollContent;
    private getScrollLeft;
    private cellNavigateHandler;
    private getColIdxFromClientX;
    private getRowIdxFromClientY;
    private initFormulaReferenceIndicator;
    private selectRangeByIdx;
    private UpdateRowColSelected;
    private updateActiveCell;
    private getOffset;
    private getSelectionElement;
    private getActiveCell;
    private getSheetElement;
    private highlightHdr;
    private protectHandler;
    private getHdrIndexes;
    private initiateFormulaSelection;
    private processFormulaEditRange;
    private updateFormulaEditRange;
    private chartBorderHandler;
    private focusBorder;
    private getEleFromRange;
    private getRowCells;
    private merge;
    private clearBorder;
    private parseFormula;
    private isUniqueChar;
    private getUniqueCharVal;
    private markSpecialChar;
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string;
    destroy(): void;
}
