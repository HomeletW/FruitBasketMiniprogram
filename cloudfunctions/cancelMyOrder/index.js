const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

function nowIso() {
  return new Date().toISOString()
}

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  if (!event.id) {
    throw new Error('Missing order id')
  }
  const orderRef = db.collection('orders').doc(event.id)

  return db.runTransaction(async (transaction) => {
    const orderDoc = await transaction.get(orderRef)
    if (!orderDoc.data || orderDoc.data.openid !== OPENID) {
      throw new Error('Order not found')
    }
    const order = orderDoc.data
    if (!['CREATED', 'PAID'].includes(order.status)) {
      throw new Error('Order cannot be canceled')
    }
    const updatedAt = nowIso()
    const statusHistory = (order.statusHistory || []).concat({
      status: 'CANCELED',
      at: updatedAt,
      by: OPENID
    })
    const auditLogs = (order.auditLogs || []).concat({
      action: 'CANCEL_ORDER',
      at: updatedAt,
      by: OPENID
    })
    await transaction.update(orderRef, {
      status: 'CANCELED',
      statusHistory,
      auditLogs,
      updatedAt
    })
    return { success: true }
  })
}
