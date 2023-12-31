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
import { Property, Event, Component, Internationalization, extend, isBlazor } from '@syncfusion/ej2-base';
import { L10n, remove, addClass, Browser, Complex, getInstance } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, removeClass, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { PivotEngine } from '../../base/engine';
import * as events from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { PivotCommon } from '../../common/base/pivot-common';
import { Render } from '../renderer/renderer';
import { PivotView } from '../../pivotview/base/pivotview';
import { DataSourceSettings } from '../../pivotview/model/datasourcesettings';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { PivotUtil } from '../../base/util';
import { OlapEngine } from '../../base/olap/engine';
/**
 * Represents the PivotFieldList component.
 * ```html
 * <div id="pivotfieldlist"></div>
 * <script>
 *  var pivotfieldlistObj = new PivotFieldList({ });
 *  pivotfieldlistObj.appendTo("#pivotfieldlist");
 * </script>
 * ```
 */
var PivotFieldList = /** @class */ (function (_super) {
    __extends(PivotFieldList, _super);
    /* tslint:enable */
    /**
     * Constructor for creating the widget
     * @param  {PivotFieldListModel} options?
     * @param  {string|HTMLButtonElement} element?
     */
    function PivotFieldList(options, element) {
        var _this = _super.call(this, options, element) || this;
        /** @hidden */
        _this.pivotChange = false;
        _this.isRequiredUpdate = true;
        /** @hidden */
        _this.lastSortInfo = {};
        /** @hidden */
        _this.lastFilterInfo = {};
        /** @hidden */
        _this.lastAggregationInfo = {};
        /** @hidden */
        _this.lastCalcFieldInfo = {};
        /** @hidden */
        _this.isPopupView = false;
        /** @hidden */
        _this.enableValueSorting = false;
        _this.request = new XMLHttpRequest();
        _this.remoteData = [];
        return _this;
    }
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    PivotFieldList.prototype.requiredModules = function () {
        var modules = [];
        if (this.allowCalculatedField) {
            modules.push({ args: [this], member: 'calculatedfield' });
        }
        return modules;
    };
    /**
     * @hidden
     */
    PivotFieldList.prototype.getAllSummaryType = function () {
        return ['Sum', 'Count', 'DistinctCount', 'Product', 'Min', 'Max', 'Avg', 'Index',
            'PopulationVar', 'SampleVar', 'PopulationStDev', 'SampleStDev', 'RunningTotals', 'PercentageOfGrandTotal',
            'PercentageOfColumnTotal', 'PercentageOfRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentRowTotal',
            'DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentTotal'];
    };
    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    PivotFieldList.prototype.preRender = function () {
        if (this.dataSourceSettings && this.dataSourceSettings.providerType === 'SSAS') {
            this.olapEngineModule = new OlapEngine();
            this.dataType = 'olap';
        }
        else {
            this.engineModule = new PivotEngine();
            this.dataType = 'pivot';
        }
        this.isAdaptive = Browser.isDevice;
        this.globalize = new Internationalization(this.locale);
        this.renderModule = new Render(this);
        this.defaultLocale = {
            staticFieldList: 'Pivot Field List',
            fieldList: 'Field List',
            dropFilterPrompt: 'Drop filter here',
            dropColPrompt: 'Drop column here',
            dropRowPrompt: 'Drop row here',
            dropValPrompt: 'Drop value here',
            addPrompt: 'Add field here',
            adaptiveFieldHeader: 'Choose field',
            centerHeader: 'Drag fields between axes below:',
            add: 'add',
            drag: 'Drag',
            filter: 'Filter',
            filtered: 'Filtered',
            sort: 'Sort',
            remove: 'Remove',
            filters: 'Filters',
            rows: 'Rows',
            columns: 'Columns',
            values: 'Values',
            CalculatedField: 'Calculated Field',
            createCalculatedField: 'Create Calculated Field',
            fieldName: 'Enter the field name',
            error: 'Error',
            invalidFormula: 'Invalid formula.',
            dropText: 'Example: ("Sum(Order_Count)" + "Sum(In_Stock)") * 250',
            dropTextMobile: 'Add fields and edit formula here.',
            dropAction: 'Calculated field cannot be place in any other region except value axis.',
            search: 'Search',
            close: 'Close',
            cancel: 'Cancel',
            delete: 'Delete',
            alert: 'Alert',
            warning: 'Warning',
            ok: 'OK',
            allFields: 'All Fields',
            formula: 'Formula',
            fieldExist: 'A field already exists in this name. Please enter a different name.',
            confirmText: 'A calculation field already exists in this name. Do you want to replace it?',
            noMatches: 'No matches',
            format: 'Summaries values by',
            edit: 'Edit',
            clear: 'Clear',
            clearCalculatedField: 'Clear edited field info',
            editCalculatedField: 'Edit calculated field',
            sortAscending: 'Sort ascending order',
            sortDescending: 'Sort descending order',
            sortNone: 'Sort data order',
            formulaField: 'Drag and drop fields to formula',
            dragField: 'Drag field to formula',
            clearFilter: 'Clear',
            by: 'by',
            enterValue: 'Enter value',
            chooseDate: 'Enter date',
            all: 'All',
            multipleItems: 'Multiple items',
            /* tslint:disable */
            Equals: 'Equals',
            DoesNotEquals: 'Does Not Equal',
            BeginWith: 'Begins With',
            DoesNotBeginWith: 'Does Not Begin With',
            EndsWith: 'Ends With',
            DoesNotEndsWith: 'Does Not End With',
            Contains: 'Contains',
            DoesNotContains: 'Does Not Contain',
            GreaterThan: 'Greater Than',
            GreaterThanOrEqualTo: 'Greater Than Or Equal To',
            LessThan: 'Less Than',
            LessThanOrEqualTo: 'Less Than Or Equal To',
            Between: 'Between',
            NotBetween: 'Not Between',
            Before: 'Before',
            BeforeOrEqualTo: 'Before Or Equal To',
            After: 'After',
            AfterOrEqualTo: 'After Or Equal To',
            member: 'Member',
            label: 'Label',
            date: 'Date',
            value: 'Value',
            labelTextContent: 'Show the items for which the label',
            dateTextContent: 'Show the items for which the date',
            valueTextContent: 'Show the items for which',
            And: 'and',
            Sum: 'Sum',
            Count: 'Count',
            DistinctCount: 'Distinct Count',
            Product: 'Product',
            Avg: 'Avg',
            Min: 'Min',
            Max: 'Max',
            Index: 'Index',
            SampleStDev: 'Sample StDev',
            PopulationStDev: 'Population StDev',
            SampleVar: 'Sample Var',
            PopulationVar: 'Population Var',
            RunningTotals: 'Running Totals',
            DifferenceFrom: 'Difference From',
            PercentageOfDifferenceFrom: '% of Difference From',
            PercentageOfGrandTotal: '% of Grand Total',
            PercentageOfColumnTotal: '% of Column Total',
            PercentageOfRowTotal: '% of Row Total',
            PercentageOfParentTotal: '% of Parent Total',
            PercentageOfParentColumnTotal: '% of Parent Column Total',
            PercentageOfParentRowTotal: '% of Parent Row Total',
            MoreOption: 'More...',
            Years: 'Years',
            Quarters: 'Quarters',
            Months: 'Months',
            Days: 'Days',
            Hours: 'Hours',
            Minutes: 'Minutes',
            Seconds: 'Seconds',
            /* tslint:enable */
            apply: 'Apply',
            valueFieldSettings: 'Value field settings',
            sourceName: 'Field name :',
            sourceCaption: 'Field caption',
            summarizeValuesBy: 'Summarize values by',
            baseField: 'Base field',
            baseItem: 'Base item',
            example: 'e.g:',
            editorDataLimitMsg: ' more items. Search to refine further.',
            deferLayoutUpdate: 'Defer Layout Update',
            null: 'null',
            undefined: 'undefined',
            groupOutOfRange: 'Out of Range',
            fieldDropErrorAction: 'The field you are moving cannot be placed in that area of the report',
            memberType: 'Field Type',
            selectedHierarchy: 'Parent Hierarchy',
            formatString: 'Format',
            expressionField: 'Expression',
            olapDropText: 'Example: [Measures].[Order Quantity] + ([Measures].[Order Quantity] * 0.10)',
            customFormat: 'Enter custom format string',
            numberFormatString: 'Example: C, P, 0000 %, ###0.##0#, etc.',
            Measure: 'Measure',
            Dimension: 'Dimension',
            Standard: 'Standard',
            Currency: 'Currency',
            Percent: 'Percent',
            Custom: 'Custom',
            blank: '(Blank)',
            fieldTooltip: 'Drag and drop fields to create an expression. ' +
                'And, if you want to edit the existing calculated fields! ' +
                'You can achieve it by simply selecting the field under "Calculated Members".',
            fieldTitle: 'Field Name',
            QuarterYear: 'Quarter Year',
            caption: 'Field Caption',
            copy: 'Copy',
            of: 'of',
            group: 'Group',
            removeCalculatedField: 'Are you sure you want to delete this calculated field?',
            yes: 'Yes',
            no: 'No',
        };
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
        this.isDragging = false;
        this.captionData = [];
        this.wireEvent();
    };
    /* tslint:disable-next-line:max-line-length */
    PivotFieldList.prototype.frameCustomProperties = function (fieldListData, fieldList) {
        if (this.pivotGridModule) {
            this.pivotGridModule.updatePageSettings(false);
        }
        var pageSettings = this.pivotGridModule ? this.pivotGridModule.pageSettings : this.pageSettings;
        var localeObj = this.pivotGridModule ? this.pivotGridModule.localeObj :
            (this.staticPivotGridModule ? this.staticPivotGridModule.localeObj : this.localeObj);
        var isDrillThrough = this.pivotGridModule ?
            (this.pivotGridModule.allowDrillThrough || this.pivotGridModule.editSettings.allowEditing) : true;
        var enableValueSorting = this.pivotGridModule ? this.pivotGridModule.enableValueSorting : undefined;
        var customProperties;
        if (this.dataType === 'olap') {
            customProperties = {
                mode: '',
                savedFieldList: fieldList ? fieldList : undefined,
                savedFieldListData: fieldListData ? fieldListData : undefined,
                pageSettings: pageSettings,
                enableValueSorting: enableValueSorting,
                isDrillThrough: isDrillThrough,
                localeObj: localeObj
            };
        }
        else {
            customProperties = {
                mode: '',
                savedFieldList: undefined,
                pageSettings: pageSettings,
                enableValueSorting: enableValueSorting,
                isDrillThrough: isDrillThrough,
                localeObj: localeObj
            };
        }
        return customProperties;
    };
    /* tslint:disable */
    /**
     * Initialize the control rendering
     * @returns void
     * @private
     */
    PivotFieldList.prototype.render = function () {
        if (this.dataType === 'pivot' && this.dataSourceSettings.url && this.dataSourceSettings.url !== '') {
            if (this.dataSourceSettings.mode === 'Server') {
                this.guid = PivotUtil.generateUUID();
                this.getEngine('initialRender', null, null, null, null, null, null);
            }
            else {
                this.request.open("GET", this.dataSourceSettings.url, true);
                this.request.withCredentials = false;
                this.request.onreadystatechange = this.onReadyStateChange.bind(this);
                this.request.setRequestHeader("Content-type", "text/plain");
                this.request.send(null);
            }
        }
        else {
            this.initialLoad();
        }
    };
    /**
     * @hidden
     */
    PivotFieldList.prototype.getEngine = function (action, drillItem, sortItem, aggField, cField, filterItem, memberName, rawDataArgs, editArgs) {
        this.currentAction = action;
        if (this.pivotGridModule) {
            this.pivotGridModule.updatePageSettings(false);
        }
        var customProperties = {
            pageSettings: this.pivotGridModule ? this.pivotGridModule.pageSettings : undefined,
            enableValueSorting: this.pivotGridModule ? this.pivotGridModule.enableValueSorting : undefined,
            enableDrillThrough: this.pivotGridModule ?
                (this.pivotGridModule.allowDrillThrough || this.pivotGridModule.editSettings.allowEditing) : true,
            locale: JSON.stringify(PivotUtil.getLocalizedObject(this))
        };
        var params = {
            dataSourceSettings: JSON.parse(this.getPersistData()).dataSourceSettings,
            action: action,
            customProperties: customProperties,
            drillItem: drillItem,
            sortItem: sortItem,
            aggregatedItem: aggField,
            calculatedItem: cField,
            filterItem: filterItem,
            memberName: memberName,
            fetchRawDataArgs: rawDataArgs,
            editArgs: editArgs,
            hash: this.guid
        };
        this.request.open("POST", this.dataSourceSettings.url, true);
        this.request.withCredentials = false;
        this.request.onreadystatechange = this.onSuccess.bind(this);
        this.request.setRequestHeader("Content-type", "application/json");
        this.request.send(JSON.stringify(params));
    };
    PivotFieldList.prototype.onSuccess = function () {
        if (this.request.readyState === XMLHttpRequest.DONE) {
            try {
                var engine = JSON.parse(this.request.responseText);
                if (this.currentAction === 'fetchFieldMembers') {
                    var currentMembers = JSON.parse(engine.members);
                    var dateMembers = [];
                    var formattedMembers = {};
                    var members = {};
                    for (var i = 0; i < currentMembers.length; i++) {
                        dateMembers.push({ formattedText: currentMembers[i].FormattedText, actualText: currentMembers[i].ActualText });
                        formattedMembers[currentMembers[i].FormattedText] = {};
                        members[currentMembers[i].ActualText] = {};
                    }
                    this.engineModule.fieldList[engine.memberName].dateMember = dateMembers;
                    this.engineModule.fieldList[engine.memberName].formattedMembers = formattedMembers;
                    this.engineModule.fieldList[engine.memberName].members = members;
                    this.pivotButtonModule.updateFilterEvents();
                }
                else {
                    var fList = PivotUtil.formatFieldList(JSON.parse(engine.fieldList));
                    if (this.engineModule.fieldList) {
                        var keys = Object.keys(this.engineModule.fieldList);
                        for (var i = 0; i < keys.length; i++) {
                            if (this.engineModule.fieldList[keys[i]] && fList[keys[i]]) {
                                fList[keys[i]].dateMember = this.engineModule.fieldList[keys[i]].dateMember;
                                fList[keys[i]].formattedMembers = this.engineModule.fieldList[keys[i]].formattedMembers;
                                fList[keys[i]].members = this.engineModule.fieldList[keys[i]].members;
                            }
                        }
                    }
                    this.engineModule.fieldList = fList;
                    this.engineModule.fields = JSON.parse(engine.fields);
                    this.engineModule.rowCount = JSON.parse(engine.pivotCount).RowCount;
                    this.engineModule.columnCount = JSON.parse(engine.pivotCount).ColumnCount;
                    this.engineModule.rowStartPos = JSON.parse(engine.pivotCount).RowStartPosition;
                    this.engineModule.colStartPos = JSON.parse(engine.pivotCount).ColumnStartPosition;
                    this.engineModule.rowFirstLvl = JSON.parse(engine.pivotCount).RowFirstLevel;
                    this.engineModule.colFirstLvl = JSON.parse(engine.pivotCount).ColumnFirstLevel;
                    var rowPos = void 0;
                    var pivotValues = PivotUtil.formatPivotValues(JSON.parse(engine.pivotValue));
                    for (var rCnt = 0; rCnt < pivotValues.length; rCnt++) {
                        if (pivotValues[rCnt] && pivotValues[rCnt][0] && pivotValues[rCnt][0].axis === 'row') {
                            rowPos = rCnt;
                            break;
                        }
                    }
                    this.engineModule.headerContent = PivotUtil.frameContent(pivotValues, 'header', rowPos, this);
                    this.engineModule.pageSettings = this.pivotGridModule ? this.pivotGridModule.pageSettings : undefined;
                    var valueSort = JSON.parse(engine.valueSortSettings);
                    this.engineModule.valueSortSettings = {
                        headerText: valueSort.HeaderText,
                        headerDelimiter: valueSort.HeaderDelimiter,
                        sortOrder: valueSort.SortOrder,
                        columnIndex: valueSort.ColumnIndex
                    };
                    this.engineModule.pivotValues = pivotValues;
                }
            }
            catch (error) {
                this.engineModule.pivotValues = [];
            }
            if (this.currentAction !== 'fetchFieldMembers') {
                this.initEngine();
                if (this.calculatedFieldModule && this.calculatedFieldModule.isRequireUpdate) {
                    this.calculatedFieldModule.endDialog();
                    this.calculatedFieldModule.isRequireUpdate = false;
                }
                if (this.pivotGridModule && this.pivotGridModule.calculatedFieldModule && this.pivotGridModule.calculatedFieldModule.isRequireUpdate) {
                    this.pivotGridModule.calculatedFieldModule.endDialog();
                    this.pivotGridModule.calculatedFieldModule.isRequireUpdate = false;
                }
            }
        }
    };
    PivotFieldList.prototype.onReadyStateChange = function () {
        if (this.request.readyState === XMLHttpRequest.DONE) {
            var dataSource = [];
            if (this.dataSourceSettings.type === 'CSV') {
                var jsonObject = this.request.responseText.split(/\r?\n|\r/);
                for (var i = 0; i < jsonObject.length; i++) {
                    if (!isNullOrUndefined(jsonObject[i]) && jsonObject[i] !== '') {
                        dataSource.push(jsonObject[i].split(','));
                    }
                }
            }
            else {
                try {
                    dataSource = JSON.parse(this.request.responseText);
                }
                catch (error) {
                    dataSource = [];
                }
            }
            if (isBlazor() && dataSource.length > 0) {
                this.remoteData = dataSource;
            }
            else if (dataSource.length > 0) {
                this.setProperties({ dataSourceSettings: { dataSource: dataSource } }, true);
            }
            this.initialLoad();
        }
    };
    PivotFieldList.prototype.initialLoad = function () {
        var _this = this;
        /* tslint:disable-next-line:max-line-length */
        this.trigger(events.load, { dataSourceSettings: isBlazor() ? PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings) : this.dataSourceSettings }, function (observedArgs) {
            if (isBlazor()) {
                observedArgs.dataSourceSettings.dataSource = _this.dataSourceSettings.dataSource;
            }
            _this.dataSourceSettings = observedArgs.dataSourceSettings;
            addClass([_this.element], cls.ROOT);
            if (_this.enableRtl) {
                addClass([_this.element], cls.RTL);
            }
            else {
                removeClass([_this.element], cls.RTL);
            }
            if (_this.isAdaptive) {
                addClass([_this.element], cls.DEVICE);
            }
            else {
                removeClass([_this.element], cls.DEVICE);
            }
            if (_this.cssClass) {
                addClass([_this.element], _this.cssClass);
            }
            _this.notify(events.initialLoad, {});
        });
        if (isBlazor()) {
            this.renderComplete();
        }
    };
    /**
     * Binding events to the Pivot Field List element.
     * @hidden
     */
    PivotFieldList.prototype.wireEvent = function () {
        this.on(events.initialLoad, this.generateData, this);
        this.on(events.dataReady, this.fieldListRender, this);
    };
    /**
     * Unbinding events from the element on widget destroy.
     * @hidden
     */
    PivotFieldList.prototype.unWireEvent = function () {
        if (this.pivotGridModule && this.pivotGridModule.isDestroyed) {
            return;
        }
        this.off(events.initialLoad, this.generateData);
        this.off(events.dataReady, this.fieldListRender);
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     */
    PivotFieldList.prototype.getPersistData = function () {
        var keyEntity = ['dataSourceSettings'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Get component name.
     * @returns string
     * @private
     */
    PivotFieldList.prototype.getModuleName = function () {
        return 'pivotfieldlist';
    };
    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    PivotFieldList.prototype.onPropertyChanged = function (newProp, oldProp) {
        var requireRefresh = false;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'locale':
                    if (isBlazor()) {
                        break;
                    }
                    else {
                        _super.prototype.refresh.call(this);
                    }
                    break;
                case 'dataSourceSettings':
                    if (!isNullOrUndefined(newProp.dataSourceSettings.dataSource)) {
                        if (newProp.dataSourceSettings.dataSource.length === 0 && !isNullOrUndefined(this.staticPivotGridModule)) {
                            this.savedDataSourceSettings = PivotUtil.getClonedDataSourceSettings(this.staticPivotGridModule.dataSourceSettings);
                            this.staticPivotGridModule.setProperties({ dataSourceSettings: { rows: [] } }, true);
                            this.staticPivotGridModule.setProperties({ dataSourceSettings: { columns: [] } }, true);
                            this.staticPivotGridModule.setProperties({ dataSourceSettings: { values: [] } }, true);
                            this.engineModule.fieldList = {};
                            this.staticPivotGridModule.pivotValues = [];
                        }
                        this.initEngine();
                        if (!isNullOrUndefined(this.savedDataSourceSettings)) {
                            PivotUtil.updateDataSourceSettings(this.staticPivotGridModule, this.savedDataSourceSettings);
                            this.savedDataSourceSettings = undefined;
                        }
                    }
                    if (PivotUtil.isButtonIconRefesh(prop, oldProp, newProp)) {
                        if (this.isPopupView && this.pivotGridModule &&
                            this.pivotGridModule.showGroupingBar && this.pivotGridModule.groupingBarModule) {
                            var filters = PivotUtil.cloneFieldSettings(this.dataSourceSettings.filters);
                            var values = PivotUtil.cloneFieldSettings(this.dataSourceSettings.values);
                            var rows = PivotUtil.cloneFieldSettings(this.dataSourceSettings.rows);
                            var columns = PivotUtil.cloneFieldSettings(this.dataSourceSettings.columns);
                            /* tslint:disable-next-line:max-line-length */
                            this.pivotGridModule.setProperties({ dataSourceSettings: { rows: rows, columns: columns, values: values, filters: filters } }, true);
                            this.pivotGridModule.axisFieldModule.render();
                        }
                        else if (!this.isPopupView && this.staticPivotGridModule && !this.staticPivotGridModule.isDestroyed) {
                            var pivot = this.staticPivotGridModule;
                            if (pivot.showGroupingBar && pivot.groupingBarModule) {
                                pivot.axisFieldModule.render();
                            }
                            if (pivot.showFieldList && pivot.pivotFieldListModule) {
                                var rows = PivotUtil.cloneFieldSettings(pivot.dataSourceSettings.rows);
                                var columns = PivotUtil.cloneFieldSettings(pivot.dataSourceSettings.columns);
                                var values = PivotUtil.cloneFieldSettings(pivot.dataSourceSettings.values);
                                var filters = PivotUtil.cloneFieldSettings(pivot.dataSourceSettings.filters);
                                /* tslint:disable-next-line:max-line-length */
                                pivot.pivotFieldListModule.setProperties({ dataSourceSettings: { rows: rows, columns: columns, values: values, filters: filters } }, true);
                                pivot.pivotFieldListModule.axisFieldModule.render();
                                if (pivot.pivotFieldListModule.treeViewModule.fieldTable && !pivot.isAdaptive) {
                                    pivot.pivotFieldListModule.notify(events.treeViewUpdate, {});
                                }
                            }
                        }
                        this.axisFieldModule.render();
                        if (this.treeViewModule.fieldTable && !this.isAdaptive) {
                            this.notify(events.treeViewUpdate, {});
                        }
                    }
                    break;
                case 'aggregateTypes':
                    if (this.axisFieldModule) {
                        this.axisFieldModule.render();
                    }
                    if (this.pivotGridModule && this.pivotGridModule.axisFieldModule) {
                        this.pivotGridModule.setProperties({ aggregateTypes: newProp.aggregateTypes }, true);
                        this.pivotGridModule.axisFieldModule.render();
                    }
                    break;
                case 'enableRtl':
                    if (this.enableRtl) {
                        addClass([this.element], cls.RTL);
                    }
                    else {
                        removeClass([this.element], cls.RTL);
                    }
                    requireRefresh = true;
                    break;
            }
            if (requireRefresh) {
                this.fieldListRender();
            }
        }
    };
    /* tslint:disable */
    PivotFieldList.prototype.initEngine = function () {
        var _this = this;
        if (this.dataType === 'pivot') {
            var data = !isNullOrUndefined(this.dataSourceSettings.dataSource) ? this.dataSourceSettings.dataSource[0] :
                !isNullOrUndefined(this.engineModule.data) ? this.engineModule.data[0] : undefined;
            if (data && this.pivotCommon) {
                var isArray = Object.prototype.toString.call(data) == '[object Array]';
                if (isArray && this.dataSourceSettings.type === 'JSON') {
                    this.pivotCommon.errorDialog.createErrorDialog(this.localeObj.getConstant('error'), this.localeObj.getConstant('invalidJSON'));
                    return;
                }
                else if (!isArray && this.dataSourceSettings.type === 'CSV') {
                    this.pivotCommon.errorDialog.createErrorDialog(this.localeObj.getConstant('error'), this.localeObj.getConstant('invalidCSV'));
                    return;
                }
            }
        }
        var args = {
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings)
        };
        var control = this.isPopupView ? this.pivotGridModule : this;
        control.trigger(events.enginePopulating, args, function (observedArgs) {
            PivotUtil.updateDataSourceSettings(_this, observedArgs.dataSourceSettings);
            if (_this.dataType === 'pivot') {
                if (_this.dataSourceSettings.groupSettings && _this.dataSourceSettings.groupSettings.length > 0) {
                    var pivotDataSet = void 0;
                    if (isBlazor()) {
                        pivotDataSet = _this.engineModule.data;
                    }
                    else {
                        pivotDataSet = _this.dataSourceSettings.dataSource;
                    }
                    _this.clonedDataSet = (_this.clonedDataSet ? _this.clonedDataSet : PivotUtil.getClonedData(pivotDataSet));
                    if (isBlazor()) {
                        _this.clonedReport = _this.clonedReport ? _this.clonedReport : extend({}, _this.dataSourceSettings, null, true);
                    }
                    else {
                        _this.setProperties({ dataSourceSettings: { dataSource: [] } }, true);
                        _this.clonedReport = _this.clonedReport ? _this.clonedReport : extend({}, _this.dataSourceSettings, null, true);
                        _this.setProperties({ dataSourceSettings: { dataSource: pivotDataSet } }, true);
                    }
                }
                var customProperties = _this.frameCustomProperties();
                customProperties.enableValueSorting = _this.staticPivotGridModule ?
                    _this.staticPivotGridModule.enableValueSorting : _this.enableValueSorting;
                if (_this.dataSourceSettings.mode !== 'Server') {
                    _this.engineModule.renderEngine(_this.dataSourceSettings, customProperties, _this.getValueCellInfo.bind(_this));
                }
                _this.pivotFieldList = _this.engineModule.fieldList;
                var eventArgs = {
                    pivotFieldList: _this.pivotFieldList,
                    pivotValues: _this.engineModule.pivotValues
                };
                var this$_1 = _this;
                control.trigger(events.enginePopulated, eventArgs, function (observedArgs) {
                    this$_1.pivotFieldList = observedArgs.pivotFieldList;
                    this$_1.engineModule.pivotValues = isBlazor() ? _this.engineModule.pivotValues : observedArgs.pivotValues;
                    this$_1.notify(events.dataReady, {});
                    this$_1.trigger(events.dataBound);
                });
            }
            else if (_this.dataType === 'olap') {
                _this.olapEngineModule.renderEngine(_this.dataSourceSettings, _this.frameCustomProperties(_this.olapEngineModule.fieldListData, _this.olapEngineModule.fieldList));
                _this.pivotFieldList = _this.olapEngineModule.fieldList;
                var eventArgs = {
                    pivotFieldList: _this.pivotFieldList,
                    pivotValues: _this.olapEngineModule.pivotValues
                };
                var this$_2 = _this;
                control.trigger(events.enginePopulated, eventArgs, function (observedArgs) {
                    this$_2.pivotFieldList = observedArgs.pivotFieldList;
                    this$_2.olapEngineModule.pivotValues = isBlazor() ? _this.olapEngineModule.pivotValues : observedArgs.pivotValues;
                    this$_2.notify(events.dataReady, {});
                    this$_2.trigger(events.dataBound);
                });
            }
        });
    };
    /* tslint:enable */
    PivotFieldList.prototype.generateData = function () {
        this.pivotFieldList = {};
        if (this.dataSourceSettings && (this.dataSourceSettings.dataSource || this.dataSourceSettings.url)) {
            if ((this.dataSourceSettings.url !== '' && this.dataType === 'olap') ||
                this.dataSourceSettings.dataSource.length > 0) {
                if (this.dataType === 'pivot') {
                    this.engineModule.data = this.dataSourceSettings.dataSource;
                }
                this.initEngine();
            }
            else if (this.dataSourceSettings.dataSource instanceof DataManager) {
                if (this.dataType === 'pivot' && this.remoteData.length > 0) {
                    this.engineModule.data = this.remoteData;
                    this.initEngine();
                }
                else {
                    setTimeout(this.getData.bind(this), 100);
                }
            }
        }
        else if (isBlazor() && this.dataType === 'pivot' &&
            this.engineModule.data && this.engineModule.data.length > 0) {
            this.initEngine();
        }
        else {
            this.notify(events.dataReady, {});
            this.trigger(events.dataBound);
        }
    };
    PivotFieldList.prototype.getValueCellInfo = function (aggregateObj) {
        var args = aggregateObj;
        this.trigger(events.aggregateCellInfo, args);
        return args;
    };
    PivotFieldList.prototype.getData = function () {
        this.dataSourceSettings.dataSource.executeQuery(new Query()).then(this.executeQuery.bind(this));
    };
    PivotFieldList.prototype.executeQuery = function (e) {
        this.engineModule.data = e.result;
        this.initEngine();
    };
    PivotFieldList.prototype.fieldListRender = function () {
        this.element.innerHTML = '';
        if (this.renderMode === 'Popup' && this.dialogRenderer.fieldListDialog && !this.dialogRenderer.fieldListDialog.isDestroyed) {
            this.dialogRenderer.fieldListDialog.destroy();
            remove(document.getElementById(this.element.id + '_Wrapper'));
        }
        this.renderModule.render();
        this.fieldListSpinnerElement = this.renderMode === 'Popup' ?
            this.dialogRenderer.fieldListDialog.element : this.element.querySelector('.e-pivotfieldlist-wrapper');
        if (this.spinnerTemplate) {
            createSpinner({ target: this.fieldListSpinnerElement, template: this.spinnerTemplate }, this.createElement);
        }
        else {
            createSpinner({ target: this.fieldListSpinnerElement }, this.createElement);
        }
        var args;
        args = {
            pivotEngine: this.dataType === 'olap' ? this.olapEngineModule : this.engineModule,
            dataSourceSettings: this.dataSourceSettings,
            id: this.element.id,
            element: document.getElementById(this.element.id + '_Wrapper'),
            moduleName: this.getModuleName(),
            enableRtl: this.enableRtl,
            isAdaptive: this.isAdaptive,
            renderMode: this.renderMode,
            localeObj: this.localeObj,
            dataType: this.dataType
        };
        this.pivotCommon = new PivotCommon(args);
        this.pivotCommon.control = this;
        if (this.allowDeferLayoutUpdate) {
            this.clonedDataSource = extend({}, this.dataSourceSettings, null, true);
            this.clonedFieldList = extend({}, this.pivotFieldList, null, true);
        }
    };
    PivotFieldList.prototype.getFieldCaption = function (dataSourceSettings) {
        this.getFields(dataSourceSettings);
        if (this.captionData.length > 0) {
            var lnt = this.captionData.length;
            var engineModule = this.dataType === 'olap' ? this.olapEngineModule : this.engineModule;
            while (lnt--) {
                if (this.captionData[lnt]) {
                    for (var _i = 0, _a = this.captionData[lnt]; _i < _a.length; _i++) {
                        var obj = _a[_i];
                        if (obj) {
                            if (engineModule.fieldList[obj.name]) {
                                if (obj.caption) {
                                    engineModule.fieldList[obj.name].caption = obj.caption;
                                }
                                else {
                                    engineModule.fieldList[obj.name].caption = obj.name;
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            return;
        }
    };
    PivotFieldList.prototype.getFields = function (dataSourceSettings) {
        /* tslint:disable-next-line:max-line-length */
        this.captionData = [dataSourceSettings.rows, dataSourceSettings.columns, dataSourceSettings.values, dataSourceSettings.filters];
    };
    /* tslint:disable */
    /**
     * Updates the PivotEngine using dataSource from Pivot Field List component.
     * @method updateDataSource
     * @return {void}
     * @hidden
     */
    PivotFieldList.prototype.updateDataSource = function (isTreeViewRefresh, isEngineRefresh) {
        var _this = this;
        if (this.pivotGridModule) {
            this.pivotGridModule.showWaitingPopup();
        }
        showSpinner(this.fieldListSpinnerElement);
        var pivot = this;
        var control = pivot.isPopupView ? pivot.pivotGridModule : pivot;
        //setTimeout(() => {
        var isOlapDataRefreshed = false;
        var pageSettings = pivot.pivotGridModule && pivot.pivotGridModule.enableVirtualization ?
            pivot.pivotGridModule.pageSettings : undefined;
        var isCalcChange = Object.keys(pivot.lastCalcFieldInfo).length > 0 ? true : false;
        var isSorted = Object.keys(pivot.lastSortInfo).length > 0 ? true : false;
        var isAggChange = Object.keys(pivot.lastAggregationInfo).length > 0 ? true : false;
        var isFiltered = Object.keys(pivot.lastFilterInfo).length > 0 ? true : false;
        var args = {
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(pivot.dataSourceSettings)
        };
        control.trigger(events.enginePopulating, args, function (observedArgs) {
            if (!(pageSettings && (isSorted || isFiltered || isAggChange || isCalcChange))) {
                PivotUtil.updateDataSourceSettings(pivot, observedArgs.dataSourceSettings);
                PivotUtil.updateDataSourceSettings(pivot.pivotGridModule, observedArgs.dataSourceSettings);
            }
            if (isNullOrUndefined(isEngineRefresh)) {
                if (pivot.dataType === 'pivot') {
                    var customProperties = pivot.frameCustomProperties();
                    if (!isSorted) {
                        customProperties.enableValueSorting = pivot.staticPivotGridModule ?
                            pivot.staticPivotGridModule.enableValueSorting : pivot.enableValueSorting;
                    }
                    else {
                        pivot.setProperties({ dataSourceSettings: { valueSortSettings: { headerText: '' } } }, true);
                        customProperties.enableValueSorting = false;
                    }
                    customProperties.savedFieldList = pivot.pivotFieldList;
                    if (pageSettings && (isSorted || isFiltered || isAggChange || isCalcChange)) {
                        var interopArguments = {};
                        if (isSorted) {
                            pivot.pivotGridModule.setProperties({ dataSourceSettings: { valueSortSettings: { headerText: '' } } }, true);
                            if ((isBlazor())) {
                                interopArguments = { 'key': 'onSort', 'arg': pivot.lastSortInfo };
                            }
                            else if (control.dataSourceSettings.mode === 'Server') {
                                control.getEngine('onSort', null, pivot.lastSortInfo, null, null, null, null);
                            }
                            else {
                                pivot.engineModule.onSort(pivot.lastSortInfo);
                            }
                            pivot.lastSortInfo = {};
                        }
                        if (isFiltered) {
                            if (isBlazor()) {
                                var dataArgs = window['sfBlazor'].copyWithoutCircularReferences([pivot.dataSourceSettings.filterSettings], pivot.dataSourceSettings.filterSettings);
                                interopArguments = {
                                    'key': 'onFilter',
                                    'arg': { 'lastFilterInfo': pivot.lastFilterInfo, 'filterSettings': dataArgs }
                                };
                            }
                            else if (control.dataSourceSettings.mode === 'Server') {
                                control.getEngine('onFilter', null, null, null, null, pivot.lastFilterInfo, null);
                            }
                            else {
                                pivot.engineModule.onFilter(pivot.lastFilterInfo, pivot.dataSourceSettings);
                            }
                            pivot.lastFilterInfo = {};
                        }
                        if (isAggChange) {
                            if (isBlazor()) {
                                interopArguments = { 'key': 'onAggregation', 'arg': pivot.lastAggregationInfo };
                            }
                            else if (control.dataSourceSettings.mode === 'Server') {
                                control.getEngine('onAggregation', null, null, pivot.lastAggregationInfo, null, null, null);
                            }
                            else {
                                pivot.engineModule.onAggregation(pivot.lastAggregationInfo);
                            }
                            pivot.lastAggregationInfo = {};
                        }
                        if (isCalcChange) {
                            if (isBlazor()) {
                                interopArguments = {
                                    'key': 'onCalcOperation',
                                    'arg': {
                                        lastCalcFieldInfo: pivot.lastCalcFieldInfo,
                                        values: pivot.dataSourceSettings.values,
                                        calculatedFieldSettings: pivot.dataSourceSettings.calculatedFieldSettings
                                    }
                                };
                            }
                            else if (control.dataSourceSettings.mode === 'Server') {
                                control.getEngine('onCalcOperation', null, null, null, pivot.lastCalcFieldInfo, null, null);
                            }
                            else {
                                pivot.engineModule.onCalcOperation(pivot.lastCalcFieldInfo);
                            }
                            pivot.lastCalcFieldInfo = {};
                        }
                        if (isBlazor()) {
                            var args_1 = window['sfBlazor'].copyWithoutCircularReferences([interopArguments['arg']], interopArguments['arg']);
                            pivot.pivotGridModule.interopAdaptor.invokeMethodAsync("PivotInteropMethod", interopArguments['key'], args_1).then(function (data) {
                                if (data === 0) {
                                    _this.pivotCommon.errorDialog.createErrorDialog(_this.localeObj.getConstant('error'), (pivot.dataSourceSettings.type === 'CSV' ?
                                        _this.localeObj.getConstant('invalidCSV') : _this.localeObj.getConstant('invalidJSON')));
                                    return;
                                }
                                else {
                                    pivot.pivotGridModule.updateBlazorData(data, pivot.pivotGridModule);
                                    pivot.getFieldCaption(pivot.dataSourceSettings);
                                    pivot.enginePopulatedEventMethod(pivot, isTreeViewRefresh, isOlapDataRefreshed);
                                    if (pivot.calculatedFieldModule && pivot.calculatedFieldModule.isRequireUpdate) {
                                        pivot.calculatedFieldModule.endDialog();
                                        pivot.calculatedFieldModule.isRequireUpdate = false;
                                    }
                                }
                            });
                        }
                    }
                    else {
                        if (isBlazor() && pageSettings) {
                            var dataArgs = window['sfBlazor'].copyWithoutCircularReferences([pivot.dataSourceSettings.properties], pivot.dataSourceSettings.properties);
                            pivot.pivotGridModule.interopAdaptor.invokeMethodAsync("PivotInteropMethod", 'renderEngine', { 'dataSourceSettings': dataArgs, 'customProperties': customProperties }).then(function (data) {
                                if (data === 0) {
                                    _this.pivotCommon.errorDialog.createErrorDialog(_this.localeObj.getConstant('error'), (pivot.dataSourceSettings.type === 'CSV' ?
                                        _this.localeObj.getConstant('invalidCSV') : _this.localeObj.getConstant('invalidJSON')));
                                    return;
                                }
                                else {
                                    pivot.pivotGridModule.updateBlazorData(data, pivot.pivotGridModule);
                                    pivot.getFieldCaption(pivot.dataSourceSettings);
                                    pivot.enginePopulatedEventMethod(pivot, isTreeViewRefresh, isOlapDataRefreshed);
                                }
                            });
                        }
                        else if (pivot.dataSourceSettings.mode === 'Server') {
                            if (isSorted)
                                control.getEngine('onSort', null, pivot.lastSortInfo, null, null, null, null);
                            else if (isAggChange)
                                control.getEngine('onAggregation', null, null, pivot.lastAggregationInfo, null, null, null);
                            else if (isCalcChange)
                                control.getEngine('onCalcOperation', null, null, null, pivot.lastCalcFieldInfo, null, null);
                            else if (isFiltered)
                                control.getEngine('onFilter', null, null, null, null, pivot.lastFilterInfo, null);
                            else
                                control.getEngine('onDrop', null, null, null, null, null, null);
                            pivot.lastSortInfo = {};
                            pivot.lastAggregationInfo = {};
                            pivot.lastCalcFieldInfo = {};
                            pivot.lastFilterInfo = {};
                        }
                        else {
                            pivot.engineModule.renderEngine(pivot.dataSourceSettings, customProperties, pivot.getValueCellInfo.bind(pivot));
                        }
                    }
                }
                else {
                    isOlapDataRefreshed = pivot.updateOlapDataSource(pivot, isSorted, isCalcChange, isOlapDataRefreshed);
                }
                if (!(isBlazor() && pageSettings)) {
                    pivot.getFieldCaption(pivot.dataSourceSettings);
                }
            }
            else {
                pivot.axisFieldModule.render();
                pivot.isRequiredUpdate = false;
            }
            if (!(isBlazor() && pageSettings)) {
                pivot.enginePopulatedEventMethod(pivot, isTreeViewRefresh, isOlapDataRefreshed);
            }
        });
        //});
    };
    /* tslint:enable */
    PivotFieldList.prototype.enginePopulatedEventMethod = function (pivot, isTreeViewRefresh, isOlapDataRefreshed) {
        var control = pivot.isPopupView ? pivot.pivotGridModule : pivot;
        var eventArgs = {
            dataSourceSettings: pivot.dataSourceSettings,
            pivotFieldList: pivot.dataType === 'pivot' ? pivot.engineModule.fieldList : pivot.olapEngineModule.fieldList,
            pivotValues: pivot.dataType === 'pivot' ? pivot.engineModule.pivotValues : pivot.olapEngineModule.pivotValues
        };
        control.trigger(events.enginePopulated, eventArgs, function (observedArgs) {
            var dataSource = pivot.dataSourceSettings.dataSource;
            if (isBlazor() && observedArgs.dataSourceSettings.dataSource instanceof Object) {
                observedArgs.dataSourceSettings.dataSource = dataSource;
            }
            pivot.dataSourceSettings = observedArgs.dataSourceSettings;
            pivot.pivotCommon.dataSourceSettings = pivot.dataSourceSettings;
            pivot.pivotFieldList = observedArgs.pivotFieldList;
            if (pivot.dataType === 'olap') {
                pivot.olapEngineModule.pivotValues = isBlazor() ? pivot.olapEngineModule.pivotValues : observedArgs.pivotValues;
                pivot.pivotCommon.engineModule = pivot.olapEngineModule;
            }
            else {
                pivot.engineModule.pivotValues = isBlazor() ? pivot.engineModule.pivotValues : observedArgs.pivotValues;
                pivot.pivotCommon.engineModule = pivot.engineModule;
            }
            if (!isTreeViewRefresh && pivot.treeViewModule.fieldTable && !pivot.isAdaptive) {
                pivot.notify(events.treeViewUpdate, {});
            }
            if (pivot.isRequiredUpdate) {
                if (pivot.allowDeferLayoutUpdate) {
                    pivot.clonedDataSource = extend({}, pivot.dataSourceSettings, null, true);
                    pivot.clonedFieldList = extend({}, pivot.pivotFieldList, null, true);
                }
                pivot.updateView(pivot.pivotGridModule);
            }
            else if (pivot.renderMode === 'Popup' && pivot.allowDeferLayoutUpdate) {
                pivot.pivotGridModule.engineModule = pivot.engineModule;
                /* tslint:disable:align */
                pivot.pivotGridModule.setProperties({
                    dataSourceSettings: pivot.dataSourceSettings.properties
                }, true);
                pivot.pivotGridModule.notify(events.uiUpdate, pivot);
                hideSpinner(pivot.fieldListSpinnerElement);
                /* tslint:enable:align */
            }
            if (pivot.renderMode === 'Popup' && pivot.pivotGridModule &&
                pivot.pivotGridModule.allowDeferLayoutUpdate && !pivot.isRequiredUpdate) {
                hideSpinner(pivot.fieldListSpinnerElement);
                pivot.pivotGridModule.hideWaitingPopup();
            }
            pivot.isRequiredUpdate = true;
            if (!pivot.pivotGridModule || isOlapDataRefreshed) {
                hideSpinner(pivot.fieldListSpinnerElement);
            }
            else {
                pivot.pivotGridModule.fieldListSpinnerElement = pivot.fieldListSpinnerElement;
            }
        });
    };
    PivotFieldList.prototype.updateOlapDataSource = function (pivot, isSorted, isCalcChange, isOlapDataRefreshed) {
        var customProperties = pivot.frameCustomProperties(pivot.olapEngineModule.fieldListData, pivot.olapEngineModule.fieldList);
        customProperties.savedFieldList = pivot.pivotFieldList;
        if (isCalcChange || isSorted) {
            pivot.olapEngineModule.savedFieldList = pivot.pivotFieldList;
            pivot.olapEngineModule.savedFieldListData = pivot.olapEngineModule.fieldListData;
            if (isCalcChange) {
                pivot.olapEngineModule.updateCalcFields(pivot.dataSourceSettings, pivot.lastCalcFieldInfo);
                pivot.lastCalcFieldInfo = {};
                isOlapDataRefreshed = pivot.olapEngineModule.dataFields[pivot.lastCalcFieldInfo.name] ? false : true;
                if (pivot.pivotGridModule) {
                    pivot.pivotGridModule.hideWaitingPopup();
                }
            }
            else {
                pivot.olapEngineModule.onSort(pivot.dataSourceSettings);
            }
        }
        else {
            pivot.olapEngineModule.renderEngine(pivot.dataSourceSettings, customProperties);
        }
        return isOlapDataRefreshed;
    };
    /**
     * Updates the Pivot Field List component using dataSource from PivotView component.
     * @method updateControl
     * @return {void}
     */
    PivotFieldList.prototype.update = function (control) {
        if (isBlazor() && control !== undefined) {
            /* tslint:disable */
            var pivotId = control.ID;
            var pivotInstance = getInstance('#' + pivotId, PivotView);
            control = pivotInstance;
            /* tslint:enable */
        }
        if (control) {
            this.clonedDataSet = control.clonedDataSet;
            if (isBlazor() && !this.isPopupView) {
                PivotUtil.updateDataSourceSettings(this, PivotUtil.getClonedDataSourceSettings(control.dataSourceSettings));
            }
            else {
                this.setProperties({ dataSourceSettings: control.dataSourceSettings }, true);
            }
            this.engineModule = control.engineModule;
            this.olapEngineModule = control.olapEngineModule;
            this.dataType = control.dataType;
            this.pivotFieldList = this.dataType === 'olap' ? control.olapEngineModule.fieldList : control.engineModule.fieldList;
            if (this.renderMode === 'Popup') {
                this.pivotGridModule = control;
            }
            this.getFieldCaption(control.dataSourceSettings);
            this.pivotCommon.engineModule = this.dataType === 'olap' ? this.olapEngineModule : this.engineModule;
            this.pivotCommon.dataSourceSettings = this.dataSourceSettings;
            this.pivotCommon.control = this;
            if (this.treeViewModule.fieldTable && !this.isAdaptive) {
                this.notify(events.treeViewUpdate, {});
            }
            this.axisFieldModule.render();
            if (this.renderMode === 'Fixed' && this.allowDeferLayoutUpdate) {
                this.clonedDataSource = extend({}, this.dataSourceSettings, null, true);
                this.clonedFieldList = extend({}, this.pivotFieldList, null, true);
            }
            if (!this.isPopupView) {
                this.staticPivotGridModule = control;
            }
        }
    };
    /**
     * Updates the PivotView component using dataSource from Pivot Field List component.
     * @method refreshTargetControl
     * @return {void}
     */
    PivotFieldList.prototype.updateView = function (control) {
        if (isBlazor() && control !== undefined) {
            /* tslint:disable */
            var pivotId = control.ID;
            var pivotInstance = getInstance('#' + pivotId, PivotView);
            control = pivotInstance;
            /* tslint:enable */
        }
        if (control) {
            control.clonedDataSet = this.clonedDataSet;
            if (isBlazor()) {
                PivotUtil.updateDataSourceSettings(control, PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings));
            }
            else {
                control.setProperties({ dataSourceSettings: this.dataSourceSettings }, true);
            }
            control.engineModule = this.engineModule;
            control.olapEngineModule = this.olapEngineModule;
            control.dataType = this.dataType;
            if (!this.pivotChange) {
                control.pivotValues = this.dataType === 'olap' ? this.olapEngineModule.pivotValues : this.engineModule.pivotValues;
            }
            var eventArgs = {
                dataSourceSettings: PivotUtil.getClonedDataSourceSettings(control.dataSourceSettings),
                pivotValues: control.pivotValues
            };
            control.trigger(events.fieldListRefreshed, eventArgs);
            if (!this.isPopupView) {
                this.staticPivotGridModule = control;
                control.isStaticRefresh = true;
            }
            if (control.enableVirtualization && isBlazor()) {
                control.renderPivotGrid();
            }
            else {
                control.dataBind();
            }
        }
    };
    /**
     * Called internally to trigger populate event.
     * @hidden
     */
    PivotFieldList.prototype.triggerPopulateEvent = function () {
        var _this = this;
        var control = this.isPopupView ? this.pivotGridModule : this;
        var eventArgs = {
            dataSourceSettings: this.dataSourceSettings,
            pivotFieldList: this.dataType === 'olap' ? this.olapEngineModule.fieldList : this.engineModule.fieldList,
            pivotValues: this.dataType === 'olap' ? this.olapEngineModule.pivotValues : this.engineModule.pivotValues
        };
        control.trigger(events.enginePopulated, eventArgs, function (observedArgs) {
            _this.dataSourceSettings = observedArgs.dataSourceSettings;
            _this.pivotFieldList = observedArgs.pivotFieldList;
            if (_this.dataType === 'olap') {
                _this.olapEngineModule.pivotValues = isBlazor() ? _this.olapEngineModule.pivotValues : observedArgs.pivotValues;
            }
            else {
                _this.engineModule.pivotValues = isBlazor() ? _this.engineModule.pivotValues : observedArgs.pivotValues;
            }
        });
    };
    /**
     * Destroys the Field Table component.
     * @method destroy
     * @return {void}
     */
    PivotFieldList.prototype.destroy = function () {
        this.unWireEvent();
        if (this.treeViewModule) {
            this.treeViewModule.destroy();
        }
        if (this.pivotButtonModule) {
            this.pivotButtonModule.destroy();
        }
        if (this.allowDeferLayoutUpdate && this.dialogRenderer &&
            this.dialogRenderer.deferUpdateCheckBox && !this.dialogRenderer.deferUpdateCheckBox.isDestroyed) {
            this.dialogRenderer.deferUpdateCheckBox.destroy();
        }
        _super.prototype.destroy.call(this);
        this.element.innerHTML = '';
        removeClass([this.element], cls.ROOT);
        removeClass([this.element], cls.RTL);
        removeClass([this.element], cls.DEVICE);
        if (this.renderMode === 'Popup') {
            if (this.dialogRenderer.fieldListDialog && !this.dialogRenderer.fieldListDialog.isDestroyed) {
                this.dialogRenderer.fieldListDialog.destroy();
            }
            if (document.getElementById(this.element.id + '_Wrapper')) {
                remove(document.getElementById(this.element.id + '_Wrapper'));
            }
        }
    };
    __decorate([
        Complex({}, DataSourceSettings)
    ], PivotFieldList.prototype, "dataSourceSettings", void 0);
    __decorate([
        Property('Popup')
    ], PivotFieldList.prototype, "renderMode", void 0);
    __decorate([
        Property()
    ], PivotFieldList.prototype, "target", void 0);
    __decorate([
        Property('')
    ], PivotFieldList.prototype, "cssClass", void 0);
    __decorate([
        Property(false)
    ], PivotFieldList.prototype, "allowCalculatedField", void 0);
    __decorate([
        Property(false)
    ], PivotFieldList.prototype, "showValuesButton", void 0);
    __decorate([
        Property(false)
    ], PivotFieldList.prototype, "allowDeferLayoutUpdate", void 0);
    __decorate([
        Property(1000)
    ], PivotFieldList.prototype, "maxNodeLimitInMemberEditor", void 0);
    __decorate([
        Property(true)
    ], PivotFieldList.prototype, "loadOnDemandInMemberEditor", void 0);
    __decorate([
        Property()
    ], PivotFieldList.prototype, "spinnerTemplate", void 0);
    __decorate([
        Property(['Sum', 'Count', 'DistinctCount', 'Product', 'Min', 'Max', 'Avg', 'Index', 'PopulationVar', 'SampleVar', 'PopulationStDev', 'SampleStDev', 'RunningTotals', 'PercentageOfGrandTotal', 'PercentageOfColumnTotal', 'PercentageOfRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentRowTotal', 'DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentTotal'])
    ], PivotFieldList.prototype, "aggregateTypes", void 0);
    __decorate([
        Event()
    ], PivotFieldList.prototype, "load", void 0);
    __decorate([
        Event()
    ], PivotFieldList.prototype, "enginePopulating", void 0);
    __decorate([
        Event()
    ], PivotFieldList.prototype, "memberFiltering", void 0);
    __decorate([
        Event()
    ], PivotFieldList.prototype, "enginePopulated", void 0);
    __decorate([
        Event()
    ], PivotFieldList.prototype, "onFieldDropped", void 0);
    __decorate([
        Event()
    ], PivotFieldList.prototype, "fieldDrop", void 0);
    __decorate([
        Event()
    ], PivotFieldList.prototype, "fieldDragStart", void 0);
    __decorate([
        Event()
    ], PivotFieldList.prototype, "aggregateCellInfo", void 0);
    __decorate([
        Event()
    ], PivotFieldList.prototype, "memberEditorOpen", void 0);
    __decorate([
        Event()
    ], PivotFieldList.prototype, "calculatedFieldCreate", void 0);
    __decorate([
        Event()
    ], PivotFieldList.prototype, "aggregateMenuOpen", void 0);
    __decorate([
        Event()
    ], PivotFieldList.prototype, "fieldRemove", void 0);
    __decorate([
        Event()
    ], PivotFieldList.prototype, "dataBound", void 0);
    __decorate([
        Event()
    ], PivotFieldList.prototype, "created", void 0);
    __decorate([
        Event()
    ], PivotFieldList.prototype, "destroyed", void 0);
    PivotFieldList = __decorate([
        NotifyPropertyChanges
    ], PivotFieldList);
    return PivotFieldList;
}(Component));
export { PivotFieldList };
