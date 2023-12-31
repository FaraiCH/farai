import { Animation, isNullOrUndefined } from '@syncfusion/ej2-base';
import { effect, getPathArc } from '../utils/helper';
import { lineCapRadius, completeAngle } from '../model/constant';
/**
 * Animation for progress bar
 */
var ProgressAnimation = /** @class */ (function () {
    function ProgressAnimation() {
    }
    /** Linear Animation */
    ProgressAnimation.prototype.doLinearAnimation = function (element, progress, delay, previousWidth, active) {
        var _this = this;
        var animation = new Animation({});
        var linearPath = element;
        var duration = (progress.isActive) ? 3000 : progress.animation.duration;
        var width = linearPath.getAttribute('width');
        var x = linearPath.getAttribute('x');
        var opacityValue = 0;
        var value = 0;
        var start = (!progress.enableRtl || (progress.cornerRadius === 'Round4px')) ? previousWidth : parseInt(x, 10);
        var end = (!progress.enableRtl || (progress.cornerRadius === 'Round4px')) ? parseInt(width, 10) - start :
            parseInt(width, 10) - previousWidth;
        var rtlX = parseInt(x, 10) - end;
        linearPath.style.visibility = 'hidden';
        animation.animate(linearPath, {
            duration: duration,
            delay: delay,
            progress: function (args) {
                progress.cancelResize = true;
                if (progress.enableRtl && !(progress.cornerRadius === 'Round4px')) {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        if (progress.isActive) {
                            value = _this.activeAnimate((args.timeStamp / args.duration), parseInt(x, 10), parseInt(width, 10), true);
                            opacityValue = effect(args.timeStamp, 0.5, 0.5, args.duration, true);
                            active.setAttribute('opacity', opacityValue.toString());
                            linearPath.setAttribute('x', value.toString());
                        }
                        else {
                            value = effect(args.timeStamp, start, end, args.duration, true);
                            linearPath.setAttribute('x', value.toString());
                        }
                    }
                }
                else {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        if (progress.isActive) {
                            value = _this.activeAnimate((args.timeStamp / args.duration), 0, parseInt(width, 10), false);
                            opacityValue = effect(args.timeStamp, 0.5, 0.5, args.duration, true);
                            active.setAttribute('opacity', opacityValue.toString());
                            linearPath.setAttribute('width', value.toString());
                        }
                        else {
                            value = effect(args.timeStamp, start, end, args.duration, false);
                            linearPath.setAttribute('width', value.toString());
                        }
                    }
                }
            },
            end: function (model) {
                progress.cancelResize = false;
                linearPath.style.visibility = '';
                if (progress.enableRtl && !(progress.cornerRadius === 'Round4px')) {
                    if (progress.isActive) {
                        linearPath.setAttribute('x', x.toString());
                        _this.doLinearAnimation(element, progress, delay, previousWidth, active);
                    }
                    else {
                        linearPath.setAttribute('x', rtlX.toString());
                    }
                }
                else {
                    linearPath.setAttribute('width', width);
                    if (progress.isActive) {
                        _this.doLinearAnimation(element, progress, delay, previousWidth, active);
                    }
                }
                progress.trigger('animationComplete', {
                    value: progress.value, trackColor: progress.trackColor,
                    progressColor: progress.progressColor
                });
            }
        });
    };
    /** Linear Indeterminate */
    ProgressAnimation.prototype.doLinearIndeterminate = function (element, progressWidth, thickness, progress, clipPath) {
        var _this = this;
        var animation = new Animation({});
        var linearPath = element;
        var x = linearPath.getAttribute('x');
        var width = linearPath.getAttribute('width');
        var value = 0;
        var start = (width) ? -(parseInt(width, 10)) : -progressWidth;
        var end = (progress.progressRect.x + progress.progressRect.width) + ((width) ? (parseInt(width, 10)) : progressWidth);
        var duration = (!progress.enableProgressSegments) ? 2500 : 3500;
        animation.animate(clipPath, {
            duration: duration,
            delay: 0,
            progress: function (args) {
                if (progress.enableRtl && !(progress.cornerRadius === 'Round4px')) {
                    value = effect(args.timeStamp, parseInt(x, 10) || progress.progressRect.x + progressWidth, end, args.duration, true);
                    if (!progress.enableProgressSegments) {
                        linearPath.setAttribute('x', value.toString());
                    }
                    else {
                        linearPath.setAttribute('d', progress.getPathLine(value, progressWidth, thickness));
                    }
                }
                else {
                    value = effect(args.timeStamp, start, end, args.duration, false);
                    if (!progress.enableProgressSegments) {
                        linearPath.setAttribute('x', value.toString());
                    }
                    else {
                        linearPath.setAttribute('d', progress.getPathLine(value, progressWidth, thickness));
                    }
                }
            },
            end: function () {
                if (progress.enableRtl && !progress.enableProgressSegments && !(progress.cornerRadius === 'Round4px')) {
                    linearPath.setAttribute('x', x.toString());
                }
                else if (!progress.enableProgressSegments) {
                    linearPath.setAttribute('x', start.toString());
                }
                if (!progress.destroyIndeterminate) {
                    _this.doLinearIndeterminate(element, progressWidth, thickness, progress, clipPath);
                }
            }
        });
    };
    /** Linear striped */
    ProgressAnimation.prototype.doStripedAnimation = function (element, progress, value, delay) {
        var _this = this;
        var animation = new Animation({});
        var point = 1000 / progress.animation.duration;
        animation.animate(element, {
            duration: progress.animation.duration,
            delay: progress.animation.delay,
            progress: function () {
                value += (progress.enableRtl) ? -point : point;
                element.setAttribute('gradientTransform', 'translate(' + value + ') rotate(-45)');
            },
            end: function () {
                if (!progress.destroyIndeterminate) {
                    _this.doStripedAnimation(element, progress, value, false);
                }
            }
        });
    };
    /** Circular animation */
    ProgressAnimation.prototype.doCircularAnimation = function (x, y, radius, progressEnd, totalEnd, element, progress, thickness, delay, startValue, previousTotal, active) {
        var _this = this;
        var animation = new Animation({});
        var circularPath = element;
        var start = progress.startAngle;
        var pathRadius = radius + (thickness / 2);
        var end = 0;
        var opacityValue = 0;
        var startPos;
        var endPos;
        var duration = (progress.isActive) ? 3000 : progress.animation.duration;
        start += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            ((progress.enableRtl) ? (lineCapRadius / 2) * thickness : -(lineCapRadius / 2) * thickness) : 0;
        totalEnd += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            (lineCapRadius / 2) * thickness : 0;
        progressEnd += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            ((progress.enableRtl) ? -(lineCapRadius / 2) * thickness : (lineCapRadius / 2) * thickness) : 0;
        startPos = (!isNullOrUndefined(startValue)) ? startValue : start;
        endPos = (!isNullOrUndefined(startValue)) ? totalEnd - previousTotal : totalEnd;
        circularPath.setAttribute('visibility', 'Hidden');
        animation.animate(circularPath, {
            duration: duration,
            delay: delay,
            progress: function (args) {
                progress.cancelResize = true;
                if (args.timeStamp >= args.delay) {
                    circularPath.setAttribute('visibility', 'visible');
                    if (progress.isActive) {
                        end = _this.activeAnimate((args.timeStamp / args.duration), startPos, endPos, progress.enableRtl);
                        opacityValue = effect(args.timeStamp, 0.5, 0.5, args.duration, true);
                        active.setAttribute('opacity', opacityValue.toString());
                        circularPath.setAttribute('d', getPathArc(x, y, pathRadius, start, end % 360, progress.enableRtl, true));
                    }
                    else {
                        end = effect(args.timeStamp, startPos, endPos, args.duration, progress.enableRtl);
                        circularPath.setAttribute('d', getPathArc(x, y, pathRadius, start, end % 360, progress.enableRtl, true));
                    }
                }
            },
            end: function (model) {
                progress.cancelResize = false;
                circularPath.setAttribute('visibility', '');
                circularPath.setAttribute('d', getPathArc(x, y, pathRadius, start, progressEnd, progress.enableRtl, true));
                if (progress.isActive) {
                    _this.doCircularAnimation(x, y, radius, progressEnd, totalEnd, element, progress, thickness, delay, startValue, previousTotal, active);
                }
                progress.trigger('animationComplete', {
                    value: progress.value, trackColor: progress.trackColor,
                    progressColor: progress.progressColor
                });
            }
        });
    };
    /** Circular indeterminate */
    ProgressAnimation.prototype.doCircularIndeterminate = function (circularProgress, progress, start, end, x, y, radius, thickness, clipPath) {
        var _this = this;
        var animation = new Animation({});
        var pathRadius = radius + ((!progress.enableProgressSegments) ? (thickness / 2) : 0);
        var value = (!progress.enableProgressSegments) ? 3 : 2;
        animation.animate(clipPath, {
            progress: function () {
                circularProgress.style.visibility = 'visible';
                start += (progress.enableRtl) ? -value : value;
                end += (progress.enableRtl) ? -value : value;
                circularProgress.setAttribute('d', getPathArc(x, y, pathRadius, start % 360, end % 360, progress.enableRtl, !progress.enableProgressSegments));
            },
            end: function (model) {
                if (!progress.destroyIndeterminate) {
                    _this.doCircularIndeterminate(circularProgress, progress, start, end, x, y, radius, thickness, clipPath);
                }
            }
        });
    };
    /** To do the label animation for progress bar */
    ProgressAnimation.prototype.doLabelAnimation = function (labelPath, start, end, progress, delay, textSize) {
        var animation = new Animation({});
        var label = new Animation({});
        var startPos;
        var endPos;
        var text = labelPath.innerHTML;
        var value = 0;
        var xPos = 0;
        var valueChanged = 0;
        var percentage = 100;
        var labelText = progress.labelStyle.text;
        var labelPos = progress.labelStyle.textAlignment;
        var posX = parseInt(labelPath.getAttribute('x'), 10);
        labelPath.setAttribute('visibility', 'Hidden');
        if (progress.type === 'Linear') {
            startPos = (progress.enableRtl) ? (progress.progressRect.x + progress.progressRect.width) + (textSize / 2) :
                progress.progressRect.x - (textSize / 2);
            startPos = (startPos <= 0) ? 0 : startPos;
            endPos = (progress.enableRtl) ? startPos - posX : posX - startPos;
        }
        animation.animate(labelPath, {
            duration: progress.animation.duration,
            delay: delay,
            progress: function (args) {
                progress.cancelResize = true;
                if (progress.type === 'Linear') {
                    if (args.timeStamp >= args.delay) {
                        if (labelText === '') {
                            labelPath.setAttribute('visibility', 'visible');
                            value = effect(args.timeStamp, start, end, args.duration, false);
                            valueChanged = parseInt(((value / progress.progressRect.width) * percentage).toString(), 10);
                            labelPath.innerHTML = valueChanged.toString() + '%';
                            if (labelPos === 'Far' || labelPos === 'Center') {
                                xPos = effect(args.timeStamp, startPos, endPos, args.duration, progress.enableRtl);
                                labelPath.setAttribute('x', xPos.toString());
                            }
                        }
                    }
                }
                else if (progress.type === 'Circular') {
                    if (labelText === '') {
                        labelPath.setAttribute('visibility', 'visible');
                        value = effect(args.timeStamp, start, end, args.duration, false);
                        valueChanged = parseInt((((value - start) / progress.totalAngle) * percentage).toString(), 10);
                        labelPath.innerHTML = valueChanged.toString() + '%';
                    }
                }
            },
            end: function () {
                progress.cancelResize = false;
                if (labelText === '') {
                    labelPath.innerHTML = text;
                    labelPath.setAttribute('x', posX.toString());
                }
                else {
                    label.animate(labelPath, {
                        progress: function (args) {
                            labelPath.setAttribute('visibility', 'visible');
                            value = effect(args.timeStamp, 0, 1, args.duration, false);
                            labelPath.setAttribute('opacity', value.toString());
                        },
                        end: function () {
                            labelPath.setAttribute('opacity', '1');
                        }
                    });
                }
            }
        });
    };
    /** To do the annotation animation for circular progress bar */
    ProgressAnimation.prototype.doAnnotationAnimation = function (circularPath, progress, previousEnd, previousTotal) {
        var animation = new Animation({});
        var value = 0;
        var percentage = 100;
        var isAnnotation = progress.annotations.length > 0;
        var annotatElementChanged;
        var firstAnnotatElement;
        var start = progress.startAngle;
        var totalAngle = progress.totalAngle;
        var totalEnd;
        var annotateValueChanged;
        var annotateValue;
        var startValue;
        var endValue;
        if (isAnnotation && progress.progressAnnotationModule) {
            firstAnnotatElement = document.getElementById(progress.element.id + 'Annotation0').children[0];
            if (firstAnnotatElement && firstAnnotatElement.children[0]) {
                if (firstAnnotatElement.children[0].tagName === 'SPAN') {
                    annotatElementChanged = firstAnnotatElement.children[0];
                }
            }
        }
        totalEnd = ((progress.argsData.value - progress.minimum) / (progress.maximum - progress.minimum)) * progress.totalAngle;
        progress.annotateTotal = totalEnd =
            (progress.argsData.value < progress.minimum || progress.argsData.value > progress.maximum) ? 0 : totalEnd;
        progress.annotateEnd = start + totalEnd;
        annotateValue = ((progress.argsData.value - progress.minimum) / (progress.maximum - progress.minimum)) * percentage;
        annotateValue = (progress.argsData.value < progress.minimum || progress.argsData.value > progress.maximum) ? 0 :
            Math.round(annotateValue);
        startValue = (!isNullOrUndefined(previousEnd)) ? previousEnd : start;
        endValue = (!isNullOrUndefined(previousEnd)) ? totalEnd - previousTotal : totalEnd;
        if (progress.argsData.value <= progress.minimum || progress.argsData.value > progress.maximum) {
            annotatElementChanged.innerHTML = annotateValue + '%';
        }
        else {
            animation.animate(circularPath, {
                duration: progress.animation.duration,
                delay: progress.animation.delay,
                progress: function (args) {
                    progress.cancelResize = true;
                    if (isAnnotation && annotatElementChanged) {
                        value = effect(args.timeStamp, startValue, endValue, args.duration, false);
                        annotateValueChanged = parseInt((((Math.round(value) - start) / totalAngle) * percentage).toString(), 10);
                        annotatElementChanged.innerHTML = annotateValueChanged ? annotateValueChanged.toString() + '%' : '0%';
                    }
                },
                end: function (model) {
                    progress.cancelResize = false;
                    annotatElementChanged.innerHTML = annotateValue + '%';
                }
            });
        }
    };
    ProgressAnimation.prototype.activeAnimate = function (t, start, end, enableRtl) {
        var time = 1 - Math.pow(1 - t, 3);
        var attrValue = start + ((!enableRtl) ? (time * end) : -(time * end));
        return attrValue;
    };
    return ProgressAnimation;
}());
export { ProgressAnimation };
