import { Component, ModuleDeclaration } from '@syncfusion/ej2-base';
import { L10n, EmitType } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Data } from './data';
import { KanbanModel } from './kanban-model';
import { CardSettingsModel, ColumnsModel, SwimlaneSettingsModel, StackedHeadersModel, DialogSettingsModel } from '../models/index';
import { SortSettingsModel } from '../models/index';
import { ActionEventArgs, CardClickEventArgs, CardRenderedEventArgs, DragEventArgs, ScrollPosition } from './interface';
import { QueryCellInfoEventArgs, DialogEventArgs } from './interface';
import { ReturnType, ConstraintType, CurrentAction } from './type';
import { Action } from '../actions/action';
import { Crud } from '../actions/crud';
import { DragAndDrop } from '../actions/drag';
import { KanbanDialog } from '../actions/dialog';
import { Keyboard } from '../actions/keyboard';
import { KanbanTooltip } from '../actions/tooltip';
import { KanbanTouch } from '../actions/touch';
import { LayoutRender } from './layout-render';
/**
 * The Kanban component is an efficient way to visually depict various stages of a process using cards with transparent workflows.
 * The component has rich set of APIs, methods, and events used to enable or disable its features and customize them.
 * ```html
 * <div id="kanban"></div>
 * ```
 * ```typescript
 * <script>
 *   var kanbanObj = new Kanban();
 *   kanbanObj.appendTo("#kanban");
 * </script>
 * ```
 */
