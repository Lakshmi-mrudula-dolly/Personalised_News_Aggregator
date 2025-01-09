package modules;

import com.google.inject.AbstractModule;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

public class Module extends AbstractModule {
    @Override
    protected void configure() {
        bind(MongoClient.class).toInstance(createMongoClient());
    }

    private MongoClient createMongoClient() {
        String connectionString = "mongodb://localhost:27017"; // Replace with your connection string
        return MongoClients.create(connectionString);
    }
}
