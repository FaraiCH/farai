import { Diagram } from '../diagram';
import { Connector } from '../objects/connector';
import { PointModel } from '../primitives/point-model';
import { Node } from '../objects/node';
import { Layout, INode } from '../layout/layout-base';
import { MatrixModelObject, Vertex, IVertex, LayoutProp } from '../layout/complex-hierarchical-tree';
import { Point } from '../primitives/point';
/**
 * Line Distribution
 * @private
 */
export declare class LineDistribution {
    /** @private */
    edgeMapper: EdgeMapperObject[];
    /**
     * Constructor for the line distribution module
     * @private
     */
    constructor();
    /**
     * To destroy the line distribution module
     * @return {void}
     * @private
     */
    destroy(): void;
    /**
     * Get the diagram instance.
     */
    private diagram;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
    /** @private */
    initLineDistribution(graph: Layout, diagram: Diagram): void;
    private getConnectorDirection;
    private ObstacleSegment;
    /** @private */
    distributeLines(layout: Layout, diagram: Diagram): void;
    private inflate;
    private updateConnectorPoints;
    private resetConnectorPoints;
    private getObstacleEndPoint;
    private getObstacleStartPoint;
    private updateSegmentRow;
    private portOffsetCalculation;
    private addDynamicPortandDistrrbuteLine;
    private initPort;
    private shiftMatrixCells;
    private arrangeMatrix;
    /** @private */
    arrangeElements(matrixModel: MatrixModelObject, layout: Layout): void;
    private findParentVertexCellGroup;
    private setXYforMatrixCell;
    private getEdgeMapper;
    /** @private */
    setEdgeMapper(value: EdgeMapperObject): void;
    private translateMatrixCells;
    private groupLayoutCells;
    private getType;
    private selectIds;
    private compareLists;
    private updateMutualSharing;
    private matrixCellGroup;
    private getPointvalue;
    private containsValue;
    private createMatrixCells;
    /** @private */
    updateLayout(viewPort: PointModel, modelBounds: any, layoutProp: Layout, layout: LayoutProp, nodeWithMultiEdges: INode[], nameTable: object): void;
}
/** @private */
interface EdgeMapperObject {
    value: Point[];
    key: Connector | Node;
}
/** @private */
export interface MatrixCellGroupObject {
    level: number;
    parents: MatrixCellGroupObject[];
    children: MatrixCellGroupObject[];
    visitedParents: MatrixCellGroupObject[];
    ignoredChildren: MatrixCellGroupObject[];
    cells: CellObject[] | IVertex;
    visitedChildren: MatrixCellGroupObject[];
    size: number;
    offset: number;
    initialOffset: number;
    key?: string[] | string;
    value?: MatrixCellGroupObject;
}
/** @private */
interface CellObject {
    x: number[];
    y: number[];
    type: string;
    temp: number[];
    minRank: number;
    maxRank: number;
    identicalSibilings: string[];
    connectsAsTarget: CellObject[];
    source: ConnectsAsSourceObject;
    target: ConnectsAsSourceObject;
    connectsAsSource: ConnectsAsSourceObject;
    cell: Vertex;
    edges?: Connector[];
    hashCode?: number;
    id?: string;
    ids?: string;
}
/** @private */
interface ConnectsAsSourceObject {
    id: string[];
    source: ConnectsAsSourceObject;
    target: ConnectsAsSourceObject;
    temp: number[];
    x: number[];
    y: number[];
}
export {};
