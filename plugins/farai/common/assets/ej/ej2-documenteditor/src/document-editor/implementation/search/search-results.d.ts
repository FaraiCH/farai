import { Search } from './search';
import { TextSearchResultInfo } from '../editor/editor-helper';
/**
 * Search Result info
 */
export declare class SearchResults {
    private searchModule;
    /**
     * Gets the length of search results.
     * @aspType int
     * @blazorType int
     */
    readonly length: number;
    /**
     * Gets the index of current search result.
     * @aspType int
     * @blazorType int
     */
    /**
    * Set the index of current search result.
    * @aspType int
    * @blazorType int
    */
    index: number;
    /**
     * @private
     */
    constructor(search: Search);
    /**
     * Get start and end offset of searched text results.
     */
    getTextSearchResultsOffset(): TextSearchResultInfo[];
    private getOffset;
    /**
     * Get the module name.
     */
    private getModuleName;
    /**
     * Replace text in current search result.
     * @param textToReplace text to replace
     * @private
     */
    replace(textToReplace: string): void;
    /**
     * Replace all the instance of search result.
     * @param textToReplace text to replace
     */
    replaceAll(textToReplace: string): void;
    /**
     * @private
     */
    navigate(index: number): void;
    /**
     * Clears all the instance of search result.
     */
    clear(): void;
}
