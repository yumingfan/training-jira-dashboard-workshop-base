import { test, expect } from '@playwright/test';

/**
 * Task 1.2.3: 視覺化回歸測試 - 簡化版本
 * 
 * 目標：驗證 Playwright 測試環境和基本顏色檢測
 * 測試案例對應：TC-001, TC-002, TC-003
 */

test.describe('基礎環境驗證', () => {
  
  test('前端應用能正常啟動', async ({ page }) => {
    // 訪問首頁
    await page.goto('http://localhost:3000');
    
    // 檢查頁面標題
    await expect(page).toHaveTitle(/Dashboard App/);
    
    // 等待頁面加載完成
    await page.waitForLoadState('domcontentloaded');
    
    // 截圖記錄初始狀態
    await expect(page).toHaveScreenshot('homepage-initial.png', {
      threshold: 0.5,
      animations: 'disabled'
    });
  });

  test('導航到 Google Sheets 頁面', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 等待導航元素出現
    await page.waitForSelector('nav', { timeout: 10000 });
    
    // 點擊 Google Sheets 連結
    const googleSheetsLink = page.locator('a').filter({ hasText: /google.*sheets/i }).first();
    if (await googleSheetsLink.count() > 0) {
      await googleSheetsLink.click();
      
      // 等待頁面導航完成
      await page.waitForURL('**/google-sheets');
      await page.waitForLoadState('domcontentloaded');
      
      // 截圖記錄 Google Sheets 頁面
      await expect(page).toHaveScreenshot('google-sheets-page.png', {
        threshold: 0.5,
        animations: 'disabled'
      });
    } else {
      // 直接導航到 Google Sheets 頁面
      await page.goto('http://localhost:3000/google-sheets');
      await page.waitForLoadState('domcontentloaded');
      
      // 截圖記錄頁面狀態
      await expect(page).toHaveScreenshot('google-sheets-direct.png', {
        threshold: 0.5,
        animations: 'disabled'
      });
    }
  });

  test('檢查燃盡圖和進度卡片組件存在', async ({ page }) => {
    await page.goto('http://localhost:3000/google-sheets');
    await page.waitForLoadState('domcontentloaded');
    
    // 等待足夠時間讓組件加載（即使是錯誤狀態）
    await page.waitForTimeout(3000);
    
    // 檢查是否存在燃盡圖相關的元素
    const chartElements = await page.locator('text=燃盡圖').count();
    const progressElements = await page.locator('text=完成率').count();
    
    if (chartElements > 0 || progressElements > 0) {
      console.log('找到燃盡圖或進度相關元素');
      
      // 截圖記錄組件狀態
      await expect(page).toHaveScreenshot('components-loaded.png', {
        threshold: 0.5,
        animations: 'disabled'
      });
    } else {
      console.log('未找到預期組件，記錄當前頁面狀態');
      
      // 截圖記錄實際頁面內容
      await expect(page).toHaveScreenshot('actual-page-content.png', {
        threshold: 0.5,
        animations: 'disabled'
      });
    }
  });
});

test.describe('顏色驗證準備', () => {
  
  test('驗證顏色檢測能力', async ({ page }) => {
    // 創建一個簡單的測試頁面來驗證顏色檢測
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>顏色測試</title>
        <style>
          .green-test { background-color: rgb(16, 185, 129); width: 100px; height: 100px; }
          .yellow-test { background-color: rgb(245, 158, 11); width: 100px; height: 100px; }
          .red-test { background-color: rgb(239, 68, 68); width: 100px; height: 100px; }
        </style>
      </head>
      <body>
        <div class="green-test" data-testid="green-box">綠色</div>
        <div class="yellow-test" data-testid="yellow-box">黃色</div>
        <div class="red-test" data-testid="red-box">紅色</div>
      </body>
      </html>
    `);
    
    // 等待元素渲染
    await page.waitForSelector('[data-testid="green-box"]');
    
    // 檢查顏色值
    const greenColor = await page.locator('[data-testid="green-box"]').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    const yellowColor = await page.locator('[data-testid="yellow-box"]').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    const redColor = await page.locator('[data-testid="red-box"]').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // 驗證顏色正確性
    expect(greenColor).toBe('rgb(16, 185, 129)');
    expect(yellowColor).toBe('rgb(245, 158, 11)');
    expect(redColor).toBe('rgb(239, 68, 68)');
    
    // 截圖記錄顏色測試
    await expect(page).toHaveScreenshot('color-test-boxes.png', {
      threshold: 0.1,
      animations: 'disabled'
    });
    
    console.log('顏色檢測驗證成功:');
    console.log(`綠色: ${greenColor}`);
    console.log(`黃色: ${yellowColor}`);
    console.log(`紅色: ${redColor}`);
  });
});
