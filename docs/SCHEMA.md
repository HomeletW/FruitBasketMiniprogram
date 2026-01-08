# 数据库结构

## 集合

### `orders`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `_id` | string | 自动生成的文档 ID。 |
| `openid` | string | 微信用户 openid。 |
| `basketName` | string | 礼盒展示名称。 |
| `message` | string | 祝福卡片内容。 |
| `deliveryDate` | string | ISO 日期字符串。 |
| `contactName` | string | 收件人姓名。 |
| `contactPhone` | string | 收件人电话。 |
| `address` | string | 配送地址。 |
| `amount` | number | 金额（分）。 |
| `status` | string | 订单状态（见生命周期）。 |
| `statusHistory` | array | 状态流转记录。 |
| `auditLogs` | array | 用户/管理员操作审计。 |
| `payment` | object | 云支付返回内容。 |
| `paymentError` | string | 支付错误信息（如有）。 |
| `createdAt` | string | ISO 时间戳。 |
| `updatedAt` | string | ISO 时间戳。 |

**索引**
- `openid` + `createdAt` 复合索引（用于 `getMyOrders`）。
- `createdAt` 单字段索引（用于管理后台列表）。

**权限规则**
- 用户：仅可读取/更新自己的订单（通过 `openid`）。
- 管理员：可读取/更新所有订单。

### `admins`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `username` | string | 管理员账号。 |
| `passwordHash` | string | SHA-256 哈希。 |
| `salt` | string | 密码盐值。 |
| `token` | string | 当前管理员 token。 |
| `tokenExpiresAt` | string | ISO 时间戳。 |
| `auditLogs` | array | 登录审计记录。 |
| `lastLoginAt` | string | ISO 时间戳。 |

**索引**
- `username` 唯一索引。
- `token` 索引。

**权限规则**
- 仅管理员可访问；禁止客户端直接读取（通过云函数操作）。

### `content`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `_id` | string | 内容 key（如 `landing`, `subscribe_templates`）。 |
| `sections` | array | 首页亮点文案。 |
| `updatedAt` | string | ISO 时间戳。 |
| `updatedBy` | string | 管理员账号。 |
| `auditLogs` | array | 内容更新记录。 |

**索引**
- `_id` 索引用于快速查询。

**权限规则**
- 读取：公开。
- 写入：仅管理员。

### `notify_logs` (optional)

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | string | 通知类型（order_created, order_status）。 |
| `status` | string | SENT / FAILED / SKIPPED。 |
| `templateId` | string | 模板 ID。 |
| `openid` | string | 接收方 openid。 |
| `error` | string | 错误信息（如有）。 |
| `createdAt` | string | ISO 时间戳。 |

**索引**
- `createdAt` 索引用于审计。

**权限规则**
- 仅管理员可访问。

## 订单生命周期状态机

```
CREATED -> PAID -> FULFILLING -> COMPLETED
CREATED -> CANCELED
PAID -> CANCELED
COMPLETED -> REFUNDED
```

- 用户仅可在 `CREATED` 与 `PAID` 阶段取消订单。
- 管理员可通过 `adminUpdateOrderStatus` 进行状态流转。

## 审计日志

- `orders.auditLogs` 记录用户/管理员操作。
- `orders.statusHistory` 记录每次状态流转的时间与操作人。
- `content.auditLogs` 记录内容更新历史。
