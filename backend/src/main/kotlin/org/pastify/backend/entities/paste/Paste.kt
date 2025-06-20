package org.pastify.backend.entities.paste

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import org.pastify.backend.entities.user.User
import org.pastify.backend.responses.PasteResponse
import java.time.LocalDateTime

@Entity
class Paste(
    var title: String?,
    var content: String,
    var language: PasteLanguage,
    val expiresOn: LocalDateTime?,
    val isPrivate: Boolean,
    val createdAt: LocalDateTime,
    @ManyToOne
    val user: User,
    @Id
    var id: String
) {
    fun toResponse(): PasteResponse {
        return PasteResponse(
            title,
            content,
            language,
            expiresOn,
            isPrivate,
            createdAt,
            user.toResponse(),
            id
        )
    }
}