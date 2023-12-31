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
import { Property, Complex, Collection, ChildProperty } from '@syncfusion/ej2-base';
/**
 * Allows specific fields associated with field information that needs to be displayed in the field axes of pivot table. The following configurations which are applicable are as follows:
 * * `name`: Allows you to set the field name that needs to be displayed in row/column/value/filter axis of pivot table.
 * * `caption`: Allows you to set caption to the specific field. It will be used to display instead of its name in pivot table component's UI.
 * * `type`: Allows to display the values in the pivot table with appropriate aggregations such as sum, product, count, average, etc… **Note: It is applicable only for relational data source.**
 * * `axis`: Allows you to set the axis name to the specific field. This will help to display the field in specified axis such as row/column/value/filter axis of pivot table.
 * * `showNoDataItems`: Allows you to display all members items of a specific field to the pivot table,
 * even doesn't have any data in its row/column intersection in data source. **Note: It is applicable only for relational data source.**
 * * `baseField`: Allows you to set the selective field, which used to display the values with either
 *  DifferenceFrom or PercentageOfDifferenceFrom or PercentageOfParentTotal aggregate types. **Note: It is applicable only for relational data source.**
 * * `baseItem`: Allows you to set the selective item of a specific field, which used to display the values with either DifferenceFrom or PercentageOfDifferenceFrom aggregate types.
 * The selective item should be set the from field specified in the baseField property. **Note: It is applicable only for relational data source.**
 * * `showSubTotals`: Allows to show or hide sub-totals to a specific field in row/column axis of the pivot table.
 * * `isNamedSet`: Allows you to set whether the specified field is a named set or not. In general,
 * the named set is a set of dimension members or a set expression (MDX query) to be created as a dimension in the SSAS OLAP cube itself. **Note: It is applicable only for OLAP data source.**
 * * `isCalculatedField`: Allows to set whether the specified field is a calculated field or not.
 * In general, the calculated field is created from the bound data source or using simple formula with basic arithmetic operators in the pivot table. **Note: It is applicable only for OLAP data source.**
 * * `showFilterIcon`: Allows you to show or hide the filter icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
 * This filter icon is used to filter the members of a specified field at runtime in the pivot table.
 * * `showSortIcon`: Allows you to show or hide the sort icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
 * This sort icon is used to order members of a specified field either in ascending or descending at runtime.
 * * `showRemoveIcon`: Allows you to show or hide the remove icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
 * This remove icon is used to remove the specified field during runtime.
 * * `showValueTypeIcon`: Allows you to show or hide the value type icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
 * This value type icon helps to select the appropriate aggregation type to specified value field at runtime.
 * * `showEditIcon`: Allows you to show or hide the edit icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
 * This edit icon is used to modify caption, formula, and format of a specified calculated field at runtime that to be displayed in the pivot table.
 * * `allowDragAndDrop`: Allows you to restrict the specific field's pivot button that is used to drag on runtime in the grouping bar and field list UI.
 * This will prevent you from modifying the current report.
 */
