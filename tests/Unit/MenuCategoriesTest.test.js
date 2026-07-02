import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeMenuCategory, getMenuCategoryOptions, formatMenuCategoryLabel } from '../../resources/js/utils/menuCategories.js';

test('normalizes legacy category values to the shared category list', () => {
    assert.equal(normalizeMenuCategory('burgers'), 'burger');
    assert.equal(normalizeMenuCategory('desserts'), 'dessert');
    assert.equal(normalizeMenuCategory('drinks'), 'drink');
    assert.equal(normalizeMenuCategory('sides'), 'sides');
});

test('provides the category options used by the home page and menu forms', () => {
    const options = getMenuCategoryOptions();
    assert.deepEqual(options.map((option) => option.value), ['all', 'appetizer', 'main_course', 'dessert', 'beverage', 'salad', 'soup', 'burger', 'sides', 'drink']);
    assert.equal(formatMenuCategoryLabel('appetizer'), 'Appetizer');
    assert.equal(formatMenuCategoryLabel('dessert'), 'Dessert');
});
