const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

async function requireAdmin(token) {
  if (!token) {
    throw new Error('Missing admin token')
  }
  const res = await db.collection('admins').where({ token }).get()
  const admin = res.data[0]
  if (!admin || (admin.tokenExpiresAt && admin.tokenExpiresAt < new Date().toISOString())) {
    throw new Error('Invalid admin token')
  }
  return admin
}

exports.main = async (event) => {
  await requireAdmin(event.adminToken)
  const res = await db.collection('orders').orderBy('createdAt', 'desc').get()
  return { data: res.data }
}