var FieldOptions = /** @class */ (function (_super) {
    __extends(FieldOptions, _super);
    function FieldOptions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], FieldOptions.prototype, "name", void 0);
    __decorate([
        Property()
    ], FieldOptions.prototype, "caption", void 0);
    __decorate([
        Property('Sum')
    ], FieldOptions.prototype, "type", void 0);
    __decorate([
        Property()
    ], FieldOptions.prototype, "axis", void 0);
    __decorate([
        Property(false)
    ], FieldOptions.prototype, "showNoDataItems", void 0);
    __decorate([
        Property()
    ], FieldOptions.prototype, "baseField", void 0);
    __decorate([
        Property()
    ], FieldOptions.prototype, "baseItem", void 0);
    __decorate([
        Property(true)
    ], FieldOptions.prototype, "showSubTotals", void 0);
    __decorate([
        Property(false)
    ], FieldOptions.prototype, "isNamedSet", void 0);
    __decorate([
        Property(false)
    ], FieldOptions.prototype, "isCalculatedField", void 0);
    __decorate([
        Property(true)
    ], FieldOptions.prototype, "showFilterIcon", void 0);
    __decorate([
        Property(true)
    ], FieldOptions.prototype, "showSortIcon", void 0);
    __decorate([
        Property(true)
    ], FieldOptions.prototype, "showRemoveIcon", void 0);
    __decorate([
        Property(true)
    ], FieldOptions.prototype, "showValueTypeIcon", void 0);
    __decorate([
        Property(true)
    ], FieldOptions.prototype, "showEditIcon", void 0);
    __decorate([
        Property(true)
    ], FieldOptions.prototype, "allowDragAndDrop", void 0);
    __decorate([
        Property()
    ], FieldOptions.prototype, "dataType", void 0);
    return FieldOptions;
}(ChildProperty));
export { FieldOptions };
/**
 * Allows specific fields associated with field information that needs to be displayed in the field axes of pivot table. The following configurations which are applicable are as follows:
 * * `name`: Allows you to set the field name that needs to be displayed in row/column/value/filter axis of pivot table.
 * * `caption`: Allows you to set caption to the specific field. It will be used to display instead of its name in pivot table component's UI.
 * * `type`: Allows to display the values in the pivot table with appropriate aggregations such as sum, product, count, average, etc… **Note: It is applicable only for relational data source.**
 * * `axis`: Allows you to set the axis name to the specific field. This will help to display the field in specified axis such as row/column/value/filter axis of pivot table.
 * * `showNoDataItems`: Allows you to display all members items of a specific field to the pivot table,
 * even doesn't have any data in its row/column intersection in data source. **Note: It is applicable only for relational data source.**
 * * `baseField`: Allows you to set the selective field, which used to display the values with either
 *  DifferenceFrom or PercentageOfDifferenceFrom or PercentageOfParentTotal aggregate types. **Note: It is applicable only for relational data source.**
 * * `baseItem`: Allows you to set the selective item of a specific field, which used to display the values with either DifferenceFrom or PercentageOfDifferenceFrom aggregate types.
 * The selective item should be set the from field specified in the baseField property. **Note: It is applicable only for relational data source.**
 * * `showSubTotals`: Allows to show or hide sub-totals to a specific field in row/column axis of the pivot table.
 * * `isNamedSet`: Allows you to set whether the specified field is a named set or not. In general,
 * the named set is a set of dimension members or a set expression (MDX query) to be created as a dimension in the SSAS OLAP cube itself. **Note: It is applicable only for OLAP data source.**
 * * `isCalculatedField`: Allows to set whether the specified field is a calculated field or not.
 * In general, the calculated field is created from the bound data source or using simple formula with basic arithmetic operators in the pivot table. **Note: It is applicable only for OLAP data source.**
 * * `showFilterIcon`: Allows you to show or hide the filter icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
 * This filter icon is used to filter the members of a specified field at runtime in the pivot table.
 * * `showSortIcon`: Allows you to show or hide the sort icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
 * This sort icon is used to order members of a specified field either in ascending or descending at runtime.
 * * `showRemoveIcon`: Allows you to show or hide the remove icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
 * This remove icon is used to remove the specified field during runtime.
 * * `showValueTypeIcon`: Allows you to show or hide the value type icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
 * This value type icon helps to select the appropriate aggregation type to specified value field at runtime.
 * * `showEditIcon`: Allows you to show or hide the edit icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
 * This edit icon is used to modify caption, formula, and format of a specified calculated field at runtime that to be displayed in the pivot table.
 * * `allowDragAndDrop`: Allows you to restrict the specific field's pivot button that is used to drag on runtime in the grouping bar and field list UI.
 * This will prevent you from modifying the current report.
 */
var FieldListFieldOptions = /** @class */ (function (_super) {
    __extends(FieldListFieldOptions, _super);
    function FieldListFieldOptions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FieldListFieldOptions;
}(FieldOptions));
export { FieldListFieldOptions };
/**
 * Allows the style information to cusotmize the pivot table cell apprearance.
 */
var Style = /** @class */ (function (_super) {
    __extends(Style, _super);
    function Style() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], Style.prototype, "backgroundColor", void 0);
    __decorate([
        Property()
    ], Style.prototype, "color", void 0);
    __decorate([
        Property()
    ], Style.prototype, "fontFamily", void 0);
    __decorate([
        Property()
    ], Style.prototype, "fontSize", void 0);
    return Style;
}(ChildProperty));
export { Style };
/**
 * Allows specific fields associated with either selective or conditional-based filter members that used to be displayed in the pivot table.
 */
