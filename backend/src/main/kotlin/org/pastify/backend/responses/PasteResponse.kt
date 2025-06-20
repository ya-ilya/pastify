package org.pastify.backend.responses

import org.pastify.backend.entities.paste.PasteLanguage
import java.time.LocalDateTime

class PasteResponse(
    val title: String?,
    val content: String,
    val language: PasteLanguage,
    val expiresOn: LocalDateTime?,
    val isPrivate: Boolean,
    val createdAt: LocalDateTime,
    val user: UserResponse,
    var id: String
)