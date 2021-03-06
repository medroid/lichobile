'use strict';

var utils = require('./utils');
var $ = require('./utils').$;
var Handlebars = require('handlebars');
var Zepto = require('./vendor/zepto');
var Iscroll = require('iscroll');
var getModal = require('./modals').getModal;

var form = $('#chat > .talk-form'),
input = $('#chat .talk-input'),
messagesWrapper = $('#chat-messages'),
scrollerWrapper = $('#chat-scroller');

Zepto(scrollerWrapper).height(Zepto('#chat').height() - 48);

var scroller = new Iscroll(scrollerWrapper, { scrollbars: false });

// msg is escaped server side
var source = '<p class="chat-message"><span class="chat-user">{{ user }}</span>{{{ msg }}}</p>';
var msgTemplate = Handlebars.compile(source);

window.addEventListener('touchend', function (event) {
  var modal = getModal(event);
  if (modal) {
    if (modal.id === 'chatModal' && modal.classList.contains('active')) {
      utils.hideKeyboard();
      $('#chat-icon').classList.remove('active');
    }
    event.preventDefault();
  }
});

function Chat(socket) {
  messagesWrapper.innerHTML = '';

  form.addEventListener('submit', function () {
    var msg = input.value.trim();
    if (!msg) return false;
    if (msg.length > 140) {
      return false;
    }
    input.value = '';
    socket.send('talk', msg);
    return false;
  });

  function append(msg) {
    var rendered = Zepto(msgTemplate({ user: msg.u || msg.c, msg: msg.t }));
    Zepto(messagesWrapper).append(rendered);
    setTimeout(function () { scroller.refresh(); }, 0);
    $('#chat-icon').classList.add('active');
  }

  return {
    append: append
  };
}

module.exports = Chat;
