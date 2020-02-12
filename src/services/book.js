/**
 * book 相关
 */

import {
	initAxios
} from '../utils/request'
export const category = ({
	...parameter
} = {}) => {
	return initAxios().post(`/v2/novel/category`, {
		...parameter
	})
}
export const bookList = ({
	...parameter
} = {}) => {
	return initAxios().post(`/v2/novel/index`, {
		...parameter
	})
}
export const detail = ({
	...parameter
} = {}) => {
	return initAxios().post(`/v2/novel/detail`, {
		...parameter
	})
}
export const collect = ({
	...parameter
} = {}) => {
	return initAxios().post(`/v2/novel/collect`, {
		...parameter
	})
}
export const comment = ({
	...parameter
} = {}) => {
	return initAxios().post(`/v2/novel/comment`, {
		...parameter
	})
}
export const comment_thumbs = ({
	...parameter
} = {}) => {
	return initAxios().post(`/v2/novel/comment_thumbs`, {
		...parameter
	})
}
export const comment_add = ({
	...parameter
} = {}) => {
	return initAxios().post(`/v2/novel/comment_add`, {
		...parameter
	})
}
export const novel_thumbs = ({
	...parameter
} = {}) => {
	return initAxios().post(`/v2/novel/novel_thumbs`, {
		...parameter
	})
}