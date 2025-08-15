package org.pastify.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@EnableScheduling
@SpringBootApplication(scanBasePackages = ["org.pastify.backend"])
class PastifyApplication

fun main(args: Array<String>) {
    runApplication<PastifyApplication>(*args)
}
