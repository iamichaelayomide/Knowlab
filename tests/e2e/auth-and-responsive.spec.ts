import { expect, test } from '@playwright/test';

async function login(page: any, email: string, password: string) {
  await page.goto('/login');
  await page.getByPlaceholder('you@knowlab.com').fill(email);
  await page.getByPlaceholder('Enter your password').fill(password);
  await page.getByRole('button', { name: 'Sign in to Knowlab' }).click();
}

test('staff demo login routes correctly', async ({ page }) => {
  await login(page, 'staff123@knowlab.com', 'staff123');
  await expect(page).toHaveURL(/\/staff\/dashboard/);
});

test('supervisor demo login routes correctly', async ({ page }) => {
  await login(page, 'supervisor123@knowlab.com', 'supervisor123');
  await expect(page).toHaveURL(/\/supervisor\/dashboard/);
});

test('hod demo login routes correctly', async ({ page }) => {
  await login(page, 'hod123@knowlab.com', 'hod123');
  await expect(page).toHaveURL(/\/hod\/dashboard/);
});

test('mobile viewport can open navigation and access SOP list', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page, 'staff123@knowlab.com', 'staff123');
  await page.getByRole('button', { name: /open navigation menu/i }).click();
  await page.getByRole('link', { name: 'SOPs' }).click();
  await expect(page).toHaveURL(/\/staff\/sops/);
});