export declare class Kanban extends Component<HTMLElement> {
    isAdaptive: Boolean;
    crudModule: Crud;
    dataModule: Data;
    layoutModule: LayoutRender;
    actionModule: Action;
    dragAndDropModule: DragAndDrop;
    dialogModule: KanbanDialog;
    keyboardModule: Keyboard;
    tooltipModule: KanbanTooltip;
    touchModule: KanbanTouch;
    kanbanData: Object[];
    activeCardData: CardClickEventArgs;
    localeObj: L10n;
    swimlaneToggleArray: string[];
    scrollPosition: ScrollPosition;
    isInitialRender: boolean;
    /**
     * It is used to customize the Kanban, which accepts custom CSS class names that defines specific user-defined
     *  styles and themes to be applied on the Kanban element.
     * @default null
     */
    cssClass: string;
    /**
     * Sets the `width` of the Kanban component, accepting both string and number values.
     * The string value can be either pixel or percentage format.
     * When set to `auto`, the Kanban width gets auto-adjusted and display its content related to the viewable screen size.
     * @default 'auto'
     */
    width: string | number;
    /**
     * Sets the `height` of the Kanban component, accepting both string and number values.
     * The string type includes either pixel or percentage values.
     * When `height` is set with specific pixel value, then the Kanban will be rendered to that specified space.
     * In case, if `auto` value is set, then the height of the Kanban gets auto-adjusted within the given container.
     * @default 'auto'
     */
    height: string | number;
    /**
     * With this property, the card data will be bound to Kanban.
     * The card data can be passed either as an array of JavaScript objects,
     * or else can create an instance of [`DataManager`](http://ej2.syncfusion.com/documentation/data/api-dataManager.html)
     * in case of processing remote data and can be assigned to the `dataSource` property.
     * With the remote data assigned to dataSource, check the available
     *  [adaptors](http://ej2.syncfusion.com/documentation/data/adaptors.html) to customize the data processing.
     * @default []
     * @isGenericType true
     */
    dataSource: Object[] | DataManager;
    /**
     * Defines the external [`query`](http://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will be executed along with the data processing.
     * @default null
     */
    query: Query;
    /**
     * Defines the key field of Kanban board. The Kanban renders its layout based on this key field.
     * @default null
     */
    keyField: string;
    /**
     * Defines the constraint type used to apply validation based on column or swimlane. The possible values are:
     * * Column
     * * Swimlane
     * @default column
     */
    constraintType: ConstraintType;
    /**
     * Defines the Kanban board columns and their properties such as header text, key field, template, allow toggle,
     * expand or collapse state, min or max count, and show or hide item count.
     * @default []
     */
    columns: ColumnsModel[];
    /**
     * When this property is set to true, it allows the keyboard interaction in Kanban.
     * @default true
     */
    allowKeyboard: boolean;
    /**
     * Defines the stacked header for Kanban columns with text and key fields.
     * @default []
     */
    stackedHeaders: StackedHeadersModel[];
    /**
     * Defines the swimlane settings to Kanban board such as key field, text field, template, allow drag-and-drop,
     * show or hide empty row, show or hide items count, and more.
     * @default {}
     */
    swimlaneSettings: SwimlaneSettingsModel;
    /**
     * Defines the Kanban board related settings such as header field, content field, template,
     * show or hide header, and single or multiple selection.
     * @default {}
     */
    cardSettings: CardSettingsModel;
    /**
     * Defines the sort settings such as field and direction.
     * @default {}
     */
    sortSettings: SortSettingsModel;
    /**
     * Defines the dialog settings such as template and fields.
     * @default {}
     */
    dialogSettings: DialogSettingsModel;
    /**
     * Enables or disables the drag and drop actions in Kanban.
     * @default true
     */
    allowDragAndDrop: boolean;
    /**
     * Enables or disables the tooltip in Kanban board. The property relates to the tooltipTemplate property.
     * @default false
     */
    enableTooltip: boolean;
    /**
     * Enable or disable the columns when empty dataSource.
     * @default false
     */
    showEmptyColumn: boolean;
    /**
     * Enables or disables the persisting component's state between page reloads.
     * If enabled, columns, dataSource properties will be persisted in kanban.
     */
    enablePersistence: boolean;
    /**
     * Defines the template content to card’s tooltip. The property works by enabling the ‘enableTooltip’ property.
     * @default null
     */
    tooltipTemplate: string;
    /**
     * Triggers on beginning of every Kanban action.
     * @event
     */
    actionBegin: EmitType<ActionEventArgs>;
    /**
     * Triggers on successful completion of the Kanban actions.
     * @event
     */
    actionComplete: EmitType<ActionEventArgs>;
    /**
     * Triggers when a Kanban action gets failed or interrupted and an error information will be returned.
     * @event
     */
    actionFailure: EmitType<ActionEventArgs>;
    /**
     * Triggers after the kanban component is created.
     * @event
     */
    created: EmitType<Object>;
    /**
     * Triggers before the data binds to the Kanban.
     * @event
     */
    dataBinding: EmitType<ReturnType>;
    /**
     * Triggers once the event data is bound to the Kanban.
     * @event
     */
    dataBound: EmitType<ReturnType>;
    /**
     * Triggers on single-clicking the Kanban cards.
     * @event
     */
    cardClick: EmitType<CardClickEventArgs>;
    /**
     * Triggers on double-clicking the Kanban cards.
     * @event
     */
    cardDoubleClick: EmitType<CardClickEventArgs>;
    /**
     * Triggers before each column of the Kanban rendering on the page.
     * @event
     */
    queryCellInfo: EmitType<QueryCellInfoEventArgs>;
    /**
     * Triggers before each card of the Kanban rendering on the page.
     * @event
     */
    cardRendered: EmitType<CardRenderedEventArgs>;
    /**
     * Triggers when the card drag actions starts.
     * @event
     */
    dragStart: EmitType<DragEventArgs>;
    /**
     * Triggers when the card is dragging to other stage or other swimlane.
     * @event
     */
    drag: EmitType<DragEventArgs>;
    /**
     * Triggers when the card drag actions stops.
     * @event
     */
    dragStop: EmitType<DragEventArgs>;
    /**
     * Triggers before the dialog opens.
     * @event
     */
    dialogOpen: EmitType<DialogEventArgs>;
    /**
     * Triggers before the dialog closes.
     * @event
     */
    dialogClose: EmitType<DialogEventArgs>;
    /**
     * Constructor for creating the Kanban widget
     * @hidden
     */
    constructor(options?: KanbanModel, element?: string | HTMLElement);
    /**
     * Initializes the values of private members.
     * @private
     */
    protected preRender(): void;
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    requiredModules(): ModuleDeclaration[];
    /**
     * Returns the properties to be maintained in the persisted state.
     * @private
     */
    protected getPersistData(): string;
    /**
     * Core method to return the component name.
     * @private
     */
    getModuleName(): string;
    /**
     * Core method that initializes the control rendering.
     * @private
     */
    render(): void;
    /**
     * Called internally, if any of the property value changed.
     * @private
     */
    onPropertyChanged(newProp: KanbanModel, oldProp: KanbanModel): void;
    private onSwimlaneSettingsPropertyChanged;
    private onCardSettingsPropertyChanged;
    private initializeModules;
    /** @hidden */
    renderTemplates(): void;
    /** @hidden */
    resetTemplates(templates?: string[]): void;
    private destroyModules;
    /** @private */
    templateParser(template: string): Function;
    /**
     * Returns the card details based on card ID from the board.
     * @method getCardDetails
     * @param {Element} target Accepts the card element to get the details.
     * @returns {{[key: string]: Object}}
     */
    getCardDetails(target: Element): {
        [key: string]: Object;
    } | Object;
    /**
     * Returns the column data based on column key input.
     * @method getColumnData
     * @param {string} columnKey Accepts the column key to get the objects.
     * @returns {Object[]}
     */
    getColumnData(columnKey: string, dataSource?: Object[]): Object[];
    /**
     * Returns the swimlane column data based on swimlane keyField input.
     * @method getSwimlaneData
     * @param {string} keyField Accepts the swimlane keyField to get the objects.
     * @returns {Object[]}
     */
    getSwimlaneData(keyField: string): Object[];
    /**
     * Gets the list of selected cards from the board.
     * @method getSelectedCards
     * @returns {HTMLElement[]}
     */
    getSelectedCards(): HTMLElement[];
    /**
     * Allows you to show the spinner on Kanban at the required scenarios.
     * @method showSpinner
     * @returns {void}
     */
    showSpinner(): void;
    /**
     * When the spinner is shown manually using the showSpinner method, it can be hidden using this `hideSpinner` method.
     * @method hideSpinner
     * @returns {void}
     */
    hideSpinner(): void;
    /**
     * To manually open the dialog.
     * @method openDialog
     * @param {CurrentAction} action Defines the action for which the dialog needs to be opened such as either for new card creation or
     *  editing of existing cards. The applicable action names are `Add` and `Edit`.
     * @param {Object} data It can be card data.
     * @returns {void}
     */
    openDialog(action: CurrentAction, data?: Object): void;
    /**
     * To manually close the dialog.
     * @method closeDialog
     * @returns {void}
     */
    closeDialog(): void;
    /**
     * Adds the new card to the data source of Kanban and layout.
     * @method addCard
     * @param {Object | {[key: string]: Object}} cardData Single card objects to be added into Kanban.
     * @param {Object[] | {[key: string]: Object}[]} cardData Collection of card objects to be added into Kanban.
     * @returns {void}
     */
    addCard(cardData: Object | Object[] | {
        [key: string]: Object;
    } | {
        [key: string]: Object;
    }[]): void;
    /**
     * Updates the changes made in the card object by passing it as a parameter to the data source.
     * @method updateCard
     * @param {{[key: string]: Object} | Object} cardData Single card object to be updated into Kanban.
     * @param {{[key: string]: Object}[] | Object[]} cardData Collection of card objects to be updated into Kanban.
     * @returns {void}
     */
    updateCard(cardData: Object | Object[] | {
        [key: string]: Object;
    } | {
        [key: string]: Object;
    }[], index?: number): void;
    /**
     * Deletes the card based on the provided ID or card collection in the argument list.
     * @method deleteCard
     * @param {{[key: string]: Object} | Object} id Single card to be removed from the Kanban.
     * @param {{[key: string]: Object }[] | Object[]} id Collection of cards to be removed from the Kanban.
     * @param {number} id Accepts the ID of the card in integer type which needs to be removed from the Kanban.
     * @param {string} id Accepts the ID of the card in string type which needs to be removed from the Kanban.
     * @returns {void}
     */
    deleteCard(cardData: string | number | Object | Object[] | {
        [key: string]: Object;
    } | {
        [key: string]: Object;
    }[]): void;
    /**
     * Add the column to Kanban board dynamically based on the provided column options and index in the argument list.
     * @method addColumn
     * @param {ColumnsModel} columnOptions Defines the properties to new column that are going to be added in the board.
     * @param {number} index Defines the index of column to add the new column.
     * @returns {void}
     */
    addColumn(columnOptions: ColumnsModel, index: number): void;
    /**
     * Deletes the column based on the provided index value.
     * @method deleteColumn
     * @param {number} index Defines the index of column to delete the existing column from Kanban board.
     * @returns {void}
     */
    deleteColumn(index: number): void;
    /**
     * Shows the column from hidden based on the provided key in the columns.
     * @method showColumn
     * @param {string} key Accepts the hidden column key name to be shown from the hidden state in board.
     * @returns {void}
     */
    showColumn(key: string): void;
    /**
     * Hides the column from Kanban board based on the provided key in the columns.
     * @method hideColumn
     * @param {string} key Accepts the visible column key name to be hidden from the board.
     * @returns {void}
     */
    hideColumn(key: string): void;
    /**
     * Removes the control from the DOM and detaches all its related event handlers. Also, it removes the attributes and classes.
     * @method destroy
     * @return {void}
     */
    destroy(): void;
}
