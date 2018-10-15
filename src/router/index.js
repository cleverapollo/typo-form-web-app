import Vue from 'vue'
import Router from 'vue-router'

// Home
import Home from '@/components/Home'

// Profile
import Profile from '@/components/Auth/Profile'
import Register from '@/components/Auth/Register'
import Login from '@/components/Auth/Login'
import NewPassword from '@/components/Auth/NewPassword'
import ResetPassword from '@/components/Auth/ResetPassword'
import AcceptJoin from '@/components/Shared/AcceptJoin'

// Applications
import Applications from '@/components/Application/Applications'
import Application from '@/components/Application/Application'
import ApplicationSettings from '@/components/Application/ApplicationSettings'

// Users
import Users from '@/components/User/Users'

// Teams
import Teams from '@/components/Team/Teams'
import ShowTeam from '@/components/Team/ShowTeam'

// Forms
import Forms from '@/components/Form/Forms'
import ShowForm from '@/components/Form/ShowForm'

// Submissions
import Submissions from '@/components/Form/Submission/Submissions'
import ShowSubmission from '@/components/Form/Submission/ShowSubmission'
import SubmissionFilter from '@/components/Form/Submission/SubmissionFilter'

import {store} from '@/store'
import parseDomain from 'parse-domain'

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
      path: '/',
      component: Home
    },
    {
      path: '/applications',
      name: 'Applications',
      component: Applications,
      meta: {requiresAuth: true}
    },
    {
      path: '/dashboard',
      name: 'Application',
      component: Application,
      meta: {
        application: true,
        requiresAuth: true
      }
    },
    {
      path: '/teams',
      name: 'Teams',
      component: Teams,
      meta: {
        application: true,
        requiresAuth: true
      }
    },
    {
      path: '/teams/:id',
      name: 'ShowTeam',
      component: ShowTeam,
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
      path: '/forms',
      name: 'Forms',
      component: Forms,
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
      path: '/submissions',
      name: 'Submissions',
      component: Submissions,
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
      path: '/submissions/:id',
      name: 'ShowSubmission',
      component: ShowSubmission,
      props: true,
      meta: {
        application: true,
        requiresAuth: true
      }
    },
    {
      path: '/submissionfilter',
      name: 'SubmissionFilter',
      component: SubmissionFilter,
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

// Redirect unauthenticated users
router.afterEach((to, from) => {
  if (!store.getters.user && to.meta.requiresAuth) {
    router.push({
      path: '/login',
      query: {redirect: to.fullPath}
    })
  }
})

// Set Document Information (Title, Favicon, CSS, Background Image)
router.beforeEach((to, from, next) => {
  const domain = parseDomain(window.location.hostname, { customTlds: ['local'] })
  const favicon = document.getElementById('dyc-favicon')
  const style = document.getElementById('dyc-css')
  let application = []
  store.dispatch('loadApplication', domain.subdomain)
  .then(response => {
    application = response.data.application
  })
  .catch(() => { })
  .finally(() => {
    document.title = application.name || process.env.APP_NAME
    favicon.href = application.icon && JSON.parse(application.icon).url ? JSON.parse(application.icon).url : '/static/icon.png'
    style.innerHTML = application.css || ''
    // Set Background Image
    let backgroundImage = application.icon && JSON.parse(application.background_image).url ? JSON.parse(application.background_image).url : '/static/background.jpg'
    document.body.style.backgroundImage = !to.meta.requiresAuth ? 'url(' + backgroundImage + ')' : ''
    next()
  })
})

export default router
