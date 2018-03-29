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

import Applications from '@/components/Application/Applications'
import CreateApplication from '@/components/Application/CreateApplication'
import ShowApplication from '@/components/Application/ShowApplication'

import Forms from '@/components/Form/Forms'
import CreateForm from '@/components/Form/CreateForm'
import QuestionsAndSubmissions from '@/components/Form/QuestionsAndSubmissions'

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
      component: Home
    },
    {
      path: '/applications',
      name: 'Applications',
      component: Applications
    },
    {
      path: '/applications/new',
      name: 'CreateApplication',
      component: CreateApplication
    },
    {
      path: '/applications/show/:id',
      name: 'ShowApplication',
      component: ShowApplication,
      props: true
    },
    {
      path: '/applications/:application_id/teams',
      name: 'Teams',
      component: Teams,
      props: true
    },
    {
      path: '/applications/:application_id/teams/new',
      name: 'CreateTeam',
      component: CreateTeam,
      props: true
    },
    {
      path: '/applications/:application_id/teams/show/:id',
      name: 'ShowTeam',
      component: ShowTeam,
      props: true
    },
    {
      path: '/applications/:application_id/teams/:team_id/users/:id',
      name: 'ShowTeamUser',
      component: ShowTeamUser,
      props: true
    },
    {
      path: '/applications/:application_id/users',
      name: 'Users',
      component: Users,
      props: true
    },
    {
      path: '/applications/:application_id/users/show/:id',
      name: 'ShowUser',
      component: ShowUser,
      props: true
    },
    {
      path: '/applications/:application_id/forms',
      name: 'Forms',
      component: Forms,
      props: true
    },
    {
      path: '/applications/:application_id/forms/new',
      name: 'CreateForm',
      component: CreateForm,
      props: true
    },
    // {
    //   path: '/applications/:application_id/forms/show/:id',
    //   name: 'ShowForm',
    //   component: ShowForm,
    //   props: true
    // },
    {
      path: '/applications/:application_id/forms/show/:id',
      name: 'QuestionsAndSubmissions',
      component: QuestionsAndSubmissions,
      props: true
    }
  ],
  mode: 'history'
})

export default router
