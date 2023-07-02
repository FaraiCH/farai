import { Spreadsheet } from '../index';
/**
 * `Filter` module is used to handle the filter action in Spreadsheet.
 */
export declare class Filter {
    private parent;
    private filterRange;
    private filterCollection;
    private filterClassList;
    /**
     * Constructor for filter module.
     */
    constructor(parent: Spreadsheet);
    /**
     * To destroy the filter module.
     * @return {void}
     */
    protected destroy(): void;
    private addEventListener;
    private removeEventListener;
    /**
     * Gets the module name.
     * @returns string
     */
    protected getModuleName(): string;
    /**
     * Validates the range and returns false when invalid.
     */
    private isInValidFilterRange;
    /**
     * Shows the range error alert dialog.
     * @param error - range error string.
     */
    private filterRangeAlertHandler;
    /**
     * Triggers before filter context menu opened and used to add sorting items.
     */
    private beforeFilterMenuOpenHandler;
    /**
     * Creates new menu item element
     */
    private addMenuItem;
    /**
     * Initiates the filter UI for the selected range.
     */
    private initiateFilterUIHandler;
    /**
     * Processes the range if no filter applied.
     */
    private processRange;
    /**
     * Removes all the filter related collections for the active sheet.
     */
    private removeFilter;
    /**
     * Handles filtering cell value based on context menu.
     */
    private filterByCellValueHandler;
    /**
     * Creates filter buttons and renders the filter applied cells.
     */
    private renderFilterCellHandler;
    /**
     * Refreshes the filter header range.
     */
    private refreshFilterRange;
    /**
     * Checks whether the provided cell is a filter cell.
     */
    private isFilterCell;
    /**
     * Checks whether the provided cell is in a filter range
     */
    private isFilterRange;
    /**
     * Gets the filter information from active cell
     */
    private getFilteredColumnHandler;
    /**
     * Triggers before context menu created to enable or disable items.
     */
    private cMenuBeforeOpenHandler;
    /**
     * Closes the filter popup.
     */
    private closeDialog;
    /**
     * Returns true if the filter popup is opened.
     */
    private isPopupOpened;
    private filterCellKeyDownHandler;
    /**
     * Opens the filter popup dialog on filter button click.
     */
    private filterMouseDownHandler;
    /**
     * Opens the excel filter dialog based on target.
     */
    private openDialog;
    /**
     * Formats cell value for listing it in filter popup.
     */
    private filterCboxValueHandler;
    /**
     * Triggers when sorting items are chosen on context menu of filter popup.
     */
    private selectSortItemHandler;
    /**
     * Triggers when OK button or clear filter item is selected
     */
    private filterSuccessHandler;
    /**
     * Triggers events for filtering and applies filter.
     */
    private applyFilter;
    /**
     * Gets the predicates for the sheet
     */
    private getPredicates;
    /**
     * Gets the column type to pass it into the excel filter options.
     */
    private getColumnType;
    /**
     * Triggers before the custom filter dialog opened.
     */
    private beforeCustomFilterOpenHandler;
    /**
     * Clears all the filtered columns in the active sheet.
     */
    private clearAllFilterHandler;
    /**
     * Clear filter from the field.
     */
    private clearFilterHandler;
    /**
     * Reapplies the filter.
     */
    private reapplyFilterHandler;
    /**
     * Gets the filter information of the sheet.
     */
    private getFilterRangeHandler;
    /**
     * Returns the custom operators for filter items.
     */
    private getLocalizedCustomOperators;
}
