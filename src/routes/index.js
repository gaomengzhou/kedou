/**
 * @description 路由配置项
 * @time 2020/1/6
 * @author Aiden
 */
import React from 'react';
import NotFound from '../pages/404'
import Book from '../pages/Book'
import Collect from '../pages/Collect'
import UserFeedBack from '../pages/Feedback'
import Login from '../pages/Login'
import Search from '../pages/search'
import Video from '../pages/Video'
import VideoDetail from '../pages/VideoDetail'
import Test from '../pages/test'
import Child from '../pages/test/component/child'
import Child2 from '../pages/test/component/child2'
import { Route } from 'react-router-dom'
const routesItem = (item, component, render) => ({
    path: `/${item}`,
    key: `${item.split('/')[0]}`,
    component: component || null,
    render: render || null
})
const child = {
    testChild: [
        routesItem('test/child1', Child),
        routesItem('test/child2', Child2),
    ]
}
const routes = [
    routesItem('video', Video),
    routesItem('videoDetail/:id/:code?', VideoDetail),
    routesItem('search/type=:name', Search),
    routesItem('login/:id?/:invitation_code?', Login),
    routesItem('book/:bookId?/:invitation_code?', Book),
    routesItem('userfeedback', UserFeedBack),
    routesItem('collect', Collect),
    routesItem('test', null, () => (
        <Test>
            {
                child.testChild.map(e => (<Route {...e} />))
            }
        </Test>
    )),
    routesItem('', NotFound),
]
export default routes
