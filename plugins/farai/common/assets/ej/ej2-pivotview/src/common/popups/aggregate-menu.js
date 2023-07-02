import { createElement, remove, extend, getInstance, select } from '@syncfusion/ej2-base';
import * as cls from '../../common/base/css-constant';
import { ContextMenu as Menu } from '@syncfusion/ej2-navigations';
import { Dialog } from '@syncfusion/ej2-popups';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import * as events from '../../common/base/constant';
import { PivotUtil } from '../../base/util';
/**
 * `AggregateMenu` module to create aggregate type popup.
 */
/** @hidden */
var AggregateMenu = /** @class */ (function () {
    /**
     * Constructor for the rener action.
     * @hidden
     */
    function AggregateMenu(parent) {
        this.menuInfo = [];
        this.parent = parent;
    }
    /**
     * Initialize the pivot table rendering
     * @returns void
     * @private
     */
    AggregateMenu.prototype.render = function (args, parentElement) {
        this.parentElement = parentElement;
        this.openContextMenu(args);
    };
    AggregateMenu.prototype.openContextMenu = function (args) {
        var _this = this;
        var fieldName = args.target.parentElement.id;
        this.buttonElement = args.target.parentElement;
        var isStringField = this.parent.engineModule.fieldList[fieldName].type !== 'number' ? 1 : 0;
        this.summaryTypes = this.getMenuItem(isStringField).slice();
        var eventArgs = {
            cancel: false, fieldName: fieldName, aggregateTypes: this.summaryTypes
        };
        var control = this.parent.getModuleName() === 'pivotfieldlist' && this.parent.isPopupView ?
            this.parent.pivotGridModule : this.parent;
        control.trigger(events.aggregateMenuOpen, eventArgs, function (observedArgs) {
            if (!observedArgs.cancel) {
                _this.summaryTypes = observedArgs.aggregateTypes;
                _this.createContextMenu(isStringField);
                _this.currentMenu = args.target;
                var pos = _this.currentMenu.getBoundingClientRect();
                if (_this.parent.enableRtl) {
                    _this.menuInfo[isStringField].open(pos.top + (window.scrollY || document.documentElement.scrollTop), pos.left - 105);
                }
                else {
                    _this.menuInfo[isStringField].open(pos.top + (window.scrollY || document.documentElement.scrollTop), pos.left);
                }
            }
        });
    };
    AggregateMenu.prototype.createContextMenu = function (isStringField) {
        var _this = this;
        var menuItems = [];
        menuItems[isStringField] = [];
        if (this.menuInfo[isStringField] && !this.menuInfo[isStringField].isDestroyed) {
            this.menuInfo[isStringField].destroy();
        }
        var checkDuplicates = [];
        for (var i = 0; i < this.summaryTypes.length; i++) {
            var key = this.summaryTypes[i];
            if (isStringField) {
                if ((['Count', 'DistinctCount'].indexOf(key) > -1) && (checkDuplicates.indexOf(key) < 0)) {
                    menuItems[isStringField].push({ text: this.parent.localeObj.getConstant(key), id: this.parent.element.id + 'StringMenu_' + key });
                    checkDuplicates.push(key);
                }
            }
            else {
                if ((this.parent.getAllSummaryType().indexOf(key) > -1) && (checkDuplicates.indexOf(key) < 0)) {
                    menuItems[isStringField].push({ text: this.parent.localeObj.getConstant(key), id: this.parent.element.id + '_' + key });
                    checkDuplicates.push(key);
                }
            }
        }
        if (menuItems[isStringField].length >= 7) {
            menuItems[isStringField].splice(7);
            menuItems[isStringField].push({
                text: this.parent.localeObj.getConstant('MoreOption'),
                id: this.parent.element.id + '_' + 'MoreOption'
            });
        }
        var menuOptions;
        menuOptions = {
            items: menuItems[isStringField],
            enableRtl: this.parent.enableRtl,
            beforeOpen: this.beforeMenuOpen.bind(this, isStringField),
            onClose: function (args) {
                select('#' + _this.buttonElement.id, _this.parentElement).focus();
            },
            select: this.selectOptionInContextMenu.bind(this)
        };
        var contextMenu = document.getElementById(this.parent.element.id + (isStringField ? 'valueFieldStringContextMenu' : 'valueFieldContextMenu'));
        if (contextMenu !== null) {
            contextMenu.innerHTML = '';
        }
        else {
            contextMenu = createElement('ul', {
                id: this.parent.element.id + (isStringField ? 'valueFieldStringContextMenu' : 'valueFieldContextMenu')
            });
        }
        this.parent.element.appendChild(contextMenu);
        this.menuInfo[isStringField] = new Menu(menuOptions);
        this.menuInfo[isStringField].isStringTemplate = true;
        this.menuInfo[isStringField].appendTo(contextMenu);
    };
    AggregateMenu.prototype.getMenuItem = function (isStringField) {
        var menuItems = [];
        for (var i = 0; i < this.parent.aggregateTypes.length; i++) {
            var key = this.parent.aggregateTypes[i];
            if (isStringField) {
                if ((['Count', 'DistinctCount'].indexOf(key) > -1) && (menuItems.indexOf(key) === -1)) {
                    menuItems.push(key);
                }
            }
            else {
                if ((this.parent.getAllSummaryType().indexOf(key) > -1) && (menuItems.indexOf(key) === -1)) {
                    menuItems.push(key);
                }
            }
        }
        return menuItems;
    };
    AggregateMenu.prototype.beforeMenuOpen = function (isString, args) {
        args.element.style.zIndex = (this.menuInfo[isString].element.style.zIndex + 3).toString();
        args.element.style.display = 'inline';
    };
    /** @hidden */
    AggregateMenu.prototype.createValueSettingsDialog = function (target, parentElement, type) {
        var _this = this;
        this.parentElement = parentElement;
        var valueDialog = createElement('div', {
            id: this.parentElement.id + '_ValueDialog',
            className: 'e-value-field-settings',
            attrs: { 'data-field': target.id }
        });
        this.parentElement.appendChild(valueDialog);
        this.valueDialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            header: this.parent.localeObj.getConstant('valueFieldSettings'),
            content: this.createFieldOptions(target, type),
            isModal: true,
            visible: true,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.updateValueSettings.bind(this),
                    buttonModel: { cssClass: cls.OK_BUTTON_CLASS, content: this.parent.localeObj.getConstant('ok'), isPrimary: true }
                },
                {
                    click: function () { _this.valueDialog.hide(); },
                    buttonModel: { cssClass: cls.CANCEL_BUTTON_CLASS, content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            /* tslint:disable-next-line:max-line-length */
            closeOnEscape: (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.renderMode === 'Popup') ? false : true,
            target: this.parentElement,
            overlayClick: function () { _this.removeDialog(); },
            close: this.removeDialog.bind(this)
        });
        this.valueDialog.isStringTemplate = true;
        this.valueDialog.appendTo(valueDialog);
        // this.valueDialog.element.querySelector('.e-dlg-header').innerHTML = this.parent.localeObj.getConstant('valueFieldSettings');
    };
    /* tslint:disable:max-func-body-length */
    AggregateMenu.prototype.createFieldOptions = function (buttonElement, type) {
        var fieldCaption = buttonElement.getAttribute('data-caption');
        var summaryType = (type && type !== 'MoreOption') ? type : buttonElement.getAttribute('data-type');
        var baseField = buttonElement.getAttribute('data-basefield');
        var baseItem = buttonElement.getAttribute('data-baseitem');
        summaryType = (summaryType.toString() !== 'undefined' ? summaryType : 'Sum');
        var summaryDataSource = [];
        var summaryItems = this.parent.aggregateTypes;
        var checkDuplicates = [];
        for (var i = 0; i < summaryItems.length; i++) {
            if (this.parent.getAllSummaryType().indexOf(summaryItems[i]) > -1 && checkDuplicates.indexOf(summaryItems[i]) < 0) {
                summaryDataSource.push({ value: summaryItems[i], text: this.parent.localeObj.getConstant(summaryItems[i]) });
                checkDuplicates.push(summaryItems[i]);
            }
        }
        var baseItemTypes = ['DifferenceFrom', 'PercentageOfDifferenceFrom'];
        var baseFieldTypes = ['DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentTotal'];
        var dataFields = extend([], this.parent.dataSourceSettings.rows, null, true);
        dataFields = dataFields.concat(this.parent.dataSourceSettings.columns);
        var fieldDataSource = [];
        var fieldItemDataSource = [];
        // let summaryDataSource: { [key: string]: Object }[] = [];
        // for (let type of summaryTypes) {
        //     summaryDataSource.push({ value: type, text: type });
        // }
        for (var _i = 0, dataFields_1 = dataFields; _i < dataFields_1.length; _i++) {
            var field = dataFields_1[_i];
            var value = field.name;
            var text = (field.caption ? field.caption : field.name);
            fieldDataSource.push({ value: value, text: text });
        }
        /* tslint:disable-next-line:max-line-length */
        baseField = (baseField && (baseField.toString() !== 'undefined' && baseField.toString() !== 'null') ? baseField : fieldDataSource[0].value);
        fieldItemDataSource = Object.keys(this.parent.engineModule.fieldList[(baseField.toString() !== 'undefined' ?
            baseField : fieldDataSource[0].value)].formattedMembers);
        baseItem = (baseItem.toString() !== 'undefined' ? baseItem : fieldItemDataSource[0]);
        var mainDiv = createElement('div', {
            className: 'e-value-field-div-content', id: this.parentElement.id + '_field_div_content',
            attrs: { 'data-type': summaryType, 'data-caption': fieldCaption, 'data-basefield': baseField, 'data-baseitem': baseItem }
        });
        var textWrappper = createElement('div', { className: 'e-field-name-text-wrapper', });
        var filterWrapperDiv1 = createElement('div', { className: 'e-field-option-wrapper' });
        var optionWrapperDiv1 = createElement('div', { className: 'e-type-option-wrapper' });
        var optionWrapperDiv2 = createElement('div', { className: 'e-base-field-option-wrapper' });
        var optionWrapperDiv3 = createElement('div', { className: 'e-base-item-option-wrapper' });
        /* tslint:disable-next-line:max-line-length */
        var texttitle = createElement('div', { className: 'e-field-name-title', innerHTML: this.parent.localeObj.getConstant('sourceName') + '&nbsp;' });
        var textContent = createElement('div', { className: 'e-field-name-content', innerHTML: buttonElement.id.toString() });
        var inputTextDiv1 = createElement('div', {
            className: 'e-type-option-text', innerHTML: this.parent.localeObj.getConstant('sourceCaption')
        });
        var optionTextDiv1 = createElement('div', {
            className: 'e-base-field-option-text', innerHTML: this.parent.localeObj.getConstant('summarizeValuesBy')
        });
        var optionTextDiv2 = createElement('div', {
            className: 'e-base-item-option-text', innerHTML: this.parent.localeObj.getConstant('baseField')
        });
        var optionTextDiv3 = createElement('div', {
            className: 'e-type-option-text', innerHTML: this.parent.localeObj.getConstant('baseItem')
        });
        var inputDiv1 = createElement('div', { className: 'e-caption-input-wrapper' });
        var dropOptionDiv1 = createElement('div', { id: this.parentElement.id + '_type_option' });
        var dropOptionDiv2 = createElement('div', { id: this.parentElement.id + '_base_field_option' });
        var dropOptionDiv3 = createElement('div', { id: this.parentElement.id + '_base_item_option' });
        var inputField1 = createElement('input', {
            id: this.parentElement.id + 'type_input_option',
            className: 'e-caption-input-text',
            attrs: { 'type': 'text' }
        });
        textWrappper.appendChild(texttitle);
        textWrappper.appendChild(textContent);
        inputDiv1.appendChild(inputTextDiv1);
        inputDiv1.appendChild(inputField1);
        optionWrapperDiv1.appendChild(optionTextDiv1);
        optionWrapperDiv2.appendChild(optionTextDiv2);
        optionWrapperDiv3.appendChild(optionTextDiv3);
        optionWrapperDiv1.appendChild(dropOptionDiv1);
        optionWrapperDiv2.appendChild(dropOptionDiv2);
        optionWrapperDiv3.appendChild(dropOptionDiv3);
        filterWrapperDiv1.appendChild(textWrappper);
        filterWrapperDiv1.appendChild(inputDiv1);
        filterWrapperDiv1.appendChild(optionWrapperDiv1);
        filterWrapperDiv1.appendChild(optionWrapperDiv2);
        filterWrapperDiv1.appendChild(optionWrapperDiv3);
        mainDiv.appendChild(filterWrapperDiv1);
        var popupInstance = this;
        var optionWrapper1 = new DropDownList({
            dataSource: summaryDataSource, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' },
            value: summaryType,
            // popupWidth: 'auto',
            cssClass: cls.VALUE_OPTIONS_CLASS, width: '100%',
            change: function (args) {
                optionWrapper2.enabled = baseFieldTypes.indexOf(args.value) !== -1 ? true : false;
                optionWrapper3.enabled = baseItemTypes.indexOf(args.value) !== -1 ? true : false;
                if (optionWrapper3.enabled && optionWrapper3.dataSource.length === 1) {
                    optionWrapper3.dataSource = fieldItemDataSource;
                    optionWrapper3.dataBind();
                }
            }
        });
        optionWrapper1.isStringTemplate = true;
        optionWrapper1.appendTo(dropOptionDiv1);
        var optionWrapper2 = new DropDownList({
            dataSource: fieldDataSource, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' },
            value: baseField,
            // popupWidth: 'auto',
            enabled: (baseFieldTypes.indexOf(summaryType) !== -1 ? true : false),
            cssClass: cls.VALUE_OPTIONS_CLASS, width: '100%',
            change: function (args) {
                fieldItemDataSource = Object.keys(popupInstance.parent.engineModule.fieldList[args.value].formattedMembers);
                optionWrapper3.dataSource = fieldItemDataSource;
                optionWrapper3.value = fieldItemDataSource[0];
                optionWrapper3.filterBarPlaceholder = popupInstance.parent.localeObj.getConstant('example') + ' ' + fieldItemDataSource[0];
                optionWrapper3.dataBind();
            }
        });
        optionWrapper2.isStringTemplate = true;
        optionWrapper2.appendTo(dropOptionDiv2);
        var optionWrapper3 = new DropDownList({
            dataSource: [fieldItemDataSource[0]], enableRtl: this.parent.enableRtl,
            value: baseItem,
            // popupWidth: 'auto',
            allowFiltering: true,
            filterBarPlaceholder: this.parent.localeObj.getConstant('example') + ' ' + fieldItemDataSource[0],
            enabled: (baseItemTypes.indexOf(summaryType) !== -1 ? true : false),
            cssClass: cls.FILTER_OPERATOR_CLASS, width: '100%',
        });
        optionWrapper3.isStringTemplate = true;
        optionWrapper3.appendTo(dropOptionDiv3);
        var inputObj1 = new MaskedTextBox({
            placeholder: 'Enter field caption',
            // floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl,
            value: fieldCaption, width: '100%'
        });
        inputObj1.isStringTemplate = true;
        inputObj1.appendTo(inputField1);
        return mainDiv;
    };
    AggregateMenu.prototype.selectOptionInContextMenu = function (menu) {
        if (menu.item.text !== null) {
            var buttonElement = this.currentMenu.parentElement;
            var type = menu.item.id.split('_').pop();
            if (type === 'MoreOption' || type === 'PercentageOfDifferenceFrom'
                || type === 'PercentageOfParentTotal' || type === 'DifferenceFrom') {
                this.createValueSettingsDialog(buttonElement, this.parentElement, type);
            }
            else {
                var field = buttonElement.getAttribute('data-uid');
                var valuefields = this.parent.dataSourceSettings.values;
                var contentElement = buttonElement.querySelector('.e-content');
                var captionName = menu.item.text + ' ' + this.parent.localeObj.getConstant('of') + ' ' +
                    this.parent.engineModule.fieldList[field].caption;
                contentElement.innerHTML = captionName;
                contentElement.setAttribute('title', captionName);
                buttonElement.setAttribute('data-type', type);
                for (var vCnt = 0; vCnt < this.parent.dataSourceSettings.values.length; vCnt++) {
                    if (this.parent.dataSourceSettings.values[vCnt].name === field) {
                        /* tslint:disable:align */
                        var dataSourceItem = extend({}, valuefields[vCnt].properties ?
                            valuefields[vCnt].properties : valuefields[vCnt], null, true);
                        /* tslint:enable:align */
                        dataSourceItem.type = type;
                        this.parent.engineModule.fieldList[field].aggregateType = type;
                        valuefields.splice(vCnt, 1, dataSourceItem);
                        this.parent.lastAggregationInfo = dataSourceItem;
                    }
                }
                this.updateDataSource();
            }
        }
    };
    AggregateMenu.prototype.updateDataSource = function (isRefreshed) {
        if (!this.parent.allowDeferLayoutUpdate || this.parent.getModuleName() === 'pivotview') {
            this.parent.updateDataSource(isRefreshed);
        }
        else {
            if (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.renderMode === 'Popup') {
                /* tslint:disable:align */
                this.parent.pivotGridModule.setProperties({
                    dataSourceSettings: this.parent.dataSourceSettings.properties
                }, true);
                this.parent.pivotGridModule.notify(events.uiUpdate, this);
                this.parent.pivotGridModule.engineModule = this.parent.engineModule;
                /* tslint:enable:align */
            }
            else {
                this.parent.triggerPopulateEvent();
            }
        }
    };
    AggregateMenu.prototype.updateValueSettings = function () {
        var dialogElement = this.valueDialog.element;
        var captionInstance = getInstance('#' + this.parentElement.id + 'type_input_option', MaskedTextBox);
        var summaryInstance = getInstance('#' + this.parentElement.id + '_type_option', DropDownList);
        var baseFieldInstance = getInstance('#' + this.parentElement.id + '_base_field_option', DropDownList);
        var baseItemInstance = getInstance('#' + this.parentElement.id + '_base_item_option', DropDownList);
        var fieldName = dialogElement.getAttribute('data-field');
        var buttonElement;
        if (this.parentElement.querySelector('.' + cls.PIVOT_BUTTON_CLASS)) {
            buttonElement = this.parentElement.
                querySelector('.' + cls.PIVOT_BUTTON_CLASS + '.' + fieldName.replace(/[^A-Z0-9]/ig, ''));
        }
        if (buttonElement) {
            var contentElement = buttonElement.querySelector('.e-content');
            var captionName = this.parent.localeObj.getConstant(summaryInstance.value) + ' ' +
                this.parent.localeObj.getConstant('of') + ' ' + captionInstance.value;
            contentElement.innerHTML = captionName;
            contentElement.setAttribute('title', captionName);
            buttonElement.setAttribute('data-type', summaryInstance.value);
            buttonElement.setAttribute('data-caption', captionInstance.value);
            buttonElement.setAttribute('data-basefield', baseFieldInstance.value);
            buttonElement.setAttribute('data-baseitem', baseItemInstance.value);
        }
        var selectedField = PivotUtil.getFieldByName(fieldName, this.parent.dataSourceSettings.values);
        selectedField = selectedField.properties ?
            selectedField.properties : selectedField;
        selectedField.caption = captionInstance.value;
        selectedField.type = summaryInstance.value;
        selectedField.baseField = baseFieldInstance.value;
        selectedField.baseItem = baseItemInstance.value;
        this.valueDialog.close();
        // this.parent.axisFieldModule.render();
        this.parent.lastAggregationInfo = selectedField;
        this.updateDataSource(true);
    };
    AggregateMenu.prototype.removeDialog = function () {
        select('#' + this.buttonElement.id, this.parentElement).focus();
        if (this.valueDialog && !this.valueDialog.isDestroyed) {
            this.valueDialog.destroy();
        }
        if (document.getElementById(this.parentElement.id + '_ValueDialog')) {
            remove(document.getElementById(this.parentElement.id + '_ValueDialog'));
        }
    };
    /**
     * To destroy the pivot button event listener
     * @return {void}
     * @hidden
     */
    AggregateMenu.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        if (this.menuInfo) {
            if (this.menuInfo[1] !== undefined && !this.menuInfo[1].isDestroyed) {
                this.menuInfo[1].destroy();
            }
            if (this.menuInfo[0] !== undefined && !this.menuInfo[0].isDestroyed) {
                this.menuInfo[0].destroy();
            }
        }
        else {
            return;
        }
    };
    return AggregateMenu;
}());
export { AggregateMenu };
