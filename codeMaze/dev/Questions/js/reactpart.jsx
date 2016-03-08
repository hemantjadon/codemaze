function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var QuestionBox = React.createClass({
    getInitialState: function(){
        return {question:{}};
    },
    
    fetchQuestion: function(){
        var ajaxUrl = window.location.origin+this.props.url;
        $.ajax({
            url: ajaxUrl,
            dataType: 'json',
            cache: false,
            success: function(question){
                this.setState({question:question});   
                Prism.highlightAll();
                Materialize.updateTextFields();
            }.bind(this),
            
            error: function(xhr, status, err) {
                console.log(xhr);
            }.bind(this),
        });
    },
    
    answer : function(){
        var submitForm =  function (form) { 
            var posturl = window.location.origin + form.attr('action');
            var qid = form.children('input[type=hidden].id').val();
            var ans = form.children('.input-field').children('input[type=text]#answer').val();
            var csrf_token = form.children('input[type=hidden].csrf').val();
           
            $.post({
                url: posturl,
                data: {"id":qid, "ans": ans},
                headers: { 'X-CSRF-Token': csrf_token },
                dataType: 'json',
                success: function (response) { 
                    console.log(response);
                    if(response.status === 'success'){
                        window.location.reload();
                    }
                    else if (response.status === 'fail'){
                        var input = $('#content .card .card-action .input-field input#answer');
                        var label = $('#content .card .card-action .input-field label[for=answer]');
                        input.addClass('invalid');
                        input.removeClass('valid');
                    }
                },
                
                error: function(xhr, status, err) {
                    console.log(xhr);
                }.bind(this),
            });
        }
        var init =  function () { 
            $('#content button.submit-button').click(function (event) { 
                event.preventDefault();
                var form = $(this).parent();
                submitForm(form);
            });
        }
        init();
    },
    
    componentDidMount: function(){
        this.fetchQuestion();
        this.answer();
    },
    
    render: function(){
        return (
            <Question question = {this.state.question}/>
        );
    },
});

var Question = React.createClass({
    render: function(){
        var question = this.props.question;
        var rawMarkup = function(){
            if(question.content !== undefined){
                var rawMarkup = marked(question.content)
                return { __html: rawMarkup };
            }
        }
        filepath = question.filepath
        if (filepath === undefined || filepath===null || filepath === ''){
            return (
                <div className="outerBox">
                    <div className="card grey lighten-5">
                        <div className="card-content">
                            <span className="card-title">
                                <h4>{this.props.question.title}</h4>
                            </span>
                            <div dangerouslySetInnerHTML={rawMarkup()} className="markedBox">
                            </div>
                        </div>
                        <div className="card-action">
                            <Answer qid={this.props.question.id}/>
                        </div>
                    </div>
                </div>
            );
        }
        else{
            return (
                <div className="outerBox">
                    <div className="card grey lighten-5">
                        <div className="card-content">
                            <span className="card-title">
                                <h4>{this.props.question.title}</h4><a download href={filepath}><i className="fa fa-download"></i></a>
                            </span>
                            <div dangerouslySetInnerHTML={rawMarkup()} className="markedBox">
                            </div>
                        </div>
                        <div className="card-action">
                            <Answer qid={this.props.question.id}/>
                        </div>
                    </div>
                </div>
            );
        }
    }, 
});

var Answer = React.createClass({
    render: function(){
        var csrftoken = getCookie('csrftoken');
        return(
            <div className="row">
                <form method="post" action="/questions/submit/">
                    <input type="hidden" className="id" value={this.props.qid}/>
                    <input type="hidden" className="csrf" value={csrftoken}/>
                    <div className="input-field">
                            <input id="answer" type="text" className="validate" />
                            <label data-error="Oops, this is not correct !!" htmlFor="answer">Answer</label>
                    </div>
                    <button className="submit-button btn-floating btn-large waves-effect waves-light" type="submit">
                        <i className="fa fa-chevron-right"></i>
                    </button>
               </form>
            </div>
        );
    },    
});

ReactDOM.render(<QuestionBox url="/questions/get/"/>,document.getElementById('content'));


var LeaderBoard = React.createClass({
    getInitialState: function(){
        return {list:[]};
    },
    
    fetchLeaders: function(){
        var ajaxUrl = window.location.origin+this.props.url;
        $.ajax({
            url: ajaxUrl,
            dataType: 'json',
            cache: false,
            success: function(list){
                this.setState({list:list});
            }.bind(this),
            
            error: function(xhr, status, err) {
                console.log(xhr);
            }.bind(this),
        });
    },
    
    componentDidMount: function(){
        this.fetchLeaders();
        setInterval(this.fetchLeaders,120000);
    },
    
    render: function(){
        var list = this.state.list['list'];
        if(list !== undefined){
            return (
                <div className="outerBox">
                    <div className="card grey lighten-5">
                        <div className="card-content">
                            <span className="card-title">
                                <h4>Leader Board</h4>
                            </span>
                        </div>
                        <div className="card-action">
                            <ul className="collection">
                            {list.map(function(name, index){
                                return <li className="collection-item" key={ index }>{index+1}.&nbsp;&nbsp;{name}</li>;
                            })}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }
        else{
            return(<div></div>);
        }
    },
});

ReactDOM.render(<LeaderBoard url="/questions/leaderboard/"/>,document.getElementById('leaderboard'));

var Stats = React.createClass({
    getInitialState: function(){
        return {stats:{}};
    },
    
    fetchStats: function(){
        var ajaxUrl = window.location.origin+this.props.url;
        $.ajax({
            url: ajaxUrl,
            dataType: 'json',
            cache: false,
            success: function(stats){
                this.setState({stats:stats});
                console.log(stats)
            }.bind(this),
            
            error: function(xhr, status, err) {
                console.log(xhr);
            }.bind(this),
        });
    },
    
    componentDidMount: function(){
        this.fetchStats();
    },
    
    render: function(){
        stats = this.state.stats;
        return (
              <div className="outerBox">
                <div className="card grey lighten-5">
                    <div className="card-content">
                        <span className="card-title">
                            <h4>Statistics</h4>
                        </span>
                    </div>
                    <div className="card-action">
                        <ul className="collection">
                            <li className="collection-item attempts">Attempts <span className="right">{stats.attempts}</span></li>
                            <li className="collection-item success">Success <span className="right">{stats.success}</span></li>
                            <li className="collection-item fail">Failure <span className="right">{stats.fail}</span></li>
                            <li className="collection-item accuracy">Accuracy <span className="right">{stats.accuracy}</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    },
});

ReactDOM.render(<Stats url="/questions/stats/"/>,document.getElementById('stats'));

marked.setOptions({
  langPrefix: "language-",
  gfm: true,
  breaks: true,
  sanitize: true,
});