var Filter = /** @class */ (function (_super) {
    __extends(Filter, _super);
    function Filter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], Filter.prototype, "name", void 0);
    __decorate([
        Property('Include')
    ], Filter.prototype, "type", void 0);
    __decorate([
        Property()
    ], Filter.prototype, "items", void 0);
    __decorate([
        Property('DoesNotEquals')
    ], Filter.prototype, "condition", void 0);
    __decorate([
        Property()
    ], Filter.prototype, "value1", void 0);
    __decorate([
        Property()
    ], Filter.prototype, "value2", void 0);
    __decorate([
        Property()
    ], Filter.prototype, "measure", void 0);
    __decorate([
        Property(1)
    ], Filter.prototype, "levelCount", void 0);
    __decorate([
        Property()
    ], Filter.prototype, "selectedField", void 0);
    return Filter;
}(ChildProperty));
export { Filter };
/**
 * Allows a collection of values fields to change the appearance of the pivot table value cells with different style properties such as background color, font color, font family, and font size based on specific conditions.
 */
var ConditionalFormatSettings = /** @class */ (function (_super) {
    __extends(ConditionalFormatSettings, _super);
    function ConditionalFormatSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], ConditionalFormatSettings.prototype, "measure", void 0);
    __decorate([
        Property()
    ], ConditionalFormatSettings.prototype, "label", void 0);
    __decorate([
        Property()
    ], ConditionalFormatSettings.prototype, "conditions", void 0);
    __decorate([
        Property()
    ], ConditionalFormatSettings.prototype, "value1", void 0);
    __decorate([
        Property()
    ], ConditionalFormatSettings.prototype, "value2", void 0);
    __decorate([
        Property()
    ], ConditionalFormatSettings.prototype, "style", void 0);
    __decorate([
        Property(true)
    ], ConditionalFormatSettings.prototype, "applyGrandTotals", void 0);
    return ConditionalFormatSettings;
}(ChildProperty));
export { ConditionalFormatSettings };
/**
 * Allows specific fields associated with sort settings to order their members either in ascending or descending that used to be displayed in the pivot table.
 */
var Sort = /** @class */ (function (_super) {
    __extends(Sort, _super);
    function Sort() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], Sort.prototype, "name", void 0);
    __decorate([
        Property('Ascending')
    ], Sort.prototype, "order", void 0);
    return Sort;
}(ChildProperty));
export { Sort };
/**
 * Allows specific fields used to display the values with specific format that used to be displayed in the pivot table.
 * For example, to display a specific field with currency formatted values in the pivot table, the set the `format` property to be **C**.
 */
var FormatSettings = /** @class */ (function (_super) {
    __extends(FormatSettings, _super);
    function FormatSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], FormatSettings.prototype, "name", void 0);
    __decorate([
        Property()
    ], FormatSettings.prototype, "minimumFractionDigits", void 0);
    __decorate([
        Property()
    ], FormatSettings.prototype, "maximumFractionDigits", void 0);
    __decorate([
        Property()
    ], FormatSettings.prototype, "minimumSignificantDigits", void 0);
    __decorate([
        Property()
    ], FormatSettings.prototype, "maximumSignificantDigits", void 0);
    __decorate([
        Property(true)
    ], FormatSettings.prototype, "useGrouping", void 0);
    __decorate([
        Property()
    ], FormatSettings.prototype, "skeleton", void 0);
    __decorate([
        Property()
    ], FormatSettings.prototype, "type", void 0);
    __decorate([
        Property()
    ], FormatSettings.prototype, "currency", void 0);
    __decorate([
        Property()
    ], FormatSettings.prototype, "minimumIntegerDigits", void 0);
    __decorate([
        Property()
    ], FormatSettings.prototype, "format", void 0);
    return FormatSettings;
}(ChildProperty));
export { FormatSettings };
/**
 * Allows specific fields to group their data on the basis of their type.
 * For example, the date type fields can be formatted and displayed based on year, quarter, month, and more. Likewise, the number type fields can be grouped range-wise, such as 1-5, 6-10, etc.
 * You can perform custom group to the string type fields that used to displayed in the pivot table.
 */
var GroupSettings = /** @class */ (function (_super) {
    __extends(GroupSettings, _super);
    function GroupSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], GroupSettings.prototype, "name", void 0);
    __decorate([
        Property()
    ], GroupSettings.prototype, "groupInterval", void 0);
    __decorate([
        Property()
    ], GroupSettings.prototype, "startingAt", void 0);
    __decorate([
        Property()
    ], GroupSettings.prototype, "endingAt", void 0);
    __decorate([
        Property('Date')
    ], GroupSettings.prototype, "type", void 0);
    __decorate([
        Property()
    ], GroupSettings.prototype, "rangeInterval", void 0);
    __decorate([
        Property()
    ], GroupSettings.prototype, "caption", void 0);
    __decorate([
        Property()
    ], GroupSettings.prototype, "customGroups", void 0);
    return GroupSettings;
}(ChildProperty));
export { GroupSettings };
/**
 * Allows to specify the custom group information of specific field to create custom groups.
 */
