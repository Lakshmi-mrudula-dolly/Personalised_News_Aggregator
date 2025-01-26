package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import services.UserService;
import java.util.*;
import org.bson.Document;

import javax.inject.Inject;

public class UserController extends Controller {

    private final UserService userService;

    @Inject
    public UserController(UserService userService) {
        this.userService = userService;
    }

    public Result login(Http.Request request) {
        JsonNode requestBody = request.body().asJson();
        if (requestBody == null) {
            return badRequest(Json.newObject().put("error", "Invalid JSON"));
        }

        String email = requestBody.get("email").asText();
        String password = requestBody.get("password").asText();

        boolean isAuthenticated = userService.authenticateUser(email, password);
        if (isAuthenticated) {
            return ok(Json.newObject().put("message", "Login successful"));
        } else {
            return unauthorized(Json.newObject().put("error", "Invalid credentials"));
        }
    }

    // /*final 
       public Result signup(Http.Request request) {
        JsonNode requestBody = request.body().asJson();
        if (requestBody == null) {
            return badRequest(Json.newObject().put("error", "Invalid JSON"));
        }
    
        String username = requestBody.get("username").asText();
        String email = requestBody.get("email").asText();
        String password = requestBody.get("password").asText();
        List<String> preferences = Json.fromJson(requestBody.get("preferences"), List.class); // Store as preferences

        boolean isRegistered = userService.registerUser(username, email, password, preferences);
        if (isRegistered) {
            return ok(Json.newObject().put("message", "Signup successful"));
        } else {
            return badRequest(Json.newObject().put("error", "User already exists"));
        }
    }
    
    public Result getNews(Http.Request request) {
        String categories = request.getQueryString("categories");
        if (categories == null || categories.isEmpty()) {
            return badRequest(Json.toJson("No categories provided"));
        }
    
        // Call the news API with preferences
        String[] categoryList = categories.split(",");
        List<Document> articles = fetchArticlesFromAPI(categoryList); // Custom logic for API integration
    
        return ok(Json.toJson(articles));
    }
    
    // Example API call method
    private List<Document> fetchArticlesFromAPI(String[] categories) {
        List<Document> allArticles = new ArrayList<>();
        for (String category : categories) {
            // Make an API call for each category and collect results
            // Replace with actual news API logic
            allArticles.add(new Document("title", "Sample Title for " + category)
                                  .append("description", "Sample Description")
                                  .append("url", "http://example.com"));
        }
        return allArticles;
    }
    public Result savePreferences(Http.Request request) {
        JsonNode requestBody = request.body().asJson();
        if (requestBody == null) {
            return badRequest(Json.newObject().put("error", "Invalid JSON"));
        }

        String email = requestBody.get("email").asText();
        String language = requestBody.get("language").asText();
        String category = requestBody.get("category").asText();

        boolean isSaved = userService.saveUserPreferences(email, language, category);
        if (isSaved) {
            return ok(Json.newObject().put("message", "Preferences saved successfully"));
        } else {
            return internalServerError(Json.newObject().put("error", "Failed to save preferences"));
        }
    }
    
    
}
