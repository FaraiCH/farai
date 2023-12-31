import { StreamWriter } from '@syncfusion/ej2-file-utils';
import { DocumentHelper } from '../viewer';
/**
 * Exports the document to Text format.
 */
export declare class TextExport {
    private getModuleName;
    /**
     * @private
     */
    pageContent: string;
    private curSectionIndex;
    private sections;
    private document;
    private lastPara;
    private mSections;
    private inField;
    /**
     * @private
     */
    save(documentHelper: DocumentHelper, fileName: string): void;
    /**
     * @private
     */
    saveAsBlob(documentHelper: DocumentHelper): Promise<Blob>;
    private serialize;
    /**
     * @private
     * @param document
     */
    setDocument(document: any): void;
    /**
     * @private
     * @param streamWriter
     */
    writeInternal(streamWriter?: StreamWriter): void;
    private writeBody;
    private writeParagraph;
    private writeTable;
    private writeHeadersFooters;
    private writeHeaderFooter;
    private writeSectionEnd;
    private writeNewLine;
    private writeText;
    private updateLastParagraph;
    /**
     * @private
     */
    destroy(): void;
}
