import { createElement, remove, extend, getInstance, addClass, removeClass, isBlazor } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constant';
import { Dialog } from '@syncfusion/ej2-popups';
import { MaskedTextBox, NumericTextBox } from '@syncfusion/ej2-inputs';
import { MultiSelect, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
import { PivotUtil } from '../../base/util';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import * as events from '../../common/base/constant';
/**
 * `Grouping` module to create grouping option for date, number and custom in popup.
 */
/** @hidden */
var Grouping = /** @class */ (function () {
    /**
     * Constructor for the group UI rendering.
     * @hidden
     */
    function Grouping(parent) {
        /* tslint:disable-next-line:max-line-length */
        this.dateGroup = /_date_group_years|_date_group_quarters|_date_group_quarterYear|_date_group_months|_date_group_days|_date_group_hours|_date_group_minutes|_date_group_seconds/g;
        this.parent = parent;
        this.parent.groupingModule = this;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Grouping.prototype.getModuleName = function () {
        return 'grouping';
    };
    Grouping.prototype.render = function (args) {
        var target = args.target;
        var option = args.option;
        var parentElement = args.parentElement;
        this.parentElement = parentElement;
        this.selectedCellsInfo = [];
        this.isUpdate = false;
        var colIndex = Number(target.getAttribute('aria-colindex'));
        var rowIndex = Number(target.getAttribute('index'));
        var cell = this.parent.engineModule.pivotValues[rowIndex][colIndex];
        var fieldName = cell.valueSort.axis.toString();
        this.selectedCellsInfo = this.getSelectedCells(cell.axis, fieldName, cell.actualText.toString());
        this.selectedCellsInfo.push({ axis: cell.axis, fieldName: fieldName, name: cell.actualText.toString(), cellInfo: cell });
        if (option.replace(parentElement.id, '').indexOf('_custom_group') !== -1) {
            this.createGroupSettings(fieldName);
        }
        else {
            this.updateUnGroupSettings(fieldName);
        }
    };
    /**
     * Returns the selected members/headers by checing the valid members from the pivot table.
     * @method getSelectedOptions
     * @param  {SelectedCellsInfo[]} axis - Get the members name from the given selected cells information
     * @return {boolean}
     * @hidden
     */
    Grouping.prototype.getSelectedOptions = function (selectedCellsInfo) {
        var selectedOptions = [];
        for (var _i = 0, selectedCellsInfo_1 = selectedCellsInfo; _i < selectedCellsInfo_1.length; _i++) {
            var option = selectedCellsInfo_1[_i];
            if (PivotUtil.inArray(option.name, selectedOptions) === -1) {
                selectedOptions.push(option.name);
            }
        }
        return selectedOptions;
    };
    Grouping.prototype.createGroupSettings = function (fieldName) {
        var fieldList = this.parent.engineModule.fieldList[fieldName];
        var group = this.getGroupSettings(fieldName);
        if (this.selectedCellsInfo.length > 0) {
            var type = void 0;
            var isInvalid = false;
            if (fieldList.isCustomField) {
                if (!group) {
                    var dateGroup = this.getGroupSettings(fieldName.replace(this.dateGroup, ''));
                    var customGroup = this.getGroupSettings(fieldName.replace(/_custom_group/g, ''));
                    if (dateGroup) {
                        isInvalid = false;
                        type = 'date';
                        fieldName = fieldName.replace(this.dateGroup, '');
                    }
                    else if (customGroup) {
                        isInvalid = this.selectedCellsInfo.length === 1;
                        type = 'custom';
                    }
                }
                else if (group && group.type === 'Custom') {
                    if (this.selectedCellsInfo.length === 1) {
                        isInvalid = true;
                    }
                    else {
                        isInvalid = false;
                        type = 'custom';
                    }
                }
                else if (group && group.type === 'Number') {
                    isInvalid = false;
                    type = 'number';
                }
            }
            else {
                if (group) {
                    if (group.type === 'Number' || group.type === 'Date') {
                        isInvalid = false;
                        type = group.type === 'Date' ? 'date' : 'number';
                    }
                    else if (group.type === 'Custom') {
                        isInvalid = this.selectedCellsInfo.length === 1;
                        type = 'custom';
                    }
                }
                else {
                    if (fieldList.type === 'number' ||
                        (['datetime', 'date']).indexOf(fieldList.type) !== -1 || this.isDateType(fieldName)) {
                        isInvalid = false;
                        type = (this.selectedCellsInfo.length === 1 ? ((['datetime', 'date']).indexOf(fieldList.type) !== -1 ||
                            this.isDateType(fieldName)) ? 'date' : 'number' : 'custom');
                    }
                    else if (fieldList.type === 'string') {
                        isInvalid = this.selectedCellsInfo.length === 1;
                        type = 'custom';
                    }
                }
            }
            if (isInvalid) {
                /* tslint:disable-next-line:max-line-length */
                this.parent.pivotCommon.errorDialog.createErrorDialog(this.parent.localeObj.getConstant('warning'), this.parent.localeObj.getConstant('invalidSelection'));
                this.parent.grid.clearSelection();
            }
            else if (type && type !== '') {
                this.createGroupDialog(fieldName, type);
            }
        }
    };
    Grouping.prototype.updateUnGroupSettings = function (fieldName) {
        var fieldList = this.parent.engineModule.fieldList[fieldName];
        var groupFields = PivotUtil.cloneGroupSettings(this.parent.dataSourceSettings.groupSettings);
        var group = this.getGroupSettings(fieldName);
        if (this.selectedCellsInfo.length > 0) {
            var type = void 0;
            if (fieldList.isCustomField) {
                if (!group) {
                    var dateGroup = this.getGroupSettings(fieldName.replace(this.dateGroup, ''));
                    var customGroup = this.getGroupSettings(fieldName.replace(/_custom_group/g, ''));
                    if (dateGroup) {
                        type = 'date';
                        fieldName = fieldName.replace(this.dateGroup, '');
                    }
                    else if (customGroup) {
                        type = 'custom';
                    }
                }
                else if (group.type === 'Custom') {
                    type = 'custom';
                }
            }
            else {
                if (group) {
                    if (group.type === 'Number' || group.type === 'Date') {
                        type = group.type === 'Date' ? 'date' : 'number';
                    }
                }
            }
            if (type === 'date' || type === 'number') {
                groupFields = this.validateSettings(fieldName, groupFields, type, []);
            }
            else if (type === 'custom') {
                var selectedOptions = this.getSelectedOptions(this.selectedCellsInfo);
                groupFields = this.validateSettings(fieldName, groupFields, type, selectedOptions);
            }
            this.updateDateSource(groupFields, type);
        }
    };
    Grouping.prototype.updateDateSource = function (groupFields, type) {
        if (this.isUpdate) {
            if (isBlazor()) {
                PivotUtil.setPivotProperties(this.parent, { dataSourceSettings: { groupSettings: groupFields } });
            }
            else {
                this.parent.setProperties({ dataSourceSettings: { groupSettings: groupFields } }, true);
            }
            this.parent.updateGroupingReport(groupFields, (type === 'date' ? 'Date' : type === 'custom' ? 'Custom' : 'Number'));
            this.parent.notify(events.initialLoad, {});
        }
    };
    /* tslint:disable-next-line:max-line-length */
    Grouping.prototype.removeGroupSettings = function (fieldName, selectedOptions, groupFields, groupNames, type) {
        var index = groupNames.indexOf(fieldName);
        if (index !== -1) {
            var field = groupFields[index];
            for (var j = 0, len = field.customGroups.length; j < len; j++) {
                if (field.customGroups[j]) {
                    var group = field.customGroups[j];
                    if (PivotUtil.inArray(group.groupName, selectedOptions) !== -1) {
                        groupFields = this.modifyParentGroupItems(fieldName, groupFields, [group.groupName], group.items, groupNames);
                        field.customGroups.splice(j, 1);
                        this.isUpdate = true;
                        j--;
                        len--;
                    }
                }
            }
        }
        return groupFields;
    };
    Grouping.prototype.getGroupSettings = function (fieldName) {
        for (var _i = 0, _a = this.parent.dataSourceSettings.groupSettings; _i < _a.length; _i++) {
            var group = _a[_i];
            if (group.name === fieldName) {
                return group;
            }
        }
        return undefined;
    };
    Grouping.prototype.isDateType = function (fieldName) {
        for (var _i = 0, _a = this.parent.dataSourceSettings.formatSettings; _i < _a.length; _i++) {
            var format = _a[_i];
            if (format.name === fieldName && format.type) {
                return true;
            }
        }
        return false;
    };
    /**
     * Returns the selected members/headers by checing the valid members from the pivot table.
     * @method getSelectedCells
     * @param  {string} axis - Spicifies the axis name for the given field.
     * @param  {string} fieldName - Gets selected members for the given field name.
     * @param  {string} name - specifies the selected member name for the given field.
     * @return {boolean}
     * @hidden
     */
    Grouping.prototype.getSelectedCells = function (axis, fieldName, name) {
        var selectedCellsInfo = [];
        /* tslint:disable */
        var selectedElements = this.parent.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR + ',.' + cls.SELECTED_BGCOLOR);
        /* tslint:enable */
        for (var _i = 0, selectedElements_1 = selectedElements; _i < selectedElements_1.length; _i++) {
            var element = selectedElements_1[_i];
            var colIndex = Number(element.getAttribute('aria-colindex'));
            var rowIndex = Number(element.getAttribute('index'));
            var cell = this.parent.engineModule.pivotValues[rowIndex][colIndex];
            if (cell && (cell.axis === axis) && !(cell.type === 'grand sum' || cell.type === 'sum') &&
                cell.valueSort.axis === fieldName && name !== cell.actualText.toString()) {
                selectedCellsInfo.push({
                    axis: cell.axis,
                    fieldName: cell.valueSort.axis.toString(),
                    name: cell.actualText.toString(),
                    cellInfo: cell
                });
            }
        }
        return selectedCellsInfo;
    };
    Grouping.prototype.createGroupDialog = function (fieldName, type) {
        var _this = this;
        var groupDialog = createElement('div', {
            id: this.parentElement.id + '_GroupDialog',
            className: 'e-group-field-settings',
            attrs: { 'data-field': fieldName, 'data-type': type }
        });
        this.parentElement.appendChild(groupDialog);
        this.groupDialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            header: this.parent.localeObj.getConstant('grouping'),
            content: this.createGroupOptions(fieldName, type),
            isModal: true,
            visible: true,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            width: 300,
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.updateGroupSettings.bind(this),
                    buttonModel: { cssClass: cls.OK_BUTTON_CLASS, content: this.parent.localeObj.getConstant('ok'), isPrimary: true }
                },
                {
                    click: function () { _this.groupDialog.hide(); },
                    buttonModel: { cssClass: cls.CANCEL_BUTTON_CLASS, content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            overlayClick: function () { _this.removeDialog(); },
            closeOnEscape: true,
            close: this.removeDialog.bind(this),
            target: this.parentElement
        });
        this.groupDialog.isStringTemplate = true;
        this.groupDialog.appendTo(groupDialog);
    };
    Grouping.prototype.createGroupOptions = function (fieldName, type) {
        var _this = this;
        var groupInstance = this;
        var mainDiv = createElement('div', {
            className: 'e-group-field-div-content', id: this.parentElement.id + '_group_field_div_content',
            attrs: { 'data-fieldName': fieldName, 'data-type': type }
        });
        var groupWrapperDiv1 = createElement('div', { className: 'e-group-option-wrapper' });
        mainDiv.appendChild(groupWrapperDiv1);
        // this.parentElement.appendChild(mainDiv);
        var dataSource = this.parent.dataSourceSettings;
        var groupField = PivotUtil.getFieldByName(fieldName, dataSource.groupSettings);
        switch (type) {
            case 'custom':
                {
                    var caption = void 0;
                    var dataFields = dataSource.rows;
                    dataFields = dataFields.concat(dataSource.columns, dataSource.values, dataSource.filters);
                    /* tslint:disable:max-line-length */
                    var actualField = PivotUtil.getFieldByName(fieldName.replace(/_custom_group/g, ''), dataFields);
                    var currentField = PivotUtil.getFieldByName(fieldName, dataFields);
                    var nextField = PivotUtil.getFieldByName(fieldName + '_custom_group', dataFields);
                    if (currentField) {
                        var newFieldName = fieldName + '_custom_group';
                        caption = nextField ? nextField.caption :
                            this.parent.engineModule.fieldList[actualField.name].caption + (newFieldName.match(/_custom_group/g).length + 1);
                    }
                    var captionInputTextDiv1 = createElement('div', {
                        className: 'e-caption-option-text', innerHTML: this.parent.localeObj.getConstant('groupFieldCaption')
                    });
                    /* tslint:enable:max-line-length */
                    var captionInputDiv1 = createElement('div', { className: 'e-group-caption-wrapper' });
                    var captionInputField1 = createElement('input', {
                        id: this.parentElement.id + 'group_caption_option',
                        className: 'e-group-caption-text',
                        attrs: { 'type': 'text' }
                    });
                    captionInputDiv1.appendChild(captionInputTextDiv1);
                    captionInputDiv1.appendChild(captionInputField1);
                    groupWrapperDiv1.appendChild(captionInputDiv1);
                    var inputTextDiv1 = createElement('div', {
                        className: 'e-input-option-text', innerHTML: this.parent.localeObj.getConstant('groupTitle')
                    });
                    var inputDiv1 = createElement('div', { className: 'e-group-input-wrapper' });
                    var inputField1 = createElement('input', {
                        id: this.parentElement.id + 'group_input_option',
                        className: 'e-group-input-text',
                        attrs: { 'type': 'text' }
                    });
                    inputDiv1.appendChild(inputTextDiv1);
                    inputDiv1.appendChild(inputField1);
                    groupWrapperDiv1.appendChild(inputDiv1);
                    var captionInputObj1 = new MaskedTextBox({
                        placeholder: this.parent.localeObj.getConstant('captionName'),
                        enableRtl: this.parent.enableRtl,
                        value: caption, width: '100%'
                    });
                    captionInputObj1.isStringTemplate = true;
                    captionInputObj1.appendTo(captionInputField1);
                    var inputObj1 = new MaskedTextBox({
                        placeholder: this.parent.localeObj.getConstant('groupName'),
                        enableRtl: this.parent.enableRtl,
                        width: '100%'
                    });
                    inputObj1.isStringTemplate = true;
                    inputObj1.appendTo(inputField1);
                }
                break;
            case 'date':
            case 'number':
                {
                    var startAtWrapper = createElement('div', {
                        className: 'e-group-start-option-wrapper'
                    });
                    var startAtOptionDiv1 = createElement('input', {
                        id: this.parentElement.id + 'group_start_option',
                        className: 'e-group_start_option',
                        attrs: { 'type': 'checkbox' }
                    });
                    var startAtInputField1 = createElement('input', {
                        id: this.parentElement.id + 'group_start_input',
                        className: 'e-group_start_input',
                        attrs: { 'type': 'text' }
                    });
                    startAtWrapper.appendChild(startAtOptionDiv1);
                    startAtWrapper.appendChild(startAtInputField1);
                    groupWrapperDiv1.appendChild(startAtWrapper);
                    var endAtWrapper = createElement('div', {
                        className: 'e-group-end-option-wrapper'
                    });
                    var endAtOptionDiv1 = createElement('input', {
                        id: this.parentElement.id + 'group_end_option',
                        className: 'e-group_end_option',
                        attrs: { 'type': 'checkbox' }
                    });
                    var endAtInputField1 = createElement('input', {
                        id: this.parentElement.id + 'group_end_input',
                        className: 'e-group_end_input',
                        attrs: { 'type': 'text' }
                    });
                    endAtWrapper.appendChild(endAtOptionDiv1);
                    endAtWrapper.appendChild(endAtInputField1);
                    groupWrapperDiv1.appendChild(endAtWrapper);
                    var intervalWrapper = createElement('div', {
                        className: 'e-group-interval-option-wrapper'
                    });
                    var intervalTextDiv1 = createElement('div', {
                        className: 'e-group-inerval-option-text', innerHTML: this.parent.localeObj.getConstant('groupBy')
                    });
                    var intervalInputField1 = createElement('input', {
                        id: this.parentElement.id + 'group_interval_input',
                        className: 'e-group_interval_input',
                        attrs: { 'type': 'text' }
                    });
                    intervalWrapper.appendChild(intervalTextDiv1);
                    intervalWrapper.appendChild(intervalInputField1);
                    groupWrapperDiv1.appendChild(intervalWrapper);
                    var startAt = undefined;
                    var endAt = undefined;
                    if (type === 'date') {
                        var selectedGroups = [];
                        var groupData = [
                            { value: 'Seconds', text: this.parent.localeObj.getConstant('Seconds') },
                            { value: 'Minutes', text: this.parent.localeObj.getConstant('Minutes') },
                            { value: 'Hours', text: this.parent.localeObj.getConstant('Hours') },
                            { value: 'Days', text: this.parent.localeObj.getConstant('Days') },
                            { value: 'Months', text: this.parent.localeObj.getConstant('Months') },
                            { value: 'QuarterYear', text: this.parent.localeObj.getConstant('QuarterYear') },
                            { value: 'Quarters', text: this.parent.localeObj.getConstant('Quarters') },
                            { value: 'Years', text: this.parent.localeObj.getConstant('Years') },
                        ];
                        if (groupField && groupField.type === 'Date') {
                            selectedGroups = groupField.groupInterval;
                            startAt = groupField.startingAt ? groupField.startingAt.toString() : undefined;
                            endAt = groupField.endingAt ? groupField.endingAt.toString() : undefined;
                        }
                        else {
                            selectedGroups = ['Months'];
                        }
                        var startAtInputObj = new DateTimePicker({
                            placeholder: this.parent.localeObj.getConstant('chooseDate'),
                            enableRtl: this.parent.enableRtl,
                            format: 'dd/MM/yyyy hh:mm:ss a',
                            enabled: !(startAt === undefined),
                            width: '100%',
                        });
                        startAtInputObj.isStringTemplate = true;
                        startAtInputObj.appendTo(startAtInputField1);
                        var endAtInputObj = new DateTimePicker({
                            placeholder: this.parent.localeObj.getConstant('chooseDate'),
                            enableRtl: this.parent.enableRtl,
                            format: 'dd/MM/yyyy hh:mm:ss a',
                            enabled: !(endAt === undefined),
                            width: '100%',
                        });
                        endAtInputObj.isStringTemplate = true;
                        endAtInputObj.appendTo(endAtInputField1);
                        MultiSelect.Inject(CheckBoxSelection);
                        /* tslint:disable */
                        var intervalObj_1 = new MultiSelect({
                            dataSource: groupData,
                            value: selectedGroups,
                            fields: { text: 'text', value: 'value' },
                            mode: 'CheckBox',
                            showDropDownIcon: true,
                            enableSelectionOrder: false,
                            placeholder: this.parent.localeObj.getConstant('selectGroup'),
                            filterBarPlaceholder: this.parent.localeObj.getConstant('example') + ' ' + this.parent.localeObj.getConstant('Months'),
                            enableRtl: this.parent.enableRtl,
                            select: function () {
                                groupInstance.groupDialog.element.querySelector('.' + cls.OK_BUTTON_CLASS).removeAttribute('disabled');
                            },
                            removed: function () {
                                if (intervalObj_1.checkBoxSelectionModule.activeLi.length === 0) {
                                    groupInstance.groupDialog.element.querySelector('.' + cls.OK_BUTTON_CLASS).setAttribute('disabled', 'disabled');
                                }
                            }
                        });
                        /* tslint:enable */
                        intervalObj_1.isStringTemplate = true;
                        intervalObj_1.appendTo(intervalInputField1);
                        startAtInputObj.value = startAt === undefined ? null : new Date(startAt);
                        startAtInputObj.dataBind();
                        endAtInputObj.value = endAt === undefined ? null : new Date(endAt);
                        endAtInputObj.dataBind();
                    }
                    else {
                        var selectedInterval = undefined;
                        if (groupField && groupField.type === 'Number') {
                            selectedInterval = groupField.rangeInterval;
                            startAt = groupField.startingAt ? groupField.startingAt.toString() : undefined;
                            endAt = groupField.endingAt ? groupField.endingAt.toString() : undefined;
                        }
                        else {
                            selectedInterval = 2;
                        }
                        var startAtInputObj = new NumericTextBox({
                            placeholder: this.parent.localeObj.getConstant('enterValue'),
                            enableRtl: this.parent.enableRtl,
                            showClearButton: true,
                            format: '###',
                            value: startAt === undefined ? undefined : parseInt(startAt, 10),
                            enabled: !(startAt === undefined),
                            width: '100%',
                        });
                        startAtInputObj.isStringTemplate = true;
                        startAtInputObj.appendTo(startAtInputField1);
                        var endAtInputObj = new NumericTextBox({
                            placeholder: this.parent.localeObj.getConstant('enterValue'),
                            enableRtl: this.parent.enableRtl,
                            showClearButton: true,
                            format: '###',
                            value: endAt === undefined ? undefined : parseInt(endAt, 10),
                            enabled: !(endAt === undefined),
                            width: '100%'
                        });
                        endAtInputObj.isStringTemplate = true;
                        endAtInputObj.appendTo(endAtInputField1);
                        var intervalObj = new NumericTextBox({
                            placeholder: this.parent.localeObj.getConstant('enterValue'),
                            enableRtl: this.parent.enableRtl,
                            showClearButton: true,
                            format: '###',
                            min: 1,
                            value: selectedInterval,
                            width: '100%'
                        });
                        intervalObj.isStringTemplate = true;
                        intervalObj.appendTo(intervalInputField1);
                    }
                    var startAtObj = new CheckBox({
                        label: this.parent.localeObj.getConstant('startAt'),
                        checked: !(startAt === undefined),
                        enableRtl: this.parent.enableRtl,
                        change: function (args) {
                            var startAtObj = (type === 'date' ?
                                getInstance('#' + _this.parentElement.id + 'group_start_input', DateTimePicker) :
                                getInstance('#' + _this.parentElement.id + 'group_start_input', NumericTextBox));
                            startAtObj.enabled = args.checked;
                            startAtObj.dataBind();
                        }
                    });
                    startAtObj.isStringTemplate = true;
                    startAtObj.appendTo(startAtOptionDiv1);
                    var endAtObj = new CheckBox({
                        label: this.parent.localeObj.getConstant('endAt'),
                        checked: !(endAt === undefined),
                        enableRtl: this.parent.enableRtl,
                        change: function (args) {
                            var endAtObj = (type === 'date' ?
                                getInstance('#' + _this.parentElement.id + 'group_end_input', DateTimePicker) :
                                getInstance('#' + _this.parentElement.id + 'group_end_input', NumericTextBox));
                            endAtObj.enabled = args.checked;
                            endAtObj.dataBind();
                        }
                    });
                    endAtObj.isStringTemplate = true;
                    endAtObj.appendTo(endAtOptionDiv1);
                }
                break;
        }
        return mainDiv;
    };
    /* tslint:disable:max-func-body-length */
    Grouping.prototype.updateGroupSettings = function () {
        var dialogElement = this.groupDialog.element;
        var groupType = dialogElement.getAttribute('data-type');
        var fieldName = dialogElement.getAttribute('data-field');
        var groupFields = PivotUtil.cloneGroupSettings(this.parent.dataSourceSettings.groupSettings);
        if (groupFields.length === 0 && !this.parent.clonedDataSet && !this.parent.clonedReport) {
            var dataSet = this.parent.engineModule.data;
            this.parent.clonedDataSet = PivotUtil.getClonedData(dataSet);
            this.parent.setProperties({ dataSourceSettings: { dataSource: [] } }, true);
            this.parent.clonedReport = extend({}, this.parent.dataSourceSettings, null, true);
            this.parent.setProperties({ dataSourceSettings: { dataSource: dataSet } }, true);
        }
        if (groupType === 'custom') {
            var inputInstance = getInstance('#' + this.parentElement.id + 'group_input_option', MaskedTextBox);
            var captionInputInstance = getInstance('#' + this.parentElement.id + 'group_caption_option', MaskedTextBox);
            removeClass([inputInstance.element], cls.EMPTY_FIELD);
            if (inputInstance.value === null || inputInstance.value === '') {
                addClass([inputInstance.element], cls.EMPTY_FIELD);
                inputInstance.element.focus();
                return;
            }
            var selectedOptions = this.getSelectedOptions(this.selectedCellsInfo);
            var customGroup = { groupName: inputInstance.value, items: selectedOptions };
            var splicedItems = [];
            var newItems = [];
            var field = { name: fieldName, caption: captionInputInstance.value, type: 'Custom', customGroups: [] };
            var isUpdated = false;
            for (var i = 0, len = groupFields.length; i < len; i++) {
                if (groupFields[i].name === fieldName) {
                    field = groupFields[i];
                    field.caption = captionInputInstance.value;
                    for (var j = 0, len_1 = field.customGroups.length; j < len_1; j++) {
                        if (field.customGroups[j]) {
                            var group = field.customGroups[j];
                            if (group.items && PivotUtil.isContainCommonElements(group.items, selectedOptions)) {
                                splicedItems = this.mergeArray(splicedItems, [group.groupName]);
                                newItems = this.mergeArray(newItems, group.items);
                                field.customGroups.splice(j, 1);
                                j--;
                                len_1--;
                            }
                        }
                    }
                    for (var _i = 0, selectedOptions_1 = selectedOptions; _i < selectedOptions_1.length; _i++) {
                        var item = selectedOptions_1[_i];
                        var index = newItems.indexOf(item);
                        if (index !== -1) {
                            newItems.splice(index, 1);
                        }
                    }
                    newItems = this.mergeArray(newItems, [customGroup.groupName]);
                    field.customGroups.push(customGroup);
                    this.isUpdate = true;
                    isUpdated = true;
                    break;
                }
            }
            if (!isUpdated) {
                field.customGroups.push(customGroup);
                this.isUpdate = true;
                groupFields.push(field);
            }
            /* tslint:disable-next-line:max-line-length */
            groupFields = this.validateSettings(fieldName, groupFields, groupType, (splicedItems.length === 0 ? customGroup.items : splicedItems), newItems);
        }
        else if (groupType === 'date' || groupType === 'number') {
            var startCheckBoxInstance = getInstance('#' + this.parentElement.id + 'group_start_option', CheckBox);
            var endCheckBoxInstance = getInstance('#' + this.parentElement.id + 'group_end_option', CheckBox);
            var startInputInstance = (groupType === 'date' ?
                getInstance('#' + this.parentElement.id + 'group_start_input', DateTimePicker) :
                getInstance('#' + this.parentElement.id + 'group_start_input', NumericTextBox));
            var endInputInstance = (groupType === 'date' ?
                getInstance('#' + this.parentElement.id + 'group_end_input', DateTimePicker) :
                getInstance('#' + this.parentElement.id + 'group_end_input', NumericTextBox));
            var intervalInstance = (groupType === 'date' ?
                getInstance('#' + this.parentElement.id + 'group_interval_input', MultiSelect) :
                getInstance('#' + this.parentElement.id + 'group_interval_input', NumericTextBox));
            var startAt = startCheckBoxInstance.checked ? startInputInstance.value.toString() : undefined;
            var endAt = endCheckBoxInstance.checked ? endInputInstance.value.toString() : undefined;
            var field = { name: fieldName, startingAt: startAt, endingAt: endAt };
            if (groupType === 'date') {
                var selectedItems = [];
                for (var _a = 0, _b = intervalInstance.value; _a < _b.length; _a++) {
                    var list = _b[_a];
                    selectedItems.push(list);
                }
                field.type = 'Date';
                field.groupInterval = selectedItems;
            }
            else {
                field.type = 'Number';
                field.rangeInterval = intervalInstance.value;
            }
            var isUpdated = false;
            for (var i = 0, len = groupFields.length; i < len; i++) {
                if (groupFields[i].name === fieldName) {
                    groupFields.splice(i, 1, field);
                    this.isUpdate = true;
                    isUpdated = true;
                    break;
                }
            }
            if (!isUpdated) {
                this.isUpdate = true;
                groupFields.push(field);
            }
            groupFields = this.validateSettings(fieldName, groupFields, groupType, [], []);
        }
        this.groupDialog.close();
        this.updateDateSource(groupFields, groupType);
    };
    Grouping.prototype.getGroupBasedSettings = function (groupFields) {
        var groups = {};
        for (var _i = 0, groupFields_1 = groupFields; _i < groupFields_1.length; _i++) {
            var group = groupFields_1[_i];
            if (groups[group.type]) {
                groups[group.type].push(group);
            }
            else {
                groups[group.type] = [group];
            }
        }
        return groups;
    };
    Grouping.prototype.getGroupByName = function (groupFields) {
        var customFields = {};
        for (var _i = 0, groupFields_2 = groupFields; _i < groupFields_2.length; _i++) {
            var field = groupFields_2[_i];
            var name_1 = field.name.replace(/_custom_group/g, '');
            if (customFields[name_1]) {
                customFields[name_1].push(field);
            }
            else {
                customFields[name_1] = [field];
            }
        }
        return customFields;
    };
    /* tslint:disable-next-line:max-line-length */
    Grouping.prototype.validateSettings = function (fieldName, groupFields, groupType, splicedItems, newItems) {
        var validatedSettings = [];
        var groups = this.getGroupBasedSettings(groupFields);
        var groupOrders = ['Date', 'Number', 'Custom'];
        if (groups[groupOrders[2]] && groupType === 'custom') {
            var customFields = this.getGroupByName(groups[groupOrders[2]]);
            if (customFields[fieldName.replace(/_custom_group/g, '')]) {
                var customGroups = customFields[fieldName.replace(/_custom_group/g, '')];
                var fields = customGroups.map(function (item, pos) { return item.name; });
                if (newItems) {
                    /* tslint:disable-next-line:max-line-length */
                    customGroups = this.modifyParentGroupItems(fieldName, customGroups, splicedItems, newItems, fields);
                }
                else {
                    customGroups = this.removeGroupSettings(fieldName.replace('_custom_group', ''), splicedItems, customGroups, fields);
                }
            }
            var orderedGroups = [];
            for (var _i = 0, _a = Object.keys(customFields); _i < _a.length; _i++) {
                var field = _a[_i];
                var fields = customFields[field].map(function (item, pos) { return item.name; });
                orderedGroups = this.reOrderSettings(customFields[field], fields, orderedGroups, field);
            }
            groups[groupOrders[2]] = orderedGroups;
        }
        else if ((groupType === 'date' || groupType === 'number') && !newItems) {
            var groupFields_3 = groupType === 'date' ? groups[groupOrders[0]] : groups[groupOrders[1]];
            if (groupType === 'date') {
                groups[groupOrders[0]] = groupFields_3.filter(function (field) { return field.name !== fieldName; });
            }
            else {
                groups[groupOrders[1]] = groupFields_3.filter(function (field) { return field.name !== fieldName; });
            }
            this.isUpdate = true;
        }
        for (var _b = 0, groupOrders_1 = groupOrders; _b < groupOrders_1.length; _b++) {
            var order = groupOrders_1[_b];
            if (groups[order]) {
                validatedSettings = validatedSettings.concat(groups[order]);
            }
        }
        return validatedSettings;
    };
    /* tslint:disable-next-line:max-line-length */
    Grouping.prototype.reOrderSettings = function (customGroups, fields, orderedSettings, fieldName) {
        var index = fields.indexOf(fieldName);
        if (index > -1 && customGroups[index].customGroups && customGroups[index].customGroups.length > 0) {
            orderedSettings.push(customGroups[index]);
            this.reOrderSettings(customGroups, fields, orderedSettings, fieldName + '_custom_group');
        }
        return orderedSettings;
    };
    /* tslint:disable-next-line:max-line-length */
    Grouping.prototype.modifyParentGroupItems = function (fieldName, groupFields, splicedItems, newItems, fields) {
        var index = fields.indexOf(fieldName + '_custom_group');
        if (index !== -1) {
            var field = groupFields[index];
            var selectedOptions = [];
            if (field.customGroups && field.customGroups.length > 0) {
                for (var i = 0, len = field.customGroups.length; i < len; i++) {
                    if (field.customGroups[i]) {
                        var isItemsUpdated = false;
                        var group = field.customGroups[i];
                        if (group.items) {
                            for (var _i = 0, splicedItems_1 = splicedItems; _i < splicedItems_1.length; _i++) {
                                var item = splicedItems_1[_i];
                                var pos = group.items.indexOf(item);
                                if (pos !== -1) {
                                    group.items.splice(pos, 1);
                                    this.isUpdate = true;
                                    isItemsUpdated = true;
                                }
                            }
                            if (isItemsUpdated) {
                                group.items = this.mergeArray(group.items, newItems);
                            }
                        }
                    }
                }
            }
        }
        return groupFields;
    };
    Grouping.prototype.mergeArray = function (collection1, collection2) {
        var resultArray = [];
        var array = collection1.concat(collection2);
        var len = array.length;
        var assoc = {};
        while (len--) {
            var item = String(array[len]);
            if (!assoc[item]) {
                resultArray.unshift(item);
                assoc[item] = true;
            }
        }
        return resultArray;
    };
    Grouping.prototype.removeDialog = function () {
        if (this.parent.grid && this.parent.grid.isDestroyed) {
            return;
        }
        this.parent.grid.clearSelection();
        if (this.groupDialog && !this.groupDialog.isDestroyed) {
            this.groupDialog.destroy();
        }
        if (this.parentElement && document.getElementById(this.parentElement.id + '_GroupDialog')) {
            remove(document.getElementById(this.parentElement.id + '_GroupDialog'));
        }
    };
    /**
     * @hidden
     */
    Grouping.prototype.addEventListener = function () {
        this.handlers = {
            load: this.render
        };
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initGrouping, this.handlers.load, this); //For initial rendering
    };
    /**
     * @hidden
     */
    Grouping.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeDialog();
        this.parent.off(events.initGrouping, this.handlers.load);
    };
    /**
     * To destroy the pivot button event listener
     * @return {void}
     * @hidden
     */
    Grouping.prototype.destroy = function () {
        this.removeEventListener();
    };
    return Grouping;
}());
export { Grouping };
