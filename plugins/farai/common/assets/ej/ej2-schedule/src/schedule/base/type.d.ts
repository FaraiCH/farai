/**
 * types
 */
/**
 * An enum that denotes the view mode of the Scheduler.
 */
export declare type View = 'Day' | 'Week' | 'WorkWeek' | 'Month' | 'Year' | 'Agenda' | 'MonthAgenda' | 'TimelineDay' | 'TimelineWeek' | 'TimelineWorkWeek' | 'TimelineMonth' | 'TimelineYear';
/**
 * An enum that holds the actions available in scheduler.
 */
export declare type CurrentAction = 'Add' | 'Save' | 'Delete' | 'DeleteOccurrence' | 'DeleteSeries' | 'EditOccurrence' | 'EditSeries' | 'EditFollowingEvents' | 'DeleteFollowingEvents';
/** @deprecated */
export declare type ReturnType = {
    result: Object[];
    count: number;
    aggregates?: Object;
};
/**
 * An enum that holds the available popup types in the scheduler.
 */
export declare type PopupType = 'Editor' | 'EventContainer' | 'QuickInfo' | 'RecurrenceAlert' | 'DeleteAlert' | 'ViewEventInfo' | 'EditEventInfo' | 'ValidationAlert' | 'RecurrenceValidationAlert';
/**
 * An enum that holds the header row type in the timeline scheduler.
 */
export declare type HeaderRowType = 'Year' | 'Month' | 'Week' | 'Date' | 'Hour';
/**
 * An enum that holds the orientation modes of the scheduler.
 */
export declare type Orientation = 'Vertical' | 'Horizontal';
/**
 * An enum that holds the supported excel file formats.
 */
export declare type ExcelFormat = 'csv' | 'xlsx';
/**
 * An enum that holds the type where the quick info template applies.
 */
export declare type TemplateType = 'Both' | 'Cell' | 'Event';
