import { DataSourceModel } from '../diagram/data-source-model';
import { Diagram } from '../diagram';
/**
 * data source defines the basic unit of diagram
 */
export declare class DataBinding {
    /**
     * Constructor for the data binding module.
     * @private
     */
    constructor();
    /**
     * To destroy the data binding module
     * @return {void}
     * @private
     */
    destroy(): void;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
    /**   @private  */
    dataTable: Object;
    /**
     * Initialize nodes and connectors when we have a data as JSON
     * @param {DataSourceModel} data
     * @param {Diagram} diagram
     * @private
     */
    initData(data: DataSourceModel, diagram: Diagram): void;
    /**
     * Initialize nodes and connector when we have a data as remote url
     * @param {DataSourceModel} data
     * @param {Diagram} diagram
     * @private
     */
    initSource(data: DataSourceModel, diagram: Diagram): void;
    private applyDataSource;
    /**
     * updateMultipleRootNodes method is used  to update the multiple Root Nodes
     * @param {Object} object
     * @param {Object[]} rootnodes
     * @param {DataSourceModel} mapper
     * @param {Object[]} data
     */
    private updateMultipleRootNodes;
    /**
     * Get the node values
     * @param {DataSourceModel} mapper
     * @param {Object} item
     * @param {Diagram} diagram
     */
    private applyNodeTemplate;
    private splitString;
    private renderChildNodes;
    private containsConnector;
    /**
     *  collectionContains method is used to  check wthear the node is already present in collection or not
     * @param {Node} node
     * @param {Diagram} diagram
     * @param {string} id
     * @param {string} parentId
     */
    private collectionContains;
    /**
     * Get the Connector values
     * @param {string} sNode
     * @param {string} tNode
     * @param {Diagram} diagram
     */
    private applyConnectorTemplate;
}
