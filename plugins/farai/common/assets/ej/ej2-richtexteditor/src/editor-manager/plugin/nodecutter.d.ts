/**
 * Split the Node based on selection
 * @hidden
 * @deprecated
 */
export declare class NodeCutter {
    position: number;
    private nodeSelection;
    /**
     * GetSpliceNode method
     * @hidden
     * @deprecated
     */
    GetSpliceNode(range: Range, node: HTMLElement): Node;
    /**
     * @hidden
     * @deprecated
     */
    SplitNode(range: Range, node: HTMLElement, isCollapsed: boolean): HTMLElement;
    private isImgElm;
    private spliceEmptyNode;
    private GetCursorStart;
    /**
     * GetCursorRange method
     * @hidden
     * @deprecated
     */
    GetCursorRange(docElement: Document, range: Range, node: Node): Range;
    /**
     * GetCursorNode method
     * @hidden
     * @deprecated
     */
    GetCursorNode(docElement: Document, range: Range, node: Node): Node;
    /**
     * TrimLineBreak method
     * @hidden
     * @deprecated
     */
    TrimLineBreak(line: string): string;
}
