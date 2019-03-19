import Vue from 'vue'
import Router from 'vue-router'

// Profile
import Profile from '@/components/Auth/Profile'
import Register from '@/components/Auth/Register'
import Login from '@/components/Auth/Login'
import NewPassword from '@/components/Auth/NewPassword'
import ResetPassword from '@/components/Auth/ResetPassword'
import AcceptJoin from '@/components/Shared/AcceptJoin'

// Applications
import Applications from '@/components/Application/Applications'
import Dashboard from '@/components/Dashboard/Dashboard'
import ApplicationSettings from '@/components/Application/ApplicationSettings'

// Users
import Users from '@/components/User/Users'

// Organisations
import Organisations from '@/components/Organisation/Organisations'
import ShowOrganisation from '@/components/Organisation/ShowOrganisation'

// FormTemplates
import FormTemplates from '@/components/Form/FormTemplates'
import ShowFormTemplate from '@/components/Form/ShowFormTemplate'

// Forms
import Forms from '@/components/Form/Form/Forms'
import ShowForm from '@/components/Form/Form/ShowForm'
import ReportBuilder from '@/components/Form/Form/ReportBuilder'
import CompareForms from '@/components/Form/Form/CompareForms'
import ChartBuilder from '@/components/Form/Form/ChartBuilder'

import {store} from '@/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/password/reset/:token',
      name: 'NewPassword',
      component: NewPassword,
      props: true
    },
    {
      path: '/password/reset',
      name: 'ResetPassword',
      component: ResetPassword,
      props: true
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {requiresAuth: true}
    },
    {
      path: '/join/:type/:token',
      name: 'AcceptJoin',
      component: AcceptJoin,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/applications',
      name: 'Applications',
      component: Applications,
      meta: {requiresAuth: true}
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        application: true,
        requiresAuth: true
      }
    },
    {
      path: '/organisations',
      name: 'Organisations',
      component: Organisations,
      meta: {
        application: true,
        requiresAuth: true
      }
    },
    {
      path: '/organisations/:id',
      name: 'ShowOrganisation',
      component: ShowOrganisation,
      props: true,
      meta: {
        application: true,
        requiresAuth: true
      }
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
      meta: {
        application: true,
        requiresAuth: true
      }
    },
    {
      path: '/form-templates',
      name: 'FormTemplates',
      component: FormTemplates,
      meta: {
        application: true,
        requiresAuth: true
      }
    },
    {
      path: '/form-templates/:id',
      name: 'ShowFormTemplate',
      component: ShowFormTemplate,
      props: true,
      meta: {
        application: true,
        requiresAuth: true
      }
    },
    {
      path: '/forms',
      name: 'Forms',
      component: Forms,
      meta: {
        application: true,
        requiresAuth: true
      }
    },
    {
      path: '/settings',
      name: 'ApplicationSettings',
      component: ApplicationSettings,
      meta: {
        application: true,
        requiresAuth: true
      }
    },
    {
      path: '/forms/:id',
      name: 'ShowForm',
      component: ShowForm,
      props: true,
      meta: {
        application: true,
        requiresAuth: true
      }
    },
    {
      path: '/report',
      name: 'ReportBuilder',
      component: ReportBuilder,
      meta: {
        application: true,
        requiresAuth: true
      }
    },
    {
      path: '/compare',
      name: 'CompareForms',
      component: CompareForms,
      meta: {
        application: true,
        requiresAuth: true
      }
    },
    {
      path: '/chart',
      name: 'ChartBuilder',
      component: ChartBuilder,
      meta: {
        application: true,
        requiresAuth: true
      }
    },
    {
      path: '/auth/callback',
      component: {
        template: '<div class="auth-component"></div>'
      }
    }
  ],
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  // Set Application Branding and Content
  const slug = window.location.hostname.split('.')[0]
  const favicon = document.getElementById('dyc-favicon')
  const style = document.getElementById('dyc-css')
  let application = {}
  store.dispatch('loadApplication', slug)
  .then(response => {
    application = response.data.application
  })
  .catch(() => { })
  .finally(() => {
    document.title = application.name || process.env.APP_NAME
    favicon.href = application.icon && JSON.parse(application.icon) ? JSON.parse(application.icon).url : '/static/icon.png'
    style.innerHTML = application.css || ''
    let backgroundImage = application.background_image && JSON.parse(application.background_image) ? JSON.parse(application.background_image).url : '/static/background.jpg'
    document.body.style.backgroundImage = !to.meta.requiresAuth ? 'url(' + backgroundImage + ')' : ''
     // Redirect Unauthenticated Users to login
    if (!store.getters.user && to.meta.requiresAuth) {
      router.push({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
    // Redirect Authenticated Users where no application found
    if (store.getters.user && !application.slug && to.meta.application) {
      window.location.href = '/applications?application=false'
    }

    const defaultRoute = (application.default_route ? application.default_route : '/forms')
    if (to.fullPath === '/') {
      router.push({
        path: defaultRoute
      })
    }
    next()
  })
})

export default router
