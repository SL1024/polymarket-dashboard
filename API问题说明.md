# API 数据获取问题说明

## 当前状态

根据您的反馈，以下数据没有正确显示：

### 1. 账户余额（balance）
**问题**：账户余额显示为 0 或 -

**可能原因**：
- Polymarket Data API 的 `/value` 端点可能返回空数据
- 该端点可能需要认证或特殊参数
- API 结构可能已变更

**需要的信息**：
1. 您能否提供一个有余额的测试地址？
2. 您是否有 Polymarket 的 API Key？
3. 是否有官方文档链接说明如何获取账户余额？

**测试方法**：
打开浏览器开发者工具（F12），查看 Network 标签，找到对 `data-api.polymarket.com/value` 的请求，查看返回的数据结构。

---

### 2. 天/周/月活跃度（dayActive, weekActive, monthActive）
**问题**：显示为 0

**可能原因**：
- 交易数据中的时间戳字段名称不正确
- API 返回的交易数据没有时间信息
- 时间格式解析错误

**需要的信息**：
1. 您能否提供一个最近有交易的测试地址？
2. 交易数据中时间字段的实际名称是什么？（timestamp? created_at? time?）

**当前代码逻辑**：
```javascript
// 尝试从多个可能的字段获取时间
const timestamp = trade.timestamp || trade.created_at || trade.time;
const tradeDate = new Date(timestamp);

// 计算活跃度
if (tradeDate > oneDayAgo) dayActive++;
if (tradeDate > oneWeekAgo) weekActive++;
if (tradeDate > oneMonthAgo) monthActive++;
```

---

### 3. 最后交易时间（lastTxDays）
**问题**：显示为 - 或不准确

**依赖关系**：
- 这个数据依赖于交易历史中的时间戳
- 如果交易数据没有时间信息，就无法计算

**需要的信息**：
1. 与上面第2点相同，需要确认时间字段名称
2. 时间格式是什么？（ISO 8601? Unix timestamp?）

---

## 建议的解决方案

### 方案 1：使用 Polymarket 官方 API
如果您有 Polymarket 账号，可以：
1. 访问 https://polymarket.com
2. 查看开发者文档
3. 申请 API Key
4. 使用认证的 API 获取完整数据

### 方案 2：使用区块链浏览器 API
Polymarket 基于 Polygon 网络，可以使用：
- **Polygonscan API**: https://polygonscan.com/apis
- 可以获取钱包余额、交易历史等

需要：
1. 注册 Polygonscan 账号
2. 获取免费 API Key
3. 修改代码使用 Polygonscan API

### 方案 3：使用 The Graph
Polymarket 可能有 The Graph 子图：
- 可以通过 GraphQL 查询数据
- 更可靠和完整的数据

需要：
1. 找到 Polymarket 的 The Graph 端点
2. 编写 GraphQL 查询

---

## 测试步骤

### 步骤 1：验证 API 端点
请在浏览器中直接访问以下 URL（替换 YOUR_ADDRESS）：

```
https://data-api.polymarket.com/trades?user=YOUR_ADDRESS
https://data-api.polymarket.com/value?user=YOUR_ADDRESS
https://data-api.polymarket.com/markets?user=YOUR_ADDRESS
```

查看返回的 JSON 数据结构。

### 步骤 2：提供测试地址
请提供一个您知道有以下数据的地址：
- ✅ 有交易记录
- ✅ 有账户余额
- ✅ 最近有活跃交易

### 步骤 3：查看实际返回数据
1. 打开网站
2. 添加测试地址
3. 按 F12 打开开发者工具
4. 切换到 Network 标签
5. 点击刷新按钮
6. 查看 API 请求的响应数据
7. 截图或复制 JSON 数据发给我

---

## 需要您提供的信息

请提供以下任意信息以帮助解决问题：

1. **测试地址**：一个有数据的 Polymarket 地址
2. **API 响应示例**：实际 API 返回的 JSON 数据
3. **API 文档**：如果有官方文档链接
4. **API Key**：如果需要认证
5. **错误信息**：浏览器控制台的错误信息截图

---

## 临时解决方案

在找到正确的 API 之前，您可以：
1. 手动在"用户名"列填写余额信息
2. 使用"编辑"功能添加备注
3. 通过"查看详情"按钮跳转到 Polymarket 官网查看完整数据

---

## 联系方式

请将以上信息通过以下方式提供：
- 直接在对话中粘贴 JSON 数据
- 提供 API 文档链接
- 截图浏览器开发者工具的 Network 标签

我会根据您提供的信息修改代码，确保数据正确显示。
