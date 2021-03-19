const koa = require('koa')
const Router = require('koa-router')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')
// 引入passport
const passport = require('koa-passport')

// 实例化koa
const app = new koa()
const router = new Router()
app.use(bodyParser())

// 引入users.js
const users = require('./routes/api/users')
// 引入profile.js
const profile = require('./routes/api/profile')

// 路由
router.get('/', async (ctx) => {
  ctx.body = { msg: 'Hello koa interface' }
})

// config
const db = require('./config/keys').mongoURL

// 连接数据库
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDb Connected...')
  })
  .catch((err) => {
    console.log(err)
  })

app.use(passport.initialize())
app.use(passport.session())

// 回调到config文件中  passport.js
require('./config/passport')(passport)

// 配置路由地址localhost:5000/api/users
router.use('/api/users', users)
router.use('/api/profile', profile)

// 配置路由
app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`server started on ${port}`)
})
