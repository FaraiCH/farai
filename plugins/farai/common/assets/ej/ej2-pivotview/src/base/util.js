import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
/**
 * This is a file to perform common utility for OLAP and Relational datasource
 * @hidden
 */
var PivotUtil = /** @class */ (function () {
    function PivotUtil() {
    }
    PivotUtil.getType = function (value) {
        var val;
        val = (value && value.getDay) ? (value.getHours() > 0 || value.getMinutes() > 0 ||
            value.getSeconds() > 0 || value.getMilliseconds() > 0 ? 'datetime' : 'date') : !isNaN(Number(value)) ?
            'number' : typeof (value);
        return val;
    };
    PivotUtil.resetTime = function (date) {
        date.setHours(0, 0, 0, 0);
        return date;
    };
    PivotUtil.getClonedData = function (data) {
        var clonedData = [];
        if (data) {
            for (var _i = 0, _a = data; _i < _a.length; _i++) {
                var item = _a[_i];
                var fields = Object.keys(item);
                var keyPos = 0;
                /* tslint:disable:no-any */
                var framedSet = {};
                /* tslint:enable:no-any */
                while (keyPos < fields.length) {
                    framedSet[fields[keyPos]] = item[fields[keyPos]];
                    keyPos++;
                }
                clonedData.push(framedSet);
            }
        }
        return clonedData;
    };
    PivotUtil.getClonedPivotValues = function (pivotValues) {
        var clonedSets = [];
        for (var i = 0; i < pivotValues.length; i++) {
            if (pivotValues[i]) {
                clonedSets[i] = [];
                for (var j = 0; j < pivotValues[i].length; j++) {
                    if (pivotValues[i][j]) {
                        clonedSets[i][j] = this.getClonedPivotValueObj(pivotValues[i][j]);
                    }
                }
            }
        }
        return clonedSets;
    };
    PivotUtil.getClonedPivotValueObj = function (data) {
        var keyPos = 0;
        /* tslint:disable:no-any */
        var framedSet = {};
        /* tslint:enable:no-any */
        if (!(data === null || data === undefined)) {
            var fields = Object.keys(data);
            while (keyPos < fields.length) {
                framedSet[fields[keyPos]] = data[fields[keyPos]];
                keyPos++;
            }
        }
        else {
            framedSet = data;
        }
        return framedSet;
    };
    /* tslint:disable:no-any */
    PivotUtil.getDefinedObj = function (data) {
        var keyPos = 0;
        var framedSet = {};
        /* tslint:enable:no-any */
        if (!(data === null || data === undefined)) {
            var fields = Object.keys(data);
            while (keyPos < fields.length) {
                if (!(data[fields[keyPos]] === null || data[fields[keyPos]] === undefined)) {
                    framedSet[fields[keyPos]] = data[fields[keyPos]];
                }
                keyPos++;
            }
        }
        else {
            framedSet = data;
        }
        return framedSet;
    };
    PivotUtil.inArray = function (value, collection) {
        if (collection) {
            for (var i = 0, cnt = collection.length; i < cnt; i++) {
                if (collection[i] === value) {
                    return i;
                }
            }
        }
        return -1;
    };
    PivotUtil.isContainCommonElements = function (collection1, collection2) {
        var isContain = false;
        for (var i = 0, cnt = collection1.length; i < cnt; i++) {
            for (var j = 0, lnt = collection2.length; j < lnt; j++) {
                if (collection2[j] === collection1[i]) {
                    return true;
                }
            }
        }
        return false;
    };
    /* tslint:disable:no-any */
    PivotUtil.setPivotProperties = function (control, properties) {
        control.allowServerDataBinding = false;
        if (control.pivotGridModule) {
            control.pivotGridModule.allowServerDataBinding = false;
        }
        control.setProperties(properties, true);
        control.allowServerDataBinding = true;
        if (control.pivotGridModule) {
            control.pivotGridModule.allowServerDataBinding = true;
        }
    };
    /* tslint:enable:no-any */
    PivotUtil.getClonedDataSourceSettings = function (dataSourceSettings) {
        var clonesDataSource = this.getDefinedObj({
            type: dataSourceSettings.type,
            catalog: dataSourceSettings.catalog,
            cube: dataSourceSettings.cube,
            providerType: dataSourceSettings.providerType,
            url: dataSourceSettings.url,
            localeIdentifier: dataSourceSettings.localeIdentifier,
            excludeFields: isNullOrUndefined(dataSourceSettings.excludeFields) ? [] : dataSourceSettings.excludeFields.slice(),
            expandAll: dataSourceSettings.expandAll,
            allowLabelFilter: dataSourceSettings.allowLabelFilter,
            allowValueFilter: dataSourceSettings.allowValueFilter,
            allowMemberFilter: dataSourceSettings.allowMemberFilter,
            enableSorting: dataSourceSettings.enableSorting ? true : false,
            rows: this.cloneFieldSettings(dataSourceSettings.rows),
            columns: this.cloneFieldSettings(dataSourceSettings.columns),
            filters: this.cloneFieldSettings(dataSourceSettings.filters),
            values: this.cloneFieldSettings(dataSourceSettings.values),
            filterSettings: this.cloneFilterSettings(dataSourceSettings.filterSettings),
            sortSettings: this.cloneSortSettings(dataSourceSettings.sortSettings),
            drilledMembers: this.cloneDrillMemberSettings(dataSourceSettings.drilledMembers),
            valueSortSettings: this.CloneValueSortObject(dataSourceSettings.valueSortSettings),
            valueAxis: dataSourceSettings.valueAxis,
            formatSettings: this.cloneFormatSettings(dataSourceSettings.formatSettings),
            calculatedFieldSettings: this.cloneCalculatedFieldSettings(dataSourceSettings.calculatedFieldSettings),
            fieldMapping: this.cloneFieldSettings(dataSourceSettings.fieldMapping),
            showSubTotals: dataSourceSettings.showSubTotals,
            showRowSubTotals: dataSourceSettings.showRowSubTotals,
            showColumnSubTotals: dataSourceSettings.showColumnSubTotals,
            showGrandTotals: dataSourceSettings.showGrandTotals,
            showRowGrandTotals: dataSourceSettings.showRowGrandTotals,
            showColumnGrandTotals: dataSourceSettings.showColumnGrandTotals,
            showHeaderWhenEmpty: dataSourceSettings.showHeaderWhenEmpty,
            alwaysShowValueHeader: dataSourceSettings.alwaysShowValueHeader,
            conditionalFormatSettings: this.cloneConditionalFormattingSettings(dataSourceSettings.conditionalFormatSettings),
            emptyCellsTextContent: dataSourceSettings.emptyCellsTextContent,
            groupSettings: this.cloneGroupSettings(dataSourceSettings.groupSettings),
            showAggregationOnValueField: dataSourceSettings.showAggregationOnValueField,
            authentication: this.CloneAuthenticationObject(dataSourceSettings.authentication),
        });
        /* tslint:enable:no-any */
        return clonesDataSource;
    };
    PivotUtil.updateDataSourceSettings = function (control, dataSourceSettings) {
        if (control) {
            this.setPivotProperties(control, {
                dataSourceSettings: this.getDefinedObj({
                    type: dataSourceSettings.type,
                    catalog: dataSourceSettings.catalog,
                    cube: dataSourceSettings.cube,
                    providerType: dataSourceSettings.providerType,
                    url: dataSourceSettings.url,
                    localeIdentifier: dataSourceSettings.localeIdentifier,
                    excludeFields: isNullOrUndefined(dataSourceSettings.excludeFields) ? [] : dataSourceSettings.excludeFields,
                    expandAll: dataSourceSettings.expandAll,
                    allowLabelFilter: dataSourceSettings.allowLabelFilter,
                    allowValueFilter: dataSourceSettings.allowValueFilter,
                    allowMemberFilter: dataSourceSettings.allowMemberFilter,
                    enableSorting: dataSourceSettings.enableSorting ? true : false,
                    rows: dataSourceSettings.rows,
                    columns: dataSourceSettings.columns,
                    filters: dataSourceSettings.filters,
                    values: dataSourceSettings.values,
                    filterSettings: dataSourceSettings.filterSettings,
                    sortSettings: dataSourceSettings.sortSettings,
                    drilledMembers: dataSourceSettings.drilledMembers,
                    valueSortSettings: dataSourceSettings.valueSortSettings,
                    valueAxis: dataSourceSettings.valueAxis,
                    formatSettings: dataSourceSettings.formatSettings,
                    calculatedFieldSettings: dataSourceSettings.calculatedFieldSettings,
                    fieldMapping: dataSourceSettings.fieldMapping,
                    showSubTotals: dataSourceSettings.showSubTotals,
                    showRowSubTotals: dataSourceSettings.showRowSubTotals,
                    showColumnSubTotals: dataSourceSettings.showColumnSubTotals,
                    showGrandTotals: dataSourceSettings.showGrandTotals,
                    showRowGrandTotals: dataSourceSettings.showRowGrandTotals,
                    showColumnGrandTotals: dataSourceSettings.showColumnGrandTotals,
                    showHeaderWhenEmpty: dataSourceSettings.showHeaderWhenEmpty,
                    alwaysShowValueHeader: dataSourceSettings.alwaysShowValueHeader,
                    conditionalFormatSettings: dataSourceSettings.conditionalFormatSettings,
                    emptyCellsTextContent: dataSourceSettings.emptyCellsTextContent,
                    groupSettings: dataSourceSettings.groupSettings,
                    showAggregationOnValueField: dataSourceSettings.showAggregationOnValueField,
                    authentication: this.CloneAuthenticationObject(dataSourceSettings.authentication),
                })
                /* tslint:enable:no-any */
            });
        }
    };
    PivotUtil.cloneFieldSettings = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_1 = collection; _i < collection_1.length; _i++) {
                var set = collection_1[_i];
                var field = {};
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    caption: set.caption,
                    axis: set.axis,
                    baseField: set.baseField,
                    baseItem: set.baseItem,
                    isCalculatedField: set.isCalculatedField,
                    isNamedSet: set.isNamedSet,
                    showNoDataItems: set.showNoDataItems,
                    showSubTotals: set.showSubTotals,
                    type: set.type,
                    dataType: set.dataType,
                    showFilterIcon: set.showFilterIcon,
                    showSortIcon: set.showSortIcon,
                    showRemoveIcon: set.showRemoveIcon,
                    showValueTypeIcon: set.showValueTypeIcon,
                    showEditIcon: set.showEditIcon,
                    allowDragAndDrop: set.allowDragAndDrop
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.cloneFilterSettings = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_2 = collection; _i < collection_2.length; _i++) {
                var set = collection_2[_i];
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    type: set.type,
                    condition: set.condition,
                    items: set.items ? set.items.slice() : set.items,
                    levelCount: set.levelCount,
                    measure: set.measure,
                    selectedField: set.selectedField,
                    showDateFilter: set.showDateFilter,
                    showLabelFilter: set.showLabelFilter,
                    showNumberFilter: set.showNumberFilter,
                    value1: set.value1,
                    value2: set.value2
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.cloneSortSettings = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_3 = collection; _i < collection_3.length; _i++) {
                var set = collection_3[_i];
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    order: set.order
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.cloneDrillMemberSettings = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_4 = collection; _i < collection_4.length; _i++) {
                var set = collection_4[_i];
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    delimiter: set.delimiter,
                    items: set.items ? set.items.slice() : set.items
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.cloneFormatSettings = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_5 = collection; _i < collection_5.length; _i++) {
                var set = collection_5[_i];
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    calendar: set.calendar,
                    currency: set.currency,
                    format: set.format,
                    maximumFractionDigits: set.maximumFractionDigits,
                    maximumSignificantDigits: set.maximumSignificantDigits,
                    minimumFractionDigits: set.minimumFractionDigits,
                    minimumIntegerDigits: set.minimumIntegerDigits,
                    minimumSignificantDigits: set.minimumSignificantDigits,
                    skeleton: set.skeleton,
                    type: set.type,
                    useGrouping: set.useGrouping
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.CloneValueSortObject = function (collection) {
        if (collection) {
            var clonedCollection = {
                columnIndex: collection.columnIndex,
                headerDelimiter: collection.headerDelimiter,
                headerText: collection.headerText,
                measure: collection.measure,
                sortOrder: collection.sortOrder
            };
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.CloneAuthenticationObject = function (collection) {
        if (collection) {
            var clonedCollection = {
                userName: collection.userName,
                password: collection.password
            };
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.cloneCalculatedFieldSettings = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_6 = collection; _i < collection_6.length; _i++) {
                var set = collection_6[_i];
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    formatString: set.formatString,
                    formula: set.formula,
                    hierarchyUniqueName: set.hierarchyUniqueName
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.cloneConditionalFormattingSettings = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_7 = collection; _i < collection_7.length; _i++) {
                var set = collection_7[_i];
                clonedCollection.push(this.getDefinedObj({
                    applyGrandTotals: set.applyGrandTotals,
                    conditions: set.conditions,
                    label: set.label,
                    measure: set.measure,
                    style: set.style ? {
                        backgroundColor: set.style.backgroundColor,
                        color: set.style.color,
                        fontFamily: set.style.fontFamily,
                        fontSize: set.style.fontSize
                    } : set.style,
                    value1: set.value1,
                    value2: set.value2
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.cloneGroupSettings = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_8 = collection; _i < collection_8.length; _i++) {
                var set = collection_8[_i];
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    caption: set.caption,
                    customGroups: this.cloneCustomGroups(set.customGroups),
                    endingAt: set.endingAt,
                    startingAt: set.startingAt,
                    groupInterval: set.groupInterval,
                    rangeInterval: set.rangeInterval,
                    type: set.type
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.cloneCustomGroups = function (collection) {
        if (collection) {
            var clonedCollection = [];
            for (var _i = 0, collection_9 = collection; _i < collection_9.length; _i++) {
                var set = collection_9[_i];
                clonedCollection.push(this.getDefinedObj({
                    groupName: set.groupName,
                    items: set.items ? set.items.slice() : set.items
                    /* tslint:disable:no-any */
                }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        }
        else {
            return collection;
        }
    };
    PivotUtil.getFilterItemByName = function (fieldName, fields) {
        var filterItems = new DataManager({ json: fields }).executeLocal(new Query().where('name', 'equal', fieldName));
        if (filterItems && filterItems.length > 0) {
            return filterItems[filterItems.length - 1];
        }
        return undefined;
    };
    /* tslint:disable-next-line:max-line-length */
    PivotUtil.getFieldByName = function (fieldName, fields) {
        return new DataManager({ json: fields }).executeLocal(new Query().where('name', 'equal', fieldName))[0];
    };
    PivotUtil.getFieldInfo = function (fieldName, control) {
        var rows = this.cloneFieldSettings(control.dataSourceSettings.rows);
        var columns = this.cloneFieldSettings(control.dataSourceSettings.columns);
        var values = this.cloneFieldSettings(control.dataSourceSettings.values);
        var filters = this.cloneFieldSettings(control.dataSourceSettings.filters);
        var fields = [rows, columns, values, filters];
        for (var i = 0, len = fields.length; i < len; i++) {
            for (var j = 0, cnt = (fields[i] ? fields[i].length : 0); j < cnt; j++) {
                if (fields[i][j] && fields[i][j].name === fieldName) {
                    /* tslint:disable-next-line:max-line-length */
                    return { fieldName: fieldName, fieldItem: fields[i][j], axis: i === 0 ? 'rows' : i === 1 ? 'columns' : i === 2 ? 'values' : 'filters', position: j };
                }
            }
        }
        var fieldList = control.dataType === 'olap' ?
            control.olapEngineModule.fieldList[fieldName] : control.engineModule.fieldList[fieldName];
        var fieldItem = (fieldList ? {
            name: fieldName,
            caption: fieldList.caption,
            baseField: fieldList.baseField,
            baseItem: fieldList.baseItem,
            isCalculatedField: fieldList.isCalculatedField,
            isNamedSet: fieldList.isNamedSets,
            showNoDataItems: fieldList.showNoDataItems,
            showSubTotals: fieldList.showSubTotals,
            type: fieldList.aggregateType,
            showFilterIcon: fieldList.showFilterIcon,
            showSortIcon: fieldList.showSortIcon,
            showRemoveIcon: fieldList.showRemoveIcon,
            showValueTypeIcon: fieldList.showValueTypeIcon,
            showEditIcon: fieldList.showEditIcon,
            allowDragAndDrop: fieldList.allowDragAndDrop
        } : undefined);
        return { fieldName: fieldName, fieldItem: fieldItem, axis: 'fieldlist', position: -1 };
    };
    /* tslint:disable-next-line:max-line-length */
    PivotUtil.isButtonIconRefesh = function (prop, oldProp, newProp) {
        var isButtonRefresh = false;
        try {
            if (prop === 'dataSourceSettings' && oldProp.dataSourceSettings && newProp.dataSourceSettings) {
                var propValidation = ['notAvail', 'notAvail', 'notAvail', 'notAvail'];
                var oldAxesProp = Object.keys(oldProp.dataSourceSettings);
                var newAxesProp = Object.keys(newProp.dataSourceSettings);
                if (oldAxesProp && newAxesProp && newAxesProp.length > 0 && oldAxesProp.length === newAxesProp.length) {
                    var axes = ['rows', 'columns', 'values', 'filters'];
                    /* tslint:disable:no-any */
                    for (var i = 0; i < newAxesProp.length; i++) {
                        var oldAxis = (newAxesProp[i] in oldProp.dataSourceSettings && !isNullOrUndefined(oldProp.dataSourceSettings[newAxesProp[i]])) ? Object.keys(oldProp.dataSourceSettings[newAxesProp[i]]) : [];
                        var newAxis = (newAxesProp[i] in newProp.dataSourceSettings && !isNullOrUndefined(newProp.dataSourceSettings[newAxesProp[i]])) ? Object.keys(newProp.dataSourceSettings[newAxesProp[i]]) : [];
                        if (axes.indexOf(newAxesProp[i]) !== -1 && axes.indexOf(oldAxesProp[i]) !== -1 &&
                            oldAxis && newAxis && newAxis.length > 0 && oldAxis.length === newAxis.length) {
                            /* tslint:disable-next-line:max-line-length */
                            var options = ['showFilterIcon', 'showSortIcon', 'showRemoveIcon', 'showValueTypeIcon', 'showEditIcon', 'allowDragAndDrop'];
                            for (var j = 0; j < newAxis.length; j++) {
                                var oldAxisProp = Object.keys(oldProp.dataSourceSettings[newAxesProp[i]][newAxis[j]]);
                                var newAxisProp = Object.keys(newProp.dataSourceSettings[newAxesProp[i]][newAxis[j]]);
                                for (var k = 0; k < newAxisProp.length; k++) {
                                    if (options.indexOf(newAxisProp[k]) !== -1 && options.indexOf(oldAxisProp[k]) !== -1) {
                                        propValidation[i] = 'update';
                                    }
                                    else {
                                        propValidation[i] = 'break';
                                        break;
                                    }
                                }
                                if (propValidation[i] === 'break') {
                                    break;
                                }
                            }
                        }
                        else {
                            propValidation[i] = 'break';
                        }
                        if (propValidation[i] === 'break') {
                            break;
                        }
                    }
                    /* tslint:enable:no-any */
                }
                var a = 0;
                var b = 0;
                var c = 0;
                for (var _i = 0, propValidation_1 = propValidation; _i < propValidation_1.length; _i++) {
                    var validation = propValidation_1[_i];
                    if (validation === 'break') {
                        a++;
                    }
                    if (validation === 'notAvail') {
                        b++;
                    }
                    if (validation === 'update') {
                        c++;
                    }
                }
                isButtonRefresh = (a > 0 || b === 4) ? false : (a === 0 && b < 4 && c > 0);
            }
        }
        catch (exception) {
            isButtonRefresh = false;
        }
        return isButtonRefresh;
    };
    /* tslint:disable:no-any */
    PivotUtil.formatPivotValues = function (pivotValues) {
        var values = [];
        for (var i = 0; i < pivotValues.length; i++) {
            if (pivotValues[i]) {
                values[i] = [];
                for (var j = 0; j < pivotValues[i].length; j++) {
                    if (pivotValues[i][j]) {
                        values[i][j] = {
                            axis: pivotValues[i][j].Axis,
                            actualText: pivotValues[i][j].ActualText,
                            indexObject: pivotValues[i][j].IndexObject,
                            index: pivotValues[i][j].Index,
                            rowHeaders: pivotValues[i][j].RowHeaders,
                            columnHeaders: pivotValues[i][j].ColumnHeaders,
                            formattedText: pivotValues[i][j].FormattedText,
                            actualValue: pivotValues[i][j].ActualValue,
                            rowIndex: pivotValues[i][j].RowIndex,
                            colIndex: pivotValues[i][j].ColIndex,
                            colSpan: pivotValues[i][j].ColSpan,
                            level: pivotValues[i][j].Level,
                            rowSpan: pivotValues[i][j].RowSpan,
                            isSum: pivotValues[i][j].IsSum,
                            isGrandSum: pivotValues[i][j].IsGrandSum,
                            valueSort: pivotValues[i][j].ValueSort,
                            ordinal: pivotValues[i][j].Ordinal,
                            hasChild: pivotValues[i][j].HasChild,
                            isDrilled: pivotValues[i][j].IsDrilled,
                            value: pivotValues[i][j].Value,
                            type: pivotValues[i][j].Type,
                            members: pivotValues[i][j].Members
                        };
                    }
                }
            }
        }
        return values;
    };
    PivotUtil.formatPdfHeaderFooter = function (pdf) {
        var contents = [];
        if (!isNullOrUndefined(pdf)) {
            for (var i = 0; i < pdf.length; i++) {
                var a = pdf[i];
                var content = {
                    type: a.Type,
                    pageNumberType: a.PageNumberType,
                    style: a.Style ? {
                        penColor: a.Style.PenColor,
                        penSize: a.Style.PenSize,
                        dashStyle: a.Style.DashStyle,
                        textBrushColor: a.Style.TextBrushColor,
                        textPenColor: a.Style.TextPenColor,
                        fontSize: a.Style.FontSize,
                        hAlign: a.Style.HAlign,
                        vAlign: a.Style.VAlign
                    } : a.Style,
                    points: a.Points !== null ? {
                        x1: a.Points.X1,
                        y1: a.Points.Y1,
                        x2: a.Points.X2,
                        y2: a.Points.Y2
                    } : null,
                    format: a.Format,
                    position: a.Position !== null ? {
                        x: a.Position.X,
                        y: a.Position.Y,
                    } : null,
                    size: a.Size !== null ? {
                        height: a.Size.Height,
                        width: a.Size.Width,
                    } : null,
                    src: a.Src,
                    value: a.Value,
                    font: a.Font
                };
                contents.push(content);
            }
        }
        return contents;
    };
    /* tslint:disable:no-any */
    PivotUtil.formatPdfExportProperties = function (pdf) {
        var values;
        values = this.getDefinedObj({
            pageOrientation: typeof pdf.PageOrientation === 'string' ? pdf.PageOrientation : null,
            pageSize: typeof pdf.PageSize === 'string' ? pdf.PageSize : null,
            header: !isNullOrUndefined(pdf.Header) ? {
                fromTop: pdf.Header.FromTop,
                height: pdf.Header.Height,
                contents: this.formatPdfHeaderFooter(pdf.Header.Contents),
            } : null,
            columns: pdf.Columns,
            footer: !isNullOrUndefined(pdf.Footer) ? {
                fromTop: pdf.Footer.FromBottom,
                height: pdf.Footer.Height,
                contents: this.formatPdfHeaderFooter(pdf.Footer.Contents),
            } : null,
            includeHiddenColumn: pdf.IncludeHiddenColumn,
            dataSource: pdf.DataSource,
            exportType: typeof pdf.ExportType === 'string' ? pdf.ExportType : null,
            theme: !isNullOrUndefined(pdf.Theme) ? {
                header: pdf.Theme.Header,
                record: pdf.Theme.Record,
                caption: pdf.Theme.Caption
            } : null,
            fileName: pdf.FileName,
            hierarchyExportMode: typeof pdf.HierarchyExportMode === 'string' ? pdf.HierarchyExportMode : null,
            allowHorizontalOverflow: pdf.AllowHorizontalOverflow
        });
        return values;
    };
    PivotUtil.formatExcelStyle = function (style) {
        var prop;
        if (!isNullOrUndefined(style)) {
            prop = this.getDefinedObj({
                fontColor: style.FontColor,
                fontName: style.FontName,
                fontSize: style.FontSize,
                hAlign: style.HAlign === String ? style.HAlign : null,
                vAlign: style.VAlign === String ? style.VAlign : null,
                bold: style.Bold,
                indent: style.Indent,
                italic: style.Italic,
                underline: style.Underline,
                backColor: style.BackColor,
                wrapText: style.WrapText,
                borders: style.Borders,
                numberFormat: style.NumberFormat,
                type: style.Type
            });
        }
        return prop;
    };
    PivotUtil.formatExcelCell = function (cell) {
        var cells = [];
        if (!isNullOrUndefined(cell)) {
            for (var i = 0; i < cell.length; i++) {
                var prop = this.getDefinedObj({
                    index: !isNullOrUndefined(cell[i].Index) ? cell[i].Index : null,
                    colSpan: !isNullOrUndefined(cell[i].ColSpan) ? cell[i].ColSpan : null,
                    value: !isNullOrUndefined(cell[i].Value) ? cell[i].Value : null,
                    hyperlink: {
                        target: !isNullOrUndefined(cell[i].Hyperlink) ? cell[i].Hyperlink.Target : null,
                        displayText: !isNullOrUndefined(cell[i].Hyperlink) ? cell[i].Hyperlink.DisplayText : null
                    },
                    styles: this.formatExcelStyle(cell[i].Style),
                    rowSpan: !isNullOrUndefined(cell[i].RowSpan) ? cell[i].RowSpan : null
                });
            }
        }
        return cells;
    };
    PivotUtil.formatExcelHeaderFooter = function (excel) {
        var rows = [];
        if (!isNullOrUndefined(excel)) {
            for (var i = 0; i < excel.Rows.length; i++) {
                var row = excel.Rows[i];
                var prop = this.getDefinedObj({
                    index: !isNullOrUndefined(row.Index) ? row.Index : null,
                    cells: this.formatExcelCell(row.Cells),
                    grouping: !isNullOrUndefined(row.Grouping) ? row.Grouping : null
                });
                rows.push(prop);
            }
        }
        return rows;
    };
    PivotUtil.formatExcelExportProperties = function (excel) {
        var prop;
        prop = this.getDefinedObj({
            dataSource: excel.DataSource,
            query: excel.Query,
            multipleExport: this.getDefinedObj({
                type: !isNullOrUndefined(excel.MultipleExport) ? excel.MultipleExport.Type : null,
                blankRows: !isNullOrUndefined(excel.MultipleExport) ? excel.MultipleExport.BlankRows : null
            }),
            header: this.getDefinedObj({
                headerRows: !isNullOrUndefined(excel.Header) ? excel.Header.HeaderRows : null,
                rows: this.formatExcelHeaderFooter(excel.Header)
            }),
            footer: this.getDefinedObj({
                footerRows: !isNullOrUndefined(excel.Footer) ? excel.Footer.FooterRows : null,
                rows: this.formatExcelHeaderFooter(excel.Footer)
            }),
            columns: excel.Columns,
            exportType: typeof excel.ExportType === 'string' ? excel.ExportType : undefined,
            includeHiddenColumn: excel.IncludeHiddenColumn,
            theme: !isNullOrUndefined(excel.Theme) ? {
                header: this.formatExcelStyle(excel.Theme.Header),
                record: this.formatExcelStyle(excel.Theme.Record),
                caption: this.formatExcelStyle(excel.Theme.Caption)
            } : undefined,
            fileName: excel.FileName,
            hierarchyExportMode: typeof excel.HierarchyExportMode === 'string' ? excel.HierarchyExportMode : undefined
        });
        return prop;
    };
    /* tslint:disable:no-any */
    PivotUtil.formatFieldList = function (fieldList) {
        var keys = Object.keys(fieldList);
        var fList = {};
        for (var i = 0; i < keys.length; i++) {
            if (fieldList[keys[i]]) {
                fList[keys[i]] = {
                    id: fieldList[keys[i]].Id,
                    caption: fieldList[keys[i]].Caption,
                    type: fieldList[keys[i]].Type,
                    formatString: fieldList[keys[i]].FormatString,
                    index: fieldList[keys[i]].Index,
                    members: fieldList[keys[i]].Members,
                    formattedMembers: fieldList[keys[i]].FormattedMembers,
                    dateMember: fieldList[keys[i]].DateMember,
                    filter: fieldList[keys[i]].Filter,
                    sort: fieldList[keys[i]].Sort,
                    aggregateType: fieldList[keys[i]].AggregateType,
                    baseField: fieldList[keys[i]].BaseField,
                    baseItem: fieldList[keys[i]].BaseItem,
                    filterType: fieldList[keys[i]].FilterType,
                    format: fieldList[keys[i]].Format,
                    formula: fieldList[keys[i]].Formula,
                    isSelected: fieldList[keys[i]].IsSelected,
                    isExcelFilter: fieldList[keys[i]].IsExcelFilter,
                    showNoDataItems: fieldList[keys[i]].ShowNoDataItems,
                    isCustomField: fieldList[keys[i]].IsCustomField,
                    showFilterIcon: fieldList[keys[i]].ShowFilterIcon,
                    showSortIcon: fieldList[keys[i]].ShowSortIcon,
                    showRemoveIcon: fieldList[keys[i]].ShowRemoveIcon,
                    showEditIcon: fieldList[keys[i]].ShowEditIcon,
                    showValueTypeIcon: fieldList[keys[i]].ShowValueTypeIcon,
                    allowDragAndDrop: fieldList[keys[i]].AllowDragAndDrop,
                    isCalculatedField: fieldList[keys[i]].IsCalculatedField,
                    showSubTotals: fieldList[keys[i]].ShowSubTotals
                };
            }
        }
        return fList;
    };
    PivotUtil.frameContent = function (pivotValues, type, rowPosition, control) {
        var dataContent = [];
        var pivot = control;
        if (pivot.dataSourceSettings.values.length > 0 && !pivot.engineModule.isEmptyData) {
            if ((pivot.enableValueSorting) || !pivot.engineModule.isEngineUpdated) {
                var rowCnt = 0;
                var start = type === 'value' ? rowPosition : 0;
                var end = type === 'value' ? pivotValues.length : rowPosition;
                for (var rCnt = start; rCnt < end; rCnt++) {
                    if (pivotValues[rCnt]) {
                        rowCnt = type === 'header' ? rCnt : rowCnt;
                        dataContent[rowCnt] = {};
                        for (var cCnt = 0; cCnt < pivotValues[rCnt].length; cCnt++) {
                            if (pivotValues[rCnt][cCnt]) {
                                dataContent[rowCnt][cCnt] = pivotValues[rCnt][cCnt];
                            }
                        }
                        rowCnt++;
                    }
                }
            }
        }
        return dataContent;
    };
    PivotUtil.getLocalizedObject = function (control) {
        var locale = new Object();
        locale["Null"] = control.localeObj.getConstant('null');
        locale["Years"] = control.localeObj.getConstant('Years');
        locale["Quarters"] = control.localeObj.getConstant('Quarters');
        locale["Months"] = control.localeObj.getConstant('Months');
        locale["Days"] = control.localeObj.getConstant('Days');
        locale["Hours"] = control.localeObj.getConstant('Hours');
        locale["Minutes"] = control.localeObj.getConstant('Minutes');
        locale["Seconds"] = control.localeObj.getConstant('Seconds');
        locale["QuarterYear"] = control.localeObj.getConstant('QuarterYear');
        locale["Of"] = control.localeObj.getConstant('of');
        locale["Qtr"] = control.localeObj.getConstant('qtr');
        locale["Undefined"] = control.localeObj.getConstant('undefined');
        locale["GroupOutOfRange"] = control.localeObj.getConstant('groupOutOfRange');
        locale["Group"] = control.localeObj.getConstant('group');
        return locale;
    };
    PivotUtil.updateReport = function (control, report) {
        control.setProperties({ dataSourceSettings: { rows: [] } }, true);
        control.setProperties({ dataSourceSettings: { columns: [] } }, true);
        control.setProperties({ dataSourceSettings: { formatSettings: [] } }, true);
        for (var i = 0; i < report.Rows.length; i++) {
            control.dataSourceSettings.rows.push({
                name: report.Rows[i].Name,
                caption: report.Rows[i].Caption,
                showNoDataItems: report.Rows[i].ShowNoDataItems,
                baseField: report.Rows[i].BaseField,
                baseItem: report.Rows[i].BaseItem,
                showFilterIcon: report.Rows[i].ShowFilterIcon,
                showSortIcon: report.Rows[i].ShowSortIcon,
                showEditIcon: report.Rows[i].ShowEditIcon,
                showRemoveIcon: report.Rows[i].ShowRemoveIcon,
                showSubTotals: report.Rows[i].ShowValueTypeIcon,
                allowDragAndDrop: report.Rows[i].AllowDragAndDrop,
                axis: report.Rows[i].Axis,
                dataType: report.Rows[i].DataType,
                isCalculatedField: report.Rows[i].IsCalculatedField,
                showValueTypeIcon: report.Rows[i].ShowValueTypeIcon,
                type: report.Rows[i].Type
            });
        }
        for (var i = 0; i < report.Columns.length; i++) {
            control.dataSourceSettings.columns.push({
                name: report.Columns[i].Name,
                caption: report.Columns[i].Caption,
                showNoDataItems: report.Columns[i].ShowNoDataItems,
                baseField: report.Columns[i].BaseField,
                baseItem: report.Columns[i].BaseItem,
                showFilterIcon: report.Columns[i].ShowFilterIcon,
                showSortIcon: report.Columns[i].ShowSortIcon,
                showEditIcon: report.Columns[i].ShowEditIcon,
                showRemoveIcon: report.Columns[i].ShowRemoveIcon,
                showSubTotals: report.Columns[i].ShowValueTypeIcon,
                allowDragAndDrop: report.Columns[i].AllowDragAndDrop,
                axis: report.Columns[i].Axis,
                dataType: report.Columns[i].DataType,
                isCalculatedField: report.Columns[i].IsCalculatedField,
                showValueTypeIcon: report.Columns[i].ShowValueTypeIcon,
                type: report.Columns[i].Type
            });
        }
        for (var i = 0; i < report.FormatSettings.length; i++) {
            control.dataSourceSettings.formatSettings.push({
                name: report.FormatSettings[i].Name,
                format: report.FormatSettings[i].Format,
                type: report.FormatSettings[i].Type,
                currency: report.FormatSettings[i].Currency,
                maximumFractionDigits: report.FormatSettings[i].MaximumFractionDigits,
                maximumSignificantDigits: report.FormatSettings[i].MaximumSignificantDigits,
                minimumFractionDigits: report.FormatSettings[i].MinimumFractionDigits,
                minimumIntegerDigits: report.FormatSettings[i].MinimumIntegerDigits,
                minimumSignificantDigits: report.FormatSettings[i].MinimumSignificantDigits,
                skeleton: report.FormatSettings[i].Skeleton,
                useGrouping: report.FormatSettings[i].UseGrouping
            });
        }
    };
    PivotUtil.generateUUID = function () {
        var d = new Date().getTime();
        var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;
            if (d > 0) {
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            }
            else {
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };
    return PivotUtil;
}());
export { PivotUtil };
