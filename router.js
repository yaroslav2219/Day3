import { login } from './login.js';
import { campaigns } from './campaigns.js';

export const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: '/', name:'Sign in', component: login },
        { path: '/campaigns', name:'Campaigns', component: campaigns },
    ]
});




