export function getDecodedPageName() {
    const titleElm = document.querySelector(".page_title>h1");
    return titleElm && titleElm.textContent;
}