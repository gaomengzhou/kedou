import NotFound from '../pages/404'
import Book from '../pages/Book'
import Collect from '../pages/Collect'
import UserFeedBack from '../pages/Feedback'
import Search from '../pages/search'
import Test from '../pages/test'
import Video from '../pages/Video'
import VideoDetail from '../pages/VideoDetail'
const routes = [
    {
        path: '/video',
        key: 'video',
        component: Video
    },
    {
        path: '/test',
        key: 'test',
        component: Test
    },
    {
        path: '/detailVideo/video_id=:id',
        key: 'detailVideo',
        component: VideoDetail
    },
    {
        path: '/search/type=:name',
        key: 'search',
        component: Search
    },
    {
        path: '/book',
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
