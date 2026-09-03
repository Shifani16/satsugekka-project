import { test, expect } from '@playwright/test';

// Excel Reference: TC_INTRO_001
test.describe('Intro Landing Page Transitions', () => {
  test('TC_INTRO_001: should play entry animations and reveal assets smoothly', async ({ page }) => {
    
    await page.goto('http://localhost:5173/');

    const flowerImg = page.locator('img[alt="flower"]');
    const leafSetImg = page.locator('img[alt="leaf-set-intro"]');
    const mainHeading = page.getByRole('heading', { name: '"SNOW. MOON. FLOWER"' });

    await expect(flowerImg).toBeAttached();
    await expect(leafSetImg).toBeAttached();

    await expect(flowerImg).toBeVisible({ timeout: 2000 });
    await expect(leafSetImg).toBeVisible({ timeout: 2000 });
    await expect(mainHeading).toBeVisible();

    await expect(mainHeading).toHaveClass(/animate-handwritten/);
  });
});