const Router = require('koa-router')
// 密码加密模块
const bcrypt = require('bcryptjs')
const tools = require('../../config/tools')
// 全球公认头像模块
const gravatar = require('gravatar')
const router = new Router()
// 引入jsonwebtoken
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
// 引入passport
const passport = require('koa-passport')
// 引入验证
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// 引入User模板
const User = require('../../modules/User')

/**
 * @route GET api/users/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
// router.get('/test', async (ctx) => {
//   ctx.status = 200
//   ctx.body = { msg: 'user works....' }
// })

/**
 * @route POST api/users/register
 * @desc 注册接口地址
 * @access 接口是公开的
 */
router.post('/register', async (ctx) => {
  // console.log(ctx.request.body)

  const { errors, isValid } = validateRegisterInput(ctx.request.body)

  // 判断是否验证通过
  if (!isValid) {
    ctx.status = 400
    ctx.body = errors
    return
  }
  // 存储到数据库里面
  const findResult = await User.find({ email: ctx.request.body.email })
  if (findResult.length > 0) {
    ctx.status = 500
    ctx.body = { email: '邮箱已经存在！' }
  } else {
    // 设置全球公认头像
    const avatar = gravatar.url(ctx.request.body.email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    })
    // 没查到
    const newUser = new User({
      name: ctx.request.body.name,
      email: ctx.request.body.email,
      avatar,
      password: tools.enbcrypt(ctx.request.body.password),
    })
    // console.log(newUser)
    //   存储到数据库
    await newUser
      .save()
      .then((user) => {
        ctx.body = user
      })
      .catch((err) => {
        console.log(err)
      })

    //   返回json数据
    ctx.body = newUser
  }
})

/**
 * @route POST api/users/login
 * @desc 登录接口地址  返回token
 * @access 接口是公开的
 */
router.post('/login', async (ctx) => {
  const { errors, isValid } = validateLoginInput(ctx.request.body)

  // 判断是否验证通过
  if (!isValid) {
    ctx.status = 400
    ctx.body = errors
    return
  }
  // 查询当前登录的邮箱是否存在
  const findResult = await User.find({ email: ctx.request.body.email })
  const user = findResult[0]
  const password = ctx.request.body.password
  if (findResult.length === 0) {
    ctx.status = 404
    ctx.body = { email: '用户不存在' }
  } else {
    // 查询到之后进行验证密码
    const result = await bcrypt.compareSync(password, user.password)

    // 验证通过
    if (result) {
      // 生成jwt token
      const payload = { id: user.id, name: user.name, avatar: user.avatar }
      const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 })
      ctx.status = 200
      ctx.body = { success: true, token: 'Bearer ' + token }
    } else {
      ctx.status = 400
      ctx.body = { password: '密码错误！' }
    }
  }
})

/**
 * @route GET api/users/current
 * @desc 用户信息接口地址  返回用户信息
 * @access 接口是私密的
 */
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  async (ctx) => {
    ctx.body = {
      id: ctx.state.user.id,
      name: ctx.state.user.name,
      email: ctx.state.user.email,
      avatar: ctx.state.user.avatar,
    }
  }
)

/**
 * @route GET api/users/getUser
 * @desc 查询用户接口地址  返回用户信息
 * @access 接口是公开的
 */
router.get('/getUser', async (ctx) => {
  const name = ctx.request.body.name
  if (name) {
    const findResult = await User.find({ name })
    // console.log(findResult)
    ctx.body = findResult
  }
})

module.exports = router.routes()
