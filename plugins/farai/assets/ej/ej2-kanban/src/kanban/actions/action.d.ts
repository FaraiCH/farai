import { Kanban } from '../base/kanban';
import { ColumnsModel } from '../models';
/**
 * Action module is used to perform card actions.
 * @hidden
 */
export declare class Action {
    private parent;
    columnToggleArray: string[];
    selectionArray: string[];
    lastCardSelection: Element;
    private lastSelectionRow;
    private lastCard;
    private selectedCardsElement;
    private selectedCardsData;
    hideColumnKeys: string[];
    /**
     * Constructor for action module
     * @private
     */
    constructor(parent: Kanban);
    clickHandler(e: KeyboardEvent): void;
    addButtonClick(target: Element): void;
    doubleClickHandler(e: MouseEvent): void;
    cardClick(e: KeyboardEvent, selectedCard?: HTMLElement): void;
    private cardDoubleClick;
    rowExpandCollapse(e: Event | HTMLElement): void;
    columnExpandCollapse(e: Event | HTMLElement): void;
    columnToggle(target: HTMLTableHeaderCellElement): void;
    cardSelection(target: Element, isCtrl: boolean, isShift: boolean): void;
    addColumn(columnOptions: ColumnsModel, index: number): void;
    deleteColumn(index: number): void;
    showColumn(key: string): void;
    hideColumn(key: string): void;
}
