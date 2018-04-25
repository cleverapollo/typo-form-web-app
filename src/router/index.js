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

import { store } from '@/store'

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
      path: '/reset-password',
      name: 'ResetPassword',
      component: ResetPassword,
      props: true
    },
    {
      path: '/reset-password/:token',
      name: 'NewPassword',
      component: NewPassword,
      props: true
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: '/invitation/:type/:token',
      name: 'AcceptInvitation',
      component: AcceptInvitation,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/join/:type/:token',
      name: 'AcceptJoin',
      component: AcceptJoin,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/applications',
      name: 'Applications',
      component: Applications,
      meta: { requiresAuth: true }
    },
    {
      path: '/applications/new',
      name: 'CreateApplication',
      component: CreateApplication,
      meta: { requiresAuth: true }
    },
    {
      path: '/:applicationName',
      name: 'Application',
      component: Application,
      props: true
    },
    {
      path: '/:applicationName/show',
      name: 'ShowApplication',
      component: ShowApplication,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/:applicationName/teams',
      name: 'Teams',
      component: Teams,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/:applicationName/teams/new',
      name: 'CreateTeam',
      component: CreateTeam,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/:applicationName/teams/show/:id',
      name: 'ShowTeam',
      component: ShowTeam,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/:applicationName/teams/:teamId/users/:id',
      name: 'ShowTeamUser',
      component: ShowTeamUser,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/:applicationName/users',
      name: 'Users',
      component: Users,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/:applicationName/users/show/:id',
      name: 'ShowUser',
      component: ShowUser,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/:applicationName/forms',
      name: 'Forms',
      component: Forms,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/:applicationName/forms/new',
      name: 'CreateForm',
      component: CreateForm,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/:applicationName/forms/show/:id',
      name: 'ShowForm',
      component: ShowForm,
      props: true,
      meta: { requiresAuth: true }
    }
    /* {
      path: '*',
      component: { template: '<div>404 page</div>' }
    } */
  ],
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  document.title = to.params['applicationName'] || 'Informed 365'
  if (to.matched.some(record => record.meta.requiresAuth) && store.getters.user === null) {
    next({
      path: '/signin',
      query: { redirect: to.fullPath }
    })
  }
  if (to.matched.some(record => record.path.includes(':applicationName'))) {
    store.dispatch('loadApplication', to.params['applicationName'])
      .then(() => next())
      .catch(() => next({ path: '/' }))
  } else {
    next()
  }
})

export default router
