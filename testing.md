# Chat App Testing Documentation

## Manual Testing Results

### GET /messages
- **Test:** Retrieve all messages
- **Command:** `curl http://localhost:3000/messages`
- **Expected Result:** Returns JSON array of messages
- **Status:** Pass

### POST /messages (Valid)
- **Test:** Send a message with both sender and text
- **Command:** `curl -X POST http://localhost:3000/messages -H "Content-Type: application/json" -d '{"sender":"Ana","text":"Hello"}'`
- **Expected Result:** 201 status, message added with id and timestamp
- **Status:** Pass

### POST /messages (Invalid - Empty fields)
- **Test:** Try to send empty message
- **Command:** `curl -X POST http://localhost:3000/messages -H "Content-Type: application/json" -d '{"sender":"","text":""}'`
- **Expected Result:** 400 status with error message
- **Status:** Pass

### DELETE /messages/:id (Valid)
- **Test:** Delete an existing message
- **Command:** `curl -X DELETE http://localhost:3000/messages/1`
- **Expected Result:** 204 status, message removed
- **Status:** Pass

### DELETE /messages/:id (Invalid)
- **Test:** Try to delete non-existent message
- **Command:** `curl -X DELETE http://localhost:3000/messages/999`
- **Expected Result:** 404 status with error message
- **Status:** Pass

## Frontend Testing
- Send message with filled fields: ✅ Works, shows "Message sent"
- Send message with empty fields: ✅ Shows validation error
- Delete message: ✅ Works, shows "Message deleted"
- Network error handling: ✅ Shows error when server is down
