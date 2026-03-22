/**
 * Locale-aware narrative resolver
 * Returns the appropriate narrative library based on the current locale.
 * Falls back to Korean (original) if English translation is not available.
 */

import { NarrativeLibrary, CategoryNarratives, NarrativeItem } from './narrative-library';
import { NarrativeLibraryEN, CategoryNarrativesEN } from './narrative-library.en';
import { PremiumNarrativeLibrary, PremiumNarrative } from './premium-narratives';
import { CareerNarrativeLibrary } from './career-narratives';

export function getLocalizedNarratives(locale: string): Record<number, NarrativeItem> {
    return locale === 'en' ? NarrativeLibraryEN : NarrativeLibrary;
}

export function getLocalizedCategoryNarratives(locale: string): Record<string, string> {
    return locale === 'en' ? CategoryNarrativesEN : CategoryNarratives;
}

export function getLocalizedPremiumNarratives(locale: string): Record<number, PremiumNarrative> {
    // Premium narratives remain in Korean as primary content 
    // (extensive prose content — English translations would require professional localization)
    return PremiumNarrativeLibrary;
}

export function getLocalizedCareerNarratives(locale: string) {
    // Career narratives remain in Korean as primary content
    return CareerNarrativeLibrary;
}
