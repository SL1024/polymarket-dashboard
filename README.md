# Polymarket 账户交易统计工具

一个用于统计和追踪 Polymarket 账户交易数据的网页工具。完全基于浏览器运行，无需后端服务器，数据存储在本地。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ 功能特性

- ✅ **交易次数统计** - 追踪每个地址的总交易数
- ✅ **交易金额汇总** - 计算总交易金额（美元）
- ✅ **盈亏计算** - 实时显示盈亏情况（绿色盈利/红色亏损）
- ✅ **账户余额显示** - 显示当前持仓价值
- ✅ **板块数量统计** - 统计参与的不同市场板块数量
- ✅ **活跃度分析** - 按天/周/月统计交易活跃度
- ✅ **最后交易时间** - 自动计算距今天数，每天更新
- ✅ **批量添加地址** - 一次添加多个地址
- ✅ **单个/批量刷新** - 灵活的数据刷新方式
- ✅ **删除地址功能** - 轻松管理地址列表
- ✅ **本地存储** - 数据保存在浏览器，无需服务器
- ✅ **响应式设计** - 支持桌面和移动设备

## 🚀 快速开始

### 在线使用

部署到 GitHub Pages 后，直接访问你的网站地址即可使用。

### 本地使用

1. 下载所有文件到本地
2. 双击打开 `index.html`
3. 开始使用！

## 📖 使用说明

### 1. 添加地址

1. 点击 **"批量添加地址"** 按钮
2. 在弹窗中输入 Polymarket 地址，每行一个
3. 点击 **"确认添加"**
4. 系统会自动获取并显示数据

**地址格式示例**：
```
0x1234567890123456789012345678901234567890
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
```

### 2. 刷新数据

- **单个刷新**：点击每行右侧的 "刷新" 按钮
- **批量刷新**：
  1. 勾选要刷新的地址
  2. 点击顶部 "刷新选中" 按钮

### 3. 删除地址

1. 勾选要删除的地址
2. 点击 **"删除选中"** 按钮
3. 在确认对话框中点击 "确定"

### 4. 查看数据

表格显示以下信息：

| 列名 | 说明 |
|------|------|
| 交易次数 | 该地址的总交易数量 |
| 交易金额 | 所有交易的总金额（美元） |
| 盈亏金额 | 总盈亏（正数为绿色，负数为红色） |
| 账户金额 | 当前持仓价值 |
| 板块数量 | 参与的不同市场板块数量 |
| 天活跃 | 最近24小时的交易次数 |
| 周活跃 | 最近7天的交易次数 |
| 月活跃 | 最近30天的交易次数 |
| 最后交易 | 距离最后一次交易的天数 |

## 🔧 技术栈

- **前端**：纯 HTML5 + CSS3 + JavaScript (ES6+)
- **存储**：localStorage（浏览器本地存储）
- **API**：Polymarket Data API（公开，无需认证）
- **部署**：GitHub Pages（免费静态网站托管）

## 📦 部署到 GitHub Pages

详细的部署教程请查看 [部署指南.md](./部署指南.md)

### 快速部署步骤

1. 创建 GitHub 仓库
2. 上传所有文件
3. 在 Settings > Pages 中启用 GitHub Pages
4. 选择 main 分支
5. 等待几分钟，访问你的网站！

## 🔌 API 说明

本项目使用 Polymarket 的公开 Data API，详细信息请查看 [API配置说明.md](./API配置说明.md)

### 使用的 API 端点

- **交易历史**：`https://data-api.polymarket.com/trades?user={address}`
- **持仓价值**：`https://data-api.polymarket.com/value?user={address}`
- **市场信息**：`https://data-api.polymarket.com/markets?user={address}`

### 特点

- ✅ 完全免费
- ✅ 无需 API Key
- ✅ 无需注册
- ✅ 支持跨域请求（CORS）

## 📁 项目结构

```
polymarket-tracker/
├── index.html          # 主页面
├── style.css           # 样式文件
├── app.js              # 核心逻辑
├── README.md           # 项目说明
├── API配置说明.md      # API 详细文档
├── 部署指南.md         # 部署教程
└── .gitignore          # Git 忽略文件
```

## 🔒 隐私与安全

- ✅ 所有数据存储在浏览器本地（localStorage）
- ✅ 不会上传到任何服务器
- ✅ 不收集任何个人信息
- ✅ 完全开源，代码透明
- ⚠️ 清除浏览器数据会导致记录丢失
- 💡 建议定期备份地址列表

## ⚠️ 注意事项

1. **数据存储**：数据保存在浏览器本地，清除浏览器数据会丢失
2. **API 限制**：避免频繁刷新，可能会被限流
3. **地址格式**：必须是有效的以太坊地址（0x开头，42个字符）
4. **数据延迟**：API 数据可能有几分钟延迟
5. **浏览器兼容**：建议使用现代浏览器（Chrome、Edge、Firefox、Safari）

## 🐛 常见问题

### 数据不显示？

1. 检查地址是否有效
2. 按 F12 打开开发者工具查看错误
3. 确认地址是否有交易记录
4. 检查网络连接

### 网站无法访问？

1. 确认 GitHub Pages 已启用
2. 等待 5-10 分钟让部署完成
3. 检查仓库是否设置为 Public
4. 清除浏览器缓存后重试

### 数据丢失了？

- 数据存储在浏览器本地
- 清除浏览器数据会导致丢失
- 建议定期截图或记录地址列表

## 🛠️ 开发

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/你的用户名/polymarket-tracker.git

# 进入目录
cd polymarket-tracker

# 使用任意 HTTP 服务器运行
# 方法1：使用 Python
python -m http.server 8000

# 方法2：使用 Node.js
npx http-server

# 访问 http://localhost:8000
```

### 修改代码

- `index.html` - 修改页面结构
- `style.css` - 修改样式
- `app.js` - 修改功能逻辑

### 调试

1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签的错误信息
3. 查看 Network 标签的 API 请求
4. 使用 Sources 标签设置断点调试

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Polymarket](https://polymarket.com) - 提供数据 API
- [GitHub Pages](https://pages.github.com) - 免费托管服务

## 📞 联系方式

如有问题或建议，欢迎：
- 提交 Issue
- 发起 Discussion
- 提交 Pull Request

---

⭐ 如果这个项目对你有帮助，请给个 Star！
