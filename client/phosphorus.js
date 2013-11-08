/*

Usage:

Phosphorus.token = '1'
Phosphorus.get('score', function (score) {
  // do stuff
  Phosphorus.set('score', 4)

})

document.addEventListener("phosphorus-score",function (e) {
  // score has changed, new value is in e.detail
})



*/




Phosphorus = {}
Phosphorus.baseUrl = 'http://146.185.144.4'
Phosphorus.socket = io.connect(Phosphorus.baseUrl);

// events

Phosphorus.get = function (key, callback) {
  if (!Phosphorus.token) {
    return callback('token not set')
  }
  token_and_key = Phosphorus.token.toString() + ':' + key.toString()
  if (Phosphorus.watched().contains(token_and_key)) {
    return callback(JSON.parse(localStorage[token_and_key]))
  }
  var url = '/get'
  var data = {
    token: Phosphorus.token,
    key: key
  }
  ajax(url, data, function (val) {
    localStorage[token_and_key] = JSON.stringify(val)
    callback(val)
  })
  Phosphorus.subscribe(key)
}

Phosphorus.set = function (key, value) {
  //subscribe on set?
  if (!Phosphorus.token) {
    return console.log('token not set')
  }
  var url = '/set'
  var data = {
    token: Phosphorus.token,
    key: key,
    value: value
  }
  ajax(url, data)
  Phosphorus.subscribe(key)
  return value
}

Phosphorus.fetch = function (key, value, callback) {
  if (!Phosphorus.token) {
    return callback('token not set')
  }
  Phosphorus.get(key, function (val) {
    if (!val) {
      Phosphorus.set(key, value)
      return callback(value)
    }
    else {
      return callback(val)
    }
  })
}

Phosphorus.listen = function (key, fn) {
  document.addEventListener('phosphorus-' + key,function (e) {
    fn.apply(null,[e.detail])
  })
}

Phosphorus.subscribe = function (key) {
  Phosphorus.addToWatched(key)
  token_and_key = Phosphorus.token.toString() + ':' + key.toString()
  if (!Phosphorus.socket.$events || !Phosphorus.socket.$events[token_and_key]) { // check if socket on event is already set
    Phosphorus.socket.on(token_and_key, function (val) {
      console.log('socket emission received!')
      var evt = document.createEvent("Event");
      evt.initEvent("phosphorus-"+key.toString(), true, false);
      evt.detail = val
      document.dispatchEvent(evt)
      localStorage[token_and_key] = JSON.stringify(val)
    })
  }
}

Phosphorus.unsubscribe = function (key, callback) {
  token_and_key = Phosphorus.token.toString() + ':' + key.toString()
  Phosphorus.socket.removeAllListeners(token_and_key)
  if (callback)
    callback()
}

Phosphorus.restart = function () {
  // delete localstorage for each in localStorage['watched']
  if (localStorage['watched']) {
    watched = Phosphorus.watched()
    for(var i = 0; i < watched.length; i++) {
      localStorage.removeItem(watched[i])
    }
    localStorage.removeItem('watched')
  }
  return '' // for onbeforeunload
}

// helper functions

Phosphorus.addToWatched = function (key) {
  watched = Phosphorus.watched()
  token_and_key = Phosphorus.token.toString() + ':' + key.toString()
  watched.push(token_and_key)
  localStorage['watched'] = JSON.stringify(watched)
}



Phosphorus.watched = function () {
  if (!localStorage['watched']) {
    return []
  }
  return JSON.parse(localStorage['watched'])
}

// other helper functions

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

var ajax = function (url, data, callback) {
  $.post(Phosphorus.baseUrl + url, data, function(res) {
    if (callback) {
      callback(res)
    }
  })
}

window.onbeforeunload = Phosphorus.restart()
window.Phosphorus = Phosphorus
window.Fos4us = Phosphorus 