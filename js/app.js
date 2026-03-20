// app.js - Основная логика приложения (Система учёта складских запасов)

class InventoryApp {
    constructor() {
        this.currentFilters = {
            category: 'all',
            search: ''
        };
        this.init();
    }

    async init() {
        await this.loadCategories();
        this.bindEvents();
        await this.loadData();
        await this.loadStatistics();
    }

    async loadCategories() {
        const categories = await api.getCategories();
        const select = document.getElementById('categoryFilter');
        if (select) {
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                select.appendChild(option);
            });
        }
    }

    bindEvents() {
        const addBtn = document.getElementById('showAddModalBtn');
        if (addBtn) addBtn.addEventListener('click', () => this.showModal());

        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.loadData();
            });
        }

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.loadData();
            });
        }

        const form = document.getElementById('itemForm');
        if (form) form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveItem();
        });

        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeModal());

        const closeBtn = document.querySelector('.close');
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());

        const closeDetailsBtn = document.querySelector('.close-details');
        if (closeDetailsBtn) closeDetailsBtn.addEventListener('click', () => this.closeDetailsModal());

        window.addEventListener('click', (e) => {
            const modal = document.getElementById('itemModal');
            const detailsModal = document.getElementById('detailsModal');
            if (e.target === modal) this.closeModal();
            if (e.target === detailsModal) this.closeDetailsModal();
        });
    }

    async loadData() {
        try {
            const items = await api.getItems(this.currentFilters);
            this.renderTable(items);
        } catch (error) {
            this.showError('Ошибка загрузки данных: ' + error.message);
        }
    }

    async loadStatistics() {
        try {
            const stats = await api.getStatistics();
            this.renderStatistics(stats);
        } catch (error) {
            console.error('Ошибка загрузки статистики:', error);
        }
    }

    renderTable(items) {
        const tbody = document.getElementById('inventoryTableBody');
        if (!tbody) return;
        
        if (items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:40px;"><i class="fas fa-box-open" style="font-size:48px;color:#ccc;"></i><p style="margin-top:10px;">Склад пуст</p></td></tr>';
            return;
        }
        
        tbody.innerHTML = items.map(item => `
            <tr>
                <td>${item.id}</td>
                <td><strong>${this.escapeHtml(item.name)}</strong></td>
                <td>${this.escapeHtml(item.category)}</td>
                <td class="${this.getQuantityClass(item.quantity, item.minQuantity)}">${item.quantity} ${this.getUnit(item.quantity)}</td>
                <td>${this.formatPrice(item.price)} ₽</td>
                <td>${this.formatPrice(item.quantity * item.price)} ₽</td>
                <td>${this.getStockStatusBadge(item.quantity, item.minQuantity)}</td>
                <td>
                    <button class="btn btn-info btn-small" onclick="app.viewItem(${item.id})"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-success btn-small" onclick="app.editItem(${item.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-small" onclick="app.deleteItem(${item.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    getQuantityClass(quantity, minQuantity) {
        if (quantity === 0) return 'status-out-of-stock';
        if (quantity <= minQuantity) return 'status-low-stock';
        return '';
    }

    getUnit(quantity) {
        return quantity === 1 ? 'шт' : 'шт';
    }

    getStockStatusBadge(quantity, minQuantity) {
        if (quantity === 0) {
            return '<span class="status-badge status-out-of-stock"><i class="fas fa-times-circle"></i> Нет в наличии</span>';
        } else if (quantity <= minQuantity) {
            return '<span class="status-badge status-low-stock"><i class="fas fa-exclamation-triangle"></i> Мало</span>';
        } else {
            return '<span class="status-badge status-in-stock"><i class="fas fa-check-circle"></i> В наличии</span>';
        }
    }

    renderStatistics(stats) {
        const container = document.getElementById('statsContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="stat-card">
                <h3><i class="fas fa-boxes"></i> Всего позиций</h3>
                <div class="stat-number">${stats.totalItems}</div>
            </div>
            <div class="stat-card">
                <h3><i class="fas fa-cubes"></i> Общее количество</h3>
                <div class="stat-number">${stats.totalQuantity}</div>
            </div>
            <div class="stat-card">
                <h3><i class="fas fa-ruble-sign"></i> Общая стоимость</h3>
                <div class="stat-number">${this.formatPrice(stats.totalValue)} ₽</div>
            </div>
            <div class="stat-card ${stats.lowStock > 0 ? 'warning' : ''}">
                <h3><i class="fas fa-exclamation-triangle"></i> Мало на складе</h3>
                <div class="stat-number">${stats.lowStock}</div>
            </div>
            <div class="stat-card ${stats.outOfStock > 0 ? 'warning' : ''}">
                <h3><i class="fas fa-ban"></i> Отсутствуют</h3>
                <div class="stat-number">${stats.outOfStock}</div>
            </div>
        `;
    }

    formatPrice(price) {
        return price.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showModal(item = null) {
        const modal = document.getElementById('itemModal');
        const modalTitle = document.getElementById('modalTitle');
        if (!modal) return;
        
        if (item) {
            modalTitle.textContent = 'Редактирование товара';
            document.getElementById('itemId').value = item.id;
            document.getElementById('itemName').value = item.name;
            document.getElementById('category').value = item.category;
            document.getElementById('quantity').value = item.quantity;
            document.getElementById('price').value = item.price;
            document.getElementById('minQuantity').value = item.minQuantity || 5;
            document.getElementById('location').value = item.location || '';
            document.getElementById('supplier').value = item.supplier || '';
        } else {
            modalTitle.textContent = 'Добавление товара';
            document.getElementById('itemForm').reset();
            document.getElementById('itemId').value = '';
            document.getElementById('minQuantity').value = 5;
        }
        modal.style.display = 'block';
    }

    async editItem(id) {
        try {
            const item = await api.getItemById(id);
            this.showModal(item);
        } catch (error) {
            this.showError('Ошибка загрузки товара: ' + error.message);
        }
    }

    closeModal() {
        const modal = document.getElementById('itemModal');
        if (modal) modal.style.display = 'none';
    }

    closeDetailsModal() {
        const modal = document.getElementById('detailsModal');
        if (modal) modal.style.display = 'none';
    }

    async saveItem() {
        const id = document.getElementById('itemId').value;
        const itemData = {
            name: document.getElementById('itemName').value,
            category: document.getElementById('category').value,
            quantity: parseInt(document.getElementById('quantity').value),
            price: parseFloat(document.getElementById('price').value),
            minQuantity: parseInt(document.getElementById('minQuantity').value),
            location: document.getElementById('location').value,
            supplier: document.getElementById('supplier').value
        };
        
        try {
            if (id) {
                await api.updateItem(parseInt(id), itemData);
                this.showSuccess('Товар успешно обновлён');
            } else {
                await api.createItem(itemData);
                this.showSuccess('Товар успешно добавлен');
            }
            
            this.closeModal();
            await this.loadData();
            await this.loadStatistics();
            await this.loadCategories();
        } catch (error) {
            this.showError('Ошибка сохранения: ' + error.message);
        }
    }

    async viewItem(id) {
        try {
            const item = await api.getItemById(id);
            this.showDetails(item);
        } catch (error) {
            this.showError('Ошибка: ' + error.message);
        }
    }

    showDetails(item) {
        const modal = document.getElementById('detailsModal');
        const content = document.getElementById('detailsContent');
        if (!modal || !content) return;
        
        const totalValue = item.quantity * item.price;
        
        content.innerHTML = `
            <div class="details-section">
                <div class="detail-row"><div class="detail-label">ID:</div><div class="detail-value">${item.id}</div></div>
                <div class="detail-row"><div class="detail-label">Наименование:</div><div class="detail-value">${this.escapeHtml(item.name)}</div></div>
                <div class="detail-row"><div class="detail-label">Категория:</div><div class="detail-value">${this.escapeHtml(item.category)}</div></div>
                <div class="detail-row"><div class="detail-label">Количество:</div><div class="detail-value">${item.quantity} шт</div></div>
                <div class="detail-row"><div class="detail-label">Цена за ед.:</div><div class="detail-value">${this.formatPrice(item.price)} ₽</div></div>
                <div class="detail-row"><div class="detail-label">Общая стоимость:</div><div class="detail-value">${this.formatPrice(totalValue)} ₽</div></div>
                <div class="detail-row"><div class="detail-label">Мин. остаток:</div><div class="detail-value">${item.minQuantity || 5} шт</div></div>
                <div class="detail-row"><div class="detail-label">Статус:</div><div class="detail-value">${this.getStockStatusBadge(item.quantity, item.minQuantity)}</div></div>
                <div class="detail-row"><div class="detail-label">Место хранения:</div><div class="detail-value">${this.escapeHtml(item.location) || 'Не указано'}</div></div>
                <div class="detail-row"><div class="detail-label">Поставщик:</div><div class="detail-value">${this.escapeHtml(item.supplier) || 'Не указан'}</div></div>
                <div class="detail-row"><div class="detail-label">Дата создания:</div><div class="detail-value">${new Date(item.createdAt).toLocaleString('ru-RU')}</div></div>
            </div>
        `;
        modal.style.display = 'block';
    }

    async deleteItem(id) {
        if (confirm('Вы уверены, что хотите удалить этот товар?')) {
            try {
                await api.deleteItem(id);
                this.showSuccess('Товар успешно удалён');
                await this.loadData();
                await this.loadStatistics();
                await this.loadCategories();
            } catch (error) {
                this.showError('Ошибка удаления: ' + error.message);
            }
        }
    }

    showSuccess(message) {
        alert(message);
    }

    showError(message) {
        alert('Ошибка: ' + message);
    }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new InventoryApp();
});