# 部署指南

## 前置条件

- 已安装微信开发者工具。
- 已创建小程序对应的 CloudBase 环境。
- 已准备好云支付配置（子商户号 sub-mch-id）。

## 部署步骤

1. 使用微信开发者工具打开项目目录。
2. 在 IDE 中选择并配置 CloudBase 环境。
3. 部署云函数：
   - 在 `cloudfunctions/` 目录下逐个右键函数，选择 **部署并安装依赖**。
4. 按照 `docs/SCHEMA.md` 创建 CloudBase 数据库集合与索引。
5. 插入初始数据：
   - `content/landing` 写入 `sections` 数组。
   - `content/subscribe_templates` 写入模板 ID。
6. 配置云支付 `SUB_MCH_ID`，并确保开启 `cloud.openapi.cloudPay.unifiedOrder`。

## 环境变量

- `SUB_MCH_ID`：云支付子商户号。

## 冒烟测试

- 打开小程序。
- 提交订单并确认 `orders` 集合中出现记录。
- 管理员登录后将状态更新为 `FULFILLING`。
