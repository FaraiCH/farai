import { IGanttData, ITaskData, ITaskSegment } from './interface';
import { Gantt } from './gantt';
/**
 *  Date processor is used to handle date of task data.
 */
export declare class DateProcessor {
    protected parent: Gantt;
    constructor(parent: Gantt);
    /**
     *
     */
    private isValidateNonWorkDays;
    /**
     * Method to convert given date value as valid start date
     * @param date
     * @param ganttProp
     * @param validateAsMilestone
     * @private
     */
    checkStartDate(date: Date, ganttProp?: ITaskData, validateAsMilestone?: boolean): Date;
    /**
     * To update given date value to valid end date
     * @param date
     * @param ganttProp
     * @private
     */
    checkEndDate(date: Date, ganttProp?: ITaskData, validateAsMilestone?: boolean): Date;
    /**
     * To validate the baseline start date
     * @param date
     * @private
     */
    checkBaselineStartDate(date: Date): Date;
    /**
     * To validate baseline end date
     * @param date
     * @private
     */
    checkBaselineEndDate(date: Date): Date;
    /**
     * To calculate start date value from duration and end date
     * @param ganttData
     * @private
     */
    calculateStartDate(ganttData: IGanttData): void;
    /**
     *
     * @param ganttData
     * @private
     */
    calculateEndDate(ganttData: IGanttData): void;
    totalDuration(segments: ITaskSegment[]): number;
    /**
     * To calculate duration from start date and end date
     * @param {IGanttData} ganttData - Defines the gantt data.
     */
    calculateDuration(ganttData: IGanttData): void;
    /**
     *
     * @param sDate Method to get total nonworking time between two date values
     * @param eDate
     * @param isAutoSchedule
     * @param isCheckTimeZone
     */
    private getNonworkingTime;
    /**
     *
     * @param startDate
     * @param endDate
     * @param durationUnit
     * @param isAutoSchedule
     * @param isCheckTimeZone
     * @private
     */
    getDuration(startDate: Date, endDate: Date, durationUnit: string, isAutoSchedule: boolean, isMilestone: boolean, isCheckTimeZone?: boolean): number;
    /**
     *
     * @param duration
     * @param durationUnit
     */
    private getDurationAsSeconds;
    /**
     * To get date from start date and duration
     * @param startDate
     * @param duration
     * @param durationUnit
     * @param ganttProp
     * @param validateAsMilestone
     * @private
     */
    getEndDate(startDate: Date, duration: number, durationUnit: string, ganttProp: ITaskData, validateAsMilestone: boolean): Date;
    /**
     *
     * @param endDate To calculate start date vale from end date and duration
     * @param duration
     * @param durationUnit
     * @param ganttProp
     * @private
     */
    getStartDate(endDate: Date, duration: number, durationUnit: string, ganttProp: ITaskData): Date;
    /**
     * @private
     */
    protected getProjectStartDate(ganttProp: ITaskData, isLoad?: boolean): Date;
    /**
     * @private
     * @param ganttProp
     */
    getValidStartDate(ganttProp: ITaskData, isAuto?: boolean): Date;
    /**
     *
     * @param ganttProp
     * @private
     */
    getValidEndDate(ganttProp: ITaskData, isAuto?: boolean): Date;
    /**
     * @private
     */
    getSecondsPerDay(): number;
    /**
     *
     * @param value
     * @param isFromDialog
     * @private
     */
    getDurationValue(value: string | number, isFromDialog?: boolean): Object;
    /**
     *
     * @param date
     */
    protected getNextWorkingDay(date: Date): Date;
    /**
     * get weekend days between two dates without including args dates
     * @param startDate
     * @param endDate
     */
    protected getWeekendCount(startDate: Date, endDate: Date): number;
    /**
     *
     * @param startDate
     * @param endDate
     * @param isCheckTimeZone
     */
    protected getNumberOfSeconds(startDate: Date, endDate: Date, isCheckTimeZone: boolean): number;
    /**
     *
     * @param startDate
     * @param endDate
     */
    protected getHolidaysCount(startDate: Date, endDate: Date): number;
    /**
     * @private
     */
    getHolidayDates(): number[];
    /**
     * @private
     */
    isOnHolidayOrWeekEnd(date: Date, checkWeekEnd: boolean): boolean;
    /**
     * To calculate non working times in given date
     * @param startDate
     * @param endDate
     */
    protected getNonWorkingSecondsOnDate(startDate: Date, endDate: Date, isAutoSchedule: boolean): number;
    /**
     *
     * @param date
     */
    protected getPreviousWorkingDay(date: Date): Date;
    /**
     * To get non-working day indexes.
     * @return {void}
     * @private
     */
    getNonWorkingDayIndex(): void;
    /**
     *
     * @param seconds
     * @param date
     * @private
     */
    setTime(seconds: number, date: Date): void;
    /**
     *
     */
    protected getTimeDifference(startDate: Date, endDate: Date, isCheckTimeZone?: boolean): number;
    /**
     *
     */
    protected updateDateWithTimeZone(sDate: Date, eDate: Date): void;
    /**
     *
     * @param date
     */
    protected getSecondsInDecimal(date: Date): number;
    /**
     *
     * @private
     */
    offset(date: Date, localOffset: number, timezone: string): number;
    /**
     * @param date
     * @private
     */
    convert(date: Date, timezone: string): Date;
    /**
     * @param date
     * @private
     */
    getDateFromFormat(date: string | Date, toConvert?: boolean): Date;
    /**
     * @private
     */
    compareDates(date1: Date, date2: Date): number;
    /**
     *
     * @param duration
     * @param durationUnit
     * @private
     */
    getDurationString(duration: number, durationUnit: string): string;
    /**
     * Method to get work with value and unit.
     * @param work
     * @param workUnit
     * @private
     */
    getWorkString(work: number | string, workUnit: string): string;
    /**
     *
     * @param editArgs
     * @private
     */
    calculateProjectDatesForValidatedTasks(editArgs?: Object): void;
    /**
     *
     * @param editArgs
     * @private
     */
    calculateProjectDates(editArgs?: Object): void;
    /**
     *
     * @param segments
     * @private
     */
    splitTasksDuration(segments: ITaskSegment[]): number;
}
