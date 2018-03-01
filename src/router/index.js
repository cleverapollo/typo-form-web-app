import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

import Teams from '@/components/Team/Teams'
import CreateTeam from '@/components/Team/CreateTeam'
import ShowTeam from '@/components/Team/ShowTeam'

import Profile from '@/components/User/Profile'
import Signup from '@/components/User/Signup'
import Signin from '@/components/User/Signin'

Vue.use(Router)

export default new Router({
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
