import { Browser, EventHandler } from '@syncfusion/ej2-base';
import { addClass, removeClass } from '@syncfusion/ej2-base';
import { formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getScrollBarWidth, getUpdateUsingRaf } from '../base/util';
import { scroll, contentReady, uiUpdate, onEmpty, headerRefreshed, textWrapRefresh, virtualScrollEdit, infiniteScrollHandler, closeFilterDialog } from '../base/constant';
import { lazyLoadScrollHandler, checkScrollReset } from '../base/constant';
import { ColumnWidthService } from '../services/width-controller';
/**
 * The `Scroll` module is used to handle scrolling behaviour.
 */
var Scroll = /** @class */ (function () {
    /**
     * Constructor for the Grid scrolling.
     * @hidden
     */
    function Scroll(parent) {
        this.lastScrollTop = 0;
        //To maintain scroll state on grid actions.
        this.previousValues = { top: 0, left: 0 };
        this.oneTimeReady = true;
        this.parent = parent;
        this.widthService = new ColumnWidthService(parent);
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Scroll.prototype.getModuleName = function () {
        return 'scroll';
    };
    /**
     * @hidden
     */
    Scroll.prototype.setWidth = function (uiupdate) {
        this.parent.element.style.width = formatUnit(this.parent.width);
        if (uiupdate) {
            this.widthService.setWidthToColumns();
        }
        if (this.parent.toolbarModule && this.parent.toolbarModule.toolbar &&
            this.parent.toolbarModule.toolbar.element) {
            this.parent.toolbarModule.toolbar.refreshOverflow();
        }
    };
    /**
     * @hidden
     */
    Scroll.prototype.setHeight = function () {
        var mHdrHeight = 0;
        var content = this.parent.getContent().querySelector('.e-content');
        if (!this.parent.enableVirtualization && this.parent.frozenRows && this.parent.height !== 'auto') {
            var tbody = this.parent.getHeaderContent().querySelector('tbody');
            mHdrHeight = tbody ? tbody.offsetHeight : 0;
            if (tbody && mHdrHeight) {
                var add = tbody.querySelectorAll('.e-addedrow').length;
                var height = add * this.parent.getRowHeight();
                mHdrHeight -= height;
            }
            content.style.height = formatUnit(this.parent.height - mHdrHeight);
        }
        else {
            content.style.height = formatUnit(this.parent.height);
        }
        if (this.parent.isFrozenGrid() && this.parent.height !== 'auto') {
            var offset = this.parent.contentModule.getPanel().firstChild.offsetHeight;
            content.style.height = formatUnit(offset - Scroll.getScrollBarWidth());
        }
        this.ensureOverflow(content);
    };
    /**
     * @hidden
     */
    Scroll.prototype.setPadding = function () {
        var content = this.parent.getHeaderContent();
        var scrollWidth = Scroll.getScrollBarWidth() - this.getThreshold();
        var cssProps = this.getCssProperties();
        var padding = this.parent.getFrozenMode() === 'Right' || this.parent.getFrozenMode() === 'Left-Right' ? '0.5px' : '1px';
        content.querySelector('.e-headercontent').style[cssProps.border] = scrollWidth > 0 ? padding : '0px';
        content.style[cssProps.padding] = scrollWidth > 0 ? scrollWidth + 'px' : '0px';
    };
    /**
     * @hidden
     */
    Scroll.prototype.removePadding = function (rtl) {
        var cssProps = this.getCssProperties(rtl);
        var hDiv = this.parent.getHeaderContent().querySelector('.e-headercontent');
        hDiv.style[cssProps.border] = '';
        hDiv.parentElement.style[cssProps.padding] = '';
        var footerDiv = this.parent.getFooterContent();
        if (footerDiv && footerDiv.classList.contains('e-footerpadding')) {
            footerDiv.classList.remove('e-footerpadding');
        }
    };
    /**
     * Refresh makes the Grid adoptable with the height of parent container.
     *
     * > The [`height`](grid/#height/) must be set to 100%.
     * @return
     */
    Scroll.prototype.refresh = function () {
        if (this.parent.height !== '100%') {
            return;
        }
        var content = this.parent.getContent();
        this.parent.element.style.height = '100%';
        var height = this.widthService.getSiblingsHeight(content);
        content.style.height = 'calc(100% - ' + height + 'px)'; //Set the height to the '.e-gridcontent';
    };
    Scroll.prototype.getThreshold = function () {
        /* Some browsers places the scroller outside the content,
         * hence the padding should be adjusted.*/
        var appName = Browser.info.name;
        if (appName === 'mozilla') {
            return 0.5;
        }
        return 1;
    };
    /**
     * @hidden
     */
    Scroll.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(onEmpty, this.wireEvents, this);
        this.parent.on(contentReady, this.wireEvents, this);
        this.parent.on(uiUpdate, this.onPropertyChanged, this);
        this.parent.on(textWrapRefresh, this.wireEvents, this);
        this.parent.on(headerRefreshed, this.setScrollLeft, this);
    };
    /**
     * @hidden
     */
    Scroll.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(onEmpty, this.wireEvents);
        this.parent.off(contentReady, this.wireEvents);
        this.parent.off(uiUpdate, this.onPropertyChanged);
        this.parent.off(textWrapRefresh, this.wireEvents);
        this.parent.off(headerRefreshed, this.setScrollLeft);
    };
    Scroll.prototype.setScrollLeft = function () {
        if (this.parent.isFrozenGrid()) {
            this.parent.headerModule.getMovableHeader().scrollLeft = this.previousValues.left;
        }
        else {
            this.parent.getHeaderContent().querySelector('.e-headercontent').scrollLeft = this.previousValues.left;
        }
    };
    Scroll.prototype.onFrozenContentScroll = function (e) {
        if (!isNullOrUndefined(this.parent.infiniteScrollModule) && this.parent.enableInfiniteScrolling) {
            this.parent.notify(infiniteScrollHandler, e);
        }
    };
    Scroll.prototype.onContentScroll = function (scrollTarget) {
        var _this = this;
        var element = scrollTarget;
        var isHeader = element.classList.contains('e-headercontent');
        return function (e) {
            if (_this.content.querySelector('tbody') === null || _this.parent.isPreventScrollEvent) {
                return;
            }
            if (!isNullOrUndefined(_this.parent.infiniteScrollModule) && _this.parent.enableInfiniteScrolling) {
                _this.parent.notify(infiniteScrollHandler, e);
            }
            if (_this.parent.groupSettings.columns.length && _this.parent.groupSettings.enableLazyLoading) {
                var isDown = _this.previousValues.top < _this.parent.getContent().firstElementChild.scrollTop;
                _this.parent.notify(lazyLoadScrollHandler, { scrollDown: isDown });
            }
            _this.parent.notify(virtualScrollEdit, {});
            var target = e.target;
            var left = target.scrollLeft;
            var sLimit = target.scrollWidth;
            var isFooter = target.classList.contains('e-summarycontent');
            if (_this.previousValues.left === left) {
                _this.previousValues.top = !isHeader ? _this.previousValues.top : target.scrollTop;
                return;
            }
            _this.parent.notify(closeFilterDialog, e);
            element.scrollLeft = left;
            if (isFooter) {
                _this.header.scrollLeft = left;
            }
            _this.previousValues.left = left;
            _this.parent.notify(scroll, { left: left });
        };
    };
    Scroll.prototype.onCustomScrollbarScroll = function (mCont, mHdr) {
        var _this = this;
        var content = mCont;
        var header = mHdr;
        return function (e) {
            if (_this.content.querySelector('tbody') === null) {
                return;
            }
            var target = e.target;
            var left = target.scrollLeft;
            if (_this.previousValues.left === left) {
                return;
            }
            content.scrollLeft = left;
            header.scrollLeft = left;
            _this.previousValues.left = left;
            _this.parent.notify(scroll, { left: left });
            if (_this.parent.isDestroyed) {
                return;
            }
        };
    };
    Scroll.prototype.onTouchScroll = function (scrollTarget) {
        var _this = this;
        var element = scrollTarget;
        return function (e) {
            if (e.pointerType === 'mouse') {
                return;
            }
            var isFrozen = _this.parent.isFrozenGrid();
            var pageXY = _this.getPointXY(e);
            var left = element.scrollLeft + (_this.pageXY.x - pageXY.x);
            var mHdr = isFrozen ?
                _this.parent.getHeaderContent().querySelector('.e-movableheader') :
                _this.parent.getHeaderContent().querySelector('.e-headercontent');
            var mCont = isFrozen ?
                _this.parent.getContent().querySelector('.e-movablecontent') :
                _this.parent.getContent().querySelector('.e-content');
            if (_this.previousValues.left === left || (left < 0 || (mHdr.scrollWidth - mHdr.clientWidth) < left)) {
                return;
            }
            e.preventDefault();
            mHdr.scrollLeft = left;
            mCont.scrollLeft = left;
            if (isFrozen) {
                var scrollBar = _this.parent.getContent().querySelector('.e-movablescrollbar');
                scrollBar.scrollLeft = left;
            }
            _this.pageXY.x = pageXY.x;
            _this.previousValues.left = left;
        };
    };
    Scroll.prototype.setPageXY = function () {
        var _this = this;
        return function (e) {
            if (e.pointerType === 'mouse') {
                return;
            }
            _this.pageXY = _this.getPointXY(e);
        };
    };
    Scroll.prototype.getPointXY = function (e) {
        var pageXY = { x: 0, y: 0 };
        if (e.touches && e.touches.length) {
            pageXY.x = e.touches[0].pageX;
            pageXY.y = e.touches[0].pageY;
        }
        else {
            pageXY.x = e.pageX;
            pageXY.y = e.pageY;
        }
        return pageXY;
    };
    Scroll.prototype.wireEvents = function () {
        var _this = this;
        if (this.oneTimeReady) {
            var frzCols = this.parent.isFrozenGrid();
            this.content = this.parent.getContent().querySelector('.e-content');
            this.header = this.parent.getHeaderContent().querySelector('.e-headercontent');
            var mCont = this.content.querySelector('.e-movablecontent');
            var fCont = this.content.querySelector('.e-frozencontent');
            var mHdr = this.header.querySelector('.e-movableheader');
            var mScrollBar = this.parent.getContent().querySelector('.e-movablescrollbar');
            if (this.parent.frozenRows) {
                EventHandler.add(frzCols ? mHdr : this.header, 'touchstart pointerdown', this.setPageXY(), this);
                EventHandler.add(frzCols ? mHdr : this.header, 'touchmove pointermove', this.onTouchScroll(frzCols ? mCont : this.content), this);
            }
            if (this.parent.isFrozenGrid()) {
                EventHandler.add(mScrollBar, 'scroll', this.onCustomScrollbarScroll(mCont, mHdr), this);
                EventHandler.add(mCont, 'scroll', this.onCustomScrollbarScroll(mScrollBar, mHdr), this);
                EventHandler.add(mHdr, 'scroll', this.onCustomScrollbarScroll(mScrollBar, mCont), this);
                EventHandler.add(this.content, 'scroll', this.onFrozenContentScroll, this);
                EventHandler.add(mHdr, 'touchstart pointerdown', this.setPageXY(), this);
                EventHandler.add(mHdr, 'touchmove pointermove', this.onTouchScroll(mCont), this);
                EventHandler.add(mCont, 'touchstart pointerdown', this.setPageXY(), this);
                EventHandler.add(mCont, 'touchmove pointermove', this.onTouchScroll(mHdr), this);
            }
            else {
                EventHandler.add(this.content, 'scroll', this.onContentScroll(this.header), this);
                EventHandler.add(this.header, 'scroll', this.onContentScroll(this.content), this);
            }
            if (this.parent.aggregates.length) {
                EventHandler.add(this.parent.getFooterContent().firstChild, 'scroll', this.onContentScroll(this.content), this);
            }
            this.refresh();
            this.oneTimeReady = false;
        }
        var table = this.parent.getContentTable();
        var sLeft;
        var sHeight;
        var clientHeight;
        getUpdateUsingRaf(function () {
            sLeft = _this.header.scrollLeft;
            sHeight = table.scrollHeight;
            clientHeight = _this.parent.getContent().clientHeight;
        }, function () {
            var args = { cancel: false };
            _this.parent.notify(checkScrollReset, args);
            if (!_this.parent.enableVirtualization && !_this.parent.enableInfiniteScrolling) {
                if (sHeight < clientHeight) {
                    addClass(table.querySelectorAll('tr:last-child td'), 'e-lastrowcell');
                    if (_this.parent.isFrozenGrid()) {
                        addClass(_this.parent.getContent().querySelector('.e-movablecontent').querySelectorAll('tr:last-child td'), 'e-lastrowcell');
                    }
                }
                if (!args.cancel) {
                    if ((_this.parent.frozenRows > 0 || _this.parent.isFrozenGrid()) && _this.header.querySelector('.e-movableheader')) {
                        _this.header.querySelector('.e-movableheader').scrollLeft = _this.previousValues.left;
                    }
                    else {
                        _this.header.scrollLeft = _this.previousValues.left;
                    }
                    _this.content.scrollLeft = _this.previousValues.left;
                    _this.content.scrollTop = _this.previousValues.top;
                }
            }
            if (!_this.parent.enableColumnVirtualization) {
                _this.content.scrollLeft = sLeft;
            }
            if (_this.parent.isFrozenGrid() && _this.header.querySelector('.e-movableheader')) {
                _this.header.querySelector('.e-movableheader').scrollLeft =
                    _this.content.querySelector('.e-movablecontent').scrollLeft;
            }
        });
        this.parent.isPreventScrollEvent = false;
    };
    /**
     * @hidden
     */
    Scroll.prototype.getCssProperties = function (rtl) {
        var css = {};
        var enableRtl = isNullOrUndefined(rtl) ? this.parent.enableRtl : rtl;
        css.border = enableRtl ? 'borderLeftWidth' : 'borderRightWidth';
        css.padding = enableRtl ? 'paddingLeft' : 'paddingRight';
        return css;
    };
    Scroll.prototype.ensureOverflow = function (content) {
        content.style.overflowY = this.parent.height === 'auto' ? 'auto' : 'scroll';
    };
    Scroll.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName()) {
            return;
        }
        this.setPadding();
        this.oneTimeReady = true;
        if (this.parent.height === 'auto') {
            this.removePadding();
        }
        this.wireEvents();
        this.setHeight();
        var width = 'width';
        this.setWidth(!isNullOrUndefined(e.properties[width]));
    };
    /**
     * @hidden
     */
    Scroll.prototype.destroy = function () {
        var gridElement = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.e-gridheader') && !gridElement.querySelector('.e-gridcontent'))) {
            return;
        }
        this.removeEventListener();
        //Remove padding
        this.removePadding();
        var cont = this.parent.getContent().querySelector('.e-content');
        removeClass([this.parent.getHeaderContent().querySelector('.e-headercontent')], 'e-headercontent');
        removeClass([cont], 'e-content');
        //Remove height
        cont.style.height = '';
        //Remove width
        this.parent.element.style.width = '';
        //Remove Dom event
        EventHandler.remove(cont, 'scroll', this.onContentScroll);
    };
    /**
     * Function to get the scrollbar width of the browser.
     * @return {number}
     * @hidden
     */
    Scroll.getScrollBarWidth = function () {
        return getScrollBarWidth();
    };
    return Scroll;
}());
export { Scroll };
