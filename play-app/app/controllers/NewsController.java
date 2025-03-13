package controllers;

import play.mvc.*;
import services.NewsService;
import com.fasterxml.jackson.databind.JsonNode;
import javax.inject.Inject;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.CompletableFuture;

public class NewsController extends Controller {
    private final NewsService newsService;

    @Inject
    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    // Fetch news for a specific category and language
    public CompletionStage<Result> getCategoryNews(String category, String language) {
        return newsService.fetchNewsByCategory(category, language)
                .thenApply(newsJson -> ok(newsJson));
    }

    // Fetch personalized news for the user's selected categories
   public CompletionStage<Result> getMyFeed(Http.Request request) {
    String categories = request.getQueryString("categories");
    String language = request.getQueryString("language");

    if (categories == null || language == null) {
        return CompletableFuture.completedFuture(badRequest("Missing categories or language"));
    }

    return newsService.fetchNewsForUser(categories.split(","), language)
            .thenApply(newsJson -> ok(newsJson));
}
  

}
/*private static final String API_KEY = "22fe63d43e1d3df803e7327e6eb1ca6f3ecab2565f3b76daca245331e7e05179";
    private static final String BASE_URL = "https://serpapi.com/search";
    private static final String TOPIC_TOKEN = "CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB";*/