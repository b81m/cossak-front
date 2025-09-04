import {createRouter,createWebHistory} from 'vue-router';

import LoginForm from '../components/LoginForm.vue'
import UploadForm from "@/components/UploadForm.vue";
import AllCertificates from "@/components/AllCertificates.vue";

const routes = [
    { path: '/', component: LoginForm },
    { path: '/upload', component: UploadForm },
    { path: '/all', component: AllCertificates },
]

const router = createRouter(
    {
        history: createWebHistory(),
        routes,
    }
)

export default router;