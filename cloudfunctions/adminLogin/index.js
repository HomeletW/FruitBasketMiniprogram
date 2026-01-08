const cloud = require('wx-server-sdk')
const crypto = require('crypto')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

function nowIso() {
  return new Date().toISOString()
}

function hashPassword(password, salt) {
  return crypto.createHash('sha256').update(`${password}:${salt}`).digest('hex')
}

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  if (!event.username || !event.password) {
    throw new Error('Missing credentials')
  }
  const adminRes = await db.collection('admins').where({ username: event.username }).get()
  const admin = adminRes.data[0]
  if (!admin) {
    throw new Error('Invalid credentials')
  }
  const salt = admin.salt || ''
  const hashed = hashPassword(event.password, salt)
  if (hashed !== admin.passwordHash) {
    throw new Error('Invalid credentials')
  }
  const token = crypto.randomBytes(16).toString('hex')
  const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
  const auditLogs = (admin.auditLogs || []).concat({
    action: 'ADMIN_LOGIN',
    at: nowIso(),
    by: OPENID
  })
  await db.collection('admins').doc(admin._id).update({
    data: {
      token,
      tokenExpiresAt,
      lastLoginAt: nowIso(),
      auditLogs
    }
  })
  return { token }
}
