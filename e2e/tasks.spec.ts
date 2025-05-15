import { test, expect } from '@playwright/test';
import { before } from 'node:test';

const SELECTORS = {
  header: '[data-test-id="app_header"]',
  searchInput: '[data-test-id="header_search-input"]',
  addTaskButton: '[data-test-id="header_button_add-task"]',
  dialogNameInput: '[data-test-id="task-dialog_input_name"]',
  dialogDescriptionInput: '[data-test-id="task-dialog_input_description"]',
  dialogSubmitButton: '[data-test-id="task-dialog_button_action"]',
  dialogCancelButton: '[data-test-id="task-dialog_button_cancel"]',
  taskCard: '[data-test-id="app_task_list_task"]',
  taskName: '[data-test-id="task_name"]',
  taskDeleteButton: '[data-test-id="task_button_delete"]',
  confirmationYesButton: '[data-test-id="confirmation-dialog_button_yes"]',
};

test.describe('Task Manager App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the task list and header', async ({ page }) => {
    await expect(page.locator(SELECTORS.header)).toBeVisible();
    await expect(page.locator(SELECTORS.taskCard)).not.toHaveCount(0);
  });

  test('should add a new task', async ({ page }) => {
    await page.click(SELECTORS.addTaskButton);

    await page.fill(SELECTORS.dialogNameInput, 'E2E Test Task');
    await page.fill(SELECTORS.dialogDescriptionInput, 'Task added by Playwright test');
    await page.click(SELECTORS.dialogSubmitButton);

    await expect(page.locator(SELECTORS.taskCard).filter({ hasText: 'E2E Test Task' })).toBeVisible();
  });

  test('should filter tasks via search input', async ({ page }) => {
    await page.click(SELECTORS.addTaskButton);
    await page.fill(SELECTORS.dialogNameInput, 'E2E Test Task');
    await page.fill(SELECTORS.dialogDescriptionInput, 'Task added by Playwright test');
    await page.click(SELECTORS.dialogSubmitButton);

    await page.fill(SELECTORS.searchInput, 'e2e test task');
    await page.waitForTimeout(2000); // allow debounce to trigger

    const visibleTasks = await page.locator(SELECTORS.taskCard).allTextContents();


    expect(visibleTasks.join(' ').toLowerCase()).toContain('e2e test task');
  });

  test('should delete a task', async ({ page }) => {
    await page.click(SELECTORS.addTaskButton);
    await page.fill(SELECTORS.dialogNameInput, 'E2E Test Task');
    await page.fill(SELECTORS.dialogDescriptionInput, 'Task added by Playwright test');
    await page.click(SELECTORS.dialogSubmitButton);

    const targetTask = page.locator(SELECTORS.taskCard).filter({ hasText: 'E2E Test Task' });
    await targetTask.locator(SELECTORS.taskDeleteButton).click();

    await page.locator(SELECTORS.confirmationYesButton).click();

    await expect(targetTask).toHaveCount(0);
  });

  test('new matching task appears in search results', async ({ page }) => {
    await page.click(SELECTORS.addTaskButton);
    await page.fill(SELECTORS.dialogNameInput, 'noise noise');
    await page.click(SELECTORS.dialogSubmitButton);

    await page.waitForTimeout(1000);

    const uniqueSearchTerm = 'testtest';

    await page.click(SELECTORS.addTaskButton);
    await page.fill(SELECTORS.dialogNameInput, uniqueSearchTerm);
    await page.click(SELECTORS.dialogSubmitButton);

    const beforeSearchCount = await page.locator(SELECTORS.taskCard).count();

    await page.fill(SELECTORS.searchInput, uniqueSearchTerm);
    await page.waitForTimeout(2000);

    const afterSearchCount = await page.locator(SELECTORS.taskCard).count();

    await page.click(SELECTORS.addTaskButton);
    await page.fill(SELECTORS.dialogNameInput, uniqueSearchTerm + ' second task');
    await page.click(SELECTORS.dialogSubmitButton);

    await page.waitForTimeout(1000);

    const afterSearchWithAdditionalTaskCount = await page.locator(SELECTORS.taskCard).count();

    expect(beforeSearchCount).toBe(beforeSearchCount + afterSearchCount - 1);
    expect(afterSearchWithAdditionalTaskCount).toBe(afterSearchCount + 1);
  });
});
