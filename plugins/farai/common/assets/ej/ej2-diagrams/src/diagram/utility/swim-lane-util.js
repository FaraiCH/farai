import { Node } from '../objects/node';
import { GridPanel, RowDefinition, ColumnDefinition } from '../core/containers/grid';
import { Lane, Phase } from '../objects/node';
import { DiagramAction, NodeConstraints, DiagramConstraints, DiagramEvent } from '../enum/enum';
import { cloneObject, randomId } from './../utility/base-util';
import { DiagramElement } from '../core/elements/diagram-element';
import { TextElement } from '../core/elements/text-element';
import { Size } from '../primitives/size';
import { Canvas } from '../core/containers/canvas';
import { Rect } from '../primitives/rect';
import { checkParentAsContainer, findBounds, removeChildInContainer } from '../interaction/container-interaction';
import { canSelect } from './constraints-util';
/**
 * SwimLane modules are used to rendering and interaction.
 */
/** @private */
export function initSwimLane(grid, diagram, node) {
    if (!node.width && node.shape.phases.length === 0) {
        node.width = 100;
    }
    var row = [];
    var columns = [];
    var index = 0;
    var shape = node.shape;
    var orientation = shape.orientation === 'Horizontal' ? true : false;
    if (shape.header && shape.hasHeader) {
        createRow(row, shape.header.height);
    }
    initGridRow(row, orientation, node);
    initGridColumns(columns, orientation, node);
    grid.setDefinitions(row, columns);
    if (shape.header && shape.hasHeader) {
        headerDefine(grid, diagram, node);
        index++;
    }
    if (shape.phases.length > 0 && shape.phaseSize) {
        for (var k = 0; k < shape.phases.length; k++) {
            if (shape.phases[k].id === '') {
                shape.phases[k].id = randomId();
            }
            phaseDefine(grid, diagram, node, index, orientation, k);
        }
        index++;
    }
    if (shape.lanes.length > 0) {
        for (var k = 0; k < shape.lanes.length; k++) {
            if (shape.lanes[k].id === '') {
                shape.lanes[k].id = randomId();
            }
            laneCollection(grid, diagram, node, index, k, orientation);
            index++;
        }
    }
}
/** @private */
export function addObjectToGrid(diagram, grid, parent, object, isHeader, isPhase, isLane, canvas) {
    var node = new Node(diagram, 'nodes', object, true);
    node.parentId = parent.id;
    node.isHeader = (isHeader) ? true : false;
    node.isPhase = (isPhase) ? true : false;
    node.isLane = (isLane) ? true : false;
    var id = (isPhase) ? 'PhaseHeaderParent' : 'LaneHeaderParent';
    if (canvas) {
        node[id] = canvas;
    }
    node.constraints &= ~(NodeConstraints.InConnect | NodeConstraints.OutConnect);
    node.constraints |= NodeConstraints.HideThumbs;
    diagram.initObject(node);
    diagram.nodes.push(node);
    if (node.wrapper.children.length > 0) {
        for (var i = 0; i < node.wrapper.children.length; i++) {
            var child = node.wrapper.children[i];
            if (child instanceof DiagramElement) {
                child.isCalculateDesiredSize = false;
            }
            if (child instanceof TextElement) {
                child.canConsiderBounds = false;
                if (!isHeader && (parent.shape.orientation === 'Vertical' && isPhase) ||
                    (parent.shape.orientation !== 'Vertical' && isLane)) {
                    child.isLaneOrientation = true;
                    child.refreshTextElement();
                }
            }
        }
        node.wrapper.measure(new Size(undefined, undefined));
        node.wrapper.arrange(node.wrapper.desiredSize);
    }
    return node.wrapper;
}
/** @private */
export function headerDefine(grid, diagram, object) {
    var maxWidth = 0;
    var columns = grid.columnDefinitions();
    var shape = object.shape;
    for (var i = 0; i < columns.length; i++) {
        maxWidth += columns[i].width;
    }
    shape.header.id = shape.header.id || randomId();
    var node = {
        id: object.id + shape.header.id,
        annotations: [cloneObject(shape.header.annotation)],
        style: shape.header.style ? shape.header.style : undefined,
        offsetX: object.offsetX, offsetY: object.offsetY,
        rowIndex: 0, columnIndex: 0,
        maxWidth: maxWidth,
        container: { type: 'Canvas', orientation: 'Horizontal' }
    };
    if (!canSelect(object)) {
        node.constraints &= ~NodeConstraints.Select;
    }
    var wrapper = addObjectToGrid(diagram, grid, object, node, true);
    grid.addObject(wrapper, 0, 0, 1, grid.columnDefinitions().length);
}
/** @private */
export function phaseDefine(grid, diagram, object, indexValue, orientation, phaseIndex) {
    var rowValue = 0;
    var colValue = 0;
    var maxWidth;
    var shape = object.shape;
    if (orientation) {
        colValue = phaseIndex;
        rowValue = indexValue;
        maxWidth = grid.columnDefinitions()[phaseIndex].width;
    }
    else {
        rowValue = shape.header && shape.hasHeader ? phaseIndex + 1 : phaseIndex;
    }
    var phaseObject = {
        annotations: [cloneObject(shape.phases[phaseIndex].header.annotation)],
        maxWidth: maxWidth,
        id: object.id + shape.phases[phaseIndex].id + '_header',
        offsetX: object.offsetX, offsetY: object.offsetY,
        style: shape.phases[phaseIndex].style,
        rowIndex: rowValue, columnIndex: colValue,
        container: { type: 'Canvas', orientation: orientation ? 'Horizontal' : 'Vertical' }
    };
    phaseObject.annotations[0].rotateAngle = orientation ? 0 : 270;
    if (!canSelect(object)) {
        phaseObject.constraints &= ~NodeConstraints.Select;
    }
    shape.phases[phaseIndex].header.id = phaseObject.id;
    var wrapper = addObjectToGrid(diagram, grid, object, phaseObject, false, true, false, shape.phases[phaseIndex].id);
    grid.addObject(wrapper, rowValue, colValue);
}
/** @private */
export function laneCollection(grid, diagram, object, indexValue, laneIndex, orientation) {
    var laneNode;
    var parentWrapper;
    var gridCell;
    var canvas;
    var childWrapper;
    var shape = object.shape;
    var value = shape.phases.length || 1;
    var isHeader = (shape.header && shape.hasHeader) ? 1 : 0;
    var colValue = 0;
    var rowValue = orientation ? indexValue : isHeader;
    var phaseCount = (shape.phaseSize && shape.phases.length > 0) ? 1 : 0;
    for (var l = 0; l < value; l++) {
        colValue = orientation ? l : laneIndex + phaseCount;
        gridCell = grid.rows[rowValue].cells[colValue];
        canvas = {
            id: object.id + shape.lanes[laneIndex].id + l,
            rowIndex: rowValue, columnIndex: colValue,
            width: gridCell.minWidth, height: gridCell.minHeight,
            offsetX: object.offsetX, offsetY: object.offsetY,
            style: shape.lanes[laneIndex].style,
            constraints: NodeConstraints.Default | NodeConstraints.ReadOnly | NodeConstraints.AllowDrop,
            container: { type: 'Canvas', orientation: orientation ? 'Horizontal' : 'Vertical' }
        };
        if (!canSelect(object)) {
            canvas.constraints &= ~NodeConstraints.Select;
        }
        parentWrapper = addObjectToGrid(diagram, grid, object, canvas, false, false, true);
        parentWrapper.children[0].isCalculateDesiredSize = false;
        if (l === 0) {
            laneNode = {
                id: object.id + shape.lanes[laneIndex].id + '_' + l + '_header',
                style: shape.lanes[laneIndex].header.style,
                annotations: [cloneObject(shape.lanes[laneIndex].header.annotation)],
                offsetX: object.offsetX, offsetY: object.offsetY,
                rowIndex: rowValue, columnIndex: colValue,
                container: { type: 'Canvas', orientation: orientation ? 'Horizontal' : 'Vertical' }
            };
            laneNode.annotations[0].rotateAngle = orientation ? 270 : 0;
            shape.lanes[laneIndex].header.id = laneNode.id;
            (orientation) ? laneNode.width = shape.lanes[laneIndex].header.width :
                laneNode.height = shape.lanes[laneIndex].header.height;
            if (!canSelect(object)) {
                laneNode.constraints &= ~NodeConstraints.Select;
            }
            childWrapper = addObjectToGrid(diagram, grid, object, laneNode, false, false, true, shape.lanes[laneIndex].id);
            parentWrapper.children.push(childWrapper);
        }
        grid.addObject(parentWrapper, rowValue, colValue);
        if (!orientation) {
            rowValue++;
        }
        colValue = orientation ? l : laneIndex + 1;
    }
}
/** @private */
export function createRow(row, height) {
    var rows = new RowDefinition();
    rows.height = height;
    row.push(rows);
}
/** @private */
export function createColumn(width) {
    var cols = new ColumnDefinition();
    cols.width = width;
    return cols;
}
/** @private */
export function initGridRow(row, orientation, object) {
    var totalHeight = 0;
    var height;
    var shape = object.shape;
    if (row.length > 0) {
        for (var i = 0; i < row.length; i++) {
            totalHeight += row[i].height;
        }
    }
    if (orientation) {
        if (shape.phases.length > 0 && shape.phaseSize) {
            totalHeight += shape.phaseSize;
            createRow(row, shape.phaseSize);
        }
        if (shape.lanes.length > 0) {
            for (var i = 0; i < shape.lanes.length; i++) {
                height = shape.lanes[i].height;
                totalHeight += height;
                if (i === shape.lanes.length - 1 && totalHeight < object.height) {
                    height += object.height - totalHeight;
                }
                createRow(row, height);
            }
        }
    }
    else {
        if (shape.phases.length > 0) {
            var phaseHeight = 0;
            for (var i = 0; i < shape.phases.length; i++) {
                var phaseOffset = shape.phases[i].offset;
                if (i === 0) {
                    phaseHeight += phaseOffset;
                }
                else {
                    phaseOffset -= phaseHeight;
                    phaseHeight += phaseOffset;
                }
                height = phaseOffset;
                totalHeight += height;
                if (i === shape.phases.length - 1 && totalHeight < object.height) {
                    height += object.height - totalHeight;
                }
                createRow(row, height);
            }
        }
        else {
            createRow(row, object.height);
        }
    }
}
/** @private */
export function initGridColumns(columns, orientation, object) {
    var totalWidth = 0;
    var shape = object.shape;
    var phaseOffset;
    var cols;
    var k;
    var j;
    var value;
    if (shape.phases.length > 0 && shape.orientation === 'Horizontal') {
        for (j = 0; j < shape.phases.length; j++) {
            phaseOffset = shape.phases[j].offset;
            if (j === 0) {
                totalWidth += phaseOffset;
            }
            else {
                phaseOffset -= totalWidth;
                totalWidth += phaseOffset;
            }
            cols = createColumn(phaseOffset);
            if (j === shape.phases.length - 1 && totalWidth < object.width) {
                cols.width += object.width - totalWidth;
            }
            columns.push(cols);
        }
    }
    else if (!orientation) {
        value = (shape.phaseSize && shape.phases.length > 0) ? shape.lanes.length
            + 1 : shape.lanes.length;
        if (shape.phaseSize && shape.phases.length > 0) {
            totalWidth += shape.phaseSize;
            cols = createColumn(shape.phaseSize);
            columns.push(cols);
        }
        for (k = 0; k < shape.lanes.length; k++) {
            totalWidth += shape.lanes[k].width;
            cols = createColumn(shape.lanes[k].width);
            if (k === shape.lanes.length - 1 && totalWidth < object.width) {
                cols.width += object.width - totalWidth;
            }
            columns.push(cols);
        }
        if ((shape.phases.length === 0 && shape.lanes.length === 0)) {
            cols = createColumn(object.width);
            columns.push(cols);
        }
    }
    else {
        cols = createColumn(object.width);
        columns.push(cols);
    }
}
/** @private */
export function getConnectors(diagram, grid, rowIndex, isRowUpdate) {
    var connectors = [];
    var conn = 0;
    var childNode;
    var node;
    var k;
    var i;
    var j;
    var canvas;
    var row;
    var length = grid.rowDefinitions().length;
    var edges;
    for (var i_1 = 0; i_1 < length; i_1++) {
        row = grid.rows[i_1];
        for (j = 0; j < row.cells.length; j++) {
            canvas = row.cells[j].children[0];
            if (canvas && canvas.children && canvas.children.length) {
                for (k = 1; k < canvas.children.length; k++) {
                    childNode = canvas.children[k];
                    node = diagram.getObject(childNode.id);
                    if (node && (node.inEdges.length > 0 || node.outEdges.length > 0)) {
                        edges = node.inEdges.concat(node.outEdges);
                        for (conn = 0; conn < edges.length; conn++) {
                            if (connectors.indexOf(edges[conn]) === -1) {
                                connectors.push(edges[conn]);
                            }
                        }
                    }
                }
            }
        }
    }
    return connectors;
}
/** @private */
export function swimLaneMeasureAndArrange(obj) {
    var canvas = obj.wrapper;
    canvas.measure(new Size(obj.width, obj.height));
    if (canvas.children[0] instanceof GridPanel) {
        var grid = canvas.children[0];
        var isMeasure = false;
        if (grid.width && grid.width < grid.desiredSize.width) {
            isMeasure = true;
            grid.width = grid.desiredSize.width;
        }
        if (grid.height && grid.height < grid.desiredSize.height) {
            isMeasure = true;
            grid.height = grid.desiredSize.height;
        }
        if (isMeasure) {
            grid.measure(new Size(grid.width, grid.height));
        }
    }
    canvas.arrange(canvas.desiredSize);
}
/** @private */
export function ChangeLaneIndex(diagram, obj, startRowIndex) {
    var container = obj.wrapper.children[0];
    var i;
    var j;
    var k;
    var object;
    var subChild;
    var row;
    var cell;
    var child;
    for (i = startRowIndex; i < container.rows.length; i++) {
        row = container.rows[i];
        for (j = 0; j < row.cells.length; j++) {
            cell = row.cells[j];
            if (cell.children && cell.children.length > 0) {
                for (k = 0; k < cell.children.length; k++) {
                    child = cell.children[k];
                    object = diagram.nameTable[child.id];
                    if (object.isLane && child.children.length > 1) {
                        subChild = diagram.nameTable[child.children[1].id];
                        if (subChild && subChild.isLane) {
                            subChild.rowIndex = i;
                            subChild.columnIndex = j;
                        }
                    }
                    object.rowIndex = i;
                    object.columnIndex = j;
                }
            }
        }
    }
}
/** @private */
export function arrangeChildNodesInSwimLane(diagram, obj) {
    var grid = obj.wrapper.children[0];
    var shape = obj.shape;
    var padding = shape.padding;
    var lanes = shape.lanes;
    var top = grid.bounds.y;
    var rowvalue;
    var columnValue;
    var phaseCount = (shape.phaseSize > 0) ? shape.phases.length : 0;
    var node;
    var canvas;
    var cell;
    var i;
    var j;
    var k;
    var orientation = shape.orientation === 'Horizontal' ? true : false;
    var col = orientation ? shape.phases.length || 1 : lanes.length + 1;
    var row = orientation ? ((shape.header && shape.hasHeader) ? 1 : 0) +
        (shape.phases.length > 0 ? 1 : 0) + (shape.lanes.length)
        : (shape.header && shape.hasHeader ? 1 : 0) + shape.phases.length;
    if (phaseCount === 0 && !orientation && shape.lanes.length) {
        row += 1;
    }
    if (orientation) {
        rowvalue = (shape.header && shape.hasHeader ? 1 : 0) + (phaseCount > 0 ? 1 : 0);
        columnValue = 0;
    }
    else {
        rowvalue = (shape.header && shape.hasHeader ? 1 : 0);
        columnValue = phaseCount > 0 ? 1 : 0;
    }
    if (lanes.length > 0) {
        top += (shape.header && shape.hasHeader) ? shape.header.height : 0;
        for (i = 0; i < lanes.length; i++) {
            for (j = 0; j < lanes[i].children.length; j++) {
                node = lanes[i].children[j];
                node.offsetX = lanes[i].width;
                node.offsetY = lanes[i].height;
                diagram.initObject(node);
                diagram.nodes.push(node);
                canvas = node.wrapper;
                if (orientation) {
                    for (k = columnValue; k < col; k++) {
                        cell = grid.rows[rowvalue].cells[k];
                        if (canvas.margin.left < (cell.bounds.right - grid.bounds.x)) {
                            node.parentId = cell.children[0].id;
                            if (k > columnValue) {
                                canvas.margin.left = canvas.margin.left - (cell.bounds.left - grid.bounds.left);
                            }
                            else {
                                if ((cell.children[0].children[1].actualSize.width + padding) >= canvas.margin.left) {
                                    canvas.margin.left = cell.children[0].children[1].actualSize.width + padding;
                                }
                            }
                            if (canvas.margin.left < padding) {
                                canvas.margin.left = padding;
                            }
                            if (canvas.margin.top < padding) {
                                canvas.margin.top = padding;
                            }
                            addChildToLane(canvas, node, diagram);
                            break;
                        }
                    }
                }
                else {
                    for (var k_1 = rowvalue; k_1 < row; k_1++) {
                        cell = grid.rows[k_1].cells[columnValue];
                        if (canvas.margin.top < (cell.bounds.bottom - top)) {
                            node.parentId = cell.children[0].id;
                            if (k_1 > rowvalue) {
                                canvas.margin.top = canvas.margin.top - (cell.bounds.top - top);
                            }
                            else {
                                if ((cell.children[0].children[1].actualSize.height + padding) >= canvas.margin.top) {
                                    canvas.margin.top = cell.children[0].children[1].actualSize.height + padding;
                                }
                            }
                            if (canvas.margin.left < padding) {
                                canvas.margin.left = padding;
                            }
                            if (canvas.margin.top < padding) {
                                canvas.margin.top = padding;
                            }
                            addChildToLane(canvas, node, diagram);
                            break;
                        }
                    }
                }
            }
            orientation ? rowvalue++ : columnValue++;
        }
    }
    grid.measure(new Size(obj.width, obj.height));
    grid.arrange(grid.desiredSize);
    updateChildOuterBounds(grid, obj);
    obj.width = obj.wrapper.width = grid.width;
    obj.height = obj.wrapper.height = grid.height;
    updateHeaderMaxWidth(diagram, obj);
    obj.wrapper.measure(new Size(obj.width, obj.height));
    obj.wrapper.arrange(grid.desiredSize);
    checkLaneChildrenOffset(obj);
    checkPhaseOffset(obj, diagram);
    checkLaneSize(obj);
}
function addChildToLane(canvas, node, diagram) {
    canvas.measure(new Size(node.width, node.height));
    canvas.arrange(canvas.desiredSize);
    var parent = diagram.getObject(node.parentId);
    diagram.addChild(parent, node.id);
}
/** @private */
export function updateChildOuterBounds(grid, obj) {
    var columnDefinitions = grid.columnDefinitions();
    var rowDefinitions = grid.rowDefinitions();
    var i;
    var k;
    var j;
    var cell;
    var child;
    var row;
    var rowIndex = findStartLaneIndex(obj);
    if (obj.shape.orientation === 'Vertical') {
        if (rowIndex === 0) {
            rowIndex = (obj.shape.header && obj.shape.hasHeader) ? 1 : 0;
        }
    }
    var padding = obj.shape.padding;
    for (i = 0; i < columnDefinitions.length; i++) {
        grid.updateColumnWidth(i, columnDefinitions[i].width, true, padding);
    }
    for (i = rowIndex; i < rowDefinitions.length; i++) {
        grid.updateRowHeight(i, rowDefinitions[i].height, true, padding);
    }
    for (k = 0; k < rowDefinitions.length; k++) {
        row = grid.rows[k];
        for (i = 0; i < columnDefinitions.length; i++) {
            cell = row.cells[i];
            if (cell.children && cell.children.length > 0) {
                for (j = 0; j < cell.children.length; j++) {
                    child = cell.children[j];
                    if (child.maxWidth) {
                        child.maxWidth = cell.actualSize.width;
                    }
                    if (child.maxHeight) {
                        child.maxHeight = cell.actualSize.height;
                    }
                }
            }
        }
    }
}
/** @private */
export function checkLaneSize(obj) {
    if (obj.shape.type === 'SwimLane' && !obj.shape.isLane && !obj.shape.isPhase) {
        var lane = void 0;
        var i = void 0;
        var columns = void 0;
        var size = void 0;
        var laneCount = 0;
        var lanes = obj.shape.lanes;
        var laneIndex = findStartLaneIndex(obj);
        var rows = obj.wrapper.children[0].rowDefinitions();
        for (i = 0; i < lanes.length; i++, laneIndex++) {
            lane = lanes[i];
            if (obj.shape.orientation === 'Horizontal') {
                size = rows[laneIndex].height;
                if (lane.height !== size) {
                    lane.height = size;
                }
            }
            else {
                columns = obj.wrapper.children[0].columnDefinitions();
                size = columns[laneIndex].width;
                if (lane.width !== size) {
                    lane.width = size;
                }
            }
        }
    }
}
/** @private */
export function checkPhaseOffset(obj, diagram) {
    var shape = obj.shape;
    var phases = shape.phases;
    var i;
    var offset;
    var phaseRow;
    var phase;
    var gridRowIndex = (shape.header && shape.hasHeader) ? 1 : 0;
    var grid = obj.wrapper.children[0];
    var top = grid.bounds.y + ((shape.header && shape.hasHeader) ? shape.header.height : 0);
    if (obj.shape.type === 'SwimLane') {
        obj = diagram.getObject(obj.id) || obj;
        if (phases.length > 0) {
            grid = obj.wrapper.children[0];
            if (shape.orientation === 'Horizontal') {
                phaseRow = (shape.header && shape.hasHeader) ? grid.rows[1] : grid.rows[0];
                for (i = 0; i < phases.length; i++) {
                    phase = phaseRow.cells[i].children[0];
                    offset = phase.bounds.right - grid.bounds.x;
                    if (phases[i].offset !== offset) {
                        phases[i].offset = offset;
                    }
                    diagram.nameTable[phase.id].maxWidth = phase.maxWidth;
                }
            }
            else {
                for (i = 0; i < phases.length; i++) {
                    phase = grid.rows[gridRowIndex + i].cells[0].children[0];
                    offset = phase.bounds.bottom - top;
                    if (phases[i].offset !== offset) {
                        phases[i].offset = offset;
                    }
                    diagram.nameTable[phase.id].maxWidth = phase.maxWidth;
                }
            }
        }
    }
}
/** @private */
export function updateConnectorsProperties(connectors, diagram) {
    if (connectors && connectors.length > 0) {
        var edges = void 0;
        if (diagram.lineRoutingModule && (diagram.constraints & DiagramConstraints.LineRouting)) {
            diagram.lineRoutingModule.renderVirtualRegion(diagram, true);
        }
        for (var i = 0; i < connectors.length; i++) {
            edges = diagram.getObject(connectors[i]);
            if (diagram.lineRoutingModule && (diagram.constraints & DiagramConstraints.LineRouting) && edges.type === 'Orthogonal') {
                diagram.lineRoutingModule.refreshConnectorSegments(diagram, edges, true);
            }
            else {
                diagram.connectorPropertyChange(edges, {}, {
                    sourceID: edges.sourceID, targetID: edges.targetID
                });
            }
        }
    }
}
/** @private */
export function laneInterChanged(diagram, obj, target, position) {
    var index;
    var undoElement;
    var entry;
    var redoElement;
    var sourceIndex;
    var targetIndex;
    var temp;
    var sourceLaneIndex;
    var targetLaneIndex;
    var rowIndex;
    var swimLane = (diagram.getObject(obj.parentId));
    var shape = swimLane.shape;
    var grid = swimLane.wrapper.children[0];
    var lanes = shape.lanes;
    var connectors = getConnectors(diagram, grid, obj.rowIndex, true);
    if ((shape.orientation === 'Horizontal' && obj.rowIndex !== target.rowIndex) ||
        (shape.orientation === 'Vertical' && obj.columnIndex !== target.columnIndex)) {
        if (shape.orientation === 'Horizontal') {
            sourceIndex = obj.rowIndex;
            targetIndex = target.rowIndex;
            index = ((shape.header && shape.hasHeader) ? 1 : 0) + (shape.phases.length && shape.phaseSize ? 1 : 0);
            sourceLaneIndex = obj.rowIndex - index;
            targetLaneIndex = target.rowIndex - index;
            if (lanes[sourceLaneIndex].canMove) {
                if (sourceLaneIndex < targetLaneIndex) {
                    if (position && target.wrapper.offsetY > position.y) {
                        targetIndex += (targetLaneIndex > 0) ? -1 : 1;
                        targetLaneIndex += (targetLaneIndex > 0) ? -1 : 1;
                    }
                }
                else {
                    if (position && target.wrapper.offsetY < position.y) {
                        targetIndex += 1;
                        targetLaneIndex += 1;
                    }
                }
                if (sourceIndex !== targetIndex) {
                    grid.updateRowIndex(sourceIndex, targetIndex);
                }
            }
        }
        else {
            sourceIndex = obj.columnIndex;
            targetIndex = target.columnIndex;
            index = (shape.phases.length && shape.phaseSize) ? 1 : 0;
            sourceLaneIndex = obj.columnIndex - index;
            targetLaneIndex = target.columnIndex - index;
            rowIndex = (shape.header && shape.hasHeader) ? 1 : 0;
            if (lanes[sourceLaneIndex].canMove) {
                if (sourceLaneIndex < targetLaneIndex) {
                    if (position && target.wrapper.offsetX > position.x) {
                        targetIndex += (targetLaneIndex > 0) ? -1 : 1;
                        targetLaneIndex += (targetLaneIndex > 0) ? -1 : 1;
                    }
                }
                else {
                    if (position && target.wrapper.offsetX < position.x) {
                        targetIndex += 1;
                        targetLaneIndex += 1;
                    }
                }
                if (sourceIndex !== targetIndex) {
                    if ((shape.phaseSize === 0 || shape.phases.length === 0) && (targetIndex === 0 || sourceIndex === 0)) {
                        if (shape.header && shape.hasHeader) {
                            var changeHeaderIndex = (targetIndex === 0) ? sourceIndex : targetIndex;
                            grid.rows[0].cells[changeHeaderIndex].children = grid.rows[0].cells[0].children;
                            grid.rows[0].cells[changeHeaderIndex].columnSpan = grid.rows[0].cells[0].columnSpan;
                            grid.rows[0].cells[0].children = [];
                        }
                    }
                    grid.updateColumnIndex(0, sourceIndex, targetIndex);
                }
            }
        }
        if (sourceIndex !== targetIndex) {
            temp = lanes[sourceLaneIndex];
            if (temp.canMove) {
                undoElement = {
                    target: cloneObject(target), source: cloneObject(obj)
                };
                temp = lanes[sourceLaneIndex];
                lanes.splice(sourceLaneIndex, 1);
                lanes.splice(targetLaneIndex, 0, temp);
                redoElement = {
                    target: cloneObject(undoElement.source), source: cloneObject(undoElement.target)
                };
                entry = {
                    type: 'LanePositionChanged', redoObject: redoElement,
                    undoObject: undoElement, category: 'Internal'
                };
                if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
                    diagram.commandHandler.addHistoryEntry(entry);
                }
                ChangeLaneIndex(diagram, swimLane, 0);
                updateConnectorsProperties(connectors, diagram);
                updateSwimLaneChildPosition(lanes, diagram);
                swimLane.wrapper.measure(new Size(swimLane.width, swimLane.height));
                swimLane.wrapper.arrange(swimLane.wrapper.desiredSize);
                diagram.updateDiagramObject(swimLane);
            }
        }
    }
    diagram.updateDiagramElementQuad();
}
/** @private */
export function updateSwimLaneObject(diagram, obj, swimLane, helperObject) {
    var parentNode = diagram.getObject(swimLane.id);
    var shape = parentNode.shape;
    var index = (shape.header && shape.hasHeader) ? 1 : 0;
    var lanes = shape.lanes;
    var phases = shape.phases;
    var helperWidth = helperObject.wrapper.actualSize.width;
    var helperHeight = helperObject.wrapper.actualSize.height;
    var objWidth = obj.wrapper.actualSize.width;
    var objHeight = obj.wrapper.actualSize.height;
    if (parentNode.shape.type === 'SwimLane') {
        if (shape.orientation === 'Horizontal') {
            if (obj.isPhase) {
                phases[obj.columnIndex].offset += (helperWidth - objWidth);
            }
            else {
                index = (shape.phaseSize && shape.phases.length > 0) ? index + 1 : index;
                lanes[(obj.rowIndex - index)].height += (helperHeight - objHeight);
            }
        }
        else {
            if (obj.isPhase) {
                phases[(obj.rowIndex - index)].offset += (helperHeight - objHeight);
            }
            else {
                index = (shape.phaseSize && shape.phases.length > 0) ? 1 : 0;
                lanes[(obj.columnIndex - index)].width += (helperWidth - objWidth);
            }
        }
    }
}
/** @private */
export function findLaneIndex(swimLane, laneObj) {
    var laneIndex;
    var shape = swimLane.shape;
    var index = (shape.header && shape.hasHeader) ? 1 : 0;
    if (shape.orientation === 'Horizontal') {
        index += shape.phases.length > 0 ? 1 : 0;
        laneIndex = laneObj.rowIndex - index;
    }
    else {
        laneIndex = laneObj.columnIndex - (shape.phaseSize && shape.phases.length > 0 ? 1 : 0);
    }
    return laneIndex;
}
/** @private */
export function findPhaseIndex(phase, swimLane) {
    var phaseIndex;
    var shape = swimLane.shape;
    var index = (shape.header && shape.hasHeader) ? 1 : 0;
    phaseIndex = (shape.orientation === 'Horizontal') ? phase.columnIndex : phase.rowIndex - index;
    return phaseIndex;
}
/** @private */
export function findStartLaneIndex(swimLane) {
    var index = 0;
    var shape = swimLane.shape;
    if (shape.orientation === 'Horizontal') {
        index = (shape.header && shape.hasHeader) ? 1 : 0;
    }
    if (shape.phases.length > 0 && shape.phaseSize) {
        index += 1;
    }
    return index;
}
/** @private */
export function updatePhaseMaxWidth(parent, diagram, wrapper, columnIndex) {
    var shape = parent.shape;
    if (shape.phases.length > 0) {
        var node = diagram.nameTable[shape.phases[columnIndex].header.id];
        if (node && node.maxWidth < wrapper.outerBounds.width) {
            node.maxWidth = wrapper.outerBounds.width;
            node.wrapper.maxWidth = wrapper.outerBounds.width;
        }
    }
}
/** @private */
export function updateHeaderMaxWidth(diagram, swimLane) {
    if (swimLane.shape.header && swimLane.shape.hasHeader) {
        var grid = swimLane.wrapper.children[0];
        var id = grid.rows[0].cells[0].children[0].id;
        var headerNode = diagram.nameTable[id];
        if (headerNode && headerNode.isHeader && headerNode.maxWidth < swimLane.width) {
            headerNode.maxWidth = swimLane.width;
            headerNode.wrapper.maxWidth = swimLane.width;
        }
    }
}
/** @private */
export function addLane(diagram, parent, lane, count) {
    var args;
    var swimLane = diagram.nameTable[parent.id];
    if (swimLane.shape.type === 'SwimLane') {
        diagram.protectPropertyChange(true);
        var grid = swimLane.wrapper.children[0];
        var bounds = grid.bounds;
        var shape = swimLane.shape;
        var redoObj = void 0;
        var orientation_1 = false;
        var connectors = void 0;
        var entry = void 0;
        var index = void 0;
        var laneObj = void 0;
        var laneIndex = void 0;
        var children = void 0;
        var j = void 0;
        var i = void 0;
        var k = void 0;
        var cell = void 0;
        var child = void 0;
        var point = void 0;
        laneObj = new Lane(shape, 'lanes', lane, true);
        index = (shape.header && shape.hasHeader) ? 1 : 0;
        if (shape.orientation === 'Horizontal') {
            orientation_1 = true;
            index = shape.phases.length > 0 ? index + 1 : index;
        }
        connectors = getConnectors(diagram, grid, 0, true);
        laneIndex = (count !== undefined) ? count : shape.lanes.length;
        index += laneIndex;
        args = {
            element: laneObj, cause: diagram.diagramActions, state: 'Changing', type: 'Addition', cancel: false, laneIndex: laneIndex
        };
        diagram.triggerEvent(DiagramEvent.collectionChange, args);
        if (!args.cancel) {
            if (orientation_1) {
                var rowDef = new RowDefinition();
                rowDef.height = lane.height;
                grid.addRow(index, rowDef, false);
                swimLane.height = (swimLane.height !== undefined) ? swimLane.height + lane.height : swimLane.height;
                swimLane.wrapper.height = grid.height = swimLane.height;
            }
            else {
                var colDef = new ColumnDefinition();
                colDef.width = lane.width;
                grid.addColumn(laneIndex + 1, colDef, false);
                if (swimLane.width) {
                    swimLane.width += lane.width;
                    swimLane.wrapper.width = grid.width = swimLane.width;
                }
                if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
                    grid.rows[0].cells[0].columnSpan += 1;
                }
            }
            if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
                laneObj.id = (laneObj.id === '') ? randomId() : laneObj.id;
            }
            if (count !== undefined) {
                shape.lanes.splice(count, 0, laneObj);
            }
            else {
                shape.lanes.push(laneObj);
            }
            args = {
                element: laneObj, cause: diagram.diagramActions, state: 'Changed', type: 'Addition', cancel: false, laneIndex: laneIndex
            };
            diagram.triggerEvent(DiagramEvent.collectionChange, args);
            laneCollection(grid, diagram, swimLane, index, laneIndex, orientation_1);
            redoObj = (shape.orientation === 'Horizontal') ?
                diagram.nameTable[grid.rows[index].cells[0].children[0].id] :
                ((shape.header && shape.hasHeader) ? diagram.nameTable[grid.rows[1].cells[index].children[0].id] :
                    diagram.nameTable[grid.rows[0].cells[index].children[0].id]);
            if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
                entry = {
                    type: 'LaneCollectionChanged', changeType: 'Insert', undoObject: cloneObject(laneObj),
                    redoObject: cloneObject(redoObj), category: 'Internal'
                };
                diagram.addHistoryEntry(entry);
            }
            var startRowIndex = (shape.orientation === 'Horizontal') ?
                index : ((shape.header && shape.hasHeader) ? 1 : 0);
            ChangeLaneIndex(diagram, swimLane, startRowIndex);
            swimLaneMeasureAndArrange(swimLane);
            updateHeaderMaxWidth(diagram, swimLane);
            children = lane.children;
            if (children && children.length > 0) {
                for (j = 0; j < children.length; j++) {
                    child = children[j];
                    point = { x: child.wrapper.offsetX, y: child.wrapper.offsetY };
                    if (shape.orientation === 'Horizontal') {
                        cell = grid.rows[index].cells[i];
                        for (i = 0; i < grid.rows[index].cells.length; i++) {
                            addChildNodeToNewLane(diagram, grid.rows[index].cells[i], point, child);
                        }
                    }
                    else {
                        for (k = 0; k < grid.rows.length; k++) {
                            cell = grid.rows[k].cells[index];
                            addChildNodeToNewLane(diagram, cell, point, child);
                        }
                    }
                }
            }
            updateConnectorsProperties(connectors, diagram);
            diagram.drag(swimLane, bounds.x - grid.bounds.x, bounds.y - grid.bounds.y);
        }
        diagram.protectPropertyChange(false);
    }
}
function addChildNodeToNewLane(diagram, cell, point, child) {
    if (cell.children && cell.children.length > 0) {
        var canvas = cell.children[0];
        var parent_1 = diagram.nameTable[canvas.id];
        if (canvas.bounds.containsPoint(point)) {
            diagram.addChild(parent_1, child);
        }
    }
}
export function addPhase(diagram, parent, newPhase) {
    if (parent.shape.type === 'SwimLane') {
        var gridRowIndex = void 0;
        var gridColIndex = void 0;
        var phaseNode = void 0;
        var phase = void 0;
        var previousPhase = void 0;
        var nextPhase = void 0;
        var phaseIndex = void 0;
        var laneHeaderSize = void 0;
        var i = void 0;
        var x = parent.wrapper.bounds.x;
        var y = parent.wrapper.bounds.y;
        var shape = parent.shape;
        var padding = shape.padding;
        var phasesCollection = shape.phases;
        var width = void 0;
        var grid = parent.wrapper.children[0];
        var orientation_2 = shape.orientation === 'Horizontal' ? true : false;
        gridRowIndex = (shape.header && shape.hasHeader) ? 0 : -1;
        if (shape.phases.length > 0) {
            gridRowIndex += 1;
            gridColIndex = 0;
        }
        laneHeaderSize = (orientation_2) ? shape.lanes[0].header.width : shape.lanes[0].header.height;
        if (newPhase.offset > laneHeaderSize) {
            for (i = 0; i < phasesCollection.length; i++) {
                phase = phasesCollection[i];
                previousPhase = (i > 0) ? phasesCollection[i - 1] : phase;
                if (phase.offset > newPhase.offset) {
                    width = (i > 0) ? newPhase.offset - previousPhase.offset : newPhase.offset;
                    if (orientation_2) {
                        var nextCol = grid.columnDefinitions()[i];
                        nextCol.width -= width;
                        nextPhase = diagram.nameTable[shape.phases[i].header.id];
                        nextPhase.maxWidth = nextPhase.wrapper.maxWidth = nextCol.width;
                        grid.updateColumnWidth(i, nextCol.width, false);
                        var addPhase_1 = new ColumnDefinition();
                        addPhase_1.width = width;
                        phaseIndex = i;
                        grid.addColumn(i, addPhase_1, false);
                        break;
                    }
                    else {
                        var nextRow = grid.rowDefinitions()[i + gridRowIndex];
                        nextRow.height -= width;
                        nextPhase = diagram.nameTable[shape.phases[i].header.id];
                        grid.updateRowHeight(i + gridRowIndex, nextRow.height, false);
                        var addPhase_2 = new RowDefinition();
                        addPhase_2.height = width;
                        phaseIndex = i;
                        grid.addRow(i + gridRowIndex, addPhase_2, false);
                        break;
                    }
                }
            }
            if (diagram.diagramActions & DiagramAction.UndoRedo && phaseIndex === undefined) {
                var entry = diagram.historyManager.currentEntry.next;
                if (entry.isLastPhase) {
                    phaseIndex = phasesCollection.length;
                    addLastPhase(phaseIndex, parent, entry, grid, orientation_2, newPhase);
                }
            }
            var phaseObj = new Phase((parent.shape), 'phases', newPhase, true);
            if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
                phaseObj.id += randomId();
            }
            shape.phases.splice(phaseIndex, 0, phaseObj);
            phaseDefine(grid, diagram, parent, gridRowIndex, orientation_2, phaseIndex);
            if (orientation_2) {
                phaseNode = diagram.nameTable[grid.rows[gridRowIndex].cells[phaseIndex].children[0].id];
                if (phaseIndex === 0 && shape.header && shape.hasHeader) {
                    grid.rows[0].cells[0].children = grid.rows[0].cells[1].children;
                    grid.rows[0].cells[1].children = [];
                    var fristRow = grid.rows[0];
                    for (var i_2 = 0; i_2 < fristRow.cells.length; i_2++) {
                        fristRow.cells[i_2].minWidth = undefined;
                        if (i_2 === 0) {
                            fristRow.cells[i_2].columnSpan = grid.rows[0].cells.length;
                        }
                        else {
                            fristRow.cells[i_2].columnSpan = 1;
                        }
                    }
                }
                addHorizontalPhase(diagram, parent, grid, phaseIndex, orientation_2);
                var col = grid.columnDefinitions();
                grid.updateColumnWidth(phaseIndex, col[phaseIndex].width, true, padding);
                phaseNode.maxWidth = phaseNode.wrapper.maxWidth = col[phaseIndex].width;
                if (col.length > phaseIndex + 1) {
                    var nextPhaseNode = diagram.nameTable[grid.rows[gridRowIndex].cells[phaseIndex + 1].children[0].id];
                    grid.updateColumnWidth(phaseIndex + 1, col[phaseIndex + 1].width, true, padding);
                    nextPhaseNode.maxWidth = nextPhaseNode.wrapper.maxWidth = col[phaseIndex + 1].width;
                }
                parent.width = parent.wrapper.width = parent.wrapper.children[0].width = grid.width;
            }
            else {
                phaseNode = diagram.nameTable[grid.rows[gridRowIndex + phaseIndex].cells[0].children[0].id];
                var row = grid.rowDefinitions();
                var size = row[gridRowIndex + phaseIndex].height;
                addVerticalPhase(diagram, parent, grid, gridRowIndex + phaseIndex, orientation_2);
                grid.updateRowHeight(gridRowIndex + phaseIndex, size, true, padding);
                if (row.length > gridRowIndex + phaseIndex + 1) {
                    size = row[gridRowIndex + phaseIndex + 1].height;
                    grid.updateRowHeight(gridRowIndex + phaseIndex + 1, size, true, padding);
                }
                parent.height = parent.wrapper.height = parent.wrapper.children[0].height = grid.actualSize.height;
            }
            swimLaneMeasureAndArrange(parent);
            parent.width = parent.wrapper.actualSize.width;
            updateHeaderMaxWidth(diagram, parent);
            diagram.drag(parent, x - parent.wrapper.bounds.x, y - parent.wrapper.bounds.y);
            checkPhaseOffset(parent, diagram);
            if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
                var entry = {
                    type: 'PhaseCollectionChanged', changeType: 'Insert', undoObject: cloneObject(phaseObj),
                    redoObject: cloneObject(phaseNode), category: 'Internal'
                };
                diagram.addHistoryEntry(entry);
            }
            diagram.updateDiagramObject(parent);
        }
    }
}
export function addLastPhase(phaseIndex, parent, entry, grid, orientation, newPhase) {
    var shape = parent.shape;
    var prevPhase = shape.phases[phaseIndex - 2];
    var prevOffset = entry.previousPhase.offset;
    if (orientation) {
        var nextCol = grid.columnDefinitions()[phaseIndex - 1];
        var addPhase_3 = new ColumnDefinition();
        if (phaseIndex > 1) {
            addPhase_3.width = (nextCol.width) - (prevOffset - prevPhase.offset);
            nextCol.width = prevOffset - prevPhase.offset;
        }
        else {
            addPhase_3.width = nextCol.width - prevOffset;
            nextCol.width = prevOffset;
        }
        grid.updateColumnWidth(phaseIndex - 1, nextCol.width, false);
        grid.addColumn(phaseIndex, addPhase_3, false);
    }
    else {
        var nextCol = grid.rowDefinitions()[phaseIndex];
        var addPhase_4 = new RowDefinition();
        if (phaseIndex > 1) {
            addPhase_4.height = entry.undoObject.offset - prevOffset;
            nextCol.height = prevOffset - prevPhase.offset;
        }
        else {
            addPhase_4.height = nextCol.height - prevOffset;
            nextCol.height = prevOffset;
        }
        grid.updateRowHeight(phaseIndex, nextCol.height, false);
        grid.addRow(1 + phaseIndex, addPhase_4, false);
    }
}
export function addHorizontalPhase(diagram, node, grid, index, orientation) {
    var shape = node.shape;
    var nextCell;
    var i;
    var prevCell;
    var gridCell;
    var row;
    var laneIndex = findStartLaneIndex(node);
    if (shape.header && shape.hasHeader) {
        grid.rows[0].cells[0].columnSpan = grid.rows[0].cells.length;
    }
    for (i = laneIndex; i < grid.rows.length; i++) {
        row = grid.rows[i];
        prevCell = row.cells[index - 1];
        gridCell = row.cells[index];
        nextCell = row.cells[index + 1];
        addSwimlanePhases(diagram, node, prevCell, gridCell, nextCell, i, index);
    }
    ChangeLaneIndex(diagram, node, 1);
}
export function addVerticalPhase(diagram, node, grid, rowIndex, orientation) {
    var prevCell;
    var gridCell;
    var nextCell;
    var row = grid.rows[rowIndex];
    var nextRow = grid.rows[rowIndex + 1];
    var prevRow = grid.rows[rowIndex - 1];
    for (var i = 1; i < row.cells.length; i++) {
        gridCell = row.cells[i];
        nextCell = (nextRow) ? nextRow.cells[i] : undefined;
        prevCell = prevRow.cells[i];
        addSwimlanePhases(diagram, node, prevCell, gridCell, nextCell, rowIndex, i);
    }
    ChangeLaneIndex(diagram, node, 1);
}
function addSwimlanePhases(diagram, node, prevCell, gridCell, nextCell, rowIndex, columnIndex) {
    var x;
    var y;
    var shape = node.shape;
    var orientation = shape.orientation === 'Horizontal' ? true : false;
    var grid = node.wrapper.children[0];
    var width = gridCell.desiredCellWidth;
    var height = gridCell.desiredCellHeight;
    var col = (orientation) ? rowIndex : columnIndex;
    var rect;
    var canvas;
    var parentWrapper;
    var j;
    var i = (orientation) ? rowIndex : columnIndex;
    if (prevCell) {
        x = orientation ? prevCell.bounds.x + prevCell.bounds.width : prevCell.bounds.x;
        y = orientation ? prevCell.bounds.y : prevCell.bounds.y + prevCell.bounds.height;
    }
    else {
        x = grid.bounds.x;
        y = nextCell.bounds.y;
    }
    rect = new Rect(x, y, width, height);
    canvas = {
        id: node.id + ((orientation) ? shape.lanes[i - 2] : shape.lanes[i - 1]).id + randomId()[0],
        rowIndex: rowIndex, columnIndex: columnIndex,
        width: gridCell.minWidth, height: gridCell.minHeight,
        style: ((orientation) ? shape.lanes[i - 2] : shape.lanes[i - 1]).style,
        constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
        container: { type: 'Canvas', orientation: orientation ? 'Horizontal' : 'Vertical' }
    };
    parentWrapper = addObjectToGrid(diagram, grid, node, canvas, false, false, true);
    parentWrapper.children[0].isCalculateDesiredSize = false;
    grid.addObject(parentWrapper, rowIndex, columnIndex);
    if (nextCell && nextCell.children && nextCell.children.length) {
        for (j = 0; j < nextCell.children.length; j++) {
            if (orientation) {
                diagram.nameTable[nextCell.children[j].id].columnIndex += 1;
            }
            else {
                diagram.nameTable[nextCell.children[j].id].rowIndex += 1;
            }
        }
    }
    arrangeChildInGrid(diagram, nextCell, gridCell, rect, parentWrapper, orientation, prevCell);
}
export function arrangeChildInGrid(diagram, nextCell, gridCell, rect, parentWrapper, orientation, prevCell) {
    var child;
    var point;
    var childNode;
    var parent = diagram.nameTable[parentWrapper.id];
    var changeCell = (!nextCell) ? prevCell : nextCell;
    var swimLane = diagram.nameTable[parent.parentId];
    var padding = swimLane.shape.padding;
    if (changeCell.children && changeCell.children[0].children.length > 1) {
        for (var j = 1; j < changeCell.children[0].children.length; j++) {
            child = changeCell.children[0].children[j];
            childNode = diagram.nameTable[child.id];
            point = (orientation) ? { x: child.bounds.x, y: child.bounds.center.y } :
                { x: child.bounds.center.x, y: child.bounds.top };
            if (rect.containsPoint(point)) {
                gridCell.children[0].children.push(child);
                changeCell.children[0].children.splice(j, 1);
                j--;
                diagram.deleteChild(childNode);
                if (!childNode.isLane) {
                    childNode.parentId = parentWrapper.id;
                }
                if (!parent.children) {
                    parent.children = [];
                }
                if (!nextCell) {
                    if (orientation) {
                        childNode.margin.left = childNode.wrapper.bounds.x - changeCell.children[0].bounds.right;
                    }
                    else {
                        childNode.margin.top = childNode.wrapper.bounds.y - changeCell.children[0].bounds.bottom;
                    }
                }
                parent.children.push(child.id);
                childNode.zIndex = parent.zIndex + 1;
                diagram.removeElements(childNode);
            }
            else if (nextCell) {
                if (orientation) {
                    childNode.margin.left -= gridCell.desiredCellWidth;
                    if (padding > childNode.margin.left) {
                        childNode.margin.left = padding;
                    }
                }
                else {
                    childNode.margin.top -= gridCell.desiredCellHeight;
                    if (padding > childNode.margin.top) {
                        childNode.margin.top = padding;
                    }
                }
            }
        }
    }
}
export function swimLaneSelection(diagram, node, corner) {
    if (node.shape.type === 'SwimLane' && (corner === 'ResizeSouth' || corner === 'ResizeEast')) {
        var shape = node.shape;
        var wrapper = node.wrapper.children[0];
        var child = void 0;
        var index = void 0;
        if (corner === 'ResizeSouth') {
            if (shape.orientation === 'Vertical') {
                child = wrapper.rows[wrapper.rows.length - 1].cells[0];
            }
            else {
                index = wrapper.rows.length - 1;
                child = wrapper.rows[index].cells[wrapper.rows[index].cells.length - 1];
            }
        }
        else {
            index = (shape.header && shape.hasHeader) ? 1 : 0;
            child = wrapper.rows[index].cells[wrapper.rows[index].cells.length - 1];
        }
        diagram.commandHandler.select(diagram.nameTable[child.children[0].id]);
    }
}
export function pasteSwimLane(swimLane, diagram, clipboardData, laneNode, isLane, isUndo) {
    var i;
    var j;
    var lane;
    var phase;
    var node;
    var ranId = randomId();
    var cloneLane;
    var childX;
    var childY;
    var shape = swimLane.shape;
    var lanes;
    var phases = shape.phases;
    var nodeX = swimLane.offsetX - swimLane.wrapper.actualSize.width / 2;
    var nodeY = swimLane.offsetY - swimLane.wrapper.actualSize.height / 2;
    if (shape.orientation === 'Vertical') {
        nodeY += (shape.header && shape.hasHeader) ? shape.header.height : 0;
    }
    if (!isUndo) {
        if (!isLane) {
            swimLane.id += ranId;
            if (shape && shape.header && shape.hasHeader) {
                shape.header.id += ranId;
            }
            else {
                shape.header = undefined;
            }
        }
        for (i = 0; phases && i < phases.length; i++) {
            phase = phases[i];
            phase.id += ranId;
        }
    }
    lanes = (isLane) ? [clipboardData.childTable[laneNode.id]] : shape.lanes;
    for (i = 0; lanes && i < lanes.length; i++) {
        lane = lanes[i];
        if (!isUndo) {
            lane.id += ranId;
        }
        for (j = 0; lane.children && j < lane.children.length; j++) {
            node = lane.children[j];
            childX = node.wrapper.offsetX - node.width / 2;
            childY = node.wrapper.offsetY - node.height / 2;
            node.zIndex = -1;
            node.inEdges = node.outEdges = [];
            if (isUndo || (clipboardData && (clipboardData.pasteIndex === 1 || clipboardData.pasteIndex === 0))) {
                if (shape.orientation === 'Vertical') {
                    node.margin.top = childY - nodeY;
                }
                else {
                    node.margin.left = childX - nodeX;
                }
            }
            if (!isUndo) {
                node.id += ranId;
            }
        }
    }
    if (!isUndo) {
        if (isLane) {
            var newShape = {
                lanes: lanes,
                phases: phases, phaseSize: shape.phaseSize,
                type: 'SwimLane', orientation: shape.orientation,
                header: { annotation: { content: 'Title' }, height: 50 },
            };
            cloneLane = { shape: newShape };
            if (shape.orientation === 'Horizontal') {
                cloneLane.width = swimLane.wrapper.actualSize.width;
                cloneLane.height = laneNode.wrapper.actualSize.height + shape.header.height + shape.phaseSize;
                cloneLane.offsetX = swimLane.wrapper.offsetX + (clipboardData.pasteIndex * 10);
                cloneLane.offsetY = laneNode.wrapper.offsetY + (clipboardData.pasteIndex * 10);
            }
            else {
                cloneLane.width = laneNode.wrapper.actualSize.width;
                cloneLane.height = swimLane.wrapper.actualSize.height;
                cloneLane.offsetX = laneNode.wrapper.offsetX + (clipboardData.pasteIndex * 10);
                cloneLane.offsetY = swimLane.wrapper.offsetY + (clipboardData.pasteIndex * 10);
            }
            swimLane = cloneLane;
        }
        if (clipboardData.pasteIndex !== 0) {
            swimLane.offsetX += 10;
            swimLane.offsetY += 10;
        }
        swimLane.zIndex = -1;
        swimLane = diagram.add(swimLane);
        if (!isLane) {
            for (var _i = 0, _a = Object.keys(clipboardData.childTable); _i < _a.length; _i++) {
                var i_3 = _a[_i];
                var connector = clipboardData.childTable[i_3];
                connector.id += ranId;
                connector.sourceID += ranId;
                connector.targetID += ranId;
                connector.zIndex = -1;
                diagram.add(connector);
            }
        }
        if (diagram.mode !== 'SVG') {
            diagram.refreshDiagramLayer();
        }
        diagram.select([swimLane]);
    }
    return swimLane;
}
export function gridSelection(diagram, selectorModel, id, isSymbolDrag) {
    var canvas;
    var node = selectorModel.nodes[0];
    if (isSymbolDrag || checkParentAsContainer(diagram, node, true)) {
        var targetnode = void 0;
        var wrapper = void 0;
        var parentNode = void 0;
        var bounds = void 0;
        var swimLaneId = void 0;
        var element = new DiagramElement();
        if (id) {
            swimLaneId = (diagram.nameTable[id].parentId);
            targetnode = node = diagram.nameTable[id];
        }
        wrapper = !id ? node.wrapper : targetnode.wrapper;
        parentNode = diagram.nameTable[swimLaneId || node.parentId];
        if (parentNode && parentNode.container.type === 'Grid') {
            canvas = new Canvas();
            canvas.children = [];
            if (isSymbolDrag || !(node.isHeader)) {
                if ((parentNode.container.orientation === 'Horizontal' && node.isPhase) ||
                    (parentNode.container.orientation === 'Vertical' &&
                        (node.rowIndex > 0 && node.columnIndex > 0 || node.isLane))) {
                    bounds = findBounds(parentNode, (targetnode) ? targetnode.columnIndex : node.columnIndex, (parentNode.shape.header && parentNode.shape.hasHeader) ? true : false);
                    canvas.offsetX = bounds.center.x;
                    canvas.offsetY = bounds.center.y;
                    element.width = bounds.width;
                    element.height = bounds.height;
                }
                else {
                    canvas.offsetX = parentNode.offsetX;
                    canvas.offsetY = wrapper.offsetY;
                    element.width = parentNode.wrapper.actualSize.width;
                    element.height = wrapper.actualSize.height;
                }
            }
            canvas.children.push(element);
            canvas.measure(new Size());
            canvas.arrange(canvas.desiredSize);
        }
    }
    return canvas;
}
export function removeLaneChildNode(diagram, swimLaneNode, currentObj, isChildNode, laneIndex) {
    laneIndex = (laneIndex !== undefined) ? laneIndex : findLaneIndex(swimLaneNode, currentObj);
    var preventHistory = false;
    var lanenode = swimLaneNode.shape.lanes[laneIndex];
    for (var j = lanenode.children.length - 1; j >= 0; j--) {
        if (isChildNode) {
            if (isChildNode.id === lanenode.children[j].id) {
                lanenode.children.splice(j, 1);
            }
        }
        else {
            diagram.removeDependentConnector(lanenode.children[j]);
            if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
                diagram.diagramActions = diagram.diagramActions | DiagramAction.UndoRedo;
                preventHistory = true;
            }
            diagram.remove(lanenode.children[j]);
            lanenode.children.splice(j, 1);
            if (preventHistory) {
                diagram.diagramActions = diagram.diagramActions & ~DiagramAction.UndoRedo;
            }
        }
    }
}
export function getGridChildren(obj) {
    var children = obj.children[0];
    return children;
}
export function removeSwimLane(diagram, obj) {
    var rows = obj.wrapper.children[0].rows;
    var preventHistory = false;
    var node;
    var i;
    var j;
    var k;
    var child;
    var removeNode;
    for (i = 0; i < rows.length; i++) {
        for (j = 0; j < rows[i].cells.length; j++) {
            child = getGridChildren(rows[i].cells[j]);
            if (child && child.children) {
                for (k = child.children.length - 1; k >= 0; k--) {
                    if (child.children[k].children) {
                        removeNode = diagram.nameTable[child.children[k].id];
                        if (removeNode) {
                            if (removeNode.isLane) {
                                deleteNode(diagram, removeNode);
                            }
                            else {
                                diagram.removeDependentConnector(removeNode);
                                diagram.diagramActions |= DiagramAction.PreventHistory;
                                if ((removeNode.constraints & NodeConstraints.Delete)) {
                                    diagram.remove(removeNode);
                                }
                                else {
                                    removeChildInContainer(diagram, removeNode, {}, false);
                                }
                                diagram.diagramActions &= ~DiagramAction.PreventHistory;
                            }
                        }
                    }
                }
            }
            if (child) {
                node = diagram.nameTable[child.id];
                if (node) {
                    deleteNode(diagram, node);
                }
            }
        }
    }
}
function deleteNode(diagram, node) {
    diagram.nodes.splice(diagram.nodes.indexOf(node), 1);
    diagram.removeFromAQuad(node);
    diagram.removeObjectsFromLayer(node);
    delete diagram.nameTable[node.id];
    diagram.removeElements(node);
}
export function removeLane(diagram, lane, swimLane, lanes) {
    var args;
    if (swimLane.shape.type === 'SwimLane') {
        var shape = swimLane.shape;
        var laneIndex = void 0;
        if (shape.lanes.length === 1) {
            diagram.remove(swimLane);
        }
        else {
            var x = swimLane.wrapper.bounds.x;
            var y = swimLane.wrapper.bounds.y;
            var row = void 0;
            var i = void 0;
            var cell = void 0;
            var j = void 0;
            var child = void 0;
            var grid = swimLane.wrapper.children[0];
            laneIndex = (lanes) ? (shape.lanes.indexOf(lanes)) : findLaneIndex(swimLane, lane);
            args = {
                element: lane, cause: diagram.diagramActions, state: 'Changing', type: 'Removal', cancel: false, laneIndex: laneIndex
            };
            diagram.triggerEvent(DiagramEvent.collectionChange, args);
            if (!args.cancel) {
                var undoObj = cloneObject(shape.lanes[laneIndex]);
                removeLaneChildNode(diagram, swimLane, lane, undefined, laneIndex);
                if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
                    var entry = {
                        type: 'LaneCollectionChanged', changeType: 'Remove', undoObject: undoObj,
                        redoObject: cloneObject(lane), category: 'Internal'
                    };
                    diagram.addHistoryEntry(entry);
                }
                shape.lanes.splice(laneIndex, 1);
                var index = (lane) ? (shape.orientation === 'Horizontal' ? lane.rowIndex : lane.columnIndex) :
                    (findStartLaneIndex(swimLane) + laneIndex);
                if (shape.orientation === 'Horizontal') {
                    row = grid.rows[index];
                    for (i = 0; i < row.cells.length; i++) {
                        cell = row.cells[i];
                        if (cell && cell.children.length > 0) {
                            for (j = 0; j < cell.children.length; j++) {
                                child = cell.children[j];
                                removeChildren(diagram, child);
                            }
                        }
                    }
                    grid.removeRow(index);
                }
                else {
                    swimLane.width = (swimLane.width !== undefined) ?
                        swimLane.width - grid.rows[0].cells[index].actualSize.width : swimLane.width;
                    for (i = 0; i < grid.rows.length; i++) {
                        cell = grid.rows[i].cells[index];
                        if (cell && cell.children.length > 0) {
                            for (j = 0; j < cell.children.length; j++) {
                                child = cell.children[j];
                                removeChildren(diagram, child);
                            }
                        }
                    }
                    grid.removeColumn(index);
                }
                args = {
                    element: lane, cause: diagram.diagramActions, state: 'Changed', type: 'Removal', cancel: false, laneIndex: laneIndex
                };
                diagram.triggerEvent(DiagramEvent.collectionChange, args);
                swimLane.width = swimLane.wrapper.width = grid.width;
                swimLane.height = swimLane.wrapper.height = grid.height;
                swimLaneMeasureAndArrange(swimLane);
                if (swimLane.shape.orientation === 'Vertical') {
                    index = 0;
                }
                ChangeLaneIndex(diagram, swimLane, index);
                diagram.drag(swimLane, x - swimLane.wrapper.bounds.x, y - swimLane.wrapper.bounds.y);
                diagram.updateDiagramObject(swimLane);
            }
        }
    }
}
export function removeChildren(diagram, canvas) {
    var i;
    var node;
    if (canvas instanceof Canvas) {
        if (canvas.children.length > 0) {
            for (i = 0; i < canvas.children.length; i++) {
                if (canvas.children[i] instanceof Canvas) {
                    removeChildren(diagram, canvas.children[i]);
                }
            }
        }
        node = diagram.getObject(canvas.id);
        deleteNode(diagram, node);
    }
}
export function removePhase(diagram, phase, swimLane, swimLanePhases) {
    diagram.protectPropertyChange(true);
    var x = swimLane.wrapper.bounds.x;
    var y = swimLane.wrapper.bounds.y;
    var isLastPhase = false;
    var previousPhase;
    var shape = swimLane.shape;
    var grid = swimLane.wrapper.children[0];
    var phaseIndex = swimLanePhases ? shape.phases.indexOf(swimLanePhases) : findPhaseIndex(phase, swimLane);
    var phaseLength = shape.phases.length;
    if (shape.phases.length > 1) {
        if (phaseIndex === phaseLength - 1) {
            isLastPhase = true;
            previousPhase = cloneObject(shape.phases[phaseIndex - 1]);
        }
        var undoObj = cloneObject(shape.phases[phaseIndex]);
        shape.phases.splice(phaseIndex, 1);
        if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
            var entry = {
                type: 'PhaseCollectionChanged', changeType: 'Remove', undoObject: undoObj, previousPhase: previousPhase,
                redoObject: cloneObject(phase), category: 'Internal', isLastPhase: isLastPhase
            };
            diagram.addHistoryEntry(entry);
        }
        if (shape.orientation === 'Horizontal') {
            removeHorizontalPhase(diagram, grid, phase, phaseIndex);
        }
        else {
            removeVerticalPhase(diagram, grid, phase, phaseIndex, swimLane);
        }
        updateHeaderMaxWidth(diagram, swimLane);
        ChangeLaneIndex(diagram, swimLane, 1);
        checkPhaseOffset(swimLane, diagram);
        diagram.protectPropertyChange(false);
        diagram.updateDiagramObject(swimLane);
    }
}
export function removeHorizontalPhase(diagram, grid, phase, phaseIndex) {
    var row;
    var cell;
    var prevCell;
    var actualChild;
    var prevChild;
    var prevCanvas;
    var width;
    phaseIndex = (phaseIndex !== undefined) ? phaseIndex : phase.columnIndex;
    var i;
    var j;
    var k;
    var child;
    var node;
    var object;
    for (i = 0; i < grid.rows.length; i++) {
        row = grid.rows[i];
        if (row.cells.length > 1) {
            cell = row.cells[phaseIndex];
            prevCell = (row.cells.length - 1 === phaseIndex) ? row.cells[phaseIndex - 1] :
                row.cells[phaseIndex + 1];
            prevCanvas = prevCell.children[0];
            if (cell.children.length > 0) {
                actualChild = cell.children[0];
                node = diagram.nameTable[actualChild.id];
                if (prevCell.children.length === 0 && cell.children.length > 0) {
                    prevCell.children = cell.children;
                    prevCell.columnSpan = cell.columnSpan - 1;
                }
                else {
                    for (j = 0; j < actualChild.children.length; j++) {
                        child = actualChild.children[j];
                        if (child instanceof Canvas) {
                            object = diagram.nameTable[child.id];
                            if (!object.isLane) {
                                object.parentId = prevCanvas.id;
                            }
                            if ((row.cells.length - 1 === phaseIndex)) {
                                object.margin.left = object.wrapper.bounds.x - prevCanvas.bounds.x;
                                child.margin.left = object.wrapper.bounds.x - prevCanvas.bounds.x;
                            }
                            prevCanvas.children.push(child);
                            if (diagram.nameTable[prevCanvas.id]) {
                                var parentNode = diagram.nameTable[prevCanvas.id];
                                if (!parentNode.children) {
                                    parentNode.children = [];
                                }
                                parentNode.children.push(child.id);
                            }
                            actualChild.children.splice(j, 1);
                            j--;
                            if (node && node.children && node.children.indexOf(object.id) !== -1) {
                                node.children.splice(node.children.indexOf(object.id), 1);
                            }
                        }
                        if ((row.cells.length - 1 !== phaseIndex)) {
                            for (k = 0; k < prevCanvas.children.length; k++) {
                                var prevChild_1 = prevCanvas.children[k];
                                if (prevChild_1 instanceof Canvas) {
                                    var prevNode = diagram.nameTable[prevChild_1.id];
                                    prevNode.margin.left = prevNode.wrapper.bounds.x - actualChild.bounds.x;
                                    prevChild_1.margin.left = prevNode.wrapper.bounds.x - actualChild.bounds.x;
                                }
                            }
                        }
                    }
                    if (node && node.isPhase) {
                        var object_1 = diagram.nameTable[prevCanvas.id];
                        if (object_1) {
                            prevCanvas.maxWidth = object_1.wrapper.maxWidth = object_1.wrapper.maxWidth += node.wrapper.maxWidth;
                        }
                    }
                    deleteNode(diagram, node);
                }
            }
        }
    }
    var prevWidth = grid.columnDefinitions()[phaseIndex].width;
    grid.removeColumn(phaseIndex);
    if ((phaseIndex < grid.columnDefinitions().length)) {
        width = grid.columnDefinitions()[phaseIndex].width;
        width += prevWidth;
        grid.updateColumnWidth(phaseIndex, width, true);
    }
    else {
        width = grid.columnDefinitions()[phaseIndex - 1].width;
        width += prevWidth;
        grid.updateColumnWidth(phaseIndex - 1, width, true);
    }
}
export function removeVerticalPhase(diagram, grid, phase, phaseIndex, swimLane) {
    var row;
    var cell;
    var prevRow;
    var height;
    var i;
    var j;
    var k;
    var prevCell;
    var prevChild;
    var shape = swimLane.shape;
    var child;
    var object;
    var phaseRowIndex = (phaseIndex !== undefined) ? ((shape.header) ? phaseIndex + 1 : phaseIndex) : phase.rowIndex;
    row = grid.rows[phaseRowIndex];
    var top = swimLane.wrapper.bounds.y;
    var phaseCount = shape.phases.length;
    if (shape.header !== undefined && shape.hasHeader) {
        top += grid.rowDefinitions()[0].height;
    }
    prevRow = (phaseIndex === phaseCount) ? grid.rows[phaseRowIndex - 1] : grid.rows[phaseRowIndex + 1];
    for (i = 0; i < row.cells.length; i++) {
        cell = row.cells[i];
        prevCell = prevRow.cells[i];
        prevChild = prevCell.children[0];
        if (cell.children.length > 0) {
            var children = cell.children[0];
            var node = diagram.nameTable[children.id];
            if (phaseIndex < phaseCount) {
                for (k = 0; k < prevChild.children.length; k++) {
                    child = prevChild.children[k];
                    if (child instanceof Canvas) {
                        object = diagram.nameTable[child.id];
                        object.margin.top = object.wrapper.bounds.y - (phaseIndex === 0 ? top : children.bounds.y);
                        child.margin.top = object.wrapper.bounds.y - (phaseIndex === 0 ? top : children.bounds.y);
                    }
                }
            }
            for (j = 0; j < children.children.length; j++) {
                child = children.children[j];
                if (child instanceof Canvas) {
                    object = diagram.nameTable[child.id];
                    object.parentId = prevChild.id;
                    if (phaseIndex === phaseCount) {
                        object.margin.top = object.wrapper.bounds.y - (phaseIndex === 0 ? top : prevChild.bounds.y);
                        child.margin.top = object.wrapper.bounds.y - (phaseIndex === 0 ? top : prevChild.bounds.y);
                    }
                    prevChild.children.push(child);
                    children.children.splice(j, 1);
                    j--;
                    if (node.children && node.children.indexOf(object.id) !== -1) {
                        node.children.splice(node.children.indexOf(object.id), 1);
                    }
                }
            }
            deleteNode(diagram, node);
        }
    }
    var prevHeight = grid.rowDefinitions()[phaseRowIndex].height;
    grid.removeRow(phaseRowIndex);
    if ((phaseRowIndex < grid.rowDefinitions().length)) {
        height = grid.rowDefinitions()[phaseRowIndex].height;
        height += prevHeight;
        grid.updateRowHeight(phaseRowIndex, height, true);
    }
    else {
        height = grid.rowDefinitions()[phaseRowIndex - 1].height;
        height += prevHeight;
        grid.updateRowHeight(phaseRowIndex - 1, height, true);
    }
}
/**
 * @private
 */
