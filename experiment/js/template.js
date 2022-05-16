var trial_counter = 0;

function slide_set() {

}

function make_slides(f) {
  var   slides = {};

  //set up initial slide
  slides.i0 = slide({
     name : "i0",
     start: function() {
      console.log("check",exp.example_stim);
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.example = slide({
    name: "example",
    start: function() {
      // this.stim = exp.example_stim[0].condition[0].neutral_female[0];

      var t = this;

      // var name = this.name;
      //
      var individual_question = "Minä ... todella hauska.";

      $("#comprehension-question-q-example").text(individual_question).show();

      console.log('question',individual_question)

      this.correct ="olen";
    },

    button : function(response) {
      console.log("choice: ", response);
      console.log("correct: ",this.correct);
      this.response = response == this.correct;
      console.log("correct: ", this.response);
      if (this.response == 1) {
        this.log_responses();
        console.log("choice: ",this.response);
        exp.go();
      }
      else {
        $('#example_err_1').addClass("visibleerr");
      }
    },

    log_responses : function() {
        exp.data_trials.push({
          "trial_id": "example",
          // "form": word.form,
          // "region": word.region,
          "choice": this.response,
          // "condition": this.stim.condition,
          // "lexeme": this.stim.lexeme,
          // "trial_no": trial_counter,
          // "name": this.name
        });
      }
  });

  slides.almost = slide({
    name : "almost",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  })

  // Main trial slide

  slides.trial = slide({
    name: "trial",
    present: exp.stimuli,
    present_handle: function(stim) {
      this.stim = stim;
      console.log('this.stim.condition',this.stim)

      $("#choice-1").show();
      $("#choice-2").show();
      $("#choice-3").show();

      console.log('this.stim.type',this.stim)

      var individual_question = this.stim.sentence;

      $("#comprehension-question-q").text(individual_question).show();

      console.log('question',individual_question);

      //randomize button orders
      var buttons = _.shuffle(this.stim.options);
      var button_1 = buttons.pop();
      var button_2 = buttons.pop();
      var button_3 = buttons.pop();

      document.getElementById("choice-1").value = button_1;
      document.getElementById("choice-2").value = button_2;
      document.getElementById("choice-3").value = button_3;

      if (document.getElementById("choice-1").value == "SKIP") {
        $("#choice-1").hide()
      } else if (document.getElementById("choice-2").value == "SKIP") {
        $("#choice-2").hide()
      } else if (document.getElementById("choice-3").value == "SKIP") {
        $("#choice-3").hide()
      }

      console.log("choice-1: ",document.getElementById("choice-1").value);

    },

    button : function(response) {
      this.response = response;
      this.log_responses();
      _stream.apply(this);
    },

    log_responses : function() {
        exp.data_trials.push({
          "type": this.stim.type,
          "item": this.stim.item,
          "voice": this.stim.voice,
          "polarity": this.stim.polarity,
          "response": this.response,
          "trial_no": trial_counter,
        });
        trial_counter++;
      }
  });

  //neg trial slides

  slides.neg_trial = slide({
    name: "neg_trial",
    present: exp.neg_stimuli,
    present_handle: function(stim) {
      this.stim = stim;
      console.log('this.stim.condition',this.stim)

      $("#choice-1-neg").show();
      $("#choice-2-neg").show();
      $("#choice-3-neg").show();

      console.log('this.stim.type',this.stim)

      var individual_question = this.stim.sentence;

      $("#neg-comprehension-question-q").text(individual_question).show();

      console.log('question',individual_question);

      //randomize button orders
      var buttons = _.shuffle(this.stim.options);
      var button_1 = buttons.pop();
      var button_2 = buttons.pop();
      var button_3 = buttons.pop();

      document.getElementById("choice-1-neg").value = button_1;
      document.getElementById("choice-2-neg").value = button_2;
      document.getElementById("choice-3-neg").value = button_3;

      console.log("choice-1-neg: ",document.getElementById("choice-1-neg").value);

    },

    button : function(response) {
      this.response = response;
      this.log_responses();
      _stream.apply(this);
    },

    log_responses : function() {
        exp.data_trials.push({
          "type": this.stim.type,
          "item": this.stim.item,
          "voice": this.stim.voice,
          "polarity": this.stim.polarity,
          "response": this.response,
          "trial_no": trial_counter,
        });
        trial_counter++;
      }
  });

  //Demographic slides
  
  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        gender : $('#gender').val(),
        // tirednesslvl : $('#tirednesslvl').val(),
        age : $("#age").val(),
        enjoyment : $("#enjoyment").val(),
        education : $("#education").val(),
        party_alignment : $("input[name='number']:checked").val(),
        price : $("#fairprice").val(),
        asses: $('input[name="assess"]:checked').val(),
        comments: $("#comments").val(),
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "system" : exp.system,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {proliferate.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {
  exp.trials = [];
  exp.catch_trials = [];
  var stimuli = all_stims;
  exp.stimuli = _.shuffle(stimuli);//can randomize between subject conditions here
  var neg_stimuli = neg_stims;
  exp.neg_stimuli = _.shuffle(neg_stimuli);
  // var example_stim = example_stims;
  // exp.example_stim = example_stim;
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0",  "instructions", 'example', 'almost', "trial", 'neg_trial', 'subj_info', 'thanks'];

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  
  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  $(".response-buttons, .test-response-buttons").click(function() {
    _s.button($(this).val());
  });

  exp.go(); //show first slide
}
