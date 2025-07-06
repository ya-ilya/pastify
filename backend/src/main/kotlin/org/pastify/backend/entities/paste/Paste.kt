package org.pastify.backend.entities.paste

import jakarta.persistence.*
import org.pastify.backend.entities.user.User
import org.pastify.backend.responses.PasteResponse
import java.time.LocalDateTime

@Entity
class Paste(
    var title: String?,
    @Lob
    @Column(length = 16777215)
    var content: String,
    var syntax: PasteSyntax,
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
            syntax,
            expiresOn,
            isPrivate,
            createdAt,
            user.toResponse(),
            id
        )
    }
}