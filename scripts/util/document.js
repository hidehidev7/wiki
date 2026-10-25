export function getDecodedPageName() {
    const titleElm = document.querySelector("h1");
    return titleElm && titleElm.textContent;
}