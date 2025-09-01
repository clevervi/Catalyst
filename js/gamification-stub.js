/**
 * Gamification System Stub for Catalyst HR
 * This file replaces the gamification system with a minimal stub to avoid errors
 */

class GamificationEngineStub {
    constructor() {
        // Minimal stub implementation
        this.userProgress = {
            level: 1,
            xp: 0,
            xpToNextLevel: 1000
        };
    }

    // Stub methods that do nothing but prevent errors
    init() {}
    loadUserProgress() { return this.userProgress; }
    addXP() { return false; }
    trackAction() {}
    updateProgressDisplay() {}
    saveProgress() {}
    getProgressSummary() { return this.userProgress; }
    getUserBadges() { return []; }
    getRecentAchievements() { return []; }
}

// Export the stub engine
let gamificationEngine = null;

export function getGamificationEngine() {
    if (!gamificationEngine) {
        gamificationEngine = new GamificationEngineStub();
    }
    return gamificationEngine;
}

export { GamificationEngineStub as GamificationEngine };
