package org.pastify.backend.entities.paste

import org.pastify.backend.entities.user.User
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDateTime

interface PasteRepository : JpaRepository<Paste, String> {
    fun findAllByExpiresOnBefore(dateTime: LocalDateTime): List<Paste>
    fun findAllByExpiresOnAfterOrExpiresOnIsNullAndIsPrivateIsFalse(
        dateTime: LocalDateTime,
        pageable: Pageable
    ): Page<Paste>

    @Query("SELECT p FROM Paste p WHERE p.user = :user AND (p.expiresOn > :dateTime OR p.expiresOn IS NULL)")
    fun findAllByUserAndExpiresOnAfterOrExpiresOnIsNull(user: User, dateTime: LocalDateTime): List<Paste>
}