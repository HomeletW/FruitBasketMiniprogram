# 内容更新指南

## 首页亮点文案

通过管理面板或 CloudBase 控制台更新 `content/landing` 文档。

示例数据：

```json
{
  "sections": ["当季鲜果", "手工礼篮", "当日配送"]
}
```

## 订阅消息模板

在 `content/subscribe_templates` 中添加模板 ID：

```json
{
  "orderCreated": "TEMPLATE_ID_1",
  "orderStatus": "TEMPLATE_ID_2"
}
```

`createOrderAndPay` 与 `adminUpdateOrderStatus` 会读取这些模板 ID 发送通知。
