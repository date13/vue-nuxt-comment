const Koa = require('koa')
// const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const logger = require('koa-logger');
const app = new Koa()
const sslify = require('koa-sslify').default;
const https = require('https');
const fs = require('fs');
// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')

/*const type =
  process.env.NODE_ENV_APP === 'stage' ? 'stage' : process.env.NODE_ENV
process.env.innertApiHost = env[type].innertApiHost*/
// config.dev = app.env === 'dev'
async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)
  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 8080
  } = nuxt.options.server


  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })
  let options = {};
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
    options = {
      key: fs.readFileSync('./keys/server.key', 'utf8'),  //ssl文件路径
      cert: fs.readFileSync('./keys/server.cert', 'utf8')  //ssl文件路径
    };
    app.use(sslify())
    app.use(logger())
    https.createServer(options, app.callback()).listen(port, () => {
      console.log(`server running success at ${port}`)
    });
  } else {
    await nuxt.ready();
    app.listen(port, host)
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true
    })
  }
}

start()
