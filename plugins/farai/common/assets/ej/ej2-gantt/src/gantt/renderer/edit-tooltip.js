import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Tooltip } from '@syncfusion/ej2-popups';
import * as cls from '../base/css-constants';
/**
 * File for handling taskbar editing tooltip in Gantt.
 */
var EditTooltip = /** @class */ (function () {
    function EditTooltip(gantt, taskbarEdit) {
        this.parent = gantt;
        this.taskbarEdit = taskbarEdit;
    }
    /**
     * To create tooltip.
     * @return {void}
     * @private
     */
    EditTooltip.prototype.createTooltip = function (opensOn, mouseTrail, target) {
        var _this = this;
        this.toolTipObj = new Tooltip({
            opensOn: opensOn,
            content: this.getTooltipText(-1),
            position: 'TopRight',
            mouseTrail: mouseTrail,
            cssClass: cls.ganttTooltip,
            target: target ? target : null,
            animation: { open: { effect: 'None' }, close: { effect: 'None' } }
        });
        this.toolTipObj.beforeRender = function (args) {
            var argsData = {
                data: _this.taskbarEdit.taskBarEditRecord,
                args: args,
                content: _this.toolTipObj.content
            };
            _this.parent.trigger('beforeTooltipRender', argsData);
        };
        this.toolTipObj.afterOpen = function (args) {
            _this.updateTooltipPosition(args);
        };
        this.toolTipObj.isStringTemplate = true;
        this.toolTipObj.appendTo(this.parent.chartPane);
    };
    /**
     * Method to update tooltip position
     * @param args
     */
    EditTooltip.prototype.updateTooltipPosition = function (args) {
        var containerPosition = this.parent.getOffsetRect(this.parent.chartPane);
        var leftEnd = containerPosition.left + this.parent.chartPane.offsetWidth;
        var tooltipPositionX = args.element.offsetLeft;
        if (leftEnd < (tooltipPositionX + args.element.offsetWidth)) {
            tooltipPositionX += leftEnd - (tooltipPositionX + args.element.offsetWidth);
        }
        args.element.style.left = tooltipPositionX + 'px';
    };
    /**
     * To show/hide taskbar edit tooltip.
     * @return {void}
     * @private
     */
    EditTooltip.prototype.showHideTaskbarEditTooltip = function (bool, segmentIndex) {
        if (bool && this.parent.tooltipSettings.showTooltip) {
            this.createTooltip('Custom', false);
            this.parent.tooltipModule.toolTipObj.close();
            this.updateTooltip(segmentIndex);
            if (this.taskbarEdit.connectorSecondAction === 'ConnectorPointLeftDrag') {
                this.toolTipObj.open(this.taskbarEdit.connectorSecondElement.querySelector('.' + cls.connectorPointLeft));
            }
            else if (this.taskbarEdit.connectorSecondAction === 'ConnectorPointRightDrag') {
                this.toolTipObj.open(this.taskbarEdit.connectorSecondElement.querySelector('.' + cls.connectorPointRight));
            }
            else {
                this.toolTipObj.open(this.taskbarEdit.taskBarEditElement);
            }
        }
        else if (!isNullOrUndefined(this.toolTipObj)) {
            this.toolTipObj.destroy();
            this.toolTipObj = null;
        }
    };
    /**
     * To update tooltip content and position.
     * @return {void}
     * @private
     */
    EditTooltip.prototype.updateTooltip = function (segmentIndex) {
        var ganttProp = this.taskbarEdit.taskBarEditRecord.ganttProperties;
        var taskWidth = segmentIndex === -1 ? ganttProp.width :
            ganttProp.segments[segmentIndex].width;
        var progressWidth = segmentIndex === -1 ? ganttProp.progressWidth :
            ganttProp.segments[segmentIndex].progressWidth;
        var left = segmentIndex === -1 ? ganttProp.left : ganttProp.left + ganttProp.segments[segmentIndex].left;
        if (!isNullOrUndefined(this.toolTipObj)) {
            if (this.taskbarEdit.taskBarEditAction === 'ConnectorPointLeftDrag' ||
                this.taskbarEdit.taskBarEditAction === 'ConnectorPointRightDrag') {
                this.toolTipObj.content = this.getTooltipText(segmentIndex);
                this.toolTipObj.offsetY = -3;
            }
            else {
                this.toolTipObj.content = this.getTooltipText(segmentIndex);
                this.toolTipObj.refresh(this.taskbarEdit.taskBarEditElement);
                if (this.taskbarEdit.taskBarEditAction === 'LeftResizing') {
                    this.toolTipObj.offsetX = -taskWidth;
                }
                else if (this.taskbarEdit.taskBarEditAction === 'RightResizing' ||
                    this.taskbarEdit.taskBarEditAction === 'ParentResizing') {
                    this.toolTipObj.offsetX = 0;
                }
                else if (this.taskbarEdit.taskBarEditAction === 'ProgressResizing') {
                    this.toolTipObj.offsetX = -(taskWidth - progressWidth);
                }
                else if (this.taskbarEdit.taskBarEditAction === 'MilestoneDrag') {
                    this.toolTipObj.offsetX = -(this.parent.chartRowsModule.milestoneHeight / 2);
                }
                else if (taskWidth > 5) {
                    this.toolTipObj.offsetX = -(taskWidth + left - this.taskbarEdit.tooltipPositionX);
                }
            }
        }
    };
    /**
     * To get updated tooltip text.
     * @return {void}
     * @private
     */
    EditTooltip.prototype.getTooltipText = function (segmentIndex) {
        var tooltipString = '';
        var instance = this.parent.globalize;
        var editRecord = this.taskbarEdit.taskBarEditRecord.ganttProperties;
        if (!isNullOrUndefined(editRecord.segments) && editRecord.segments.length > 0 && segmentIndex !== -1
            && this.taskbarEdit.taskBarEditAction !== 'ProgressResizing') {
            editRecord = editRecord.segments[segmentIndex];
        }
        if (this.parent.tooltipSettings.editing) {
            var templateNode = this.parent.tooltipModule.templateCompiler(this.parent.tooltipSettings.editing, this.parent, editRecord, 'TooltipEditingTemplate');
            tooltipString = templateNode[0];
        }
        else {
            switch (this.taskbarEdit.taskBarEditAction) {
                case 'ProgressResizing':
                    tooltipString = this.parent.localeObj.getConstant('progress') + ' : ' + editRecord.progress;
                    break;
                case 'LeftResizing':
                    tooltipString = this.parent.localeObj.getConstant('startDate') + ' : ';
                    tooltipString += instance.formatDate(editRecord.startDate, { format: this.parent.getDateFormat() });
                    tooltipString += '<br/>' + this.parent.localeObj.getConstant('duration') + ' : ' +
                        this.parent.getDurationString(editRecord.duration, editRecord.durationUnit);
                    break;
                case 'RightResizing':
                case 'ParentResizing':
                    tooltipString = this.parent.localeObj.getConstant('endDate') + ' : ';
                    tooltipString += instance.formatDate(editRecord.endDate, { format: this.parent.getDateFormat() });
                    tooltipString += '<br/>' + this.parent.localeObj.getConstant('duration') + ' : ' +
                        this.parent.getDurationString(editRecord.duration, editRecord.durationUnit);
                    break;
                case 'ChildDrag':
                case 'ParentDrag':
                case 'MilestoneDrag':
                case 'ManualParentDrag':
                    if (!isNullOrUndefined(this.taskbarEdit.taskBarEditRecord.ganttProperties.startDate)) {
                        tooltipString = this.parent.localeObj.getConstant('startDate') + ' : ';
                        tooltipString += instance.formatDate(editRecord.startDate, { format: this.parent.getDateFormat() });
                    }
                    if (!isNullOrUndefined(this.taskbarEdit.taskBarEditRecord.ganttProperties.endDate)) {
                        tooltipString += tooltipString === '' ? '' : '<br/>';
                        tooltipString += this.parent.localeObj.getConstant('endDate') + ' : ' + instance.formatDate(editRecord.endDate, { format: this.parent.getDateFormat() });
                    }
                    break;
                case 'ConnectorPointLeftDrag':
                case 'ConnectorPointRightDrag':
                    tooltipString = this.parent.connectorLineModule.tooltipTable;
                    if (isNullOrUndefined(this.toolTipObj)) {
                        this.parent.connectorLineModule.tooltipTable.innerHTML =
                            this.parent.connectorLineModule.getConnectorLineTooltipInnerTd(this.parent.editModule.taskbarEditModule.taskBarEditRecord.ganttProperties.taskName, this.parent.editModule.taskbarEditModule.fromPredecessorText, '', '');
                    }
                    break;
            }
        }
        return tooltipString;
    };
    return EditTooltip;
}());
export { EditTooltip };
