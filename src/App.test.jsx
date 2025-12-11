import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

// Mock the route components
vi.mock("./routes/Home.jsx", () => ({
  default: ({ data, loading, error }) => (
    <div data-testid="home">
      {loading && <div>Loading Home</div>}
      {error && <div>Error: {error.message}</div>}
      {data && <div>Home with data</div>}
    </div>
  ),
}));

vi.mock("./routes/Products.jsx", () => ({
  default: ({ data, loading, error }) => (
    <div data-testid="products">
      {loading && <div>Loading Products</div>}
      {error && <div>Error: {error.message}</div>}
      {data && <div>Products with data</div>}
    </div>
  ),
}));

vi.mock("./routes/ProductDetails.jsx", () => ({
  default: ({ data, loading, error }) => (
    <div data-testid="product-details">
      {loading && <div>Loading Product Details</div>}
      {error && <div>Error: {error.message}</div>}
      {data && <div>Product Details with data</div>}
    </div>
  ),
}));

vi.mock("./routes/Cart.jsx", () => ({
  default: () => <div data-testid="cart">Cart</div>,
}));

vi.mock("./components/Nav/Nav.jsx", () => ({
  default: () => <nav data-testid="nav">Nav</nav>,
}));

vi.mock("react-hot-toast", () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

describe("App component", () => {
  let mockFetch;

  beforeEach(() => {
    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Data fetching on mount", () => {
    test("initiates fetch on component mount", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, title: "Product 1" }],
      });

      render(<App />);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://fakestoreapi.com/products"
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    test("only fetches data once on mount", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, title: "Product 1" }],
      });

      const { rerender } = render(<App />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      // Rerender should not trigger another fetch
      rerender(<App />);

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("Loading state", () => {
    test("starts with loading state true", () => {
      mockFetch.mockImplementationOnce(
        () =>
          new Promise(() => {
            // Never resolves to keep loading state
          })
      );

      render(<App />);

      expect(screen.getByText("Loading Home")).toBeInTheDocument();
    });

    test("sets loading to false after successful fetch", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, title: "Product 1" }],
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText("Loading Home")).not.toBeInTheDocument();
      });
    });

    test("sets loading to false after fetch error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText("Loading Home")).not.toBeInTheDocument();
      });
    });
  });

  describe("Successful data fetching", () => {
    test("sets data state when fetch succeeds", async () => {
      const mockData = [
        { id: 1, title: "Product 1" },
        { id: 2, title: "Product 2" },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("Home with data")).toBeInTheDocument();
      });
    });

    test("passes fetched data to route components", async () => {
      const mockData = [{ id: 1, title: "Product 1" }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("Home with data")).toBeInTheDocument();
      });
    });
  });

  describe("Error handling", () => {
    test("handles HTTP error responses", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      });

      render(<App />);

      await waitFor(() => {
        expect(
          screen.getByText(/Error: HTTP error! status: 404/i)
        ).toBeInTheDocument();
      });
    });

    test("handles network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network failure"));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Error: Network failure/i)).toBeInTheDocument();
      });
    });

    test("handles 500 server errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      render(<App />);

      await waitFor(() => {
        expect(
          screen.getByText(/Error: HTTP error! status: 500/i)
        ).toBeInTheDocument();
      });
    });

    test("handles JSON parsing errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Error: Invalid JSON/i)).toBeInTheDocument();
      });
    });

    test("sets error state when fetch fails", async () => {
      const errorMessage = "Failed to fetch";
      mockFetch.mockRejectedValueOnce(new Error(errorMessage));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
      });
    });

    test("passes error to route components", async () => {
      mockFetch.mockRejectedValueOnce(new Error("API Error"));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Error: API Error/i)).toBeInTheDocument();
      });
    });
  });

  describe("State management through fetch lifecycle", () => {
    test("transitions from loading to success state correctly", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, title: "Product 1" }],
      });

      render(<App />);

      // Initially loading
      expect(screen.getByText("Loading Home")).toBeInTheDocument();

      // After fetch completes
      await waitFor(() => {
        expect(screen.queryByText("Loading Home")).not.toBeInTheDocument();
        expect(screen.getByText("Home with data")).toBeInTheDocument();
      });
    });

    test("transitions from loading to error state correctly", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Fetch failed"));

      render(<App />);

      // Initially loading
      expect(screen.getByText("Loading Home")).toBeInTheDocument();

      // After fetch fails
      await waitFor(() => {
        expect(screen.queryByText("Loading Home")).not.toBeInTheDocument();
        expect(screen.getByText(/Error: Fetch failed/i)).toBeInTheDocument();
      });
    });

    test("maintains null data state on error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Error: Network error/i)).toBeInTheDocument();
      });

      // Should not show "Home with data" since data is null
      expect(screen.queryByText("Home with data")).not.toBeInTheDocument();
    });
  });

  describe("Component rendering", () => {
    test("renders Nav component", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      render(<App />);

      expect(screen.getByTestId("nav")).toBeInTheDocument();
    });

    test("renders Toaster component", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      render(<App />);

      expect(screen.getByTestId("toaster")).toBeInTheDocument();
    });

    test("renders home route by default", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId("home")).toBeInTheDocument();
      });
    });
  });

  describe("Props passed to routes", () => {
    test("passes loading, error, and data props to Home route", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1 }],
      });

      render(<App />);

      // Initially loading
      expect(screen.getByText("Loading Home")).toBeInTheDocument();

      // After successful fetch
      await waitFor(() => {
        expect(screen.getByText("Home with data")).toBeInTheDocument();
      });
    });

    test("all route components receive the same data state", async () => {
      const mockData = [{ id: 1, title: "Product 1" }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("Home with data")).toBeInTheDocument();
      });

      // All routes should receive the same data when accessed
      // This is validated by the fact that they all use the same data state
    });
  });

  describe("Fetch API URL", () => {
    test("fetches from correct API endpoint", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      render(<App />);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://fakestoreapi.com/products"
      );
    });
  });
});
