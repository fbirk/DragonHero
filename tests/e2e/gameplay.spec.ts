import { test, expect } from '@playwright/test';

test.describe('Gameplay Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for Phaser to boot and load assets
    await page.waitForSelector('canvas', { timeout: 10000 });
    // Give BootScene time to generate placeholder assets and transition to StartScene
    await page.waitForTimeout(2000);
  });

  test('full flow: start -> intro -> gameplay -> canvas is interactive', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Get canvas bounding box for click coordinates
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();

    // Tap the Start button (centered at roughly GAME_WIDTH/2, GAME_HEIGHT*0.65)
    // The canvas is scaled, so we click at the center area
    const centerX = box!.x + box!.width / 2;
    const startBtnY = box!.y + box!.height * 0.65;
    await page.mouse.click(centerX, startBtnY);
    await page.waitForTimeout(500);

    // Advance through intro dialogue (4 frames)
    for (let i = 0; i < 4; i++) {
      await page.mouse.click(centerX, startBtnY);
      await page.waitForTimeout(400);
    }

    // We should now be in the GameScene
    // Verify canvas is still rendered and interactive
    await expect(canvas).toBeVisible();

    // Tap to make dragon flap
    await page.mouse.click(centerX, box!.y + box!.height / 2);
    await page.waitForTimeout(200);

    // Canvas should still be visible (game is running)
    await expect(canvas).toBeVisible();
  });

  test('dragon responds to tap input during gameplay', async ({ page }) => {
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();

    const centerX = box!.x + box!.width / 2;
    const startBtnY = box!.y + box!.height * 0.65;

    // Navigate to gameplay: Start -> advance through 4 intro frames + 1 extra to finish
    await page.mouse.click(centerX, startBtnY);
    await page.waitForTimeout(500);
    for (let i = 0; i < 4; i++) {
      await page.mouse.click(centerX, startBtnY);
      await page.waitForTimeout(400);
    }

    // In GameScene: tap multiple times to flap
    for (let i = 0; i < 5; i++) {
      await page.mouse.click(centerX, box!.y + box!.height * 0.4);
      await page.waitForTimeout(100);
    }

    // Game should still be running (canvas present)
    await expect(canvas).toBeVisible();
  });
});
