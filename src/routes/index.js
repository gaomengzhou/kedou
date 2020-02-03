import NotFound from '../pages/404'
import Book from '../pages/Book'
import Collect from '../pages/Collect'
import UserFeedBack from '../pages/Feedback'
import Search from '../pages/search'
import Video from '../pages/Video'
import VideoDetail from '../pages/VideoDetail'
import Login from '../pages/Login'
const routes = [
    {
        path: '/video',
        key: 'video',
        component: Video
    },
    {
        path: '/detailVideo/:id/:code?',
        key: 'detailVideo',
        component: VideoDetail
    },
    {
        path: '/search/type=:name',
        key: 'search',
        component: Search
    },
    {
        path: '/login/:id?/:invitation_code?',
        key: 'login',
        component: Login
    },
    {
        path: '/book',
        key: 'book',
        component: Book,
    },
    {
        path: '/book/:id',
        key: 'book',
        component: Book,
    },
    {
        path: '/userfeedback',
        key: 'userfeedback',
        component: UserFeedBack
    },
    {
        path: '/collect',
        key: 'collect',
        component: Collect
    },
    {
        path: '',
        key: 'notFound',
        component: NotFound
    },
]
export default routes
