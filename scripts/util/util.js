export function getDecodedPageName() {
    if(window.location.pathname === "/") return "トップページ";

    const pageName = window.location.pathname.match(/(?<=\/wiki\/).*/);
    if(!pageName) return;
    return decodeURIComponent(pageName[0]);
}