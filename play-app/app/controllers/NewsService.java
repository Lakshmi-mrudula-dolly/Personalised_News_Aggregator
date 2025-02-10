package services;

import com.fasterxml.jackson.databind.JsonNode;
import play.libs.ws.WSClient;
import play.libs.ws.WSResponse;
import javax.inject.Inject;
import java.util.concurrent.CompletionStage;

public class NewsService {
    private final WSClient ws;
    private static final String API_KEY = "22fe63d43e1d3df803e7327e6eb1ca6f3ecab2565f3b76daca245331e7e05179";
    private static final String BASE_URL = "https://serpapi.com/search";

    @Inject
    public NewsService(WSClient ws) {
        this.ws = ws;
    }

    // Fetch news by category and language
    public CompletionStage<JsonNode> fetchNewsByCategory(String category, String language) {
        String url = String.format("%s?engine=google_news&q=%s&hl=%s&api_key=%s", BASE_URL, category, language, API_KEY);
        return ws.url(url).get().thenApply(WSResponse::asJson);
    }
    

    // Fetch news for multiple categories (user’s selected categories)
    public CompletionStage<JsonNode> fetchNewsForUser(String[] categories, String language) {
        String categoryQuery = String.join(" OR ", categories); // Join categories with OR for better results
        String url = String.format("%s?engine=google_news&q=%s&hl=%s&api_key=%s", BASE_URL, categoryQuery, language, API_KEY);
        
        return ws.url(url).get().thenApply(WSResponse::asJson);
    }
    
}
