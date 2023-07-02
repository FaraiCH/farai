import { formatUnit, createElement } from '@syncfusion/ej2-base';
/**
 * virtual Content renderer for Gantt
 */
var VirtualContentRenderer = /** @class */ (function () {
    function VirtualContentRenderer(parent) {
        this.parent = parent;
    }
    /**
     * To render a wrapper for chart body content when virtualization is enabled.
     * @hidden
     */
    VirtualContentRenderer.prototype.renderWrapper = function (height) {
        this.wrapper = createElement('div', { className: 'e-virtualtable', styles: "min-height:" + formatUnit(height) });
        this.parent.ganttChartModule.chartBodyContent.appendChild(this.wrapper);
        this.appendChildElements(this.parent.chartRowsModule.taskTable);
    };
    /**
     * To append child elements for wrappered element when virtualization is enabled.
     * @hidden
     */
    VirtualContentRenderer.prototype.appendChildElements = function (element) {
        this.wrapper.appendChild(element);
    };
    /**
     * To adjust gantt content table's style when virtualization is enabled
     * @hidden
     */
    VirtualContentRenderer.prototype.adjustTable = function () {
        var content = this.parent.treeGrid.getContent().querySelector('.e-content').querySelector('.e-virtualtable');
        this.parent.ganttChartModule.virtualRender.wrapper.style.transform = content.style.transform;
    };
    return VirtualContentRenderer;
}());
export { VirtualContentRenderer };
