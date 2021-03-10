const cards = [
    "/images/captain-america.jpg",
    "/images/captain-america.jpg",
    "/images/spider-man.jpg",
    "/images/spider-man.jpg",
    "/images/iron-man.jpg",
    "/images/iron-man.jpg",
    "/images/black-widow.jpg",
    "/images/black-widow.jpg",
    "/images/hulk.jpg",
    "/images/hulk.jpg",
    "/images/black-panther.jpg",
    "/images/black-panther.jpg",
    "/images/daredevil.jpg",
    "/images/daredevil.jpg",
    "/images/doctor-strange.jpg",
    "/images/doctor-strange.jpg",
    "/images/punisher.jpg",
    "/images/punisher.jpg"
]

var remainingCards = 18;
var challengeMode = false;
var challengeTime;
var principalTimeOut;
var hideCardsTimeOut;
var timer;

$(function() {
    $('#body__restart-button-container')
    .mouseenter(function() {
        $(this).find("img").attr('src', 'images/reload-icon-red.png');
    })
    .mouseleave(function() {
        $(this).find("img").attr('src', 'images/reload-icon-white.png');
    })
    .click(function() {
        if (challengeMode) {
            _restartGame(challengeTime);
        } else {
            _restartGame();
        }
    })

    $('#body__challenge-mode-button-container')
    .click(function() {
        $(this).hide();
        $('#body__normal-mode-button-container').show();
        $('#body__difficulty-panel').show();
        challengeMode = true;

        $('#body__easy-difficulty-container').removeClass('body__button-disabled');
        $('#body__hard-difficulty-container').removeClass('body__button-disabled');
        $('#body__normal-difficulty-container').addClass('body__button-disabled');
        challengeTime = 90;
        
        _restartGame(challengeTime);
    })

    $('#body__normal-mode-button-container')
    .click(function() {
        $(this).hide();
        $('#body__challenge-mode-button-container').show();
        $('#body__difficulty-panel').hide();
        challengeMode = false;

        _restartGame();
    })

    $('#body__easy-difficulty-container')
    .click(function() {
        $('#body__normal-difficulty-container').removeClass('body__button-disabled');
        $('#body__hard-difficulty-container').removeClass('body__button-disabled');
        $(this).addClass('body__button-disabled');

        challengeTime = 120;
        _restartGame(challengeTime);
    })

    $('#body__normal-difficulty-container')
    .click(function() {
        $('#body__easy-difficulty-container').removeClass('body__button-disabled');
        $('#body__hard-difficulty-container').removeClass('body__button-disabled');
        $(this).addClass('body__button-disabled');

        challengeTime = 90;
        _restartGame(challengeTime);
    })

    $('#body__hard-difficulty-container')
    .click(function() {
        $('#body__easy-difficulty-container').removeClass('body__button-disabled');
        $('#body__normal-difficulty-container').removeClass('body__button-disabled');
        $(this).addClass('body__button-disabled');

        challengeTime = 45;
        _restartGame(challengeTime);
    })

    _restartGame();
});

function _loader() {
    $(".loader").delay(1500).fadeOut(500);
};

function _shuffleCard() {
    var m = cards.length, t, i;
    
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = cards[m];
      cards[m] = cards[i];
      cards[i] = t;
    }
};

function _putCard() {
    var container = $('#body__grid-container');
    
    for (var i = 0; i < cards.length; i++) {
        var scene = $('<div></div>');
        scene.addClass('scene');
        container.append(scene);

        var card = $('<div></div>');
        card.addClass('card');
        scene.append(card);

        var cardfrontface = $('<div></div>');
        cardfrontface.addClass('card__face card__face--front');
        card.append(cardfrontface);

        var cardbackface = $('<div></div>');
        cardbackface.addClass('card__face card__face--back');
        card.append(cardbackface);

        var cardfrontimg = $('<img>');
        cardfrontimg.addClass('card__img');
        cardfrontimg.attr('src', cards[i]);
        cardfrontface.append(cardfrontimg);

        var cardbackimg = $('<img>');
        cardbackimg.addClass('card__img');
        cardbackimg.attr('src', '/images/marvel_back_card.jpg');
        cardbackface.append(cardbackimg);
    };

    $(".card img").css({"-webkit-user-drag" : "none"});
};

