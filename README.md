# NYT Puzzle (React)

Note: this Firebase RTDB policy seems to suffice to protect against basic erasure attacks:

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
    }
  }
}
```
