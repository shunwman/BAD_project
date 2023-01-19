async function loadFooter(){
const userId = await loadUser()
console.log(userId)
let footerElem = document.querySelector('#footer')
if (footerElem) {
    let pagePath = window.location.pathname
    let activeTabIndex = pagePath.substring(
        pagePath.indexOf("page") + 4,
        pagePath.lastIndexOf(".html")
    );
if(userId === null){
    footerElem.innerHTML = `
<footer>

<a href="index.html" class="footer-control"><img src="../img/homepage-Icon.png" class="footer-img"></a>
<a href="scan.html" class="footer-control"><img src="../img/scan-icon2.png" class="footer-img"></a>
<a href="gallery.html" class="footer-control"><img src="../img/gallery-icon.png" class="footer-img"></a>
<a href="login.html" class="footer-control"><img src="../img/login-icon.png" class="footer-img"></a>


</footer>
`
}

if(userId){
    footerElem.innerHTML = `
<footer>

<a href="index.html" class="footer-control"><img src="../img/homepage-Icon.png" class="footer-img"></a>
<a href="scan.html" class="footer-control"><img src="../img/scan-icon2.png" class="footer-img"></a>
<a href="#" class="footer-control"><img src="../img/user.jpg" class="footer-img"></a>
<a href="gallery.html" class="footer-control"><img src="../img/gallery-icon.png" class="footer-img"></a>
<a href="index.html" class="footer-control logout-btn"><img src="../img/login-icon.png" class="footer-img"></a>


</footer>
`
const logoutFormElement = document.querySelector('.logout-btn')
logoutFormElement.addEventListener('click', async (event) => {
    let res = await fetch('/user/logout')
})
}
    let footerButtonElems = document.querySelectorAll('a.footer-control')
    console.log('footerButtonElems = ', footerButtonElems)
    if (footerButtonElems[activeTabIndex - 1]) {
        footerButtonElems[activeTabIndex - 1].classList.add('active')

    }

}

}

loadFooter();