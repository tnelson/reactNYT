# Firebase configuration and Clerk production

## Firebase RTDB Configuration

This app is a bit outdated, because it [uses the realtime database service rather than the firestore service](https://firebase.google.com/docs/database/rtdb-vs-firestore).   

I slightly edited the default here, so that:
  - the `experimental` path could get arbitrary reads and writes from anyone; and 
  - the `sequences` path could get writes from anyone but not reads. Furthermore, a record isn't allowed to be overwritten.

It's worth experimenting with your access-control policies in Firebase; you can protect your data better than this project protects its data. For example, I'm not using Firebase authentication, which can be integrated with Clerk. They even have [a guide](https://clerk.com/docs/integrations/databases/firebase)! But in Fall 2024 at least, this is a "reach" goal, not a requirement, for the sprints in 0320.

**NOTE WELL**: This app is purely TypeScript. If you need to integrate Firebase with a Java backend, you'll configure it slightly differently, and get Java code rather than TypeScript code. 

## The policy I'm using (last accessed Oct 21 2024)

Since this app uses the Realtime Database service, not Firestore, [the syntax of policies differs](https://firebase.google.com/docs/rules/rules-language) from what you might use in Firestore. Still, since these are part of the project configuration in the console rather than a repository (and thus not visible in the code here) I'm including the policy I'm using here for reference. 

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