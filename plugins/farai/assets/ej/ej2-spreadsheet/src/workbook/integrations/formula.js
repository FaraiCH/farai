/* tslint:disable-next-line:max-line-length */
import { getSheetName, getSheetIndex, getSheet, getSheetIndexByName, getCell } from '../base/index';
import { workbookFormulaOperation, getColumnHeaderText, aggregateComputation, getRangeIndexes } from '../common/index';
import { Calculate, ValueChangedArgs, CommonErrors, getAlphalabel } from '../../calculate/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { getCellAddress, getFormattedCellObject, isNumber, checkIsFormula } from '../common/index';
import { workbookEditOperation, getRangeAddress, getRangeFromAddress, isCellReference } from '../common/index';
/**
 * @hidden
 * The `WorkbookFormula` module is used to handle the formula operation in Workbook.
 */
var WorkbookFormula = /** @class */ (function () {
    /**
     * Constructor for formula module in Workbook.
     * @private
     */
    function WorkbookFormula(workbook) {
        this.uniqueOBracket = String.fromCharCode(129);
        this.uniqueCBracket = String.fromCharCode(130);
        this.uniqueCSeparator = String.fromCharCode(131);
        this.uniqueCOperator = String.fromCharCode(132);
        this.uniquePOperator = String.fromCharCode(133);
        this.uniqueSOperator = String.fromCharCode(134);
        this.uniqueMOperator = String.fromCharCode(135);
        this.uniqueDOperator = String.fromCharCode(136);
        this.uniqueModOperator = String.fromCharCode(137);
        this.uniqueConcateOperator = String.fromCharCode(138);
        this.uniqueEqualOperator = String.fromCharCode(139);
        this.uniqueExpOperator = String.fromCharCode(140);
        this.uniqueGTOperator = String.fromCharCode(141);
        this.uniqueLTOperator = String.fromCharCode(142);
        this.sheetInfo = [];
        this.parent = workbook;
        this.init();
    }
    WorkbookFormula.prototype.init = function () {
        this.addEventListener();
        this.initCalculate();
        this.registerSheet();
    };
    /**
     * To destroy the formula module.
     * @return {void}
     * @hidden
     */
    WorkbookFormula.prototype.destroy = function () {
        this.removeEventListener();
        this.calculateInstance.dispose();
        this.calculateInstance = null;
        this.parent = null;
    };
    WorkbookFormula.prototype.addEventListener = function () {
        this.parent.on(workbookFormulaOperation, this.performFormulaOperation, this);
        this.parent.on(aggregateComputation, this.aggregateComputation, this);
    };
    WorkbookFormula.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookFormulaOperation, this.performFormulaOperation);
            this.parent.off(aggregateComputation, this.aggregateComputation);
        }
    };
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    WorkbookFormula.prototype.getModuleName = function () {
        return 'workbookFormula';
    };
    WorkbookFormula.prototype.initCalculate = function () {
        this.calculateInstance = new Calculate(this.parent);
        this.calcID = this.calculateInstance.createSheetFamilyID();
        this.calculateInstance.setTreatEmptyStringAsZero(true);
        this.calculateInstance.grid = this.parent.getActiveSheet().id.toString();
    };
    WorkbookFormula.prototype.performFormulaOperation = function (args) {
        var action = args.action;
        var formulas = this.calculateInstance.getLibraryFormulas();
        var formulaInfo = (Array.from(formulas.values()));
        switch (action) {
            case 'getLibraryFormulas':
                args.formulaCollection = Array.from(formulas.keys());
                break;
            case 'getFormulaCategory':
                var collection = ['All'];
                for (var i = 1; i < Array.from(formulas.values()).length; i++) {
                    if (collection.indexOf(formulaInfo[i].category) < 0) {
                        collection.push(formulaInfo[i].category);
                    }
                }
                args.categoryCollection = collection;
                break;
            case 'dropDownSelectFormulas':
                for (var i = 0; i < Array.from(formulas.values()).length; i++) {
                    if (args.selectCategory === formulaInfo[i].category) {
                        args.formulaCollection[i] = Array.from(formulas.keys())[i];
                    }
                }
                break;
            case 'getFormulaDescription':
                for (var i = 0; i < Array.from(formulas.values()).length; i++) {
                    if (args.selectedList === Array.from(formulas.keys())[i]) {
                        args.description = formulaInfo[i].description;
                    }
                }
                break;
            case 'registerSheet':
                this.registerSheet(args.sheetIndex, args.sheetCount);
                if (args.isImport) {
                    this.updateSheetInfo();
                }
                break;
            case 'unRegisterSheet':
                this.unRegisterSheet(args.sheetIndex, args.sheetCount);
                break;
            case 'refreshCalculate':
                args.value = this.autoCorrectFormula(args.value, args.rowIndex, args.colIndex);
                this.refreshCalculate(args.rowIndex, args.colIndex, args.value, args.isFormula, args.sheetIndex);
                break;
            case 'getArgumentSeparator':
                args.argumentSeparator = this.calculateInstance.getParseArgumentSeparator();
                break;
            case 'addDefinedName':
                args.isAdded = this.addDefinedName(args.definedName);
                break;
            case 'removeDefinedName':
                args.isRemoved = this.removeDefinedName(args.definedName, args.scope);
                break;
            case 'initiateDefinedNames':
                this.initiateDefinedNames();
                break;
            case 'renameUpdation':
                this.renameUpdation(args.value, args.sheetId);
                break;
            case 'addSheet':
                this.sheetInfo.push({ visibleName: args.visibleName, sheet: args.sheetName, index: args.index });
                break;
            case 'getSheetInfo':
                args.sheetInfo = this.sheetInfo;
                break;
            case 'deleteSheetTab':
                var length_1 = this.sheetInfo.length;
                for (var i = 0; i < length_1; i++) {
                    if (this.sheetInfo[i].index === args.index) {
                        args.sheetName = this.sheetInfo[i].sheet;
                        this.sheetInfo.splice(i, 1);
                        break;
                    }
                }
                this.calculateInstance.unregisterGridAsSheet((args.index - 1).toString(), args.index);
                this.calculateInstance.tokenCount = this.calculateInstance.tokenCount - 1;
                this.sheetDeletion(args.sheetName, args.index, args.index);
                break;
            case 'getReferenceError':
                args.refError = this.referenceError();
                break;
            case 'getAlpha':
                args.col = getAlphalabel(args.col);
                break;
            case 'addCustomFunction':
                this.addCustomFunction(args.functionHandler, args.functionName);
                break;
            case 'computeExpression':
                args.calcValue = this.calculateInstance.computeExpression(args.formula);
                break;
            case 'registerGridInCalc':
                this.calculateInstance.grid = args.sheetID;
                break;
            case 'refreshInsDelFormula':
                this.refreshInsDelFormula(args.insertArgs);
                break;
            case 'refreshNamedRange':
                this.refreshNamedRange(args.insertArgs, action);
                break;
        }
    };
    WorkbookFormula.prototype.referenceError = function () {
        return this.calculateInstance.getErrorStrings()[CommonErrors.ref];
    };
    WorkbookFormula.prototype.getSheetInfo = function () {
        return this.sheetInfo;
    };
    WorkbookFormula.prototype.addCustomFunction = function (functionHandler, functionName) {
        this.calculateInstance.defineFunction(functionName, functionHandler);
    };
    WorkbookFormula.prototype.updateSheetInfo = function () {
        var _this = this;
        this.sheetInfo = [];
        this.parent.sheets.forEach(function (sheet, idx) {
            _this.sheetInfo.push({ visibleName: sheet.name, sheet: 'Sheet' + sheet.id, index: idx });
        });
    };
    WorkbookFormula.prototype.sheetDeletion = function (delSheetName, sheetId, index) {
        var dependentCell = this.calculateInstance.getDependentCells();
        var cellRef = [];
        var fInfo = null;
        var formulaVal = '';
        var rowId;
        var colId;
        dependentCell.forEach(function (value, key) {
            cellRef.push(key);
        });
        this.removeSheetTokenIndex(formulaVal, index);
        for (var i = 0; i < cellRef.length; i++) {
            var dependentCellRef = this.calculateInstance.getDependentCells().get(cellRef[i]);
            for (var j = 0; j < dependentCellRef.length; j++) {
                fInfo = this.calculateInstance.getFormulaInfoTable().get(dependentCellRef[j]);
                sheetId = parseInt(dependentCellRef[j].split('!')[1], 10) + 1;
                if (!isNullOrUndefined(fInfo) && sheetId > -1) {
                    formulaVal = fInfo.formulaText;
                    if (formulaVal.toUpperCase().indexOf(delSheetName.toUpperCase()) > -1) {
                        formulaVal = formulaVal.toUpperCase().split(delSheetName.toUpperCase() +
                            this.calculateInstance.sheetToken).join(this.referenceError());
                        rowId = this.calculateInstance.rowIndex(dependentCellRef[j]);
                        colId = this.calculateInstance.colIndex(dependentCellRef[j]);
                        this.updateDataContainer([rowId - 1, colId - 1], { value: formulaVal, sheetId: sheetId, visible: false });
                        this.calculateInstance.refresh(fInfo.getParsedFormula());
                    }
                }
                if (delSheetName.split('Sheet')[1] === cellRef[i].split('!')[1]) {
                    this.calculateInstance.getFormulaInfoTable().delete(cellRef[i]);
                    this.calculateInstance.clearFormulaDependentCells(cellRef[i]);
                }
            }
        }
    };
    WorkbookFormula.prototype.removeSheetTokenIndex = function (value, index) {
        var family = this.calculateInstance.getSheetFamilyItem(this.calculateInstance.grid);
        family.sheetNameToToken.delete(index.toString());
        family.sheetNameToParentObject.delete(index.toString());
        family.parentObjectToToken.delete(index.toString());
        family.tokenToParentObject.delete('!' + (index - 1).toString() + '!');
        return value;
    };
    WorkbookFormula.prototype.renameUpdation = function (name, sheetIdx) {
        var dependentCellRef = this.calculateInstance.getDependentCells();
        var cellRef = [];
        var fInfo;
        var formulaVal = '';
        var savedTokens = [];
        var isSheetRenamed = false;
        var rowIndex;
        var colIndex;
        var sheetIndex;
        dependentCellRef.forEach(function (value, key) {
            cellRef.push(key);
        });
        for (var i = 0; i < this.sheetInfo.length; i++) {
            if (this.sheetInfo[i].index === sheetIdx) {
                this.sheetInfo[i].visibleName = name;
                break;
            }
        }
        var sheetNames = this.sheetInfo;
        for (var i = 0; i < cellRef.length; i++) {
            var dependentCells = this.calculateInstance.getDependentCells().get(cellRef[i]);
            for (var j = 0; j < dependentCells.length; j++) {
                fInfo = this.calculateInstance.getFormulaInfoTable().get(dependentCells[j]);
                formulaVal = fInfo.formulaText;
                for (var s = 0; s < sheetNames.length; s++) {
                    if (sheetNames[s].visibleName !== sheetNames[s].sheet) {
                        var name_1 = sheetNames[s].sheet.toUpperCase();
                        if (formulaVal.toUpperCase().indexOf(name_1) > -1) {
                            formulaVal = formulaVal.toUpperCase().split(name_1).join(s + '/');
                            savedTokens.push(s);
                            isSheetRenamed = true;
                        }
                    }
                }
                if (isSheetRenamed) {
                    for (var k = 0; k < savedTokens.length; k++) {
                        formulaVal = formulaVal.split(savedTokens[k].toString() + '/').join(sheetNames[savedTokens[k]].visibleName);
                    }
                    rowIndex = this.calculateInstance.rowIndex(dependentCells[j]);
                    colIndex = this.calculateInstance.colIndex(dependentCells[j]);
                    sheetIndex = getSheetIndexByName(this.parent, ('Sheet') + (parseInt(dependentCells[j].split('!')[1], 10) + 1), this.sheetInfo);
                    this.updateDataContainer([rowIndex - 1, colIndex - 1], { value: formulaVal, sheetId: sheetIndex, visible: true });
                }
            }
        }
    };
    WorkbookFormula.prototype.updateDataContainer = function (indexes, data) {
        var rowIndex = indexes[0];
        var colIndex = indexes[1];
        var sheetData;
        var rowData;
        var colObj;
        var len = this.parent.sheets.length;
        for (var i = 0; i < len; i++) {
            if (this.parent.sheets[i].id === data.sheetId) {
                sheetData = this.parent.sheets[i].rows;
                break;
            }
        }
        if (!isNullOrUndefined(data)) {
            if (rowIndex in sheetData) {
                rowData = sheetData[rowIndex];
                if (colIndex in rowData.cells) {
                    colObj = rowData.cells[colIndex];
                    colObj.formula = data.value;
                    colObj.value = data.visible ? colObj.value : this.referenceError();
                }
                else {
                    rowData.cells[colIndex] = colObj = {};
                }
            }
            else {
                rowData = sheetData[rowIndex] = {};
                rowData[colIndex] = colObj = {};
            }
        }
    };
    WorkbookFormula.prototype.parseSheetRef = function (value) {
        var regx;
        var escapeRegx = new RegExp('[!@#$%^&()+=\';,.{}|\":<>~_-]', 'g');
        var i = 0;
        var sheetCount = this.parent.sheets.length;
        var temp = [];
        temp.length = 0;
        var sheetInfo = this.getSheetInfo();
        var exp = '(?=[\'!])(?=[^"]*(?:"[^"]*"[^"]*)*$)';
        for (i = 0; i < sheetCount; i++) {
            if (sheetInfo[i].sheet !== sheetInfo[i].visibleName) {
                regx = new RegExp(sheetInfo[i].visibleName.replace(escapeRegx, '\\$&') + exp, 'gi');
                if (value.match(regx)) {
                    value = value.replace(regx, i + '/');
                    temp.push(i);
                }
            }
        }
        i = 0;
        while (i < temp.length) {
            regx = new RegExp(temp[i] + '/' + exp, 'gi');
            value = value.replace(regx, sheetInfo[temp[i]].sheet);
            i++;
        }
        return value;
    };
    WorkbookFormula.prototype.registerSheet = function (sheetIndex, sheetCount) {
        if (sheetIndex === void 0) { sheetIndex = 0; }
        if (sheetCount === void 0) { sheetCount = this.parent.sheets.length; }
        var id;
        while (sheetIndex < sheetCount) {
            id = getSheet(this.parent, sheetIndex).id + '';
            this.calculateInstance.registerGridAsSheet(id, id, this.calcID);
            sheetIndex++;
        }
    };
    WorkbookFormula.prototype.unRegisterSheet = function (sheetIndex, sheetCount) {
        if (sheetIndex === void 0) { sheetIndex = 0; }
        if (sheetCount === void 0) { sheetCount = this.parent.sheets.length; }
        var id;
        this.calculateInstance.tokenCount = 0;
        while (sheetIndex < sheetCount) {
            id = getSheet(this.parent, sheetIndex).id + '';
            this.calculateInstance.unregisterGridAsSheet(id, id);
            sheetIndex++;
        }
    };
    WorkbookFormula.prototype.refreshCalculate = function (rowIdx, colIdx, value, isFormula, sheetIdx) {
        if (sheetIdx === undefined) {
            sheetIdx = this.parent.activeSheetIndex;
        }
        var sheetName = getSheet(this.parent, sheetIdx).id + '';
        if (isFormula) {
            value = this.parseSheetRef(value);
            var cellArgs = new ValueChangedArgs(rowIdx + 1, colIdx + 1, value);
            this.calculateInstance.valueChanged(sheetName, cellArgs, true);
            var referenceCollection = this.calculateInstance.randCollection;
            if (this.calculateInstance.isRandomVal === true) {
                var rowId = void 0;
                var colId = void 0;
                var refValue = '';
                if (this.calculateInstance.randomValues.size > 1 && this.calculateInstance.randomValues.size ===
                    referenceCollection.length) {
                    for (var i = 0; i < this.calculateInstance.randomValues.size; i++) {
                        rowId = this.calculateInstance.rowIndex(referenceCollection[i]);
                        colId = this.calculateInstance.colIndex(referenceCollection[i]);
                        refValue = this.calculateInstance.randomValues.get(referenceCollection[i]);
                        sheetName = (parseFloat(this.calculateInstance.getSheetToken(referenceCollection[i]).split(this.calculateInstance.sheetToken).join('')) + 1).toString();
                        var tempArgs = new ValueChangedArgs(rowId, colId, refValue);
                        this.calculateInstance.valueChanged(sheetName, tempArgs, true);
                    }
                }
            }
        }
        else {
            var family = this.calculateInstance.getSheetFamilyItem(sheetName);
            var cellRef = getColumnHeaderText(colIdx + 1) + (rowIdx + 1);
            if (family.isSheetMember && !isNullOrUndefined(family.parentObjectToToken)) {
                cellRef = family.parentObjectToToken.get(sheetName) + cellRef;
            }
            if (this.calculateInstance.getFormulaInfoTable().has(cellRef)) {
                this.calculateInstance.getFormulaInfoTable().delete(cellRef);
                if (this.calculateInstance.getDependentCells().has(cellRef)) {
                    this.calculateInstance.clearFormulaDependentCells(cellRef);
                }
            }
            this.calculateInstance.getComputedValue().clear();
            this.calculateInstance.refresh(cellRef);
            this.calculateInstance.refreshRandValues(cellRef);
        }
        this.calculateInstance.cell = '';
    };
    WorkbookFormula.prototype.autoCorrectFormula = function (formula, rowIdx, colIdx) {
        if (!isNullOrUndefined(formula)) {
            formula = formula.toString();
            if (formula.split('(').length === 2 && formula.indexOf(')') < 0) {
                formula += ')';
            }
            formula = formula.indexOf('=') === 0 ? formula.slice(1) : formula;
            var lessEq = formula.match(/</g);
            var greaterEq = formula.match(/>/g);
            var equal = formula.match(/=/g);
            if (lessEq) {
                var lessOp = '';
                for (var i = 0; i < lessEq.length; i++) {
                    lessOp = lessOp + lessEq[i];
                }
                formula = formula.replace(lessOp, '<');
            }
            if (greaterEq) {
                var greaterOp = '';
                for (var j = 0; j < greaterEq.length; j++) {
                    greaterOp = greaterOp + greaterEq[j];
                }
                formula = formula.replace(greaterOp, '>');
            }
            if (equal) {
                var equalOp = '';
                for (var c = 0; c < equal.length; c++) {
                    equalOp = equalOp + equal[c];
                }
                formula = formula.split(equalOp).join('=');
            }
            formula = '=' + formula;
            if (lessEq || greaterEq || equal) {
                getCell(rowIdx, colIdx, this.parent.getActiveSheet()).formula = formula;
            }
        }
        return formula;
    };
    WorkbookFormula.prototype.initiateDefinedNames = function () {
        var definedNames = this.parent.definedNames;
        var i = 0;
        while (i < definedNames.length) {
            var definedname = definedNames[i];
            var refersTo = this.parseSheetRef(definedname.refersTo);
            var range = getRangeFromAddress(refersTo);
            var cellRef = false;
            var isLink = refersTo.indexOf('http:') > -1 ? true : (refersTo.indexOf('https:') > -1 ? true : false);
            range = range.split('$').join('');
            range = range.split('=').join('');
            if (range.indexOf(':') > -1) {
                var rangeSplit = range.split(':');
                if (isCellReference(rangeSplit[0]) && isCellReference(rangeSplit[1])) {
                    cellRef = true;
                }
            }
            else if (range.indexOf(':') < 0) {
                if (isCellReference(range)) {
                    cellRef = true;
                }
            }
            if (isLink) {
                cellRef = false;
            }
            if (cellRef) {
                this.addDefinedName(definedname, true);
            }
            else {
                this.removeDefinedName(definedname.name, definedname.scope);
                i--;
            }
            i++;
        }
    };
    /**
     * @hidden
     * Used to add defined name to workbook.
     * @param {DefineNameModel} name - Define named range.
     */
    WorkbookFormula.prototype.addDefinedName = function (definedName, isValidate) {
        var isAdded = true;
        var sheetIdx;
        var name = definedName.name;
        if (definedName.refersTo.indexOf('!') < 0) {
            var sheetName = getSheetName(this.parent);
            sheetName = sheetName.indexOf(' ') !== -1 ? '\'' + sheetName + '\'' : sheetName;
            definedName.refersTo = sheetName + '!' + ((definedName.refersTo.indexOf('=') < 0) ?
                definedName.refersTo : definedName.refersTo.split('=')[1]);
        }
        var visibleRefersTo = definedName.refersTo;
        var refersTo = this.parseSheetRef(definedName.refersTo);
        if (definedName.scope) {
            sheetIdx = getSheetIndex(this.parent, definedName.scope);
            if (sheetIdx > -1) {
                name = getSheetName(this.parent, sheetIdx) + '!' + name;
            }
        }
        else {
            definedName.scope = '';
        }
        if (!definedName.comment) {
            definedName.comment = '';
        }
        //need to extend once internal sheet value changes done.
        if (!isValidate && this.checkIsNameExist(definedName.name, definedName.scope)) {
            isAdded = false;
        }
        else {
            this.calculateInstance.addNamedRange(name, refersTo[0] === '=' ? refersTo.substr(1) : refersTo);
            if (refersTo[0] !== '=') {
                definedName.refersTo = '=' + visibleRefersTo;
            }
            if (this.parent.definedNames.indexOf(definedName) < 0) {
                this.parent.definedNames.push(definedName);
            }
        }
        return isAdded;
    };
    /**
     * @hidden
     * Used to remove defined name from workbook.
     * @param {string} name - Specifies the defined name.
     * @param {string} scope - Specifies the scope of the define name.
     */
    WorkbookFormula.prototype.removeDefinedName = function (name, scope) {
        var isRemoved = false;
        var index = this.getIndexFromNameColl(name, scope);
        if (index > -1) {
            var calcName = name;
            if (scope) {
                var sheetIdx = getSheetIndex(this.parent, scope);
                if (sheetIdx) {
                    calcName = getSheetName(this.parent, sheetIdx) + '!' + name;
                }
            }
            this.calculateInstance.removeNamedRange(calcName);
            this.parent.definedNames.splice(index, 1);
            isRemoved = true;
        }
        return isRemoved;
    };
    WorkbookFormula.prototype.checkIsNameExist = function (name, sheetName) {
        var isExist = this.parent.definedNames.some(function (key) {
            return key.name === name && (sheetName ? key.scope === sheetName : key.scope === '');
        });
        return isExist;
    };
    WorkbookFormula.prototype.getIndexFromNameColl = function (definedName, scope) {
        if (scope === void 0) { scope = ''; }
        var index = -1;
        this.parent.definedNames.filter(function (name, idx) {
            if (name.name === definedName && name.scope === scope) {
                index = idx;
            }
        });
        return index;
    };
    WorkbookFormula.prototype.toFixed = function (value) {
        var num = Number(value);
        if (Math.round(num) !== num) {
            value = num.toFixed(2);
        }
        return value;
    };
    WorkbookFormula.prototype.aggregateComputation = function (args) {
        var sheet = this.parent.getActiveSheet();
        var range = sheet.selectedRange;
        var indexes = getRangeIndexes(range.split(':')[1]);
        var i;
        var calcValue;
        var formulaVal = ['SUM', 'AVERAGE', 'MIN', 'MAX'];
        var formatedValues = [];
        if (indexes[0] + 1 === sheet.rowCount && indexes[1] + 1 === sheet.colCount) {
            range = "A1:" + getCellAddress(sheet.usedRange.rowIndex, sheet.usedRange.colIndex);
        }
        var actCell = getRangeIndexes(sheet.activeCell);
        var actCellModel = sheet.rows[actCell[0]] ? sheet.rows[actCell[0]].cells ?
            sheet.rows[actCell[0]].cells[actCell[1]] : {} : {};
        var actCellfrmt = (actCellModel) ? actCellModel.format : '';
        var cellValue;
        var cellCol = this.calculateInstance.getCellCollection(range);
        for (i = 0; i < cellCol.length; i++) {
            cellValue = this.calculateInstance.getValueFromArg(cellCol[i]);
            if (isNumber(cellValue)) {
                args.countOnly = false;
                break;
            }
        }
        args.Count = this.calculateInstance.getFunction('COUNTA')(range);
        if (!args.Count || args.countOnly) {
            return;
        }
        for (i = 0; i < 4; i++) {
            calcValue = this.toFixed(this.calculateInstance.getFunction(formulaVal[i])(range));
            var eventArgs = {
                formattedText: calcValue,
                value: calcValue,
                format: actCellfrmt,
                onLoad: true
            };
            if (actCellfrmt) {
                this.parent.notify(getFormattedCellObject, eventArgs);
                calcValue = eventArgs.formattedText;
            }
            formatedValues.push(calcValue);
        }
        args.Sum = formatedValues[0];
        args.Avg = formatedValues[1];
        args.Min = formatedValues[2];
        args.Max = formatedValues[3];
    };
    WorkbookFormula.prototype.clearFormula = function (args) {
        if (this.parent.activeSheetIndex === args.sheetIdx) {
            args.rowIdx = (args.type === 'Row') ? (args.status === 'insert') ? (args.rowIdx >= args.startIdx)
                ? args.rowIdx - args.count : args.rowIdx : args.rowIdx + args.count : args.rowIdx;
            args.colIdx = (args.type === 'Column') ? (args.status === 'insert') ? (args.colIdx >= args.startIdx) ?
                args.colIdx - args.count : args.colIdx : args.colIdx + args.count : args.colIdx;
        }
        var cellRef = '!' + args.sheetIdx + '!' + getAlphalabel((args.colIdx === -1 ?
            (args.colIdx + 2) : (args.colIdx + 1))) + (args.rowIdx === -1 ? (args.rowIdx + 2) : (args.rowIdx + 1));
        this.calculateInstance.getFormulaInfoTable().delete(cellRef);
        this.calculateInstance.clearFormulaDependentCells(cellRef);
    };
    WorkbookFormula.prototype.refreshFormula = function (formulaValue, count, status, type, startIdx, sheetIdx) {
        var diff;
        var diff1;
        var val = formulaValue;
        var nAlpha;
        var range = [];
        var actSheet = this.parent.getActiveSheet();
        var deleteIdxs = [];
        var i;
        var splitFormula = [];
        var fArg;
        var ridx;
        var hasREFVal = false;
        var pVal;
        if (checkIsFormula(val)) {
            if (status === 'delete') {
                for (i = 1; i <= count; i++) {
                    deleteIdxs.push(startIdx + i);
                }
            }
            splitFormula = this.parseFormula(val);
            for (i = 0; i < splitFormula.length; i++) {
                fArg = splitFormula[i].trim();
                if (this.calculateInstance.isCellReference(fArg)) {
                    pVal = i && splitFormula[i - 1].trim();
                    if (pVal && pVal[pVal.length - 1] === '!') {
                        pVal = pVal.replace(/['!]/g, '');
                        if (pVal !== actSheet.name) {
                            continue;
                        }
                    }
                    else if (parseInt(pVal, 10) === 0 && pVal[pVal.length - 1] === undefined) {
                        if ((actSheet.id - 1) !== sheetIdx) {
                            continue;
                        }
                    }
                    range = getRangeIndexes(fArg);
                    diff = (type === 'Column') ? (status === 'insert') ? range[3] + count : range[3] - count :
                        (status === 'insert') ? range[2] + count : range[2] - count;
                    diff1 = (type === 'Column') ? (status === 'insert') ? range[1] + count : range[1] - count :
                        (status === 'insert') ? range[0] + count : range[0] - count;
                    diff1 = (type === 'Column') ? (startIdx > range[1]) ? range[1] : diff1 : (startIdx > range[0]) ? range[0] : diff1;
                    diff = (type === 'Column') ? (startIdx > range[3]) ? range[3] : diff : (startIdx > range[2]) ? range[2] : diff;
                    if (diff1 > -1) {
                        nAlpha = (type === 'Column') ? getRangeAddress([range[0], diff1, range[2], diff]).split(':')[0] :
                            getRangeAddress([diff1, range[1], diff, range[3]]).split(':')[0];
                    }
                    else {
                        nAlpha = '#REF!';
                        hasREFVal = true;
                    }
                    if (status === 'delete') {
                        ridx = parseInt(type === 'Row' ? fArg.replace(/[A-Z]/g, '') : (fArg.replace(/[0-9]/g, '')), 10);
                        if (deleteIdxs.indexOf(ridx) > -1) {
                            nAlpha = '#REF!';
                            hasREFVal = true;
                        }
                    }
                    splitFormula[i] = nAlpha;
                }
            }
            val = '=' + splitFormula.join('');
        }
        return val;
    };
    WorkbookFormula.prototype.refreshInsDelFormula = function (args) {
        var count;
        var sheet;
        var sheets = this.parent.sheets;
        var sheetLen = sheets.length;
        var address;
        var cell;
        var s;
        var updatedFormulaVal;
        for (s = 0; s < sheetLen; s++) {
            count = args.model.length;
            sheet = this.parent.sheets[s];
            address = [0, 0, sheet.usedRange.rowIndex, sheet.usedRange.colIndex];
            for (var i = address[2]; i >= address[0]; i--) {
                for (var j = address[1]; j <= address[3]; j++) {
                    cell = getCell(i, j, sheet);
                    if (cell && cell.formula && checkIsFormula(cell.formula)) {
                        this.clearFormula({
                            rowIdx: i, colIdx: j, sheetIdx: s, count: count, status: args.name,
                            type: args.modelType, startIdx: args.startIndex
                        });
                        updatedFormulaVal = this.refreshFormula(cell.formula, count, args.name, args.modelType, args.startIndex, s);
                        this.parent.notify(workbookEditOperation, {
                            action: 'updateCellValue', address: [i, j, i,
                                j], value: updatedFormulaVal, sheetIndex: s
                        });
                    }
                }
            }
        }
    };
    WorkbookFormula.prototype.parseFormula = function (formula) {
        var temp;
        var str;
        var len;
        var i = 0;
        var arr = [];
        var formulaVal = [];
        formulaVal = this.markSpecialChar(formula.replace('=', ''));
        formulaVal = formulaVal.split(/\(|\)|=|\^|>|<|,|:|\+|-|\*|\/|%|&/g);
        len = formulaVal.length;
        while (i < len) {
            temp = formulaVal[i];
            if (!temp) {
                i++;
                continue;
            }
            if (temp.length === 1) {
                arr.push(this.isUniqueChar(temp) ? this.getUniqueCharVal(temp) : temp);
            }
            else {
                str = temp[0];
                if (temp.indexOf('!') > 0) {
                    if (this.isUniqueChar(str)) {
                        arr.push(this.getUniqueCharVal(str));
                        temp = temp.substr(1);
                    }
                    str = temp.indexOf('!') + 1;
                    arr.push(temp.substr(0, str));
                    arr.push(temp.substr(str));
                }
                else if (this.isUniqueChar(str)) {
                    arr.push(this.getUniqueCharVal(str));
                    arr.push(temp.substr(1));
                }
                else {
                    arr.push(temp);
                }
            }
            i++;
        }
        return arr;
    };
    WorkbookFormula.prototype.getUniqueCharVal = function (formula) {
        switch (formula) {
            case this.uniqueOBracket:
                return '(';
            case this.uniqueCBracket:
                return ')';
            case this.uniqueCSeparator:
                return ',';
            case this.uniqueCOperator:
                return ':';
            case this.uniquePOperator:
                return '+';
            case this.uniqueSOperator:
                return '-';
            case this.uniqueMOperator:
                return '*';
            case this.uniqueDOperator:
                return '/';
            case this.uniqueModOperator:
                return '%';
            case this.uniqueConcateOperator:
                return '&';
            case this.uniqueEqualOperator:
                return '=';
            case this.uniqueExpOperator:
                return '^';
            case this.uniqueGTOperator:
                return '>';
            case this.uniqueLTOperator:
                return '<';
        }
        return '';
    };
    WorkbookFormula.prototype.isUniqueChar = function (formula) {
        var code = formula.charCodeAt(formula);
        return code >= 129 && code <= 142;
    };
    WorkbookFormula.prototype.markSpecialChar = function (formula) {
        formula = formula.replace(/\(/g, '(' + this.uniqueOBracket).replace(/\)/g, ')' + this.uniqueCBracket);
        formula = formula.replace(/,/g, ',' + this.uniqueCSeparator).replace(/:/g, ':' + this.uniqueCOperator);
        formula = formula.replace(/\+/g, '+' + this.uniquePOperator).replace(/-/g, '-' + this.uniqueSOperator);
        formula = formula.replace(/\*/g, '*' + this.uniqueMOperator).replace(/\//g, '/' + this.uniqueDOperator);
        formula = formula.replace(/&/g, '&' + this.uniqueConcateOperator);
        formula = formula.replace(/=/g, '=' + this.uniqueEqualOperator);
        formula = formula.replace(/\^/g, '^' + this.uniqueExpOperator);
        formula = formula.replace(/>/g, '>' + this.uniqueGTOperator).replace(/</g, '<' + this.uniqueLTOperator);
        return formula.replace(/%/g, '%' + this.uniqueModOperator);
    };
    WorkbookFormula.prototype.refreshNamedRange = function (args, action) {
        var isChanged = false;
        var modelDefinedNames = this.parent.definedNames;
        var definedNames = Object.assign({}, modelDefinedNames);
        var definedName;
        var definedNameCnt = modelDefinedNames.length;
        var range;
        var rangeIndex;
        var count;
        var startIndex;
        var endIndex;
        var newIndex;
        var newRange;
        var sheetName;
        var sheetIndex;
        var sheet;
        for (var idx = 0; idx < definedNameCnt; idx++) {
            definedName = definedNames[idx];
            range = definedNames[idx].refersTo.split('!')[1];
            rangeIndex = getRangeIndexes(range);
            sheetName = definedName.refersTo.split('!')[0].split('=')[1];
            sheetIndex = getSheetIndex(this.parent, sheetName.replace(/'/g, ''));
            sheet = getSheet(this.parent, sheetIndex);
            if (sheetIndex === this.parent.activeSheetIndex) {
                if (args.name === 'insert') {
                    count = args.model.length;
                    startIndex = args.index;
                    endIndex = args.index + count;
                    if (args.modelType === 'Row') { // for above the named range index
                        if ((rangeIndex[0] >= endIndex) || (rangeIndex[0] >= startIndex && rangeIndex[2] >= endIndex)) {
                            newIndex = [rangeIndex[0] + count, rangeIndex[1], rangeIndex[2] + count, rangeIndex[3]];
                            isChanged = true;
                        }
                        else if ((rangeIndex[0] <= startIndex && rangeIndex[2] >= startIndex) || (rangeIndex[2] >= endIndex)) {
                            newIndex = [rangeIndex[0], rangeIndex[1], rangeIndex[2] + count, rangeIndex[3]];
                            isChanged = true;
                        }
                    }
                    else if (args.modelType === 'Column') {
                        if ((rangeIndex[1] >= endIndex) || (rangeIndex[1] >= startIndex && rangeIndex[3] >= endIndex)) {
                            newIndex = [rangeIndex[0], rangeIndex[1] + count, rangeIndex[2], rangeIndex[3] + count];
                            isChanged = true;
                        }
                        else if ((rangeIndex[1] <= startIndex && rangeIndex[3] >= startIndex) || (rangeIndex[3] >= endIndex)) {
                            newIndex = [rangeIndex[0], rangeIndex[1], rangeIndex[2], rangeIndex[3] + count];
                            isChanged = true;
                        }
                    }
                }
                else {
                    count = args.deletedModel.length;
                    startIndex = args.startIndex;
                    endIndex = args.endIndex;
                    if (args.modelType === 'Row') { // for above the named range index
                        if ((rangeIndex[0] >= endIndex) || (rangeIndex[0] >= startIndex && rangeIndex[2] >= endIndex)) {
                            newIndex = [rangeIndex[0] - count, rangeIndex[1], rangeIndex[2] - count, rangeIndex[3]];
                            isChanged = true;
                        }
                        else if ((rangeIndex[0] <= startIndex && rangeIndex[2] >= startIndex) || (rangeIndex[2] >= endIndex)) {
                            newIndex = [rangeIndex[0], rangeIndex[1], rangeIndex[2] - count, rangeIndex[3]];
                            isChanged = true;
                        }
                    }
                    else if (args.modelType === 'Column') {
                        if ((rangeIndex[1] >= endIndex) || (rangeIndex[1] >= startIndex && rangeIndex[3] >= endIndex)) {
                            newIndex = [rangeIndex[0], rangeIndex[1] - count, rangeIndex[2], rangeIndex[3] - count];
                            isChanged = true;
                        }
                        else if ((rangeIndex[1] <= startIndex && rangeIndex[3] >= startIndex) || (rangeIndex[3] >= endIndex)) {
                            newIndex = [rangeIndex[0], rangeIndex[1], rangeIndex[2], rangeIndex[3] - count];
                            isChanged = true;
                        }
                    }
                }
                if (isChanged) {
                    newRange = getRangeAddress(newIndex);
                    definedName.refersTo = sheetName + '!' + newRange;
                    this.parent.removeDefinedName(definedName.name, definedName.scope);
                    var eventArgs = {
                        action: 'addDefinedName', definedName: definedName, isAdded: false
                    };
                    this.parent.notify(workbookFormulaOperation, eventArgs);
                }
            }
            modelDefinedNames = definedNames;
        }
    };
    return WorkbookFormula;
}());
export { WorkbookFormula };
