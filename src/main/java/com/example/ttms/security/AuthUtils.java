// security/AuthUtils.java
package com.example.ttms.security;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthUtils {
    public Integer currentGuideId() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a == null || !(a.getDetails() instanceof Claims)) return null;

        Claims claims = (Claims) a.getDetails();
        Object val = claims.get("guideId");

        if (val instanceof Integer i) return i;
        if (val instanceof Long l) return l.intValue();
        return null;
    }

    public Integer currentCustomerId() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a == null || !(a.getDetails() instanceof Claims)) return null;

        Claims claims = (Claims) a.getDetails();
        Object val = claims.get("customerId");

        if (val instanceof Integer i) return i;
        if (val instanceof Long l) return l.intValue();
        return null;
    }

    public Integer currentClientId() {
        return currentCustomerId(); // Alias for consistency
    }

    public void assertGuideSelf(Integer guideId) {
        Integer fromToken = currentGuideId();
        if (fromToken == null || !fromToken.equals(guideId)) {
            throw new SecurityException("Forbidden: not your resource");
        }
    }

    public void assertCustomerSelf(Integer customerId) {
        Integer fromToken = currentCustomerId();
        if (fromToken == null || !fromToken.equals(customerId)) {
            throw new SecurityException("Forbidden: not your resource");
        }
    }

    public void assertClientSelf(Integer clientId) {
        assertCustomerSelf(clientId); // Alias for consistency
    }
}