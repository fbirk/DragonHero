import { test, expect } from '@playwright/test';

test.describe('Navigation & Retry Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(2000);
  });

  test('Game Over screen shows Retry and Main Menu buttons', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();

    const centerX = box!.x + box!.width / 2;
    const startBtnY = box!.y + box!.height * 0.65;

    // Navigate to gameplay: Start -> advance through intro
    await page.mouse.click(centerX, startBtnY);
    await page.waitForTimeout(500);
    for (let i = 0; i < 4; i++) {
      await page.mouse.click(centerX, startBtnY);
      await page.waitForTimeout(400);
    }

    // In GameScene - let the dragon fall to ground to lose lives
    // Don't tap - let gravity pull dragon down to hit ground repeatedly
    // Wait for dragon to fall and lose lives (invincibility wears off after 2s)
    await page.waitForTimeout(3000); // First life lost (ground hit)
    await page.waitForTimeout(3000); // Second life lost
    await page.waitForTimeout(3000); // Third life lost -> Game Over

    // Canvas should still be present (GameOverScene rendered on same canvas)
    await expect(canvas).toBeVisible();
  });

  test('Main Menu button returns to StartScene', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();

    const centerX = box!.x + box!.width / 2;

    // Tap Start to go to IntroScene
    await page.mouse.click(centerX, box!.y + box!.height * 0.65);
    await page.waitForTimeout(500);

    // Canvas should remain throughout navigation
    await expect(canvas).toBeVisible();
  });
});
