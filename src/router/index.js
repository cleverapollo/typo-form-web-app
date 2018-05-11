import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

import Profile from '@/components/Auth/Profile'
import Signup from '@/components/Auth/Signup'
import Signin from '@/components/Auth/Signin'
import NewPassword from '@/components/Auth/NewPassword'
import ResetPassword from '@/components/Auth/ResetPassword'
import AcceptInvitation from '@/components/Shared/AcceptInvitation'
import AcceptJoin from '@/components/Shared/AcceptJoin'

import Teams from '@/components/Team/Teams'
import CreateTeam from '@/components/Team/CreateTeam'
import ShowTeam from '@/components/Team/ShowTeam'
import ShowTeamUser from '@/components/Team/ShowTeamUser'

import Users from '@/components/User/Users'
import ShowUser from '@/components/User/ShowUser'

import Application from '@/components/Application/Application'
import Applications from '@/components/Application/Applications'
import CreateApplication from '@/components/Application/CreateApplication'
import ShowApplication from '@/components/Application/ShowApplication'

import Forms from '@/components/Form/Forms'
import CreateForm from '@/components/Form/CreateForm'
import ShowForm from '@/components/Form/ShowForm'

import {store} from '@/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
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
      name: 'Home',
      component: Home,
      meta: {requiresAuth: true}
    },
    {
      path: '/applications',
      name: 'Applications',
      component: Applications,
      meta: {requiresAuth: true}
    },
    {
      path: '/applications/new',
      name: 'CreateApplication',
      component: CreateApplication,
      meta: {requiresAuth: true}
    },
    {
      path: '/:slug',
      name: 'Application',
      component: Application,
      props: true
    },
    {
      path: '/:slug/show',
      name: 'ShowApplication',
      component: ShowApplication,
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
      path: '/:slug/teams/new',
      name: 'CreateTeam',
      component: CreateTeam,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/:slug/teams/show/:id',
      name: 'ShowTeam',
      component: ShowTeam,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/:slug/teams/:teamId/users/:id',
      name: 'ShowTeamUser',
      component: ShowTeamUser,
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
      path: '/:slug/users/show/:id',
      name: 'ShowUser',
      component: ShowUser,
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
      path: '/:slug/submissions',
      name: 'Submissions',
      component: Forms,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/:slug/forms/new',
      name: 'CreateForm',
      component: CreateForm,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/:slug/forms/show/:id/:view',
      name: 'ShowForm',
      component: ShowForm,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/auth/callback',
      component: {
        template: '<div class="auth-component"></div>'
      }
    }
    /* {
      path: '*',
      component: { template: '<div>404 page</div>' }
    } */
  ],
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  document.title = to.params['slug'] || 'Informed 365'
  if (to.matched.some(record => record.meta.requiresAuth) && store.getters.user === null) {
    next({
      path: '/signin',
      query: {redirect: to.fullPath}
    })
  }
  const favicon = document.getElementById('dyc-favicon')
  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.getElementById('dyc-css') || document.createElement('style')
  style.type = 'text/css'
  style.id = 'dyc-css'
  if (to.matched.some(record => record.path.includes(':slug'))) {
    store.dispatch('loadApplication', to.params['slug'])
      .then(() => {
        const application = store.getters.loadedApplication(to.params['slug'])

        favicon.href = application.icon ? process.env.API_ORIGIN_URL + 'uploads/' + application.icon : '/static/logo.png'
        const css = application.css ? application.css : ''
        if (style.childNodes.length) {
          style.childNodes[0].textContent = css
        } else {
          style.appendChild(document.createTextNode(css))
        }
        head.appendChild(style)
        next()
      })
      .catch(() => next({path: '/'}))
  } else {
    favicon.href = '/static/logo.png'
    if (style.childNodes.length) {
      style.childNodes[0].textContent = ''
    }
    head.appendChild(style)
    next()
  }
})

export default router
