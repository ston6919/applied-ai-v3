# Diagnostic Commands for Tools Query

Run these commands in order to diagnose why no tools are being returned.

## Step 1: Check if ANY tools exist (no filters)
```javascript
fetch('https://naamzefofwzarathmqzo.supabase.co/rest/v1/tool?select=*&limit=5', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY'
  }
})
.then(r => {
  console.log('Response status:', r.status);
  console.log('Response headers:', Object.fromEntries(r.headers.entries()));
  return r.json();
})
.then(data => {
  console.log('✅ ALL TOOLS (no filter):', data.length);
  if (data.length > 0) {
    console.log('First tool:', data[0]);
    console.log('show_on_site values:', data.map(t => ({ id: t.id, name: t.name, show_on_site: t.show_on_site })));
  } else {
    console.log('⚠️ No tools found at all - table might be empty or RLS is blocking');
  }
})
.catch(err => console.error('❌ Error:', err));
```

## Step 2: Check show_on_site values specifically
```javascript
fetch('https://naamzefofwzarathmqzo.supabase.co/rest/v1/tool?select=id,name,show_on_site&limit=20', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY'
  }
})
.then(r => r.json())
.then(data => {
  console.log('Total tools:', data.length);
  const trueCount = data.filter(t => t.show_on_site === true).length;
  const falseCount = data.filter(t => t.show_on_site === false).length;
  const nullCount = data.filter(t => t.show_on_site === null || t.show_on_site === undefined).length;
  console.log('show_on_site=true:', trueCount);
  console.log('show_on_site=false:', falseCount);
  console.log('show_on_site=null/undefined:', nullCount);
  console.log('All values:', data.map(t => ({ id: t.id, name: t.name, show_on_site: t.show_on_site })));
})
.catch(err => console.error('❌ Error:', err));
```

## Step 3: Test with show_on_site=true filter
```javascript
fetch('https://naamzefofwzarathmqzo.supabase.co/rest/v1/tool?select=*&show_on_site=eq.true&limit=10', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY'
  }
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(data => {
  console.log('✅ Tools with show_on_site=true:', data.length);
  console.log('Tools:', data);
})
.catch(err => console.error('❌ Error:', err));
```

## Step 4: Test with show_on_site=false filter (to see if filter works)
```javascript
fetch('https://naamzefofwzarathmqzo.supabase.co/rest/v1/tool?select=id,name,show_on_site&show_on_site=eq.false&limit=10', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY'
  }
})
.then(r => r.json())
.then(data => {
  console.log('Tools with show_on_site=false:', data.length);
  console.log('Tools:', data);
})
.catch(err => console.error('❌ Error:', err));
```

## Step 5: Check for RLS (Row Level Security) issues
```javascript
// Try accessing with different headers to see if RLS is blocking
fetch('https://naamzefofwzarathmqzo.supabase.co/rest/v1/tool?select=count', {
  method: 'HEAD',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY',
    'Prefer': 'count=exact'
  }
})
.then(r => {
  console.log('Response status:', r.status);
  console.log('Content-Range header:', r.headers.get('content-range'));
  if (r.status === 200 || r.status === 206) {
    const range = r.headers.get('content-range');
    if (range) {
      const total = range.split('/')[1];
      console.log('✅ Total tools in table:', total);
    }
  } else {
    console.log('⚠️ Status:', r.status, '- Might indicate RLS or permission issue');
  }
})
.catch(err => console.error('❌ Error:', err));
```

## Step 6: Check table schema (if accessible)
```javascript
// This might not work due to RLS, but worth trying
fetch('https://naamzefofwzarathmqzo.supabase.co/rest/v1/tool?select=*&limit=1', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY'
  }
})
.then(r => r.json())
.then(data => {
  if (data && data.length > 0) {
    console.log('✅ Table schema (columns):', Object.keys(data[0]));
    console.log('Sample row:', data[0]);
  } else {
    console.log('⚠️ No data returned - check RLS policies');
  }
})
.catch(err => {
  console.error('❌ Error:', err);
  if (err.message) console.error('Error message:', err.message);
});
```
