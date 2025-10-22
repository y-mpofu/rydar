package com.rydar;

import jakarta.annotation.Nullable;

public class User {
    public Boolean isUserNameValid(@Nullable String username) {
        return username != null && !username.isBlank();
    }

    public Boolean isAgeValid(@Nullable Integer age) {
        return age != null && age > 5 && age <= 120;
    }
}
