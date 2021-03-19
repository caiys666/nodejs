const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')

// 引入模板实例
const Profile = require('../../modules/Profile')

/**
 * @route GET api/profile/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.get('/test', async (ctx) => {
  ctx.status = 200
  ctx.body = { msg: 'profile works....' }
})

/**
 * @route GET api/profile
 * @desc 个人信息接口地址
 * @access 接口是私有的
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (ctx) => {
    console.log(ctx.state.user)
    const profile = await Profile.find({
      user: ctx.state.user.id,
    }).populate('user', ['name', 'avatar'])
    console.log(profile)
    if (profile.length > 0) {
      ctx.status = 200
      ctx.body = profile
    } else {
      ctx.status = 404
      ctx.body = { noprofile: '该用户没有任何相关的个人信息！' }
      return
    }
  }
)

module.exports = router.routes()
