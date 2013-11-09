Phosphorus = {};
Phosphorus.baseUrl = 'http://127.0.0.1';
Phosphorus.socket = io.connect(Phosphorus.baseUrl);

// events

Phosphorus.get = function (key, callback) {
  if (Phosphorus.watched().contains(key.toString())) {
    return callback(JSON.parse(localStorage[key.toString()]));
  }
  var url = '/get';
  var data = {key: key};
  ajax(url, data, function (val) {
    localStorage[key.toString()] = JSON.stringify(val);
    callback(val);
  });
  Phosphorus.subscribe(key);
}

Phosphorus.set = function (key, value) {
  var url = '/set';
  var data = {
    key: key,
    value: value
  };
  ajax(url, data);
  Phosphorus.subscribe(key);
  return value;
}

Phosphorus.fetch = function (key, value, callback) {
  Phosphorus.get(key, function (val) {
    if (!val) {
      Phosphorus.set(key, value);
      return callback(value);
    }
    else {
      return callback(val);
    }
  });
}

Phosphorus.listen = function (key, fn) {
  document.addEventListener('phosphorus-' + key,function (e) {
    fn.apply(null,[e.detail]);
  });
}

Phosphorus.subscribe = function (key) {
  Phosphorus.addToWatched(key);
  if (!Phosphorus.socket.$events || !Phosphorus.socket.$events[key.toString()]) { // check if socket on event is already set
    Phosphorus.socket.on(key.toString(), function (val) {
      var evt = document.createEvent("Event");
      evt.initEvent("phosphorus-"+key.toString(), true, false);
      evt.detail = val;
      document.dispatchEvent(evt);
      localStorage[key.toString()] = JSON.stringify(val);
    });
  }
}

Phosphorus.unsubscribe = function (key, callback) {
  Phosphorus.socket.removeAllListeners(key.toString());
  if (callback) {
    callback();
  }
}

Phosphorus.restart = function () {
  // delete localstorage for each in localStorage['watched']
  if (localStorage['watched']) {
    watched = Phosphorus.watched();
    for(var i = 0; i < watched.length; i++) {
      localStorage.removeItem(watched[i]);
    }
    localStorage.removeItem('watched');
  }
  return ''; // for onbeforeunload
}

// helper functions

Phosphorus.addToWatched = function (key) {
  watched = Phosphorus.watched();
  watched.push(key.toString());
  localStorage['watched'] = JSON.stringify(watched);
}

Phosphorus.watched = function () {
  if (!localStorage['watched']) {
    return [];
  }
  return JSON.parse(localStorage['watched']);
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
      callback(res);
    }
  });
}

window.onbeforeunload = Phosphorus.restart();
window.Phosphorus = Phosphorus;
