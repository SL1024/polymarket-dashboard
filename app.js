// 数据存储类
class DataStore {
    constructor() {
        this.storageKey = 'polymarket_addresses';
        this.data = this.loadData();
    }

    loadData() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    addAddresses(addresses) {
        addresses.forEach(addr => {
            if (!this.data.find(item => item.address.toLowerCase() === addr.toLowerCase())) {
                this.data.push({
                    address: addr,
                    username: '',
                    note: '',
                    txCount: 0,
                    totalVolume: 0,
                    pnl: 0,
                    balance: 0,
                    categories: 0,
                    dayActive: 0,
                    weekActive: 0,
                    monthActive: 0,
                    lastTx: null,
                    lastTxDays: '-',
                    loading: false
                });
            }
        });
        this.saveData();
    }

    deleteAddresses(addresses) {
        this.data = this.data.filter(item => 
            !addresses.some(addr => addr.toLowerCase() === item.address.toLowerCase())
        );
        this.saveData();
    }

    updateAddress(address, data) {
        const index = this.data.findIndex(item => 
            item.address.toLowerCase() === address.toLowerCase()
        );
        if (index !== -1) {
            this.data[index] = { ...this.data[index], ...data };
            this.saveData();
        }
    }

    getData() {
        return this.data;
    }
}

// Polymarket API 客户端
class PolymarketAPI {
    constructor() {
        this.dataAPI = 'https://data-api.polymarket.com';
        this.gammaAPI = 'https://gamma-api.polymarket.com';
    }

    async fetchUserData(address) {
        try {
            const trades = await this.fetchTrades(address);
            const balance = await this.fetchBalance(address);
            const markets = await this.fetchUserMarkets(address);
            
            return this.calculateStats(trades, balance, markets);
        } catch (error) {
            console.error('获取数据失败:', error);
            throw error;
        }
    }

    async fetchTrades(address) {
        try {
            const response = await fetch(`${this.dataAPI}/trades?user=${address.toLowerCase()}`);
            if (!response.ok) {
                console.warn('获取交易数据失败');
                return [];
            }
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('fetchTrades error:', error);
            return [];
        }
    }

    async fetchBalance(address) {
        try {
            const response = await fetch(`${this.dataAPI}/value?user=${address.toLowerCase()}`);
            if (!response.ok) {
                return { value: 0 };
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('fetchBalance error:', error);
            return { value: 0 };
        }
    }

    async fetchUserMarkets(address) {
        try {
            const response = await fetch(`${this.dataAPI}/markets?user=${address.toLowerCase()}`);
            if (!response.ok) {
                return [];
            }
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('fetchUserMarkets error:', error);
            return [];
        }
    }

    calculateStats(trades, balance, markets) {
        const now = new Date();
        const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        let totalVolume = 0;
        let pnl = 0;
        let dayActive = 0;
        let weekActive = 0;
        let monthActive = 0;
        let lastTxDate = null;
        const categories = new Set();

        trades.forEach(trade => {
            const timestamp = trade.timestamp || trade.created_at || trade.time;
            if (!timestamp) return;

            const tradeDate = new Date(timestamp);
            const amount = parseFloat(trade.size || trade.amount || 0);
            const price = parseFloat(trade.price || 0);
            totalVolume += amount * price;

            if (trade.pnl !== undefined) {
                pnl += parseFloat(trade.pnl);
            }

            if (trade.market_slug || trade.market) {
                const marketInfo = markets.find(m => 
                    m.slug === trade.market_slug || m.id === trade.market
                );
                if (marketInfo && marketInfo.category) {
                    categories.add(marketInfo.category);
                }
            }

            if (tradeDate > oneDayAgo) dayActive++;
            if (tradeDate > oneWeekAgo) weekActive++;
            if (tradeDate > oneMonthAgo) monthActive++;

            if (!lastTxDate || tradeDate > lastTxDate) {
                lastTxDate = tradeDate;
            }
        });

        markets.forEach(market => {
            if (market.category) {
                categories.add(market.category);
            }
        });

        const lastTxDays = lastTxDate 
            ? Math.floor((now - lastTxDate) / (24 * 60 * 60 * 1000))
            : '-';

        return {
            txCount: trades.length,
            totalVolume: totalVolume.toFixed(2),
            pnl: pnl.toFixed(2),
            balance: (balance.value || balance.total || 0).toFixed(2),
            categories: categories.size,
            dayActive,
            weekActive,
            monthActive,
            lastTx: lastTxDate,
            lastTxDays: lastTxDays === '-' ? '-' : `${lastTxDays}天`
        };
    }
}

// UI 控制器
class UIController {
    constructor(dataStore, api) {
        this.dataStore = dataStore;
        this.api = api;
        this.currentEditAddress = null;
        this.initElements();
        this.bindEvents();
        this.render();
    }

