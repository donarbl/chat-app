# Testing Documentation

## Manual Testing Results

### Backend API Tests (cURL)

#### GET /messages
- **Command:** `curl http://localhost:3001/messages`
- **Expected:** 200 OK, JSON array of messages
- **Result:** ✅ Pass
- **Notes:** Returns all messages with likes/dislikes fields

#### POST /messages (Valid)
- **Command:** `curl -X POST http://localhost:3001/messages -H "Content-Type: application/json" -d '{"sender":"TestUser","text":"Hello"}'`
- **Expected:** 201 Created, message object with id, time, likes, dislikes
- **Result:** ✅ Pass
- **Sample Response:** `{"id":1,"sender":"TestUser","text":"Hello","time":"2025-10-26T17:00:00.000Z","likes":0,"dislikes":0}`

#### POST /messages (Invalid - Empty Fields)
- **Command:** `curl -X POST http://localhost:3001/messages -H "Content-Type: application/json" -d '{"sender":"","text":""}'`
- **Expected:** 400 Bad Request, error message
- **Result:** ✅ Pass
- **Response:** `{"error":"Sender and message text are required."}`

#### POST /messages/:id/like
- **Command:** `curl -X POST http://localhost:3001/messages/1/like`
- **Expected:** 200 OK, updated like count
- **Result:** ✅ Pass
- **Response:** `{"id":1,"likes":1}`

#### POST /messages/:id/dislike
- **Command:** `curl -X POST http://localhost:3001/messages/1/dislike`
- **Expected:** 200 OK, updated dislike count
- **Result:** ✅ Pass
- **Response:** `{"id":1,"dislikes":1}`

#### DELETE /messages/:id (Valid)
- **Command:** `curl -X DELETE http://localhost:3001/messages/1`
- **Expected:** 204 No Content
- **Result:** ✅ Pass

#### DELETE /messages/:id (Invalid - Not Found)
- **Command:** `curl -X DELETE http://localhost:3001/messages/999`
- **Expected:** 404 Not Found, error message
- **Result:** ✅ Pass
- **Response:** `{"error":"Message not found"}`

### Frontend Manual Tests

#### Send Message with Valid Input
- **Steps:** Enter name "Alice", message "Hello", click Send
- **Expected:** Message appears in list, input fields cleared, green success message
- **Result:** ✅ Pass

#### Send Message with Empty Fields
- **Steps:** Leave fields empty, click Send
- **Expected:** Red error message displayed
- **Result:** ✅ Pass
- **Message:** "Please enter both your name and message"

#### Like Button
- **Steps:** Click 👍 on a message
- **Expected:** Counter increments, updates in all open windows
- **Result:** ✅ Pass
- **Notes:** Real-time update works across multiple browser windows

#### Dislike Button
- **Steps:** Click 👎 on a message
- **Expected:** Counter increments, updates in all open windows
- **Result:** ✅ Pass

#### Delete Button
- **Steps:** Click Delete on a message
- **Expected:** Message removed, updates in all windows
- **Result:** ✅ Pass

#### Enter Key Submit
- **Steps:** Type in name field, press Enter
- **Expected:** Message sent
- **Result:** ✅ Pass

#### WebSocket Connection
- **Steps:** Open page, check connection status
- **Expected:** Green "Connected" status
- **Result:** ✅ Pass

#### WebSocket Reconnection
- **Steps:** Stop server, check status, restart server
- **Expected:** Yellow "Reconnecting", then green when reconnected
- **Result:** ✅ Pass

#### Real-time Updates (Multiple Clients)
- **Steps:** Open 2 browser windows, send message from one
- **Expected:** Message appears instantly in both
- **Result:** ✅ Pass

### Mobile Responsiveness

## Testing Tools Used

- cURL for API testing
- Chrome DevTools Console for debugging
- Multiple browser windows for real-time testing

