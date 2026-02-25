# Polymarket API 配置说明

## 📋 当前使用的 API 端点

本项目使用 Polymarket 的公开 Data API，无需认证即可访问：

### 1. Data API 基础地址
```
https://data-api.polymarket.com
```

### 2. 主要端点

#### 获取用户交易历史
```
GET https://data-api.polymarket.com/trades?user={address}
```
- 参数：`user` - 用户的以太坊地址（小写）
- 返回：用户的所有交易记录数组
- 包含信息：交易时间、交易金额、价格等

#### 获取用户持仓价值
```
GET https://data-api.polymarket.com/value?user={address}
```
- 参数：`user` - 用户的以太坊地址（小写）
- 返回：用户当前持仓总价值
- 字段：`value` - 持仓价值（美元）

#### 获取用户参与的市场
```
GET https://data-api.polymarket.com/markets?user={address}
```
- 参数：`user` - 用户的以太坊地址（小写）
- 返回：用户参与的所有市场信息
- 包含信息：市场分类、市场名称等

## 🔧 API 响应数据结构

### 交易数据 (Trades)
```json
[
  {
    "timestamp": "2026-02-20T10:30:00Z",
    "size": "100",
    "price": "0.65",
    "market": "market_id",
    "market_slug": "market-slug",
    "side": "BUY",
    "pnl": "15.50"
  }
]
```

### 持仓价值 (Value)
```json
{
  "user": "0x1234...",
  "value": 1234.56
}
```

### 市场数据 (Markets)
```json
[
  {
    "id": "market_id",
    "slug": "market-slug",
    "category": "Politics",
    "question": "市场问题"
  }
]
```

## 📊 数据统计说明

### 1. 交易次数 (txCount)
- 统计：用户所有交易记录的总数
- 来源：`trades` 数组的长度

### 2. 交易金额 (totalVolume)
- 计算：所有交易的 `size × price` 之和
- 单位：美元 ($)
- 格式：保留两位小数

### 3. 盈亏金额 (pnl)
- 计算：所有交易的 `pnl` 字段之和
- 单位：美元 ($)
- 显示：正数为绿色，负数为红色

### 4. 账户金额 (balance)
- 来源：`value` API 返回的持仓价值
- 单位：美元 ($)
- 说明：当前持仓的总价值

### 5. 板块数量 (categories)
- 统计：用户参与的不同市场分类数量
- 来源：从 `markets` 数据中提取 `category` 字段
- 去重：相同板块只计算一次

### 6. 活跃度统计
- **天活跃**：最近24小时内的交易次数
- **周活跃**：最近7天内的交易次数
- **月活跃**：最近30天内的交易次数

### 7. 最后交易时间
- 计算：当前日期 - 最后一次交易日期
- 显示：距今天数（例如：25天）
- 更新：每天自动重新计算

## 🚀 无需额外配置

✅ **好消息**：当前代码已经配置好所有必要的 API 端点，可以直接使用！

- ✅ 无需 API Key
- ✅ 无需注册账号
- ✅ 无需认证
- ✅ 完全免费使用

## ⚠️ 注意事项

### 1. API 限制
- Polymarket Data API 是公开的，但可能有请求频率限制
- 建议不要频繁刷新，避免被限流
- 如果遇到 429 错误，请稍后再试

### 2. CORS 跨域
- Data API 支持跨域请求（CORS）
- 可以直接从浏览器调用，无需代理

### 3. 地址格式
- 地址必须是有效的以太坊地址（0x开头，42个字符）
- API 会自动将地址转换为小写

### 4. 数据准确性
- 数据来自 Polymarket 官方 API
- 可能存在轻微延迟（通常几分钟内）
- 盈亏计算基于 API 返回的数据

## 🔍 调试方法

如果数据显示不正常，可以按以下步骤调试：

1. **打开浏览器开发者工具**
   - Windows: 按 F12
   - Mac: 按 Cmd + Option + I

2. **查看 Console 标签**
   - 查看是否有错误信息
   - 查看 API 请求是否成功

3. **查看 Network 标签**
   - 找到 `data-api.polymarket.com` 的请求
   - 查看请求状态码（应该是 200）
   - 查看返回的数据结构

4. **常见错误**
   - `404 Not Found`: 地址可能无效或没有交易记录
   - `429 Too Many Requests`: 请求过于频繁，稍后再试
   - `CORS Error`: 浏览器安全限制（通常不会出现）

## 📚 参考资源

- [Polymarket 官方文档](https://docs.polymarket.com)
- [Data API 说明](https://docs.polymarket.com/developers/data-api)
- [Polymarket 网站](https://polymarket.com)

## 💡 高级配置（可选）

如果你想使用其他 Polymarket API（如交易 API），需要：

1. 在 Polymarket 注册账号
2. 生成 API Key
3. 修改 `app.js` 中的 API 配置
4. 添加认证头信息

但对于本项目的统计功能，当前的公开 API 已经完全够用！
