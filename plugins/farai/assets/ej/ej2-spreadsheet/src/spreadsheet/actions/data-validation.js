import { editAlert } from '../index';
import { isValidation, checkDateFormat, applyCellFormat, workbookEditOperation, activeCellChanged } from '../../workbook/common/event';
import { getCell, setCell } from '../../workbook/base/cell';
import { FormValidator, NumericTextBox } from '@syncfusion/ej2-inputs';
import { EventHandler, remove, closest, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { dialog, locale, initiateDataValidation, invalidData, editOperation, keyUp } from '../common/index';
import { formulaBarOperation, removeDataValidation } from '../common/index';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { setRow } from '../../workbook/base/row';
import { getRangeIndexes, getIndexesFromAddress, getCellIndexes } from '../../workbook/common/address';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { getSheet, getSheetIndex } from '../../workbook/index';
import { getColumn, isLocked } from '../../workbook/index';
/**
 * Represents Data Validation support for Spreadsheet.
 */
var DataValidation = /** @class */ (function () {
    /**
     * Constructor for the Spreadsheet Data Validation module.
     */
    function DataValidation(parent) {
        this.data = [];
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * To destroy the Data Validation module.
     * @return {void}
     */
    DataValidation.prototype.destroy = function () {
        this.removeEventListener();
        var dataValPopup = select('#' + this.parent.element.id + '_datavalidation-popup');
        if (dataValPopup) {
            dataValPopup.remove();
        }
        this.parent = null;
    };
    DataValidation.prototype.addEventListener = function () {
        EventHandler.add(this.parent.element, 'dblclick', this.listOpen, this);
        EventHandler.add(document, 'mousedown', this.mouseDownHandler, this);
        this.parent.on(initiateDataValidation, this.initiateDataValidationHandler, this);
        this.parent.on(invalidData, this.invalidDataHandler, this);
        this.parent.on(isValidation, this.checkDataValidation, this);
        this.parent.on(activeCellChanged, this.listHandler, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(removeDataValidation, this.removeValidationHandler, this);
    };
    DataValidation.prototype.removeEventListener = function () {
        EventHandler.remove(this.parent.element, 'dblclick', this.listOpen);
        EventHandler.remove(document, 'mousedown', this.mouseDownHandler);
        if (!this.parent.isDestroyed) {
            this.parent.off(initiateDataValidation, this.initiateDataValidationHandler);
            this.parent.off(invalidData, this.invalidDataHandler);
            this.parent.off(isValidation, this.checkDataValidation);
            this.parent.off(activeCellChanged, this.listHandler);
            this.parent.off(keyUp, this.keyUpHandler);
            this.parent.off(removeDataValidation, this.removeValidationHandler);
        }
    };
    DataValidation.prototype.removeValidationHandler = function (e) {
        this.parent.removeDataValidation(this.parent.getActiveSheet().selectedRange);
    };
    DataValidation.prototype.mouseDownHandler = function (e) {
        var target = e.target;
        var parEle = closest(target, '.e-ddl');
        if (parEle && parEle.getAttribute('id') === 'listValid_popup') {
            this.parent.notify(formulaBarOperation, { action: 'refreshFormulabar', value: target.innerText });
        }
    };
    DataValidation.prototype.keyUpHandler = function (e) {
        var target = e.target;
        var dlgEle = this.parent.element.querySelector('.e-datavalidation-dlg');
        if (closest(target, '.e-values') && dlgEle && e.keyCode !== 13) {
            var valuesCont = dlgEle.querySelector('.e-values');
            var errorEle = valuesCont.querySelector('.e-dlg-error');
            var footerCont = dlgEle.querySelector('.e-footer-content');
            var primaryBut = footerCont.querySelector('.e-primary');
            if (primaryBut.hasAttribute('disabled')) {
                primaryBut.removeAttribute('disabled');
            }
            if (errorEle) {
                valuesCont.removeChild(errorEle);
            }
        }
    };
    DataValidation.prototype.listOpen = function (e) {
        var target = e.target;
        if (this.listObj && target.classList.contains('e-cell') && target.querySelector('.e-validation-list')) {
            this.listObj.showPopup();
        }
    };
    DataValidation.prototype.invalidDataHandler = function (args) {
        if (args.isRemoveHighlight) {
            this.parent.removeInvalidHighlight();
        }
        else {
            this.parent.addInvalidHighlight();
        }
    };
    DataValidation.prototype.listHandler = function () {
        var _this = this;
        if (this.parent.allowDataValidation) {
            var sheet = this.parent.getActiveSheet();
            var mainCont = this.parent.getMainContent();
            var indexes = getCellIndexes(sheet.activeCell);
            var colIdx = indexes[1];
            var rowIdx = indexes[0];
            var cell_1 = getCell(indexes[0], indexes[1], sheet);
            var tdEle_1;
            tdEle_1 = this.parent.getCell(indexes[0], indexes[1]);
            if (!tdEle_1) {
                return;
            }
            if (document.getElementsByClassName('e-validation-list')[0]) {
                remove(document.getElementsByClassName('e-validation-list')[0]);
                this.data = [];
            }
            if (cell_1 && cell_1.validation && cell_1.validation.type === 'List') {
                cell_1.validation.ignoreBlank = !isNullOrUndefined(cell_1.validation.ignoreBlank) ? cell_1.validation.ignoreBlank : true;
                cell_1.validation.inCellDropDown = !isNullOrUndefined(cell_1.validation.inCellDropDown) ?
                    cell_1.validation.inCellDropDown : true;
                if (cell_1.validation.inCellDropDown) {
                    var ddlCont = this.parent.createElement('div', { className: 'e-validation-list' });
                    var ddlEle = this.parent.createElement('input', { id: 'listValid' });
                    ddlCont.appendChild(ddlEle);
                    if (!cell_1.validation.inCellDropDown) {
                        ddlCont.style.display = 'none';
                    }
                    tdEle_1.insertBefore(ddlCont, tdEle_1.firstChild);
                    this.listObj = new DropDownList({
                        index: 0,
                        dataSource: this.data,
                        fields: { text: 'text', value: 'id' },
                        width: '0px',
                        popupWidth: '200px',
                        popupHeight: '200px',
                        beforeOpen: function () {
                            _this.listObj.popupWidth = tdEle_1.offsetWidth - 1;
                            _this.data = [];
                            _this.updateDataSource(_this.listObj, cell_1);
                        },
                        change: function () { _this.listValueChange(_this.listObj.text); },
                        open: function (args) {
                            args.popup.offsetX = -(tdEle_1.offsetWidth - 20) + 4;
                            args.popup.offsetY = -13;
                        }
                    });
                    this.listObj.appendTo('#listValid');
                }
            }
        }
    };
    DataValidation.prototype.updateDataSource = function (listObj, cell) {
        var count = 0;
        var value = cell.validation.value1;
        var isRange = value.indexOf('=') !== -1;
        if (isRange) {
            var sheet = value.indexOf('!') > -1 ?
                getSheet(this.parent, getSheetIndex(this.parent, value.split('=')[1].split('!')[0])) : this.parent.getActiveSheet();
            var address = value.indexOf('!') > -1 ? value.split('!')[1] : value.split('=')[1];
            var indexes = void 0;
            var range = address.split(':');
            if ((range[0].match(/[a-z]+$/ig) && range[1].match(/[a-z]+$/ig)) || (range[0].match(/^[0-9]/g) && range[1].match(/^[0-9]/g))) {
                var addressInfo = this.parent.getIndexes(address);
                if (addressInfo.isCol) {
                    indexes = [0, addressInfo.startIdx, sheet.usedRange.rowIndex, addressInfo.startIdx];
                }
                else {
                    indexes = [addressInfo.startIdx, 0, addressInfo.startIdx, sheet.usedRange.colIndex];
                }
            }
            else {
                indexes = getRangeIndexes(address);
            }
            for (var rowIdx = indexes[0]; rowIdx <= indexes[2]; rowIdx++) {
                if (!sheet.rows[rowIdx]) {
                    setRow(sheet, rowIdx, {});
                }
                for (var colIdx = indexes[1]; colIdx <= indexes[3]; colIdx++) {
                    if (!sheet.rows[rowIdx].cells) {
                        setCell(rowIdx, colIdx, sheet, {});
                    }
                    count += 1;
                    cell = sheet.rows[rowIdx].cells[colIdx];
                    var data = this.parent.getDisplayText(cell) ? this.parent.getDisplayText(cell) : '';
                    this.data.push({ text: data, id: 'list-' + count });
                }
            }
        }
        else {
            var listValues = value.split(',');
            for (var idx = 0; idx < listValues.length; idx++) {
                count += 1;
                this.data.push({ text: listValues[idx], id: 'list-' + count });
            }
        }
        listObj.dataSource = this.data;
    };
    DataValidation.prototype.listValueChange = function (value) {
        var sheet = this.parent.getActiveSheet();
        var cellIdx = getIndexesFromAddress(sheet.activeCell);
        var cellObj = getCell(cellIdx[0], cellIdx[1], sheet);
        if (sheet.isProtected && isLocked(cellObj, getColumn(sheet, cellIdx[1]))) {
            this.parent.notify(editAlert, null);
        }
        else {
            this.parent.notify(workbookEditOperation, { action: 'updateCellValue', address: sheet.activeCell, value: value });
            this.parent.serviceLocator.getService('cell').refreshRange(cellIdx);
        }
    };
    DataValidation.prototype.initiateDataValidationHandler = function () {
        var _this = this;
        var l10n = this.parent.serviceLocator.getService(locale);
        var type;
        var operator;
        var value1;
        var value2;
        var ignoreBlank = true;
        var inCellDropDown = true;
        var isNew = true;
        var sheet = this.parent.getActiveSheet();
        var cell;
        var indexes = getRangeIndexes(sheet.selectedRange);
        for (var rowIdx = indexes[0]; rowIdx <= indexes[2]; rowIdx++) {
            if (sheet.rows[rowIdx]) {
                for (var colIdx = indexes[1]; colIdx <= indexes[3]; colIdx++) {
                    if (sheet.rows[rowIdx].cells && sheet.rows[rowIdx].cells[colIdx]) {
                        cell = sheet.rows[rowIdx].cells[colIdx];
                        if (cell.validation) {
                            isNew = false;
                            type = cell.validation.type;
                            operator = cell.validation.operator;
                            value1 = cell.validation.value1;
                            value2 = cell.validation.value2;
                            ignoreBlank = !isNullOrUndefined(cell.validation.ignoreBlank) ?
                                cell.validation.ignoreBlank : ignoreBlank;
                            inCellDropDown = !isNullOrUndefined(cell.validation.inCellDropDown) ?
                                cell.validation.inCellDropDown : inCellDropDown;
                        }
                    }
                }
            }
        }
        if (!this.parent.element.querySelector('.e-datavalidation-dlg')) {
            var dialogInst_1 = this.parent.serviceLocator.getService(dialog);
            dialogInst_1.show({
                width: 375, showCloseIcon: true, isModal: true, cssClass: 'e-datavalidation-dlg',
                header: l10n.getConstant('DataValidation'),
                target: document.querySelector('.e-control.e-spreadsheet'),
                beforeOpen: function (args) {
                    var dlgArgs = {
                        dialogName: 'ValidationDialog', element: args.element,
                        target: args.target, cancel: args.cancel
                    };
                    _this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        args.cancel = true;
                    }
                    dialogInst_1.dialogInstance.content =
                        _this.dataValidationContent(isNew, type, operator, value1, value2, ignoreBlank, inCellDropDown);
                    dialogInst_1.dialogInstance.dataBind();
                    _this.parent.element.focus();
                },
                buttons: [{
                        buttonModel: {
                            content: l10n.getConstant('CLEARALL'),
                            cssClass: 'e-btn e-clearall-btn e-flat'
                        },
                        click: function () {
                            dialogInst_1.dialogInstance.content =
                                _this.dataValidationContent(true, type, operator, value1, value2, ignoreBlank, inCellDropDown);
                            dialogInst_1.dialogInstance.dataBind();
                            _this.parent.element.focus();
                        }
                    },
                    {
                        buttonModel: {
                            content: l10n.getConstant('APPLY'), isPrimary: true
                        },
                        click: function () {
                            _this.dlgClickHandler(dialogInst_1);
                        }
                    }]
            });
            dialogInst_1.dialogInstance.refresh();
        }
    };
    // tslint:disable-next-line:max-func-body-length
    DataValidation.prototype.dataValidationContent = function (isNew, type, operator, val1, val2, ignoreBlank, inCellDropDown) {
        var _this = this;
        var l10n = this.parent.serviceLocator.getService(locale);
        var value1 = isNew ? '0' : val1;
        var value2 = isNew ? '0' : val2;
        var dlgContent = this.parent.createElement('div', { className: 'e-validation-dlg' });
        var cellRangeCont = this.parent.createElement('div', { className: 'e-cellrange' });
        var allowDataCont = this.parent.createElement('div', { className: 'e-allowdata' });
        var valuesCont = this.parent.createElement('div', { className: 'e-values' });
        var ignoreBlankCont = this.parent.createElement('div', { className: 'e-ignoreblank' });
        dlgContent.appendChild(cellRangeCont);
        dlgContent.appendChild(allowDataCont);
        dlgContent.appendChild(valuesCont);
        dlgContent.appendChild(ignoreBlankCont);
        var cellRangeText = this.parent.createElement('span', { className: 'e-header', innerHTML: l10n.getConstant('CellRange') });
        var cellRangeEle = this.parent.createElement('input', {
            className: 'e-input',
            attrs: { value: this.parent.getActiveSheet().selectedRange }
        });
        cellRangeCont.appendChild(cellRangeText);
        cellRangeCont.appendChild(cellRangeEle);
        var allowCont = this.parent.createElement('div', { className: 'e-allow' });
        var dataCont = this.parent.createElement('div', { className: 'e-data' });
        allowDataCont.appendChild(allowCont);
        allowDataCont.appendChild(dataCont);
        var allowText = this.parent.createElement('span', { className: 'e-header', innerHTML: l10n.getConstant('Allow') });
        this.typeData = [
            { text: l10n.getConstant('WholeNumber'), id: 'type-1' },
            { text: l10n.getConstant('Decimal'), id: 'type-2' },
            { text: l10n.getConstant('Date'), id: 'type-3' },
            { text: l10n.getConstant('Time'), id: 'type-4' },
            { text: l10n.getConstant('TextLength'), id: 'type-5' },
            { text: l10n.getConstant('List'), id: 'type-6' }
        ];
        this.operatorData = [
            { text: l10n.getConstant('Between'), id: 'operator-1' },
            { text: l10n.getConstant('NotBetween'), id: 'operator-2' },
            { text: l10n.getConstant('EqualTo'), id: 'operator-3' },
            { text: l10n.getConstant('NotEqualTo'), id: 'operator-4' },
            { text: l10n.getConstant('Greaterthan'), id: 'operator-5' },
            { text: l10n.getConstant('Lessthan'), id: 'operator-6' },
            { text: l10n.getConstant('GreaterThanOrEqualTo'), id: 'operator-7' },
            { text: l10n.getConstant('LessThanOrEqualTo'), id: 'operator-8' }
        ];
        var allowSelectEle = this.parent.createElement('input', { className: 'e-select' });
        var allowIdx = 0;
        if (!isNew) {
            for (var idx = 0; idx < this.typeData.length; idx++) {
                if (type === this.typeData[idx].text.replace(' ', '')) {
                    allowIdx = idx;
                    break;
                }
            }
        }
        if (isNew || type !== 'List') {
            var dataIdx = 0;
            var dataText = this.parent.createElement('span', { className: 'e-header', innerHTML: l10n.getConstant('Data') });
            var dataSelectEle = this.parent.createElement('input', { className: 'e-select' });
            if (!isNew) {
                for (var idx = 0; idx < this.operatorData.length; idx++) {
                    if (operator === this.FormattedValue(this.operatorData[idx].text)) {
                        dataIdx = idx;
                        break;
                    }
                }
            }
            dataCont.appendChild(dataText);
            dataCont.appendChild(dataSelectEle);
            this.dataList = new DropDownList({
                dataSource: this.operatorData,
                index: dataIdx,
                popupHeight: '200px',
                change: function () { _this.userInput(listObj, _this.dataList); }
            });
            this.dataList.appendTo(dataSelectEle);
        }
        else {
            var ignoreBlankEle_1 = this.parent.createElement('input', { className: 'e-checkbox' });
            dataCont.appendChild(ignoreBlankEle_1);
            var ignoreBlankObj_1 = new CheckBox({ label: l10n.getConstant('InCellDropDown'), checked: inCellDropDown });
            ignoreBlankObj_1.appendTo(ignoreBlankEle_1);
        }
        allowCont.appendChild(allowText);
        allowCont.appendChild(allowSelectEle);
        var listObj = new DropDownList({
            dataSource: this.typeData,
            index: allowIdx,
            popupHeight: '200px',
            change: function () { _this.userInput(listObj, _this.dataList); }
        });
        listObj.appendTo(allowSelectEle);
        if (isNew || (listObj.value !== 'List' && (this.dataList.value === 'Between' || this.dataList.value === 'Not between'))) {
            var minimumCont = this.parent.createElement('div', { className: 'e-minimum' });
            var maximumCont = this.parent.createElement('div', { className: 'e-maximum' });
            valuesCont.appendChild(minimumCont);
            valuesCont.appendChild(maximumCont);
            var minimumText = this.parent.createElement('span', { className: 'e-header', innerHTML: 'Minimum' });
            var maximumText = this.parent.createElement('span', { className: 'e-header', innerHTML: 'Maximum' });
            var minimumInp = this.parent.createElement('input', {
                id: 'minvalue',
                className: 'e-input', attrs: { value: value1 }
            });
            var maximumInp = this.parent.createElement('input', {
                id: 'maxvalue',
                className: 'e-input', attrs: { value: value2 }
            });
            minimumCont.appendChild(minimumText);
            minimumCont.appendChild(minimumInp);
            maximumCont.appendChild(maximumText);
            maximumCont.appendChild(maximumInp);
            var numericMin = new NumericTextBox({
                value: 0
            });
            numericMin.appendTo('#minvalue');
            var numericMax = new NumericTextBox({
                value: 0
            });
            numericMax.appendTo('#maxvalue');
        }
        else if (!isNew || type === ' List') {
            var valueText = this.parent.createElement('span', {
                className: 'e-header', innerHTML: l10n.getConstant('Sources')
            });
            var valueEle = this.parent.createElement('input', { className: 'e-input', attrs: { value: value1 } });
            valuesCont.appendChild(valueText);
            valuesCont.appendChild(valueEle);
        }
        else {
            var valueText = this.parent.createElement('span', {
                className: 'e-header', innerHTML: l10n.getConstant('Value')
            });
            var valueEle = this.parent.createElement('input', { className: 'e-input', attrs: { value: value1 } });
            valuesCont.appendChild(valueText);
            valuesCont.appendChild(valueEle);
        }
        var isChecked = ignoreBlank;
        var ignoreBlankEle = this.parent.createElement('input', { className: 'e-checkbox' });
        ignoreBlankCont.appendChild(ignoreBlankEle);
        var ignoreBlankObj = new CheckBox({ label: l10n.getConstant('IgnoreBlank'), checked: isChecked });
        ignoreBlankObj.appendTo(ignoreBlankEle);
        return dlgContent;
    };
    DataValidation.prototype.userInput = function (listObj, listObj1) {
        var dlgEle = this.parent.element.querySelector('.e-datavalidation-dlg');
        var dlgCont = dlgEle.querySelector('.e-validation-dlg');
        var allowDataCont = dlgCont.querySelector('.e-allowdata');
        var valuesCont = dlgCont.querySelector('.e-values');
        var l10n = this.parent.serviceLocator.getService(locale);
        var dataCont = allowDataCont.querySelector('.e-data');
        var opeEle = dataCont.querySelector('.e-valid-input');
        while (valuesCont.lastChild) {
            valuesCont.removeChild(valuesCont.lastChild);
        }
        if (listObj.value === 'List') {
            while (dataCont.lastChild) {
                dataCont.removeChild(dataCont.lastChild);
            }
            var ignoreBlankEle = this.parent.createElement('input', { className: 'e-checkbox' });
            dataCont.appendChild(ignoreBlankEle);
            var ignoreBlankObj = new CheckBox({ label: l10n.getConstant('InCellDropDown'), checked: true });
            ignoreBlankObj.appendTo(ignoreBlankEle);
        }
        else {
            if (dataCont.getElementsByClassName('e-checkbox-wrapper')[0]) {
                while (dataCont.lastChild) {
                    dataCont.removeChild(dataCont.lastChild);
                }
                var dataText = this.parent.createElement('span', { className: 'e-header', innerHTML: 'Data' });
                var dataSelectEle = this.parent.createElement('input', { className: 'e-select' });
                dataCont.appendChild(dataText);
                dataCont.appendChild(dataSelectEle);
                listObj1.appendTo(dataSelectEle);
            }
        }
        if (listObj.value !== 'List' && (listObj1.value === 'Between' || listObj1.value === 'Not between')) {
            var minimumCont = this.parent.createElement('div', { className: 'e-minimum' });
            var maximumCont = this.parent.createElement('div', { className: 'e-maximum' });
            valuesCont.appendChild(minimumCont);
            valuesCont.appendChild(maximumCont);
            var minimumText = this.parent.createElement('span', { className: 'e-header', innerHTML: 'Minimum' });
            var maximumText = this.parent.createElement('span', { className: 'e-header', innerHTML: 'Maximum' });
            var minimumInp = this.parent.createElement('input', { id: 'min', className: 'e-input', attrs: { value: '0' } });
            var maximumInp = this.parent.createElement('input', { id: 'max', className: 'e-input', attrs: { value: '0' } });
            var numericMin = new NumericTextBox({
                value: 0
            });
            numericMin.appendTo('min');
            var numericMax = new NumericTextBox({
                value: 0
            });
            numericMax.appendTo('max');
            minimumCont.appendChild(minimumText);
            minimumCont.appendChild(minimumInp);
            maximumCont.appendChild(maximumText);
            maximumCont.appendChild(maximumInp);
        }
        else {
            var text = listObj.value === 'List' ? l10n.getConstant('Sources') : l10n.getConstant('Value');
            var valueText = this.parent.createElement('span', { className: 'e-header', innerHTML: text });
            var valueEle = listObj.value === 'List' ? this.parent.createElement('input', {
                className: 'e-input',
                attrs: { placeholder: 'Enter value' }
            }) :
                this.parent.createElement('input', { className: 'e-input', attrs: { value: '0' } });
            valuesCont.appendChild(valueText);
            valuesCont.appendChild(valueEle);
        }
    };
    DataValidation.prototype.dlgClickHandler = function (dialogInst) {
        var l10n = this.parent.serviceLocator.getService(locale);
        var isValidList = true;
        var errorMsg;
        var dlgEle = this.parent.element.querySelector('.e-datavalidation-dlg');
        var dlgFooter = dlgEle.querySelector('.e-footer-content');
        var dlgContEle = dlgEle.getElementsByClassName('e-dlg-content')[0].
            getElementsByClassName('e-validation-dlg')[0];
        var allowData = dlgContEle.getElementsByClassName('e-allowdata')[0];
        var allowEle = allowData.getElementsByClassName('e-allow')[0].getElementsByTagName('input')[0];
        var dataEle = allowData.getElementsByClassName('e-data')[0].getElementsByTagName('input')[0];
        var values = dlgContEle.getElementsByClassName('e-values')[0];
        var value1 = values.getElementsByTagName('input')[0].value;
        var value2 = values.getElementsByTagName('input')[1] ? values.getElementsByTagName('input')[1].value : '';
        var ignoreBlank = dlgContEle.querySelector('.e-ignoreblank').querySelector('.e-checkbox-wrapper').
            getAttribute('aria-checked') === 'true' ? true : false;
        var inCellDropDown = allowData.querySelector('.e-data').querySelector('.e-checkbox-wrapper') ?
            allowData.querySelector('.e-data').querySelector('.e-checkbox-wrapper').querySelector('.e-check') ? true : false : null;
        var range = dlgContEle.querySelector('.e-cellrange').getElementsByTagName('input')[0].value;
        var operator;
        var type = allowEle.value;
        if (dataEle) {
            operator = dataEle.value;
            operator = this.FormattedValue(operator);
        }
        if (type) {
            type = type.replace(' ', '');
        }
        var rangeAdd = [];
        var valArr = [];
        if (value1 !== '') {
            valArr.push(value1);
        }
        if (value2 !== '') {
            valArr.push(value2);
        }
        if (type === 'List') {
            if (value1.indexOf('=') !== -1) {
                if (value1.indexOf(':') !== -1) {
                    var address = value1.indexOf('!') > -1 ? value1.split('!')[1] : value1.split('=')[1];
                    var isSheetNameValid = value1.indexOf('!') > -1 ?
                        getSheetIndex(this.parent, value1.split('=')[1].split('!')[0]) > -1 : true;
                    rangeAdd = address.split(':');
                    var isSingleCol = address.match(/[a-z]/gi) ?
                        rangeAdd[0].replace(/[0-9]/g, '') === rangeAdd[1].replace(/[0-9]/g, '') : false;
                    var isSingleRow = address.match(/\d/g) ?
                        rangeAdd[0].replace(/\D/g, '') === rangeAdd[1].replace(/\D/g, '') : false;
                    isValidList = isSheetNameValid ? (isSingleCol ? true : isSingleRow ? true : false) : false;
                    if (!isValidList) {
                        errorMsg = l10n.getConstant('DialogError');
                    }
                }
            }
            else if (value1.length > 256) {
                isValidList = false;
                errorMsg = l10n.getConstant('ListLengthError');
            }
        }
        if (type !== 'List' || isValidList) {
            var sheet = this.parent.getActiveSheet();
            var format = type;
            var validDlg = this.isDialogValidator(valArr, format, operator);
            errorMsg = validDlg.errorMsg;
            isValidList = validDlg.isValidate;
            if (isValidList) {
                var indexes = getCellIndexes(this.parent.getActiveSheet().activeCell);
                if (sheet && sheet.rows[indexes[0]] && sheet.rows[indexes[0]].cells[indexes[1]] &&
                    sheet.rows[indexes[0]].cells[indexes[1]].validation &&
                    sheet.rows[indexes[0]].cells[indexes[1]].validation.type === 'List') {
                    var tdEle = this.parent.getMainContent().
                        getElementsByTagName('tr')[indexes[0]].getElementsByClassName('e-cell')[indexes[1]];
                    if (tdEle && tdEle.getElementsByClassName('e-validation-list')[0]) {
                        tdEle.removeChild(tdEle.getElementsByClassName('e-validation-list')[0]);
                        this.listObj.destroy();
                    }
                }
                var rules = {
                    type: type, operator: operator,
                    value1: value1, value2: value2, ignoreBlank: ignoreBlank, inCellDropDown: inCellDropDown
                };
                this.parent.addDataValidation(rules, range);
                if (type === 'List' && isValidList) {
                    this.listHandler();
                }
                if (!document.getElementsByClassName('e-validationerror-dlg')[0]) {
                    if (dialogInst.dialogInstance) {
                        dialogInst.dialogInstance.hide();
                    }
                    else {
                        dialogInst.hide();
                    }
                }
            }
        }
        if (!isValidList) {
            var errorEle = this.parent.createElement('div', {
                className: 'e-dlg-error', id: 'e-invalid', innerHTML: errorMsg
            });
            values.appendChild(errorEle);
            dlgFooter.querySelector('.e-primary').setAttribute('disabled', 'true');
        }
    };
    DataValidation.prototype.FormattedValue = function (value) {
        switch (value) {
            case 'Between':
                value = 'Between';
                break;
            case 'Not between':
                value = 'NotBetween';
                break;
            case 'Equal to':
                value = 'EqualTo';
                break;
            case 'Not equal to':
                value = 'NotEqualTo';
                break;
            case 'Greater than':
                value = 'GreaterThan';
                break;
            case 'Less than':
                value = 'LessThan';
                break;
            case 'Greater than or equal to':
                value = 'GreaterThanOrEqualTo';
                break;
            case 'Less than or equal to':
                value = 'LessThanOrEqualTo';
                break;
            default:
                value = 'Between';
                break;
        }
        return value;
    };
    DataValidation.prototype.isDialogValidator = function (values, type, operator) {
        var l10n = this.parent.serviceLocator.getService(locale);
        var count = 0;
        var isEmpty = false;
        var formValidation;
        if (type === 'List') {
            isEmpty = values.length > 0 ? false : true;
        }
        else {
            if (operator === 'Between' || operator === 'NotBetween') {
                isEmpty = values.length === 2 ? false : true;
            }
            else {
                isEmpty = values.length > 0 ? false : true;
            }
        }
        if (!isEmpty) {
            for (var idx = 0; idx < values.length; idx++) {
                formValidation = this.formatValidation(values[idx], type);
                if (formValidation.isValidate) {
                    count = count + 1;
                }
                else {
                    break;
                }
            }
            formValidation.isValidate = count === values.length ? true : false;
        }
        else {
            formValidation = { isValidate: false, errorMsg: l10n.getConstant('EmptyError') };
        }
        return { isValidate: formValidation.isValidate, errorMsg: formValidation.errorMsg };
    };
    // tslint:disable-next-line:max-func-body-length
    DataValidation.prototype.isValidationHandler = function (args) {
        var l10n = this.parent.serviceLocator.getService(locale);
        args.value = args.value ? args.value : '';
        var isValidate;
        var errorMsg;
        var enterValue = args.value;
        var sheet = this.parent.sheets[args.sheetIdx];
        var cell = getCell(args.range[0], args.range[1], sheet);
        var value = args.value;
        var value1 = cell.validation.value1;
        var value2 = cell.validation.value2;
        var opt = cell.validation.operator;
        var type = cell.validation.type;
        var ignoreBlank = !isNullOrUndefined(cell.validation.ignoreBlank) ? cell.validation.ignoreBlank : true;
        var formValidation = this.formatValidation(args.value, type);
        isValidate = formValidation.isValidate;
        errorMsg = formValidation.errorMsg;
        if (isValidate) {
            isValidate = false;
            if (type === 'Date' || type === 'Time') {
                for (var idx = 0; idx <= 3; idx++) {
                    args.value = idx === 0 ? args.value : idx === 1 ? cell.validation.value1 : cell.validation.value2;
                    var dateEventArgs = {
                        value: args.value,
                        rowIndex: args.range[0],
                        colIndex: args.range[1],
                        sheetIndex: args.sheetIdx,
                        updatedVal: ''
                    };
                    if (args.value !== '') {
                        this.parent.notify(checkDateFormat, dateEventArgs);
                    }
                    var updatedVal = dateEventArgs.updatedVal;
                    if (idx === 0) {
                        value = type === 'Date' ? args.value : updatedVal.slice(updatedVal.indexOf('.') + 1, updatedVal.length);
                    }
                    else if (idx === 1) {
                        value1 = type === 'Date' ? updatedVal : updatedVal.slice(updatedVal.indexOf('.') + 1, updatedVal.length);
                    }
                    else {
                        value2 = type === 'Date' ? updatedVal : updatedVal.slice(updatedVal.indexOf('.') + 1, updatedVal.length);
                    }
                }
            }
            else if (cell.validation.type === 'TextLength') {
                value = args.value.toString().length.toString();
            }
            if (type === 'List') {
                if (value1.indexOf('=') !== -1) {
                    for (var idx = 0; idx < this.data.length; idx++) {
                        if (args.value === this.data[idx].text) {
                            isValidate = true;
                        }
                    }
                }
                else {
                    var values = value1.split(',');
                    for (var idx = 0; idx < values.length; idx++) {
                        if (args.value === values[idx]) {
                            isValidate = true;
                        }
                    }
                }
            }
            else {
                if (type === 'Decimal') {
                    value = parseFloat(value.toString());
                    value1 = parseFloat(value1.toString());
                    value2 = value2 ? parseFloat(value2.toString()) : null;
                }
                else {
                    value = parseInt(value.toString(), 10);
                    value1 = parseInt(value1.toString(), 10);
                    value2 = value2 ? parseInt(value2.toString(), 10) : null;
                }
                switch (opt) {
                    case 'EqualTo':
                        if (value === value1) {
                            isValidate = true;
                        }
                        else if (ignoreBlank && enterValue === '') {
                            isValidate = true;
                        }
                        else {
                            isValidate = false;
                        }
                        break;
                    case 'NotEqualTo':
                        if (value !== value1) {
                            isValidate = true;
                        }
                        else if (ignoreBlank && enterValue === '') {
                            isValidate = true;
                        }
                        else {
                            isValidate = false;
                        }
                        break;
                    case 'Between':
                        if (value >= value1 && value <= value2) {
                            isValidate = true;
                        }
                        else if (ignoreBlank && enterValue === '') {
                            isValidate = true;
                        }
                        else {
                            isValidate = false;
                        }
                        break;
                    case 'NotBetween':
                        if (value >= value1 && value <= value2) {
                            isValidate = false;
                        }
                        else if (ignoreBlank && enterValue === '') {
                            isValidate = true;
                        }
                        else {
                            isValidate = true;
                        }
                        break;
                    case 'GreaterThan':
                        if (value > value1) {
                            isValidate = true;
                        }
                        else if (ignoreBlank && enterValue === '') {
                            isValidate = true;
                        }
                        else {
                            isValidate = false;
                        }
                        break;
                    case 'LessThan':
                        if (value < value1) {
                            isValidate = true;
                        }
                        else if (ignoreBlank && enterValue === '') {
                            isValidate = true;
                        }
                        else {
                            isValidate = false;
                        }
                        break;
                    case 'GreaterThanOrEqualTo':
                        if (value >= value1) {
                            isValidate = true;
                        }
                        else if (ignoreBlank && enterValue === '') {
                            isValidate = true;
                        }
                        else {
                            isValidate = false;
                        }
                        break;
                    case 'LessThanOrEqualTo':
                        if (value <= value1) {
                            isValidate = true;
                        }
                        else if (ignoreBlank && enterValue === '') {
                            isValidate = true;
                        }
                        else {
                            isValidate = false;
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        errorMsg = l10n.getConstant('ValidationError');
        if (isValidate) {
            var style = this.parent.getCellStyleValue(['backgroundColor', 'color'], [args.range[0], args.range[1]]);
            this.parent.notify(applyCellFormat, {
                style: style, rowIdx: args.range[0],
                colIdx: args.range[1], isHeightCheckNeeded: true, manualUpdate: true,
                onActionUpdate: true
            });
        }
        return { isValidate: isValidate, errorMsg: errorMsg };
    };
    DataValidation.prototype.checkDataValidation = function (args) {
        var isValid = this.isValidationHandler({
            value: args.value, range: args.range, sheetIdx: args.sheetIdx
        });
        if (!isValid.isValidate && args.isCell) {
            this.validationErrorHandler(isValid.errorMsg);
        }
        this.parent.allowDataValidation = isValid.isValidate;
    };
    DataValidation.prototype.formatValidation = function (value, type) {
        var sheetPanel = this.parent.element.getElementsByClassName('e-sheet-panel')[0];
        var isValidate;
        var errorMsg;
        var formEle = this.parent.createElement('form', {
            id: 'formId',
            className: 'form-horizontal'
        });
        var inputEle = this.parent.createElement('input', {
            id: 'e-validation', innerHTML: value
        });
        inputEle.setAttribute('name', 'validation');
        inputEle.setAttribute('type', 'text');
        inputEle.setAttribute('value', value);
        formEle.appendChild(inputEle);
        sheetPanel.appendChild(formEle);
        var options;
        switch (type) {
            case 'Date':
                options = {
                    rules: {
                        'validation': { date: true },
                    },
                    customPlacement: function (inputElement, error) {
                        errorMsg = error.innerText;
                    }
                };
                break;
            case 'Decimal':
                options = {
                    rules: {
                        'validation': { number: true },
                    },
                    customPlacement: function (inputElement, error) {
                        errorMsg = error.innerText;
                    }
                };
                break;
            case 'WholeNumber':
                options = {
                    rules: {
                        'validation': { regex: /^\d*\.?[0]*$/ },
                    },
                    customPlacement: function (inputElement, error) {
                        errorMsg = error.innerText;
                    }
                };
                break;
            default:
                break;
        }
        var formObj = new FormValidator('#formId', options);
        isValidate = formObj.validate();
        sheetPanel.removeChild(sheetPanel.getElementsByClassName('form-horizontal')[0]);
        return { isValidate: isValidate, errorMsg: errorMsg };
    };
    DataValidation.prototype.validationErrorHandler = function (error) {
        var _this = this;
        var el = document.getElementsByClassName('e-spreadsheet-edit')[0];
        var l10n = this.parent.serviceLocator.getService(locale);
        if (!this.parent.element.querySelector('.e-validationerror-dlg')) {
            var erroDialogInst_1 = this.parent.serviceLocator.getService(dialog);
            var disableCancel = false;
            var dlgModel = {
                width: 400, height: 200, isModal: true, showCloseIcon: true, cssClass: 'e-validationerror-dlg',
                target: document.querySelector('.e-control.e-spreadsheet'),
                beforeOpen: function (args) {
                    var dlgArgs = {
                        dialogName: 'ValidationErrorDialog',
                        element: args.element, target: args.target, cancel: args.cancel, content: error
                    };
                    _this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        _this.errorDlgHandler(erroDialogInst_1, 'Cancel');
                        args.cancel = true;
                    }
                    el.focus();
                    erroDialogInst_1.dialogInstance.content = dlgArgs.content;
                    erroDialogInst_1.dialogInstance.dataBind();
                },
                buttons: [{
                        buttonModel: {
                            content: l10n.getConstant('Retry'), isPrimary: true,
                        },
                        click: function () {
                            _this.errorDlgHandler(erroDialogInst_1, 'Retry');
                        }
                    },
                    {
                        buttonModel: {
                            content: l10n.getConstant('Cancel'),
                        },
                        click: function () {
                            _this.errorDlgHandler(erroDialogInst_1, 'Cancel');
                        }
                    }]
            };
            erroDialogInst_1.show(dlgModel, disableCancel);
        }
    };
    DataValidation.prototype.errorDlgHandler = function (errorDialogInst, buttonName) {
        if (buttonName === 'Retry') {
            var el = document.getElementsByClassName('e-spreadsheet-edit')[0];
            var mainCont = this.parent.getMainContent();
            errorDialogInst.hide();
            if (el.innerText) {
                var range = document.createRange();
                range.setStart(el.childNodes[0], 0);
                range.setEnd(el.childNodes[0], el.innerText.length);
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                if (this.listObj) {
                    this.listObj.showPopup();
                }
            }
        }
        else {
            var indexes = getCellIndexes(this.parent.getActiveSheet().activeCell);
            var value = this.parent.getDisplayText(this.parent.getActiveSheet().rows[indexes[0]].cells[indexes[1]]);
            this.parent.notify(editOperation, {
                action: 'cancelEdit', value: value, refreshFormulaBar: true,
                refreshEditorElem: true, isAppend: false, trigEvent: true
            });
            errorDialogInst.hide();
        }
    };
    /**
     * Gets the module name.
     * @returns string
     */
    DataValidation.prototype.getModuleName = function () {
        return 'dataValidation';
    };
    return DataValidation;
}());
export { DataValidation };
