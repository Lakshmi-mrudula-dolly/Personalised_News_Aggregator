package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.libs.Json;
import play.libs.ws.WSClient;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import services.UserService;
import org.bson.Document;
import javax.inject.Inject;
import java.util.*;
import java.util.concurrent.CompletionStage;

public class UserController extends Controller {

    private final UserService userService;
    private final WSClient ws;

    @Inject
    public UserController(UserService userService, WSClient ws) {
        this.userService = userService;
        this.ws = ws;
    }

    public Result login(Http.Request request) {
        JsonNode requestBody = request.body().asJson();
        if (requestBody == null || !requestBody.has("email") || !requestBody.has("password")) {
            return badRequest(Json.newObject().put("error", "Missing email or password"));
        }

        String email = requestBody.get("email").asText();
        String password = requestBody.get("password").asText();

        boolean isAuthenticated = userService.authenticateUser(email, password);
        if (isAuthenticated) {
            // ✅ Call recommender system asynchronously after login
            callRecommenderSystem(email);
            return ok(Json.newObject().put("message", "Login successful"));
        } else {
            return unauthorized(Json.newObject().put("error", "Invalid credentials"));
        }
    }

   //  Updated method: Calls Flask recommender system using POST request
private void callRecommenderSystem(String email) {
    String recommenderUrl = "http://localhost:5001/run_recommender";

    ObjectNode requestBody = Json.newObject();
    requestBody.put("email", email);  // ✅ Corrected key from "user_id" to "email"

    ws.url(recommenderUrl)
        .setHeader("Content-Type", "application/json")
        .post(requestBody)
        .thenAccept(response -> {
            if (response.getStatus() == 200) {
                System.out.println("✅ Recommender system updated preferences: " + response.getBody());
            } else {
                System.err.println("❌ Failed to update recommender: " + response.getStatus() + " - " + response.getBody());
            }
        })
        .exceptionally(e -> {
            System.err.println("❌ Error calling recommender system: " + e.getMessage());
            return null;
        });
}


    public Result signup(Http.Request request) {
        JsonNode requestBody = request.body().asJson();
        if (requestBody == null || !requestBody.has("username") || !requestBody.has("email") || !requestBody.has("password") || !requestBody.has("preferences")) {
            return badRequest(Json.newObject().put("error", "Missing required fields"));
        }

        try {
            String username = requestBody.get("username").asText();
            String email = requestBody.get("email").asText();
            String password = requestBody.get("password").asText();
            List<String> preferences = Json.fromJson(requestBody.get("preferences"), List.class);

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
        JsonNode json = request.body().asJson();
        if (json == null || !json.has("email")) {
            return badRequest(Json.newObject().put("error", "Email is required"));
        }

        String email = json.get("email").asText();
        try {
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

    public Result storeClickedNews(Http.Request request) {
        JsonNode json = request.body().asJson();
        if (json == null || !json.has("email") || !json.has("title")) {
            return badRequest(Json.newObject().put("error", "Missing email or title"));
        }

        String email = json.get("email").asText();
        String title = json.get("title").asText();

        boolean isStored = userService.storeClickedNews(email, title);
        if (isStored) {
            return ok(Json.newObject().put("message", "News click stored successfully"));
        } else {
            return internalServerError(Json.newObject().put("error", "Failed to store clicked news"));
        }
    }
}
