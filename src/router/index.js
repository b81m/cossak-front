import {createRouter,createWebHistory} from 'vue-router';

import LoginForm from '../components/LoginForm.vue'
import UploadForm from "@/components/UploadForm.vue";
import AllCertificates from "@/components/AllCertificates.vue";
import CertificateInfo from "@/components/CertificateInfo.vue";

const routes = [
    {
        path: '/',
        name: 'Login',
        component: LoginForm,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/upload',
        name: 'Upload',
        component: UploadForm,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/all',
        name: 'AllCertificates',
        component: AllCertificates,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/cossak/:imageId',
        name: 'CertificateInfo',
        component: CertificateInfo,
        meta: {
            requiresAuth: true
        }
    }
];

const router = createRouter(
    {
        history: createWebHistory(),
        routes,
    }
)

router.beforeEach((to, from, next) => {
    const requiresAuth = to.meta.requiresAuth;

    const token = localStorage.getItem('user-token');

    if (requiresAuth && !token) {
        next({ name: 'Login' });
    } else {
        next();
    }
});

export default router;