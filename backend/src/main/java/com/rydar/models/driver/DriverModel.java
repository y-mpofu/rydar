package com.rydar.models.driver;

@Entity
@Table(name = "drivers")
public class DriverModel{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role = "DRIVER";

    private LocalDateTime createdAt;

    // Constructor, getters, setters...
}