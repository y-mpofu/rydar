# Style Guide  

## Comment Style  
- Use **Python type hints** for documenting function inputs and outputs.  
- Only add **block comments** before complex functions or classes where logic is not obvious.  
- Use **inline comments** sparingly, only to clarify tricky logic.  

---

## Naming Conventions  
- **Variables:** `snake_case` (e.g., `driver_location`).  
- **Functions:** `snake_case` (e.g., `find_nearby_drivers`).  
- **Classes:** `PascalCase` (e.g., `Driver`, `RouteEngine`).  
- **Constants:** `ALL_CAPS` (e.g., `MAX_SEATS`).  
- **Files/Modules:** lowercase with underscores (e.g., `routing_engine.py`).  

---

## File & Project Structure  
We follow a modular package structure to keep concerns separate, for example:

```
project_root/
│── app/
│   │── __init__.py          # Initializes app
│   │── models/              # Data models (e.g., Driver, Rider, Route)
│   │── routes/              # API endpoints
│   │── services/            # Core logic (e.g., routing engine)
│   │── utils/               # Helper functions
│   │── config.py            # Settings and constants
│
│── tests/                   # Unit and integration tests
│   │── test_models.py
│   │── test_services.py
│
│── requirements.txt         # Dependencies
│── README.md

```
- Each module has a single responsibility (models, routes, services, utils).
- Avoid putting all code in one giant file.

---

## Testing Conventions  
- Use **pytest**.  
- Test files mirror the `app/` structure (e.g., `test_services.py`).  
- Test functions use `snake_case` and start with `test_` (e.g., `test_route_generation`)..  
- Write both **unit tests** (for small functions) and **integration tests** (for APIs).  
- Keep tests independent — no test should depend on another.

---


## Coupling & Cohesion  
- Each module/class should do **one thing only** (high cohesion).  
- Minimize dependencies between modules (low coupling).  
- Follow **DRY (Don’t Repeat Yourself)** — no duplicate code.  

---

## Frontend & Backend Notes  
- **Frontend (React/JS):** `camelCase` for variables/functions, `PascalCase` for components, `ALL_CAPS` for constants.  
- **Backend:** Planned in **Python**, but we also discussed possibly using **Java**. If Java is chosen, we’d follow standard Java naming and Javadoc comments.  

---

## Team Discussion  
We agreed to follow **PEP 8** for Python as it is simple, readable, and widely used. Type hints reduce the need for excessive comments. We decided to add tests alongside features rather than at the end to ensure correctness as we build.  

We also left flexibility for a possible **Java backend** in the future, but for now Python is our main choice. For the frontend, we will follow React’s conventions so that both sides of the project feel natural in their own language.  

## References  
- [PEP 8 – Style Guide for Python Code](https://peps.python.org/pep-0008/)  
- [Typing in Python](https://docs.python.org/3/library/typing.html)  
- [DRY Principle Explained](https://thevaluable.dev/dry-principle-examples/)  
- [Coupling and Cohesion in Software Engineering](https://www.geeksforgeeks.org/software-engineering-coupling-and-cohesion/)  

---
