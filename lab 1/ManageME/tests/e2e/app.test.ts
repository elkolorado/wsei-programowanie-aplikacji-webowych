import { test, expect } from '@playwright/test';

test.describe('ManageME Application E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page and log in
    await page.goto('http://localhost:4321/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:4321/');
  });

  test('Create a new project', async ({ page }) => {
    await page.click('text=Add Project');
    await page.fill('input[placeholder="Project name"]', 'Test Project');
    await page.fill('textarea[placeholder="Project description"]', 'This is a test project.');
    await page.click('button:has-text("Add Project")');
    await expect(page.locator('text=Test Project')).toBeVisible();
  });

  test('Create a new story', async ({ page }) => {
    await page.click('text=Create New Story');
    await page.fill('input[placeholder="Enter story name"]', 'Test Story');
    await page.fill('textarea[placeholder="Enter story description"]', 'This is a test story.');
    await page.selectOption('select[placeholder="Priority"]', 'medium');
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=Test Story')).toBeVisible();
  });

  test('Create a new task', async ({ page }) => {
    await page.click('text=Add Task');
    await page.fill('input[placeholder="Enter task name"]', 'Test Task');
    await page.fill('textarea[placeholder="Enter task description"]', 'This is a test task.');
    await page.selectOption('select[placeholder="Priority"]', 'high');
    await page.selectOption('select[placeholder="Story"]', 'Test Story');
    await page.fill('input[placeholder="Estimated Hours"]', '5');
    await page.click('button:has-text("Add Task")');
    await expect(page.locator('text=Test Task')).toBeVisible();
  });

  test('Change task status', async ({ page }) => {
    await page.dragAndDrop('text=Test Task', 'text=Doing');
    await expect(page.locator('text=Test Task').locator('text=Doing')).toBeVisible();
    await page.dragAndDrop('text=Test Task', 'text=Done');
    await expect(page.locator('text=Test Task').locator('text=Done')).toBeVisible();
  });

  test('Edit a task', async ({ page }) => {
    await page.click('text=Test Task >> text=Edit');
    await page.fill('input[placeholder="Enter task name"]', 'Updated Task');
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=Updated Task')).toBeVisible();
  });

  test('Edit a story', async ({ page }) => {
    await page.click('text=Test Story >> text=Edit');
    await page.fill('input[placeholder="Enter story name"]', 'Updated Story');
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=Updated Story')).toBeVisible();
  });

  test('Edit a project', async ({ page }) => {
    await page.click('text=Test Project >> text=Edit');
    await page.fill('input[placeholder="Project name"]', 'Updated Project');
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('text=Updated Project')).toBeVisible();
  });

  test('Delete a task', async ({ page }) => {
    await page.click('text=Test Task >> text=Delete');
    await expect(page.locator('text=Test Task')).not.toBeVisible();
  });

  test('Delete a story', async ({ page }) => {
    await page.click('text=Test Story >> text=Delete');
    await expect(page.locator('text=Test Story')).not.toBeVisible();
  });

  test('Delete a project', async ({ page }) => {
    await page.click('text=Test Project >> text=Delete');
    await expect(page.locator('text=Test Project')).not.toBeVisible();
  });
});