package com.rydar.models.rider;

@Entity
@Table(name = "riders")  // Table name in database
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;  // Will be hashed

    @Column(nullable = false)
    private String role = "RIDER";  // Default role

    private LocalDateTime createdAt;

    // Constructor, getters, setters...
}
