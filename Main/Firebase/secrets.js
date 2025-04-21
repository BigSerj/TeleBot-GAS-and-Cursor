// function sssset(){
//   PropertiesService.getScriptProperties().setProperty("type", "service_account")
//   PropertiesService.getScriptProperties().setProperty("project_id", "fk-workbot")
//   PropertiesService.getScriptProperties().setProperty("private_key_id", "b3ac5169f22d0a3c836bc3776069976018ba8a57")
//   PropertiesService.getScriptProperties().setProperty("private_key", "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCaPO5OAzU7CJQA\ngSB4nTHHxP7cWaPLIH527ORR519Q1Aw63TB7zWHhz5VmNJwPPlz0f7PWXnhvW03v\n173acTZc9fp/CxtjJCtMkcRGCl1x0AIqcUZ+8fkhYzm8ItnYMRAYAWZ0Wk/H1/vX\n4FwmKMte6o62jpKS/tupSVeX9kO5vljeAm5kiUFQj0JXXtFoW0t6VhOw0QGdWqwq\nfTF0jpBSwEOs/ZAdLFUeBsj4zVd4DE//zGYK8hV2oMgODyPGwZAFdQc6duIeGHle\nS0M5w2YV4iuQ4wJ0GQkxPpPjFr1Aj3mtFzuCzAOSZf+mP7IuEyd8vzAZ+85jVAJN\nTcSVJYEzAgMBAAECggEAGaRanAalgWB+No1BKDw+C+/AzUJr3DfVPpFIriMwsf/m\n3pxqVJLDHKcFt/20GkasbouSiueezyiXTvIHorriplbQo/FlRri7KBotztUnTuYd\njg/SAAXbfMUB0rjajbouakdFUL+49sj+Ghg3SbLLiManHkuaq6yKOV0znlR3UvhD\nt7Zb8O32th6MQqj8sJDZuoszxmvnkgYS6k27nT43yzwSbaBGWqqvjiQW4007Aumi\ntPmiM0SPrCCdP1fhMQt+fJ0i9wxGv0n/fJJVmNmX9JUQQ32A3g5eK6cBqsiZAU2D\nBExQsz1ZvW0QVU3GdIY1uHKTLfRxtrNaTqmoZgoGlQKBgQDLmfm178z2URCmg4gB\nHk19knBOil4zRII71BJwf9CLeEqn3RoA8NTtAWIfMo5/NEG9aAUNO8H0p5fr5ilx\nXMkJ4NxJfP5x8cd52Hr8sflF9kVnKUT1Karxa2sOOvn03ljKEFgQcWJJg5Wcf3NS\n0oX+mzH1UDyPxHmHSB4KcKoRFwKBgQDB7rTuLzaZBq2gfI7BTzLWuCTHWxxCShku\n7YEQp6HtvwfzAzkGtc2xGCbvjFNBYdzWgVsGyY3464FEkqLlrA99k36coUgKlj34\nwRYW+Gau+YNlLKjpDwDX2gFO5IClPG6HQDA+Ey+NI43FLgJQJhIeEbkg+iJPr9nn\nmzt5QPwKRQKBgFrDqa6R2K12NhYFTPwyphj0z1w0EwqH4AcL46yDTlTeq2lqB82j\nj0iY9UUzJJNQmH33gUkE+tI2ZGOll5QR6Q2eUJXyQvxI7MRE3Y8JSDcIMqhqnXMt\nwCcf2/ncENI4zRxHbPrnkQl0v52ks6SYdWOri/nwaw8sZ4EHhVziHO7BAoGBALPN\nd56l038JfA0hrtF3dnExhZf31zl2reaeeV1RroZY6SvcPxEDmlOpSuAqQD6MV03h\n3N1sHd89qjpDohhC8JHDIE5kEgEOzyJFEw/0+m8cE0DIqUp7iJKYI0JcBRIt92Qa\nlR/YdevrnNPGFors4TtTv0rd3tX2+pcLi5aeM4/pAoGAZjQX7/0li/XRDAhBNViE\ncC/F4BT6o5i/pof1NqS5Pc9EwQRQaSqah8gvuGWPUkqSPB12cKftxaZ8+Wms62R/\nFgAanH0+lx0uzDutOv9zSOIS4XMcvOUxO/Pts5jZlJIisQOTxVgpI+EvtRjyfyrf\n7Sb1VaX8MxV8X0QRdLyUhl8=\n-----END PRIVATE KEY-----")
//   PropertiesService.getScriptProperties().setProperty("client_email", "firebase-adminsdk-fbsvc@fk-workbot.iam.gserviceaccount.com")
//   PropertiesService.getScriptProperties().setProperty("client_id", "105420138125847580084")
//   PropertiesService.getScriptProperties().setProperty("auth_uri", "https://accounts.google.com/o/oauth2/auth")
//   PropertiesService.getScriptProperties().setProperty("token_uri", "https://oauth2.googleapis.com/token")
//   PropertiesService.getScriptProperties().setProperty("auth_provider_x509_cert_url", "https://www.googleapis.com/oauth2/v1/certs")
//   PropertiesService.getScriptProperties().setProperty("client_x509_cert_url", "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40fk-workbot.iam.gserviceaccount.com")
//   PropertiesService.getScriptProperties().setProperty("universe_domain", "googleapis.com")
// }
/**
{
  "rules": {
    "some_path": {
      "$uid": {
        // Allow only authenticated content owners access to their data
        ".read": "auth.uid === $uid",
        ".write": "auth.uid === $uid"
      }
    }
  }
}
{
  "rules": {
    ".read": "auth.token.email == 'firebase-adminsdk-fbsvc@fk-workbot.iam.gserviceaccount.com'",
    ".write": "auth.token.email == 'firebase-adminsdk-fbsvc@fk-workbot.iam.gserviceaccount.com'"
  }
}

 */












