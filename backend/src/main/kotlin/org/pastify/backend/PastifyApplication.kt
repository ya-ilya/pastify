package org.pastify.backend

import org.pastify.backend.services.UserService
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@EnableScheduling
@SpringBootApplication(scanBasePackages = ["org.pastify.backend"])
class PastifyApplication(
    private val userService: UserService
) : CommandLineRunner {
    override fun run(vararg args: String) {
        if (userService.findUserByUsername("Ilya").isPresent) {
            return
        }

        val ilya = userService.createUser(
            "Ilya",
            "ilya@mail.com",
            "password"
        )

        val pavel = userService.createUser(
            "Pavel",
            "pavel@mail.com",
            "password"
        )
    }
}

fun main(args: Array<String>) {
    runApplication<PastifyApplication>(*args)
}
