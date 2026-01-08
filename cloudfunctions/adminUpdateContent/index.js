const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

function nowIso() {
  return new Date().toISOString()
}

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

function parseValue(value) {
  if (value === undefined || value === null) return {}
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch (error) {
    return { raw: value }
  }
}

exports.main = async (event) => {
  const admin = await requireAdmin(event.adminToken)
  if (!event.key) {
    throw new Error('Missing content key')
  }
  const dataValue = parseValue(event.value)
  const updatedAt = nowIso()
  const contentRef = db.collection('content').doc(event.key)
  const existing = await contentRef.get().catch(() => null)
  const auditLogs = ((existing && existing.data && existing.data.auditLogs) || []).concat({
    action: 'ADMIN_UPDATE_CONTENT',
    at: updatedAt,
    by: admin.username
  })

  await contentRef.set({
    data: {
      ...dataValue,
      updatedAt,
      updatedBy: admin.username,
      auditLogs
    }
  })

  return { success: true }
}
