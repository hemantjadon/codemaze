function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == name + '=') {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var QuestionBox = React.createClass({
    displayName: 'QuestionBox',

    getInitialState: function () {
        return { question: {} };
    },

    fetchQuestion: function () {
        var ajaxUrl = window.location.origin + this.props.url;
        console.log(ajaxUrl);
        $.ajax({
            url: ajaxUrl,
            dataType: 'json',
            cache: false,
            success: function (question) {
                this.setState({ question: question });
                Prism.highlightAll();
                Materialize.updateTextFields();
            }.bind(this),

            error: function (xhr, status, err) {
                console.log(xhr);
            }.bind(this)
        });
    },

    answer: function () {
        var submitForm = function (form) {
            var posturl = window.location.origin + form.attr('action');
            var qid = form.children('input[type=hidden].id').val();
            var ans = form.children('.input-field').children('input[type=text]#answer').val();
            var csrf_token = form.children('input[type=hidden].csrf').val();

            $.post({
                url: posturl,
                data: { "id": qid, "ans": ans },
                headers: { 'X-CSRF-Token': csrf_token },
                dataType: 'json',
                success: function (response) {
                    if (response.status === 'success') {
                        QuestionBox.fetchQuestion();
                    } else if (response.status === 'fail') {
                        var input = $('#content .card .card-action .input-field input#answer');
                        var label = $('#content .card .card-action .input-field label[for=answer]');
                        input.addClass('invalid');
                        input.removeClass('valid');
                    }
                },

                error: function (xhr, status, err) {
                    console.log(xhr);
                }.bind(this)
            });
        };
        var init = function () {
            $('#content button.submit-button').click(function (event) {
                event.preventDefault();
                var form = $(this).parent();
                submitForm(form);
            });
        };
        init();
    },

    componentDidMount: function () {
        this.fetchQuestion();
        this.answer();
    },

    render: function () {
        return React.createElement(Question, { question: this.state.question });
    }
});

var Question = React.createClass({
    displayName: 'Question',

    render: function () {
        var question = this.props.question;
        var rawMarkup = function () {
            if (question.content !== undefined) {
                var rawMarkup = marked(question.content);
                return { __html: rawMarkup };
            }
        };
        return React.createElement(
            'div',
            { className: 'outerBox' },
            React.createElement(
                'div',
                { className: 'card grey lighten-5' },
                React.createElement(
                    'div',
                    { className: 'card-content' },
                    React.createElement(
                        'span',
                        { className: 'card-title' },
                        React.createElement(
                            'h4',
                            null,
                            this.props.question.title
                        )
                    ),
                    React.createElement('div', { dangerouslySetInnerHTML: rawMarkup(), className: 'markedBox' })
                ),
                React.createElement(
                    'div',
                    { className: 'card-action' },
                    React.createElement(Answer, { qid: this.props.question.id })
                )
            )
        );
    }
});

var Answer = React.createClass({
    displayName: 'Answer',

    render: function () {
        var csrftoken = getCookie('csrftoken');
        return React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'form',
                { method: 'post', action: '/questions/submit/' },
                React.createElement('input', { type: 'hidden', className: 'id', value: this.props.qid }),
                React.createElement('input', { type: 'hidden', className: 'csrf', value: csrftoken }),
                React.createElement(
                    'div',
                    { className: 'input-field' },
                    React.createElement('input', { id: 'answer', type: 'text', className: 'validate' }),
                    React.createElement(
                        'label',
                        { 'data-success': 'right', 'data-error': 'Oops, this is not correct !!', htmlFor: 'answer' },
                        'Answer'
                    )
                ),
                React.createElement(
                    'button',
                    { className: 'submit-button btn-floating btn-large waves-effect waves-light', type: 'submit' },
                    React.createElement('i', { className: 'fa fa-chevron-right' })
                )
            )
        );
    }
});

ReactDOM.render(React.createElement(QuestionBox, { url: '/questions/get/' }), document.getElementById('content'));

marked.setOptions({
    langPrefix: "language-",
    gfm: true,
    breaks: true,
    sanitize: true
});