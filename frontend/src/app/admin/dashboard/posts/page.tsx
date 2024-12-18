'use client'

import React, { useState, Key, useEffect } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Plus } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Pagination,
  Chip,
} from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { postApi } from '@/lib/api'
import { PostListResponse, PostWithCategoryId } from '@/types/api/post/response'
import { PostStatuses } from '@/types/api/post/types'
import { useCategories } from '@/hooks/category/useCategories'
import { getBreadcrumbForCategory } from '@/lib/utils/category'
import { ROUTES } from '@/config/routes'
import { POST_COLUMNS } from '@/config/constants'

export default function PostsPage() {
  const { categories, isLoading, error } = useCategories()
  const [posts, setPosts] = useState<PostWithCategoryId[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageCursors, setPageCursors] = useState<{ [key: number]: string }>({})
  const [hasNextPage, setHasNextPage] = useState(false)
  const rowsPerPage = 10 // 1ページに表示する記事数
  const router = useRouter()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let currentCursor: string | undefined

        if (page === 1) {
          currentCursor = undefined
        } else {
          currentCursor = pageCursors[page - 1]
        }

        const result: PostListResponse = await postApi.getPostList({
          cursorPostId: currentCursor,
          pageSize: rowsPerPage,
        })

        // 次のページが存在するかチェック（pageSize + 1件取得されている）
        setHasNextPage(result.posts.length > rowsPerPage)

        // 表示用のpostsは1件のみ（次ページチェック用の要素を除外）
        const displayPosts = result.posts.slice(0, rowsPerPage)
        setPosts(displayPosts)
        setTotalPages(result.totalPages)

        // 次のページのカーソルを保存（最後の要素のIDをカーソルとして使用）
        if (result.posts.length > rowsPerPage) {
          setPageCursors((prev) => ({
            ...prev,
            [page]: result.posts[rowsPerPage - 1].id,
          }))
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    fetchPosts()
  }, [page]) // pageの変更を変更をトリガーとする

  const handleEdit = (id: string) => {
    router.push(ROUTES.ADMIN.DASHBOARD.POSTS.EDIT(id))
  }

  const handleDelete = (id: string) => {
    if (confirm('本当に削除しますか？')) {
      console.log('削除:', id)
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'PUBLISHED' ? 'success' : 'warning'
  }

  const getStatusLabel = (status: string) => {
    return PostStatuses.find((s) => s.value === status)?.label || status
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Button
          color="primary"
          startContent={<Plus size={20} />}
          onClick={() => router.push(ROUTES.ADMIN.DASHBOARD.POSTS.NEW)}
        >
          新規追加
        </Button>
      </div>

      <Table aria-label="記事一覧表">
        <TableHeader>
          {POST_COLUMNS.map((column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'end' : 'start'}
            >
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id as Key}>
              <TableCell>
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-primary hover:underline"
                >
                  {post.title}
                </Link>
              </TableCell>
              <TableCell>{post.slug}</TableCell>
              <TableCell>
                {getBreadcrumbForCategory(post.categoryId, categories)}
              </TableCell>
              <TableCell>
                {/* TODO 共通化 */}
                {new Date(post.updateAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </TableCell>
              <TableCell>
                <Chip color={getStatusColor(post.postStatus)} variant="flat">
                  {getStatusLabel(post.postStatus)}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    isIconOnly
                    color="warning"
                    aria-label="編集"
                    onPress={() => handleEdit(post.id)}
                  >
                    <Edit size={20} />
                  </Button>
                  <Button
                    isIconOnly
                    color="danger"
                    aria-label="削除"
                    onPress={() => handleDelete(post.id)}
                  >
                    <Trash2 size={20} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center">
        <Pagination
          total={totalPages}
          page={page}
          onChange={setPage}
          showControls
          variant="bordered"
        />
      </div>
    </div>
  )
}
