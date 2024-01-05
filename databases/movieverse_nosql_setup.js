// Connecting to the MongoDB instance
db = connect("localhost:27017/MovieVerseDB");

// Dropping existing collections if they exist (for clean setup)
db.userPreferences.drop();
db.sessionData.drop();
db.appLogs.drop();

// Creating collections with their respective schemas
// Collection for User Preferences
db.createCollection("userPreferences", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["userId", "preferences"],
            properties: {
                userId: {
                    bsonType: "int",
                    description: "User identifier"
                },
                preferences: {
                    bsonType: "object",
                    properties: {
                        genres: {
                            bsonType: "array",
                            items: {
                                bsonType: "string",
                                description: "Preferred genres"
                            }
                        },
                        directors: {
                            bsonType: "array",
                            items: {
                                bsonType: "string",
                                description: "Preferred directors"
                            }
                        },
                        actors: {
                            bsonType: "array",
                            items: {
                                bsonType: "string",
                                description: "Favorite actors"
                            }
                        }
                        // Additional preferences can be added here
                    }
                }
            }
        }
    }
});

// Collection for Session Data
db.createCollection("sessionData", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["sessionId", "userId", "startTime"],
            properties: {
                sessionId: {
                    bsonType: "string",
                    description: "Unique session identifier"
                },
                userId: {
                    bsonType: "int",
                    description: "User identifier for the session"
                },
                startTime: {
                    bsonType: "date",
                    description: "Session start time"
                },
                activities: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        properties: {
                            timestamp: {
                                bsonType: "date",
                                description: "Activity timestamp"
                            },
                            activity: {
                                bsonType: "string",
                                description: "Description of user activity"
                            }
                        }
                    }
                }
            }
        }
    }
});

// Collection for Application Logs
db.createCollection("appLogs", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["timestamp", "logLevel", "message"],
            properties: {
                timestamp: {
                    bsonType: "date",
                    description: "Log timestamp"
                },
                logLevel: {
                    bsonType: "string",
                    enum: ["INFO", "WARN", "ERROR", "DEBUG"],
                    description: "Log level"
                },
                message: {
                    bsonType: "string",
                    description: "Log message"
                },
                details: {
                    bsonType: "object",
                    description: "Additional details about the log, if any"
                }
            }
        }
    }
});

// Indexes for optimization
db.userPreferences.createIndex({ userId: 1 });
db.sessionData.createIndex({ sessionId: 1 });
db.appLogs.createIndex({ timestamp: -1 });
