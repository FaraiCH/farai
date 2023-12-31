import { formulaOperation, keyUp, keyDown, click, refreshFormulaDatasource } from '../common/event';
import { editOperation, formulaBarOperation } from '../common/event';
import { workbookFormulaOperation } from '../../workbook/common/event';
import { AutoComplete } from '@syncfusion/ej2-dropdowns';
import { detach, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { checkIsFormula, getSheet, getSheetName, getCellIndexes } from '../../workbook/index';
import { dialog, locale } from '../common/index';
/**
 * @hidden
 * The `Formula` module is used to handle the formulas and its functionalities in Spreadsheet.
 */
var Formula = /** @class */ (function () {
    /**
     * Constructor for formula module in Spreadsheet.
     * @private
     */
    function Formula(parent) {
        this.isFormulaBar = false;
        this.isFormula = false;
        this.isPopupOpened = false;
        this.isPreventClose = false;
        this.isSubFormula = false;
        this.keyCodes = {
            UP: 38,
            DOWN: 40,
            LEFT: 37,
            RIGHT: 39,
            FIRSTALPHABET: 65,
            LASTALPHABET: 90,
            SPACE: 32,
            BACKSPACE: 8,
            TAB: 9,
            DELETE: 46,
            ENTER: 13,
            ESC: 27
        };
        this.parent = parent;
        this.addEventListener();
        //Spreadsheet.Inject(WorkbookFormula);
    }
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    Formula.prototype.getModuleName = function () {
        return 'formula';
    };
    /**
     * To destroy the formula module.
     * @return {void}
     * @hidden
     */
    Formula.prototype.destroy = function () {
        this.removeEventListener();
        if (this.autocompleteInstance) {
            this.autocompleteInstance.destroy();
            if (this.autocompleteInstance.element) {
                this.autocompleteInstance.element.remove();
            }
        }
        this.autocompleteInstance = null;
        this.parent = null;
    };
    Formula.prototype.addEventListener = function () {
        this.parent.on(formulaOperation, this.performFormulaOperation, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(keyDown, this.keyDownHandler, this);
        this.parent.on(click, this.formulaClick, this);
        this.parent.on(refreshFormulaDatasource, this.refreshFormulaDatasource, this);
    };
    Formula.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(formulaOperation, this.performFormulaOperation);
            this.parent.off(keyUp, this.keyUpHandler);
            this.parent.off(keyDown, this.keyDownHandler);
            this.parent.off(click, this.formulaClick);
            this.parent.off(refreshFormulaDatasource, this.refreshFormulaDatasource);
        }
    };
    Formula.prototype.performFormulaOperation = function (args) {
        var _this = this;
        var action = args.action;
        switch (action) {
            case 'renderAutoComplete':
                this.renderAutoComplete();
                break;
            case 'endEdit':
                this.endEdit();
                break;
            case 'addDefinedName':
                args.isAdded = this.addDefinedName(args.definedName);
                break;
            case 'getNames':
                if (!args.sheetName) {
                    args.sheetName = getSheetName(this.parent);
                }
                args.names = this.getNames(args.sheetName);
                break;
            case 'getNameFromRange':
                args.definedName = this.getNameFromRange(args.range);
                break;
            case 'isFormulaEditing':
                args.isFormulaEdit = this.isFormula;
                break;
            case 'isCircularReference':
                var l10n = this.parent.serviceLocator.getService(locale);
                var dialogInst = this.parent.serviceLocator.getService(dialog);
                dialogInst.show({
                    height: 180, width: 400, isModal: true, showCloseIcon: true,
                    content: l10n.getConstant('CircularReference'),
                    beforeOpen: function (args) {
                        var dlgArgs = {
                            dialogName: 'CircularReferenceDialog',
                            element: args.element, target: args.target, cancel: args.cancel
                        };
                        _this.parent.trigger('dialogBeforeOpen', dlgArgs);
                        if (dlgArgs.cancel) {
                            args.cancel = true;
                        }
                    },
                });
                args.argValue = '0';
                break;
        }
    };
    Formula.prototype.renderAutoComplete = function () {
        if (!select('#' + this.parent.element.id + '_ac', this.parent.element)) {
            var acElem = this.parent.createElement('input', { id: this.parent.element.id + '_ac', className: 'e-ss-ac' });
            this.parent.element.appendChild(acElem);
            var eventArgs = {
                action: 'getLibraryFormulas',
                formulaCollection: []
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            var autoCompleteOptions = {
                dataSource: eventArgs.formulaCollection,
                cssClass: 'e-ss-atc',
                popupWidth: '130px',
                allowFiltering: true,
                filterType: 'StartsWith',
                sortOrder: 'Ascending',
                open: this.onSuggestionOpen.bind(this),
                close: this.onSuggestionClose.bind(this),
                select: this.onSelect.bind(this),
                actionComplete: this.onSuggestionComplete.bind(this)
            };
            this.autocompleteInstance = new AutoComplete(autoCompleteOptions, acElem);
            this.autocompleteInstance.createElement = this.parent.createElement;
        }
    };
    Formula.prototype.onSuggestionOpen = function (e) {
        var _this = this;
        this.isPopupOpened = true;
        var position = this.getPopupPosition();
        e.popup.offsetX = position.left;
        e.popup.offsetY = (position.top + position.height);
        e.popup.refreshPosition();
        e.popup.element.firstChild.style.maxHeight = '180px';
        new Promise(function (resolve, reject) {
            setTimeout(function () { resolve(); }, 100);
        }).then(function () {
            _this.triggerKeyDownEvent(_this.keyCodes.DOWN);
        });
    };
    Formula.prototype.onSuggestionClose = function (e) {
        if (this.isPreventClose) {
            e.cancel = true;
        }
        else {
            this.isPopupOpened = false;
        }
    };
    Formula.prototype.onSelect = function (e) {
        var updatedFormulaValue = '=' + e.itemData.value + '(';
        if (this.isSubFormula) {
            var editValue = this.getEditingValue();
            var parseIndex = editValue.lastIndexOf(this.getArgumentSeparator());
            if (parseIndex > -1) {
                updatedFormulaValue = editValue.slice(0, parseIndex + 1);
            }
            else {
                parseIndex = editValue.lastIndexOf('(');
                if (parseIndex > -1) {
                    updatedFormulaValue = editValue.slice(0, parseIndex + 1);
                }
            }
            updatedFormulaValue += e.itemData.value + '(';
        }
        this.parent.notify(editOperation, {
            action: 'refreshEditor', value: updatedFormulaValue,
            refreshFormulaBar: true, refreshEditorElem: true, refreshCurPos: !this.isFormulaBar
        });
    };
    Formula.prototype.onSuggestionComplete = function (args) {
        this.isPreventClose = args.result.length > 0;
        if (!this.isPreventClose) {
            args.cancel = true;
            this.hidePopUp();
        }
    };
    Formula.prototype.refreshFormulaDatasource = function () {
        var eventArgs = {
            action: 'getLibraryFormulas',
            formulaCollection: []
        };
        this.parent.notify(workbookFormulaOperation, eventArgs);
        this.autocompleteInstance.dataSource = eventArgs.formulaCollection;
    };
    Formula.prototype.keyUpHandler = function (e) {
        if (this.parent.isEdit) {
            var editValue = this.getEditingValue();
            this.isFormula = checkIsFormula(editValue);
            if (this.isFormula || this.isPopupOpened) {
                if (e.keyCode !== this.keyCodes.TAB && this.isFormula) {
                    editValue = this.getSuggestionKeyFromFormula(editValue);
                }
                this.refreshFormulaSuggestion(e, editValue);
            }
        }
        else if (this.isPopupOpened) {
            this.hidePopUp();
        }
    };
    Formula.prototype.keyDownHandler = function (e) {
        var keyCode = e.keyCode;
        if (this.isFormula) {
            if (this.isPopupOpened) {
                switch (keyCode) {
                    case this.keyCodes.UP:
                    case this.keyCodes.DOWN:
                        e.preventDefault();
                        this.triggerKeyDownEvent(keyCode);
                        break;
                    case this.keyCodes.TAB:
                        e.preventDefault();
                        this.triggerKeyDownEvent(this.keyCodes.ENTER);
                        break;
                }
            }
        }
        else {
            var trgtElem = e.target;
            if (trgtElem.id === this.parent.element.id + '_name_box') {
                switch (keyCode) {
                    case this.keyCodes.ENTER:
                        this.addDefinedName({ name: trgtElem.value });
                        this.parent.element.focus();
                        break;
                    case this.keyCodes.ESC:
                        this.parent.element.focus();
                        break;
                }
            }
        }
    };
    Formula.prototype.formulaClick = function (e) {
        if (this.parent.isEdit) {
            var trgtElem = e.target;
            this.isFormulaBar = trgtElem.classList.contains('e-formula-bar');
        }
    };
    Formula.prototype.refreshFormulaSuggestion = function (e, formula) {
        if (formula.length > 0) {
            var autoCompleteElem = this.autocompleteInstance.element;
            var keyCode = e.keyCode;
            var isSuggestionAlreadyOpened = this.isPopupOpened;
            if (!this.isNavigationKey(keyCode)) {
                autoCompleteElem.value = formula;
                autoCompleteElem.dispatchEvent(new Event('input'));
                autoCompleteElem.dispatchEvent(new Event('keyup'));
                if (isSuggestionAlreadyOpened) {
                    this.triggerKeyDownEvent(this.keyCodes.DOWN);
                }
            }
        }
        else {
            if (this.isPopupOpened) {
                this.isPreventClose = false;
                this.hidePopUp();
            }
        }
    };
    Formula.prototype.endEdit = function () {
        this.isSubFormula = false;
        this.isPreventClose = false;
        this.isFormula = false;
        this.isFormulaBar = false;
        if (this.isPopupOpened) {
            this.hidePopUp();
            var suggPopupElem = select('#' + this.parent.element.id + '_ac_popup');
            if (suggPopupElem) {
                detach(suggPopupElem);
            }
            this.isPopupOpened = false;
        }
    };
    Formula.prototype.hidePopUp = function () {
        this.autocompleteInstance.hidePopup();
    };
    Formula.prototype.getSuggestionKeyFromFormula = function (formula) {
        var suggestValue = '';
        formula = formula.substr(1); //remove = char.
        if (formula) {
            var bracketIndex = formula.lastIndexOf('(');
            formula = formula.substr(bracketIndex + 1);
            var fSplit = formula.split(this.getArgumentSeparator());
            if (fSplit.length === 1) {
                suggestValue = fSplit[0];
                this.isSubFormula = bracketIndex > -1;
            }
            else {
                suggestValue = fSplit[fSplit.length - 1];
                this.isSubFormula = true;
            }
            var isAlphaNumeric = suggestValue.match(/\w/);
            if (!isAlphaNumeric || (isAlphaNumeric && isAlphaNumeric.index !== 0)) {
                suggestValue = '';
            }
        }
        return suggestValue;
    };
    Formula.prototype.getPopupPosition = function () {
        var eventArgs = { position: null };
        if (this.isFormulaBar) {
            eventArgs.action = 'getPosition';
            this.parent.notify(formulaBarOperation, eventArgs);
        }
        else {
            eventArgs.action = 'getPosition';
            this.parent.notify(editOperation, eventArgs);
        }
        return eventArgs.position;
    };
    Formula.prototype.getEditingValue = function () {
        var eventArgs = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, eventArgs);
        return eventArgs.editedValue;
    };
    Formula.prototype.isNavigationKey = function (keyCode) {
        return (keyCode === this.keyCodes.UP) || (keyCode === this.keyCodes.DOWN) || (keyCode === this.keyCodes.LEFT)
            || (keyCode === this.keyCodes.RIGHT);
    };
    Formula.prototype.triggerKeyDownEvent = function (keyCode) {
        var autoCompleteElem = this.autocompleteInstance.element;
        autoCompleteElem.dispatchEvent(new Event('input'));
        var eventArg = new Event('keydown');
        // tslint:disable:no-string-literal
        eventArg['keyCode'] = keyCode;
        eventArg['which'] = keyCode;
        eventArg['altKey'] = false;
        eventArg['shiftKey'] = false;
        eventArg['ctrlKey'] = false;
        // tslint:enable:no-string-literal
        autoCompleteElem.dispatchEvent(eventArg);
    };
    Formula.prototype.getArgumentSeparator = function () {
        if (this.argumentSeparator) {
            return this.argumentSeparator;
        }
        else {
            var eventArgs = {
                action: 'getArgumentSeparator', argumentSeparator: ''
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            this.argumentSeparator = eventArgs.argumentSeparator;
            return eventArgs.argumentSeparator;
        }
    };
    Formula.prototype.getNames = function (sheetName) {
        var names = this.parent.definedNames.filter(function (name) { return name.scope === 'Workbook' || name.scope === '' || name.scope === sheetName; });
        return names;
    };
    Formula.prototype.getNameFromRange = function (range) {
        var singleRange = range.slice(0, range.indexOf(':'));
        var sRange = range.slice(range.indexOf('!') + 1).split(':');
        var isSingleCell = sRange.length > 1 && sRange[0] === sRange[1];
        var name = this.parent.definedNames.filter(function (name, index) {
            if (isSingleCell && name.refersTo === '=' + singleRange) {
                return true;
            }
            return name.refersTo === '=' + range;
        });
        return name && name[0];
    };
    Formula.prototype.addDefinedName = function (definedName) {
        var _this = this;
        var name = definedName.name;
        var isAdded = false;
        if (!definedName.refersTo) {
            var sheet = getSheet(this.parent, this.parent.activeSheetIndex);
            var sheetName = getSheetName(this.parent);
            sheetName = sheetName.indexOf(' ') !== -1 ? '\'' + sheetName + '\'' : sheetName;
            var selectRange = sheet.selectedRange;
            if (!isNullOrUndefined(selectRange)) {
                var colIndex = selectRange.indexOf(':');
                var left = selectRange.substr(0, colIndex);
                var right = selectRange.substr(colIndex + 1, selectRange.length);
                if (parseInt(right.replace(/\D/g, ''), 10) === sheet.rowCount && parseInt(left.replace(/\D/g, ''), 10) === 1) {
                    right = right.replace(/[0-9]/g, '');
                    left = left.replace(/[0-9]/g, '');
                    selectRange = '$' + left + ':$' + right;
                }
                else if (getCellIndexes(right)[1] === sheet.colCount - 1 && getCellIndexes(left)[1] === 0) {
                    right = right.replace(/\D/g, '');
                    left = left.replace(/\D/g, '');
                    selectRange = '$' + left + ':$' + right;
                }
                else {
                    selectRange = left === right ? left : selectRange;
                }
            }
            definedName.refersTo = sheetName + '!' + selectRange;
            definedName.scope = 'Workbook';
        }
        if (name.length > 0 && (/^([a-zA-Z_0-9.]){0,255}$/.test(name))) {
            var eventArgs = {
                action: 'addDefinedName', definedName: definedName, isAdded: false
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            isAdded = eventArgs.isAdded;
            if (!eventArgs.isAdded) {
                this.parent.serviceLocator.getService(dialog).show({
                    content: this.parent.serviceLocator.getService(locale).getConstant('DefineNameExists'),
                    width: '300',
                    beforeOpen: function (args) {
                        var dlgArgs = {
                            dialogName: 'DefineNameExistsDialog',
                            element: args.element, target: args.target, cancel: args.cancel
                        };
                        _this.parent.trigger('dialogBeforeOpen', dlgArgs);
                        if (dlgArgs.cancel) {
                            args.cancel = true;
                        }
                    },
                });
            }
        }
        else {
            this.parent.serviceLocator.getService(dialog).show({
                content: this.parent.serviceLocator.getService(locale).getConstant('DefineNameInValid'),
                width: '300',
                beforeOpen: function (args) {
                    var dlgArgs = {
                        dialogName: 'DefineNameInValidDialog',
                        element: args.element, target: args.target, cancel: args.cancel
                    };
                    _this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        args.cancel = true;
                    }
                },
            });
        }
        return isAdded;
    };
    return Formula;
}());
export { Formula };
