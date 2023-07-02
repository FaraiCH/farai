/**
 * Search Result info
 */
var SearchResults = /** @class */ (function () {
    /**
     * @private
     */
    function SearchResults(search) {
        this.searchModule = search;
    }
    Object.defineProperty(SearchResults.prototype, "length", {
        /**
         * Gets the length of search results.
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.searchModule.textSearchResults.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchResults.prototype, "index", {
        /**
         * Gets the index of current search result.
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.searchModule.textSearchResults.currentIndex;
        },
        /**
         * Set the index of current search result.
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (this.length === 0 || value < 0 || value > this.searchModule.textSearchResults.length - 1) {
                return;
            }
            this.searchModule.textSearchResults.currentIndex = value;
            this.navigate(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get start and end offset of searched text results.
     */
    SearchResults.prototype.getTextSearchResultsOffset = function () {
        var index = [];
        var searchIndex;
        for (var i = 0; i < this.searchModule.textSearchResults.innerList.length; i++) {
            searchIndex = this.getOffset(this.searchModule.textSearchResults.innerList[i]);
            index.push(searchIndex);
        }
        return index;
    };
    SearchResults.prototype.getOffset = function (innerList) {
        var start = innerList.start;
        var end = innerList.end;
        var blockInfo = this.searchModule.documentHelper.owner.selection.getParagraphInfo(start);
        // tslint:disable-next-line:max-line-length
        var startIndex = this.searchModule.documentHelper.owner.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        blockInfo = this.searchModule.documentHelper.owner.selection.getParagraphInfo(end);
        // tslint:disable-next-line:max-line-length
        var endIndex = this.searchModule.documentHelper.owner.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        return { 'startOffset': startIndex, 'endOffset': endIndex };
    };
    /**
     * Get the module name.
     */
    SearchResults.prototype.getModuleName = function () {
        return 'SearchResults';
    };
    /**
     * Replace text in current search result.
     * @param textToReplace text to replace
     * @private
     */
    SearchResults.prototype.replace = function (textToReplace) {
        if (this.index === -1) {
            return;
        }
        this.searchModule.replaceInternal(textToReplace);
    };
    /**
     * Replace all the instance of search result.
     * @param textToReplace text to replace
     */
    SearchResults.prototype.replaceAll = function (textToReplace) {
        if (this.index === -1) {
            return;
        }
        this.searchModule.replaceAllInternal(textToReplace);
    };
    /**
     * @private
     */
    SearchResults.prototype.navigate = function (index) {
        this.searchModule.navigate(this.searchModule.textSearchResults.currentSearchResult);
        this.searchModule.highlight(this.searchModule.textSearchResults);
    };
    /**
     * Clears all the instance of search result.
     */
    SearchResults.prototype.clear = function () {
        this.searchModule.textSearchResults.clearResults();
        this.searchModule.clearSearchHighlight();
        this.searchModule.viewer.renderVisiblePages();
    };
    return SearchResults;
}());
export { SearchResults };
