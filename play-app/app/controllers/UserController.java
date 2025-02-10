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

    try {
        String username = requestBody.get("username").asText();
        String email = requestBody.get("email").asText();
        String password = requestBody.get("password").asText();
        List<String> preferences = Json.fromJson(requestBody.get("preferences"), List.class);

        // Check if user already exists before attempting registration
        if (userService.isUserExists(email)) {
            return badRequest(Json.newObject().put("error", "User with this email already exists"));
        }

        boolean isRegistered = userService.registerUser(username, email, password, preferences);
        if (isRegistered) {
            return ok(Json.newObject().put("message", "Signup successful"));
        } else {
            return internalServerError(Json.newObject().put("error", "Signup failed. Please try again later"));
        }
    } catch (Exception e) {
        return internalServerError(Json.newObject().put("error", "An error occurred: " + e.getMessage()));
    }
}

   public Result getUser(Http.Request request) {
    // Extract email from the request body
    JsonNode json = request.body().asJson();
    if (json == null || !json.has("email")) {
        return badRequest(Json.newObject().put("error", "Email is required"));
    }

    String email = json.get("email").asText();
    try {
        // Use the email to fetch the user from the database
        Document userDetails = userService.getUserDetails(email);

        if (userDetails != null) {
            userDetails.remove("_id");
            return ok(Json.toJson(userDetails));
        } else {
            return notFound(Json.newObject().put("error", "User not found"));
        }
    } catch (IllegalArgumentException e) {
        return badRequest(Json.newObject().put("error", e.getMessage()));
    } catch (Exception e) {
        return internalServerError(Json.newObject().put("error", "An unexpected error occurred"));
    }
}

  public Result updatePreferences(Http.Request request) {
    JsonNode json = request.body().asJson();
    if (json == null || !json.has("email") || !json.has("preferences")) {
        return badRequest(Json.newObject().put("error", "Missing email or preferences in request body"));
    }

    String email = json.get("email").asText();
    JsonNode preferencesNode = json.get("preferences");

    List<String> preferences = new ArrayList<>();
    preferencesNode.forEach(pref -> preferences.add(pref.asText()));

    boolean isUpdated = userService.updateUserPreferences(email, preferences);

    if (isUpdated) {
        return ok(Json.newObject().put("message", "Preferences updated successfully"));
    } else {
        return internalServerError(Json.newObject().put("error", "Failed to update preferences"));
    }
}

}

    
