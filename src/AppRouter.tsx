import { Suspense, lazy, useEffect, useMemo, useState, type LazyExoticComponent, type ReactElement } from 'react'

import { Skeleton } from '@/components/common/Skeleton'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { SplashScreen } from '@/components/layout/SplashScreen'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { trackPageView } from '@/lib/analytics'
import { useUIStore } from '@/store/ui'

const HomeRoute = lazy(async () => import('@/routes/HomeRoute').then((module) => ({ default: module.HomeRoute })))
const ShopRoute = lazy(async () => import('@/routes/ShopRoute').then((module) => ({ default: module.ShopRoute })))
const NewRoute = lazy(async () => import('@/routes/NewRoute').then((module) => ({ default: module.NewRoute })))
const BundlesRoute = lazy(async () => import('@/routes/BundlesRoute').then((module) => ({ default: module.BundlesRoute })))
const IngredientsRoute = lazy(async () => import('@/routes/IngredientsRoute').then((module) => ({ default: module.IngredientsRoute })))
// Temporarily commented out - customers shop on Flipkart
// const CartRoute = lazy(async () => import('@/routes/CartRoute').then((module) => ({ default: module.CartRoute })))
const ProductRoute = lazy(async () => import('@/routes/ProductRoute').then((module) => ({ default: module.ProductRoute })))
// const AccountRoute = lazy(async () => import('@/routes/AccountRoute').then((module) => ({ default: module.AccountRoute })))
const AboutRoute = lazy(async () => import('@/routes/AboutRoute').then((module) => ({ default: module.AboutRoute })))
const NotFoundRoute = lazy(async () => import('@/routes/NotFoundRoute').then((module) => ({ default: module.NotFoundRoute })))
const ContentRoute = lazy(async () => import('@/routes/ContentRoute').then((module) => ({ default: module.ContentRoute })))

const routeMap: Record<string, LazyExoticComponent<() => ReactElement>> = {
  '/': HomeRoute,
  '/shop': ShopRoute,
  '/collections/new': NewRoute,
  '/collections/bundles': BundlesRoute,
  '/ingredients': IngredientsRoute,
  // '/cart': CartRoute,  // Temporarily commented out - customers shop on Flipkart
  '/product': ProductRoute,
  // '/account': AccountRoute,  // Temporarily commented out - customers shop on Flipkart
  '/about': AboutRoute,
  '/shop/all-products': ContentRoute,
  '/shop/new-arrivals': ContentRoute,
  '/shop/gift-bundles': ContentRoute,
  '/ingredient-stories': ContentRoute,
  '/help/faqs': ContentRoute,
  '/help/track-order': ContentRoute,
  '/about/sustainability': ContentRoute,
  '/press': ContentRoute,
  '/careers': ContentRoute,
  '/policies/privacy': ContentRoute,
  '/policies/terms': ContentRoute,
  '/policies/cookies': ContentRoute,
  '/policies/accessibility': ContentRoute,
}

const isKnownRoute = (path: string): path is keyof typeof routeMap => path in routeMap

/**
 * Minimal router leaning on native navigation while the project evolves.
 */
export const AppRouter = (): ReactElement => {
  const [pathname, setPathname] = useState<string>(() => window.location.pathname)
  const [booting, setBooting] = useState(true)
  const prefersReducedMotion = useReducedMotionSafe()
  const setReducedMotion = useUIStore((state) => state.setReducedMotion)

  useEffect(() => {
    const handlePopState = (): void => {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    setReducedMotion(prefersReducedMotion)
  }, [prefersReducedMotion, setReducedMotion])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBooting(false)
    }, 1600)
    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!booting) {
      document.body.style.removeProperty('overflow')
      return
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [booting])

  const CurrentRoute = useMemo(() => {
    const sanitized = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname
    if (isKnownRoute(sanitized)) {
      return routeMap[sanitized]
    }
    return NotFoundRoute
  }, [pathname])

  useEffect(() => {
    trackPageView(window.location.pathname + window.location.search)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col bg-paper text-body">
      <SplashScreen visible={booting} />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<RouteSkeleton />}>
          <CurrentRoute />
        </Suspense>
      </main>
      <Footer />
      <MobileBottomNav />
      <Suspense fallback={null}>
        <MobilePromoSheet />
      </Suspense>
      {/* Temporarily commented out - customers shop on Flipkart */}
      {/* <Suspense fallback={null}>
        <MiniCart />
      </Suspense> */}
    </div>
  )
}

const RouteSkeleton = (): ReactElement => {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12">
      <Skeleton className="h-8 w-44" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-10 w-full rounded-2xl" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    </div>
  )
}
// Temporarily commented out - customers shop on Flipkart
// const MiniCart = lazy(async () => import('@/components/commerce/MiniCart').then((module) => ({ default: module.MiniCart })))
const MobilePromoSheet = lazy(async () =>
  import('@/components/layout/MobilePromoSheet').then((module) => ({ default: module.MobilePromoSheet })),
)
