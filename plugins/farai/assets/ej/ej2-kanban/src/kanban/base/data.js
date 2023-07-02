import { extend } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import * as events from './constant';
/**
 * Kanban data module
 * @hidden
 */
var Data = /** @class */ (function () {
    /**
     * Constructor for data module
     * @private
     */
    function Data(parent) {
        this.parent = parent;
        this.keyField = this.parent.cardSettings.headerField;
        this.initDataManager(parent.dataSource, parent.query);
        this.refreshDataManager();
    }
    /**
     * The function used to initialize dataManager and query
     * @return {void}
     * @private
     */
    Data.prototype.initDataManager = function (dataSource, query) {
        this.dataManager = dataSource instanceof DataManager ? dataSource : new DataManager(dataSource);
        this.query = query instanceof Query ? query : new Query();
        this.kanbanData = new DataManager(this.parent.kanbanData);
    };
    /**
     * The function used to generate updated Query from schedule model
     * @return {void}
     * @private
     */
    Data.prototype.getQuery = function () {
        return this.query.clone();
    };
    /**
     * The function used to get dataSource by executing given Query
     * @param  {Query} query - A Query that specifies to generate dataSource
     * @return {void}
     * @private
     */
    Data.prototype.getData = function (query) {
        return this.dataManager.executeQuery(query);
    };
    /**
     * The function used to get the table name from the given Query
     * @return {string}
     * @private
     */
    Data.prototype.getTable = function () {
        if (this.parent.query) {
            var query = this.getQuery();
            return query.fromTable;
        }
        else {
            return null;
        }
    };
    /**
     * The function is used to send the request and get response from datamanager
     * @return {void}
     * @private
     */
    Data.prototype.refreshDataManager = function () {
        var _this = this;
        var dataManager = this.getData(this.getQuery());
        dataManager.then(function (e) { return _this.dataManagerSuccess(e); }).catch(function (e) { return _this.dataManagerFailure(e); });
    };
    /**
     * The function is used to handle the success response from dataManager
     * @return {void}
     * @private
     */
    Data.prototype.dataManagerSuccess = function (e) {
        var _this = this;
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.trigger(events.dataBinding, e, function (args) {
            var resultData = extend([], args.result, null, true);
            _this.kanbanData.saveChanges({ addedRecords: resultData, changedRecords: [], deletedRecords: [] });
            _this.parent.kanbanData = resultData;
            _this.parent.notify(events.dataReady, { processedData: resultData });
            _this.parent.trigger(events.dataBound, null, function () { return _this.parent.hideSpinner(); });
        });
    };
    /**
     * The function is used to handle the failure response from dataManager
     * @return {void}
     * @private
     */
    Data.prototype.dataManagerFailure = function (e) {
        var _this = this;
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.trigger(events.actionFailure, { error: e }, function () { return _this.parent.hideSpinner(); });
    };
    /**
     * The function is used to perform the insert, update, delete and batch actions in datamanager
     * @return {void}
     * @private
     */
    Data.prototype.updateDataManager = function (updateType, params, type, data, index) {
        var _this = this;
        this.parent.showSpinner();
        var promise;
        var actionArgs = {
            requestType: type, cancel: false, addedRecords: params.addedRecords,
            changedRecords: params.changedRecords, deletedRecords: params.deletedRecords
        };
        this.parent.trigger(events.actionComplete, actionArgs, function (offlineArgs) {
            if (!offlineArgs.cancel) {
                switch (updateType) {
                    case 'insert':
                        promise = _this.dataManager.insert(data, _this.getTable(), _this.getQuery());
                        break;
                    case 'update':
                        promise = _this.dataManager.update(_this.keyField, data, _this.getTable(), _this.getQuery());
                        break;
                    case 'delete':
                        promise = _this.dataManager.remove(_this.keyField, data, _this.getTable(), _this.getQuery());
                        break;
                    case 'batch':
                        promise = _this.dataManager.saveChanges(params, _this.keyField, _this.getTable(), _this.getQuery());
                        break;
                }
                if (_this.dataManager.dataSource.offline) {
                    _this.kanbanData = _this.dataManager;
                    _this.parent.kanbanData = _this.dataManager.dataSource.json;
                    _this.refreshUI(offlineArgs, index);
                }
                else {
                    promise.then(function (e) {
                        if (_this.parent.isDestroyed) {
                            return;
                        }
                        _this.refreshUI(offlineArgs, index);
                    }).catch(function (e) {
                        _this.dataManagerFailure(e);
                    });
                }
            }
        });
    };
    /**
     * The function is used to refresh the UI once the datamanager action is completed
     * @return {void}
     * @private
     */
    Data.prototype.refreshUI = function (args, index) {
        var _this = this;
        this.parent.layoutModule.columnData = this.parent.layoutModule.getColumnCards();
        if (this.parent.swimlaneSettings.keyField) {
            this.parent.layoutModule.swimlaneData = this.parent.layoutModule.getSwimlaneCards();
        }
        args.addedRecords.forEach(function (data) {
            _this.parent.layoutModule.renderCardBasedOnIndex(data);
        });
        args.changedRecords.forEach(function (data) {
            _this.parent.layoutModule.removeCard(data);
            _this.parent.layoutModule.renderCardBasedOnIndex(data, index);
            if (_this.parent.sortSettings.field && _this.parent.sortSettings.sortBy === 'Index'
                && _this.parent.sortSettings.direction === 'Descending' && index > 0) {
                --index;
            }
        });
        args.deletedRecords.forEach(function (data) {
            _this.parent.layoutModule.removeCard(data);
        });
        this.parent.layoutModule.refresh();
        this.parent.renderTemplates();
        this.parent.trigger(events.dataBound, null, function () { return _this.parent.hideSpinner(); });
    };
    return Data;
}());
export { Data };
