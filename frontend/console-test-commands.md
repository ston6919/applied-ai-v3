# Console Test Commands for Supabase Tools

Copy and paste these commands into your browser console (F12 → Console tab) to test the Supabase connection and query tools.

## Method 1: Using Fetch API (Works in any browser console)

### Test 1: Get all tools (no filter)
```javascript
fetch('https://naamzefofwzarathmqzo.supabase.co/rest/v1/tool?select=*&limit=10', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY'
  }
})
.then(r => r.json())
.then(data => {
  console.log('✅ All tools:', data.length);
  console.log('Tools:', data);
  if (data.length > 0) {
    console.log('Sample tool:', data[0]);
    console.log('show_on_site values:', data.map(t => ({ id: t.id, name: t.name, show_on_site: t.show_on_site })));
  }
})
.catch(err => console.error('❌ Error:', err));
```

### Test 2: Get tools with show_on_site=true
```javascript
fetch('https://naamzefofwzarathmqzo.supabase.co/rest/v1/tool?select=*&show_on_site=eq.true&limit=10', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY'
  }
})
.then(r => r.json())
.then(data => {
  console.log('✅ Tools with show_on_site=true:', data.length);
  console.log('Tools:', data);
})
.catch(err => console.error('❌ Error:', err));
```

### Test 3: Count tools
```javascript
fetch('https://naamzefofwzarathmqzo.supabase.co/rest/v1/tool?select=*&limit=1', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY',
    'Prefer': 'count=exact'
  }
})
.then(r => {
  const count = r.headers.get('content-range')?.split('/')[1] || 'unknown';
  console.log('✅ Total tools in database:', count);
  return r.json();
})
.then(data => console.log('Sample tool:', data[0] || 'No tools found'))
.catch(err => console.error('❌ Error:', err));
```

## Method 2: Using Supabase JS Client (If available on page)

### Quick Test - Check if Supabase is loaded
```javascript
// Check if window has Supabase or if we can access it from modules
console.log('Checking for Supabase...');
console.log('window.__NEXT_DATA__:', window.__NEXT_DATA__);
```

### Load Supabase Client and Test
```javascript
(async () => {
  try {
    // Try to load Supabase from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    document.head.appendChild(script);
    
    await new Promise((resolve) => {
      script.onload = resolve;
      setTimeout(resolve, 2000); // Fallback timeout
    });
    
    const supabaseUrl = 'https://naamzefofwzarathmqzo.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYW16ZWZvZnd6YXJhdGhtcXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDEyNjUsImV4cCI6MjA4NTExNzI2NX0.Ghs2jYulLh24mqVzK7aoplnmHeDmhqKomgChIJg1ZBY';
    
    const { createClient } = window.supabase || {};
    if (!createClient) {
      console.error('❌ Supabase not loaded');
      return;
    }
    
    const db = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created');
    
    // Test query
    const { data, error } = await db.from('tool').select('*').eq('show_on_site', true).limit(10);
    
    if (error) {
      console.error('❌ Query error:', error);
    } else {
      console.log('✅ Tools found:', data?.length || 0);
      console.log('Tools:', data);
    }
  } catch (err) {
    console.error('❌ Error:', err);
  }
})();
```

## Method 3: Check Environment Variables (On the page)

```javascript
// Check what environment variables are available
console.log('Environment check:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env?.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
```

## RECOMMENDED: Start with Test 1 (Fetch API)
Copy and paste Test 1 first - it's the simplest and will tell you immediately if:
- The table exists
- You have data
- There are permission issues
- The show_on_site values are correct
