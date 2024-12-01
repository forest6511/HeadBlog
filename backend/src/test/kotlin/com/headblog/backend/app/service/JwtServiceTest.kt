package com.headblog.backend.app.service

import com.auth0.jwt.JWT
import com.headblog.backend.domain.model.auth.JwtToken
import com.headblog.backend.domain.model.user.Email
import com.headblog.backend.domain.model.user.User
import com.headblog.backend.domain.model.user.UserRole
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.time.LocalDateTime
import java.util.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.crypto.password.PasswordEncoder
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

@SpringBootTest
class JwtServiceTest {

    @Autowired
    lateinit var idGenerator: IdGenerator<EntityId>
    @Autowired
    private lateinit var jwtService: JwtService
    @Autowired
    lateinit var passwordEncoder: PasswordEncoder

    private lateinit var user: User

    @BeforeEach
    fun setUp() {
        user = User.create(
            id = idGenerator,
            email = Email.of("admin@example.com"),
            rawPassword = "correct_password",
            passwordEncoder = passwordEncoder,
            role = UserRole.ADMIN,
            currentTime = LocalDateTime.now()
        )
    }

    @Test
    @DisplayName("JWT Tokenを生成し、返却すること")
    fun `generateToken should return a valid JwtToken`() {
        // generateTokenを呼び出してトークンを生成
        val jwtToken: JwtToken = jwtService.generateToken(user)
        // トークンがnullでないことを確認
        assertNotNull(jwtToken)
        // トークンが文字列として返されることを確認
        val tokenValue = jwtToken.value
        assertNotNull(tokenValue)
        assert(tokenValue.isNotEmpty())

        // トークンの構造や有効期限の確認（必要に応じてデコードして確認）
        val decodedJWT = JWT.decode(tokenValue)
        assertEquals(user.id.value.toString(), decodedJWT.subject)
        assertEquals(user.email.value, decodedJWT.getClaim("email").asString())
        assertEquals(user.role.name, decodedJWT.getClaim("role").asString())
    }

    @Test
    @DisplayName("有効期限が妥当なJWT Tokenを返却すること")
    fun `should return JwtAuthenticationResult with valid token`() {
        val result = jwtService.generateJwtAuthenticationResult(user)

        // JwtAuthenticationResultのtokenが有効か確認
        assertNotNull(result.token)
        assertNotNull(result.token.value)
        assert(result.token.value.isNotEmpty())

        // トークンの有効期限も確認
        assertNotNull(result.expiresAt)
        assert(result.expiresAt.after(Date()))
    }
}