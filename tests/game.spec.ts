import { test, expect } from '@playwright/test';

test.describe('Biology Dash: Immune Patrol E2E Tests', () => {
  test('loads campaign map and verifies navigation and clinical screens', async ({ page }) => {
    await page.goto('/');

    // 1. Verify Campaign Title & Subtitle
    await expect(page.locator('.brand-title')).toHaveText('BIOLOGY DASH');
    await expect(page.locator('.brand-subtitle')).toContainText('IMMUNE PATROL');

    // 2. Verify all 10 patrols exist in the campaign grid
    const patrolCards = page.locator('.patrol-card');
    await expect(patrolCards).toHaveCount(10);

    // Patrol 1 should be unlocked
    const firstPatrol = patrolCards.first();
    await expect(firstPatrol).toHaveClass(/unlocked/);
    await expect(firstPatrol.locator('.patrol-title')).toContainText('First Hug');

    // 3. Navigate to Barracks
    await page.click('#navBarracksBtn');
    await expect(page.locator('.brand-title')).toHaveText('SQUAD BARRACKS');
    const upgradeCards = page.locator('.upgrade-card');
    await expect(upgradeCards).toHaveCount(4);
    await expect(page.locator('.upgrade-title').first()).toHaveText('Extravasation Speed');

    // 4. Navigate to Field Guide
    await page.click('#navFieldGuideBtn');
    await expect(page.locator('.brand-title')).toHaveText('CLINICAL FIELD GUIDE');

    // Verify 9 pathogens are listed in the dossier
    const pathogenCards = page.locator('#pathogenList .dossier-card');
    await expect(pathogenCards).toHaveCount(9);

    // Verify clinical hallmarks exist
    await expect(pathogenCards.first().locator('.dossier-name')).toHaveText('Staphylococcus aureus');
    await expect(pathogenCards.first().locator('.gram-badge')).toHaveText('Gram-Positive');

    // Switch to Medicines tab
    await page.click('#tabMedicines');
    const medicineCards = page.locator('#medicineList .dossier-card');
    await expect(medicineCards).toHaveCount(4);
    await expect(medicineCards.first().locator('.dossier-name')).toHaveText('Amoxicillin');
  });

  test('deploys Patrol 1, validates in-game HUD, controls, and medicine dock', async ({ page }) => {
    await page.goto('/');

    // 1. Click Patrol 1 to open Clinical Briefing
    await page.click('.patrol-card.unlocked');

    const modal = page.locator('.briefing-card');
    await expect(modal).toBeVisible();
    await expect(modal.locator('.modal-title')).toContainText('First Hug');
    await expect(modal.locator('.briefing-context')).toContainText('capillary bed');

    // 2. Deploy Squad
    await page.click('#briefingDeployBtn');

    // Game container should be active
    const gameContainer = page.locator('#gameContainer');
    await expect(gameContainer).toBeVisible();

    // Canvas should exist
    const canvas = page.locator('#gameCanvas');
    await expect(canvas).toBeVisible();

    // HUD should display starting squad counter (> 10 defenders)
    const squadCounter = page.locator('#hudSquadCount');
    await expect(squadCounter).toBeVisible();
    const countText = await squadCounter.textContent();
    expect(Number(countText)).toBeGreaterThanOrEqual(10);

    // Care Kit dock should display Amoxicillin
    const amoxSlot = page.locator('[data-med="amoxicillin"]');
    await expect(amoxSlot).toBeVisible();
    await expect(amoxSlot.locator('.med-name')).toHaveText('Amoxicillin');

    // 3. Test keyboard control (A / D)
    await page.keyboard.down('KeyA');
    await page.waitForTimeout(100);
    await page.keyboard.up('KeyA');

    await page.keyboard.down('KeyD');
    await page.waitForTimeout(100);
    await page.keyboard.up('KeyD');

    // 4. Test dragging on canvas
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2, { steps: 5 });
      await page.mouse.up();
    }

    // 5. Test hold-to-charge medicine button
    const medBtn = page.locator('#medBtn_amoxicillin');
    await medBtn.dispatchEvent('pointerdown');
    await page.waitForTimeout(400);
    await medBtn.dispatchEvent('pointerup');

    // Verify game loop progresses without error
    await page.waitForTimeout(500);
    const progressFill = page.locator('#hudProgressFill');
    await expect(progressFill).toBeVisible();
  });
});
