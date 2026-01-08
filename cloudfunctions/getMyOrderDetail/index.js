const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  if (!event.id) {
    throw new Error('Missing order id')
  }
  const res = await db.collection('orders')
    .doc(event.id)
    .get()
  if (!res.data || res.data.openid !== OPENID) {
    throw new Error('Order not found')
  }
  return { data: res.data }
}
