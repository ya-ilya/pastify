package org.pastify.backend.services

import org.apache.commons.lang3.RandomStringUtils
import org.pastify.backend.entities.paste.Paste
import org.pastify.backend.entities.paste.PasteLanguage
import org.pastify.backend.entities.paste.PasteRepository
import org.pastify.backend.entities.user.User
import org.pastify.backend.services.pagination.OffsetBasedPageRequest
import org.springframework.data.domain.Page
import org.springframework.data.jpa.domain.JpaSort
import org.springframework.http.HttpStatus
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime
import java.time.ZoneOffset

@Service
class PasteService(private val pasteRepository: PasteRepository) {
    @Scheduled(fixedDelay = 60 * 60 * 1000)
    fun scheduledDeleteExpiredPastes() {
        val now = LocalDateTime.now(ZoneOffset.UTC)
        val expiredPastes = pasteRepository.findAllByExpiresOnBefore(now)
        if (expiredPastes.isNotEmpty()) {
            pasteRepository.deleteAll(expiredPastes)
            pasteRepository.flush()
        }
    }

    fun getPasteById(id: String): Paste {
        val paste = pasteRepository
            .findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }

        if (paste.expiresOn?.isBefore(LocalDateTime.now(ZoneOffset.UTC)) == true) {
            deletePaste(paste)
            throw ResponseStatusException(HttpStatus.NOT_FOUND)
        }

        return paste
    }

    fun getPastes(
        limit: Int,
        offset: Int
    ): Page<Paste> {
        return pasteRepository.findAllByExpiresOnAfterOrExpiresOnIsNullAndIsPrivateIsFalse(
            LocalDateTime.now(ZoneOffset.UTC),
            OffsetBasedPageRequest(offset, limit, JpaSort.by("createdAt"))
        )
    }

    fun getUserPastes(user: User): List<Paste> {
        return pasteRepository.findAllByUserAndExpiresOnAfterOrExpiresOnIsNull(
            user,
            LocalDateTime.now(ZoneOffset.UTC)
        )
    }

    fun createPaste(
        title: String?,
        content: String,
        language: PasteLanguage,
        expiration: Long?,
        isPrivate: Boolean,
        user: User
    ): Paste {
        var id: String
        do {
            id = RandomStringUtils.randomAlphanumeric(8).lowercase()
        } while (pasteRepository.existsById(id))

        val date = LocalDateTime.now(ZoneOffset.UTC)
        val expiresOn = if (expiration == null || expiration <= 0) {
            null
        } else {
            date.plusMinutes(expiration)
        }

        return pasteRepository.save(
            Paste(
                title,
                content,
                language,
                expiresOn,
                isPrivate,
                date,
                user,
                id
            )
        )
    }

    fun deletePaste(paste: Paste) {
        paste.user.pastes.removeIf { it.id == paste.id }
        pasteRepository.deleteById(paste.id)
        pasteRepository.flush()
    }

    fun deletePasteForUser(user: User, pasteId: String) {
        val paste = getPasteById(pasteId)

        if (paste.user.id != user.id) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN)
        }

        deletePaste(paste)
    }
}