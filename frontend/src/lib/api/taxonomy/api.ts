import { apiClient } from '@/lib/api'
import { API_ENDPOINTS } from '@/config/endpoints'
import { TaxonomyListResponse } from '@/types/api/taxonomy/response'
import {
  CreateTaxonomyRequest,
  DeleteTaxonomyRequest,
  UpdateTaxonomyRequest,
} from '@/types/api/taxonomy/request'

export const taxonomyApi = {
  getCategories: () => {
    return apiClient.request<TaxonomyListResponse[]>(
      API_ENDPOINTS.TAXONOMY.CATEGORIES,
      {
        method: 'GET',
      }
    )
  },
  createCategory: (payload: CreateTaxonomyRequest) => {
    return apiClient.request(API_ENDPOINTS.TAXONOMY.CATEGORY, {
      method: 'POST',
      body: payload,
    })
  },
  updateCategory: (payload: UpdateTaxonomyRequest) => {
    return apiClient.request(API_ENDPOINTS.TAXONOMY.CATEGORY, {
      method: 'PUT',
      body: payload,
    })
  },
  deleteCategory: (payload: DeleteTaxonomyRequest) => {
    return apiClient.request(API_ENDPOINTS.TAXONOMY.CATEGORY, {
      method: 'DELETE',
      body: payload,
    })
  },
}
