package org.pastify.backend.controllers

import org.pastify.backend.entities.user.User
import org.pastify.backend.responses.PasteResponse
import org.pastify.backend.services.PasteService
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/me")
class MeController(private val pasteService: PasteService) {
    @GetMapping
    fun getUser(@AuthenticationPrincipal user: User) = user.toResponse()

    @GetMapping("/pastes")
    fun getPastes(
        @AuthenticationPrincipal user: User
    ): List<PasteResponse> {
        return pasteService.getUserPastes(user).map { it.toResponse() }
    }
}