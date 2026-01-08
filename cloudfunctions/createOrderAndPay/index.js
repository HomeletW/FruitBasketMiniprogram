const cloud = require('wx-server-sdk')
const crypto = require('crypto')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

const DEFAULT_AMOUNT = 19900

function nowIso() {
  return new Date().toISOString()
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

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const createdAt = nowIso()
  const orderData = {
    basketName: event.basketName || 'Custom Basket',
    message: event.message || '',
    deliveryDate: event.deliveryDate || '',
    contactName: event.contactName || '',
    contactPhone: event.contactPhone || '',
    address: event.address || '',
    amount: typeof event.amount === 'number' ? event.amount : DEFAULT_AMOUNT,
    status: 'CREATED',
    statusHistory: [{ status: 'CREATED', at: createdAt, by: OPENID }],
    auditLogs: [{ action: 'CREATE_ORDER', at: createdAt, by: OPENID }],
    openid: OPENID,
    createdAt,
    updatedAt: createdAt
  }

  const orderRes = await db.collection('orders').add({ data: orderData })
  const orderId = orderRes._id

  const outTradeNo = crypto.randomBytes(12).toString('hex')
  let payment = null

  try {
    const paymentRes = await cloud.openapi.cloudPay.unifiedOrder({
      body: 'Fruit Basket',
      outTradeNo,
      totalFee: orderData.amount,
      spbillCreateIp: context.CLIENTIP || '127.0.0.1',
      subMchId: process.env.SUB_MCH_ID,
      functionName: 'createOrderAndPay',
      nonceStr: crypto.randomBytes(8).toString('hex')
    })

    payment = paymentRes.payment
    await db.collection('orders').doc(orderId).update({
      data: {
        payment: {
          ...paymentRes,
          outTradeNo
        },
        updatedAt: nowIso()
      }
    })
  } catch (error) {
    await db.collection('orders').doc(orderId).update({
      data: {
        paymentError: error.message || String(error),
        updatedAt: nowIso()
      }
    })
  }

  const templates = await getSubscribeTemplates()
  await sendSubscribeMessage({
    openid: OPENID,
    templateId: templates.orderCreated,
    type: 'order_created',
    page: `pages/order-detail/index?id=${orderId}`,
    data: {
      thing1: { value: orderData.basketName.slice(0, 20) },
      date2: { value: orderData.deliveryDate || 'TBD' }
    }
  })

  return {
    orderId,
    payment
  }
}
