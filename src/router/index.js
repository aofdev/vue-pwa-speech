import Vue from 'vue'
import Router from 'vue-router'
const Speech = () => import('@/components/Speech')


Vue.use(Router)

export default new Router({
   mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Speech',
      component: Speech
    }
  ]
})
