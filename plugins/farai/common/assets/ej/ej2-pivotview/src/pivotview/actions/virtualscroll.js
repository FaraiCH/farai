import { EventHandler, setStyleAttribute, isBlazor, } from '@syncfusion/ej2-base';
import { contentReady } from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
/**
 * `VirtualScroll` module is used to handle scrolling behavior.
 */
var VirtualScroll = /** @class */ (function () {
    /**
     * Constructor for PivotView scrolling.
     * @hidden
     */
    function VirtualScroll(parent) {
        this.previousValues = { top: 0, left: 0 };
        this.frozenPreviousValues = { top: 0, left: 0 };
        this.eventType = '';
        this.parent = parent;
        this.engineModule = this.parent.dataType === 'pivot' ? this.parent.engineModule : this.parent.olapEngineModule;
        this.addInternalEvents();
    }
    /**
     * It returns the Module name.
     * @returns string
     * @hidden
     */
    VirtualScroll.prototype.getModuleName = function () {
        return 'virtualscroll';
    };
    VirtualScroll.prototype.addInternalEvents = function () {
        this.parent.on(contentReady, this.wireEvents, this);
    };
    VirtualScroll.prototype.wireEvents = function () {
        if (this.parent.displayOption.view !== 'Chart') {
            var mCont = this.parent.element.querySelector('.' + cls.MOVABLECONTENT_DIV);
            var fCont = this.parent.element.querySelector('.' + cls.FROZENCONTENT_DIV);
            var mHdr = this.parent.element.querySelector('.' + cls.MOVABLEHEADER_DIV);
            EventHandler.clearEvents(mCont);
            EventHandler.clearEvents(fCont);
            if (this.engineModule) {
                EventHandler.add(mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV), 'scroll touchmove pointermove', this.onHorizondalScroll(mHdr, mCont, fCont), this);
                EventHandler.add(mCont.parentElement, 'scroll wheel touchmove pointermove keyup keydown', this.onVerticalScroll(fCont, mCont), this);
                EventHandler.add(mCont.parentElement.parentElement, 'mouseup touchend', this.common(mHdr, mCont, fCont), this);
                // EventHandler.add(fCont.parentElement, 'wheel', this.onWheelScroll(mCont, fCont), this);
                // EventHandler.add(fCont.parentElement, 'touchstart pointerdown', this.setPageXY(), this);
                // EventHandler.add(fCont.parentElement, 'touchmove pointermove', this.onTouchScroll(mHdr, mCont, fCont), this);
                EventHandler.add(mHdr, 'touchstart pointerdown', this.setPageXY(), this);
                EventHandler.add(mHdr, 'touchmove pointermove', this.onTouchScroll(mHdr, mCont, fCont), this);
            }
            this.parent.grid.on('check-scroll-reset', function (args) {
                args.cancel = true;
            });
            this.parent.grid.on('prevent-frozen-scroll-refresh', function (args) {
                args.cancel = true;
            });
            this.parent.grid.isPreventScrollEvent = true;
        }
    };
    VirtualScroll.prototype.onWheelScroll = function (mCont, fCont) {
        var _this = this;
        var element = mCont;
        return function (e) {
            var top = element.parentElement.scrollTop + (e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY);
            if (_this.frozenPreviousValues.top === top) {
                return;
            }
            e.preventDefault();
            _this.frozenPreviousValues.top = top;
            _this.eventType = e.type;
        };
    };
    VirtualScroll.prototype.getPointXY = function (e) {
        var pageXY = { x: 0, y: 0 };
        if (!(e.touches && e.touches.length)) {
            pageXY.x = e.pageX;
            pageXY.y = e.pageY;
        }
        else {
            pageXY.x = e.touches[0].pageX;
            pageXY.y = e.touches[0].pageY;
        }
        return pageXY;
    };
    VirtualScroll.prototype.onTouchScroll = function (mHdr, mCont, fCont) {
        var _this = this;
        var element = mCont;
        return function (e) {
            if (e.pointerType === 'mouse') {
                return;
            }
            var pageXY = _this.getPointXY(e);
            var top = element.parentElement.scrollTop + (_this.pageXY.y - pageXY.y);
            var left = element.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV).scrollLeft + (_this.pageXY.x - pageXY.x);
            if (_this.parent.element.querySelector('.' + cls.HEADERCONTENT).contains(e.target)) {
                if (_this.frozenPreviousValues.left === left || left < 0) {
                    return;
                }
                mHdr.scrollLeft = left;
                _this.pageXY.x = pageXY.x;
                _this.frozenPreviousValues.left = left;
            }
            else {
                if (_this.frozenPreviousValues.top === top || top < 0) {
                    return;
                }
                _this.pageXY.y = pageXY.y;
                _this.frozenPreviousValues.top = top;
            }
            _this.eventType = e.type;
        };
    };
    VirtualScroll.prototype.update = function (mHdr, mCont, top, left, e) {
        var _this = this;
        this.parent.isScrolling = true;
        var engine = this.parent.dataType === 'pivot' ? this.parent.engineModule : this.parent.olapEngineModule;
        if (isBlazor() || this.parent.dataSourceSettings.mode === 'Server') {
            engine.pageSettings = this.parent.pageSettings;
        }
        if (this.parent.pageSettings && engine.pageSettings) {
            if (this.direction === 'vertical') {
                var rowValues_1 = this.parent.dataType === 'pivot' ?
                    (this.parent.dataSourceSettings.valueAxis === 'row' ? this.parent.dataSourceSettings.values.length : 1) : 1;
                var exactSize_1 = (this.parent.pageSettings.rowSize * rowValues_1 * this.parent.gridSettings.rowHeight);
                var section = Math.ceil(top / exactSize_1);
                if ((this.parent.scrollPosObject.vertical === section ||
                    engine.pageSettings.rowSize >= engine.rowCount)) {
                    // this.parent.hideWaitingPopup();
                    return;
                }
                this.parent.showWaitingPopup();
                this.parent.scrollPosObject.vertical = section;
                engine.pageSettings.rowCurrentPage = section > 1 ? section : 1;
                var rowStartPos_1 = 0;
                if (this.parent.dataType === 'pivot') {
                    if (isBlazor()) {
                        var pivot_1 = this.parent;
                        var sfBlazor = 'sfBlazor';
                        /* tslint:disable-next-line */
                        var dataSourceSettings = window[sfBlazor].
                            copyWithoutCircularReferences([pivot_1.dataSourceSettings], pivot_1.dataSourceSettings);
                        /* tslint:disable-next-line */
                        var pageSettings = window[sfBlazor].
                            copyWithoutCircularReferences([engine.pageSettings], engine.pageSettings);
                        /* tslint:disable-next-line */
                        pivot_1.interopAdaptor.invokeMethodAsync('PivotInteropMethod', 'generateGridData', {
                            'dataSourceSettings': dataSourceSettings,
                            'pageSettings': pageSettings, 'isScrolling': true
                        }).then(
                        /* tslint:disable-next-line */
                        function (data) {
                            pivot_1.updateBlazorData(data, pivot_1);
                            pivot_1.pivotValues = engine.pivotValues;
                            rowStartPos_1 = _this.parent.engineModule.rowStartPos;
                            var exactPage = Math.ceil(rowStartPos_1 / (pivot_1.pageSettings.rowSize * rowValues_1));
                            var pos = exactSize_1 * exactPage -
                                (engine.rowFirstLvl * rowValues_1 * pivot_1.gridSettings.rowHeight);
                            pivot_1.scrollPosObject.verticalSection = pos;
                        });
                    }
                    else if (this.parent.dataSourceSettings.mode === 'Server') {
                        this.parent.getEngine('onScroll', null, null, null, null, null, null);
                    }
                    else {
                        this.parent.engineModule.generateGridData(this.parent.dataSourceSettings, this.parent.engineModule.headerCollection);
                        rowStartPos_1 = this.parent.engineModule.rowStartPos;
                    }
                }
                else {
                    this.parent.olapEngineModule.scrollPage('scroll');
                    rowStartPos_1 = this.parent.olapEngineModule.pageRowStartPos;
                }
                if (!(isBlazor() && this.parent.dataType === 'pivot')) {
                    this.parent.pivotValues = engine.pivotValues;
                    var exactPage = Math.ceil(rowStartPos_1 / (this.parent.pageSettings.rowSize * rowValues_1));
                    var pos = exactSize_1 * exactPage -
                        (engine.rowFirstLvl * rowValues_1 * this.parent.gridSettings.rowHeight);
                    this.parent.scrollPosObject.verticalSection = pos;
                }
            }
            else {
                var colValues_1 = this.parent.dataType === 'pivot' ?
                    (this.parent.dataSourceSettings.valueAxis === 'column' ? this.parent.dataSourceSettings.values.length : 1) : 1;
                var exactSize_2 = (this.parent.pageSettings.columnSize *
                    colValues_1 * this.parent.gridSettings.columnWidth);
                var section = Math.ceil(left / exactSize_2);
                if (this.parent.scrollPosObject.horizontal === section) {
                    // this.parent.hideWaitingPopup();
                    return;
                }
                this.parent.showWaitingPopup();
                var pivot = this.parent;
                pivot.scrollPosObject.horizontal = section;
                engine.pageSettings.columnCurrentPage = section > 1 ? section : 1;
                var colStartPos_1 = 0;
                if (pivot.dataType === 'pivot') {
                    if (isBlazor()) {
                        var sfBlazor = 'sfBlazor';
                        var pivot_2 = this.parent;
                        /* tslint:disable-next-line */
                        var pageSettings = window[sfBlazor].
                            copyWithoutCircularReferences([engine.pageSettings], engine.pageSettings);
                        /* tslint:disable-next-line */
                        var dataSourceSettings = window[sfBlazor].
                            copyWithoutCircularReferences([pivot_2.dataSourceSettings], pivot_2.dataSourceSettings);
                        /* tslint:disable-next-line */
                        pivot_2.interopAdaptor.invokeMethodAsync('PivotInteropMethod', 'generateGridData', {
                            'dataSourceSettings': dataSourceSettings,
                            'pageSettings': pageSettings, 'isScrolling': true
                        }).then(
                        /* tslint:disable-next-line */
                        function (data) {
                            pivot_2.updateBlazorData(data, pivot_2);
                            colStartPos_1 = pivot_2.engineModule.colStartPos;
                            pivot_2.pivotValues = engine.pivotValues;
                            var exactPage = Math.ceil(colStartPos_1 / (pivot_2.pageSettings.columnSize * colValues_1));
                            var pos = exactSize_2 * exactPage - (engine.colFirstLvl *
                                colValues_1 * pivot_2.gridSettings.columnWidth);
                            pivot_2.scrollPosObject.horizontalSection = pos;
                        });
                    }
                    else if (this.parent.dataSourceSettings.mode === 'Server') {
                        this.parent.getEngine('onScroll', null, null, null, null, null, null);
                    }
                    else {
                        pivot.engineModule.generateGridData(pivot.dataSourceSettings, pivot.engineModule.headerCollection);
                        colStartPos_1 = pivot.engineModule.colStartPos;
                    }
                }
                else {
                    pivot.olapEngineModule.scrollPage('scroll');
                    colStartPos_1 = pivot.olapEngineModule.pageColStartPos;
                }
                if (!(isBlazor() && pivot.dataType === 'pivot')) {
                    pivot.pivotValues = engine.pivotValues;
                    var exactPage = Math.ceil(colStartPos_1 / (pivot.pageSettings.columnSize * colValues_1));
                    var pos = exactSize_2 * exactPage - (engine.colFirstLvl *
                        colValues_1 * pivot.gridSettings.columnWidth);
                    pivot.scrollPosObject.horizontalSection = pos;
                }
            }
        }
    };
    VirtualScroll.prototype.setPageXY = function () {
        var _this = this;
        return function (e) {
            if (e.pointerType === 'mouse') {
                return;
            }
            _this.pageXY = _this.getPointXY(e);
        };
    };
    VirtualScroll.prototype.common = function (mHdr, mCont, fCont) {
        var _this = this;
        return function (e) {
            _this.update(mHdr, mCont, mCont.parentElement.scrollTop * _this.parent.verticalScrollScale, mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV).scrollLeft * _this.parent.horizontalScrollScale, e);
        };
    };
    VirtualScroll.prototype.onHorizondalScroll = function (mHdr, mCont, fCont) {
        var _this = this;
        /* tslint:disable-next-line */
        var timeOutObj;
        return function (e) {
            var left = mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV).scrollLeft * _this.parent.horizontalScrollScale;
            if (e.type === 'wheel' || e.type === 'touchmove' || _this.eventType === 'wheel' || _this.eventType === 'touchmove') {
                clearTimeout(timeOutObj);
                /* tslint:disable */
                timeOutObj = setTimeout(function () {
                    left = e.type === 'touchmove' ? mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV).scrollLeft : left;
                    _this.update(mHdr, mCont, mCont.parentElement.scrollTop * _this.parent.verticalScrollScale, left, e);
                }, 300);
            }
            if (_this.previousValues.left === left) {
                return;
            }
            _this.parent.scrollDirection = _this.direction = 'horizondal';
            var horiOffset = -((left - _this.parent.scrollPosObject.horizontalSection - mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV).scrollLeft));
            var vertiOffset = mCont.querySelector('.' + cls.TABLE).style.transform.split(',').length > 1 ?
                mCont.querySelector('.' + cls.TABLE).style.transform.split(',')[1].trim() : "0px)";
            if (mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV).scrollLeft < _this.parent.scrollerBrowserLimit) {
                setStyleAttribute(mCont.querySelector('.e-table'), {
                    transform: 'translate(' + horiOffset + 'px,' + vertiOffset
                });
                setStyleAttribute(mHdr.querySelector('.e-table'), {
                    transform: 'translate(' + horiOffset + 'px,' + 0 + 'px)'
                });
            }
            var excessMove = _this.parent.scrollPosObject.horizontalSection > left ?
                -(_this.parent.scrollPosObject.horizontalSection - left) : ((left + mHdr.offsetWidth) -
                (_this.parent.scrollPosObject.horizontalSection + mCont.querySelector('.e-table').offsetWidth));
            var notLastPage = Math.ceil(_this.parent.scrollPosObject.horizontalSection / _this.parent.horizontalScrollScale) <
                _this.parent.scrollerBrowserLimit;
            if (_this.parent.scrollPosObject.horizontalSection > left ? true : (excessMove > 1 && notLastPage)) {
                //  showSpinner(this.parent.element);
                if (left > mHdr.clientWidth) {
                    if (_this.parent.scrollPosObject.left < 1) {
                        _this.parent.scrollPosObject.left = mHdr.clientWidth;
                    }
                    _this.parent.scrollPosObject.left = _this.parent.scrollPosObject.left - 50;
                    excessMove = _this.parent.scrollPosObject.horizontalSection > left ?
                        (excessMove - _this.parent.scrollPosObject.left) : (excessMove + _this.parent.scrollPosObject.left);
                }
                else {
                    excessMove = -_this.parent.scrollPosObject.horizontalSection;
                }
                horiOffset = -((left - (_this.parent.scrollPosObject.horizontalSection + excessMove) - mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV).scrollLeft));
                var vWidth = (_this.parent.gridSettings.columnWidth * _this.engineModule.columnCount);
                if (vWidth > _this.parent.scrollerBrowserLimit) {
                    _this.parent.horizontalScrollScale = vWidth / _this.parent.scrollerBrowserLimit;
                    vWidth = _this.parent.scrollerBrowserLimit;
                }
                if (horiOffset > vWidth && horiOffset > left) {
                    horiOffset = left;
                    excessMove = 0;
                }
                setStyleAttribute(mCont.querySelector('.e-table'), {
                    transform: 'translate(' + horiOffset + 'px,' + vertiOffset
                });
                setStyleAttribute(mHdr.querySelector('.e-table'), {
                    transform: 'translate(' + horiOffset + 'px,' + 0 + 'px)'
                });
                _this.parent.scrollPosObject.horizontalSection = _this.parent.scrollPosObject.horizontalSection + excessMove;
            }
            _this.previousValues.left = left;
            _this.frozenPreviousValues.left = left;
            _this.eventType = '';
            mHdr.scrollLeft = mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV).scrollLeft;
        };
    };
    VirtualScroll.prototype.onVerticalScroll = function (fCont, mCont) {
        var _this = this;
        var timeOutObj;
        return function (e) {
            var top = mCont.parentElement.scrollTop * _this.parent.verticalScrollScale;
            if (e.type === 'wheel' || e.type === 'touchmove' || _this.eventType === 'wheel' || _this.eventType === 'touchmove' || e.type === 'keyup' || e.type === 'keydown') {
                clearTimeout(timeOutObj);
                timeOutObj = setTimeout(function () {
                    _this.update(null, mCont, mCont.parentElement.scrollTop * _this.parent.verticalScrollScale, mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV).scrollLeft * _this.parent.horizontalScrollScale, e);
                }, 300);
            }
            /* tslint:enable */
            if (_this.previousValues.top === top) {
                return;
            }
            _this.parent.scrollDirection = _this.direction = 'vertical';
            var vertiOffset = -((top - _this.parent.scrollPosObject.verticalSection - mCont.parentElement.scrollTop));
            var horiOffset = mCont.querySelector('.' + cls.TABLE).style.transform.split(',')[0].trim();
            if (vertiOffset > _this.parent.virtualDiv.clientHeight) {
                vertiOffset = _this.parent.virtualDiv.clientHeight;
            }
            if (mCont.parentElement.scrollTop < _this.parent.scrollerBrowserLimit) {
                setStyleAttribute(fCont.querySelector('.e-table'), {
                    transform: 'translate(' + 0 + 'px,' + vertiOffset + 'px)'
                });
                setStyleAttribute(mCont.querySelector('.e-table'), {
                    transform: horiOffset + ',' + vertiOffset + 'px)'
                });
            }
            var excessMove = _this.parent.scrollPosObject.verticalSection > top ?
                -(_this.parent.scrollPosObject.verticalSection - top) : ((top + fCont.parentElement.clientHeight) -
                (_this.parent.scrollPosObject.verticalSection + fCont.querySelector('.e-table').offsetHeight));
            var notLastPage = Math.ceil(_this.parent.scrollPosObject.verticalSection / _this.parent.verticalScrollScale) <
                _this.parent.scrollerBrowserLimit;
            if (_this.parent.scrollPosObject.verticalSection > top ? true : (excessMove > 1 && notLastPage)) {
                //  showSpinner(this.parent.element);
                if (top > fCont.parentElement.clientHeight) {
                    if (_this.parent.scrollPosObject.top < 1) {
                        _this.parent.scrollPosObject.top = fCont.parentElement.clientHeight;
                    }
                    _this.parent.scrollPosObject.top = _this.parent.scrollPosObject.top - 50;
                    excessMove = _this.parent.scrollPosObject.verticalSection > top ?
                        (excessMove - _this.parent.scrollPosObject.top) : (excessMove + _this.parent.scrollPosObject.top);
                }
                else {
                    excessMove = -_this.parent.scrollPosObject.verticalSection;
                }
                var movableTable = _this.parent.element.querySelector('.' + cls.MOVABLECONTENT_DIV).querySelector('.e-table');
                vertiOffset = -((top - (_this.parent.scrollPosObject.verticalSection + excessMove) - mCont.parentElement.scrollTop));
                var vHeight = (_this.parent.gridSettings.rowHeight * _this.engineModule.rowCount + 0.1
                    - movableTable.clientHeight);
                if (vHeight > _this.parent.scrollerBrowserLimit) {
                    _this.parent.verticalScrollScale = vHeight / _this.parent.scrollerBrowserLimit;
                    vHeight = _this.parent.scrollerBrowserLimit;
                }
                if (vertiOffset > vHeight && vertiOffset > top) {
                    vertiOffset = top;
                    excessMove = 0;
                }
                if (vertiOffset > _this.parent.virtualDiv.clientHeight) {
                    vertiOffset = _this.parent.virtualDiv.clientHeight;
                }
                setStyleAttribute(fCont.querySelector('.e-table'), {
                    transform: 'translate(' + 0 + 'px,' + vertiOffset + 'px)'
                });
                setStyleAttribute(mCont.querySelector('.e-table'), {
                    transform: horiOffset + ',' + vertiOffset + 'px)'
                });
                _this.parent.scrollPosObject.verticalSection = _this.parent.scrollPosObject.verticalSection + excessMove;
            }
            _this.previousValues.top = top;
            _this.frozenPreviousValues.top = top;
            _this.eventType = '';
        };
    };
    /**
     * @hidden
     */
    VirtualScroll.prototype.removeInternalEvents = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(contentReady, this.wireEvents);
    };
    /**
     * To destroy the virtualscrolling event listener
     * @return {void}
     * @hidden
     */
    VirtualScroll.prototype.destroy = function () {
        this.removeInternalEvents();
    };
    return VirtualScroll;
}());
export { VirtualScroll };
