package services;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import javax.inject.Inject;
import java.util.*;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.CompletableFuture;

import play.libs.concurrent.HttpExecutionContext;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;

public class UserService {

    private final MongoClient mongoClient;
    private final MongoCollection<Document> usersCollection;
    private final HttpExecutionContext ec;

    @Inject
    public UserService(MongoClient mongoClient, HttpExecutionContext ec) {
        this.mongoClient = mongoClient;
        this.ec = ec;
        MongoDatabase database = mongoClient.getDatabase("newsApp");
        this.usersCollection = database.getCollection("users");
    }

    public boolean authenticateUser(String email, String password) {
        Document user = usersCollection.find(new Document("email", email).append("password", password)).first();
        return user != null;
    }

    public boolean isUserExists(String email) {
        Document user = usersCollection.find(new Document("email", email)).first();
        return user != null; 
    }

    public boolean registerUser(String username, String email, String password, List<String> preferences) {
        Document newUser = new Document("username", username)
                .append("email", email)
                .append("password", password)
                .append("preferences", preferences);

        usersCollection.insertOne(newUser);
        return true;
    }

    public Document getUserDetails(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        Document user = usersCollection.find(new Document("email", email)).first();

        if (user == null) {
            throw new IllegalStateException("User not found for email: " + email);
        }

        return user;
    }

    public boolean updateUserPreferences(String email, List<String> categories) {
        Document user = usersCollection.find(new Document("email", email)).first();
        if (user != null) {
            usersCollection.updateOne(eq("email", email), set("preferences", categories));
            return true;
        }
        return false;
    }

    public boolean storeClickedNews(String email, String title) {
        Document user = usersCollection.find(new Document("email", email)).first();
        if (user != null) {
            usersCollection.updateOne(eq("email", email), new Document("$addToSet", new Document("clicked_titles", title)));
            return true;
        }
        return false;
    }

    public boolean subscribeUser(String email) {
        Document user = usersCollection.find(eq("email", email)).first();
        if (user != null) {
            usersCollection.updateOne(eq("email", email), set("isSubscribed", true));
            return true;
        }
        return false;
    }

    public List<String> getBookmarks(String email) {
        Document user = usersCollection.find(eq("email", email)).first();
        if (user != null) {
            return user.getList("bookmarks", String.class, Collections.emptyList());
        }
        return Collections.emptyList();
    }
    
    public CompletionStage<Void> updateCategoryCount(String email, String category, int change) {
        return CompletableFuture.runAsync(() -> {
            Document user = usersCollection.find(eq("email", email)).first();
            if (user != null) {
                Document categoryCounts = (Document) user.get("category_counts");
                int updatedCount = categoryCounts.getInteger(category, 0) + change;
                categoryCounts.put(category, Math.max(updatedCount, 0));

                usersCollection.updateOne(eq("email", email), set("category_counts", categoryCounts));
            }
        }, ec.current());
    }

    public CompletionStage<Void> addBookmark(String email, String title) {
        return CompletableFuture.runAsync(() -> {
            Document user = usersCollection.find(eq("email", email)).first();
            if (user != null) {
                List<String> bookmarks = (List<String>) user.get("bookmarks");
                if (bookmarks == null) {
                    bookmarks = new ArrayList<>();
                }

                if (bookmarks.size() >= 20) {
                    bookmarks.remove(0);
                }

                bookmarks.add(title);
                usersCollection.updateOne(eq("email", email), set("bookmarks", bookmarks));
            }
        }, ec.current());
    }
}
