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
import { Property, Browser, Component, createElement, setStyleAttribute, isBlazor } from '@syncfusion/ej2-base';
import { EventHandler, Complex, extend, ChildProperty, Collection, isNullOrUndefined, remove } from '@syncfusion/ej2-base';
import { Internationalization, L10n, NotifyPropertyChanges, compile, formatUnit } from '@syncfusion/ej2-base';
import { removeClass, addClass, Event, setValue, closest, select } from '@syncfusion/ej2-base';
import { updateBlazorTemplate, resetBlazorTemplate, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { PivotEngine } from '../../base/engine';
import { Tooltip, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import * as events from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { Render } from '../renderer/render';
import { Common } from '../../common/actions/common';
import { DataSourceSettings } from '../model/datasourcesettings';
import { GridSettings } from '../model/gridsettings';
import { Grid, Reorder, Resize, getObject } from '@syncfusion/ej2-grids';
import { ExcelExport } from '../actions/excel-export';
import { PDFExport } from '../actions/pdf-export';
import { KeyboardInteraction } from '../actions/keyboard';
import { PivotContextMenu } from '../../common/popups/context-menu';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { VirtualScroll } from '../actions/virtualscroll';
import { DrillThrough } from '../actions/drill-through';
import { PivotUtil } from '../../base/util';
import { PivotChart } from '../../pivotchart/index';
import { ChartSettings } from '../model/chartsettings';
import { OlapEngine } from '../../base/olap/engine';
/* tslint:disable */
/**
 * Allows a set of options for customizing the grouping bar UI with a variety of settings such as UI visibility to a specific view port,
 * customizing the pivot button features such as filtering, sorting, changing aggregate types, removing any fields.
 * The options available to customize the grouping bar UI are:
 * * `showFilterIcon`: Allows you to show or hide the filter icon that used to be displayed on the pivot button of the grouping bar UI.
 * This filter icon is used to filter the members of a particular field at runtime in the pivot table.
 * * `showSortIcon`: Allows you to show or hide the sort icon that used to be displayed in the pivot button of the grouping bar UI.
 * This sort icon is used to order members of a particular fields either in ascending or descending at runtime.
 * * `showRemoveIcon`: Allows you to show or hide the remove icon that used to be displayed in the pivot button of the grouping bar UI.
 * This remove icon is used to remove any field during runtime.
 * * `showValueTypeIcon`: Allows you to show or hide the value type icon that used to be displayed in the pivot button of the grouping bar UI.
 * This value type icon helps to select the appropriate aggregation type to value fields at runtime.
 * * `displayMode`: Allow options to show the grouping bar UI to specific view port such as either pivot table or pivot chart or both table and chart.
 * For example, to show the grouping bar UI to pivot table on its own, set the property `displayMode` to **Table**.
 * * `allowDragAndDrop`: Allows you to restrict the pivot buttons that were used to drag on runtime in the grouping bar UI. This will prevent you from modifying the current report.
 */
var GroupingBarSettings = /** @class */ (function (_super) {
    __extends(GroupingBarSettings, _super);
    function GroupingBarSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(true)
    ], GroupingBarSettings.prototype, "showFilterIcon", void 0);
    __decorate([
        Property(true)
    ], GroupingBarSettings.prototype, "showSortIcon", void 0);
    __decorate([
        Property(true)
    ], GroupingBarSettings.prototype, "showRemoveIcon", void 0);
    __decorate([
        Property(true)
    ], GroupingBarSettings.prototype, "showValueTypeIcon", void 0);
    __decorate([
        Property('Both')
    ], GroupingBarSettings.prototype, "displayMode", void 0);
    __decorate([
        Property(true)
    ], GroupingBarSettings.prototype, "allowDragAndDrop", void 0);
    return GroupingBarSettings;
}(ChildProperty));
export { GroupingBarSettings };
/**
 * Allow options for performing CRUD operations, such as add, edit, delete, and update the raw items of any cell from the pivot table.
 * The raw items can be viewed in a data grid that used to be displayed as a dialog by double-clicking the appropriate value cell in the pivot table.
 * CRUD operations can be performed in this data grid either by double-clicking the cells or using toolbar options.
 * The options available are as follows:
 * * `allowAdding`: Allows you to add a new record to the data grid used to update the appropriate cells in the pivot table.
 * * `allowEditing`: Allows you to edit the existing record in the data grid that used to update the appropriate cells in the pivot table.
 * * `allowDeleting`: Allows you to delete the existing record from the data grid that used to  update the appropriate cells in the pivot table.
 * * `allowCommandColumns`: Allows an additional column appended in the data grid layout holds the command buttons to perform the CRUD operations to edit,
 * delete, and update the raw items to the data grid that used to update the appropriate cells in the pivot table.
 * * `mode`: Allow options for performing CRUD operations with different modes in the data grid that used to update the appropriate cells in the pivot table.
 * The available modes are normal, batch and dialog. **Normal** mode is enabled for CRUD operations in the data grid by default.
 * * `allowEditOnDblClick`: Allows you to restrict CRUD operations by double-clicking the appropriate value cell in the pivot table.
 * * `showConfirmDialog`: Allows you to show the confirmation dialog to save and discard CRUD operations performed in the data grid that used to update the appropriate cells in the pivot table.
 * * `showDeleteConfirmDialog`: Allows you to show the confirmation dialog to delete any records from the data grid.
 *
 * > This feature is applicable only for the relational data source.
 */
var CellEditSettings = /** @class */ (function (_super) {
    __extends(CellEditSettings, _super);
    function CellEditSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(false)
    ], CellEditSettings.prototype, "allowAdding", void 0);
    __decorate([
        Property(false)
    ], CellEditSettings.prototype, "allowEditing", void 0);
    __decorate([
        Property(false)
    ], CellEditSettings.prototype, "allowDeleting", void 0);
    __decorate([
        Property(false)
    ], CellEditSettings.prototype, "allowCommandColumns", void 0);
    __decorate([
        Property(false)
    ], CellEditSettings.prototype, "allowInlineEditing", void 0);
    __decorate([
        Property('Normal')
    ], CellEditSettings.prototype, "mode", void 0);
    __decorate([
        Property(true)
    ], CellEditSettings.prototype, "allowEditOnDblClick", void 0);
    __decorate([
        Property(true)
    ], CellEditSettings.prototype, "showConfirmDialog", void 0);
    __decorate([
        Property(false)
    ], CellEditSettings.prototype, "showDeleteConfirmDialog", void 0);
    return CellEditSettings;
}(ChildProperty));
export { CellEditSettings };
/**
 * Allow options for setting the visibility of hyperlink based on specific condition. The options available here are as follows:
 * * `measure`: Allows you to specify the value field caption to get visibility of hyperlink option for specific measure.
 * * `condition`: Allows you to choose the operator type such as equals, greater than, less than, etc.
 * * `value1`: Allows you to set the start value.
 * * `value2`: Allows you to set the end value. This option will be used by default when the operator **Between** and **NotBetween** is chosen to apply.
 */
var ConditionalSettings = /** @class */ (function (_super) {
    __extends(ConditionalSettings, _super);
    function ConditionalSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], ConditionalSettings.prototype, "measure", void 0);
    __decorate([
        Property()
    ], ConditionalSettings.prototype, "label", void 0);
    __decorate([
        Property('NotEquals')
    ], ConditionalSettings.prototype, "conditions", void 0);
    __decorate([
        Property()
    ], ConditionalSettings.prototype, "value1", void 0);
    __decorate([
        Property()
    ], ConditionalSettings.prototype, "value2", void 0);
    return ConditionalSettings;
}(ChildProperty));
export { ConditionalSettings };
/**
 * Allow a set of options to display a hyperlink to link data for individual cells that are shown in the pivot table.
 * These options allow you to enable a separate hyperlink for row headers, column headers, value cells, and summary cells in the `hyperlinkSettings` class.
 * The options available are:
 * * `showHyperlink`: Allows you to set the visibility of hyperlink in all cells.
 * * `showRowHeaderHyperlink`: Allows you to set the visibility of hyperlink in row headers.
 * * `showColumnHeaderHyperlink`: Allows you to set the visibility of hyperlink in column headers.
 * * `showValueCellHyperlink`: Allows you to set the visibility of hyperlink in value cells.
 * * `showSummaryCellHyperlink`: Allows you to set the visibility of hyperlink in summary cells.
 * * `headerText`: Allows you to set the visibility of hyperlink based on header text.
 * * `conditionalSettings`: Allows you to set the visibility of hyperlink based on specific condition.
 * * `cssClass`: Allows you to add CSS class name to the hyperlink options.
 *
 * > By default, the hyperlink options are disabled for all cells in the pivot table.
 */
var HyperlinkSettings = /** @class */ (function (_super) {
    __extends(HyperlinkSettings, _super);
    function HyperlinkSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(false)
    ], HyperlinkSettings.prototype, "showHyperlink", void 0);
    __decorate([
        Property(false)
    ], HyperlinkSettings.prototype, "showRowHeaderHyperlink", void 0);
    __decorate([
        Property(false)
    ], HyperlinkSettings.prototype, "showColumnHeaderHyperlink", void 0);
    __decorate([
        Property(false)
    ], HyperlinkSettings.prototype, "showValueCellHyperlink", void 0);
    __decorate([
        Property(false)
    ], HyperlinkSettings.prototype, "showSummaryCellHyperlink", void 0);
    __decorate([
        Collection([], ConditionalSettings)
    ], HyperlinkSettings.prototype, "conditionalSettings", void 0);
    __decorate([
        Property()
    ], HyperlinkSettings.prototype, "headerText", void 0);
    __decorate([
        Property('')
    ], HyperlinkSettings.prototype, "cssClass", void 0);
    return HyperlinkSettings;
}(ChildProperty));
export { HyperlinkSettings };
/**
 * Allow options to configure the view port as either pivot table or pivot chart or both table and chart. The options available are:
 * * `view`: Allows you to choose the view port as either pivot table or pivot chart or both table and chart.
 * * `primary`: Allows you to set the primary view to be either pivot table or pivot chart. To use this option, it requires the property `view` to be **Both**.
 */
var DisplayOption = /** @class */ (function (_super) {
    __extends(DisplayOption, _super);
    function DisplayOption() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('Table')
    ], DisplayOption.prototype, "view", void 0);
    __decorate([
        Property('Table')
    ], DisplayOption.prototype, "primary", void 0);
    return DisplayOption;
}(ChildProperty));
export { DisplayOption };
/* tslint:enable */
/**
 * Represents the PivotView component.
 * ```html
 * <div id="PivotView"></div>
 * <script>
 *  var pivotviewObj = new PivotView({ enableGroupingBar: true });
 *  pivotviewObj.appendTo("#pivotview");
 * </script>
 * ```
 */
