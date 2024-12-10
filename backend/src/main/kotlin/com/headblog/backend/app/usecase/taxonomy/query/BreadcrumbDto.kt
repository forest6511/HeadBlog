package com.headblog.backend.app.usecase.taxonomy.query

import java.util.*

data class BreadcrumbDto(
    val id: UUID,
    val name: String,
    val slug: String
)