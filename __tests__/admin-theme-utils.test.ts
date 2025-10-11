import { 
  adminTheme, 
  getAdminThemeClasses, 
  a11y, 
  animations, 
  responsive, 
  status 
} from '@/lib/admin-theme-utils'

describe('Admin Theme Utils', () => {
  describe('adminTheme', () => {
    it('generates correct sidebar classes', () => {
      const classes = adminTheme.sidebar()
      expect(classes).toContain('bg-white')
      expect(classes).toContain('dark:bg-gray-800')
      expect(classes).toContain('transition-colors')
    })

    it('generates correct card classes', () => {
      const classes = adminTheme.card()
      expect(classes).toContain('bg-white')
      expect(classes).toContain('dark:bg-gray-800')
      expect(classes).toContain('shadow-sm')
      expect(classes).toContain('dark:shadow-lg')
    })

    it('generates correct button classes', () => {
      const primaryClasses = adminTheme.button.primary()
      expect(primaryClasses).toContain('bg-blue-600')
      expect(primaryClasses).toContain('hover:bg-blue-700')
      expect(primaryClasses).toContain('text-white')

      const secondaryClasses = adminTheme.button.secondary()
      expect(secondaryClasses).toContain('bg-gray-100')
      expect(secondaryClasses).toContain('dark:bg-gray-700')

      const ghostClasses = adminTheme.button.ghost()
      expect(ghostClasses).toContain('hover:bg-gray-100')
      expect(ghostClasses).toContain('dark:hover:bg-gray-700')
    })

    it('generates correct input classes', () => {
      const classes = adminTheme.input()
      expect(classes).toContain('bg-white')
      expect(classes).toContain('dark:bg-gray-900')
      expect(classes).toContain('border-gray-300')
      expect(classes).toContain('dark:border-gray-600')
    })

    it('generates correct navigation classes', () => {
      const activeClasses = adminTheme.navigation.active()
      expect(activeClasses).toContain('bg-blue-100')
      expect(activeClasses).toContain('dark:bg-blue-900')

      const inactiveClasses = adminTheme.navigation.inactive()
      expect(inactiveClasses).toContain('text-gray-700')
      expect(inactiveClasses).toContain('dark:text-gray-300')
    })

    it('generates correct text classes', () => {
      const primaryText = adminTheme.text.primary()
      expect(primaryText).toContain('text-gray-900')
      expect(primaryText).toContain('dark:text-white')

      const secondaryText = adminTheme.text.secondary()
      expect(secondaryText).toContain('text-gray-600')
      expect(secondaryText).toContain('dark:text-gray-300')

      const mutedText = adminTheme.text.muted()
      expect(mutedText).toContain('text-gray-500')
      expect(mutedText).toContain('dark:text-gray-400')
    })
  })

  describe('a11y (accessibility)', () => {
    it('generates correct focus ring classes', () => {
      const classes = a11y.focusRing()
      expect(classes).toContain('focus-visible:outline-none')
      expect(classes).toContain('focus-visible:ring-2')
      expect(classes).toContain('focus-visible:ring-blue-500')
      expect(classes).toContain('dark:focus-visible:ring-blue-400')
    })

    it('generates correct high contrast classes', () => {
      const classes = a11y.highContrast()
      expect(classes).toContain('contrast-more:border-black')
      expect(classes).toContain('dark:contrast-more:border-white')
    })

    it('generates correct reduced motion classes', () => {
      const classes = a11y.reducedMotion()
      expect(classes).toContain('motion-reduce:transition-none')
      expect(classes).toContain('motion-reduce:animate-none')
    })
  })

  describe('animations', () => {
    it('generates correct animation classes', () => {
      expect(animations.fadeIn()).toContain('animate-in')
      expect(animations.slideIn()).toContain('slide-in-from-left-2')
      expect(animations.scaleIn()).toContain('zoom-in-95')
      expect(animations.themeTransition()).toContain('transition-all')
    })
  })

  describe('responsive', () => {
    it('generates correct sidebar responsive classes', () => {
      const mobileClasses = responsive.sidebar.mobile()
      expect(mobileClasses).toContain('fixed')
      expect(mobileClasses).toContain('lg:translate-x-0')
      expect(mobileClasses).toContain('transform')

      const desktopClasses = responsive.sidebar.desktop()
      expect(desktopClasses).toContain('hidden')
      expect(desktopClasses).toContain('lg:flex')
    })

    it('generates correct main content classes', () => {
      const withSidebarClasses = responsive.main.withSidebar()
      expect(withSidebarClasses).toContain('lg:ml-64')

      const fullWidthClasses = responsive.main.fullWidth()
      expect(fullWidthClasses).toContain('w-full')
    })
  })

  describe('status', () => {
    it('generates correct status classes', () => {
      const successClasses = status.success()
      expect(successClasses).toContain('text-green-600')
      expect(successClasses).toContain('dark:text-green-400')
      expect(successClasses).toContain('bg-green-50')

      const warningClasses = status.warning()
      expect(warningClasses).toContain('text-yellow-600')
      expect(warningClasses).toContain('dark:text-yellow-400')

      const errorClasses = status.error()
      expect(errorClasses).toContain('text-red-600')
      expect(errorClasses).toContain('dark:text-red-400')

      const infoClasses = status.info()
      expect(infoClasses).toContain('text-blue-600')
      expect(infoClasses).toContain('dark:text-blue-400')
    })
  })

  describe('getAdminThemeClasses', () => {
    it('combines light and dark classes correctly', () => {
      const cardClasses = getAdminThemeClasses('card')
      
      expect(cardClasses.bg).toContain('bg-white')
      expect(cardClasses.bg).toContain('dark:bg-gray-800')
      expect(cardClasses.border).toContain('border-gray-200')
      expect(cardClasses.border).toContain('dark:border-gray-700')
    })
  })
})