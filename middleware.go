package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// JWTMiddleware validates JWT tokens in the Authorization header
func JWTMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract the token from the Authorization header
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing or invalid"})
			c.Abort()
			return
		}

		// Validate the token
		token, err := jwt.Parse(authHeader, func(token *jwt.Token) (interface{}, error) {
			// Ensure the signing method is what we expect
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return jwtSecret, nil
		})

		// Handle token validation errors
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Extract claims and pass them to the context
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			// Extract the user_id claim
			userID, ok := claims["user_id"].(float64) // JWT numeric claims are often float64
			if !ok {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user_id in token claims"})
				c.Abort()
				return
			}

			// Convert userID to int or string if needed
			intUserID := int(userID)

			// Save user ID in the context
			c.Set("user_id", intUserID)

		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		// Token is valid; continue to the next handler
		c.Next()
	}
}
