const { test, expect } = require('@playwright/test');

const username = 'khalik';
const password = 'Qqqq111!'

test('test', async({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.login(username, password);

    const cartPage = new CartPage(page);
    await cartPage.addToCart();
    await cartPage.deleteFromCart();
});

class HomePage {
    constructor(page) {
        this.page = page
    }

    async navigate() {
        await this.page.goto('https://www.demoblaze.com/');
    }

    async signup(username, password) {
        await this.page.click('a:has-text("Sign up")');
        await this.page.click('text=Username: Password: >> input[type="text"]');
        await this.page.fill('text=Username: Password: >> input[type="text"]', `${username}`);
        await this.page.click('text=Username: Password:');
        await this.page.click('input[type="password"]');
        await this.page.fill('input[type="password"]', `${password}`);
        this.page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => {});
        });
        await this.page.click('button:has-text("Sign up")');
    }

    async login(username, password) {
        await this.page.click('a:has-text("Login")');
        await this.page.click('text=Log in × Username: Password: Close Log in >> input[type="text"]');
        await this.page.fill('text=Log in × Username: Password: Close Log in >> input[type="text"]', `${username}`);
        await this.page.click('text=Log in × Username: Password: Close Log in >> input[type="password"]');
        await this.page.fill('text=Log in × Username: Password: Close Log in >> input[type="password"]', `${password}`);

        await Promise.all([
            this.page.waitForNavigation( /*{ url: 'https://www.demoblaze.com/' }*/ ),
            this.page.click('button:has-text("Log in")')
        ]);

        await this.page.click(`text=Welcome ${username}`);
        await expect(this.page).toHaveURL('https://www.demoblaze.com/#');
    }
}

class CartPage {
    constructor(page) {
        this.page = page
    }

    async addToCart() {
        await this.page.click('text=Nokia lumia 1520');
        await expect(this.page).toHaveURL('https://www.demoblaze.com/prod.html?idp_=2');

        this.page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => {});
        });
        await this.page.click('text=Add to cart');
        await expect(this.page).toHaveURL('https://www.demoblaze.com/prod.html?idp_=2#');

        await this.page.click('text=Home (current)');
        await expect(this.page).toHaveURL('https://www.demoblaze.com/index.html');

        await this.page.click('text=Sony xperia z5');
        await expect(this.page).toHaveURL('https://www.demoblaze.com/prod.html?idp_=6');

        this.page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => {});
        });
        await this.page.click('text=Add to cart');
        await expect(this.page).toHaveURL('https://www.demoblaze.com/prod.html?idp_=6#');

        await this.page.click('text=Cart');
        await expect(this.page).toHaveURL('https://www.demoblaze.com/cart.html');

        await this.page.click('h3:has-text("1140")');
    }

    async deleteFromCart() {
        await Promise.all([
            this.page.waitForNavigation( /*{ url: 'https://www.demoblaze.com/cart.html#' }*/ ),
            this.page.click('text=Delete')
        ]);

        await Promise.all([
            this.page.waitForNavigation( /*{ url: 'https://www.demoblaze.com/cart.html#' }*/ ),
            this.page.click('text=Delete')
        ]);

        await this.page.click('h3:has-text("0")');
    }
}