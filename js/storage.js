// storage.js - Модуль для работы с localStorage (Система учёта складских запасов)

class InventoryStorage {
    constructor() {
        this.storageKey = 'inventory_items';
        this.initializeData();
    }

    initializeData() {
        if (!localStorage.getItem(this.storageKey)) {
            const testData = [
                {
                    id: 1,
                    name: 'Ноутбук Lenovo ThinkPad',
                    category: 'Электроника',
                    quantity: 15,
                    price: 45000,
                    minQuantity: 5,
                    location: 'Стеллаж А-1',
                    supplier: 'ООО "Компьютерный мир"',
                    createdAt: new Date('2026-03-10').toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Дрель аккумуляторная Bosch',
                    category: 'Инструменты',
                    quantity: 8,
                    price: 8500,
                    minQuantity: 3,
                    location: 'Стеллаж Б-2',
                    supplier: 'ООО "СтройИнструмент"',
                    createdAt: new Date('2026-03-12').toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: 'Бумага офисная А4',
                    category: 'Расходные материалы',
                    quantity: 2,
                    price: 350,
                    minQuantity: 10,
                    location: 'Склад №3',
                    supplier: 'ЗАО "Канцтовары"',
                    createdAt: new Date('2026-03-14').toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 4,
                    name: 'МФУ Canon i-SENSYS',
                    category: 'Оборудование',
                    quantity: 5,
                    price: 12500,
                    minQuantity: 2,
                    location: 'Стеллаж В-3',
                    supplier: 'ООО "Офисная техника"',
                    createdAt: new Date('2026-03-15').toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 5,
                    name: 'Кресло офисное',
                    category: 'Мебель',
                    quantity: 0,
                    price: 7800,
                    minQuantity: 3,
                    location: 'Склад №2',
                    supplier: 'ООО "МебельПро"',
                    createdAt: new Date('2026-03-16').toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 6,
                    name: 'Ручка шариковая синяя',
                    category: 'Канцелярия',
                    quantity: 45,
                    price: 25,
                    minQuantity: 20,
                    location: 'Стеллаж Г-1',
                    supplier: 'ЗАО "Канцтовары"',
                    createdAt: new Date('2026-03-17').toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];
            localStorage.setItem(this.storageKey, JSON.stringify(testData));
        }
    }

    getAllItems() {
        const data = localStorage.getItem(this.storageKey);
        return JSON.parse(data);
    }

    saveAllItems(items) {
        localStorage.setItem(this.storageKey, JSON.stringify(items));
    }

    getItemById(id) {
        const items = this.getAllItems();
        return items.find(item => item.id === id);
    }

    createItem(itemData) {
        const items = this.getAllItems();
        const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        
        const newItem = {
            id: newId,
            ...itemData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        items.push(newItem);
        this.saveAllItems(items);
        return newItem;
    }

    updateItem(id, updatedData) {
        const items = this.getAllItems();
        const index = items.findIndex(item => item.id === id);
        
        if (index !== -1) {
            items[index] = {
                ...items[index],
                ...updatedData,
                updatedAt: new Date().toISOString()
            };
            this.saveAllItems(items);
            return items[index];
        }
        return null;
    }

    deleteItem(id) {
        const items = this.getAllItems();
        const filteredItems = items.filter(item => item.id !== id);
        this.saveAllItems(filteredItems);
        return true;
    }

    getStatistics() {
        const items = this.getAllItems();
        const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        
        return {
            totalItems: items.length,
            totalQuantity: totalItems,
            totalValue: totalValue,
            lowStock: items.filter(item => item.quantity <= item.minQuantity && item.quantity > 0).length,
            outOfStock: items.filter(item => item.quantity === 0).length
        };
    }

    getCategories() {
        const items = this.getAllItems();
        const categories = [...new Set(items.map(item => item.category))];
        return categories;
    }
}

const storage = new InventoryStorage();