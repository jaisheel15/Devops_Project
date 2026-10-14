import pytest


def test_health_check(client):
    """Test 1: Verify the /health endpoint responds with status 200 and healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "bookverse-api"
    assert data["database"] == "connected"


def test_create_book(client):
    """Test 2: Verify creating a book via POST /api/v1/books."""
    payload = {
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "isbn": "978-0132350884",
        "genre": "Software Engineering",
        "price": 39.99,
        "stock": 15,
        "description": "A Handbook of Agile Software Craftsmanship"
    }
    response = client.post("/api/v1/books", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["isbn"] == payload["isbn"]
    assert data["id"] is not None


def test_get_all_books(client):
    """Test 3: Verify fetching list of books via GET /api/v1/books."""
    # Seed a book first
    client.post("/api/v1/books", json={
        "title": "The Pragmatic Programmer",
        "author": "David Thomas, Andrew Hunt",
        "isbn": "978-0135957059",
        "genre": "Software Engineering",
        "price": 45.00,
        "stock": 10
    })

    response = client.get("/api/v1/books")
    assert response.status_code == 200
    books = response.json()
    assert isinstance(books, list)
    assert len(books) >= 1


def test_get_book_by_id(client):
    """Test 4: Verify retrieving a specific book by ID via GET /api/v1/books/{id}."""
    create_res = client.post("/api/v1/books", json={
        "title": "Designing Data-Intensive Applications",
        "author": "Martin Kleppmann",
        "isbn": "978-1449373320",
        "genre": "Databases & Distributed Systems",
        "price": 49.99,
        "stock": 8
    })
    book_id = create_res.json()["id"]

    response = client.get(f"/api/v1/books/{book_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == book_id
    assert data["title"] == "Designing Data-Intensive Applications"


def test_get_nonexistent_book_returns_404(client):
    """Test 5: Verify that querying an invalid book ID returns a 404 Not Found error."""
    response = client.get("/api/v1/books/999999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_update_book(client):
    """Test 6: Verify updating a book via PUT /api/v1/books/{id}."""
    create_res = client.post("/api/v1/books", json={
        "title": "Continuous Delivery",
        "author": "Jez Humble, David Farley",
        "isbn": "978-0321601919",
        "genre": "DevOps",
        "price": 42.50,
        "stock": 5
    })
    book_id = create_res.json()["id"]

    update_payload = {
        "price": 38.00,
        "stock": 12
    }
    response = client.put(f"/api/v1/books/{book_id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["price"] == 38.00
    assert data["stock"] == 12
    assert data["title"] == "Continuous Delivery"


def test_delete_book(client):
    """Test 7: Verify deleting a book via DELETE /api/v1/books/{id}."""
    create_res = client.post("/api/v1/books", json={
        "title": "Site Reliability Engineering",
        "author": "Niall Murphy et al.",
        "isbn": "978-1491929124",
        "genre": "DevOps / Reliability",
        "price": 44.95,
        "stock": 7
    })
    book_id = create_res.json()["id"]

    delete_res = client.delete(f"/api/v1/books/{book_id}")
    assert delete_res.status_code == 200

    # Ensure it's now deleted
    get_res = client.get(f"/api/v1/books/{book_id}")
    assert get_res.status_code == 404


def test_create_duplicate_isbn_fails(client):
    """Test 8: Verify creating a book with an existing ISBN returns a 400 Bad Request error."""
    book_data = {
        "title": "The Phoenix Project",
        "author": "Gene Kim et al.",
        "isbn": "978-1942788294",
        "genre": "DevOps Fiction",
        "price": 29.99,
        "stock": 20
    }
    first_res = client.post("/api/v1/books", json=book_data)
    assert first_res.status_code == 201

    duplicate_res = client.post("/api/v1/books", json=book_data)
    assert duplicate_res.status_code == 400
    assert "already exists" in duplicate_res.json()["detail"].lower()


def test_prometheus_metrics_endpoint(client):
    """Test 9: Verify the /metrics endpoint returns Prometheus formatted data."""
    response = client.get("/metrics")
    assert response.status_code == 200
    assert "http_requests_total" in response.text