    initElements() {
        this.tableBody = document.getElementById('tableBody');
        this.selectAllCheckbox = document.getElementById('selectAll');
        this.addModal = document.getElementById('addModal');
        this.editModal = document.getElementById('editModal');
        this.editUsernameModal = document.getElementById('editUsernameModal');
        this.addressInput = document.getElementById('addressInput');
        this.editNoteInput = document.getElementById('editNoteInput');
        this.editUsernameInput = document.getElementById('editUsernameInput');
    }

    bindEvents() {
        // 全选
        this.selectAllCheckbox.addEventListener('change', (e) => {
            document.querySelectorAll('.row-checkbox').forEach(cb => {
                cb.checked = e.target.checked;
            });
        });

        // 添加地址
        document.getElementById('addAddressBtn').addEventListener('click', () => {
            this.addModal.classList.add('show');
        });

        // 关闭弹窗
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('show');
            });
        });

        // 取消按钮
        document.querySelectorAll('.btn-cancel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('show');
            });
        });

        // 确认添加
        document.getElementById('confirmAddBtn').addEventListener('click', () => {
            this.handleAddAddresses();
        });

        // 确认编辑
        document.getElementById('confirmEditBtn').addEventListener('click', () => {
            this.handleEditNote();
        });

        // 确认编辑用户名
        document.getElementById('confirmEditUsernameBtn').addEventListener('click', () => {
            this.handleEditUsername();
        });

        // 刷新选中
        document.getElementById('refreshSelectedBtn').addEventListener('click', () => {
            this.handleRefreshSelected();
        });

        // 删除选中
        document.getElementById('deleteSelectedBtn').addEventListener('click', () => {
            this.handleDeleteSelected();
        });

        // 导出数据
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.handleExport();
        });

        // 点击弹窗外部关闭
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });
    }

    handleAddAddresses() {
        const text = this.addressInput.value.trim();
        if (!text) return;

        const addresses = text.split('\n')
            .map(addr => addr.trim())
            .filter(addr => addr.length > 0 && addr.startsWith('0x'));

        if (addresses.length === 0) {
            alert('请输入有效的地址（以 0x 开头）');
            return;
        }

        this.dataStore.addAddresses(addresses);
        this.addressInput.value = '';
        this.addModal.classList.remove('show');
        this.render();

        // 自动刷新新添加的地址
        addresses.forEach(addr => this.refreshAddress(addr));
    }

    handleEditNote() {
        if (!this.currentEditAddress) return;
        
        const note = this.editNoteInput.value.trim();
        this.dataStore.updateAddress(this.currentEditAddress, { note });
        this.editModal.classList.remove('show');
        this.render();
    }

    handleEditUsername() {
        if (!this.currentEditAddress) return;
        
        const username = this.editUsernameInput.value.trim();
        this.dataStore.updateAddress(this.currentEditAddress, { username });
        this.editUsernameModal.classList.remove('show');
        this.render();
    }

    handleRefreshSelected() {
        const selected = this.getSelectedAddresses();
        if (selected.length === 0) {
            alert('请先选择要刷新的地址');
            return;
        }
        selected.forEach(addr => this.refreshAddress(addr));
    }

    handleDeleteSelected() {
        const selected = this.getSelectedAddresses();
        if (selected.length === 0) {
            alert('请先选择要删除的地址');
            return;
        }

        if (confirm(`确定要删除 ${selected.length} 个地址吗？`)) {
            this.dataStore.deleteAddresses(selected);
            this.render();
        }
    }

    handleExport() {
        const data = this.dataStore.getData();
        if (data.length === 0) {
            alert('没有数据可导出');
            return;
        }

        const csv = this.convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `polymarket_data_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }

    convertToCSV(data) {
        const headers = ['地址', '备注', '交易次数', '交易金额', '盈亏', '账户余额', '板块数', '天活跃', '周活跃', '月活跃', '最后交易'];
        const rows = data.map(item => [
            item.address,
            item.note || '',
            item.txCount,
            item.totalVolume,
            item.pnl,
            item.balance,
            item.categories,
            item.dayActive,
            item.weekActive,
            item.monthActive,
            item.lastTxDays
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    getSelectedAddresses() {
        const checkboxes = document.querySelectorAll('.row-checkbox:checked');
        return Array.from(checkboxes).map(cb => cb.dataset.address);
    }

    async refreshAddress(address) {
        this.dataStore.updateAddress(address, { loading: true });
        this.render();

        try {
            const data = await this.api.fetchUserData(address);
            this.dataStore.updateAddress(address, { ...data, loading: false });
        } catch (error) {
            this.dataStore.updateAddress(address, { 
                loading: false,
                error: error.message 
            });
        }

        this.render();
    }

    formatAddress(address) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    formatNumber(num) {
        if (num === '-' || num === 0) return '-';
        return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    getPnlClass(pnl) {
        const value = parseFloat(pnl);
        if (value > 0) return 'value-positive';
        if (value < 0) return 'value-negative';
        return 'value-neutral';
    }

    render() {
        const data = this.dataStore.getData();
        
        if (data.length === 0) {
            this.tableBody.innerHTML = `
                <tr>
                    <td colspan="16" class="empty-state">
                        <i class="fas fa-folder-open"></i>
                        <p>暂无数据</p>
                        <div class="empty-hint">点击下方"批量添加地址"按钮开始使用</div>
                    </td>
                </tr>
            `;
            return;
        }

        this.tableBody.innerHTML = data.map((item, index) => `
            <tr>
                <td>
                    <input type="checkbox" class="row-checkbox" data-address="${item.address}">
                </td>
                <td>${index + 1}</td>
                <td>
                    <button class="icon-btn edit" onclick="ui.showEditModal('${item.address}')" title="编辑备注">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
                <td style="text-align: left;">
                    <div class="address-cell">
                        <span class="address-text" onclick="ui.showEditUsernameModal('${item.address}')" style="cursor: pointer;" title="点击编辑用户名">
                            ${item.username || '未设置'}
                        </span>
                    </div>
                </td>
                <td style="text-align: left;">
                    <div class="address-cell">
                        <span class="address-text" title="${item.address}">
                            ${this.formatAddress(item.address)}
                        </span>
                        ${item.note ? `<span class="address-note">${item.note}</span>` : ''}
                    </div>
                </td>
                <td>${item.loading ? '<span class="loading-spinner"></span>' : item.txCount}</td>
                <td>-</td>
                <td>${item.loading ? '-' : '$' + this.formatNumber(item.totalVolume)}</td>
                <td class="${this.getPnlClass(item.pnl)}">
                    ${item.loading ? '-' : (parseFloat(item.pnl) >= 0 ? '+' : '') + '$' + this.formatNumber(item.pnl)}
                </td>
                <td>${item.loading ? '-' : (item.balance && item.balance !== '0.00' ? '$' + this.formatNumber(item.balance) : '-')}</td>
                <td>${item.loading ? '-' : item.categories}</td>
                <td>${item.loading ? '-' : item.dayActive}</td>
                <td>${item.loading ? '-' : item.weekActive}</td>
                <td>${item.loading ? '-' : item.monthActive}</td>
                <td>${item.loading ? '-' : item.lastTxDays}</td>
                <td>
                    <div class="action-icons">
                        <button class="icon-btn search" onclick="window.open('https://polymarket.com/profile/${item.address}', '_blank')" title="查看详情">
                            <i class="fas fa-search"></i>
                        </button>
                        <button class="icon-btn refresh" onclick="ui.refreshAddress('${item.address}')" title="刷新">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.updateLastTxDays();
    }

    showEditModal(address) {
        this.currentEditAddress = address;
        const item = this.dataStore.getData().find(d => d.address === address);
        this.editNoteInput.value = item ? item.note : '';
        this.editModal.classList.add('show');
    }

    showEditUsernameModal(address) {
        this.currentEditAddress = address;
        const item = this.dataStore.getData().find(d => d.address === address);
        this.editUsernameInput.value = item ? item.username : '';
        this.editUsernameModal.classList.add('show');
    }

    updateLastTxDays() {
        const data = this.dataStore.getData();
        const now = new Date();
        
        data.forEach(item => {
            if (item.lastTx) {
                const lastTxDate = new Date(item.lastTx);
                const days = Math.floor((now - lastTxDate) / (24 * 60 * 60 * 1000));
                this.dataStore.updateAddress(item.address, {
                    lastTxDays: `${days}天`
                });
            }
        });
    }
}

// 初始化应用
const dataStore = new DataStore();
const api = new PolymarketAPI();
const ui = new UIController(dataStore, api);

// 每天更新一次最后交易天数
setInterval(() => {
    ui.updateLastTxDays();
    ui.render();
}, 24 * 60 * 60 * 1000);
