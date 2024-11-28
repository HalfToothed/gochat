package main

import (
	"log"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func initDatabase() {
	var err error
	db, err = gorm.Open(sqlite.Open("database.db"), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect to the database: %v", err)
	}

	//Migrate the schema
	err = db.AutoMigrate(&User{})
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}
}