var CustomGroups = /** @class */ (function (_super) {
    __extends(CustomGroups, _super);
    function CustomGroups() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], CustomGroups.prototype, "groupName", void 0);
    __decorate([
        Property([])
    ], CustomGroups.prototype, "items", void 0);
    return CustomGroups;
}(ChildProperty));
export { CustomGroups };
/**
 * Allows options to create new calculated fields from the bound data source or using simple formula with basic arithmetic operators in the pivot table.
 */
var CalculatedFieldSettings = /** @class */ (function (_super) {
    __extends(CalculatedFieldSettings, _super);
    function CalculatedFieldSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], CalculatedFieldSettings.prototype, "name", void 0);
    __decorate([
        Property()
    ], CalculatedFieldSettings.prototype, "formula", void 0);
    __decorate([
        Property()
    ], CalculatedFieldSettings.prototype, "hierarchyUniqueName", void 0);
    __decorate([
        Property()
    ], CalculatedFieldSettings.prototype, "formatString", void 0);
    return CalculatedFieldSettings;
}(ChildProperty));
export { CalculatedFieldSettings };
/**
 * Allows specific fields used to display their the headers to be either expanded or collapsed in the pivot table.
 */
var DrillOptions = /** @class */ (function (_super) {
    __extends(DrillOptions, _super);
    function DrillOptions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], DrillOptions.prototype, "name", void 0);
    __decorate([
        Property()
    ], DrillOptions.prototype, "items", void 0);
    __decorate([
        Property()
    ], DrillOptions.prototype, "delimiter", void 0);
    return DrillOptions;
}(ChildProperty));
export { DrillOptions };
/**
 * Allows to sort individual value field and its aggregated values either in row or column axis to ascending or descending order.
 */
var ValueSortSettings = /** @class */ (function (_super) {
    __extends(ValueSortSettings, _super);
    function ValueSortSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], ValueSortSettings.prototype, "headerText", void 0);
    __decorate([
        Property('.')
    ], ValueSortSettings.prototype, "headerDelimiter", void 0);
    __decorate([
        Property('None')
    ], ValueSortSettings.prototype, "sortOrder", void 0);
    __decorate([
        Property()
    ], ValueSortSettings.prototype, "measure", void 0);
    return ValueSortSettings;
}(ChildProperty));
export { ValueSortSettings };
/**
 * Allows you to set the credential information to access the specified SSAS cube.
 * > It is applicable only for OLAP data source.
 */
