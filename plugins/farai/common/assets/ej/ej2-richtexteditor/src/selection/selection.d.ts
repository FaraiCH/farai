/**
 * `Selection` module is used to handle RTE Selections.
 */
export declare class NodeSelection {
    range: Range;
    rootNode: Node;
    body: HTMLBodyElement;
    html: string;
    startContainer: number[];
    endContainer: number[];
    startOffset: number;
    endOffset: number;
    startNodeName: string[];
    endNodeName: string[];
    private saveInstance;
    private documentFromRange;
    getRange(docElement: Document): Range;
    /**
     * get method
     * @hidden
     * @deprecated
     */
    get(docElement: Document): Selection;
    /**
     * save method
     * @hidden
     * @deprecated
     */
    save(range: Range, docElement: Document): NodeSelection;
    /**
     * getIndex method
     * @hidden
     * @deprecated
     */
    getIndex(node: Node): number;
    private isChildNode;
    private getNode;
    /**
     * getNodeCollection method
     * @hidden
     * @deprecated
     */
    getNodeCollection(range: Range): Node[];
    /**
     * getParentNodeCollection method
     * @hidden
     * @deprecated
     */
    getParentNodeCollection(range: Range): Node[];
    /**
     * getParentNodes method
     * @hidden
     * @deprecated
     */
    getParentNodes(nodeCollection: Node[], range: Range): Node[];
    /**
     * getSelectionNodeCollection method
     * @hidden
     * @deprecated
     */
    getSelectionNodeCollection(range: Range): Node[];
    /**
     * getSelectionNodeCollection along with BR node method
     * @hidden
     * @deprecated
     */
    getSelectionNodeCollectionBr(range: Range): Node[];
    /**
     * getParentNodes method
     * @hidden
     * @deprecated
     */
    getSelectionNodes(nodeCollection: Node[]): Node[];
    /**
     * Get selection text nodes with br method.
     * @hidden
     * @deprecated
     */
    getSelectionNodesBr(nodeCollection: Node[]): Node[];
    /**
     * getInsertNodeCollection method
     * @hidden
     * @deprecated
     */
    getInsertNodeCollection(range: Range): Node[];
    /**
     * getInsertNodes method
     * @hidden
     * @deprecated
     */
    getInsertNodes(nodeCollection: Node[]): Node[];
    /**
     * getNodeArray method
     * @hidden
     * @deprecated
     */
    getNodeArray(node: Node, isStart: boolean, root?: Document): number[];
    private setRangePoint;
    /**
     * restore method
     * @hidden
     * @deprecated
     */
    restore(): Range;
    selectRange(docElement: Document, range: Range): void;
    /**
     * setRange method
     * @hidden
     * @deprecated
     */
    setRange(docElement: Document, range: Range): void;
    /**
     * setSelectionText method
     * @hidden
     * @deprecated
     */
    setSelectionText(docElement: Document, startNode: Node, endNode: Node, startIndex: number, endIndex: number): void;
    /**
     * setSelectionContents method
     * @hidden
     * @deprecated
     */
    setSelectionContents(docElement: Document, element: Node): void;
    /**
     * setSelectionNode method
     * @hidden
     * @deprecated
     */
    setSelectionNode(docElement: Document, element: Node): void;
    /**
     * getSelectedNodes method
     * @hidden
     * @deprecated
     */
    getSelectedNodes(docElement: Document): Node[];
    /**
     * Clear method
     * @hidden
     * @deprecated
     */
    Clear(docElement: Document): void;
    /**
     * insertParentNode method
     * @hidden
     * @deprecated
     */
    insertParentNode(docElement: Document, newNode: Node, range: Range): void;
    /**
     * setCursorPoint method
     * @hidden
     * @deprecated
     */
    setCursorPoint(docElement: Document, element: Element, point: number): void;
}
