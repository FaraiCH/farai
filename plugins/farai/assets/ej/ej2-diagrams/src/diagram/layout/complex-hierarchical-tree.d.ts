import { INode, IConnector, Layout } from './layout-base';
import { PointModel } from '../primitives/point-model';
import { LineDistribution, MatrixCellGroupObject } from '../interaction/line-distribution';
/**
 * Connects diagram objects with layout algorithm
 */
export declare class ComplexHierarchicalTree {
    /**
     * Constructor for the hierarchical tree layout module
     * @private
     */
    constructor();
    /**
     * To destroy the hierarchical tree module
     * @return {void}
     * @private
     */
    destroy(): void;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
    /**   @private  */
    doLayout(nodes: INode[], nameTable: {}, layout: Layout, viewPort: PointModel, lineDistribution: LineDistribution): void;
    getLayoutNodesCollection(nodes: INode[]): INode[];
}
/**
 * Utility that arranges the nodes in hierarchical structure
 */
declare class HierarchicalLayoutUtil {
    private nameTable;
    /**
     * Holds the collection vertices, that are equivalent to nodes to be arranged
     */
    private vertices;
    private crossReduction;
    /**
     * Defines a vertex that is equivalent to a node object
     */
    private createVertex;
    /**
     * Initializes the edges collection of the vertices
     * @private
     */
    getEdges(node: Vertex): IConnector[];
    /**
     * Finds the root nodes of the layout
     */
    private findRoots;
    /**
     * Returns the source/target vertex of the given connector
     * @private
     */
    getVisibleTerminal(edge: IConnector, source: boolean): Vertex;
    /**
     * Traverses each sub tree, ensures there is no cycle in traversing
     * @private
     */
    traverse(vertex: Vertex, directed: boolean, edge: IConnector, currentComp: {}, hierarchyVertices: {}[], filledVertices: {}): {};
    /**
     * Returns the bounds of the given vertices
     */
    private getModelBounds;
    /**
     * Initializes the layouting process
     * @private
     */
    doLayout(nodes: INode[], nameTable: {}, layoutProp: Layout, viewPort: PointModel, lineDistribution: LineDistribution): void;
    private matrixModel;
    private calculateRectValue;
    private isNodeOverLap;
    private isIntersect;
    private updateMargin;
    /**
     * Handles positioning the nodes
     */
    private placementStage;
    /**
     * Initializes the layout properties for positioning
     */
    private coordinateAssignment;
    /**
     * Calculate the largest size of the node either height or width depends upon the layoutorientation
     */
    private calculateWidestRank;
    /**
     * Sets the temp position of the node on the layer
     * @private
     */
    setTempVariable(node: IVertex, layer: number, value: number): void;
    /**
     * Sets the position of the vertex
     * @private
     */
    setXY(node: IVertex, layer: number, value: number, isY: boolean): void;
    /**
     * Sets geometry position of the layout node on the layout model
     */
    private rankCoordinates;
    /**
     * sets the layout in an initial positioning.it will arange all the ranks as much as possible
     */
    private initialCoords;
    /**
     * Checks whether the given node is an ancestor
     * @private
     */
    isAncestor(node: IVertex, otherNode: IVertex): boolean;
    /**
     * initializes the sorter object
     */
    private weightedCellSorter;
    /**
     * Performs one node positioning in both directions
     */
    private minNode;
    /**
     * Updates the ndoes collection
     */
    private updateNodeList;
    /**
     * Calculates the node position of the connected cell on the specified rank
     */
    private medianXValue;
    /**
     * Updates the geometry of the vertices
     */
    private placementStageExecute;
    /**
     * sets the cell position in the after the layout operation
     */
    private setCellLocations;
    /**
     * used to specify the geometrical position of the layout model cell
     */
    private garphModelsetVertexLocation;
    /**
     * set the position of the specified node
     */
    private setVertexLocation;
    /**
     * get the specific value from the key value pair
     */
    private getValues;
    /**
     * Checks and reduces the crosses in between line segments
     */
    private crossingStage;
    /**
     * Initializes the ranks of the vertices
     */
    private layeringStage;
    /**
     * determine the initial rank for the each vertex on the relevent direction
     */
    private initialRank;
    /**
     * used to set the optimum value of each vertex on the layout
     */
    private fixRanks;
    /**
     * used to determine any cyclic stage have been created on the layout model
     */
    private cycleStage;
    /**
     * removes the edge from the given collection
     * @private
     */
    remove(obj: IEdge, array: IEdge[]): IEdge;
    /**
     * Inverts the source and target of an edge
     * @private
     */
    invert(connectingEdge: IEdge, layer: number): void;
    /**
     * used to get the edges between the given source and target
     * @private
     */
    getEdgesBetween(source: Vertex, target: Vertex, directed: boolean): IConnector[];
}
/**
 * Handles position the objects in a hierarchical tree structure
 */
