Phosphorus
========

Phosphorus is a key store system based on redis that has a lot more under the hood. It's lightning fast because it intelligently caches everything in localStorage and only actually hits our server once per session. The first request takes around 100ms, and  everyone after that takes a millisecond *even if the data changes on the server*. I'll say that again - **Less than a millisecond even if the data changes on the server**

It'll also allow you to listen out for when the data changes.

Use Cases
---------

Phosphorus is ideal in any scenerio where you have simple non sensitive that needs to be shared over different computers, but where you still need a central store. A simple example would be the following:

Say you wanted to implement real time updating of the number of views a video gets on youtube. Suppose we've a function called `updateViewCount()` which takes a number and updates the view count on the screen to that. Let's use `http://www.youtube.com/watch?v=D-0DUPowEw0` as a sample video. Let's use that identifier `D-0DUPowEw0` as a unique identifier. Using Phosphorus, it'd be as simple as this:

    key = 'D-0DUPowEw0'
    Phosphorus.get(key, function (count) {
        Phosphorus.set(key, count++)
        updateViewCount(count)
    })
    
    Phosphorus.listen(key, function (count) {
        updateViewCount(count)
    })
    
Done! Now when you watch a video, everyone's view count will go up by one, and when someone else starts watching, your's will go up with everyone elses. All in 8 lines.

Now say there was somewhere else on the page where you needed the count. All you've to do is go 

    Phosphorus.get(v, function (count) {
        // do stuff
    })
    
This will be instantious because it'll come from localstorage, but don't worry, as the value changes, localstorage will update, so you'll have the latest value always. Again, use Phosphorus.listen to react to changes.
    
    
    


Installation
-------

Phosphorus relies on socket.io and zepto/jquery, phosphorus.js and phosphorus.min.js can be found in /client.

     <script src="http://cdnjs.cloudflare.com/ajax/libs/zepto/1.0/zepto.min.js"></script>
     <script src="http://cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.6/socket.io.min.js"></script>
     <script src="phosphorus.min.js"></script>


Then simply set a token:

    <script>
        Phosphorus.token = '1'
    </script>
    
Try to make sure your token is unique, it can be alphanumeric and can have underscores in it. If it's not unique then you risk writing over someone else's data, or vice versa. See todo.

Features / Usage
----------------

### Phosphorus.get
    
    Phosphorus.get(key, function (value) {
        console.log(value)
    })
    
We're now listening out for any changes. That can be changed with `Phosphorus.unsubscribe(key)`

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


----------------------


**Sidenote -** if you don't want to type out `Phosphorus` the whole time, you can use `Fos4us` to save time, just don't mix the two!

License
-------
Released under the MIT License, fork away, pull requests are more than welcome.

TO-DO
-----

1. Angular/Ember integration
2. Auth. Phosphorus is completely insecure.
3. Token generation/checking system
4. Upgrade servers, seperate redis instance. Right now, phosphorus runs off a tiny $5 a month instance, improving this should speed it up massively.
