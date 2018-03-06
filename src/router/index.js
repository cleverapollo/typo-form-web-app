import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

import Teams from '@/components/Team/Teams'
import CreateTeam from '@/components/Team/CreateTeam'
import ShowTeam from '@/components/Team/ShowTeam'

import Profile from '@/components/User/Profile'
import Signup from '@/components/User/Signup'
import Signin from '@/components/User/Signin'

import Applications from '@/components/Application/Applications'
import CreateApplication from '@/components/Application/CreateApplication'
import ShowApplication from '@/components/Application/ShowApplication'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/teams',
      name: 'Teams',
      component: Teams
    },
    {
      path: '/teams/new',
      name: 'CreateTeam',
      component: CreateTeam
    },
    {
      path: '/teams/show/:id',
      name: 'ShowTeam',
      component: ShowTeam,
      props: true
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
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    }
  ],
  mode: 'history'
})

export default router
