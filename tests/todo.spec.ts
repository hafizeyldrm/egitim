import { expect, test, type Page } from '@playwright/test';

const appUrl = 'https://demo.playwright.dev/todomvc';
const todoInput = (page: Page) => page.getByRole('textbox', { name: 'What needs to be done?' });
const todoRows = (page: Page) => page.getByRole('list').first().getByRole('listitem');

async function startWithEmptyList(page: Page) {
  await page.goto(appUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function addTodo(page: Page, title: string) {
  await todoInput(page).fill(title);
  await todoInput(page).press('Enter');
}

async function expectRemainingCount(page: Page, count: number) {
  const itemLabel = count === 1 ? 'item' : 'items';
  await expect(page.locator('.todo-count')).toHaveText(`${count} ${itemLabel} left`);
}

test.describe('Todo oluşturma', () => {
  test.beforeEach(async ({ page }) => {
    await startWithEmptyList(page);
  });

  test('Geçerli başlıkla Todo ekleme', async ({ page }) => {
    // 1. Uygulamayı boş başlangıç durumunda açın ve giriş alanına bir başlık yazın.
    await todoInput(page).fill('Buy groceries');

    // 2. Enter tuşuna basın.
    await todoInput(page).press('Enter');

    await expect(todoRows(page)).toHaveCount(1);
    await expect(todoRows(page).getByText('Buy groceries', { exact: true })).toBeVisible();
    await expect(todoInput(page)).toHaveValue('');
    await expectRemainingCount(page, 1);
    await expect(page.getByRole('checkbox', { name: /Mark all as complete/ })).toBeVisible();
  });

  test('Birden fazla Todo ekleme ve sayaç', async ({ page }) => {
    // 1. Boş listeye iki Todo ekleyin.
    await addTodo(page, 'Buy groceries');
    await addTodo(page, 'Read a book');

    await expect(todoRows(page)).toHaveCount(2);
    await expectRemainingCount(page, 2);
    await expect(todoRows(page).nth(0).getByRole('checkbox', { name: 'Toggle Todo' })).not.toBeChecked();
    await expect(todoRows(page).nth(1).getByRole('checkbox', { name: 'Toggle Todo' })).not.toBeChecked();

    // 2. Boş ve yalnızca boşluk içeren başlıkları göndermeyi deneyin.
    await todoInput(page).press('Enter');
    await todoInput(page).fill('   ');
    await todoInput(page).press('Enter');

    await expect(todoRows(page)).toHaveCount(2);
    await expectRemainingCount(page, 2);
  });
});

test.describe('Tamamlama durumu', () => {
  test.beforeEach(async ({ page }) => {
    await startWithEmptyList(page);
  });

  test('Tek bir Todo\'yu tamamlama ve geri alma', async ({ page }) => {
    // 1. Boş listeye iki Todo ekleyin.
    await addTodo(page, 'Buy groceries');
    await addTodo(page, 'Read a book');
    await expectRemainingCount(page, 2);

    // 2. İlk Todo'yu tamamlayın.
    const firstTodo = todoRows(page).filter({ hasText: 'Buy groceries' });
    const firstTodoToggle = firstTodo.getByRole('checkbox', { name: 'Toggle Todo' });
    await firstTodoToggle.check();

    await expect(firstTodoToggle).toBeChecked();
    await expect(todoRows(page).filter({ hasText: 'Read a book' }).getByRole('checkbox', { name: 'Toggle Todo' })).not.toBeChecked();
    await expectRemainingCount(page, 1);

    // 3. Aynı Todo'nun işaretini kaldırın.
    await firstTodoToggle.uncheck();
    await expect(firstTodoToggle).not.toBeChecked();
    await expectRemainingCount(page, 2);
  });

  test('Tüm Todo\'ları toplu tamamlama ve geri alma', async ({ page }) => {
    // 1. İki Todo ekleyin ve yalnızca birini tamamlayın.
    await addTodo(page, 'Buy groceries');
    await addTodo(page, 'Read a book');
    await todoRows(page).filter({ hasText: 'Buy groceries' }).getByRole('checkbox', { name: 'Toggle Todo' }).check();

    // 2. Tüm Todo'ları tamamlayın.
    const toggleAll = page.getByRole('checkbox', { name: /Mark all as complete/ });
    await toggleAll.check();

    await expect(todoRows(page).getByRole('checkbox', { name: 'Toggle Todo' }).nth(0)).toBeChecked();
    await expect(todoRows(page).getByRole('checkbox', { name: 'Toggle Todo' }).nth(1)).toBeChecked();
    await expectRemainingCount(page, 0);

    // 3. Toplu tamamlamayı geri alın.
    await toggleAll.uncheck();
    await expect(todoRows(page).getByRole('checkbox', { name: 'Toggle Todo' }).nth(0)).not.toBeChecked();
    await expect(todoRows(page).getByRole('checkbox', { name: 'Toggle Todo' }).nth(1)).not.toBeChecked();
    await expectRemainingCount(page, 2);
  });
});

test.describe('Filtreleme', () => {
  test.beforeEach(async ({ page }) => {
    await startWithEmptyList(page);
  });

  test('All, Active ve Completed filtrelerini kullanma', async ({ page }) => {
    // 1. İki Todo ekleyip yalnızca birini tamamlayın.
    await addTodo(page, 'Buy groceries');
    await addTodo(page, 'Read a book');
    await todoRows(page).filter({ hasText: 'Buy groceries' }).getByRole('checkbox', { name: 'Toggle Todo' }).check();
    await expect(todoRows(page)).toHaveCount(2);
    await expectRemainingCount(page, 1);

    // 2. Active filtresini seçin.
    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page).toHaveURL(/#\/active$/);
    await expect(todoRows(page)).toHaveCount(1);
    await expect(todoRows(page).getByText('Read a book', { exact: true })).toBeVisible();
    await expectRemainingCount(page, 1);

    // 3. Completed filtresini seçin.
    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page).toHaveURL(/#\/completed$/);
    await expect(todoRows(page)).toHaveCount(1);
    await expect(todoRows(page).getByText('Buy groceries', { exact: true })).toBeVisible();
    await expectRemainingCount(page, 1);

    // 4. All filtresini seçin.
    await page.getByRole('link', { name: 'All' }).click();
    await expect(page).toHaveURL(/#\/$/);
    await expect(todoRows(page)).toHaveCount(2);
  });
});

test.describe('Todo düzenleme', () => {
  test.beforeEach(async ({ page }) => {
    await startWithEmptyList(page);
  });

  test('Todo başlığını düzenleyip kaydetme', async ({ page }) => {
    // 1. Bir Todo oluşturup metnine çift tıklayarak düzenleme modunu açın.
    await addTodo(page, 'Read a book');
    const todo = todoRows(page).filter({ hasText: 'Read a book' });
    await todo.getByText('Read a book', { exact: true }).dblclick();
    await expect(page.getByRole('textbox', { name: 'Edit' })).toHaveValue('Read a book');

    // 2. Başlığı değiştirip Enter ile kaydedin.
    await page.getByRole('textbox', { name: 'Edit' }).fill('Read books');
    await page.getByRole('textbox', { name: 'Edit' }).press('Enter');

    await expect(todoRows(page).getByText('Read books', { exact: true })).toBeVisible();
    await expect(todoRows(page).getByText('Read a book', { exact: true })).toHaveCount(0);
    await expect(todoRows(page)).toHaveCount(1);
    await expectRemainingCount(page, 1);
  });

  test('Düzenlemeyi Escape ile iptal etme', async ({ page }) => {
    // 1. Bir Todo oluşturun, düzenleme modunu açın ve yeni bir başlık yazın.
    await addTodo(page, 'Read a book');
    const todo = todoRows(page).filter({ hasText: 'Read a book' });
    await todo.getByText('Read a book', { exact: true }).dblclick();
    const editInput = page.getByRole('textbox', { name: 'Edit' });
    await editInput.fill('Read books');
    await expect(editInput).toHaveValue('Read books');

    // 2. Escape tuşuyla düzenlemeyi iptal edin.
    await editInput.press('Escape');

    await expect(todoRows(page).getByText('Read a book', { exact: true })).toBeVisible();
    await expect(todoRows(page).getByText('Read books', { exact: true })).toHaveCount(0);
    await expect(todoRows(page)).toHaveCount(1);
  });
});

test.describe('Todo silme', () => {
  test.beforeEach(async ({ page }) => {
    await startWithEmptyList(page);
  });

  test('Tek bir Todo\'yu silme', async ({ page }) => {
    // 1. İki Todo oluşturun.
    await addTodo(page, 'Buy groceries');
    await addTodo(page, 'Read a book');
    await expect(todoRows(page)).toHaveCount(2);
    await expectRemainingCount(page, 2);

    // 2. Silinecek Todo'nun üzerine gelip Delete düğmesine tıklayın.
    const todoToDelete = todoRows(page).filter({ hasText: 'Buy groceries' });
    await todoToDelete.hover();
    await todoToDelete.getByRole('button', { name: 'Delete' }).click();

    await expect(todoRows(page)).toHaveCount(1);
    await expect(todoRows(page).getByText('Buy groceries', { exact: true })).toHaveCount(0);
    await expect(todoRows(page).getByText('Read a book', { exact: true })).toBeVisible();
    await expectRemainingCount(page, 1);
  });

  test('Tamamlanan Todo\'ları temizleme', async ({ page }) => {
    // 1. İki Todo oluşturun ve birini tamamlayın.
    await addTodo(page, 'Buy groceries');
    await addTodo(page, 'Read a book');
    await todoRows(page).filter({ hasText: 'Buy groceries' }).getByRole('checkbox', { name: 'Toggle Todo' }).check();
    await expect(page.getByRole('button', { name: 'Clear completed' })).toBeVisible();

    // 2. Tamamlanan Todo'ları temizleyin.
    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(todoRows(page)).toHaveCount(1);
    await expect(todoRows(page).getByText('Buy groceries', { exact: true })).toHaveCount(0);
    await expect(todoRows(page).getByText('Read a book', { exact: true })).toBeVisible();
    await expectRemainingCount(page, 1);
    await expect(page.getByRole('button', { name: 'Clear completed' })).toHaveCount(0);
  });
});
