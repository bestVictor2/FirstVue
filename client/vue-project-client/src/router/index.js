import { createRouter,createWebHistory } from "vue-router";
import card from "../views/card.vue";
import login from "../views/login.vue";
import logout from "../views/logout.vue"
import querycard from "../views/querycard.vue"
import recharge from "../views/recharge.vue"
import refund from "../views/refund.vue"
import deletecard from "../views/deletecard.vue"
import stat from '../views/stat.vue'
const routes=[
    {
        path:'/card',
        component:card
    },
    {
        path:'/login',
        component:login
    },
    {
        path:'/logout',
        component:logout
    },
    {
        path:'/querycard',
        component:querycard
    },
    {
        path:'/recharge',
        component:recharge
    },
    {
        path:'/refund',
        component:refund
    },
    {
        path:'/deletecard',
        component:deletecard
    },
    {
        path: '/stat',
        component: stat
    }
]
const router=createRouter({
    history:createWebHistory(),
    routes
})
export default router