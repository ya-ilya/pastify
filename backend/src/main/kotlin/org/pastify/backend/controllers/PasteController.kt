package org.pastify.backend.controllers

import org.pastify.backend.entities.user.User
import org.pastify.backend.requests.CreatePasteRequest
import org.pastify.backend.responses.PasteResponse
import org.pastify.backend.services.PasteService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/pastes")
class PasteController(private val pasteService: PasteService) {
    @GetMapping
    fun getPastes(
        @RequestParam(value = "limit", required = false, defaultValue = "10") limit: Int,
        @RequestParam(value = "offset", required = false, defaultValue = "0") offset: Int,
    ): ResponseEntity<List<PasteResponse>> {
        val page = pasteService.getPastes(limit, offset)

        return ResponseEntity
            .status(HttpStatus.OK)
            .header("X-Total-Count", page.totalElements.toString())
            .header("X-Total-Pages", page.totalPages.toString())
            .header("Access-Control-Expose-Headers", "X-Total-Count,X-Total-Pages")
            .body(page.content.map { it.toResponse() })
    }

    @GetMapping("{id}")
    fun getPasteById(@PathVariable id: String): PasteResponse {
        return pasteService.getPasteById(id).toResponse()
    }

    @PostMapping
    fun createPaste(
        @RequestBody request: CreatePasteRequest,
        @AuthenticationPrincipal user: User
    ): PasteResponse {
        return pasteService.createPaste(
            request.title,
            request.content,
            request.syntax,
            request.expiration,
            request.isPrivate,
            user
        ).toResponse()
    }

    @DeleteMapping("{id}")
    fun deletePaste(@PathVariable id: String, @AuthenticationPrincipal user: User) {
        pasteService.deletePasteForUser(user, id)
    }
}