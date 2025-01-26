package services;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import java.util.*;
import javax.inject.Inject;

public class UserService {

    private final MongoClient mongoClient;

    @Inject
    public UserService(MongoClient mongoClient) {
        this.mongoClient = mongoClient;
    }

    public boolean authenticateUser(String email, String password) {
        MongoDatabase database = mongoClient.getDatabase("newsApp");
        MongoCollection<Document> users = database.getCollection("users");

        Document user = users.find(new Document("email", email).append("password", password)).first();
        return user != null;
    }
        public boolean registerUser(String username, String email, String password, List<String> preferences) {
        MongoDatabase database = mongoClient.getDatabase("newsApp");
        MongoCollection<Document> users = database.getCollection("users");

        // Insert new user with preferences field
        Document newUser = new Document("username", username)
                .append("email", email)
                .append("password", password)
                .append("preferences", preferences); // Store preferences here

        users.insertOne(newUser);
        return true;
    }

    public String getUserPreferences(String userId) {
        MongoDatabase database = mongoClient.getDatabase("newsApp");
        MongoCollection<Document> users = database.getCollection("users");
        
        Document user = users.find(new Document("userId", userId)).first();
        if (user != null && user.containsKey("preferences")) {
            return String.join(",", user.getList("preferences", String.class));
        }
        return "general";
    }
    public boolean saveUserPreferences(String email, String language, String category) {
        MongoDatabase database = mongoClient.getDatabase("newsApp");
        MongoCollection<Document> users = database.getCollection("users");
    
        Document user = users.find(new Document("email", email)).first();
        if (user != null) {
            Document preferenceEntry = new Document("language", language)
                                        .append("category", category)
                                        .append("timestamp", System.currentTimeMillis());
            users.updateOne(
                new Document("email", email),
                new Document("$push", new Document("preferences_history", preferenceEntry))
            );
            return true;
        }
        return false;
    } 
}
