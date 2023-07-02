import { PointF, PdfColor, PdfPage, PdfFontFamily } from '@syncfusion/ej2-pdf-export';
import { TimelineDetails, TaskLabel } from './../base/interface';
import { Gantt } from '../base/gantt';
/**
 * @hidden
 */
export declare class PdfGanttTaskbarCollection {
    endDate?: Date;
    /** Defines the duration of task. */
    duration?: number;
    /** Defines the duration unit of task. */
    durationUnit?: string;
    /** Defines the task is auto schedule-able or not. */
    isAutoSchedule?: boolean;
    /** Defines the task is milestone or not. */
    isMilestone?: boolean;
    /** Defines the left of task.
     * @hidden
     */
    left?: number;
    /** Defines the progress of task. */
    progress?: number;
    /** Defines the progress width of task. */
    progressWidth?: number;
    /** Defines the start date of task. */
    startDate?: Date;
    /** Defines the id of task. */
    taskId?: string;
    /** Defines the parent id of task. */
    parentId?: string;
    /** Defines the name of task. */
    taskName?: string;
    /** Defines the width of task. */
    width?: number;
    /** Defines the unique id of task. */
    uniqueID?: string;
    /** Defines the total progress of task. */
    totalProgress?: number;
    /** Defines the total duration of task. */
    totalDuration?: number;
    /**
     * @private
     */
    unscheduledTaskBy?: string;
    /**
     * @private
     */
    unscheduleStarteDate?: Date;
    /**
     * @private
     */
    unscheduleEndDate?: Date;
    isParentTask?: boolean;
    isScheduledTask?: boolean;
    height: number;
    fontFamily: PdfFontFamily;
    gridLineColor: PdfColor;
    progressFontColor: PdfColor;
    taskColor: PdfColor;
    labelColor: PdfColor;
    taskBorderColor: PdfColor;
    progressColor: PdfColor;
    milestoneColor: PdfColor;
    taskbar: PdfGanttTaskbarCollection[];
    parent: Gantt;
    isCompleted: boolean;
    /**
     * @private
     */
    leftTaskLabel: TaskLabel;
    /**
     * @private
     */
    rightTaskLabel: TaskLabel;
    startPage: number;
    endPage: number;
    isStartPoint: boolean;
    taskStartPoint: PointF;
    add(): PdfGanttTaskbarCollection;
    constructor(parent?: Gantt);
    /**
     * Get the next PDF page
     */
    private GetNextPage;
    /**
     * Draw the taskbar, chart back ground
     * @private
     */
    drawTaskbar(page: PdfPage, startPoint: PointF, detail: TimelineDetails, cumulativeWidth: number, rowHeight: number, taskbar: PdfGanttTaskbarCollection): boolean;
    /**
     * Draw task right side label
     */
    private drawRightLabel;
    /**
     * Draw task left task label
     */
    private drawLeftLabel;
    private getWidth;
    /**
     * Draw Unscheduled Task
     */
    private drawUnscheduledTask;
    /**
     * Draw milestone task
     */
    private drawMilestone;
}
