const Koa = require('koa')
const { Nuxt, Builder } = require('nuxt')
const logger = require('koa-logger');
const app = new Koa()
const sslify = require('koa-sslify').default;
const https = require('https');
const fs = require('fs');
// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')

config.dev = app.env !== 'production'
async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)
  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }
  let options = {
    key: fs.readFileSync('./keys/server.key', 'utf8'),  //ssl文件路径
    cert: fs.readFileSync('./keys/server.cert', 'utf8')  //ssl文件路径
  };
  app.use(sslify())
  app.use(logger())
  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })
  
  https.createServer(options, app.callback()).listen(port, () => {
    console.log(`server running success at ${port}`)
  });
}

start()
