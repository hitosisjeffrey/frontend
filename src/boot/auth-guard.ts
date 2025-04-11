
import type { RouteLocationNormalized, NavigationGuardNext, Router } from 'vue-router'

const boot = ({ router }: { router: Router }) => {
    router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        const token = localStorage.getItem('access_token')

        const publicPages = ['/login']
        const authRequired = !publicPages.includes(to.path)

        if (authRequired && !token) {
            next('/login')
        } else {
            next()
        }
    })
}

export default boot
