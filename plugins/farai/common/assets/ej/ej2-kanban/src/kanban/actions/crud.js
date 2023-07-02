import { isNullOrUndefined } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
/**
 * Kanban CRUD module
 * @hidden
 */
var Crud = /** @class */ (function () {
    /**
     * Constructor for CRUD module
     * @private
     */
    function Crud(parent) {
        this.parent = parent;
    }
    Crud.prototype.addCard = function (cardData) {
        var _this = this;
        var args = {
            cancel: false, requestType: 'cardCreate', addedRecords: (cardData instanceof Array) ? cardData : [cardData],
            changedRecords: [], deletedRecords: []
        };
        this.parent.trigger(events.actionBegin, args, function (addArgs) {
            if (!addArgs.cancel) {
                var modifiedData = [];
                if (_this.parent.sortSettings.field && _this.parent.sortSettings.sortBy === 'Index') {
                    cardData instanceof Array ? modifiedData = cardData : modifiedData.push(cardData);
                    modifiedData = _this.priorityOrder(modifiedData, addArgs);
                }
                var addedRecords = (cardData instanceof Array) ? cardData : [cardData];
                var changedRecords = (_this.parent.sortSettings.field && _this.parent.sortSettings.sortBy === 'Index') ? modifiedData : [];
                var editParms = { addedRecords: addedRecords, changedRecords: changedRecords, deletedRecords: [] };
                var type = (cardData instanceof Array || modifiedData.length > 0) ? 'batch' : 'insert';
                _this.parent.dataModule.updateDataManager(type, editParms, 'cardCreated', cardData);
            }
        });
    };
    Crud.prototype.updateCard = function (cardData, index) {
        var _this = this;
        var args = {
            requestType: 'cardChange', cancel: false, addedRecords: [],
            changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
        };
        this.parent.trigger(events.actionBegin, args, function (updateArgs) {
            if (!updateArgs.cancel) {
                if (_this.parent.sortSettings.field && _this.parent.sortSettings.sortBy === 'Index') {
                    var modifiedData = [];
                    cardData instanceof Array ? modifiedData = cardData : modifiedData.push(cardData);
                    cardData = _this.priorityOrder(modifiedData, updateArgs, index);
                }
                var editParms = {
                    addedRecords: [], changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
                };
                var type = (cardData instanceof Array) ? 'batch' : 'update';
                _this.parent.dataModule.updateDataManager(type, editParms, 'cardChanged', cardData, index);
            }
        });
    };
    Crud.prototype.deleteCard = function (cardData) {
        var _this = this;
        var editParms = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        if (typeof cardData === 'string' || typeof cardData === 'number') {
            editParms.deletedRecords = this.parent.kanbanData.filter(function (data) {
                return data[_this.parent.cardSettings.headerField] === cardData;
            });
        }
        else {
            editParms.deletedRecords = (cardData instanceof Array) ? cardData : [cardData];
        }
        var args = {
            requestType: 'cardRemove', cancel: false, addedRecords: [], changedRecords: [], deletedRecords: editParms.deletedRecords
        };
        this.parent.trigger(events.actionBegin, args, function (deleteArgs) {
            if (!deleteArgs.cancel) {
                var type = (editParms.deletedRecords.length > 1) ? 'batch' : 'delete';
                var cardData_1 = editParms.deletedRecords;
                _this.parent.dataModule.updateDataManager(type, editParms, 'cardRemoved', cardData_1[0]);
            }
        });
    };
    Crud.prototype.priorityOrder = function (cardData, args, index) {
        var _this = this;
        var cardsId = cardData.map(function (obj) { return obj[_this.parent.cardSettings.headerField]; });
        var num = cardData[cardData.length - 1][this.parent.sortSettings.field];
        var allModifiedKeys = cardData.map(function (obj) { return obj[_this.parent.keyField]; });
        var modifiedKey = allModifiedKeys.filter(function (key, index) { return allModifiedKeys.indexOf(key) === index; }).sort();
        var columnAllDatas;
        var finalData = [];
        var _loop_1 = function (columnKey) {
            var keyData = cardData.filter(function (cardObj) {
                return cardObj[_this.parent.keyField] === columnKey;
            });
            columnAllDatas = this_1.parent.layoutModule.getColumnData(columnKey);
            for (var _i = 0, _a = keyData; _i < _a.length; _i++) {
                var data = _a[_i];
                if (this_1.parent.swimlaneSettings.keyField) {
                    var swimlaneDatas = this_1.parent.getSwimlaneData(data[this_1.parent.swimlaneSettings.keyField]);
                    columnAllDatas = this_1.parent.getColumnData(columnKey, swimlaneDatas);
                }
            }
            keyData.forEach(function (key) { return finalData.push(key); });
            if (!isNullOrUndefined(index)) {
                if (this_1.parent.sortSettings.direction === 'Ascending') {
                    for (var i = index; i < columnAllDatas.length; i++) {
                        if (cardsId.indexOf(columnAllDatas[i][this_1.parent.cardSettings.headerField]) === -1) {
                            columnAllDatas[i][this_1.parent.sortSettings.field] = ++num;
                            finalData.push(columnAllDatas[i]);
                        }
                    }
                }
                else {
                    for (var i = index - 1; i >= 0; i--) {
                        if (cardsId.indexOf(columnAllDatas[i][this_1.parent.cardSettings.headerField]) === -1) {
                            columnAllDatas[i][this_1.parent.sortSettings.field] = ++num;
                            finalData.push(columnAllDatas[i]);
                        }
                    }
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, modifiedKey_1 = modifiedKey; _i < modifiedKey_1.length; _i++) {
            var columnKey = modifiedKey_1[_i];
            _loop_1(columnKey);
        }
        return finalData;
    };
    return Crud;
}());
export { Crud };