function _hideCard() {
    $(".card").fadeTo(0, 0);
    $(".card").fadeTo(2000, 1);

    hideCardsTimeOut = setTimeout(() => {
        $(".card").each(function(index) {
            setTimeout(() => {
                $(this).toggleClass("flip", true);
            }, 100 * index);
        });
    }, 2000);
};

function _selectCard(card) {
    _flipCard = function(card, wait) {
        if (!wait) {
            $(card).toggleClass("flip select");
        } else {
            setTimeout(() => {
                $(".select").toggleClass("flip select");
            }, 1000);
        }
    };
    
    _shakeCard = function(card) {
        $(card).toggleClass("shake", true);
        setTimeout(() => {
            $(card).toggleClass("shake", false);
        }, 1000);
    };
    
    _zoomCard = function(card) {
        if ($(card).hasClass("correct")) {
            var same_img = $(card).find("img").attr("src");
    
            $("img[src='" + same_img + "']").closest(".correct").toggleClass("zoom", true);
    
            setTimeout(() => {
                $("img[src='" + same_img + "']").closest(".correct").toggleClass("zoom", false);
            }, 1000);
        } else {
            $(".select").toggleClass("zoom", true);

            var score = $("#score").text();
            var newscore = parseInt(score) + 1;
            $("#score").text(newscore);
    
            setTimeout(() => {
                $(".select").toggleClass("correct", true);
                $(".select").toggleClass("zoom select", false)
            }, 1000);
        }
    };

    var numSelectedCards = $(".select").length

    if (numSelectedCards == 0) {
        if ($(card).hasClass("correct")) {
            _zoomCard(card);
        } else {
            _flipCard(card, 0);
        }
    }

    if (numSelectedCards == 1) {
        if ($(card).hasClass("correct")) {
            _zoomCard(card);
        } else if ($(card).hasClass("select")) {
            _shakeCard(card);
        } else {
            _flipCard(card, 0);

            if ($(".select img").eq(0).attr("src") == $(".select img").eq(2).attr("src")) {
                _zoomCard(card);
                remainingCards = remainingCards - 2;

                if (remainingCards <= 0) {
                    _finishGame();
                }
            } else {
                _flipCard(card, 1);
            }
        }
    }
};

function _changeMode(time) {
    _restartGame(time);
}

function _restartGame(time) {
    remainingCards = 18;

    if (principalTimeOut) clearTimeout(principalTimeOut);
    if (hideCardsTimeOut) clearTimeout(hideCardsTimeOut);
    if (timer) clearInterval(timer);

    $('#body__grid-container').empty();
    $('#body__thanos-message').hide();
    $('#body__avengers-message').hide();

    if (time === 90) {
        $('#minutes').text('01');
        $('#seconds').text('30')
    } else if (time === 120) {
        $('#minutes').text('02');
        $('#seconds').text('00')
    } else if (time === 45) {
        $('#minutes').text('00');
        $('#seconds').text('45')
    } else {
        $('#minutes').text('00');
        $('#seconds').text('00');
    }

    $('#score').text('0');

    _loader();
    _shuffleCard();
    _putCard();
    _hideCard();

    principalTimeOut = setTimeout(() => {
        if (time) {
            _setTimer(time);
        } else {
            _setTimer();
        }
        
        $(".card").click(function() {
            var context = this;

            _selectCard(context);
        });
    }, 4200);
};

function _finishGame() {
    clearInterval(timer);

    if (remainingCards > 0) {
        $('#body__thanos-message').fadeIn();
    } else {
        $('#body__avengers-message').fadeIn();
    }
};

function _setTimer(time) {
    var minutesLabel = $("#minutes");
    var secondsLabel = $("#seconds");

    if (time) {
        var totalSeconds = time;
        timer = setInterval(setTimeBackward, 1000);
    } else {
        var totalSeconds = 0;
        timer = setInterval(setTimeForward, 1000);
    }

    function setTimeForward() {
        ++totalSeconds;
        secondsLabel.text(pad(totalSeconds % 60));
        minutesLabel.text(pad(parseInt(totalSeconds / 60)));
    }

    function setTimeBackward() {
        --totalSeconds;
        secondsLabel.text(pad(totalSeconds % 60));
        minutesLabel.text(pad(parseInt(totalSeconds / 60)));

        if (totalSeconds === 0) _finishGame();
    }

    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }
}