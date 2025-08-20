package org.pastify.backend.exceptions

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.AccessDeniedException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.server.ResponseStatusException

@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(ResponseStatusException::class)
    fun handleResponseStatusException(ex: ResponseStatusException): ResponseEntity<ErrorResponse> {
        val status = ex.statusCode as HttpStatus
        val message = ex.reason

        return ResponseEntity(
            ErrorResponse(
                status.value(),
                message
            ),
            status
        )
    }


    @ExceptionHandler(org.springframework.security.access.AccessDeniedException::class)
    fun handleAccessDeniedException(ex: AccessDeniedException): ResponseEntity<ErrorResponse> {
        val status = HttpStatus.FORBIDDEN
        val message = ex.message

        return ResponseEntity(
            ErrorResponse(status.value(), message),
            status
        )
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleMethodArgumentNotValidException(ex: MethodArgumentNotValidException): ResponseEntity<ErrorResponse> {
        val status = HttpStatus.BAD_REQUEST
        val fields = ex.bindingResult.fieldErrors.map {
            it.field
        }

        return ResponseEntity(
            ErrorResponse(
                status.value(),
                "Validation failed",
                fields = fields
            ),
            status
        )
    }

    @ExceptionHandler(Exception::class)
    fun handleAnyException(ex: Exception): ResponseEntity<ErrorResponse> {
        val status = HttpStatus.INTERNAL_SERVER_ERROR

        ex.printStackTrace()

        return ResponseEntity(
            ErrorResponse(
                status.value(),
                "An internal error occurred. Please try again later"
            ),
            status
        )
    }

    data class ErrorResponse(
        val status: Int,
        val message: String? = null,
        val fields: List<String>? = null
    )
}