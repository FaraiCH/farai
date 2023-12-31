import { Point } from './../primitives/point';
import { Rect } from './../primitives/rect';
import { getPoints, intersect3 } from './diagram-util';
import { NoOfSegments } from '../enum/enum';
import { StraightSegment, BezierSegment, OrthogonalSegment } from './../objects/connector';
import { PathElement } from './../core/elements/path-element';
import { cornersPointsBeforeRotation, rotatePoint } from './base-util';
/**
 * Connector modules are used to dock and update the connectors
 */
/** @private */
export function findConnectorPoints(element, layoutOrientation, lineDistribution) {
    var intermeditatePoints;
    var sourcePoint;
    if (element.type === 'Straight' || !element.sourceWrapper) {
        sourcePoint = getSourcePoint(element);
    }
    else {
        sourcePoint = element.sourceWrapper.corners.center;
    }
    intermeditatePoints = terminateConnection(element, sourcePoint, element.targetPoint, layoutOrientation, lineDistribution);
    setLineEndPoint(element, intermeditatePoints[0], false);
    setLineEndPoint(element, intermeditatePoints[intermeditatePoints.length - 1], true);
    return intermeditatePoints;
}
function getSourcePoint(element) {
    var srcPoint;
    if (element.sourcePortWrapper) {
        var srcPort = element.sourcePortWrapper;
        var srcNode = element.sourceWrapper;
        var pt = { x: srcPort.offsetX, y: srcPort.offsetY };
        var direction = getPortDirection(pt, cornersPointsBeforeRotation(srcNode), srcNode.bounds, false);
        srcPoint = pt;
    }
    else if (element.sourceID && element.sourceWrapper) {
        if (element.targetWrapper) {
            var sPoint = element.sourceWrapper.corners.center;
            var tPoint = element.targetWrapper.corners.center;
            srcPoint = getIntersection(element, element.sourceWrapper, sPoint, tPoint, false);
        }
        else {
            srcPoint = element.sourcePoint;
        }
    }
    else {
        srcPoint = element.sourcePoint;
    }
    return srcPoint;
}
function getDirection(source, target, layoutOrientation) {
    if (layoutOrientation === 'LeftToRight') {
        source.direction = source.direction ? source.direction : 'Right';
        target.direction = target.direction ? target.direction : 'Left';
    }
    else if (layoutOrientation === 'RightToLeft') {
        source.direction = source.direction ? source.direction : 'Left';
        target.direction = target.direction ? target.direction : 'Right';
    }
    else if (layoutOrientation === 'TopToBottom') {
        source.direction = source.direction ? source.direction : 'Bottom';
        target.direction = target.direction ? target.direction : 'Top';
    }
    else if (layoutOrientation === 'BottomToTop') {
        source.direction = source.direction ? source.direction : 'Top';
        target.direction = target.direction ? target.direction : 'Bottom';
    }
}
function terminateConnection(element, srcPoint, tarPoint, layoutOrientation, lineDistribution) {
    var sourceNode = element.sourceWrapper;
    var targetNode = element.targetWrapper;
    var sourcePort = element.sourcePortWrapper;
    var targetPort = element.targetPortWrapper;
    var srcCorner;
    var tarCorner;
    var intermeditatePoints = [];
    var segPoint;
    var srcDir;
    var tarDir;
    var minSpace = 13;
    var sourceMargin = { left: 5, right: 5, bottom: 5, top: 5 };
    var targetMargin = { left: 5, right: 5, bottom: 5, top: 5 };
    var source = { corners: srcCorner, point: srcPoint, direction: srcDir, margin: sourceMargin };
    var target = { corners: tarCorner, point: tarPoint, direction: tarDir, margin: targetMargin };
    var sourceCorners;
    var targetCorners;
    if (sourceNode !== undefined && targetNode !== undefined) {
        sourceCorners = cornersPointsBeforeRotation(sourceNode);
        targetCorners = cornersPointsBeforeRotation(targetNode);
        source.corners = sourceNode.corners;
        target.corners = targetNode.corners;
    }
    if (sourcePort !== undefined) {
        var port = { x: sourcePort.offsetX, y: sourcePort.offsetY };
        source.direction = getPortDirection(port, sourceCorners, sourceNode.bounds, false);
    }
    if (targetPort !== undefined) {
        var tarPortPt = { x: targetPort.offsetX, y: targetPort.offsetY };
        target.direction = getPortDirection(tarPortPt, targetCorners, targetNode.bounds, false);
    }
    if (sourceNode !== undefined && targetNode !== undefined) {
        if (source.direction === undefined || target.direction === undefined) {
            if (layoutOrientation) {
                getDirection(source, target, layoutOrientation);
            }
            else {
                if (source.corners.top > target.corners.bottom &&
                    Math.abs(source.corners.top - target.corners.bottom) >
                        (source.margin.top + source.margin.bottom)) {
                    source.direction = source.direction ? source.direction : 'Top';
                    target.direction = target.direction ? target.direction : 'Bottom';
                }
                else if (source.corners.bottom < target.corners.top &&
                    Math.abs(source.corners.bottom - target.corners.top) >
                        (source.margin.bottom + source.margin.top)) {
                    source.direction = source.direction ? source.direction : 'Bottom';
                    target.direction = target.direction ? target.direction : 'Top';
                }
                else if ((source.corners.right < target.corners.left &&
                    Math.abs(source.corners.right - target.corners.left) >
                        (source.margin.right + source.margin.left)) ||
                    ((source.corners.right + minSpace < target.corners.left) ||
                        (target.corners.right >= source.corners.left - minSpace && source.corners.left > target.corners.left))) {
                    source.direction = source.direction ? source.direction : 'Right';
                    target.direction = target.direction ? target.direction : 'Left';
                }
                else if ((source.corners.left > target.corners.right &&
                    Math.abs(source.corners.left - target.corners.right) > (source.margin.left + source.margin.right)) ||
                    ((target.corners.right + minSpace < source.corners.left ||
                        (source.corners.right >= target.corners.left - minSpace
                            && source.corners.left < target.corners.left)))) {
                    source.direction = source.direction ? source.direction : 'Left';
                    target.direction = target.direction ? target.direction : 'Right';
                }
                else {
                    if (sourceNode.id !== targetNode.id && (!sourceCorners.equals(sourceCorners, targetCorners)) &&
                        targetCorners.containsPoint(sourceCorners.topCenter, source.margin.top)) {
                        source.direction = source.direction ? source.direction : 'Bottom';
                        target.direction = target.direction ? target.direction : 'Top';
                    }
                    else {
                        source.direction = source.direction ? source.direction : 'Top';
                        target.direction = target.direction ? target.direction : 'Bottom';
                    }
                }
            }
        }
        return defaultOrthoConnection(element, source.direction, target.direction, source.point, target.point, lineDistribution);
    }
    //It will be called only when there is only one end node
    checkLastSegmentasTerminal(element);
    if (element.sourceWrapper || element.targetWrapper) {
        connectToOneEnd(element, source, target);
    }
    if (element.type === 'Straight' || element.type === 'Bezier') {
        intermeditatePoints = intermeditatePointsForStraight(element, source, target);
    }
    else {
        if (element.type === 'Orthogonal' && element.segments && element.segments.length > 0 &&
            element.segments[0].length !== null &&
            element.segments[0].direction !== null) {
            intermeditatePoints = findPointToPointOrtho(element, source, target, sourceNode, targetNode, sourcePort, targetPort);
        }
        else {
            var extra = void 0;
            if (!source.direction) {
                source.direction = (target.direction) ? ((element.targetPortWrapper !== undefined) ? target.direction : getOppositeDirection(target.direction)) :
                    Point.direction(source.point, target.point);
            }
            else {
                extra = adjustSegmentLength(sourceNode.bounds, source, 20);
            }
            element.segments[0].points = intermeditatePoints = orthoConnection3Segment(element, source, target, extra);
        }
    }
    return intermeditatePoints;
}
function updateSegmentPoints(source, segment) {
    var segPoint;
    var angle;
    var extra;
    source.direction = segment.direction;
    segment.points = [];
    segment.points.push(source.point);
    extra = (segment.direction === 'Left' || segment.direction === 'Top') ? -(segment.length) : segment.length;
    angle = (segment.direction === 'Left' || segment.direction === 'Right') ? 0 : 90;
    segPoint = addLineSegment(source.point, extra, angle);
    segment.points.push(segPoint);
    return segPoint;
}
function pointToPoint(element, source, target) {
    var point;
    var direction;
    var portdirection;
    source.corners = (element.sourceWrapper) ? element.sourceWrapper.corners : undefined;
    if (element.sourcePortWrapper) {
        var port = { x: element.sourcePortWrapper.offsetX, y: element.sourcePortWrapper.offsetY };
        portdirection = getPortDirection(port, cornersPointsBeforeRotation(element.sourceWrapper), element.sourceWrapper.bounds, false);
        if (source.corners && (source.direction === 'Bottom' || source.direction === 'Top')) {
            if (target.point.x > source.corners.left && target.point.x < source.corners.right) {
                direction = (source.point.y > target.point.y) ? 'Top' : 'Bottom';
            }
        }
        else if (source.corners && (source.direction === 'Left' || source.direction === 'Right')) {
            if (target.point.y > source.corners.top && target.point.y < source.corners.bottom) {
                direction = (source.point.x > target.point.x) ? 'Left' : 'Right';
            }
        }
    }
    if (element.sourcePortWrapper && portdirection === getOppositeDirection(direction)) {
        var length_1;
        if ((portdirection === 'Left' || portdirection === 'Right') && (source.point.y >= source.corners.top
            && source.point.y <= source.corners.center.y) &&
            (target.point.y >= source.corners.top && target.point.y <= source.corners.center.y)) {
            source.direction = 'Top';
            length_1 = source.point.y - source.corners.top + 20;
        }
        else if ((portdirection === 'Left' || portdirection === 'Right') && (source.point.y > source.corners.center.y
            && source.point.y <= source.corners.bottom) &&
            (target.point.y > source.corners.center.y && target.point.y <= source.corners.bottom)) {
            source.direction = 'Bottom';
            length_1 = source.corners.bottom - source.point.y + 20;
        }
        else if ((portdirection === 'Top' || portdirection === 'Bottom') && (source.point.x >= source.corners.left
            && source.point.x <= source.corners.center.x) &&
            (target.point.x >= source.corners.left && target.point.x <= source.corners.center.x)) {
            source.direction = 'Left';
            length_1 = source.point.x - source.corners.left + 20;
        }
        else if ((portdirection === 'Top' || portdirection === 'Bottom') && (source.point.x <= source.corners.right
            && source.point.x > source.corners.center.x) &&
            (target.point.x <= source.corners.right && target.point.x < source.corners.center.x)) {
            source.direction = 'Right';
            length_1 = source.corners.right - source.point.x + 20;
        }
        if (source.direction && length_1) {
            point = orthoConnection3Segment(element, source, target, length_1, true);
        }
    }
    else {
        source.direction = (direction) ? direction : findSourceDirection(source.direction, source.point, target.point);
        point = orthoConnection2Segment(source, target);
    }
    return point;
}
function pointToNode(element, source, target) {
    var point;
    target.corners = element.targetWrapper.corners;
    findDirection(element.targetWrapper, source, target, element);
    var direction = findSourceDirection(target.direction, source.point, target.point);
    if (source.direction === target.direction && (source.direction === 'Left' || source.direction === 'Right')) {
        source.direction = direction;
        point = orthoConnection3Segment(element, source, target, element.targetWrapper.width / 2 + 20);
        var source1 = source;
        source1.point = point[1];
        findDirection(element.targetWrapper, source, target, element);
        point = orthoConnection3Segment(element, source, target);
    }
    else {
        source.direction = direction;
        point = orthoConnection2Segment(source, target);
    }
    return point;
}
function addPoints(element, source, target) {
    var refPoint;
    target.corners = element.targetWrapper.corners;
    var direction;
    var length;
    if (source.direction !== 'Left' && source.direction !== 'Right') {
        if (target.corners.center.y === source.point.y &&
            (!(target.corners.left <= source.point.x && source.point.x <= target.corners.right))) {
            direction = 'Top';
            length = target.corners.height / 2 + 20;
        }
        else if ((target.corners.center.y === source.point.y &&
            element.segments[element.segments.length - 2].direction === 'Bottom') ||
            (target.corners.center.y > source.point.y && source.point.y >= target.corners.top)) {
            direction = 'Top';
            length = (source.point.y - target.corners.top) + 20;
        }
        else if ((target.corners.center.y === source.point.y &&
            element.segments[element.segments.length - 2].direction === 'Top') ||
            (target.corners.center.y < source.point.y && source.point.y <= target.corners.bottom)) {
            direction = 'Bottom';
            length = (target.corners.bottom - source.point.y) + 20;
        }
        else if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined &&
            source.corners.top <= source.point.y && source.point.y <= source.corners.bottom) {
            direction = source.direction;
            length = (source.point.y > target.point.y) ? (source.point.y - source.corners.top + 20) :
                (source.corners.bottom - source.point.y + 20);
        }
    }
    else {
        if (target.corners.center.x === source.point.x &&
            (!(target.corners.top < source.point.y && source.point.y <= target.corners.bottom))) {
            direction = 'Left';
            length = target.corners.width / 2 + 20;
        }
        else if ((target.corners.center.x === source.point.x &&
            element.segments[element.segments.length - 2].direction === 'Right')
            || (target.corners.center.x > source.point.x && source.point.x >= target.corners.left)) {
            direction = 'Left';
            length = (source.point.x - target.corners.left) + 20;
        }
        else if ((target.corners.center.x === source.point.x &&
            element.segments[element.segments.length - 2].direction === 'Left') ||
            (target.corners.center.x <= source.point.x && source.point.x <= target.corners.right)) {
            direction = 'Right';
            length = (target.corners.right - source.point.x) + 20;
        }
        else if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined &&
            source.corners.left <= source.point.x && source.point.x <= source.corners.right) {
            direction = source.direction;
            length = (source.point.x > target.point.x) ? (source.point.x - source.corners.left + 20) :
                (source.corners.right - source.point.x + 20);
        }
    }
    var extra = (direction === 'Left' || direction === 'Top') ? -(length) : length;
    var angle = (direction === 'Left' || direction === 'Right') ? 0 : 90;
    refPoint = source.point;
    source.point = addLineSegment(source.point, extra, angle);
    source.direction = Point.direction(source.point, target.point);
    if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined &&
        (source.corners.center.x === target.corners.center.x || source.corners.center.y === target.corners.center.y)) {
        source.direction = target.direction;
    }
    var point = orthoConnection3Segment(element, source, target);
    point.splice(0, 0, refPoint);
    return point;
}
function findSegmentDirection(element, source, target, portDir) {
    var update = false;
    switch (target.direction) {
        case 'Left':
            if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined && (portDir === 'Right' &&
                source.point.x > target.point.x && source.point.y >= source.corners.top &&
                source.point.y <= source.corners.bottom)
                || (((portDir === 'Bottom' && source.point.y > target.point.y) ||
                    (portDir === 'Top' && source.point.y < target.point.y)) &&
                    source.point.x >= source.corners.left && source.point.x <= source.corners.right)) {
                source.direction = (portDir === 'Right') ? ((source.point.y > target.point.y) ? 'Top' : 'Bottom') :
                    (source.point.x < target.point.x ? 'Right' : 'Left');
                update = true;
            }
            else if (source.point.x > target.point.x && (source.point.y > target.point.y || source.point.y < target.point.y)
                && (!(target.corners.top > source.point.y && target.corners.bottom < source.point.y))) {
                source.direction = 'Left';
            }
            else if ((source.point.x < target.point.x && source.point.y > target.point.y) ||
                (source.point.x > target.point.x && (source.point.y <= target.point.y)
                    && ((target.corners.top < source.point.y && target.corners.center.y >= source.point.y)))) {
                source.direction = 'Top';
            }
            else if ((source.point.x < target.point.x && source.point.y < target.point.y) ||
                (source.point.x > target.point.x && (source.point.y > target.point.y)
                    && ((target.corners.bottom < source.point.y && target.corners.center.y > source.point.y)))) {
                source.direction = 'Bottom';
            }
            else if (source.point.y === target.point.y && source.point.x < target.point.x) {
                source.direction = 'Right';
            }
            break;
        case 'Right':
            if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined &&
                ((portDir === 'Bottom' && source.point.y > target.point.y) ||
                    (portDir === 'Top' && source.point.y < target.point.y)) && source.point.x > target.point.x &&
                (source.point.x >= source.corners.left && source.point.x <= source.corners.right)) {
                source.direction = (source.point.x > target.point.x) ? 'Left' : 'Right';
                update = true;
            }
            else if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined &&
                portDir === 'Left' && source.point.x < target.point.x && (source.point.y >= source.corners.top &&
                source.point.y <= source.corners.bottom)) {
                source.direction = (source.point.y > target.point.y) ? 'Top' : 'Bottom';
                update = true;
            }
            else if (source.point.x < target.point.x && target.corners.top <= source.point.y
                && target.corners.bottom >= source.point.y && source.point.y === target.point.y) {
                source.direction = 'Top';
            }
            else if (source.point.y > target.point.y && source.point.x > target.point.x) {
                source.direction = 'Top';
            }
            else if (source.point.y < target.point.y && source.point.x > target.point.x) {
                source.direction = 'Bottom';
            }
            else if (source.point.x < target.point.x && (source.point.y > target.point.y ||
                source.point.y < target.point.y)) {
                source.direction = 'Right';
            }
            else if (source.point.y === target.point.y && source.point.x > target.point.x) {
                source.direction = 'Left';
            }
            break;
        case 'Top':
            if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined && (portDir === 'Bottom' &&
                source.point.y > target.point.y && source.point.x >= source.corners.left &&
                source.point.x <= source.corners.right) || (((portDir === 'Right' && source.point.x > target.point.x) ||
                (portDir === 'Left' && target.point.y > source.point.y && target.point.x > source.point.x)) &&
                (source.point.y >= source.corners.top && source.point.y <= source.corners.bottom))) {
                source.direction = (portDir === 'Bottom') ? ((source.point.x > target.point.x) ? 'Left' : 'Right') :
                    (source.point.y < target.point.y) ? 'Bottom' : 'Top';
                update = true;
            }
            else if (source.point.x === target.point.x && source.point.y < target.point.y) {
                source.direction = 'Bottom';
            }
            else if (source.point.y > target.point.y && source.point.x > target.corners.left &&
                source.point.x < target.corners.right) {
                source.direction = 'Left';
            }
            else if (source.point.y >= target.point.y) {
                source.direction = 'Top';
            }
            else if (source.point.y < target.point.y && source.point.x > target.point.x) {
                source.direction = 'Left';
            }
            else if (source.point.y < target.point.y && source.point.x < target.point.x) {
                source.direction = 'Right';
            }
            break;
        case 'Bottom':
            if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined && ((((portDir === 'Right') ||
                (portDir === 'Left' && target.point.x > source.point.x)) && (source.point.y > target.point.y) &&
                source.point.y >= source.corners.top && source.point.y <= source.corners.bottom) ||
                (((portDir === 'Top' && source.point.y < target.point.y)) &&
                    (source.point.x >= source.corners.left && source.point.x <= source.corners.right)))) {
                if (portDir === 'Right' || portDir === 'Left') {
                    source.direction = (source.point.y > target.point.y) ? 'Top' : 'Bottom';
                }
                else {
                    source.direction = (source.point.x > target.point.x) ? 'Left' : 'Right';
                }
                update = true;
            }
            else if (source.point.y < target.point.y && source.point.x > target.corners.left &&
                target.corners.right > source.point.x) {
                if (source.point.y < target.point.y && source.point.x > target.corners.left &&
                    target.corners.center.x >= source.point.x) {
                    source.direction = 'Left';
                }
                else if (source.point.y < target.point.y && source.point.x < target.corners.right &&
                    target.corners.center.x < source.point.x) {
                    source.direction = 'Right';
                }
            }
            else if (source.point.y > target.point.y && source.point.x > target.point.x) {
                source.direction = 'Left';
            }
            else if (source.point.y > target.point.y && source.point.x < target.point.x) {
                source.direction = 'Right';
            }
            else if (source.point.y <= target.point.y && (source.point.x > target.point.x || target.point.x > source.point.x)) {
                source.direction = 'Bottom';
            }
            break;
    }
    return update;
}
function pointToPort(element, source, target) {
    var point;
    target.corners = element.targetWrapper.corners;
    var portdirection;
    var length;
    if (element.sourcePortWrapper !== undefined) {
        var port = { x: element.sourcePortWrapper.offsetX, y: element.sourcePortWrapper.offsetY };
        portdirection = getPortDirection(port, cornersPointsBeforeRotation(element.sourceWrapper), element.sourceWrapper.bounds, false);
    }
    var update = findSegmentDirection(element, source, target, portdirection);
    if (element.sourcePortWrapper !== undefined && element.targetPortWrapper !== undefined &&
        target.direction === getOppositeDirection(portdirection) &&
        ((((target.direction === 'Left' && source.point.x > target.point.x) || (target.direction === 'Right' &&
            source.point.x < target.point.x)) && source.point.y >= source.corners.top &&
            source.point.y <= source.corners.bottom) || (target.direction === 'Bottom' && source.point.y < target.point.y &&
            (source.point.x >= source.corners.left && source.point.x <= source.corners.right)))) {
        point = addPoints(element, source, target);
    }
    else if (source.direction === target.direction) {
        point = orthoConnection3Segment(element, source, target);
    }
    else if ((((target.direction === 'Left' && source.point.x > target.point.x) ||
        (target.direction === 'Right' && source.point.x < target.point.x)) && (source.direction === 'Top' || source.direction === 'Bottom')
        && ((source.point.y <= target.point.y) &&
            ((target.corners.top <= source.point.y && target.corners.bottom >= source.point.y)))) ||
        ((target.direction === 'Top' && source.point.y > target.point.y) ||
            (target.direction === 'Bottom' && source.point.y < target.point.y) &&
                ((target.corners.left <= source.point.x && target.corners.right >= source.point.x)))) {
        point = addPoints(element, source, target);
    }
    else {
        if (element.sourceWrapper !== undefined && element.targetWrapper !== undefined && element.targetPortWrapper !== undefined &&
            ((source.direction === 'Left' || source.direction === 'Right') &&
                (source.point.y >= source.corners.top && source.point.y <= source.corners.bottom)
                && (target.direction === 'Top' || target.direction === 'Bottom') &&
                (target.corners.center.x === source.corners.center.x))) {
            source.direction = (target.direction === 'Top') ? 'Bottom' : 'Top';
            length = (target.direction === 'Top') ? (source.corners.bottom - source.point.y + 20) :
                (source.point.y - source.corners.top + 20);
            point = orthoConnection3Segment(element, source, target, length);
        }
        else if (element.sourceWrapper !== undefined && element.targetWrapper !== undefined && element.targetPortWrapper !== undefined &&
            ((source.direction === 'Top' || source.direction === 'Bottom') &&
                (source.point.x >= source.corners.left && source.point.x <= source.corners.right) &&
                (target.direction === 'Left' || target.direction === 'Right') && (target.corners.center.y === source.corners.center.y))) {
            source.direction = (target.direction === 'Left') ? 'Right' : 'Left';
            length = (target.direction === 'Left') ? (source.corners.right - source.point.x + 20) :
                (source.point.x - source.corners.left + 20);
            point = orthoConnection3Segment(element, source, target, length);
        }
        else if (update) {
            if (source.direction === 'Left' || source.direction === 'Right') {
                length = (source.direction === 'Left') ? (source.point.x - source.corners.left + 20) :
                    (source.corners.right - source.point.x + 20);
            }
            else {
                length = (source.direction === 'Top') ? (source.point.y - source.corners.top + 20) :
                    (source.corners.bottom - source.point.y + 20);
            }
            point = orthoConnection3Segment(element, source, target, length);
        }
        else {
            point = orthoConnection2Segment(source, target);
        }
    }
    return point;
}
function findPointToPointOrtho(element, source, target, sourceNode, targetNode, sourcePort, targetPort) {
    var j;
    var point;
    var intermeditatePoints = [];
    var direction;
    var port;
    var seg;
    checkLastSegmentasTerminal(element);
    var removeSegment;
    if (element.segments.length > 0) {
        for (var i = 0; i < element.segments.length; i++) {
            var seg_1 = element.segments[i];
            if (i === 0 && element.sourcePortWrapper !== undefined) {
                port = { x: sourcePort.offsetX, y: sourcePort.offsetY };
                direction = getPortDirection(port, cornersPointsBeforeRotation(sourceNode), sourceNode.bounds, false);
                if (seg_1.direction === getOppositeDirection(direction)) {
                    seg_1.direction = direction;
                }
            }
            if (i > 0 && element.segments[i - 1].direction === seg_1.direction) {
                i = checkConsectiveSegmentAsSame(element, i, source);
            }
            else {
                var lastSegment = element.segments[i - 1];
                source.point = (seg_1.direction) ? updateSegmentPoints(source, seg_1) :
                    lastSegment.points[lastSegment.points.length - 1];
            }
            if (i === element.segments.length - 1) {
                if (!targetPort && !targetNode) {
                    point = pointToPoint(element, source, target);
                }
                else if (element.targetWrapper && element.targetPortWrapper === undefined) {
                    checkSourcePointInTarget(element, source);
                    point = pointToNode(element, source, target);
                }
                else {
                    point = pointToPort(element, source, target);
                }
                if (point) {
                    checkPreviousSegment(point, element, source);
                    seg_1.points = [];
                    if (point.length >= 2) {
                        for (j = 0; j < point.length; j++) {
                            seg_1.points.push(point[j]);
                        }
                    }
                    else {
                        removeSegment = i;
                    }
                }
            }
            if (sourcePort && i === 0) {
                var sourcePoint = checkPortdirection(element, sourcePort, sourceNode);
                if (sourcePoint) {
                    source.point = sourcePoint;
                }
            }
        }
        if (removeSegment !== undefined) {
            if (removeSegment === element.segments.length - 1) {
                element.segments[removeSegment - 1].direction = null;
                element.segments[removeSegment - 1].length = null;
            }
            element.segments.splice(removeSegment, 1);
        }
        intermeditatePoints = returnIntermeditatePoints(element, intermeditatePoints);
    }
    return intermeditatePoints;
}
function checkPortdirection(element, sourcePort, sourceNode) {
    var port = { x: sourcePort.offsetX, y: sourcePort.offsetY };
    var point;
    var bounds = cornersPointsBeforeRotation(sourceNode);
    var direction = getPortDirection(port, bounds, sourceNode.bounds, false);
    var seg = element.segments[0];
    if (seg.direction !== direction) {
        pointsFromNodeToPoint(seg, direction, bounds, seg.points[0], seg.points[seg.points.length - 1], false);
        point = seg.points[seg.points.length - 1];
        seg.direction = Point.direction(seg.points[seg.points.length - 2], seg.points[seg.points.length - 1]);
    }
    return point;
}
function checkPreviousSegment(tPoints, connector, source) {
    var actualSegment = connector.segments[connector.segments.length - 2];
    var actualLastPoint = actualSegment.points[actualSegment.points.length - 1];
    var direction;
    if (((actualSegment.direction === 'Top' || actualSegment.direction === 'Bottom') && (actualLastPoint.x === tPoints[1].x)) ||
        ((actualSegment.direction === 'Left' || actualSegment.direction === 'Right') && (actualLastPoint.y === tPoints[1].y))) {
        actualSegment.points[actualSegment.points.length - 1] = tPoints[1];
        direction = Point.direction(actualSegment.points[0], actualSegment.points[actualSegment.points.length - 1]);
        if (connector.sourceWrapper !== undefined && connector.sourcePortWrapper === undefined &&
            direction === getOppositeDirection(actualSegment.direction)) {
            if (actualSegment.direction === 'Left' || actualSegment.direction === 'Right') {
                actualSegment.points[0].x = (actualSegment.direction === 'Right') ?
                    actualSegment.points[0].x - connector.sourceWrapper.corners.width :
                    actualSegment.points[0].x + connector.sourceWrapper.corners.width;
            }
            else {
                actualSegment.points[0].y = (actualSegment.direction === 'Bottom') ?
                    actualSegment.points[0].y - connector.sourceWrapper.corners.height :
                    actualSegment.points[0].y + connector.sourceWrapper.corners.height;
            }
        }
        actualSegment.direction = direction;
        actualSegment.length = Point.distancePoints(actualSegment.points[0], actualSegment.points[actualSegment.points.length - 1]);
        tPoints.splice(0, 1);
    }
}
function connectToOneEnd(element, source, target) {
    var sourcePort = element.sourcePortWrapper;
    var targetPort = element.targetPortWrapper;
    var node = element.sourceWrapper;
    var fixedPoint = source.point;
    var nodeMargin = { left: 0, right: 0, top: 0, bottom: 0 };
    var nodeConnectingPoint = { x: 0, y: 0 };
    var refPoint;
    var nodeDirection = 'Top';
    if (!node) {
        node = element.targetWrapper;
        nodeMargin = target.margin;
    }
    else {
        fixedPoint = target.point;
        nodeMargin = source.margin;
    }
    if (element.type === 'Orthogonal') {
        if ((element.segments && element.segments.length > 0) && element.sourceWrapper &&
            element.segments[0].direction) {
            source.direction = element.segments[0].direction;
            nodeConnectingPoint = findPoint(node.corners, source.direction);
            refPoint = findPoint(node.corners, getOppositeDirection(source.direction));
            nodeConnectingPoint = getIntersection(element, node, nodeConnectingPoint, refPoint, false);
        }
        else {
            var source_1 = { corners: null, direction: null, point: fixedPoint, margin: nodeMargin };
            var target_1 = { corners: null, direction: null, point: null, margin: null };
            findDirection(node, source_1, target_1, element);
            nodeConnectingPoint = target_1.point;
            nodeDirection = target_1.direction;
        }
    }
    else {
        var segmentPoint = void 0;
        if (element.segments && element.segments.length > 1) {
            if (node === element.sourceWrapper) {
                segmentPoint = element.segments[0].point;
            }
            else {
                segmentPoint = element.segments[element.segments.length - 2].point;
            }
        }
        nodeConnectingPoint = getIntersection(element, node, node.bounds.center, (element.segments && element.segments.length > 1) ? segmentPoint : fixedPoint, node === element.targetWrapper);
    }
    if (node === element.sourceWrapper) {
        source.direction = source.direction || nodeDirection;
        source.point = nodeConnectingPoint;
        if (element.sourcePortWrapper) {
            source.point = { x: sourcePort.offsetX, y: sourcePort.offsetY };
            if (element.sourcePadding) {
                source.point = addPaddingToConnector(element, source, target, false);
            }
        }
    }
    else {
        target.direction = target.direction || nodeDirection;
        target.point = nodeConnectingPoint;
        if (element.targetPortWrapper) {
            target.point = { x: targetPort.offsetX, y: targetPort.offsetY };
            if (element.targetPadding) {
                target.point = addPaddingToConnector(element, source, target, true);
            }
        }
    }
}
function addPaddingToConnector(element, source, target, isTarget) {
    var sourcePort = element.sourcePortWrapper;
    var targetPort = element.targetPortWrapper;
    var padding = (isTarget) ? element.targetPadding : element.sourcePadding;
    var paddingPort = (isTarget) ? targetPort : sourcePort;
    var rect = new Rect(paddingPort.bounds.x - padding, paddingPort.bounds.y - padding, paddingPort.actualSize.width + 2 * padding, paddingPort.actualSize.height + 2 * padding);
    var segmentPoints = [rect.topLeft, rect.topRight, rect.bottomRight, rect.bottomLeft];
    segmentPoints[segmentPoints.length] = segmentPoints[0];
    var length = segmentPoints.length;
    var thisSegment = { x1: source.point.x, y1: source.point.y, x2: target.point.x, y2: target.point.y };
    var point = (isTarget) ? target.point : source.point;
    return getIntersectionPoints(thisSegment, segmentPoints, true, point) || point;
}
function checkSourceAndTargetIntersect(sourceWrapper, targetWrapper, connector) {
    var sourceSegment = createSegmentsCollection(sourceWrapper, connector.sourcePadding);
    var targetSegment = createSegmentsCollection(targetWrapper, connector.targetPadding);
    for (var i = 0; i < sourceSegment.length - 1; i++) {
        var srcSegment = sourceSegment[i];
        for (var j = 0; j < targetSegment.length - 1; j++) {
            var tarSegmet = targetSegment[j];
            if (intersect3(srcSegment, tarSegmet).enabled) {
                return true;
            }
        }
    }
    return false;
}
function createSegmentsCollection(sourceWrapper, padding) {
    var segments = [];
    var points = getPoints(sourceWrapper, sourceWrapper.corners, padding);
    points.push(points[0]);
    for (var i = 0; i < points.length - 1; i++) {
        segments.push(createLineSegment(points[i], points[i + 1]));
    }
    return segments;
}
function createLineSegment(sPt, tPt) {
    var line = { x1: sPt.x, y1: sPt.y, x2: tPt.x, y2: tPt.y };
    return line;
}
/** @private */
export function swapBounds(object, bounds, outerBounds) {
    var rectBounds;
    var rotateAngle = object.rotateAngle + object.parentTransform;
    if (rotateAngle) {
        if (rotateAngle < 45) {
            return bounds;
        }
        else if (rotateAngle <= 135) {
            rectBounds = {
                width: bounds.width, height: bounds.height,
                topLeft: bounds.bottomLeft, topCenter: bounds.middleLeft, topRight: bounds.topLeft,
                middleLeft: bounds.bottomCenter, center: outerBounds.center, middleRight: bounds.topCenter,
                bottomLeft: bounds.bottomRight, bottomCenter: bounds.middleRight, bottomRight: bounds.topRight,
                left: outerBounds.left, right: outerBounds.right, top: outerBounds.top, bottom: outerBounds.bottom
            };
        }
        else if (rotateAngle <= 225) {
            rectBounds = {
                width: bounds.width, height: bounds.height,
                topLeft: bounds.bottomLeft, topCenter: bounds.bottomCenter, topRight: bounds.bottomRight,
                middleLeft: bounds.middleRight, center: outerBounds.center, middleRight: bounds.middleLeft,
                bottomLeft: bounds.topLeft, bottomCenter: bounds.topCenter, bottomRight: bounds.topRight,
                left: outerBounds.left, right: outerBounds.right, top: outerBounds.top,
                bottom: outerBounds.bottom
            };
        }
        else if (rotateAngle <= 315) {
            rectBounds = {
                width: bounds.width, height: bounds.height,
                topLeft: bounds.topRight, topCenter: bounds.middleRight, topRight: bounds.bottomRight,
                middleLeft: bounds.topCenter, center: outerBounds.center, middleRight: bounds.bottomCenter,
                bottomLeft: bounds.topLeft, bottomCenter: bounds.middleLeft, bottomRight: bounds.bottomLeft,
                left: outerBounds.left, right: outerBounds.right, top: outerBounds.top, bottom: outerBounds.bottom
            };
        }
        else {
            return bounds;
        }
        return rectBounds;
    }
    return bounds;
}
/* tslint:disable */
function defaultOrthoConnection(ele, srcDir, tarDir, sPt, tPt, lineDistribution) {
    var sourceEle = ele.sourceWrapper;
    var targetEle = ele.targetWrapper;
    var srcPort = ele.sourcePortWrapper;
    var tarPort = ele.targetPortWrapper;
    var intermeditatePoints = [];
    var refPoint;
    var seg;
    var srcCor = sourceEle.corners;
    var tarCor = targetEle.corners;
    var point = tarCor.center;
    var i;
    var sourceMargin = { left: 5, right: 5, bottom: 5, top: 5 };
    var targetMargin = { left: 5, right: 5, bottom: 5, top: 5 };
    var source = { corners: srcCor, point: sPt, direction: srcDir, margin: sourceMargin };
    var target = { corners: tarCor, point: tPt, direction: tarDir, margin: targetMargin };
    var srcBounds = swapBounds(sourceEle, srcCor, ele.sourceWrapper.bounds);
    var tarBounds = swapBounds(targetEle, tarCor, ele.targetWrapper.bounds);
    var isInterSect = false;
    if (ele.sourceWrapper && ele.targetWrapper) {
        isInterSect = checkSourceAndTargetIntersect(ele.sourceWrapper, ele.targetWrapper, ele);
    }
    if (srcPort !== undefined) {
        source.point = { x: srcPort.offsetX, y: srcPort.offsetY };
        switch (source.direction) {
            case 'Bottom':
            case 'Top':
                source.point.y = source.point.y;
                break;
            case 'Left':
            case 'Right':
                source.point.x = source.point.x;
                break;
        }
        if (ele.sourcePadding && !isInterSect) {
            if (tarPort) {
                target.point = {
                    x: tarPort.offsetX,
                    y: tarPort.offsetY
                };
            }
            source.point = addPaddingToConnector(ele, source, target, false);
        }
    }
    else {
        if (ele.type === 'Orthogonal') {
            if (ele.segments && ele.segments.length > 0 && ele.segments[0].direction) {
                source.direction = ele.segments[0].direction;
            }
            source.point = findPoint(srcBounds, source.direction);
            refPoint = findPoint(srcBounds, getOppositeDirection(source.direction));
            source.point = getIntersection(ele, sourceEle, source.point, refPoint, false);
        }
        else {
            source.point = sourceEle.corners.center;
        }
    }
    if (tarPort !== undefined) {
        target.point = {
            x: tarPort.offsetX,
            y: tarPort.offsetY
        };
        switch (target.direction) {
            case 'Bottom':
            case 'Top':
                target.point.y = target.point.y;
                break;
            case 'Left':
            case 'Right':
                target.point.x = target.point.x;
                break;
        }
        if (ele.targetPadding && !isInterSect) {
            target.point = addPaddingToConnector(ele, source, target, true);
        }
    }
    else {
        if (ele.type === 'Orthogonal') {
            target.point = findPoint(tarBounds, target.direction);
            refPoint = findPoint(tarBounds, getOppositeDirection(target.direction));
            target.point = getIntersection(ele, targetEle, target.point, refPoint, true);
        }
        else {
            target.point = targetEle.corners.center;
        }
    }
    if (ele.type !== 'Orthogonal') {
        var segment = void 0;
        var first = void 0;
        checkLastSegmentasTerminal(ele);
        if (ele.sourcePortWrapper === undefined) {
            source.point = source.corners.center;
            if (ele.segments && ele.segments.length > 0) {
                first = ele.segments[0];
                segment = (!Point.isEmptyPoint(first.point)) ? first : undefined;
            }
            var tarPoint = (segment !== undefined) ? segment.point : target.point;
            if (ele.type === 'Bezier' && ele.segments.length > 0 &&
                ele.segments[0].vector1.angle && ele.segments[0].vector1.distance) {
                var value = Math.max(source.corners.width, source.corners.height);
                tarPoint = Point.transform(source.point, ele.segments[0].vector1.angle, value / 2);
            }
            source.point = isInterSect ? ele.sourceWrapper.bounds.center : getIntersection(ele, sourceEle, source.point, tarPoint, false);
        }
        if (ele.targetPortWrapper === undefined) {
            target.point = target.corners.center;
            if (ele.segments && ele.segments.length > 1) {
                first = ele.segments[ele.segments.length - 2];
                segment = (!Point.isEmptyPoint(first.point)) ? first : undefined;
            }
            var srcPoint = (segment) ? segment.point : source.point;
            if (ele.type === 'Bezier' && ele.segments.length > 0 &&
                ele.segments[ele.segments.length - 1].vector2.angle &&
                ele.segments[ele.segments.length - 1].vector2.distance) {
                var value = Math.max(source.corners.width, source.corners.height);
                srcPoint = Point.transform(target.point, ele.segments[0].vector2.angle, value / 2);
            }
            target.point = isInterSect ? ele.targetWrapper.bounds.center : getIntersection(ele, targetEle, srcPoint, target.point, true);
        }
        intermeditatePoints = intermeditatePointsForStraight(ele, source, target);
    }
    else {
        if (ele.type === 'Orthogonal' && (ele.segments && ele.segments.length > 0) &&
            ele.segments[0].direction !== null) {
            intermeditatePoints = findIntermeditatePoints(ele, source, target, srcPort, tarPort, sourceEle, targetEle);
        }
        else {
            if (!ele.segments[0]) {
                var segment = new OrthogonalSegment(ele, 'segments', { type: 'Orthogonal' }, true);
                ele.segments.push(segment);
            }
            ele.segments[0].points = intermeditatePoints = findOrthoSegments(ele, source, target, undefined, lineDistribution);
        }
    }
    return intermeditatePoints;
}
/* tslint:enable */
function intermeditatePointsForStraight(element, source, target) {
    var intermeditatePoints = [];
    if (element.segments && element.segments.length > 0) {
        var i = void 0;
        var segPoint = [];
        var srcPoint = source.point;
        for (i = 0; i < element.segments.length; i++) {
            var seg = element.segments[i];
            segPoint = [];
            segPoint.push(srcPoint);
            if (i !== element.segments.length - 1) {
                segPoint.push(seg.point);
                srcPoint = seg.point;
            }
            else {
                segPoint.push(target.point);
            }
            element.segments[i].points = segPoint;
            if (element.segments.length > 1 && Point.equals(seg.points[0], seg.points[1])) {
                (element.segments).splice(i, 1);
            }
            if (seg) {
                for (var j = 0; j < seg.points.length; j++) {
                    if (j > 0 || i === 0) {
                        intermeditatePoints.push(seg.points[j]);
                    }
                }
            }
        }
    }
    return intermeditatePoints;
}
function findSourceDirection(dir, srcPoint, tarPoint) {
    var direction = (dir === 'Top' || dir === 'Bottom') ?
        ((tarPoint.x > srcPoint.x) ? 'Right' : 'Left') :
        ((tarPoint.y > srcPoint.y) ? 'Bottom' : 'Top');
    return direction;
}
function checkLastSegmentasTerminal(ele) {
    if (ele.type === 'Straight' || ele.type === 'Bezier') {
        if ((ele.segments.length === 0 || (ele.segments.length > 0 &&
            (!Point.isEmptyPoint(ele.segments[ele.segments.length - 1].point))))) {
            var segment = void 0;
            segment = (ele.type === 'Bezier') ? new BezierSegment(ele, 'segments', { type: 'Bezier' }, true) :
                new StraightSegment(ele, 'segments', { type: 'Straight' }, true);
            (ele.segments).push(segment);
        }
    }
    else {
        if (ele.segments.length === 0 || ele.segments[ele.segments.length - 1].direction) {
            var segment = new OrthogonalSegment(ele, 'segments', { type: 'Orthogonal' }, true);
            ele.segments.push(segment);
        }
    }
}
function checkConsectiveSegmentAsSame(ele, i, source) {
    var seg = ele.segments[i];
    var extra = (seg.direction === 'Left' || seg.direction === 'Top') ? -(seg.length) : seg.length;
    var angle = (seg.direction === 'Left' || seg.direction === 'Right') ? 0 : 90;
    var segPoint = addLineSegment(source.point, extra, angle);
    ele.segments[i - 1].length += seg.length;
    ele.segments[i - 1].points[1] = source.point = segPoint;
    ele.segments.splice(i, 1);
    i--;
    return i;
}
function nodeOrPortToNode(ele, source, target) {
    var point;
    var portdirection;
    if (ele.sourcePortWrapper) {
        var port = { x: ele.sourcePortWrapper.offsetX, y: ele.sourcePortWrapper.offsetY };
        portdirection = getPortDirection(port, cornersPointsBeforeRotation(ele.sourceWrapper), ele.sourceWrapper.bounds, false);
    }
    findDirection(ele.targetWrapper, source, target, ele);
    var direction = findSourceDirection(target.direction, source.point, target.point);
    if (ele.sourcePortWrapper !== undefined && source.direction === target.direction &&
        ((source.direction === 'Top' || source.direction === 'Bottom') && (source.corners.center.x === target.corners.center.x)
            || (source.direction === 'Left' || source.direction === 'Right') && (source.corners.center.y === target.corners.center.y))) {
        source.direction = direction;
        point = (direction === 'Top' || direction === 'Bottom') ?
            orthoConnection3Segment(ele, source, target, ele.sourceWrapper.height / 2 + 20) :
            orthoConnection3Segment(ele, source, target, ele.sourceWrapper.width / 2 + 20);
        var source1 = source;
        source1.point = point[1];
        if (direction === 'Left' || direction === 'Right') {
            target.direction = direction;
            target.point = (direction === 'Left') ? target.corners.middleLeft : target.corners.middleRight;
        }
        else {
            findDirection(ele.targetWrapper, source, target, ele);
        }
        point = orthoConnection3Segment(ele, source, target);
    }
    else if (target.point.x >= source.corners.left && target.point.x <= source.corners.right &&
        source.point.y >= source.corners.top && source.point.y <= source.corners.bottom) {
        source.direction = (target.point.y > source.point.y) ? 'Bottom' : 'Top';
        var length_2 = (source.direction === 'Top') ? (source.point.y - source.corners.top + 20) :
            (source.corners.bottom - source.point.y + 20);
        point = orthoConnection3Segment(ele, source, target, length_2);
    }
    else if (ele.sourcePortWrapper && portdirection === getOppositeDirection(direction)) {
        var length_3;
        if ((portdirection === 'Left' || portdirection === 'Right') && (source.point.y >= source.corners.top
            && source.point.y <= source.corners.bottom)) {
            source.direction = (target.point.y > source.point.y) ? 'Bottom' : 'Top';
            length_3 = source.corners.height / 2 + 20;
        }
        else if ((portdirection === 'Top' || portdirection === 'Bottom') && (source.point.x >= source.corners.left
            && source.point.x <= source.corners.right)) {
            source.direction = (target.point.x > source.point.x) ? 'Right' : 'Left';
            length_3 = source.corners.width / 2 + 20;
        }
        if (source.direction && length_3) {
            point = orthoConnection3Segment(ele, source, target, length_3, true);
        }
        else {
            source.direction = direction;
            point = orthoConnection2Segment(source, target);
        }
    }
    else if (ele.sourcePortWrapper && portdirection === target.direction && (portdirection === 'Top' || portdirection === 'Bottom') &&
        (source.corners.center.x === target.corners.center.x)) {
        source.direction = (target.point.y > source.point.y) ? 'Bottom' : 'Top';
        var len = (source.direction === 'Bottom') ? (source.corners.bottom - source.point.y + 20) :
            (source.point.y - source.corners.top + 20);
        point = orthoConnection3Segment(ele, source, target, len);
    }
    else {
        source.direction = direction;
        point = orthoConnection2Segment(source, target);
    }
    return point;
}
function checkSourcePointInTarget(ele, source) {
    if (ele.targetWrapper !== undefined && ele.targetPortWrapper === undefined) {
        var padding = 1;
        if (cornersPointsBeforeRotation(ele.targetWrapper).containsPoint(source.point, padding)) {
            var target = ele.targetWrapper;
            var segment = ele.segments[ele.segments.length - 2];
            var lastPoint = segment.points[segment.points.length - 1];
            var direction = getOppositeDirection(segment.direction);
            if (direction === 'Bottom') {
                if (lastPoint.y < target.corners.bottom + padding) {
                    segment.points[segment.points.length - 1].y = target.corners.bottom + 20;
                    segment.length = Point.distancePoints(segment.points[0], segment.points[segment.points.length - 1]);
                }
            }
            else if (direction === 'Top') {
                if (lastPoint.y > target.corners.top - padding) {
                    segment.points[segment.points.length - 1].y = target.corners.top - 20;
                    segment.length = Point.distancePoints(segment.points[0], segment.points[segment.points.length - 1]);
                }
            }
            else if (direction === 'Left') {
                if (lastPoint.x > target.corners.left - padding) {
                    segment.points[segment.points.length - 1].x = target.corners.left - 20;
                    segment.length = Point.distancePoints(segment.points[0], segment.points[segment.points.length - 1]);
                }
            }
            else if (direction === 'Right') {
                if (lastPoint.x < target.corners.right + padding) {
                    segment.points[segment.points.length - 1].x = target.corners.right + 20;
                    segment.length = Point.distancePoints(segment.points[0], segment.points[segment.points.length - 1]);
                }
            }
            source.point = segment.points[segment.points.length - 1];
        }
    }
}
function findIntermeditatePoints(ele, source, target, srcPort, tarPort, sourceEle, targetEle) {
    var point;
    var intermeditatePoints = [];
    var seg;
    var j;
    var removeSegment;
    checkLastSegmentasTerminal(ele);
    for (var i = 0; i < ele.segments.length; i++) {
        seg = ele.segments[i];
        if (srcPort && source.direction === getOppositeDirection(seg.direction)) {
            seg.direction = source.direction;
        }
        if (i > 0 && ele.segments[i - 1].direction === seg.direction) {
            i = checkConsectiveSegmentAsSame(ele, i, source);
        }
        else {
            if (seg.direction) {
                source.point = updateSegmentPoints(source, ele.segments[i]);
            }
            else {
                var segment = ele.segments[i - 1];
                source.point = segment.points[segment.points.length - 1];
            }
        }
        if (i === ele.segments.length - 1) {
            checkSourcePointInTarget(ele, source);
            if (tarPort === undefined) {
                point = nodeOrPortToNode(ele, source, target);
            }
            else {
                point = pointToPort(ele, source, target);
            }
            checkPreviousSegment(point, ele, source);
            seg.points = [];
            if (point.length >= 2) {
                for (j = 0; j < point.length; j++) {
                    seg.points.push(point[j]);
                }
            }
            else {
                removeSegment = i;
            }
        }
        if (removeSegment !== undefined) {
            if (removeSegment === ele.segments.length - 1) {
                ele.segments[removeSegment - 1].direction = null;
                ele.segments[removeSegment - 1].length = null;
            }
            ele.segments.splice(removeSegment, 1);
        }
        if (srcPort && i === 0) {
            var sourcePoint = checkPortdirection(ele, srcPort, sourceEle);
            if (sourcePoint) {
                source.point = sourcePoint;
            }
        }
    }
    return returnIntermeditatePoints(ele, intermeditatePoints);
}
function returnIntermeditatePoints(element, intermeditatePoints) {
    for (var i = 0; i < element.segments.length; i++) {
        var seg = element.segments[i];
        for (var j = 0; j < seg.points.length; j++) {
            if (j > 0 || i === 0) {
                intermeditatePoints.push(seg.points[j]);
            }
        }
    }
    return intermeditatePoints;
}
function findDirection(node, source, target, ele) {
    var nodeDirection;
    var nodeConnectingPoint = { x: 0, y: 0 };
    var nodeCorners = swapBounds(node, node.corners, node.bounds);
    var nodeMargin = source.margin;
    var fixedPoint = source.point;
    if (nodeCorners.bottomCenter.y + nodeMargin.bottom < fixedPoint.y) {
        nodeDirection = 'Bottom';
        nodeConnectingPoint = nodeCorners.bottomCenter;
    }
    else if (nodeCorners.topCenter.y - nodeMargin.top > fixedPoint.y) {
        nodeDirection = 'Top';
        nodeConnectingPoint = nodeCorners.topCenter;
    }
    else if (nodeCorners.middleLeft.x - nodeMargin.left > fixedPoint.x) {
        nodeDirection = 'Left';
        nodeConnectingPoint = nodeCorners.middleLeft;
    }
    else if (nodeCorners.middleRight.x + nodeMargin.right < fixedPoint.x) {
        nodeDirection = 'Right';
        nodeConnectingPoint = nodeCorners.middleRight;
    }
    else {
        var top_1 = Math.abs(fixedPoint.y - nodeCorners.topCenter.y);
        var right = Math.abs(fixedPoint.x - nodeCorners.middleRight.x);
        var bottom = Math.abs(fixedPoint.y - nodeCorners.bottomCenter.y);
        var left = Math.abs(fixedPoint.x - nodeCorners.middleLeft.x);
        var shortes = Number.MAX_VALUE;
        shortes = top_1;
        nodeDirection = 'Top';
        nodeConnectingPoint = nodeCorners.topCenter;
        if (shortes > right) {
            shortes = right;
            nodeDirection = 'Right';
            nodeConnectingPoint = nodeCorners.middleRight;
        }
        if (shortes > bottom) {
            shortes = bottom;
            nodeDirection = 'Bottom';
            nodeConnectingPoint = nodeCorners.bottomCenter;
        }
        if (shortes > left) {
            //shortes = left;
            nodeDirection = 'Left';
            nodeConnectingPoint = nodeCorners.middleLeft;
        }
    }
    target.point = nodeConnectingPoint;
    target.direction = nodeDirection;
    var refPoint = findPoint(nodeCorners, getOppositeDirection(target.direction));
    target.point = getIntersection(ele, node, target.point, refPoint, node === ele.targetWrapper);
}
function findOrthoSegments(ele, source, target, extra, lineDistribution) {
    var swap = false;
    var intermeditatePoints = [];
    var seg;
    swap = getSwapping(source.direction, target.direction);
    if (swap) {
        swapPoints(source, target);
    }
    if (source.direction === 'Right' && target.direction === 'Left') {
        seg = getRightToLeftSegmentCount(ele, source, target, swap);
    }
    else if (source.direction === 'Right' && target.direction === 'Right') {
        seg = getRightToRightSegmentCount(ele, source, target);
    }
    else if (source.direction === 'Right' && target.direction === 'Top') {
        seg = getRightToTopSegmentCount(ele, source, target, swap);
    }
    else if (source.direction === 'Right' && target.direction === 'Bottom') {
        seg = getRightToBottomSegmentCount(ele, source, target, swap);
    }
    else if (source.direction === 'Bottom' && target.direction === 'Top') {
        seg = getBottomToTopSegmentCount(source, target);
    }
    else if (source.direction === 'Bottom' && target.direction === 'Bottom') {
        source.margin = { left: 10, right: 10, top: 10, bottom: 10 };
        target.margin = { left: 10, right: 10, top: 10, bottom: 10 };
        seg = getBottomToBottomSegmentCount(ele, source, target);
    }
    else if (source.direction === 'Bottom' && target.direction === 'Left') {
        seg = getBottomToLeftSegmentCount(ele, source, target, swap);
    }
    else if (source.direction === 'Left' && target.direction === 'Left') {
        seg = getLeftToLeftSegmentCount(ele, source, target);
    }
    else if (source.direction === 'Left' && target.direction === 'Top') {
        seg = getLeftToTopSegmentCount(ele, source, target, swap);
    }
    else if (source.direction === 'Top' && target.direction === 'Top') {
        seg = getTopToTopSegmentCount(ele, source, target);
    }
    if (swap) {
        swapPoints(source, target);
    }
    intermeditatePoints = addOrthoSegments(ele, seg, source, target, extra, lineDistribution);
    return intermeditatePoints;
}
/** @private */
export function findAngle(s, e) {
    var r = { x: e.x, y: s.y };
    var sr = Point.findLength(s, r);
    var re = Point.findLength(r, e);
    var es = Point.findLength(e, s);
    var ang = Math.asin(re / es);
    ang = ang * 180 / Math.PI;
    if (s.x < e.x) {
        if (s.y > e.y) {
            ang = 360 - ang;
        }
    }
    else {
        if (s.y < e.y) {
            ang = 180 - ang;
        }
        else {
            ang = 180 + ang;
        }
    }
    return ang;
}
/** @private */
export function findPoint(cor, direction) {
    var point;
    switch (direction) {
        case 'Left':
            point = cor.middleLeft;
            break;
        case 'Top':
            point = cor.topCenter;
            break;
        case 'Right':
            point = cor.middleRight;
            break;
        case 'Bottom':
            point = cor.bottomCenter;
            break;
    }
    return point;
}
function pointsFromNodeToPoint(seg, direction, bounds, point, endPoint, isTarget) {
    var minSpace = 13;
    var x;
    var points = [];
    var y;
    points.push(point);
    var straight;
    straight = (point.y === endPoint.y && (direction === 'Left' && endPoint.x < point.x ||
        direction === 'Right' && endPoint.x > point.x)) ||
        (point.x === endPoint.x && (direction === 'Top' && endPoint.y < point.y ||
            direction === 'Bottom' && endPoint.y > point.y));
    if (!straight) {
        if (direction === 'Top' || direction === 'Bottom') {
            if (direction === 'Top' && endPoint.y < point.y && endPoint.y > point.y - minSpace ||
                direction === 'Bottom' && endPoint.y > point.y && endPoint.y < point.y + minSpace) {
                y = direction === 'Top' ? bounds.top - minSpace : bounds.bottom + minSpace;
                points.push({ x: point.x, y: y });
                points.push({ x: point.x + (endPoint.x - point.x) / 2, y: y });
                points.push({ x: point.x + (endPoint.x - point.x) / 2, y: endPoint.y });
            }
            else if (Math.abs(point.x - endPoint.x) > minSpace &&
                (direction === 'Top' && endPoint.y < point.y || direction === 'Bottom' && endPoint.y > point.y)) {
                //twosegments
                points.push({ x: point.x, y: endPoint.y });
            }
            else {
                y = direction === 'Top' ? bounds.top - minSpace : bounds.bottom + minSpace;
                x = (endPoint.x < point.x) ? bounds.left - minSpace : bounds.right + minSpace;
                points.push({ x: point.x, y: y });
                points.push({ x: endPoint.x, y: y });
            }
        }
        else {
            if (direction === 'Left' && endPoint.x < point.x && endPoint.x > point.x - minSpace || direction === 'right' &&
                endPoint.x > point.x && endPoint.x < point.x + minSpace) {
                x = direction === 'Left' ? bounds.left - minSpace : bounds.right + minSpace;
                points.push({ x: x, y: point.y });
                points.push({ x: x, y: point.y + (endPoint.y - point.y) / 2 });
                points.push({ x: endPoint.x, y: point.y + (endPoint.y - point.y) / 2 });
            }
            else if (Math.abs(point.y - endPoint.y) > minSpace &&
                (direction === 'Left' && endPoint.x < point.x || direction === 'Right' && endPoint.x > point.x)) {
                points.push({ x: endPoint.x, y: point.y });
                //twosegments
            }
            else {
                x = direction === 'Left' ? bounds.left - minSpace : bounds.right + minSpace;
                points.push({ x: x, y: point.y });
                points.push({ x: x, y: endPoint.y });
            }
        }
        if (isTarget) {
            points.push(seg.points[0]);
            points.reverse();
        }
        seg.points = points;
    }
}
function addLineSegment(point, extra, angle) {
    var segEnd = Point.transform(point, angle, extra);
    return segEnd;
}
/** @private */
export function getIntersection(ele, bounds, sPt, tPt, isTar) {
    sPt = { x: sPt.x, y: sPt.y };
    tPt = { x: tPt.x, y: tPt.y };
    var angle = Point.findAngle(tPt, sPt);
    var child;
    var intersection;
    var wrapper = isTar ? ele.targetWrapper : ele.sourceWrapper;
    var padding = (isTar ? ele.targetPadding : ele.sourcePadding);
    var rect;
    var segmentPoints;
    var point = isTar || ele.type === 'Orthogonal' ? sPt : tPt;
    var sourcePoint = Point.transform(sPt, angle, Math.max(wrapper.actualSize.height / 2, wrapper.actualSize.width / 2));
    child = wrapper;
    var sPt1 = rotatePoint(-wrapper.parentTransform, wrapper.offsetX, wrapper.offsetY, sPt);
    var tPt1 = rotatePoint(-wrapper.parentTransform, wrapper.offsetX, wrapper.offsetY, tPt);
    if (ele.type === 'Orthogonal') {
        var constValue = 5;
        if (sPt1.x === tPt1.x) {
            if (sPt1.y < tPt1.y) {
                sPt1.y -= constValue;
            }
            else {
                sPt1.y += constValue;
            }
        }
        if (sPt1.y === tPt1.y) {
            if (sPt1.x < tPt1.x) {
                sPt1.x -= constValue;
            }
            else {
                sPt1.x += constValue;
            }
        }
        sPt = rotatePoint(wrapper.parentTransform, wrapper.offsetX, wrapper.offsetY, sPt1);
    }
    else {
        var angle_1 = isTar ? Point.findAngle(sPt, tPt) : Point.findAngle(tPt, sPt);
        if (isTar) {
            var angle_2 = Point.findAngle(sPt, tPt);
            tPt = Point.transform({ x: tPt.x, y: tPt.y }, angle_2, Math.max(wrapper.actualSize.width, wrapper.actualSize.height));
        }
        else {
            var angle_3 = Point.findAngle(tPt, sPt);
            sPt = Point.transform({ x: sPt.x, y: sPt.y }, angle_3, Math.max(wrapper.actualSize.width, wrapper.actualSize.height));
        }
    }
    if ((ele.sourcePadding || ele.targetPadding)) {
        rect = new Rect(wrapper.bounds.x - padding, wrapper.bounds.y - padding, wrapper.actualSize.width + 2 * padding, wrapper.actualSize.height + 2 * padding);
    }
    if (wrapper instanceof PathElement && wrapper.data) {
        segmentPoints = rect ? [rect.topLeft, rect.topRight, rect.bottomRight, rect.bottomLeft] : child.getPoints();
        if (((child.data.split('m').length - 1) + (child.data.split('M').length - 1)) === 1) {
            segmentPoints[segmentPoints.length] = segmentPoints[0];
        }
    }
    else {
        segmentPoints = rect ? [rect.topLeft, rect.topRight, rect.bottomRight, rect.bottomLeft] : getPoints(wrapper, wrapper.corners);
        segmentPoints[segmentPoints.length] = segmentPoints[0];
    }
    var length = segmentPoints.length;
    var thisSegment = { x1: sPt.x, y1: sPt.y, x2: tPt.x, y2: tPt.y };
    return getIntersectionPoints(thisSegment, segmentPoints, true, point) || sPt;
}
function setLineEndPoint(element, point, isTarget) {
    point.x = Math.round(point.x * 100) / 100;
    point.y = Math.round(point.y * 100) / 100;
    if (isTarget) {
        element.targetPoint = point;
    }
    else {
        element.sourcePoint = point;
    }
    return point;
}
/** @private */
export function getIntersectionPoints(thisSegment, pts, minimal, point) {
    var length = pts.length;
    var min;
    var segment = {
        x1: pts[0].x, y1: pts[0].y, x2: pts[1].x,
        y2: pts[1].y
    };
    var intersection = intersectSegment(thisSegment, segment);
    if (intersection) {
        // if (!minimal) { return intersection; } //commented because minimal is always true
        min = Point.distancePoints(intersection, point);
    }
    if (isNaN(min) || min > 0) {
        for (var i = 1; i < length - 1; i++) {
            segment = {
                x1: pts[i].x, y1: pts[i].y,
                x2: pts[i + 1].x, y2: pts[i + 1].y
            };
            var intersect = intersectSegment(thisSegment, segment);
            if (intersect) {
                // if (!minimal) { return intersect; }//commented because minimal is always true
                var dist = Point.distancePoints(intersect, point);
                if (isNaN(min) || min > dist) {
                    min = dist;
                    intersection = intersect;
                }
                if (min >= 0 && min <= 1) {
                    break;
                }
            }
        }
    }
    return intersection;
}
function intersectSegment(segment1, segment2) {
    var x1 = segment1.x1;
    var y1 = segment1.y1;
    var x2 = segment1.x2;
    var y2 = segment1.y2;
    var x3 = segment2.x1;
    var y3 = segment2.y1;
    var x4 = segment2.x2;
    var y4 = segment2.y2;
    var a1;
    var a2;
    var b1;
    var b2;
    var c1;
    var c2;
    var x;
    var y;
    var r1;
    var r2;
    var r3;
    var r4;
    var denom;
    var offset;
    var num;
    a1 = y2 - y1;
    b1 = x1 - x2;
    c1 = (x2 * y1) - (x1 * y2);
    r3 = ((a1 * x3) + (b1 * y3) + c1);
    r4 = ((a1 * x4) + (b1 * y4) + c1);
    if ((r3 !== 0) && (r4 !== 0) && sameSign(r3, r4)) {
        return null;
    }
    a2 = y4 - y3;
    b2 = x3 - x4;
    c2 = (x4 * y3) - (x3 * y4);
    r1 = (a2 * x1) + (b2 * y1) + c2;
    r2 = (a2 * x2) + (b2 * y2) + c2;
    if ((r1 !== 0) && (r2 !== 0) && (sameSign(r1, r2))) {
        return null;
    }
    denom = (a1 * b2) - (a2 * b1);
    if (denom === 0) {
        return null;
    }
    if (denom < 0) {
        offset = -denom / 2;
    }
    else {
        offset = denom / 2;
    }
    offset = 0;
    num = (b1 * c2) - (b2 * c1);
    if (num < 0) {
        x = (num - offset) / denom;
    }
    else {
        x = (num + offset) / denom;
    }
    num = (a2 * c1) - (a1 * c2);
    if (num < 0) {
        y = (num - offset) / denom;
    }
    else {
        y = (num + offset) / denom;
    }
    return { x: x, y: y };
}
function sameSign(a, b) {
    return ((a * b) >= 0);
}
function getRightToLeftSegmentCount(element, source, target, swap) {
    var srcPort = element.sourcePortWrapper;
    var targetPort = element.targetPortWrapper;
    var pts;
    var diffY = Math.round(Math.abs(source.point.y - target.point.y));
    var diffX = Math.round(Math.abs(source.point.x - target.point.x));
    var right = { x: Math.max(source.point.x, source.corners.right), y: source.point.y };
    var left = { x: Math.min(target.point.x, target.corners.left), y: target.point.y };
    var margin = 10;
    if (swap) {
        var point = void 0;
        point = left;
        left = right;
        right = point;
    }
    if (!(source.corners.bottom + margin < target.corners.top - margin ||
        source.corners.top - margin > target.corners.bottom + margin)) {
        margin = 0;
    }
    source.margin = { left: margin, right: margin, top: margin, bottom: margin };
    target.margin = { left: margin, right: margin, top: margin, bottom: margin };
    if (diffY === 0 && (source.corners.right < target.corners.left
        || (swap && source.corners.right < target.corners.left))) {
        pts = NoOfSegments.One;
    }
    else if (source.point.x + source.margin.right < target.point.x - target.margin.left) {
        pts = NoOfSegments.Three;
    }
    else if (element.sourceWrapper !== element.targetWrapper &&
        (cornersPointsBeforeRotation(element.sourceWrapper).containsPoint(left) ||
            cornersPointsBeforeRotation(element.targetWrapper).containsPoint(right))) {
        pts = NoOfSegments.Three;
    }
    else if (source.corners.bottom <= target.corners.top) {
        pts = NoOfSegments.Five;
    }
    else if (source.corners.top >= target.corners.top) {
        pts = NoOfSegments.Five;
    }
    else if ((srcPort !== undefined && srcPort.offsetY <= target.corners.top) ||
        (srcPort === undefined && source.corners.right <= target.corners.top)) {
        pts = NoOfSegments.Five;
    }
    else if ((srcPort !== undefined && srcPort.offsetY >= target.corners.bottom) ||
        (srcPort === undefined && source.corners.right >= target.corners.bottom)) {
        pts = NoOfSegments.Five;
    }
    else {
        pts = NoOfSegments.Five;
    }
    return pts;
}
function getRightToRightSegmentCount(element, sourceObj, targetObj) {
    var sourcePort = element.sourcePortWrapper;
    var tarPort = element.targetPortWrapper;
    var pts;
    var diffX = sourceObj.point.x - targetObj.point.x;
    var diffY = sourceObj.point.y - targetObj.point.y;
    targetObj.margin = { left: 10, right: 10, top: 10, bottom: 10 };
    sourceObj.margin = { left: 10, right: 10, top: 10, bottom: 10 };
    if (sourceObj.corners.right >= targetObj.corners.right) {
        if ((sourcePort !== undefined && (sourcePort.offsetY < targetObj.corners.top ||
            sourcePort.offsetY > targetObj.corners.bottom)) ||
            (sourcePort === undefined && sourceObj.corners.middleRight.y < targetObj.corners.top)) {
            pts = NoOfSegments.Three;
        }
        else if ((sourcePort !== undefined && sourcePort.offsetY > targetObj.corners.bottom + targetObj.margin.bottom
            && sourceObj.corners.top > targetObj.corners.bottom) ||
            (sourcePort === undefined && sourceObj.corners.middleRight.y > targetObj.corners.bottom)) {
            pts = NoOfSegments.Three;
        }
        else if ((sourcePort !== undefined && sourcePort.offsetY < targetObj.corners.top
            && sourceObj.corners.bottom > targetObj.corners.top) ||
            (sourcePort === undefined && sourceObj.corners.middleRight.y > targetObj.corners.bottom)) {
            pts = NoOfSegments.Three;
        }
        else if (sourceObj.corners.right < targetObj.corners.left ||
            targetObj.corners.right < sourceObj.corners.left) {
            pts = NoOfSegments.Five;
        }
        else if (diffX === 0 || diffY === 0) {
            pts = NoOfSegments.One;
        }
        else {
            pts = NoOfSegments.Three;
        }
    }
    else if ((tarPort !== undefined && sourceObj.corners.bottom < tarPort.offsetY) ||
        (tarPort === undefined && sourceObj.corners.bottom < targetObj.corners.middleRight.y)) {
        pts = NoOfSegments.Three;
    }
    else if ((tarPort !== undefined && sourceObj.corners.top > tarPort.offsetY) ||
        (tarPort === undefined && sourceObj.corners.top > targetObj.corners.middleRight.y)) {
        pts = NoOfSegments.Three;
    }
    else if ((tarPort !== undefined && ((sourcePort !== undefined && sourcePort.offsetX < targetObj.corners.left &&
        sourcePort.offsetX !== tarPort.offsetX && sourcePort.offsetY !== tarPort.offsetY &&
        (Math.abs(sourceObj.corners.right - targetObj.corners.left) <= 20)) ||
        (sourcePort === undefined && sourceObj.corners.right < targetObj.corners.left &&
            sourceObj.corners.center.x !== targetObj.corners.center.x && sourceObj.corners.center.y !== targetObj.corners.center.y)))) {
        pts = NoOfSegments.Three;
    }
    else if (sourceObj.corners.right < targetObj.corners.left) {
        pts = NoOfSegments.Five;
    }
    else if (diffX === 0 || diffY === 0) {
        pts = NoOfSegments.One;
    }
    else {
        pts = NoOfSegments.Three;
    }
    return pts;
}
function getRightToTopSegmentCount(element, source, target, swap) {
    var tarPort = element.targetPortWrapper;
    var srcPort = element.sourcePortWrapper;
    var right = { x: Math.max(source.point.x, source.corners.right), y: source.point.y };
    var top = { x: target.point.x, y: Math.min(target.point.y, target.corners.top) };
    var pts;
    target.margin = { left: 5, right: 5, top: 5, bottom: 5 };
    source.margin = { top: 5, bottom: 5, left: 5, right: 5 };
    if (swap) {
        var port = void 0;
        port = srcPort;
        srcPort = tarPort;
        tarPort = port;
    }
    if ((srcPort !== undefined && srcPort.offsetY < target.corners.top - target.margin.top) ||
        (srcPort === undefined && source.corners.bottom < target.corners.top - target.margin.top)) {
        if (source.corners.bottom < target.corners.top) {
            if ((tarPort !== undefined && source.corners.right + source.margin.right < tarPort.offsetX) ||
                (tarPort === undefined && source.corners.right + source.margin.right < target.corners.topCenter.x)) {
                pts = NoOfSegments.Two;
            }
            else {
                pts = NoOfSegments.Four;
            }
        }
        else if ((tarPort !== undefined && source.corners.left > tarPort.offsetX) ||
            (tarPort === undefined && source.corners.left > target.corners.topCenter.x)) {
            pts = NoOfSegments.Four;
        }
        else {
            pts = NoOfSegments.Two;
        }
    }
    else if (srcPort !== undefined && Math.abs(source.corners.right - target.corners.left) <= 25 &&
        Math.abs(srcPort.offsetY - target.corners.top) <= 25) {
        pts = NoOfSegments.Two;
    }
    else if (tarPort !== undefined && Math.abs(tarPort.offsetX - source.corners.topCenter.x) >= 25 &&
        source.corners.middleRight.y < tarPort.offsetY) {
        pts = NoOfSegments.Two;
    }
    else if (source.corners.right < target.corners.left) {
        pts = NoOfSegments.Four;
    }
    else if (element.sourceWrapper !== element.targetWrapper &&
        (cornersPointsBeforeRotation(element.sourceWrapper).containsPoint(top) ||
            cornersPointsBeforeRotation(element.targetWrapper).containsPoint(right))) {
        pts = NoOfSegments.Two;
    }
    else {
        pts = NoOfSegments.Four;
    }
    return pts;
}
function getRightToBottomSegmentCount(element, source, target, swap) {
    source.margin = { left: 10, right: 10, top: 10, bottom: 10 };
    target.margin = { left: 10, right: 10, top: 10, bottom: 10 };
    var pts;
    var srcPort = element.sourcePortWrapper;
    var tarPort = element.targetPortWrapper;
    var right = { x: Math.max(source.point.x, source.corners.right), y: source.point.y };
    var bottom = { x: target.point.x, y: Math.max(target.point.y, target.corners.bottom) };
    if (swap) {
        var port = void 0;
        port = srcPort;
        srcPort = tarPort;
        tarPort = port;
    }
    if ((srcPort !== undefined && srcPort.offsetY > target.corners.bottom + target.margin.bottom) ||
        (srcPort === undefined && source.corners.middleRight.y > target.corners.bottom + target.margin.bottom)) {
        if (source.corners.top > target.corners.bottom) {
            if ((tarPort !== undefined && source.corners.right + source.margin.right < tarPort.offsetX) ||
                (tarPort === undefined && source.corners.right + source.margin.right < target.corners.bottomCenter.x)) {
                pts = NoOfSegments.Two;
            }
            else {
                pts = NoOfSegments.Four;
            }
        }
        else if ((tarPort !== undefined && source.corners.left > tarPort.offsetX) ||
            (tarPort === undefined && source.corners.left > target.corners.bottomCenter.x)) {
            pts = NoOfSegments.Four;
        }
        else {
            pts = NoOfSegments.Two;
        }
    }
    else if (srcPort !== undefined &&
        Math.abs(source.corners.right - target.corners.left) <= 25 &&
        Math.abs(srcPort.offsetY - target.corners.bottom) <= 25) {
        pts = NoOfSegments.Two;
    }
    else if (source.corners.right < target.corners.left) {
        pts = NoOfSegments.Four;
    }
    else {
        pts = NoOfSegments.Four;
    }
    return pts;
}
function getBottomToTopSegmentCount(source, target) {
    var pts;
    var diffX = source.point.x - target.point.x;
    var diffY = source.point.y - target.point.y;
    var bottom = { x: source.point.x, y: Math.max(source.point.y, source.corners.bottom) };
    var top = { x: target.point.x, y: Math.min(target.point.y, target.corners.top) };
    var margin = 10;
    if (!(source.corners.right + margin < target.corners.left - margin ||
        source.corners.left - margin > target.corners.right + margin)) {
        margin = 0;
    }
    source.margin = { left: margin, right: margin, top: margin, bottom: margin };
    target.margin = { left: margin, right: margin, top: margin, bottom: margin };
    if (diffX === 0 && source.corners.bottom < target.corners.top) {
        pts = NoOfSegments.One;
    }
    else if (source.corners.bottom + source.margin.bottom < target.corners.top - target.margin.top) {
        pts = NoOfSegments.Three;
    }
    else if (source.corners.right + source.margin.right < target.corners.left - target.margin.left) {
        pts = NoOfSegments.Five;
    }
    else if (source.corners.left - source.margin.left > target.corners.right + target.margin.right) {
        pts = NoOfSegments.Five;
    }
    else {
        pts = NoOfSegments.Five;
    }
    return pts;
}
function getBottomToLeftSegmentCount(element, source, target, swap) {
    var srcPort = element.sourcePortWrapper;
    var tarPort = element.targetPortWrapper;
    var bottom = { x: source.point.x, y: Math.max(source.point.y, source.corners.bottom) };
    var left = { x: Math.min(target.point.x, target.corners.left), y: target.point.y };
    var pts;
    if (swap) {
        var port = void 0;
        port = srcPort;
        srcPort = tarPort;
        tarPort = port;
    }
    if ((srcPort !== undefined && srcPort.offsetX < target.corners.left - target.margin.left) ||
        (srcPort === undefined && source.corners.bottomCenter.x < target.corners.bottomLeft.x - target.margin.left)) {
        if (source.corners.right < target.corners.left) {
            if ((tarPort !== undefined && source.corners.bottom + source.margin.bottom < tarPort.offsetY) ||
                (tarPort === undefined && source.corners.bottom + source.margin.bottom < target.corners.middleLeft.y)) {
                pts = NoOfSegments.Two;
            }
            else {
                pts = NoOfSegments.Four;
            }
        }
        else if ((tarPort !== undefined && source.corners.top > tarPort.offsetY) ||
            (tarPort === undefined && source.corners.top > target.corners.middleLeft.y)) {
            pts = NoOfSegments.Four;
        }
        else {
            pts = NoOfSegments.Two;
        }
    }
    else if (tarPort !== undefined &&
        Math.abs(source.corners.right - target.corners.left) <= 25 &&
        Math.abs(tarPort.offsetY - source.corners.bottom) <= 25) {
        pts = NoOfSegments.Two;
    }
    else {
        pts = NoOfSegments.Four;
    }
    return pts;
}
function getBottomToBottomSegmentCount(element, source, target) {
    var srcPort = element.sourcePortWrapper;
    var tarPort = element.targetPortWrapper;
    var difX = Math.round(Math.abs(source.point.x - target.point.x));
    var diffY = Math.round(Math.abs(target.point.y - target.point.y));
    var pts;
    if (source.corners.bottom < target.corners.bottom) {
        if ((srcPort !== undefined && srcPort.offsetX < target.corners.left - target.margin.left) ||
            (srcPort === undefined && source.corners.bottomCenter.x < target.corners.left - target.margin.left)) {
            pts = NoOfSegments.Three;
        }
        else if ((srcPort !== undefined && srcPort.offsetX > target.corners.right + target.margin.right) ||
            (srcPort === undefined && source.corners.bottomCenter.x > target.corners.right + target.margin.right)) {
            pts = NoOfSegments.Three;
        }
        else if (source.corners.bottom < target.corners.top) {
            pts = NoOfSegments.Five;
        }
        else if (difX === 0 || diffY === 0) {
            pts = NoOfSegments.One;
        }
        else {
            pts = NoOfSegments.Three;
        }
    }
    else if ((tarPort !== undefined && source.corners.left > tarPort.offsetX) ||
        (tarPort === undefined && source.corners.left > target.corners.left)) {
        pts = NoOfSegments.Three;
    }
    else if ((tarPort !== undefined && source.corners.right < tarPort.offsetX) ||
        (tarPort === undefined &&
            source.corners.right < target.corners.right)) {
        pts = NoOfSegments.Three;
    }
    else if (source.corners.top > target.corners.bottom) {
        pts = NoOfSegments.Five;
    }
    else if (difX === 0 || diffY === 0) {
        pts = NoOfSegments.One;
    }
    else {
        pts = NoOfSegments.Three;
    }
    return pts;
}
function getLeftToTopSegmentCount(element, source, target, swap) {
    var pts;
    var sourcePort = element.sourcePortWrapper;
    var tarPort = element.targetPortWrapper;
    var left = { x: Math.min(source.point.x, source.corners.left), y: source.point.y };
    var top = { x: target.point.x, y: Math.min(target.point.y, target.corners.top) };
    if (swap) {
        var port = void 0;
        port = sourcePort;
        sourcePort = tarPort;
        tarPort = port;
    }
    if ((sourcePort !== undefined && sourcePort.offsetY < target.corners.top - target.margin.top) ||
        (sourcePort === undefined && (source.corners.bottom < target.corners.top - target.margin.top ||
            source.corners.middleLeft.y < target.corners.top - target.margin.top))) {
        if (source.corners.bottom < target.corners.top) {
            if ((tarPort !== undefined && source.corners.left - source.margin.left > tarPort.offsetX) ||
                (tarPort === undefined && source.corners.left - source.margin.left > target.corners.topCenter.x)) {
                pts = NoOfSegments.Two;
            }
            else {
                pts = NoOfSegments.Four;
            }
        }
        else if ((tarPort !== undefined && source.corners.right < tarPort.offsetX) ||
            (tarPort === undefined && source.corners.right < target.corners.topCenter.x)) {
            pts = NoOfSegments.Four;
        }
        else {
            pts = NoOfSegments.Two;
        }
    }
    else if (sourcePort !== undefined &&
        Math.abs(source.corners.left - target.corners.right) <= 25 &&
        Math.abs(sourcePort.offsetY - target.corners.top) <= 25) {
        pts = NoOfSegments.Two;
    }
    else if (element.sourceWrapper !== element.targetWrapper &&
        (cornersPointsBeforeRotation(element.sourceWrapper).containsPoint(top) ||
            cornersPointsBeforeRotation(element.targetWrapper).containsPoint(left))) {
        pts = NoOfSegments.Two;
    }
    else if (source.corners.left > target.corners.right) {
        pts = NoOfSegments.Four;
    }
    else {
        pts = NoOfSegments.Four;
    }
    return pts;
}
function getLeftToLeftSegmentCount(element, source, target) {
    var srcPort = element.sourcePortWrapper;
    var targetPort = element.targetPortWrapper;
    source.margin = { left: 10, right: 10, top: 10, bottom: 10 };
    target.margin = { left: 10, right: 10, top: 10, bottom: 10 };
    var diffX = Math.round(Math.abs(source.point.x - target.point.x));
    var diffY = Math.round(Math.abs(source.point.y - target.point.y));
    var pts;
    if (source.corners.left < target.corners.left) {
        if ((targetPort !== undefined && source.corners.bottom + source.margin.bottom < targetPort.offsetY) ||
            (targetPort === undefined && source.corners.bottom + source.margin.bottom < target.corners.middleLeft.y)) {
            pts = NoOfSegments.Three;
        }
        else if ((targetPort !== undefined && source.corners.top - source.margin.top > targetPort.offsetY) ||
            (targetPort === undefined && source.corners.top - source.margin.top > target.corners.middleLeft.y)) {
            pts = NoOfSegments.Three;
        }
        else if (source.corners.right < target.corners.left ||
            target.corners.right < source.corners.left) {
            pts = NoOfSegments.Five;
        }
        else if (diffX === 0 || diffY === 0) {
            pts = NoOfSegments.One;
        }
        else {
            pts = NoOfSegments.Three;
        }
    }
    else if ((srcPort !== undefined && srcPort.offsetY < target.corners.top - target.margin.top) ||
        (srcPort === undefined && source.corners.middleLeft.y < target.corners.top)) {
        pts = NoOfSegments.Three;
    }
    else if ((srcPort !== undefined && srcPort.offsetY > target.corners.bottom + target.margin.bottom) ||
        (srcPort === undefined && source.corners.middleLeft.y > target.corners.bottom + target.margin.bottom)) {
        pts = NoOfSegments.Three;
    }
    else if (source.corners.left > target.corners.right) {
        pts = NoOfSegments.Five;
    }
    else if (diffX === 0 || diffY === 0) {
        pts = NoOfSegments.One;
    }
    else {
        pts = NoOfSegments.Three;
    }
    return pts;
}
function getTopToTopSegmentCount(element, source, target) {
    var srcPort = element.sourcePortWrapper;
    var targetPort = element.targetPortWrapper;
    var diffX = Math.round(Math.abs(source.point.x - target.point.x));
    var diffY = Math.round(Math.abs(source.point.y - target.point.y));
    source.margin = { left: 10, right: 10, top: 10, bottom: 10 };
    var pts;
    target.margin = { left: 10, right: 10, top: 10, bottom: 10 };
    if (source.corners.top < target.corners.top) {
        if ((targetPort !== undefined && source.corners.left > targetPort.offsetX) ||
            (targetPort === undefined && source.corners.left > target.corners.left)) {
            pts = NoOfSegments.Three;
        }
        else if ((targetPort !== undefined && source.corners.right < targetPort.offsetX) ||
            (targetPort === undefined && source.corners.right < target.corners.right)) {
            pts = NoOfSegments.Three;
        }
        else if (source.corners.bottom < target.corners.top) {
            pts = NoOfSegments.Five;
        }
        else if (diffX === 0 || diffY === 0) {
            pts = NoOfSegments.One;
        }
        else {
            pts = NoOfSegments.Three;
        }
    }
    else if ((srcPort !== undefined && srcPort.offsetX > target.corners.right) ||
        (srcPort === undefined && source.corners.left > target.corners.right)) {
        pts = NoOfSegments.Three;
    }
    else if ((srcPort !== undefined && srcPort.offsetX < target.corners.left) ||
        (srcPort === undefined && source.corners.bottomRight.x < target.corners.left)) {
        pts = NoOfSegments.Three;
    }
    else if (source.corners.top > target.corners.bottom) {
        pts = NoOfSegments.Five;
    }
    else if (diffX === 0 || diffY === 0) {
        pts = NoOfSegments.One;
    }
    else {
        pts = NoOfSegments.Three;
    }
    return pts;
}
function addOrthoSegments(element, seg, source, target, segLength, lineDistribution) {
    var src = element.sourceWrapper;
    var tar = element.targetWrapper;
    var tarPort = element.targetPortWrapper;
    var intermeditatePoints;
    var srcCorner = src.corners;
    var tarCorner = tar.corners;
    var value;
    var extra = 20;
    if (source.direction !== target.direction || seg === NoOfSegments.Five) {
        if (source.direction === getOppositeDirection(target.direction) || seg === NoOfSegments.Three) {
            switch (source.direction) {
                case 'Left':
                    if (srcCorner.middleLeft.x > tarCorner.middleRight.x) {
                        value = (srcCorner.middleLeft.x - tarCorner.middleRight.x) / 2;
                        extra = !lineDistribution ? Math.min(extra, value) : value;
                    }
                    break;
                case 'Right':
                    if (srcCorner.middleRight.x < tarCorner.middleLeft.x) {
                        value = (tarCorner.middleLeft.x - srcCorner.middleRight.x) / 2;
                        extra = !lineDistribution ? Math.min(extra, value) : value;
                    }
                    break;
                case 'Top':
                    if (srcCorner.topCenter.y > tarCorner.bottomCenter.y) {
                        value = (srcCorner.topCenter.y - tarCorner.bottomCenter.y) / 2;
                        extra = !lineDistribution ? Math.min(extra, value) : value;
                    }
                    break;
                case 'Bottom':
                    if (srcCorner.bottomCenter.y < tarCorner.topCenter.y) {
                        value = (tarCorner.topCenter.y - srcCorner.bottomCenter.y) / 2;
                        extra = !lineDistribution ? Math.min(extra, value) : value;
                    }
                    break;
            }
        }
    }
    extra = adjustSegmentLength(srcCorner, source, extra);
    if (segLength) {
        extra = Math.max(extra, segLength);
    }
    if (seg === NoOfSegments.One) {
        intermeditatePoints = [source.point, target.point];
    }
    if (seg === NoOfSegments.Two) {
        intermeditatePoints = orthoConnection2Segment(source, target);
    }
    if (seg === NoOfSegments.Three) {
        intermeditatePoints = orthoConnection3Segment(element, source, target, extra);
    }
    if (seg === NoOfSegments.Four) {
        var prevDir = undefined;
        intermeditatePoints = orthoConnection4Segment(source, target, prevDir, intermeditatePoints, extra);
    }
    if (seg === NoOfSegments.Five) {
        intermeditatePoints = orthoConnection5Segment(source, target, extra);
    }
    return intermeditatePoints;
}
function adjustSegmentLength(bounds, source, extra) {
    switch (source.direction) {
        case 'Left':
            if (source.point.x > bounds.left) {
                extra = (source.point.x - bounds.left) > extra ? ((source.point.x - bounds.left) + extra) : extra;
            }
            break;
        case 'Right':
            if (source.point.x < bounds.right) {
                extra = (bounds.right - source.point.x) > extra ? ((bounds.right - source.point.x) + extra) : extra;
            }
            break;
        case 'Top':
            if (source.point.y > bounds.top) {
                extra = (source.point.y - bounds.top) > extra ? ((source.point.y - bounds.top) + extra) : extra;
            }
            break;
        case 'Bottom':
            if (source.point.y < bounds.bottom) {
                extra = (bounds.bottom - source.point.y) > extra ? ((bounds.bottom - source.point.y) + extra) : extra;
            }
            break;
    }
    return extra;
}
/** @private */
export function orthoConnection2Segment(source, target) {
    var intermeditatePoints;
    switch (source.direction) {
        case 'Left':
        case 'Right':
            var point1 = { x: target.point.x, y: source.point.y };
            intermeditatePoints = (Point.equals(source.point, point1) || Point.equals(target.point, point1)) ?
                [source.point, target.point] : [source.point, point1, target.point];
            break;
        case 'Top':
        case 'Bottom':
            var point2 = { x: source.point.x, y: target.point.y };
            intermeditatePoints = (Point.equals(source.point, point2) || Point.equals(target.point, point2)) ?
                [source.point, target.point] : [source.point, point2, target.point];
            break;
    }
    return intermeditatePoints;
}
function orthoConnection3Segment(element, source, target, extra, allow) {
    if (!extra) {
        extra = 20;
    }
    var srcPort = element.sourcePortWrapper;
    var intermeditatePoints;
    var segmentValue;
    var next;
    var diffx = target.point.x - source.point.x;
    var diffy = target.point.y - source.point.y;
    var temp;
    if (!allow && (Math.abs(diffx) < 0.001 || Math.abs(diffy) < 0.001)) {
        if (target.direction === undefined) {
            intermeditatePoints = [source.point, target.point];
            return intermeditatePoints;
        }
    }
    if (element.targetWrapper === undefined && Math.abs(diffx) <= 31 && Math.abs(diffy) <= 31) {
        if ((source.direction === 'Left' || source.direction === 'Right')) {
            if (Math.abs(diffy) < 12) {
                source.direction = (source.point.y > target.point.y) ? 'Top' : 'Bottom';
            }
        }
        else {
            if (Math.abs(diffx) < 12) {
                source.direction = (source.point.x > target.point.x) ? 'Left' : 'Right';
            }
        }
        if (Math.abs(diffx) > 12 || Math.abs(diffy) > 12) {
            return orthoConnection2Segment(source, target);
        }
        else {
            extra += 5;
        }
    }
    if (source.direction === 'Left' || source.direction === 'Right') {
        if (source.direction === 'Right') {
            if (target.direction !== undefined && target.direction === 'Right') {
                extra = Math.max(source.point.x, target.point.x) - source.point.x + extra;
            }
            if (source.point.x > target.point.x && srcPort === undefined) {
                extra = -extra;
            }
        }
        else {
            if (target.direction !== undefined && target.direction === 'Left') {
                extra = source.point.x - Math.min(source.point.x, target.point.x) + extra;
            }
            if (source.point.x > target.point.x || srcPort !== undefined || source.direction === 'Left') {
                extra = -extra;
            }
        }
        temp = target.point.y - source.point.y;
        segmentValue = addLineSegment(source.point, extra, 0);
        temp = target.point.y - segmentValue.y;
        if (temp !== 0) {
            next = addLineSegment(segmentValue, target.point.y - segmentValue.y, 90);
        }
    }
    else if (source.direction === 'Top' || source.direction === 'Bottom') {
        if (source.direction === 'Bottom') {
            if (target.direction !== undefined && target.direction === 'Bottom') {
                extra = Math.max(source.point.y, target.point.y) - source.point.y + extra;
            }
        }
        else {
            if (target.direction !== undefined && target.direction === 'Top') {
                extra = source.point.y - Math.min(source.point.y, target.point.y) + extra;
            }
            if (source.point.y > target.point.y || (srcPort !== undefined) || source.direction === 'Top') {
                extra = -extra;
            }
        }
        temp = target.point.x - source.point.x;
        if (source.direction === 'Top') {
            segmentValue = addLineSegment(source.point, extra, 90);
        }
        else {
            segmentValue = addLineSegment(source.point, extra, 90);
        }
        temp = target.point.x - segmentValue.x;
        if (temp !== 0) {
            next = addLineSegment(segmentValue, target.point.x - segmentValue.x, 0);
        }
    }
    if (temp === 0) {
        return intermeditatePoints = [
            source.point,
            target.point
        ];
    }
    intermeditatePoints = [
        source.point,
        segmentValue,
        next,
        target.point
    ];
    return intermeditatePoints;
}
function orthoConnection5Segment(source, target, extra) {
    if (extra === void 0) { extra = 20; }
    var intermeditatePoints;
    var length = extra;
    var sLeft = source.corners.left - source.margin.left;
    var sRight = source.corners.right + source.margin.right;
    var sBottom = source.corners.bottom + source.margin.bottom;
    var sTop = source.corners.top - source.margin.top;
    var tLeft = target.corners.left - target.margin.left;
    var tRight = target.corners.right + target.margin.right;
    var tBottom = target.corners.bottom + target.margin.bottom;
    var tTop = target.corners.top - target.margin.top;
    var segmentValue;
    switch (source.direction) {
        case 'Left':
            if ((sTop > tTop && sTop < tBottom || sBottom < tBottom && sBottom > tTop) &&
                sLeft > tLeft && sLeft <= tRight && extra >= 20) {
                length = source.point.x - target.corners.left + length;
            }
            segmentValue = addLineSegment(source.point, length, 180);
            break;
        case 'Top':
            if ((sLeft > tLeft && sLeft < tRight || sRight < tRight && sRight > tLeft) &&
                sTop > tTop && sTop <= tBottom && extra >= 20) {
                length = source.point.y - target.corners.top + length;
            }
            segmentValue = addLineSegment(source.point, length, 270);
            break;
        case 'Right':
            if ((sTop > tTop && sTop < tBottom || sBottom < tBottom && sBottom > tTop) &&
                sRight < tRight && sRight >= tLeft && extra >= 20) {
                length = target.corners.right - source.point.x + length;
            }
            segmentValue = addLineSegment(source.point, length, 0);
            break;
        case 'Bottom':
            if ((sLeft > tLeft && sLeft < tRight || sRight < tRight && sRight > tLeft) &&
                sBottom < tBottom && sBottom >= tTop && extra >= 20) {
                length = target.corners.bottom - source.point.y + length;
            }
            segmentValue = addLineSegment(source.point, length, 90);
            break;
    }
    intermeditatePoints = [
        source.point,
        segmentValue
    ];
    if (source.direction === 'Top' || source.direction === 'Bottom') {
        var prevDir = source.direction;
        source.direction = segmentValue.x > target.point.x ? 'Left' : 'Right';
        source.point = segmentValue;
        intermeditatePoints = orthoConnection4Segment(source, target, prevDir, intermeditatePoints);
    }
    else {
        var prevDir = source.direction;
        source.direction = segmentValue.y > target.point.y ? 'Top' : 'Bottom';
        source.point = segmentValue;
        intermeditatePoints = orthoConnection4Segment(source, target, prevDir, intermeditatePoints);
    }
    return intermeditatePoints;
}
function orthoConnection4Segment(source, target, prevDir, interPt, e) {
    if (e === void 0) { e = 20; }
    var segmentValue;
    if (prevDir === undefined) {
        source.margin = { left: 2, right: 2, top: 2, bottom: 2 };
        target.margin = { left: 0, right: 5, top: 0, bottom: 5 };
    }
    else {
        if (source.direction === 'Bottom') {
            if (target.corners.top > source.corners.bottom && target.corners.top - source.corners.bottom < 20) {
                e = (target.corners.top - source.corners.bottom) / 2;
            }
        }
        else if (source.direction === 'Top') {
            if (target.corners.bottom < source.corners.top && source.corners.top - target.corners.bottom < 20) {
                e = (source.corners.top - target.corners.bottom) / 2;
            }
        }
        else if (source.direction === 'Right') {
            if (target.corners.left > source.corners.right && target.corners.left - source.corners.right < 20) {
                e = (target.corners.left - source.corners.right) / 2;
            }
        }
        else if (source.direction === 'Left') {
            if (target.corners.right < source.corners.left && source.corners.left - target.corners.right < 20) {
                e = (source.corners.left - target.corners.right) / 2;
            }
        }
    }
    switch (source.direction) {
        case 'Left':
            e = getLeftLength(source, target, prevDir, e);
            segmentValue = addLineSegment(source.point, e, 180);
            break;
        case 'Right':
            e = getRightLength(source, target, e, prevDir);
            segmentValue = addLineSegment(source.point, e, 0);
            break;
        case 'Top':
            e = getTopLength(source, target, prevDir, e);
            segmentValue = addLineSegment(source.point, e, 270);
            break;
        case 'Bottom':
            e = getBottomLength(source, target, e, prevDir);
            segmentValue = addLineSegment(source.point, e, 90);
    }
    if (interPt !== undefined) {
        interPt.push(segmentValue);
    }
    else {
        interPt = [
            source.point,
            segmentValue
        ];
    }
    if (source.direction === 'Top' || source.direction === 'Bottom') {
        getOrtho3Seg(segmentValue, 'horizontal', source, target, interPt);
    }
    else if (source.direction === 'Right' || source.direction === 'Left') {
        getOrtho3Seg(segmentValue, 'vertical', source, target, interPt);
    }
    return interPt;
}
function getOrtho3Seg(sPt, orientation, src, tar, points) {
    var point1;
    var point2;
    var point3;
    if (orientation === 'horizontal') {
        src.margin = { left: 0, right: 10, top: 0, bottom: 10 };
        tar.margin = { left: 0, right: 10, top: 0, bottom: 10 };
    }
    else if (orientation === 'vertical') {
        src.margin = { left: 10, right: 0, top: 10, bottom: 0 };
        tar.margin = { left: 10, right: 0, top: 10, bottom: 0 };
    }
    var extra = 20;
    if (orientation === 'horizontal') {
        switch (tar.direction) {
            case 'Left':
                if (src.corners.right + src.margin.right < tar.corners.left - tar.margin.left &&
                    (tar.corners.left - src.corners.right > extra || (src.corners.top - src.margin.top <= tar.point.y &&
                        src.corners.bottom + src.margin.bottom >= tar.point.y))) {
                    var gap = Math.min(Math.abs(tar.corners.left - src.corners.right) / 2, 20);
                    extra = src.corners.right - sPt.x + gap;
                }
                else {
                    if ((src.direction === 'Top' && sPt.y > tar.point.y) || (src.direction === 'Bottom' && sPt.y < tar.point.y)) {
                        extra = Math.min(tar.corners.left, sPt.x) - sPt.x - 20;
                    }
                    else if (sPt.x >= src.corners.left - src.margin.left && sPt.x <= src.corners.right + src.margin.right) {
                        extra = Math.min(tar.corners.left, src.corners.left) - sPt.x - 20;
                    }
                    else {
                        extra = tar.corners.left - sPt.x - 20;
                    }
                }
                break;
            case 'Right':
                if (src.corners.left - src.margin.left > tar.corners.right + tar.margin.right &&
                    (src.corners.left - tar.corners.right > extra || (src.corners.top - src.margin.top <= tar.point.y &&
                        src.corners.bottom + src.margin.bottom >= tar.point.y))) {
                    var gap = Math.min(Math.abs(src.corners.left - tar.corners.right) / 2, 20);
                    extra = src.corners.left - sPt.x - gap;
                }
                else {
                    if ((src.direction === 'Top' && sPt.y > tar.point.y) || (src.direction === 'Bottom' && sPt.y < tar.point.y)) {
                        extra = Math.max(tar.corners.right, sPt.x) - sPt.x + 20;
                    }
                    else if (sPt.x >= src.corners.left - src.margin.left && sPt.x <= src.corners.right + src.margin.right) {
                        extra = Math.max(tar.corners.right, src.corners.right) - sPt.x + 20;
                    }
                    else {
                        extra = tar.corners.right - sPt.x + 20;
                    }
                }
                break;
        }
        point1 = addLineSegment(sPt, extra, 0);
        point2 = addLineSegment(point1, tar.point.y - sPt.y, 90);
        point3 = tar.point;
    }
    else if (orientation === 'vertical') {
        switch (tar.direction) {
            case 'Top':
                if (src.corners.bottom + src.margin.bottom < tar.corners.top - tar.margin.top &&
                    (tar.corners.top - src.corners.bottom > extra || (src.corners.left - src.margin.left <= tar.point.x &&
                        src.corners.right + src.margin.right >= tar.point.x))) {
                    var gap = Math.min(Math.abs(tar.corners.top - src.corners.bottom) / 2, 20);
                    extra = src.corners.bottom - sPt.y + gap;
                }
                else {
                    if ((src.direction === 'Left' && sPt.x > tar.point.x) || (src.direction === 'Right' && sPt.x < tar.point.x)) {
                        extra = Math.min(tar.corners.top, sPt.y) - sPt.y - 20;
                    }
                    else if (sPt.y >= src.corners.top - src.margin.top && sPt.y <= src.corners.bottom + src.margin.bottom) {
                        extra = Math.min(tar.corners.top, src.corners.top) - sPt.y - 20;
                    }
                    else {
                        extra = tar.corners.top - sPt.y - 20;
                    }
                }
                break;
            case 'Bottom':
                if (src.corners.top - src.margin.top > tar.corners.bottom + tar.margin.bottom &&
                    (src.corners.top - tar.corners.bottom > extra || (src.corners.left - src.margin.left <= tar.point.x &&
                        src.corners.right + src.margin.right >= tar.point.x))) {
                    var gap = Math.min(Math.abs(src.corners.top - tar.corners.bottom) / 2, 20);
                    extra = src.corners.top - sPt.y - gap;
                }
                else {
                    if ((src.direction === 'Left' && sPt.x > tar.point.x) || (src.direction === 'Right' && sPt.x < tar.point.x)) {
                        extra = Math.max(tar.corners.bottom, sPt.y) - sPt.y + 20;
                    }
                    else if (sPt.y >= src.corners.top - src.margin.top && sPt.y <= src.corners.bottom + src.margin.bottom) {
                        extra = Math.max(tar.corners.bottom, src.corners.bottom) - sPt.y + 20;
                    }
                    else {
                        extra = tar.corners.bottom - sPt.y + 20;
                    }
                }
                break;
        }
        point1 = addLineSegment(sPt, extra, 90);
        point2 = addLineSegment(point1, tar.point.x - sPt.x, 0);
        point3 = tar.point;
    }
    points.push(point1);
    points.push(point2);
    points.push(point3);
}
function getTopLength(source, target, preDir, length) {
    if (source.corners.top - source.margin.top > target.corners.top + target.margin.top &&
        source.corners.top - source.margin.top <= target.corners.bottom + target.margin.bottom) {
        if (target.direction === 'Right' && source.point.x < target.point.x) {
            length += source.corners.top - target.corners.top;
        }
        else if (target.direction === 'Left' && source.point.x > target.point.x) {
            length += source.corners.top - target.corners.top;
        }
        length += source.point.y - source.corners.top;
    }
    else {
        if ((preDir !== undefined && preDir !== 'Left') && target.direction === 'Right' && source.point.x < target.point.x) {
            length += Math.abs(source.point.y - target.corners.bottom);
        }
        else if ((preDir !== undefined && preDir !== 'Right') && target.direction === 'Left'
            && target.point.x < source.point.x) {
            length += Math.abs(source.point.y - target.corners.bottom);
        }
        else {
            length += source.point.y - source.corners.top;
        }
    }
    return length;
}
function getLeftLength(source, target, prevDir, segLength) {
    if (source.corners.left - source.margin.left > target.corners.left - target.margin.left &&
        source.corners.left - source.margin.left <= target.corners.right + target.margin.right) {
        if (target.direction === 'Bottom' && source.point.y < target.point.y) {
            segLength += source.corners.left - target.corners.left;
        }
        else if (target.direction === 'Top' && source.point.y > target.point.y) {
            segLength += source.corners.left - target.corners.left;
        }
        segLength += source.point.x - source.corners.left;
    }
    else {
        if ((prevDir !== undefined && prevDir !== 'Top') && target.direction === 'Bottom' && source.point.y < target.point.y) {
            segLength += Math.abs(source.point.x - target.corners.right);
        }
        else if ((prevDir !== undefined && prevDir !== 'Bottom') &&
            target.direction === 'Top' && target.point.y < source.point.y) {
            segLength += Math.abs(source.point.x - target.corners.right);
        }
        else {
            segLength += source.point.x - source.corners.left;
        }
    }
    return segLength;
}
function getRightLength(source, target, length, prevDir) {
    if (source.corners.right + source.margin.right < target.corners.right + target.margin.right &&
        source.corners.right + source.margin.right >= target.corners.left - target.margin.left) {
        if (target.direction === 'Bottom' && source.point.y < target.point.y) {
            length += target.corners.right - source.corners.right;
        }
        else if (target.direction === 'Top' && source.point.y > target.point.y) {
            length += target.corners.right - source.corners.right;
        }
        length += source.corners.right - source.point.x;
    }
    else {
        if ((prevDir !== undefined && prevDir !== 'Top') && target.direction === 'Bottom' && source.point.y < target.point.y) {
            length += Math.abs(source.point.x - target.corners.right);
        }
        else if ((prevDir !== undefined && prevDir !== 'Bottom') && target.direction === 'Top' && target.point.y < source.point.y) {
            length += Math.abs(source.point.x - target.corners.right);
        }
        else {
            length += source.corners.right - source.point.x;
        }
    }
    return length;
}
function getBottomLength(source, target, segLength, prevDir) {
    if (source.corners.bottom + source.margin.bottom < target.corners.bottom + target.margin.bottom &&
        source.corners.bottom + source.margin.bottom >= target.corners.top - target.margin.top) {
        if (target.direction === 'Right' && source.point.x < target.point.x) {
            segLength += target.corners.bottom - source.corners.bottom;
        }
        else if (target.direction === 'Left' && source.point.x > target.point.x) {
            segLength += target.corners.bottom - source.corners.bottom;
        }
        segLength += source.corners.bottom - source.point.y;
    }
    else {
        if ((prevDir !== undefined && prevDir !== 'Left') &&
            target.direction === 'Right' && source.point.x < target.point.x) {
            segLength += Math.abs(source.point.y - target.corners.bottom);
        }
        else if ((prevDir !== undefined && prevDir !== 'Right') &&
            target.direction === 'Left' && target.point.x < source.point.x) {
            segLength += Math.abs(source.point.y - target.corners.bottom);
        }
        else {
            segLength += source.corners.bottom - source.point.y;
        }
    }
    return segLength;
}
function getSwapping(srcDir, tarDir) {
    var swap = false;
    switch (srcDir) {
        case 'Left':
            switch (tarDir) {
                case 'Right':
                case 'Bottom':
                    swap = true;
                    break;
            }
            break;
        case 'Top':
            switch (tarDir) {
                case 'Left':
                case 'Right':
                case 'Bottom':
                    swap = true;
                    break;
            }
            break;
        case 'Bottom':
            switch (tarDir) {
                case 'Right':
                    swap = true;
                    break;
            }
            break;
    }
    return swap;
}
function swapPoints(source, target) {
    var direction = source.direction;
    source.direction = target.direction;
    target.direction = direction;
    var point = source.point;
    source.point = target.point;
    target.point = point;
    var corner = source.corners;
    source.corners = target.corners;
    target.corners = corner;
}
export function getPortDirection(point, corner, bounds, closeEdge) {
    var direction;
    var boundsValue = corner === undefined ? bounds : corner;
    var one = boundsValue.topLeft;
    var two = boundsValue.topRight;
    var three = boundsValue.bottomRight;
    var four = boundsValue.bottomLeft;
    var center = boundsValue.center;
    var angle = findAngle(center, point);
    var fourty5 = findAngle(center, three);
    var one35 = findAngle(center, four);
    var two25 = findAngle(center, one);
    var three15 = findAngle(center, two);
    if (angle > two25 && angle < three15) {
        direction = 'Top';
        // if (bounds.width < bounds.height && closeEdge) {
        //     let height: number = (bounds.height - bounds.width) / 2;
        //     let width: number = bounds.width;
        //     if (Math.abs(point.x - one.x) < Math.abs(point.x - two.x)) {
        //         direction = checkCloseEdge(direction, new Rect(one.x, one.y, width, height), point, 'Left');
        //     } else {
        //         direction = checkCloseEdge(direction, new Rect(two.x - bounds.width, two.y, width, height), point, 'Right');
        //     }
        // }
    }
    else if (angle >= fourty5 && angle < one35) {
        direction = 'Bottom';
        // if (bounds.width < bounds.height && closeEdge) {
        //     let height: number = (bounds.height - bounds.width) / 2;
        //     let width: number = bounds.width;
        //     if (Math.abs(point.x - four.x) < Math.abs(point.x - three.x)) {
        //         direction = checkCloseEdge(direction, new Rect(four.x, four.y - height, width, height), point, 'Left');
        //     } else {
        //         let value: Rect = new Rect(three.x - bounds.width, three.y - bounds.height / 4, bounds.width, bounds.height / 4);
        //         direction = checkCloseEdge(direction, value, point, 'Right');
        //     }
        // }
    }
    else if (angle >= one35 && angle <= two25) {
        direction = 'Left';
        // if (bounds.width > bounds.height && closeEdge) {
        //     let width: number = (bounds.width - bounds.height) / 2;
        //     let height: number = bounds.height;
        //     if (Math.abs(point.y - one.y) < Math.abs(point.y - four.y)) {
        //         direction = checkCloseEdge(direction, new Rect(one.x, one.y, width, height), point, 'Top');
        //     } else {
        //         direction = checkCloseEdge(direction, new Rect(four.x, four.y - height, width, height), point, 'Bottom');
        //     }
        // }
    }
    else if (angle >= three15 || angle < fourty5) {
        direction = 'Right';
        // if (bounds.width > bounds.height && closeEdge) {
        //     let width: number = (bounds.width - bounds.height) / 2;
        //     let height: number = bounds.height;
        //     if (Math.abs(point.y - two.y) < Math.abs(point.y - three.y)) {
        //         direction = checkCloseEdge(direction, new Rect(two.x - width, two.y, width, height), point, 'Top');
        //     } else {
        //         direction = checkCloseEdge(direction, 
        //new Rect(three.x - width, three.y - height, width, height), point, 'Bottom');
        //     }
        // }
    }
    else {
        direction = 'Right';
    }
    return direction;
}
// function checkCloseEdge(direction: string, threshold: Rect, port: PointModel, nearest: string): string {
// if (threshold) {
//     switch (direction) {
//         case 'Bottom':
//         case 'Top':
//             let left: number = Math.abs(threshold.left - port.x);
//             let right: number = Math.abs(threshold.right - port.x);
//             let ver: number = direction === 'Top' ? Math.abs(threshold.top - port.y) : Math.abs(threshold.bottom - port.y);
//             if (left < right) {
//                 if (left < ver) {
//                     return 'Left';
//                 }
//             } else {
//                 if (right < ver) {
//                     return 'Right';
//                 }
//             }
//             break;
//         case 'Left':
//         case 'Right':
//             let top: number = Math.abs(threshold.top - port.y);
//             let bottom: number = Math.abs(threshold.bottom - port.y);
//             let hor: number = direction === 'Left' ? Math.abs(threshold.left - port.x) : Math.abs(threshold.right - port.x);
//             if (top < bottom) {
//                 if (top < hor) {
//                     return 'Top';
//                 }
//             } else {
//                 if (bottom < hor) {
//                     return 'Bottom';
//                 }
//             }
//             break;
//     }
// }
//Meant for dock port
//    return direction;
//  }
/** @private */
export function getOuterBounds(obj) {
    var outerBounds;
    outerBounds = obj.wrapper.children[0].bounds;
    if (obj.sourceDecorator.shape !== 'None') {
        outerBounds.uniteRect(obj.wrapper.children[1].bounds);
    }
    if (obj.targetDecorator.shape !== 'None') {
        outerBounds.uniteRect(obj.wrapper.children[2].bounds);
    }
    return outerBounds;
}
export function getOppositeDirection(direction) {
    switch (direction) {
        case 'Top':
            return 'Bottom';
        case 'Bottom':
            return 'Top';
        case 'Left':
            return 'Right';
        case 'Right':
            return 'Left';
    }
    return 'auto';
}
