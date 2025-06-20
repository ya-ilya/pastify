package org.pastify.backend.services

import org.pastify.backend.entities.user.User
import org.pastify.backend.entities.user.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.util.*

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) : UserDetailsService {
    fun findUserByUsername(username: String): Optional<User> {
        return userRepository.findByUsername(username)
    }

    fun findUserByEmail(email: String): Optional<User> {
        return userRepository.findByEmail(email)
    }

    fun createUser(username: String, email: String, password: String): User {
        return userRepository.save(
            User(
                username,
                email,
                passwordEncoder.encode(password)
            )
        )
    }

    fun updateUser(user: User): User {
        return userRepository.save(user)
    }

    override fun loadUserByUsername(username: String): UserDetails {
        return userRepository
            .findByEmail(username)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }
    }
}