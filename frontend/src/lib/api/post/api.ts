import { apiClient } from '@/lib/api'
import { ADMIN_API_ENDPOINTS } from '@/config/endpoints'
import { CreatePostRequest, ListPostRequest } from '@/types/api/post/request'
import { PostListResponse } from '@/types/api/post/response'

export const postApi = {
  createPost: (payload: CreatePostRequest) => {
    return apiClient.request(ADMIN_API_ENDPOINTS.POST.POST, {
      method: 'POST',
      body: payload,
    })
  },
  getPostList: (params: ListPostRequest): Promise<PostListResponse> => {
    const queryParams = new URLSearchParams({
      ...(params.cursorPostId && { cursorPostId: params.cursorPostId }),
      ...(params.pageSize && { pageSize: params.pageSize.toString() }),
    })
    const url = `${ADMIN_API_ENDPOINTS.POST.POST}?${queryParams.toString()}`
    return apiClient.request(url, {
      method: 'GET',
    })
  },
}
