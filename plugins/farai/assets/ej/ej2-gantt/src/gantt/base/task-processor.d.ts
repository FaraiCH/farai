import { IGanttData, ITaskData, IParent, IWorkTimelineRanges, ITaskSegment } from './interface';
import { Gantt } from './gantt';
import { DateProcessor } from './date-processor';
/**
 * To calculate and update task related values
 */
export declare class TaskProcessor extends DateProcessor {
    private recordIndex;
    private dataArray;
    private taskIds;
    private segmentCollection;
    private hierarchyData;
    constructor(parent: Gantt);
    private addEventListener;
    /**
     * @private
     */
    checkDataBinding(isChange?: boolean): void;
    private processTimeline;
    private initDataSource;
    private constructDataSource;
    private cloneDataSource;
    /**
     *
     *
     */
    private constructResourceViewDataSource;
    /**
     * Function to manipulate data-source
     * @hidden
     */
    private prepareDataSource;
    private calculateSharedTaskUniqueIds;
    private prepareRecordCollection;
    /**
     * Method to update custom field values in gantt record
     */
    private addCustomFieldValue;
    /**
     * To populate Gantt record
     * @param data
     * @param level
     * @param parentItem
     * @param isLoad
     * @private
     */
    createRecord(data: Object, level: number, parentItem?: IGanttData, isLoad?: boolean): IGanttData;
    private sortSegmentsData;
    setSegmentsInfo(data: IGanttData, onLoad: boolean): ITaskSegment[];
    private setSegmentTaskData;
    /**
     * Method to calculate work based on resource unit and duration.
     * @param ganttData
     */
    updateWorkWithDuration(ganttData: IGanttData): void;
    /**
     *
     * @param record
     * @param parent
     * @private
     */
    getCloneParent(parent: IGanttData): IParent;
    /**
     * @private
     */
    reUpdateResources(): void;
    private addTaskData;
    private updateExpandStateMappingValue;
    /**
     *
     */
    private setValidatedDates;
    /**
     *
     * @param ganttData
     * @param data
     * @param isLoad
     * @private
     */
    calculateScheduledValues(ganttData: IGanttData, data: Object, isLoad: boolean): void;
    /**
     * Method to update duration with work value.
     * @param ganttData
     */
    updateDurationWithWork(ganttData: IGanttData): void;
    /**
     * Update units of resources with respect to duration and work of a task.
     * @param ganttData
     */
    updateUnitWithWork(ganttData: IGanttData): void;
    private calculateDateFromEndDate;
    private calculateDateFromStartDate;
    /**
     *
     * @param parentWidth
     * @param percent
     * @private
     */
    getProgressWidth(parentWidth: number, percent: number): number;
    /**
     *
     * @param ganttProp
     * @private
     */
    calculateWidth(ganttData: IGanttData, isAuto?: boolean): number;
    private getTaskbarHeight;
    /**
     * Method to calculate left
     * @param ganttProp
     * @private
     */
    calculateLeft(ganttProp: ITaskData, isAuto?: boolean): number;
    /**
     * calculate the left position of the auto scheduled taskbar
     * @param {ITaskData} ganttProperties - Defines the gantt data.
     * @private
     */
    calculateAutoLeft(ganttProperties: ITaskData): number;
    /**
     * To calculate duration of Gantt record with auto scheduled start date and auto scheduled end date
     * @param {ITaskData} ganttProperties - Defines the gantt data.
     */
    calculateAutoDuration(ganttProperties: ITaskData): number;
    /**
     * calculate the with between auto scheduled start date and auto scheduled end date
     * @param {ITaskData} ganttProperties - Defines the gantt data.
     * @private
     */
    calculateAutoWidth(ganttProperties: ITaskData): number;
    /**
     * calculate the left margin of the baseline element
     * @param ganttData
     * @private
     */
    calculateBaselineLeft(ganttProperties: ITaskData): number;
    /**
     * calculate the width between baseline start date and baseline end date.
     * @private
     */
    calculateBaselineWidth(ganttProperties: ITaskData): number;
    /**
     * To get tasks width value
     * @param startDate
     * @param endDate
     * @private
     */
    getTaskWidth(startDate: Date, endDate: Date): number;
    /**
     * Get task left value
     * @param startDate
     * @param isMilestone
     * @private
     */
    getTaskLeft(startDate: Date, isMilestone: boolean): number;
    getSplitTaskWidth(sDate: Date, duration: number, data: IGanttData): number;
    getSplitTaskLeft(sDate: Date, segmentTaskStartDate: Date): number;
    /**
     *
     * @param ganttData
     * @param fieldName
     * @private
     */
    updateMappingData(ganttData: IGanttData, fieldName: string): void;
    private segmentTaskData;
    /**
     * Method to update the task data resource values
     */
    private updateTaskDataResource;
    private setRecordDate;
    private getDurationInDay;
    private setRecordDuration;
    private getWorkInHour;
    /**
     *
     * @param ganttData
     * @private
     */
    updateTaskData(ganttData: IGanttData): void;
    /**
     * To set resource value in Gantt record
     * @private
     */
    setResourceInfo(data: Object): Object[];
    /**
     * To set resource unit in Gantt record
     * @private
     */
    updateResourceUnit(resourceData: Object[]): void;
    /**
     * @private
     */
    updateResourceName(data: IGanttData): void;
    private dataReorder;
    private validateDurationUnitMapping;
    private validateTaskTypeMapping;
    private validateWorkUnitMapping;
    /**
     * To update duration value in Task
     * @param duration
     * @param ganttProperties
     * @private
     */
    updateDurationValue(duration: string, ganttProperties: ITaskData): void;
    /**
     * @private
     */
    reUpdateGanttData(): void;
    private _isInStartDateRange;
    private _isInEndDateRange;
    /**
     * @private
     * Method to find overlapping value of the parent task
     */
    updateOverlappingValues(resourceTask: IGanttData): void;
    /**
     * @private
     */
    updateOverlappingIndex(tasks: IGanttData[]): void;
    /**
     * Method to calculate the left and width value of oarlapping ranges
     * @private
     */
    calculateRangeLeftWidth(ranges: IWorkTimelineRanges[]): void;
    /**
     * @private
     */
    mergeRangeCollections(ranges: IWorkTimelineRanges[], isSplit?: boolean): IWorkTimelineRanges[];
    /**
     * @private
     * Sort resource child records based on start date
     */
    setSortedChildTasks(resourceTask: IGanttData): IGanttData[];
    private splitRangeCollection;
    private getRangeWithDay;
    private splitRangeForDayMode;
    private getRangeWithWeek;
    private splitRangeForWeekMode;
    /**
     * Update all gantt data collection width, progress width and left value
     * @private
     */
    updateGanttData(): void;
    /**
     * Update all gantt data collection width, progress width and left value
     * @public
     */
    private updateTaskLeftWidth;
    /**
     * @private
     */
    reUpdateGanttDataPosition(): void;
    /**
     * method to update left, width, progress width in record
     * @param data
     * @private
     */
    updateWidthLeft(data: IGanttData): void;
    /**
     * method to update left, width, progress width in record
     * @param data
     * @private
     */
    updateAutoWidthLeft(data: IGanttData): void;
    /**
     * To calculate parent progress value
     * @private
     */
    getParentProgress(childGanttRecord: IGanttData): Object;
    private resetDependency;
    /**
     * @private
     */
    updateParentItems(cloneParent: IParent | IGanttData, isParent?: boolean): void;
}
