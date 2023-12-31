import { extend, Internationalization, isNullOrUndefined, Ajax } from '@syncfusion/ej2-base';
import { PivotUtil } from '../util';
import { MDXQuery } from './mdx-query';
import * as cls from '../../common/base/css-constant';
/**
 * OlapEngine is used to manipulate the olap or Multi-Dimensional data as pivoting values.
 */
/** @hidden */
var OlapEngine = /** @class */ (function () {
    function OlapEngine() {
        /** @hidden */
        this.fieldList = {};
        /** @hidden */
        this.columnCount = 0;
        /** @hidden */
        this.rowCount = 0;
        /** @hidden */
        this.colFirstLvl = 0;
        /** @hidden */
        this.rowFirstLvl = 0;
        /** @hidden */
        this.pageColStartPos = 0;
        /** @hidden */
        this.enableSort = false;
        /** @hidden */
        this.enableValueSorting = false;
        /** @hidden */
        this.dataFields = {};
        /** @hidden */
        this.formatFields = {};
        /** @hidden */
        this.filterMembers = {};
        /** @hidden */
        this.drilledSets = {};
        /** @hidden */
        this.aggregatedValueMatrix = [];
        /* tslint:disable-next-line:max-line-length */
        this.customRegex = /^(('[^']+'|''|[^*#@0,.])*)(\*.)?((([0#,]*[0,]*[0#]*)(\.[0#]*)?)|([#,]*@+#*))(E\+?0+)?(('[^']+'|''|[^*#@0,.E])*)$/;
        this.formatRegex = /(^[ncpae]{1})([0-1]?[0-9]|20)?$/i;
        /** @hidden */
        this.pivotValues = [];
        /** @hidden */
        this.valueContent = [];
        /** @hidden */
        this.headerContent = [];
        /** @hidden */
        this.rowStartPos = 0;
        /** @hidden */
        this.pageRowStartPos = 0;
        /** @hidden */
        this.tupColumnInfo = [];
        /** @hidden */
        this.tupRowInfo = [];
        /** @hidden */
        this.gridJSON = '';
        /** @hidden */
        this.namedSetsPosition = {};
        this.colDepth = 0;
        this.totalCollection = [];
        this.parentObjCollection = {};
        this.curDrillEndPos = -1;
        this.headerGrouping = {};
        this.lastLevel = [];
        this.showRowSubTotals = true;
        this.showColumnSubTotals = true;
        this.hideRowTotalsObject = {};
        this.hideColumnTotalsObject = {};
        this.sortObject = {};
        this.isColDrill = false;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    OlapEngine.prototype.renderEngine = function (dataSourceSettings, customProperties) {
        this.isEmptyData = false;
        this.mdxQuery = '';
        this.isMeasureAvail = false;
        this.allowMemberFilter = false;
        this.allowLabelFilter = false;
        this.allowValueFilter = false;
        this.isMondrian = false;
        this.aggregatedValueMatrix = [];
        this.measureReportItems = [];
        this.calcChildMembers = [];
        this.selectedItems = [];
        this.savedFieldList = undefined;
        this.savedFieldListData = undefined;
        this.formatFields = {};
        this.filterMembers = {};
        this.dataFields = {};
        this.valueAxis = '';
        this.columnCount = 0;
        this.rowCount = 0;
        this.colFirstLvl = 0;
        this.rowFirstLvl = 0;
        this.pageColStartPos = 0;
        this.enableValueSorting = false;
        this.sortObject = {};
        this.globalize = new Internationalization();
        /* tslint:disable:no-any */
        this.locale = this.globalize.getCulture();
        /* tslint:enable:no-any */
        this.localeObj = customProperties ? customProperties.localeObj : undefined;
        this.enableValueSorting = customProperties ? customProperties.enableValueSorting : false;
        if (dataSourceSettings.url) {
            // this.isMondrian = (dataSourceSettings.providerType === 'mondrian');
            this.dataSourceSettings = dataSourceSettings;
            this.valueAxis = dataSourceSettings.valueAxis === 'row' ? 'row' : 'column';
            this.getAxisFields();
            this.formats = dataSourceSettings.formatSettings ? dataSourceSettings.formatSettings : [];
            this.enableSort = dataSourceSettings.enableSorting === undefined ? true : dataSourceSettings.enableSorting;
            this.valueSortSettings = dataSourceSettings.valueSortSettings ? dataSourceSettings.valueSortSettings : undefined;
            this.filterSettings = dataSourceSettings.filterSettings ? dataSourceSettings.filterSettings : [];
            this.sortSettings = dataSourceSettings.sortSettings ? dataSourceSettings.sortSettings : [];
            this.allowMemberFilter = dataSourceSettings.allowMemberFilter ? true : false;
            this.allowLabelFilter = dataSourceSettings.allowLabelFilter ? true : false;
            this.allowValueFilter = dataSourceSettings.allowValueFilter ? true : false;
            this.drilledMembers = dataSourceSettings.drilledMembers ? this.updateDrilledItems(dataSourceSettings.drilledMembers) : [];
            this.calculatedFieldSettings = dataSourceSettings.calculatedFieldSettings ? dataSourceSettings.calculatedFieldSettings : [];
            this.emptyCellTextContent = dataSourceSettings.emptyCellsTextContent ? dataSourceSettings.emptyCellsTextContent : '';
            this.pageSettings = customProperties ? (customProperties.pageSettings ? customProperties.pageSettings : this.pageSettings)
                : undefined;
            this.isPaging = this.pageSettings ? true : false;
            this.frameSortObject();
            this.getFormattedFields(this.formats);
            this.savedFieldList = customProperties ? customProperties.savedFieldList : undefined;
            this.savedFieldListData = customProperties ? customProperties.savedFieldListData : undefined;
            this.fieldListData = [];
            this.fieldListObj = {};
            this.setNamedSetsPosition();
            if (!(this.savedFieldList && this.savedFieldListData)) {
                this.getFieldList(dataSourceSettings);
            }
            else {
                this.updateFieldlist(true);
            }
            this.loadCalculatedMemberElements(this.calculatedFieldSettings);
            this.measureReportItems = [];
            // this.updateAllMembers(dataSourceSettings, this.filters);
            this.updateFilterItems(this.filterSettings);
            this.generateGridData(dataSourceSettings);
        }
    };
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    OlapEngine.prototype.generateGridData = function (dataSourceSettings, action) {
        var refPaging = (action && action === 'navPaging' &&
            this.isPaging && this.pageSettings !== undefined ? true : false);
        if (this.rows.length > 0 || this.columns.length > 0 || this.values.length > 0 || this.filters.length > 0) {
            MDXQuery.getCellSets(dataSourceSettings, this, refPaging);
        }
        else {
            MDXQuery.getCellSets(dataSourceSettings, this, true, undefined, true);
            this.generateEngine(undefined, undefined, { dataSourceSettings: dataSourceSettings, action: 'loadTableElements' });
        }
    };
    OlapEngine.prototype.generatePagingData = function (xmlDoc, request, customArgs) {
        var xmlaCellSet = [].slice.call(xmlDoc.querySelectorAll('Axes, CellData'));
        // this.rowCount =
        //     (xmlaCellSet.length > 0 && [].slice.call(xmlaCellSet[0].querySelectorAll('Axis[name|="Axis1"] Tuple')).length > 0 ?
        //         [].slice.call(xmlaCellSet[0].querySelectorAll('Axis[name|="Axis1"] Tuple')).length : 0);
        // this.columnCount =
        //     (xmlaCellSet.length > 0 && [].slice.call(xmlaCellSet[0].querySelectorAll('Axis[name|="Axis0"] Tuple')).length > 0 ?
        //         [].slice.call(xmlaCellSet[0].querySelectorAll('Axis[name|="Axis0"] Tuple')).length : 0);
        var countCells = xmlaCellSet[1] ? xmlaCellSet[1].querySelectorAll('FmtValue') : null;
        if (countCells && countCells.length > 0) {
            this.columnCount = Number(countCells[0].textContent);
            this.rowCount = Number(countCells[1].textContent);
        }
        var dataSourceSettings = customArgs.dataSourceSettings;
        MDXQuery.getCellSets(dataSourceSettings, this, true);
    };
    OlapEngine.prototype.scrollPage = function (direction, newPage, prevPage) {
        MDXQuery.getCellSets(this.dataSourceSettings, this, true);
    };
    OlapEngine.prototype.generateEngine = function (xmlDoc, request, customArgs) {
        if (customArgs.action !== 'down') {
            this.pivotValues = [];
            this.valueContent = [];
            this.headerContent = [];
            this.colDepth = 0;
            this.tupColumnInfo = [];
            this.tupRowInfo = [];
            this.colMeasures = {};
            this.colMeasurePos = undefined;
            this.rowMeasurePos = undefined;
            this.rowStartPos = -1;
        }
        this.xmlDoc = xmlDoc ? xmlDoc.cloneNode(true) : undefined;
        this.request = request;
        this.customArgs = customArgs;
        this.totalCollection = [];
        this.parentObjCollection = {};
        this.curDrillEndPos = -1;
        this.onDemandDrillEngine = [];
        this.getSubTotalsVisibility();
        this.xmlaCellSet = xmlDoc ? xmlDoc.querySelectorAll('Axes, CellData') : undefined;
        var columnTuples = this.xmlaCellSet && this.xmlaCellSet.length > 0 ?
            [].slice.call(this.xmlaCellSet[0].querySelectorAll('Axis[name|="Axis0"] Tuple')) : [];
        var rowTuples = this.xmlaCellSet && this.xmlaCellSet.length > 0 ?
            [].slice.call(this.xmlaCellSet[0].querySelectorAll('Axis[name|="Axis1"] Tuple')) : [];
        var valCollection = this.xmlaCellSet && this.xmlaCellSet.length > 1 ?
            [].slice.call(this.xmlaCellSet[1].querySelectorAll('Cell')) : [];
        if (this.drilledMembers.length > 0) {
            // let st1: number = new Date().getTime();
            var measureInfo = this.getMeasureInfo();
            var orderedInfo = void 0;
            orderedInfo = this.frameMeasureOrder(measureInfo, 'column', columnTuples, valCollection, columnTuples.length);
            columnTuples = orderedInfo.orderedHeaderTuples;
            valCollection = orderedInfo.orderedValueTuples;
            orderedInfo = this.frameMeasureOrder(measureInfo, 'row', rowTuples, valCollection, columnTuples.length);
            rowTuples = orderedInfo.orderedHeaderTuples;
            valCollection = orderedInfo.orderedValueTuples;
            // let st2: number = (new Date().getTime() - st1) / 1000;
            // console.log('over-all:' + st2);
        }
        if (customArgs.action === 'down') {
            this.updateTupCollection(customArgs.drillInfo.axis === 'row' ? rowTuples.length : columnTuples.length);
        }
        if (customArgs.action === 'down' ? customArgs.drillInfo.axis === 'column' : true) {
            this.frameColumnHeader(columnTuples);
            if (!this.isPaging) {
                this.performColumnSorting();
            }
        }
        if (customArgs.action === 'down' ? customArgs.drillInfo.axis === 'row' : true) {
            this.frameRowHeader(rowTuples);
            if (!this.isPaging) {
                this.performRowSorting();
            }
        }
        this.frameValues(valCollection, columnTuples.length);
        this.performColumnSpanning();
        if (!this.isPaging && this.enableSort) {
            for (var i = 0; i < this.headerContent.length; i++) {
                this.headerContent[i] = this.pivotValues[i];
            }
        }
        this.isEngineUpdated = true;
        this.isEmptyData = columnTuples.length === 0;
        //this.append(columnTuples.length);
    };
    OlapEngine.prototype.getSubTotalsVisibility = function () {
        this.showRowSubTotals = this.dataSourceSettings.showRowSubTotals && this.dataSourceSettings.showSubTotals;
        this.showColumnSubTotals = this.dataSourceSettings.showColumnSubTotals && this.dataSourceSettings.showSubTotals;
        this.hideRowTotalsObject = {};
        this.hideColumnTotalsObject = {};
        var axisCount = 1;
        do {
            if (axisCount === 1) {
                if (this.showColumnSubTotals) {
                    for (var cCnt = 0; cCnt < this.dataSourceSettings.columns.length; cCnt++) {
                        if (this.dataSourceSettings.columns[cCnt].showSubTotals === false) {
                            this.hideColumnTotalsObject[this.dataSourceSettings.columns[cCnt].name] = cCnt;
                        }
                    }
                }
            }
            else {
                if (this.showRowSubTotals) {
                    for (var rCnt = 0; rCnt < this.dataSourceSettings.rows.length; rCnt++) {
                        if (this.dataSourceSettings.rows[rCnt].showSubTotals === false) {
                            this.hideRowTotalsObject[this.dataSourceSettings.rows[rCnt].name] = rCnt;
                        }
                    }
                }
            }
            axisCount++;
        } while (axisCount < 3);
    };
    /* tslint:disable:max-func-body-length */
    OlapEngine.prototype.frameRowHeader = function (tuples) {
        this.headerGrouping = {};
        this.lastLevel = [];
        var position = this.pivotValues.length;
        var pivotValues = [];
        var valueContent = [];
        if (this.customArgs.action !== 'down') {
            pivotValues = this.pivotValues;
            valueContent = this.valueContent;
        }
        else {
            position = this.customArgs.drillInfo.currentCell.rowIndex + 1;
        }
        this.rowStartPos = this.rowStartPos > 0 ? this.rowStartPos : position;
        var tupPos = 0;
        var lastAllStartPos;
        var lastAllCount;
        var prevUNArray = [];
        var allType = {};
        var rowMembers = [];
        var availAllMember = false;
        var withoutAllStartPos = -1;
        var withoutAllEndPos = -1;
        var minLevel = [];
        var gTotals = [{
                axis: 'row',
                colIndex: 0,
                formattedText: 'Grand Total',
                hasChild: false,
                level: -1,
                rowIndex: 0,
                index: [],
                type: 'grand sum',
                ordinal: 0,
                colSpan: 1,
                rowSpan: 1,
                memberType: 2,
                isDrilled: false,
                valueSort: { 'Grand Total': 1, levelName: 'Grand Total' }
            }];
        var maxLevel = [];
        var measurePos;
        var newTupPosition = (this.customArgs.drillInfo && this.customArgs.drillInfo.axis === 'row') ?
            (this.customArgs.drillInfo.currentCell.ordinal + 1) : 0;
        while (tupPos < tuples.length) {
            var members = tuples[tupPos].querySelectorAll('Member');
            maxLevel = this.frameTupCollection(members, maxLevel, (tupPos + newTupPosition), this.tupRowInfo, this.showRowSubTotals, this.hideRowTotalsObject, 'row');
            tupPos++;
        }
        tupPos = 0;
        var prevTupInfo;
        var tuplesLength = tuples.length;
        if (this.customArgs.action === 'down') {
            var ordinal = this.customArgs.drillInfo.currentCell.ordinal + 1;
            tupPos = ordinal;
            tuplesLength += ordinal;
            lastAllCount = this.tupRowInfo[ordinal - 1].allCount;
            lastAllStartPos = this.tupRowInfo[ordinal - 1].allStartPos;
            prevTupInfo = this.tupRowInfo[ordinal - 1];
        }
        var startTupPos = tupPos;
        var pagingAllowFlag = true;
        var lastMesPos = 0;
        while (tupPos < tuplesLength && pagingAllowFlag) {
            var members = tuples[this.customArgs.action === 'down' ?
                (tupPos - (this.customArgs.drillInfo.currentCell.ordinal + 1)) : tupPos].querySelectorAll('Member');
            var memPos = 0;
            var prevParent = void 0;
            var allCount = this.tupRowInfo[tupPos].allCount;
            var allStartPos = this.tupRowInfo[tupPos].allStartPos;
            var measure = this.tupRowInfo[tupPos].measure;
            var typeColl = this.tupRowInfo[tupPos].typeCollection;
            var drillInfo = this.tupRowInfo[tupPos].drillInfo;
            var drillStartPos = this.tupRowInfo[tupPos].drillStartPos;
            var startDrillUniquename = this.tupRowInfo[tupPos].startDrillUniquename;
            var drillEndPos = this.tupRowInfo[tupPos].drillEndPos;
            var levelColl = this.tupRowInfo[tupPos].levelCollection;
            if (tupPos === 0 || tupPos === startTupPos) {
                var firstTupMembers = this.customArgs.action === 'down' ? this.tupRowInfo[0].members : members;
                while (memPos < firstTupMembers.length) {
                    if (firstTupMembers[memPos].querySelector('MEMBER_TYPE').textContent === '1' &&
                        Number(firstTupMembers[memPos].querySelector('LNum').textContent) === 0) {
                        minLevel[memPos] = 0;
                    }
                    else {
                        minLevel[memPos] = Number(firstTupMembers[memPos].querySelector('LNum').textContent);
                    }
                    // if (firstTupMembers[memPos].querySelector('MEMBER_TYPE').textContent === '1' &&
                    //   (this.isPaging || Number(firstTupMembers[memPos].querySelector('LNum').textContent) === 0)) {
                    if (firstTupMembers[memPos].querySelector('MEMBER_TYPE').textContent === '1') {
                        allType[memPos] = 0;
                        withoutAllStartPos = withoutAllStartPos === -1 ? memPos : withoutAllStartPos;
                        withoutAllEndPos = memPos;
                    }
                    else {
                        allType[memPos] = 1;
                        availAllMember = firstTupMembers[memPos].querySelector('MEMBER_TYPE').textContent === '3' ? availAllMember : true;
                    }
                    memPos++;
                }
                measurePos = typeColl.indexOf('3');
            }
            memPos = 0;
            if (tupPos === 0 && (members.length > (allCount + (measure ? 1 : 0)) || (members.length === 1 && measure))) {
                gTotals.pop();
            }
            if ((tupPos === 0 && this.isPaging) ? gTotals.length === 0 :
                (!availAllMember || allCount === lastAllCount || allStartPos !== lastAllStartPos || (members.length === 1 && measure))) {
                var attrDrill = this.checkAttributeDrill(this.tupRowInfo[tupPos].drillInfo, 'rows');
                var drillAllow = drillStartPos > -1 ? (allCount > 0 ? (attrDrill || allStartPos > drillStartPos) : true) : true;
                /* tslint:disable-next-line:max-line-length */
                drillAllow = (prevTupInfo && drillAllow && drillStartPos > -1) ?
                    (prevTupInfo.startDrillUniquename !== startDrillUniquename ? true :
                        ((withoutAllEndPos > prevTupInfo.measurePosition ? false :
                            prevTupInfo.measureName !== this.tupRowInfo[tupPos].measureName) &&
                            (allStartPos === (drillStartPos + 1) || this.tupRowInfo[tupPos].measurePosition === (drillStartPos + 1))))
                    : drillAllow;
                var withoutAllAllow = (withoutAllStartPos > -1 && allCount > 0) ? (attrDrill || allStartPos > withoutAllEndPos) : true;
                if (members.length === allCount + (measure ? 1 : 0) && measure) {
                    var levelName = 'Grand Total.' + members[measurePos].querySelector('Caption').textContent;
                    gTotals.push({
                        axis: 'row',
                        actualText: this.getUniqueName(members[measurePos].querySelector('UName').textContent),
                        colIndex: 0,
                        formattedText: (typeColl[measurePos] === '3' &&
                            this.dataFields[this.getUniqueName(members[measurePos].querySelector('UName').textContent)] &&
                            this.dataFields[this.getUniqueName(members[measurePos].querySelector('UName').textContent)].caption) ?
                            this.dataFields[this.getUniqueName(members[measurePos].querySelector('UName').textContent)].caption :
                            members[measurePos].querySelector('Caption').textContent,
                        hasChild: false,
                        level: -1,
                        rowIndex: position,
                        index: [],
                        ordinal: tupPos,
                        colSpan: 1,
                        rowSpan: 1,
                        memberType: Number(typeColl[measurePos]),
                        isDrilled: false,
                        parentUniqueName: members[measurePos].querySelector('PARENT_UNIQUE_NAME') ?
                            members[measurePos].querySelector('PARENT_UNIQUE_NAME').textContent : undefined,
                        levelUniqueName: members[measurePos].querySelector('LName').textContent,
                        hierarchy: members[measurePos].getAttribute('Hierarchy'),
                        valueSort: { levelName: levelName, axis: members[measurePos].getAttribute('Hierarchy') }
                    });
                    gTotals[gTotals.length - 1].valueSort['Grand Total.' + members[measurePos].querySelector('Caption').textContent] = 1;
                }
                else if (!(allStartPos === 0 || (measurePos === 0 && allStartPos === 1)) && drillAllow && withoutAllAllow) {
                    prevTupInfo = this.tupRowInfo[tupPos];
                    var lastPos = position;
                    var lastMemPos = memPos;
                    prevParent = {};
                    var withoutAllDrilled = false;
                    while (memPos < members.length && pagingAllowFlag) {
                        var member = members[memPos];
                        if (member.querySelector('UName').textContent !== prevUNArray[memPos] && typeColl[memPos] !== '2'
                            && ((Object.keys(prevParent).length > 0 ? (prevParent.isDrilled && !this.fieldList[prevParent.hierarchy].isHierarchy) : withoutAllDrilled) ?
                                (typeColl[memPos] === '3' && (allType[memPos - 1] && allType[memPos + 1] !== 0)) : true)) {
                            var lvl = Number(member.querySelector('LNum').textContent) -
                                ((allType[memPos] && typeColl[memPos] !== '3') ? 1 : minLevel[memPos]);
                            /* tslint:disable-next-line:no-string-literal */
                            var isNamedSet = this.namedSetsPosition['row'][memPos] ? true : false;
                            var uniqueName = this.getUniqueName(member.querySelector('UName').textContent);
                            var depth = this.getDepth(this.tupRowInfo[tupPos], uniqueName, Number(typeColl[memPos]));
                            if (!(this.isPaging && pivotValues[lastMesPos][0] && this.fieldList[pivotValues[lastMesPos][0].hierarchy] && this.fieldList[pivotValues[lastMesPos][0].hierarchy].isHierarchy &&
                                pivotValues[lastMesPos][0].hasChild && !pivotValues[lastMesPos][0].isDrilled && !this.rows[memPos].isNamedSet && (this.rows[memPos].name.indexOf('[Measures]') === 0 || (this.fieldList[member.getAttribute('Hierarchy')] && (this.fieldList[member.getAttribute('Hierarchy')].isHierarchy || this.fieldList[member.getAttribute('Hierarchy')].hasAllMember))) &&
                                pivotValues[lastMesPos][0].depth < depth)) {
                                pivotValues[position] = [{
                                        axis: 'row',
                                        actualText: uniqueName,
                                        colIndex: 0,
                                        formattedText: (typeColl[memPos] === '3' && this.dataFields[uniqueName] &&
                                            this.dataFields[uniqueName].caption) ? this.dataFields[uniqueName].caption :
                                            member.querySelector('Caption').textContent,
                                        hasChild: (this.fieldList[member.getAttribute('Hierarchy')] && this.fieldList[member.getAttribute('Hierarchy')].isHierarchy && memPos < this.rows.length - 1 && !this.rows[memPos + 1].isNamedSet && this.rows[memPos + 1].name.indexOf('[Measures]') < 0 && this.fieldList[this.rows[memPos + 1].name] && this.fieldList[this.rows[memPos + 1].name].hasAllMember) ? true : Number(member.querySelector('CHILDREN_CARDINALITY').textContent) > 0 ? true : false,
                                        level: lvl,
                                        depth: depth,
                                        rowIndex: position,
                                        index: [],
                                        ordinal: tupPos,
                                        type: 'header',
                                        colSpan: 1,
                                        rowSpan: 1,
                                        memberType: Number(typeColl[memPos]),
                                        isDrilled: (this.fieldList[member.getAttribute('Hierarchy')] && this.fieldList[member.getAttribute('Hierarchy')].isHierarchy && !this.isAttributeDrill(member.getAttribute('Hierarchy'), this.tupRowInfo[tupPos].drillInfo, 'rows')) ? true : this.tupRowInfo[tupPos].drillInfo[memPos].isDrilled,
                                        parentUniqueName: member.querySelector('PARENT_UNIQUE_NAME') ?
                                            member.querySelector('PARENT_UNIQUE_NAME').textContent : undefined,
                                        levelUniqueName: member.querySelector('LName').textContent,
                                        hierarchy: member.getAttribute('Hierarchy'),
                                        isNamedSet: isNamedSet,
                                        valueSort: { levelName: '', axis: member.getAttribute('Hierarchy') }
                                    }];
                                prevParent = typeColl[memPos] !== '3' ? pivotValues[position][0] : prevParent;
                                if (!prevParent) {
                                    rowMembers.push(member.querySelector('Caption').textContent);
                                }
                                var levelName = this.getCaptionCollectionWithMeasure(this.tupRowInfo[tupPos]);
                                pivotValues[position][0].valueSort.levelName = levelName;
                                pivotValues[position][0].valueSort[levelName] = 1;
                                valueContent[position - this.rowStartPos] = {};
                                valueContent[position - this.rowStartPos][0] = pivotValues[position][0];
                                if (measure && measurePos > memPos) {
                                    prevUNArray[measurePos] = '';
                                }
                                for (var pos = memPos + 1; pos < members.length; pos++) {
                                    prevUNArray[pos] = '';
                                }
                                prevUNArray[memPos] = member.querySelector('UName').textContent;
                                lastMesPos = Number(typeColl[memPos]) !== 3 ? position : lastMesPos;
                                position++;
                                lastMemPos = memPos;
                            }
                        }
                        else if (typeColl[memPos] === '2') {
                            lastMemPos = memPos;
                        }
                        else {
                            if (this.tupRowInfo[tupPos].drillInfo[memPos].isDrilled && allType[memPos] === 0) {
                                withoutAllDrilled = true;
                            }
                        }
                        if (this.tupRowInfo[tupPos].drillInfo[memPos].isDrilled && this.tupRowInfo[tupPos].showTotals) {
                            this.tupRowInfo[tupPos].showTotals = !this.showRowSubTotals ? false :
                                this.hideRowTotalsObject[this.tupRowInfo[tupPos].drillInfo[memPos].hierarchy] === undefined;
                        }
                        memPos++;
                    }
                    if (lastPos < position && lastMemPos >= (members.length - 1)) {
                        pivotValues[position - 1][0].ordinal = tupPos;
                        if (pivotValues[position - 1][0].type === 'header') {
                            delete pivotValues[position - 1][0].type;
                        }
                    }
                }
                lastAllCount = allCount;
                lastAllStartPos = allStartPos;
            }
            tupPos++;
        }
        if (gTotals.length > 1 && gTotals[0].memberType !== 3) {
            gTotals[0].ordinal = -1;
        }
        // if (!(this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showRowGrandTotals)) {
        //     for (let totPos: number = 0; totPos < gTotals.length; totPos++) {
        //         if (this.tupRowInfo[gTotals[totPos].ordinal]) {
        //             this.tupRowInfo[gTotals[totPos].ordinal].showTotals = false;
        //         }
        //     }
        // }
        if (this.customArgs.action !== 'down') {
            if (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showRowGrandTotals) {
                for (var totPos = 0; totPos < gTotals.length; totPos++) {
                    gTotals[totPos].rowIndex = position;
                    pivotValues[position] = [gTotals[totPos]];
                    valueContent[position - this.rowStartPos] = {};
                    valueContent[position - this.rowStartPos][0] = pivotValues[position][0];
                    position++;
                }
            }
        }
        else {
            this.updateRowEngine(pivotValues, valueContent, tuples.length);
            this.onDemandDrillEngine = pivotValues;
        }
    };
    OlapEngine.prototype.getDepth = function (tupInfo, uniqueName, memberType) {
        var memberPosition = tupInfo.uNameCollection.indexOf(uniqueName);
        var cropUName = tupInfo.uNameCollection.substring(0, memberPosition) +
            (memberType === 3 ? '' : uniqueName);
        var fieldSep = cropUName.split('::[').map(function (item) {
            return item[0] === '[' ? item : ('[' + item);
        });
        if (memberType === 3 && this.rowMeasurePos === fieldSep.length) {
            fieldSep.push(uniqueName);
        }
        var nxtIndextCount = -1;
        for (var fPos = 0; fPos < fieldSep.length; fPos++) {
            var fieldMembers = fieldSep[fPos];
            var membersCount = fieldMembers.split('~~').length;
            nxtIndextCount += membersCount;
        }
        return nxtIndextCount;
    };
    OlapEngine.prototype.checkAttributeDrill = function (drillInfo, axis) {
        var isDrill = false;
        for (var i = 0; i < drillInfo.length; i++) {
            isDrill = this.isAttributeDrill(drillInfo[i].hierarchy, drillInfo, axis);
            if (isDrill) {
                break;
            }
        }
        return isDrill;
    };
    OlapEngine.prototype.frameTupCollection = function (members, maxLevel, tupPos, tupInfo, showSubTotals, hideTotalsObject, axis) {
        var _a, _b;
        var memPos = 0;
        var allCount = 0;
        var allStartPos;
        var measure;
        var measureName;
        var measurePosition;
        var typeColl = [];
        var levelColl = [];
        var drillState = [];
        var uNameCollection = '';
        var captionCollection = '';
        var showTotals = true;
        var hideFieldPos = -1;
        while (memPos < members.length) {
            var member = members[memPos];
            var memberlevel = Number(member.querySelector('LNum').textContent);
            var memberUName = member.querySelector('UName').textContent;
            /* tslint:disable:no-any */
            if (Number(member.querySelector('MEMBER_TYPE').textContent) > 3) {
                member.querySelector('MEMBER_TYPE').textContent = memberUName.startsWith('[Measures]') ? '3' : '1';
            }
            var memberType = memberUName.startsWith('[Measures]') ? '3' :
                (Number(member.querySelector('MEMBER_TYPE').textContent) > 3 ? '1' : member.querySelector('MEMBER_TYPE').textContent);
            /* tslint:enable:no-any */
            var memberCaption = member.querySelector('Caption').textContent;
            if (this.fieldList[memberCaption] && this.fieldList[memberCaption].type === 'CalculatedField') {
                memberCaption = this.fieldList[memberCaption].caption;
                member.querySelector('Caption').textContent = memberCaption;
            }
            var hierarchy = member.getAttribute('Hierarchy');
            /* tslint:disable-next-line:max-line-length */
            var parentUName = member.querySelector('PARENT_UNIQUE_NAME') ? member.querySelector('PARENT_UNIQUE_NAME').textContent : '';
            if (memberType === '2') {
                if (!this.isPaging) {
                    allCount++;
                }
                allStartPos = isNullOrUndefined(allStartPos) ? memPos : allStartPos;
            }
            else if (memberType === '3') {
                measure = member;
                measureName = memberUName;
                measurePosition = memPos;
                if (axis === 'column') {
                    this.colMeasures[memberUName] = member;
                    this.colMeasurePos = memPos;
                }
                else {
                    this.rowMeasurePos = memPos;
                }
            }
            else {
                hideFieldPos = hideTotalsObject[hierarchy];
            }
            if (memberType !== '2') {
                if (this.headerGrouping[memPos]) {
                    if (memberlevel > this.lastLevel[memPos]) {
                        this.lastLevel[memPos] = memberlevel;
                    }
                    else if (memberlevel < this.lastLevel[memPos]) {
                        var levelPos = this.lastLevel[memPos];
                        while (levelPos >= memberlevel) {
                            delete this.headerGrouping[memPos].UName[levelPos];
                            delete this.headerGrouping[memPos].Caption[levelPos];
                            levelPos--;
                        }
                        this.lastLevel[memPos] = memberlevel;
                    }
                    this.headerGrouping[memPos].UName[memberlevel] = memberUName;
                    this.headerGrouping[memPos].Caption[memberlevel] = memberCaption;
                }
                else {
                    this.lastLevel[memPos] = memberlevel;
                    this.headerGrouping[memPos] = { UName: (_a = {}, _a[memberlevel] = memberUName, _a), Caption: (_b = {}, _b[memberlevel] = memberCaption, _b) };
                }
                if (this.isPaging) {
                    var currUName = parentUName;
                    while (this.drilledSets[currUName]) {
                        var currCaption = this.drilledSets[currUName].querySelector('Caption').textContent;
                        var currLevel = Number(this.drilledSets[currUName].querySelector('LNum').textContent);
                        this.headerGrouping[memPos].UName[currLevel] = currUName;
                        this.headerGrouping[memPos].Caption[currLevel] = currCaption;
                        currUName = this.drilledSets[currUName].querySelector('PARENT_UNIQUE_NAME') === null ? '' :
                            this.drilledSets[currUName].querySelector('PARENT_UNIQUE_NAME').textContent;
                    }
                }
                /* tslint:disable:no-any */
                var uNames = Object.values(this.headerGrouping[memPos].UName).join('~~');
                uNameCollection = uNameCollection === '' ? uNames :
                    (uNameCollection + '::' + uNames);
                var captions = Object.values(this.headerGrouping[memPos].Caption).join('~~');
                /* tslint:enable:no-any */
                if (memPos !== measurePosition) {
                    captionCollection = captionCollection === '' ? captions :
                        (captionCollection + '::' + captions);
                }
            }
            typeColl.push(memberType);
            levelColl.push(memberlevel);
            if (isNullOrUndefined(maxLevel[memPos]) || maxLevel[memPos] < memberlevel) {
                maxLevel[memPos] = memberlevel;
            }
            drillState.push({ level: memberlevel, uName: memberUName, hierarchy: hierarchy, isDrilled: false });
            if (tupInfo[tupPos - 1] && tupInfo[tupPos - 1].typeCollection[memPos] === '1' &&
                drillState[memPos].level > tupInfo[tupPos - 1].drillInfo[memPos].level) {
                var uCollection = uNameCollection.split(/~~|::\[/).map(function (item) {
                    return item[0] === '[' ? item : ('[' + item);
                });
                uCollection.pop();
                var parentLevel = uCollection.join('~~');
                this.setDrillInfo(parentUName, parentLevel, memPos, tupPos, tupInfo);
            }
            memPos++;
        }
        if (hideFieldPos > -1) {
            showTotals = typeColl[hideFieldPos + 1] !== '2';
        }
        tupInfo[tupPos] = {
            allCount: allCount,
            allStartPos: allStartPos,
            measure: measure,
            measureName: measureName,
            measurePosition: measurePosition,
            members: members,
            typeCollection: typeColl,
            uNameCollection: uNameCollection,
            captionCollection: captionCollection,
            levelCollection: levelColl,
            drillInfo: drillState,
            drillStartPos: -1,
            drillEndPos: -1,
            showTotals: (!showSubTotals && allCount > 0 && allStartPos > (measurePosition === 0 ? 1 : 0)) ? false : showTotals
        };
        return maxLevel;
    };
    OlapEngine.prototype.getCaptionCollectionWithMeasure = function (tuple) {
        var captionColection = tuple.captionCollection;
        if (tuple.measure) {
            var measureName = tuple.measure.querySelector('Caption').textContent;
            var measurePosition = tuple.uNameCollection.split(/[~~,::]+/g).indexOf(tuple.measureName);
            var captionCollectionArray = tuple.captionCollection.split(/[~~,::]+/g);
            captionCollectionArray.splice(measurePosition, 0, measureName);
            captionColection = captionCollectionArray.join('.');
        }
        else {
            var captionCollectionArray = tuple.captionCollection.split(/[~~,::]+/g);
            captionColection = captionCollectionArray.join('.');
        }
        return captionColection;
    };
    /** hidden */
    OlapEngine.prototype.setNamedSetsPosition = function () {
        this.namedSetsPosition = {};
        var axis = 0;
        do {
            var setsPositions = {};
            var axisFields = axis ? this.dataSourceSettings.rows : this.dataSourceSettings.columns;
            for (var fPos = 0; fPos < axisFields.length; fPos++) {
                if (axisFields[fPos].isNamedSet) {
                    setsPositions[fPos] = axisFields[fPos].name;
                }
            }
            this.namedSetsPosition[axis ? 'row' : 'column'] = setsPositions;
            axis++;
        } while (axis < 2);
    };
    OlapEngine.prototype.updateRowEngine = function (pivotValues, valueContent, tuplesLength) {
        var currEngineCount = this.pivotValues.length - 1;
        var newEngineCount = Object.keys(pivotValues).length;
        while (currEngineCount > this.customArgs.drillInfo.currentCell.rowIndex) {
            this.pivotValues[currEngineCount + newEngineCount] = this.pivotValues[currEngineCount];
            this.pivotValues[currEngineCount + newEngineCount][0].ordinal += tuplesLength;
            this.pivotValues[currEngineCount + newEngineCount][0].rowIndex += newEngineCount;
            /* tslint:disable-next-line:max-line-length */
            this.valueContent[(currEngineCount + newEngineCount) - this.rowStartPos] = this.valueContent[currEngineCount - this.rowStartPos];
            currEngineCount--;
        }
        // for (let key in pivotValues) {
        for (var key = 0; key < pivotValues.length; key++) {
            this.pivotValues[key] = pivotValues[key];
            this.valueContent[Number(key) - this.rowStartPos] = valueContent[Number(key) - this.rowStartPos];
        }
        this.pivotValues[this.customArgs.drillInfo.currentCell.rowIndex][0].isDrilled = true;
    };
    OlapEngine.prototype.updateTupCollection = function (newTuplesCount) {
        var tupCollection = this.customArgs.drillInfo.axis === 'row' ? this.tupRowInfo : this.tupColumnInfo;
        var currTupCount = tupCollection.length - 1;
        while (currTupCount > this.customArgs.drillInfo.currentCell.ordinal) {
            tupCollection[currTupCount + newTuplesCount] = tupCollection[currTupCount];
            currTupCount--;
        }
    };
    /* tslint:disable:max-func-body-length */
    OlapEngine.prototype.frameColumnHeader = function (tuples) {
        var _this_1 = this;
        this.headerGrouping = {};
        this.lastLevel = [];
        var tupPos = 0;
        var maxLevel = [];
        var allType = [];
        var minLevel = [];
        var withoutAllStartPos = -1;
        var withoutAllEndPos = -1;
        var newTupPosition = (this.customArgs.drillInfo && this.customArgs.drillInfo.axis === 'column') ?
            (this.customArgs.drillInfo.currentCell.ordinal + 1) : 0;
        while (tupPos < tuples.length) {
            var members = tuples[tupPos].querySelectorAll('Member');
            maxLevel = this.frameTupCollection(members, maxLevel, (tupPos + newTupPosition), this.tupColumnInfo, this.showColumnSubTotals, this.hideColumnTotalsObject, 'column');
            tupPos++;
        }
        if (tuples.length > 0) {
            var members = tuples[0].querySelectorAll('Member');
            var memPos = 0;
            while (memPos < members.length) {
                minLevel[memPos] = (members[memPos].querySelector('MEMBER_TYPE').textContent === '1' &&
                    Number(members[memPos].querySelector('LNum').textContent) === 0) ? 0 :
                    Number(members[memPos].querySelector('LNum').textContent);
                if (members[memPos].querySelector('MEMBER_TYPE').textContent === '1' &&
                    (this.isPaging || Number(members[memPos].querySelector('LNum').textContent) === 0)) {
                    allType[memPos] = 0;
                    withoutAllStartPos = withoutAllStartPos === -1 ? memPos : withoutAllStartPos;
                    withoutAllEndPos = memPos;
                }
                else {
                    allType[memPos] = 1;
                }
                memPos++;
            }
        }
        /* tslint:disable */
        var _this = this;
        /* tslint:enable */
        tupPos = 0;
        var position = 1;
        var lastAllStartPos;
        var lastSavedInfo = {};
        var drillLastAllStartPos;
        var lastAllCount;
        var drillLastAllCount;
        var isSubTotIncluded = true;
        var withoutAllAvail = false;
        var lastRealTup;
        var _loop_1 = function () {
            var members = tuples[tupPos].querySelectorAll('Member');
            var allCount = this_1.tupColumnInfo[tupPos].allCount;
            var allStartPos = this_1.tupColumnInfo[tupPos].allStartPos;
            var measure = this_1.tupColumnInfo[tupPos].measure;
            var typeColl = this_1.tupColumnInfo[tupPos].typeCollection;
            var drillInfo = this_1.tupColumnInfo[tupPos].drillInfo;
            var drillStartPos = this_1.tupColumnInfo[tupPos].drillStartPos;
            var startDrillUniquename = this_1.tupColumnInfo[tupPos].startDrillUniquename;
            var endDrillUniquename = this_1.tupColumnInfo[tupPos].endDrillUniquename;
            var drillEndPos = this_1.tupColumnInfo[tupPos].drillEndPos;
            var levelColl = this_1.tupColumnInfo[tupPos].levelCollection;
            var isStartCol = typeColl[0] === '2' ? false : (typeColl[0] === '3' ? typeColl[1] !== '2' : true);
            var depth = 0;
            /* tslint:disable-next-line:max-line-length */
            maxLevel.map(function (item, pos) { depth = depth + (allType[pos] === 0 ? (item + (1 - (minLevel[pos] > 1 ? 1 : minLevel[pos]))) : (item === 0 ? ((_this_1.isPaging && typeColl[pos] === '2') ? 0 : 1) : item)); });
            this_1.colDepth = this_1.colDepth > depth ? this_1.colDepth : depth;
            if (tupPos === 0 && members.length > (allCount + (measure ? 1 : 0))) {
                withoutAllAvail = true;
                isStartCol = (allCount > 0 && isStartCol) ? (allStartPos > withoutAllStartPos) : isStartCol;
            }
            if (isStartCol) {
                if (allCount === 0) {
                    var levelComp = [-1, -1, -1];
                    if (this_1.tupColumnInfo[tupPos - 1] && this_1.tupColumnInfo[tupPos - 1].allCount === 0) {
                        levelComp = this_1.levelCompare(levelColl, this_1.tupColumnInfo[tupPos - 1].levelCollection);
                    }
                    else if (withoutAllAvail && lastRealTup) {
                        levelComp = this_1.levelCompare(levelColl, lastRealTup.levelCollection);
                    }
                    if (this_1.tupColumnInfo[tupPos].drillStartPos < 0) {
                        if (!isSubTotIncluded && levelComp[0] > -1 && levelComp[2] > -1) {
                            position = this_1.mergeTotCollection(position, allCount, maxLevel, minLevel, allType, allStartPos, drillInfo, levelComp);
                        }
                        this_1.setParentCollection(members);
                        this_1.frameCommonColumnLoop(members, tupPos, position, maxLevel, allType, minLevel);
                        if (!this_1.tupColumnInfo[tupPos].showTotals) {
                            position--;
                        }
                        if (!isSubTotIncluded && levelComp[0] > -1 && levelComp[2] > -1) {
                            position = this_1.mergeTotCollection(position, allCount, maxLevel, minLevel, allType, allStartPos, drillInfo, levelComp);
                        }
                        isSubTotIncluded = false;
                        if (!this_1.isColDrill) {
                            position++;
                        }
                        else {
                            this_1.isColDrill = false;
                        }
                    }
                    else if (lastSavedInfo.drillStartPos === drillStartPos ?
                        (lastSavedInfo.startDrillUniquename !== startDrillUniquename ||
                            lastSavedInfo.allCount === allCount) : true) {
                        if (!isSubTotIncluded && levelComp[0] > -1 && levelComp[2] > -1) {
                            position = this_1.mergeTotCollection(position, allCount, maxLevel, minLevel, allType, allStartPos, drillInfo, levelComp);
                            isSubTotIncluded = true;
                        }
                        this_1.setParentCollection(members);
                        if (withoutAllAvail ? (withoutAllEndPos <= drillStartPos) : true) {
                            /* tslint:disable-next-line:max-line-length */
                            this_1.totalCollection[this_1.totalCollection.length] = ({ allCount: allCount, ordinal: tupPos, members: members, drillInfo: drillInfo });
                            lastSavedInfo.allCount = allCount;
                            lastSavedInfo.allStartPos = allStartPos;
                            lastSavedInfo.drillStartPos = drillStartPos;
                            lastSavedInfo.startDrillUniquename = startDrillUniquename;
                            lastSavedInfo.endDrillUniquename = endDrillUniquename;
                        }
                    }
                    lastRealTup = this_1.tupColumnInfo[tupPos];
                }
            }
            var attrDrill = this_1.checkAttributeDrill(this_1.tupColumnInfo[tupPos].drillInfo, 'columns');
            if (allCount > 0 && (withoutAllAvail ? (isStartCol && (attrDrill || withoutAllEndPos < allStartPos)) : true)) {
                if (allCount === lastSavedInfo.allCount || allStartPos !== lastSavedInfo.allStartPos) {
                    /* tslint:disable-next-line:max-line-length */
                    var endAllow = drillEndPos !== drillStartPos ? (lastSavedInfo.endDrillUniquename === endDrillUniquename) : true;
                    /* tslint:disable-next-line:max-line-length */
                    var allow = allStartPos !== lastSavedInfo.allStartPos ? (lastSavedInfo.startDrillUniquename !== startDrillUniquename) : endAllow;
                    if (drillStartPos > -1 ? (allow) : true) {
                        if (!isSubTotIncluded) {
                            position = this_1.mergeTotCollection(position, allCount, maxLevel, minLevel, allType, allStartPos, drillInfo);
                            isSubTotIncluded = true;
                        }
                        this_1.setParentCollection(members);
                        if ((withoutAllAvail && drillStartPos > -1) ? (withoutAllEndPos <= drillStartPos) : true) {
                            /* tslint:disable-next-line:max-line-length */
                            this_1.totalCollection[this_1.totalCollection.length] = ({ allCount: allCount, ordinal: tupPos, members: members, allStartPos: allStartPos, drillInfo: drillInfo });
                            lastSavedInfo.allCount = allCount;
                            lastSavedInfo.allStartPos = allStartPos;
                            lastSavedInfo.drillStartPos = drillStartPos;
                            lastSavedInfo.startDrillUniquename = startDrillUniquename;
                            lastSavedInfo.endDrillUniquename = endDrillUniquename;
                        }
                    }
                }
            }
            tupPos++;
        };
        var this_1 = this;
        while (tupPos < tuples.length) {
            _loop_1();
        }
        if (this.totalCollection.length > 0) {
            if (Object.keys(this.colMeasures).length > 1) {
                this.orderTotals(position, maxLevel, allType, minLevel);
            }
            else {
                this.totalCollection = this.totalCollection.reverse();
                for (var _i = 0, _a = this.totalCollection; _i < _a.length; _i++) {
                    var coll = _a[_i];
                    var isGrandTotal = this.tupColumnInfo[coll.ordinal].measurePosition === 0 ?
                        this.tupColumnInfo[coll.ordinal].allStartPos === 1 : this.tupColumnInfo[coll.ordinal].allStartPos === 0;
                    if (isGrandTotal ? (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showColumnGrandTotals) : true) {
                        this.frameCommonColumnLoop(coll.members, coll.ordinal, position, maxLevel, minLevel, allType);
                        var attrDrill = this.checkAttributeDrill(this.tupColumnInfo[coll.ordinal].drillInfo, 'columns');
                        if (this.tupColumnInfo[coll.ordinal].showTotals || attrDrill) {
                            position++;
                        }
                    }
                }
            }
        }
    };
    OlapEngine.prototype.orderTotals = function (position, maxLevel, allType, minLevel) {
        var groupColl = {};
        var maxCnt = 1;
        for (var _i = 0, _a = this.totalCollection; _i < _a.length; _i++) {
            var coll = _a[_i];
            var isGrandTotal = this.tupColumnInfo[coll.ordinal].measurePosition === 0 ?
                this.tupColumnInfo[coll.ordinal].allStartPos === 1 : this.tupColumnInfo[coll.ordinal].allStartPos === 0;
            if (isGrandTotal ? (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showColumnGrandTotals) : true) {
                var measureName = this.tupColumnInfo[coll.ordinal].measure.querySelector('UName').textContent;
                if (groupColl[measureName]) {
                    groupColl[measureName].coll.push(coll);
                    groupColl[measureName].count++;
                    maxCnt = maxCnt < groupColl[measureName].count ? groupColl[measureName].count : maxCnt;
                }
                else {
                    groupColl[measureName] = { coll: [coll], count: 1 };
                }
            }
        }
        var keys = Object.keys(groupColl);
        var collLength = maxCnt - 1;
        while (collLength > -1) {
            for (var _b = 0, keys_1 = keys; _b < keys_1.length; _b++) {
                var key = keys_1[_b];
                var coll = groupColl[key].coll[collLength];
                if (coll) {
                    this.frameCommonColumnLoop(coll.members, coll.ordinal, position, maxLevel, allType, minLevel);
                    if (this.tupColumnInfo[coll.ordinal].showTotals) {
                        position++;
                    }
                }
            }
            collLength--;
        }
    };
    OlapEngine.prototype.setParentCollection = function (members) {
        var memPos = 0;
        while (members.length > memPos) {
            var member = members[memPos];
            var memberType = Number(member.querySelector('MEMBER_TYPE').textContent) > 2 ? '3' :
                member.querySelector('MEMBER_TYPE').textContent;
            var memberlevel = Number(member.querySelector('LNum').textContent);
            var memberUName = member.querySelector('UName').textContent;
            var parentUName = member.querySelector('PARENT_UNIQUE_NAME') ?
                member.querySelector('PARENT_UNIQUE_NAME').textContent : '';
            var isSameParent = true;
            var isWithoutAllMember = false;
            if (this.parentObjCollection[memPos]) {
                var levelCollection = Object.keys(this.parentObjCollection[memPos]);
                var parentMember = this.parentObjCollection[memPos][memberlevel - 1];
                isSameParent = parentMember ? parentUName === parentMember.querySelector('UName').textContent :
                    levelCollection.length === 0;
                isWithoutAllMember = this.tupColumnInfo[0].typeCollection[memPos] === '1';
            }
            if (memberType === '2') {
                delete this.parentObjCollection[memPos];
            }
            else {
                if ((this.isPaging || isWithoutAllMember) ? !isSameParent : false) {
                    delete this.parentObjCollection[memPos];
                }
                if (!this.parentObjCollection[memPos]) {
                    this.parentObjCollection[memPos] = {};
                    this.parentObjCollection[memPos][memberlevel] = member;
                }
                else if (!this.parentObjCollection[memPos][memberlevel] ||
                    this.parentObjCollection[memPos][memberlevel].querySelector('UName').textContent !== memberUName) {
                    this.parentObjCollection[memPos][memberlevel] = member;
                }
            }
            memPos++;
        }
    };
    OlapEngine.prototype.setDrillInfo = function (pUName, parentLvlCollection, memPos, tupPos, tupInfo) {
        tupPos--;
        while (tupInfo[tupPos] && tupInfo[tupPos].drillInfo[memPos].uName === pUName) {
            var prevUcollection = tupInfo[tupPos].uNameCollection.split(/~~|::\[/).map(function (item) {
                return item[0] === '[' ? item : ('[' + item);
            });
            if (prevUcollection.join('~~').indexOf(parentLvlCollection) < 0) {
                break;
            }
            tupInfo[tupPos].drillInfo[memPos].isDrilled = true;
            if (this.curDrillEndPos <= memPos) {
                tupInfo[tupPos].drillEndPos = this.curDrillEndPos = memPos;
                tupInfo[tupPos].endDrillUniquename = pUName;
            }
            if (tupInfo[tupPos].drillStartPos > memPos || tupInfo[tupPos].drillStartPos === -1) {
                tupInfo[tupPos].drillStartPos = memPos;
            }
            tupInfo[tupPos].startDrillUniquename = pUName;
            tupPos--;
        }
    };
    OlapEngine.prototype.levelCompare = function (newLevels, oldLevels) {
        var changePos = [-1, 0];
        for (var lPos = 0; lPos < oldLevels.length; lPos++) {
            if (newLevels[lPos] !== oldLevels[lPos]) {
                changePos = [lPos, newLevels[lPos], (oldLevels[lPos] - newLevels[lPos])];
                break;
            }
        }
        return changePos;
    };
    /* tslint:disable-next-line:max-line-length */
    OlapEngine.prototype.mergeTotCollection = function (position, allCount, maxLevel, allType, minLevel, allStartPos, drillInfo, levelComp) {
        /* tslint:disable-next-line:max-line-length */
        var prevHdrPos = isNullOrUndefined(allStartPos) ? levelComp[0] : (allStartPos - ((this.colMeasurePos === (allStartPos - 1)) ? 2 : 1));
        var flagLevel = drillInfo[prevHdrPos] && drillInfo[prevHdrPos].level;
        var flagLevelString = this.getLevelsAsString(prevHdrPos - 1, drillInfo);
        var groupColl = {};
        var maxCnt = 1;
        var enterFlag = false;
        for (var _i = 0, _a = this.totalCollection; _i < _a.length; _i++) {
            var coll = _a[_i];
            if (enterFlag || (coll.allCount <= allCount &&
                ((flagLevel > -1 && coll.drillInfo[prevHdrPos]) ? ((coll.drillInfo[prevHdrPos].level >= flagLevel) &&
                    (this.getLevelsAsString(prevHdrPos - 1, coll.drillInfo)) === flagLevelString) : true))) {
                /* tslint:disable-next-line:max-line-length */
                var measureName = this.tupColumnInfo[coll.ordinal].measure ? this.tupColumnInfo[coll.ordinal].measure.querySelector('UName').textContent : 'measure';
                if (groupColl[measureName]) {
                    groupColl[measureName].coll.push(coll);
                    groupColl[measureName].count++;
                    maxCnt = maxCnt < groupColl[measureName].count ? groupColl[measureName].count : maxCnt;
                }
                else {
                    groupColl[measureName] = { coll: [coll], count: 1 };
                }
                enterFlag = false;
            }
        }
        var keys = Object.keys(groupColl);
        var collLength = maxCnt - 1;
        while (collLength > -1) {
            for (var _b = 0, keys_2 = keys; _b < keys_2.length; _b++) {
                var key = keys_2[_b];
                var coll1 = groupColl[key].coll[collLength];
                if (coll1) {
                    var isGrandTotal = this.tupColumnInfo[coll1.ordinal].measurePosition === 0 ?
                        this.tupColumnInfo[coll1.ordinal].allStartPos === 1 : this.tupColumnInfo[coll1.ordinal].allStartPos === 0;
                    if (isGrandTotal ? (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showColumnGrandTotals) : true) {
                        this.frameCommonColumnLoop(coll1.members, coll1.ordinal, position, maxLevel, minLevel, allType);
                        if (this.tupColumnInfo[coll1.ordinal].showTotals) {
                            position++;
                        }
                    }
                    this.totalCollection.pop();
                }
            }
            collLength--;
        }
        return position;
    };
    OlapEngine.prototype.getLevelsAsString = function (prevHdrPos, drillInfo) {
        var lvlCollection = [];
        for (var pos = 0; pos < prevHdrPos; pos++) {
            lvlCollection[pos] = drillInfo[pos].level;
        }
        return lvlCollection.length > 0 ? lvlCollection.toString() : '';
    };
    /* tslint:disable-next-line:max-line-length */
    OlapEngine.prototype.frameCommonColumnLoop = function (members, tupPos, position, maxLevel, minLevel, allType) {
        var _a;
        var drillMemberPosition = -1;
        if (this.tupColumnInfo[tupPos].showTotals) {
            var memberPos = 0;
            var memberDepth = 0;
            while (memberPos < members.length) {
                memberDepth += (allType[memberPos] > 0 && this.getMeasurePosition(this.tupColumnInfo[tupPos].uNameCollection, this.tupColumnInfo[tupPos].measurePosition) !== memberPos) ?
                    maxLevel[memberPos] :
                    (maxLevel[memberPos] + (1 - minLevel[memberPos]));
                if (this.tupColumnInfo[tupPos].drillInfo[memberPos].isDrilled && this.tupColumnInfo[tupPos].showTotals) {
                    this.tupColumnInfo[tupPos].showTotals = !this.showColumnSubTotals ? false :
                        this.hideColumnTotalsObject[this.tupColumnInfo[tupPos].drillInfo[memberPos].hierarchy] === undefined;
                    memberDepth -= maxLevel[memberPos] -
                        this.tupColumnInfo[tupPos].levelCollection[memberPos];
                    drillMemberPosition = this.tupColumnInfo[tupPos].showTotals ? -1 : (memberDepth - 1);
                }
                memberPos++;
            }
        }
        var attrDrill = this.checkAttributeDrill(this.tupColumnInfo[tupPos].drillInfo, 'columns');
        if (this.tupColumnInfo[tupPos].showTotals || attrDrill) {
            var memPos = 0;
            var spanMemPos = 0;
            var colMembers = {};
            while (memPos < members.length) {
                var member = members[memPos];
                var memberType = Number(member.querySelector('MEMBER_TYPE').textContent) > 2 ? '3' :
                    member.querySelector('MEMBER_TYPE').textContent;
                var memDup = 0;
                for (var rowDepthPos = memberType !== '2' ? (allType[memPos] ? 1 : minLevel[memPos]) : 1; rowDepthPos <= (memberType === '3' ? 1 : maxLevel[memPos]); rowDepthPos++) {
                    var isDrilled = false;
                    if (!this.pivotValues[spanMemPos]) {
                        this.pivotValues[spanMemPos] = [];
                    }
                    if (Number(members[memPos].querySelector('LNum').textContent) > rowDepthPos && memberType !== '2') {
                        if (!this.parentObjCollection[memPos][rowDepthPos]) {
                            this.getDrilledParent(members[memPos], rowDepthPos, this.parentObjCollection[memPos]);
                        }
                        if (this.parentObjCollection[memPos][rowDepthPos]) {
                            member = this.parentObjCollection[memPos][rowDepthPos];
                        }
                        isDrilled = true;
                    }
                    else {
                        member = members[memPos];
                        memDup++;
                    }
                    if (memberType !== '2') {
                        colMembers[member.querySelector('UName').textContent] = member.querySelector('Caption').textContent;
                    }
                    /* tslint:disable */
                    var levelName = Object.values(colMembers).join('.');
                    var isNamedSet = this.namedSetsPosition['column'][memPos] ? true : false;
                    var uName = this.getUniqueName(member.querySelector('UName').textContent);
                    var depth = this.getDepth(this.tupColumnInfo[tupPos], uName, Number(memberType));
                    if (!(this.isPaging && this.pivotValues[spanMemPos - 1] && this.pivotValues[spanMemPos - 1][position] && this.fieldList[this.pivotValues[spanMemPos - 1][position].hierarchy] && this.fieldList[this.pivotValues[spanMemPos - 1][position].hierarchy].isHierarchy &&
                        this.pivotValues[spanMemPos - 1][position].hasChild && !this.pivotValues[spanMemPos - 1][position].isDrilled && !this.columns[memPos].isNamedSet && this.fieldList[member.getAttribute('Hierarchy')] && (this.fieldList[member.getAttribute('Hierarchy')].isHierarchy || this.fieldList[member.getAttribute('Hierarchy')].hasAllMember) &&
                        this.pivotValues[spanMemPos - 1][position].depth < depth)) {
                        this.pivotValues[spanMemPos][position] = {
                            axis: 'column',
                            actualText: uName,
                            colIndex: position,
                            formattedText: (memberType === '3' && this.dataFields[uName] &&
                                this.dataFields[uName].caption) ? this.dataFields[uName].caption :
                                member.querySelector('Caption').textContent,
                            hasChild: (this.fieldList[member.getAttribute('Hierarchy')] && this.fieldList[member.getAttribute('Hierarchy')].isHierarchy && memPos < this.columns.length - 1 && !this.columns[memPos + 1].isNamedSet && this.columns[memPos + 1].name.indexOf('[Measures]') < 0 && this.fieldList[this.columns[memPos + 1].name] && this.fieldList[this.columns[memPos + 1].name].hasAllMember) ? true : Number(member.querySelector('CHILDREN_CARDINALITY').textContent) > 0 ? true : false,
                            level: memDup > 1 ? -1 : (Number(member.querySelector('LNum').textContent) - ((allType[memPos] && memberType !== '3') ? 1 : 0)),
                            rowIndex: spanMemPos,
                            ordinal: tupPos,
                            memberType: Number(memberType),
                            depth: depth,
                            isDrilled: (this.fieldList[member.getAttribute('Hierarchy')] && this.fieldList[member.getAttribute('Hierarchy')].isHierarchy && !this.isAttributeDrill(member.getAttribute('Hierarchy'), this.tupColumnInfo[tupPos].drillInfo, 'columns')) ? true : (isDrilled || this.tupColumnInfo[tupPos].drillInfo[memPos].isDrilled),
                            parentUniqueName: member.querySelector('PARENT_UNIQUE_NAME') ? member.querySelector('PARENT_UNIQUE_NAME').textContent : undefined,
                            levelUniqueName: member.querySelector('LName').textContent,
                            hierarchy: member.getAttribute('Hierarchy'),
                            isNamedSet: isNamedSet,
                            valueSort: (_a = { levelName: levelName }, _a[levelName] = 1, _a.axis = member.getAttribute('Hierarchy'), _a)
                            /* tslint:enable */
                        };
                        if (!this.headerContent[spanMemPos]) {
                            this.headerContent[spanMemPos] = {};
                        }
                        this.headerContent[spanMemPos][position] = this.pivotValues[spanMemPos][position];
                        spanMemPos++;
                    }
                    else {
                        this.isColDrill = true;
                        break;
                    }
                }
                memPos++;
            }
        }
        else {
            if (drillMemberPosition > -1) {
                this.pivotValues[drillMemberPosition][position - 1].ordinal = tupPos;
            }
            else if (this.tupColumnInfo[tupPos].allCount > 0) {
                var memberPos = 0;
                var memberDepth = 0;
                while (memberPos < this.tupColumnInfo[tupPos].allStartPos) {
                    memberDepth += (allType[memberPos] > 0 && this.getMeasurePosition(this.tupColumnInfo[tupPos].uNameCollection, this.tupColumnInfo[tupPos].measurePosition) !== memberPos) ?
                        maxLevel[memberPos] :
                        (maxLevel[memberPos] + (1 - minLevel[memberPos]));
                    memberPos++;
                }
                if (this.tupColumnInfo[tupPos].allStartPos === (this.tupColumnInfo[tupPos].measurePosition + 1)) {
                    memberDepth -= maxLevel[this.tupColumnInfo[tupPos].allStartPos - 2] -
                        this.tupColumnInfo[tupPos].levelCollection[this.tupColumnInfo[tupPos].allStartPos - 2] + 1;
                }
                else {
                    memberDepth -= maxLevel[this.tupColumnInfo[tupPos].allStartPos - 1] -
                        this.tupColumnInfo[tupPos].levelCollection[this.tupColumnInfo[tupPos].allStartPos - 1];
                }
                this.pivotValues[memberDepth - 1][position - 1].ordinal = tupPos;
            }
        }
    };
    OlapEngine.prototype.isAttributeDrill = function (hierarchy, drillInfo, axis) {
        var isDrill = false;
        var isAdjacent = this.isAdjacentToMeasure(hierarchy, axis);
        if (!isAdjacent) {
            for (var i = 0; i < this.drilledMembers.length; i++) {
                if (this.drilledMembers[i].name === hierarchy) {
                    for (var j = 0; j < this.drilledMembers[i].items.length; j++) {
                        var drillItems = this.drilledMembers[i].items[j].split(this.drilledMembers[i].delimiter);
                        var levelName = '';
                        for (var k = 0; k < drillItems.length; k++) {
                            if (drillInfo[k] && drillInfo[k].uName) {
                                levelName = levelName + (levelName === '' ? '' : this.drilledMembers[i].delimiter) + drillInfo[k].uName;
                            }
                        }
                        if (levelName === this.drilledMembers[i].items[j]) {
                            isDrill = true;
                            break;
                        }
                    }
                }
            }
        }
        return isDrill;
    };
    OlapEngine.prototype.isAdjacentToMeasure = function (hierarchy, axis) {
        var isAdjacent = false;
        var fields = axis === 'rows' ? this.rows : this.columns;
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].name === hierarchy && fields[i + 1] && (fields[i + 1].name === '[Measures]' || fields[i + 1].isNamedSet || (this.fieldList[fields[i + 1].name] && !this.fieldList[fields[i + 1].name].hasAllMember))) {
                isAdjacent = true;
                break;
            }
        }
        return isAdjacent;
    };
    OlapEngine.prototype.getDrilledParent = function (childMember, parentLevel, savedCollection) {
        var childlevel = Number(childMember.querySelector('LNum').textContent);
        var currentChild = childMember;
        for (var lvl = childlevel - 1; lvl >= parentLevel; lvl--) {
            var currentParent = this.drilledSets[currentChild.querySelector('PARENT_UNIQUE_NAME').textContent];
            if (currentParent) {
                savedCollection[lvl] = currentParent;
                currentChild = currentParent;
            }
            else {
                break;
            }
        }
    };
    /* tslint:disable:max-func-body-length */
    OlapEngine.prototype.performRowSorting = function () {
        var _a;
        if (this.enableSort && this.tupRowInfo.length > 0) {
            var rowCount = this.pivotValues.length;
            var lvlGrouping = {};
            var measureObjects = {};
            var gSumGrouping = [];
            var gSumFlag = false;
            var withoutAllLastPos = this.tupRowInfo[0].typeCollection.lastIndexOf('1');
            for (var rPos = this.colDepth; rPos < rowCount; rPos++) {
                var currentCell = this.pivotValues[rPos][0];
                var currentTuple = this.tupRowInfo[currentCell.ordinal];
                var uniqueName = currentTuple ? (currentTuple.measurePosition === 0 && currentCell.memberType === 3 ?
                    currentTuple.measureName : currentTuple.uNameCollection) : '';
                if (uniqueName !== '') {
                    if (withoutAllLastPos > -1) {
                        uniqueName = this.frameUniqueName(uniqueName, currentCell, currentTuple);
                    }
                    var level = uniqueName.split(/~~|::\[/).length;
                    if (currentCell.memberType === 3 && this.tupRowInfo[0].measurePosition > 0) {
                        var parentUName = this.getParentUname(uniqueName, currentCell, true, true);
                        if (measureObjects[parentUName]) {
                            measureObjects[parentUName].push(currentCell);
                        }
                        else {
                            measureObjects[parentUName] = [currentCell];
                        }
                    }
                    else if (lvlGrouping[level]) {
                        lvlGrouping[level][uniqueName] = [currentCell];
                    }
                    else {
                        lvlGrouping[level] = (_a = {}, _a[uniqueName] = [currentCell], _a);
                    }
                }
                if (gSumFlag) {
                    gSumGrouping.push(currentCell);
                }
                if (currentCell.type === 'grand sum') {
                    gSumFlag = true;
                }
            }
            var isMeasureAvail = Object.keys(measureObjects).length > 0 && this.tupRowInfo[0].measurePosition > 0;
            /* tslint:disable:typedef */
            var levels = Object.keys(lvlGrouping).map(function (item) {
                return Number(item);
            }).sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0); });
            /* tslint:enable:typedef */
            var sortLvlGrouping = {};
            for (var lPos = levels.length - 1; lPos >= 0; lPos--) {
                var parentGrouping = {};
                var objCollection = lvlGrouping[levels[lPos]];
                var objKeys = Object.keys(objCollection);
                for (var oPos = 0; oPos < objKeys.length; oPos++) {
                    var parentUName = lPos === 0 ? 'parent' :
                        this.getParentUname(objKeys[oPos], objCollection[objKeys[oPos]][0], isMeasureAvail, false);
                    if (parentGrouping[parentUName]) {
                        parentGrouping[parentUName].push(objCollection[objKeys[oPos]][0]);
                    }
                    else {
                        parentGrouping[parentUName] = [objCollection[objKeys[oPos]]][0];
                    }
                }
                var pKeys = Object.keys(parentGrouping);
                for (var kPos = 0; kPos < pKeys.length; kPos++) {
                    parentGrouping[pKeys[kPos]] = this.sortRowHeaders(parentGrouping[pKeys[kPos]]);
                }
                if (sortLvlGrouping[levels[lPos + 1]]) {
                    for (var kPos = 0; kPos < pKeys.length; kPos++) {
                        var groupSets = [];
                        var axisSets = parentGrouping[pKeys[kPos]];
                        for (var aPos = 0; aPos < axisSets.length; aPos++) {
                            var tupInfo = this.tupRowInfo[axisSets[aPos].ordinal];
                            var uName = (tupInfo.measurePosition === 0 && axisSets[aPos].memberType === 3) ?
                                tupInfo.measureName : tupInfo.uNameCollection;
                            groupSets.push(axisSets[aPos]);
                            if (withoutAllLastPos > -1) {
                                uName = this.frameUniqueName(uName, axisSets[aPos], tupInfo);
                            }
                            var isMembersIncluded = false;
                            if (isMeasureAvail) {
                                var parentUName = this.getParentUname(uName, axisSets[aPos], isMeasureAvail, true);
                                if (measureObjects[parentUName]) {
                                    measureObjects[parentUName] = this.sortRowHeaders(measureObjects[parentUName]);
                                    var isLastMeasure = uName.lastIndexOf('::[') === uName.indexOf('::[Measures]');
                                    var isFullLength = uName.split('::[').length - 1 === tupInfo.measurePosition;
                                    var isLastNotDrilledMember = !tupInfo.drillInfo[tupInfo.measurePosition - 1].isDrilled;
                                    var isActualLastMember = tupInfo.members.length > (tupInfo.measurePosition + 1);
                                    if (isLastMeasure && isFullLength && isLastNotDrilledMember && isActualLastMember) {
                                        isMembersIncluded = true;
                                        for (var mPos = 0; mPos < measureObjects[parentUName].length; mPos++) {
                                            groupSets.push(measureObjects[parentUName][mPos]);
                                            var matchParent = (uName.substring(0, uName.indexOf('::[Measures]')) + '::' + measureObjects[parentUName][mPos].actualText);
                                            if (sortLvlGrouping[levels[lPos + 1]][matchParent]) {
                                                groupSets = groupSets.concat(sortLvlGrouping[levels[lPos + 1]][matchParent]);
                                            }
                                        }
                                    }
                                    else {
                                        groupSets = groupSets.concat(measureObjects[parentUName]);
                                    }
                                }
                            }
                            if (!isMembersIncluded &&
                                sortLvlGrouping[levels[lPos + 1]][uName]) {
                                groupSets = groupSets.concat(sortLvlGrouping[levels[lPos + 1]][uName]);
                            }
                        }
                        parentGrouping[pKeys[kPos]] = groupSets;
                    }
                }
                else if (isMeasureAvail) {
                    for (var kPos = 0; kPos < pKeys.length; kPos++) {
                        var axisSets = parentGrouping[pKeys[kPos]];
                        var groupSets = [];
                        for (var aPos = 0; aPos < axisSets.length; aPos++) {
                            groupSets.push(axisSets[aPos]);
                            var uName = this.tupRowInfo[axisSets[aPos].ordinal].uNameCollection;
                            if (withoutAllLastPos > -1) {
                                uName = this.frameUniqueName(uName, axisSets[aPos], this.tupRowInfo[axisSets[aPos].ordinal]);
                            }
                            var parentUName = this.getParentUname(uName, axisSets[aPos], true, true);
                            if (measureObjects[parentUName]) {
                                measureObjects[parentUName] = this.sortRowHeaders(measureObjects[parentUName]);
                                groupSets = groupSets.concat(measureObjects[parentUName]);
                            }
                        }
                        parentGrouping[pKeys[kPos]] = groupSets;
                    }
                }
                sortLvlGrouping[levels[lPos]] = parentGrouping;
            }
            var newPos = 0;
            var totPos = 0;
            gSumFlag = false;
            gSumGrouping = this.sortRowHeaders(gSumGrouping);
            for (var rPos = this.colDepth; rPos < rowCount; rPos++) {
                /* tslint:disable:no-string-literal */
                var cell = gSumFlag ? gSumGrouping : sortLvlGrouping[levels[0]]['parent'];
                /* tslint:enable:no-string-literal */
                var currPos = gSumFlag ? (newPos - totPos) : newPos;
                if (cell[currPos]) {
                    this.pivotValues[rPos] = [cell[currPos]];
                    this.pivotValues[rPos][0].rowIndex = rPos;
                    this.valueContent[newPos][0] = this.pivotValues[rPos][0];
                }
                newPos++;
                if (this.pivotValues[rPos][0].type === 'grand sum') {
                    gSumFlag = true;
                    totPos = newPos;
                }
            }
        }
    };
    /* tslint:disable */
    OlapEngine.prototype.performColumnSorting = function () {
        if (this.enableSort) {
            for (var i = 0; i < this.dataSourceSettings.columns.length; i++) {
                var temporary = [];
                var index = 0;
                var grandTotal = [];
                for (var j = 0; j < this.pivotValues.length; j++) {
                    var header = this.pivotValues[j];
                    var key = void 0;
                    var keys = void 0;
                    var arrange = {};
                    var value = 1;
                    grandTotal[index] = [];
                    temporary[index] = [];
                    var k = 1;
                    for (k = k; k < header.length; k++) {
                        if (!header[k].isNamedSet) {
                            if (header[k].memberType != 2 && header[k].hierarchy
                                != '[Measures]' && header[k].level != -1) {
                                if (isNullOrUndefined(arrange[header[k].formattedText]) || isNullOrUndefined(this.pivotValues[j - 1])) {
                                    arrange[header[k].formattedText] = arrange[header[k].formattedText] ? arrange[header[k].formattedText] : [];
                                    arrange[header[k].formattedText][header[k].colIndex] = header[k];
                                }
                                else if (arrange[header[k].formattedText] && this.pivotValues[j - 1]) {
                                    var prevRowCell = this.pivotValues[j - 1][header[k].colIndex];
                                    var prevColIndex = Object.values(arrange[header[k].formattedText])[0].colIndex;
                                    var prevColRowCell = this.pivotValues[j - 1][prevColIndex];
                                    if (prevRowCell.formattedText !== prevColRowCell.formattedText) {
                                        var key_1 = Object.keys(arrange);
                                        key_1 = this.sortColumnHeaders(key_1, this.sortObject[header[k - 1].levelUniqueName] ||
                                            this.sortObject[header[k].hierarchy]);
                                        isNullOrUndefined(temporary[index]) ? temporary[index] = [] : temporary[index];
                                        for (var keyPos = 0; keyPos < key_1.length; keyPos++) {
                                            var length_1 = Object.keys(arrange[key_1[keyPos]]).length;
                                            for (var cellPos = 0; cellPos < length_1; cellPos++) {
                                                value = temporary[index].length === 0 ? 1 : 0;
                                                temporary[index][temporary[index].length + value] =
                                                    arrange[key_1[keyPos]][Number(Object.keys(arrange[key_1[keyPos]])[cellPos])];
                                            }
                                        }
                                        arrange = {};
                                        arrange[header[k].formattedText] = [];
                                        arrange[header[k].formattedText][header[k].colIndex] = header[k];
                                    }
                                    else {
                                        arrange[header[k].formattedText][header[k].colIndex] = header[k];
                                    }
                                }
                            }
                            else if (Object.keys(arrange).length > 0) {
                                grandTotal[index][grandTotal[index].length + value] = header[k];
                                key = Object.keys(arrange);
                                key = this.sortColumnHeaders(key, this.sortObject[header[k - 1].levelUniqueName] ||
                                    this.sortObject[header[k].hierarchy]);
                                isNullOrUndefined(temporary[index]) ? temporary[index] = [] : temporary[index];
                                for (var l = 0; l < key.length; l++) {
                                    var length_2 = Object.keys(arrange[key[l]]).length;
                                    for (var q = 0; q < length_2; q++) {
                                        value = temporary[index].length === 0 ? 1 : 0;
                                        temporary[index][temporary[index].length + value] =
                                            arrange[key[l]][Number(Object.keys(arrange[key[l]])[q])];
                                    }
                                }
                            }
                            else if ((header[k].level === -1 || header[k].level === 0) &&
                                Object.keys(arrange).length >= 0 && header[k].hierarchy != '[Measures]') {
                                grandTotal[index][grandTotal[index].length + value] = header[k];
                            }
                            if (header[k].level != -1 && Object.keys(arrange).length === 1 &&
                                header[k].hierarchy != '[Measures]' && !isNullOrUndefined(header[k + 1]) &&
                                header[k + 1].level === -1) {
                                var height = Object.keys(arrange[header[k].formattedText]).length;
                                var weight = Object.keys(arrange[header[k].formattedText]);
                                if (height > 1) {
                                    for (var hgt = 0; hgt < height; hgt++) {
                                        value = grandTotal[index].length === 0 ? 1 : 0;
                                        grandTotal[index][grandTotal[index].length + value] =
                                            arrange[header[k].formattedText][Number(weight[hgt])];
                                    }
                                }
                                else {
                                    grandTotal[index][grandTotal[index].length + value] = header[k];
                                }
                            }
                            if (Object.keys(grandTotal[index]).length > 0) {
                                value = temporary[index].length === 0 ? 1 : 0;
                                var height1 = grandTotal[index].length;
                                if (height1 > 2) {
                                    for (var hgt1 = 1; hgt1 < height1; hgt1++) {
                                        value = temporary[index].length === 0 ? 1 : 0;
                                        temporary[index][temporary[index].length + value] =
                                            grandTotal[index][hgt1];
                                    }
                                }
                                else {
                                    temporary[index][temporary[index].length + value] =
                                        grandTotal[index][1] || grandTotal[index][0];
                                }
                                arrange = {};
                                grandTotal[index] = [];
                            }
                        }
                    }
                    if (Object.keys(arrange).length > 0) {
                        grandTotal[index][grandTotal[index].length + value] = header[k];
                        keys = Object.keys(arrange);
                        var order = this.sortObject[header[k - 1].levelUniqueName] || this.sortObject[header[k - 1].hierarchy];
                        key = this.sortColumnHeaders(keys, order);
                        isNullOrUndefined(temporary[index]) ? temporary[index] = [] : temporary[index];
                        for (var len = 0; len < keys.length; len++) {
                            var leng = Object.keys(arrange[keys[len]]).length;
                            for (var q = 0; q < leng; q++) {
                                value = temporary[index].length === 0 ? 1 : 0;
                                temporary[index][temporary[index].length + value] =
                                    arrange[key[len]][Number(Object.keys(arrange[keys[len]])[q])];
                            }
                        }
                    }
                    for (var m = 1; m < temporary[index].length; m++) {
                        this.pivotValues[index][m] = temporary[index][m];
                    }
                    for (var n = j; n < this.pivotValues.length; n++) {
                        var pElement = extend({}, this.pivotValues[n + 1], null, true);
                        var cElement = extend({}, this.pivotValues[n], null, true);
                        if (Object.keys(pElement).length === Object.keys(cElement).length && Object.keys(pElement).length > 2) {
                            for (var o = 1; o < this.pivotValues[j].length; o++) {
                                if (Object.keys(pElement).length > 0 && cElement[o].colIndex
                                    != pElement[o].colIndex) {
                                    this.pivotValues[n + 1][o] = pElement[cElement[o].colIndex];
                                }
                            }
                            break;
                        }
                    }
                    index++;
                    arrange = {};
                }
                for (var i_1 = 0; i_1 < this.pivotValues.length; i_1++) {
                    var header = this.pivotValues[i_1];
                    for (var j = 1; j < header.length; j++) {
                        header[j].colIndex = j;
                    }
                }
            }
        }
    };
    OlapEngine.prototype.frameUniqueName = function (uniqueName, currentCell, currentTuple) {
        var hasLastMeasure = uniqueName.indexOf(currentCell.actualText.toString() + '::[Measures]') > -1;
        uniqueName = uniqueName.substring(0, uniqueName.indexOf(currentCell.actualText.toString())) +
            currentCell.actualText.toString();
        var measureAvail = uniqueName.split('::[').length <= this.getMeasurePosition(uniqueName, currentTuple.measurePosition);
        uniqueName = uniqueName + ((hasLastMeasure || measureAvail) ? ('::' + currentTuple.measureName) : '');
        return uniqueName;
    };
    OlapEngine.prototype.getMeasurePosition = function (uniqueName, measurePosition) {
        var position = measurePosition;
        var collection = uniqueName.split('::[');
        for (var i = 0; i < collection.length; i++) {
            if (collection[i] && collection[i].indexOf('Measures') > -1) {
                position = i;
                break;
            }
        }
        return position;
    };
    OlapEngine.prototype.sortRowHeaders = function (headers) {
        if (headers.length > 0 && headers[0].memberType !== 3 && !headers[0].isNamedSet) {
            var order = (this.sortObject[headers[0].hierarchy] || this.sortObject[headers[0].levelUniqueName]);
            if (order === 'Ascending' || order === undefined) {
                headers === headers.sort(function (a, b) { return (a.formattedText > b.formattedText) ? 1 :
                    ((b.formattedText > a.formattedText) ? -1 : 0); });
            }
            else if (order === 'Descending') {
                headers === headers.sort(function (a, b) { return (a.formattedText < b.formattedText) ? 1 :
                    ((b.formattedText < a.formattedText) ? -1 : 0); });
            }
            else {
                headers;
            }
        }
        return headers;
    };
    OlapEngine.prototype.sortColumnHeaders = function (keys, order) {
        if (order === 'Ascending' || order === undefined) {
            keys.sort(function (a, b) { return (a > b) ? 1 : ((b > a) ? -1 : 0); });
        }
        else if (order === 'Descending') {
            keys.sort(function (a, b) { return (a < b) ? 1 : ((b < a) ? -1 : 0); });
        }
        return keys;
    };
    /* tslint:enable */
    OlapEngine.prototype.frameSortObject = function () {
        if (this.enableSort) {
            for (var fPos = 0; fPos < this.sortSettings.length; fPos++) {
                this.sortObject[this.sortSettings[fPos].name] = this.sortSettings[fPos].order;
            }
        }
    };
    OlapEngine.prototype.getParentUname = function (uniqueNameColl, cell, isMeasureAvail, isLastMeasure) {
        var parentString = '';
        if (isMeasureAvail && !isLastMeasure) {
            var tuple = this.tupRowInfo[cell.ordinal];
            var sepPos = [];
            var sepObjects = {};
            for (var i = 0; i < uniqueNameColl.length; i++) {
                if (uniqueNameColl[i] === '~' || uniqueNameColl[i] === ':') {
                    sepPos.push(i);
                    sepObjects[i] = uniqueNameColl[i] + uniqueNameColl[i];
                    i++;
                }
            }
            if (this.getMeasurePosition(uniqueNameColl, tuple.measurePosition) >= (uniqueNameColl.split('::[').length - 1)) {
                if (sepPos[sepPos.length - 2] > -1) {
                    parentString = uniqueNameColl.substring(0, sepPos[sepPos.length - 2]) + sepObjects[sepPos[sepPos.length - 1]] +
                        tuple.measureName;
                }
                else {
                    parentString = 'parent';
                }
            }
            else {
                var lastPosition = uniqueNameColl.lastIndexOf('~~') > uniqueNameColl.lastIndexOf('::[') ?
                    uniqueNameColl.lastIndexOf('~~') : uniqueNameColl.lastIndexOf('::[');
                parentString = lastPosition > -1 ? uniqueNameColl.substring(0, lastPosition) : 'parent';
            }
        }
        else {
            var lastPosition = uniqueNameColl.lastIndexOf('~~') > uniqueNameColl.lastIndexOf('::[') ?
                uniqueNameColl.lastIndexOf('~~') : uniqueNameColl.lastIndexOf('::[');
            parentString = lastPosition > -1 ? uniqueNameColl.substring(0, lastPosition) : 'parent';
        }
        return parentString;
    };
    OlapEngine.prototype.performColumnSpanning = function () {
        var spanCollection = {};
        var rowPos = this.rowStartPos - 1;
        var colMeasureCount = Object.keys(this.colMeasures).length;
        while (rowPos > -1) {
            spanCollection[rowPos] = {};
            var colPos = this.pivotValues[rowPos].length - 1;
            while (colPos > 0) {
                spanCollection[rowPos][colPos] = 1;
                var nextColCell = this.pivotValues[rowPos][colPos + 1];
                /* tslint:disable-next-line:max-line-length */
                var nextRowCell = (this.pivotValues[rowPos + 1] && this.rowStartPos - rowPos > 1) ? this.pivotValues[rowPos + 1][colPos] : undefined;
                var currCell = this.pivotValues[rowPos][colPos];
                var colflag = false;
                var rowflag = false;
                var tupColInfo = this.tupColumnInfo[currCell.ordinal];
                var isSubTot = tupColInfo.allStartPos > (tupColInfo.typeCollection[0] === '3' ? 1 : 0);
                var attrDrill = this.checkAttributeDrill(tupColInfo.drillInfo, 'columns');
                if (nextRowCell && nextColCell && ((currCell.memberType === 2 || currCell.level === -1) ?
                    (nextColCell.actualText === currCell.actualText) :
                    ((currCell.memberType === 3 && currCell.actualText === nextColCell.actualText) ||
                        nextColCell.valueSort.levelName === currCell.valueSort.levelName))) {
                    if (currCell.memberType === 2) {
                        if (isSubTot ? nextColCell.type === 'sum' : true) {
                            currCell.colSpan = (nextColCell.colSpan + 1) >
                                (tupColInfo.measurePosition > rowPos ? colMeasureCount : 0) ? 1 : (nextColCell.colSpan + 1);
                        }
                        else {
                            currCell.colSpan = 1;
                        }
                    }
                    else {
                        currCell.colSpan = nextColCell.colSpan + 1;
                        currCell.ordinal = nextColCell.ordinal;
                    }
                    colflag = true;
                }
                if (currCell.memberType === 2) {
                    if (isSubTot) {
                        if (!attrDrill) {
                            currCell.type = 'sum';
                        }
                        /* tslint:disable-next-line:max-line-length */
                        //currCell.formattedText = (this.pivotValues[tupColInfo.allStartPos - 1] as IAxisSet[])[colPos].formattedText + ' Total';
                        currCell.formattedText = 'Total';
                        currCell.valueSort.levelName = currCell.valueSort.levelName;
                        currCell.valueSort[currCell.valueSort.levelName.toString()] = 1;
                    }
                    else {
                        var levelName = 'Grand Total';
                        if (nextRowCell && colMeasureCount > 0) {
                            levelName = nextRowCell.memberType === 3 ? ('Grand Total.' + nextRowCell.formattedText) :
                                nextRowCell.valueSort.levelName;
                        }
                        currCell.type = 'grand sum';
                        currCell.formattedText = 'Grand Total';
                        currCell.valueSort.levelName = levelName;
                        currCell.valueSort[levelName.toString()] = 1;
                    }
                    currCell.hasChild = false;
                }
                else if (currCell.level === -1) {
                    currCell.type = 'sum';
                    //currCell.formattedText = currCell.formattedText + ' Total';
                    currCell.formattedText = 'Total';
                    currCell.hasChild = false;
                    currCell.valueSort.levelName = currCell.valueSort.levelName;
                    currCell.valueSort[currCell.valueSort.levelName.toString()] = 1;
                }
                if (nextRowCell) {
                    if ((currCell.memberType === 2 && nextRowCell.memberType === 2) || nextRowCell.actualText === currCell.actualText) {
                        spanCollection[rowPos][colPos] = spanCollection[rowPos + 1] ? (spanCollection[rowPos + 1][colPos] + 1) : 1;
                        /* tslint:disable-next-line:max-line-length */
                        if (rowPos === 0 || (currCell.memberType === 1 && currCell.level > -1 && nextRowCell.memberType === 1 && nextRowCell.level === -1)) {
                            currCell.rowSpan = (currCell.isDrilled && ((this.fieldList[currCell.hierarchy] && this.fieldList[currCell.hierarchy].isHierarchy) ? currCell.hasChild : true)) ? 1 : (spanCollection[rowPos + 1][colPos] + 1);
                            /* tslint:disable-next-line:max-line-length */
                            nextRowCell.rowSpan = (nextRowCell.isDrilled && ((this.fieldList[nextRowCell.hierarchy] && this.fieldList[nextRowCell.hierarchy].isHierarchy) ? nextRowCell.hasChild : true) && nextRowCell.level === -1) ? spanCollection[rowPos + 1][colPos] : nextRowCell.rowSpan;
                        }
                        else {
                            if (currCell.memberType === 3) {
                                currCell.rowSpan = 1;
                            }
                            else {
                                currCell.rowSpan = -1;
                            }
                        }
                        rowflag = true;
                    }
                    else if (currCell.isDrilled && ((this.fieldList[currCell.hierarchy] && this.fieldList[currCell.hierarchy].isHierarchy) ? currCell.hasChild : true) && currCell.level === -1 && nextRowCell.memberType === 2) {
                        spanCollection[rowPos][colPos] = spanCollection[rowPos + 1] ? (spanCollection[rowPos + 1][colPos] + 1) : 1;
                        currCell.rowSpan = -1;
                        rowflag = true;
                    }
                    else {
                        currCell.rowSpan = rowPos === 0 ? spanCollection[rowPos][colPos] : -1;
                        /* tslint:disable-next-line:max-line-length */
                        nextRowCell.rowSpan = ((nextRowCell.level > -1 && !(nextRowCell.isDrilled && ((this.fieldList[nextRowCell.hierarchy] && this.fieldList[nextRowCell.hierarchy].isHierarchy) ? nextRowCell.hasChild : true))) || (currCell.memberType !== 2 && nextRowCell.memberType === 2)) ? spanCollection[rowPos + 1][colPos] : 1;
                    }
                }
                else {
                    currCell.rowSpan = (currCell.level > -1 || this.rowStartPos === 1) ? spanCollection[rowPos][colPos] : -1;
                }
                if (!colflag) {
                    currCell.colSpan = 1;
                }
                if (!rowflag) {
                    spanCollection[rowPos][colPos] = 1;
                }
                colPos--;
            }
            rowPos--;
        }
    };
    OlapEngine.prototype.frameValues = function (tuples, colLength) {
        var rowStartPos = this.colDepth;
        var rowEndPos = this.pivotValues.length;
        var startRowOrdinal = 0;
        if (this.customArgs.action === 'down') {
            var keys = Object.keys(this.onDemandDrillEngine);
            rowStartPos = Number(keys[0]);
            rowEndPos = Number(keys[keys.length - 1]) + 1;
            startRowOrdinal = this.onDemandDrillEngine[rowStartPos][0].ordinal;
        }
        var valCollection = {};
        for (var colPos = 0; colPos < tuples.length; colPos++) {
            valCollection[Number(tuples[colPos].getAttribute('CellOrdinal'))] = tuples[colPos];
        }
        for (var rowPos = rowStartPos; rowPos < rowEndPos; rowPos++) {
            var columns = this.pivotValues[rowPos];
            var rowOrdinal = columns[0].ordinal;
            for (var colPos = 1; colPos < this.pivotValues[0].length; colPos++) {
                if (this.pivotValues[this.colDepth - 1][colPos]) {
                    var colOrdinal = this.pivotValues[this.colDepth - 1][colPos].ordinal;
                    var lastColCell = this.pivotValues[this.colDepth - 1][colPos];
                    var measure = columns[0].memberType === 3 ? columns[0].actualText.toString() :
                        ((this.tupColumnInfo[lastColCell.ordinal] && this.tupColumnInfo[lastColCell.ordinal].measure) ?
                            this.tupColumnInfo[lastColCell.ordinal].measure.querySelector('UName').textContent :
                            columns[0].actualText);
                    if (columns[0].type === 'header') {
                        columns[colPos] = {
                            axis: 'value',
                            actualText: this.getUniqueName(measure),
                            formattedText: '',
                            value: 0,
                            colIndex: colPos,
                            rowIndex: rowPos
                        };
                    }
                    else {
                        var valElement = void 0;
                        var formattedText = void 0;
                        var value = '0';
                        var measureName = this.getUniqueName(measure);
                        var showTotals = true;
                        var attrDrill = (this.fieldList[columns[0].hierarchy] && this.fieldList[columns[0].hierarchy].isHierarchy && columns[0].isDrilled);
                        if (this.tupRowInfo[rowOrdinal]) {
                            showTotals = this.tupRowInfo[rowOrdinal].showTotals;
                        }
                        else {
                            showTotals = this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showRowGrandTotals;
                        }
                        valElement = valCollection[(rowOrdinal - startRowOrdinal) * colLength + colOrdinal];
                        formattedText = (!showTotals && attrDrill) ? '' :
                            ((!isNullOrUndefined(valElement) && !isNullOrUndefined(valElement.querySelector('FmtValue'))) ?
                                valElement.querySelector('FmtValue').textContent : this.emptyCellTextContent);
                        value = (!showTotals && attrDrill) ? '0' :
                            ((!isNullOrUndefined(valElement) && !isNullOrUndefined(valElement.querySelector('Value'))) ?
                                valElement.querySelector('Value').textContent : null);
                        formattedText = showTotals && !isNullOrUndefined(value) ?
                            this.getFormattedValue(Number(value), measureName, (formattedText !== '' ? formattedText : value)) :
                            formattedText;
                        var isSum = (this.tupColumnInfo[colOrdinal] ? (this.tupColumnInfo[colOrdinal].allCount > 0 ||
                            this.tupColumnInfo[colOrdinal].drillStartPos > -1) : true) ||
                            (this.tupRowInfo[rowOrdinal] ? (this.tupRowInfo[rowOrdinal].allCount > 0 ||
                                this.tupRowInfo[rowOrdinal].drillStartPos > -1) : true);
                        /* tslint:disable */
                        var isGrand = (this.tupRowInfo[rowOrdinal] ? (this.tupRowInfo[rowOrdinal].measurePosition === 0 ? this.tupRowInfo[rowOrdinal].allStartPos === 1 : this.tupRowInfo[rowOrdinal].allStartPos === 0) : false) ||
                            (this.tupColumnInfo[colOrdinal] ? (this.tupColumnInfo[colOrdinal].measurePosition === 0 ? this.tupColumnInfo[colOrdinal].allStartPos === 1 : this.tupColumnInfo[colOrdinal].allStartPos === 0) : false);
                        /* tslint:enable */
                        columns[colPos] = {
                            axis: 'value',
                            actualText: measureName,
                            formattedText: formattedText,
                            colOrdinal: colOrdinal,
                            rowOrdinal: rowOrdinal,
                            columnHeaders: this.tupColumnInfo[colOrdinal] ? this.tupColumnInfo[colOrdinal].captionCollection : '',
                            rowHeaders: this.tupRowInfo[rowOrdinal] ? this.tupRowInfo[rowOrdinal].captionCollection : '',
                            value: !isNullOrUndefined(value) ? Number(value) : null,
                            colIndex: colPos,
                            rowIndex: rowPos,
                            isSum: isSum,
                            isGrandSum: isGrand
                        };
                    }
                    this.valueContent[rowPos - this.rowStartPos][colPos] = columns[colPos];
                }
            }
        }
    };
    /** hidden */
    OlapEngine.prototype.getFormattedValue = function (value, fieldName, formattedText) {
        var formattedValue = formattedText;
        if (this.formatFields[fieldName] && !isNullOrUndefined(value)) {
            var formatField = (this.formatFields[fieldName].properties ?
                this.formatFields[fieldName].properties : this.formatFields[fieldName]);
            var formatObj = extend({}, formatField, null, true);
            delete formatObj.name;
            if (!formatObj.minimumSignificantDigits && formatObj.minimumSignificantDigits < 1) {
                delete formatObj.minimumSignificantDigits;
            }
            if (!formatObj.maximumSignificantDigits && formatObj.maximumSignificantDigits < 1) {
                delete formatObj.maximumSignificantDigits;
            }
            if (formatObj.type) {
                formattedValue = this.globalize.formatDate(new Date(value.toString()), formatObj);
            }
            else {
                delete formatObj.type;
                if ((formatObj.format) && !(this.formatRegex.test(formatObj.format))) {
                    var pattern = formatObj.format.match(this.customRegex);
                    var integerPart = pattern[6];
                    formatObj.useGrouping = integerPart.indexOf(',') !== -1;
                }
                formattedValue = this.globalize.formatNumber(value, formatObj);
            }
        }
        return formattedValue;
    };
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    OlapEngine.prototype.getMeasureInfo = function () {
        var mAxis = 'column';
        var mIndex;
        var values = [];
        for (var _i = 0, _a = this.values; _i < _a.length; _i++) {
            var field = _a[_i];
            values[values.length] = (field.isCalculatedField ? this.fieldList[field.name].tag : field.name);
        }
        if (values.length > 1) {
            if (this.isMeasureAvail) {
                var isAvail = false;
                for (var i = 0, cnt = this.rows.length; i < cnt; i++) {
                    if (this.rows[i].name.toLowerCase() === '[measures]') {
                        mAxis = 'row';
                        mIndex = i;
                        isAvail = true;
                        break;
                    }
                }
                if (!isAvail) {
                    for (var i = 0, cnt = this.columns.length; i < cnt; i++) {
                        if (this.columns[i].name.toLowerCase() === '[measures]') {
                            mAxis = 'column';
                            mIndex = i;
                            isAvail = true;
                            break;
                        }
                    }
                }
            }
            else {
                mAxis = this.valueAxis;
                mIndex = mAxis === 'row' ? this.rows.length - 1 : this.columns.length - 1;
            }
            return { measureAxis: mAxis, measureIndex: mIndex, valueInfo: values };
        }
        else {
            return { measureAxis: mAxis, measureIndex: -1, valueInfo: [] };
        }
    };
    /* tslint:disable:max-func-body-length */
    OlapEngine.prototype.frameMeasureOrder = function (measureInfo, axis, tuples, vTuples, cLen) {
        var orderedTuples = [];
        var orderedVTuples = [];
        var orderedIndex = [];
        var levels = {};
        var cLevels = [];
        var measureAxis = measureInfo.measureAxis;
        var measureIndex = measureInfo.measureIndex;
        var values = measureInfo.valueInfo;
        if (measureAxis === axis && values.length > 0) {
            var levelCollection = {};
            var uniqueLevels = [];
            for (var j = 0, lnt = tuples.length; j < lnt; j++) {
                var node = tuples[j];
                var members = [].slice.call(node.querySelectorAll('Member'));
                var level = '';
                var cLevel = '';
                var i = 0;
                while (i < members.length) {
                    level = level + (level !== '' ? '~~' : '') + members[i].querySelector('UName').textContent;
                    if (i === measureIndex && measureIndex === 0) {
                        cLevel = level;
                    }
                    else if (i === (measureIndex - 1)) {
                        cLevel = level;
                    }
                    i++;
                }
                if (levelCollection[cLevel]) {
                    levelCollection[cLevel][levelCollection[cLevel].length] = level;
                }
                else {
                    levelCollection[cLevel] = [level];
                    uniqueLevels[uniqueLevels.length] = cLevel;
                }
                levels[level] = { index: j, node: node };
                cLevels[cLevels.length] = level;
            }
            if (cLevels.length > 0) {
                if (uniqueLevels.length > 0) {
                    if (measureIndex === 0) {
                        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                            var name_1 = values_1[_i];
                            for (var _a = 0, uniqueLevels_1 = uniqueLevels; _a < uniqueLevels_1.length; _a++) {
                                var key = uniqueLevels_1[_a];
                                if (key === name_1) {
                                    for (var _b = 0, _c = levelCollection[key]; _b < _c.length; _b++) {
                                        var level = _c[_b];
                                        orderedIndex[orderedIndex.length] = levels[level].index;
                                        orderedTuples[orderedTuples.length] = levels[level].node;
                                    }
                                }
                            }
                        }
                    }
                    else {
                        for (var _d = 0, uniqueLevels_2 = uniqueLevels; _d < uniqueLevels_2.length; _d++) {
                            var key = uniqueLevels_2[_d];
                            for (var _e = 0, values_2 = values; _e < values_2.length; _e++) {
                                var name_2 = values_2[_e];
                                for (var _f = 0, _g = levelCollection[key]; _f < _g.length; _f++) {
                                    var level = _g[_f];
                                    var levelInfo = level.split('~~');
                                    if (levelInfo[measureIndex] === name_2) {
                                        orderedIndex[orderedIndex.length] = levels[level].index;
                                        orderedTuples[orderedTuples.length] = levels[level].node;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (vTuples.length > 0) {
                var valueIndex = [];
                var vOrdinalIndex = [];
                var len = 0;
                var cRow = 0;
                for (var j = 0, cnt = vTuples.length; j < cnt; j++) {
                    if (len > (cLen - 1)) {
                        cRow++;
                        len = 0;
                        if (!valueIndex[cRow]) {
                            valueIndex[cRow] = [];
                        }
                        valueIndex[cRow][len] = j;
                        len++;
                    }
                    else {
                        if (!valueIndex[cRow]) {
                            valueIndex[cRow] = [];
                        }
                        valueIndex[cRow][len] = j;
                        len++;
                    }
                    vOrdinalIndex[vOrdinalIndex.length] = Number(vTuples[j].getAttribute('CellOrdinal'));
                }
                if (measureAxis === 'column') {
                    if (valueIndex.length > 0 && valueIndex[0].length === orderedIndex.length) {
                        for (var i = 0, cnt = orderedIndex.length; i < cnt; i++) {
                            var j = 0;
                            while (j < valueIndex.length) {
                                var index = (j * cLen) + i;
                                var ordinalValue = vOrdinalIndex[index].toString();
                                var tuple = vTuples[Number(valueIndex[j][orderedIndex[i]])];
                                tuple.setAttribute('CellOrdinal', ordinalValue.toString());
                                orderedVTuples[index] = tuple;
                                j++;
                            }
                        }
                    }
                }
                else {
                    if (valueIndex.length === orderedIndex.length) {
                        for (var i = 0, cnt = orderedIndex.length; i < cnt; i++) {
                            var j = 0;
                            while (j < valueIndex[orderedIndex[i]].length) {
                                var index = (i * cLen) + j;
                                var ordinalValue = vOrdinalIndex[index].toString();
                                var tuple = vTuples[Number(valueIndex[orderedIndex[i]][j])];
                                tuple.setAttribute('CellOrdinal', ordinalValue.toString());
                                orderedVTuples[orderedVTuples.length] = tuple;
                                j++;
                            }
                        }
                    }
                }
            }
            return { orderedHeaderTuples: orderedTuples, orderedValueTuples: orderedVTuples };
        }
        else {
            return { orderedHeaderTuples: tuples, orderedValueTuples: vTuples };
        }
    };
    /* tslint:disable:max-func-body-length */
    OlapEngine.prototype.getDrilledSets = function (uNameCollection, currentCell, fieldPos, axis) {
        var levels = [];
        var memberName = currentCell.actualText.toString();
        var tupCollection = axis === 'row' ? this.tupRowInfo : this.tupColumnInfo;
        var currTuple = tupCollection[currentCell.ordinal];
        var measurePos = tupCollection[0].typeCollection.indexOf('3');
        var allStartPos = measurePos === 0 ? 1 : 0;
        var tupPos = 0;
        var isWithoutAllMember = tupCollection[0].typeCollection[fieldPos] === '1';
        while (tupPos < tupCollection.length) {
            /* tslint:disable-next-line:max-line-length */
            if (isNullOrUndefined(tupCollection[tupPos].allStartPos) || tupCollection[tupPos].allStartPos > allStartPos) {
                levels[levels.length] = tupCollection[tupPos].uNameCollection;
            }
            tupPos++;
        }
        var memberArray = uNameCollection.split('::[').map(function (item) {
            return item[0] === '[' ? item : ('[' + item);
        });
        var joinArray = [];
        for (var memPos = 0; memPos <= fieldPos; memPos++) {
            if (memberArray[memPos]) {
                if ((isWithoutAllMember || this.isPaging) && memPos === fieldPos) {
                    var splitLevels = memberArray[memPos].split('~~');
                    var drillLevel = splitLevels.indexOf(memberName);
                    var cropLevels = [];
                    for (var lPos = 0; lPos <= drillLevel; lPos++) {
                        cropLevels.push(splitLevels[lPos]);
                    }
                    joinArray[joinArray.length] = cropLevels.length > 0 ? cropLevels.join('~~') : memberArray[memPos];
                }
                else {
                    joinArray[joinArray.length] = memberArray[memPos];
                }
            }
        }
        uNameCollection = joinArray.join('::');
        var childSets = [];
        var memberObj = {};
        for (var _i = 0, levels_1 = levels; _i < levels_1.length; _i++) {
            var item = levels_1[_i];
            if (item.indexOf(uNameCollection) === 0) {
                childSets.push(item);
                if (this.isPaging) {
                    var drillField = item.split('::[')[fieldPos];
                    drillField = drillField[0] === '[' ? drillField : ('[' + drillField);
                    var drillFieldSep = drillField.split('~~');
                    for (var fPos = drillFieldSep.indexOf(memberName); fPos < drillFieldSep.length; fPos++) {
                        memberObj[drillFieldSep[fPos]] = drillFieldSep[fPos];
                    }
                }
            }
        }
        if (this.isPaging) {
            var fieldSep = currTuple.uNameCollection.split('::[').map(function (item) {
                return item[0] === '[' ? item : ('[' + item);
            });
            var cropArray = [];
            for (var fPos = 0; fPos < fieldSep.length; fPos++) {
                if (fPos !== fieldPos) {
                    cropArray[fPos] = fieldSep[fPos];
                }
            }
            var drillFieldSep = Object.keys(memberObj);
            for (var fPos = 0; fPos < drillFieldSep.length; fPos++) {
                cropArray[fieldPos] = drillFieldSep[fPos];
                childSets.push(cropArray.join('::'));
            }
        }
        var drillSets = {};
        for (var _a = 0, childSets_1 = childSets; _a < childSets_1.length; _a++) {
            var level = childSets_1[_a];
            var fields = level.split('::[').map(function (item) {
                return item[0] === '[' ? item : ('[' + item);
            });
            var set = '';
            for (var pos = 0; pos <= fieldPos; pos++) {
                var field = fields[pos];
                if (field) {
                    var members = field.split('~~');
                    set = set + (set !== '' ? '~~' : '') + members[members.length - 1];
                }
            }
            drillSets[set] = set;
        }
        return drillSets;
    };
    OlapEngine.prototype.updateDrilledInfo = function (dataSourceSettings) {
        this.dataSourceSettings = dataSourceSettings;
        this.drilledMembers = dataSourceSettings.drilledMembers ? this.updateDrilledItems(dataSourceSettings.drilledMembers) : [];
        // MDXQuery.getCellSets(this.dataSourceSettings as IDataOptions, this);
        this.generateGridData(dataSourceSettings);
    };
    OlapEngine.prototype.updateCalcFields = function (dataSourceSettings, lastcalcInfo) {
        this.dataSourceSettings = dataSourceSettings;
        this.calculatedFieldSettings = dataSourceSettings.calculatedFieldSettings ? dataSourceSettings.calculatedFieldSettings : [];
        this.getAxisFields();
        this.updateFieldlist();
        this.loadCalculatedMemberElements(this.calculatedFieldSettings);
        if (this.dataFields[lastcalcInfo.name]) {
            this.generateGridData(dataSourceSettings);
        }
        else {
            MDXQuery.getCellSets(dataSourceSettings, this, true, undefined, true);
        }
    };
    OlapEngine.prototype.onSort = function (dataSourceSettings) {
        this.dataSourceSettings = dataSourceSettings;
        this.sortSettings = dataSourceSettings.sortSettings ? dataSourceSettings.sortSettings : [];
        this.getAxisFields();
        this.frameSortObject();
        this.updateFieldlist();
        if (this.xmlaCellSet.length > 0 && this.xmlDoc) {
            this.generateEngine(this.xmlDoc, this.request, this.customArgs);
        }
        else {
            this.generateGridData(dataSourceSettings);
        }
    };
    OlapEngine.prototype.updateFieldlist = function (isInit) {
        var i = 0;
        while (i < this.savedFieldListData.length) {
            var fieldName = this.savedFieldListData[i].id;
            var parentID = this.savedFieldListData[i].pid;
            // let aggregateType: string = this.getAggregateType(fieldName);
            // this.savedFieldListData[i].aggregateType = aggregateType;
            if (this.savedFieldList[fieldName]) {
                var sortOrder = (this.enableSort ? this.sortObject[fieldName] ? this.sortObject[fieldName] : 'Ascending' : 'None');
                this.savedFieldList[fieldName].isSelected = false;
                this.savedFieldList[fieldName].isExcelFilter = false;
                // this.savedFieldList[fieldName].aggregateType = aggregateType;
                this.savedFieldList[fieldName].sort = sortOrder;
                this.savedFieldList[fieldName].allowDragAndDrop = true;
                this.savedFieldList[fieldName].showFilterIcon = true;
                this.savedFieldList[fieldName].showSortIcon = true;
                this.savedFieldList[fieldName].showEditIcon = true;
                this.savedFieldList[fieldName].showRemoveIcon = true;
                this.savedFieldList[fieldName].showValueTypeIcon = true;
                this.savedFieldListData[i].sort = sortOrder;
                this.savedFieldListData[i].allowDragAndDrop = true;
                this.savedFieldListData[i].showFilterIcon = true;
                this.savedFieldListData[i].showSortIcon = true;
                this.savedFieldListData[i].showEditIcon = true;
                this.savedFieldListData[i].showRemoveIcon = true;
                this.savedFieldListData[i].showValueTypeIcon = true;
                if (isInit) {
                    this.savedFieldList[fieldName].filter = [];
                    this.savedFieldList[fieldName].actualFilter = [];
                }
            }
            /* tslint:disable:max-line-length */
            if (this.dataFields[fieldName] && this.savedFieldList[fieldName] && this.selectedItems.indexOf(fieldName) > -1) {
                this.savedFieldList[fieldName].isSelected = true;
                this.savedFieldList[fieldName].allowDragAndDrop = (this.dataFields[fieldName] ? this.dataFields[fieldName].allowDragAndDrop : true);
                this.savedFieldList[fieldName].showFilterIcon = (this.dataFields[fieldName] ? this.dataFields[fieldName].showFilterIcon : true);
                this.savedFieldList[fieldName].showSortIcon = (this.dataFields[fieldName] ? this.dataFields[fieldName].showSortIcon : true);
                this.savedFieldList[fieldName].showEditIcon = (this.dataFields[fieldName] ? this.dataFields[fieldName].showEditIcon : true);
                this.savedFieldList[fieldName].showRemoveIcon = (this.dataFields[fieldName] ? this.dataFields[fieldName].showRemoveIcon : true);
                this.savedFieldList[fieldName].showValueTypeIcon = (this.dataFields[fieldName] ? this.dataFields[fieldName].showValueTypeIcon : true);
                this.savedFieldListData[i].isSelected = true;
                this.savedFieldListData[i].allowDragAndDrop = (this.dataFields[fieldName] ? this.dataFields[fieldName].allowDragAndDrop : true);
                this.savedFieldListData[i].showFilterIcon = (this.dataFields[fieldName] ? this.dataFields[fieldName].showFilterIcon : true);
                this.savedFieldListData[i].showSortIcon = (this.dataFields[fieldName] ? this.dataFields[fieldName].showSortIcon : true);
                this.savedFieldListData[i].showEditIcon = (this.dataFields[fieldName] ? this.dataFields[fieldName].showEditIcon : true);
                this.savedFieldListData[i].showRemoveIcon = (this.dataFields[fieldName] ? this.dataFields[fieldName].showRemoveIcon : true);
                this.savedFieldListData[i].showValueTypeIcon = (this.dataFields[fieldName] ? this.dataFields[fieldName].showValueTypeIcon : true);
            }
            else {
                if (this.dataFields[parentID] && this.savedFieldList[parentID] && this.selectedItems.indexOf(parentID) > -1) {
                    this.savedFieldListData[i].isSelected = true;
                }
                else {
                    this.savedFieldListData[i].isSelected = false;
                }
            }
            /* tslint:enable:max-line-length */
            if ((this.savedFieldList[fieldName] && this.savedFieldList[fieldName].isCalculatedField) ||
                fieldName.toLowerCase() === '[calculated members].[_0]') {
                var isAvail = false;
                for (var _i = 0, _a = this.calculatedFieldSettings; _i < _a.length; _i++) {
                    var field = _a[_i];
                    if (fieldName === field.name) {
                        var expression = field.formula;
                        var formatString = field.formatString;
                        this.savedFieldListData[i].formula = expression;
                        this.savedFieldListData[i].formatString = formatString;
                        this.savedFieldListData[i].parentHierarchy = (expression.toLowerCase().indexOf('measure') > -1 ?
                            undefined : field.hierarchyUniqueName);
                        this.savedFieldList[fieldName].formula = expression;
                        this.savedFieldList[fieldName].formatString = formatString;
                        this.savedFieldList[fieldName].parentHierarchy = this.savedFieldListData[i].parentHierarchy;
                        isAvail = true;
                    }
                }
                if (!isAvail || (fieldName.toLowerCase() === '[calculated members].[_0]' &&
                    this.calculatedFieldSettings.length === 0)) {
                    this.savedFieldListData.splice(i, 1);
                    i--;
                    if (this.savedFieldList[fieldName]) {
                        delete this.savedFieldList[fieldName];
                    }
                }
            }
            i++;
        }
        this.fieldList = this.savedFieldList;
        this.fieldListData = this.savedFieldListData;
    };
    OlapEngine.prototype.updateFieldlistData = function (name, isSelect) {
        for (var _i = 0, _a = this.fieldListData; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.id === name) {
                item.isSelected = isSelect ? true : false;
                break;
            }
        }
    };
    OlapEngine.prototype.getFormattedFields = function (formats) {
        this.formatFields = {};
        var cnt = formats.length;
        while (cnt--) {
            this.formatFields[formats[cnt].name] = formats[cnt];
        }
    };
    OlapEngine.prototype.getFieldList = function (dataSourceSettings) {
        var args = {
            catalog: dataSourceSettings.catalog,
            cube: dataSourceSettings.cube,
            url: dataSourceSettings.url,
            LCID: dataSourceSettings.localeIdentifier.toString(),
            request: 'MDSCHEMA_HIERARCHIES'
        };
        this.getTreeData(args, this.getFieldListItems.bind(this), { dataSourceSettings: dataSourceSettings, action: 'loadFieldElements' });
    };
    /* tslint:disable:max-line-length */
    OlapEngine.prototype.getTreeData = function (args, successMethod, customArgs) {
        var connectionString = this.getConnectionInfo(args.url, args.LCID);
        var soapMessage = '<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"><Header/><Body><Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><RequestType>' +
            args.request + '</RequestType><Restrictions><RestrictionList><CATALOG_NAME>' + args.catalog +
            '</CATALOG_NAME><CUBE_NAME>' + args.cube + '</CUBE_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>' + args.catalog +
            '</Catalog> <LocaleIdentifier>' + connectionString.LCID + '</LocaleIdentifier></PropertyList></Properties></Discover></Body></Envelope>';
        this.doAjaxPost('POST', connectionString.url, soapMessage, successMethod, customArgs);
    };
    /* tslint:enable:max-line-length */
    OlapEngine.prototype.getAxisFields = function () {
        this.rows = this.dataSourceSettings.rows ? this.dataSourceSettings.rows : [];
        this.columns = this.dataSourceSettings.columns ? this.dataSourceSettings.columns : [];
        this.filters = this.dataSourceSettings.filters ? this.dataSourceSettings.filters : [];
        this.values = this.dataSourceSettings.values ? this.dataSourceSettings.values : [];
        var dataFields = extend([], this.rows, null, true);
        dataFields = dataFields.concat(this.columns, this.values, this.filters);
        var len = dataFields.length;
        while (len--) {
            this.dataFields[dataFields[len].name] = dataFields[len];
            if (dataFields[len].name.toLowerCase() === '[measures]') {
                this.isMeasureAvail = true;
            }
            else {
                this.selectedItems.push(dataFields[len].name);
            }
        }
        if (!this.isMeasureAvail && this.values.length > 0) {
            var measureField = {
                name: '[Measures]', caption: 'Measures', showRemoveIcon: true, allowDragAndDrop: true
            };
            if (this.valueAxis === 'row') {
                this.rows.push(measureField);
            }
            else {
                this.columns.push(measureField);
            }
            this.isMeasureAvail = true;
        }
    };
    OlapEngine.prototype.getAggregateType = function (fieldName, aggregateType) {
        var type;
        switch (aggregateType) {
            case '1':
                type = 'Sum';
                break;
            case '2':
                type = 'Count';
                break;
            case '3':
                type = 'Min';
                break;
            case '4':
                type = 'Max';
                break;
            case '5':
                type = 'Avg';
                break;
            case '8':
                type = 'DistinctCount';
                break;
            case '127':
                type = 'CalculatedField';
                break;
            default:
                type = undefined;
                break;
        }
        // if (this.dataFields[fieldName]) {
        //     return this.dataFields[fieldName].type;
        // } else {
        //     return undefined;
        // }
        if (type) {
            return type;
        }
        else {
            return undefined;
        }
    };
    OlapEngine.prototype.getUniqueName = function (name) {
        var uName = name;
        for (var _i = 0, _a = this.calculatedFieldSettings; _i < _a.length; _i++) {
            var item = _a[_i];
            var expression = item.formula;
            var prefixName = (expression.toLowerCase().indexOf('measure') > -1 ? '[Measures].' : item.hierarchyUniqueName + '.');
            var uniqueName = prefixName + '[' + item.name + ']';
            if (name === uniqueName) {
                uName = item.name;
                break;
            }
        }
        return uName;
    };
    OlapEngine.prototype.updateFilterItems = function (filterItems) {
        var dataFields = extend([], this.rows, null, true);
        dataFields = dataFields.concat(this.columns);
        for (var _i = 0, filterItems_1 = filterItems; _i < filterItems_1.length; _i++) {
            var filter = filterItems_1[_i];
            if (filter.type === 'Include' && this.allowMemberFilter) {
                var members = this.fieldList[filter.name].members;
                var isMembersAvail = (members && Object.keys(members).length > 0);
                this.fieldList[filter.name].actualFilter = filter.items.slice();
                var selectedElements = extend([], filter.items, null, true);
                if (isMembersAvail) {
                    var i = 0;
                    while (i < selectedElements.length) {
                        var parentNodes = [];
                        parentNodes = this.getParentNode(selectedElements[i], members, parentNodes);
                        for (var _a = 0, parentNodes_1 = parentNodes; _a < parentNodes_1.length; _a++) {
                            var node = parentNodes_1[_a];
                            var index = PivotUtil.inArray(node, filter.items);
                            if (index !== -1) {
                                filter.items.splice(index, 1);
                            }
                        }
                        i++;
                    }
                }
                var currentItems = [];
                for (var _b = 0, _c = filter.items; _b < _c.length; _b++) {
                    var selectedElement = _c[_b];
                    // currentItems.push(selectedElement.replace(/\&/g, '&amp;'));
                    currentItems.push(selectedElement);
                    if (isMembersAvail) {
                        this.fieldList[filter.name].filter.push(members[selectedElement].caption);
                    }
                    else {
                        this.fieldList[filter.name].filter.push(selectedElement);
                    }
                }
                this.filterMembers[filter.name] = currentItems;
                this.fieldList[filter.name].isExcelFilter = false;
            }
            else if ((this.allowValueFilter || this.allowLabelFilter) &&
                ['Date', 'Label', 'Number', 'Value'].indexOf(filter.type) !== -1) {
                for (var _d = 0, dataFields_1 = dataFields; _d < dataFields_1.length; _d++) {
                    var item = dataFields_1[_d];
                    if (item.name === filter.name) {
                        var filterMembers = this.filterMembers[filter.name];
                        if (filterMembers && (typeof filterMembers[0] === 'object' && filterMembers[0].type === filter.type)) {
                            filterMembers[filterMembers.length] = filter;
                        }
                        else {
                            this.filterMembers[filter.name] = [filter];
                        }
                        this.fieldList[filter.name].isExcelFilter = true;
                        break;
                    }
                }
            }
        }
    };
    OlapEngine.prototype.getParentNode = function (name, members, items) {
        if (members[name].parent && name !== members[name].parent) {
            var parentItem = members[name].parent;
            items.push(parentItem);
            this.getParentNode(parentItem, members, items);
        }
        return items;
    };
    OlapEngine.prototype.updateDrilledItems = function (drilledMembers) {
        var drilledItems = [];
        var dataFields = extend([], this.rows, null, true);
        dataFields = dataFields.concat(this.columns);
        for (var _i = 0, drilledMembers_1 = drilledMembers; _i < drilledMembers_1.length; _i++) {
            var item = drilledMembers_1[_i];
            for (var _a = 0, dataFields_2 = dataFields; _a < dataFields_2.length; _a++) {
                var field = dataFields_2[_a];
                if (item.name === field.name) {
                    drilledItems.push(item);
                    break;
                }
            }
        }
        return drilledItems;
    };
    // private updateAllMembers(dataSourceSettings: IDataOptions, slicers: IFieldOptions[]): void {
    //     let query: string = '';
    //     for (let field of slicers) {
    //         let fieldList: IOlapField = this.fieldList[field.name];
    //         if (!(fieldList && fieldList.hasAllMember && fieldList.allMember)) {
    //             query = query + (query !== '' ? ' * ' : '') + '{' + field.name + '}';
    //         } else {
    //             continue;
    //         }
    //     }
    //     if (query !== '') {
    //         this.getAllMember(dataSourceSettings, query);
    //     } else {
    //         return;
    //     }
    // }
    // private getAllMember(dataSourceSettings: IDataOptions, query: string): void {
    //     let dimProp: string = 'DIMENSION PROPERTIES HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY';
    //     let mdxQuery: string = 'SELECT (' + query + ')' + dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
    //     let xmla: string = this.getSoapMsg(dataSourceSettings, mdxQuery);
    //     let connectionString: ConnectionInfo = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
    //     this.doAjaxPost('POST', connectionString.url, xmla, this.generateAllMembers.bind(this), 
    // { dataSourceSettings: dataSourceSettings, action: 'fetchAllMembers' });
    // }
    /**
     * @hidden
     */
    OlapEngine.prototype.getDrillThroughData = function (pivotValue, maxRows) {
        var column = this.tupColumnInfo[pivotValue.colOrdinal] &&
            this.tupColumnInfo[pivotValue.colOrdinal].uNameCollection &&
            this.tupColumnInfo[pivotValue.colOrdinal].uNameCollection !== '' ?
            this.tupColumnInfo[pivotValue.colOrdinal].uNameCollection.split('::[').map(function (item) {
                return item[0] === '[' ? item : ('[' + item);
            }) : [];
        var row = this.tupRowInfo[pivotValue.rowOrdinal] &&
            this.tupRowInfo[pivotValue.rowOrdinal].uNameCollection &&
            this.tupRowInfo[pivotValue.rowOrdinal].uNameCollection !== '' ?
            this.tupRowInfo[pivotValue.rowOrdinal].uNameCollection.split('::[').map(function (item) {
                return item[0] === '[' ? item : ('[' + item);
            }) : [];
        var filters;
        var filteritems = [];
        var filterQuery = '';
        for (var i = 0; i < this.filters.length; i++) {
            filters = this.filterMembers[this.filters[i].name];
            if (filters) {
                for (var j = 0; j < filters.length; j++) {
                    filterQuery = filterQuery + filters[j];
                    filterQuery = j < filters.length - 1 ? filterQuery + ',' : filterQuery + '';
                }
                filteritems[i] = filterQuery;
                filterQuery = '';
            }
        }
        for (var i = 0; i < filteritems.length; i++) {
            filterQuery = filterQuery === '' ? '{' + filteritems[i] + '}' : (filterQuery + ',' + '{' + filteritems[i] + '}');
        }
        var columnQuery = '';
        var rowQuery = '';
        for (var i = 0; i < column.length; i++) {
            columnQuery = (columnQuery.length > 0 ? (columnQuery + ',') : '') + (column[i].split('~~').length > 1 ?
                column[i].split('~~')[column[i].split('~~').length - 1] : column[i]);
        }
        for (var i = 0; i < row.length; i++) {
            rowQuery = (rowQuery.length > 0 ? (rowQuery + ',') : '') + (row[i].split('~~').length > 1 ?
                row[i].split('~~')[row[i].split('~~').length - 1] : row[i]);
        }
        var drillQuery = 'DRILLTHROUGH MAXROWS ' + maxRows + ' Select(' + (columnQuery.length > 0 ? columnQuery : '') +
            (columnQuery.length > 0 && rowQuery.length > 0 ? ',' : '') + (rowQuery.length > 0 ? rowQuery : '') + ') on 0 from ' +
            (filterQuery === '' ? '[' + this.dataSourceSettings.cube + ']' : '(SELECT (' + filterQuery + ') ON COLUMNS FROM [' +
                this.dataSourceSettings.cube + '])');
        drillQuery = drillQuery.replace(/&/g, '&amp;');
        var xmla = this.getSoapMsg(this.dataSourceSettings, drillQuery);
        var connectionString = this.getConnectionInfo(this.dataSourceSettings.url, this.dataSourceSettings.localeIdentifier);
        this.doAjaxPost('POST', connectionString.url, xmla, this.drillThroughSuccess.bind(this), { dataSourceSettings: this.dataSourceSettings, action: 'drillThrough' });
    };
    OlapEngine.prototype.drillThroughSuccess = function (xmlDoc) {
        var tag = [].slice.call(xmlDoc.querySelectorAll('row'));
        var gridJSON = '';
        if (tag.length > 0) {
            var json = [];
            var i = 0;
            while (i < tag.length) {
                var child = [].slice.call(tag[i].children);
                var j = 0;
                while (j < child.length) {
                    json.push('"' + child[j].tagName + '"' + ':' + '"' + child[j].textContent + '"');
                    j++;
                }
                i++;
            }
            var value = json[0];
            var k = 0;
            while (k < json.length) {
                if (Object.keys(JSON.parse('[{' + json[k] + '}]')[0])[0] === Object.keys(JSON.parse('[{' + value + '}]')[0])[0]) {
                    gridJSON += gridJSON === '' ? '[{' + json[k] : '}, {' + json[k];
                    k++;
                    continue;
                }
                gridJSON += ',' + json[k];
                k++;
            }
            gridJSON += '}]';
        }
        else {
            var tag_1 = [].slice.call(xmlDoc.querySelectorAll('faultstring'));
            var i = 0;
            while (i < tag_1.length) {
                gridJSON += tag_1[i].textContent;
                i++;
            }
        }
        this.gridJSON = gridJSON;
    };
    /* tslint:disable:max-line-length */
    OlapEngine.prototype.getFilterMembers = function (dataSourceSettings, fieldName, levelCount, isSearchFilter, loadLevelMember) {
        // let dimProp: string = 'DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE';
        var levels = this.fieldList[fieldName].levels;
        var cLevel = this.fieldList[fieldName].levelCount;
        var filterQuery;
        if (loadLevelMember) {
            filterQuery = 'Descendants({' + levels[cLevel].id + '}, ' +
                levels[levelCount - 1].id + ', ' + ((levelCount - cLevel) === 1 ? 'SELF)' : 'SELF_AND_BEFORE)');
        }
        else {
            filterQuery = fieldName + ', Descendants({' + levels[0].id + '}, ' + levels[levelCount - 1].id + ', SELF_AND_BEFORE)';
        }
        this.fieldList[fieldName].levelCount = levelCount;
        if (!isSearchFilter) {
            this.getMembers(dataSourceSettings, fieldName, false, filterQuery, loadLevelMember);
        }
        return filterQuery;
    };
    OlapEngine.prototype.getMembers = function (dataSourceSettings, fieldName, isAllFilterData, filterParentQuery, loadLevelMember) {
        // dimProp = "dimension properties CHILDREN_CARDINALITY, MEMBER_TYPE";
        var dimProp = 'DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE, MEMBER_VALUE';
        var mdxQuery;
        var hasAllMember = this.fieldList[fieldName].hasAllMember;
        var hierarchy = (hasAllMember ? fieldName : fieldName + '.LEVELS(0)').replace(/\&/g, '&amp;');
        if (!isAllFilterData) {
            mdxQuery = 'SELECT ({' + (filterParentQuery ?
                filterParentQuery : (hasAllMember ? hierarchy + ', ' + hierarchy + '.CHILDREN' : hierarchy + '.ALLMEMBERS')) + '})' +
                dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
        }
        else {
            mdxQuery = 'SELECT ({' + hierarchy + '.ALLMEMBERS})' + dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
        }
        var xmla = this.getSoapMsg(dataSourceSettings, mdxQuery);
        var connectionString = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
        if (!loadLevelMember) {
            this.fieldList[fieldName].filterMembers = [];
            this.fieldList[fieldName].childMembers = [];
            this.fieldList[fieldName].searchMembers = [];
            // this.fieldList[fieldName].isHierarchy = true;
            this.fieldList[fieldName].members = {};
            this.fieldList[fieldName].currrentMembers = {};
        }
        this.doAjaxPost('POST', connectionString.url, xmla, this.generateMembers.bind(this), { dataSourceSettings: dataSourceSettings, fieldName: fieldName, loadLevelMembers: loadLevelMember, action: 'fetchMembers' });
    };
    OlapEngine.prototype.getChildMembers = function (dataSourceSettings, memberUQName, fieldName) {
        // dimProp = "dimension properties CHILDREN_CARDINALITY, MEMBER_TYPE";
        var dimProp = 'DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE, MEMBER_VALUE';
        // var mdxQuery = 'SELECT SUBSET({' + memberUQName + '.CHILDREN}, 0, 5000)' + dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
        var mdxQuery = 'SELECT ({' + memberUQName.replace(/\&/g, '&amp;') + '.CHILDREN})' + dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
        var xmla = this.getSoapMsg(dataSourceSettings, mdxQuery);
        var connectionString = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
        this.doAjaxPost('POST', connectionString.url, xmla, this.generateMembers.bind(this), { dataSourceSettings: dataSourceSettings, fieldName: fieldName, action: 'fetchChildMembers' });
    };
    OlapEngine.prototype.getCalcChildMembers = function (dataSourceSettings, memberUQName) {
        this.calcChildMembers = [];
        var dimProp = 'DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE, MEMBER_VALUE';
        var mdxQuery = 'SELECT ({' + memberUQName.replace(/\&/g, '&amp;') + '.MEMBERS})' +
            dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
        var connectionString = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
        var xmla = this.getSoapMsg(dataSourceSettings, mdxQuery);
        this.doAjaxPost('POST', connectionString.url, xmla, this.generateMembers.bind(this), { dataSourceSettings: dataSourceSettings, action: 'fetchCalcChildMembers' });
    };
    OlapEngine.prototype.getSearchMembers = function (dataSourceSettings, fieldName, searchString, maxNodeLimit, isAllFilterData, levelCount) {
        this.fieldList[fieldName].searchMembers = [];
        this.fieldList[fieldName].currrentMembers = {};
        if (searchString !== '') {
            // dimProp = "dimension properties CHILDREN_CARDINALITY, MEMBER_TYPE";
            var dimProp = 'DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE, MEMBER_VALUE';
            var hierarchy = fieldName.replace(/\&/g, '&amp;');
            var mdxQuery = 'WITH SET [SearchMembersSet] AS &#39;FILTER(' + (isAllFilterData ? hierarchy + '.ALLMEMBERS, ' :
                '{' + (levelCount > 1 ? this.getFilterMembers(dataSourceSettings, fieldName, levelCount, true) :
                    hierarchy + ', ' + hierarchy + '.CHILDREN') + '},') +
                '(INSTR(1, ' + hierarchy + '.CurrentMember.member_caption, "' + searchString + '") > 0))&#39;' +
                'SET [SearchParentsSet] AS &#39;GENERATE([SearchMembersSet], ASCENDANTS([SearchMembersSet].Current))&#39;' +
                'SET [SearchSet] AS &#39;HIERARCHIZE(DISTINCT({[SearchMembersSet], [SearchParentsSet]}))&#39;' +
                'SELECT SUBSET([SearchSet], 0, ' + maxNodeLimit + ')' + dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
            var xmla = this.getSoapMsg(dataSourceSettings, mdxQuery);
            var connectionString = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
            this.doAjaxPost('POST', connectionString.url, xmla, this.generateMembers.bind(this), { dataSourceSettings: dataSourceSettings, fieldName: fieldName, action: 'fetchSearchMembers' });
        }
        else {
            return;
        }
    };
    OlapEngine.prototype.generateMembers = function (xmlDoc, request, customArgs) {
        var fields = [].slice.call(xmlDoc.querySelectorAll('Axis[name="Axis0"] Tuple'));
        var fieldName = customArgs.fieldName;
        var allMember;
        var filterMembers = {};
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var field = fields_1[_i];
            // let hierarchyUqName: string = fields[0].querySelector('Member HIERARCHY_UNIQUE_NAME').textContent;
            var member = field.querySelector('Member');
            var memberType = member.querySelector('MEMBER_TYPE').textContent;
            var memberUqName = member.querySelector('UName').textContent;
            var caption = member.querySelector('Caption').textContent;
            var nodeAttr = { 'data-fieldName': fieldName };
            var parentUqName = member.querySelector('PARENT_UNIQUE_NAME') ? member.querySelector('PARENT_UNIQUE_NAME').textContent : '';
            if (parentUqName === '' && memberType === '1') {
                filterMembers = {
                    hasChildren: (field.querySelector('CHILDREN_CARDINALITY') ? (field.querySelector('CHILDREN_CARDINALITY').textContent !== '0') ? true : false : false),
                    isSelected: false,
                    id: memberUqName,
                    tag: memberUqName,
                    name: caption,
                    caption: caption,
                    htmlAttributes: nodeAttr
                };
                if (customArgs.action === 'fetchMembers' || customArgs.action === 'fetchChildMembers') {
                    this.fieldList[fieldName].members[memberUqName] = { name: memberUqName, caption: caption, parent: undefined, isNodeExpand: false, isSelected: false };
                    this.fieldList[fieldName].filterMembers.push(filterMembers);
                    this.fieldList[fieldName].childMembers.push(filterMembers);
                }
                else if (customArgs.action === 'fetchSearchMembers') {
                    this.fieldList[fieldName].currrentMembers[memberUqName] = { name: memberUqName, caption: caption, parent: undefined, isNodeExpand: false, isSelected: false };
                    this.fieldList[fieldName].searchMembers.push(filterMembers);
                    filterMembers.expanded = true;
                }
                else {
                    this.calcChildMembers.push(filterMembers);
                }
            }
            else if (parentUqName !== '' && memberType === '1') {
                if (parentUqName === allMember && memberType === '1') {
                    filterMembers = {
                        hasChildren: (field.querySelector('CHILDREN_CARDINALITY') ? (field.querySelector('CHILDREN_CARDINALITY').textContent !== '0') ? true : false : false),
                        id: memberUqName,
                        name: caption,
                        isSelected: false,
                        caption: caption,
                        htmlAttributes: nodeAttr,
                        tag: memberUqName
                    };
                    if (customArgs.action === 'fetchMembers' || customArgs.action === 'fetchChildMembers') {
                        this.fieldList[fieldName].filterMembers.push(filterMembers);
                        this.fieldList[fieldName].childMembers.push(filterMembers);
                        this.fieldList[fieldName].members[memberUqName] = { name: memberUqName, caption: caption, parent: undefined, isNodeExpand: false, isSelected: false };
                    }
                    else if (customArgs.action === 'fetchSearchMembers') {
                        filterMembers.expanded = true;
                        this.fieldList[fieldName].searchMembers.push(filterMembers);
                        this.fieldList[fieldName].currrentMembers[memberUqName] = { name: memberUqName, caption: caption, parent: undefined, isNodeExpand: false, isSelected: false };
                    }
                    else {
                        this.calcChildMembers.push(filterMembers);
                    }
                }
                else {
                    if (customArgs.action === 'fetchMembers' && this.fieldList[fieldName].members[memberUqName]) {
                        continue;
                    }
                    var nodeSelect = (customArgs.loadLevelMembers ? this.fieldList[fieldName].members[parentUqName].isSelected : false);
                    filterMembers = {
                        hasChildren: (field.querySelector('CHILDREN_CARDINALITY') ? (field.querySelector('CHILDREN_CARDINALITY').textContent !== '0') ? true : false : false),
                        htmlAttributes: nodeAttr,
                        isSelected: false,
                        id: memberUqName,
                        pid: parentUqName,
                        name: caption,
                        caption: caption,
                        tag: memberUqName
                    };
                    if (customArgs.action === 'fetchMembers' || customArgs.action === 'fetchChildMembers') {
                        this.fieldList[fieldName].isHierarchy = false;
                        this.fieldList[fieldName].filterMembers.push(filterMembers);
                        this.fieldList[fieldName].childMembers.push(filterMembers);
                        this.fieldList[fieldName].members[memberUqName] = { name: memberUqName, caption: caption, parent: parentUqName, isNodeExpand: false, isSelected: nodeSelect };
                    }
                    else if (customArgs.action === 'fetchSearchMembers') {
                        this.fieldList[fieldName].searchMembers.push(filterMembers);
                        filterMembers.expanded = true;
                        this.fieldList[fieldName].currrentMembers[memberUqName] = { name: memberUqName, caption: caption, parent: parentUqName, isNodeExpand: false, isSelected: false };
                    }
                    else {
                        this.calcChildMembers.push(filterMembers);
                    }
                }
            }
            else if (memberType === '2') {
                allMember = memberUqName;
            }
        }
    };
    /* tslint:enable:max-line-length */
    // private generateAllMembers(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
    //     let members: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('Axis[name="Axis0"] Member'));
    //     for (let member of members) {
    //         let caption: string = member.querySelector('Caption').textContent;
    //         let fieldName: string = member.querySelector('HIERARCHY_UNIQUE_NAME').textContent;
    //         this.fieldList[fieldName].allMember = caption;
    //     }
    // }
    OlapEngine.prototype.getFieldListItems = function (xmlDoc, request, customArgs) {
        var fieldDate = {};
        var hierarchyElements = [];
        var fields = [].slice.call(xmlDoc.querySelectorAll('row'));
        for (var _i = 0, fields_2 = fields; _i < fields_2.length; _i++) {
            var field = fields_2[_i];
            var isAllMemberAvail = [].slice.call(field.querySelectorAll('ALL_MEMBER')).length > 0;
            hierarchyElements.push({
                pid: field.querySelector('DIMENSION_UNIQUE_NAME').textContent,
                id: field.querySelector('HIERARCHY_UNIQUE_NAME').textContent,
                name: field.querySelector('HIERARCHY_CAPTION').textContent,
                caption: field.querySelector('HIERARCHY_CAPTION').textContent,
                tag: field.querySelector('HIERARCHY_UNIQUE_NAME').textContent,
                hasAllMember: isAllMemberAvail,
                allMember: (isAllMemberAvail ? field.querySelectorAll('ALL_MEMBER')[0].textContent : undefined),
                // aggregateType: this.getAggregateType(field.querySelector('HIERARCHY_UNIQUE_NAME').textContent),
                type: 'string'
            });
        }
        fieldDate = {
            hierarchy: hierarchyElements,
            hierarchySuccess: xmlDoc,
            measures: []
        };
        this.fieldListObj = fieldDate;
        var args = {
            catalog: customArgs.dataSourceSettings.catalog,
            cube: customArgs.dataSourceSettings.cube,
            url: customArgs.dataSourceSettings.url,
            LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
            request: 'MDSCHEMA_DIMENSIONS'
        };
        this.getTreeData(args, this.loadDimensionElements.bind(this), customArgs);
    };
    OlapEngine.prototype.loadCalculatedMemberElements = function (calcMembers) {
        if (calcMembers.length > 0) {
            var fieldListElements = this.fieldListData;
            // let calcElements: IOlapField[] = [];
            var calcObj = {
                hasChildren: true,
                isSelected: false,
                id: '[Calculated Members].[_0]',
                name: '[Calculated Members].[_0]',
                caption: 'Calculated Members',
                spriteCssClass: 'e-calcMemberGroupCDB' + ' ' + cls.ICON,
                tag: '[Calculated Members].[_0]',
                //aggregateType: this.getAggregateType(dimensionName),
                type: 'string'
            };
            if (fieldListElements.length > 0 && fieldListElements[0].id.toLowerCase() === '[measures]') {
                fieldListElements.splice(0, 0, calcObj);
            }
            for (var _i = 0, calcMembers_1 = calcMembers; _i < calcMembers_1.length; _i++) {
                var field = calcMembers_1[_i];
                if (!this.fieldList[field.name]) {
                    var expression = field.formula;
                    var prefixName = (expression.toLowerCase().indexOf('measure') > -1 ? '[Measures].' :
                        field.hierarchyUniqueName + '.');
                    var uniqueName = prefixName + '[' + field.name + ']';
                    var caption = (this.dataFields[field.name] && this.dataFields[field.name].caption ?
                        this.dataFields[field.name].caption : field.name);
                    var formatString = field.formatString;
                    var calcField = {
                        hasChildren: false,
                        isSelected: false,
                        id: field.name,
                        pid: '[Calculated Members].[_0]',
                        name: field.name,
                        caption: caption,
                        spriteCssClass: 'e-calc-member' + ' ' + (expression.toLowerCase().indexOf('measure') > -1 ?
                            'e-calc-measure-icon' : 'e-calc-dimension-icon') + ' ' + cls.ICON,
                        tag: uniqueName,
                        formula: expression,
                        formatString: formatString,
                        aggregateType: undefined,
                        type: 'CalculatedField',
                        filter: [],
                        dateMember: [],
                        sort: 'Ascending',
                        actualFilter: [],
                        filterMembers: [],
                        childMembers: [],
                        searchMembers: [],
                        members: {},
                        currrentMembers: {},
                        isHierarchy: true,
                        isExcelFilter: false,
                        isCalculatedField: true,
                        allowDragAndDrop: (this.dataFields[field.name] ? this.dataFields[field.name].allowDragAndDrop : true),
                        showFilterIcon: (this.dataFields[field.name] ? this.dataFields[field.name].showFilterIcon : true),
                        showSortIcon: (this.dataFields[field.name] ? this.dataFields[field.name].showSortIcon : true),
                        showEditIcon: (this.dataFields[field.name] ? this.dataFields[field.name].showEditIcon : true),
                        showRemoveIcon: (this.dataFields[field.name] ? this.dataFields[field.name].showRemoveIcon : true),
                        showValueTypeIcon: (this.dataFields[field.name] ? this.dataFields[field.name].showValueTypeIcon : true),
                        fieldType: (expression.toLowerCase().indexOf('measure') > -1 ? 'Measure' : 'Dimension'),
                        parentHierarchy: (expression.toLowerCase().indexOf('measure') > -1 ? undefined : field.hierarchyUniqueName)
                    };
                    fieldListElements.push(calcField);
                    this.fieldList[calcField.id] = calcField;
                }
            }
        }
        else {
            return;
        }
    };
    OlapEngine.prototype.loadDimensionElements = function (xmlDoc, request, customArgs) {
        var hierarchyElements = [];
        var fields = [].slice.call(xmlDoc.querySelectorAll('row'));
        var measure = {};
        for (var _i = 0, fields_3 = fields; _i < fields_3.length; _i++) {
            var field = fields_3[_i];
            var dimensionName = field.querySelector('DIMENSION_UNIQUE_NAME').textContent;
            var dimensionCaption = field.querySelector('DIMENSION_CAPTION').textContent;
            if (dimensionName.toLowerCase().indexOf('[measure') >= 0) {
                measure = {
                    hasChildren: true,
                    isSelected: false,
                    id: dimensionName,
                    name: dimensionName,
                    caption: dimensionCaption,
                    /* tslint:disable-next-line:max-line-length */
                    spriteCssClass: dimensionName.toLowerCase() === '[measures]' ? 'e-measureGroupCDB-icon' + ' ' + cls.ICON : 'e-dimensionCDB-icon' + ' ' + cls.ICON,
                    tag: dimensionName,
                    // aggregateType: this.getAggregateType(dimensionName),
                    type: 'string'
                };
            }
            else if (isNullOrUndefined(fields[0].querySelector('HIERARCHY_CAPTION'))) {
                hierarchyElements.push({
                    hasChildren: true,
                    isSelected: false,
                    id: (this.isMondrian ? dimensionName + '~#^Dim' : dimensionName),
                    name: dimensionName,
                    caption: dimensionCaption,
                    spriteCssClass: 'e-dimensionCDB-icon' + ' ' + cls.ICON,
                    tag: dimensionName,
                    defaultHierarchy: field.querySelector('DEFAULT_HIERARCHY').textContent,
                    // aggregateType: this.getAggregateType(dimensionName),
                    type: 'string'
                });
            }
        }
        hierarchyElements.splice(0, 0, measure);
        this.fieldListData = hierarchyElements;
        // customArgs.hierarchy = this.fieldListData;
        // customArgs.hierarchySuccess = this.fieldListObj.hierarchySuccess;
        // this.loadHierarchyElements(customArgs);
        var args = {
            catalog: customArgs.dataSourceSettings.catalog,
            cube: customArgs.dataSourceSettings.cube,
            url: customArgs.dataSourceSettings.url,
            LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
            request: 'MDSCHEMA_SETS'
        };
        this.getTreeData(args, this.loadNamedSetElements.bind(this), customArgs);
    };
    OlapEngine.prototype.loadNamedSetElements = function (xmlDoc, request, customArgs) {
        var dataFields = extend([], this.rows, null, true);
        dataFields = dataFields.concat(this.columns, this.filters);
        var dimensionElements = this.fieldListData;
        var reportElement = [];
        for (var _i = 0, dataFields_3 = dataFields; _i < dataFields_3.length; _i++) {
            var field = dataFields_3[_i];
            reportElement.push(field.name);
        }
        var measureGroupItems = [];
        var fields = [].slice.call(xmlDoc.querySelectorAll('row'));
        for (var _a = 0, fields_4 = fields; _a < fields_4.length; _a++) {
            var field = fields_4[_a];
            if (!(measureGroupItems.indexOf(field.querySelector('DIMENSIONS').textContent.split('.')[0]) >= 0)) {
                dimensionElements.push({
                    hasChildren: true,
                    isSelected: false,
                    pid: field.querySelector('DIMENSIONS').textContent.split('.')[0],
                    /* tslint:disable-next-line:max-line-length */
                    id: field.querySelector('SET_DISPLAY_FOLDER').textContent + '_' + field.querySelector('DIMENSIONS').textContent.split('.')[0],
                    name: field.querySelector('SET_DISPLAY_FOLDER').textContent,
                    spriteCssClass: 'e-folderCDB-icon' + ' ' + cls.ICON + ' ' + 'namedSets',
                    caption: field.querySelector('SET_DISPLAY_FOLDER').textContent,
                    /* tslint:disable-next-line:max-line-length */
                    // aggregateType: this.getAggregateType(field.querySelector('SET_DISPLAY_FOLDER').textContent + '_' + field.querySelector('DIMENSIONS').textContent.split('.')[0]),
                    type: 'string'
                });
                measureGroupItems.push(field.querySelector('DIMENSIONS').textContent.split('.')[0]);
            }
            var id = '[' + field.querySelector('SET_NAME').textContent.trim() + ']';
            var fieldObj = {
                hasChildren: true,
                isNamedSets: true,
                isSelected: (reportElement.indexOf('[' + field.querySelector('SET_NAME').textContent + ']') >= 0),
                /* tslint:disable-next-line:max-line-length */
                pid: field.querySelector('SET_DISPLAY_FOLDER').textContent + '_' + field.querySelector('DIMENSIONS').textContent.split('.')[0],
                id: id,
                name: field.querySelector('SET_CAPTION').textContent,
                caption: field.querySelector('SET_CAPTION').textContent,
                spriteCssClass: 'e-namedSetCDB-icon' + ' ' + cls.ICON,
                tag: field.querySelector('EXPRESSION').textContent,
                // aggregateType: this.getAggregateType(id),
                type: 'string',
                filter: [],
                dateMember: [],
                // sort: 'Ascending',
                actualFilter: [],
                filterMembers: [],
                childMembers: [],
                searchMembers: [],
                members: {},
                currrentMembers: {},
                isHierarchy: true,
                isExcelFilter: false,
                allowDragAndDrop: (this.dataFields[id] ? this.dataFields[id].allowDragAndDrop : true),
                showFilterIcon: (this.dataFields[id] ? this.dataFields[id].showFilterIcon : true),
                showSortIcon: (this.dataFields[id] ? this.dataFields[id].showSortIcon : true),
                showEditIcon: (this.dataFields[id] ? this.dataFields[id].showEditIcon : true),
                showRemoveIcon: (this.dataFields[id] ? this.dataFields[id].showRemoveIcon : true),
                showValueTypeIcon: (this.dataFields[id] ? this.dataFields[id].showValueTypeIcon : true)
            };
            dimensionElements.push(fieldObj);
            this.fieldList[id] = fieldObj;
        }
        // let args: ConnectionInfo = {
        //     catalog: customArgs.dataSourceSettings.catalog,
        //     cube: customArgs.dataSourceSettings.cube,
        //     url: customArgs.dataSourceSettings.url,
        //     LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
        //     request: 'MDSCHEMA_SETS'
        // };
        // this.getTreeData(args, this.loadHierarchyElements.bind(this), customArgs);
        customArgs.hierarchy = this.fieldListData;
        customArgs.hierarchySuccess = this.fieldListObj.hierarchySuccess;
        this.loadHierarchyElements(customArgs);
    };
    OlapEngine.prototype.loadHierarchyElements = function (customArgs) {
        var data = customArgs.hierarchySuccess;
        var dimensionElements = customArgs.hierarchy;
        var dataFields = extend([], this.rows, null, true);
        dataFields = dataFields.concat(this.columns, this.filters);
        var reportElement = [];
        for (var _i = 0, dataFields_4 = dataFields; _i < dataFields_4.length; _i++) {
            var field = dataFields_4[_i];
            reportElement.push(field.name);
        }
        var fields = [].slice.call(data.querySelectorAll('row'));
        for (var _a = 0, fields_5 = fields; _a < fields_5.length; _a++) {
            var field = fields_5[_a];
            var dimensionName = field.querySelector('DIMENSION_UNIQUE_NAME').textContent;
            var hierarchyName = field.querySelector('HIERARCHY_UNIQUE_NAME').textContent;
            var isAllMemberAvail = [].slice.call(field.querySelectorAll('ALL_MEMBER')).length > 0;
            var allMember = void 0;
            if (isAllMemberAvail) {
                var stringCollection = field.querySelectorAll('ALL_MEMBER')[0].textContent.replace(/[\[\]\&']+/g, '').split('.');
                allMember = stringCollection[stringCollection.length - 1].trim();
            }
            else {
                allMember = undefined;
            }
            /* tslint:disable-next-line:max-line-length */
            var hierarchyFolderName = ((field.querySelector('HIERARCHY_DISPLAY_FOLDER')) ? (field.querySelector('HIERARCHY_DISPLAY_FOLDER').textContent) : '');
            var curElement = [];
            for (var _b = 0, dimensionElements_1 = dimensionElements; _b < dimensionElements_1.length; _b++) {
                var item = dimensionElements_1[_b];
                if (item.tag === dimensionName) {
                    curElement.push(item);
                }
            }
            if (curElement.length > 0 && (dimensionName !== hierarchyName || this.isMondrian)) {
                var parentID = dimensionName + (this.isMondrian ? '~#^Dim' : '');
                if (hierarchyFolderName !== '') {
                    var folderName = dimensionName + (this.isMondrian ? '~#^Dim' : '') + '_' + hierarchyFolderName;
                    var curParentElement = [];
                    for (var _c = 0, dimensionElements_2 = dimensionElements; _c < dimensionElements_2.length; _c++) {
                        var item = dimensionElements_2[_c];
                        if (item.tag === folderName && item.pid === parentID) {
                            curParentElement.push(item);
                        }
                    }
                    if (curParentElement.length === 0) {
                        var fieldObj_1 = {
                            hasChildren: true,
                            isSelected: false,
                            pid: dimensionName + (this.isMondrian ? '~#^Dim' : ''),
                            id: folderName,
                            name: hierarchyFolderName,
                            spriteCssClass: 'e-folderCDB-icon' + ' ' + cls.ICON,
                            tag: folderName,
                            caption: hierarchyFolderName,
                            // aggregateType: this.getAggregateType(hierarchyFolderName),
                            type: 'string'
                        };
                        dimensionElements.push(fieldObj_1);
                    }
                    parentID = folderName;
                }
                var fieldObj = {
                    /* tslint:disable-next-line:max-line-length */
                    hasChildren: (field.querySelector('HIERARCHY_ORIGIN') ? ((field.querySelector('HIERARCHY_ORIGIN').textContent !== '2') && field.querySelector('HIERARCHY_ORIGIN').textContent !== '6') ? true : false : true),
                    // hasChildren: true,
                    isSelected: (reportElement.indexOf(hierarchyName) >= 0),
                    pid: parentID,
                    id: hierarchyName,
                    name: field.querySelector('HIERARCHY_CAPTION').textContent,
                    /* tslint:disable-next-line:max-line-length */
                    spriteCssClass: (field.querySelector('HIERARCHY_ORIGIN') ? ((field.querySelector('HIERARCHY_ORIGIN').textContent !== '2') && field.querySelector('HIERARCHY_ORIGIN').textContent !== '6') ? 'e-hierarchyCDB-icon' : 'e-attributeCDB-icon' : 'e-hierarchyCDB-icon') + ' ' + cls.ICON,
                    hasAllMember: isAllMemberAvail,
                    allMember: allMember,
                    tag: hierarchyName,
                    caption: field.querySelector('HIERARCHY_CAPTION').textContent,
                    // aggregateType: this.getAggregateType(hierarchyName),
                    type: 'string',
                    filter: [],
                    dateMember: [],
                    sort: (this.enableSort ? this.sortObject[hierarchyName] ? this.sortObject[hierarchyName] : 'Ascending' : 'None'),
                    actualFilter: [],
                    filterMembers: [],
                    childMembers: [],
                    searchMembers: [],
                    members: {},
                    currrentMembers: {},
                    levels: [],
                    levelCount: 1,
                    /* tslint:disable-next-line:max-line-length */
                    isHierarchy: (field.querySelector('HIERARCHY_ORIGIN') ? ((field.querySelector('HIERARCHY_ORIGIN').textContent !== '2') && field.querySelector('HIERARCHY_ORIGIN').textContent !== '6') ? false : true : false),
                    isExcelFilter: false,
                    allowDragAndDrop: (this.dataFields[hierarchyName] ? this.dataFields[hierarchyName].allowDragAndDrop : true),
                    showFilterIcon: (this.dataFields[hierarchyName] ? this.dataFields[hierarchyName].showFilterIcon : true),
                    showSortIcon: (this.dataFields[hierarchyName] ? this.dataFields[hierarchyName].showSortIcon : true),
                    showEditIcon: (this.dataFields[hierarchyName] ? this.dataFields[hierarchyName].showEditIcon : true),
                    showRemoveIcon: (this.dataFields[hierarchyName] ? this.dataFields[hierarchyName].showRemoveIcon : true),
                    showValueTypeIcon: (this.dataFields[hierarchyName] ? this.dataFields[hierarchyName].showValueTypeIcon : true)
                };
                dimensionElements.push(fieldObj);
                this.fieldList[hierarchyName] = fieldObj;
            }
        }
        var args = {
            catalog: customArgs.dataSourceSettings.catalog,
            cube: customArgs.dataSourceSettings.cube,
            url: customArgs.dataSourceSettings.url,
            LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
            request: 'MDSCHEMA_LEVELS'
        };
        this.getTreeData(args, this.loadLevelElements.bind(this), customArgs);
    };
    OlapEngine.prototype.loadLevelElements = function (xmlDoc, request, customArgs) {
        var newDataSource = [];
        var dimensionElements = this.fieldListData;
        newDataSource = [];
        var fields = [].slice.call(xmlDoc.querySelectorAll('row'));
        for (var _i = 0, fields_6 = fields; _i < fields_6.length; _i++) {
            var field = fields_6[_i];
            /* tslint:disable-next-line:max-line-length */
            if (parseInt(field.querySelector('LEVEL_TYPE').textContent, 10) !== 1 && field.querySelector('HIERARCHY_UNIQUE_NAME').textContent.toLowerCase() !== '[measures]') {
                var dimensionName = field.querySelector('HIERARCHY_UNIQUE_NAME').textContent;
                var levelName = field.querySelector('LEVEL_UNIQUE_NAME').textContent;
                var levelCaption = field.querySelector('LEVEL_CAPTION').textContent;
                var levelObj = {
                    hasChildren: false,
                    isChecked: false,
                    isSelected: this.fieldList[dimensionName].isSelected,
                    pid: dimensionName,
                    id: levelName,
                    name: levelCaption,
                    tag: levelName,
                    /* tslint:disable-next-line:max-line-length */
                    spriteCssClass: 'e-level-members e-hierarchy-level-' + parseInt(field.querySelector('LEVEL_NUMBER').textContent, 10) + '-icon' + ' ' + cls.ICON,
                    caption: levelCaption,
                    // aggregateType: this.getAggregateType(levelName),
                    type: 'string'
                };
                newDataSource.push(levelObj);
                if (this.fieldList[dimensionName] && this.fieldList[dimensionName].spriteCssClass &&
                    this.fieldList[dimensionName].spriteCssClass.indexOf('e-attributeCDB-icon') === -1) {
                    this.fieldList[dimensionName].levels.push(levelObj);
                    this.fieldList[dimensionName].isHierarchy = false;
                }
                else {
                    this.fieldList[dimensionName].isHierarchy = true;
                }
            }
        }
        this.fieldListData = dimensionElements = dimensionElements.concat(newDataSource);
        var args = {
            catalog: customArgs.dataSourceSettings.catalog,
            cube: customArgs.dataSourceSettings.cube,
            url: customArgs.dataSourceSettings.url,
            LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
            request: 'MDSCHEMA_MEASURES'
        };
        this.getTreeData(args, this.loadMeasureElements.bind(this), customArgs);
    };
    OlapEngine.prototype.loadMeasureElements = function (xmlDoc, request, customArgs) {
        var dimensionElements = this.fieldListData;
        var measureGroupItems = [];
        var caption;
        var dataFields = extend([], this.values, null, true);
        var reportElement = [];
        for (var _i = 0, dataFields_5 = dataFields; _i < dataFields_5.length; _i++) {
            var field = dataFields_5[_i];
            reportElement.push(field.name);
        }
        if (this.locale !== 'en-US') {
            var args = {
                catalog: customArgs.dataSourceSettings.catalog,
                cube: customArgs.dataSourceSettings.cube,
                url: customArgs.dataSourceSettings.url,
                LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
                request: 'MDSCHEMA_MEASUREGROUPS'
            };
            this.getTreeData(args, this.loadMeasureGroups.bind(this), customArgs);
        }
        var fields = [].slice.call(xmlDoc.querySelectorAll('row'));
        for (var _a = 0, fields_7 = fields; _a < fields_7.length; _a++) {
            var field = fields_7[_a];
            /* tslint:disable-next-line:max-line-length */
            var measureGRPName = isNullOrUndefined(field.querySelector('MEASUREGROUP_NAME')) ? '' : field.querySelector('MEASUREGROUP_NAME').textContent;
            var measureName = field.querySelector('MEASURE_UNIQUE_NAME').textContent;
            var formatString = field.querySelector('DEFAULT_FORMAT_STRING') ?
                field.querySelector('DEFAULT_FORMAT_STRING').textContent : '#,#';
            var aggregateType = field.querySelector('MEASURE_AGGREGATOR') ?
                field.querySelector('MEASURE_AGGREGATOR').textContent : '1';
            if (!(measureGroupItems.indexOf(measureGRPName) >= 0)) {
                if (this.locale !== 'en-US') {
                    var measureInfo = [];
                    for (var _b = 0, _c = this.fieldListObj.measuresGroups; _b < _c.length; _b++) {
                        var item = _c[_b];
                        if (item.querySelector('MEASUREGROUP_NAME').textContent === measureGRPName) {
                            measureInfo.push(item);
                        }
                    }
                    caption = measureInfo.length > 0 ? measureInfo[0].querySelector('MEASUREGROUP_CAPTION').textContent : measureGRPName;
                }
                else {
                    caption = measureGRPName;
                }
                if (measureGRPName !== '') {
                    dimensionElements.push({
                        hasChildren: true,
                        isChecked: false,
                        isSelected: false,
                        pid: '[Measures]',
                        id: measureGRPName,
                        name: caption,
                        spriteCssClass: 'e-measureCDB e-folderCDB-icon' + ' ' + cls.ICON,
                        tag: measureGRPName,
                        caption: caption,
                        aggregateType: this.getAggregateType(measureGRPName, aggregateType),
                        type: 'string'
                    });
                    measureGroupItems.push(measureGRPName);
                }
            }
            var fieldObj = {
                hasChildren: false,
                isSelected: (reportElement.indexOf(measureName) >= 0),
                pid: measureGRPName === '' ? '[Measures]' : measureGRPName,
                id: measureName,
                name: field.querySelector('MEASURE_CAPTION').textContent,
                spriteCssClass: 'e-measure-icon' + ' ' + cls.ICON,
                tag: measureName,
                caption: field.querySelector('MEASURE_CAPTION').textContent,
                aggregateType: this.getAggregateType(measureName, aggregateType),
                type: 'number',
                filter: [],
                // sort: 'Ascending',
                actualFilter: [],
                filterMembers: [],
                childMembers: [],
                searchMembers: [],
                members: {},
                currrentMembers: {},
                formatString: formatString,
                allowDragAndDrop: (this.dataFields[measureName] ? this.dataFields[measureName].allowDragAndDrop : true),
                showFilterIcon: (this.dataFields[measureName] ? this.dataFields[measureName].showFilterIcon : true),
                showSortIcon: (this.dataFields[measureName] ? this.dataFields[measureName].showSortIcon : true),
                showEditIcon: (this.dataFields[measureName] ? this.dataFields[measureName].showEditIcon : true),
                showRemoveIcon: (this.dataFields[measureName] ? this.dataFields[measureName].showRemoveIcon : true),
                showValueTypeIcon: (this.dataFields[measureName] ? this.dataFields[measureName].showValueTypeIcon : true)
            };
            dimensionElements.push(fieldObj);
            this.fieldList[measureName] = fieldObj;
            if ((reportElement.indexOf(measureName) >= 0)) {
                reportElement.splice(reportElement.indexOf(measureName), 1);
            }
        }
        this.measureReportItems = reportElement;
        // let args: ConnectionInfo = {
        //     catalog: customArgs.dataSourceSettings.catalog,
        //     cube: customArgs.dataSourceSettings.cube,
        //     url: customArgs.dataSourceSettings.url,
        //     LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
        //     request: 'MDSCHEMA_KPIS'
        // };
        // customArgs.reportElement = this.measureReportItems;
        // this.getTreeData(args, this.loadKPIElements.bind(this), customArgs);
    };
    OlapEngine.prototype.loadMeasureGroups = function (xmlDoc, request, customArgs) {
        if (isNullOrUndefined(this.fieldListObj)) {
            this.fieldListObj = {};
        }
        this.fieldListObj.measuresGroups = [].slice.call(xmlDoc.querySelectorAll('row'));
    };
    // private loadKPIElements(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
    //     let dimensionElements: IOlapField[] = this.fieldListData;
    //     let parser = new DOMParser();
    //     let measureGroupItems: string[] = [];
    //     let fields: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('row'));
    //     dimensionElements.splice(1, 0, {
    //         hasChildren: true,
    //         isChecked: false,
    //         id: 'folderStruct',
    //         name: 'KPI',
    //         spriteCssClass: 'kpiCDB e-kpiCDB-icon' + ' ' +  cls.ICON,
    //         tag: '',
    //         caption: 'KPI',
    //         aggregateType: this.getAggregateType('folderStruct'),
    //         type: 'string'
    //     });
    //     for (let field of fields) {
    //         let kpiName: string = field.querySelector('KPI_CAPTION').textContent;
    //         let kpiGoal: string = field.querySelector('KPI_GOAL').textContent;
    //         let kpiStatus: string = field.querySelector('KPI_STATUS').textContent;
    //         let kpiTrend: string = field.querySelector('KPI_TREND').textContent;
    //         let kpiValue: string = field.querySelector('KPI_VALUE').textContent;
    //         if (!(measureGroupItems.indexOf(field.querySelector('KPI_NAME').textContent) >= 0)) {
    //             dimensionElements.push({
    //                 hasChildren: true,
    //                 isChecked: false,
    //                 pid: 'folderStruct',
    //                 id: kpiName,
    //                 name: kpiName,
    //                 spriteCssClass: 'e-folderCDB-icon' + ' ' +  cls.ICON,
    //                 tag: kpiName,
    //                 caption: kpiName,
    //                 aggregateType: this.getAggregateType(kpiName),
    //                 type: 'string'
    //             });
    //             measureGroupItems.push(kpiName);
    //         }
    //         let kpiCollection: { [key: string]: string } = {
    //             'kpiGoal': kpiGoal,
    //             'kpiStatus': kpiStatus,
    //             'kpiTrend': kpiTrend,
    //             'kpiValue': kpiValue
    //         };
    //         let i: number = 0;
    //         for (let kpi of Object.keys(kpiCollection)) {
    //             let id: string = kpiCollection[kpi];
    //             let name: string = (kpi).split('kpi')[1];
    //             let cssClass: string = 'e-' + kpi + '-icon';
    //             let fieldObj: IOlapField = {
    //                 hasChildren: true,
    //                 isSelected: (customArgs.reportElement.indexOf(id) >= 0),
    //                 id: id,
    //                 pid: kpiName,
    //                 name: name,
    //                 spriteCssClass: cssClass + ' ' +  cls.ICON,
    //                 tag: id,
    //                 caption: name,
    //                 aggregateType: this.getAggregateType(id),
    //                 type: 'number',
    //                 filter: [],
    //                 sort: 'Ascending',
    //                 filterMembers: [],
    //                 searchMembers: [],
    //                 members: {},
    //                 currrentMembers: {}
    //             };
    //             dimensionElements.push(fieldObj);
    //             this.fieldList[id] = fieldObj;
    //         }
    //     }
    // }
    OlapEngine.prototype.doAjaxPost = function (type, url, data, success, customArgs) {
        var ajax = new Ajax({
            mode: false,
            contentType: 'text/xml',
            url: url,
            data: data,
            dataType: 'xml',
            type: type,
            beforeSend: this.beforeSend.bind(this),
            onSuccess: function (args, request) {
                var parser = new DOMParser();
                // parsing string type result as XML
                var xmlDoc = parser.parseFromString(args, 'text/xml');
                success(xmlDoc, request, customArgs);
            },
            onFailure: function (e) {
                return e;
            }
        });
        ajax.send();
    };
    OlapEngine.prototype.beforeSend = function (args) {
        if (this.dataSourceSettings.authentication.userName && this.dataSourceSettings.authentication.password) {
            /* tslint:disable */
            args.httpRequest.setRequestHeader("Authorization", "Basic " + btoa(this.dataSourceSettings.authentication.userName + ":" +
                this.dataSourceSettings.authentication.password));
            /* tslint:enable */
        }
    };
    OlapEngine.prototype.getSoapMsg = function (dataSourceSettings, query) {
        var xmlMsg = '';
        var sourceInfo = '';
        var connectionString = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
        /* tslint:disable:max-line-length */
        if (this.isMondrian) {
            sourceInfo = '';
            xmlMsg = '<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><SOAP-ENV:Body><Execute xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><Command><Statement><![CDATA[' +
                query + ']]></Statement></Command><Properties><PropertyList><DataSourceInfo>' + sourceInfo +
                '</DataSourceInfo><Catalog>' + dataSourceSettings.catalog + '</Catalog><AxisFormat>TupleFormat</AxisFormat><Content>Data</Content><Format>Multidimensional</Format></PropertyList></Properties></Execute></SOAP-ENV:Body></SOAP-ENV:Envelope>';
        }
        else {
            xmlMsg = '<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"> <Header></Header> <Body> <Execute xmlns=\"urn:schemas-microsoft-com:xml-analysis\"> <Command> <Statement> ' +
                query + ' </Statement> </Command> <Properties> <PropertyList> <Catalog>' + dataSourceSettings.catalog +
                '</Catalog> <LocaleIdentifier>' + connectionString.LCID + '</LocaleIdentifier></PropertyList> </Properties> </Execute> </Body> </Envelope>';
        }
        /* tslint:enable:max-line-length */
        return xmlMsg;
    };
    OlapEngine.prototype.getConnectionInfo = function (connectionString, locale) {
        var connectionInfo = { url: '', LCID: !isNullOrUndefined(locale) ? locale.toString() : '1033' };
        if (connectionString !== '') {
            for (var _i = 0, _a = connectionString.split(';'); _i < _a.length; _i++) {
                var obj = _a[_i];
                if (obj.toLowerCase().indexOf('locale') < 0 && connectionInfo.url.length === 0) {
                    connectionInfo.url = obj;
                }
                else if (obj.toLowerCase().indexOf('locale') >= 0) {
                    connectionInfo.LCID = obj.replace(/ /g, '').split('=')[1];
                }
            }
        }
        return connectionInfo;
    };
    OlapEngine.prototype.getMDXQuery = function (dataSourceSettings) {
        MDXQuery.getCellSets(dataSourceSettings, this, true, undefined, true);
        return this.mdxQuery;
    };
    return OlapEngine;
}());
export { OlapEngine };
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
