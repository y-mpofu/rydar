package com.rydar.driver;

import com.rydar.trip_routes.DriverRoute;
import com.rydar.user.User;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import lombok.Data;
import lombok.EqualsAndHashCode; // Make sure this is imported!
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * Driver entity extending User. Has two JSON columns: 1. routes - All routes the driver has created
 * 2. activeRoutes - Currently active/working routes
 */
@Data
@EqualsAndHashCode(callSuper = true) // Include User fields in equals/hashCode
@Entity
@Table(name = "drivers")
public class Driver extends User {

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(columnDefinition = "jsonb")
  private Set<DriverRoute> routes = new HashSet<>();
}
