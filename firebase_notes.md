# Firebase "Realtime Database" configuration

I slightly edited the default here, so that:
  - the `experimental` path could get arbitrary reads and writes from anyone; and 
  - the `sequences` path could get writes from anyone but not reads. Furthermore, a record isn't allowed to be overwritten.

It's worth experimenting with your access-control policies in Firebase; you can protect your data better than this project protects its data. For example, I'm not using Firebase authentication, which can be integrated with Clerk. They even have [a guide](https://clerk.com/docs/integrations/databases/firebase)!

**NOTE WELL**: This app is purely TypeScript. If you need to integrate Firebase with a Java backend, you'll configure it slightly differently, and get Java code rather than TypeScript code. 

## The policy I'm using (Oct 21 2024)

```
{
  "rules": {
    ".read": false,
    ".write": false,
    "sequences": {
      "$child_id": {
        ".read": false,
        ".write": " !data.exists()"
      }
    },
    "experimental": {
      ".read": true,
      ".write": true
    }
  }
}
```