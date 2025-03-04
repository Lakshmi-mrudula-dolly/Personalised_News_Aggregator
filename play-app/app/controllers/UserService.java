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
    public boolean isUserExists(String email) {
        MongoDatabase database = mongoClient.getDatabase("newsApp");
        MongoCollection<Document> users = database.getCollection("users");

        Document user = users.find(new Document("email", email)).first();
        return user != null; // Return true if a user with this email exists
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
        public Document getUserDetails(String email) {
    // Ensure the email is not null or empty
    if (email == null || email.trim().isEmpty()) {
        throw new IllegalArgumentException("Email cannot be null or empty");
    }

    // Access the database and collection
    MongoDatabase database = mongoClient.getDatabase("newsApp");
    MongoCollection<Document> users = database.getCollection("users");

    // Find the user by email
    Document user = users.find(new Document("email", email)).first();

    // Handle if the user is not found
    if (user == null) {
        throw new IllegalStateException("User not found for email: " + email);
    }

    return user;
}
    public boolean updateUserPreferences(String email, List<String> categories) {
        MongoDatabase database = mongoClient.getDatabase("newsApp");
        MongoCollection<Document> users = database.getCollection("users");

        Document user = users.find(new Document("email", email)).first();
        if (user != null) {
            users.updateOne(
                new Document("email", email),
                new Document("$set", new Document("preferences", categories))
            );
            return true;
        }
        return false;
    }
    public boolean storeClickedNews(String email, String title) {
        MongoDatabase database = mongoClient.getDatabase("newsApp");
        MongoCollection<Document> users = database.getCollection("users");
    
        Document user = users.find(new Document("email", email)).first();
        if (user != null) {
            Document update = new Document("$addToSet", new Document("clicked_titles", title)); // Store title only
    
            users.updateOne(new Document("email", email), update);
            return true;
        }
        return false;
    }
      
    
}
