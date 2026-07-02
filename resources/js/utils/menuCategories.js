const CATEGORY_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'appetizer', label: 'Appetizer' },
    { value: 'main_course', label: 'Main Course' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'beverage', label: 'Beverage' },
    { value: 'salad', label: 'Salad' },
    { value: 'soup', label: 'Soup' },
    { value: 'burger', label: 'Burger' },
    { value: 'sides', label: 'Sides' },
    { value: 'drink', label: 'Drink' },
];

const CATEGORY_ALIASES = {
    burgers: 'burger',
    desserts: 'dessert',
    drinks: 'drink',
};

export function normalizeMenuCategory(category) {
    if (!category) return 'appetizer';
    return CATEGORY_ALIASES[category] || category;
}

export function getMenuCategoryOptions() {
    return CATEGORY_OPTIONS;
}

export function formatMenuCategoryLabel(category) {
    const match = CATEGORY_OPTIONS.find((option) => option.value === category);
    return match ? match.label : category;
}
