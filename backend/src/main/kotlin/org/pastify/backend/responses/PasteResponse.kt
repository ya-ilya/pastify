package org.pastify.backend.responses

import org.pastify.backend.entities.paste.PasteSyntax
import java.time.LocalDateTime

class PasteResponse(
    val title: String?,
    val content: String,
    val syntax: PasteSyntax,
    val expiresOn: LocalDateTime?,
    val isPrivate: Boolean,
    val createdAt: LocalDateTime,
    val user: UserResponse,
    var id: String
)