/**
 * Connects diagram objects with layout algorithm
 */
var ComplexHierarchicalTree = /** @class */ (function () {
    /**
     * Constructor for the hierarchical tree layout module
     * @private
     */
    function ComplexHierarchicalTree() {
        //constructs the layout module
    }
    /**
     * To destroy the hierarchical tree module
     * @return {void}
     * @private
     */
    ComplexHierarchicalTree.prototype.destroy = function () {
        /**
         * Destroy method performed here
         */
    };
    /**
     * Get module name.
     */
    ComplexHierarchicalTree.prototype.getModuleName = function () {
        /**
         * Returns the module name of the layout
         */
        return 'ComplexHierarchicalTree';
    };
    /**   @private  */
    ComplexHierarchicalTree.prototype.doLayout = function (nodes, nameTable, layout, viewPort, lineDistribution) {
        new HierarchicalLayoutUtil().doLayout(nodes, nameTable, layout, viewPort, lineDistribution);
    };
    ComplexHierarchicalTree.prototype.getLayoutNodesCollection = function (nodes) {
        var nodesCollection = [];
        var node;
        var parentId = 'parentId';
        var processId = 'processId';
        for (var i = 0; i < nodes.length; i++) {
            node = nodes[i];
            if ((node.inEdges.length + node.outEdges.length > 0) && !node[parentId] && !node[processId]) {
                nodesCollection.push(node);
            }
        }
        return nodesCollection;
    };
    return ComplexHierarchicalTree;
}());
export { ComplexHierarchicalTree };
/**
 * Utility that arranges the nodes in hierarchical structure
 */
