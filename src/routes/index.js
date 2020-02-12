/**
 * @description 路由配置项
 * @time 2020/1/6
 * @author Aiden
 */
import NotFound from '../pages/404'
import Book from '../pages/Book'
import Collect from '../pages/Collect'
import UserFeedBack from '../pages/Feedback'
import Login from '../pages/Login'
import Search from '../pages/search'
import Video from '../pages/Video'
import VideoDetail from '../pages/VideoDetail'

// function changeTitle(title) {
//     console.log(this);

//     document.title = title
// }

const routesItem = (item, component) => ({
	path: `/${item}`,
	key: `${item.split('/')[0]}`,
	component
})
const routes = [
    routesItem('video', Video),
    routesItem('videoDetail/:id/:code?', VideoDetail),
    routesItem('search/type=:name', Search),
    routesItem('login/:id?/:invitation_code?', Login),
    routesItem('book/:bookId?/:invitation_code?', Book),
    routesItem('userfeedback', UserFeedBack),
    routesItem('collect', Collect),
    routesItem('', NotFound),
]
export default routes
