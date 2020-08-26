const gioId = process.env.GIO_ID;
/* eslint-disable */
export default ({app}) => {
  /*
   ** Only run on client-side and only in production mode
   */
  /*
    ** Include Google Analytics Script
    */
  if (process.env.NODE_ENV !== 'production')return;
    !function (e, t, n, g, i) {
      let tag;
      e[i] = e[i] || function () {
        (e[i].q = e[i].q || []).push(arguments)
      }, n = t.createElement("script"), tag = t.getElementsByTagName("script")[0], n.async = 1, n.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + g, tag.parentNode.insertBefore(n, tag)
    }(window, document, "script", "assets.giocdn.com/2.1/gio.js", "gio");
    gio('init', gioId, {});

  /*
   ** Every time the route changes (fired on initialization too)
   */
  app.router.afterEach((to, from) => {
    gio('send');
  })
}
