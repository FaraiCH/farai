import { EventHandler, Browser, closest, isUndefined, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { getRangeIndexes, getRangeFromAddress, getIndexesFromAddress, getRangeAddress, isSingleCell } from '../../workbook/common/address';
import { keyDown, editOperation, clearCopy, mouseDown, selectionComplete, enableToolbarItems, completeAction } from '../common/event';
import { formulaBarOperation, formulaOperation, setActionData, keyUp, getCellPosition, deleteImage } from '../common/index';
import { workbookEditOperation, getFormattedBarText, getFormattedCellObject, wrapEvent, isValidation } from '../../workbook/common/event';
import { getSheetName, getSheetIndex, getCell, getColumn } from '../../workbook/base/index';
import { getSheetNameFromAddress, getSheet } from '../../workbook/base/index';
import { hasTemplate, editAlert } from '../common/index';
import { getSwapRange, getCellIndexes, wrap as wrapText, checkIsFormula, dataChanged, isNumber, isLocked } from '../../workbook/index';
import { checkConditionalFormat, initiateFormulaReference, initiateCur, clearCellRef, addressHandle } from '../common/event';
import { editValue, initiateEdit, forRefSelRender, isFormulaBarEdit, deleteChart } from '../common/event';
/**
 * The `Protect-Sheet` module is used to handle the Protecting functionalities in Spreadsheet.
 */
var Edit = /** @class */ (function () {
    /**
     * Constructor for protect-sheet module in Spreadsheet.
     * @private
     */
    function Edit(parent) {
        this.editorElem = null;
        this.editCellData = {};
        this.isEdit = false;
        this.isCellEdit = true;
        this.isNewValueEdit = true;
        this.isAltEnter = false;
        this.validCharacters = ['+', '-', '*', '/', ',', '(', '=', '&'];
        this.keyCodes = {
            BACKSPACE: 8,
            SPACE: 32,
            TAB: 9,
            DELETE: 46,
            ESC: 27,
            ENTER: 13,
            FIRSTALPHABET: 65,
            LASTALPHABET: 90,
            FIRSTNUMBER: 48,
            LASTNUMBER: 59,
            FIRSTNUMPAD: 96,
            LASTNUMPAD: 111,
            SYMBOLSETONESTART: 186,
            SYMBOLSETONEEND: 192,
            SYMBOLSETTWOSTART: 219,
            SYMBOLSETTWOEND: 222,
            FIREFOXEQUALPLUS: 61,
            FIREFOXMINUS: 173,
            F2: 113
        };
        this.parent = parent;
        this.init();
        //Spreadsheet.Inject(WorkbookEdit);
    }
    Edit.prototype.init = function () {
        this.addEventListener();
    };
    /**
     * To destroy the edit module.
     * @return {void}
     * @hidden
     */
    Edit.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
        this.editorElem = null;
    };
    Edit.prototype.addEventListener = function () {
        EventHandler.add(this.parent.element, 'dblclick', this.dblClickHandler, this);
        this.parent.on(mouseDown, this.mouseDownHandler, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(keyDown, this.keyDownHandler, this);
        this.parent.on(editOperation, this.performEditOperation, this);
        this.parent.on(initiateCur, this.initiateCurPosition, this);
        this.parent.on(editValue, this.updateFormulaBarValue, this);
        this.parent.on(addressHandle, this.addressHandler, this);
        this.parent.on(initiateEdit, this.initiateRefSelection, this);
        this.parent.on(forRefSelRender, this.refSelectionRender, this);
    };
    Edit.prototype.removeEventListener = function () {
        EventHandler.remove(this.parent.element, 'dblclick', this.dblClickHandler);
        if (!this.parent.isDestroyed) {
            this.parent.off(mouseDown, this.mouseDownHandler);
            this.parent.off(keyUp, this.keyUpHandler);
            this.parent.off(keyDown, this.keyDownHandler);
            this.parent.off(editOperation, this.performEditOperation);
            this.parent.off(initiateCur, this.initiateCurPosition);
            this.parent.off(editValue, this.updateFormulaBarValue);
            this.parent.off(addressHandle, this.addressHandler);
            this.parent.off(initiateEdit, this.initiateRefSelection);
            this.parent.off(forRefSelRender, this.refSelectionRender);
        }
    };
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    Edit.prototype.getModuleName = function () {
        return 'edit';
    };
    Edit.prototype.performEditOperation = function (args) {
        var action = args.action;
        switch (action) {
            case 'renderEditor':
                this.renderEditor();
                break;
            case 'refreshEditor':
                this.refreshEditor(args.value, args.refreshFormulaBar, args.refreshEditorElem, args.isAppend, args.trigEvent);
                if (args.refreshCurPos) {
                    this.setCursorPosition();
                }
                break;
            case 'startEdit':
                if (!this.isEdit) {
                    this.isNewValueEdit = args.isNewValueEdit;
                    this.startEdit(args.address, args.value, args.refreshCurPos);
                }
                else {
                    var isEdit = false;
                    var arg = { isEdit: isEdit };
                    this.parent.notify(isFormulaBarEdit, arg);
                    if (arg.isEdit) {
                        this.isNewValueEdit = args.isNewValueEdit;
                        this.startEdit(args.address, args.value, args.refreshCurPos);
                    }
                }
                break;
            case 'endEdit':
                if (this.isEdit) {
                    this.endEdit(args.refreshFormulaBar);
                }
                break;
            case 'cancelEdit':
                if (this.isEdit) {
                    this.cancelEdit(args.refreshFormulaBar);
                }
                break;
            case 'getCurrentEditValue':
                args.editedValue = this.editCellData.value;
                break;
            case 'refreshDependentCellValue':
                this.refreshDependentCellValue(args.rowIdx, args.colIdx, args.sheetIdx);
                break;
            case 'getPosition':
                args.position = this.editorElem.getBoundingClientRect();
                break;
            case 'focusEditorElem':
                this.editorElem.focus();
                break;
            case 'getCurrentEditSheetIdx':
                args.sheetIndex = this.editCellData.sheetIndex;
                break;
        }
    };
    Edit.prototype.keyUpHandler = function (e) {
        if (this.isEdit) {
            if (e.altKey && e.keyCode === 13) {
                var editElement = this.parent.element.querySelector('.e-spreadsheet-edit');
                editElement.focus();
                this.altEnter();
                this.isAltEnter = true;
            }
            else if (this.isCellEdit && this.editCellData.value !== this.editorElem.textContent && e.keyCode !== 16) {
                this.refreshEditor(this.editorElem.textContent, this.isCellEdit);
            }
            var isFormulaEdit = checkIsFormula(this.editCellData.value) ||
                (this.editCellData.value && this.editCellData.value.toString().indexOf('=') === 0);
            if (isFormulaEdit && e.keyCode !== 16) {
                var formulaRefIndicator = this.parent.element.querySelector('.e-formularef-indicator');
                if (formulaRefIndicator) {
                    formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                }
                if (this.editCellData.value !== this.editorElem.textContent) {
                    this.refreshEditor(this.editorElem.textContent, true);
                }
                var sheetIdx = this.editCellData.sheetIndex;
                var editValue_1 = this.editCellData.value;
                this.parent.notify(initiateFormulaReference, { range: editValue_1, formulaSheetIdx: sheetIdx });
            }
        }
    };
    Edit.prototype.keyDownHandler = function (e) {
        var trgtElem = e.target;
        var keyCode = e.keyCode;
        var sheet = this.parent.getActiveSheet();
        var actCell = getCellIndexes(sheet.activeCell);
        var cell = getCell(actCell[0], actCell[1], sheet) || {};
        if (!closest(e.target, '.e-findtool-dlg') && !closest(e.target, '.e-validationerror-dlg')) {
            if (!sheet.isProtected || closest(e.target, '.e-sheet-rename') || !isLocked(cell, getColumn(sheet, actCell[1]))) {
                if (this.isEdit) {
                    var isFormulaEdit = checkIsFormula(this.editCellData.value) ||
                        (this.editCellData.value && this.editCellData.value.toString().indexOf('=') === 0);
                    if (this.isCellEdit || (isFormulaEdit && this.editCellData.value !== this.editorElem.textContent && e.keyCode !== 16)) {
                        this.refreshEditor(this.editorElem.textContent, this.isCellEdit);
                    }
                    if (!e.altKey) {
                        switch (keyCode) {
                            case this.keyCodes.ENTER:
                                if (Browser.isWindows) {
                                    e.preventDefault();
                                }
                                if (this.isAltEnter) {
                                    var text = this.parent.element.querySelector('.e-spreadsheet-edit').textContent;
                                    if (text && text.indexOf('\n') > -1) {
                                        wrapText(this.parent.getActiveSheet().selectedRange, true, this.parent);
                                        this.refreshEditor(this.editorElem.textContent, this.isCellEdit);
                                        this.isAltEnter = false;
                                    }
                                }
                                if (!isFormulaEdit) {
                                    this.endEdit(false, e);
                                }
                                else {
                                    var formulaRefIndicator = this.parent.element.querySelector('.e-formularef-indicator');
                                    if (formulaRefIndicator) {
                                        formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                    }
                                    if (this.editCellData.sheetIndex === sheet.id - 1) {
                                        this.endEdit(false, e);
                                    }
                                    else {
                                        this.parent.goTo(this.editCellData.fullAddr);
                                        this.endEdit(false, e);
                                    }
                                }
                                break;
                            case this.keyCodes.TAB:
                                if (!this.hasFormulaSuggSelected()) {
                                    this.endEdit(false, e);
                                }
                                break;
                            case this.keyCodes.ESC:
                                this.cancelEdit(true, true, e);
                                break;
                        }
                    }
                }
                else {
                    if (!this.isEdit && (trgtElem.classList.contains('e-spreadsheet') || closest(trgtElem, '.e-sheet-panel'))) {
                        var isAlphabet = (keyCode >= this.keyCodes.FIRSTALPHABET && keyCode <= this.keyCodes.LASTALPHABET);
                        var isNumeric = (keyCode >= this.keyCodes.FIRSTNUMBER && keyCode <= this.keyCodes.LASTNUMBER);
                        var isNumpadKeys = (keyCode >= this.keyCodes.FIRSTNUMPAD && keyCode <= this.keyCodes.LASTNUMPAD);
                        var isSymbolkeys = (keyCode >= this.keyCodes.SYMBOLSETONESTART &&
                            keyCode <= this.keyCodes.SYMBOLSETONEEND);
                        if (!isSymbolkeys) {
                            isSymbolkeys = (keyCode >= this.keyCodes.SYMBOLSETTWOSTART && keyCode <= this.keyCodes.SYMBOLSETTWOEND);
                        }
                        var isFirefoxExceptionkeys = (keyCode === this.keyCodes.FIREFOXEQUALPLUS) ||
                            (keyCode === this.keyCodes.FIREFOXMINUS);
                        var isF2Edit = (!e.shiftKey && !e.ctrlKey && !e.metaKey && keyCode === this.keyCodes.F2);
                        var isBackSpace = keyCode === this.keyCodes.BACKSPACE;
                        if ((!e.ctrlKey && !e.metaKey && !e.altKey && ((!e.shiftKey && keyCode === this.keyCodes.SPACE) || isAlphabet || isNumeric ||
                            isNumpadKeys || isSymbolkeys || (Browser.info.name === 'mozilla' && isFirefoxExceptionkeys))) || isF2Edit || isBackSpace) {
                            if (isF2Edit) {
                                this.isNewValueEdit = false;
                            }
                            var pictureElements = document.getElementsByClassName('e-ss-overlay-active');
                            var pictureLen = pictureElements.length;
                            if (pictureLen > 0) {
                                this.parent.notify(deleteImage, {
                                    id: pictureElements[0].id, sheetIdx: this.parent.activeSheetIndex + 1
                                });
                            }
                            else {
                                this.startEdit();
                            }
                        }
                        if (keyCode === this.keyCodes.DELETE) {
                            this.editingHandler('delete');
                        }
                    }
                }
            }
            else {
                if (((keyCode >= this.keyCodes.FIRSTALPHABET && keyCode <= this.keyCodes.LASTALPHABET) ||
                    (keyCode >= this.keyCodes.FIRSTNUMBER && keyCode <= this.keyCodes.LASTNUMBER)
                    || (keyCode === this.keyCodes.DELETE) || (keyCode === this.keyCodes.BACKSPACE) || (keyCode === this.keyCodes.SPACE)
                    || (keyCode >= this.keyCodes.FIRSTNUMPAD && keyCode <= this.keyCodes.LASTNUMPAD) ||
                    (keyCode >= this.keyCodes.SYMBOLSETONESTART && keyCode <= this.keyCodes.SYMBOLSETONEEND)
                    || (keyCode >= 219 && keyCode <= 222) || (!e.shiftKey && !e.ctrlKey && !e.metaKey && keyCode === this.keyCodes.F2))
                    && (keyCode !== 67) && (keyCode !== 89) && (keyCode !== 90)) {
                    if (sheet.protectSettings.insertLink && keyCode === 75) {
                        return;
                    }
                    if (!this.parent.element.querySelector('.e-editAlert-dlg')) {
                        this.parent.notify(editAlert, null);
                    }
                }
            }
        }
    };
    Edit.prototype.renderEditor = function () {
        if (!this.editorElem || !select('#' + this.parent.element.id + '_edit', this.parent.element)) {
            var editor = void 0;
            editor = this.parent.createElement('div', { id: this.parent.element.id + '_edit', className: 'e-spreadsheet-edit' });
            editor.contentEditable = 'true';
            editor.spellcheck = false;
            this.editorElem = editor;
            if (this.parent.element.getElementsByClassName('e-spreadsheet-edit')[0]) {
                this.parent.element.getElementsByClassName('e-spreadsheet-edit')[0].remove();
            }
            this.parent.element.querySelector('.e-sheet-content').appendChild(this.editorElem);
        }
        this.parent.notify(formulaOperation, { action: 'renderAutoComplete' });
    };
    Edit.prototype.refreshEditor = function (value, refreshFormulaBar, refreshEditorElem, isAppend, trigEvent) {
        if (trigEvent === void 0) { trigEvent = true; }
        if (isAppend) {
            value = this.editCellData.value = this.editCellData.value + value;
        }
        else {
            this.editCellData.value = value;
        }
        if (refreshEditorElem) {
            this.editorElem.textContent = value;
        }
        if (refreshFormulaBar) {
            this.parent.notify(formulaBarOperation, { action: 'refreshFormulabar', value: value });
        }
        if (trigEvent && this.editCellData.value === this.editorElem.textContent) {
            if (this.triggerEvent('cellEditing')) {
                this.cancelEdit();
            }
        }
        // if (this.editorElem.scrollHeight + 2 <= this.editCellData.element.offsetHeight) {
        //     this.editorElem.style.height = (this.editCellData.element.offsetHeight + 1) + 'px';
        // } else {
        //     this.editorElem.style.removeProperty('height');
        // }
    };
    Edit.prototype.startEdit = function (address, value, refreshCurPos) {
        if (refreshCurPos === void 0) { refreshCurPos = true; }
        this.parent.element.querySelector('.e-add-sheet-tab').setAttribute('disabled', 'true');
        var sheet = this.parent.getActiveSheet();
        var actCell = getCellIndexes(sheet.activeCell);
        var cell = getCell(actCell[0], actCell[1], sheet) || {};
        var range = getRangeIndexes(this.parent.getActiveSheet().activeCell);
        if (hasTemplate(this.parent, range[0], range[1], this.parent.activeSheetIndex)) {
            var cellEle = this.parent.getCell(range[0], range[1]);
            var isDelTemplate = false;
            var value_1 = cellEle.innerHTML;
            if (cellEle) {
                if (value_1.indexOf('<') > -1 && value_1.indexOf('>') > -1 && value_1.indexOf('input') > -1) {
                    isDelTemplate = true;
                }
            }
            if (isDelTemplate) {
                return;
            }
        }
        this.updateEditCellDetail(address, value);
        this.initiateEditor(refreshCurPos);
        this.positionEditor();
        this.parent.isEdit = this.isEdit = true;
        this.parent.notify(clearCopy, null);
        this.parent.notify(enableToolbarItems, [{ enable: false }]);
        if (cell.formula) {
            var sheetIdx = this.editCellData.sheetIndex;
            this.parent.notify(initiateFormulaReference, { range: cell.formula, formulaSheetIdx: sheetIdx });
        }
    };
    Edit.prototype.setCursorPosition = function () {
        var elem = this.editorElem;
        var textLen = elem.textContent.length;
        if (textLen) {
            var selection = document.getSelection();
            var range = document.createRange();
            range.setStart(elem.firstChild, textLen);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        elem.focus();
    };
    Edit.prototype.hasFormulaSuggSelected = function () {
        var suggDdlElem = document.getElementById(this.parent.element.id + '_ac_popup');
        return suggDdlElem && suggDdlElem.style.visibility === 'visible' &&
            suggDdlElem.querySelectorAll('.e-item-focus').length > 0;
    };
    Edit.prototype.editingHandler = function (action) {
        var pictureElements = document.getElementsByClassName('e-ss-overlay-active');
        var pictureLen = pictureElements.length;
        switch (action) {
            case 'delete':
                if (pictureLen > 0) {
                    if (pictureElements[0].classList.contains('e-datavisualization-chart')) {
                        this.parent.notify(deleteChart, {
                            id: pictureElements[0].id, sheetIdx: this.parent.activeSheetIndex + 1
                        });
                    }
                    else {
                        this.parent.notify(deleteImage, {
                            id: pictureElements[0].id, sheetIdx: this.parent.activeSheetIndex + 1
                        });
                    }
                }
                else {
                    var address = this.parent.getActiveSheet().selectedRange;
                    var range = getIndexesFromAddress(address);
                    range = range[0] > range[2] ? getSwapRange(range) : range;
                    address = getRangeAddress(range);
                    this.parent.clearRange(address, null, true);
                    this.parent.serviceLocator.getService('cell').refreshRange(range);
                    this.parent.notify(selectionComplete, {});
                    this.parent.notify(dataChanged, { address: address, sheetIdx: this.parent.activeSheetIndex, action: 'delete' });
                }
                break;
        }
    };
    Edit.prototype.mouseDownHandler = function (e) {
        if (!closest(e.target, '.e-findtool-dlg')) {
            if (this.isEdit) {
                var trgtElem = e.target;
                var sheet = this.parent.getActiveSheet();
                var formulaRefIndicator = this.parent.element.querySelector('.e-formularef-indicator');
                this.isCellEdit = trgtElem.classList.contains('e-spreadsheet-edit');
                var isFormula = checkIsFormula(this.editCellData.value) ||
                    (this.editCellData.value && this.editCellData.value.toString().indexOf('=') === 0);
                if (trgtElem.classList.contains('e-cell') || trgtElem.classList.contains('e-header-cell') ||
                    trgtElem.classList.contains('e-selectall') || closest(trgtElem, '.e-toolbar-item.e-active')) {
                    if (this.isAltEnter) {
                        var editText = this.parent.element.querySelector('.e-spreadsheet-edit').textContent;
                        if (editText && editText.indexOf('\n') > -1) {
                            this.isAltEnter = false;
                            wrapText(this.parent.getActiveSheet().selectedRange, true, this.parent);
                            this.refreshEditor(this.editorElem.textContent, this.isCellEdit);
                        }
                    }
                    if (!isFormula) {
                        this.endEdit(false, e);
                    }
                    else {
                        var curPos = window.getSelection().focusOffset;
                        var actCellIdx = getCellIndexes(sheet.activeCell);
                        var cell = getCell(actCellIdx[0], actCellIdx[1], sheet);
                        if (this.editCellData.value === this.editorElem.textContent && (this.editorElem.textContent.indexOf('(') !==
                            this.editorElem.textContent.length - 1 && this.editorElem.textContent.indexOf('(') !== -1)) {
                            if (this.editCellData.sheetIndex !== sheet.id - 1) {
                                var elem = this.parent.element.querySelector('.e-formula-bar');
                                if (this.editorElem.textContent.substring(elem.selectionEnd - 1, elem.selectionEnd) !== ',' &&
                                    !e.shiftKey) {
                                    if (formulaRefIndicator) {
                                        formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                    }
                                    this.parent.goTo(this.editCellData.fullAddr);
                                    this.endEdit(false, e);
                                    return;
                                }
                            }
                            else {
                                if (this.validCharacters.indexOf(this.editorElem.textContent.substring(curPos - 1, curPos)) === -1) {
                                    if (formulaRefIndicator) {
                                        formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                    }
                                    this.endEdit(false, e);
                                    return;
                                }
                            }
                        }
                        if (!cell) {
                            return;
                        }
                        isFormula = cell.formula ?
                            checkIsFormula(getCell(actCellIdx[0], actCellIdx[1], sheet).formula) ||
                                (this.editCellData.value && this.editCellData.value.toString().indexOf('=') === 0) : false;
                        if (isFormula) {
                            var curPos_1 = window.getSelection().focusOffset;
                            if (this.editCellData.value.length === curPos_1) {
                                if (this.editCellData.value.substring(this.editCellData.value.length - 1) === ')' ||
                                    isNumber(this.editCellData.value.substring(this.editCellData.value.length - 1))) {
                                    if (formulaRefIndicator) {
                                        formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                    }
                                    this.endEdit(false, e);
                                }
                            }
                            else if (this.editCellData.value === this.editorElem.textContent) {
                                if ((this.editCellData.value + sheet.selectedRange).substring(curPos_1 - 1, curPos_1) !== ',') {
                                    if (formulaRefIndicator) {
                                        formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                    }
                                    this.endEdit(false, e);
                                }
                                else if (this.editCellData.value.substring(curPos_1) !== ')') {
                                    if (formulaRefIndicator) {
                                        formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                    }
                                    this.endEdit(false, e);
                                }
                            }
                        }
                    }
                }
                else {
                    if (isFormula && this.editCellData.value === this.editorElem.textContent && this.editorElem.textContent.indexOf('(') !==
                        this.editorElem.textContent.length - 1) {
                        if (this.editCellData.sheetIndex === sheet.id - 1) {
                            var curPos = window.getSelection().focusOffset;
                            if (this.validCharacters.indexOf(this.editorElem.textContent.substring(curPos - 1, curPos)) === -1) {
                                if (formulaRefIndicator) {
                                    formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                }
                                this.parent.goTo(this.editCellData.fullAddr);
                                this.endEdit(false, e);
                                return;
                            }
                        }
                    }
                }
            }
        }
    };
    Edit.prototype.dblClickHandler = function (e) {
        var trgtElem = e.target;
        var sheet = this.parent.getActiveSheet();
        var actCell = getCellIndexes(sheet.activeCell);
        var cell = getCell(actCell[0], actCell[1], sheet) || {};
        if (closest(trgtElem, '.e-datavisualization-chart')) {
            return;
        }
        if (!sheet.isProtected || !isLocked(cell, getColumn(sheet, actCell[1]))) {
            if ((trgtElem.className.indexOf('e-ss-overlay') < 0) &&
                (trgtElem.classList.contains('e-active-cell') || trgtElem.classList.contains('e-cell')
                    || closest(trgtElem, '.e-sheet-content'))) {
                if (this.isEdit) {
                    if (checkIsFormula(this.editCellData.value)) {
                        var sheetName = this.editCellData.fullAddr.substring(0, this.editCellData.fullAddr.indexOf('!'));
                        if (this.parent.getActiveSheet().name === sheetName) {
                            this.endEdit();
                        }
                    }
                    else {
                        this.endEdit();
                    }
                }
                else {
                    this.isNewValueEdit = false;
                    this.startEdit();
                }
            }
        }
        else {
            if (trgtElem.classList.contains('e-active-cell') || trgtElem.classList.contains('e-cell')) {
                this.parent.notify(editAlert, null);
            }
        }
    };
    Edit.prototype.updateEditCellDetail = function (addr, value) {
        var sheetIdx;
        var sheet;
        if (!this.editCellData.sheetIndex) {
            if (addr && addr.split('!').length > 1) {
                sheetIdx = getSheetIndex(this.parent, getSheetNameFromAddress(addr));
            }
            else {
                sheetIdx = this.parent.activeSheetIndex;
            }
        }
        if (!this.editCellData.addr) {
            sheet = getSheet(this.parent, sheetIdx);
            if (addr) {
                addr = getRangeFromAddress(addr);
            }
            else {
                addr = sheet.activeCell;
            }
        }
        else if (checkIsFormula(this.editCellData.value)) {
            sheet = getSheet(this.parent, sheetIdx);
            this.isNewValueEdit = false;
        }
        if (addr) {
            var range = getRangeIndexes(addr);
            var rowIdx = range[0];
            var colIdx = range[1];
            var cellElem = this.parent.getCell(rowIdx, colIdx);
            var cellPosition = getCellPosition(sheet, range);
            this.editCellData = {
                addr: addr,
                fullAddr: getSheetName(this.parent, sheetIdx) + '!' + addr,
                rowIndex: rowIdx,
                colIndex: colIdx,
                sheetIndex: sheetIdx,
                element: cellElem,
                value: value || '',
                position: cellPosition
            };
        }
    };
    Edit.prototype.initiateEditor = function (refreshCurPos) {
        var _this = this;
        var data = this.parent.getData(this.editCellData.fullAddr);
        data.then(function (values) {
            values.forEach(function (cell, key) {
                var args = { cell: cell, value: cell ? cell.value : '' };
                _this.parent.notify(getFormattedBarText, args);
                var value = cell ? args.value : '';
                if (cell && cell.formula) {
                    value = cell.formula;
                }
                _this.editCellData.oldValue = value;
                if (_this.editCellData.value) {
                    value = _this.editCellData.value;
                }
                else {
                    _this.editCellData.value = value;
                }
                if (_this.isNewValueEdit) {
                    value = '';
                }
                else {
                    _this.isNewValueEdit = true;
                }
                if (!isUndefined(value)) {
                    _this.refreshEditor(value, false, true, false, false);
                }
                if (refreshCurPos) {
                    _this.setCursorPosition();
                }
                if (_this.triggerEvent('cellEdit')) {
                    _this.cancelEdit(true, false);
                }
            });
        });
    };
    Edit.prototype.positionEditor = function (isWrap) {
        var tdElem = this.editCellData.element;
        var isEdit = false;
        var cellEle;
        var arg = { isEdit: isEdit };
        this.parent.notify(isFormulaBarEdit, arg);
        if (arg.isEdit && isNullOrUndefined(tdElem)) {
            cellEle = this.parent.getCell(this.editCellData.rowIndex, this.editCellData.colIndex);
            tdElem = cellEle;
            this.editCellData.element = cellEle;
        }
        if (tdElem) {
            tdElem.classList.add('e-ss-edited');
            var cell = getCell(this.editCellData.rowIndex, this.editCellData.colIndex, this.parent.getActiveSheet());
            var left = this.editCellData.position.left + 1;
            var top_1 = this.editCellData.position.top + 1;
            var minHeight = this.parent.getRow(this.editCellData.rowIndex).offsetHeight - 3;
            var minWidth = this.editCellData.element.offsetWidth - 3;
            var mainContElement = this.parent.getMainContent();
            var editWidth = mainContElement.offsetWidth - left - 28;
            var height = ((cell && cell.wrap) || (tdElem && isWrap)) ? 'height:auto' : (minHeight) + 'px;';
            // let editHeight: number = mainContElement.offsetHeight - top - 28;
            var inlineStyles = 'display:block;top:' + top_1 + 'px;' + (this.parent.enableRtl ? 'right:' : 'left:') + left + 'px;' +
                'min-width:' + minWidth + 'px;max-width:' + editWidth + 'px;' + 'height:' + height +
                ((cell && cell.wrap) ? ('width:' + minWidth + 'px;') : '') + 'min-height:' + minHeight + 'px;';
            inlineStyles += tdElem.style.cssText;
            this.editorElem.setAttribute('style', inlineStyles);
            this.parent.element.querySelector('.e-active-cell').style.height =
                (this.editCellData.element.offsetHeight + 1) + 'px'; // we using edit div height as auto , while editing div enlarges and 
            // hide active cell bottom border for that we increasing 1px height to active cell.
            if (tdElem.classList.contains('e-right-align')) {
                this.editorElem.classList.add('e-right-align');
            }
            else if (tdElem.classList.contains('e-center-align')) {
                this.editorElem.classList.add('e-center-align');
            }
        }
    };
    Edit.prototype.updateEditedValue = function (tdRefresh) {
        if (tdRefresh === void 0) { tdRefresh = true; }
        var oldCellValue = this.editCellData.oldValue;
        var oldValue = oldCellValue ? oldCellValue.toString().toUpperCase() : '';
        var isValidate = true;
        var address = this.editCellData.addr;
        var cellIndex = getRangeIndexes(this.parent.getActiveSheet().activeCell);
        var sheet = this.parent.getActiveSheet();
        var cell = getCell(cellIndex[0], cellIndex[1], sheet);
        /* To set the before cell details for undo redo. */
        this.parent.notify(setActionData, { args: { action: 'beforeCellSave', eventArgs: { address: this.editCellData.addr } } });
        if (this.parent.allowDataValidation && cell && cell.validation) {
            var value = this.parent.element.getElementsByClassName('e-spreadsheet-edit')[0].innerText;
            var isCell = true;
            var sheetIdx = this.parent.activeSheetIndex;
            var range = void 0;
            if (typeof address === 'string') {
                range = getRangeIndexes(address);
            }
            else {
                range = address;
            }
            this.parent.notify(isValidation, { value: value, range: range, sheetIdx: sheetIdx, isCell: isCell });
            isValidate = this.parent.allowDataValidation;
            this.editCellData.value = isValidate ? value : this.editCellData.value;
            this.parent.allowDataValidation = true;
        }
        if ((oldCellValue !== this.editCellData.value || oldValue.indexOf('=RAND()') > -1 || oldValue.indexOf('RAND()') > -1 ||
            oldValue.indexOf('=RANDBETWEEN(') > -1 || oldValue.indexOf('RANDBETWEEN(') > -1) && isValidate) {
            var sheet_1 = this.parent.getActiveSheet();
            var cellIndex_1 = getRangeIndexes(sheet_1.activeCell);
            this.parent.notify(workbookEditOperation, { action: 'updateCellValue', address: this.editCellData.addr, value: this.editCellData.value });
            var cell_1 = getCell(cellIndex_1[0], cellIndex_1[1], sheet_1, true);
            var eventArgs = this.getRefreshNodeArgs(cell_1);
            this.editCellData.value = eventArgs.value;
            if (cell_1 && cell_1.formula) {
                this.editCellData.formula = cell_1.formula;
            }
            if (cell_1.wrap) {
                this.parent.notify(wrapEvent, { range: cellIndex_1, wrap: true, sheet: sheet_1 });
            }
            if (tdRefresh) {
                this.parent.refreshNode(this.editCellData.element, eventArgs);
            }
        }
        if (this.parent.allowConditionalFormat) {
            this.parent.notify(checkConditionalFormat, { rowIdx: cellIndex[0], colIdx: cellIndex[1], cell: cell });
        }
        return isValidate;
    };
    Edit.prototype.refreshDependentCellValue = function (rowIdx, colIdx, sheetIdx) {
        if (rowIdx && colIdx) {
            rowIdx--;
            colIdx--;
            if ((this.editCellData.rowIndex !== rowIdx || this.editCellData.colIndex !== colIdx)
                && this.parent.activeSheetIndex === sheetIdx) {
                var td = this.parent.getCell(rowIdx, colIdx);
                if (td) {
                    var sheet = getSheet(this.parent, sheetIdx);
                    var cell = getCell(rowIdx, colIdx, sheet);
                    var eventArgs = this.getRefreshNodeArgs(cell);
                    this.parent.refreshNode(td, eventArgs);
                }
            }
        }
    };
    Edit.prototype.getRefreshNodeArgs = function (cell) {
        cell = cell ? cell : {};
        var fCode = (cell && cell.format) ? cell.format : '';
        var eventArgs = {
            value: cell.value, format: fCode, onLoad: true,
            formattedText: '', isRightAlign: false, type: 'General'
        };
        var args;
        this.parent.notify(getFormattedCellObject, eventArgs);
        eventArgs.formattedText = this.parent.allowNumberFormatting ? eventArgs.formattedText : eventArgs.value;
        args = {
            isRightAlign: eventArgs.isRightAlign,
            result: eventArgs.formattedText,
            type: eventArgs.type,
            value: eventArgs.value,
            curSymbol: eventArgs.curSymbol
        };
        return args;
    };
    Edit.prototype.endEdit = function (refreshFormulaBar, event) {
        if (refreshFormulaBar === void 0) { refreshFormulaBar = false; }
        if (refreshFormulaBar) {
            this.refreshEditor(this.editCellData.oldValue, false, true, false, false);
        }
        if (this.triggerEvent('beforeCellSave')) {
            event.preventDefault();
            return;
        }
        var isValidate = this.updateEditedValue();
        if (isValidate) {
            this.triggerEvent('cellSave', event);
            this.resetEditState();
            this.focusElement();
        }
        else if (event) {
            event.preventDefault();
        }
        this.parent.element.querySelector('.e-add-sheet-tab').removeAttribute('disabled');
    };
    Edit.prototype.cancelEdit = function (refreshFormulaBar, trigEvent, event) {
        if (refreshFormulaBar === void 0) { refreshFormulaBar = true; }
        if (trigEvent === void 0) { trigEvent = true; }
        this.refreshEditor(this.editCellData.oldValue, refreshFormulaBar, false, false, false);
        if (trigEvent) {
            this.triggerEvent('cellSave', event);
        }
        this.resetEditState();
        this.focusElement();
    };
    Edit.prototype.focusElement = function () {
        this.parent.element.focus();
        this.parent.notify(enableToolbarItems, [{ enable: true }]);
    };
    Edit.prototype.triggerEvent = function (eventName, event) {
        var cell = getCell(this.editCellData.rowIndex, this.editCellData.colIndex, this.parent.getActiveSheet());
        var eventArgs = {
            element: this.editCellData.element,
            value: this.editCellData.value,
            oldValue: this.editCellData.oldValue,
            address: this.editCellData.fullAddr,
            displayText: this.parent.getDisplayText(cell)
        };
        if (eventName === 'cellSave') {
            if (this.editCellData.formula) {
                eventArgs.formula = this.editCellData.formula;
            }
            eventArgs.originalEvent = event;
            this.parent.notify(dataChanged, eventArgs);
            this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'cellSave' });
        }
        if (eventName !== 'cellSave') {
            eventArgs.cancel = false;
        }
        this.parent.trigger(eventName, eventArgs);
        return eventArgs.cancel;
    };
    Edit.prototype.altEnter = function () {
        this.positionEditor(true);
        var text;
        var textBefore;
        var textAfter;
        var selection = window.getSelection();
        var node = selection.anchorNode;
        var offset;
        var range = document.createRange();
        offset = (node.nodeType === 3) ? selection.anchorOffset : node.textContent.length;
        if (offset === 0 && node.textContent.length > 0) {
            offset = node.textContent.length;
        }
        text = node.textContent;
        textBefore = text.slice(0, offset);
        textAfter = text.slice(offset) || ' ';
        node.textContent = textBefore + '\n' + textAfter;
        range = document.createRange();
        if (node.nodeType === 3) {
            range.setStart(node, offset + 1);
            range.setEnd(node, offset + 1);
        }
        else if (node.nodeType === 1) {
            range.setStart(node.firstChild, offset + 1);
            range.setEnd(node.firstChild, offset + 1);
        }
        selection.removeAllRanges();
        selection.addRange(range);
    };
    Edit.prototype.resetEditState = function (elemRefresh) {
        if (elemRefresh === void 0) { elemRefresh = true; }
        if (elemRefresh) {
            if (checkIsFormula(this.editorElem.textContent)) {
                this.parent.notify(clearCellRef, null);
            }
            if (this.editCellData.element) {
                this.editCellData.element.classList.remove('e-ss-edited');
                this.editorElem.textContent = '';
                this.editorElem.removeAttribute('style');
                this.editorElem.classList.remove('e-right-align');
            }
        }
        this.editCellData = {};
        this.parent.isEdit = this.isEdit = false;
        this.isCellEdit = true;
        this.parent.notify(formulaOperation, { action: 'endEdit' });
    };
    Edit.prototype.refSelectionRender = function () {
        if (checkIsFormula(this.editorElem.textContent)) {
            this.parent.notify(initiateFormulaReference, {
                range: this.editorElem.textContent, formulaSheetIdx: this.editCellData.sheetIndex
            });
        }
    };
    // Start edit the formula cell and set cursor position
    Edit.prototype.initiateRefSelection = function () {
        var sheetName = this.editCellData.fullAddr.substring(0, this.editCellData.fullAddr.indexOf('!'));
        var value = this.parent.element.querySelector('.e-formula-bar').value;
        if (this.parent.getActiveSheet().name === sheetName && checkIsFormula(this.editCellData.value)) {
            this.startEdit(this.editCellData.addr, value, false);
            this.parent.notify(initiateFormulaReference, {
                range: this.editCellData.value, formulaSheetIdx: this.editCellData.sheetIndex
            });
            this.parent.element.querySelector('.e-spreadsheet-edit').innerHTML = value;
            this.initiateCurPosition();
        }
        else {
            this.initiateCurPosition();
        }
    };
    Edit.prototype.addressHandler = function (args) {
        var eventArgs = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, eventArgs);
        var address = args.range;
        var sheetName = this.editCellData.fullAddr.substring(0, this.editCellData.fullAddr.indexOf('!'));
        var sheetIdx = this.editCellData.sheetIndex;
        var editorEle = this.parent.element.querySelector('.e-spreadsheet-edit');
        if (this.parent.getActiveSheet().name !== sheetName) {
            address = '\'' + this.parent.getActiveSheet().name + '\'' + '!' + address;
        }
        if (args.isSelect) {
            this.parent.notify(initiateFormulaReference, { range: eventArgs.editedValue + address, formulaSheetIdx: sheetIdx });
        }
        else {
            var editedValue = eventArgs.editedValue;
            if (editedValue.indexOf(')') === editedValue.length - 1) {
                editorEle.textContent = editedValue.substring(0, editedValue.length - 1)
                    + address + editedValue.substring(editedValue.length - 1);
            }
            else {
                editorEle.textContent = editedValue + address;
            }
        }
    };
    Edit.prototype.updateFormulaBarValue = function () {
        var value = this.editCellData.value;
        var address = this.parent.getActiveSheet().selectedRange;
        address = isSingleCell(getIndexesFromAddress(address)) ? address.split(':')[0] : address;
        var formulaBar = this.parent.element.querySelector('.e-formula-bar');
        if (value && checkIsFormula(value)) {
            var sheetName = this.editCellData.fullAddr.substring(0, this.editCellData.fullAddr.indexOf('!'));
            if (this.parent.getActiveSheet().name !== sheetName) {
                address = '\'' + this.parent.getActiveSheet().name + '\'' + '!' + address;
            }
            if (value.indexOf(')') === value.length - 1) {
                formulaBar.value = value.substring(0, value.length - 1) + address + value.substring(value.length - 1);
            }
            else {
                formulaBar.value = value + address;
            }
        }
    };
    Edit.prototype.setFormulaBarCurPosition = function (input, selectionStart, selectionEnd) {
        if (input.setSelectionRange) {
            input.focus();
            input.selectionStart = selectionStart;
            input.selectionEnd = selectionStart;
            input.setSelectionRange(selectionStart, selectionEnd);
        }
    };
    Edit.prototype.initiateCurPosition = function () {
        var el = this.parent.element.querySelector('.e-spreadsheet-edit');
        if (el.innerText) {
            var range = document.createRange();
            if (el.innerText.indexOf(')') === el.innerText.length - 1) {
                range.setStart(el.childNodes[0], el.innerText.length - 1);
                range.setEnd(el.childNodes[0], el.innerText.length - 1);
            }
            else {
                range.setStart(el.childNodes[0], el.innerText.length);
                range.setEnd(el.childNodes[0], el.innerText.length);
            }
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
        var sheetIdx = this.editCellData.sheetIndex;
        if (sheetIdx !== this.parent.getActiveSheet().id - 1) {
            var elem = this.parent.element.querySelector('.e-formula-bar');
            if (elem.value) {
                var valueLength = elem.value.length;
                if (elem.value.indexOf(')') === valueLength - 1) {
                    this.setFormulaBarCurPosition(elem, valueLength - 1, valueLength - 1);
                }
                else {
                    this.setFormulaBarCurPosition(elem, valueLength, valueLength);
                }
            }
        }
    };
    return Edit;
}());
export { Edit };
