package com.otaku.community.common.interceptor;

import com.otaku.community.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;

import java.security.Principal;

@Component
@RequiredArgsConstructor
@Slf4j
public class StompAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtDecoder jwtDecoder;
    private final UserRepository userRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    Jwt jwt = jwtDecoder.decode(token);
                    String auth0Id = jwt.getSubject();

                    // Map Auth0 ID to our internal User ID
                    return userRepository.findByAuth0Id(auth0Id)
                            .map(user -> {
                                String userId = user.getId().toString();
                                Principal principal = () -> userId;
                                accessor.setUser(principal);
                                return message;
                            })
                            .orElseGet(() -> {
                                log.error("[WS][STOMP] ❌ User not found in database for auth0Id={}", auth0Id);
                                return null;
                            });
                } catch (Exception ex) {
                    log.error("[WS][STOMP] ❌ JWT decode failed", ex);
                    return null;
                }
            } else {
                log.error("[WS][STOMP] ❌ Missing or invalid Authorization header");
                return null;
            }
        }

        return message;
    }
}
