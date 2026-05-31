type NavRouteType = {
    name: string,
    route: string,
    icon: string
}
export const NavRoutes:NavRouteType []= [
    {
        name: 'Home',
        route: '/',
        icon: 'home'
    },
    {
        name: 'Store',
        route: '/store',
        icon: 'store'
    },
    {
        name: 'About',
        route: '/about',
        icon: 'info'
    },
    {
        name: 'Contact',
        route: '/contact',
        icon: 'contact'
    }
]