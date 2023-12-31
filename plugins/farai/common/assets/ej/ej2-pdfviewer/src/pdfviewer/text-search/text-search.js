import { createElement, Browser, isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { AjaxHandler } from '../index';
/**
 * TextSearch module
 */
var TextSearch = /** @class */ (function () {
    /**
     * @private
     */
    function TextSearch(pdfViewer, pdfViewerBase) {
        var _this = this;
        /**
         * @private
         */
        this.isTextSearch = false;
        /**
         * @private
         */
        this.searchCount = 0;
        this.searchIndex = 0;
        this.currentSearchIndex = 0;
        this.searchPageIndex = null;
        this.searchString = null;
        this.isMatchCase = false;
        this.searchRequestHandler = null;
        // tslint:disable-next-line
        this.textContents = new Array();
        // tslint:disable-next-line
        this.searchMatches = new Array();
        // tslint:disable-next-line
        this.searchCollection = new Array();
        this.searchedPages = [];
        this.isPrevSearch = false;
        // tslint:disable-next-line
        this.tempElementStorage = new Array();
        /**
         * @private
         */
        this.isMessagePopupOpened = false;
        /**
         * @private
         */
        this.isTextRetrieved = false;
        this.isTextSearched = false;
        this.isTextSearchEventTriggered = false;
        // tslint:disable-next-line
        this.checkBoxOnChange = function (event) {
            if (isBlazor()) {
                if (event.currentTarget && event.currentTarget.checked) {
                    _this.isMatchCase = true;
                }
                else {
                    _this.isMatchCase = false;
                }
            }
            else {
                if (event.checked) {
                    _this.isMatchCase = true;
                }
                else {
                    _this.isMatchCase = false;
                }
            }
            if (_this.isTextSearch) {
                _this.resetVariables();
                _this.clearAllOccurrences();
                var inputString = _this.searchInput.value;
                _this.searchIndex = 0;
                _this.textSearch(inputString);
            }
        };
        this.searchKeypressHandler = function (event) {
            _this.enableNextButton(true);
            _this.enablePrevButton(true);
            if (event.which === 13) {
                _this.initiateTextSearch(_this.searchInput);
                _this.updateSearchInputIcon(false);
            }
            else {
                _this.resetVariables();
            }
        };
        this.searchClickHandler = function (event) {
            _this.searchButtonClick(_this.searchBtn, _this.searchInput);
        };
        this.nextButtonOnClick = function (event) {
            _this.nextSearch();
        };
        this.prevButtonOnClick = function (event) {
            _this.prevSearch();
        };
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    TextSearch.prototype.createTextSearchBox = function () {
        var _this = this;
        // tslint:disable-next-line:max-line-length
        this.searchBox = createElement('div', { id: this.pdfViewer.element.id + '_search_box', className: 'e-pv-search-bar' });
        var searchElementsContainer = createElement('div', { id: this.pdfViewer.element.id + '_search_box_elements', className: 'e-pv-search-bar-elements' });
        // tslint:disable-next-line:max-line-length
        var searchInputContainer = createElement('div', { id: this.pdfViewer.element.id + '_search_input_container', className: 'e-input-group e-pv-search-input' });
        this.searchInput = createElement('input', { id: this.pdfViewer.element.id + '_search_input', className: 'e-input' });
        this.searchInput.type = 'text';
        this.searchInput.placeholder = this.pdfViewer.localeObj.getConstant('Find in document');
        // tslint:disable-next-line:max-line-length
        this.searchBtn = createElement('span', { id: this.pdfViewer.element.id + '_search_box-icon', className: 'e-input-group-icon e-input-search-group-icon e-pv-search-icon' });
        searchInputContainer.appendChild(this.searchInput);
        searchInputContainer.appendChild(this.searchBtn);
        searchElementsContainer.appendChild(searchInputContainer);
        if (this.pdfViewer.enableRtl) {
            this.prevSearchBtn = this.createSearchBoxButtons('prev_occurrence', 'e-pv-next-search');
        }
        else {
            this.prevSearchBtn = this.createSearchBoxButtons('prev_occurrence', 'e-pv-prev-search');
        }
        this.prevSearchBtn.setAttribute('aria-label', 'Previous Search text');
        searchElementsContainer.appendChild(this.prevSearchBtn);
        if (this.pdfViewer.enableRtl) {
            this.nextSearchBtn = this.createSearchBoxButtons('next_occurrence', 'e-pv-prev-search');
        }
        else {
            this.nextSearchBtn = this.createSearchBoxButtons('next_occurrence', 'e-pv-next-search');
        }
        this.nextSearchBtn.setAttribute('aria-label', 'Next Search text');
        searchElementsContainer.appendChild(this.nextSearchBtn);
        // tslint:disable-next-line:max-line-length
        var matchCaseContainer = createElement('div', { id: this.pdfViewer.element.id + '_match_case_container', className: 'e-pv-match-case-container' });
        var matchCaseInput = createElement('input', { id: this.pdfViewer.element.id + '_match_case' });
        matchCaseInput.type = 'checkbox';
        if (isBlazor()) {
            matchCaseInput.style.height = '17px';
            matchCaseInput.style.width = '17px';
            matchCaseInput.addEventListener('change', this.checkBoxOnChange.bind(this));
        }
        matchCaseContainer.appendChild(matchCaseInput);
        this.searchBox.appendChild(searchElementsContainer);
        this.searchBox.appendChild(matchCaseContainer);
        this.pdfViewerBase.mainContainer.appendChild(this.searchBox);
        if (isBlazor()) {
            // tslint:disable-next-line:max-line-length
            var matchCaseText = createElement('span', { id: this.pdfViewer.element.id + '_search_box_text', styles: 'position: absolute; padding-top: 3px; padding-left: 8px; padding-right: 8px; font-size: 13px' });
            matchCaseText.textContent = this.pdfViewer.localeObj.getConstant('Match case');
            matchCaseContainer.appendChild(matchCaseText);
        }
        else {
            // tslint:disable-next-line:max-line-length
            var checkBox = new CheckBox({ cssClass: 'e-pv-match-case', label: this.pdfViewer.localeObj.getConstant('Match case'), change: this.checkBoxOnChange.bind(this) });
            checkBox.appendTo(matchCaseInput);
        }
        this.showSearchBox(false);
        if (this.pdfViewer.enableRtl) {
            this.searchBox.classList.add('e-rtl');
            this.searchBox.style.left = '88.3px';
        }
        else {
            this.searchBox.classList.remove('e-rtl');
            this.searchBox.style.right = '88.3px';
        }
        this.searchInput.addEventListener('focus', function () {
            _this.searchInput.parentElement.classList.add('e-input-focus');
        });
        this.searchInput.addEventListener('blur', function () {
            _this.searchInput.parentElement.classList.remove('e-input-focus');
        });
        this.searchInput.addEventListener('keydown', this.searchKeypressHandler.bind(this));
        this.searchBtn.addEventListener('click', this.searchClickHandler.bind(this));
        this.nextSearchBtn.addEventListener('click', this.nextButtonOnClick.bind(this));
        this.prevSearchBtn.addEventListener('click', this.prevButtonOnClick.bind(this));
    };
    /**
     * @private
     */
    TextSearch.prototype.textSearchBoxOnResize = function () {
        if (this.pdfViewer.toolbarModule && this.pdfViewer.enableToolbar) {
            var secondaryToolbar = this.pdfViewerBase.getElement('_toolbarContainer_popup');
            if (secondaryToolbar) {
                if (secondaryToolbar.contains(this.pdfViewerBase.getElement('_search').parentElement)) {
                    this.searchBox.style.right = '0px';
                }
            }
        }
        else {
            // tslint:disable-next-line:max-line-length
            if (this.pdfViewerBase.viewerContainer.clientWidth + this.pdfViewerBase.viewerContainer.offsetLeft < this.searchBox.offsetLeft + this.searchBox.clientWidth) {
                this.searchBox.style.right = '0px';
                // tslint:disable-next-line
                this.searchBox.style.width = parseInt(this.searchBox.style.width) - ((this.searchBox.offsetLeft + this.searchBox.clientWidth) - (this.pdfViewerBase.viewerContainer.clientWidth)) + 'px';
                // tslint:disable-next-line
                this.searchInput.style.width = parseInt(this.searchInput.style.width) - ((this.searchBox.offsetLeft + this.searchBox.clientWidth) - (this.pdfViewerBase.viewerContainer.clientWidth)) + 'px';
            }
            else {
                this.searchBox.style.right = '88.3px';
                this.searchBox.style.width = '';
                this.searchInput.style.width = '';
            }
        }
    };
    /**
     * @private
     */
    TextSearch.prototype.showSearchBox = function (isShow) {
        if (isShow) {
            this.searchBox.style.display = 'block';
        }
        else {
            this.searchBox.style.display = 'none';
            this.searchInput.value = '';
        }
        this.onTextSearchClose();
    };
    /**
     * @private
     */
    TextSearch.prototype.searchAfterSelection = function () {
        if (this.isTextSearch) {
            this.initSearch(this.searchPageIndex, true);
            this.highlightOthers();
        }
    };
    TextSearch.prototype.initiateTextSearch = function (searchElement) {
        var inputString = searchElement.value;
        this.initiateSearch(inputString);
    };
    /**
     * @private
     */
    TextSearch.prototype.initiateSearch = function (inputString) {
        if (inputString !== this.searchString) {
            this.isTextSearch = false;
            this.searchPageIndex = this.pdfViewerBase.currentPageNumber - 1;
        }
        this.clearAllOccurrences();
        if (inputString !== '') {
            // tslint:disable-next-line
            if (this.searchMatches[this.searchPageIndex] && inputString === this.searchString) {
                if (this.searchMatches[this.searchPageIndex].length === 0) {
                    this.initSearch(this.searchPageIndex, false);
                }
                else {
                    this.nextSearch();
                }
            }
            else {
                this.resetVariables();
                this.searchIndex = 0;
                this.textSearch(inputString);
            }
        }
    };
    TextSearch.prototype.textSearch = function (inputString) {
        if (inputString !== '' || inputString) {
            this.searchString = inputString;
            this.isTextSearch = true;
            this.searchPageIndex = this.pdfViewerBase.currentPageNumber - 1;
            this.searchCount = 0;
            this.isTextSearchEventTriggered = false;
            this.pdfViewer.fireTextSearchStart(inputString, this.isMatchCase);
            if (this.pdfViewer.isExtractText) {
                if (this.isTextRetrieved) {
                    for (var i = 0; i < this.pdfViewerBase.pageCount; i++) {
                        this.initSearch(i, false, true);
                    }
                }
                else {
                    this.isTextSearched = true;
                    for (var i = 0; i < this.documentTextCollection.length; i++) {
                        this.initSearch(i, false, true);
                    }
                }
            }
            this.initSearch(this.searchPageIndex, false);
            this.highlightOthers();
        }
    };
    TextSearch.prototype.nextSearch = function () {
        this.isPrevSearch = false;
        this.isTextSearch = true;
        if (this.searchString) {
            this.clearAllOccurrences();
            this.searchIndex = this.searchIndex + 1;
            if (this.searchMatches[this.searchPageIndex]) {
                // tslint:disable-next-line:max-line-length
                if (this.searchIndex >= this.searchMatches[this.searchPageIndex].length || this.searchPageIndex !== this.pdfViewerBase.currentPageNumber - 1) {
                    this.searchIndex = 0;
                    this.searchPageIndex = ((this.searchPageIndex + 1) < this.pdfViewerBase.pageCount) ? (this.searchPageIndex + 1) : 0;
                    this.initSearch(this.searchPageIndex, false);
                }
                else {
                    this.highlightSearchedTexts(this.searchPageIndex, false);
                }
                this.highlightOthers();
            }
            else {
                this.initiateTextSearch(this.searchInput);
            }
        }
        else {
            this.initiateTextSearch(this.searchInput);
        }
    };
    TextSearch.prototype.prevSearch = function () {
        this.isPrevSearch = true;
        this.isTextSearch = true;
        if (this.searchString) {
            this.clearAllOccurrences();
            this.searchIndex = this.searchIndex - 1;
            if (this.searchIndex < 0) {
                this.searchPageIndex = ((this.searchPageIndex - 1) < 0) ? (this.pdfViewerBase.pageCount - 1) : this.searchPageIndex - 1;
                this.initSearch(this.searchPageIndex, false);
            }
            else {
                this.highlightSearchedTexts(this.searchPageIndex, false);
            }
            this.highlightOthers();
        }
        else {
            this.searchIndex = this.searchIndex - 1;
            this.searchPageIndex = ((this.searchPageIndex - 1) < 0) ? (this.pdfViewerBase.pageCount - 1) : this.searchPageIndex - 1;
            var inputString = this.searchInput.value;
            this.textSearch(inputString);
        }
    };
    TextSearch.prototype.initSearch = function (pageIndex, isSinglePageSearch, isCount) {
        // tslint:disable-next-line
        var storedData = this.pdfViewerBase.getStoredData(pageIndex);
        var pageText = null;
        var textContents = null;
        // tslint:disable-next-line
        var characterBounds = null;
        if (isCount) {
            if (this.documentTextCollection.length !== 0) {
                // tslint:disable-next-line
                var documentIndex = this.documentTextCollection[pageIndex][pageIndex];
                var pageTextData = documentIndex.pageText ? documentIndex.pageText : documentIndex.PageText;
                if (this.documentTextCollection[pageIndex] && documentIndex) {
                    // tslint:disable-next-line:max-line-length
                    this.getSearchTextContent(pageIndex, this.searchString, pageTextData, textContents, isSinglePageSearch, this.documentTextCollection[pageIndex]);
                }
            }
        }
        else {
            if (storedData) {
                // tslint:disable-next-line
                pageText = storedData['pageText'];
                // tslint:disable-next-line
                textContents = storedData['textContent'];
                characterBounds = this.pdfViewerBase.textLayer.characterBound[pageIndex];
                this.textContents[pageIndex] = textContents;
                this.getPossibleMatches(pageIndex, this.searchString, pageText, textContents, isSinglePageSearch, characterBounds);
            }
            else {
                if (!isSinglePageSearch) {
                    this.createRequestForSearch(pageIndex);
                }
            }
        }
        if (this.pdfViewerBase.pageCount === (this.searchMatches && this.searchMatches.length)) {
            if (!this.isTextSearchEventTriggered) {
                this.isTextSearchEventTriggered = true;
                this.pdfViewer.fireTextSearchComplete(this.searchString, this.isMatchCase);
            }
        }
    };
    // tslint:disable-next-line
    TextSearch.prototype.getPossibleMatches = function (pageIndex, searchString, pageString, textContents, isSinglePageSearch, characterBounds) {
        if (this.searchMatches && !this.searchMatches[pageIndex]) {
            var pageText = pageString;
            var searchText = searchString;
            var queryLength = searchString.length;
            if (!this.isMatchCase) {
                searchText = searchString.toLowerCase();
                pageText = pageString.toLowerCase();
            }
            var matches = [];
            var matchIndex = -queryLength;
            var newIndex = -queryLength;
            while (matchIndex !== 0) {
                if (searchText === '' || searchText === ' ' || !searchText) {
                    break;
                }
                matchIndex = pageText.indexOf(searchText, matchIndex + queryLength);
                if (searchText.indexOf(' ') !== -1) {
                    var newString = searchString.replace(' ', '\r\n');
                    newIndex = pageText.indexOf(newString, newIndex + queryLength);
                    if (!(newIndex <= -1)) {
                        if (newIndex < matchIndex) {
                            matches.push(newIndex);
                        }
                    }
                }
                if (matchIndex <= -1 && newIndex <= -1) {
                    break;
                }
                if (!(matchIndex <= -1)) {
                    matches.push(matchIndex);
                }
                if (newIndex > matchIndex && !(newIndex <= -1)) {
                    matches.push(newIndex);
                }
            }
            if (this.searchMatches) {
                this.searchMatches[pageIndex] = matches;
            }
        }
        if (!isSinglePageSearch) {
            if (this.searchedPages.indexOf(pageIndex) === -1) {
                this.searchedPages.push(pageIndex);
            }
            this.updateSearchInputIcon(false);
        }
        if (this.searchMatches && this.searchMatches[pageIndex] && this.searchMatches[pageIndex].length !== 0) {
            if (!isSinglePageSearch) {
                if (this.isPrevSearch) {
                    this.searchIndex = this.searchMatches[pageIndex].length - 1;
                }
                if ((this.pdfViewerBase.currentPageNumber - 1) !== this.searchPageIndex) {
                    // tslint:disable-next-line:max-line-length
                    if (this.searchMatches.length > 0 && (this.searchIndex === 0 || this.searchIndex === -1) && (this.searchPageIndex) === this.currentSearchIndex) {
                        if (!this.isMessagePopupOpened) {
                            this.onMessageBoxOpen();
                        }
                        this.searchPageIndex = this.getSearchPage(this.pdfViewerBase.currentPageNumber - 1);
                        this.searchedPages = [];
                    }
                    this.pdfViewerBase.updateScrollTop(this.searchPageIndex);
                }
            }
            this.highlightSearchedTexts(pageIndex, isSinglePageSearch);
        }
        else {
            if (!isSinglePageSearch) {
                if (this.isPrevSearch) {
                    this.searchPageIndex = ((this.searchPageIndex - 1) < 0) ? (this.pdfViewerBase.pageCount - 1) : this.searchPageIndex - 1;
                }
                else {
                    this.searchPageIndex = ((this.searchPageIndex + 1) < this.pdfViewerBase.pageCount) ? (this.searchPageIndex + 1) : 0;
                }
                if (this.searchedPages.indexOf(this.searchPageIndex) === -1 && this.searchedPages.length !== this.pdfViewerBase.pageCount) {
                    this.initSearch(this.searchPageIndex, false);
                }
                else {
                    var searchPageIndex = this.getSearchPage(pageIndex);
                    // tslint:disable-next-line:max-line-length
                    if (this.searchMatches && !this.searchMatches[this.searchPageIndex] && this.searchMatches.length === 0 && this.searchedPages.length === this.pdfViewerBase.pageCount) {
                        // tslint:disable-next-line:max-line-length
                        if (!this.isMessagePopupOpened) {
                            this.onMessageBoxOpen();
                        }
                        // tslint:disable-next-line:max-line-length
                    }
                    else if (this.searchMatches && this.searchMatches.length > 0 && (this.searchIndex === 0 || this.searchIndex === -1) && (searchPageIndex) === this.currentSearchIndex) {
                        if (this.isPrevSearch) {
                            // tslint:disable-next-line:max-line-length
                            if (!this.isMessagePopupOpened) {
                                this.onMessageBoxOpen();
                            }
                            this.searchPageIndex = searchPageIndex;
                            this.searchedPages = [];
                            this.searchIndex = -1;
                        }
                        else {
                            if (!this.isMessagePopupOpened) {
                                this.onMessageBoxOpen();
                            }
                            this.searchPageIndex = searchPageIndex;
                            this.searchedPages = [];
                            this.searchIndex = 0;
                        }
                        this.highlightSearchedTexts(this.searchPageIndex, isSinglePageSearch);
                    }
                }
            }
        }
    };
    // tslint:disable-next-line
    TextSearch.prototype.getSearchTextContent = function (pageIndex, searchString, pageString, textContents, isSinglePageSearch, characterBounds) {
        var pageText = pageString;
        var searchText = searchString;
        var queryLength = searchString.length;
        if (!this.isMatchCase) {
            searchText = searchString.toLowerCase();
            pageText = pageString.toLowerCase();
        }
        var matches = [];
        var matchIndex = -queryLength;
        var newIndex = -queryLength;
        while (matchIndex !== 0) {
            if (searchText === '' || searchText === ' ' || !searchText) {
                break;
            }
            matchIndex = pageText.indexOf(searchText, matchIndex + queryLength);
            if (searchText.indexOf(' ') !== -1) {
                var newString = searchString.replace(' ', '\r\n');
                newIndex = pageText.indexOf(newString, newIndex + queryLength);
                if (!(newIndex <= -1)) {
                    if (newIndex < matchIndex) {
                        matches.push(newIndex);
                    }
                }
            }
            if (matchIndex <= -1 && newIndex <= -1) {
                break;
            }
            if (!(matchIndex <= -1)) {
                matches.push(matchIndex);
            }
            if (newIndex > matchIndex && !(newIndex <= -1)) {
                matches.push(newIndex);
            }
        }
        if (matches.length !== 0) {
            this.searchCount = this.searchCount + matches.length;
        }
        this.searchMatches[pageIndex] = matches;
    };
    TextSearch.prototype.getSearchPage = function (pageIndex) {
        var pageNumber = null;
        if (this.isPrevSearch) {
            for (var i = pageIndex; i >= 0; i--) {
                if (i !== pageIndex && this.searchMatches[i]) {
                    pageNumber = i;
                    break;
                }
            }
            if (!pageNumber) {
                for (var j = this.pdfViewerBase.pageCount - 1; j > pageIndex; j--) {
                    if (this.searchMatches[j]) {
                        pageNumber = j;
                        break;
                    }
                }
            }
        }
        else {
            for (var i = pageIndex; i < this.pdfViewerBase.pageCount; i++) {
                if (i !== pageIndex && this.searchMatches[i]) {
                    pageNumber = i;
                    break;
                }
            }
            if (!pageNumber) {
                if (pageIndex === 0) {
                    pageNumber = pageIndex;
                }
                else {
                    for (var j = 0; j < pageIndex; j++) {
                        if (this.searchMatches[j]) {
                            pageNumber = j;
                            break;
                        }
                    }
                }
            }
        }
        return pageNumber;
    };
    TextSearch.prototype.highlightSearchedTexts = function (pageIndex, isSinglePageSearch) {
        // tslint:disable-next-line
        var matches = this.searchMatches[pageIndex];
        var prevEnd = null;
        // tslint:disable-next-line
        var scrollPoint = { y: -100, x: -100 };
        var startId;
        var className;
        // tslint:disable-next-line
        var characterBounds = this.pdfViewerBase.textLayer.characterBound[pageIndex];
        if (characterBounds) {
            for (var i = 0; i < matches.length; i++) {
                if (i === this.searchIndex && pageIndex === this.searchPageIndex) {
                    className = 'e-pv-search-text-highlight';
                }
                else {
                    className = 'e-pv-search-text-highlightother';
                }
                this.addDivForSearch(i, pageIndex, characterBounds, this.searchString.length, className);
            }
            if (pageIndex === this.searchPageIndex && !isSinglePageSearch) {
                var element = this.pdfViewerBase.getElement('_searchtext_' + pageIndex + '_' + this.searchIndex);
                if (element) {
                    var targetScrollElement = this.getScrollElement(element);
                    this.scrollToSearchStr(targetScrollElement, scrollPoint);
                }
                else {
                    this.pdfViewerBase.updateScrollTop(pageIndex);
                    var element_1 = this.pdfViewerBase.getElement('_searchtext_' + pageIndex + '_' + this.searchIndex);
                    if (element_1) {
                        var targetScrollElement = this.getScrollElement(element_1);
                        this.scrollToSearchStr(targetScrollElement, scrollPoint);
                    }
                }
            }
        }
    };
    // tslint:disable-next-line
    TextSearch.prototype.addDivForSearch = function (index, pageIndex, characterBounds, queryLength, className) {
        var textLayer = this.pdfViewerBase.getElement('_textLayer_' + pageIndex);
        if (isNullOrUndefined(textLayer) && className === 'e-pv-search-text-highlight') {
            if (this.pdfViewer.navigation) {
                this.pdfViewer.navigation.goToPage(pageIndex + 1);
            }
        }
        var count = this.searchMatches[pageIndex][index];
        var initial = count;
        var divCount = 0;
        while (count < initial + queryLength) {
            count = this.addDivElement(count, characterBounds, queryLength, className, index, pageIndex, initial, divCount);
            divCount++;
        }
    };
    // tslint:disable-next-line
    TextSearch.prototype.addDivElement = function (count, characterBounds, queryLength, className, index, pageIndex, initial, divCount) {
        var height = 0;
        var width = 0;
        var top = 0;
        var left = 0;
        if (characterBounds[count]) {
            left = characterBounds[count].X;
            top = characterBounds[count].Y;
        }
        var v = 0;
        if ((count - initial) !== 0) {
            v = count - initial;
            queryLength += 1;
        }
        for (v = v; v < queryLength; v++) {
            if (characterBounds[count]) {
                // tslint:disable-next-line
                var charBound = characterBounds[count];
                if (left > charBound.X) {
                    break;
                }
                top = (top < charBound.Y) ? top : charBound.Y;
                var topDifference = (top < charBound.Y) ? (charBound.Y - top) : (top - charBound.Y);
                height = (height > (topDifference + charBound.Height)) ? height : (topDifference + charBound.Height);
                count++;
            }
        }
        var isContinuation = false;
        if (initial + queryLength !== count) {
            isContinuation = true;
            if (characterBounds[count - 1]) {
                width = (characterBounds[count - 1].X - left);
            }
        }
        else {
            isContinuation = false;
            if (characterBounds[count]) {
                width = (characterBounds[count].X - left);
            }
            else {
                if (characterBounds[count - 1]) {
                    width = (characterBounds[count - 1].X - left);
                }
            }
        }
        this.createSearchTextDiv(index, pageIndex, height, width, top, left, className, isContinuation, divCount);
        return count;
    };
    // tslint:disable-next-line
    TextSearch.prototype.createSearchTextDiv = function (index, pageIndex, height, width, top, left, className, isContinuation, divCount) {
        var idString = '_searchtext_' + pageIndex + '_' + index;
        if (isContinuation) {
            idString += '_' + divCount;
        }
        if (!this.pdfViewerBase.getElement(idString)) {
            var textDiv = createElement('div', { id: this.pdfViewer.element.id + idString });
            textDiv.style.height = height * this.pdfViewerBase.getZoomFactor() + 'px';
            textDiv.style.width = width * this.pdfViewerBase.getZoomFactor() + 'px';
            textDiv.style.top = top * this.pdfViewerBase.getZoomFactor() + 'px';
            textDiv.style.left = left * this.pdfViewerBase.getZoomFactor() + 'px';
            textDiv.classList.add(className);
            if (className === 'e-pv-search-text-highlight') {
                // tslint:disable-next-line:max-line-length
                textDiv.style.backgroundColor = (this.pdfViewer.textSearchColorSettings.searchHighlightColor === '') ? '#fdd835' : this.pdfViewer.textSearchColorSettings.searchHighlightColor;
                var bounds = { left: left, top: top, width: width, height: height };
                this.pdfViewer.fireTextSearchHighlight(this.searchString, this.isMatchCase, bounds, (pageIndex + 1));
            }
            else if (className === 'e-pv-search-text-highlightother') {
                // tslint:disable-next-line:max-line-length
                textDiv.style.backgroundColor = (this.pdfViewer.textSearchColorSettings.searchColor === '') ? '#8b4c12' : this.pdfViewer.textSearchColorSettings.searchColor;
            }
            var textLayer = this.pdfViewerBase.getElement('_textLayer_' + pageIndex);
            if (textLayer) {
                textLayer.appendChild(textDiv);
            }
        }
    };
    TextSearch.prototype.isClassAvailable = function () {
        var isClass = false;
        for (var j = 0; j < this.tempElementStorage.length; j++) {
            if (this.tempElementStorage[j].classString) {
                // tslint:disable-next-line:max-line-length
                if (this.tempElementStorage[j].classString === 'e-pv-search-text-highlight' || this.tempElementStorage[j].classString === 'e-pv-search-text-highlightother') {
                    isClass = true;
                    break;
                }
            }
        }
        return isClass;
    };
    TextSearch.prototype.getScrollElement = function (element) {
        var targetElement = element;
        if (element.childNodes.length > 0) {
            for (var i = 0; i < element.childNodes.length; i++) {
                if (element.childNodes[i].classList) {
                    if (element.childNodes[i].classList.contains('e-pv-search-text-highlight')) {
                        targetElement = element.childNodes[i];
                    }
                }
            }
        }
        return targetElement;
    };
    // tslint:disable-next-line
    TextSearch.prototype.scrollToSearchStr = function (element, scrollPoint) {
        var parent = element.offsetParent;
        var offsetY = element.offsetTop + element.clientTop;
        var offsetX = element.offsetLeft + element.clientLeft;
        while (parent.id !== this.pdfViewerBase.viewerContainer.id) {
            offsetY += parent.offsetTop;
            offsetX += parent.offsetLeft;
            parent = parent.offsetParent;
        }
        if (scrollPoint) {
            offsetY += scrollPoint.y;
            offsetX += scrollPoint.x;
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                parent.scrollLeft = offsetX;
            }
            else {
                if (this.pdfViewerBase.getZoomFactor() > 1.5) {
                    parent.scrollLeft = offsetX;
                }
            }
        }
        parent.scrollTop = offsetY;
        this.pdfViewerBase.updateMobileScrollerPosition();
    };
    /**
     * @private
     */
    TextSearch.prototype.resizeSearchElements = function (pageIndex) {
        var searchDivs = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_searchtext_' + pageIndex + '"]');
        for (var i = 0; i < searchDivs.length; i++) {
            var textDiv = searchDivs[i];
            var previousZoomFactor = 1;
            if (this.pdfViewer.magnificationModule) {
                previousZoomFactor = this.pdfViewer.magnificationModule.previousZoomFactor;
            }
            // tslint:disable-next-line:max-line-length
            var outputdata = pageIndex + '_' + previousZoomFactor + '_' + this.pdfViewerBase.getZoomFactor();
            if (textDiv.getAttribute('name') !== outputdata) {
                // tslint:disable-next-line
                textDiv.style.width = (parseFloat(textDiv.style.width) / previousZoomFactor) * this.pdfViewerBase.getZoomFactor() + 'px';
                // tslint:disable-next-line
                textDiv.style.height = (parseFloat(textDiv.style.height) / previousZoomFactor) * this.pdfViewerBase.getZoomFactor() + 'px';
                // tslint:disable-next-line
                textDiv.style.top = (parseFloat(textDiv.style.top) / previousZoomFactor) * this.pdfViewerBase.getZoomFactor() + 'px';
                // tslint:disable-next-line
                textDiv.style.left = (parseFloat(textDiv.style.left) / previousZoomFactor) * this.pdfViewerBase.getZoomFactor() + 'px';
                textDiv.setAttribute('name', outputdata);
            }
        }
    };
    /**
     * @private
     */
    TextSearch.prototype.highlightOtherOccurrences = function (pageNumber) {
        this.initSearch(pageNumber, true);
    };
    TextSearch.prototype.highlightOthers = function () {
        var indexes = this.getIndexes();
        var lowerPageValue = parseFloat(indexes.lowerPageValue.toString());
        var higherPageValue = parseFloat(indexes.higherPageValue.toString());
        for (var i = lowerPageValue; i <= higherPageValue; i++) {
            this.highlightOtherOccurrences(i);
        }
    };
    /**
     * @private
     */
    TextSearch.prototype.clearAllOccurrences = function () {
        var searchTextDivs = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_searchtext_"]');
        for (var i = 0; i < searchTextDivs.length; i++) {
            searchTextDivs[i].parentElement.removeChild(searchTextDivs[i]);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    TextSearch.prototype.getIndexes = function () {
        var lowerPageValue = this.pdfViewerBase.currentPageNumber - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        var higherPageValue = this.pdfViewerBase.currentPageNumber + 1;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        return { lowerPageValue: lowerPageValue, higherPageValue: higherPageValue };
    };
    TextSearch.prototype.applyTextSelection = function () {
        if (this.pdfViewer.textSelectionModule && !this.pdfViewerBase.isTextSelectionDisabled) {
            var indexes = this.getIndexes();
            var lowerPageValue = parseFloat(indexes.lowerPageValue.toString());
            var higherPageValue = parseFloat(indexes.higherPageValue.toString());
            for (var i = lowerPageValue; i <= higherPageValue; i++) {
                this.pdfViewer.textSelectionModule.applySelectionRangeOnScroll(i);
            }
        }
    };
    /**
     * @private
     */
    TextSearch.prototype.resetTextSearch = function () {
        this.resetVariables();
        this.onTextSearchClose();
        this.searchPageIndex = null;
        this.searchIndex = 0;
        this.updateSearchInputIcon(true);
        this.enableNextButton(false);
        this.enablePrevButton(false);
        this.documentTextCollection = [];
        this.isTextRetrieved = false;
        this.isTextSearched = false;
    };
    TextSearch.prototype.onTextSearchClose = function () {
        this.isPrevSearch = false;
        this.isTextSearch = false;
        if (this.pdfViewerBase.pageCount > 0) {
            this.clearAllOccurrences();
        }
    };
    TextSearch.prototype.createRequestForSearch = function (pageIndex) {
        var proxy = this;
        var viewPortWidth = 816;
        var viewPortHeight = this.pdfViewer.element.clientHeight;
        var pageWidth = this.pdfViewerBase.pageSize[pageIndex].width;
        var pageHeight = this.pdfViewerBase.pageSize[pageIndex].height;
        var tileCount = this.pdfViewerBase.getTileCount(pageWidth);
        var noTileX = viewPortWidth >= pageWidth ? 1 : tileCount;
        var noTileY = viewPortWidth >= pageWidth ? 1 : tileCount;
        var tileSettings = this.pdfViewer.tileRenderingSettings;
        if (tileSettings.enableTileRendering && tileSettings.x > 0 && tileSettings.y > 0) {
            noTileX = viewPortWidth >= pageWidth ? 1 : tileSettings.x;
            noTileY = viewPortWidth >= pageWidth ? 1 : tileSettings.y;
        }
        for (var x = 0; x < noTileX; x++) {
            for (var y = 0; y < noTileY; y++) {
                var jsonObject = void 0;
                // tslint:disable-next-line:max-line-length
                jsonObject = { xCoordinate: 0, yCoordinate: 0, pageNumber: pageIndex, viewPortWidth: viewPortWidth, viewPortHeight: viewPortHeight, documentId: proxy.pdfViewerBase.getDocumentId(), hashId: proxy.pdfViewerBase.hashId, zoomFactor: proxy.pdfViewerBase.getZoomFactor(), tilecount: tileCount, action: 'Search', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId,
                    tileXCount: noTileX, tileYCount: noTileY };
                if (this.pdfViewerBase.jsonDocumentId) {
                    // tslint:disable-next-line
                    jsonObject.documentId = this.pdfViewerBase.jsonDocumentId;
                }
                this.searchRequestHandler = new AjaxHandler(this.pdfViewer);
                this.searchRequestHandler.url = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.renderPages;
                this.searchRequestHandler.responseType = 'json';
                this.searchRequestHandler.send(jsonObject);
                // tslint:disable-next-line
                this.searchRequestHandler.onSuccess = function (result) {
                    // tslint:disable-next-line
                    var data = result.data;
                    if (data) {
                        if (typeof data !== 'object') {
                            try {
                                data = JSON.parse(data);
                            }
                            catch (error) {
                                proxy.pdfViewerBase.onControlError(500, data, this.pdfViewer.serverActionSettings.renderPages);
                                data = null;
                            }
                        }
                        if (data) {
                            if (data.pageText && data.uniqueId === proxy.pdfViewerBase.documentId) {
                                var pageNumber = (data.pageNumber !== undefined) ? data.pageNumber : pageIndex;
                                if (viewPortWidth >= pageWidth) {
                                    proxy.pdfViewerBase.storeWinData(data, pageNumber);
                                }
                                else {
                                    proxy.pdfViewerBase.storeWinData(data, pageNumber, data.tileX, data.tileY);
                                }
                                proxy.initSearch(pageIndex, false);
                            }
                        }
                    }
                };
                // tslint:disable-next-line
                this.searchRequestHandler.onFailure = function (result) {
                    proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, this.pdfViewer.serverActionSettings.renderPages);
                };
                // tslint:disable-next-line
                this.searchRequestHandler.onError = function (result) {
                    proxy.pdfViewerBase.openNotificationPopup();
                    // tslint:disable-next-line:max-line-length
                    proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, this.pdfViewer.serverActionSettings.renderPages);
                };
            }
        }
    };
    /**
     * @private
     */
    TextSearch.prototype.getPDFDocumentTexts = function () {
        var startIndex = 0;
        var endIndex = 50;
        var pageCount = this.pdfViewerBase.pageCount;
        if (endIndex >= pageCount) {
            endIndex = pageCount;
        }
        this.createRequestForGetPdfTexts(startIndex, endIndex);
    };
    /**
     * @private
     */
    TextSearch.prototype.createRequestForGetPdfTexts = function (startIndex, endIndex) {
        var proxy = this;
        var jsonObject;
        // tslint:disable-next-line:max-line-length
        jsonObject = { pageStartIndex: startIndex, pageEndIndex: endIndex, documentId: proxy.pdfViewerBase.getDocumentId(), hashId: proxy.pdfViewerBase.hashId, action: 'RenderPdfTexts', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId };
        if (this.pdfViewerBase.jsonDocumentId) {
            // tslint:disable-next-line
            jsonObject.documentId = this.pdfViewerBase.jsonDocumentId;
        }
        this.searchRequestHandler = new AjaxHandler(this.pdfViewer);
        this.searchRequestHandler.url = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.renderTexts;
        this.searchRequestHandler.responseType = 'json';
        this.searchRequestHandler.send(jsonObject);
        // tslint:disable-next-line
        this.searchRequestHandler.onSuccess = function (result) {
            // tslint:disable-next-line
            var data = result.data;
            if (data) {
                if (typeof data !== 'object') {
                    try {
                        data = JSON.parse(data);
                    }
                    catch (error) {
                        proxy.pdfViewerBase.onControlError(500, data, this.pdfViewer.serverActionSettings.renderTexts);
                        data = null;
                    }
                }
                if (data) {
                    if (data.documentTextCollection && data.uniqueId === proxy.pdfViewerBase.documentId) {
                        if (proxy.documentTextCollection.length > 0) {
                            proxy.documentTextCollection = data.documentTextCollection.concat(proxy.documentTextCollection);
                            proxy.documentTextCollection = proxy.orderPdfTextCollections(proxy.documentTextCollection);
                        }
                        else {
                            proxy.documentTextCollection = data.documentTextCollection;
                        }
                        var pageCount = proxy.pdfViewerBase.pageCount;
                        if (endIndex !== pageCount) {
                            startIndex = endIndex;
                            endIndex = endIndex + 50;
                            if (endIndex >= pageCount) {
                                endIndex = pageCount;
                            }
                            proxy.createRequestForGetPdfTexts(startIndex, endIndex);
                        }
                        else {
                            proxy.isTextRetrieved = true;
                            proxy.pdfViewer.fireTextExtractionCompleted(proxy.documentTextCollection);
                            if (proxy.isTextSearched && proxy.searchString.length > 0) {
                                proxy.textSearch(proxy.searchString);
                                proxy.isTextSearched = false;
                            }
                        }
                    }
                }
            }
        };
        // tslint:disable-next-line
        this.searchRequestHandler.onFailure = function (result) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, this.pdfViewer.serverActionSettings.renderTexts);
        };
        // tslint:disable-next-line
        this.searchRequestHandler.onError = function (result) {
            proxy.pdfViewerBase.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, this.pdfViewer.serverActionSettings.renderTexts);
        };
    };
    // tslint:disable-next-line
    TextSearch.prototype.orderPdfTextCollections = function (oldCollection) {
        // tslint:disable-next-line
        var annotationCollectionList = [];
        for (var i = 0; i < oldCollection.length; i++) {
            if (annotationCollectionList.length === 0) {
                annotationCollectionList.push(oldCollection[i]);
            }
            else {
                // tslint:disable-next-line
                if (parseInt(Object.keys(oldCollection[i])[0]) > parseInt(Object.keys(annotationCollectionList[annotationCollectionList.length - 1])[0])) {
                    annotationCollectionList.push(oldCollection[i]);
                }
                else {
                    for (var j = 0; j < annotationCollectionList.length; j++) {
                        // tslint:disable-next-line
                        if ((parseInt(Object.keys(oldCollection[i])[0]) < parseInt(Object.keys(annotationCollectionList[j])[0]))) {
                            annotationCollectionList.splice(j, 0, oldCollection[i]);
                            break;
                        }
                    }
                }
            }
        }
        return annotationCollectionList;
    };
    TextSearch.prototype.createSearchBoxButtons = function (id, className) {
        // tslint:disable-next-line:max-line-length
        var button = createElement('button', { id: this.pdfViewer.element.id + '_' + id, className: 'e-btn e-icon-btn e-pv-search-btn ' + className });
        button.setAttribute('type', 'button');
        // tslint:disable-next-line:max-line-length
        var iconSpan = createElement('span', { id: this.pdfViewer.element.id + '_' + id + 'Icon', className: 'e-pv-icon-search ' + className + '-icon' });
        button.disabled = true;
        button.appendChild(iconSpan);
        return button;
    };
    TextSearch.prototype.enablePrevButton = function (isEnable) {
        if ((!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
            if (isEnable) {
                this.prevSearchBtn.removeAttribute('disabled');
            }
            else {
                this.prevSearchBtn.disabled = true;
            }
        }
    };
    TextSearch.prototype.enableNextButton = function (isEnable) {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (isEnable) {
                this.nextSearchBtn.removeAttribute('disabled');
            }
            else {
                this.nextSearchBtn.disabled = true;
            }
        }
    };
    /**
     * @private
     */
    TextSearch.prototype.resetVariables = function () {
        this.searchedPages = [];
        // tslint:disable-next-line
        this.searchMatches = new Array();
    };
    /**
     * @private
     */
    TextSearch.prototype.searchButtonClick = function (element, inputElement) {
        if (isBlazor() && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
            var searchElement = this.pdfViewerBase.getElement('_search_box-icon');
            element = searchElement.children[0].children[0];
            inputElement = this.pdfViewerBase.getElement('_search_input');
        }
        if (element.classList.contains('e-pv-search-icon')) {
            this.initiateTextSearch(inputElement);
        }
        else if (element.classList.contains('e-pv-search-close')) {
            inputElement.value = '';
            this.resetTextSearch();
            inputElement.focus();
        }
    };
    TextSearch.prototype.updateSearchInputIcon = function (isEnable) {
        if (isBlazor()) {
            if (this.searchBtn && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
                this.searchBtn = this.pdfViewerBase.getElement('_search_box-icon').children[0].children[0];
            }
        }
        if (this.searchBtn) {
            if (isEnable) {
                this.searchBtn.classList.remove('e-pv-search-close');
                this.searchBtn.classList.add('e-pv-search-icon');
            }
            else {
                this.searchBtn.classList.remove('e-pv-search-icon');
                this.searchBtn.classList.add('e-pv-search-close');
            }
        }
    };
    TextSearch.prototype.onMessageBoxOpen = function () {
        this.pdfViewerBase.getElement('_search_input').blur();
        this.isMessagePopupOpened = true;
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.textLayer.createNotificationPopup(this.pdfViewer.localeObj.getConstant('No matches'));
        }
        else {
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.navigationPane.createTooltipMobile(this.pdfViewer.localeObj.getConstant('No Text Found'));
        }
    };
    /**
     * Searches the target text in the PDF document and highlights the occurrences in the pages
     * @param  {string} searchText - Specifies the searchText content
     * @param  {boolean} isMatchCase - If set true , its highlights the MatchCase content
     * @returns void
     */
    TextSearch.prototype.searchText = function (searchText, isMatchCase) {
        this.searchString = searchText;
        this.isMatchCase = isMatchCase;
        this.searchIndex = 0;
        this.textSearch(searchText);
    };
    /**
     * Searches the next occurrence of the searched text from the current occurrence of the PdfViewer.
     * @returns void
     */
    TextSearch.prototype.searchNext = function () {
        this.nextSearch();
    };
    /**
     * Searches the previous occurrence of the searched text from the current occurrence of the PdfViewer.
     * @returns void
     */
    TextSearch.prototype.searchPrevious = function () {
        this.prevSearch();
    };
    /**
     * Cancels the text search of the PdfViewer.
     * @returns void
     */
    TextSearch.prototype.cancelTextSearch = function () {
        this.resetTextSearch();
    };
    /**
     * @private
     */
    TextSearch.prototype.destroy = function () {
        this.searchMatches = undefined;
    };
    /**
     * @private
     */
    TextSearch.prototype.getModuleName = function () {
        return 'TextSearch';
    };
    return TextSearch;
}());
export { TextSearch };
