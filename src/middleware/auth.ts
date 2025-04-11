import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router'

export default ({ next, router, route }: { next: NavigationGuardNext, router: Router, route: RouteLocationNormalized }) => {
    const token = localStorage.getItem('access_token')

    if (!token && route.path !== '/login') {
        return router.push('/login')
    }
    return next()
}