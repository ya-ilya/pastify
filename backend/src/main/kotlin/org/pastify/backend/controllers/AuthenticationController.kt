package org.pastify.backend.controllers

import jakarta.validation.Valid
import org.pastify.backend.requests.RefreshTokenRequest
import org.pastify.backend.requests.SignInRequest
import org.pastify.backend.requests.SignUpRequest
import org.pastify.backend.services.AuthenticationService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/authentication")
class AuthenticationController(private val authenticationService: AuthenticationService) {
    @PostMapping("/sign-in")
    fun signIn(@Valid @RequestBody request: SignInRequest) =
        authenticationService.signIn(request.email, request.password)

    @PostMapping("/sign-up")
    fun signUp(@Valid @RequestBody request: SignUpRequest) =
        authenticationService.signUp(request.username, request.email, request.password)

    @PostMapping("/refreshToken")
    fun refreshToken(@Valid @RequestBody request: RefreshTokenRequest) =
        authenticationService.refreshToken(request.refreshToken)
}