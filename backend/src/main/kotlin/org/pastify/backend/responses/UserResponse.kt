package org.pastify.backend.responses

import java.time.LocalDateTime
import java.util.*

class UserResponse(
    val username: String,
    val registeredAt: LocalDateTime,
    val id: UUID
)