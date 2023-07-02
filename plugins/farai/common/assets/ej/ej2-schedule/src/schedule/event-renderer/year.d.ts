import { Schedule } from '../base/schedule';
import { TimelineEvent } from './timeline-view';
/**
 * Year view events render
 */
export declare class YearEvent extends TimelineEvent {
    cellHeader: number;
    private isResource;
    /**
     * Constructor for year events
     */
    constructor(parent: Schedule);
    renderAppointments(): void;
    private yearViewEvents;
    private timelineYearViewEvents;
    private updateSpannedEvents;
    private timelineResourceEvents;
    private renderResourceEvent;
    private renderEvent;
    private renderMoreIndicatior;
    private createEventElement;
    isSpannedEvent(eventObj: {
        [key: string]: Object;
    }, month: number): {
        [key: string]: Object;
    };
    getOverlapEvents(date: Date, appointments: {
        [key: string]: Object;
    }[]): Object[];
    private removeCellHeight;
}
