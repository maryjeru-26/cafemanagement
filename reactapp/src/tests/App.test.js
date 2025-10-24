import { render, screen } from "@testing-library/react";
import axios from "axios";
import {
  addItem,
  getAllItems,
  getItemsByCategory,
  getItemsSortedByPrice,
  deleteItem,
  updateItem
} from "../services/api";
import Navbar from "../components/Navbar";

// Mock axios
jest.mock("axios");

// ------------------- Item API Tests -------------------
describe("Item API Tests", () => {
  const mockItem = {
    id: "1",
    itemName: "Coffee",
    category: "Beverages",
    price: 100,
    available: true,
  };

  // ------------------- addItem Tests -------------------
  test("addItem_should_post_new_item", async () => {
    axios.post.mockResolvedValue({ data: mockItem });
    const result = await addItem(mockItem);
    expect(result.data).toEqual(mockItem);
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/addItem"),
      mockItem
    );
  });

  test("addItem_should_handle_error", async () => {
    axios.post.mockRejectedValue(new Error("Network Error"));
    await expect(addItem(mockItem)).rejects.toThrow("Network Error");
  });

  // ------------------- getAllItems Tests -------------------
  test("getAllItems_should_fetch_all_items", async () => {
    axios.get.mockResolvedValue({ data: [mockItem] });
    const result = await getAllItems();
    expect(result.data).toEqual([mockItem]);
  });

  test("getAllItems_should_handle_empty_list", async () => {
    axios.get.mockResolvedValue({ data: [] });
    const result = await getAllItems();
    expect(result.data.length).toBe(0);
  });

  test("getAllItems_should_throw_error_on_failure", async () => {
    axios.get.mockRejectedValue(new Error("Server Down"));
    await expect(getAllItems()).rejects.toThrow("Server Down");
  });

  // ------------------- getItemsByCategory Tests -------------------
  test("getItemsByCategory_should_fetch_by_category", async () => {
    axios.get.mockResolvedValue({ data: [mockItem] });
    const result = await getItemsByCategory("Beverages");
    expect(result.data[0].category).toBe("Beverages");
  });

  test("getItemsByCategory_should_call_correct_url", async () => {
    axios.get.mockResolvedValue({ data: [mockItem] });
    await getItemsByCategory("Snacks");
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("category=Snacks"));
  });

  test("getItemsByCategory_should_handle_no_items", async () => {
    axios.get.mockResolvedValue({ data: [] });
    const result = await getItemsByCategory("Desserts");
    expect(result.data).toEqual([]);
  });

  test("getItemsByCategory_should_throw_error", async () => {
    axios.get.mockRejectedValue(new Error("Invalid category"));
    await expect(getItemsByCategory("Unknown")).rejects.toThrow("Invalid category");
  });

  // ------------------- getItemsSortedByPrice Tests -------------------
  test("getItemsSortedByPrice_should_fetch_sorted_list", async () => {
    const items = [
      { id: "1", price: 50 },
      { id: "2", price: 100 },
    ];
    axios.get.mockResolvedValue({ data: items });
    const result = await getItemsSortedByPrice();
    expect(result.data[0].price).toBe(50);
  });

  test("getItemsSortedByPrice_should_return_array", async () => {
    axios.get.mockResolvedValue({ data: [mockItem] });
    const result = await getItemsSortedByPrice();
    expect(Array.isArray(result.data)).toBe(true);
  });

  test("getItemsSortedByPrice_should_throw_error", async () => {
    axios.get.mockRejectedValue(new Error("Sort Error"));
    await expect(getItemsSortedByPrice()).rejects.toThrow("Sort Error");
  });

  // ------------------- deleteItem Tests -------------------
  test("deleteItem_should_delete_item", async () => {
    axios.delete.mockResolvedValue({ data: { success: true } });
    const result = await deleteItem("1");
    expect(result.data.success).toBe(true);
  });

  test("deleteItem_should_call_correct_url", async () => {
    axios.delete.mockResolvedValue({ data: {} });
    await deleteItem("1");
    expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining("/1"));
  });

  test("deleteItem_should_throw_error", async () => {
    axios.delete.mockRejectedValue(new Error("Delete failed"));
    await expect(deleteItem("999")).rejects.toThrow("Delete failed");
  });

  test("deleteItem_should_return_object", async () => {
    axios.delete.mockResolvedValue({ data: { success: true } });
    const result = await deleteItem("1");
    expect(typeof result.data).toBe("object");
  });

  // ------------------- updateItem Tests -------------------
  test("updateItem_should_update_item", async () => {
    const updatedItem = { ...mockItem, price: 120 };
    axios.put.mockResolvedValue({ data: updatedItem });
    const result = await updateItem("1", updatedItem);
    expect(result.data.price).toBe(120);
  });

  test("updateItem_should_call_correct_url", async () => {
    axios.put.mockResolvedValue({ data: mockItem });
    await updateItem("1", mockItem);
    expect(axios.put).toHaveBeenCalledWith(expect.stringContaining("/1"), mockItem);
  });

  test("updateItem_should_throw_error", async () => {
    axios.put.mockRejectedValue(new Error("Update failed"));
    await expect(updateItem("999", mockItem)).rejects.toThrow("Update failed");
  });
});