var Authentication = /** @class */ (function (_super) {
    __extends(Authentication, _super);
    function Authentication() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], Authentication.prototype, "userName", void 0);
    __decorate([
        Property()
    ], Authentication.prototype, "password", void 0);
    return Authentication;
}(ChildProperty));
export { Authentication };
/**
 * Allows the following pivot report information such as rows, columns, values, filters, etc., that are used to render the pivot table and field list.
 * * `catalog`: Allows to set the database name of SSAS cube as string type that used to retrieve the data from the specified connection string. **Note: It is applicable only for OLAP data source.**
 * * `cube`: Allows you to set the SSAS cube name as string type that used to retrieve data for pivot table rendering. **Note: It is applicable only for OLAP data source.**
 * * `providerType`: Allows to set the provider type to identify the given connection is either Relational or SSAS to render the pivot table and field list.
 * * `url`: Allows to set the URL as string type, which helps to identify the service endpoint where the data are processed and retrieved to render the pivot table and field list. **Note: It is applicable only for OLAP data source.**
 * * `localeIdentifier`: Allows you to set the specific culture code as number type to render pivot table with desired localization.
 * By default, the pivot table displays with culture code **1033**, which indicates "en-US" locale. **Note: It is applicale only for OLAP data source.**
 * * `dataSource`: Allows you to set the data source as JSON collection to the pivot report either from local or from remote server to the render the pivot that and field list.
 * You can fetch JSON data from remote server by using DataManager. **Note: It is applicable only for relational data source.**
 * * `rows`: Allows specific fields associated with field information that needs to be displayed in row axis of pivot table.
 * * `columns`: Allows specific fields associated with field information that needs to be displayed in column axis of pivot table.
 * * `values`: Allows specific fields associated with field information that needs to be displayed as aggregated numeric values in pivot table.
 * * `filters`: Allows to filter the values in other axis based on the collection of filter fields in pivot table.
 * * `excludeFields`: Allows you to restrict the specific field(s) from displaying it in the field list UI.
 * You may also be unable to render the pivot table with this field(s) by doing so. **Note: It is applicable only for relational data source.**
 * * `expandAll`: Allows you to either expand or collapse all the headers that are displayed in the pivot table.
 * By default, all the headers are collapsed in the pivot table. **Note: It is applicable only for Relational data.**
 * * `valueAxis`: Allows you to set the value fields that to be plotted either in row or column axis in the pivot table.
 * * `filterSettings`: Allows specific fields associated with either selective or conditional-based filter members that used to be displayed in the pivot table.
 * * `sortSettings`: Allows specific fields associated with sort settings to order their members either in ascending or descending that used to be displayed in the pivot table.
 * By default, the data source containing fields are display with Ascending order alone. To use this option, it requires the `enableSorting` property to be **true**.
 * * `enableSorting`: Allows to perform sort operation to order members of a specific fields either in ascending or descending that used to be displayed in the pivot table.
 * * `formatSettings`: Allows specific fields used to display the values with specific format that used to be displayed in the pivot table.
 * For example, to display a specific field with currency formatted values in the pivot table, the set the `format` property to be **C**.
 * * `drilledMembers`: Allows specific fields used to display their the headers to be either expanded or collapsed in the pivot table.
 * * `valueSortSettings`: Allows to sort individual value field and its aggregated values either in row or column axis to ascending or descending order.
 * * `calculatedFieldSettings`: Allows to create new calculated fields from the bound data source or using simple formula with basic arithmetic operators in the pivot table.
 * * `allowMemberFilter`: Allows to perform filter operation based on the selective filter members of the specific fields used to be displayed in the pivot table.
 * * `allowLabelFilter`: Allows to perform filter operation based on the selective headers used to be displayed in the pivot table.
 * * `allowValueFilter`: Allows to perform filter operation based only on value fields and its resultant aggregated values over other fields defined in row and column axes that used to be displayed in the pivot table.
 * * `showSubTotals`: Allows to show or hide sub-totals in both rows and columns axis of the pivot table.
 * * `showRowSubTotals`: Allows to show or hide sub-totals in row axis of the pivot table.
 * * `showColumnSubTotals`: Allows to show or hide sub-totals in column axis of the pivot table.
 * * `showGrandTotals`: Allows to show or hide grand totals in both rows and columns axis of the pivot table.
 * * `showRowGrandTotals`: Allows to show or hide grand totals in row axis of the pivot table.
 * * `showColumnGrandTotals`: Allows to show or hide grand totals in column axis of the pivot table.
 * * `showHeaderWhenEmpty`: Allows the undefined headers to be displayed in the pivot table, when the specific field(s) are not defined in the raw data.
 * For example, if the raw data for the field ‘Country’ is defined as “United Kingdom” and “State” is not defined means, it will be shown as “United Kingdom >> Undefined” in the header section.
 * * `alwaysShowValueHeader`: Allows to show the value field header always in pivot table, even if it holds a single field in the value field axis.
 * * `conditionalFormatSettings`: Allows a collection of values fields to change the appearance of the pivot table value cells with different style properties such as background color, font color, font family, and font size based on specific conditions.
 * * `emptyCellsTextContent`: Allows to show custom string to the empty value cells that used to display in the pivot table. You can fill empty value cells with any value like “0”, ”-”, ”*”, “(blank)”, etc.
 * * `groupSettings`: Allows specific fields to group their data on the basis of their type.
 * For example, the date type fields can be formatted and displayed based on year, quarter, month, and more. Likewise, the number type fields can be grouped range-wise, such as 1-5, 6-10, etc.
 * You can perform custom group to the string type fields that used to displayed in the pivot table.
 * * `showAggregationOnValueField`: Allows the pivot button with specific value field caption along with the aggregation type, to be displayed in the grouping bar and field list UI.
 * For example, if the value field "Sold Amount" is aggregated with Sum, it will be displayed with caption "Sum of Sold Amount" in its pivot button.
 * * `authentication`: Allows you to set the credential information to access the specified SSAS cube. **Note: It is applicable only for OLAP data source**.
 */
