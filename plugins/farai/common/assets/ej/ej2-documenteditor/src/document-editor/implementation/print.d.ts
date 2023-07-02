import { DocumentHelper } from './viewer';
import { Page } from './viewer/page';
/**
 * Print class
 */
export declare class Print {
    /**
     *
     * Gets module name.
     */
    private getModuleName;
    /**
     * Prints the current viewer
     * @param viewer
     * @param printWindow
     * @private
     */
    print(documentHelper: DocumentHelper, printWindow?: Window): void;
    /**
     * Opens print window and displays current page to print.
     * @private
     */
    printWindow(documentHelper: DocumentHelper, browserUserAgent: string, printWindow?: Window): void;
    /**
     * Generates print content.
     * @private
     */
    generatePrintContent(documentHelper: DocumentHelper, element: HTMLDivElement): void;
    /**
     * Gets page width.
     * @param pages
     * @private
     */
    getPageWidth(pages: Page[]): number;
    /**
     *  Gets page height.
     * @private
     */
    getPageHeight(pages: Page[]): number;
    /**
     * @private
     */
    destroy(): void;
}
