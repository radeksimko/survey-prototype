var db = new Dexie("survey");
db.version(1).stores({
  results: 'code,answers'
});

var json = {
    pages: [
        {
            questions: [
                {
                    type: "text",
                    name: "code",
                    title: "Client code and service? (To be completed by the assessor/trainer)",
                    isRequired: true
                },
                {
                    type: "rating",
                    name: "organized",
                    title: "The assessment/training was well organized",
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    minRateDescription: "strongly disagree",
                    maxRateDescription: "strongly agree",
                    isRequired: true
                },
                {
                    type: "rating",
                    name: "professional",
                    title: "The assessor/trainer was professional",
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    minRateDescription: "strongly disagree",
                    maxRateDescription: "strongly agree",
                    isRequired: true
                },
                {
                    type: "rating",
                    name: "supportive",
                    title: "The assessor/trainer was supportive",
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    minRateDescription: "strongly disagree",
                    maxRateDescription: "strongly agree",
                    isRequired: true
                },
                {
                    type: "boolean",
                    name: "would_recommend",
                    title: "Please answer the question",
                    label: "Would you recommend Lexxic services to others?",
                    isRequired: true
                },
                {
                    type: "comment",
                    name: "comments",
                    title: "Additional Comments?"
                },
                {
                    type: "html",
                    name: "disclaimer",
                    html: "For detailed information relating to how Lexxic protects and respects your privacy,"+
                        " please refer to our Privacy Policy held on our website www.lexxic.com"
                }
            ]
        }
    ]
};

if ( $("#feedback-results").length ) {
    $('.alerts').text('')
    var table = $("table#results tbody")
    refreshResultsInTable(table)
}

if ( $("#surveyElement").length ) {
    setupSurvey()
}

function setupSurvey() {
    Survey
        .StylesManager
        .applyTheme("bootstrap");
    Survey.defaultBootstrapCss.navigationButton = "btn btn-primary btn-lg";

    window.survey = new Survey.Model(json);

    survey
        .onComplete
        .add(function (result) {
            document.querySelector('#surveyResult')

            var code = result.data.code
            delete result.data.code

            db.results.put({"code": code, "answers": result.data}).then (function(){
                 console.log("Response stored.")
              }).catch(function(error) {
                 alert("Ooops: " + error);
              });
        });

    $("#surveyElement").Survey({model: survey});
}

function refreshResultsInTable(table) {
    table.html("")
    db.results.reverse().each(result => {
    var textAnswers = ""
    for (var key in result.answers) {
        if (key == "code") {
            continue
        }
        textAnswers += key + ": " + result.answers[key] + "<br>"
    }

    table.append("<tr><td><strong>"+result.code+"</strong></td>"+
        "<td>"+textAnswers+"</td>"+
        '<td><button onclick="deleteAnswer(\''+result.code+'\')" type="button" class="btn btn-default delete" aria-label="Delete">'+
          '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>'+
          '</button></td>'+
        "</tr>")
    })
}

function deleteAnswer(code) {
    db.results.where("code").equals(code).delete().then(function(){
        var table = $('table#results tbody')
        refreshResultsInTable(table)

        var msg = code + " was deleted"
        $('.alerts').html('<div class="alert alert-info alert-dismissible" role="alert">'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
            msg+'</div>')
    })
}
