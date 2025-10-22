# **Style Guide**

## **Comment Style**

- Use **Javadoc (`/** ... \*/`)\*\* for documenting classes, methods, and public members in Java.
- Add **inline comments (`//`)** only for tricky logic that’s not immediately clear.
- Keep comments concise — explain _why_, not _what_.

---

## **Naming Conventions**

- **Variables:** `camelCase` (e.g., `driverLocation`)
- **Methods:** `camelCase` (e.g., `findNearbyDrivers()`)
- **Classes:** `PascalCase` (e.g., `Driver`, `RouteEngine`)
- **Constants:** `ALL_CAPS` (e.g., `MAX_SEATS`)
- **Packages:** lowercase, dot-separated (e.g., `com.rydar.services`)
- **Files:** Match class names exactly (e.g., `Driver.java`)

---

## **File & Project Structure**

We follow a modular package structure to keep concerns separate, for example:

```
project_root/
│── src/
│   ├── main/
│   │   ├── java/com/rydar/
│   │   │   ├── controllers/     # API endpoints
│   │   │   ├── services/        # Core business logic
│   │   │   ├── models/          # Data models and DTOs
│   │   │   ├── repositories/    # Database access layer
│   │   │   └── config/          # Application configuration
│   │   └── resources/
│   │       ├── application.yml  # Configuration
│   │       └── static/          # Optional static resources
│
│── src/test/java/com/rydar/     # Unit and integration tests
│── build.gradle                 # Gradle dependencies
│── README.md
```

- Each package should have a **single responsibility** (models, services, controllers, etc.).
- Avoid putting all logic in a single class or file.

---

## **Testing Conventions**

- Use **JUnit 5** for testing backend.
- Use **Jest** and **React Testing Library** for testing frontend.
- Test files mirror the `src/main/java` structure (e.g., `RouteServiceTest.java`).
- Test method names use `camelCase` and describe behavior (e.g., `shouldReturnNearbyDrivers()`).
- Write both **unit tests** (for individual functions) and **integration tests** (for end-to-end behavior).
- Keep tests **independent** — no test should rely on another.

---

## **Coupling & Cohesion**

- Each class or module should have **one purpose** (high cohesion).
- Minimize interdependence between modules (low coupling).
- Follow **DRY (Don’t Repeat Yourself)** — avoid duplicate logic.

---

## **Frontend & Backend Notes**

- **Frontend (React/TypeScript):**

  - `camelCase` for variables/functions
  - `PascalCase` for components
  - `ALL_CAPS` for constants

- **Backend (Java):**

  - Follow standard Java naming and structure
  - Use Javadoc for method/class documentation
  - Keep logic modular and well-tested

---

## **Team Discussion**

We agreed to follow **Java’s standard conventions** for the backend (Spring Boot-style modularity) and **React + TypeScript conventions** for the frontend.
Type safety, clear naming, and early testing are priorities.

We decided to add tests alongside feature development to maintain correctness as we build.
Both teams (frontend and backend) will follow the same principles of clarity, modularity, and maintainability.

---

## **Branching and Merging**

**Branch naming convention:**

- `feature/<feature-name>` – for new features
- `fix/<issue-name>` – for bug fixes
- `test/<module-name>` – for test-related branches

**Creating branches:**

```bash
git checkout -b feature/<feature-name>
```

**Merging rules:**

- Only merge via **Pull Request (PR)**.
- Each PR must **link to an open issue**.
- **At least one peer review** before merging to `main`.
- **Resolve all merge conflicts locally** before merging.
- **Delete the branch** after a successful merge.

---

## **References**

- [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Spring Boot Best Practices](https://spring.io/guides)
- [DRY Principle Explained](https://thevaluable.dev/dry-principle-examples/)
- [Coupling and Cohesion in Software Engineering](https://www.geeksforgeeks.org/software-engineering-coupling-and-cohesion/)
