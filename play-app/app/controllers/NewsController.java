 package controllers;

import play.libs.ws.WSClient;
import play.mvc.Controller;
import play.mvc.Result;
import play.libs.Json;
import javax.inject.Inject;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.CompletableFuture;
import services.UserService;

/**
 * NewsController handles news fetching and recommendation functionality.
 */
public class NewsController extends Controller {
    private final WSClient ws;
    private final UserService userService;

    // API Constants
    private static final String API_KEY = "22fe63d43e1d3df803e7327e6eb1ca6f3ecab2565f3b76daca245331e7e05179";
    private static final String BASE_URL = "https://serpapi.com/search";
    private static final String TOPIC_TOKEN = "CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB";

    @Inject
    public NewsController(WSClient ws, UserService userService) {
        this.ws = ws;
        this.userService = userService;
    }

    /**
     * Fetches news based on the specified category and page number.
     *
     * @param category News category (e.g., sports, technology).
     * @param page     Page number for paginated results.
     * @return A JSON response containing news data.
     */
    public CompletionStage<Result> getNews(String category, int page, String hl) {
        String url = String.format(
            "%s?engine=google_news&q=%s&api_key=%s&hl=%s&gl=in&page=%d",
            BASE_URL, category, API_KEY, hl, page
        );
    
        return ws.url(url)
                .addHeader("Accept", "application/json")
                .get()
                .thenApply(response -> {
                    if (response.getStatus() == 200) {
                        return ok(Json.parse(response.getBody()));
                    } else {
                        return internalServerError("Failed to fetch news. Status Code: " + response.getStatus());
                    }
                })
                .exceptionally(ex -> internalServerError("Exception occurred: " + ex.getMessage()));
    }
    
    public CompletionStage<Result> getNews(String category, int page) {
        String url = String.format(
            "%s?engine=google_news&q=%s&api_key=%s&hl=te&gl=in&page=%d",
            BASE_URL, category, API_KEY, page
        );

        return ws.url(url)
                .addHeader("Accept", "application/json")
                .get()
                .thenApply(response -> {
                    if (response.getStatus() == 200) {
                        return ok(Json.parse(response.getBody()));
                    } else {
                        return internalServerError("Failed to fetch news. Status Code: " + response.getStatus());
                    }
                })
                .exceptionally(ex -> {
                    return internalServerError("Exception occurred: " + ex.getMessage());
                });
    }

    /**
     * Fetches recommended news based on user preferences.
     *
     * @param userId ID of the user to fetch preferences.
     * @return A JSON response containing recommended news.
     */
    public CompletionStage<Result> getRecommendedNews(String userId) {
        String userPreferences = userService.getUserPreferences(userId);

        if (userPreferences == null || userPreferences.isEmpty()) {
            return CompletableFuture.completedFuture(
                badRequest("User preferences not found for userId: " + userId)
            );
        }

        String url = String.format(
            "%s?engine=google_news&q=%s&api_key=%s&hl=te&gl=in&page=1",
            BASE_URL, userPreferences, API_KEY
        );

        return ws.url(url)
                .addHeader("Accept", "application/json")
                .get()
                .thenApply(response -> {
                    if (response.getStatus() == 200) {
                        return ok(Json.parse(response.getBody()));
                    } else {
                        return internalServerError("Failed to fetch recommended news. Status Code: " + response.getStatus());
                    }
                })
                .exceptionally(ex -> {
                    return internalServerError("Exception occurred: " + ex.getMessage());
                });
    }
}



   /* public CompletionStage<Result> getNews(String category, int page) {
        String apiKey = "22fe63d43e1d3df803e7327e6eb1ca6f3ecab2565f3b76daca245331e7e05179"; // Replace with your actual API key
        String url = String.format("https://serpapi.com/search?engine=google_news&q=%s&api_key=%s&hl=en&gl=us&page=%d",
                category, apiKey, page);
    
        return ws.url(url)
                .get()
                .thenApply(response -> {
                    if (response.getStatus() == 200) {
                        return ok(Json.parse(response.getBody())); // Return the whole response
                    } else {
                        return internalServerError("Failed to fetch news");
                    }
                });
    }
    public CompletionStage<Result> getNewsDetails(String id) {
    String apiKey = "22fe63d43e1d3df803e7327e6eb1ca6f3ecab2565f3b76daca245331e7e05179"; // Replace with your actual API key
    String url = String.format("https://serpapi.com/article_details?engine=google_news&id=%s&api_key=%s", id, apiKey);

    return ws.url(url)
        .get()
        .thenApply(response -> {
            if (response.getStatus() == 200) {
                return ok(Json.parse(response.getBody())); // Return the article details
            } else {
                return internalServerError("Failed to fetch article details");
            }
        });
}*/

    
//}


/*package controllers;

import play.mvc.*;
import play.libs.ws.*;
import play.libs.Json;
import javax.inject.*;
import java.util.concurrent.CompletionStage;
import com.fasterxml.jackson.databind.JsonNode;

@Singleton
public class NewsController extends Controller {

    // API Key for SerpAPI (replace with your actual key)
    private final String apiKey = "22fe63d43e1d3df803e7327e6eb1ca6f3ecab2565f3b76daca245331e7e05179";
    private final WSClient ws;

    @Inject
    public NewsController(WSClient ws) {
        this.ws = ws;
    }

    public CompletionStage<Result> getNews(String category) {
        return getNews(category, 1);  // Default page is 1
    }

    public CompletionStage<Result> getNews(String category, int page) {
        // Construct the URL for the API call
        // int pageNumber = (page == null) ? 1 : page;
        String url = String.format("https://serpapi.com/search?engine=google_news&q=%s&api_key=%s&hl=en&gl=us&page=%d",
                category, apiKey, page);

        // Make the API call and return the result asynchronously
        return ws.url(url).get().thenApplyAsync(response -> {
            JsonNode json = response.asJson();
            return ok(json);
        });
    }
}*/
//apiKey = "22fe63d43e1d3df803e7327e6eb1ca6f3ecab2565f3b76daca245331e7e05179";
/*String.format("https://serpapi.com/search?engine=google_news&q=%s&api_key=%s&hl=en&gl=us&page=%d",
                category, apiKey, page);*/