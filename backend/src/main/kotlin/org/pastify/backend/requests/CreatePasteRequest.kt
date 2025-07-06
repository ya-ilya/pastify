package org.pastify.backend.requests

import jakarta.validation.constraints.Size
import org.pastify.backend.entities.paste.PasteSyntax

class CreatePasteRequest(
    @Size(min = 2)
    val title: String?,
    @Size(min = 2, max = 262144)
    val content: String,
    val syntax: PasteSyntax,
    val expiration: Long?,
    val isPrivate: Boolean,
)