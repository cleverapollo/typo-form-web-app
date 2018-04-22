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
      component: Profile
    },
    {
      path: '/invitation/:type/:token',
      name: 'AcceptInvitation',
      component: AcceptInvitation,
      props: true
    },
    {
      path: '/join/:type/:token',
      name: 'AcceptJoin',
      component: AcceptJoin,
      props: true
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requireAuth: true }
    },
    {
      path: '/applications',
      name: 'Applications',
      component: Applications,
      meta: { requireAuth: true }
    },
    {
      path: '/applications/new',
      name: 'CreateApplication',
      component: CreateApplication,
      meta: { requireAuth: true }
    },
    {
      path: '/:applicationName',
      name: 'Application',
      component: Application,
      props: true,
      meta: { requireAuth: true }
    },
    {
      path: '/:applicationName/show',
      name: 'ShowApplication',
      component: ShowApplication,
      props: true,
      meta: { requireAuth: true }
    },
    {
      path: '/:applicationName/teams',
      name: 'Teams',
      component: Teams,
      props: true,
      meta: { requireAuth: true }
    },
    {
      path: '/:applicationName/teams/new',
      name: 'CreateTeam',
      component: CreateTeam,
      props: true,
      meta: { requireAuth: true }
    },
    {
      path: '/:applicationName/teams/show/:id',
      name: 'ShowTeam',
      component: ShowTeam,
      props: true,
      meta: { requireAuth: true }
    },
    {
      path: '/:applicationName/teams/:teamId/users/:id',
      name: 'ShowTeamUser',
      component: ShowTeamUser,
      props: true,
      meta: { requireAuth: true }
    },
    {
      path: '/:applicationName/users',
      name: 'Users',
      component: Users,
      props: true,
      meta: { requireAuth: true }
    },
    {
      path: '/:applicationName/users/show/:id',
      name: 'ShowUser',
      component: ShowUser,
      props: true,
      meta: { requireAuth: true }
    },
    {
      path: '/:applicationName/forms',
      name: 'Forms',
      component: Forms,
      props: true,
      meta: { requireAuth: true }
    },
    {
      path: '/:applicationName/forms/new',
      name: 'CreateForm',
      component: CreateForm,
      props: true,
      meta: { requireAuth: true }
    },
    {
      path: '/:applicationName/forms/show/:id',
      name: 'ShowForm',
      component: ShowForm,
      props: true,
      meta: { requireAuth: true }
    }
  ],
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  document.title = to.params['applicationName'] || 'Informed 365'
  const expireDate = localStorage.getItem('expire_date')
  const previous = localStorage.getItem('previous')
  console.log(to.path)
  if (!to.meta || !to.meta.requireAuth) {
    next()
  } else if ((expireDate === null || Date.now() - expireDate > 86400000) && (to.name !== 'Signin') && (to.name !== 'Signup')) {
    localStorage.setItem('previous', to.path)
    next('/signin')
  } else if ((expireDate !== null && Date.now() - expireDate < 86400000) && previous) {
    localStorage.removeItem('previous')
    next(previous)
  } else {
    next()
  }
})

export default router