export function considerSwimLanePadding(diagram, node, padding) {
    var lane = diagram.nameTable[node.parentId];
    if (lane && lane.isLane) {
        var swimLane = diagram.nameTable[lane.parentId];
        var grid = swimLane.wrapper.children[0];
        var x = swimLane.wrapper.bounds.x;
        var y = swimLane.wrapper.bounds.y;
        grid.updateColumnWidth(lane.columnIndex, grid.columnDefinitions()[lane.columnIndex].width, true, padding);
        grid.updateRowHeight(lane.rowIndex, grid.rowDefinitions()[lane.rowIndex].height, true, padding);
        var canvas = lane.wrapper;
        var laneHeader = void 0;
        var isConsiderHeader = false;
        if (node.margin.left < padding) {
            node.margin.left = padding;
        }
        if (node.margin.top < padding) {
            node.margin.top = padding;
        }
        for (var i = 0; i < canvas.children.length; i++) {
            var child = canvas.children[i];
            if (child instanceof Canvas) {
                var childNode = diagram.nameTable[child.id];
                if (childNode.isLane) {
                    laneHeader = childNode.wrapper;
                    isConsiderHeader = true;
                    break;
                }
            }
        }
        if (laneHeader) {
            if (swimLane.shape.orientation === 'Horizontal') {
                if (node.margin.left < padding + laneHeader.actualSize.width) {
                    node.margin.left = padding + laneHeader.actualSize.width;
                }
            }
            else {
                if (node.margin.top < padding + laneHeader.actualSize.height) {
                    node.margin.top = padding + laneHeader.actualSize.height;
                }
            }
        }
        swimLane.wrapper.measure(new Size(swimLane.width, swimLane.height));
        swimLane.wrapper.arrange(swimLane.wrapper.desiredSize);
        node.offsetX = node.wrapper.offsetX;
        node.offsetY = node.wrapper.offsetY;
        diagram.nodePropertyChange(node, {}, { margin: { left: node.margin.left, top: node.margin.top } });
        grid.measure(new Size(grid.width, grid.height));
        grid.arrange(grid.desiredSize);
        swimLane.width = swimLane.wrapper.width = swimLane.wrapper.children[0].actualSize.width;
        swimLane.height = swimLane.wrapper.height = swimLane.wrapper.children[0].actualSize.height;
    }
}
/**
 * @private
 */
