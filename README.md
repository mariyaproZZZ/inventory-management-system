# 📦 Система учёта складских запасов

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://mariyaproZZZ.github.io/inventory-management-system)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/ru/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/ru/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/ru/docs/Web/CSS)

> Веб-приложение для автоматизации учёта товарно-материальных ценностей на складе предприятия.

---

## 🚀 Демо

👉 **[Открыть приложение](https://mariyaproZZZ.github.io/inventory-management-system)** 👈

---

## 📋 Основные возможности

| Функция | Описание |
|---------|----------|
| ➕ **Добавление товаров** | Указание названия, категории, количества, цены, места хранения, поставщика |
| ✏️ **Редактирование** | Изменение любых параметров товара |
| 🗑️ **Удаление** | Списание или удаление товара из базы |
| 🔍 **Поиск** | Быстрый поиск по названию товара |
| 🏷️ **Фильтрация** | Фильтрация товаров по категориям |
| 📊 **Статистика** | Общее количество товаров, общая стоимость, дефицит |
| ⚠️ **Авто-статус** | Автоматическое определение статуса: В наличии / Мало / Нет в наличии |

---

## 🛠️ Технологический стек

<div align="center">

| Технология | Назначение |
|------------|------------|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) | Структура страниц |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) | Стилизация и адаптивность |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | Бизнес-логика |
| ![Font Awesome](https://img.shields.io/badge/Font%20Awesome-528DD7?style=flat&logo=fontawesome&logoColor=white) | Иконки |
| ![localStorage](https://img.shields.io/badge/localStorage-FFB6C1?style=flat) | Хранение данных |

</div>

---

## 📁 Структура проекта
inventory-management-system/
├── 📄 index.html # Главная страница
├── 📁 css/
│ └── 📄 style.css # Стили приложения
├── 📁 js/
│ ├── 📄 storage.js # Модуль работы с localStorage
│ ├── 📄 api.js # Эмуляция API
│ └── 📄 app.js # Основная логика приложения
├── 📁 docs/
│ └── 📄 technical_specification.md # Техническое задание
└── 📄 README.md # Описание проекта

---

## 🏗️ Архитектура

```mermaid
graph TD
    A[index.html] --> B[style.css]
    A --> C[app.js]
    C --> D[api.js]
    D --> E[storage.js]
    E --> F[localStorage]
    
    style A fill:#3498db,stroke:#333,stroke-width:2px,color:#fff
    style B fill:#2ecc71,stroke:#333,stroke-width:2px,color:#fff
    style C fill:#e74c3c,stroke:#333,stroke-width:2px,color:#fff
    style D fill:#f39c12,stroke:#333,stroke-width:2px,color:#fff
    style E fill:#9b59b6,stroke:#333,stroke-width:2px,color:#fff
    style F fill:#1abc9c,stroke:#333,stroke-width:2px,color:#fff
