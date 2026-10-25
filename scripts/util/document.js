export function getDecodedPageName() {
    const titleElm = document.querySelector(".user_title>h1");
    return titleElm && titleElm.textContent;
}