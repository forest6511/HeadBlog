package com.headblog.backend.app.usecase.post.command.delete

import com.headblog.backend.domain.model.post.Post
import com.headblog.backend.domain.model.post.PostCategoryRepository
import com.headblog.backend.domain.model.post.PostId
import com.headblog.backend.domain.model.post.PostRepository
import com.headblog.backend.shared.exception.AppConflictException
import java.util.*
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class DeletePostService(
    private val postRepository: PostRepository,
    private val postCategoryRepository: PostCategoryRepository,
) : DeletePostUseCase {

    private val logger = LoggerFactory.getLogger(DeletePostService::class.java)

    override fun execute(deleteId: UUID): PostId {
        val postDto = postRepository.findById(deleteId)
            ?: throw AppConflictException("Post with ID ${deleteId} not found")

        val post = Post.fromCommand(
            id = postDto.id,
            title = postDto.title,
            slug = postDto.slug,
            content = postDto.content,
            excerpt = postDto.excerpt,
            postStatus = postDto.postStatus,
            featuredImageId = postDto.featuredImageId,
            metaTitle = postDto.metaTitle,
            metaDescription = postDto.metaDescription,
            metaKeywords = postDto.metaKeywords,
            ogTitle = postDto.ogTitle,
            ogDescription = postDto.ogDescription,
            categoryId = postDto.categoryId,
        )

        postCategoryRepository.deleteRelation(post.id, post.categoryId)
        postRepository.delete(post)
        return post.id
    }
}