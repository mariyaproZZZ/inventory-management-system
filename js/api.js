// api.js - Эмуляция API для работы с сервером

class API {
    constructor() {
        this.delay = 400;
    }

    async simulateDelay() {
        return new Promise(resolve => setTimeout(resolve, this.delay));
    }

    async getItems(filters = {}) {
        await this.simulateDelay();
        let items = storage.getAllItems();
        
        if (filters.category && filters.category !== 'all') {
            items = items.filter(item => item.category === filters.category);
        }
        
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            items = items.filter(item => 
                item.name.toLowerCase().includes(searchLower) ||
                item.supplier?.toLowerCase().includes(searchLower)
            );
        }
        
        items.sort((a, b) => a.id - b.id);
        return items;
    }

    async getItemById(id) {
        await this.simulateDelay();
        return storage.getItemById(id);
    }

    async createItem(itemData) {
        await this.simulateDelay();
        
        if (!itemData.name || !itemData.category || itemData.quantity === undefined || !itemData.price) {
            throw new Error('Заполните все обязательные поля');
        }
        
        return storage.createItem(itemData);
    }

    async updateItem(id, itemData) {
        await this.simulateDelay();
        
        const existingItem = storage.getItemById(id);
        if (!existingItem) {
            throw new Error('Товар не найден');
        }
        
        return storage.updateItem(id, itemData);
    }

    async deleteItem(id) {
        await this.simulateDelay();
        
        const existingItem = storage.getItemById(id);
        if (!existingItem) {
            throw new Error('Товар не найден');
        }
        
        return storage.deleteItem(id);
    }

    async getStatistics() {
        await this.simulateDelay();
        return storage.getStatistics();
    }

    async getCategories() {
        await this.simulateDelay();
        return storage.getCategories();
    }
}

const api = new API();