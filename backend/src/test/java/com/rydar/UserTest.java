package com.rydar;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
public class UserTest {

    @Test
    public void testUserAge(){
        User user = new User();
        Assertions.assertTrue(user.isAgeValid(18));
        Assertions.assertFalse(user.isAgeValid(121));
        Assertions.assertFalse(user.isAgeValid(0));
        Assertions.assertFalse(user.isAgeValid(null));
    }

    @Test
    public void testUserName(){
        User user = new User();
        Assertions.assertTrue(user.isUserNameValid("rydar"));
        Assertions.assertFalse(user.isUserNameValid(""));
        Assertions.assertFalse(user.isUserNameValid(null));
        Assertions.assertFalse(user.isUserNameValid(" "));
    }
}
