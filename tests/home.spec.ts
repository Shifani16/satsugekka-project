import { test, expect } from '@playwright/test';

test.describe('Opening Home Page', () => {
    test('TC_HOME_001: should opening the home page', async({page}) => {
        await page.goto('http://localhost:5173/');

        const homeTitle = page.getByRole('heading', { name: 'Translation & Personal Blog'});
        await expect(homeTitle).toBeAttached();

        const portfolio = page.getByRole('link', { name: 'Portofolio'});
        await expect(portfolio).toHaveAttribute('href', 'https://shifani-portfolio-website.vercel.app/#home')
        await expect(portfolio).toHaveAttribute('target', '_blank');

        const blogBook = page.locator('a[href="\\\\blog"]');
        const aboutBook = page.locator('a[href="\\\\about"]');
        const transBook = page.locator('a[href="\\\\translation"]');

        await expect(blogBook).toBeVisible();
        await expect(aboutBook).toBeVisible();
        await expect(transBook).toBeVisible();

        await blogBook.click()

        await expect(page).toHaveURL(/.*\/blog/);
    })

    
})