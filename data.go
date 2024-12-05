package main

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func initDatabase() {
	var err error

	dsn := "host=localhost user=postgres password=3141 dbname=gochat sslmode=disable TimeZone=Asia/Shanghai"

	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect to the database: %v", err)
	}

	if db == nil {
		log.Fatal("Database connection is nil")
	}

	//Migrate the schema
	err = db.AutoMigrate(&Auth{})
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}
}