var DataSourceSettings = /** @class */ (function (_super) {
    __extends(DataSourceSettings, _super);
    function DataSourceSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('Local')
    ], DataSourceSettings.prototype, "mode", void 0);
    __decorate([
        Property()
    ], DataSourceSettings.prototype, "catalog", void 0);
    __decorate([
        Property()
    ], DataSourceSettings.prototype, "cube", void 0);
    __decorate([
        Property('Relational')
    ], DataSourceSettings.prototype, "providerType", void 0);
    __decorate([
        Property()
    ], DataSourceSettings.prototype, "url", void 0);
    __decorate([
        Property(1033)
    ], DataSourceSettings.prototype, "localeIdentifier", void 0);
    __decorate([
        Property()
    ], DataSourceSettings.prototype, "dataSource", void 0);
    __decorate([
        Collection([], FieldOptions)
    ], DataSourceSettings.prototype, "rows", void 0);
    __decorate([
        Collection([], FieldOptions)
    ], DataSourceSettings.prototype, "columns", void 0);
    __decorate([
        Collection([], FieldOptions)
    ], DataSourceSettings.prototype, "values", void 0);
    __decorate([
        Collection([], FieldOptions)
    ], DataSourceSettings.prototype, "filters", void 0);
    __decorate([
        Collection([], FieldOptions)
    ], DataSourceSettings.prototype, "fieldMapping", void 0);
    __decorate([
        Property([])
    ], DataSourceSettings.prototype, "excludeFields", void 0);
    __decorate([
        Property(false)
    ], DataSourceSettings.prototype, "expandAll", void 0);
    __decorate([
        Property('column')
    ], DataSourceSettings.prototype, "valueAxis", void 0);
    __decorate([
        Collection([], Filter)
    ], DataSourceSettings.prototype, "filterSettings", void 0);
    __decorate([
        Collection([], Sort)
    ], DataSourceSettings.prototype, "sortSettings", void 0);
    __decorate([
        Property(true)
    ], DataSourceSettings.prototype, "enableSorting", void 0);
    __decorate([
        Property('JSON')
    ], DataSourceSettings.prototype, "type", void 0);
    __decorate([
        Property(true)
    ], DataSourceSettings.prototype, "allowMemberFilter", void 0);
    __decorate([
        Property(false)
    ], DataSourceSettings.prototype, "allowLabelFilter", void 0);
    __decorate([
        Property(false)
    ], DataSourceSettings.prototype, "allowValueFilter", void 0);
    __decorate([
        Property(true)
    ], DataSourceSettings.prototype, "showSubTotals", void 0);
    __decorate([
        Property(true)
    ], DataSourceSettings.prototype, "showRowSubTotals", void 0);
    __decorate([
        Property(true)
    ], DataSourceSettings.prototype, "showColumnSubTotals", void 0);
    __decorate([
        Property(true)
    ], DataSourceSettings.prototype, "showGrandTotals", void 0);
    __decorate([
        Property(true)
    ], DataSourceSettings.prototype, "showRowGrandTotals", void 0);
    __decorate([
        Property(true)
    ], DataSourceSettings.prototype, "showColumnGrandTotals", void 0);
    __decorate([
        Property(false)
    ], DataSourceSettings.prototype, "alwaysShowValueHeader", void 0);
    __decorate([
        Property(true)
    ], DataSourceSettings.prototype, "showHeaderWhenEmpty", void 0);
    __decorate([
        Property(true)
    ], DataSourceSettings.prototype, "showAggregationOnValueField", void 0);
    __decorate([
        Collection([], FormatSettings)
    ], DataSourceSettings.prototype, "formatSettings", void 0);
    __decorate([
        Collection([], DrillOptions)
    ], DataSourceSettings.prototype, "drilledMembers", void 0);
    __decorate([
        Complex({}, ValueSortSettings)
    ], DataSourceSettings.prototype, "valueSortSettings", void 0);
    __decorate([
        Collection([], CalculatedFieldSettings)
    ], DataSourceSettings.prototype, "calculatedFieldSettings", void 0);
    __decorate([
        Collection([], ConditionalFormatSettings)
    ], DataSourceSettings.prototype, "conditionalFormatSettings", void 0);
    __decorate([
        Property()
    ], DataSourceSettings.prototype, "emptyCellsTextContent", void 0);
    __decorate([
        Collection([], GroupSettings)
    ], DataSourceSettings.prototype, "groupSettings", void 0);
    __decorate([
        Complex({}, Authentication)
    ], DataSourceSettings.prototype, "authentication", void 0);
    return DataSourceSettings;
}(ChildProperty));
export { DataSourceSettings };
