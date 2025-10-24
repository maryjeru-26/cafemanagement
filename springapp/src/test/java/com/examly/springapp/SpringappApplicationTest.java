package com.examly.springapp;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import java.io.File;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(classes = SpringappApplication.class)
@AutoConfigureMockMvc
class SpringappItemTests {

    @Autowired
    private MockMvc mockMvc;

    // ---------- Core API Tests ----------
    @Order(1)
    @Test
    void AddItemReturns200() throws Exception {
        String itemData = """
                {
                    "itemName": "Coffee",
                    "category": "Beverages",
                    "price": 100,
                    "available": true
                }
                """;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/items/addItem")
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(itemData)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();
    }

    @Order(2)
    @Test
    void GetAllItemsReturnsArray() throws Exception {
        mockMvc.perform(get("/api/items/allItems")
                        .with(jwt())
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn();
    }

    @Order(3)
    @Test
    void GetItemsByCategoryReturns200() throws Exception {
        mockMvc.perform(get("/api/items/byCategory")
                        .with(jwt())
                        .param("category", "Beverages")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].itemName").exists())
                .andReturn();
    }

    @Order(4)
    @Test
    void GetItemsSortedByPriceReturns200() throws Exception {
        mockMvc.perform(get("/api/items/sortedByPrice")
                        .with(jwt())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn();
    }

    @Order(5)
    @Test
    void UpdateItemReturns200() throws Exception {
        String updatedData = """
                {
                    "itemName": "Coffee",
                    "category": "Beverages",
                    "price": 120,
                    "available": true
                }
                """;

        mockMvc.perform(MockMvcRequestBuilders.put("/api/items/1")
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedData)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
    }

  

    // ---------- Project Structure Tests ----------
    @Test
    void ControllerDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/controller";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void ItemControllerFileExists() {
        String filePath = "src/main/java/com/examly/springapp/controller/ItemController.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    void ModelDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/model";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void ItemModelFileExists() {
        String filePath = "src/main/java/com/examly/springapp/model/Item.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    void RepositoryDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/repository";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void ServiceDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/service";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void ItemServiceClassExists() {
        checkClassExists("com.examly.springapp.service.ItemService");
    }

    @Test
    void ItemModelClassExists() {
        checkClassExists("com.examly.springapp.model.Item");
    }

    @Test
    void ItemModelHasItemNameField() {
        checkFieldExists("com.examly.springapp.model.Item", "itemName");
    }

    @Test
    void ItemModelHasCategoryField() {
        checkFieldExists("com.examly.springapp.model.Item", "category");
    }

    @Test
    void ItemModelHasPriceField() {
        checkFieldExists("com.examly.springapp.model.Item", "price");
    }

    @Test
    void ItemModelHasAvailableField() {
        checkFieldExists("com.examly.springapp.model.Item", "available");
    }

    @Test
    void ItemRepoExtendsJpaRepository() {
        checkClassImplementsInterface("com.examly.springapp.repository.ItemRepository", "org.springframework.data.jpa.repository.JpaRepository");
    }

    @Test
    void CorsConfigurationClassExists() {
        checkClassExists("com.examly.springapp.configuration.CorsConfiguration");
    }

    @Test
    void CorsConfigurationHasConfigurationAnnotation() {
        checkClassHasAnnotation("com.examly.springapp.configuration.CorsConfiguration", "org.springframework.context.annotation.Configuration");
    }

    @Test
    void ItemNotFoundExceptionClassExists() {
        checkClassExists("com.examly.springapp.exception.ItemNotFoundException");
    }

    @Test
    void ItemNotFoundExceptionExtendsRuntimeException() {
        try {
            Class<?> clazz = Class.forName("com.examly.springapp.exception.ItemNotFoundException");
            assertTrue(RuntimeException.class.isAssignableFrom(clazz),
                    "ItemNotFoundException should extend RuntimeException");
        } catch (ClassNotFoundException e) {
            fail("ItemNotFoundException class does not exist.");
        }
    }

    // ---------- Helpers ----------
    private void checkClassExists(String className) {
        try {
            Class.forName(className);
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " does not exist.");
        }
    }

    private void checkFieldExists(String className, String fieldName) {
        try {
            Class<?> clazz = Class.forName(className);
            clazz.getDeclaredField(fieldName);
        } catch (ClassNotFoundException | NoSuchFieldException e) {
            fail("Field " + fieldName + " in class " + className + " does not exist.");
        }
    }

    private void checkClassImplementsInterface(String className, String interfaceName) {
        try {
            Class<?> clazz = Class.forName(className);
            Class<?> interfaceClazz = Class.forName(interfaceName);
            assertTrue(interfaceClazz.isAssignableFrom(clazz));
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " or interface " + interfaceName + " does not exist.");
        }
    }

    private void checkClassHasAnnotation(String className, String annotationName) {
        try {
            Class<?> clazz = Class.forName(className);
            Class<?> annotationClazz = Class.forName(annotationName);
            assertTrue(clazz.isAnnotationPresent((Class<? extends java.lang.annotation.Annotation>) annotationClazz));
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " or annotation " + annotationName + " does not exist.");
        }
    }
}
