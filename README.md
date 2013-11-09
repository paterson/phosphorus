Phosphorus
========

Phosphorus is a client side key-value store that uses redis to sync data with every other client. This allows it to be used to sync real time data across clients and have a semi-permanent data store backing it up.

Use Cases
---------

Phosphorus is ideal in any scenerio where you have simple non sensitive that needs to be shared over different clients, but where you still need a central store. A simple example would be the following:

Say you wanted to implement real time updating of the number of views a video gets on Youtube. Suppose we've a function called `updateViewCount()` which takes a number and updates the view count on the screen to that. Let's use `http://www.youtube.com/watch?v=D-0DUPowEw0` as a sample video. Let's use that identifier `D-0DUPowEw0` as a unique identifier. Using Phosphorus, it'd be as simple as this:

    var key = 'D-0DUPowEw0:viewCount' //can be anything
    Phosphorus.get(key, function (count) {
        Phosphorus.set(key, count++)
        updateViewCount(count)
    })
    
    Phosphorus.listen(key, function (count) {
        updateViewCount(count)
    })
    
Done! Now when you watch a video, everyone's view count will go up by one, and when someone else starts watching, your's will go up with everyone elses. All in 8 lines.

Now say there was somewhere else on the page where you needed the count. All you've to do is go 

    Phosphorus.get(key, function (count) {
        // do stuff
    })
    
This will be instantious because it'll come from localstorage, but don't worry, as the value changes, localstorage will update, so you'll have the latest value always. Again, use Phosphorus.listen to react to changes.

Installation
-------

Phosphorus relies on socket.io and zepto/jquery. phosphorus.js and phosphorus.min.js can be found in /client.

     <script src="http://cdnjs.cloudflare.com/ajax/libs/zepto/1.0/zepto.min.js"></script>
     <script src="http://cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.6/socket.io.min.js"></script>
     <script src="/src/phosphorus.min.js"></script>

Features / Usage
----------------

### Phosphorus.get
    
    Phosphorus.get(key, function (value) {
        console.log(value)
    })
    

### Phosphorus.set
    
    Phosphorus.set(key,value);
    
value can be a string, number, object, array etc.
    

### Phosphorus.fetch

Fetch will return the value if it exists, and sets it if it doesn't.

    Phosphorus.fetch('apollo',{test:'test'}, function (value) { 
        console.log(value)
    })


### Phosphorus.restart

Clear's local caching, automatically run when page closes, but can be used at any time.

    Phosphorus.restart()

### Phosphorus.listen

    Phosphorus.listen(key, function (val) {
        // new value is now in val
        // do stuff
    })
    
### Phosphorus.unsubscribe
    
    Phosphorus.unsubscribe(key)
    
Stop automatically listening changing the value of a key. This can also take an optional callback as the second argument.


License
-------
Released under the MIT License, fork away, pull requests are more than welcome.
