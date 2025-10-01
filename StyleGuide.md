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
We will keep the project modular and organized:  

```
project_root/
│── app/            # Core code
│   │── models/     # Data models (Driver, Rider)
│   │── services/   # Business logic (routing, seat handling)
│   │── routes/     # API endpoints
│   │── utils/      # Helper functions
│
│── tests/          # Unit tests
│── requirements.txt
│── README.md
```

---

## Testing Conventions  
- Use **pytest**.  
- Test files mirror the `app/` structure (e.g., `test_services.py`).  
- Test functions use `snake_case` and start with `test_`.  
- Write both **unit tests** (for small functions) and **integration tests** (for APIs).  

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

