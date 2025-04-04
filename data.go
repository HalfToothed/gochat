package main

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func initDatabase() {
	var err error

	dbHost := os.Getenv("DB_HOST")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbUser := os.Getenv("DB_USERNAME")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")

	log.Println("DB_HOST:", dbHost)
	log.Println("DB_PASSWORD:", dbPassword)
	log.Println("DB_USERNAME:", dbUser)
	log.Println("DB_NAME:", dbName)
	log.Println("DB_PORT:", dbPort)

	if dbHost == "" || dbPassword == "" || dbUser == "" || dbName == "" || dbPort == "" {
		log.Fatal("Database environment variables are not properly set")
	}

	// Build DSN string dynamically
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		dbHost, dbUser, dbPassword, dbName, dbPort,
	)

	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect to the database: %v", err)
	}

	if db == nil {
		log.Fatal("Database connection is nil")
	}

	//Migrate the schema
	err = db.AutoMigrate(&Auth{}, &Input{})
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}
}
