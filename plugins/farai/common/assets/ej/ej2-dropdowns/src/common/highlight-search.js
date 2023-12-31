/**
 * Function helps to find which highlightSearch is to call based on your data.
 * @param  {HTMLElement} element - Specifies an li element.
 * @param  {string} query - Specifies the string to be highlighted.
 * @param  {boolean} ignoreCase - Specifies the ignoreCase option.
 * @param  {HightLightType} type - Specifies the type of highlight.
 */
export function highlightSearch(element, query, ignoreCase, type, isBlazor) {
    if (query === '') {
        return;
    }
    else {
        var ignoreRegex = ignoreCase ? 'gim' : 'gm';
        query = /^[a-zA-Z0-9- ]*$/.test(query) ? query : query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        var replaceQuery = type === 'StartsWith' ? '^(' + query + ')' : type === 'EndsWith' ? '(' + query + ')$' : '(' + query + ')';
        findTextNode(element, new RegExp(replaceQuery, ignoreRegex), isBlazor);
    }
}
function findTextNode(element, pattern, isBlazor) {
    for (var index = 0; element.childNodes && (index < element.childNodes.length); index++) {
        if (element.childNodes[index].nodeType === 3 && element.childNodes[index].textContent.trim() !== '') {
            element = (isBlazor && element.classList.contains('e-highlight')) ? element.parentElement : element;
            if (isBlazor && element.getAttribute('data-value')) {
                element.innerHTML = element.getAttribute('data-value').replace(pattern, '<span class="e-highlight">$1</span>');
            }
            else {
                element.innerHTML = (element.innerHTML).trim().replace(pattern, '<span class="e-highlight">$1</span>');
            }
            break;
        }
        else {
            findTextNode(element.childNodes[index], pattern, isBlazor);
        }
    }
}
/**
 * Function helps to remove highlighted element based on your data.
 * @param  {HTMLElement} content - Specifies an content element.
 */
export function revertHighlightSearch(content) {
    var contentElement = content.querySelectorAll('.e-highlight');
    for (var i = contentElement.length - 1; i >= 0; i--) {
        var parent_1 = contentElement[i].parentNode;
        var text = document.createTextNode(contentElement[i].textContent);
        parent_1.replaceChild(text, contentElement[i]);
    }
}
