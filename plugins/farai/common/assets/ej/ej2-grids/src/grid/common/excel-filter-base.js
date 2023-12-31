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
import { EventHandler, remove, Browser, isBlazor, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { Dialog } from '@syncfusion/ej2-popups';
import { DropDownList, AutoComplete } from '@syncfusion/ej2-dropdowns';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { RadioButton, CheckBox } from '@syncfusion/ej2-buttons';
import { distinctStringValues, isComplexField, getComplexFieldID, getCustomDateFormat, applyBiggerTheme } from '../base/util';
import { DatePicker, DateTimePicker } from '@syncfusion/ej2-calendars';
import { parentsUntil, appendChildren, extend, eventPromise } from '../base/util';
import * as events from '../base/constant';
import { ContextMenu } from '@syncfusion/ej2-navigations';
import { CheckBoxFilterBase } from '../common/checkbox-filter-base';
/**
 * @hidden
 * `ExcelFilter` module is used to handle filtering action.
 */
var ExcelFilterBase = /** @class */ (function (_super) {
    __extends(ExcelFilterBase, _super);
    /**
     * Constructor for excel filtering module
     * @hidden
     */
    function ExcelFilterBase(parent, customFltrOperators) {
        var _this = _super.call(this, parent) || this;
        _this.customFilterOperators = customFltrOperators;
        _this.isExcel = true;
        return _this;
    }
    ExcelFilterBase.prototype.getCMenuDS = function (type, operator) {
        var options = {
            number: ['Equal', 'NotEqual', '', 'LessThan', 'LessThanOrEqual', 'GreaterThan',
                'GreaterThanOrEqual', 'Between', '', 'CustomFilter'],
            string: ['Equal', 'NotEqual', '', 'StartsWith', 'EndsWith', '', 'Contains', '', 'CustomFilter'],
        };
        options.date = options.number;
        options.datetime = options.number;
        var model = [];
        for (var i = 0; i < options[type].length; i++) {
            if (options[type][i].length) {
                if (operator) {
                    model.push({
                        text: this.getLocalizedLabel(options[type][i]) + '...',
                        iconCss: 'e-icons e-icon-check ' + (operator === options[type][i].toLowerCase() ? '' : 'e-emptyicon')
                    });
                }
                else {
                    model.push({
                        text: this.getLocalizedLabel(options[type][i]) + '...'
                    });
                }
            }
            else {
                model.push({ separator: true });
            }
        }
        return model;
    };
    /**
     * To destroy the filter bar.
     * @return {void}
     * @hidden
     */
    ExcelFilterBase.prototype.destroy = function () {
        if (this.dlg) {
            this.unwireExEvents();
            _super.prototype.destroy.call(this);
        }
        if (this.cmenu && this.cmenu.parentElement) {
            remove(this.cmenu);
        }
    };
    ExcelFilterBase.prototype.createMenu = function (type, isFiltered, isCheckIcon, eleOptions) {
        var options = { string: 'TextFilter', date: 'DateFilter', datetime: 'DateTimeFilter', number: 'NumberFilter' };
        this.menu = this.parent.createElement('div', { className: 'e-contextmenu-wrapper' });
        if (this.parent.enableRtl) {
            this.menu.classList.add('e-rtl');
        }
        else {
            this.menu.classList.remove('e-rtl');
        }
        var ul = this.parent.createElement('ul');
        var icon = isFiltered ? 'e-excl-filter-icon e-filtered' : 'e-excl-filter-icon';
        // tslint:disable-next-line:no-any
        if (this.parent.allowSorting && this.parent.getModuleName() === 'grid') {
            var hdrele = this.parent.getColumnHeaderByUid(eleOptions.uid).getAttribute('aria-sort');
            var colIsSort = this.parent.getColumnByField(eleOptions.field).allowSorting;
            var isAsc = (!colIsSort || hdrele === 'Ascending') ? 'e-disabled e-excel-ascending' : 'e-excel-ascending';
            var isDesc = (!colIsSort || hdrele === 'Descending') ? 'e-disabled e-excel-descending' : 'e-excel-descending';
            var ascName = (type === 'string') ? this.getLocalizedLabel('SortAtoZ') : (type === 'datetime' || type === 'date') ?
                this.getLocalizedLabel('SortByOldest') : this.getLocalizedLabel('SortSmallestToLargest');
            var descName = (type === 'string') ? this.getLocalizedLabel('SortZtoA') : (type === 'datetime' || type === 'date') ?
                this.getLocalizedLabel('SortByNewest') : this.getLocalizedLabel('SortLargestToSmallest');
            ul.appendChild(this.createMenuElem(ascName, isAsc, 'e-sortascending'));
            ul.appendChild(this.createMenuElem(descName, isDesc, 'e-sortdescending'));
            var separator = this.parent.createElement('li', { className: 'e-separator e-menu-item e-excel-separator' });
            ul.appendChild(separator);
        }
        ul.appendChild(this.createMenuElem(this.getLocalizedLabel('ClearFilter'), isFiltered ? '' : 'e-disabled', icon));
        if (type !== 'boolean') {
            ul.appendChild(this.createMenuElem(this.getLocalizedLabel(options[type]), 'e-submenu', isCheckIcon && this.ensureTextFilter() ? 'e-icon-check' : icon + ' e-emptyicon', true));
        }
        this.menu.appendChild(ul);
        this.parent.notify(events.beforeFltrcMenuOpen, { element: this.menu });
    };
    ExcelFilterBase.prototype.createMenuElem = function (val, className, iconName, isSubMenu) {
        var li = this.parent.createElement('li', { className: className + ' e-menu-item' });
        li.innerHTML = val;
        li.insertBefore(this.parent.createElement('span', { className: 'e-menu-icon e-icons ' + iconName }), li.firstChild);
        if (isSubMenu) {
            li.appendChild(this.parent.createElement('span', { className: 'e-icons e-caret' }));
        }
        return li;
    };
    ExcelFilterBase.prototype.wireExEvents = function () {
        EventHandler.add(this.dlg, 'mouseover', this.hoverHandler, this);
        EventHandler.add(this.dlg, 'click', this.clickExHandler, this);
    };
    ExcelFilterBase.prototype.unwireExEvents = function () {
        EventHandler.remove(this.dlg, 'mouseover', this.hoverHandler);
        EventHandler.remove(this.dlg, 'click', this.clickExHandler);
    };
    ExcelFilterBase.prototype.clickExHandler = function (e) {
        var menuItem = parentsUntil(e.target, 'e-menu-item');
        if (menuItem && this.getLocalizedLabel('ClearFilter') === menuItem.innerText.trim()) {
            this.clearFilter();
            this.closeDialog();
        }
    };
    ExcelFilterBase.prototype.destroyCMenu = function () {
        if (this.menuObj && !this.menuObj.isDestroyed) {
            this.menuObj.destroy();
            remove(this.cmenu);
        }
    };
    ExcelFilterBase.prototype.hoverHandler = function (e) {
        var target = e.target.querySelector('.e-contextmenu');
        var li = parentsUntil(e.target, 'e-menu-item');
        var focused = this.menu.querySelector('.e-focused');
        var isSubMenu;
        if (focused) {
            focused.classList.remove('e-focused');
        }
        if (li) {
            li.classList.add('e-focused');
            isSubMenu = li.classList.contains('e-submenu');
        }
        if (target) {
            return;
        }
        if (!isSubMenu) {
            var submenu = this.menu.querySelector('.e-submenu');
            if (!isNullOrUndefined(submenu)) {
                submenu.classList.remove('e-selected');
            }
            this.isCMenuOpen = false;
            this.destroyCMenu();
        }
        var selectedMenu = this.ensureTextFilter();
        if (!this.isCMenuOpen && isSubMenu) {
            li.classList.add('e-selected');
            this.isCMenuOpen = true;
            var menuOptions = {
                items: this.getCMenuDS(this.options.type, selectedMenu ? selectedMenu.replace(/\s/g, '') : undefined),
                select: this.selectHandler.bind(this),
                onClose: this.destroyCMenu.bind(this),
                enableRtl: this.parent.enableRtl,
                beforeClose: this.preventClose
            };
            this.parent.element.appendChild(this.cmenu);
            this.menuObj = new ContextMenu(menuOptions, this.cmenu);
            var client = this.menu.querySelector('.e-submenu').getBoundingClientRect();
            var pos = { top: 0, left: 0 };
            if (Browser.isDevice) {
                var contextRect = this.getContextBounds(this.menuObj);
                pos.top = (window.innerHeight - contextRect.height) / 2;
                pos.left = (window.innerWidth - contextRect.width) / 2;
                this.closeDialog();
            }
            else {
                pos.top = Browser.isIE ? window.pageYOffset + client.top : window.scrollY + client.top;
                pos.left = this.getCMenuYPosition(this.dlg, this.menuObj);
            }
            this.menuObj.open(pos.top, pos.left, e.target);
            applyBiggerTheme(this.parent.element, this.menuObj.element.parentElement);
        }
    };
    ExcelFilterBase.prototype.ensureTextFilter = function () {
        var selectedMenu;
        var predicates = this.existingPredicate[this.options.field];
        if (predicates && predicates.length === 2) {
            if (predicates[0].operator === 'greaterthanorequal' && predicates[1].operator === 'lessthanorequal') {
                selectedMenu = 'between';
            }
            else {
                selectedMenu = 'customfilter';
            }
        }
        else {
            if (predicates && predicates.length === 1) {
                this.optrData = this.customFilterOperators[this.options.type + 'Operator'];
                selectedMenu = predicates[0].operator;
            }
        }
        return selectedMenu;
    };
    ExcelFilterBase.prototype.preventClose = function (args) {
        if (args.event instanceof MouseEvent && args.event.target.classList.contains('e-submenu')) {
            args.cancel = true;
        }
    };
    ExcelFilterBase.prototype.getContextBounds = function (context) {
        var elementVisible = this.menuObj.element.style.display;
        this.menuObj.element.style.display = 'block';
        return this.menuObj.element.getBoundingClientRect();
    };
    ExcelFilterBase.prototype.getCMenuYPosition = function (target, context) {
        var contextWidth = this.getContextBounds(context).width;
        var targetPosition = target.getBoundingClientRect();
        var leftPos = targetPosition.right + contextWidth - this.parent.element.clientWidth;
        var targetBorder = target.offsetWidth - target.clientWidth;
        targetBorder = targetBorder ? targetBorder + 1 : 0;
        return (leftPos < 1) ? (targetPosition.right + 1 - targetBorder) : (targetPosition.left - contextWidth - 1 + targetBorder);
    };
    ExcelFilterBase.prototype.openDialog = function (options) {
        var _this = this;
        this.updateModel(options);
        this.getAndSetChkElem(options);
        this.showDialog(options);
        this.dialogObj.dataBind();
        var filterLength = (this.existingPredicate[options.field] && this.existingPredicate[options.field].length) ||
            this.options.filteredColumns.filter(function (col) {
                return _this.options.field === col.field;
            }).length;
        this.createMenu(options.type, filterLength > 0, (filterLength === 1 || filterLength === 2), options);
        this.dlg.insertBefore(this.menu, this.dlg.firstChild);
        this.dlg.classList.add('e-excelfilter');
        if (this.parent.enableRtl) {
            this.dlg.classList.add('e-rtl');
        }
        this.dlg.classList.remove('e-checkboxfilter');
        this.cmenu = this.parent.createElement('ul', { className: 'e-excel-menu' });
        this.wireExEvents();
    };
    ExcelFilterBase.prototype.closeDialog = function () {
        _super.prototype.closeDialog.call(this);
    };
    ExcelFilterBase.prototype.selectHandler = function (e) {
        if (e.item) {
            this.menuItem = e.item;
            this.renderDialogue(e);
        }
    };
    ExcelFilterBase.prototype.renderDialogue = function (e) {
        var _this = this;
        var target = e.element;
        var column = this.options.field;
        var isComplex = !isNullOrUndefined(column) && isComplexField(column);
        var complexFieldName = !isNullOrUndefined(column) && getComplexFieldID(column);
        var mainDiv = this.parent.createElement('div', {
            className: 'e-xlfl-maindiv',
            id: isComplex ? complexFieldName + '-xlflmenu' : column + '-xlflmenu'
        });
        this.dlgDiv = this.parent.createElement('div', {
            className: 'e-xlflmenu',
            id: isComplex ? complexFieldName + '-xlfldlg' : column + '-xlfldlg'
        });
        this.parent.element.appendChild(this.dlgDiv);
        this.dlgObj = new Dialog({
            header: this.getLocalizedLabel('CustomFilter'),
            isModal: true,
            overlayClick: this.removeDialog.bind(this),
            showCloseIcon: true,
            closeOnEscape: false,
            target: document.body,
            // target: this.parent.element,
            visible: false,
            enableRtl: this.parent.enableRtl,
            open: function () {
                var row = _this.dlgObj.element.querySelector('table.e-xlfl-table>tr');
                if (_this.options.column.filterTemplate) {
                    if (isBlazor()) {
                        row.querySelector('.e-xlfl-valuediv').children[0].focus();
                    }
                    else {
                        row.querySelector('#' + _this.options.column.field + '-xlfl-frstvalue').focus();
                    }
                }
                else {
                    row.cells[1].querySelector('input:not([type=hidden])').focus();
                }
            },
            close: this.removeDialog.bind(this),
            created: this.createdDialog.bind(this, target, column),
            buttons: [{
                    click: this.filterBtnClick.bind(this, column),
                    buttonModel: {
                        content: this.getLocalizedLabel('OKButton'), isPrimary: true, cssClass: 'e-xlfl-okbtn'
                    }
                },
                {
                    click: this.removeDialog.bind(this),
                    buttonModel: { content: this.getLocalizedLabel('CancelButton'), cssClass: 'e-xlfl-cancelbtn' }
                }],
            content: mainDiv,
            width: 430,
            animationSettings: { effect: 'None' },
        });
        var isStringTemplate = 'isStringTemplate';
        this.dlgObj[isStringTemplate] = true;
        this.dlgDiv.setAttribute('aria-label', this.getLocalizedLabel('CustomFilterDialogARIA'));
        this.dlgObj.appendTo(this.dlgDiv);
    };
    ExcelFilterBase.prototype.removeDialog = function () {
        if (isBlazor()) {
            var columns = this.options.columns || [];
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].filterTemplate) {
                    var tempID = this.parent.element.id + columns[i].uid + 'filterTemplate';
                    updateBlazorTemplate(tempID, 'FilterTemplate', columns[i]);
                }
            }
        }
        if (this.parent.isReact) {
            this.parent.destroyTemplate(['filterTemplate']);
            this.parent.renderTemplates();
        }
        this.removeObjects([this.dropOptr, this.datePicker, this.dateTimePicker, this.actObj, this.numericTxtObj, this.dlgObj]);
        remove(this.dlgDiv);
    };
    ExcelFilterBase.prototype.createdDialog = function (target, column) {
        this.renderCustomFilter(target, column);
        this.dlgObj.element.style.left = '0px';
        this.dlgObj.element.style.top = '0px';
        if (Browser.isDevice && window.innerWidth < 440) {
            this.dlgObj.element.style.width = '90%';
        }
        this.parent.notify(events.beforeCustomFilterOpen, { column: column, dialog: this.dialogObj });
        this.dlgObj.show();
        applyBiggerTheme(this.parent.element, this.dlgObj.element.parentElement);
    };
    ExcelFilterBase.prototype.renderCustomFilter = function (target, column) {
        var dlgConetntEle = this.dlgObj.element.querySelector('.e-xlfl-maindiv');
        /* tslint:disable-next-line:max-line-length */
        var dlgFields = this.parent.createElement('div', { innerHTML: this.getLocalizedLabel('ShowRowsWhere'), className: 'e-xlfl-dlgfields' });
        dlgConetntEle.appendChild(dlgFields);
        //column name
        var fieldSet = this.parent.createElement('div', { innerHTML: this.options.displayName, className: 'e-xlfl-fieldset' });
        dlgConetntEle.appendChild(fieldSet);
        this.renderFilterUI(column, dlgConetntEle);
    };
    ExcelFilterBase.prototype.filterBtnClick = function (col) {
        var isComplex = !isNullOrUndefined(col) && isComplexField(col);
        var complexFieldName = !isNullOrUndefined(col) && getComplexFieldID(col);
        var colValue = isComplex ? complexFieldName : col;
        var fValue = this.options.column.filterTemplate && isBlazor() ?
            this.dlgDiv.querySelector('.-xlfl-frstvalue').children[0].querySelector('.e-control').ej2_instances[0]
            : this.dlgDiv.querySelector('#' + colValue + '-xlfl-frstvalue').ej2_instances[0];
        var fOperator = this.dlgDiv.querySelector('#' + colValue + '-xlfl-frstoptr').ej2_instances[0];
        var sValue = this.options.column.filterTemplate && isBlazor() ?
            this.dlgDiv.querySelector('.-xlfl-secndvalue').children[0].querySelector('.e-control').ej2_instances[0]
            : this.dlgDiv.querySelector('#' + colValue + '-xlfl-secndvalue').ej2_instances[0];
        var sOperator = this.dlgDiv.querySelector('#' + colValue + '-xlfl-secndoptr').ej2_instances[0];
        var checkBoxValue;
        if (this.options.type === 'string') {
            var checkBox = this.dlgDiv.querySelector('#' + colValue + '-xlflmtcase').ej2_instances[0];
            checkBoxValue = checkBox.checked;
        }
        var andRadio = this.dlgDiv.querySelector('#' + colValue + 'e-xlfl-frstpredicate').ej2_instances[0];
        var orRadio = this.dlgDiv.querySelector('#' + colValue + 'e-xlfl-secndpredicate').ej2_instances[0];
        var predicate = (andRadio.checked ? 'and' : 'or');
        if (sValue.value === null) {
            predicate = 'or';
        }
        this.filterByColumn(this.options.field, fOperator.value, fValue.value, predicate, checkBoxValue, this.options.ignoreAccent, sOperator.value, sValue.value);
        this.removeDialog();
    };
    /**
     * @hidden
     * Filters grid row by column name with given options.
     * @param {string} fieldName - Defines the field name of the filter column.
     * @param {string} firstOperator - Defines the first operator by how to filter records.
     * @param {string | number | Date | boolean} firstValue - Defines the first value which is used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query with another by using AND or OR predicate.
     * @param {boolean} matchCase - If ignore case set to true, then filter records with exact match or else
     * filter records with case insensitive(uppercase and lowercase letters treated as same).
     * @param {boolean} ignoreAccent - If ignoreAccent set to true, then ignores the diacritic characters or accents when filtering.
     * @param {string} secondOperator - Defines the second operator by how to filter records.
     * @param {string | number | Date | boolean} secondValue - Defines the first value which is used to filter records.
     */
    ExcelFilterBase.prototype.filterByColumn = function (fieldName, firstOperator, firstValue, predicate, matchCase, ignoreAccent, secondOperator, secondValue) {
        var col = this.parent.getColumnByField ? this.parent.getColumnByField(fieldName) : this.options.column;
        var field = this.isForeignColumn(col) ? col.foreignKeyValue : fieldName;
        var fColl = [];
        var mPredicate;
        fColl.push({
            field: field,
            predicate: predicate,
            matchCase: matchCase,
            ignoreAccent: ignoreAccent,
            operator: firstOperator,
            value: firstValue,
            type: this.options.type
        });
        var arg = {
            instance: this, handler: this.filterByColumn, arg1: fieldName, arg2: firstOperator, arg3: firstValue, arg4: predicate,
            arg5: matchCase, arg6: ignoreAccent, arg7: secondOperator, arg8: secondValue, cancel: false
        };
        this.parent.notify(events.fltrPrevent, arg);
        if (arg.cancel) {
            return;
        }
        mPredicate = new Predicate(field, firstOperator.toLowerCase(), firstValue, !matchCase, ignoreAccent);
        if (!isNullOrUndefined(secondValue) && !isNullOrUndefined(secondOperator)) {
            fColl.push({
                field: field,
                predicate: predicate,
                matchCase: matchCase,
                ignoreAccent: ignoreAccent,
                operator: secondOperator,
                value: secondValue,
                type: this.options.type
            });
            /* tslint:disable-next-line:max-line-length */
            mPredicate = mPredicate[predicate](field, secondOperator.toLowerCase(), secondValue, !matchCase, ignoreAccent);
        }
        var args = {
            action: 'filtering', filterCollection: fColl, field: this.options.field,
            ejpredicate: mPredicate, actualPredicate: fColl
        };
        if (this.isForeignColumn(col)) {
            this.foreignKeyFilter(args, fColl, mPredicate);
        }
        else {
            this.options.handler(args);
        }
    };
    /* tslint:disable-next-line:max-line-length */
    ExcelFilterBase.prototype.renderOperatorUI = function (column, table, elementID, predicates, isFirst) {
        var fieldElement = this.parent.createElement('tr', { className: 'e-xlfl-fields' });
        table.appendChild(fieldElement);
        var xlfloptr = this.parent.createElement('td', { className: 'e-xlfl-optr' });
        fieldElement.appendChild(xlfloptr);
        var optrDiv = this.parent.createElement('div', { className: 'e-xlfl-optrdiv' });
        var isComplex = !isNullOrUndefined(column) && isComplexField(column);
        var complexFieldName = !isNullOrUndefined(column) && getComplexFieldID(column);
        var optrInput = this.parent
            .createElement('input', { id: isComplex ? complexFieldName + elementID : column + elementID });
        optrDiv.appendChild(optrInput);
        xlfloptr.appendChild(optrDiv);
        var optr = this.options.type + 'Operator';
        var dropDatasource = this.customFilterOperators[optr];
        this.optrData = dropDatasource;
        var selectedValue = this.dropSelectedVal(this.options.column, predicates, isFirst);
        //Trailing three dots are sliced.
        var menuText = '';
        if (this.menuItem) {
            menuText = this.menuItem.text.slice(0, -3);
            if (menuText !== this.getLocalizedLabel('CustomFilter')) {
                selectedValue = isFirst ? menuText : undefined;
            }
            if (menuText === this.getLocalizedLabel('Between')) {
                selectedValue = this.getLocalizedLabel(isFirst ? 'GreaterThanOrEqual' : 'LessThanOrEqual');
            }
        }
        var col = this.options.column;
        this.dropOptr = new DropDownList(extend({
            dataSource: dropDatasource,
            fields: { text: 'text', value: 'value' },
            text: selectedValue,
            open: this.dropDownOpen.bind(this),
            enableRtl: this.parent.enableRtl,
            change: this.dropDownValueChange.bind(this)
        }, col.filter.params));
        this.dropOptr.appendTo(optrInput);
        var operator = this.getSelectedValue(selectedValue);
        return { fieldElement: fieldElement, operator: operator };
    };
    ExcelFilterBase.prototype.dropDownOpen = function (args) {
        args.popup.element.style.zIndex = (this.dialogObj.zIndex + 1).toString();
    };
    ExcelFilterBase.prototype.dropDownValueChange = function (args) {
        if (args.element.id.includes('-xlfl-frstoptr')) {
            this.firstOperator = args.value.toString();
        }
        else {
            this.secondOperator = args.value.toString();
        }
    };
    /**
     * @hidden
     */
    ExcelFilterBase.prototype.getFilterUIInfo = function () {
        return { firstOperator: this.firstOperator, secondOperator: this.secondOperator, field: this.options.field };
    };
    ExcelFilterBase.prototype.getSelectedValue = function (text) {
        var selectedField = new DataManager(this.optrData).executeLocal(new Query().where('text', 'equal', text));
        return !isNullOrUndefined(selectedField[0]) ? selectedField[0].value : '';
    };
    ExcelFilterBase.prototype.dropSelectedVal = function (col, predicates, isFirst) {
        var operator;
        if (predicates && predicates.length > 0) {
            operator = predicates.length === 2 ?
                (isFirst ? predicates[0].operator : predicates[1].operator) :
                (isFirst ? predicates[0].operator : undefined);
        }
        else if (isFirst && col.type === 'string' && !col.filter.operator) {
            operator = 'startswith';
        }
        else {
            operator = isFirst ? col.filter.operator || 'equal' : undefined;
        }
        return this.getSelectedText(operator);
    };
    ExcelFilterBase.prototype.getSelectedText = function (operator) {
        var selectedField = new DataManager(this.optrData).executeLocal(new Query().where('value', 'equal', operator));
        return !isNullOrUndefined(selectedField[0]) ? selectedField[0].text : '';
    };
    ExcelFilterBase.prototype.renderFilterUI = function (column, dlgConetntEle) {
        var predicates = this.existingPredicate[column];
        var table = this.parent.createElement('table', { className: 'e-xlfl-table' });
        dlgConetntEle.appendChild(table);
        var colGroup = this.parent.createElement('colGroup');
        colGroup.innerHTML = '<col style="width: 50%"></col><col style="width: 50%"></col>';
        table.appendChild(colGroup);
        //Renders first dropdown
        /* tslint:disable-next-line:max-line-length */
        var optr = this.renderOperatorUI(column, table, '-xlfl-frstoptr', predicates, true);
        this.firstOperator = optr.operator;
        //Renders first value
        this.renderFlValueUI(column, optr, '-xlfl-frstvalue', predicates, true);
        var predicate = this.parent.createElement('tr', { className: 'e-xlfl-predicate' });
        table.appendChild(predicate);
        //Renders first radion button
        this.renderRadioButton(column, predicate, predicates);
        //Renders second dropdown
        optr = this.renderOperatorUI(column, table, '-xlfl-secndoptr', predicates, false);
        this.secondOperator = optr.operator;
        //Renders second text box
        this.renderFlValueUI(column, optr, '-xlfl-secndvalue', predicates, false);
    };
    ExcelFilterBase.prototype.renderRadioButton = function (column, tr, predicates) {
        var td = this.parent.createElement('td', { className: 'e-xlfl-radio', attrs: { 'colSpan': '2' } });
        tr.appendChild(td);
        var radioDiv = this.parent
            .createElement('div', { className: 'e-xlfl-radiodiv', attrs: { 'style': 'display: inline-block' } });
        var isComplex = !isNullOrUndefined(column) && isComplexField(column);
        var complexFieldName = !isNullOrUndefined(column) && getComplexFieldID(column);
        /* tslint:disable-next-line:max-line-length */
        var frstpredicate = this.parent.createElement('input', { id: isComplex ? complexFieldName + 'e-xlfl-frstpredicate' : column + 'e-xlfl-frstpredicate', attrs: { 'type': 'radio' } });
        /* tslint:disable-next-line:max-line-length */
        var secndpredicate = this.parent.createElement('input', { id: isComplex ? complexFieldName + 'e-xlfl-secndpredicate' : column + 'e-xlfl-secndpredicate', attrs: { 'type': 'radio' } });
        //appends into div
        radioDiv.appendChild(frstpredicate);
        radioDiv.appendChild(secndpredicate);
        td.appendChild(radioDiv);
        if (this.options.type === 'string') {
            this.renderMatchCase(column, tr, td, '-xlflmtcase', predicates);
        }
        // Initialize AND RadioButton component.
        /* tslint:disable-next-line:max-line-length */
        var andRadio = new RadioButton({ label: this.getLocalizedLabel('AND'), name: 'default', cssClass: 'e-xlfl-radio-and', checked: true, enableRtl: this.parent.enableRtl });
        // Initialize OR RadioButton component.
        /* tslint:disable-next-line:max-line-length */
        var orRadio = new RadioButton({ label: this.getLocalizedLabel('OR'), name: 'default', cssClass: 'e-xlfl-radio-or', enableRtl: this.parent.enableRtl });
        var flValue = predicates && predicates.length === 2 ? predicates[1].predicate : 'and';
        if (flValue === 'and') {
            andRadio.checked = true;
            orRadio.checked = false;
        }
        else {
            orRadio.checked = true;
            andRadio.checked = false;
        }
        // Render initialized RadioButton.
        andRadio.appendTo(frstpredicate);
        orRadio.appendTo(secndpredicate);
    };
    /* tslint:disable-next-line:no-any */
    ExcelFilterBase.prototype.removeObjects = function (elements) {
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var obj = elements_1[_i];
            if (obj && !obj.isDestroyed) {
                obj.destroy();
            }
        }
    };
    /* tslint:disable-next-line:max-line-length */
    ExcelFilterBase.prototype.renderFlValueUI = function (column, optr, elementId, predicates, isFirst) {
        var value = this.parent.createElement('td', { className: 'e-xlfl-value' });
        optr.fieldElement.appendChild(value);
        var isComplex = !isNullOrUndefined(column) && isComplexField(column);
        var complexFieldName = !isNullOrUndefined(column) && getComplexFieldID(column);
        var valueDiv = this.parent.createElement('div', { className: 'e-xlfl-valuediv' });
        var isFilteredCol = this.options.filteredColumns.some(function (col) { return column === col.field; });
        var fltrPredicates = this.options.filteredColumns.filter(function (col) { return col.field === column; });
        if (this.options.column.filterTemplate) {
            var data = {};
            var columnObj = this.options.column;
            if (isFilteredCol && elementId) {
                data = this.getExcelFilterData(elementId, data, columnObj, predicates, fltrPredicates);
            }
            var isReactCompiler = this.parent.isReact && typeof (this.options.column.filterTemplate) !== 'string';
            var tempID = this.parent.element.id + columnObj.uid + 'filterTemplate';
            if (isReactCompiler) {
                this.options.column.getFilterTemplate()(data, this.parent, 'filterTemplate', tempID, null, null, valueDiv);
                this.parent.renderTemplates();
            }
            else {
                var element = this.options.column.getFilterTemplate()(data, this.parent, 'filterTemplate', tempID);
                appendChildren(valueDiv, element);
            }
            if (isBlazor()) {
                valueDiv.children[0].classList.add(elementId);
                if (this.dlgDiv.querySelectorAll('.e-xlfl-value').length > 1) {
                    updateBlazorTemplate(tempID, 'FilterTemplate', columnObj);
                }
            }
            else {
                valueDiv.children[0].id = isComplex ? complexFieldName + elementId : column + elementId;
            }
            value.appendChild(valueDiv);
        }
        else {
            var valueInput = this.parent
                .createElement('input', { id: isComplex ? complexFieldName + elementId : column + elementId });
            valueDiv.appendChild(valueInput);
            value.appendChild(valueDiv);
            var flValue = void 0;
            var predicate = void 0;
            if (predicates && predicates.length > 0) {
                predicate = predicates.length === 2 ?
                    (isFirst ? predicates[0] : predicates[1]) :
                    (isFirst ? predicates[0] : undefined);
                flValue = (predicate && predicate.operator === optr.operator) ? predicate.value : undefined;
            }
            var types = {
                'string': this.renderAutoComplete.bind(this),
                'number': this.renderNumericTextBox.bind(this),
                'date': this.renderDate.bind(this),
                'datetime': this.renderDateTime.bind(this)
            };
            types[this.options.type](this.options, column, valueInput, flValue, this.parent.enableRtl);
        }
    };
    /* tslint:disable-next-line:max-line-length */
    ExcelFilterBase.prototype.getExcelFilterData = function (elementId, data, columnObj, predicates, fltrPredicates) {
        var predIndex = elementId === '-xlfl-frstvalue' ? 0 : 1;
        if (elementId === '-xlfl-frstvalue' || fltrPredicates.length > 1) {
            data = { column: predicates instanceof Array ? predicates[predIndex] : predicates };
            var indx = this.options.column.columnData && fltrPredicates.length > 1 ?
                (this.options.column.columnData.length === 1 ? 0 : 1) : predIndex;
            data[this.options.field] = columnObj.foreignKeyValue ? this.options.column.columnData[indx][columnObj.foreignKeyValue] :
                fltrPredicates[indx].value;
            if (this.options.foreignKeyValue) {
                data[this.options.foreignKeyValue] = this.options.column.columnData[indx][columnObj.foreignKeyValue];
            }
        }
        return data;
    };
    /* tslint:disable-next-line:max-line-length */
    ExcelFilterBase.prototype.renderMatchCase = function (column, tr, matchCase, elementId, predicates) {
        /* tslint:disable-next-line:max-line-length */
        var matchCaseDiv = this.parent.createElement('div', { className: 'e-xlfl-matchcasediv', attrs: { 'style': 'display: inline-block' } });
        var isComplex = !isNullOrUndefined(column) && isComplexField(column);
        var complexFieldName = !isNullOrUndefined(column) && getComplexFieldID(column);
        var matchCaseInput = this.parent.createElement('input', { id: isComplex ? complexFieldName + elementId : column + elementId, attrs: { 'type': 'checkbox' } });
        matchCaseDiv.appendChild(matchCaseInput);
        matchCase.appendChild(matchCaseDiv);
        var flValue = predicates && predicates.length > 0 ?
            (predicates && predicates.length === 2 ? predicates[1].matchCase : predicates[0].matchCase) :
            false;
        // Initialize Match Case check box.
        var checkbox = new CheckBox({
            label: this.getLocalizedLabel('MatchCase'),
            enableRtl: this.parent.enableRtl, checked: flValue
        });
        // Render initialized CheckBox.
        checkbox.appendTo(matchCaseInput);
    };
    /* tslint:disable-next-line:max-line-length */
    ExcelFilterBase.prototype.renderDate = function (options, column, inputValue, fValue, isRtl) {
        var format = getCustomDateFormat(options.format, options.type);
        this.datePicker = new DatePicker(extend({
            format: format,
            cssClass: 'e-popup-flmenu',
            placeholder: this.getLocalizedLabel('CustomFilterDatePlaceHolder'),
            width: '100%',
            enableRtl: isRtl,
            value: new Date(fValue),
            locale: this.parent.locale,
        }, options.column.filter.params));
        this.datePicker.appendTo(inputValue);
    };
    /* tslint:disable-next-line:max-line-length */
    ExcelFilterBase.prototype.renderDateTime = function (options, column, inputValue, fValue, isRtl) {
        var format = getCustomDateFormat(options.format, options.type);
        this.dateTimePicker = new DateTimePicker(extend({
            format: format,
            cssClass: 'e-popup-flmenu',
            placeholder: this.getLocalizedLabel('CustomFilterDatePlaceHolder'),
            width: '100%',
            enableRtl: isRtl,
            value: new Date(fValue),
            locale: this.parent.locale,
        }, options.column.filter.params));
        this.dateTimePicker.appendTo(inputValue);
    };
    ExcelFilterBase.prototype.completeAction = function (e) {
        e.result = distinctStringValues(e.result);
    };
    /* tslint:disable-next-line:max-line-length */
    ExcelFilterBase.prototype.renderNumericTextBox = function (options, column, inputValue, fValue, isRtl) {
        this.numericTxtObj = new NumericTextBox(extend({
            format: options.format,
            placeholder: this.getLocalizedLabel('CustomFilterPlaceHolder'),
            enableRtl: isRtl,
            value: fValue,
            locale: this.parent.locale,
        }, options.column.filter.params));
        this.numericTxtObj.appendTo(inputValue);
    };
    /* tslint:disable-next-line:max-line-length */
    ExcelFilterBase.prototype.renderAutoComplete = function (options, column, inputValue, fValue, isRtl) {
        var _this = this;
        var colObj = this.options.column;
        var isForeignColumn = this.isForeignColumn(colObj);
        var dataSource = isForeignColumn ? colObj.dataSource : options.dataSource;
        var fields = { value: isForeignColumn ? colObj.foreignKeyValue : column };
        var actObj = new AutoComplete(extend({
            dataSource: dataSource instanceof DataManager ? dataSource : new DataManager(dataSource),
            fields: fields,
            query: this.getQuery(),
            sortOrder: 'Ascending',
            locale: this.parent.locale,
            cssClass: 'e-popup-flmenu',
            autofill: true,
            focus: function () {
                var isComplex = !isNullOrUndefined(column) && isComplexField(column);
                var complexFieldName = !isNullOrUndefined(column) && getComplexFieldID(column);
                var columnvalue = isComplex ? complexFieldName : column;
                actObj.filterType = _this.dlgDiv.querySelector('#' + columnvalue +
                    (inputValue.id === (columnvalue + '-xlfl-frstvalue') ?
                        '-xlfl-frstoptr' :
                        '-xlfl-secndoptr')).ej2_instances[0].value;
                actObj.ignoreCase = options.type === 'string' ?
                    !_this.dlgDiv.querySelector('#' + columnvalue + '-xlflmtcase').ej2_instances[0].checked :
                    true;
                actObj.filterType = !isNullOrUndefined(actObj.filterType) ? actObj.filterType :
                    'equal';
            },
            placeholder: this.getLocalizedLabel('CustomFilterPlaceHolder'),
            enableRtl: isRtl,
            actionComplete: function (e) {
                var isComplex = !isNullOrUndefined(column) && isComplexField(column);
                e.result = e.result.filter(function (obj, index, arr) {
                    return arr.map(function (mapObject) {
                        return isComplex ? _this.performComplexDataOperation(actObj.fields.value, mapObject)
                            : mapObject[actObj.fields.value];
                    }).indexOf(isComplex ? _this.performComplexDataOperation(actObj.fields.value, obj) :
                        obj[_this.actObj.fields.value]) === index;
                });
            },
            text: fValue
        }, colObj.filter.params));
        if (dataSource && 'result' in dataSource) {
            var defObj = eventPromise({ requestType: 'stringfilterrequest' }, this.getQuery());
            this.parent.trigger(events.dataStateChange, defObj.state);
            var def = defObj.deffered;
            def.promise.then(function (e) {
                actObj.dataSource = new DataManager(e);
            });
        }
        actObj.appendTo(inputValue);
        this.actObj = actObj;
    };
    ExcelFilterBase.prototype.performComplexDataOperation = function (value, mapObject) {
        var returnObj;
        var length = value.split('.').length;
        var splits = value.split('.');
        var duplicateMap = mapObject;
        for (var i = 0; i < length; i++) {
            returnObj = duplicateMap[splits[i]];
            duplicateMap = returnObj;
        }
        return returnObj;
    };
    return ExcelFilterBase;
}(CheckBoxFilterBase));
export { ExcelFilterBase };