declare class MultiParentModel {
    /** @private */
    roots: Vertex[];
    /** @private */
    vertexMapper: VertexMapper;
    /** @private */
    layout: LayoutProp;
    /** @private */
    maxRank: number;
    private hierarchicalLayout;
    private multiObjectIdentityCounter;
    /** @private */
    ranks: IVertex[][];
    private dfsCount;
    /** @private */
    startNodes: IVertex[];
    private hierarchicalUtil;
    constructor(layout: HierarchicalLayoutUtil, vertices: Vertex[], roots: Vertex[], dlayout: LayoutProp);
    /**
     * used to create the duplicate of the edges on the layout model
     */
    private createInternalCells;
    /**
     * used to set the optimum value of each vertex on the layout
     * @private
     */
    fixRanks(): void;
    /**
     * Updates the min/max rank of the layer
     */
    private updateMinMaxRank;
    /**
     * used to store the value of th given key on the object
     */
    private setDictionary;
    /**
     * used to store the value of th given key on the object
     * @private
     */
    setDictionaryForSorter(dic: VertexMapper, key: IVertex, value: WeightedCellSorter, flag: boolean): IVertex;
    /**
     * used to get the value of the given key
     * @private
     */
    getDictionary(dic: VertexMapper, key: Vertex): IVertex;
    /**
     * used to get the value of the given key
     * @private
     */
    getDictionaryForSorter(dic: VertexMapper, key: IVertex): WeightedCellSorter;
    /**
     * used to get all the values of the dictionary object
     * @private
     */
    getDictionaryValues(dic: VertexMapper): IVertex[];
    /**
     * used to visit all the entries on the given dictionary with given function
     * @private
     */
    visit(visitor: string, dfsRoots: IVertex[], trackAncestors: boolean, seenNodes: {}, data: TraverseData): void;
    /**
     * used to perform the depth fisrt search on the layout model
     */
    private depthFirstSearch;
    /**
     * Updates the rank of the connection
     */
    private updateConnectionRank;
    /**
     * Removes the edge from the collection
     */
    private removeConnectionEdge;
    /**
     * the dfs extends the default version by keeping track of cells ancestors, but it should be only used when necessary
     */
    private extendedDfs;
    /**
     * used to clone the specified object ignoring all fieldnames in the given array of transient fields
     * @private
     */
    clone(obj: Object, transients: string[], shallow: boolean): Object;
}
/**
 * Each vertex means a node object in diagram
 */
export interface Vertex {
    value: string;
    geometry: Rect;
    name: string;
    vertex: boolean;
    inEdges: string[];
    outEdges: string[];
    layoutObjectId?: string;
}
/** @private */
export interface MatrixModelObject {
    model: MultiParentModel;
    matrix: MatrixObject[];
    rowOffset: number[];
}
/** @private */
export interface MatrixObject {
    key: number;
    value: MatrixCellGroupObject[];
}
/**
 * Defines the edge that is used to maintain the relationship between internal vertices
 * @private
 */
export interface IEdge {
    x?: number[];
    y?: number[];
    temp?: number[];
    edges?: IConnector[];
    ids?: string[];
    source?: IVertex;
    target?: IVertex;
    maxRank?: number;
    minRank?: number;
    isReversed?: boolean;
    previousLayerConnectedCells?: IVertex[];
    nextLayerConnectedCells?: IVertex[];
    width?: number;
    height?: number;
}
/**
 * Defines the internal vertices that are used in positioning the objects
 * @private
 */
export interface IVertex {
    x?: number[];
    y?: number[];
    temp?: number[];
    cell?: Vertex;
    id?: string;
    connectsAsTarget?: IEdge[];
    connectsAsSource?: IEdge[];
    hashCode?: number[];
    maxRank?: number;
    minRank?: number;
    width?: number;
    height?: number;
    source?: IVertex;
    target?: IVertex;
    layoutObjectId?: string;
    type?: string;
    identicalSibiling?: string[];
}
interface VertexMapper {
    map: {};
}
/**
 * Defines weighted cell sorter
 */
interface WeightedCellSorter {
    cell?: IVertex;
    weightedValue?: number;
    visited?: boolean;
    rankIndex?: number;
}
/**
 * Defines an object that is used to maintain data in traversing
 */
interface TraverseData {
    seenNodes: {};
    unseenNodes: {};
    rankList?: IVertex[][];
    parent?: IVertex;
    root?: IVertex;
    edge?: IEdge;
}
/**
 * Defines the properties of layout
 * @private
 */
export interface LayoutProp {
    orientation?: string;
    horizontalSpacing?: number;
    verticalSpacing?: number;
    marginX: number;
    marginY: number;
}
interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
    right?: number;
    bottom?: number;
    left?: number;
}
export {};
