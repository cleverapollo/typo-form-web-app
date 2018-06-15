import Vue from 'vue'
import Router from 'vue-router'

// Profile
import Profile from '@/components/Auth/Profile'
import Register from '@/components/Auth/Register'
import Login from '@/components/Auth/Login'
import NewPassword from '@/components/Auth/NewPassword'
import ResetPassword from '@/components/Auth/ResetPassword'
import AcceptInvitation from '@/components/Shared/AcceptInvitation'
import AcceptJoin from '@/components/Shared/AcceptJoin'

// Applications
import Applications from '@/components/Application/Applications'
import Application from '@/components/Application/Application'

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
      path: '/invitation/:type/:token',
      name: 'AcceptInvitation',
      component: AcceptInvitation,
      props: true,
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
      redirect: '/applications'
    },
    {
      path: '/applications',
      name: 'Applications',
      component: Applications,
      meta: {requiresAuth: true}
    },
    {
      path: '/:slug',
      name: 'Application',
      component: Application,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/:slug/teams',
      name: 'Teams',
      component: Teams,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/:slug/teams/:id',
      name: 'ShowTeam',
      component: ShowTeam,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/:slug/users',
      name: 'Users',
      component: Users,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/:slug/forms',
      name: 'Forms',
      component: Forms,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/:slug/forms/:id',
      name: 'ShowForm',
      component: ShowForm,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/:slug/submissions',
      name: 'Submissions',
      component: Submissions,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/:slug/submissions/:id',
      name: 'ShowSubmission',
      component: ShowSubmission,
      props: true,
      meta: {requiresAuth: true}
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

router.beforeEach((to, from, next) => {
  const favicon = document.getElementById('dyc-favicon')
  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.getElementById('dyc-css') || document.createElement('style')
  style.type = 'text/css'
  style.id = 'dyc-css'
  if (to.matched.some(record => record.path.includes(':slug'))) {
    store.dispatch('loadApplication', to.params['slug'])
      .then(() => {
        const application = store.getters.loadedApplication(to.params['slug'])

        favicon.href = application.icon ? application.icon : '/static/logo.png'
        const css = application.css ? application.css : ''
        if (style.childNodes.length) {
          style.childNodes[0].textContent = css
        } else {
          style.appendChild(document.createTextNode(css))
        }
        head.appendChild(style)
        document.title = application ? application.name : process.env.APP_NAME
        next()
      })
      .catch(() => next({path: '/'}))
  } else {
    favicon.href = '/static/logo.png'
    if (style.childNodes.length) {
      style.childNodes[0].textContent = ''
    }
    head.appendChild(style)
    document.title = process.env.APP_NAME
    next()
  }
})

export default router
