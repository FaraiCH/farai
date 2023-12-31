import { contentReady } from '../../common/base/constant';
import * as events from '../../common/base/constant';
import { DrillThroughDialog } from '../../common/popups/drillthrough-dialog';
import { EventHandler, isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
/**
 * `DrillThrough` module.
 */
var DrillThrough = /** @class */ (function () {
    /**
     * Constructor.
     * @hidden
     */
    function DrillThrough(parent) {
        this.parent = parent;
        this.drillThroughDialog = new DrillThroughDialog(this.parent);
        this.addInternalEvents();
    }
    /**
     * It returns the Module name.
     * @returns string
     * @hidden
     */
    DrillThrough.prototype.getModuleName = function () {
        return 'drillthrough';
    };
    DrillThrough.prototype.addInternalEvents = function () {
        this.parent.on(contentReady, this.wireEvents, this);
    };
    DrillThrough.prototype.wireEvents = function () {
        this.unWireEvents();
        EventHandler.add(this.parent.element, 'dblclick', this.mouseClickHandler, this);
    };
    DrillThrough.prototype.unWireEvents = function () {
        EventHandler.remove(this.parent.element, 'dblclick', this.mouseClickHandler);
    };
    DrillThrough.prototype.mouseClickHandler = function (e) {
        var target = e.target;
        var ele = null;
        if (target.classList.contains('e-stackedheadercelldiv') || target.classList.contains('e-cellvalue') ||
            target.classList.contains('e-headercelldiv')) {
            ele = target.parentElement;
        }
        else if (target.classList.contains('e-headercell') || target.classList.contains('e-rowcell')) {
            ele = target;
        }
        else if (target.classList.contains('e-headertext')) {
            ele = target.parentElement.parentElement;
        }
        if (ele) {
            if (this.parent.allowDrillThrough && ele.classList.contains('e-valuescontent') || this.parent.editSettings.allowEditing) {
                var colIndex = Number(ele.getAttribute('aria-colindex'));
                var rowIndex = Number(ele.getAttribute('index'));
                this.executeDrillThrough(this.parent.pivotValues[rowIndex][colIndex], rowIndex, colIndex, ele);
            }
        }
    };
    /** @hidden */
    DrillThrough.prototype.executeDrillThrough = function (pivotValue, rowIndex, colIndex, element) {
        this.parent.drillThroughElement = element;
        this.parent.drillThroughValue = pivotValue;
        var engine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
        var valueCaption = '';
        var aggType = '';
        var rawData = [];
        if (pivotValue.rowHeaders !== undefined && pivotValue.columnHeaders !== undefined && !isNullOrUndefined(pivotValue.value)) {
            if (this.parent.dataType === 'olap') {
                var tupleInfo = void 0;
                if (this.parent.dataSourceSettings.valueAxis === 'row') {
                    tupleInfo = engine.tupRowInfo[pivotValue.rowOrdinal];
                }
                else {
                    tupleInfo = engine.tupColumnInfo[pivotValue.colOrdinal];
                }
                var measureName = tupleInfo ?
                    engine.getUniqueName(tupleInfo.measureName) : pivotValue.actualText;
                if (engine.fieldList[measureName] && engine.fieldList[measureName].isCalculatedField) {
                    this.parent.pivotCommon.errorDialog.createErrorDialog(this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('drillError'));
                    return;
                }
                valueCaption = engine.fieldList[measureName || pivotValue.actualText].caption;
                aggType = engine.fieldList[measureName || pivotValue.actualText].aggregateType;
                this.parent.olapEngineModule.getDrillThroughData(pivotValue, this.parent.maxRowsInDrillThrough);
                try {
                    rawData = JSON.parse(engine.gridJSON);
                }
                catch (exception) {
                    this.parent.pivotCommon.errorDialog.createErrorDialog(this.parent.localeObj.getConstant('error'), engine.gridJSON);
                    return;
                }
            }
            else {
                valueCaption = engine.fieldList[pivotValue.actualText.toString()] ?
                    engine.fieldList[pivotValue.actualText.toString()].caption : pivotValue.actualText.toString();
                aggType = engine.fieldList[pivotValue.actualText] ? engine.fieldList[pivotValue.actualText].aggregateType : '';
                var currModule_1 = this;
                if (isBlazor() && this.parent.enableVirtualization) {
                    /* tslint:disable:no-any */
                    currModule_1.parent.interopAdaptor.invokeMethodAsync('PivotInteropMethod', 'fetchRawData', { 'RowIndex': rowIndex, 'ColumnIndex': colIndex }).then(function (data) {
                        rawData = JSON.parse(data.rawData);
                        var parsedObj = JSON.parse(data.indexObject);
                        var indexObject = {};
                        for (var len = 0; len < parsedObj.length; len++) {
                            indexObject[parsedObj[len].Key] = parsedObj[len].Value;
                        }
                        pivotValue.indexObject = indexObject;
                        currModule_1.triggerDialog(valueCaption, aggType, rawData, pivotValue, element);
                        /* tslint:enable:no-any */
                    });
                }
                else if (this.parent.dataSourceSettings.mode === 'Server') {
                    this.parent.getEngine('fetchRawData', null, null, null, null, null, null, { rowIndex: rowIndex, columnIndex: colIndex });
                }
                else {
                    if (this.parent.enableVirtualization && this.parent.allowDataCompression) {
                        var indexArray = Object.keys(pivotValue.indexObject);
                        this.drillThroughDialog.indexString = [];
                        for (var _i = 0, indexArray_1 = indexArray; _i < indexArray_1.length; _i++) {
                            var cIndex = indexArray_1[_i];
                            for (var _a = 0, _b = this.parent.engineModule.groupRawIndex[Number(cIndex)]; _a < _b.length; _a++) {
                                var aIndex = _b[_a];
                                rawData.push(this.parent.engineModule.actualData[aIndex]);
                                this.drillThroughDialog.indexString.push(aIndex.toString());
                            }
                        }
                    }
                    else {
                        var indexArray = Object.keys(pivotValue.indexObject);
                        for (var _c = 0, indexArray_2 = indexArray; _c < indexArray_2.length; _c++) {
                            var index = indexArray_2[_c];
                            rawData.push(this.parent.engineModule.data[Number(index)]);
                        }
                    }
                }
            }
            if (!(isBlazor() && this.parent.enableVirtualization) && this.parent.dataSourceSettings.mode !== 'Server') {
                this.triggerDialog(valueCaption, aggType, rawData, pivotValue, element);
            }
        }
    };
    /* tslint:disable:typedef no-any */
    DrillThrough.prototype.frameData = function (eventArgs) {
        var keyPos = 0;
        var dataPos = 0;
        var data = [];
        while (dataPos < eventArgs.rawData.length) {
            var framedHeader = {};
            while (keyPos < eventArgs.gridColumns.length) {
                framedHeader[eventArgs.gridColumns[keyPos].field] = this.parent.dataSourceSettings.mode === 'Server' ?
                    eventArgs.rawData[dataPos][this.parent.engineModule.fields.indexOf(eventArgs.gridColumns[keyPos].field) !== -1 ? this.parent.engineModule.fields.indexOf(eventArgs.gridColumns[keyPos].field) : 0] :
                    eventArgs.rawData[dataPos][this.parent.engineModule.fieldKeys[eventArgs.gridColumns[keyPos].field]];
                keyPos++;
            }
            data.push(framedHeader);
            dataPos++;
            keyPos = 0;
        }
        eventArgs.rawData = data;
        return eventArgs;
    };
    /** @hidden */
    DrillThrough.prototype.triggerDialog = function (valueCaption, aggType, rawData, pivotValue, element) {
        var valuetText = aggType === 'CalculatedField' ? valueCaption.toString() : aggType !== '' ?
            (this.parent.localeObj.getConstant(aggType) + ' ' + this.parent.localeObj.getConstant('of') + ' ' + valueCaption) :
            valueCaption;
        var eventArgs = {
            currentTarget: element,
            currentCell: pivotValue,
            rawData: rawData,
            rowHeaders: pivotValue.rowHeaders === '' ? '' : pivotValue.rowHeaders.toString().split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).join(' - '),
            columnHeaders: pivotValue.columnHeaders === '' ? '' : pivotValue.columnHeaders.toString().split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).join(' - '),
            value: valuetText + '(' + pivotValue.formattedText + ')',
            gridColumns: this.drillThroughDialog.frameGridColumns(rawData),
            cancel: false
        };
        if (this.parent.dataSourceSettings.type === 'CSV') {
            eventArgs = this.frameData(eventArgs);
        }
        var drillThrough = this;
        var gridColumns = eventArgs.gridColumns;
        this.parent.trigger(events.drillThrough, eventArgs, function (observedArgs) {
            if (isBlazor()) {
                for (var i = 0; i < observedArgs.gridColumns.length; i++) {
                    if (gridColumns[i].field === observedArgs.gridColumns[i].field) {
                        gridColumns[i].field = observedArgs.gridColumns[i].field;
                        gridColumns[i].editType = observedArgs.gridColumns[i].editType;
                        gridColumns[i].headerText = observedArgs.gridColumns[i].headerText;
                        gridColumns[i].type = observedArgs.gridColumns[i].type;
                        gridColumns[i].validationRules = observedArgs.gridColumns[i].validationRules;
                        gridColumns[i].visible = observedArgs.gridColumns[i].visible;
                        gridColumns[i].width = observedArgs.gridColumns[i].width;
                    }
                }
                observedArgs.gridColumns = gridColumns;
            }
            if (!eventArgs.cancel) {
                drillThrough.drillThroughDialog.showDrillThroughDialog(observedArgs);
            }
        });
    };
    return DrillThrough;
}());
export { DrillThrough };
