package com.headblog.backend.app.usecase.taxonomy.query

import java.time.LocalDateTime
import java.util.*

data class TaxonomyDto(
    val id: UUID,
    val name: String,
    val taxonomyType: String,
    val slug: String,
    val description: String?,
    val parentId: UUID?,
    val createdAt: LocalDateTime
)