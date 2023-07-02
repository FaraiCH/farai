import { ProgressBar } from '../progressbar';
import { ProgressAnnotationSettings } from '../model/progress-base';
import { ProgressLocation } from '../utils/helper';
/**
 * Base file for annotation
 */
export declare class AnnotationBase {
    private control;
    private annotation;
    /**
     * Constructor for progress annotation
     * @param control
     */
    constructor(control: ProgressBar);
    render(annotation: ProgressAnnotationSettings, index: number): HTMLElement;
    /**
     * To process the annotation
     * @param annotation
     * @param index
     * @param parentElement
     */
    processAnnotation(annotation: ProgressAnnotationSettings, index: number, parentElement: HTMLElement): void;
    setElementStyle(location: ProgressLocation, element: HTMLElement, parentElement: HTMLElement): void;
    private Location;
}
