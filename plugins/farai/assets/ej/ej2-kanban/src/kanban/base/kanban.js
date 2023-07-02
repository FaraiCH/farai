var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, NotifyPropertyChanges, Property, Complex, Collection, detach } from '@syncfusion/ej2-base';
import { addClass, classList, removeClass, compile, formatUnit, L10n, Browser, Event } from '@syncfusion/ej2-base';
import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { Data } from './data';
import { SwimlaneSettings } from '../models/swimlane-settings';
import { CardSettings } from '../models/card-settings';
import { DialogSettings } from '../models/dialog-settings';
import { Columns } from '../models/columns';
import { StackedHeaders } from '../models/stacked-headers';
import { SortSettings } from '../models/sort-settings';
import { Action } from '../actions/action';
import { Crud } from '../actions/crud';
import { DragAndDrop } from '../actions/drag';
import { KanbanDialog } from '../actions/dialog';
import { Keyboard } from '../actions/keyboard';
import { KanbanTooltip } from '../actions/tooltip';
import { KanbanTouch } from '../actions/touch';
import { LayoutRender } from './layout-render';
import * as events from '../base/constant';
import * as cls from './css-constant';
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
var Kanban = /** @class */ (function (_super) {
    __extends(Kanban, _super);
    /**
     * Constructor for creating the Kanban widget
     * @hidden
     */
    function Kanban(options, element) {
        return _super.call(this, options, element) || this;
    }
    /**
     * Initializes the values of private members.
     * @private
     */
    Kanban.prototype.preRender = function () {
        this.isAdaptive = Browser.isDevice;
        this.kanbanData = [];
        if (!this.enablePersistence || !this.swimlaneToggleArray) {
            this.swimlaneToggleArray = [];
        }
        this.activeCardData = { data: null, element: null };
        var defaultLocale = {
            items: 'items',
            min: 'Min',
            max: 'Max',
            cardsSelected: 'Cards Selected',
            addTitle: 'Add New Card',
            editTitle: 'Edit Card Details',
            deleteTitle: 'Delete Card',
            deleteContent: 'Are you sure you want to delete this card?',
            save: 'Save',
            delete: 'Delete',
            cancel: 'Cancel',
            yes: 'Yes',
            no: 'No',
            close: 'Close',
            noCard: 'No cards to display'
        };
        this.localeObj = new L10n(this.getModuleName(), defaultLocale, this.locale);
        this.scrollPosition = { content: { left: 0, top: 0 }, column: {} };
        this.isInitialRender = true;
    };
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    Kanban.prototype.requiredModules = function () {
        var modules = [];
        return modules;
    };
    /**
     * Returns the properties to be maintained in the persisted state.
     * @private
     */
    Kanban.prototype.getPersistData = function () {
        return this.addOnPersist(['columns', 'dataSource', 'swimlaneToggleArray']);
    };
    /**
     * Core method to return the component name.
     * @private
     */
    Kanban.prototype.getModuleName = function () {
        return 'kanban';
    };
    /**
     * Core method that initializes the control rendering.
     * @private
     */
    Kanban.prototype.render = function () {
        var addClasses = [cls.ROOT_CLASS];
        var removeClasses = [];
        if (this.enableRtl) {
            addClasses.push(cls.RTL_CLASS);
        }
        else {
            removeClasses.push(cls.RTL_CLASS);
        }
        if (this.isAdaptive) {
            addClasses.push(cls.DEVICE_CLASS);
        }
        else {
            removeClasses.push(cls.DEVICE_CLASS);
        }
        if (this.cssClass) {
            addClasses.push(this.cssClass);
        }
        this.element.setAttribute('role', 'main');
        classList(this.element, addClasses, removeClasses);
        this.element.style.width = formatUnit(this.width);
        this.element.style.height = formatUnit(this.height);
        createSpinner({ target: this.element });
        this.showSpinner();
        this.initializeModules();
    };
    /**
     * Called internally, if any of the property value changed.
     * @private
     */
    Kanban.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'cssClass':
                    if (oldProp.cssClass) {
                        removeClass([this.element], oldProp.cssClass);
                    }
                    if (newProp.cssClass) {
                        addClass([this.element], newProp.cssClass);
                    }
                    break;
                case 'enableRtl':
                case 'locale':
                    this.refresh();
                    break;
                case 'width':
                    this.element.style.width = formatUnit(newProp.width);
                    this.element.querySelector('.' + cls.HEADER_CLASS).firstElementChild.style.width = 'auto';
                    this.notify(events.contentReady, {});
                    break;
                case 'height':
                    this.element.style.height = formatUnit(newProp.height);
                    this.element.querySelector('.' + cls.CONTENT_CLASS).style.height = 'auto';
                    this.notify(events.contentReady, {});
                    break;
                case 'dataSource':
                case 'query':
                    this.dataModule = new Data(this);
                    break;
                case 'columns':
                case 'constraintType':
                    this.notify(events.dataReady, { processedData: this.kanbanData });
                    break;
                case 'swimlaneSettings':
                    this.onSwimlaneSettingsPropertyChanged(newProp.swimlaneSettings, oldProp.swimlaneSettings);
                    break;
                case 'cardSettings':
                    this.onCardSettingsPropertyChanged(newProp.cardSettings, oldProp.cardSettings);
                    break;
                case 'allowDragAndDrop':
                    if (newProp.allowDragAndDrop) {
                        this.layoutModule.wireDragEvent();
                    }
                    else {
                        this.layoutModule.unWireDragEvent();
                    }
                    break;
                case 'enableTooltip':
                    if (this.tooltipModule) {
                        this.tooltipModule.destroy();
                        this.tooltipModule = null;
                    }
                    if (newProp.enableTooltip) {
                        this.tooltipModule = new KanbanTooltip(this);
                        this.layoutModule.refreshCards();
                    }
                    break;
                case 'dialogSettings':
                    if (newProp.dialogSettings) {
                        this.dialogModule = new KanbanDialog(this);
                    }
                    break;
                case 'allowKeyboard':
                    if (this.keyboardModule) {
                        this.keyboardModule.destroy();
                        this.keyboardModule = null;
                    }
                    if (newProp.allowKeyboard) {
                        this.keyboardModule = new Keyboard(this);
                    }
                    break;
                case 'stackedHeaders':
                    this.layoutModule.refreshHeaders();
                    break;
                case 'sortSettings':
                    this.notify(events.dataReady, { processedData: this.kanbanData });
                    break;
                default:
                    break;
            }
        }
    };
    Kanban.prototype.onSwimlaneSettingsPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'keyField':
                case 'textField':
                case 'showEmptyRow':
                case 'showItemCount':
                case 'template':
                case 'sortDirection':
                    this.notify(events.dataReady, { processedData: this.kanbanData });
                    break;
            }
        }
    };
    Kanban.prototype.onCardSettingsPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'showHeader':
                case 'headerField':
                case 'contentField':
                case 'template':
                case 'tagsField':
                case 'grabberField':
                case 'footerCssField':
                    this.layoutModule.refreshCards();
                    break;
                case 'selectionType':
                    var cards = this.getSelectedCards();
                    if (cards.length > 0) {
                        removeClass(cards, cls.CARD_SELECTION_CLASS);
                        this.layoutModule.disableAttributeSelection(cards);
                    }
                    break;
            }
        }
    };
    Kanban.prototype.initializeModules = function () {
        this.dataModule = new Data(this);
        this.layoutModule = new LayoutRender(this);
        if (this.allowKeyboard) {
            this.keyboardModule = new Keyboard(this);
        }
        this.actionModule = new Action(this);
        this.crudModule = new Crud(this);
        this.dragAndDropModule = new DragAndDrop(this);
        this.dialogModule = new KanbanDialog(this);
        if (this.enableTooltip) {
            this.tooltipModule = new KanbanTooltip(this);
        }
        if (Browser.isDevice || Browser.isTouch) {
            this.touchModule = new KanbanTouch(this);
        }
    };
    /** @hidden */
    Kanban.prototype.renderTemplates = function () {
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.renderReactTemplates();
        }
    };
    /** @hidden */
    Kanban.prototype.resetTemplates = function (templates) {
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.clearTemplate(templates);
        }
    };
    Kanban.prototype.destroyModules = function () {
        if (this.layoutModule) {
            this.layoutModule.destroy();
            this.layoutModule = null;
        }
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
            this.keyboardModule = null;
        }
        if (this.touchModule) {
            this.touchModule.destroy();
            this.touchModule = null;
        }
        this.dialogModule = null;
        this.actionModule = null;
        this.crudModule = null;
        this.dataModule = null;
        this.dragAndDropModule = null;
    };
    /** @private */
    Kanban.prototype.templateParser = function (template) {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                }
            }
            catch (error) {
                return compile(template);
            }
        }
        return undefined;
    };
    /**
     * Returns the card details based on card ID from the board.
     * @method getCardDetails
     * @param {Element} target Accepts the card element to get the details.
     * @returns {{[key: string]: Object}}
     */
    Kanban.prototype.getCardDetails = function (target) {
        var _this = this;
        var isNumeric = typeof this.kanbanData[0][this.cardSettings.headerField] === 'number';
        var targetId = isNumeric ? parseInt(target.getAttribute('data-id'), 10) : target.getAttribute('data-id');
        var cardObj = this.kanbanData.filter(function (data) {
            return data[_this.cardSettings.headerField] === targetId;
        })[0];
        return cardObj;
    };
    /**
     * Returns the column data based on column key input.
     * @method getColumnData
     * @param {string} columnKey Accepts the column key to get the objects.
     * @returns {Object[]}
     */
    Kanban.prototype.getColumnData = function (columnKey, dataSource) {
        return this.layoutModule.getColumnCards(dataSource)[columnKey] || [];
    };
    /**
     * Returns the swimlane column data based on swimlane keyField input.
     * @method getSwimlaneData
     * @param {string} keyField Accepts the swimlane keyField to get the objects.
     * @returns {Object[]}
     */
    Kanban.prototype.getSwimlaneData = function (keyField) {
        return this.layoutModule.getSwimlaneCards()[keyField] || [];
    };
    /**
     * Gets the list of selected cards from the board.
     * @method getSelectedCards
     * @returns {HTMLElement[]}
     */
    Kanban.prototype.getSelectedCards = function () {
        return [].slice.call(this.element.querySelectorAll('.' + cls.CARD_CLASS + '.' + cls.CARD_SELECTION_CLASS));
    };
    /**
     * Allows you to show the spinner on Kanban at the required scenarios.
     * @method showSpinner
     * @returns {void}
     */
    Kanban.prototype.showSpinner = function () {
        showSpinner(this.element);
    };
    /**
     * When the spinner is shown manually using the showSpinner method, it can be hidden using this `hideSpinner` method.
     * @method hideSpinner
     * @returns {void}
     */
    Kanban.prototype.hideSpinner = function () {
        hideSpinner(this.element);
    };
    /**
     * To manually open the dialog.
     * @method openDialog
     * @param {CurrentAction} action Defines the action for which the dialog needs to be opened such as either for new card creation or
     *  editing of existing cards. The applicable action names are `Add` and `Edit`.
     * @param {Object} data It can be card data.
     * @returns {void}
     */
    Kanban.prototype.openDialog = function (action, data) {
        this.dialogModule.openDialog(action, data);
    };
    /**
     * To manually close the dialog.
     * @method closeDialog
     * @returns {void}
     */
    Kanban.prototype.closeDialog = function () {
        this.dialogModule.closeDialog();
    };
    /**
     * Adds the new card to the data source of Kanban and layout.
     * @method addCard
     * @param {Object | {[key: string]: Object}} cardData Single card objects to be added into Kanban.
     * @param {Object[] | {[key: string]: Object}[]} cardData Collection of card objects to be added into Kanban.
     * @returns {void}
     */
    Kanban.prototype.addCard = function (cardData) {
        this.crudModule.addCard(cardData);
    };
    /**
     * Updates the changes made in the card object by passing it as a parameter to the data source.
     * @method updateCard
     * @param {{[key: string]: Object} | Object} cardData Single card object to be updated into Kanban.
     * @param {{[key: string]: Object}[] | Object[]} cardData Collection of card objects to be updated into Kanban.
     * @returns {void}
     */
    Kanban.prototype.updateCard = function (cardData, index) {
        this.crudModule.updateCard(cardData, index);
    };
    /**
     * Deletes the card based on the provided ID or card collection in the argument list.
     * @method deleteCard
     * @param {{[key: string]: Object} | Object} id Single card to be removed from the Kanban.
     * @param {{[key: string]: Object }[] | Object[]} id Collection of cards to be removed from the Kanban.
     * @param {number} id Accepts the ID of the card in integer type which needs to be removed from the Kanban.
     * @param {string} id Accepts the ID of the card in string type which needs to be removed from the Kanban.
     * @returns {void}
     */
    Kanban.prototype.deleteCard = function (cardData) {
        this.crudModule.deleteCard(cardData);
    };
    /**
     * Add the column to Kanban board dynamically based on the provided column options and index in the argument list.
     * @method addColumn
     * @param {ColumnsModel} columnOptions Defines the properties to new column that are going to be added in the board.
     * @param {number} index Defines the index of column to add the new column.
     * @returns {void}
     */
    Kanban.prototype.addColumn = function (columnOptions, index) {
        this.actionModule.addColumn(columnOptions, index);
    };
    /**
     * Deletes the column based on the provided index value.
     * @method deleteColumn
     * @param {number} index Defines the index of column to delete the existing column from Kanban board.
     * @returns {void}
     */
    Kanban.prototype.deleteColumn = function (index) {
        this.actionModule.deleteColumn(index);
    };
    /**
     * Shows the column from hidden based on the provided key in the columns.
     * @method showColumn
     * @param {string} key Accepts the hidden column key name to be shown from the hidden state in board.
     * @returns {void}
     */
    Kanban.prototype.showColumn = function (key) {
        this.actionModule.showColumn(key);
    };
    /**
     * Hides the column from Kanban board based on the provided key in the columns.
     * @method hideColumn
     * @param {string} key Accepts the visible column key name to be hidden from the board.
     * @returns {void}
     */
    Kanban.prototype.hideColumn = function (key) {
        this.actionModule.hideColumn(key);
    };
    /**
     * Removes the control from the DOM and detaches all its related event handlers. Also, it removes the attributes and classes.
     * @method destroy
     * @return {void}
     */
    Kanban.prototype.destroy = function () {
        this.destroyModules();
        [].slice.call(this.element.childNodes).forEach(function (node) { detach(node); });
        var removeClasses = [cls.ROOT_CLASS];
        if (this.cssClass) {
            removeClasses = removeClasses.concat(this.cssClass.split(' '));
        }
        removeClass([this.element], removeClasses);
        _super.prototype.destroy.call(this);
    };
    __decorate([
        Property()
    ], Kanban.prototype, "cssClass", void 0);
    __decorate([
        Property('auto')
    ], Kanban.prototype, "width", void 0);
    __decorate([
        Property('auto')
    ], Kanban.prototype, "height", void 0);
    __decorate([
        Property([])
    ], Kanban.prototype, "dataSource", void 0);
    __decorate([
        Property()
    ], Kanban.prototype, "query", void 0);
    __decorate([
        Property()
    ], Kanban.prototype, "keyField", void 0);
    __decorate([
        Property('Column')
    ], Kanban.prototype, "constraintType", void 0);
    __decorate([
        Collection([], Columns)
    ], Kanban.prototype, "columns", void 0);
    __decorate([
        Property(true)
    ], Kanban.prototype, "allowKeyboard", void 0);
    __decorate([
        Collection([], StackedHeaders)
    ], Kanban.prototype, "stackedHeaders", void 0);
    __decorate([
        Complex({}, SwimlaneSettings)
    ], Kanban.prototype, "swimlaneSettings", void 0);
    __decorate([
        Complex({}, CardSettings)
    ], Kanban.prototype, "cardSettings", void 0);
    __decorate([
        Complex({}, SortSettings)
    ], Kanban.prototype, "sortSettings", void 0);
    __decorate([
        Complex({}, DialogSettings)
    ], Kanban.prototype, "dialogSettings", void 0);
    __decorate([
        Property(true)
    ], Kanban.prototype, "allowDragAndDrop", void 0);
    __decorate([
        Property(false)
    ], Kanban.prototype, "enableTooltip", void 0);
    __decorate([
        Property(false)
    ], Kanban.prototype, "showEmptyColumn", void 0);
    __decorate([
        Property(false)
    ], Kanban.prototype, "enablePersistence", void 0);
    __decorate([
        Property()
    ], Kanban.prototype, "tooltipTemplate", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "actionBegin", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "actionComplete", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "actionFailure", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "created", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "dataBinding", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "dataBound", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "cardClick", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "cardDoubleClick", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "queryCellInfo", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "cardRendered", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "dragStart", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "drag", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "dragStop", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "dialogOpen", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "dialogClose", void 0);
    Kanban = __decorate([
        NotifyPropertyChanges
    ], Kanban);
    return Kanban;
}(Component));
export { Kanban };
