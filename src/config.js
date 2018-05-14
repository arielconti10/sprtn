const config = {
    title: 'Spartan',
    company: {
        name: "FTD Educação",
        url: 'http://www.ftd.com.br'
    },
    routes: {
        items: [
            {
                name: 'Dashboard',
                component: 'Dashboard',
                path: '/dashboard',
                icon: 'icon-speedometer',
                badge: {
                    variant: 'info',
                    text: 'NEW'
                }
            }
        ]
    },
}

export default config;