var HierarchicalLayoutUtil = /** @class */ (function () {
    function HierarchicalLayoutUtil() {
        this.nameTable = {};
        this.crossReduction = new CrossReduction();
    }
    /**
     * Defines a vertex that is equivalent to a node object
     */
    HierarchicalLayoutUtil.prototype.createVertex = function (node, value, x, y, width, height) {
        var geometry = { x: x, y: y, width: width, height: height };
        var vertex = {
            value: value, geometry: geometry, name: value, vertex: true,
            inEdges: node.inEdges.slice(), outEdges: node.outEdges.slice()
        };
        return vertex;
    };
    /**
     * Initializes the edges collection of the vertices
     * @private
     */
    HierarchicalLayoutUtil.prototype.getEdges = function (node) {
        var edges = [];
        if (node) {
            for (var i = 0; node.inEdges.length > 0 && i < node.inEdges.length; i++) {
                edges.push(this.nameTable[node.inEdges[i]]);
            }
            for (var i = 0; node.outEdges.length > 0 && i < node.outEdges.length; i++) {
                edges.push(this.nameTable[node.outEdges[i]]);
            }
        }
        return edges;
    };
    /**
     * Finds the root nodes of the layout
     */
    HierarchicalLayoutUtil.prototype.findRoots = function (vertices) {
        var roots = [];
        var best = null;
        var maxDiff = -100000;
        for (var _i = 0, _a = Object.keys(vertices); _i < _a.length; _i++) {
            var i = _a[_i];
            var cell = vertices[i];
            var conns = this.getEdges(cell);
            var outEdges = 0;
            var inEdges = 0;
            for (var k = 0; k < conns.length; k++) {
                var src = this.getVisibleTerminal(conns[k], true);
                if (src.name === cell.name) {
                    outEdges++;
                }
                else {
                    inEdges++;
                }
            }
            if (inEdges === 0 && outEdges > 0) {
                roots.push(cell);
            }
            var diff = outEdges - inEdges;
            if (diff > maxDiff) {
                maxDiff = diff;
                best = cell;
            }
        }
        if (roots.length === 0 && best != null) {
            roots.push(best);
        }
        return roots;
    };
    /**
     * Returns the source/target vertex of the given connector
     * @private
     */
    HierarchicalLayoutUtil.prototype.getVisibleTerminal = function (edge, source) {
        var terminalCache = this.nameTable[edge.targetID];
        if (source) {
            terminalCache = this.nameTable[edge.sourceID];
        }
        for (var i = 0; i < this.vertices.length; i++) {
            if (this.vertices[i].name === terminalCache.id) {
                return this.vertices[i];
            }
        }
        return null;
    };
    /**
     * Traverses each sub tree, ensures there is no cycle in traversing
     * @private
     */
    HierarchicalLayoutUtil.prototype.traverse = function (vertex, directed, edge, currentComp, hierarchyVertices, filledVertices) {
        if (vertex != null) {
            var vertexID = vertex.name;
            if ((filledVertices == null ? true : filledVertices[vertexID] != null)) {
                if (currentComp[vertexID] == null) {
                    currentComp[vertexID] = vertex;
                }
                if (filledVertices != null) {
                    delete filledVertices[vertexID];
                }
                var edges = this.getEdges(vertex);
                var edgeIsSource = [];
                for (var i = 0; i < edges.length; i++) {
                    edgeIsSource[i] = this.getVisibleTerminal(edges[i], true) === vertex;
                }
                for (var i = 0; i < edges.length; i++) {
                    if (!directed || edgeIsSource[i]) {
                        var next = this.getVisibleTerminal(edges[i], !edgeIsSource[i]);
                        var netCount = 1;
                        for (var j = 0; j < edges.length; j++) {
                            if (j === i) {
                                continue;
                            }
                            else {
                                var isSource2 = edgeIsSource[j];
                                var otherTerm = this.getVisibleTerminal(edges[j], !isSource2);
                                if (otherTerm === next) {
                                    if (isSource2) {
                                        netCount++;
                                    }
                                    else {
                                        netCount--;
                                    }
                                }
                            }
                        }
                        if (netCount >= 0) {
                            currentComp = this.traverse(next, directed, edges[i], currentComp, hierarchyVertices, filledVertices);
                        }
                    }
                }
            }
            else {
                if (currentComp[vertexID] == null) {
                    // We've seen this vertex before, but not in the current component This component and the one it's in need to be merged
                    for (var i = 0; i < hierarchyVertices.length; i++) {
                        var comp = hierarchyVertices[i];
                        if (comp[vertexID] != null) {
                            for (var _i = 0, _a = Object.keys(comp); _i < _a.length; _i++) {
                                var key = _a[_i];
                                currentComp[key] = comp[key];
                            }
                            // Remove the current component from the hierarchy set
                            hierarchyVertices.splice(i, 1);
                            return currentComp;
                        }
                    }
                }
            }
        }
        return currentComp;
    };
    /**
     * Returns the bounds of the given vertices
     */
    HierarchicalLayoutUtil.prototype.getModelBounds = function (nodes) {
        nodes = nodes.slice();
        var rect = null;
        var rect1 = null;
        for (var i = 0; i < nodes.length; i++) {
            rect = nodes[i].geometry;
            if (rect1) {
                var right = Math.max(rect1.x + rect1.width, rect.x + rect.width);
                var bottom = Math.max(rect1.y + rect1.height, rect.y + rect.height);
                rect1.x = Math.min(rect1.x, rect.x);
                rect1.y = Math.min(rect1.y, rect.y);
                rect1.width = right - rect1.x;
                rect1.height = bottom - rect1.y;
            }
            else {
                rect1 = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
            }
        }
        return rect1;
    };
    /**
     * Initializes the layouting process
     * @private
     */
    HierarchicalLayoutUtil.prototype.doLayout = function (nodes, nameTable, layoutProp, viewPort, lineDistribution) {
        this.nameTable = nameTable;
        var layout = {
            horizontalSpacing: layoutProp.horizontalSpacing, verticalSpacing: layoutProp.verticalSpacing,
            orientation: layoutProp.orientation, marginX: layoutProp.margin.left, marginY: layoutProp.margin.top
        };
        if (lineDistribution) {
            lineDistribution.edgeMapper = [];
        }
        var nodeWithMultiEdges = [];
        this.vertices = [];
        var filledVertexSet = {};
        for (var i = 0; i < nodes.length; i++) {
            var node = this.createVertex(nodes[i], nodes[i].id, 0, 0, nodes[i].actualSize.width, nodes[i].actualSize.height);
            this.vertices.push(node);
            if (nodes[i].inEdges.length > 0 || nodes[i].outEdges.length > 0) {
                nodeWithMultiEdges.push(nodes[i]);
            }
            filledVertexSet[node.name] = node;
            if (lineDistribution) {
                var outEdges = nodes[i].outEdges.slice();
                for (var j = 0; j < outEdges.length; j++) {
                    var outEdge = nameTable[outEdges[j]];
                    lineDistribution.setEdgeMapper({ key: outEdge, value: [] });
                }
            }
        }
        var hierarchyVertices = [];
        var candidateRoots;
        candidateRoots = this.findRoots(filledVertexSet);
        for (var i = 0; i < candidateRoots.length; i++) {
            var vertexSet = {};
            hierarchyVertices.push(vertexSet);
            this.traverse(candidateRoots[i], true, null, vertexSet, hierarchyVertices, filledVertexSet);
        }
        var limit = { marginX: 0, marginY: 0 };
        var tmp = [];
        var checkLinear = false;
        for (var i = 0; i < hierarchyVertices.length; i++) {
            var vertexSet = hierarchyVertices[i];
            for (var _i = 0, _a = Object.keys(vertexSet); _i < _a.length; _i++) {
                var key = _a[_i];
                tmp.push(vertexSet[key]);
            }
            if (layoutProp.arrangement === 'Linear' && i === hierarchyVertices.length - 1) {
                checkLinear = true;
            }
            var model = new MultiParentModel(this, tmp, candidateRoots, layout);
            this.cycleStage(model);
            this.layeringStage(model);
            if ((lineDistribution && layoutProp.connectionPointOrigin === 'DifferentPoint') || checkLinear) {
                var matrixModel = this.matrixModel({ model: model, matrix: [], rowOffset: [] });
                lineDistribution.arrangeElements(matrixModel, layoutProp);
            }
            else {
                if (layoutProp.arrangement === 'Nonlinear') {
                    this.crossingStage(model);
                    limit = this.placementStage(model, limit.marginX, limit.marginY);
                    tmp = [];
                }
            }
        }
        var modelBounds = this.getModelBounds(this.vertices);
        this.updateMargin(layoutProp, layout, modelBounds, viewPort);
        for (var i = 0; i < this.vertices.length; i++) {
            var clnode = this.vertices[i];
            if (clnode) { //Check what is node.source/node.target -  && !clnode.source && !clnode.target) {
                var dnode = this.nameTable[clnode.name];
                dnode.offsetX = 0;
                dnode.offsetY = 0;
                //initialize layout
                var dx = (clnode.geometry.x - (dnode.offsetX - (dnode.actualSize.width / 2))) + layout.marginX;
                var dy = (clnode.geometry.y - (dnode.offsetY - (dnode.actualSize.height / 2))) + layout.marginY;
                var x = dx;
                var y = dy;
                if (layout.orientation === 'BottomToTop') {
                    y = modelBounds.height - dy;
                }
                else if (layout.orientation === 'RightToLeft') {
                    x = modelBounds.width - dx;
                }
                dnode.offsetX += x - dnode.offsetX;
                dnode.offsetY += y - dnode.offsetY;
            }
        }
        if (!checkLinear) {
            for (var i = 0; i < this.vertices.length; i++) {
                this.isNodeOverLap(this.nameTable[this.vertices[i].name], layoutProp);
            }
        }
        if ((lineDistribution && layoutProp.connectionPointOrigin === 'DifferentPoint')) {
            lineDistribution.updateLayout(viewPort, modelBounds, layoutProp, layout, nodeWithMultiEdges, nameTable);
        }
    };
    HierarchicalLayoutUtil.prototype.matrixModel = function (options) {
        options.model = options.model;
        options.matrix = options.matrix || [];
        options.rowOffset = options.rowOffset || [];
        return options;
    };
    HierarchicalLayoutUtil.prototype.calculateRectValue = function (dnode) {
        var rect = { x: 0, y: 0, right: 0, bottom: 0, height: 0, width: 0 };
        rect.x = dnode.offsetX - dnode.actualSize.width / 2;
        rect.right = dnode.offsetX + dnode.actualSize.width / 2;
        rect.y = dnode.offsetY - dnode.actualSize.height / 2;
        rect.bottom = dnode.offsetY + dnode.actualSize.height / 2;
        return rect;
    };
    HierarchicalLayoutUtil.prototype.isNodeOverLap = function (dnode, layoutProp) {
        var nodeRect = { x: 0, y: 0, right: 0, bottom: 0, height: 0, width: 0 };
        for (var i = 0; i < this.vertices.length; i++) {
            var rect = { x: 0, y: 0, width: 0, height: 0 };
            var tempnode1 = void 0;
            tempnode1 = this.nameTable[this.vertices[i].value];
            if (dnode.id !== tempnode1.id && tempnode1.offsetX !== 0 && tempnode1.offsetY !== 0) {
                nodeRect = this.calculateRectValue(dnode);
                rect = this.calculateRectValue(tempnode1);
                if (this.isIntersect(rect, nodeRect, layoutProp)) {
                    if (layoutProp.orientation === 'TopToBottom' || layoutProp.orientation === 'BottomToTop') {
                        dnode.offsetX += layoutProp.horizontalSpacing;
                    }
                    else {
                        dnode.offsetY += layoutProp.verticalSpacing;
                    }
                    this.isNodeOverLap(dnode, layoutProp);
                }
            }
        }
    };
    HierarchicalLayoutUtil.prototype.isIntersect = function (rect, nodeRect, layoutProp) {
        if (!(Math.floor(rect.right + layoutProp.horizontalSpacing) <= Math.floor(nodeRect.x) ||
            Math.floor(rect.x - layoutProp.horizontalSpacing) >= Math.floor(nodeRect.right)
            || Math.floor(rect.y - layoutProp.verticalSpacing) >= Math.floor(nodeRect.bottom)
            || Math.floor(rect.bottom + layoutProp.verticalSpacing) <= Math.floor(nodeRect.y))) {
            return true;
        }
        else {
            return false;
        }
    };
    HierarchicalLayoutUtil.prototype.updateMargin = function (layoutProp, layout, modelBounds, viewPort) {
        var viewPortBounds = { x: 0, y: 0, width: viewPort.x, height: viewPort.y };
        var layoutBounds;
        var bounds = {
            x: modelBounds.x, y: modelBounds.y,
            right: modelBounds.x + modelBounds.width,
            bottom: modelBounds.y + modelBounds.height
        };
        layoutBounds = layoutProp.bounds ? layoutProp.bounds : viewPortBounds;
        if (layout.orientation === 'TopToBottom' || layout.orientation === 'BottomToTop') {
            switch (layoutProp.horizontalAlignment) {
                case 'Auto':
                case 'Left':
                    layout.marginX = (layoutBounds.x - bounds.x) + layoutProp.margin.left;
                    break;
                case 'Right':
                    layout.marginX = layoutBounds.x + layoutBounds.width - layoutProp.margin.right - bounds.right;
                    break;
                case 'Center':
                    layout.marginX = layoutBounds.x + layoutBounds.width / 2 - (bounds.x + bounds.right) / 2;
                    break;
            }
            switch (layoutProp.verticalAlignment) {
                case 'Top':
                    var top_1;
                    top_1 = layoutBounds.y + layoutProp.margin.top;
                    layout.marginY = layout.orientation === 'TopToBottom' ? top_1 : -top_1;
                    break;
                case 'Bottom':
                    var bottom = void 0;
                    bottom = layoutBounds.y + layoutBounds.height - layoutProp.margin.bottom;
                    layout.marginY = layout.orientation === 'TopToBottom' ? bottom - bounds.bottom : -(bottom - bounds.bottom);
                    break;
                case 'Auto':
                case 'Center':
                    var center = void 0;
                    center = layoutBounds.y + layoutBounds.height / 2;
                    layout.marginY = layout.orientation === 'TopToBottom' ?
                        center - (bounds.y + bounds.bottom) / 2 : -center + (bounds.y + bounds.bottom) / 2;
                    break;
            }
        }
        else {
            switch (layoutProp.horizontalAlignment) {
                case 'Auto':
                case 'Left':
                    var left = void 0;
                    left = layoutBounds.x + layoutProp.margin.left;
                    layout.marginX = layout.orientation === 'LeftToRight' ? left : -left;
                    break;
                case 'Right':
                    var right = void 0;
                    right = layoutBounds.x + layoutBounds.width - layoutProp.margin.right;
                    layout.marginX = layout.orientation === 'LeftToRight' ? right - bounds.right : bounds.right - right;
                    break;
                case 'Center':
                    var center = void 0;
                    center = layoutBounds.width / 2 + layoutBounds.x;
                    layout.marginX = layout.orientation === 'LeftToRight' ?
                        center - (bounds.y + bounds.bottom) / 2 : -center + (bounds.x + bounds.right) / 2;
                    break;
            }
            switch (layoutProp.verticalAlignment) {
                case 'Top':
                    layout.marginY = layoutBounds.y + layoutProp.margin.top - bounds.x;
                    break;
                case 'Auto':
                case 'Center':
                    layout.marginY = layoutBounds.y + layoutBounds.height / 2 - (bounds.y + bounds.bottom) / 2;
                    break;
                case 'Bottom':
                    layout.marginY = layoutBounds.y + layoutBounds.height - layoutProp.margin.bottom - bounds.bottom;
                    break;
            }
        }
    };
    /**
     * Handles positioning the nodes
     */
    HierarchicalLayoutUtil.prototype.placementStage = function (model, marginX, marginY) {
        var placementStage = this.coordinateAssignment(marginX, marginY, parent, model);
        placementStage.model = model;
        placementStage.widestRankValue = null;
        this.placementStageExecute(placementStage);
        return {
            marginX: placementStage.marginX + model.layout.horizontalSpacing,
            marginY: placementStage.marginY + model.layout.verticalSpacing
        };
    };
    /**
     * Initializes the layout properties for positioning
     */
    HierarchicalLayoutUtil.prototype.coordinateAssignment = function (marginX, marginY, parent, model) {
        var plalementChange = {};
        if (model.layout.orientation === 'TopToBottom' || model.layout.orientation === 'BottomToTop') {
            plalementChange.horizontalSpacing = model.layout.horizontalSpacing;
            plalementChange.verticalSpacing = model.layout.verticalSpacing;
        }
        else {
            plalementChange.horizontalSpacing = model.layout.verticalSpacing;
            plalementChange.verticalSpacing = model.layout.horizontalSpacing;
        }
        plalementChange.orientation = 'north';
        //Removed the conditions here. So check here in case of any issue
        plalementChange.marginX = plalementChange.marginX = marginX;
        plalementChange.marginY = plalementChange.marginY = marginY;
        return plalementChange;
    };
    /**
     * Calculate the largest size of the node either height or width depends upon the layoutorientation
     */
    HierarchicalLayoutUtil.prototype.calculateWidestRank = function (plalementChange, graph, model) {
        var isHorizontal = false;
        if (plalementChange.model.layout.orientation === 'LeftToRight' || plalementChange.model.layout.orientation === 'RightToLeft') {
            isHorizontal = true;
        }
        var offset = -plalementChange.verticalSpacing;
        var lastRankMaxCellSize = 0.0;
        plalementChange.rankSizes = [];
        plalementChange.rankOffset = [];
        for (var rankValue = model.maxRank; rankValue >= 0; rankValue--) {
            var maxCellSize = 0.0;
            var rank = model.ranks[rankValue];
            var localOffset = isHorizontal ? plalementChange.marginY : plalementChange.marginX;
            for (var i = 0; i < rank.length; i++) {
                var node = rank[i];
                if (this.crossReduction.isVertex(node)) {
                    var vertex = node;
                    if (vertex.cell && (vertex.cell.inEdges || vertex.cell.outEdges)) {
                        var obj = this.nameTable[vertex.cell.name];
                        vertex.width = obj.actualSize.width;
                        vertex.height = obj.actualSize.height;
                        maxCellSize = Math.max(maxCellSize, (isHorizontal ? vertex.width : vertex.height));
                    }
                }
                else {
                    if (node) {
                        var edge = node;
                        var numEdges = 1;
                        if (edge.edges != null) {
                            numEdges = edge.edges.length;
                        }
                        node.width = (numEdges - 1) * 10;
                    }
                }
                if (isHorizontal) {
                    if (!node.height) {
                        node.height = 0;
                    }
                }
                // Set the initial x-value as being the best result so far
                localOffset += (isHorizontal ? node.height : node.width) / 2.0;
                this.setXY(node, rankValue, localOffset, isHorizontal ? true : false);
                this.setTempVariable(node, rankValue, localOffset);
                localOffset += ((isHorizontal ? node.height : node.width) / 2.0) + plalementChange.horizontalSpacing;
                if (localOffset > plalementChange.widestRankValue) {
                    plalementChange.widestRankValue = localOffset;
                    plalementChange.widestRank = rankValue;
                }
                plalementChange.rankSizes[rankValue] = localOffset;
            }
            plalementChange.rankOffset[rankValue] = offset;
            var distanceToNextRank = maxCellSize / 2.0 + lastRankMaxCellSize / 2.0 + plalementChange.verticalSpacing;
            lastRankMaxCellSize = maxCellSize;
            if (plalementChange.orientation === 'north' || plalementChange.orientation === 'west') {
                offset += distanceToNextRank;
            }
            else {
                offset -= distanceToNextRank;
            }
            for (var i = 0; i < rank.length; i++) {
                var cell = rank[i];
                this.setXY(cell, rankValue, offset, isHorizontal ? false : true);
            }
        }
    };
    /**
     * Sets the temp position of the node on the layer
     * @private
     */
    HierarchicalLayoutUtil.prototype.setTempVariable = function (node, layer, value) {
        if (this.crossReduction.isVertex(node)) {
            node.temp[0] = value;
        }
        else {
            node.temp[layer - node.minRank - 1] = value;
        }
    };
    /**
     * Sets the position of the vertex
     * @private
     */
    HierarchicalLayoutUtil.prototype.setXY = function (node, layer, value, isY) {
        if (node && node.cell) {
            if (node.cell.inEdges || node.cell.outEdges) {
                if (isY) {
                    node.y[0] = value;
                }
                else {
                    node.x[0] = value;
                }
            }
            else {
                if (isY) {
                    node.y[layer - node.minRank - 1] = value;
                }
                else {
                    node.x[layer - node.minRank - 1] = value;
                }
            }
        }
    };
    /**
     * Sets geometry position of the layout node on the layout model
     */
    HierarchicalLayoutUtil.prototype.rankCoordinates = function (stage, rankValue, graph, model) {
        var isHorizontal = false;
        if (stage.model.layout.orientation === 'LeftToRight' || stage.model.layout.orientation === 'RightToLeft') {
            isHorizontal = true;
        }
        var rank = model.ranks[rankValue];
        var maxOffset = 0.0;
        var localOffset = (isHorizontal ? stage.marginY : stage.marginX) + (stage.widestRankValue - stage.rankSizes[rankValue]) / 2;
        for (var i = 0; i < rank.length; i++) {
            var node = rank[i];
            if (this.crossReduction.isVertex(node)) {
                var obj = this.nameTable[node.cell.name];
                node.width = obj.actualSize.width;
                node.height = obj.actualSize.height;
                maxOffset = Math.max(maxOffset, node.height);
            }
            else {
                var edge = node;
                var numEdges = 1;
                if (edge.edges != null) {
                    numEdges = edge.edges.length;
                }
                if (isHorizontal) {
                    node.height = (numEdges - 1) * 10;
                }
                else {
                    node.width = (numEdges - 1) * 10;
                }
            }
            var size = (isHorizontal ? node.height : node.width) / 2.0;
            localOffset += size;
            this.setXY(node, rankValue, localOffset, isHorizontal ? true : false);
            this.setTempVariable(node, rankValue, localOffset);
            localOffset += (size + stage.horizontalSpacing);
        }
    };
    /**
     * sets the layout in an initial positioning.it will arange all the ranks as much as possible
     */
    HierarchicalLayoutUtil.prototype.initialCoords = function (plalementChange, facade, model) {
        this.calculateWidestRank(plalementChange, facade, model);
        // Reverse sweep direction each time from widest rank 
        for (var i = plalementChange.widestRank; i >= 0; i--) {
            if (i < model.maxRank) {
                this.rankCoordinates(plalementChange, i, facade, model);
            }
        }
        for (var i = plalementChange.widestRank + 1; i <= model.maxRank; i++) {
            if (i > 0) {
                this.rankCoordinates(plalementChange, i, facade, model);
            }
        }
    };
    /**
     * Checks whether the given node is an ancestor
     * @private
     */
    HierarchicalLayoutUtil.prototype.isAncestor = function (node, otherNode) {
        // Firstly, the hash code of this node needs to be shorter than the other node
        if (otherNode != null && node.hashCode != null && otherNode.hashCode != null
            && node.hashCode.length < otherNode.hashCode.length) {
            if (node.hashCode === otherNode.hashCode) {
                return true;
            }
            if (node.hashCode == null || node.hashCode == null) {
                return false;
            }
            for (var i = 0; i < node.hashCode.length; i++) {
                if (node.hashCode[i] !== otherNode.hashCode[i]) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };
    /**
     * initializes the sorter object
     */
    HierarchicalLayoutUtil.prototype.weightedCellSorter = function (cell, weightedValue) {
        var weightedCellSorter = {};
        weightedCellSorter.cell = cell ? cell : null;
        weightedCellSorter.weightedValue = weightedValue ? weightedValue : 0;
        weightedCellSorter.visited = false;
        weightedCellSorter.rankIndex = null;
        return weightedCellSorter;
    };
    /**
     * Performs one node positioning in both directions
     */
    HierarchicalLayoutUtil.prototype.minNode = function (plalementChange, model) {
        var nodeList = [];
        var map = { map: {} };
        var rank = [];
        for (var i = 0; i <= model.maxRank; i++) {
            rank[i] = model.ranks[i];
            for (var j = 0; j < rank[i].length; j++) {
                var node = rank[i][j];
                var nodeWrapper = this.weightedCellSorter(node, i);
                nodeWrapper.rankIndex = j;
                nodeWrapper.visited = true;
                nodeList.push(nodeWrapper);
                model.setDictionaryForSorter(map, node, nodeWrapper, true);
            }
        }
        var maxTries = nodeList.length * 10;
        var count = 0;
        var tolerance = 1;
        while (nodeList.length > 0 && count <= maxTries) {
            var cellWrapper = nodeList.shift();
            var cell = cellWrapper.cell;
            var rankValue = cellWrapper.weightedValue;
            var rankIndex = cellWrapper.rankIndex;
            var nextLayerConnectedCells = this.crossReduction.getConnectedCellsOnLayer(cell, rankValue);
            var previousLayerConnectedCells = this.crossReduction.getConnectedCellsOnLayer(cell, rankValue, true);
            var nextConnectedCount = nextLayerConnectedCells.length;
            var prevConnectedCount = previousLayerConnectedCells.length;
            var medianNextLevel = this.medianXValue(plalementChange, nextLayerConnectedCells, rankValue + 1);
            var medianPreviousLevel = this.medianXValue(plalementChange, previousLayerConnectedCells, rankValue - 1);
            var numConnectedNeighbours = nextConnectedCount + prevConnectedCount;
            var currentPosition = this.crossReduction.getTempVariable(cell, rankValue);
            var cellMedian = currentPosition;
            if (numConnectedNeighbours > 0) {
                cellMedian = (medianNextLevel * nextConnectedCount + medianPreviousLevel * prevConnectedCount) / numConnectedNeighbours;
            }
            if (nextConnectedCount === 1 && prevConnectedCount === 1) {
                cellMedian = (medianPreviousLevel * prevConnectedCount) / prevConnectedCount;
            }
            else if (nextConnectedCount === 1) {
                cellMedian = (medianNextLevel * nextConnectedCount) / nextConnectedCount;
            }
            var positionChanged = false;
            var tempValue = undefined;
            if (cellMedian < currentPosition - tolerance) {
                if (rankIndex === 0) {
                    tempValue = cellMedian;
                    positionChanged = true;
                }
                else {
                    var leftCell = rank[rankValue][rankIndex - 1];
                    var leftLimit = this.crossReduction.getTempVariable(leftCell, rankValue);
                    leftLimit = leftLimit + leftCell.width / 2 + plalementChange.intraCellSpacing + cell.width / 2;
                    if (leftLimit < cellMedian) {
                        tempValue = cellMedian;
                        positionChanged = true;
                    }
                    else if (leftLimit < this.crossReduction.getTempVariable(cell, rankValue) - tolerance) {
                        tempValue = leftLimit;
                        positionChanged = true;
                    }
                }
            }
            else if (cellMedian > currentPosition + tolerance) {
                var rankSize = rank[rankValue].length;
                if (rankIndex === rankSize - 1) {
                    tempValue = cellMedian;
                    positionChanged = true;
                }
                else {
                    var rightCell = rank[rankValue][rankIndex + 1];
                    var rightLimit = this.crossReduction.getTempVariable(rightCell, rankValue);
                    rightLimit = rightLimit - rightCell.width / 2 - plalementChange.intraCellSpacing - cell.width / 2;
                    if (rightLimit > cellMedian) {
                        tempValue = cellMedian;
                        positionChanged = true;
                    }
                    else if (rightLimit > this.crossReduction.getTempVariable(cell, rankValue) + tolerance) {
                        tempValue = rightLimit;
                        positionChanged = true;
                    }
                }
            }
            if (positionChanged) {
                this.setTempVariable(cell, rankValue, tempValue);
                // Add connected nodes to map and list
                this.updateNodeList(nodeList, map, nextLayerConnectedCells, model);
                this.updateNodeList(nodeList, map, previousLayerConnectedCells, model);
            }
            if (this.crossReduction.isVertex(cellWrapper.cell)) {
                cellWrapper.visited = false;
            }
            count++;
        }
    };
    /**
     * Updates the ndoes collection
     */
    HierarchicalLayoutUtil.prototype.updateNodeList = function (nodeList, map, collection, model) {
        for (var i = 0; i < collection.length; i++) {
            var connectedCell = collection[i];
            var connectedCellWrapper = model.getDictionaryForSorter(map, connectedCell);
            if (connectedCellWrapper != null) {
                if (connectedCellWrapper.visited === false) {
                    connectedCellWrapper.visited = true;
                    nodeList.push(connectedCellWrapper);
                }
            }
        }
    };
    /**
     * Calculates the node position of the connected cell on the specified rank
     */
    HierarchicalLayoutUtil.prototype.medianXValue = function (plalementChange, connectedCells, rankValue) {
        if (connectedCells.length === 0) {
            return 0;
        }
        var medianValues = [];
        for (var i = 0; i < connectedCells.length; i++) {
            medianValues[i] = this.crossReduction.getTempVariable(connectedCells[i], rankValue);
        }
        medianValues.sort(function (a, b) {
            return a - b;
        });
        if (connectedCells.length % 2 === 1) {
            return medianValues[Math.floor(connectedCells.length / 2)];
        }
        else {
            var medianPoint = connectedCells.length / 2;
            var leftMedian = medianValues[medianPoint - 1];
            var rightMedian = medianValues[medianPoint];
            return ((leftMedian + rightMedian) / 2);
        }
    };
    /**
     * Updates the geometry of the vertices
     */
    HierarchicalLayoutUtil.prototype.placementStageExecute = function (plalementChange) {
        var isHorizontal = false;
        if (plalementChange.model.layout.orientation === 'LeftToRight' || plalementChange.model.layout.orientation === 'RightToLeft') {
            isHorizontal = true;
        }
        plalementChange.jettyPositions = {};
        var model = plalementChange.model;
        isHorizontal ? plalementChange.currentYDelta = 0.0 : plalementChange.currentXDelta = 0.0;
        this.initialCoords(plalementChange, { model: model }, model);
        this.minNode(plalementChange, model);
        var bestOffsetDelta = 100000000.0;
        if (!plalementChange.maxIterations) {
            plalementChange.maxIterations = 8;
        }
        for (var i = 0; i < plalementChange.maxIterations; i++) {
            // if the total offset is less for the current positioning, 
            //there are less heavily angled edges and so the current positioning is used
            if ((isHorizontal ? plalementChange.currentYDelta : plalementChange.currentXDelta) < bestOffsetDelta) {
                for (var j = 0; j < model.ranks.length; j++) {
                    var rank = model.ranks[j];
                    for (var k = 0; k < rank.length; k++) {
                        var cell = rank[k];
                        this.setXY(cell, j, this.crossReduction.getTempVariable(cell, j), isHorizontal ? true : false);
                    }
                }
                bestOffsetDelta = isHorizontal ? plalementChange.currentYDelta : plalementChange.currentXDelta;
            }
            isHorizontal ? plalementChange.currentYDelta = 0 : plalementChange.currentXDelta = 0;
        }
        this.setCellLocations(plalementChange, model);
    };
    /**
     * sets the cell position in the after the layout operation
     */
    HierarchicalLayoutUtil.prototype.setCellLocations = function (plalementChange, model) {
        var vertices = this.getValues(model.vertexMapper);
        for (var i = 0; i < vertices.length; i++) {
            this.setVertexLocation(plalementChange, vertices[i]);
        }
    };
    /**
     * used to specify the geometrical position of the layout model cell
     */
    HierarchicalLayoutUtil.prototype.garphModelsetVertexLocation = function (plalementChange, cell, x, y) {
        var model = plalementChange.model;
        var geometry = cell.geometry;
        var result = null;
        if (geometry != null) {
            result = { x: x, y: y, width: geometry.width, height: geometry.height };
            if (geometry.x !== x || geometry.y !== y) {
                cell.geometry = result;
            }
        }
        return result;
    };
    /**
     * set the position of the specified node
     */
    HierarchicalLayoutUtil.prototype.setVertexLocation = function (plalementChange, cell) {
        var isHorizontal = false;
        if (plalementChange.model.layout.orientation === 'LeftToRight' || plalementChange.model.layout.orientation === 'RightToLeft') {
            isHorizontal = true;
        }
        var realCell = cell.cell;
        var positionX = cell.x[0] - cell.width / 2;
        var positionY = cell.y[0] - cell.height / 2;
        this.garphModelsetVertexLocation(plalementChange, realCell, positionX, positionY);
        if (isHorizontal) {
            if (!plalementChange.marginY) {
                plalementChange.marginY = 0;
            }
            plalementChange.marginY = Math.max(plalementChange.marginY, positionY + cell.height);
        }
        else {
            if (!plalementChange.marginX) {
                plalementChange.marginX = 0;
            }
            plalementChange.marginX = Math.max(plalementChange.marginX, positionX + cell.width);
        }
    };
    /**
     * get the specific value from the key value pair
     */
    HierarchicalLayoutUtil.prototype.getValues = function (mapper) {
        var list = [];
        if (mapper.map) {
            for (var _i = 0, _a = Object.keys(mapper.map); _i < _a.length; _i++) {
                var key = _a[_i];
                list.push(mapper.map[key]);
            }
        }
        return list;
    };
    /**
     * Checks and reduces the crosses in between line segments
     */
    HierarchicalLayoutUtil.prototype.crossingStage = function (model) {
        this.crossReduction.execute(model);
    };
    /**
     * Initializes the ranks of the vertices
     */
    HierarchicalLayoutUtil.prototype.layeringStage = function (model) {
        this.initialRank(model);
        this.fixRanks(model);
    };
    /**
     * determine the initial rank for the each vertex on the relevent direction
     */
    HierarchicalLayoutUtil.prototype.initialRank = function (model) {
        var startNodes = model.startNodes;
        var internalNodes = model.getDictionaryValues(model.vertexMapper);
        var startNodesCopy = startNodes.slice();
        while (startNodes.length > 0) {
            var internalNode = startNodes[0];
            var layerDeterminingEdges = internalNode.connectsAsTarget;
            var edgesToBeMarked = internalNode.connectsAsSource;
            var allEdgesScanned = true;
            var minimumLayer = 100000000;
            for (var i = 0; i < layerDeterminingEdges.length; i++) {
                var internalEdge = layerDeterminingEdges[i];
                if (internalEdge.temp[0] === 5270620) {
                    // This edge has been scanned, get the layer of the node on the other end
                    var otherNode = internalEdge.source;
                    minimumLayer = Math.min(minimumLayer, otherNode.temp[0] - 1);
                }
                else {
                    allEdgesScanned = false;
                    break;
                }
            }
            // If all edge have been scanned, assign the layer, mark all edges in the other direction and remove from the nodes list
            if (allEdgesScanned) {
                internalNode.temp[0] = minimumLayer;
                if (!model.maxRank) {
                    model.maxRank = 100000000;
                }
                model.maxRank = Math.min(model.maxRank, minimumLayer);
                if (edgesToBeMarked != null) {
                    for (var i = 0; i < edgesToBeMarked.length; i++) {
                        var internalEdge = edgesToBeMarked[i];
                        internalEdge.temp[0] = 5270620;
                        // Add node on other end of edge to LinkedList of nodes to be analysed
                        var otherNode = internalEdge.target;
                        // Only add node if it hasn't been assigned a layer
                        if (otherNode.temp[0] === -1) {
                            startNodes.push(otherNode);
                            // Mark this other node as neither being unassigned nor assigned 
                            //so it isn't added to this list again, but it's layer isn't used in any calculation.
                            otherNode.temp[0] = -2;
                        }
                    }
                }
                startNodes.shift();
            }
            else {
                // Not all the edges have been scanned, get to the back of the class and put the dunces cap on
                var removedCell = startNodes.shift();
                startNodes.push(internalNode);
                if (removedCell === internalNode && startNodes.length === 1) {
                    // This is an error condition, we can't get out of this loop. 
                    //It could happen for more than one node but that's a lot harder to detect. Log the error
                    break;
                }
            }
        }
        for (var i = 0; i < internalNodes.length; i++) {
            internalNodes[i].temp[0] -= model.maxRank;
        }
        for (var i = 0; i < startNodesCopy.length; i++) {
            var internalNode = startNodesCopy[i];
            var currentMaxLayer = 0;
            var layerDeterminingEdges = internalNode.connectsAsSource;
            for (var j = 0; j < layerDeterminingEdges.length; j++) {
                var internalEdge = layerDeterminingEdges[j];
                var otherNode = internalEdge.target;
                internalNode.temp[0] = Math.max(currentMaxLayer, otherNode.temp[0] + 1);
                currentMaxLayer = internalNode.temp[0];
            }
        }
        model.maxRank = 100000000 - model.maxRank;
    };
    /**
     * used to set the optimum value of each vertex on the layout
     */
    HierarchicalLayoutUtil.prototype.fixRanks = function (model) {
        model.fixRanks();
    };
    /**
     * used to determine any cyclic stage have been created on the layout model
     */
    HierarchicalLayoutUtil.prototype.cycleStage = function (model) {
        var seenNodes = {};
        model.startNodes = [];
        var unseenNodesArray = model.getDictionaryValues(model.vertexMapper);
        var unseenNodes = [];
        for (var i = 0; i < unseenNodesArray.length; i++) {
            unseenNodesArray[i].temp[0] = -1;
            unseenNodes[unseenNodesArray[i].id] = unseenNodesArray[i];
        }
        var rootsArray = null;
        if (model.roots != null) {
            var modelRoots = model.roots;
            rootsArray = [];
            for (var i = 0; i < modelRoots.length; i++) {
                rootsArray[i] = model.getDictionary(model.vertexMapper, modelRoots[i]);
                if (rootsArray[i] != null) {
                    model.startNodes.push(rootsArray[i]);
                }
            }
        }
        model.visit('removeParentConnection', rootsArray, true, null, { seenNodes: seenNodes, unseenNodes: unseenNodes });
        var seenNodesCopy = model.clone(seenNodes, null, true);
        model.visit('removeNodeConnection', unseenNodes, true, seenNodesCopy, { seenNodes: seenNodes, unseenNodes: unseenNodes });
    };
    /**
     * removes the edge from the given collection
     * @private
     */
    HierarchicalLayoutUtil.prototype.remove = function (obj, array) {
        var index = array.indexOf(obj);
        if (index !== -1) {
            array.splice(index, 1);
        }
        return obj;
    };
    /**
     * Inverts the source and target of an edge
     * @private
     */
    HierarchicalLayoutUtil.prototype.invert = function (connectingEdge, layer) {
        var temp = connectingEdge.source;
        connectingEdge.source = connectingEdge.target;
        connectingEdge.target = temp;
        connectingEdge.isReversed = !connectingEdge.isReversed;
    };
    /**
     * used to get the edges between the given source and target
     * @private
     */
    HierarchicalLayoutUtil.prototype.getEdgesBetween = function (source, target, directed) {
        directed = (directed != null) ? directed : false;
        var edges = this.getEdges(source);
        var result = [];
        for (var i = 0; i < edges.length; i++) {
            var src = this.getVisibleTerminal(edges[i], true);
            var trg = this.getVisibleTerminal(edges[i], false);
            if ((src === source && trg === target) || (!directed && src === target && trg === source)) {
                result.push(edges[i]);
            }
        }
        return result;
    };
    return HierarchicalLayoutUtil;
}());
/**
 * Handles position the objects in a hierarchical tree structure
 */
var MultiParentModel = /** @class */ (function () {
    function MultiParentModel(layout, vertices, roots, dlayout) {
        this.multiObjectIdentityCounter = 0;
        //used to count the no of times the parent have been used
        this.dfsCount = 0;
        this.hierarchicalUtil = new HierarchicalLayoutUtil();
        this.roots = roots;
        this.vertexMapper = { map: {} };
        var internalVertices = [];
        this.layout = dlayout;
        this.maxRank = 100000000;
        this.hierarchicalLayout = layout;
        this.createInternalCells(layout, vertices, internalVertices);
        for (var i = 0; i < vertices.length; i++) {
            var edges = internalVertices[i].connectsAsSource;
            for (var j = 0; j < edges.length; j++) {
                var internalEdge = edges[j];
                var realEdges = internalEdge.edges;
                if (realEdges != null && realEdges.length > 0) {
                    var realEdge = realEdges[0];
                    var targetCell = layout.getVisibleTerminal(realEdge, false);
                    var internalTargetCell = this.getDictionary(this.vertexMapper, targetCell);
                    if (internalVertices[i] === internalTargetCell) {
                        targetCell = layout.getVisibleTerminal(realEdge, true);
                        internalTargetCell = this.getDictionary(this.vertexMapper, targetCell);
                    }
                    if (internalTargetCell != null && internalVertices[i] !== internalTargetCell) {
                        internalEdge.target = internalTargetCell;
                        if (internalTargetCell.connectsAsTarget.length === 0) {
                            internalTargetCell.connectsAsTarget = [];
                        }
                        if (internalTargetCell.connectsAsTarget.indexOf(internalEdge) < 0) {
                            internalTargetCell.connectsAsTarget.push(internalEdge);
                        }
                    }
                }
            }
            internalVertices[i].temp[0] = 1;
        }
    }
    /**
     * used to create the duplicate of the edges on the layout model
     */
    MultiParentModel.prototype.createInternalCells = function (layout, vertices, internalVertices) {
        for (var i = 0; i < vertices.length; i++) {
            internalVertices[i] = {
                x: [], y: [], temp: [], cell: vertices[i],
                id: vertices[i].name, connectsAsTarget: [], connectsAsSource: [], type: 'internalVertex'
            };
            this.setDictionary(this.vertexMapper, vertices[i], internalVertices[i]);
            var conns = layout.getEdges(vertices[i]);
            internalVertices[i].connectsAsSource = [];
            for (var j = 0; j < conns.length; j++) {
                var cell = layout.getVisibleTerminal(conns[j], false);
                if (cell !== vertices[i]) {
                    var undirectedEdges = layout.getEdgesBetween(vertices[i], cell, false);
                    var directedEdges = layout.getEdgesBetween(vertices[i], cell, true);
                    if (undirectedEdges != null && undirectedEdges.length > 0 && directedEdges.length * 2 >= undirectedEdges.length) {
                        var internalEdge = { x: [], y: [], temp: [], edges: undirectedEdges, ids: [] };
                        for (var m = 0; m < undirectedEdges.length; m++) {
                            internalEdge.ids.push(undirectedEdges[m].id);
                        }
                        internalEdge.source = internalVertices[i];
                        if (!internalVertices[i].connectsAsSource) {
                            internalVertices[i].connectsAsSource = [];
                        }
                        if (internalVertices[i].connectsAsSource.indexOf(internalEdge) < 0) {
                            internalVertices[i].connectsAsSource.push(internalEdge);
                        }
                    }
                }
            }
            internalVertices[i].temp[0] = 0;
        }
    };
    /**
     * used to set the optimum value of each vertex on the layout
     * @private
     */
    MultiParentModel.prototype.fixRanks = function () {
        var rankList = [];
        this.ranks = [];
        for (var i = 0; i < this.maxRank + 1; i++) {
            rankList[i] = [];
            this.ranks[i] = rankList[i];
        }
        var rootsArray = null;
        if (this.roots != null) {
            var oldRootsArray = this.roots;
            rootsArray = [];
            for (var i = 0; i < oldRootsArray.length; i++) {
                var cell = oldRootsArray[i];
                var internalNode = this.getDictionary(this.vertexMapper, cell);
                rootsArray[i] = internalNode;
            }
        }
        this.visit('updateMinMaxRank', rootsArray, false, null, { seenNodes: null, unseenNodes: null, rankList: rankList });
    };
    /**
     * Updates the min/max rank of the layer
     */
    MultiParentModel.prototype.updateMinMaxRank = function (layer, seen, data) {
        var seenNodes = data.seenNodes;
        var unseenNodes = data.unseenNodes;
        var parent = data.parent;
        var node = data.root;
        var edge = data.edge;
        var rankList = data.rankList;
        if (!node.maxRank && node.maxRank !== 0) {
            node.maxRank = -1;
        }
        if (!node.minRank && node.minRank !== 0) {
            node.minRank = -1;
        }
        if (seen === 0 && node.maxRank < 0 && node.minRank < 0) {
            rankList[node.temp[0]].push(node);
            node.maxRank = node.temp[0];
            node.minRank = node.temp[0];
            node.temp[0] = rankList[node.maxRank].length - 1;
        }
        if (parent != null && edge != null) {
            var parentToCellRankDifference = parent.maxRank - node.maxRank;
            if (parentToCellRankDifference > 1) {
                edge.maxRank = parent.maxRank;
                edge.minRank = node.maxRank;
                edge.temp = [];
                edge.x = [];
                edge.y = [];
                for (var i = edge.minRank + 1; i < edge.maxRank; i++) {
                    rankList[i].push(edge);
                    this.hierarchicalUtil.setTempVariable(edge, i, rankList[i].length - 1);
                }
            }
        }
    };
    /**
     * used to store the value of th given key on the object
     */
    MultiParentModel.prototype.setDictionary = function (dic, key, value) {
        var id = key.name;
        if (!id) {
            //  id = this._getDictionary(dic, key);
        }
        var previous = dic.map[id];
        dic.map[id] = value;
        return previous;
    };
    /**
     * used to store the value of th given key on the object
     * @private
     */
    MultiParentModel.prototype.setDictionaryForSorter = function (dic, key, value, flag) {
        var id = key.id;
        if (!id) {
            //id = this._getDictionaryForSorter(dic, key);
        }
        var previous = dic.map[id];
        dic.map[id] = value;
        return previous;
    };
    /**
     * used to get the value of the given key
     * @private
     */
    MultiParentModel.prototype.getDictionary = function (dic, key) {
        if (!this.multiObjectIdentityCounter && this.multiObjectIdentityCounter !== 0) {
            this.multiObjectIdentityCounter = 0;
        }
        var id = key.name;
        if (!id) {
            if (!key.layoutObjectId) { ///####
                key.layoutObjectId = 'graphHierarchyNode#' + this.multiObjectIdentityCounter++;
                return key.layoutObjectId;
            }
            else {
                return dic.map[key.layoutObjectId];
            }
        }
        return dic.map[id];
    };
    /**
     * used to get the value of the given key
     * @private
     */
    MultiParentModel.prototype.getDictionaryForSorter = function (dic, key) {
        if (!this.multiObjectIdentityCounter && this.multiObjectIdentityCounter !== 0) {
            this.multiObjectIdentityCounter = 0;
        }
        var id = key.id;
        if (!id) {
            if (!key.layoutObjectId) { ///####
                key.layoutObjectId = 'graphHierarchyNode#' + this.multiObjectIdentityCounter++;
                return key.layoutObjectId;
            }
            else {
                return dic.map[key.layoutObjectId];
            }
        }
        return dic.map[id];
    };
    /**
     * used to get all the values of the dictionary object
     * @private
     */
    MultiParentModel.prototype.getDictionaryValues = function (dic) {
        var result = [];
        for (var _i = 0, _a = Object.keys(dic.map); _i < _a.length; _i++) {
            var key = _a[_i];
            result.push(dic.map[key]);
        }
        return result;
    };
    /**
     * used to visit all the entries on the given dictionary with given function
     * @private
     */
    MultiParentModel.prototype.visit = function (visitor, dfsRoots, trackAncestors, seenNodes, data) {
        var seenNodes1 = data.seenNodes;
        var unseenNodes1 = data.unseenNodes;
        var rankList = data.rankList;
        // Run depth first search through on all roots
        if (dfsRoots != null) {
            for (var i = 0; i < dfsRoots.length; i++) {
                var internalNode = dfsRoots[i];
                if (internalNode != null) {
                    if (seenNodes == null) {
                        seenNodes = new Object();
                    }
                    data.parent = null;
                    data.root = internalNode;
                    data.edge = null;
                    if (trackAncestors) {
                        // Set up hash code for root
                        internalNode.hashCode = [];
                        internalNode.hashCode[0] = this.dfsCount;
                        internalNode.hashCode[1] = i;
                        this.extendedDfs(visitor, seenNodes, i, 0, data);
                    }
                    else {
                        this.depthFirstSearch(visitor, seenNodes, 0, data);
                    }
                }
            }
            this.dfsCount++;
        }
    };
    /**
     * used to perform the depth fisrt search on the layout model
     */
    MultiParentModel.prototype.depthFirstSearch = function (visitor, seen, layer, data) {
        var seenNodes1 = data.seenNodes;
        var unseenNodes1 = data.unseenNodes;
        var rankList = data.rankList;
        var parent = data.parent;
        var root = data.root;
        var edge = data.edge;
        if (root != null) {
            var rootId = root.id;
            if (seen[rootId] == null) {
                seen[rootId] = root;
                this.updateConnectionRank(visitor, layer, 0, data);
                // Copy the connects as source list so that visitors can change the original for edge direction inversions
                var outgoingEdges = root.connectsAsSource.slice();
                for (var i = 0; i < outgoingEdges.length; i++) {
                    var internalEdge = outgoingEdges[i];
                    var targetNode = internalEdge.target;
                    // Root check is O(|roots|)
                    data.parent = root;
                    data.root = targetNode;
                    data.edge = internalEdge;
                    this.depthFirstSearch(visitor, seen, layer + 1, data);
                }
            }
            else {
                this.updateConnectionRank(visitor, layer, 1, data);
            }
        }
    };
    /**
     * Updates the rank of the connection
     */
    MultiParentModel.prototype.updateConnectionRank = function (visitor, layer, seen, traversedList) {
        var parent = traversedList.parent;
        var root = traversedList.root;
        var edge = traversedList.edge;
        if (visitor === 'removeParentConnection' || visitor === 'removeNodeConnection') {
            var remove = visitor === 'removeNodeConnection' ? true : false;
            this.removeConnectionEdge(parent, root, edge, layer, traversedList, remove);
        }
        if (visitor === 'updateMinMaxRank') {
            this.updateMinMaxRank(layer, seen, traversedList);
        }
    };
    /**
     * Removes the edge from the collection
     */
    MultiParentModel.prototype.removeConnectionEdge = function (parent, node, edge, layer, data, remove) {
        var seenNodes = data.seenNodes;
        var unseenNodes = data.unseenNodes;
        var rankList = data.rankList;
        if (this.hierarchicalUtil.isAncestor(node, parent)) {
            this.hierarchicalUtil.invert(edge, 0);
            this.hierarchicalUtil.remove(edge, parent.connectsAsSource);
            if (remove) {
                node.connectsAsSource.push(edge);
                parent.connectsAsTarget.push(edge);
                this.hierarchicalUtil.remove(edge, node.connectsAsTarget);
            }
            else {
                parent.connectsAsTarget.push(edge);
                this.hierarchicalUtil.remove(edge, node.connectsAsTarget);
                node.connectsAsSource.push(edge);
            }
        }
        seenNodes[node.id] = node;
        delete unseenNodes[node.id];
    };
    /**
     * the dfs extends the default version by keeping track of cells ancestors, but it should be only used when necessary
     */
    MultiParentModel.prototype.extendedDfs = function (visitor, seen, cHash, layer, data) {
        var seenNodes = data.seenNodes;
        var unseenNodes = data.unseenNodes;
        var rankList = data.rankList;
        var parent = data.parent;
        var root = data.root;
        var edge = data.edge;
        if (root != null) {
            if (parent != null) {
                if (root.hashCode == null ||
                    root.hashCode[0] !== parent.hashCode[0]) {
                    var hashCodeLength = parent.hashCode.length + 1;
                    root.hashCode = parent.hashCode.slice();
                    root.hashCode[hashCodeLength - 1] = cHash;
                }
            }
            var rootId = root.id;
            if (seen[rootId] == null) {
                seen[rootId] = root;
                this.updateConnectionRank(visitor, layer, 0, data);
                var outgoingEdges = root.connectsAsSource.slice();
                for (var i = 0; i < outgoingEdges.length; i++) {
                    var internalEdge = outgoingEdges[i];
                    var targetNode = internalEdge.target;
                    data.parent = root;
                    data.root = targetNode;
                    data.edge = internalEdge;
                    this.extendedDfs(visitor, seen, i, layer + 1, data);
                }
            }
            else {
                this.updateConnectionRank(visitor, layer, 1, data);
            }
        }
    };
    /**
     * used to clone the specified object ignoring all fieldnames in the given array of transient fields
     * @private
     */
    MultiParentModel.prototype.clone = function (obj, transients, shallow) {
        shallow = (shallow != null) ? shallow : false;
        if (obj != null && typeof (obj.constructor) === 'function') {
            var clonedObj = obj.constructor();
            for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
                var i = _a[_i];
                if (i !== 'layoutObjectId' && (transients == null || transients.indexOf(i) < 0)) {
                    if (!shallow && typeof (obj[i]) === 'object') {
                        //not used
                        //  _clone[i] = $.extend(true, {}, obj[i]);
                    }
                    else {
                        clonedObj[i] = obj[i];
                    }
                }
            }
            return clonedObj;
        }
        return null;
    };
    return MultiParentModel;
}());
/**
 * Defines how to reduce the crosses in between the line segments
 */
var CrossReduction = /** @class */ (function () {
    function CrossReduction() {
    }
    /**
     * used to calculate the number of edges crossing the layout model
     * @param {MultiParentModel} model
     */
    CrossReduction.prototype.calculateCrossings = function (model) {
        var numRanks = model.ranks.length;
        var totalCrossings = 0;
        for (var i = 1; i < numRanks; i++) {
            totalCrossings += this.calculateRankCrossing(i, model);
        }
        return totalCrossings;
    };
    /**
     * used to get the temp value specified for the node or connector
     * @private
     */
    CrossReduction.prototype.getTempVariable = function (node, layer) {
        if (node) {
            if (this.isVertex(node)) {
                return node.temp[0];
            }
            else {
                return node.temp[layer - node.minRank - 1];
            }
        }
        return 0;
    };
    /**
     * used to specify the number of conenctors crossing between the specified rank and its below rank
     */
    CrossReduction.prototype.calculateRankCrossing = function (i, model) {
        var totalCrossings = 0;
        var rank = model.ranks[i];
        var previousRank = model.ranks[i - 1];
        var tmpIndices = [];
        // Iterate over the top rank and fill in the connection information
        for (var j = 0; j < rank.length; j++) {
            var node = rank[j];
            var rankPosition = this.getTempVariable(node, i);
            var connectedCells = this.getConnectedCellsOnLayer(node, i, true);
            ///#### 
            var nodeIndices = [];
            for (var k = 0; k < connectedCells.length; k++) {
                var connectedNode = connectedCells[k];
                var otherCellRankPosition = this.getTempVariable(connectedNode, i - 1);
                nodeIndices.push(otherCellRankPosition);
            }
            nodeIndices.sort(function (x, y) { return x - y; });
            tmpIndices[rankPosition] = nodeIndices;
        }
        var indices = [];
        for (var j = 0; j < tmpIndices.length; j++) {
            indices = indices.concat(tmpIndices[j]);
        }
        var firstIndex = 1;
        while (firstIndex < previousRank.length) {
            firstIndex <<= 1;
        }
        var treeSize = 2 * firstIndex - 1;
        firstIndex -= 1;
        var tree = [];
        for (var j = 0; j < treeSize; ++j) {
            tree[j] = 0;
        }
        for (var j = 0; j < indices.length; j++) {
            var index = indices[j];
            var treeIndex = index + firstIndex;
            ++tree[treeIndex];
            while (treeIndex > 0) {
                if (treeIndex % 2) {
                    totalCrossings += tree[treeIndex + 1];
                }
                treeIndex = (treeIndex - 1) >> 1;
                ++tree[treeIndex];
            }
        }
        return totalCrossings;
    };
    /**
     * Calculates and reduces the crosses between line segments
     * @private
     */
    CrossReduction.prototype.execute = function (model) {
        // Stores initial ordering 
        this.nestedBestRanks = [];
        for (var i = 0; i < model.ranks.length; i++) {
            this.nestedBestRanks[i] = model.ranks[i].slice();
        }
        var iterationsWithoutImprovement = 0;
        var currentBestCrossings = this.calculateCrossings(model);
        for (var i = 0; i < 24 && iterationsWithoutImprovement < 2; i++) {
            this.weightedMedian(i, model);
            var candidateCrossings = this.calculateCrossings(model);
            if (candidateCrossings < currentBestCrossings) {
                currentBestCrossings = candidateCrossings;
                iterationsWithoutImprovement = 0;
                for (var j = 0; j < this.nestedBestRanks.length; j++) {
                    var rank = model.ranks[j];
                    for (var k = 0; k < rank.length; k++) {
                        var cell = rank[k];
                        var obj = this.nestedBestRanks[j][cell.temp[0]];
                        var check = true;
                        if (cell.edges && obj && !obj.edges) {
                            check = false;
                        }
                        if (obj && check) {
                            this.nestedBestRanks[j][cell.temp[0]] = cell;
                        }
                    }
                }
            }
            else {
                // Increase count of iterations
                iterationsWithoutImprovement++;
                // Restore the best values to the cells
                for (var j = 0; j < this.nestedBestRanks.length; j++) {
                    var rank = model.ranks[j];
                    for (var k = 0; k < rank.length; k++) {
                        var cell = rank[k];
                        this.setTempVariable(cell, j, k);
                    }
                }
            }
            if (currentBestCrossings === 0) {
                break;
            }
        }
        // Store the best rankings but in the model
        var ranks = [];
        var rankList = [];
        for (var i = 0; i < model.maxRank + 1; i++) {
            rankList[i] = [];
            ranks[i] = rankList[i];
        }
        for (var i = 0; i < this.nestedBestRanks.length; i++) {
            for (var j = 0; j < this.nestedBestRanks[i].length; j++) {
                rankList[i].push(this.nestedBestRanks[i][j]);
            }
        }
        model.ranks = ranks;
    };
    /**
     * check whether the object is vertext or edge on the layout model.
     * @private
     */
    CrossReduction.prototype.isVertex = function (node) {
        if (node && node.cell && (node.cell.inEdges || node.cell.outEdges)) {
            return true;
        }
        return false;
    };
    /**
     * used to move up or move down the node position on the adjacent ranks
     */
    CrossReduction.prototype.weightedMedian = function (iteration, model) {
        // Reverse sweep direction each time through this method
        var downwardSweep = (iteration % 2 === 0);
        if (downwardSweep) {
            for (var j = model.maxRank - 1; j >= 0; j--) {
                this.medianRank(j, downwardSweep);
            }
        }
        else {
            for (var j = 1; j < model.maxRank; j++) {
                this.medianRank(j, downwardSweep);
            }
        }
    };
    /**
     * used to get the node next(up) connected to the specified node or connector
     * @private
     */
    CrossReduction.prototype.getConnectedCellsOnLayer = function (cell, layer, isPrevious) {
        if (isPrevious === void 0) { isPrevious = false; }
        var connectedlayer = 'nextLayerConnectedCells';
        var connectedAs = 'connectsAsTarget';
        if (isPrevious) {
            connectedlayer = 'previousLayerConnectedCells';
            connectedAs = 'connectsAsSource';
        }
        if (cell) {
            if (this.isVertex(cell)) {
                if (cell[connectedlayer] == null) {
                    cell[connectedlayer] = [];
                    cell[connectedlayer][0] = [];
                    for (var i = 0; i < cell[connectedAs].length; i++) {
                        var edge = cell[connectedAs][i];
                        if (edge.maxRank === undefined) {
                            edge.maxRank = -1;
                        }
                        if (edge.maxRank === -1 || (isPrevious ? (edge.minRank === layer - 1) : (edge.maxRank === layer + 1))) {
                            // Either edge is not in any rank or no dummy nodes in edge, add node of other side of edge
                            cell[connectedlayer][0].push(isPrevious ? edge.target : edge.source);
                        }
                        else {
                            // Edge spans at least two layers, add edge
                            cell[connectedlayer][0].push(edge);
                        }
                    }
                }
                return cell[connectedlayer][0];
            }
            else {
                if (cell[connectedlayer] == null) {
                    cell[connectedlayer] = [];
                    for (var i = 0; i < cell.temp.length; i++) {
                        cell[connectedlayer][i] = [];
                        if (i === (isPrevious ? 0 : (cell.temp.length - 1))) {
                            cell[connectedlayer][i].push(isPrevious ? cell.target : cell.source);
                        }
                        else {
                            cell[connectedlayer][i].push(cell);
                        }
                    }
                }
                return cell[connectedlayer][layer - cell.minRank - 1];
            }
        }
        return null;
    };
    /**
     * calculates the rank elements on the specified rank
     * @private
     */
    CrossReduction.prototype.medianValue = function (connectedCells, rankValue) {
        var medianValues = [];
        var arrayCount = 0;
        for (var i = 0; i < connectedCells.length; i++) {
            var cell = connectedCells[i];
            medianValues[arrayCount++] = this.getTempVariable(cell, rankValue);
        }
        // sorts numerical order sort
        medianValues.sort(function (a, b) { return a - b; });
        if (arrayCount % 2 === 1) {
            // For odd numbers of adjacent vertices return the median
            return medianValues[Math.floor(arrayCount / 2)];
        }
        else if (arrayCount === 2) {
            return ((medianValues[0] + medianValues[1]) / 2.0);
        }
        else {
            var medianPoint = arrayCount / 2;
            var leftMedian = medianValues[medianPoint - 1] - medianValues[0];
            var rightMedian = medianValues[arrayCount - 1]
                - medianValues[medianPoint];
            return (medianValues[medianPoint - 1] * rightMedian + medianValues[medianPoint] * leftMedian) / (leftMedian + rightMedian);
        }
    };
    /**
     * get the temp value of the specified layer
     * @private
     */
    CrossReduction.prototype.setTempVariable = function (cell, layer, value) {
        if (cell) {
            cell.temp[0] = value;
        }
    };
    /**
     * used to minimize the node position on this rank and one of its adjacent ranks
     */
    CrossReduction.prototype.medianRank = function (rankValue, downwardSweep) {
        var numCellsForRank = this.nestedBestRanks[rankValue].length;
        var medianValues = [];
        var reservedPositions = [];
        for (var i = 0; i < numCellsForRank; i++) {
            var cell = this.nestedBestRanks[rankValue][i];
            var sorterEntry = { medianValue: 0 };
            sorterEntry.cell = cell;
            // Flip whether or not equal medians are flipped on up and down sweeps 
            //TODO re-implement some kind of nudge medianValues[i].nudge = !downwardSweep;
            var nextLevelConnectedCells = void 0;
            if (downwardSweep) {
                nextLevelConnectedCells = this.getConnectedCellsOnLayer(cell, rankValue);
            }
            else {
                nextLevelConnectedCells = this.getConnectedCellsOnLayer(cell, rankValue, true);
            }
            var nextRankValue = void 0;
            downwardSweep ? nextRankValue = rankValue + 1 : nextRankValue = rankValue - 1;
            if (nextLevelConnectedCells != null && nextLevelConnectedCells.length !== 0) {
                sorterEntry.medianValue = this.medianValue(nextLevelConnectedCells, nextRankValue);
                medianValues.push(sorterEntry);
            }
            else {
                // Nodes with no adjacent vertices are flagged in the reserved array to 
                //indicate they should be left in their current position.
                reservedPositions[this.getTempVariable(cell, rankValue)] = true;
            }
        }
        medianValues.sort(this.compare);
        // Set the new position of each node within the rank using its temp variable
        for (var i = 0; i < numCellsForRank; i++) {
            if (reservedPositions[i] == null && medianValues.length > 0) {
                var cell = medianValues.shift().cell;
                this.setTempVariable(cell, rankValue, i);
            }
        }
    };
    /**
     * compares two values, it sends the values to the compare function,
     * and sorts the values according to the returned (negative, zero, positive) value
     */
    CrossReduction.prototype.compare = function (a, b) {
        if (a != null && b != null) {
            if (b.medianValue > a.medianValue) {
                return -1;
            }
            else if (b.medianValue < a.medianValue) {
                return 1;
            }
        }
        return 0;
    };
    return CrossReduction;
}());
