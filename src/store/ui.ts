import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeName = 'evergreen' | 'marigold' | 'gulal' | 'neem'

export type UIState = {
  readonly isMiniCartOpen: boolean
  readonly isMenuOpen: boolean
  readonly activeTheme: ThemeName
  readonly reducedMotion: boolean
  readonly openMiniCart: () => void
  readonly closeMiniCart: () => void
  readonly toggleMenu: () => void
  readonly closeMenu: () => void
  readonly setTheme: (theme: ThemeName) => void
  readonly setReducedMotion: (value: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isMiniCartOpen: false,
      isMenuOpen: false,
      activeTheme: 'evergreen',
      reducedMotion: false,
      openMiniCart: () => set({ isMiniCartOpen: true }),
      closeMiniCart: () => set({ isMiniCartOpen: false }),
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
      closeMenu: () => set({ isMenuOpen: false }),
      setTheme: (theme) => {
        document.documentElement.dataset.theme = theme
        set({ activeTheme: theme })
      },
      setReducedMotion: (value) => set({ reducedMotion: value }),
    }),
    {
      name: 'varoganic-ui',
      partialize: (state) => ({ activeTheme: state.activeTheme, reducedMotion: state.reducedMotion }),
      onRehydrateStorage: () => (state, error) => {
        if (!state || error) {
          return
        }
        document.documentElement.dataset.theme = state.activeTheme
      },
    },
  ),
)
