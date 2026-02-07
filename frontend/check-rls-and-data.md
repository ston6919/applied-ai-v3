# Check RLS and Table Data

## Test 1: Check if table exists and get schema
```javascript
// Try to get just the column names/schema
fetch('https://naamzefofwzarathmqzo.supabase.co/rest/v1/tool?select=*&limit=0', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY',
    'Prefer': 'return=representation'
  }
})
.then(r => {
  console.log('Status:', r.status);
  console.log('Headers:', Object.fromEntries(r.headers.entries()));
  return r.json();
})
.then(data => {
  console.log('Response:', data);
})
.catch(err => console.error('Error:', err));
```

## Test 2: Try with service role key (bypasses RLS) - if you have it
```javascript
// This would need the service role key from your backend/.env
// Only use this if you want to test if RLS is the issue
// DON'T expose this key publicly!
```

## Test 3: Check what tables are accessible
```javascript
fetch('https://naamzefofwzarathmqzo.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY'
  }
})
.then(r => r.text())
.then(text => console.log('Root response:', text))
.catch(err => console.error('Error:', err));
```