var PivotView = /** @class */ (function (_super) {
    __extends(PivotView, _super);
    /* tslint:enable */
    /**
     * Constructor for creating the widget
     * @param  {PivotViewModel} options?
     * @param  {string|HTMLElement} element?
     */
    function PivotView(options, element) {
        var _this_1 = _super.call(this, options, element) || this;
        /** @hidden */
        _this_1.verticalScrollScale = 1;
        /** @hidden */
        _this_1.horizontalScrollScale = 1;
        /** @hidden */
        _this_1.scrollerBrowserLimit = 8000000;
        /** @hidden */
        _this_1.lastSortInfo = {};
        /** @hidden */
        _this_1.lastFilterInfo = {};
        /** @hidden */
        _this_1.lastAggregationInfo = {};
        /** @hidden */
        _this_1.lastCalcFieldInfo = {};
        /** @hidden */
        _this_1.isScrolling = false;
        _this_1.shiftLockedPos = [];
        _this_1.savedSelectedCellsPos = [];
        _this_1.cellSelectionPos = [];
        _this_1.isPopupClicked = false;
        _this_1.isMouseDown = false;
        _this_1.isMouseUp = false;
        _this_1.fieldsType = {};
        _this_1.remoteData = [];
        _this_1.defaultItems = {};
        _this_1.isCellBoxMultiSelection = false;
        /** @hidden */
        _this_1.gridHeaderCellInfo = [];
        /** @hidden */
        _this_1.gridCellCollection = {};
        /** @hidden */
        _this_1.rowRangeSelection = { enable: false, startIndex: 0, endIndex: 0 };
        /** @hidden */
        _this_1.isStaticRefresh = false;
        /** @hidden */
        _this_1.resizeInfo = {};
        /** @hidden */
        _this_1.scrollPosObject = {
            vertical: 0, horizontal: 0, verticalSection: 0,
            horizontalSection: 0, top: 0, left: 0, scrollDirection: { direction: '', position: 0 }
        };
        /** @hidden */
        _this_1.pivotColumns = [];
        /** @hidden */
        _this_1.totColWidth = 0;
        /** @hidden */
        _this_1.posCount = 0;
        /** @hidden */
        _this_1.isModified = false;
        /** @hidden */
        _this_1.isInitialRendering = false;
        _this_1.needsID = true;
        _this_1.pivotRefresh = Component.prototype.refresh;
        _this_1.request = new XMLHttpRequest();
        /** @hidden */
        _this_1.isServerWaitingPopup = false;
        _this_1.pivotView = _this_1;
        setValue('mergePersistData', _this_1.mergePersistPivotData, _this_1);
        return _this_1;
    }
    PivotView_1 = PivotView;
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    PivotView.prototype.requiredModules = function () {
        var modules = [];
        modules.push({ args: [this], member: 'groupingbar' });
        if (this.allowConditionalFormatting) {
            modules.push({ args: [this], member: 'conditionalformatting' });
        }
        if (this.allowNumberFormatting) {
            modules.push({ args: [this], member: 'numberformatting' });
        }
        if (this.allowCalculatedField) {
            modules.push({ args: [this], member: 'calculatedfield' });
        }
        if (this.showToolbar && (this.toolbar.length > 0 || this.toolbarTemplate)) {
            modules.push({ args: [this], member: 'toolbar' });
        }
        if (this.showFieldList) {
            modules.push({ args: [this], member: 'fieldlist' });
        }
        if (this.allowExcelExport) {
            modules.push({ args: [this], member: 'excelExport' });
        }
        if (this.allowPdfExport) {
            modules.push({ args: [this], member: 'pdfExport' });
        }
        if (this.enableVirtualization) {
            modules.push({ args: [this], member: 'virtualscroll' });
        }
        if (this.allowGrouping) {
            modules.push({ args: [this], member: 'grouping' });
        }
        return modules;
    };
    /**
     * For internal use only - Initializing internal properties;
     * @private
     */
    PivotView.prototype.preRender = function () {
        if (this.dataSourceSettings && this.dataSourceSettings.providerType === 'SSAS') {
            this.dataType = 'olap';
            this.olapEngineModule = new OlapEngine();
        }
        else {
            this.dataType = 'pivot';
            this.engineModule = new PivotEngine();
        }
        this.isAdaptive = Browser.isDevice;
        if (Browser.isIE || Browser.info.name === 'edge') {
            this.scrollerBrowserLimit = 1500000;
        }
        else if (Browser.info.name === 'chrome') {
            this.scrollerBrowserLimit = 15000000;
        }
        this.isTouchMode = closest(this.element, 'e-bigger') ? true : false;
        this.initProperties();
        this.renderToolTip();
        this.keyboardModule = new KeyboardInteraction(this);
        this.contextMenuModule = new PivotContextMenu(this);
        this.globalize = new Internationalization(this.locale);
        if (this.showFieldList || this.showGroupingBar || this.allowNumberFormatting || this.allowCalculatedField ||
            this.toolbar || this.allowGrouping || this.gridSettings.contextMenuItems) {
            this.commonModule = new Common(this);
        }
        this.defaultLocale = {
            grandTotal: 'Grand Total',
            total: 'Total',
            value: 'Value',
            noValue: 'No value',
            row: 'Row',
            column: 'Column',
            collapse: 'Collapse',
            expand: 'Expand',
            rowAxisPrompt: 'Drop row here',
            columnAxisPrompt: 'Drop column here',
            valueAxisPrompt: 'Drop value here',
            filterAxisPrompt: 'Drop filter here',
            filter: 'Filter',
            filtered: 'Filtered',
            sort: 'Sort',
            filters: 'Filters',
            rows: 'Rows',
            columns: 'Columns',
            values: 'Values',
            close: 'Close',
            cancel: 'Cancel',
            delete: 'Delete',
            CalculatedField: 'Calculated Field',
            createCalculatedField: 'Create Calculated Field',
            fieldName: 'Enter the field name',
            error: 'Error',
            invalidFormula: 'Invalid formula.',
            dropText: 'Example: ("Sum(Order_Count)" + "Sum(In_Stock)") * 250',
            dropTextMobile: 'Add fields and edit formula here.',
            dropAction: 'Calculated field cannot be place in any other region except value axis.',
            alert: 'Alert',
            warning: 'Warning',
            ok: 'OK',
            search: 'Search',
            drag: 'Drag',
            remove: 'Remove',
            allFields: 'All Fields',
            formula: 'Formula',
            addToRow: 'Add to Row',
            addToColumn: 'Add to Column',
            addToValue: 'Add to Value',
            addToFilter: 'Add to Filter',
            emptyData: 'No records to display',
            fieldExist: 'A field already exists in this name. Please enter a different name.',
            confirmText: 'A calculation field already exists in this name. Do you want to replace it?',
            noMatches: 'No matches',
            format: 'Summaries values by',
            edit: 'Edit',
            clear: 'Clear',
            sortAscending: 'Sort ascending order',
            sortDescending: 'Sort descending order',
            sortNone: 'Sort data order',
            clearCalculatedField: 'Clear edited field info',
            editCalculatedField: 'Edit calculated field',
            formulaField: 'Drag and drop fields to formula',
            dragField: 'Drag field to formula',
            clearFilter: 'Clear',
            by: 'by',
            all: 'All',
            multipleItems: 'Multiple items',
            /* tslint:disable */
            member: 'Member',
            label: 'Label',
            date: 'Date',
            enterValue: 'Enter value',
            chooseDate: 'Enter date',
            Before: 'Before',
            BeforeOrEqualTo: 'Before Or Equal To',
            After: 'After',
            AfterOrEqualTo: 'After Or Equal To',
            labelTextContent: 'Show the items for which the label',
            dateTextContent: 'Show the items for which the date',
            valueTextContent: 'Show the items for which',
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
            And: 'and',
            Sum: 'Sum',
            Count: 'Count',
            DistinctCount: 'Distinct Count',
            Product: 'Product',
            Avg: 'Avg',
            Min: 'Min',
            SampleVar: 'Sample Var',
            PopulationVar: 'Population Var',
            RunningTotals: 'Running Totals',
            Max: 'Max',
            Index: 'Index',
            SampleStDev: 'Sample StDev',
            PopulationStDev: 'Population StDev',
            PercentageOfRowTotal: '% of Row Total',
            PercentageOfParentTotal: '% of Parent Total',
            PercentageOfParentColumnTotal: '% of Parent Column Total',
            PercentageOfParentRowTotal: '% of Parent Row Total',
            DifferenceFrom: 'Difference From',
            PercentageOfDifferenceFrom: '% of Difference From',
            PercentageOfGrandTotal: '% of Grand Total',
            PercentageOfColumnTotal: '% of Column Total',
            MoreOption: 'More...',
            /* tslint:enable */
            NotEquals: 'Not Equals',
            AllValues: 'All Values',
            conditionalFormating: 'Conditional Formatting',
            apply: 'Apply',
            condition: 'Add Condition',
            formatLabel: 'Format',
            valueFieldSettings: 'Value field settings',
            baseField: 'Base field',
            baseItem: 'Base item',
            summarizeValuesBy: 'Summarize values by',
            sourceName: 'Field name :',
            sourceCaption: 'Field caption',
            example: 'e.g:',
            editorDataLimitMsg: ' more items. Search to refine further.',
            details: 'Details',
            manageRecords: 'Manage Records',
            Years: 'Years',
            Quarters: 'Quarters',
            Months: 'Months',
            Days: 'Days',
            Hours: 'Hours',
            Minutes: 'Minutes',
            Seconds: 'Seconds',
            save: 'Save a report',
            new: 'Create a new report',
            load: 'Load',
            saveAs: 'Save as current report',
            rename: 'Rename a current report',
            deleteReport: 'Delete a current report',
            export: 'Export',
            subTotals: 'Sub totals',
            grandTotals: 'Grand totals',
            reportName: 'Report Name :',
            pdf: 'PDF',
            excel: 'Excel',
            csv: 'CSV',
            png: 'PNG',
            jpeg: 'JPEG',
            svg: 'SVG',
            mdxQuery: 'MDX Query',
            showSubTotals: 'Show sub totals',
            doNotShowSubTotals: 'Do not show sub totals',
            showSubTotalsRowsOnly: 'Show sub totals rows only',
            showSubTotalsColumnsOnly: 'Show sub totals columns only',
            showGrandTotals: 'Show grand totals',
            doNotShowGrandTotals: 'Do not show grand totals',
            showGrandTotalsRowsOnly: 'Show grand totals rows only',
            showGrandTotalsColumnsOnly: 'Show grand totals columns only',
            fieldList: 'Show fieldlist',
            grid: 'Show table',
            toolbarFormatting: 'Conditional formatting',
            chart: 'Chart',
            reportMsg: 'Please enter vaild report name!!!',
            reportList: 'Report list',
            removeConfirm: 'Are you sure you want to delete this report?',
            emptyReport: 'No reports found!!',
            bar: 'Bar',
            pie: 'Pie',
            funnel: 'Funnel',
            doughnut: 'Doughnut',
            pyramid: 'Pyramid',
            stackingcolumn: 'Stacked Column',
            stackingarea: 'Stacked Area',
            stackingbar: 'Stacked Bar',
            stepline: 'Step Line',
            steparea: 'Step Area',
            splinearea: 'Spline Area',
            spline: 'Spline',
            stackingcolumn100: '100% Stacked Column',
            stackingbar100: '100% Stacked Bar',
            stackingarea100: '100% Stacked Area',
            bubble: 'Bubble',
            pareto: 'Pareto',
            radar: 'Radar',
            line: 'Line',
            area: 'Area',
            scatter: 'Scatter',
            polar: 'Polar',
            of: 'of',
            emptyFormat: 'No format found!!!',
            emptyInput: 'Enter a value',
            newReportConfirm: 'Do you want to save the changes to this report?',
            emptyReportName: 'Enter a report name',
            qtr: 'Qtr',
            null: 'null',
            undefined: 'undefined',
            groupOutOfRange: 'Out of Range',
            fieldDropErrorAction: 'The field you are moving cannot be placed in that area of the report',
            aggregate: 'Aggregate',
            drillThrough: 'Drill Through',
            ascending: 'Ascending',
            descending: 'Descending',
            number: 'Number',
            currency: 'Currency',
            percentage: 'Percentage',
            formatType: 'Format Type',
            customText: 'Currency Symbol',
            symbolPosition: 'Symbol Position',
            left: 'Left',
            right: 'Right',
            grouping: 'Grouping',
            true: 'True',
            false: 'False',
            decimalPlaces: 'Decimal Places',
            numberFormat: 'Number Formatting',
            memberType: 'Field Type',
            formatString: 'Format',
            expressionField: 'Expression',
            customFormat: 'Enter custom format string',
            numberFormatString: 'Example: C, P, 0000 %, ###0.##0#, etc.',
            selectedHierarchy: 'Parent Hierarchy',
            olapDropText: 'Example: [Measures].[Order Quantity] + ([Measures].[Order Quantity] * 0.10)',
            Percent: 'Percent',
            Currency: 'Currency',
            Custom: 'Custom',
            Measure: 'Measure',
            Dimension: 'Dimension',
            Standard: 'Standard',
            blank: '(Blank)',
            fieldTooltip: 'Drag and drop fields to create an expression. ' +
                'And, if you want to edit the existing calculated fields! ' +
                'You can achieve it by simply selecting the field under "Calculated Members".',
            fieldTitle: 'Field Name',
            QuarterYear: 'Quarter Year',
            drillError: 'Cannot show the raw items of calculated fields.',
            caption: 'Field Caption',
            copy: 'Copy',
            defaultReport: 'Sample Report',
            customFormatString: 'Custom Format',
            invalidFormat: 'Invalid Format.',
            group: 'Group',
            unGroup: 'Ungroup',
            invalidSelection: 'Cannot group that selection.',
            groupName: 'Enter the caption to display in header',
            captionName: 'Enter the caption for group field',
            selectedItems: 'Selected items',
            groupFieldCaption: 'Field caption',
            groupTitle: 'Group name',
            startAt: 'Starting at',
            endAt: 'Ending at',
            groupBy: 'Interval by',
            selectGroup: 'Select groups',
            multipleAxes: 'Multiple Axes',
            showLegend: 'Show Legend',
            exit: 'Exit',
            chartTypeSettings: 'Chart Type Settings',
            ChartType: 'Chart Type',
            yes: 'Yes',
            no: 'No',
            numberFormatMenu: 'Number Formatting...',
            conditionalFormatingMenu: 'Conditional Formatting...',
            removeCalculatedField: 'Are you sure you want to delete this calculated field?',
            replaceConfirmBefore: 'A report named ',
            replaceConfirmAfter: ' already exists. Do you want to replace it?',
            invalidJSON: 'Invalid JSON data',
            invalidCSV: 'Invalid CSV data'
        };
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
        this.renderContextMenu();
        this.isDragging = false;
        this.addInternalEvents();
        //setCurrencyCode(this.currencyCode);
    };
    PivotView.prototype.onBeforeTooltipOpen = function (args) {
        args.element.classList.add('e-pivottooltipwrap');
    };
    PivotView.prototype.renderToolTip = function () {
        if (this.showTooltip) {
            if (this.tooltipTemplate) {
                this.tooltip = new Tooltip({
                    target: 'td.e-valuescontent',
                    cssClass: 'e-pivottooltiptemplate',
                    showTipPointer: false,
                    position: 'BottomRight',
                    mouseTrail: true,
                    enableRtl: this.enableRtl,
                    beforeRender: this.setToolTip.bind(this),
                    beforeOpen: this.onBeforeTooltipOpen,
                });
            }
            else {
                this.tooltip = new Tooltip({
                    target: 'td.e-valuescontent',
                    showTipPointer: false,
                    position: 'BottomRight',
                    mouseTrail: true,
                    enableRtl: this.enableRtl,
                    beforeRender: this.setToolTip.bind(this),
                    beforeOpen: this.onBeforeTooltipOpen
                });
            }
            this.tooltip.isStringTemplate = true;
            this.tooltip.appendTo(this.element);
        }
        else if (this.tooltip) {
            this.tooltip.destroy();
        }
    };
    /** @hidden */
    PivotView.prototype.renderContextMenu = function () {
        if (this.gridSettings.contextMenuItems || (this.allowGrouping && this.dataType === 'pivot')) {
            var conmenuItems = [];
            var groupItems = [];
            var customItems = [];
            var exportItems = [];
            var aggItems = [];
            var expItems = [];
            var aggregateItems = [];
            if (this.gridSettings.contextMenuItems) {
                for (var _i = 0, _a = this.gridSettings.contextMenuItems; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (typeof item === 'string' && this.getDefaultItems().indexOf(item) !== -1) {
                        if (item.toString().toLowerCase().indexOf('aggregate') !== -1 && this.dataType === 'pivot') {
                            aggregateItems = [
                                { text: this.localeObj.getConstant('Sum') }
                            ];
                            var aggregateGroup = this.buildDefaultItems('Aggregate');
                            aggregateGroup.items = aggregateItems;
                            aggItems.push(aggregateGroup);
                        }
                        else if (item.toString().toLowerCase().indexOf('export') !== -1) {
                            exportItems.push(this.buildDefaultItems(item));
                        }
                        else {
                            conmenuItems.push(this.buildDefaultItems(item));
                        }
                    }
                    else if (typeof item !== 'string') {
                        customItems.push(item);
                    }
                }
            }
            if (this.allowGrouping && this.dataType === 'pivot') {
                groupItems.push(this.buildDefaultItems('Group'));
                groupItems.push(this.buildDefaultItems('Ungroup'));
            }
            if (exportItems.length > 0) {
                var exportGroupItems = this.buildDefaultItems('export');
                exportGroupItems.items = exportItems;
                expItems.push(exportGroupItems);
            }
            this.gridSettings.contextMenuItems = [];
            Array.prototype.push.apply(this.gridSettings.contextMenuItems, aggItems);
            Array.prototype.push.apply(this.gridSettings.contextMenuItems, conmenuItems);
            Array.prototype.push.apply(this.gridSettings.contextMenuItems, groupItems);
            Array.prototype.push.apply(this.gridSettings.contextMenuItems, expItems);
            Array.prototype.push.apply(this.gridSettings.contextMenuItems, customItems);
        }
    };
    /**
     * @hidden
     */
    PivotView.prototype.getAllSummaryType = function () {
        return ['Sum', 'Count', 'DistinctCount', 'Product', 'Min', 'Max', 'Avg', 'Index',
            'PopulationVar', 'SampleVar', 'PopulationStDev', 'SampleStDev', 'RunningTotals', 'PercentageOfGrandTotal',
            'PercentageOfColumnTotal', 'PercentageOfRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentRowTotal',
            'DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentTotal'];
    };
    PivotView.prototype.getDefaultItems = function () {
        return ['Drillthrough', 'Expand',
            'Collapse', 'Pdf Export', 'Excel Export', 'Csv Export', 'Sort Ascending', 'Sort Descending',
            'Aggregate', 'CalculatedField'];
    };
    PivotView.prototype.buildDefaultItems = function (item) {
        var menuItem;
        switch (item) {
            case 'Aggregate':
                menuItem = {
                    text: this.localeObj.getConstant('aggregate'), target: 'th.e-valuesheader,td.e-valuescontent,.e-stot.e-rowsheader',
                    id: this.element.id + '_aggregate'
                };
                break;
            case 'CalculatedField':
                menuItem = {
                    text: this.localeObj.getConstant('CalculatedField'), target: 'td.e-valuescontent',
                    id: this.element.id + '_CalculatedField'
                };
                break;
            case 'Drillthrough':
                menuItem = {
                    text: this.localeObj.getConstant('drillThrough'), target: 'td.e-valuescontent',
                    id: this.element.id + '_drillthrough_menu', iconCss: cls.PIVOTVIEW_GRID + ' ' + cls.ICON
                };
                break;
            case 'export':
                menuItem = {
                    text: this.localeObj.getConstant('export'), target: 'td.e-valuescontent',
                    id: this.element.id + '_exporting', iconCss: cls.PIVOTVIEW_EXPORT + ' ' + cls.ICON
                };
                break;
            case 'Pdf Export':
                menuItem = {
                    text: this.localeObj.getConstant('pdf'), id: this.element.id + '_pdf',
                    iconCss: cls.GRID_PDF_EXPORT + ' ' + cls.ICON
                };
                break;
            case 'Excel Export':
                menuItem = {
                    text: this.localeObj.getConstant('excel'), id: this.element.id + '_excel',
                    iconCss: cls.GRID_EXCEL_EXPORT + ' ' + cls.ICON
                };
                break;
            case 'Csv Export':
                menuItem = {
                    text: this.localeObj.getConstant('csv'), id: this.element.id + '_csv',
                    iconCss: cls.GRID_CSV_EXPORT + ' ' + cls.ICON,
                };
                break;
            case 'Expand':
                menuItem = {
                    text: this.localeObj.getConstant('expand'), target: 'td.e-rowsheader,.e-columnsheader',
                    id: this.element.id + '_expand', iconCss: cls.PIVOTVIEW_EXPAND + ' ' + cls.ICON
                };
                break;
            case 'Collapse':
                menuItem = {
                    text: this.localeObj.getConstant('collapse'), target: 'td.e-rowsheader,.e-columnsheader',
                    id: this.element.id + '_collapse', iconCss: cls.PIVOTVIEW_COLLAPSE + ' ' + cls.ICON
                };
                break;
            case 'Sort Ascending':
                menuItem = {
                    text: this.localeObj.getConstant('ascending'), target: 'th.e-valuesheader,.e-stot',
                    id: this.element.id + '_sortasc', iconCss: cls.ICON_ASC + ' ' + cls.ICON
                };
                break;
            case 'Sort Descending':
                menuItem = {
                    text: this.localeObj.getConstant('descending'), target: 'th.e-valuesheader,.e-stot',
                    id: this.element.id + '_sortdesc', iconCss: cls.ICON_DESC + ' ' + cls.ICON
                };
                break;
            case 'Group':
                menuItem = {
                    text: this.localeObj.getConstant('group'), target: 'td.e-rowsheader,.e-columnsheader',
                    id: this.element.id + '_custom_group', iconCss: cls.PIVOTVIEW_GROUP + ' ' + cls.ICON
                };
                break;
            case 'Ungroup':
                menuItem = {
                    text: this.localeObj.getConstant('unGroup'), target: 'td.e-rowsheader,.e-columnsheader',
                    id: this.element.id + '_custom_ungroup', iconCss: cls.PIVOTVIEW_UN_GROUP + ' ' + cls.ICON
                };
                break;
        }
        this.defaultItems[item] = {
            text: menuItem.text, id: menuItem.id,
            target: menuItem.target, iconCss: menuItem.iconCss
        };
        return this.defaultItems[item];
    };
    PivotView.prototype.initProperties = function () {
        this.pivotRefresh = Component.prototype.refresh;
        this.isScrolling = false;
        this.allowServerDataBinding = false;
        this.isStaticRefresh = false;
        this.setProperties({ pivotValues: [] }, true);
        /* tslint:disable-next-line:no-any */
        delete this.bulkChanges.pivotValues;
        this.allowServerDataBinding = true;
        this.scrollPosObject = {
            vertical: 0, horizontal: 0, verticalSection: 0,
            horizontalSection: 0, top: 0, left: 0, scrollDirection: { direction: '', position: 0 }
        };
        this.queryCellInfo = this.gridSettings.queryCellInfo ? this.gridSettings.queryCellInfo.bind(this) : undefined;
        this.headerCellInfo = this.gridSettings.headerCellInfo ? this.gridSettings.headerCellInfo.bind(this) : undefined;
        this.resizing = this.gridSettings.resizing ? this.gridSettings.resizing.bind(this) : undefined;
        this.resizeStop = this.gridSettings.resizeStop ? this.gridSettings.resizeStop.bind(this) : undefined;
        this.pdfHeaderQueryCellInfo = this.gridSettings.pdfHeaderQueryCellInfo ?
            this.gridSettings.pdfHeaderQueryCellInfo.bind(this) : undefined;
        this.pdfQueryCellInfo = this.gridSettings.pdfQueryCellInfo ? this.gridSettings.pdfQueryCellInfo.bind(this) : undefined;
        this.excelHeaderQueryCellInfo = this.gridSettings.excelHeaderQueryCellInfo ?
            this.gridSettings.excelHeaderQueryCellInfo.bind(this) : undefined;
        this.excelQueryCellInfo = this.gridSettings.excelQueryCellInfo ?
            this.gridSettings.excelQueryCellInfo.bind(this) : undefined;
        this.columnDragStart = this.gridSettings.columnDragStart ? this.gridSettings.columnDragStart.bind(this) : undefined;
        this.columnDrag = this.gridSettings.columnDrag ? this.gridSettings.columnDrag.bind(this) : undefined;
        this.columnDrop = this.gridSettings.columnDrop ? this.gridSettings.columnDrop.bind(this) : undefined;
        this.beforeColumnsRender = this.gridSettings.columnRender ? this.gridSettings.columnRender : undefined;
        this.selected = this.gridSettings.cellSelected ? this.gridSettings.cellSelected : undefined;
        this.cellDeselected = this.gridSettings.cellDeselected ? this.gridSettings.cellDeselected : undefined;
        this.rowSelected = this.gridSettings.rowSelected ? this.gridSettings.rowSelected : undefined;
        this.rowDeselected = this.gridSettings.rowDeselected ? this.gridSettings.rowDeselected : undefined;
        this.chartTooltipRender = this.chartSettings.tooltipRender ? this.chartSettings.tooltipRender : undefined;
        this.chartLoaded = this.chartSettings.loaded ? this.chartSettings.loaded : undefined;
        this.chartLoad = this.chartSettings.load ? this.chartSettings.load : undefined;
        this.chartResized = this.chartSettings.resized ? this.chartSettings.resized : undefined;
        this.chartAxisLabelRender = this.chartSettings.axisLabelRender ? this.chartSettings.axisLabelRender : undefined;
        this.multiLevelLabelClick = this.chartSettings.multiLevelLabelClick ? this.chartSettings.multiLevelLabelClick : undefined;
        this.chartPointClick = this.chartSettings.pointClick ? this.chartSettings.pointClick : undefined;
        this.contextMenuClick = this.gridSettings.contextMenuClick ? this.gridSettings.contextMenuClick : undefined;
        this.contextMenuOpen = this.gridSettings.contextMenuOpen ? this.gridSettings.contextMenuOpen : undefined;
        this.beforePdfExport = this.gridSettings.beforePdfExport ? this.gridSettings.beforePdfExport.bind(this) : undefined;
        this.beforeExcelExport = this.gridSettings.beforeExcelExport ? this.gridSettings.beforeExcelExport.bind(this) : undefined;
        if (this.gridSettings.rowHeight === null) {
            if (this.isTouchMode) {
                this.setProperties({ gridSettings: { rowHeight: 36 } }, true);
            }
            else {
                this.setProperties({ gridSettings: { rowHeight: this.isAdaptive ? 36 : 30 } }, true);
            }
        }
        this.element.style.height = '100%';
        if (this.enableVirtualization) {
            this.updatePageSettings(true);
            if (this.allowExcelExport) {
                PivotView_1.Inject(ExcelExport);
            }
            if (this.allowPdfExport) {
                PivotView_1.Inject(PDFExport);
            }
            if (this.editSettings.allowEditing) {
                PivotView_1.Inject(DrillThrough);
            }
        }
        this.isCellBoxMultiSelection = this.gridSettings.allowSelection &&
            this.gridSettings.selectionSettings.cellSelectionMode === 'Box' &&
            this.gridSettings.selectionSettings.mode === 'Cell' && this.gridSettings.selectionSettings.type === 'Multiple';
        if (this.allowGrouping && !this.isCellBoxMultiSelection) {
            this.isCellBoxMultiSelection = true;
            /* tslint:disable-next-line:max-line-length */
            this.setProperties({ gridSettings: { allowSelection: true, selectionSettings: { cellSelectionMode: 'Box', mode: 'Cell', type: 'Multiple' } } }, true);
        }
        if (this.displayOption.view !== 'Table') {
            this.chartModule = new PivotChart();
        }
        this.currentView = this.currentView ? this.currentView : (this.displayOption.view === 'Both' ?
            this.displayOption.primary : this.displayOption.view);
    };
    /**
     * @hidden
     */
    PivotView.prototype.updatePageSettings = function (isInit) {
        if (this.enableVirtualization) {
            var colValues = 1;
            var rowValues = 1;
            if (this.dataSourceSettings.values.length > 1 && this.dataType === 'pivot') {
                if (this.dataSourceSettings.valueAxis === 'row') {
                    rowValues = this.dataSourceSettings.values.length;
                }
                else {
                    colValues = this.dataSourceSettings.values.length;
                }
            }
            var heightAsNumber = this.getHeightAsNumber();
            if (isNaN(heightAsNumber)) {
                heightAsNumber = this.element.offsetHeight;
            }
            this.pageSettings = {
                columnCurrentPage: isInit ? 1 : this.pageSettings.columnCurrentPage,
                rowCurrentPage: isInit ? 1 : this.pageSettings.rowCurrentPage,
                columnSize: Math.ceil((Math.floor((this.getWidthAsNumber()) /
                    this.gridSettings.columnWidth) - 1) / colValues),
                rowSize: Math.ceil(Math.floor((heightAsNumber) / this.gridSettings.rowHeight) / rowValues),
                allowDataCompression: this.allowDataCompression
            };
        }
    };
    /* tslint:disable */
    /**
     * Initialize the control rendering
     * @returns void
     * @hidden
     */
    PivotView.prototype.render = function () {
        this.loadData();
    };
    PivotView.prototype.loadData = function () {
        if (this.dataType === 'pivot' && this.dataSourceSettings.url && this.dataSourceSettings.url !== '') {
            if (this.dataSourceSettings.mode === 'Server') {
                this.guid = PivotUtil.generateUUID();
                this.initialLoad();
                if (this.displayOption.view !== 'Chart') {
                    this.renderEmptyGrid();
                }
                this.showWaitingPopup();
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
    /* tslint:enable */
    PivotView.prototype.onSuccess = function () {
        if (this.request.readyState === XMLHttpRequest.DONE) {
            this.isServerWaitingPopup = true;
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
                    if (this.showGroupingBar) {
                        this.pivotButtonModule.updateFilterEvents();
                    }
                    else {
                        this.pivotFieldListModule.pivotButtonModule.updateFilterEvents();
                    }
                }
                else if (this.currentAction === 'fetchRawData') {
                    var valueCaption = this.engineModule.fieldList[this.drillThroughValue.actualText.toString()] ?
                        this.engineModule.fieldList[this.drillThroughValue.actualText.toString()].caption : this.drillThroughValue.actualText.toString();
                    var aggType = this.engineModule.fieldList[this.drillThroughValue.actualText] ? this.engineModule.fieldList[this.drillThroughValue.actualText].aggregateType : '';
                    var rawData = JSON.parse(engine.rawData);
                    var parsedObj = JSON.parse(engine.indexObject);
                    var indexObject = {};
                    for (var len = 0; len < parsedObj.length; len++) {
                        indexObject[parsedObj[len].Key] = parsedObj[len].Value;
                    }
                    this.drillThroughValue.indexObject = indexObject;
                    this.drillThroughModule.triggerDialog(valueCaption, aggType, rawData, this.drillThroughValue, this.drillThroughElement);
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
                    this.engineModule.pageSettings = this.pageSettings;
                    if (this.dataSourceSettings.groupSettings.length > 0) {
                        PivotUtil.updateReport(this, JSON.parse(engine.dataSourceSettings));
                    }
                    var valueSort = JSON.parse(engine.dataSourceSettings).ValueSortSettings;
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
            if (this.currentAction !== 'fetchFieldMembers' && this.currentAction !== 'fetchRawData') {
                this.initEngine();
                if (this.calculatedFieldModule && this.calculatedFieldModule.isRequireUpdate) {
                    this.calculatedFieldModule.endDialog();
                    this.calculatedFieldModule.isRequireUpdate = false;
                }
                if (this.pivotFieldListModule && this.pivotFieldListModule.calculatedFieldModule && this.pivotFieldListModule.calculatedFieldModule.isRequireUpdate) {
                    this.pivotFieldListModule.calculatedFieldModule.endDialog();
                    this.pivotFieldListModule.calculatedFieldModule.isRequireUpdate = false;
                }
            }
            if (this.currentAction === 'onScroll') {
                if (this.scrollDirection === 'vertical') {
                    var rowValues = this.dataSourceSettings.valueAxis === 'row' ? this.dataSourceSettings.values.length : 1;
                    var exactSize = (this.pageSettings.rowSize * rowValues * this.gridSettings.rowHeight);
                    var exactPage = Math.ceil(this.engineModule.rowStartPos / (this.pageSettings.rowSize * rowValues));
                    var pos = exactSize * exactPage - (this.engineModule.rowFirstLvl * rowValues * this.gridSettings.rowHeight);
                    this.scrollPosObject.verticalSection = pos;
                }
                else if (this.scrollDirection === 'horizondal') {
                    var colValues = this.dataSourceSettings.valueAxis === 'column' ? this.dataSourceSettings.values.length : 1;
                    var exactSize = (this.pageSettings.columnSize * colValues * this.gridSettings.columnWidth);
                    var exactPage = Math.ceil(this.engineModule.colStartPos / (this.pageSettings.columnSize * colValues));
                    var pos = exactSize * exactPage - (this.engineModule.colFirstLvl * colValues * this.gridSettings.columnWidth);
                    this.scrollPosObject.horizontalSection = pos;
                }
            }
        }
    };
    /**
     * @hidden
     */
    PivotView.prototype.getEngine = function (action, drillItem, sortItem, aggField, cField, filterItem, memberName, rawDataArgs, editArgs) {
        this.currentAction = action;
        this.isServerWaitingPopup = false;
        var customProperties = {
            pageSettings: this.pageSettings,
            enableValueSorting: this.enableValueSorting,
            enableDrillThrough: (this.allowDrillThrough || this.editSettings.allowEditing),
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
    PivotView.prototype.onReadyStateChange = function () {
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
    PivotView.prototype.initialLoad = function () {
        var _this_1 = this;
        this.cellTemplateFn = this.templateParser(this.cellTemplate);
        this.tooltipTemplateFn = this.templateParser(this.tooltipTemplate);
        if (this.spinnerTemplate) {
            createSpinner({ target: this.element, template: this.spinnerTemplate }, this.createElement);
        }
        else {
            createSpinner({ target: this.element }, this.createElement);
        }
        var loadArgs = {
            /* tslint:disable-next-line:max-line-length */
            dataSourceSettings: isBlazor() ? PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings) : this.dataSourceSettings,
            pivotview: isBlazor() ? undefined : this,
            fieldsType: {}
        };
        this.trigger(events.load, loadArgs, function (observedArgs) {
            if (isBlazor()) {
                observedArgs.dataSourceSettings.dataSource = _this_1.dataSourceSettings.dataSource;
                PivotUtil.updateDataSourceSettings(_this_1, observedArgs.dataSourceSettings);
            }
            else {
                _this_1.dataSourceSettings = observedArgs.dataSourceSettings;
            }
            _this_1.fieldsType = observedArgs.fieldsType;
            _this_1.updateClass();
            _this_1.notify(events.initSubComponent, {});
            if (_this_1.dataSourceSettings.mode !== 'Server') {
                _this_1.notify(events.initialLoad, {});
            }
            if (_this_1.isAdaptive) {
                _this_1.contextMenuModule.render();
            }
            _this_1.notify(events.initToolbar, {});
        });
        if (isBlazor()) {
            this.renderComplete();
        }
    };
    /**
     * Register the internal events.
     * @returns void
     * @hidden
     */
    PivotView.prototype.addInternalEvents = function () {
        this.on(events.initialLoad, this.generateData, this);
        this.on(events.dataReady, this.renderPivotGrid, this);
        this.on(events.contentReady, this.onContentReady, this);
    };
    /**
     * De-Register the internal events.
     * @returns void
     * @hidden
     */
    PivotView.prototype.removeInternalEvents = function () {
        this.off(events.initialLoad, this.generateData);
        this.off(events.dataReady, this.renderPivotGrid);
        this.off(events.contentReady, this.onContentReady);
    };
    /**
     * Get the Pivot widget properties to be maintained in the persisted state.
     * @returns {string}
     */
    PivotView.prototype.getPersistData = function () {
        var keyEntity = ['dataSourceSettings', 'pivotValues', 'gridSettings', 'chartSettings', 'displayOption'];
        /* tslint:disable */
        this.chartSettings['tooltipRender'] = undefined;
        /* tslint:enable */
        return this.addOnPersist(keyEntity);
    };
    /**
     * Loads pivot Layout
     * @param {string} persistData - Specifies the persist data to be loaded to pivot.
     * @returns {void}
     */
    PivotView.prototype.loadPersistData = function (persistData) {
        var pivotData;
        /* tslint:disable */
        if (isBlazor()) {
            pivotData = typeof persistData === "string" ? JSON.parse(persistData) : persistData;
            pivotData.dataSourceSettings.dataSource = this.dataSourceSettings.dataSource;
        }
        else {
            pivotData = JSON.parse(persistData);
        }
        this.allowServerDataBinding = false;
        this.setProperties({
            gridSettings: pivotData.gridSettings,
            pivotValues: pivotData.pivotValues,
            chartSettings: pivotData.chartSettings,
            displayOption: pivotData.displayOption
        }, true);
        delete this.bulkChanges.pivotValues;
        this.allowServerDataBinding = true;
        /* tslint:enable */
        this.dataSourceSettings = pivotData.dataSourceSettings;
    };
    PivotView.prototype.mergePersistPivotData = function () {
        var blazdataSource;
        if (isBlazor()) {
            blazdataSource = this.dataSourceSettings.dataSource;
        }
        var data = window.localStorage.getItem(this.getModuleName() + this.element.id);
        if (!(isNullOrUndefined(data) || (data === ''))) {
            this.setProperties(JSON.parse(data), true);
        }
        if (this.dataSourceSettings.dataSource instanceof Object && isBlazor()) {
            this.setProperties({ dataSourceSettings: { dataSource: blazdataSource } }, true);
        }
    };
    /**
     * Method to open conditional formatting dialog
     */
    PivotView.prototype.showConditionalFormattingDialog = function () {
        if (this.conditionalFormattingModule) {
            this.conditionalFormattingModule.showConditionalFormattingDialog();
        }
    };
    /**
     * Method to open calculated field dialog
     */
    PivotView.prototype.createCalculatedFieldDialog = function () {
        if (this.calculatedFieldModule) {
            this.calculatedFieldModule.createCalculatedFieldDialog();
        }
    };
    /**
     * It returns the Module name.
     * @returns string
     * @hidden
     */
    PivotView.prototype.getModuleName = function () {
        return 'pivotview';
    };
    /**
     * Copy the selected rows or cells data into clipboard.
     * @param {boolean} withHeader - Specifies whether the column header text needs to be copied along with rows or cells.
     * @returns {void}
     * @hidden
     */
    PivotView.prototype.copy = function (withHeader) {
        this.grid.copy(withHeader);
    };
    /**
     * By default, prints all the pages of the Grid and hides the pager.
     * > You can customize print options using the
     * [`printMode`](./api-pivotgrid.html#printmode-string).
     * @returns {void}
     * @hidden
     */
    // public print(): void {
    //     this.grid.print();
    // }
    /* tslint:disable:max-func-body-length */
    /**
     * Called internally if any of the property value changed.
     * @returns void
     * @hidden
     */
    PivotView.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'dataSourceSettings':
                case 'hyperlinkSettings':
                case 'allowDrillThrough':
                case 'editSettings':
                case 'allowDataCompression':
                    if (newProp.dataSourceSettings && Object.keys(newProp.dataSourceSettings).length === 1
                        && newProp.dataSourceSettings.groupSettings && this.dataType === 'pivot') {
                        this.updateGroupingReport(newProp.dataSourceSettings.groupSettings, 'Date');
                    }
                    if (newProp.dataSourceSettings && Object.keys(newProp.dataSourceSettings).length === 1
                        && Object.keys(newProp.dataSourceSettings)[0] === 'dataSource') {
                        if (newProp.dataSourceSettings.dataSource.length === 0) {
                            this.savedDataSourceSettings = PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings);
                            this.setProperties({ dataSourceSettings: { rows: [] } }, true);
                            this.setProperties({ dataSourceSettings: { columns: [] } }, true);
                            this.setProperties({ dataSourceSettings: { values: [] } }, true);
                            this.pivotValues = [];
                        }
                        this.engineModule.fieldList = null;
                        this.showWaitingPopup();
                        clearTimeout(this.timeOutObj);
                        this.timeOutObj = setTimeout(this.refreshData.bind(this), 100);
                    }
                    else {
                        if (PivotUtil.isButtonIconRefesh(prop, oldProp, newProp)) {
                            if (this.showGroupingBar && this.groupingBarModule) {
                                this.axisFieldModule.render();
                            }
                            if (this.showFieldList && this.pivotFieldListModule) {
                                var rows = PivotUtil.cloneFieldSettings(this.dataSourceSettings.rows);
                                var columns = PivotUtil.cloneFieldSettings(this.dataSourceSettings.columns);
                                var values = PivotUtil.cloneFieldSettings(this.dataSourceSettings.values);
                                var filters = PivotUtil.cloneFieldSettings(this.dataSourceSettings.filters);
                                /* tslint:disable-next-line:max-line-length */
                                this.pivotFieldListModule.setProperties({ dataSourceSettings: { rows: rows, columns: columns, values: values, filters: filters } }, true);
                                this.pivotFieldListModule.axisFieldModule.render();
                                if (this.pivotFieldListModule.treeViewModule.fieldTable && !this.isAdaptive) {
                                    this.pivotFieldListModule.notify(events.treeViewUpdate, {});
                                }
                            }
                        }
                        else {
                            this.remoteData = [];
                            if (this.dataType === 'pivot' && this.dataSourceSettings.url && this.dataSourceSettings.url !== '' &&
                                ('type' in newProp.dataSourceSettings || 'url' in newProp.dataSourceSettings)) {
                                this.engineModule.fieldList = null;
                                this.loadData();
                            }
                            else {
                                if (newProp.dataSourceSettings && 'dataSource' in newProp.dataSourceSettings) {
                                    this.engineModule.fieldList = null;
                                }
                                this.notify(events.initialLoad, {});
                            }
                        }
                    }
                    break;
                case 'height':
                case 'width':
                    this.layoutRefresh();
                    break;
                case 'pivotValues':
                case 'displayOption':
                    if (!this.showToolbar && newProp.displayOption && Object.keys(newProp.displayOption).length === 1 &&
                        newProp.displayOption.view) {
                        this.currentView = (newProp.displayOption.view === 'Both' ?
                            this.displayOption.primary : newProp.displayOption.view);
                        if (this.showGroupingBar || this.showFieldList) {
                            if (this.showFieldList && this.pivotFieldListModule) {
                                this.pivotFieldListModule.destroy();
                            }
                            if (this.showGroupingBar && this.groupingBarModule) {
                                this.groupingBarModule.destroy();
                            }
                            this.notify(events.initSubComponent, this);
                        }
                        if (!this.grid && newProp.displayOption.view !== 'Chart') {
                            this.renderEmptyGrid();
                            if (newProp.displayOption.view === 'Table') {
                                if (this.chartModule) {
                                    this.chartModule.destroy();
                                    this.chart = undefined;
                                    this.chartModule = undefined;
                                }
                            }
                        }
                        else if (!this.chartModule && this.displayOption.view !== 'Table') {
                            this.chartModule = new PivotChart();
                        }
                    }
                    else if (this.showToolbar && !isNullOrUndefined(newProp.displayOption) && newProp.displayOption.view) {
                        this.currentView = (newProp.displayOption.view === 'Both' ?
                            this.displayOption.primary : newProp.displayOption.view);
                    }
                    var engine = this.dataType === 'pivot' ? this.engineModule : this.olapEngineModule;
                    if (!isNullOrUndefined(engine.fieldList) || !isNullOrUndefined(engine.pivotValues)) {
                        this.notify(events.dataReady, {});
                    }
                    break;
                case 'gridSettings':
                    this.lastGridSettings = newProp.gridSettings;
                    this.isCellBoxMultiSelection = this.gridSettings.allowSelection &&
                        this.gridSettings.selectionSettings.cellSelectionMode === 'Box' &&
                        this.gridSettings.selectionSettings.mode === 'Cell' && this.gridSettings.selectionSettings.type === 'Multiple';
                    if (this.allowGrouping && this.groupingModule && !this.isCellBoxMultiSelection) {
                        /* tslint:disable-next-line:max-line-length */
                        this.setProperties({ gridSettings: { allowSelection: true, selectionSettings: { cellSelectionMode: 'Box', mode: 'Cell', type: 'Multiple' } } }, true);
                        this.isCellBoxMultiSelection = true;
                    }
                    this.renderModule.updateGridSettings();
                    break;
                case 'chartSettings':
                    if (this.showGroupingBar &&
                        this.groupingBarModule &&
                        (Object.keys(newProp.chartSettings).indexOf('enableMultiAxis') !== -1 ||
                            (newProp.chartSettings.chartSeries && Object.keys(newProp.chartSettings.chartSeries).indexOf('type') !== -1))) {
                        this.groupingBarModule.renderLayout();
                    }
                    if (isNullOrUndefined(this.chartModule) && this.displayOption.view !== 'Table') {
                        this.chartModule = new PivotChart();
                    }
                    var engineModule = this.dataType === 'pivot' ? this.engineModule : this.olapEngineModule;
                    if (!isNullOrUndefined(this.chartModule) && !isNullOrUndefined(engineModule.pivotValues)) {
                        this.chartModule.loadChart(this, this.chartSettings);
                    }
                    if (!isNullOrUndefined(engineModule.pivotValues) && !isNullOrUndefined(engineModule.fieldList)) {
                        this.notify(events.uiUpdate, this);
                    }
                    break;
                case 'locale':
                case 'currencyCode':
                case 'enableRtl':
                    if (this.tooltip) {
                        this.tooltip.destroy();
                    }
                    /* tslint:disable-next-line:max-line-length */
                    if (this.dataSourceSettings.groupSettings && this.dataSourceSettings.groupSettings.length > 0 && this.clonedDataSet && !isBlazor()) {
                        var dataSet = PivotUtil.getClonedData(this.clonedDataSet);
                        this.setProperties({ dataSourceSettings: { dataSource: dataSet } }, true);
                    }
                    if (isBlazor()) {
                        this.refresh();
                    }
                    else {
                        _super.prototype.refresh.call(this);
                    }
                    this.updateClass();
                    break;
                case 'enableValueSorting':
                    this.enableValueSorting = newProp.enableValueSorting;
                    this.updateDataSource();
                    break;
                case 'showGroupingBar':
                    if (this.element.querySelector('.e-grouping-bar')) {
                        this.element.querySelector('.e-grouping-bar').remove();
                    }
                    if (isNullOrUndefined(newProp.showFieldList))
                        this.renderPivotGrid();
                    break;
                case 'showFieldList':
                    this.initialLoad();
                    break;
                case 'groupingBarSettings':
                    this.axisFieldModule.render();
                    break;
                case 'showTooltip':
                    this.renderToolTip();
                    break;
                case 'toolbar':
                    if (this.toolbarModule) {
                        this.toolbarModule.refreshToolbar();
                    }
                    break;
                case 'chartTypes':
                    if (this.toolbarModule) {
                        this.toolbarModule.createChartMenu();
                    }
                    break;
                case 'aggregateTypes':
                    if (this.showGroupingBar) {
                        if (this.axisFieldModule) {
                            this.axisFieldModule.render();
                        }
                    }
                    if (this.showFieldList && this.pivotFieldListModule && this.pivotFieldListModule.axisFieldModule) {
                        this.pivotFieldListModule.setProperties({ aggregateTypes: newProp.aggregateTypes }, true);
                        this.pivotFieldListModule.axisFieldModule.render();
                    }
                    break;
            }
        }
    };
    /**
     * Method to parse the template string.
     */
    PivotView.prototype.templateParser = function (template) {
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
     * Method to get the cell template.
     */
    PivotView.prototype.getCellTemplate = function () {
        return this.cellTemplateFn;
    };
    /**
     * @hidden
     */
    PivotView.prototype.appendHtml = function (node, innerHtml) {
        var tempElement = document.createElement('div');
        tempElement.innerHTML = innerHtml;
        if (!isNullOrUndefined(tempElement.firstChild)) {
            node.appendChild(tempElement.firstChild);
        }
        return node;
    };
    /**
     * Render the UI section of PivotView.
     * @returns void
     * @hidden
     */
    PivotView.prototype.renderPivotGrid = function () {
        this.clearTemplate();
        if (this.currentView === 'Table') {
            /* tslint:disable-next-line */
            if (this.cellTemplate && isBlazor()) {
                resetBlazorTemplate(this.element.id + '_cellTemplate', 'CellTemplate');
            }
        }
        if (this.chartModule) {
            this.chartModule.engineModule = this.engineModule;
            this.chartModule.loadChart(this, this.chartSettings);
            if (this.enableRtl && this.chart) {
                addClass([this.chart.element], cls.PIVOTCHART_LTR);
            }
        }
        if (this.showFieldList || this.showGroupingBar || this.allowNumberFormatting || this.allowCalculatedField ||
            this.toolbar || this.allowGrouping || this.gridSettings.contextMenuItems) {
            this.notify(events.uiUpdate, this);
            if (this.pivotFieldListModule && this.allowDeferLayoutUpdate) {
                this.pivotFieldListModule.clonedDataSource = extend({}, this.dataSourceSettings, null, true);
            }
        }
        if (this.enableVirtualization) {
            this.virtualscrollModule = new VirtualScroll(this);
        }
        if (this.allowDrillThrough || this.editSettings.allowEditing) {
            this.drillThroughModule = new DrillThrough(this);
        }
        if (this.displayOption.view !== 'Chart') {
            if (this.hyperlinkSettings) {
                this.isRowCellHyperlink = (this.hyperlinkSettings.showRowHeaderHyperlink ?
                    true : this.hyperlinkSettings.showHyperlink ? true : false);
                this.isColumnCellHyperlink = (this.hyperlinkSettings.showColumnHeaderHyperlink ?
                    true : this.hyperlinkSettings.showHyperlink ? true : false);
                this.isValueCellHyperlink = (this.hyperlinkSettings.showValueCellHyperlink ?
                    true : this.hyperlinkSettings.showHyperlink ? true : false);
                this.isSummaryCellHyperlink = (this.hyperlinkSettings.showSummaryCellHyperlink ?
                    true : this.hyperlinkSettings.showHyperlink ? true : false);
                this.applyHyperlinkSettings();
            }
            this.renderModule = new Render(this);
            this.renderModule.render();
        }
        else if (this.grid) {
            remove(this.grid.element);
        }
        if (this.allowConditionalFormatting) {
            this.applyFormatting(this.pivotValues);
        }
        if (this.showToolbar) {
            if (this.displayOption.view === 'Both' && this.chart && this.grid) {
                if (this.showGroupingBar && this.groupingBarModule && this.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
                    this.groupingBarModule.refreshUI();
                }
                if (this.toolbarModule && this.toolbarModule.toolbar) {
                    this.toolbarModule.toolbar.width = this.getGridWidthAsNumber() - 2;
                }
                this.chart.element.style.width = formatUnit(this.getGridWidthAsNumber());
                this.chart.width = formatUnit(this.getGridWidthAsNumber());
                if (this.currentView === 'Table') {
                    this.grid.element.style.display = '';
                    this.chart.element.style.display = 'none';
                    if (this.chartSettings.enableMultiAxis && this.chartSettings.enableScrollOnMultiAxis) {
                        this.element.querySelector('.e-pivotchart').style.display = 'none';
                    }
                }
                else {
                    this.grid.element.style.display = 'none';
                    this.chart.element.style.display = '';
                    if (this.chartSettings.enableMultiAxis && this.chartSettings.enableScrollOnMultiAxis) {
                        this.element.querySelector('.e-pivotchart').style.display = '';
                    }
                }
            }
        }
        if (this.toolbarModule) {
            if (this.showFieldList && select('#' + this.element.id + '_PivotFieldList', this.element)) {
                select('#' + this.element.id + '_PivotFieldList', this.element).style.display = 'none';
            }
            if (this.toolbar && this.toolbar.indexOf('FieldList') !== -1 &&
                this.showToolbar && this.element.querySelector('.e-toggle-field-list')) {
                this.element.querySelector('.e-toggle-field-list').style.display = 'none';
            }
            if (this.toolbarModule && this.toolbarModule.action !== 'New' && this.toolbarModule.action !== 'Load'
                && this.toolbarModule.action !== 'Remove') {
                this.isModified = true;
            }
            if (!this.isInitialRendering) {
                this.isModified = false;
                this.isInitialRendering = !this.isInitialRendering;
            }
            this.toolbarModule.action = '';
        }
    };
    /**
     * @hidden
     */
    PivotView.prototype.showWaitingPopup = function () {
        if (this.grid && this.grid.element && !this.spinnerTemplate && this.currentView === 'Table') {
            showSpinner(this.grid.element);
        }
        else {
            showSpinner(this.element);
        }
    };
    /**
     * @hidden
     */
    PivotView.prototype.hideWaitingPopup = function () {
        if (this.grid && this.grid.element && !this.spinnerTemplate && this.currentView === 'Table') {
            hideSpinner(this.grid.element);
        }
        else {
            hideSpinner(this.element);
        }
    };
    /* tslint:disable:max-func-body-length */
    /**
     * Updates the PivotEngine using dataSource from Pivot View component.
     * @method updateDataSource
     * @return {void}
     * @hidden
     */
    PivotView.prototype.updateDataSource = function (isRefreshGrid) {
        var _this_1 = this;
        this.showWaitingPopup();
        var pivot = this;
        //setTimeout(() => {
        var isSorted = Object.keys(pivot.lastSortInfo).length > 0 ? true : false;
        var isFiltered = Object.keys(pivot.lastFilterInfo).length > 0 ? true : false;
        var isAggChange = Object.keys(pivot.lastAggregationInfo).length > 0 ? true : false;
        var isCalcChange = Object.keys(pivot.lastCalcFieldInfo).length > 0 ? true : false;
        var args = {
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(pivot.dataSourceSettings)
        };
        pivot.trigger(events.enginePopulating, args, function (observedArgs) {
            if (!(pivot.enableVirtualization && (isSorted || isFiltered || isAggChange || isCalcChange))) {
                PivotUtil.updateDataSourceSettings(pivot, observedArgs.dataSourceSettings);
            }
            pivot.updatePageSettings(false);
            if (pivot.dataType === 'pivot' && pivot.enableVirtualization && (isSorted || isFiltered || isAggChange || isCalcChange)) {
                /* tslint:disable-next-line:no-any */
                var interopArguments = {};
                if (isSorted) {
                    pivot.setProperties({ dataSourceSettings: { valueSortSettings: { headerText: '' } } }, true);
                    if (isBlazor()) {
                        var sfBlazor = 'sfBlazor';
                        var sortInfo = {
                            name: pivot.lastSortInfo.name,
                            order: pivot.lastSortInfo.order
                        };
                        /* tslint:disable-next-line */
                        var sortArgs = window[sfBlazor].copyWithoutCircularReferences([pivot.lastSortInfo], pivot.lastSortInfo);
                        interopArguments = { 'key': 'onSort', 'arg': sortArgs };
                    }
                    else if (_this_1.dataSourceSettings.mode === 'Server') {
                        pivot.getEngine('onSort', null, pivot.lastSortInfo, null, null, null, null);
                    }
                    else {
                        pivot.engineModule.onSort(pivot.lastSortInfo);
                    }
                    pivot.lastSortInfo = {};
                }
                if (isAggChange) {
                    if (isBlazor()) {
                        /* tslint:disable */
                        var sfBlazor = 'sfBlazor';
                        var aggregateArgs = window[sfBlazor].copyWithoutCircularReferences([pivot.lastAggregationInfo], pivot.lastAggregationInfo);
                        interopArguments = { 'key': 'onAggregation', 'arg': aggregateArgs };
                        /* tslint:enable */
                    }
                    else if (_this_1.dataSourceSettings.mode === 'Server') {
                        pivot.getEngine('onAggregation', null, null, pivot.lastAggregationInfo, null, null, null);
                    }
                    else {
                        pivot.engineModule.onAggregation(pivot.lastAggregationInfo);
                    }
                    pivot.lastAggregationInfo = {};
                }
                if (isCalcChange) {
                    if (isBlazor()) {
                        /* tslint:disable */
                        var dataSourceSettings = window['sfBlazor'].copyWithoutCircularReferences([pivot.dataSourceSettings.properties], pivot.dataSourceSettings.properties);
                        interopArguments = {
                            'key': 'onCalcOperation',
                            'arg': {
                                lastCalcFieldInfo: pivot.lastCalcFieldInfo,
                                values: dataSourceSettings.values,
                                calculatedFieldSettings: dataSourceSettings.calculatedFieldSettings
                            }
                        };
                        /* tslint:enable */
                    }
                    else if (_this_1.dataSourceSettings.mode === 'Server') {
                        pivot.getEngine('onCalcOperation', null, null, null, pivot.lastCalcFieldInfo, null, null);
                    }
                    else {
                        pivot.engineModule.onCalcOperation(pivot.lastCalcFieldInfo);
                    }
                    pivot.lastCalcFieldInfo = {};
                }
                if (isFiltered) {
                    if (isBlazor()) {
                        /* tslint:disable */
                        var filterArgs = window['sfBlazor'].copyWithoutCircularReferences([pivot.lastFilterInfo], pivot.lastFilterInfo);
                        var filterSettings = window['sfBlazor'].copyWithoutCircularReferences([pivot.dataSourceSettings.filterSettings], pivot.dataSourceSettings.filterSettings);
                        interopArguments = {
                            'key': 'onFilter',
                            'arg': { 'lastFilterInfo': filterArgs, 'filterSettings': filterSettings }
                        };
                        /* tslint:enable */
                    }
                    else if (_this_1.dataSourceSettings.mode === 'Server') {
                        pivot.getEngine('onFilter', null, null, null, null, pivot.lastFilterInfo, null);
                    }
                    else {
                        pivot.engineModule.onFilter(pivot.lastFilterInfo, pivot.dataSourceSettings);
                    }
                    pivot.lastFilterInfo = {};
                }
                if (isBlazor()) {
                    /* tslint:disable */
                    pivot.interopAdaptor.invokeMethodAsync('PivotInteropMethod', interopArguments['key'], interopArguments['arg']).then(function (data) {
                        pivot.updateBlazorData(data, pivot);
                        pivot.allowServerDataBinding = false;
                        pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                        delete pivot.bulkChanges.pivotValues;
                        pivot.allowServerDataBinding = true;
                        pivot.enginePopulatedEventMethod('updateDataSource', pivot);
                        if (pivot.calculatedFieldModule && pivot.calculatedFieldModule.isRequireUpdate) {
                            pivot.calculatedFieldModule.endDialog();
                            pivot.calculatedFieldModule.isRequireUpdate = false;
                        }
                    });
                    /* tslint:enable */
                }
                else {
                    pivot.allowServerDataBinding = false;
                    pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                    /* tslint:disable-next-line:no-any */
                    delete pivot.bulkChanges.pivotValues;
                    pivot.allowServerDataBinding = true;
                    pivot.enginePopulatedEventMethod('updateDataSource');
                }
            }
            else {
                if (pivot.dataType === 'olap') {
                    /* tslint:disable:align */
                    var customProperties = {
                        mode: '',
                        savedFieldList: pivot.olapEngineModule.fieldList,
                        savedFieldListData: pivot.olapEngineModule.fieldListData,
                        pageSettings: pivot.pageSettings,
                        enableValueSorting: pivot.enableValueSorting,
                        isDrillThrough: (pivot.allowDrillThrough || pivot.editSettings.allowEditing),
                        localeObj: pivot.localeObj
                    };
                    if (isCalcChange || isSorted) {
                        pivot.olapEngineModule.savedFieldList = pivot.olapEngineModule.fieldList;
                        pivot.olapEngineModule.savedFieldListData = pivot.olapEngineModule.fieldListData;
                        if (isCalcChange) {
                            pivot.olapEngineModule.updateCalcFields(pivot.dataSourceSettings, pivot.lastCalcFieldInfo);
                            pivot.lastCalcFieldInfo = {};
                        }
                        else {
                            pivot.olapEngineModule.onSort(pivot.dataSourceSettings);
                            pivot.lastSortInfo = {};
                        }
                    }
                    else {
                        pivot.olapEngineModule.renderEngine(pivot.dataSourceSettings, customProperties);
                    }
                    pivot.allowServerDataBinding = false;
                    pivot.setProperties({ pivotValues: pivot.olapEngineModule.pivotValues }, true);
                    /* tslint:disable-next-line:no-any */
                    delete pivot.bulkChanges.pivotValues;
                    pivot.allowServerDataBinding = true;
                    pivot.enginePopulatedEventMethod('updateDataSource');
                }
                else {
                    var customProperties = {
                        mode: '',
                        savedFieldList: pivot.engineModule.fieldList,
                        pageSettings: pivot.pageSettings,
                        enableValueSorting: pivot.enableValueSorting,
                        isDrillThrough: (pivot.allowDrillThrough || pivot.editSettings.allowEditing),
                        localeObj: pivot.localeObj,
                        fieldsType: pivot.fieldsType
                    };
                    /* tslint:enable:align */
                    if (isBlazor() && pivot.enableVirtualization) {
                        /* tslint:disable */
                        var sfBlazor = 'sfBlazor';
                        var customArgs = window[sfBlazor].copyWithoutCircularReferences([customProperties], customProperties);
                        var datasourceSettings = window[sfBlazor].copyWithoutCircularReferences([pivot.dataSourceSettings], pivot.dataSourceSettings);
                        pivot.interopAdaptor.invokeMethodAsync('PivotInteropMethod', 'renderEngine', { 'dataSourceSettings': datasourceSettings, 'customProperties': customArgs }).then(function (data) {
                            pivot.updateBlazorData(data, pivot);
                            pivot.allowServerDataBinding = false;
                            pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                            delete pivot.bulkChanges.pivotValues;
                            pivot.allowServerDataBinding = true;
                            pivot.enginePopulatedEventMethod('updateDataSource', pivot);
                        });
                        /* tslint:enable */
                    }
                    else if (pivot.dataSourceSettings.mode === 'Server') {
                        if (isSorted)
                            pivot.getEngine('onSort', null, pivot.lastSortInfo, null, null, null, null);
                        else if (isAggChange)
                            pivot.getEngine('onAggregation', null, null, pivot.lastAggregationInfo, null, null, null);
                        else if (isCalcChange)
                            pivot.getEngine('onCalcOperation', null, null, null, pivot.lastCalcFieldInfo, null, null);
                        else if (isFiltered)
                            pivot.getEngine('onFilter', null, null, null, null, pivot.lastFilterInfo, null);
                        else
                            pivot.getEngine('onDrop', null, null, null, null, null, null);
                        pivot.lastSortInfo = {};
                        pivot.lastAggregationInfo = {};
                        pivot.lastCalcFieldInfo = {};
                        pivot.lastFilterInfo = {};
                    }
                    else {
                        pivot.engineModule.renderEngine(pivot.dataSourceSettings, customProperties, pivot.getValueCellInfo.bind(pivot));
                        pivot.allowServerDataBinding = false;
                        pivot.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                        /* tslint:disable-next-line:no-any */
                        delete pivot.bulkChanges.pivotValues;
                        pivot.allowServerDataBinding = true;
                        pivot.enginePopulatedEventMethod('updateDataSource');
                    }
                }
            }
        });
        //});
    };
    /**
     * Export Pivot widget data to Excel file(.xlsx).
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @returns void
     */
    /* tslint:disable-next-line:no-any */
    PivotView.prototype.excelExport = function (excelExportProperties, isMultipleExport, workbook, isBlob) {
        if (this.enableVirtualization) {
            this.excelExportModule.exportToExcel('Excel');
        }
        else {
            this.grid.excelExport(excelExportProperties, isMultipleExport, workbook, isBlob);
        }
    };
    /**
     * Export PivotGrid data to CSV file.
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @returns void
     */
    /* tslint:disable-next-line:no-any */
    PivotView.prototype.csvExport = function (excelExportProperties, isMultipleExport, workbook, isBlob) {
        if (this.enableVirtualization) {
            this.excelExportModule.exportToExcel('CSV');
        }
        else {
            this.grid.csvExport(excelExportProperties, isMultipleExport, workbook, isBlob);
        }
    };
    /**
     * Export Pivot widget data to PDF document.
     * @param  {pdfExportProperties} PdfExportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param  {pdfDoc} pdfDoc - Defined the Pdf Document if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @returns void
     */
    PivotView.prototype.pdfExport = function (pdfExportProperties, isMultipleExport, pdfDoc, isBlob) {
        if (this.enableVirtualization) {
            this.pdfExportModule.exportToPDF();
        }
        else {
            this.grid.pdfExport(pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
        }
    };
    /**
     * Export method for the chart.
     * @param type - Defines the export type.
     * @param fileName - Defines file name of export document.
     * @param orientation - Defines the page orientation on pdf export(0 for Portrait mode, 1 for Landscape mode).
     * @param width - Defines width of the export document.
     * @param height - Defines height of the export document.
     */
    PivotView.prototype.chartExport = function (type, fileName, orientation, width, height) {
        if (this.chart && this.chart.enableExport) {
            this.chart.exportModule.export(type, fileName, orientation, null, width, height);
        }
    };
    /**
     * Print method for the chart.
     */
    PivotView.prototype.printChart = function () {
        if (this.chart) {
            this.chart.print();
        }
    };
    /** @hidden */
    /* tslint:disable:max-func-body-length */
    PivotView.prototype.onDrill = function (target, chartDrillInfo) {
        var _this_1 = this;
        var delimiter = (this.dataSourceSettings.drilledMembers[0] && this.dataSourceSettings.drilledMembers[0].delimiter) ?
            this.dataSourceSettings.drilledMembers[0].delimiter : '**';
        var fieldName = '';
        var axis = '';
        var action = '';
        if (chartDrillInfo) {
            fieldName = chartDrillInfo.fieldName;
            axis = chartDrillInfo.cell.axis;
            action = chartDrillInfo.isDrilled ? 'up' : 'down';
        }
        else {
            fieldName = target.parentElement.getAttribute('fieldname');
            axis = target.parentElement.classList.contains(cls.ROWSHEADER) ? 'row' : 'column';
            action = target.classList.contains(cls.COLLAPSE) ? 'up' : 'down';
        }
        if (this.dataType === 'pivot') {
            var clonedDrillMembers_1 = PivotUtil.cloneDrillMemberSettings(this.dataSourceSettings.drilledMembers);
            var currentCell = chartDrillInfo ? chartDrillInfo.cell :
                this.engineModule.pivotValues[Number(target.parentElement.getAttribute('index'))][Number(target.parentElement.getAttribute('aria-colindex'))];
            var memberName = currentCell.valueSort.levelName.
                split(this.engineModule.valueSortSettings.headerDelimiter).join(delimiter);
            var fieldAvail = false;
            if (this.dataSourceSettings.drilledMembers.length === 0) {
                /* tslint:disable-next-line:max-line-length */
                this.setProperties({ dataSourceSettings: { drilledMembers: [{ name: fieldName, items: [memberName], delimiter: delimiter }] } }, true);
            }
            else {
                var drillMembers = PivotUtil.cloneDrillMemberSettings(this.dataSourceSettings.drilledMembers);
                for (var fCnt = 0; fCnt < drillMembers.length; fCnt++) {
                    var field = drillMembers[fCnt];
                    memberName = memberName.split(delimiter).join(field.delimiter ? field.delimiter : delimiter);
                    delimiter = field.delimiter = field.delimiter ? field.delimiter : delimiter;
                    if (field.name === fieldName) {
                        fieldAvail = true;
                        var memIndex = field.items.indexOf(memberName);
                        if (memIndex > -1) {
                            field.items.splice(memIndex, 1);
                        }
                        else {
                            field.items.push(memberName);
                        }
                    }
                    else {
                        continue;
                    }
                }
                this.setProperties({ dataSourceSettings: { drilledMembers: drillMembers } }, true);
                if (!fieldAvail) {
                    this.dataSourceSettings.drilledMembers.push({ name: fieldName, items: [memberName], delimiter: delimiter });
                }
            }
            this.showWaitingPopup();
            var pivot_1 = this;
            //setTimeout(() => {
            var drilledItem_1 = {
                fieldName: fieldName, memberName: memberName, delimiter: delimiter,
                axis: axis,
                action: action,
                currentCell: currentCell
            };
            var drillArgs_1 = {
                drillInfo: drilledItem_1,
                pivotview: isBlazor() ? undefined : pivot_1,
                cancel: false
            };
            pivot_1.trigger(events.drill, drillArgs_1, function (observedArgs) {
                if (!observedArgs.cancel) {
                    if (pivot_1.enableVirtualization) {
                        if (isBlazor()) {
                            /* tslint:disable */
                            var sfBlazor = 'sfBlazor';
                            var dataSourceSettings = window[sfBlazor].copyWithoutCircularReferences([pivot_1.dataSourceSettings], pivot_1.dataSourceSettings);
                            var drillItem = window[sfBlazor].copyWithoutCircularReferences([drilledItem_1], drilledItem_1);
                            var args = window[sfBlazor].copyWithoutCircularReferences([drillArgs_1], drillArgs_1);
                            pivot_1.interopAdaptor.invokeMethodAsync('PivotInteropMethod', 'onDrill', { 'dataSourceSettings': dataSourceSettings, 'drilledItem': drillItem }).then(function (data) {
                                pivot_1.updateBlazorData(data, pivot_1);
                                pivot_1.engineModule.drilledMembers = pivot_1.dataSourceSettings.drilledMembers;
                                pivot_1.allowServerDataBinding = false;
                                pivot_1.setProperties({ pivotValues: pivot_1.engineModule.pivotValues }, true);
                                delete pivot_1.bulkChanges.pivotValues;
                                pivot_1.allowServerDataBinding = true;
                                pivot_1.renderPivotGrid();
                            });
                            /* tslint:enable */
                        }
                        else if (_this_1.dataSourceSettings.mode === 'Server') {
                            _this_1.getEngine('onDrill', drilledItem_1, null, null, null, null, null);
                        }
                        else {
                            pivot_1.engineModule.drilledMembers = pivot_1.dataSourceSettings.drilledMembers;
                            pivot_1.engineModule.onDrill(drilledItem_1);
                        }
                    }
                    else if (_this_1.dataSourceSettings.mode === 'Server') {
                        _this_1.getEngine('onDrill', drilledItem_1, null, null, null, null, null);
                    }
                    else {
                        pivot_1.engineModule.generateGridData(pivot_1.dataSourceSettings);
                    }
                    if (!(isBlazor() && pivot_1.enableVirtualization)) {
                        pivot_1.allowServerDataBinding = false;
                        pivot_1.setProperties({ pivotValues: pivot_1.engineModule.pivotValues }, true);
                        /* tslint:disable-next-line:no-any */
                        delete pivot_1.bulkChanges.pivotValues;
                        pivot_1.allowServerDataBinding = true;
                        pivot_1.renderPivotGrid();
                    }
                }
                else {
                    _this_1.hideWaitingPopup();
                    _this_1.setProperties({ dataSourceSettings: { drilledMembers: clonedDrillMembers_1 } }, true);
                }
            });
        }
        else {
            this.onOlapDrill(fieldName, axis, action, delimiter, target, chartDrillInfo);
        }
    };
    /* tslint:disable */
    PivotView.prototype.onOlapDrill = function (fieldName, axis, action, delimiter, target, chartDrillInfo) {
        var _this_1 = this;
        var pivot = this;
        var clonedDrillMembers = PivotUtil.cloneDrillMemberSettings(this.dataSourceSettings.drilledMembers);
        var currentCell = chartDrillInfo ? chartDrillInfo.cell :
            this.olapEngineModule.pivotValues[Number(target.parentElement.getAttribute('index'))][Number(target.parentElement.getAttribute('aria-colindex'))];
        var tupInfo = axis === 'row' ? this.olapEngineModule.tupRowInfo[currentCell.ordinal] :
            this.olapEngineModule.tupColumnInfo[currentCell.ordinal];
        var drillInfo = {
            axis: axis,
            action: action,
            fieldName: fieldName,
            delimiter: '~~',
            memberName: tupInfo.uNameCollection,
            currentCell: currentCell
        };
        this.showWaitingPopup();
        var drillArgs = {
            drillInfo: drillInfo,
            pivotview: isBlazor() ? undefined : pivot,
            cancel: false
        };
        var isAttributeHierarchy = this.olapEngineModule.fieldList[drillInfo.fieldName] && this.olapEngineModule.fieldList[drillInfo.fieldName].isHierarchy;
        var fieldPos = tupInfo.drillInfo.map(function (item) { return item.hierarchy; }).indexOf(currentCell.hierarchy.toString());
        var clonedMembers = PivotUtil.cloneDrillMemberSettings(this.dataSourceSettings.drilledMembers);
        if (drillInfo && drillInfo.action === 'down') {
            var fields = tupInfo.drillInfo.map(function (item) { return item.uName; });
            var member = '';
            for (var pos = 0; pos <= fieldPos; pos++) {
                var field = fields[pos];
                var members = field.split('~~');
                member = member + (member !== '' ? '~~' : '') + members[members.length - 1];
            }
            var drillSets = this.olapEngineModule.getDrilledSets(drillInfo.memberName, currentCell, (this.olapEngineModule.fieldList[currentCell.hierarchy] && !this.olapEngineModule.fieldList[currentCell.hierarchy].hasAllMember) ? currentCell.valueSort.levelName.split(this.dataSourceSettings.valueSortSettings.headerDelimiter).length - 1 : fieldPos, axis);
            var keys = Object.keys(drillSets);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                var drillSet = drillSets[key];
                for (var i = 0, cnt = clonedMembers.length; i < cnt; i++) {
                    var drillMembers = clonedMembers[i];
                    var memberItem = drillSet;
                    if (drillMembers.delimiter) {
                        memberItem = memberItem.replace(/~~/g, drillMembers.delimiter);
                    }
                    var items = [];
                    for (var itemPos = 0; itemPos < drillMembers.items.length; itemPos++) {
                        if (drillMembers.items[itemPos].indexOf(memberItem) !== 0) {
                            items[items.length] = drillMembers.items[itemPos];
                        }
                    }
                    drillMembers.items = items;
                }
            }
            this.olapEngineModule.drilledSets[currentCell.actualText] = tupInfo.members[fieldPos];
            drillInfo.memberName = member;
            var drillItem = [];
            for (var _a = 0, clonedMembers_1 = clonedMembers; _a < clonedMembers_1.length; _a++) {
                var field = clonedMembers_1[_a];
                if (field.name === drillInfo.fieldName) {
                    drillItem.push(field);
                }
            }
            if (drillItem.length > 0) {
                if (drillItem[0].delimiter) {
                    member = member.replace(/~~/g, drillItem[0].delimiter);
                }
                var index = PivotUtil.inArray(member, drillItem[0].items);
                if (index === -1) {
                    drillItem[0].items.push(member);
                }
                if (isAttributeHierarchy) {
                    var i = 0;
                    while (i < drillItem[0].items.length) {
                        if (drillItem[0].items[i] === member) {
                            drillItem[0].items.splice(i, 1);
                        }
                        else {
                            ++i;
                        }
                    }
                }
            }
            else if (!isAttributeHierarchy) {
                var drilledMember = { name: drillInfo.fieldName, items: [member], delimiter: '~~' };
                if (!clonedMembers) {
                    clonedMembers = [drilledMember];
                }
                else {
                    clonedMembers.push(drilledMember);
                }
            }
            drillArgs.drillInfo.memberName = member;
            this.setProperties({ dataSourceSettings: { drilledMembers: clonedMembers } }, true);
            pivot.trigger(events.drill, drillArgs, function (observedArgs) {
                if (!observedArgs.cancel) {
                    _this_1.olapEngineModule.updateDrilledInfo(_this_1.dataSourceSettings);
                    _this_1.allowServerDataBinding = false;
                    _this_1.setProperties({ pivotValues: _this_1.olapEngineModule.pivotValues }, true);
                    /* tslint:disable-next-line:no-any */
                    delete _this_1.bulkChanges.pivotValues;
                    _this_1.allowServerDataBinding = true;
                    _this_1.renderPivotGrid();
                }
                else {
                    _this_1.hideWaitingPopup();
                    _this_1.setProperties({ dataSourceSettings: { drilledMembers: clonedDrillMembers } }, true);
                }
            });
        }
        else {
            delete this.olapEngineModule.drilledSets[currentCell.actualText];
            var drillSets = this.olapEngineModule.getDrilledSets(drillInfo.memberName, currentCell, fieldPos, axis);
            var keys = Object.keys(drillSets);
            var fields = tupInfo.drillInfo.map(function (item) { return item.uName; });
            var member = '';
            for (var pos = 0; pos <= fieldPos; pos++) {
                var field = fields[pos];
                var members = field.split('~~');
                member = member + (member !== '' ? '~~' : '') + members[members.length - 1];
            }
            for (var _b = 0, keys_2 = keys; _b < keys_2.length; _b++) {
                var key = keys_2[_b];
                var drillSet = drillSets[key];
                var drillItemCollection = [];
                for (var i = 0, cnt = clonedMembers.length; i < cnt; i++) {
                    var drillItem = clonedMembers[i];
                    var member_1 = drillSet;
                    if (drillItem.name === drillInfo.fieldName) {
                        drillItemCollection.push(drillItem);
                    }
                    if (drillItem.delimiter) {
                        member_1 = drillSet.replace(/~~/g, drillItem.delimiter);
                    }
                    if (!isAttributeHierarchy) {
                        var items = [];
                        for (var itemPos = 0; itemPos < drillItem.items.length; itemPos++) {
                            if (drillItem.items[itemPos].indexOf(member_1) !== 0) {
                                items[items.length] = drillItem.items[itemPos];
                            }
                        }
                        drillItem.items = items;
                    }
                }
                if (isAttributeHierarchy) {
                    if (drillItemCollection.length > 0) {
                        if (drillItemCollection[0].delimiter) {
                            member = member.replace(/~~/g, drillItemCollection[0].delimiter);
                        }
                        var index = PivotUtil.inArray(member, drillItemCollection[0].items);
                        if (index === -1) {
                            drillItemCollection[0].items.push(member);
                        }
                    }
                    else {
                        var drilledMember = { name: drillInfo.fieldName, items: [member], delimiter: '~~' };
                        if (!clonedMembers) {
                            clonedMembers = [drilledMember];
                        }
                        else {
                            clonedMembers.push(drilledMember);
                        }
                    }
                }
            }
            var drilledMembers_1 = [];
            for (var _c = 0, clonedMembers_2 = clonedMembers; _c < clonedMembers_2.length; _c++) {
                var fields_1 = clonedMembers_2[_c];
                if (fields_1.items.length > 0) {
                    drilledMembers_1.push(fields_1);
                }
            }
            this.setProperties({ dataSourceSettings: { drilledMembers: clonedMembers } }, true);
            pivot.trigger(events.drill, drillArgs, function (observedArgs) {
                if (!observedArgs.cancel) {
                    _this_1.setProperties({ dataSourceSettings: { drilledMembers: drilledMembers_1 } }, true);
                    _this_1.olapEngineModule.updateDrilledInfo(_this_1.dataSourceSettings);
                    _this_1.allowServerDataBinding = false;
                    _this_1.setProperties({ pivotValues: _this_1.olapEngineModule.pivotValues }, true);
                    /* tslint:disable-next-line:no-any */
                    delete _this_1.bulkChanges.pivotValues;
                    _this_1.allowServerDataBinding = true;
                    _this_1.renderPivotGrid();
                }
                else {
                    _this_1.hideWaitingPopup();
                    _this_1.setProperties({ dataSourceSettings: { drilledMembers: clonedDrillMembers } }, true);
                }
            });
        }
    };
    /* tslint:enable */
    PivotView.prototype.onContentReady = function () {
        if (!isNullOrUndefined(this.savedDataSourceSettings)) {
            PivotUtil.updateDataSourceSettings(this, this.savedDataSourceSettings);
            this.savedDataSourceSettings = undefined;
        }
        if (this.currentView !== 'Table') {
            /* tslint:disable-next-line */
            if (this.cellTemplate && isBlazor()) {
                resetBlazorTemplate(this.element.id + '_cellTemplate', 'CellTemplate');
            }
        }
        this.isPopupClicked = false;
        if (this.showFieldList) {
            hideSpinner(this.pivotFieldListModule.fieldListSpinnerElement);
        }
        else if (this.fieldListSpinnerElement) {
            hideSpinner(this.fieldListSpinnerElement);
        }
        if (!this.isEmptyGrid) {
            if ((this.dataSourceSettings.mode === 'Server' && this.isServerWaitingPopup) || this.dataSourceSettings.mode === 'Local') {
                this.hideWaitingPopup();
            }
            this.trigger(events.dataBound);
        }
        else {
            this.isEmptyGrid = false;
            this.notEmpty = true;
        }
        if (this.grid) {
            var engine = this.dataType === 'pivot' ? this.engineModule : this.olapEngineModule;
            if (this.enableVirtualization && engine) {
                if (this.element.querySelector('.' + cls.MOVABLECONTENT_DIV) &&
                    !this.element.querySelector('.' + cls.MOVABLECONTENT_DIV).querySelector('.' + cls.VIRTUALTRACK_DIV)) {
                    this.virtualDiv = createElement('div', { className: cls.VIRTUALTRACK_DIV });
                    this.element.querySelector('.' + cls.MOVABLECONTENT_DIV).appendChild(this.virtualDiv);
                }
                if (this.element.querySelector('.' + cls.MOVABLEHEADER_DIV) &&
                    !this.element.querySelector('.' + cls.MOVABLEHEADER_DIV).querySelector('.' + cls.VIRTUALTRACK_DIV)) {
                    this.virtualHeaderDiv = createElement('div', { className: cls.VIRTUALTRACK_DIV });
                    this.element.querySelector('.' + cls.MOVABLEHEADER_DIV).appendChild(this.virtualHeaderDiv);
                }
                else {
                    this.virtualHeaderDiv =
                        this.element.querySelector('.' + cls.MOVABLEHEADER_DIV).querySelector('.' + cls.VIRTUALTRACK_DIV);
                }
                var movableTable = this.element.querySelector('.' + cls.MOVABLECONTENT_DIV).querySelector('.e-table');
                var vHeight = (this.gridSettings.rowHeight * engine.rowCount + 0.1 - movableTable.clientHeight);
                if (vHeight > this.scrollerBrowserLimit) {
                    this.verticalScrollScale = vHeight / this.scrollerBrowserLimit;
                    vHeight = this.scrollerBrowserLimit;
                }
                var vWidth = this.gridSettings.columnWidth * engine.columnCount;
                if (vWidth > this.scrollerBrowserLimit) {
                    this.horizontalScrollScale = vWidth / this.scrollerBrowserLimit;
                    vWidth = this.scrollerBrowserLimit;
                }
                setStyleAttribute(this.virtualDiv, {
                    height: (vHeight > 0.1 ? vHeight : 0.1) + 'px',
                    width: (vWidth > 0.1 ? vWidth : 0.1) + 'px'
                });
                setStyleAttribute(this.virtualHeaderDiv, {
                    height: 0, width: (vWidth > 0.1 ? vWidth : 0.1) + 'px'
                });
                var mCnt = this.element.querySelector('.' + cls.MOVABLECONTENT_DIV);
                var fCnt = this.element.querySelector('.' + cls.FROZENCONTENT_DIV);
                var mHdr = this.element.querySelector('.' + cls.MOVABLEHEADER_DIV);
                var verOffset = (mCnt.parentElement.scrollTop > this.scrollerBrowserLimit) ?
                    mCnt.querySelector('.' + cls.TABLE).style.transform.split(',')[1].trim() :
                    -(((mCnt.parentElement.scrollTop * this.verticalScrollScale) - this.scrollPosObject.verticalSection - mCnt.parentElement.scrollTop)) + 'px)';
                var horiOffset = (mCnt.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV).scrollLeft > this.scrollerBrowserLimit) ?
                    (mCnt.querySelector('.' + cls.TABLE).style.transform.split(',')[0].trim() + ',') :
                    'translate(' + -(((mCnt.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV).scrollLeft * this.horizontalScrollScale) -
                        this.scrollPosObject.horizontalSection - mCnt.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV).scrollLeft)) + 'px,';
                setStyleAttribute(fCnt.querySelector('.e-table'), {
                    transform: 'translate(' + 0 + 'px,' + verOffset
                });
                setStyleAttribute(mCnt.querySelector('.e-table'), {
                    transform: horiOffset + verOffset
                });
                setStyleAttribute(mHdr.querySelector('.e-table'), {
                    transform: horiOffset + 0 + 'px)'
                });
                this.grid.element.querySelector('.' + cls.MOVABLECHILD_DIV).style.width = vWidth + 'px';
                if (this.grid.height !== 'auto') {
                    this.grid.contentModule.setHeightToContent(this.virtualDiv.offsetHeight + movableTable.clientHeight);
                }
                else {
                    this.grid.contentModule.setHeightToContent(this.element.querySelector('.' + cls.FROZENCONTENT_DIV + ' .' + cls.TABLE).offsetHeight);
                }
            }
            if (this.currentView !== 'Chart') {
                this.grid.hideScroll();
            }
            if (this.showGroupingBar) {
                this.element.style.minWidth = '400px';
                this.grid.element.style.minWidth = '400px';
            }
            else {
                this.element.style.minWidth = '310px';
                this.grid.element.style.minWidth = '310px';
            }
        }
        this.unwireEvents();
        this.wireEvents();
        this.isChartLoaded = false;
        if (this.cellTemplate && isBlazor()) {
            var gridCells = Object.keys(this.gridCellCollection);
            if (gridCells.length > 0) {
                for (var _i = 0, gridCells_1 = gridCells; _i < gridCells_1.length; _i++) {
                    var cell = gridCells_1[_i];
                    /* tslint:disable-next-line */
                    var templateObject = {};
                    var tCell = this.gridCellCollection[cell];
                    var colIndex = Number(tCell.getAttribute('aria-colindex'));
                    var rowIndex = Number(tCell.getAttribute('index'));
                    var pivotCell = this.pivotValues[rowIndex][colIndex];
                    templateObject.axis = pivotCell.axis;
                    if (templateObject.axis === 'column' || templateObject.axis === 'row') {
                        templateObject.fieldName = pivotCell.valueSort.axis;
                        templateObject.formattedText = pivotCell.formattedText;
                    }
                    else {
                        templateObject.fieldName = pivotCell.actualText;
                        templateObject.formattedText = pivotCell.formattedText;
                        templateObject.value = pivotCell.value;
                    }
                    templateObject.rowHeaders = pivotCell.rowHeaders;
                    templateObject.columnHeaders = pivotCell.columnHeaders;
                    templateObject.rowIndex = pivotCell.rowIndex;
                    templateObject.columnIndex = pivotCell.colIndex;
                    templateObject.isGrandTotal = pivotCell.isGrandSum;
                    templateObject.isTotal = pivotCell.isSum;
                    templateObject.rowSpan = pivotCell.rowSpan;
                    templateObject.columnSpan = pivotCell.colSpan;
                    templateObject.isDrilled = pivotCell.isDrilled;
                    templateObject.hasChild = pivotCell.hasChild;
                    templateObject.valueSortInfo = pivotCell.valueSort;
                    /* tslint:disable-next-line */
                    var element = this.getCellTemplate()(templateObject, this, 'cellTemplate', this.element.id + '_cellTemplate');
                    if (element && element !== '' && element.length > 0) {
                        if (this.enableHtmlSanitizer) {
                            this.appendHtml(tCell, SanitizeHtmlHelper.sanitize(element[0].outerHTML));
                        }
                        else {
                            this.appendHtml(tCell, element[0].outerHTML);
                        }
                    }
                }
                updateBlazorTemplate(this.element.id + '_cellTemplate', 'CellTemplate', this);
            }
        }
    };
    PivotView.prototype.setToolTip = function (args) {
        var colIndex = Number(args.target.getAttribute('aria-colindex'));
        var rowIndex = Number(args.target.getAttribute('index'));
        var cell = (this.pivotValues && this.pivotValues[rowIndex] && this.pivotValues[rowIndex][colIndex]) ?
            this.pivotValues[rowIndex][colIndex] : undefined;
        this.tooltip.content = '';
        var aggregateType;
        var caption;
        var hasField = false;
        if (cell && this.dataType === 'olap') {
            if (this.olapEngineModule.fieldList[cell.actualText]) {
                var field = this.olapEngineModule.fieldList[cell.actualText];
                aggregateType = field.isCalculatedField ? field.type : field.aggregateType;
                caption = (this.olapEngineModule.dataFields[cell.actualText] &&
                    this.olapEngineModule.dataFields[cell.actualText].caption) ?
                    this.olapEngineModule.dataFields[cell.actualText].caption : field.caption;
                hasField = true;
            }
        }
        else {
            if (cell && this.engineModule.fieldList[cell.actualText]) {
                var field = this.engineModule.fieldList[cell.actualText];
                aggregateType = field.aggregateType;
                caption = field.caption;
                hasField = true;
            }
        }
        if (cell && hasField) {
            var rowHeaders = this.getRowText(rowIndex, 0);
            var columnHeaders = this.getColText(0, colIndex, rowIndex);
            var value = ((cell.formattedText === '0' || cell.formattedText === '') ? this.localeObj.getConstant('noValue') :
                cell.formattedText);
            if (this.tooltipTemplate && this.getTooltipTemplate() !== undefined) {
                var rowFields = this.getHeaderField(rowIndex, colIndex, 'row');
                var columnFields = this.getHeaderField(rowIndex, colIndex, 'column');
                var templateObject = {
                    rowHeaders: rowHeaders,
                    columnHeaders: columnHeaders,
                    aggregateType: aggregateType,
                    valueField: caption,
                    value: value,
                    rowFields: rowFields,
                    columnFields: columnFields,
                };
                /* tslint:disable-next-line:max-line-length */
                this.tooltip.content = this.getTooltipTemplate()(templateObject, this, 'tooltipTemplate', this.element.id + 'tooltipTemplate')[0].outerHTML;
            }
            else {
                this.tooltip.content = '<div class=' + cls.PIVOTTOOLTIP + '><p class=' + cls.TOOLTIP_HEADER + '>' +
                    this.localeObj.getConstant('row') + ':</p><p class=' + cls.TOOLTIP_CONTENT + '>' +
                    rowHeaders + '</p></br><p class=' + cls.TOOLTIP_HEADER + '>' + this.localeObj.getConstant('column') +
                    ':</p><p class=' + cls.TOOLTIP_CONTENT + '>' + columnHeaders + '</p></br>' +
                    (cell.actualText !== '' ? ('<p class=' + cls.TOOLTIP_HEADER + '>' + (this.dataType === 'olap' ? '' :
                        (this.localeObj.getConstant(aggregateType) + ' ' + this.localeObj.getConstant('of') + ' ')) +
                        caption + ':</p><p class=' + cls.TOOLTIP_CONTENT + '>' + value + '</p></div>') : '');
            }
        }
        else {
            args.cancel = true;
        }
    };
    /** @hidden */
    PivotView.prototype.getTooltipTemplate = function () {
        return this.tooltipTemplateFn;
    };
    /** @hidden */
    PivotView.prototype.getHeaderField = function (rowIndex, colIndex, axis) {
        var fields = '';
        var len;
        var engineModule = this.dataType === 'olap' ? this.olapEngineModule : this.engineModule;
        var delimiter = engineModule.valueSortSettings.headerDelimiter;
        if (axis === 'row') {
            len = this.pivotValues[rowIndex][0].valueSort.levelName.toString().split(delimiter).length;
            for (var i = 0; i < len && engineModule.rows.length > 0 && engineModule.rows[i]; i++) {
                fields += (i ? ' - ' : '') + ((engineModule.rows[i].caption) ? engineModule.rows[i].caption : engineModule.rows[i].name);
            }
        }
        else {
            /* tslint:disable:max-line-length */
            if (engineModule.columns.length > 0) {
                var pos = engineModule.values.length === 0 ? 0 : Number(Object.keys(engineModule.headerContent)[Object.keys(engineModule.headerContent).length - 1]);
                len = this.pivotValues[pos][colIndex].valueSort.levelName.toString().split(delimiter).length;
                len = engineModule.values.length > 1 ? len - 1 : len;
            }
            for (var j = 0; j < len && engineModule.columns.length > 0 && engineModule.columns[j]; j++) {
                fields += (j ? ' - ' : '') + ((engineModule.columns[j].caption) ? engineModule.columns[j].caption : engineModule.columns[j].name);
            }
            /* tslint:enable:max-line-length */
        }
        return fields;
    };
    PivotView.prototype.getRowText = function (rowIndex, colIndex) {
        var cell = this.pivotValues[rowIndex][colIndex];
        var level = cell.level;
        var rowText = cell.type === 'grand sum' ? this.localeObj.getConstant('grandTotal') : cell.formattedText;
        while (level > 0 || cell.index === undefined) {
            rowIndex--;
            cell = this.pivotValues[rowIndex][colIndex];
            if (cell.index !== undefined) {
                if (level > cell.level) {
                    rowText = rowText + ' - ' + cell.formattedText;
                    level = level - 1;
                }
            }
        }
        return rowText.split(' - ').reverse().join(' - ');
    };
    PivotView.prototype.getColText = function (rowIndex, colIndex, limit) {
        var cell = this.pivotValues[0][colIndex];
        var axis = cell.axis;
        var colText = cell.type === 'grand sum' ? this.localeObj.getConstant('grandTotal') : cell.formattedText;
        while (axis !== 'value' && limit > rowIndex) {
            rowIndex++;
            if (this.pivotValues[rowIndex]) {
                cell = this.pivotValues[rowIndex][colIndex];
                axis = cell.axis;
                if (cell.type !== 'sum' && cell.type !== 'grand sum' && axis !== 'value') {
                    colText = colText + ' - ' + cell.formattedText;
                }
            }
        }
        return colText;
    };
    PivotView.prototype.updateClass = function () {
        if (this.enableRtl) {
            addClass([this.element], cls.RTL);
        }
        else {
            removeClass([this.element], cls.RTL);
        }
        if (this.isAdaptive) {
            addClass([this.element], cls.DEVICE);
        }
        else {
            removeClass([this.element], cls.DEVICE);
        }
    };
    PivotView.prototype.mouseRclickHandler = function (e) {
        if (e.which === 3) {
            this.lastCellClicked = e.target;
        }
        else if (e.which === 0) {
            this.lastCellClicked = e.target;
        }
        this.lastCellClicked = e.target;
    };
    PivotView.prototype.mouseDownHandler = function (e) {
        if (e.which === 3) {
            this.lastCellClicked = e.target;
        }
        if (this.isCellBoxMultiSelection) {
            this.isMouseDown = true;
            this.isMouseUp = false;
            var parent_1 = this.parentAt(e.target, 'TH');
            this.clearSelection(parent_1, e, Number(parent_1.getAttribute('aria-colindex')), Number(parent_1.getAttribute('index')));
            this.lastSelectedElement = undefined;
        }
    };
    PivotView.prototype.mouseMoveHandler = function (e) {
        if (this.isCellBoxMultiSelection) {
            e.preventDefault();
            if (this.isMouseDown && e.target) {
                var ele = e.target;
                var parentElement = this.parentAt(ele, 'TH');
                if (this.lastSelectedElement && this.lastSelectedElement !== parentElement &&
                    parentElement.classList.contains(cls.SELECTED_BGCOLOR)) {
                    this.lastSelectedElement.classList.remove(cls.CELL_ACTIVE_BGCOLOR);
                    this.lastSelectedElement.classList.remove(cls.SELECTED_BGCOLOR);
                    this.lastSelectedElement = parentElement;
                }
                else {
                    this.lastSelectedElement = parentElement;
                    parentElement.classList.add(cls.CELL_ACTIVE_BGCOLOR);
                    parentElement.classList.add(cls.SELECTED_BGCOLOR);
                }
                this.renderModule.selected();
            }
        }
    };
    PivotView.prototype.mouseUpHandler = function (e) {
        if (this.isCellBoxMultiSelection) {
            this.isMouseDown = false;
            this.isMouseUp = true;
        }
    };
    PivotView.prototype.parentAt = function (target, tagName) {
        while (target.tagName !== tagName) {
            if (target.parentElement) {
                target = target.parentElement;
            }
            else {
                break;
            }
        }
        return target;
    };
    PivotView.prototype.mouseClickHandler = function (e) {
        if (e.which === 3) {
            this.lastCellClicked = e.target;
        }
        else if (e.which === 0) {
            this.lastCellClicked = e.target;
        }
        var target = e.target;
        if ((target.classList.contains('e-headercell') ||
            target.classList.contains('e-headercelldiv') ||
            target.classList.contains('e-rowsheader') ||
            target.classList.contains('e-rowcell') ||
            target.classList.contains('e-stackedheadercelldiv') ||
            target.classList.contains('e-headertext') ||
            target.classList.contains('e-ascending') ||
            target.classList.contains('e-descending')) && this.enableValueSorting && this.dataType === 'pivot') {
            var ele = null;
            if (target.classList.contains('e-headercell') || target.classList.contains('e-rowsheader')
                || target.classList.contains('e-rowcell')) {
                ele = target;
            }
            else if (target.classList.contains('e-stackedheadercelldiv') || target.classList.contains('e-headercelldiv') ||
                target.classList.contains('e-ascending') || target.classList.contains('e-descending')) {
                ele = target.parentElement;
            }
            else if (target.classList.contains('e-headertext')) {
                ele = target.parentElement.parentElement;
            }
            this.CellClicked(target, e);
            if ((ele.parentElement.parentElement.parentElement.parentElement.classList.contains('e-movableheader')
                && this.dataSourceSettings.valueAxis === 'column') || (ele.parentElement.classList.contains('e-row') &&
                this.dataSourceSettings.valueAxis === 'row') && (ele.classList.contains('e-rowsheader') ||
                ele.classList.contains('e-stot'))) {
                /* tslint:disable */
                var colIndex = Number(ele.getAttribute('aria-colindex'));
                var rowIndex = Number(ele.getAttribute('index'));
                if (this.dataSourceSettings.valueAxis === 'row' && (this.dataSourceSettings.values.length > 1 || this.dataSourceSettings.alwaysShowValueHeader)) {
                    rowIndex = this.pivotValues[rowIndex][colIndex].type === 'value' ? rowIndex : (rowIndex + 1);
                }
                else if (this.dataSourceSettings.valueAxis === 'column' && (this.dataSourceSettings.values.length > 1 || this.dataSourceSettings.alwaysShowValueHeader)) {
                    colIndex = (Number(ele.getAttribute('aria-colindex')) + Number(ele.getAttribute('aria-colspan')) - 1);
                    rowIndex = this.engineModule.headerContent.length - 1;
                }
                this.setProperties({
                    dataSourceSettings: {
                        valueSortSettings: {
                            columnIndex: (Number(ele.getAttribute('aria-colindex')) +
                                Number(ele.getAttribute('aria-colspan')) - 1),
                            sortOrder: this.dataSourceSettings.valueSortSettings.sortOrder === 'Descending' ? 'Ascending' : 'Descending',
                            headerText: this.pivotValues[rowIndex][colIndex].valueSort.levelName,
                            headerDelimiter: this.dataSourceSettings.valueSortSettings.headerDelimiter ?
                                this.dataSourceSettings.valueSortSettings.headerDelimiter : '.'
                        }
                    }
                }, true);
                /* tslint:enable */
                this.showWaitingPopup();
                var pivot_2 = this;
                //setTimeout(() => {
                pivot_2.engineModule.enableValueSorting = true;
                if (pivot_2.enableVirtualization) {
                    if (pivot_2.dataSourceSettings.enableSorting) {
                        for (var _i = 0, _a = Object.keys(pivot_2.engineModule.fieldList); _i < _a.length; _i++) {
                            var key = _a[_i];
                            pivot_2.engineModule.fieldList[key].sort = 'Ascending';
                        }
                        pivot_2.setProperties({ dataSourceSettings: { sortSettings: [] } }, true);
                    }
                    if (isBlazor()) {
                        /* tslint:disable */
                        pivot_2.interopAdaptor.invokeMethodAsync('PivotInteropMethod', 'applyValueSorting', { 'valueSortSettings': pivot_2.dataSourceSettings.valueSortSettings.properties }).then(function (data) {
                            pivot_2.updateBlazorData(data, pivot_2);
                            pivot_2.allowServerDataBinding = false;
                            pivot_2.setProperties({ pivotValues: pivot_2.engineModule.pivotValues }, true);
                            delete pivot_2.bulkChanges.pivotValues;
                            pivot_2.allowServerDataBinding = true;
                            pivot_2.renderPivotGrid();
                        });
                        /* tslint:enable */
                    }
                    else if (pivot_2.dataSourceSettings.mode === 'Server') {
                        pivot_2.getEngine('onValueSort', null, null, null, null, null, null);
                    }
                    else {
                        pivot_2.engineModule.rMembers = pivot_2.engineModule.headerCollection.rowHeaders;
                        pivot_2.engineModule.cMembers = pivot_2.engineModule.headerCollection.columnHeaders;
                        pivot_2.engineModule.applyValueSorting();
                        pivot_2.engineModule.updateEngine();
                    }
                }
                else if (pivot_2.dataSourceSettings.mode === 'Server') {
                    pivot_2.getEngine('onValueSort', null, null, null, null, null, null);
                }
                else {
                    pivot_2.engineModule.generateGridData(pivot_2.dataSourceSettings);
                }
                if (!(isBlazor() && pivot_2.enableVirtualization)) {
                    pivot_2.allowServerDataBinding = false;
                    pivot_2.setProperties({ pivotValues: pivot_2.engineModule.pivotValues }, true);
                    /* tslint:disable-next-line:no-any */
                    delete pivot_2.bulkChanges.pivotValues;
                    pivot_2.allowServerDataBinding = true;
                    pivot_2.renderPivotGrid();
                }
            }
        }
        else if (target.classList.contains(cls.COLLAPSE) || target.classList.contains(cls.EXPAND)) {
            this.onDrill(target);
        }
        else {
            this.CellClicked(target, e);
            return;
        }
    };
    PivotView.prototype.framePivotColumns = function (gridcolumns) {
        for (var _i = 0, gridcolumns_1 = gridcolumns; _i < gridcolumns_1.length; _i++) {
            var column = gridcolumns_1[_i];
            if (column.columns && column.columns.length > 0) {
                this.framePivotColumns(column.columns);
            }
            else {
                /* tslint:disable */
                var levelName = column.field === '0.formattedText' ? '' :
                    (column.customAttributes ? column.customAttributes.cell.valueSort.levelName : '');
                var width = this.renderModule.setSavedWidth(column.field === '0.formattedText' ? column.field :
                    levelName, Number(column.width === 'auto' ? column.minWidth : column.width));
                this.pivotColumns.push({
                    allowReordering: column.allowReordering,
                    allowResizing: column.allowResizing,
                    headerText: levelName,
                    width: width
                });
                this.totColWidth = this.totColWidth + Number(width);
                /* tslint:enable */
            }
        }
    };
    /** @hidden */
    PivotView.prototype.setGridColumns = function (gridcolumns) {
        if (!isNullOrUndefined(this.totColWidth) && this.totColWidth > 0) {
            for (var _i = 0, gridcolumns_2 = gridcolumns; _i < gridcolumns_2.length; _i++) {
                var column = gridcolumns_2[_i];
                if (column.columns && column.columns.length > 0) {
                    this.setGridColumns(column.columns);
                }
                else {
                    /* tslint:disable */
                    var levelName = column.field === '0.formattedText' ? '' :
                        (column.customAttributes ? column.customAttributes.cell.valueSort.levelName : '');
                    column.allowReordering = this.pivotColumns[this.posCount].allowReordering;
                    column.allowResizing = this.pivotColumns[this.posCount].allowResizing;
                    var calcWidth = this.renderModule.setSavedWidth(column.field === '0.formattedText' ? column.field :
                        levelName, Number(this.pivotColumns[this.posCount].width));
                    if (column.width !== 'auto') {
                        column.width = calcWidth;
                    }
                    else {
                        column.minWidth = calcWidth;
                    }
                    this.posCount++;
                    if (column.allowReordering) {
                        this.gridSettings.allowReordering = true;
                    }
                    if (column.allowResizing) {
                        this.gridSettings.allowResizing = true;
                    }
                }
            }
            if (this.gridSettings.allowReordering) {
                Grid.Inject(Reorder);
            }
            if (this.gridSettings.allowResizing) {
                Grid.Inject(Resize);
            }
            /* tslint:enable */
        }
    };
    /** @hidden */
    PivotView.prototype.fillGridColumns = function (gridcolumns) {
        for (var _i = 0, gridcolumns_3 = gridcolumns; _i < gridcolumns_3.length; _i++) {
            var column = gridcolumns_3[_i];
            column.allowReordering = this.gridSettings.allowReordering;
            column.allowResizing = this.gridSettings.allowResizing;
            this.posCount++;
            if (column.columns && column.columns.length > 0) {
                this.fillGridColumns(column.columns);
            }
        }
    };
    /** @hidden */
    PivotView.prototype.triggerColumnRenderEvent = function (gridcolumns) {
        this.pivotColumns = [];
        this.totColWidth = 0;
        this.framePivotColumns(gridcolumns);
        var firstColWidth = this.pivotColumns[0].width;
        var eventArgs = {
            columns: this.pivotColumns,
            dataSourceSettings: this.dataSourceSettings
        };
        this.trigger(events.beforeColumnsRender, eventArgs);
        if (firstColWidth !== this.pivotColumns[0].width) {
            this.firstColWidth = this.pivotColumns[0].width;
            this.renderModule.resColWidth = parseInt(this.firstColWidth.toString());
            // TODO: To be considered on compact layout implementation
            // let colWidth: number = this.renderModule.calculateColWidth(this.pivotColumns ? this.pivotColumns.length : 0);
            // for (let i: number = 1; i < this.pivotColumns.length; i++) {
            //     this.pivotColumns[i].width = colWidth;
            // }
        }
        this.posCount = 0;
        this.setGridColumns(gridcolumns);
    };
    /** @hidden */
    PivotView.prototype.setCommonColumnsWidth = function (columns, width) {
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var column = columns_1[_i];
            if (column.field !== '0.formattedText') {
                if (column.columns) {
                    this.setCommonColumnsWidth(column.columns, width);
                }
                else {
                    if (column.width !== 'auto') {
                        column.width = width;
                    }
                    else {
                        column.minWidth = width;
                    }
                }
            }
            else {
                column.width = !this.firstColWidth ? column.width : this.firstColWidth;
            }
        }
    };
    /** @hidden */
    PivotView.prototype.getHeightAsNumber = function () {
        var height;
        if (isNaN(this.height)) {
            if (this.height.toString().indexOf('%') > -1) {
                height = (parseFloat(this.height.toString()) / 100) * this.element.offsetHeight;
            }
            else if (this.height.toString().indexOf('px') > -1) {
                height = Number(this.height.toString().split('px')[0]);
            }
        }
        else {
            height = Number(this.height);
        }
        if (height < 300) {
            height = 300;
        }
        return height;
    };
    /** @hidden */
    PivotView.prototype.getWidthAsNumber = function () {
        var width;
        if (isNaN(this.width)) {
            if (this.width.toString().indexOf('%') > -1) {
                width = (parseFloat(this.width.toString()) / 100) * this.element.offsetWidth;
            }
            else if (this.width.toString().indexOf('px') > -1) {
                width = Number(this.width.toString().split('px')[0]);
            }
            if (isNaN(width)) {
                width = this.element.offsetWidth;
            }
        }
        else {
            width = Number(this.width);
        }
        if (width < 400) {
            width = 400;
        }
        return width;
    };
    /** @hidden */
    PivotView.prototype.getGridWidthAsNumber = function () {
        var width;
        var offsetWidth = this.element.offsetWidth ? this.element.offsetWidth :
            this.element.getBoundingClientRect().width;
        if (isNaN(this.grid.width)) {
            if (this.grid.width.toString().indexOf('%') > -1) {
                width = (parseFloat(this.grid.width.toString()) / 100) * offsetWidth;
            }
            else if (this.grid.width.toString().indexOf('px') > -1) {
                width = Number(this.grid.width.toString().split('px')[0]);
            }
            if (isNaN(width)) {
                width = offsetWidth;
            }
        }
        else {
            width = Number(this.grid.width);
        }
        return width;
    };
    /** @hidden */
    PivotView.prototype.onWindowResize = function () {
        /* tslint:disable */
        clearTimeout(this.timeOutObj);
        this.timeOutObj = setTimeout(this.layoutRefresh.bind(this), 500);
        /* tslint:enable */
    };
    /**
     * Refreshes the Pivot Table for blazor layoutRefresh is called for other base refresh is called
     */
    PivotView.prototype.refresh = function () {
        if (isBlazor()) {
            this.layoutRefresh();
        }
        else {
            this.pivotRefresh();
        }
    };
    /** @hidden */
    PivotView.prototype.layoutRefresh = function () {
        if (this.element && this.element.classList.contains('e-pivotview') &&
            (this.dataType === 'olap' ? (this.olapEngineModule && this.olapEngineModule.pivotValues) :
                this.engineModule && this.engineModule.pivotValues)) {
            if (this.grid) {
                var colLength = (this.dataType === 'olap' && this.olapEngineModule.pivotValues.length > 0) ?
                    this.olapEngineModule.pivotValues[0].length : (this.dataSourceSettings.values.length > 0 &&
                    this.engineModule.pivotValues.length > 0 ? this.engineModule.pivotValues[0].length : 2);
                var colWidth = this.renderModule.resizeColWidth(colLength);
                this.grid.width = this.renderModule.calculateGridWidth();
                this.renderModule.calculateGridHeight(true);
                this.setCommonColumnsWidth(this.grid.columns, colWidth);
                this.posCount = 0;
                if (!this.showGroupingBar) {
                    this.setGridColumns(this.grid.columns);
                }
                if (this.currentView === 'Table') {
                    /* tslint:disable-next-line */
                    if (this.cellTemplate && isBlazor()) {
                        resetBlazorTemplate(this.element.id + '_cellTemplate', 'CellTemplate');
                    }
                }
                this.grid.refreshColumns();
                if (this.showGroupingBar && this.groupingBarModule && this.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
                    this.groupingBarModule.setGridRowWidth();
                }
            }
            if (this.showToolbar && this.toolbarModule && this.toolbarModule.toolbar) {
                this.toolbarModule.toolbar.width = this.grid ? (this.getGridWidthAsNumber() - 2) : (this.getWidthAsNumber() - 2);
            }
            if (this.chart && ((this.showToolbar && this.currentView === 'Chart') || !this.showToolbar)) {
                this.chart.width = (this.showToolbar && this.grid) ? this.getGridWidthAsNumber().toString() :
                    (this.displayOption.view === 'Both' && this.grid) ? this.getGridWidthAsNumber().toString() : this.getWidthAsNumber().toString();
                if (this.displayOption.view === 'Chart' && this.showGroupingBar && this.groupingBarModule &&
                    this.element.querySelector('.' + cls.CHART_GROUPING_BAR_CLASS)) {
                    this.groupingBarModule.refreshUI();
                }
            }
        }
    };
    PivotView.prototype.CellClicked = function (target, e) {
        var _this_1 = this;
        var ele = null;
        if (target.classList.contains('e-headercell') || target.classList.contains('e-rowcell')) {
            ele = target;
        }
        else if (target.classList.contains('e-stackedheadercelldiv') || target.classList.contains('e-cellvalue') ||
            target.classList.contains('e-headercelldiv')) {
            ele = target.parentElement;
        }
        else if (target.classList.contains('e-headertext')) {
            ele = target.parentElement.parentElement;
        }
        else if (target.classList.contains(cls.ROW_SELECT)) {
            if (target.classList.contains(cls.SPAN_CLICKED)) {
                this.isPopupClicked = false;
            }
            else {
                this.isPopupClicked = true;
            }
        }
        /* tslint:disable */
        if (ele && !isNullOrUndefined(this.pivotValues) && this.pivotValues.length > 0) {
            var colIndex_1 = Number(ele.getAttribute('aria-colindex'));
            var rowIndex_1 = Number(ele.getAttribute('index'));
            var colSpan_1 = Number(ele.getAttribute('aria-colspan'));
            // let selectArgs: PivotCellSelectedEventArgs = { isCellClick: true, currentCell: target };
            var selectArgs = {
                cancel: false,
                isCellClick: true,
                currentCell: ele,
                data: this.pivotValues[rowIndex_1][colIndex_1]
            };
            this.trigger(events.cellSelecting, selectArgs, function (observedArgs) {
                if (_this_1.gridSettings.allowSelection) {
                    if (_this_1.gridSettings.selectionSettings.mode === 'Both' ? !ele.classList.contains(cls.ROW_CELL_CLASS) :
                        _this_1.gridSettings.selectionSettings.mode !== 'Row') {
                        _this_1.clearSelection(ele, e, colIndex_1, rowIndex_1);
                        if (!observedArgs.cancel) {
                            _this_1.applyColumnSelection(e, ele, colIndex_1, colIndex_1 + (colSpan_1 > 0 ? (colSpan_1 - 1) : 0), rowIndex_1);
                        }
                    }
                    else {
                        _this_1.clearSelection(ele, e, colIndex_1, rowIndex_1);
                    }
                    if (_this_1.gridSettings.selectionSettings.mode !== 'Column' && !ele.classList.contains(cls.COLUMNSHEADER)) {
                        _this_1.rowDeselect(ele, e, rowIndex_1, _this_1.gridSettings.selectionSettings.mode, observedArgs);
                    }
                    if (_this_1.gridSettings.selectionSettings.mode !== 'Column' && !observedArgs.cancel) {
                        if (_this_1.gridSettings.selectionSettings.type === "Multiple" ? (!e.ctrlKey && !e.shiftKey) : true && _this_1.selectedRowIndex !== rowIndex_1) {
                            _this_1.selectedRowIndex = rowIndex_1;
                            _this_1.grid.selectionModule.selectRow(rowIndex_1 - _this_1.renderModule.rowStartPos);
                        }
                        else {
                            _this_1.selectedRowIndex = undefined;
                        }
                    }
                }
                if (_this_1.cellClick && observedArgs.isCellClick) {
                    _this_1.trigger(events.cellClick, {
                        currentCell: ele,
                        data: _this_1.pivotValues[rowIndex_1][colIndex_1],
                        nativeEvent: e
                    });
                }
                _this_1.getSelectedCellsPos();
            });
        }
    };
    PivotView.prototype.rowDeselect = function (ele, e, rowIndex, mode, observedArgs) {
        if (!e.shiftKey && !e.ctrlKey && this.gridSettings.selectionSettings.mode !== 'Both' || this.gridSettings.selectionSettings.type === 'Single') {
            if (!ele.classList.contains(cls.CELL_SELECTED_BGCOLOR) && !ele.classList.contains(cls.SELECTED_BGCOLOR) && !ele.classList.contains(cls.CELL_ACTIVE_BGCOLOR)) {
                if (!observedArgs.cancel) {
                    removeClass(this.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR), cls.CELL_SELECTED_BGCOLOR);
                    removeClass(this.element.querySelectorAll('.' + cls.SELECTED_BGCOLOR), cls.SELECTED_BGCOLOR);
                    removeClass(this.element.querySelectorAll('.' + cls.CELL_ACTIVE_BGCOLOR), cls.CELL_ACTIVE_BGCOLOR);
                }
                else {
                    this.setSavedSelectedCells();
                }
            }
            else {
                removeClass(this.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR), cls.CELL_SELECTED_BGCOLOR);
                removeClass(this.element.querySelectorAll('.' + cls.SELECTED_BGCOLOR), cls.SELECTED_BGCOLOR);
                removeClass(this.element.querySelectorAll('.' + cls.CELL_ACTIVE_BGCOLOR), cls.CELL_ACTIVE_BGCOLOR);
                if (!observedArgs.cancel) {
                    if ((mode === 'Cell')) {
                        addClass([ele], [cls.CELL_SELECTED_BGCOLOR]);
                    }
                    else if (mode === 'Row' || this.gridSettings.selectionSettings.type === 'Single') {
                        var query = '[index="' + rowIndex + '"]';
                        addClass(this.element.querySelectorAll(query), [cls.SELECTED_BGCOLOR, cls.CELL_ACTIVE_BGCOLOR]);
                        if (mode !== 'Row') {
                            ele.classList.add(cls.CELL_SELECTED_BGCOLOR);
                        }
                    }
                }
                else {
                    this.setSavedSelectedCells();
                }
            }
        }
        else if (((e.shiftKey || e.ctrlKey) || this.gridSettings.selectionSettings.mode == 'Both') && (observedArgs.cancel)) {
            removeClass(this.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR), cls.CELL_SELECTED_BGCOLOR);
            removeClass(this.element.querySelectorAll('.' + cls.SELECTED_BGCOLOR), cls.SELECTED_BGCOLOR);
            removeClass(this.element.querySelectorAll('.' + cls.CELL_ACTIVE_BGCOLOR), cls.CELL_ACTIVE_BGCOLOR);
            this.setSavedSelectedCells();
        }
    };
    /** @hidden */
    PivotView.prototype.clearSelection = function (ele, e, colIndex, rowIndex) {
        if ((!e.shiftKey && !e.ctrlKey) || this.gridSettings.selectionSettings.type === 'Single') {
            if (this.gridSettings.selectionSettings.mode === 'Cell') {
                if (ele.classList.contains(cls.COLUMNSHEADER)) {
                    removeClass(this.element.querySelectorAll(('.' + cls.ROW_CELL_CLASS + '.') + cls.CELL_SELECTED_BGCOLOR), cls.CELL_SELECTED_BGCOLOR);
                }
                else {
                    removeClass(this.element.querySelectorAll(('.' + cls.COLUMNSHEADER + '.') + cls.CELL_ACTIVE_BGCOLOR), [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR]);
                }
            }
            else if (this.gridSettings.selectionSettings.mode === 'Both') {
                if (ele.classList.contains(cls.ROW_CELL_CLASS)) {
                    for (var _i = 0, _a = [].slice.call(this.element.querySelectorAll('.' + cls.SELECTED_BGCOLOR + ', .' + cls.CELL_SELECTED_BGCOLOR)); _i < _a.length; _i++) {
                        var ele_1 = _a[_i];
                        // if (Number((ele as HTMLElement).getAttribute('index')) !== rowIndex) {
                        removeClass([ele_1], [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR, cls.CELL_SELECTED_BGCOLOR]);
                        // }
                    }
                }
                else {
                    removeClass(this.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR), cls.CELL_SELECTED_BGCOLOR);
                }
            }
        }
    };
    /** @hidden */
    PivotView.prototype.applyRowSelection = function (colIndex, rowIndex, e) {
        var pivotValue = this.engineModule.pivotValues[rowIndex][colIndex];
        if (!e.ctrlKey && !e.shiftKey && pivotValue && this.selectedRowIndex !== rowIndex) {
            this.selectedRowIndex = rowIndex;
            var parentLevel = pivotValue.level;
            var rCount = rowIndex;
            do {
                rCount++;
                pivotValue = this.engineModule.pivotValues[rCount][colIndex];
            } while (pivotValue && parentLevel < pivotValue.level);
            var _this = this;
            if (this.isAdaptive) {
                this.rowRangeSelection = {
                    enable: true,
                    startIndex: rowIndex - _this.renderModule.rowStartPos,
                    endIndex: rCount - (1 + _this.renderModule.rowStartPos)
                };
            }
            else {
                _this.grid.selectionModule.selectRowsByRange(rowIndex -
                    _this.renderModule.rowStartPos, rCount - (1 + _this.renderModule.rowStartPos));
            }
        }
        else {
            this.selectedRowIndex = undefined;
        }
    };
    /** @hidden */
    PivotView.prototype.applyColumnSelection = function (e, target, colStart, colEnd, rowStart) {
        if (!target.classList.contains(cls.ROWSHEADER) &&
            (this.gridSettings.selectionSettings.mode === 'Cell' ? target.classList.contains(cls.COLUMNSHEADER) : true)) {
            var isCtrl = e.ctrlKey;
            if (this.isAdaptive && this.gridSettings.selectionSettings.type === 'Multiple') {
                this.grid.selectionModule.showPopup(e);
                if (this.isPopupClicked) {
                    this.element.querySelector('.' + cls.ROW_SELECT).classList.add(cls.SPAN_CLICKED);
                    isCtrl = true;
                }
                else {
                    this.element.querySelector('.' + cls.ROW_SELECT).classList.remove(cls.SPAN_CLICKED);
                    isCtrl = false;
                }
            }
            var queryStringArray = [];
            var type = this.gridSettings.selectionSettings.type;
            var isToggle = target.classList.contains(cls.CELL_ACTIVE_BGCOLOR);
            var activeColumns = [];
            var actColPos = {};
            for (var cCnt = colStart; cCnt <= colEnd; cCnt++) {
                activeColumns.push(cCnt.toString());
            }
            if (!isCtrl || type === 'Single') {
                for (var _i = 0, _a = [].slice.call(this.element.querySelectorAll('.' + cls.CELL_ACTIVE_BGCOLOR)); _i < _a.length; _i++) {
                    var ele = _a[_i];
                    removeClass([ele], [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR]);
                    if (activeColumns.indexOf(ele.getAttribute('aria-colindex')) === -1) {
                        isToggle = false;
                    }
                    var colIndex = Number(ele.getAttribute('aria-colindex'));
                    actColPos[colIndex] = colIndex;
                }
                activeColumns = Object.keys(actColPos).length > 0 ? Object.keys(actColPos).sort(function (a, b) {
                    return a - b;
                }) : activeColumns;
            }
            else {
                isToggle = false;
            }
            if (type === 'Multiple' && e.shiftKey) {
                this.shiftLockedPos = this.shiftLockedPos.length === 0 ? activeColumns : this.shiftLockedPos;
                if (Number(this.shiftLockedPos[0]) <= colStart) {
                    colStart = Number(this.shiftLockedPos[0]);
                }
                else {
                    colEnd = colEnd < Number(this.shiftLockedPos[this.shiftLockedPos.length - 1]) ?
                        Number(this.shiftLockedPos[this.shiftLockedPos.length - 1]) : colEnd;
                }
            }
            else {
                this.shiftLockedPos = [];
            }
            var rowSelectedList = [];
            if (e.ctrlKey && this.gridSettings.selectionSettings.mode === 'Both' && type === 'Multiple' && !target.classList.contains(cls.ROWSHEADER)) {
                for (var _b = 0, _c = [].slice.call(this.element.querySelectorAll('.' + cls.ROWSHEADER + '.' + cls.CELL_SELECTED_BGCOLOR)); _b < _c.length; _b++) {
                    var ele = _c[_b];
                    rowSelectedList.push(ele.getAttribute('index'));
                }
            }
            var count = colStart;
            while (count <= colEnd) {
                queryStringArray.push('[aria-colindex="' + count + '"]' + (this.gridSettings.selectionSettings.mode === 'Cell' ?
                    '[index="' + rowStart + '"]' : "") + '');
                count++;
            }
            if (!isToggle) {
                rowStart = target.classList.contains('e-headercell') ? rowStart : (this.renderModule.rowStartPos - 1);
                var isTargetSelected = target.classList.contains(cls.CELL_ACTIVE_BGCOLOR);
                for (var _d = 0, _e = [].slice.call(this.element.querySelectorAll(queryStringArray.toString())); _d < _e.length; _d++) {
                    var ele = _e[_d];
                    if (Number(ele.getAttribute('index')) >= rowStart) {
                        if (isTargetSelected && isCtrl && (rowSelectedList.indexOf(ele.getAttribute('index')) === -1)) {
                            removeClass([ele], [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR]);
                        }
                        else {
                            addClass([ele], [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR]);
                        }
                    }
                }
            }
            this.renderModule.selected();
        }
    };
    PivotView.prototype.getSelectedCellsPos = function () {
        var control = this;
        control.savedSelectedCellsPos = [];
        control.cellSelectionPos = [];
        for (var _i = 0, _a = [].slice.call(this.element.querySelectorAll('.' + cls.SELECTED_BGCOLOR)); _i < _a.length; _i++) {
            var ele = _a[_i];
            control.savedSelectedCellsPos.push({ rowIndex: ele.getAttribute('index'), colIndex: ele.getAttribute('aria-colindex') });
        }
        for (var _b = 0, _c = [].slice.call(this.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR)); _b < _c.length; _b++) {
            var ele = _c[_b];
            control.cellSelectionPos.push({ rowIndex: ele.getAttribute('index'), colIndex: ele.getAttribute('aria-colindex') });
        }
    };
    PivotView.prototype.setSavedSelectedCells = function () {
        var control = this;
        for (var _i = 0, _a = [].slice.call(this.savedSelectedCellsPos); _i < _a.length; _i++) {
            var item = _a[_i];
            var query = '[aria-colindex="' + item.colIndex + '"][index="' + item.rowIndex + '"]';
            addClass([control.element.querySelector(query)], [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR]);
        }
        for (var _b = 0, _c = [].slice.call(this.cellSelectionPos); _b < _c.length; _b++) {
            var item = _c[_b];
            var query = '[aria-colindex="' + item.colIndex + '"][index="' + item.rowIndex + '"]';
            addClass([control.element.querySelector(query)], [cls.CELL_SELECTED_BGCOLOR]);
        }
    };
    /* tslint:enable */
    PivotView.prototype.renderEmptyGrid = function () {
        var _this_1 = this;
        this.isEmptyGrid = true;
        this.notEmpty = false;
        this.renderModule = new Render(this);
        if (this.grid && this.grid.element && this.element.querySelector('.e-grid')) {
            /* tslint:disable */
            this.notEmpty = true;
            this.grid.setProperties({
                columns: this.renderModule.frameEmptyColumns(),
                dataSource: this.renderModule.frameEmptyData()
            }, true);
            /* tslint:enable */
            this.grid.notify('datasource-modified', {});
            this.grid.refreshColumns();
        }
        else {
            if (this.element.querySelector('.' + cls.GRID_CLASS)) {
                remove(this.element.querySelector('.' + cls.GRID_CLASS));
            }
            this.renderModule.bindGrid(this, true);
            /* tslint:disable:no-empty */
            this.grid.showSpinner = function () { };
            this.grid.hideSpinner = function () { };
            /* tslint:enable:no-empty */
            this.element.appendChild(createElement('div', { id: this.element.id + '_grid' }));
            this.grid.isStringTemplate = true;
            this.grid.appendTo('#' + this.element.id + '_grid');
            /* tslint:disable-next-line:no-any */
            this.grid.on('refresh-frozen-height', function () {
                if (!_this_1.enableVirtualization) {
                    _this_1.grid.contentModule.setHeightToContent(_this_1.grid.contentModule.getTable().offsetHeight);
                }
            });
            this.grid.off('data-ready', this.grid.dataReady);
            this.grid.on('data-ready', function () {
                _this_1.grid.scrollModule.setWidth();
                _this_1.grid.scrollModule.setHeight();
            });
        }
    };
    /* tslint:disable */
    PivotView.prototype.initEngine = function () {
        var _this_1 = this;
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
        this.trigger(events.enginePopulating, args, function (observedArgs) {
            PivotUtil.updateDataSourceSettings(_this_1, observedArgs.dataSourceSettings);
            _this_1.updatePageSettings(false);
            var customProperties = {
                mode: '',
                savedFieldList: undefined,
                pageSettings: _this_1.pageSettings,
                enableValueSorting: _this_1.enableValueSorting,
                isDrillThrough: (_this_1.allowDrillThrough || _this_1.editSettings.allowEditing),
                localeObj: _this_1.localeObj,
                fieldsType: _this_1.fieldsType
            };
            if (_this_1.dataType === 'pivot') {
                if (_this_1.dataSourceSettings.groupSettings && _this_1.dataSourceSettings.groupSettings.length > 0) {
                    var dataSet = _this_1.engineModule.data;
                    _this_1.clonedDataSet = (_this_1.clonedDataSet ? _this_1.clonedDataSet : PivotUtil.getClonedData(dataSet));
                    if (isBlazor()) {
                        _this_1.clonedReport = _this_1.clonedReport ? _this_1.clonedReport : extend({}, _this_1.dataSourceSettings, null, true);
                    }
                    else {
                        _this_1.setProperties({ dataSourceSettings: { dataSource: [] } }, true);
                        _this_1.clonedReport = _this_1.clonedReport ? _this_1.clonedReport : extend({}, _this_1.dataSourceSettings, null, true);
                        _this_1.setProperties({ dataSourceSettings: { dataSource: dataSet } }, true);
                    }
                }
                if (isBlazor() && _this_1.enableVirtualization) {
                    var pivot_3 = _this_1;
                    var sfBlazor = 'sfBlazor';
                    var customArgs = window[sfBlazor].copyWithoutCircularReferences([customProperties], customProperties);
                    var datasourceSettings = window[sfBlazor].copyWithoutCircularReferences([pivot_3.dataSourceSettings], pivot_3.dataSourceSettings);
                    pivot_3.interopAdaptor.invokeMethodAsync('PivotInteropMethod', 'renderEngine', { 'dataSourceSettings': datasourceSettings, 'customProperties': customArgs }).then(function (data) {
                        if (data === 0) {
                            _this_1.pivotCommon.errorDialog.createErrorDialog(_this_1.localeObj.getConstant('error'), (pivot_3.dataSourceSettings.type === 'CSV' ?
                                _this_1.localeObj.getConstant('invalidCSV') : _this_1.localeObj.getConstant('invalidJSON')));
                            return;
                        }
                        else {
                            pivot_3.updateBlazorData(data, pivot_3);
                            PivotUtil.setPivotProperties(pivot_3, { pivotValues: pivot_3.engineModule.pivotValues });
                            pivot_3.enginePopulatedEventMethod('initEngine', pivot_3);
                        }
                    });
                }
                else {
                    if (_this_1.dataSourceSettings.mode !== 'Server') {
                        _this_1.engineModule.renderEngine(_this_1.dataSourceSettings, customProperties, _this_1.getValueCellInfo.bind(_this_1));
                    }
                    _this_1.allowServerDataBinding = false;
                    _this_1.setProperties({ pivotValues: _this_1.engineModule.pivotValues }, true);
                    /* tslint:disable-next-line:no-any */
                    delete _this_1.bulkChanges.pivotValues;
                    _this_1.allowServerDataBinding = true;
                    _this_1.enginePopulatedEventMethod('initEngine');
                }
            }
            else if (_this_1.dataSourceSettings.providerType === 'SSAS' && _this_1.dataType === 'olap') {
                customProperties.savedFieldList = _this_1.olapEngineModule.fieldList;
                customProperties.savedFieldListData = _this_1.olapEngineModule.fieldListData;
                _this_1.olapEngineModule.renderEngine(_this_1.dataSourceSettings, customProperties);
                _this_1.allowServerDataBinding = false;
                _this_1.setProperties({ pivotValues: _this_1.olapEngineModule.pivotValues }, true);
                /* tslint:disable-next-line:no-any */
                delete _this_1.bulkChanges.pivotValues;
                _this_1.allowServerDataBinding = true;
                _this_1.enginePopulatedEventMethod('initEngine');
            }
        });
    };
    PivotView.prototype.enginePopulatedEventMethod = function (action, control) {
        var _this_1 = this;
        if (action === 'initEngine') {
            var this$_1 = control ? control : this;
            this.trigger(events.enginePopulated, { pivotValues: this.pivotValues }, function (observedArgs) {
                if (this$_1.dataType === 'olap') {
                    this$_1.olapEngineModule.pivotValues = isBlazor() ? _this_1.olapEngineModule.pivotValues : observedArgs.pivotValues;
                    this$_1.pivotValues = this$_1.olapEngineModule.pivotValues;
                }
                else {
                    this$_1.engineModule.pivotValues = isBlazor() ? _this_1.engineModule.pivotValues : observedArgs.pivotValues;
                    this$_1.pivotValues = this$_1.engineModule.pivotValues;
                }
                this$_1.notify(events.dataReady, {});
                this$_1.notEmpty = true;
            });
        }
        else {
            var pivot_4 = control ? control : this;
            var eventArgs = {
                dataSourceSettings: pivot_4.dataSourceSettings,
                pivotValues: isBlazor() ? pivot_4.dataType === 'olap' ? pivot_4.olapEngineModule.pivotValues :
                    pivot_4.engineModule.pivotValues : pivot_4.pivotValues
            };
            pivot_4.trigger(events.enginePopulated, eventArgs, function (observedArgs) {
                var dataSource = pivot_4.dataSourceSettings.dataSource;
                if (isBlazor() && observedArgs.dataSourceSettings.dataSource instanceof Object) {
                    observedArgs.dataSourceSettings.dataSource = dataSource;
                }
                pivot_4.dataSourceSettings = observedArgs.dataSourceSettings;
                if (pivot_4.dataType === 'olap') {
                    pivot_4.olapEngineModule.pivotValues = isBlazor() ? pivot_4.olapEngineModule.pivotValues : observedArgs.pivotValues;
                    pivot_4.allowServerDataBinding = false;
                    pivot_4.setProperties({ pivotValues: pivot_4.olapEngineModule.pivotValues }, true);
                    /* tslint:disable-next-line:no-any */
                    delete pivot_4.bulkChanges.pivotValues;
                    pivot_4.allowServerDataBinding = true;
                }
                else {
                    pivot_4.engineModule.pivotValues = isBlazor() ? pivot_4.engineModule.pivotValues : observedArgs.pivotValues;
                    pivot_4.allowServerDataBinding = false;
                    pivot_4.setProperties({ pivotValues: pivot_4.engineModule.pivotValues }, true);
                    /* tslint:disable-next-line:no-any */
                    delete pivot_4.bulkChanges.pivotValues;
                    pivot_4.allowServerDataBinding = true;
                }
                pivot_4.pivotCommon.engineModule = pivot_4.dataType === 'olap' ? pivot_4.olapEngineModule : pivot_4.engineModule;
                pivot_4.pivotCommon.dataSourceSettings = pivot_4.dataSourceSettings;
                pivot_4.renderPivotGrid();
            });
        }
    };
    /** @hidden */
    PivotView.prototype.updateBlazorData = function (data, control) {
        control.allowServerDataBinding = false;
        var pivVal;
        var pivotFL;
        var pivotFields;
        var valueSort;
        var blazPivot = control;
        var valContent = [];
        var headContent = [];
        pivotFL = JSON.parse(data["fieldList"]);
        pivVal = JSON.parse(data["pivotValue"]);
        pivotFields = JSON.parse(data["fields"]);
        valueSort = JSON.parse(data["valueSortSettings"]);
        var len = pivVal.length;
        var pvalues = JSON.parse(pivVal[0]);
        var pvalLen = pvalues.length;
        var blazPivotValues = new Array(len);
        for (i = 0; i < len; i++) {
            blazPivotValues[i] = new Array(pvalLen);
        }
        for (var i = 0; i < len; i++) {
            if (pivVal[i] != null) {
                var values = JSON.parse(pivVal[i]);
                var valLen = values.length;
                for (var j = 0; j < valLen; j++) {
                    blazPivotValues[i][j] = values[j];
                }
            }
            else {
                blazPivotValues[i] = undefined;
                //headContent[i] = undefined;
            }
        }
        var pivotValues = blazPivotValues;
        var rowPos;
        for (var rCnt = 0; rCnt < pivotValues.length; rCnt++) {
            if (pivotValues[rCnt] && pivotValues[rCnt][0] && pivotValues[rCnt][0].axis === 'row') {
                rowPos = rCnt;
                break;
            }
        }
        blazPivot.pivotValues = blazPivotValues;
        valContent = PivotUtil.frameContent(blazPivotValues, 'value', rowPos, blazPivot);
        headContent = PivotUtil.frameContent(blazPivotValues, 'header', rowPos, blazPivot);
        this.engineModule.pivotValues = blazPivotValues;
        this.engineModule.fieldList = pivotFL;
        this.engineModule.fields = pivotFields;
        this.engineModule.valueSortSettings = valueSort;
        this.engineModule.valueContent = valContent;
        this.engineModule.headerContent = headContent;
        this.engineModule.isEngineUpdated = JSON.parse(data["isEngineUpdated"]);
        this.engineModule.isEmptyData = JSON.parse(data["isEmptyData"]);
        this.engineModule.rowCount = JSON.parse(data["rowCount"]);
        this.engineModule.columnCount = JSON.parse(data["columnCount"]);
        this.engineModule.rowStartPos = JSON.parse(data["rowStartPos"]);
        this.engineModule.colStartPos = JSON.parse(data["colStartPos"]);
        this.engineModule.rowFirstLvl = JSON.parse(data["rowFirstLvl"]);
        this.engineModule.colFirstLvl = JSON.parse(data["colFirstLvl"]);
        control.allowServerDataBinding = true;
    };
    /* tslint:enable */
    PivotView.prototype.generateData = function () {
        if (this.displayOption.view !== 'Chart') {
            this.renderEmptyGrid();
        }
        this.showWaitingPopup();
        clearTimeout(this.timeOutObj);
        this.timeOutObj = setTimeout(this.refreshData.bind(this), 100);
    };
    /** @hidden */
    PivotView.prototype.refreshData = function () {
        var pivot = this;
        if (!pivot.isStaticRefresh) {
            if (isBlazor()) {
                if (pivot.dataType === 'olap') {
                    if (pivot.dataSourceSettings.dataSource instanceof DataManager) {
                        pivot.allowServerDataBinding = false;
                        pivot.setProperties({
                            dataSourceSettings: {
                                dataSource: undefined
                            }
                        }, true);
                        pivot.allowServerDataBinding = true;
                    }
                }
            }
            if (pivot.dataSourceSettings && (pivot.dataSourceSettings.dataSource || pivot.dataSourceSettings.url)) {
                if (pivot.dataSourceSettings.dataSource instanceof DataManager) {
                    if (isBlazor() && pivot.enableVirtualization) {
                        if (!pivot.element.querySelector('.e-spinner-pane')) {
                            this.showWaitingPopup();
                        }
                        pivot.initEngine();
                    }
                    else {
                        if (pivot.dataType === 'pivot' && pivot.remoteData.length > 0) {
                            if (!this.element.querySelector('.e-spinner-pane')) {
                                this.showWaitingPopup();
                            }
                            this.engineModule.data = pivot.remoteData;
                            this.initEngine();
                        }
                        else {
                            setTimeout(pivot.getData.bind(pivot), 100);
                        }
                    }
                }
                else if ((this.dataSourceSettings.url !== '' && this.dataType === 'olap') ||
                    (pivot.dataSourceSettings.dataSource && pivot.dataSourceSettings.dataSource.length > 0 || this.engineModule.data.length > 0)) {
                    if (pivot.dataType === 'pivot') {
                        this.hideWaitingPopup();
                        pivot.engineModule.data = pivot.dataSourceSettings.dataSource;
                    }
                    pivot.initEngine();
                }
                else {
                    if (this.dataSourceSettings.mode === 'Server') {
                        this.getEngine("onRefresh");
                    }
                    this.hideWaitingPopup();
                }
            }
            else if (isBlazor() && pivot.dataType === 'pivot' &&
                this.engineModule.data && this.engineModule.data.length > 0) {
                this.initEngine();
            }
            else {
                this.hideWaitingPopup();
            }
        }
        else {
            pivot.isStaticRefresh = false;
        }
    };
    PivotView.prototype.getValueCellInfo = function (aggregateObj) {
        var args = aggregateObj;
        this.trigger(events.aggregateCellInfo, args);
        return args;
    };
    /**
     * De-Register the internal events.
     * @returns void
     * @hidden
     */
    PivotView.prototype.bindTriggerEvents = function (args) {
        this.trigger(getObject('name', args), args);
    };
    PivotView.prototype.getData = function () {
        if (isBlazor()) {
            this.dataSourceSettings.dataSource.
                executeQuery(new Query().requiresCount()).then(this.executeQuery.bind(this));
        }
        else {
            this.dataSourceSettings.dataSource.executeQuery(new Query()).then(this.executeQuery.bind(this));
        }
    };
    PivotView.prototype.executeQuery = function (e) {
        if (!this.element.querySelector('.e-spinner-pane')) {
            this.showWaitingPopup();
        }
        var pivot = this;
        //setTimeout(() => {
        pivot.engineModule.data = e.result;
        if (!isNullOrUndefined(pivot.engineModule.data) && pivot.engineModule.data.length > 0) {
            pivot.initEngine();
        }
        else {
            this.hideWaitingPopup();
        }
        //});
    };
    /** @hidden */
    PivotView.prototype.applyFormatting = function (pivotValues) {
        if (pivotValues) {
            var colIndex = [];
            for (var len = pivotValues.length, i = 0; i < len; i++) {
                if (pivotValues[i] !== undefined && pivotValues[i][0] === undefined) {
                    colIndex.push(i);
                }
            }
            for (var i = 0; i < pivotValues.length; i++) {
                for (var j = 1; (pivotValues[i] && j < pivotValues[i].length); j++) {
                    if (pivotValues[i][j].axis === 'value' && pivotValues[i][j].formattedText !== '') {
                        pivotValues[i][j].style = undefined;
                        pivotValues[i][j].cssClass = undefined;
                        var format_1 = this.dataSourceSettings.conditionalFormatSettings;
                        for (var k = 0; k < format_1.length; k++) {
                            if ((format_1[k].applyGrandTotals === true || isNullOrUndefined(format_1[k].applyGrandTotals)) ? true :
                                pivotValues[i][j].rowHeaders !== '' &&
                                    pivotValues[i][j].columnHeaders !== '') {
                                if (this.checkCondition(pivotValues[i][j].value, format_1[k].conditions, format_1[k].value1, format_1[k].value2)) {
                                    // let ilen: number =
                                    //     (this.dataSourceSettings.valueAxis === 'row' ? i : this.engineModule.headerContent.length - 1);
                                    // let jlen: number = (this.dataSourceSettings.valueAxis === 'row' ? 0 : j);
                                    if ((!format_1[k].measure || pivotValues[i][j].actualText === format_1[k].measure) &&
                                        (format_1[k].measure === undefined || format_1[k].measure !== '') && (format_1[k].label === undefined ||
                                        format_1[k].label !== '') && ((!format_1[k].label ||
                                        (pivotValues[i][0].valueSort.levelName
                                            .indexOf(format_1[k].label)) > -1) || (pivotValues[i][j]
                                        .rowHeaders.indexOf(format_1[k].label) > -1) ||
                                        (pivotValues[i][j].columnHeaders
                                            .indexOf(format_1[k].label) > -1))) {
                                        if (format_1[k].style && format_1[k].style.backgroundColor) {
                                            format_1[k].style.backgroundColor = this.conditionalFormattingModule
                                                .isHex(format_1[k].style.backgroundColor.substr(1)) ? format_1[k].style.backgroundColor :
                                                this.conditionalFormattingModule.colourNameToHex(format_1[k].style.backgroundColor);
                                        }
                                        if (format_1[k].style && format_1[k].style.color) {
                                            format_1[k].style.color = this.conditionalFormattingModule
                                                .isHex(format_1[k].style.color.substr(1)) ? format_1[k].style.color :
                                                this.conditionalFormattingModule.colourNameToHex(format_1[k].style.color);
                                        }
                                        pivotValues[i][j].style = format_1[k].style;
                                        pivotValues[i][j].cssClass = 'format' + this.element.id + k;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            var format = this.dataSourceSettings.conditionalFormatSettings;
            for (var k = 0; k < format.length; k++) {
                var sheet = (this.createStyleSheet.bind(this))();
                var str = 'color: ' + format[k].style.color + '!important;background-color: ' + format[k].style.backgroundColor +
                    '!important;font-size: ' + format[k].style.fontSize + '!important;font-family: ' + format[k].style.fontFamily +
                    ' !important;';
                sheet.insertRule('.format' + this.element.id + k + '{' + str + '}', 0);
            }
        }
    };
    PivotView.prototype.createStyleSheet = function () {
        var style = document.createElement('style');
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
        return style.sheet;
    };
    PivotView.prototype.applyHyperlinkSettings = function () {
        if (this.pivotValues) {
            var pivotValues = this.pivotValues;
            var colIndex = [];
            for (var len = pivotValues.length, i = 0; i < len; i++) {
                if (!isNullOrUndefined(pivotValues[i]) && pivotValues[i][0] === undefined) {
                    colIndex.push(i);
                }
            }
            if (this.hyperlinkSettings.conditionalSettings.length > 0) {
                for (var i = 0; i < pivotValues.length; i++) {
                    for (var j = 1; (pivotValues[i] && j < pivotValues[i].length); j++) {
                        if (pivotValues[i][j].axis === 'value') {
                            pivotValues[i][j].enableHyperlink = false;
                            var collection = this.hyperlinkSettings.conditionalSettings;
                            for (var k = 0; k < collection.length; k++) {
                                if (this.checkCondition(pivotValues[i][j].value, collection[k].conditions, collection[k].value1, collection[k].value2)) {
                                    var ilen = (this.dataSourceSettings.valueAxis === 'row' ?
                                        i : (this.dataType === 'pivot' ?
                                        this.engineModule.headerContent.length - 1 : this.olapEngineModule.headerContent.length - 1));
                                    var jlen = (this.dataSourceSettings.valueAxis === 'row' ? 0 : j);
                                    if ((!collection[k].measure || this.dataSourceSettings.values.length === 1 ||
                                        (pivotValues[ilen][jlen].valueSort &&
                                            (pivotValues[ilen][jlen].actualText === collection[k].measure))) &&
                                        (!collection[k].label || ((pivotValues[colIndex[collection[k].label.split('.').length - 1]] &&
                                            pivotValues[colIndex[collection[k].label.split('.').length - 1]][j] &&
                                            pivotValues[colIndex[collection[k].label.split('.').length - 1]][j].valueSort &&
                                            pivotValues[colIndex[collection[k].label.split('.').length - 1]][j].
                                                valueSort[collection[k].label]) || (pivotValues[i][0].
                                            valueSort.levelName.indexOf(collection[k].label) > -1)))) {
                                        pivotValues[i][j].enableHyperlink = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!isNullOrUndefined(this.hyperlinkSettings.headerText)) {
                var headerDelimiter = this.dataSourceSettings.valueSortSettings.headerDelimiter ? this.dataSourceSettings.valueSortSettings.headerDelimiter : '.';
                for (var i = 0; i < pivotValues.length; i++) {
                    for (var j = 1; (pivotValues[i] && j < pivotValues[i].length); j++) {
                        if (pivotValues[i][j].axis === 'value') {
                            // (pivotValues[i][j] as IAxisSet).enableHyperlink = false;
                            var label = this.hyperlinkSettings.headerText;
                            var ilen = (this.dataSourceSettings.valueAxis === 'row' ?
                                i : (this.dataType === 'pivot' ?
                                this.engineModule.headerContent.length - 1 : this.olapEngineModule.headerContent.length - 1));
                            var jlen = (this.dataSourceSettings.valueAxis === 'row' ? 0 : j);
                            if ((pivotValues[colIndex[label.split(headerDelimiter).length - 1]] &&
                                pivotValues[colIndex[label.split(headerDelimiter).length - 1]][j] &&
                                pivotValues[colIndex[label.split(headerDelimiter).length - 1]][j].
                                    valueSort && pivotValues[colIndex[label.split(headerDelimiter).length - 1]][j].
                                valueSort[label])) {
                                for (var _i = 0, colIndex_2 = colIndex; _i < colIndex_2.length; _i++) {
                                    var index = colIndex_2[_i];
                                    if (pivotValues[index][j] &&
                                        pivotValues[index][j].axis === 'column' &&
                                        (pivotValues[index][j].valueSort.levelName.indexOf(label) > -1)) {
                                        pivotValues[index][j].enableHyperlink = true;
                                    }
                                }
                                pivotValues[i][j].enableHyperlink = true;
                            }
                            else if (pivotValues[i][0].valueSort.levelName.indexOf(label) > -1) {
                                pivotValues[i][0].enableHyperlink = true;
                                pivotValues[i][j].enableHyperlink = true;
                            }
                        }
                    }
                }
            }
            else {
                return;
            }
        }
    };
    PivotView.prototype.checkCondition = function (cellValue, conditions, conditionalValue1, conditionalValue2) {
        switch (conditions) {
            case 'LessThan':
                return cellValue < conditionalValue1;
            case 'LessThanOrEqualTo':
                return cellValue <= conditionalValue1;
            case 'GreaterThan':
                return cellValue > conditionalValue1;
            case 'GreaterThanOrEqualTo':
                return cellValue >= conditionalValue1;
            case 'Equals':
                return cellValue === conditionalValue1;
            case 'NotEquals':
                return cellValue !== conditionalValue1;
            case 'Between':
                return (conditionalValue1 < conditionalValue2 && cellValue >= conditionalValue1 && cellValue <= conditionalValue2) ||
                    (conditionalValue1 > conditionalValue2 && cellValue <= conditionalValue1 && cellValue >= conditionalValue2);
            case 'NotBetween':
                return !((conditionalValue1 < conditionalValue2 && cellValue >= conditionalValue1 && cellValue <= conditionalValue2) ||
                    (conditionalValue1 > conditionalValue2 && cellValue <= conditionalValue1 && cellValue >= conditionalValue2));
            default:
                return false;
        }
    };
    /** @hidden */
    /* tslint:disable:max-func-body-length */
    PivotView.prototype.updateGroupingReport = function (newGroupSettings, updateGroupType) {
        if (!this.clonedDataSet && !this.clonedReport) {
            var dataSet = this.engineModule.data;
            this.clonedDataSet = PivotUtil.getClonedData(dataSet);
            if (isBlazor()) {
                this.clonedReport = PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings);
            }
            else {
                this.setProperties({ dataSourceSettings: { dataSource: [] } }, true);
                this.clonedReport = PivotUtil.getClonedDataSourceSettings(this.dataSourceSettings);
                this.setProperties({ dataSourceSettings: { dataSource: dataSet } }, true);
            }
        }
        /* tslint:disable-next-line:max-line-length */
        var dateGroup = /_date_group_years|_date_group_quarters|_date_group_quarterYear|_date_group_months|_date_group_days|_date_group_hours|_date_group_minutes|_date_group_seconds/g;
        var data = PivotUtil.getClonedData(this.clonedDataSet);
        var dataSource = this.dataSourceSettings;
        var clonedReport = this.clonedReport.properties ?
            this.clonedReport.properties : this.clonedReport;
        var axisFields = [dataSource.rows, dataSource.columns, dataSource.values, dataSource.filters];
        var fieldSettings = [dataSource.filterSettings, dataSource.sortSettings, dataSource.formatSettings, dataSource.drilledMembers];
        var clonedAxisFields = clonedReport.rows;
        clonedAxisFields = clonedAxisFields.concat(clonedReport.columns, clonedReport.values, clonedReport.filters);
        if (newGroupSettings.length === 0 || newGroupSettings.length > 0) {
            this.engineModule.groupingFields = {};
            if (!isBlazor()) {
                /* tslint:disable-next-line:max-line-length */
                this.setProperties({ dataSourceSettings: { dataSource: data, groupSettings: newGroupSettings.length > 0 ? dataSource.groupSettings : [] } }, true);
            }
            var isDateGroupUpdated = updateGroupType === 'Date';
            var fields = [];
            for (var i = 0, cnt = axisFields.length; i < cnt; i++) {
                for (var j = 0, len = axisFields[i].length; j < len; j++) {
                    var fieldName = axisFields[i][j].name;
                    if (fields.indexOf(fieldName) === -1) {
                        fields.push(fieldName);
                    }
                    var index = fields.indexOf(fieldName);
                    var group = PivotUtil.getFieldByName(fieldName, dataSource.groupSettings);
                    if ((!isNullOrUndefined(fieldName.match(dateGroup)) &&
                        isDateGroupUpdated) || (fieldName.indexOf('_custom_group') !== -1 &&
                        /* tslint:disable-next-line:max-line-length */
                        !PivotUtil.getFieldByName(fieldName.replace('_custom_group', ''), dataSource.groupSettings))) {
                        axisFields[i].splice(j, 1);
                        fields.splice(index, 1);
                        j--;
                        len--;
                    }
                    else {
                        var fieldObj = PivotUtil.getFieldByName(fieldName, clonedAxisFields);
                        if (fieldObj) {
                            axisFields[i].splice(j, 1, fieldObj);
                        }
                    }
                }
            }
            for (var _i = 0, fields_2 = fields; _i < fields_2.length; _i++) {
                var fieldName = fields_2[_i];
                var filterObj = PivotUtil.getFilterItemByName(fieldName, clonedReport.filterSettings);
                var sortObj = PivotUtil.getFieldByName(fieldName, clonedReport.sortSettings);
                var formatObj = PivotUtil.getFieldByName(fieldName, clonedReport.formatSettings);
                var drillObj = PivotUtil.getFieldByName(fieldName, clonedReport.drilledMembers);
                var settingsObj = [filterObj, sortObj, formatObj, drillObj];
                for (var i = 0, cnt = fieldSettings.length; i < cnt; i++) {
                    var isExists = false;
                    for (var j = 0, len = fieldSettings[i].length; j < len; j++) {
                        var name_1 = fieldSettings[i][j].name;
                        /* tslint:disable-next-line:max-line-length */
                        if ((!isNullOrUndefined(name_1.match(dateGroup)) && isDateGroupUpdated) || (name_1.indexOf('_custom_group') !== -1 &&
                            !PivotUtil.getFieldByName(name_1.replace('_custom_group', ''), dataSource.groupSettings))) {
                            fieldSettings[i].splice(j, 1);
                            j--;
                            len--;
                        }
                        else if (fieldName === fieldSettings[i][j].name) {
                            isExists = true;
                            if (settingsObj[i]) {
                                fieldSettings[i].splice(j, 1, settingsObj[i]);
                            }
                            else {
                                fieldSettings[i].splice(j, 1);
                                j--;
                                len--;
                            }
                            break;
                        }
                    }
                    if (!isExists && i === 0 && filterObj) {
                        fieldSettings[i].push(filterObj);
                    }
                    if (!isExists && i === 1 && sortObj) {
                        fieldSettings[i].push(sortObj);
                    }
                    if (!isExists && i === 2 && formatObj) {
                        fieldSettings[i].push(formatObj);
                    }
                    if (!isExists && i === 3 && drillObj) {
                        fieldSettings[i].push(drillObj);
                    }
                }
            }
            /* tslint:disable */
            if (isBlazor()) {
                this.engineModule.data = data;
                this.allowServerDataBinding = false;
                this.setProperties({
                    dataSourceSettings: {
                        rows: axisFields[0], columns: axisFields[1], values: axisFields[2], filters: axisFields[3],
                        filterSettings: fieldSettings[0], sortSettings: fieldSettings[1], formatSettings: fieldSettings[2],
                        drilledMembers: fieldSettings[3], groupSettings: newGroupSettings.length > 0 ? dataSource.groupSettings : []
                    }
                }, true);
                this.allowServerDataBinding = true;
            }
        }
    };
    PivotView.prototype.removeButtonFocus = function (e) {
        if (document.querySelectorAll('.e-btn-focused')) {
            removeClass(document.querySelectorAll('.e-btn-focused'), 'e-btn-focused');
        }
    };
    /* tslint:enable */
    /* tslint:enable:max-func-body-length */
    PivotView.prototype.wireEvents = function () {
        if (this.displayOption.view !== 'Chart') {
            EventHandler.add(this.element, this.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler, this);
            EventHandler.add(this.element, 'mousedown', this.mouseDownHandler, this);
            EventHandler.add(this.element.querySelector('.' + cls.GRID_HEADER), 'mousemove', this.mouseMoveHandler, this);
            EventHandler.add(this.element, 'mouseup', this.mouseUpHandler, this);
            EventHandler.add(this.element, this.isAdaptive ? 'touchend' : 'contextmenu', this.mouseRclickHandler, this);
        }
        EventHandler.add(document, this.isAdaptive ? 'touchend' : 'click', this.removeButtonFocus, this);
        window.addEventListener('resize', this.onWindowResize.bind(this), true);
    };
    PivotView.prototype.unwireEvents = function () {
        if (this.displayOption.view !== 'Chart') {
            EventHandler.remove(this.element, this.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler);
            EventHandler.remove(this.element, 'mousedown', this.mouseDownHandler);
            if (this.element.querySelector('.' + cls.GRID_HEADER)) {
                EventHandler.remove(this.element.querySelector('.' + cls.GRID_HEADER), 'mousemove', this.mouseMoveHandler);
            }
            EventHandler.remove(this.element, 'mouseup', this.mouseUpHandler);
            EventHandler.remove(this.element, this.isAdaptive ? 'touchend' : 'contextmenu', this.mouseRclickHandler);
        }
        EventHandler.remove(document, this.isAdaptive ? 'touchend' : 'click', this.removeButtonFocus);
        window.removeEventListener('resize', this.onWindowResize.bind(this), true);
    };
    /**
     * To destroy the PivotView elements.
     * @returns void
     */
    PivotView.prototype.destroy = function () {
        this.removeInternalEvents();
        if (this.showGroupingBar && this.groupingBarModule) {
            this.groupingBarModule.destroy();
        }
        if (this.allowGrouping && this.groupingModule) {
            this.groupingModule.destroy();
        }
        if (this.showToolbar && this.toolbarModule) {
            this.toolbarModule.destroy();
        }
        if (this.enableVirtualization && this.virtualscrollModule) {
            this.virtualscrollModule.destroy();
        }
        if (this.allowConditionalFormatting && this.conditionalFormattingModule) {
            this.conditionalFormattingModule.destroy();
        }
        if (this.allowNumberFormatting && this.numberFormattingModule) {
            this.numberFormattingModule.destroy();
        }
        if (this.isAdaptive && this.contextMenuModule) {
            this.contextMenuModule.destroy();
        }
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        if (this.tooltip) {
            this.tooltip.destroy();
        }
        if (this.chart) {
            this.chart.destroy();
            if (this.chart.isDestroyed && select('#' + this.element.id + '_chart', this.element)) {
                remove(select('#' + this.element.id + '_chart', this.element));
            }
        }
        if (this.grid) {
            this.grid.destroy();
            if (this.grid.isDestroyed && select('#' + this.element.id + '_grid', this.element)) {
                remove(select('#' + this.element.id + '_grid', this.element));
            }
        }
        this.unwireEvents();
        _super.prototype.destroy.call(this);
        if (!(isBlazor() && this.isServerRendered)) {
            this.element.innerHTML = '';
        }
        else {
            if (this.element.querySelector('.e-spinner-pane')) {
                remove(this.element.querySelector('.e-spinner-pane'));
            }
            if (this.showFieldList && select('#' + this.element.id + '_PivotFieldList', document)) {
                remove(select('#' + this.element.id + '_PivotFieldList', document));
            }
        }
        removeClass([this.element], cls.ROOT);
        removeClass([this.element], cls.RTL);
        removeClass([this.element], cls.DEVICE);
    };
    /**
     * Method to open the number formatting dialog to set the format dynamically.
     * @returns void
     */
    PivotView.prototype.showNumberFormattingDialog = function () {
        if (this.allowNumberFormatting) {
            this.numberFormattingModule.showNumberFormattingDialog();
        }
    };
    var PivotView_1;
    __decorate([
        Property('USD')
    ], PivotView.prototype, "currencyCode", void 0);
    __decorate([
        Property(false)
    ], PivotView.prototype, "showFieldList", void 0);
    __decorate([
        Complex({}, GridSettings)
    ], PivotView.prototype, "gridSettings", void 0);
    __decorate([
        Complex({}, ChartSettings)
    ], PivotView.prototype, "chartSettings", void 0);
    __decorate([
        Complex({}, GroupingBarSettings)
    ], PivotView.prototype, "groupingBarSettings", void 0);
    __decorate([
        Complex({}, HyperlinkSettings)
    ], PivotView.prototype, "hyperlinkSettings", void 0);
    __decorate([
        Complex({}, DataSourceSettings)
    ], PivotView.prototype, "dataSourceSettings", void 0);
    __decorate([
        Complex({}, CellEditSettings)
    ], PivotView.prototype, "editSettings", void 0);
    __decorate([
        Complex({}, DisplayOption)
    ], PivotView.prototype, "displayOption", void 0);
    __decorate([
        Property()
    ], PivotView.prototype, "pivotValues", void 0);
    __decorate([
        Property(false)
    ], PivotView.prototype, "showGroupingBar", void 0);
    __decorate([
        Property(true)
    ], PivotView.prototype, "showTooltip", void 0);
    __decorate([
        Property(false)
    ], PivotView.prototype, "showToolbar", void 0);
    __decorate([
        Property([])
    ], PivotView.prototype, "toolbar", void 0);
    __decorate([
        Property(false)
    ], PivotView.prototype, "showValuesButton", void 0);
    __decorate([
        Property(false)
    ], PivotView.prototype, "allowCalculatedField", void 0);
    __decorate([
        Property(false)
    ], PivotView.prototype, "enableValueSorting", void 0);
    __decorate([
        Property(false)
    ], PivotView.prototype, "allowConditionalFormatting", void 0);
    __decorate([
        Property(false)
    ], PivotView.prototype, "allowNumberFormatting", void 0);
    __decorate([
        Property('auto')
    ], PivotView.prototype, "height", void 0);
    __decorate([
        Property('auto')
    ], PivotView.prototype, "width", void 0);
    __decorate([
        Property(false)
    ], PivotView.prototype, "allowExcelExport", void 0);
    __decorate([
        Property(false)
    ], PivotView.prototype, "enableVirtualization", void 0);
    __decorate([
        Property(false)
    ], PivotView.prototype, "allowDrillThrough", void 0);
    __decorate([
        Property(false)
    ], PivotView.prototype, "allowPdfExport", void 0);
    __decorate([
        Property(false)
    ], PivotView.prototype, "allowDeferLayoutUpdate", void 0);
    __decorate([
        Property(false)
    ], PivotView.prototype, "allowDataCompression", void 0);
    __decorate([
        Property(1000)
    ], PivotView.prototype, "maxNodeLimitInMemberEditor", void 0);
    __decorate([
        Property(10000)
    ], PivotView.prototype, "maxRowsInDrillThrough", void 0);
    __decorate([
        Property(true)
    ], PivotView.prototype, "loadOnDemandInMemberEditor", void 0);
    __decorate([
        Property(true)
    ], PivotView.prototype, "enableHtmlSanitizer", void 0);
    __decorate([
        Property()
    ], PivotView.prototype, "cellTemplate", void 0);
    __decorate([
        Property()
    ], PivotView.prototype, "toolbarTemplate", void 0);
    __decorate([
        Property()
    ], PivotView.prototype, "tooltipTemplate", void 0);
    __decorate([
        Property()
    ], PivotView.prototype, "spinnerTemplate", void 0);
    __decorate([
        Property(false)
    ], PivotView.prototype, "allowGrouping", void 0);
    __decorate([
        Property(true)
    ], PivotView.prototype, "exportAllPages", void 0);
    __decorate([
        Property(['Sum', 'Count', 'DistinctCount', 'Product', 'Min', 'Max', 'Avg', 'Index', 'PopulationVar', 'SampleVar', 'PopulationStDev', 'SampleStDev', 'RunningTotals', 'PercentageOfGrandTotal', 'PercentageOfColumnTotal', 'PercentageOfRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentRowTotal', 'DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentTotal'])
    ], PivotView.prototype, "aggregateTypes", void 0);
    __decorate([
        Property(['Column', 'Bar', 'Line', 'Area', 'Scatter', 'Polar', 'StackingColumn', 'StackingArea', 'StackingBar', 'StepLine', 'StepArea', 'SplineArea', 'Spline', 'StackingColumn100', 'StackingBar100', 'StackingArea100', 'Bubble', 'Pareto', 'Radar', 'Pie', 'Doughnut', 'Funnel', 'Pyramid'])
    ], PivotView.prototype, "chartTypes", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "queryCellInfo", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "headerCellInfo", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "resizing", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "resizeStop", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "pdfHeaderQueryCellInfo", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "pdfQueryCellInfo", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "excelHeaderQueryCellInfo", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "excelQueryCellInfo", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "columnDragStart", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "columnDrag", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "columnDrop", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "beforePdfExport", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "beforeExcelExport", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "beforeColumnsRender", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "selected", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "cellDeselected", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "rowSelected", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "rowDeselected", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "chartTooltipRender", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "chartLoaded", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "chartLoad", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "chartResized", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "chartAxisLabelRender", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "multiLevelLabelClick", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "chartPointClick", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "contextMenuClick", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "contextMenuOpen", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "onPdfCellRender", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "saveReport", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "fetchReport", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "loadReport", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "renameReport", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "removeReport", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "newReport", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "toolbarRender", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "toolbarClick", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "load", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "enginePopulating", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "enginePopulated", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "onFieldDropped", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "fieldDrop", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "fieldDragStart", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "dataBound", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "created", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "destroyed", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "beforeExport", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "conditionalFormatting", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "memberFiltering", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "cellClick", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "drillThrough", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "editCompleted", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "beginDrillThrough", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "hyperlinkCellClick", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "cellSelecting", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "drill", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "cellSelected", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "chartSeriesCreated", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "aggregateCellInfo", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "fieldListRefreshed", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "memberEditorOpen", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "calculatedFieldCreate", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "numberFormatting", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "aggregateMenuOpen", void 0);
    __decorate([
        Event()
    ], PivotView.prototype, "fieldRemove", void 0);
    PivotView = PivotView_1 = __decorate([
        NotifyPropertyChanges
    ], PivotView);
    return PivotView;
}(Component));
export { PivotView };
