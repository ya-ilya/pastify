package org.pastify.backend.entities.user

import jakarta.persistence.*
import org.pastify.backend.entities.paste.Paste
import org.pastify.backend.responses.UserResponse
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.util.*

@Entity
class User(
    @get:JvmName("usernameField")
    val username: String,
    val email: String,
    @get:JvmName("passwordField")
    val password: String,
    var refreshToken: String? = null,
    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    val pastes: MutableList<Paste> = mutableListOf(),
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null
) : UserDetails {
    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return mutableSetOf()
    }

    override fun getPassword(): String {
        return password
    }

    override fun getUsername(): String {
        return email
    }

    override fun isAccountNonExpired(): Boolean {
        return true
    }

    override fun isAccountNonLocked(): Boolean {
        return true
    }

    override fun isCredentialsNonExpired(): Boolean {
        return true
    }

    override fun isEnabled(): Boolean {
        return true
    }

    fun toResponse(): UserResponse {
        return UserResponse(
            username,
            id!!
        )
    }
}