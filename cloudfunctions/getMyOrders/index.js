const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const { OPENID } = cloud.getWXContext()
  const res = await db.collection('orders')
    .where({ openid: OPENID })
    .orderBy('createdAt', 'desc')
    .get()

  return { data: res.data }
}
