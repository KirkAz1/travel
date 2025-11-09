// 导入页面组件
import Home from '@/views/Home.vue'
import Contact from '@/views/Contact.vue'
import Holiday from '@/views/Holiday.vue'
import Testimonial from '@/views/Testimonial.vue'
import SearchResult from '@/views/SearchResult.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/holiday', name: 'Holiday', component: Holiday },
  { path: '/testimonial', name: 'Testimonial', component: Testimonial },
  { path: '/search', name: 'Search', component: SearchResult },
]

export default routes
