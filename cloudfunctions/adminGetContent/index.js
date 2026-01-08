const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  if (!event.key) {
    throw new Error('Missing content key')
  }
  const res = await db.collection('content').doc(event.key).get().catch(() => null)
  return { data: res ? res.data : null }
}