export function checkLaneChildrenOffset(swimLane) {
    if (swimLane.shape.type === 'SwimLane') {
        var lanes = swimLane.shape.lanes;
        var lane = void 0;
        var child = void 0;
        for (var i = 0; i < lanes.length; i++) {
            lane = lanes[i];
            for (var j = 0; j < lane.children.length; j++) {
                child = lane.children[j];
                child.offsetX = child.wrapper.offsetX;
                child.offsetY = child.wrapper.offsetY;
            }
        }
    }
}
export function findLane(laneNode, diagram) {
    var lane;
    if (laneNode.isLane) {
        var swimLane = diagram.getObject(laneNode.parentId);
        if (swimLane && swimLane.shape.type === 'SwimLane' && laneNode.isLane) {
            var laneIndex = findLaneIndex(swimLane, laneNode);
            lane = swimLane.shape.lanes[laneIndex];
        }
    }
    return lane;
}
export function canLaneInterchange(laneNode, diagram) {
    if (laneNode.isLane) {
        var lane = findLane(laneNode, diagram);
        if (lane.canMove) {
            return true;
        }
    }
    return false;
}
export function updateSwimLaneChildPosition(lanes, diagram) {
    var lane;
    var node;
    for (var i = 0; i < lanes.length; i++) {
        lane = lanes[i];
        for (var j = 0; j < lane.children.length; j++) {
            node = diagram.nameTable[lane.children[j].id];
            node.offsetX = node.wrapper.offsetX;
            node.offsetY = node.wrapper.offsetY;
        }
    }
}
