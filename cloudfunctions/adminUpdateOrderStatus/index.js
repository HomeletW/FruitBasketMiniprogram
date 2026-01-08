const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const ALLOWED_TRANSITIONS = {
  CREATED: ['PAID', 'CANCELED'],
  PAID: ['FULFILLING', 'CANCELED'],
  FULFILLING: ['COMPLETED'],
  COMPLETED: ['REFUNDED'],
  CANCELED: [],
  REFUNDED: []
}

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

async function getSubscribeTemplates() {
  const doc = await db.collection('content').doc('subscribe_templates').get().catch(() => null)
  return (doc && doc.data) || {}
}

async function logNotify(payload) {
  return db.collection('notify_logs').add({
    data: {
      ...payload,
      createdAt: nowIso()
    }
  })
}

async function sendSubscribeMessage({ openid, templateId, page, data, type }) {
  if (!templateId) {
    return logNotify({
      type,
      status: 'SKIPPED',
      reason: 'missing_template',
      openid
    })
  }
  try {
    await cloud.openapi.subscribeMessage.send({
      touser: openid,
      templateId,
      page,
      data
    })
    return logNotify({ type, status: 'SENT', templateId, openid })
  } catch (error) {
    return logNotify({
      type,
      status: 'FAILED',
      templateId,
      openid,
      error: error.message || String(error)
    })
  }
}

exports.main = async (event) => {
  const admin = await requireAdmin(event.adminToken)
  if (!event.id || !event.status) {
    throw new Error('Missing order update data')
  }
  const orderRef = db.collection('orders').doc(event.id)

  const updatedOrder = await db.runTransaction(async (transaction) => {
    const orderDoc = await transaction.get(orderRef)
    if (!orderDoc.data) {
      throw new Error('Order not found')
    }
    const order = orderDoc.data
    const allowed = ALLOWED_TRANSITIONS[order.status] || []
    if (!allowed.includes(event.status)) {
      throw new Error(`Invalid transition from ${order.status} to ${event.status}`)
    }
    const updatedAt = nowIso()
    const statusHistory = (order.statusHistory || []).concat({
      status: event.status,
      at: updatedAt,
      by: admin.username
    })
    const auditLogs = (order.auditLogs || []).concat({
      action: 'ADMIN_UPDATE_STATUS',
      at: updatedAt,
      by: admin.username,
      meta: { from: order.status, to: event.status }
    })
    await transaction.update(orderRef, {
      status: event.status,
      statusHistory,
      auditLogs,
      updatedAt
    })
    return { ...order, status: event.status, statusHistory, auditLogs }
  })

  const templates = await getSubscribeTemplates()
  await sendSubscribeMessage({
    openid: updatedOrder.openid,
    templateId: templates.orderStatus,
    type: 'order_status',
    page: `pages/order-detail/index?id=${updatedOrder._id || event.id}`,
    data: {
      thing1: { value: updatedOrder.basketName.slice(0, 20) },
      thing2: { value: event.status }
    }
  })

  return { success: true }
}
